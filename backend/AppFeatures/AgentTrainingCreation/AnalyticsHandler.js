const { supabaseAdmin } = require("../../SupabaseClient")

/**
 * Handle getting agent analytics
 */
async function handleGetAgentAnalytics(req, res) {
  try {
    const { agentId } = req.params
    const organizationId = req.user.organization_id
    const { period = "7d" } = req.query

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        error: "Organization ID not found",
      })
    }

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()

    switch (period) {
      case "24h":
        startDate.setHours(startDate.getHours() - 24)
        break
      case "7d":
        startDate.setDate(startDate.getDate() - 7)
        break
      case "30d":
        startDate.setDate(startDate.getDate() - 30)
        break
      default:
        startDate.setDate(startDate.getDate() - 7)
    }

    // Get session count
    const { count: sessionCount } = await supabaseAdmin
      .from("conversation_sessions")
      .select("*", { count: "exact", head: true })
      .eq("agent_id", agentId)
      .eq("organization_id", organizationId)
      .gte("created_at", startDate.toISOString())

    // First, get the session IDs for this agent
    const { data: sessionData, error: sessionError } = await supabaseAdmin
      .from("conversation_sessions")
      .select("id")
      .eq("agent_id", agentId)
      .eq("organization_id", organizationId)

    if (sessionError) {
      console.error("Error fetching session IDs:", sessionError)
      return res.status(500).json({
        success: false,
        error: "Failed to fetch session data",
      })
    }

    // Extract session IDs into an array
    const sessionIds = sessionData?.map((session) => session.id) || []

    // Get message count - only if we have session IDs
    let messageCount = 0
    if (sessionIds.length > 0) {
      const { count } = await supabaseAdmin
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("organization_id", organizationId)
        .gte("created_at", startDate.toISOString())
        .in("session_id", sessionIds)

      messageCount = count || 0
    }

    // Get knowledge base usage
    const { count: knowledgeCount } = await supabaseAdmin
      .from("knowledge_base")
      .select("*", { count: "exact", head: true })
      .eq("agent_id", agentId)
      .eq("organization_id", organizationId)
      .eq("processing_status", "completed")

    // Calculate additional analytics
    const totalConversations = sessionCount || 0
    const totalMessages = messageCount || 0
    const avgMessagesPerSession = totalConversations > 0 ? Math.round(totalMessages / totalConversations) : 0

    // Get more detailed analytics
    const { data: conversationData } = await supabaseAdmin
      .from("conversation_sessions")
      .select(`
        id,
        status,
        created_at,
        updated_at
      `)
      .eq("agent_id", agentId)
      .eq("organization_id", organizationId)
      .gte("created_at", startDate.toISOString())

    // Calculate response times and other metrics
    const activeConversations = conversationData?.filter((conv) => conv.status === "active").length || 0

    // Mock some additional analytics data (you can enhance these based on your actual data)
    const analytics = {
      period,
      totalConversations,
      activeConversations,
      totalMessages,
      knowledgeItems: knowledgeCount || 0,
      avgMessagesPerSession,
      averageResponseTime: 2.5, // You can calculate this from actual message timestamps
      customerSatisfaction: 85, // You can calculate this from feedback data
      resolutionRate: 78, // Calculate from resolved conversations
      escalationRate: 12, // Calculate from escalated conversations
      knowledgeBaseUsage: knowledgeCount > 0 ? 65 : 0, // Percentage of queries that used KB
      dailyStats: [], // You can populate this with daily breakdown
      topQuestions: [], // You can populate this with most common questions
      performanceMetrics: {
        accuracy: 82,
        helpfulness: 88,
        efficiency: 75,
      },
    }

    res.status(200).json({
      success: true,
      analytics,
    })
  } catch (error) {
    console.error("Get analytics error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to fetch analytics",
    })
  }
}

module.exports = {
  handleGetAgentAnalytics,
}
