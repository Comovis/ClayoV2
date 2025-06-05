const { supabaseAdmin } = require("../SupabaseClient")

/**
 * Creates a new user with associated organization in a single transaction
 * @param {Object} userData - User data for signup
 * @param {string} userData.email - User's email
 * @param {string} userData.password - User's password
 * @param {string} userData.fullName - User's full name
 * @param {string} userData.companyName - Organization name
 * @returns {Promise<Object>} Created user and organization data
 */
async function createUserWithOrganization({ email, password, fullName, companyName }) {
  console.log(`Starting signup process for ${email} with organization ${companyName}`)

  try {
    // 1. Create the auth user first
    console.log("Creating auth user...")
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false, // Set to true if you want to skip email verification
      user_metadata: {
        full_name: fullName,
      },
    })

    if (authError) {
      console.error("Auth user creation failed:", authError)
      throw new Error(`Auth error: ${authError.message}`)
    }

    if (!authData.user) {
      throw new Error("User creation failed: No user returned")
    }

    const userId = authData.user.id
    console.log(`Auth user created with ID: ${userId}`)

    // 2. Create organization
    console.log("Creating organization record...")
    const { data: orgData, error: orgError } = await supabaseAdmin
      .from("organizations")
      .insert([
        {
          name: companyName,
          settings: {
            onboarding_step: "welcome",
            onboarding_completed: false,
          },
        },
      ])
      .select("id")
      .single()

    if (orgError) {
      console.error("Organization creation failed:", orgError)
      // Attempt to clean up the auth user since organization creation failed
      await cleanupAuthUser(userId)
      throw new Error(`Organization creation error: ${orgError.message}`)
    }

    const organizationId = orgData.id
    console.log(`Organization created with ID: ${organizationId}`)

    // 3. Create user record linked to organization
    console.log("Creating user record...")
    const { error: userError } = await supabaseAdmin.from("users").insert([
      {
        id: userId,
        organization_id: organizationId,
        email: email,
        full_name: fullName,
        role: "owner",
        onboarding_step: "welcome",
        is_active: true,
      },
    ])

    if (userError) {
      console.error("User record creation failed:", userError)
      // Clean up both auth user and organization
      await cleanupOrganization(organizationId)
      await cleanupAuthUser(userId)
      throw new Error(`User record error: ${userError.message}`)
    }

    console.log("Signup process completed successfully")

    return {
      success: true,
      user: {
        id: userId,
        email,
        fullName,
      },
      organization: {
        id: organizationId,
        name: companyName,
      },
    }
  } catch (error) {
    console.error("Signup process failed:", error)
    throw error
  }
}

/**
 * Cleanup function to delete an auth user if something fails
 * @param {string} userId - The user ID to delete
 */
async function cleanupAuthUser(userId) {
  try {
    console.log(`Cleaning up auth user ${userId}...`)
    await supabaseAdmin.auth.admin.deleteUser(userId)
    console.log(`Auth user ${userId} deleted successfully`)
  } catch (error) {
    console.error(`Failed to clean up auth user ${userId}:`, error)
  }
}

/**
 * Cleanup function to delete an organization if something fails
 * @param {string} organizationId - The organization ID to delete
 */
async function cleanupOrganization(organizationId) {
  try {
    console.log(`Cleaning up organization ${organizationId}...`)
    await supabaseAdmin.from("organizations").delete().eq("id", organizationId)
    console.log(`Organization ${organizationId} deleted successfully`)
  } catch (error) {
    console.error(`Failed to clean up organization ${organizationId}:`, error)
  }
}

/**
 * Handles the API request for user sign-up
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
async function handleSignUp(req, res) {
  try {
    // Extract user data from request body
    const { email, password, fullName, companyName } = req.body

    if (!email || !password || !fullName || !companyName) {
      return res.status(400).json({
        success: false,
        error: "Email, password, full name, and company name are required",
      })
    }

    // Sanitize email input
    const sanitizedEmail = email.toLowerCase().trim()

    console.log(`Processing sign-up request for: ${sanitizedEmail}`)

    // Call the user creation function
    const result = await createUserWithOrganization({
      email: sanitizedEmail,
      password,
      fullName,
      companyName,
    })

    // Return successful sign-up response
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: result.user,
      organization: result.organization,
    })
  } catch (error) {
    console.error("Error in handleSignUp:", error)

    // Handle specific errors
    if (error.message.includes("duplicate key") || error.message.includes("already exists")) {
      return res.status(409).json({
        success: false,
        error: "A user with this email already exists",
      })
    }

    return res.status(500).json({
      success: false,
      error: error.message || "Failed to create user",
    })
  }
}

module.exports = {
  createUserWithOrganization,
  handleSignUp,
}
