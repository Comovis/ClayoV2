const { supabaseAdmin } = require("../SupabaseClient")

/**
 * Fetches all team members (active users, pending and revoked invitations) for a company
 * @param {string} userId - ID of the user making the request
 * @returns {Promise<Object>} Result containing team members data
 */
async function fetchTeamMembers(userId) {
  try {
    console.log(`[fetchTeamMembers] Starting team data fetch for user: ${userId}`)

    if (!userId) {
      console.error("[fetchTeamMembers] No user ID provided")
      throw new Error("User ID is required")
    }

    // First, get the user's company ID
    console.log(`[fetchTeamMembers] Fetching company information for user: ${userId}`)
    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select("company_id, role, is_company_admin")
      .eq("id", userId)
      .single()

    if (userError) {
      console.error(`[fetchTeamMembers] Error fetching user data: ${userError.message}`)
      throw new Error("Failed to verify user company")
    }

    if (!userData || !userData.company_id) {
      console.error(`[fetchTeamMembers] User ${userId} does not belong to a company`)
      throw new Error("User does not belong to a company")
    }

    const companyId = userData.company_id
    console.log(`[fetchTeamMembers] User ${userId} belongs to company: ${companyId}`)

    // Fetch active users from the same company
    console.log(`[fetchTeamMembers] Fetching active users for company: ${companyId}`)
    const { data: activeUsers, error: activeUsersError } = await supabaseAdmin
      .from("users")
      .select("id, email, full_name, role, is_company_admin, created_at")
      .eq("company_id", companyId)

    if (activeUsersError) {
      console.error(`[fetchTeamMembers] Error fetching active users: ${activeUsersError.message}`)
      throw new Error("Failed to fetch active team members")
    }

    console.log(`[fetchTeamMembers] Found ${activeUsers.length} active users for company: ${companyId}`)

    // Fetch all invitations (pending and revoked) for the company
    console.log(`[fetchTeamMembers] Fetching invitations for company: ${companyId}`)
    const { data: invitations, error: invitationsError } = await supabaseAdmin
      .from("team_invitations")
      .select("id, email, role, invitation_status, created_at, email_sent_at, updated_at")
      .eq("company_id", companyId)
      .in("invitation_status", ["pending", "revoked"])

    if (invitationsError) {
      console.error(`[fetchTeamMembers] Error fetching invitations: ${invitationsError.message}`)
      throw new Error("Failed to fetch team invitations")
    }

    const pendingInvitations = invitations.filter((inv) => inv.invitation_status === "pending")
    const revokedInvitations = invitations.filter((inv) => inv.invitation_status === "revoked")

    console.log(
      `[fetchTeamMembers] Found ${pendingInvitations.length} pending invitations and ${revokedInvitations.length} revoked invitations for company: ${companyId}`,
    )

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

    console.log(`[fetchTeamMembers] Successfully fetched ${teamMembers.length} team members for company: ${companyId}`)
    console.log(
      `[fetchTeamMembers] Team members breakdown: ${formattedActiveUsers.length} active, ${formattedPendingInvitations.length} pending, ${formattedRevokedInvitations.length} revoked`,
    )

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
    console.error(`[fetchTeamMembers] Error: ${error.message}`, error)
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
  console.log("[handleFetchTeamMembersRequest] Received request to fetch team members")

  try {
    // Verify authentication
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("[handleFetchTeamMembersRequest] Missing or invalid authorization header")
      return res.status(401).json({ error: "Unauthorized" })
    }

    // Extract user ID from the authenticated user object
    const userId = req.user?.user_id
    if (!userId) {
      console.error("[handleFetchTeamMembersRequest] User ID not found in authenticated session")
      return res.status(401).json({ error: "User ID not found in authenticated session" })
    }

    console.log(`[handleFetchTeamMembersRequest] Fetching team members for user: ${userId}`)

    // Call the fetchTeamMembers function
    const result = await fetchTeamMembers(userId)

    if (!result.success) {
      console.error(`[handleFetchTeamMembersRequest] Error fetching team members: ${result.error}`)
      return res.status(400).json({ error: result.error })
    }

    console.log(`[handleFetchTeamMembersRequest] Successfully fetched ${result.teamMembers.length} team members`)

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
    console.error(`[handleFetchTeamMembersRequest] Unhandled error: ${error.message}`, error)
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
