const { supabaseAdmin } = require("../../SupabaseClient")

/**
 * Fetches vessels for a company
 * @param {string} companyId - ID of the company to fetch vessels for
 * @param {Object} options - Query options (pagination, sorting, filtering)
 * @param {number} options.page - Page number for pagination
 * @param {number} options.pageSize - Number of items per page
 * @param {string} options.sortBy - Field to sort by
 * @param {string} options.sortOrder - Sort order (asc/desc)
 * @param {Object} options.filters - Filters to apply to the query
 * @returns {Promise<Object>} Result containing vessels and pagination info
 */
async function getVessels(companyId, options = {}) {
  try {
    if (!companyId) {
      throw new Error("Company ID is required")
    }

    console.log(`Fetching vessels for company: ${companyId}`)

    // Set default options
    const {
      page = 1,
      pageSize = 10,
      sortBy = "name",
      sortOrder = "asc",
      filters = {}
    } = options

    // Calculate pagination
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    // Start building the query
    let query = supabaseAdmin
      .from("vessels")
      .select("*", { count: "exact" })
      .eq("company_id", companyId)
      .order(sortBy, { ascending: sortOrder === "asc" })
      .range(from, to)

    // Apply additional filters if provided
    if (filters.vesselType) {
      query = query.eq("vessel_type", filters.vesselType)
    }

    if (filters.flagState) {
      query = query.eq("flag_state", filters.flagState)
    }

    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,imo_number.ilike.%${filters.search}%`)
    }

    // Execute the query
    const { data: vessels, error, count } = await query

    if (error) {
      console.log(`Error fetching vessels: ${error.message}`)
      throw new Error("Error fetching vessels")
    }

    console.log(`Successfully fetched ${vessels?.length || 0} vessels for company: ${companyId}`)
    
    return {
      success: true,
      vessels,
      pagination: {
        total: count,
        page,
        pageSize,
        totalPages: Math.ceil(count / pageSize)
      }
    }
  } catch (error) {
    console.error("Error in getVessels:", error)
    return {
      success: false,
      error: error.message || "Failed to fetch vessels",
    }
  }
}

/**
 * Handles the API request to fetch vessels
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
async function handleGetVesselsRequest(req, res) {
  try {
    // Verify authentication
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    // Extract user ID from the authenticated user object
    const userId = req.user?.user_id
    if (!userId) {
      return res.status(401).json({ error: "User ID not found in authenticated session" })
    }

    // Get the company ID from the user
    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select("company_id")
      .eq("id", userId)
      .single()

    if (userError || !userData?.company_id) {
      console.error("Error fetching user company:", userError)
      return res.status(400).json({ error: "Failed to determine user's company" })
    }

    const companyId = userData.company_id

    // Extract query parameters
    const { 
      page, 
      pageSize, 
      sortBy, 
      sortOrder,
      vesselType,
      flagState,
      search
    } = req.query

    // Prepare options object
    const options = {
      page: page ? parseInt(page) : undefined,
      pageSize: pageSize ? parseInt(pageSize) : undefined,
      sortBy,
      sortOrder,
      filters: {
        vesselType,
        flagState,
        search
      }
    }

    console.log("Fetching vessels for company:", companyId, "with options:", options)

    // Call the getVessels function
    const result = await getVessels(companyId, options)

    if (!result.success) {
      return res.status(400).json({ error: result.error })
    }

    return res.status(200).json({
      success: true,
      vessels: result.vessels,
      pagination: result.pagination
    })
  } catch (error) {
    console.error("Error in handleGetVesselsRequest:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}

module.exports = {
  getVessels,
  handleGetVesselsRequest,
}