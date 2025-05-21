const { supabaseAdmin } = require("../SupabaseClient")

/**
 * Fetches all team members (active users, pending and revoked invitations) for a company
 * @param {string} userId - ID of the user making the request
 * @returns {Promise<Object>} Result containing team members data
 */
async function fetchTeamMembers(userId) {
  try {
    if (!userId) {
      throw new Error("User ID is required")
    }

    // First, get the user's company ID
    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select("company_id, role, is_company_admin")
      .eq("id", userId)
      .single()

    if (userError) {
      throw new Error("Failed to verify user company")
    }

    if (!userData || !userData.company_id) {
      throw new Error("User does not belong to a company")
    }

    const companyId = userData.company_id

    // Fetch active users from the same company
    const { data: activeUsers, error: activeUsersError } = await supabaseAdmin
      .from("users")
      .select("id, email, full_name, role, is_company_admin, created_at")
      .eq("company_id", companyId)

    if (activeUsersError) {
      throw new Error("Failed to fetch active team members")
    }

    // Fetch all invitations (pending and revoked) for the company
    const { data: invitations, error: invitationsError } = await supabaseAdmin
      .from("team_invitations")
      .select("id, email, role, invitation_status, created_at, email_sent_at, updated_at")
      .eq("company_id", companyId)
      .in("invitation_status", ["pending", "revoked"])

    if (invitationsError) {
      throw new Error("Failed to fetch team invitations")
    }

    const pendingInvitations = invitations.filter((inv) => inv.invitation_status === "pending")
    const revokedInvitations = invitations.filter((inv) => inv.invitation_status === "revoked")

    // Format active users
    const formattedActiveUsers = activeUsers.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.full_name,
      role: user.role,
      status: "active",
      isCompanyAdmin: user.is_company_admin,
      joinedAt: user.created_at ? user.created_at.split("T")[0] : null, // Format date to YYYY-MM-DD
    }))

    // Format pending invitations
    const formattedPendingInvitations = pendingInvitations.map((invitation) => ({
      id: invitation.id,
      email: invitation.email,
      role: invitation.role,
      status: "pending",
      invitedAt: invitation.created_at ? invitation.created_at.split("T")[0] : null, // Format date to YYYY-MM-DD
      emailSentAt: invitation.email_sent_at ? invitation.email_sent_at.split("T")[0] : null,
    }))

    // Format revoked invitations
    const formattedRevokedInvitations = revokedInvitations.map((invitation) => ({
      id: invitation.id,
      email: invitation.email,
      role: invitation.role,
      status: "revoked",
      invitedAt: invitation.created_at ? invitation.created_at.split("T")[0] : null, // Format date to YYYY-MM-DD
      revokedAt: invitation.updated_at ? invitation.updated_at.split("T")[0] : null, // When the invitation was revoked
    }))

    // Combine all sets of team members
    const teamMembers = [...formattedActiveUsers, ...formattedPendingInvitations, ...formattedRevokedInvitations]

    return {
      success: true,
      teamMembers,
      stats: {
        active: formattedActiveUsers.length,
        pending: formattedPendingInvitations.length,
        revoked: formattedRevokedInvitations.length,
        total: teamMembers.length,
      },
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to fetch team members",
    }
  }
}

/**
 * Handles the API request to fetch team members
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
async function handleFetchTeamMembersRequest(req, res) {
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

    // Call the fetchTeamMembers function
    const result = await fetchTeamMembers(userId)

    if (!result.success) {
      return res.status(400).json({ error: result.error })
    }

    return res.status(200).json({
      success: true,
      teamMembers: result.teamMembers || [],
      stats: result.stats || {
        active: 0,
        pending: 0,
        revoked: 0,
        total: 0,
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      teamMembers: [],
      stats: {
        active: 0,
        pending: 0,
        revoked: 0,
        total: 0,
      },
    })
  }
}

module.exports = {
  fetchTeamMembers,
  handleFetchTeamMembersRequest,
}