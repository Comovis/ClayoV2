const { supabaseAdmin } = require("../../SupabaseClient")

/**
 * Handle getting chat sessions for an agent
 */
async function handleGetAgentSessions(req, res) {
  try {
    const { agentId } = req.params
    const organizationId = req.user.organization_id
    const { limit = 50, offset = 0 } = req.query

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        error: "Organization ID not found",
      })
    }

    const { data: sessions, error } = await supabaseAdmin
      .from("conversation_sessions")
      .select(`
        *,
        messages(count)
      `)
      .eq("agent_id", agentId)
      .eq("organization_id", organizationId)
      .order("updated_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    res.status(200).json({
      success: true,
      sessions,
    })
  } catch (error) {
    console.error("Get sessions error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to fetch chat sessions",
    })
  }
}

/**
 * Handle getting messages for a specific session
 */
async function handleGetSessionMessages(req, res) {
  try {
    const { sessionId } = req.params
    const organizationId = req.user.organization_id
    const { limit = 100 } = req.query

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        error: "Organization ID not found",
      })
    }

    // Verify session belongs to organization
    const { data: session, error: sessionError } = await supabaseAdmin
      .from("conversation_sessions")
      .select("id")
      .eq("id", sessionId)
      .eq("organization_id", organizationId)
      .single()

    if (sessionError || !session) {
      return res.status(404).json({
        success: false,
        error: "Session not found",
      })
    }

    const { data: messages, error } = await supabaseAdmin
      .from("messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true })
      .limit(limit)

    if (error) throw error

    res.status(200).json({
      success: true,
      messages,
    })
  } catch (error) {
    console.error("Get messages error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to fetch messages",
    })
  }
}

module.exports = {
  handleGetAgentSessions,
  handleGetSessionMessages,
}