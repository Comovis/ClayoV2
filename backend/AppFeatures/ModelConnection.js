import { openai } from "@ai-sdk/openai"
import dotenv from "dotenv"

// Load environment variables
dotenv.config()

// Simple OpenAI connection
export const getOpenAIModel = (model = "gpt-4o-mini") => {
  return openai(model, {
    apiKey: process.env.OPENAI_KEY,
  })
}
