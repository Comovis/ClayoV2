const { supabaseAdmin } = require("../SupabaseClient")

/**
 * Enhanced authentication middleware that fetches complete user data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
async function authenticateUser(req, res, next) {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Authorization token required",
      })
    }

    const token = authHeader.split(" ")[1]

    // Validate the token with Supabase
    const {
      data: { user: authUser },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token)

    if (authError || !authUser) {
      console.error("Token validation failed:", authError)
      return res.status(401).json({
        success: false,
        error: "Invalid or expired token",
      })
    }

    // Fetch complete user data from database
    const { data: userData, error: dbError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .single()

    if (dbError || !userData) {
      console.error("Database user lookup failed:", dbError)
      return res.status(401).json({
        success: false,
        error: "User not found in database",
      })
    }

    // Set complete user data on request object
    req.user = {
      // Include auth data
      ...authUser,
      // Include database data (this will include organization_id)
      user_id: userData.id,
      email: userData.email,
      full_name: userData.full_name,
      organization_id: userData.organization_id,
      role: userData.role,
      is_active: userData.is_active,
      onboarding_step: userData.onboarding_step,
      created_at: userData.created_at,
      updated_at: userData.updated_at,
    }

    console.log("✅ User authenticated successfully:", {
      user_id: req.user.user_id,
      email: req.user.email,
      organization_id: req.user.organization_id,
    })

    next()
  } catch (error) {
    console.error("Authentication middleware error:", error)
    return res.status(500).json({
      success: false,
      error: "Authentication failed",
    })
  }
}

module.exports = { authenticateUser }
