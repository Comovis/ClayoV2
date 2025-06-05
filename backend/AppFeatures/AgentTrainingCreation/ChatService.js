const { streamText } = require("ai")
const { getOpenAIModel } = require("../ModelConnection") // Using YOUR AI SDK connection
const { getAllKnowledgeForOrganization } = require("./FileKnowledgeService")
const { supabaseAdmin } = require("../../SupabaseClient")
const { v4: uuidv4 } = require("uuid")

/**
 * Processes a chat message using your proven direct approach
 * @param {Object} params - Message parameters
 * @returns {Promise<Object>} - Chat result
 */
async function processMessage({ message, sessionId, agentId, organizationId, onChunk }) {
  try {
    console.log(`Processing message for agent ${agentId} in organization ${organizationId}`)

    // Step 1: Get conversation history
    const previousMessages = await getSessionMessages(sessionId)

    // Step 2: Get ALL knowledge base content (your proven approach)
    const knowledgeResult = await getAllKnowledgeForOrganization(organizationId, agentId)

    if (!knowledgeResult.success) {
      throw new Error("Failed to retrieve knowledge base")
    }

    console.log(`Using ${knowledgeResult.itemCount} knowledge items as context`)

    // Step 3: Get agent configuration
    const agent = await getAgent(agentId)

    // Step 4: Build system prompt with FULL knowledge context
    const systemPrompt = buildSystemPrompt(agent, knowledgeResult.combinedContent)

    // Step 5: Prepare messages for AI (your proven pattern)
    const messages = [
      { role: "system", content: systemPrompt },
      ...previousMessages,
      { role: "user", content: message },
    ]

    // Step 6: Stream response using YOUR AI SDK connection
    const model = getOpenAIModel("gpt-4o-mini") // Using your connection

    const result = await streamText({
      model,
      messages,
      maxTokens: 1000,
      temperature: 0.7,
      onChunk: ({ chunk }) => {
        if (chunk.type === "text-delta") {
          onChunk(chunk.text)
        }
      },
    })

    // Step 7: Save messages to database
    await saveMessage(sessionId, message, "user")
    const fullResponse = await result.text
    await saveMessage(sessionId, fullResponse, "assistant")

    return {
      response: fullResponse,
      sessionId,
      knowledgeItemsUsed: knowledgeResult.itemCount,
    }
  } catch (error) {
    console.error("Chat processing error:", error)
    throw error
  }
}

/**
 * Build system prompt with agent personality + FULL knowledge base
 * @param {Object} agent - Agent configuration
 * @param {string} knowledgeContent - Combined knowledge content
 * @returns {string} - System prompt
 */
function buildSystemPrompt(agent, knowledgeContent) {
  const personality = agent?.personality || "friendly"
  const templates = agent?.response_templates || {}

  return `You are a helpful AI customer service assistant with a ${personality} personality. 

Use the following complete knowledge base to answer customer questions accurately and helpfully:

=== KNOWLEDGE BASE ===
${knowledgeContent}
=== END KNOWLEDGE BASE ===

Instructions:
- Always be ${personality} and professional
- Use ONLY the provided knowledge base content to give accurate answers
- If information isn't in the knowledge base, say "I don't have that information in my knowledge base"
- ${templates.greeting ? `Use this greeting style: "${templates.greeting}"` : ""}
- ${templates.escalation ? `For escalations, use: "${templates.escalation}"` : ""}
- Keep responses concise but complete
- Always reference the knowledge base when providing information
- If you're unsure, ask clarifying questions`
}

/**
 * Gets messages for a session
 * @param {string} sessionId - Session ID
 * @returns {Promise<Array>} - Messages
 */
async function getSessionMessages(sessionId) {
  try {
    const { data, error } = await supabaseAdmin
      .from("messages")
      .select("content, message_type")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true })
      .limit(10) // Keep last 10 messages for context

    if (error) throw error

    return data.map((msg) => ({
      role: msg.message_type === "user" ? "user" : "assistant",
      content: msg.content,
    }))
  } catch (error) {
    console.error("Get session messages error:", error)
    return []
  }
}

/**
 * Gets agent configuration
 * @param {string} agentId - Agent ID
 * @returns {Promise<Object|null>} - Agent configuration
 */
async function getAgent(agentId) {
  try {
    const { data, error } = await supabaseAdmin.from("ai_agents").select("*").eq("id", agentId).single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Get agent error:", error)
    return null
  }
}

/**
 * Saves a message to the database
 * @param {string} sessionId - Session ID
 * @param {string} content - Message content
 * @param {string} messageType - Message type (user/assistant)
 * @returns {Promise<void>}
 */
async function saveMessage(sessionId, content, messageType) {
  try {
    const { error } = await supabaseAdmin.from("messages").insert({
      id: uuidv4(),
      session_id: sessionId,
      content,
      message_type: messageType,
      created_at: new Date().toISOString(),
    })

    if (error) throw error
  } catch (error) {
    console.error("Save message error:", error)
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

module.exports = {
  processMessage,
  createSession,
  getSessionMessages,
  saveMessage,
}
