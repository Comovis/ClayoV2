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
 * @returns {Promise<Object>} Created or updated user
 */
async function createUserForInvitation({ email, password, fullName, companyId, role }) {
  try {
    console.log(`Processing invitation signup for: ${email}, company: ${companyId}, role: ${role}`)

    // First, check if the user already exists in Supabase Auth
    const { data: existingUsers, error: lookupError } = await supabaseAdmin.auth.admin.listUsers({
      filter: {
        email: email
      }
    })

    if (lookupError) {
      console.error("Error looking up existing user:", lookupError)
      throw new Error(lookupError.message || "Failed to check if user exists")
    }

    let userId
    let isNewUser = true
    let isEmailConfirmed = false

    // If user already exists in Auth
    if (existingUsers && existingUsers.users && existingUsers.users.length > 0) {
      const existingUser = existingUsers.users[0]
      userId = existingUser.id
      isNewUser = false
      
      // Check if email is confirmed
      isEmailConfirmed = existingUser.email_confirmed_at !== null
      
      console.log(`User already exists in Auth with ID: ${userId}. Email confirmed: ${isEmailConfirmed}`)
      
      // Update the existing user's password and metadata
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: password,
        user_metadata: {
          full_name: fullName,
          role,
          company_id: companyId,
        }
      })
      
      if (updateError) {
        console.error("Error updating existing user:", updateError)
        throw new Error(updateError.message || "Failed to update existing user")
      }
    } else {
      // Create a new user in Supabase Auth
      console.log("Creating new user in Auth...")
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: false, // Don't auto-confirm email
        user_metadata: {
          full_name: fullName,
          role,
          company_id: companyId,
        },
      })

      if (authError) {
        console.error("Error creating user in Auth:", authError)
        throw new Error(authError.message || "Failed to create user account")
      }

      if (!authData.user) {
        throw new Error("User creation failed")
      }

      userId = authData.user.id
    }

    // Check if user exists in the users table
    const { data: existingDbUser, error: dbLookupError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("id", userId)
      .single()

    // Create or update the user record in the users table
    const userData = {
      id: userId,
      email: email.toLowerCase(),
      full_name: fullName,
      role: role || "team",
      company_id: companyId,
      is_company_admin: false,
      updated_at: new Date().toISOString(),
    }
    
    // Only set created_at for new records
    if (!existingDbUser) {
      userData.created_at = new Date().toISOString()
    }

    console.log(`${existingDbUser ? "Updating" : "Creating"} user record in database...`)
    
    const { error: userError } = await supabaseAdmin
      .from("users")
      .upsert(userData)

    if (userError) {
      console.error("Error upserting user in database:", userError)
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
        isEmailConfirmed
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
    })

    // If user exists but email is not confirmed, resend confirmation email
    let emailResult = { success: true }
    
    if (!result.user.isNewUser && !result.user.isEmailConfirmed) {
      console.log(`User exists but email not confirmed. Resending confirmation for: ${email}`)
      
      // Resend confirmation email
      emailResult = await sendUserConfirmationEmail(email)
      
      if (!emailResult.success) {
        console.warn(`Failed to resend confirmation email: ${emailResult.error}`)
      }
      
      // Return with special status for frontend to handle
      return res.status(200).json({
        success: true,
        message: "Email confirmation required",
        user: result.user,
        emailSent: emailResult.success,
        isInvitedUser: true,
        requiresEmailConfirmation: true
      })
    }
    
    // Only send confirmation email for new users
    if (result.user.isNewUser) {
      // Send confirmation email
      emailResult = await sendUserConfirmationEmail(email)

      if (!emailResult.success) {
        console.warn(`User created but confirmation email failed: ${emailResult.error}`)
      }
    } else {
      console.log(`User already exists and email is confirmed, skipping confirmation email for: ${email}`)
    }

    // Return success response
    res.status(200).json({
      success: true,
      message: result.user.isNewUser 
        ? "Account created successfully" 
        : "Existing account updated successfully",
      user: result.user,
      emailSent: emailResult.success,
      isInvitedUser: true,
    })
  } catch (error) {
    console.error("Invite signup error:", error)

    // Provide a more user-friendly error message
    let errorMessage = "Failed to create account"
    if (error.message && error.message.includes("already been registered")) {
      errorMessage = "This email is already registered. Please try logging in or use a different email."
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
  createUserForInvitation
}