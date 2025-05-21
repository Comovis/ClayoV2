const { supabaseAdmin } = require("../SupabaseClient")

/**
 * Retrieves user data based on user ID or email
 * @param {string} userId - ID of the user to retrieve (optional if email is provided)
 * @param {string} email - Email of the user to retrieve (optional if userId is provided)
 * @returns {Promise<Object>} User data or error
 */
async function getUserData(userId, email) {
  try {
    if (!userId && !email) {
      throw new Error("Either user ID or email is required")
    }

    // Build the query based on the provided parameters
    let query = supabaseAdmin.from("users").select(`
      id,
      email,
      full_name,
      role,
      is_company_admin,
      company_id,
      onboarding_step,
      created_at,
      updated_at
    `)

    // Apply the appropriate filter
    if (userId) {
      query = query.eq("id", userId)
    } else if (email) {
      query = query.eq("email", email)
    }

    // Execute the query
    const { data: userData, error } = await query.single()

    if (error) {
      throw new Error("Error retrieving user data")
    }

    if (!userData) {
      throw new Error("User not found")
    }

    return { success: true, data: userData }
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to retrieve user data",
    }
  }
}

/**
 * Handles the API request to get user data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
async function handleGetUserData(req, res) {
  try {
    // Verify authentication
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    // Extract parameters from request query
    const { userId, email } = req.query

    // Extract the authenticated user's ID
    const requestingUserId = req.user?.user_id
    if (!requestingUserId) {
      return res.status(401).json({ error: "User ID not found in authenticated session" })
    }

    // If no specific user is requested, return the requesting user's data
    if (!userId && !email) {
      const result = await getUserData(requestingUserId, null)
      
      if (!result.success) {
        return res.status(400).json({ error: result.error })
      }
      
      return res.status(200).json({ success: true, data: result.data })
    }

    // Check if the user has permission to access this data
    // First, get the requesting user's role and company
    const { data: requestingUser, error: userError } = await supabaseAdmin
      .from("users")
      .select("role, is_company_admin, company_id")
      .eq("id", requestingUserId)
      .single()

    if (userError) {
      return res.status(500).json({ error: "Failed to verify permissions" })
    }

    // If the user is requesting their own data, allow it
    if (userId === requestingUserId || (email && requestingUser.email === email)) {
      const result = await getUserData(userId, email)
      
      if (!result.success) {
        return res.status(400).json({ error: result.error })
      }
      
      return res.status(200).json({ success: true, data: result.data })
    }

    // For other users' data, check permissions
    const isAdmin = requestingUser.role === "admin"
    const isCompanyAdmin = requestingUser.is_company_admin

    // If not an admin of any kind, deny access to other users' data
    if (!isAdmin && !isCompanyAdmin) {
      return res.status(403).json({ error: "You don't have permission to access this user's data" })
    }

    // All permission checks passed, get the user data
    const result = await getUserData(userId, email)
    
    if (!result.success) {
      return res.status(400).json({ error: result.error })
    }
    
    return res.status(200).json({ success: true, data: result.data })
  } catch (error) {
    console.error("Error in handleGetUserData:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}

module.exports = {
  getUserData,
  handleGetUserData,
}