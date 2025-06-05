const { supabaseAdmin } = require("../../SupabaseClient")
const { v4: uuidv4 } = require("uuid")

/**
 * Creates a new AI agent
 * @param {Object} agentData - Agent data
 * @returns {Promise<Object>} - Creation result
 */
async function createAgent(agentData) {
  try {
    const agent = {
      id: uuidv4(),
      organization_id: agentData.organizationId,
      name: agentData.name,
      description: agentData.description,
      personality: agentData.personality || "friendly",
      language: agentData.language || "en",
      use_case: agentData.useCase || "customer-support",
      capabilities: agentData.capabilities || [],
      response_templates: agentData.responseTemplates || {},
      settings: agentData.settings || {},
      created_by: agentData.createdBy,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabaseAdmin.from("ai_agents").insert(agent).select().single()

    if (error) throw error

    console.log(`Created new agent: ${agent.name} for organization ${agent.organization_id}`)

    return { success: true, agent: data }
  } catch (error) {
    console.error("Create agent error:", error)
    return { success: false, error: error.message }
  }
}

/**
 * Gets AI agents for an organization
 * @param {string} organizationId - Organization ID
 * @returns {Promise<Object>} - Agents list
 */
async function getAgents(organizationId) {
  try {
    const { data, error } = await supabaseAdmin
      .from("ai_agents")
      .select("*")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false })

    if (error) throw error

    return { success: true, agents: data }
  } catch (error) {
    console.error("Get agents error:", error)
    return { success: false, error: error.message }
  }
}

/**
 * Updates an AI agent
 * @param {string} agentId - Agent ID
 * @param {Object} updateData - Update data
 * @param {string} organizationId - Organization ID
 * @returns {Promise<Object>} - Update result
 */
async function updateAgent(agentId, updateData, organizationId) {
  try {
    const { data, error } = await supabaseAdmin
      .from("ai_agents")
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", agentId)
      .eq("organization_id", organizationId)
      .select()
      .single()

    if (error) throw error

    return { success: true, agent: data }
  } catch (error) {
    console.error("Update agent error:", error)
    return { success: false, error: error.message }
  }
}

module.exports = {
  createAgent,
  getAgents,
  updateAgent,
}
