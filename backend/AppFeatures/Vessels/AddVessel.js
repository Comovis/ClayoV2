const { supabaseAdmin } = require("../../SupabaseClient")

/**
 * Normalizes a vessel name by converting it to title case
 * @param {string} name - The vessel name to normalize
 * @returns {string} The normalized vessel name
 */
function normalizeVesselName(name) {
  if (!name) return name

  // Split the name by spaces and normalize each word
  return name
    .split(" ")
    .map((word) => {
      // Convert the word to lowercase first
      const lowerWord = word.toLowerCase()
      // Capitalize the first letter
      return lowerWord.charAt(0).toUpperCase() + lowerWord.slice(1)
    })
    .join(" ")
}

/**
 * Adds a new vessel to a company's fleet
 * @param {string} companyId - ID of the company to add the vessel to
 * @param {Object} vesselData - The vessel data to add
 * @param {string} vesselData.name - Name of the vessel (required)
 * @param {string} vesselData.imo_number - IMO number of the vessel
 * @param {string} vesselData.vessel_type - Type of the vessel (required)
 * @param {string} vesselData.flag_state - Flag state of the vessel (required)
 * @returns {Promise<Object>} Result containing success status and vessel data or error
 */
async function addVessel(companyId, vesselData) {
  try {
    if (!companyId) {
      throw new Error("Company ID is required")
    }

    console.log(`Adding vessel for company: ${companyId}`)

    // Validate required fields
    if (!vesselData.name) {
      throw new Error("Vessel name is required")
    }

    if (!vesselData.vessel_type) {
      throw new Error("Vessel type is required")
    }

    if (!vesselData.flag_state) {
      throw new Error("Flag state is required")
    }

    // Validate IMO number format if provided
    if (vesselData.imo_number && !/^\d{7}$/.test(vesselData.imo_number)) {
      throw new Error("IMO number must be 7 digits")
    }

    // Check if a vessel with the same IMO number already exists for this company
    if (vesselData.imo_number) {
      const { data: existingVessel, error: checkError } = await supabaseAdmin
        .from("vessels")
        .select("id")
        .eq("company_id", companyId)
        .eq("imo_number", vesselData.imo_number)
        .single()

      if (checkError && checkError.code !== "PGRST116") {
        // PGRST116 is the error code for no rows returned
        console.error("Error checking for existing vessel:", checkError)
        throw new Error("Error checking for existing vessel")
      }

      if (existingVessel) {
        throw new Error(`A vessel with IMO number ${vesselData.imo_number} already exists in your fleet`)
      }
    }

    // Prepare vessel data for insertion
    const normalizedName = normalizeVesselName(vesselData.name)
    console.log(`Normalizing vessel name: "${vesselData.name}" → "${normalizedName}"`)

    const newVesselData = {
      company_id: companyId,
      name: normalizedName,
      imo_number: vesselData.imo_number || null,
      vessel_type: vesselData.vessel_type,
      flag_state: vesselData.flag_state,
    }

    // Insert the new vessel
    const { data: vessel, error: insertError } = await supabaseAdmin
      .from("vessels")
      .insert([newVesselData])
      .select()
      .single()

    if (insertError) {
      console.error("Error inserting vessel:", insertError)
      throw new Error("Failed to add vessel to database")
    }

    // Get the current vessel count for the company
    const { data: companyData, error: companyError } = await supabaseAdmin
      .from("companies")
      .select("vessel_count")
      .eq("id", companyId)
      .single()

    if (companyError) {
      console.error("Error fetching company data:", companyError)
      // Don't throw here, as the vessel was already added successfully
    } else {
      // Calculate the new vessel count
      const currentCount = companyData.vessel_count || 0
      const newCount = currentCount + 1

      // Update the vessel count for the company
      const { error: updateError } = await supabaseAdmin
        .from("companies")
        .update({ vessel_count: newCount })
        .eq("id", companyId)

      if (updateError) {
        console.error("Error updating vessel count:", updateError)
        // Don't throw here, as the vessel was already added successfully
      } else {
        console.log(`Updated vessel count for company ${companyId} from ${currentCount} to ${newCount}`)
      }
    }

    console.log(`Successfully added vessel: ${vessel.id} for company: ${companyId}`)

    return {
      success: true,
      vessel,
    }
  } catch (error) {
    console.error("Error in addVessel:", error)
    return {
      success: false,
      error: error.message || "Failed to add vessel",
    }
  }
}

/**
 * Handles the API request to add a vessel
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
async function handleAddVesselRequest(req, res) {
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
      .select("company_id, is_company_admin")
      .eq("id", userId)
      .single()

    if (userError || !userData?.company_id) {
      console.error("Error fetching user company:", userError)
      return res.status(400).json({ error: "Failed to determine user's company" })
    }

    // Check if user has permission to add vessels
    if (!userData.is_company_admin) {
      // You might want to add additional permission checks here
      // For now, we'll assume only company admins can add vessels
      return res.status(403).json({ error: "You don't have permission to add vessels" })
    }

    const companyId = userData.company_id

    // Extract vessel data from request body
    const { name, imo_number, vessel_type, flag_state } = req.body

    // Validate request body
    if (!name || !vessel_type || !flag_state) {
      return res.status(400).json({
        error: "Missing required fields. Name, vessel type, and flag state are required.",
      })
    }

    const vesselData = {
      name,
      imo_number,
      vessel_type,
      flag_state,
    }

    console.log("Adding vessel for company:", companyId, "with data:", vesselData)

    // Call the addVessel function
    const result = await addVessel(companyId, vesselData)

    if (!result.success) {
      // Determine appropriate status code based on error
      let statusCode = 400
      if (result.error.includes("already exists")) {
        statusCode = 409 // Conflict
      }
      return res.status(statusCode).json({ error: result.error })
    }

    return res.status(201).json({
      success: true,
      message: "Vessel added successfully",
      vessel: result.vessel,
    })
  } catch (error) {
    console.error("Error in handleAddVesselRequest:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}

module.exports = {
  addVessel,
  handleAddVesselRequest,
}
