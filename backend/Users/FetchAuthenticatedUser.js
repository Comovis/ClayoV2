const { supabaseAdmin } = require("../SupabaseClient")

/**
 * Fetches user data with extended organization information
 * @param {string} userId - ID of the user to fetch
 * @returns {Promise<Object>} Result containing user and organization data
 */
async function fetchUserData(userId) {
  try {
    if (!userId) {
      throw new Error("User ID is required")
    }

    // Fetch user data from users table
    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select("id, email, full_name, organization_id, role, onboarding_step, is_active, is_clayo_admin, created_at, updated_at")
      .eq("id", userId)
      .single()

    if (userError) {
      // If user doesn't exist in our database, return an error
      if (userError.code === "PGRST116") {
        throw new Error("User not found in database")
      }

      throw new Error(`Failed to fetch user data: ${userError.message}`)
    }

    // If user has an organization, fetch organization data
    let organizationData = null
    if (userData.organization_id) {
      const { data: organization, error: organizationError } = await supabaseAdmin
        .from("organizations")
        .select("id, name, domain, settings, created_at, updated_at")
        .eq("id", userData.organization_id)
        .single()

      if (!organizationError) {
        organizationData = organization
      }
    }

    // Return formatted user data with organization if available
    return {
      success: true,
      user: userData,
      organization: organizationData,
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to fetch user data",
    }
  }
}

/**
 * Handles the API request to fetch user data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
async function handleFetchUserDataRequest(req, res) {
  try {
    // Verify authentication
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      })
    }

    // Extract user ID from the authenticated user object
    const userId = req.user?.user_id
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "User ID not found in authenticated session",
      })
    }

    // Call the fetchUserData function
    const result = await fetchUserData(userId)

    if (!result.success) {
      // If user not found, return 404
      if (result.error === "User not found in database") {
        return res.status(404).json({
          success: false,
          error: "User not found",
        })
      }

      return res.status(400).json({
        success: false,
        error: result.error,
      })
    }

    // Format the response
    return res.status(200).json({
      success: true,
      user: result.user,
      organization: result.organization,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    })
  }
}

module.exports = {
  fetchUserData,
  handleFetchUserDataRequest,
}