const { supabaseAdmin } = require("../SupabaseClient")

/**
 * Cancels a team invitation
 * @param {string} email - Email of the invitation to cancel
 * @param {string} userId - ID of the user making the request
 * @returns {Promise<Object>} Result of the operation
 */
async function cancelTeamInvitation(email, userId) {
  try {
    if (!email) {
      throw new Error("Email is required")
    }

    if (!userId) {
      throw new Error("User ID is required")
    }

    console.log(`User ${userId} attempting to cancel invitation for email: ${email}`)

    // Check if the user has permission to cancel this invitation
    const { data: invitations, error: fetchError } = await supabaseAdmin
      .from("team_invitations")
      .select("id, invited_by, company_id")
      .eq("email", email)
      .eq("invitation_status", "pending")
      .order("created_at", { ascending: false })
      .limit(1)

    if (fetchError) {
      console.log(`Error fetching invitation: ${fetchError.message}`)
      throw new Error("Error fetching invitation")
    }

    if (!invitations || invitations.length === 0) {
      console.log(`No pending invitation found for email: ${email}`)
      throw new Error("No pending invitation found for this email")
    }

    const invitation = invitations[0]
    const invitationId = invitation.id

    // Check if the user is the one who sent the invitation or is a company admin
    const { data: userRole, error: roleError } = await supabaseAdmin
      .from("users")
      .select("role, is_company_admin, company_id")
      .eq("id", userId)
      .single()

    if (roleError) {
      console.log(`Error fetching user role: ${roleError.message}`)
      throw new Error("Failed to verify permissions")
    }

    const isInviter = invitation.invited_by === userId
    const isCompanyAdmin = userRole.is_company_admin || userRole.role === "admin"
    const isSameCompany = invitation.company_id === userRole.company_id

    if (!isInviter && !(isCompanyAdmin && isSameCompany)) {
      throw new Error("You don't have permission to cancel this invitation")
    }

    console.log(`Found invitation ID: ${invitationId} for email: ${email}`)

    // Update the invitation status to revoked and nullify the token
    const { error: updateError } = await supabaseAdmin
      .from("team_invitations")
      .update({
        invitation_status: "revoked",
        invitation_token: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", invitationId)

    if (updateError) {
      console.log(`Update failed with error: ${updateError.message}. Trying to delete...`)

      // If update fails, try to delete
      const { error: deleteError } = await supabaseAdmin.from("team_invitations").delete().eq("id", invitationId)

      if (deleteError) {
        console.log(`Delete also failed: ${deleteError.message}`)
        throw new Error("Failed to cancel invitation")
      } else {
        console.log(`Successfully deleted invitation: ${invitationId}`)
        return { success: true, message: "Invitation deleted successfully" }
      }
    }

    console.log(`Successfully revoked invitation: ${invitationId}`)
    return { success: true, message: "Invitation revoked successfully" }
  } catch (error) {
    console.error("Error in cancelTeamInvitation:", error)
    return {
      success: false,
      error: error.message || "Failed to cancel invitation",
    }
  }
}

/**
 * Handles the API request to cancel a team invitation
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
async function handleCancelTeamInvitationRequest(req, res) {
  try {
    // Verify authentication
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    // Extract email from request body
    const { email } = req.body
    if (!email) {
      return res.status(400).json({ error: "Email is required" })
    }

    // Extract user ID from the authenticated user object
    const userId = req.user?.user_id
    if (!userId) {
      return res.status(401).json({ error: "User ID not found in authenticated session" })
    }

    console.log("Cancelling invitation for:", email, "by user:", userId)

    // Call the cancelTeamInvitation function directly since it's in the same file
    const result = await cancelTeamInvitation(email, userId)

    if (!result.success) {
      return res.status(400).json({ error: result.error })
    }

    return res.status(200).json({ success: true, message: result.message })
  } catch (error) {
    console.error("Error in handleCancelTeamInvitationRequest:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}

module.exports = {
  cancelTeamInvitation,
  handleCancelTeamInvitationRequest,
}
