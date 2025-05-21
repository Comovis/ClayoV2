const { supabaseAdmin } = require("../SupabaseClient")

/**
 * Validates an invitation token and returns the invitation details
 * @param {string} token - The invitation token to validate
 * @returns {Promise<Object>} Result of the operation with invitation details
 */
async function validateInvitationToken(token) {
  try {
    if (!token) {
      throw new Error("Invitation token is required")
    }

    console.log("Validating invitation token:", token)

    // Get the invitation details
    const { data, error } = await supabaseAdmin
      .from("team_invitations")
      .select(`
        id, 
        email, 
        role, 
        invitation_token, 
        company_id, 
        invited_by, 
        invitation_status,
        expires_at,
        created_at
      `)
      .eq("invitation_token", token)
      .single()

    if (error) {
      console.error("Error fetching invitation:", error)
      throw new Error("Failed to validate invitation token")
    }

    if (!data) {
      console.error("No invitation found with token:", token)
      throw new Error("No invitation found with this token")
    }

    // Check if the invitation has been cancelled or already used
    if (data.invitation_status !== "pending") {
      console.log(`Invitation status is ${data.invitation_status}, not pending`)
      throw new Error(`This invitation has been ${data.invitation_status}`)
    }

    // Check if invitation has expired
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      console.log("Invitation has expired:", token)
      throw new Error("This invitation has expired")
    }

    // Get company name
    const { data: companyData, error: companyError } = await supabaseAdmin
      .from("companies")
      .select("name")
      .eq("id", data.company_id)
      .single()

    if (companyError) {
      console.warn("Error fetching company:", companyError)
    }

    // Get inviter name - FIX: Use full_name instead of name
    const { data: inviterData, error: inviterError } = await supabaseAdmin
      .from("users")
      .select("full_name") // Changed from "name" to "full_name"
      .eq("id", data.invited_by)
      .single()

    if (inviterError) {
      console.warn("Error fetching inviter:", inviterError)
    }

    // Return the invitation details
    return {
      success: true,
      invitation: {
        id: data.id,
        email: data.email,
        role: data.role,
        token: data.invitation_token,
        companyId: data.company_id,
        invitedBy: data.invited_by,
        companyName: companyData?.name || "Comovis",
        inviterName: inviterData?.full_name || "A team administrator", // Changed from "name" to "full_name"
        status: data.invitation_status,
        createdAt: data.created_at,
        expiresAt: data.expires_at,
      },
    }
  } catch (error) {
    console.error("Error in validateInvitationToken:", error)
    return {
      success: false,
      error: error.message || "An unexpected error occurred",
    }
  }
}

/**
 * Handles the API request to validate an invitation token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
async function handleValidateInvitationRequest(req, res) {
  try {
    const { token } = req.body

    if (!token) {
      return res.status(400).json({
        success: false,
        error: "Invitation token is required",
      })
    }

    console.log("Validating invitation token from API request:", token)

    // Call the validateInvitationToken function
    const result = await validateInvitationToken(token)

    if (!result.success) {
      return res.status(404).json({
        success: false,
        error: result.error,
      })
    }

    return res.status(200).json({
      success: true,
      invitation: result.invitation,
    })
  } catch (error) {
    console.error("Error in handleValidateInvitationRequest:", error)
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    })
  }
}

module.exports = {
  validateInvitationToken,
  handleValidateInvitationRequest,
}
