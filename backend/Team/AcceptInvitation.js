const { supabaseAdmin } = require("../SupabaseClient")

/**
 * Accepts an invitation and adds the user to the team using direct table operations
 * @param {string} token - The invitation token
 * @param {string} userId - The user ID accepting the invitation
 * @param {string} fullName - The user's full name (optional)
 * @returns {Promise<Object>} Result of the operation
 */
async function acceptInvitation(token, userId, fullName = null) {
  try {
    if (!token) {
      throw new Error("Invitation token is required")
    }

    if (!userId) {
      throw new Error("User ID is required")
    }

    console.log("Accepting invitation with token:", token, "for user:", userId)

    // First, check if the user exists in Auth and ensure their email is confirmed
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId)

    if (userError) {
      console.error("Error fetching user data:", userError)
      throw new Error("Failed to verify user")
    }

    // If email is not confirmed, confirm it now
    if (!userData.user.email_confirmed_at) {
      console.log("Auto-confirming user email for invited user")
      const { error: confirmError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        email_confirm: true,
      })

      if (confirmError) {
        console.error("Error confirming user email:", confirmError)
        // Continue anyway, as this is not critical
      }
    }

    // Step 1: Get the invitation details
    const { data: invitation, error: invitationError } = await supabaseAdmin
      .from("team_invitations")
      .select("id, email, role, company_id, invitation_status")
      .eq("invitation_token", token)
      .single()

    if (invitationError) {
      console.error("Error fetching invitation:", invitationError)
      throw new Error("Failed to find invitation with this token")
    }

    if (!invitation) {
      throw new Error("Invitation not found")
    }

    if (invitation.invitation_status !== "pending") {
      throw new Error(`This invitation has already been ${invitation.invitation_status}`)
    }

    // Add debugging to see what emails we're comparing
    console.log("Comparing emails:")
    console.log("User email from Auth:", userData.user.email.toLowerCase())
    console.log("Invitation email:", invitation.email.toLowerCase())

    // Strictly enforce that the user's email must match the invitation email
    if (userData.user.email.toLowerCase() !== invitation.email.toLowerCase()) {
      console.error(
        "Email mismatch: User is logged in as",
        userData.user.email,
        "but invitation was sent to",
        invitation.email,
      )
      throw new Error(
        `You are currently logged in as ${userData.user.email}. Please log out and sign in with ${invitation.email} to accept this invitation.`,
      )
    }

    // Step 2: Update the user's profile with company_id and role from the invitation
    const { error: updateUserError } = await supabaseAdmin
      .from("users")
      .update({
        company_id: invitation.company_id,
        role: invitation.role,
        full_name: fullName?.trim() || userData.user.user_metadata?.full_name || userData.user.email.split("@")[0],
        onboarding_step: "completed", // Use onboarding_step instead of onboarding_completed
      })
      .eq("id", userId)

    if (updateUserError) {
      console.error("Error updating user:", updateUserError)
      throw new Error("Failed to update user profile")
    }

    // Step 3: Mark the invitation as accepted
    const { error: updateInvitationError } = await supabaseAdmin
      .from("team_invitations")
      .update({
        invitation_status: "accepted",
        accepted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", invitation.id)

    if (updateInvitationError) {
      console.error("Error updating invitation:", updateInvitationError)
      throw new Error("Failed to mark invitation as accepted")
    }

    console.log("Invitation accepted successfully for user:", userId)

    return {
      success: true,
      message: "Invitation accepted successfully",
      companyId: invitation.company_id,
      role: invitation.role,
    }
  } catch (error) {
    console.error("Error in acceptInvitation:", error)
    return {
      success: false,
      error: error.message || "An unexpected error occurred",
    }
  }
}

/**
 * Handles the API request to accept an invitation
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
async function handleAcceptInvitationRequest(req, res) {
  try {
    const { token, userId, fullName } = req.body

    if (!token || !userId) {
      return res.status(400).json({
        success: false,
        error: "Invitation token and user ID are required",
      })
    }

    console.log("Accepting invitation with token:", token, "for user:", userId)

    // Call the acceptInvitation function
    const result = await acceptInvitation(token, userId, fullName)

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error,
      })
    }

    return res.status(200).json({
      success: true,
      message: result.message,
      companyId: result.companyId,
      role: result.role,
    })
  } catch (error) {
    console.error("Error in handleAcceptInvitationRequest:", error)
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    })
  }
}

module.exports = {
  acceptInvitation,
  handleAcceptInvitationRequest,
}
