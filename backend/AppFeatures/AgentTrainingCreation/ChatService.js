const { streamText } = require("ai")
const { getOpenAIModel } = require("../ModelConnection")
const { getAllKnowledgeForOrganization } = require("./FileKnowledgeService")
const { supabaseAdmin } = require("../../SupabaseClient")
const { v4: uuidv4 } = require("uuid")

// ===== CORE SERVICE FUNCTIONS =====

/**
 * Enhanced chat message processing with FIXED streaming
 * @param {Object} params - Message parameters
 * @returns {Promise<Object>} - Chat result
 */
async function processMessage({ message, sessionId, agentId, organizationId, onChunk }) {
  try {
    console.log(`Processing message for agent ${agentId} in organization ${organizationId}`)

    // Steps 1-8 remain the same...
    const previousMessages = await getSessionMessages(sessionId)
    const knowledgeResult = await getAllKnowledgeForOrganization(organizationId, agentId)

    if (!knowledgeResult.success) {
      throw new Error("Failed to retrieve knowledge base")
    }

    const agentConfig = await getAgentWithSettings(agentId, organizationId)
    if (!agentConfig) {
      throw new Error("Agent configuration not found")
    }

    const systemPrompt = buildEnhancedSystemPrompt(agentConfig, knowledgeResult.combinedContent)
    const modelParams = getModelParameters(agentConfig)
    const messages = [...previousMessages, { role: "user", content: message }]
    const model = getOpenAIModel(modelParams.model)

    // Save user message first
    await saveMessage(sessionId, message, "customer", organizationId)
    console.log("✅ User message saved")

    console.log("🤖 Starting AI text generation with FIXED streaming...")

    let fullResponse = ""
    let chunkCount = 0

    try {
      // FIXED: Use the correct AI SDK streaming pattern
      const result = await streamText({
        model,
        system: systemPrompt,
        messages,
        maxTokens: modelParams.maxTokens,
        temperature: modelParams.temperature,
      })

      console.log("🚀 streamText result created, starting to read stream...")

      // FIXED: Read the stream properly
      for await (const chunk of result.textStream) {
        chunkCount++
        console.log(`📦 Chunk ${chunkCount}:`, chunk.substring(0, 50) + "...")

        // Send chunk to client
        onChunk(chunk)
        fullResponse += chunk
      }

      console.log("🎯 Stream reading completed")
      console.log("📊 Total chunks received:", chunkCount)
      console.log("🤖 Full response length:", fullResponse.length)
      console.log("🤖 Full response preview:", fullResponse.substring(0, 100) + "...")

      // Save AI response
      await saveMessage(sessionId, fullResponse, "ai", organizationId)
      console.log("✅ AI message saved")

      // Update session activity
      await updateSessionActivity(sessionId)

      return {
        response: fullResponse,
        sessionId,
        knowledgeItemsUsed: knowledgeResult.itemCount,
        agentConfig: {
          personality: agentConfig.personality,
          model: modelParams.model,
          temperature: modelParams.temperature,
        },
      }
    } catch (aiError) {
      console.error("❌ AI generation error:", aiError)
      console.error("❌ AI error stack:", aiError.stack)
      throw aiError
    }
  } catch (error) {
    console.error("❌ Chat processing error:", error)
    console.error("❌ Error stack:", error.stack)
    throw error
  }
}

/**
 * Enhanced system prompt builder with full agent configuration
 * @param {Object} agent - Full agent configuration
 * @param {string} knowledgeContent - Combined knowledge content
 * @returns {string} - Enhanced system prompt
 */
function buildEnhancedSystemPrompt(agent, knowledgeContent) {
  const settings = agent.settings || {}
  const templates = agent.response_templates || {}

  let systemPrompt = `You are ${agent.name}, an AI assistant with the following characteristics:\n\n`

  // Personality and behavior
  systemPrompt += `PERSONALITY: ${agent.personality || "friendly"}\n`
  systemPrompt += `LANGUAGE: ${agent.language || "en"}\n`

  // Response style from settings
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
  systemPrompt += `RESPONSE TEMPLATES:\n`
  systemPrompt += `- Greeting: "${templates.greeting || "Hello! How can I help you today?"}"\n`
  systemPrompt += `- Escalation: "${templates.escalation || "I'll connect you with a human agent who can better assist you."}"\n`
  systemPrompt += `- Closing: "${templates.closing || "Is there anything else I can help you with?"}"\n\n`

  // Knowledge base (your proven approach)
  if (knowledgeContent) {
    systemPrompt += `KNOWLEDGE BASE:\nUse the following information to answer questions accurately:\n\n${knowledgeContent}\n\n`
  }

  // Behavior guidelines
  systemPrompt += `BEHAVIOR GUIDELINES:\n`
  systemPrompt += `- Always stay in character based on your personality (${agent.personality})\n`
  systemPrompt += `- Use the knowledge base to provide accurate information\n`
  systemPrompt += `- If you don't know something, admit it honestly\n`
  systemPrompt += `- Use the appropriate response template when needed\n`
  systemPrompt += `- Match the specified formality level and response length\n`
  systemPrompt += `- Always reference the knowledge base when providing information\n`
  systemPrompt += `- If information isn't in the knowledge base, say "I don't have that information in my knowledge base"\n`

  return systemPrompt
}

/**
 * Get enhanced agent configuration with settings
 * @param {string} agentId - Agent ID
 * @param {string} organizationId - Organization ID for security
 * @returns {Promise<Object|null>} - Full agent configuration
 */
async function getAgentWithSettings(agentId, organizationId) {
  try {
    const { data, error } = await supabaseAdmin
      .from("ai_agents")
      .select("*")
      .eq("id", agentId)
      .eq("organization_id", organizationId)
      .single()

    if (error) throw error

    console.log(`Agent config loaded:`, {
      name: data.name,
      personality: data.personality,
      language: data.language,
      hasSettings: !!data.settings,
      hasTemplates: !!data.response_templates,
      capabilities: data.capabilities?.length || 0,
    })

    return data
  } catch (error) {
    console.error("Get agent with settings error:", error)
    return null
  }
}

/**
 * Get AI model parameters based on agent configuration
 * @param {Object} agent - Agent configuration
 * @returns {Object} - Model parameters
 */
function getModelParameters(agent) {
  const settings = agent.settings || {}

  const temperatureMap = {
    friendly: 0.7,
    professional: 0.3,
    helpful: 0.5,
    enthusiastic: 0.8,
  }

  const maxTokensMap = {
    short: 150,
    medium: 300,
    long: 500,
  }

  const params = {
    temperature: settings.temperature || temperatureMap[agent.personality] || 0.7,
    maxTokens: settings.maxTokens || maxTokensMap[settings.responseLength] || 300,
    model: settings.model || "gpt-4o-mini",
  }

  console.log(`Model parameters:`, params)
  return params
}

/**
 * Gets messages for a session - FIXED ENUM MAPPING
 * @param {string} sessionId - Session ID
 * @returns {Promise<Array>} - Messages
 */
async function getSessionMessages(sessionId) {
  try {
    const { data, error } = await supabaseAdmin
      .from("messages")
      .select("content, type")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true })
      .limit(10)

    if (error) throw error

    return data.map((msg) => ({
      role: msg.type === "customer" ? "user" : "assistant",
      content: msg.content,
    }))
  } catch (error) {
    console.error("Get session messages error:", error)
    return []
  }
}

/**
 * Enhanced message saving with organization tracking - FIXED ENUM VALUES
 * @param {string} sessionId - Session ID
 * @param {string} content - Message content
 * @param {string} messageType - Message type (customer/ai/agent/system)
 * @param {string} organizationId - Organization ID
 * @returns {Promise<void>}
 */
async function saveMessage(sessionId, content, messageType, organizationId) {
  try {
    const { error } = await supabaseAdmin.from("messages").insert({
      id: uuidv4(),
      session_id: sessionId,
      content,
      type: messageType,
      organization_id: organizationId,
      created_at: new Date().toISOString(),
    })

    if (error) throw error
    console.log(`✅ Message saved successfully as type: ${messageType}`)
  } catch (error) {
    console.error("Save message error:", error)
  }
}

/**
 * Update session last activity
 * @param {string} sessionId - Session ID
 * @returns {Promise<void>}
 */
async function updateSessionActivity(sessionId) {
  try {
    const { error } = await supabaseAdmin
      .from("conversation_sessions")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", sessionId)

    if (error) throw error
  } catch (error) {
    console.error("Update session activity error:", error)
  }
}

/**
 * Creates a new conversation session
 * @param {Object} params - Session parameters
 * @returns {Promise<Object>} - Session result
 */
async function createSession({ agentId, customerId, organizationId }) {
  try {
    const sessionData = {
      id: uuidv4(),
      organization_id: organizationId,
      agent_id: agentId,
      customer_id: customerId,
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabaseAdmin.from("conversation_sessions").insert(sessionData).select().single()

    if (error) throw error

    return { success: true, session: data }
  } catch (error) {
    console.error("Create session error:", error)
    return { success: false, error: error.message }
  }
}

// ===== HTTP REQUEST HANDLERS =====

/**
 * Handle public chat message requests (no authentication)
 */
async function handlePublicChatMessage(req, res) {
  try {
    console.log("🌐 Handling public chat message request...")
    const { message, sessionId, agentId, organizationId } = req.body

    if (!message || !sessionId || !agentId || !organizationId) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: message, sessionId, agentId, organizationId",
      })
    }

    // Verify agent is public
    const { data: agent, error: agentError } = await supabaseAdmin
      .from("ai_agents")
      .select("is_public")
      .eq("id", agentId)
      .eq("organization_id", organizationId)
      .single()

    if (agentError || !agent?.is_public) {
      return res.status(403).json({
        success: false,
        error: "Agent not available for public access",
      })
    }

    // FIXED: Set up proper streaming response headers
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
    })

    let fullResponse = ""
    let chunksSent = 0

    const result = await processMessage({
      message,
      sessionId,
      agentId,
      organizationId,
      onChunk: (chunk) => {
        chunksSent++
        console.log(`📤 Sending chunk ${chunksSent} to client:`, chunk.substring(0, 50) + "...")
        fullResponse += chunk

        // FIXED: Send as Server-Sent Events format
        res.write(`data: ${JSON.stringify({ type: "chunk", content: chunk })}\n\n`)
      },
    })

    // Send completion signal
    res.write(`data: ${JSON.stringify({ type: "complete" })}\n\n`)
    res.end()

    console.log("✅ Public chat message processed successfully:", {
      sessionId,
      agentId,
      knowledgeItemsUsed: result.knowledgeItemsUsed,
      responseLength: fullResponse.length,
      chunksSent,
    })
  } catch (error) {
    console.error("❌ Handle public chat message error:", error)
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: "Failed to process public chat message",
      })
    }
  }
}

/**
 * Handle authenticated chat message requests
 */
async function handleChatMessage(req, res) {
  try {
    const { message, sessionId, agentId } = req.body
    const organizationId = req.user.organization_id

    if (!message || !sessionId || !agentId) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: message, sessionId, agentId",
      })
    }

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        error: "Organization ID not found",
      })
    }

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    })

    let fullResponse = ""

    const result = await processMessage({
      message,
      sessionId,
      agentId,
      organizationId,
      onChunk: (chunk) => {
        fullResponse += chunk
        res.write(`data: ${JSON.stringify({ type: "chunk", content: chunk })}\n\n`)
      },
    })

    res.write(`data: ${JSON.stringify({ type: "complete" })}\n\n`)
    res.end()

    console.log("Chat message processed successfully:", {
      sessionId,
      agentId,
      knowledgeItemsUsed: result.knowledgeItemsUsed,
    })
  } catch (error) {
    console.error("Handle chat message error:", error)
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: "Failed to process chat message",
      })
    }
  }
}

/**
 * Handle authenticated chat session creation
 */
async function handleCreateChatSession(req, res) {
  try {
    const { agentId, customerId } = req.body
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

    const result = await createSession({
      agentId,
      customerId: customerId || null,
      organizationId,
    })

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error,
      })
    }

    res.status(201).json({
      success: true,
      session: result.session,
    })
  } catch (error) {
    console.error("Handle create chat session error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to create chat session",
    })
  }
}

/**
 * Handle public chat session creation
 */
async function handleCreatePublicChatSession(req, res) {
  try {
    const { agentId, organizationId, customerId } = req.body

    if (!agentId || !organizationId) {
      return res.status(400).json({
        success: false,
        error: "Agent ID and Organization ID are required",
      })
    }

    // Verify agent is public
    const { data: agent, error: agentError } = await supabaseAdmin
      .from("ai_agents")
      .select("is_public")
      .eq("id", agentId)
      .eq("organization_id", organizationId)
      .single()

    if (agentError || !agent?.is_public) {
      return res.status(403).json({
        success: false,
        error: "Agent not available for public access",
      })
    }

    const result = await createSession({
      agentId,
      customerId: customerId || null,
      organizationId,
    })

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error,
      })
    }

    res.status(201).json({
      success: true,
      session: result.session,
    })
  } catch (error) {
    console.error("Handle create public chat session error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to create public chat session",
    })
  }
}

module.exports = {
  // Core service functions
  processMessage,
  createSession,
  getSessionMessages,
  saveMessage,
  getAgentWithSettings,
  buildEnhancedSystemPrompt,
  getModelParameters,
  updateSessionActivity,

  // HTTP request handlers
  handleChatMessage,
  handlePublicChatMessage,
  handleCreateChatSession,
  handleCreatePublicChatSession,
}
