const { supabaseAdmin } = require("../../SupabaseClient")
const { sendInvitationEmail } = require("./SendInviteEmail")

/**
 * Creates a team invitation and sends an email
 * @param {string} email - The invitee's email
 * @param {string} role - The role to assign
 * @param {string} userId - The inviter's user ID
 * @returns {Promise<Object>} Result of the operation
 */
async function createAndSendInvitation(email, role, userId) {
  try {
    // Debug log to check if supabaseAdmin is properly initialized
    console.log("Supabase admin status:", supabaseAdmin ? "Initialized" : "Not initialized")

    if (!supabaseAdmin) {
      throw new Error("Supabase admin client is not initialized")
    }

    // Step 1: Create the invitation in the database using RPC
    const { data: invitationId, error: invitationError } = await supabaseAdmin.rpc("create_team_invitation", {
      p_email: email,
      p_role: role,
      p_user_id: userId,
    })

    if (invitationError) {
      console.error("Error creating invitation:", invitationError)
      return { success: false, error: invitationError }
    }

    // Step 2: Get the invitation details
    const { data: invitation, error: fetchError } = await supabaseAdmin
      .from("team_invitations")
      .select(`
        id,
        email,
        role,
        invitation_token,
        company_id,
        invited_by
      `)
      .eq("id", invitationId)
      .single()

    if (fetchError || !invitation) {
      console.error("Error fetching invitation:", fetchError)
      return { success: false, error: "Failed to fetch invitation details" }
    }

    // Step 3: Get the inviter's details
    const { data: inviter, error: inviterError } = await supabaseAdmin
      .from("users")
      .select("name")
      .eq("id", invitation.invited_by)
      .single()

    if (inviterError) {
      console.error("Error fetching inviter:", inviterError)
    }

    // Step 4: Get the company details
    const { data: company, error: companyError } = await supabaseAdmin
      .from("companies")
      .select("name")
      .eq("id", invitation.company_id)
      .single()

    if (companyError) {
      console.error("Error fetching company:", companyError)
    }

    // Step 5: Generate the invitation link using environment detection
    // Check if we're in development mode
    const isDevelopment = process.env.NODE_ENV === "development"

    // Set the base URL based on environment
    const baseUrl = isDevelopment ? "http://localhost:1601" : "https://comovis.co"

    // Use the route that matches App.tsx
    const invitationLink = `${baseUrl}/accept-invite?token=${invitation.invitation_token}`

    console.log(`Using invitation URL: ${invitationLink} (${isDevelopment ? "development" : "production"} mode)`)

    // Step 6: Send the invitation email
    const emailResult = await sendInvitationEmail(
      invitation.email,
      invitationLink,
      inviter?.name || "A team administrator",
      company?.name || "Comovis",
      invitation.role,
    )

    if (!emailResult.success) {
      return { success: false, error: emailResult.error }
    }

    // Step 7: Update the invitation record to mark email as sent
    if (supabaseAdmin) {
      try {
        const { error: updateError } = await supabaseAdmin
          .from("team_invitations")
          .update({
            email_sent: true,
            email_sent_at: new Date().toISOString(),
          })
          .eq("id", invitationId)

        if (updateError) {
          console.error("Error updating invitation:", updateError)
        }
      } catch (err) {
        console.error("Error updating email_sent status:", err)
      }
    }

    return { success: true, invitationId, messageId: emailResult.messageId }
  } catch (error) {
    console.error("Error in createAndSendInvitation:", error)
    return { success: false, error: error.message || "An unexpected error occurred" }
  }
}

/**
 * Accepts a team invitation
 * @param {string} token - The invitation token
 * @param {string} userId - The user ID accepting the invitation
 * @param {string} name - The user's full name (optional)
 * @returns {Promise<Object>} Result of the operation
 */
async function acceptInvitation(token, userId, name = null) {
  try {
    if (!supabaseAdmin) {
      throw new Error("Supabase admin client is not initialized")
    }

    const { data: success, error } = await supabaseAdmin.rpc("accept_team_invitation", {
      p_invitation_token: token,
      p_user_id: userId,
      p_name: name, // Pass the name parameter
    })

    if (error) {
      console.error("Error accepting invitation:", error)
      return { success: false, error: error.message }
    }

    if (!success) {
      return { success: false, error: "Invitation not found or expired" }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in acceptInvitation:", error)
    return { success: false, error: error.message || "An unexpected error occurred" }
  }
}

/**
 * Gets invitation details by token
 * @param {string} token - The invitation token
 * @returns {Promise<Object>} Invitation details
 */
async function getInvitationByToken(token) {
  try {
    if (!supabaseAdmin) {
      throw new Error("Supabase admin client is not initialized")
    }

    const { data, error } = await supabaseAdmin
      .from("team_invitations")
      .select(`
        id,
        email,
        role,
        invitation_token,
        company_id,
        invited_by,
        companies(name),
        users!team_invitations_invited_by_fkey(name)
      `)
      .eq("invitation_token", token)
      .eq("invitation_status", "pending")
      .gt("expires_at", new Date().toISOString())
      .single()

    if (error) {
      console.error("Error fetching invitation:", error)
      return { success: false, error: error.message }
    }

    if (!data) {
      return { success: false, error: "Invitation not found or expired" }
    }

    return {
      success: true,
      invitation: {
        id: data.id,
        email: data.email,
        role: data.role,
        token: data.invitation_token,
        companyId: data.company_id,
        invitedBy: data.invited_by,
        companyName: data.companies?.name || "Comovis",
        inviterName: data.users?.name || "A team administrator",
      },
    }
  } catch (error) {
    console.error("Error in getInvitationByToken:", error)
    return { success: false, error: error.message || "An unexpected error occurred" }
  }
}

/**
 * Completes the onboarding process for a user
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} Result of the operation
 */
async function completeOnboarding(userId) {
  try {
    if (!supabaseAdmin) {
      throw new Error("Supabase admin client is not initialized")
    }

    const { data: success, error } = await supabaseAdmin.rpc("complete_onboarding", {
      p_user_id: userId,
    })

    if (error) {
      console.error("Error completing onboarding:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in completeOnboarding:", error)
    return { success: false, error: error.message || "An unexpected error occurred" }
  }
}

module.exports = {
  createAndSendInvitation,
  acceptInvitation,
  getInvitationByToken,
  completeOnboarding,
}
