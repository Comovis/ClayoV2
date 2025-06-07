const { openai } = require("@ai-sdk/openai")
require("dotenv").config()

// Simple OpenAI connection with enhanced logging
const getOpenAIModel = (model = "gpt-4o-mini") => {
  console.log("🔧 Creating OpenAI model:", model)
  console.log("🔑 API Key present:", !!process.env.OPENAI_API_KEY)

  try {
    const modelInstance = openai(model, {
      apiKey: process.env.OPENAI_API_KEY,
    })

    console.log("✅ OpenAI model created successfully:", model)
    return modelInstance
  } catch (error) {
    console.error("❌ Failed to create OpenAI model:", error)
    throw error
  }
}

module.exports = {
  getOpenAIModel,
}
