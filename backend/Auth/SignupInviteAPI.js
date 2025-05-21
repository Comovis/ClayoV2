/**
 * Combined API endpoint and service for handling invitation signups
 */
const { supabaseAdmin } = require("../SupabaseClient")
const { sendUserConfirmationEmail } = require("../Emails/EmailAuthLinkService")

/**
 * Creates or updates a user account for an invitation
 * @param {Object} userData - User data
 * @param {string} userData.email - User's email
 * @param {string} userData.password - User's password
 * @param {string} userData.fullName - User's full name
 * @param {string} userData.companyId - Company ID
 * @param {string} userData.role - User's role
 * @param {string} userData.invitationToken - Invitation token
 * @returns {Promise<Object>} Created or updated user
 */
async function createUserForInvitation({ email, password, fullName, companyId, role, invitationToken }) {
  try {
    console.log(`Processing invitation signup for: ${email}, company: ${companyId}, role: ${role}`)

    // First, validate the invitation token and ensure it matches the email
    const { data: invitation, error: invitationError } = await supabaseAdmin
      .from("team_invitations")
      .select("id, email, role, company_id")
      .eq("invitation_token", invitationToken)
      .eq("invitation_status", "pending")
      .single()

    if (invitationError || !invitation) {
      console.error("Error validating invitation:", invitationError)
      throw new Error("Invalid invitation token")
    }

    // Verify the email matches the invitation
    if (invitation.email.toLowerCase() !== email.toLowerCase()) {
      console.error(`Email mismatch: Invitation was sent to ${invitation.email} but signup attempt is for ${email}`)
      throw new Error("Email does not match the invitation")
    }

    // Clear any existing session to ensure we're creating/updating the correct user
    // This is a server-side operation so it won't affect the client's session
    await supabaseAdmin.auth.signOut()

    // First, check if the user already exists in Supabase Auth with EXACTLY this email
    const { data: existingUsers, error: lookupError } = await supabaseAdmin.auth.admin.listUsers({
      filter: {
        email: email.toLowerCase(),
      },
    })

    if (lookupError) {
      console.error("Error looking up existing user:", lookupError)
      throw new Error(lookupError.message || "Failed to check if user exists")
    }

    let userId
    let isNewUser = true
    let isEmailConfirmed = false

    // If user already exists in Auth with the EXACT SAME EMAIL
    if (existingUsers && existingUsers.users && existingUsers.users.length > 0) {
      // Find the user with the exact email match
      const exactMatch = existingUsers.users.find((user) => user.email.toLowerCase() === email.toLowerCase())

      if (!exactMatch) {
        console.log(`No exact email match found for ${email}, will create new user`)
      } else {
        userId = exactMatch.id
        isNewUser = false

        // Check if email is confirmed
        isEmailConfirmed = exactMatch.email_confirmed_at !== null

        console.log(
          `User already exists in Auth with ID: ${userId}. Email confirmed: ${isEmailConfirmed}. Email: ${exactMatch.email}`,
        )

        // Update the existing user's password and metadata
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
          password: password,
          email_confirm: true, // Force confirm email
          user_metadata: {
            full_name: fullName,
            role,
            company_id: companyId,
            is_invited_user: true,
            invitation_token: invitationToken,
          },
        })

        if (updateError) {
          console.error("Error updating existing user:", updateError)
          throw new Error(updateError.message || "Failed to update existing user")
        }
      }
    }

    // Create a new user if needed
    if (isNewUser) {
      // Create a new user in Supabase Auth
      console.log(`Creating new user in Auth for email: ${email}`)

      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: email.toLowerCase(),
        password: password,
        email_confirm: true, // Auto-confirm email for invited users
        user_metadata: {
          full_name: fullName,
          role,
          company_id: companyId,
          is_invited_user: true,
          invitation_token: invitationToken,
        },
      })

      if (authError) {
        console.error("Error creating user in Auth:", authError)
        throw new Error(authError.message || "Failed to create user account")
      }

      if (!authData || !authData.user) {
        throw new Error("User creation failed - no user data returned")
      }

      userId = authData.user.id
      isEmailConfirmed = true

      console.log(`New user created with ID: ${userId} and email: ${authData.user.email}`)
    }

    // Double-check that the user has the correct email
    const { data: createdUser, error: userCheckError } = await supabaseAdmin.auth.admin.getUserById(userId)

    if (userCheckError) {
      console.error("Error verifying user email:", userCheckError)
      throw new Error("Failed to verify user email")
    }

    if (createdUser.user.email.toLowerCase() !== email.toLowerCase()) {
      console.error(`Email mismatch! User has email ${createdUser.user.email} but should be ${email}`)
      throw new Error("Created user has incorrect email. Please contact support.")
    }

    // Create or update the user record in the users table
    // IMPORTANT: Use the same approach as in SignupAuthService.js to ensure RLS policies are respected
    console.log(`${isNewUser ? "Creating" : "Updating"} user record in database for email: ${email}`)

    try {
      // Use separate operations for insert and update instead of upsert

      // Check if the user exists in the database
      const { data: existingDbUser, error: existingDbUserError } = await supabaseAdmin
        .from("users")
        .select("*")
        .eq("id", userId)
        .single()

      if (existingDbUserError && existingDbUserError.code !== "PGRST116") {
        console.error("Error checking if user exists in database:", existingDbUserError)
        throw new Error("Failed to check if user exists in database")
      }

      if (!existingDbUser) {
        // For new users, use insert
        const userData = {
          id: userId,
          email: email.toLowerCase(),
          full_name: fullName,
          role: role || "team",
          company_id: companyId,
          is_company_admin: false,
          onboarding_step: "complete", // Skip onboarding for invited users
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        const { error: insertError } = await supabaseAdmin.from("users").insert(userData)

        if (insertError) {
          console.error("Error inserting user in database:", insertError)

          // If this is a new user, attempt to clean up the auth user
          try {
            console.log(`Cleaning up auth user ${userId} due to database error...`)
            await supabaseAdmin.auth.admin.deleteUser(userId)
          } catch (cleanupError) {
            console.error(`Failed to clean up auth user ${userId}:`, cleanupError)
          }

          throw new Error("Failed to create user record in database")
        }
      } else {
        // For existing users, use update
        const userData = {
          email: email.toLowerCase(),
          full_name: fullName,
          role: role || "team",
          company_id: companyId,
          is_company_admin: false,
          onboarding_step: "completed", // Skip onboarding for invited users
          updated_at: new Date().toISOString(),
        }

        const { error: updateError } = await supabaseAdmin.from("users").update(userData).eq("id", userId)

        if (updateError) {
          console.error("Error updating user in database:", updateError)
          throw new Error("Failed to update user record in database")
        }
      }
    } catch (dbError) {
      console.error("Database operation failed:", dbError)
      throw new Error("Failed to create or update user record in database")
    }

    console.log(`User ${isNewUser ? "created" : "updated"} successfully: ${userId}`)

    return {
      user: {
        id: userId,
        email,
        full_name: fullName,
        role,
        isNewUser,
        isEmailConfirmed,
      },
    }
  } catch (error) {
    console.error("Error in createUserForInvitation:", error)
    throw error
  }
}

/**
 * API endpoint handler for invitation signups
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function handleInviteSignup(req, res) {
  try {
    const { email, password, fullName, invitationToken, companyId, role } = req.body

    // Validate required fields
    if (!email || !password || !fullName || !invitationToken || !companyId) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
        details: "Email, password, full name, invitation token, and company ID are required",
      })
    }

    // Create or update user for the invitation
    const result = await createUserForInvitation({
      email,
      password,
      fullName,
      companyId,
      role: role || "team",
      invitationToken, // Pass the invitation token to validate
    })

    // Return success response
    res.status(200).json({
      success: true,
      message: result.user.isNewUser ? "Account created successfully" : "Existing account updated successfully",
      user: result.user,
      isInvitedUser: true,
      requiresEmailConfirmation: false, // Email is auto-confirmed for invited users
    })
  } catch (error) {
    console.error("Invite signup error:", error)

    // Provide a more user-friendly error message
    let errorMessage = "Failed to create account"
    if (error.message && error.message.includes("already been registered")) {
      errorMessage = "This email is already registered. Please try logging in or use a different email."
    } else if (error.message && error.message.includes("Email does not match")) {
      errorMessage = error.message
    } else if (error.message) {
      errorMessage = error.message
    }

    res.status(500).json({
      success: false,
      error: "Failed to create account",
      message: errorMessage,
    })
  }
}

// Export both functions
module.exports = {
  handleInviteSignup,
  createUserForInvitation,
}
