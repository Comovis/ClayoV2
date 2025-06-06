const { supabaseAdmin } = require("../../SupabaseClient")
const { getOpenAIModel } = require("../ModelConnection")
const { getAllKnowledgeForOrganization } = require("./FileKnowledgeService")
const { generateText } = require("ai")

// ===== CORE SERVICE FUNCTIONS =====

/**
 * Get agent configuration from database
 * @param {string} agentId - Agent ID
 * @returns {Promise<Object>} - Agent configuration
 */
async function getAgentConfiguration(agentId) {
  try {
    const { data, error } = await supabaseAdmin.from("ai_agents").select("*").eq("id", agentId).single()

    if (error) throw error

    return {
      success: true,
      config: data,
    }
  } catch (error) {
    console.error("Error fetching agent configuration:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Update agent configuration
 * @param {string} agentId - Agent ID
 * @param {Object} updates - Configuration updates
 * @param {string} organizationId - Organization ID
 * @returns {Promise<Object>} - Updated agent
 */
async function updateAgentConfiguration(agentId, updates, organizationId) {
  try {
    // Validate that agent belongs to organization
    const { data: existingAgent, error: checkError } = await supabaseAdmin
      .from("ai_agents")
      .select("id")
      .eq("id", agentId)
      .eq("organization_id", organizationId)
      .single()

    if (checkError || !existingAgent) {
      throw new Error("Agent not found or does not belong to this organization")
    }

    // Update agent configuration
    const { data, error } = await supabaseAdmin
      .from("ai_agents")
      .update({
        name: updates.name,
        personality: updates.personality,
        language: updates.language,
        capabilities: updates.capabilities,
        response_templates: updates.responseTemplates || {},
        settings: {
          responseLength: updates.settings?.responseLength,
          formalityLevel: updates.settings?.formalityLevel,
          customInstructions: updates.settings?.customInstructions,
          temperature: updates.settings?.temperature,
          maxTokens: updates.settings?.maxTokens,
          model: updates.settings?.model,
        },
        updated_at: new Date().toISOString(),
      })
      .eq("id", agentId)
      .select()
      .single()

    if (error) throw error

    return {
      success: true,
      agent: data,
    }
  } catch (error) {
    console.error("Error updating agent configuration:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Build system prompt based on agent configuration
 * @param {Object} agent - Agent configuration
 * @param {string} knowledge - Knowledge base content
 * @returns {string} - System prompt
 */
function buildSystemPrompt(agent, knowledge = "") {
  let systemPrompt = `You are ${agent.name}, an AI assistant with the following characteristics:\n\n`

  // Personality
  systemPrompt += `PERSONALITY: ${agent.personality || "friendly"}\n`
  systemPrompt += `LANGUAGE: ${agent.language || "en"}\n`

  // Response length and formality from settings
  const settings = agent.settings || {}
  if (settings.responseLength) {
    systemPrompt += `RESPONSE LENGTH: ${settings.responseLength}\n`
  }

  if (settings.formalityLevel) {
    systemPrompt += `FORMALITY LEVEL: ${settings.formalityLevel}\n`
  }

  systemPrompt += "\n"

  // Capabilities
  if (agent.capabilities && agent.capabilities.length > 0) {
    systemPrompt += `CAPABILITIES: You can help with: ${agent.capabilities.join(", ")}\n\n`
  }

  // Custom instructions from settings
  if (settings.customInstructions) {
    systemPrompt += `SPECIAL INSTRUCTIONS: ${settings.customInstructions}\n\n`
  }

  // Response templates
  const templates = agent.response_templates || {}
  systemPrompt += `RESPONSE TEMPLATES:\n`
  systemPrompt += `- Greeting: "${templates.greeting || "Hello! How can I help you today?"}"\n`
  systemPrompt += `- Escalation: "${templates.escalation || "I'll connect you with a human agent who can better assist you."}"\n`
  systemPrompt += `- Closing: "${templates.closing || "Is there anything else I can help you with?"}"\n\n`

  // Knowledge base
  if (knowledge) {
    systemPrompt += `KNOWLEDGE BASE:\nUse the following information to answer questions accurately:\n\n${knowledge}\n\n`
  }

  // Behavior guidelines
  systemPrompt += `BEHAVIOR GUIDELINES:\n`
  systemPrompt += `- Always stay in character based on your personality\n`
  systemPrompt += `- Use the knowledge base to provide accurate information\n`
  systemPrompt += `- If you don't know something, admit it honestly\n`
  systemPrompt += `- Use the appropriate response template when needed\n`

  return systemPrompt
}

/**
 * Get AI model parameters based on configuration
 * @param {Object} agent - Agent configuration
 * @returns {Object} - Model parameters
 */
function getModelParameters(agent) {
  const settings = agent.settings || {}

  // Map personality to temperature
  const temperatureMap = {
    friendly: 0.7,
    professional: 0.3,
    helpful: 0.5,
    enthusiastic: 0.8,
  }

  // Map response length to max tokens
  const maxTokensMap = {
    short: 150,
    medium: 300,
    long: 500,
  }

  return {
    temperature: settings.temperature || temperatureMap[agent.personality] || 0.7,
    maxTokens: settings.maxTokens || maxTokensMap[settings.responseLength] || 300,
    model: settings.model || "gpt-4o-mini",
  }
}

/**
 * Prepare agent for chat
 * @param {string} agentId - Agent ID
 * @param {string} organizationId - Organization ID
 * @returns {Promise<Object>} - Prepared agent
 */
async function prepareAgentForChat(agentId, organizationId) {
  try {
    // Get agent configuration
    const agentResult = await getAgentConfiguration(agentId)
    if (!agentResult.success) {
      throw new Error(agentResult.error)
    }

    const agent = agentResult.config

    // Validate agent belongs to organization
    if (agent.organization_id !== organizationId) {
      throw new Error("Agent does not belong to this organization")
    }

    // Get agent's knowledge base
    const knowledgeResult = await getAllKnowledgeForOrganization(organizationId, agentId)
    const knowledge = knowledgeResult.success ? knowledgeResult.combinedContent : ""

    // Build system prompt
    const systemPrompt = buildSystemPrompt(agent, knowledge)

    // Get model parameters
    const modelParams = getModelParameters(agent)

    // Get OpenAI model
    const model = getOpenAIModel(modelParams.model)

    return {
      success: true,
      agent,
      systemPrompt,
      modelParams,
      model,
    }
  } catch (error) {
    console.error("Error preparing agent for chat:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Test agent configuration with a sample message using actual AI
 * @param {string} agentId - Agent ID
 * @param {string} organizationId - Organization ID
 * @param {string} testMessage - Test message
 * @returns {Promise<Object>} - Test result
 */
async function testAgentConfiguration(agentId, organizationId, testMessage = "Hello, can you help me?") {
  try {
    console.log("🧪 Starting agent configuration test...")

    // Prepare agent for chat
    const preparedAgent = await prepareAgentForChat(agentId, organizationId)
    if (!preparedAgent.success) {
      throw new Error(preparedAgent.error)
    }

    const { agent, systemPrompt, modelParams, model } = preparedAgent

    console.log("Testing agent configuration:", {
      agentName: agent.name,
      personality: agent.personality,
      temperature: modelParams.temperature,
      maxTokens: modelParams.maxTokens,
      model: modelParams.model,
      systemPromptLength: systemPrompt.length,
    })

    // Actually test with the AI model
    console.log("🤖 Generating AI response...")
    const { text: aiResponse } = await generateText({
      model: model,
      system: systemPrompt,
      prompt: testMessage,
      temperature: modelParams.temperature,
      maxTokens: modelParams.maxTokens,
    })

    console.log("✅ AI response generated successfully")

    const testResponse = {
      message: testMessage,
      response: aiResponse,
      config: {
        personality: agent.personality,
        temperature: modelParams.temperature,
        maxTokens: modelParams.maxTokens,
        model: modelParams.model,
        responseLength: agent.settings?.responseLength || "medium",
        formalityLevel: agent.settings?.formalityLevel || "balanced",
      },
      systemPromptLength: systemPrompt.length,
      knowledgeBaseItems: preparedAgent.agent.knowledge_items?.length || 0,
      timestamp: new Date().toISOString(),
    }

    return {
      success: true,
      testResult: testResponse,
    }
  } catch (error) {
    console.error("❌ Error testing agent configuration:", error)

    // Return detailed error information
    return {
      success: false,
      error: error.message,
      testResult: {
        message: testMessage,
        response: `Test failed: ${error.message}`,
        config: {},
        error: true,
        timestamp: new Date().toISOString(),
      },
    }
  }
}

// ===== HTTP REQUEST HANDLERS =====

/**
 * Handle getting agent configuration
 */
async function handleGetAgentConfig(req, res) {
  try {
    const { agentId } = req.params
    const organizationId = req.user.organization_id

    if (!agentId) {
      return res.status(400).json({
        success: false,
        error: "Agent ID is required",
      })
    }

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        error: "Organization ID not found",
      })
    }

    // Get agent configuration
    const result = await getAgentConfiguration(agentId)
    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error,
      })
    }

    // Validate agent belongs to organization
    if (result.config.organization_id !== organizationId) {
      return res.status(403).json({
        success: false,
        error: "Agent does not belong to this organization",
      })
    }

    res.status(200).json({
      success: true,
      config: result.config,
    })
  } catch (error) {
    console.error("Handle get agent config error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to get agent configuration",
    })
  }
}

/**
 * Handle updating agent configuration
 */
async function handleUpdateAgentConfig(req, res) {
  try {
    const { agentId } = req.params
    const updates = req.body
    const organizationId = req.user.organization_id

    if (!agentId) {
      return res.status(400).json({
        success: false,
        error: "Agent ID is required",
      })
    }

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        error: "Organization ID not found",
      })
    }

    console.log("Updating agent configuration:", {
      agentId,
      organizationId,
      updates: Object.keys(updates),
    })

    // Update agent configuration
    const result = await updateAgentConfiguration(agentId, updates, organizationId)
    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error,
      })
    }

    console.log("Agent configuration updated successfully")

    res.status(200).json({
      success: true,
      message: "Agent configuration updated successfully",
      agent: result.agent,
    })
  } catch (error) {
    console.error("Handle update agent config error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to update agent configuration",
    })
  }
}

/**
 * Handle testing agent configuration
 */
async function handleTestAgentConfig(req, res) {
  try {
    const { agentId } = req.params
    const { testMessage } = req.body
    const organizationId = req.user.organization_id

    if (!agentId) {
      return res.status(400).json({
        success: false,
        error: "Agent ID is required",
      })
    }

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        error: "Organization ID not found",
      })
    }

    console.log("Testing agent configuration:", {
      agentId,
      organizationId,
      testMessage: testMessage || "Default test message",
    })

    // Test agent configuration
    const result = await testAgentConfiguration(agentId, organizationId, testMessage)

    // Always return 200 with the result, even if the test failed
    res.status(200).json({
      success: result.success,
      message: result.success ? "Agent configuration test completed" : "Agent configuration test failed",
      testResult: result.testResult,
      error: result.error || null,
    })
  } catch (error) {
    console.error("Handle test agent config error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to test agent configuration",
      testResult: {
        message: "System error",
        response: "Failed to run test due to system error",
        error: true,
        timestamp: new Date().toISOString(),
      },
    })
  }
}

/**
 * Handle getting agent's prepared chat configuration
 */
async function handlePrepareAgentForChat(req, res) {
  try {
    const { agentId } = req.params
    const organizationId = req.user.organization_id

    if (!agentId) {
      return res.status(400).json({
        success: false,
        error: "Agent ID is required",
      })
    }

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        error: "Organization ID not found",
      })
    }

    console.log("Preparing agent for chat:", {
      agentId,
      organizationId,
    })

    // Prepare agent for chat
    const result = await prepareAgentForChat(agentId, organizationId)
    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error,
      })
    }

    console.log("Agent prepared for chat successfully")

    // Return prepared configuration (without sensitive data)
    res.status(200).json({
      success: true,
      message: "Agent prepared for chat",
      config: {
        agentName: result.agent.name,
        personality: result.agent.personality,
        language: result.agent.language,
        capabilities: result.agent.capabilities,
        modelParams: result.modelParams,
        systemPromptLength: result.systemPrompt.length,
      },
    })
  } catch (error) {
    console.error("Handle prepare agent for chat error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to prepare agent for chat",
    })
  }
}

module.exports = {
  // Core service functions
  getAgentConfiguration,
  updateAgentConfiguration,
  buildSystemPrompt,
  getModelParameters,
  prepareAgentForChat,
  testAgentConfiguration,

  // HTTP request handlers
  handleGetAgentConfig,
  handleUpdateAgentConfig,
  handleTestAgentConfig,
  handlePrepareAgentForChat,
}
