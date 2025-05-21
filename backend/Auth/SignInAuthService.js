const { supabaseAdmin } = require("../SupabaseClient")

/**
 * Authenticates a user with email and password
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<Object>} Authentication result with tokens
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

    // Authenticate with Supabase - this is all we need
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      console.log(`Authentication failed: ${error.message}`)
      throw new Error(error.message || "Invalid credentials")
    }

    if (!data || !data.user) {
      throw new Error("Authentication failed")
    }

    // Just return the essential authentication data
    const authResponse = {
      id: data.user.id,
      email: data.user.email,
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: new Date(Date.now() + (data.session.expires_in * 1000)).toISOString()
      }
    }

    console.log(`User ${email} authenticated successfully`)
    return { 
      success: true, 
      user: authResponse 
    }
  } catch (error) {
    console.error("Error in signInWithEmailPassword:", error)
    return {
      success: false,
      error: error.message || "Authentication failed"
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
        error: "Email and password are required" 
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
        error: result.error 
      })
    }

    // Return successful authentication response with just the auth data
    return res.status(200).json({
      success: true,
      message: "Authentication successful",
      user: result.user
    })
  } catch (error) {
    console.error("Error in handleSignIn:", error)
    return res.status(500).json({ 
      success: false, 
      error: "Internal server error" 
    })
  }
}

module.exports = {
  signInWithEmailPassword,
  handleSignIn
}