const { supabaseAdmin } = require("../SupabaseClient")

/**
 * Fetches user data with extended company information
 * @param {string} userId - ID of the user to fetch
 * @returns {Promise<Object>} Result containing user and company data
 */
async function fetchUserData(userId) {
  try {
    console.log(`[fetchUserData] Starting user data fetch for user: ${userId}`)

    if (!userId) {
      console.error("[fetchUserData] No user ID provided")
      throw new Error("User ID is required")
    }

    // Fetch user data from users table
    console.log(`[fetchUserData] Fetching user information for ID: ${userId}`)
    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select("id, email, full_name, company_id, role, is_company_admin, onboarding_step, created_at, updated_at")
      .eq("id", userId)
      .single()

    if (userError) {
      console.error(`[fetchUserData] Error fetching user data: ${userError.message}`)
      
      // If user doesn't exist in our database, return an error
      if (userError.code === "PGRST116") {
        console.log(`[fetchUserData] User ${userId} not found in database`)
        throw new Error("User not found in database")
      }
      
      throw new Error(`Failed to fetch user data: ${userError.message}`)
    }

    console.log(`[fetchUserData] Successfully fetched user data for: ${userId}`)

    // If user has a company, fetch company data
    let companyData = null
    if (userData.company_id) {
      console.log(`[fetchUserData] Fetching company data for ID: ${userData.company_id}`)
      
      const { data: company, error: companyError } = await supabaseAdmin
        .from("companies")
        .select("id, name, company_type, vessel_count, operating_regions, onboarding_completed, created_at, updated_at")
        .eq("id", userData.company_id)
        .single()

      if (companyError) {
        console.error(`[fetchUserData] Error fetching company data: ${companyError.message}`)
      } else {
        companyData = company
        console.log(`[fetchUserData] Successfully fetched company data for: ${userData.company_id}`)
      }
    } else {
      console.log(`[fetchUserData] User ${userId} does not belong to a company`)
    }

    // Return formatted user data with company if available
    return {
      success: true,
      user: userData,
      company: companyData
    }
  } catch (error) {
    console.error(`[fetchUserData] Error: ${error.message}`, error)
    return {
      success: false,
      error: error.message || "Failed to fetch user data"
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
  console.log("[handleFetchUserDataRequest] Received request to fetch user data")

  try {
    // Verify authentication
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("[handleFetchUserDataRequest] Missing or invalid authorization header")
      return res.status(401).json({ 
        success: false, 
        error: "Unauthorized" 
      })
    }

    // Extract user ID from the authenticated user object
    const userId = req.user?.user_id
    if (!userId) {
      console.error("[handleFetchUserDataRequest] User ID not found in authenticated session")
      return res.status(401).json({ 
        success: false, 
        error: "User ID not found in authenticated session" 
      })
    }

    console.log(`[handleFetchUserDataRequest] Fetching data for user: ${userId}`)

    // Call the fetchUserData function
    const result = await fetchUserData(userId)

    if (!result.success) {
      console.error(`[handleFetchUserDataRequest] Error fetching user data: ${result.error}`)
      
      // If user not found, return 404
      if (result.error === "User not found in database") {
        return res.status(404).json({ 
          success: false, 
          error: "User not found" 
        })
      }
      
      return res.status(400).json({ 
        success: false, 
        error: result.error 
      })
    }

    console.log(`[handleFetchUserDataRequest] Successfully fetched user data for: ${userId}`)

    // Format the response
    return res.status(200).json({
      success: true,
      user: result.user,
      company: result.company
    })
  } catch (error) {
    console.error(`[handleFetchUserDataRequest] Unhandled error: ${error.message}`, error)
    return res.status(500).json({
      success: false,
      error: "Internal server error"
    })
  }
}

module.exports = {
  fetchUserData,
  handleFetchUserDataRequest
}