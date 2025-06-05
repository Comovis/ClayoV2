const { supabaseAdmin } = require("../SupabaseClient")

/**
 * Authenticates a user with email and password and returns user data
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<Object>} Authentication result with tokens and user data
 */
async function signInWithEmailPassword(email, password) {
  try {
    if (!email) {
      throw new Error("Email is required")
    }

    if (!password) {
      throw new Error("Password is required")
    }

    console.log(`Attempting to authenticate user: ${email}`)

    // Authenticate with Supabase
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.log(`Authentication failed: ${error.message}`)
      throw new Error(error.message || "Invalid credentials")
    }

    if (!data || !data.user) {
      throw new Error("Authentication failed")
    }

    // Fetch additional user data from the database
    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select(`
        id,
        organization_id,
        full_name,
        role,
        onboarding_step,
        is_active
      `)
      .eq("id", data.user.id)
      .single()

    if (userError) {
      console.error("Error fetching user data:", userError)
      throw new Error("Error fetching user data")
    }

    // Fetch organization data
    const { data: orgData, error: orgError } = await supabaseAdmin
      .from("organizations")
      .select(`
        id,
        name,
        domain,
        settings
      `)
      .eq("id", userData.organization_id)
      .single()

    if (orgError && userData.organization_id) {
      console.error("Error fetching organization data:", orgError)
      // Non-critical error, continue without org data
    }

    // Prepare the response
    const authResponse = {
      id: data.user.id,
      email: data.user.email,
      full_name: userData.full_name,
      role: userData.role,
      organization_id: userData.organization_id,
      onboarding_step: userData.onboarding_step,
      organization: orgData || null,
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: new Date(Date.now() + data.session.expires_in * 1000).toISOString(),
      },
    }

    console.log(`User ${email} authenticated successfully`)
    return {
      success: true,
      user: authResponse,
    }
  } catch (error) {
    console.error("Error in signInWithEmailPassword:", error)
    return {
      success: false,
      error: error.message || "Authentication failed",
    }
  }
}

/**
 * Handles the API request for user sign-in
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
async function handleSignIn(req, res) {
  try {
    // Extract credentials from request body
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      })
    }

    // Sanitize email input
    const sanitizedEmail = email.toLowerCase().trim()

    console.log(`Processing sign-in request for: ${sanitizedEmail}`)

    // Call the authentication function
    const result = await signInWithEmailPassword(sanitizedEmail, password)

    if (!result.success) {
      return res.status(401).json({
        success: false,
        error: result.error,
      })
    }

    // Return successful authentication response
    return res.status(200).json({
      success: true,
      message: "Authentication successful",
      user: result.user,
    })
  } catch (error) {
    console.error("Error in handleSignIn:", error)
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    })
  }
}

module.exports = {
  signInWithEmailPassword,
  handleSignIn,
}
