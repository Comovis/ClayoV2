const { supabaseAdmin } = require("../../SupabaseClient")

/**
 * Handle getting agent status
 */
async function handleGetAgentStatus(req, res) {
  try {
    const { agentId } = req.params
    const organizationId = req.user.organization_id

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        error: "Organization ID not found",
      })
    }

    // Get agent details
    const { data: agentData, error: agentError } = await supabaseAdmin
      .from("ai_agents")
      .select("name, status, settings")
      .eq("id", agentId)
      .eq("organization_id", organizationId)
      .single()

    if (agentError || !agentData) {
      console.error("Error fetching agent:", agentError)
      return res.status(404).json({
        success: false,
        error: "Agent not found",
      })
    }

    // Get active sessions count
    const { count: activeSessions } = await supabaseAdmin
      .from("conversation_sessions")
      .select("*", { count: "exact", head: true })
      .eq("agent_id", agentId)
      .eq("organization_id", organizationId)
      .eq("status", "active")

    // Get knowledge items count
    const { count: knowledgeItems } = await supabaseAdmin
      .from("knowledge_base")
      .select("*", { count: "exact", head: true })
      .eq("agent_id", agentId)
      .eq("organization_id", organizationId)
      .eq("processing_status", "completed")

    // Determine if agent is fully configured
    const isConfigured = Boolean(
      agentData.settings?.model && agentData.settings?.responseLength && agentData.settings?.formalityLevel,
    )

    res.status(200).json({
      success: true,
      status: {
        agentName: agentData.name,
        agentStatus: agentData.status || "inactive",
        activeSessions: activeSessions || 0,
        knowledgeItems: knowledgeItems || 0,
        lastUpdated: new Date().toISOString(),
        isConfigured: isConfigured,
      },
    })
  } catch (error) {
    console.error("Get agent status error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to fetch agent status",
    })
  }
}

module.exports = {
  handleGetAgentStatus,
}
