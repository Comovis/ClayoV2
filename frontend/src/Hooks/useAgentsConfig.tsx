"use client"

import { useState, useCallback } from "react"
import { useUser } from "../Auth/Contexts/UserContext"
import { supabase } from "../Auth/SupabaseAuth" // Import supabase

// API Base URL Configuration
const apiBaseUrl =
  import.meta.env.MODE === "development" ? import.meta.env.VITE_DEVELOPMENT_URL : import.meta.env.VITE_API_URL

export interface AgentConfig {
  name?: string
  personality?: string
  language?: string
  responseLength?: "short" | "medium" | "long"
  formalityLevel?: "casual" | "balanced" | "formal"
  customInstructions?: string
  capabilities?: string[]
  responseTemplates?: {
    greeting?: string
    escalation?: string
    closing?: string
  }
  temperature?: number
  maxTokens?: number
  model?: string
}

export function useAgentConfig() {
  const { user, isAuthenticated } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const getAuthToken = async () => {
    if (!isAuthenticated) {
      throw new Error("Authentication required. Please log in.")
    }

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !sessionData.session) {
      throw new Error("Authentication required. Please log in again.")
    }

    return sessionData.session.access_token
  }

  const clearMessages = useCallback(() => {
    setError(null)
    setSuccess(null)
  }, [])

  const getAgentConfig = useCallback(async (agentId: string) => {
    if (!isAuthenticated || !user) {
      setError("Please log in to access agent configuration")
      return null
    }

    setIsLoading(true)
    setError(null)

    try {
      const token = await getAuthToken()

      const response = await fetch(`${apiBaseUrl}/api/agents/${agentId}/config`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Server responded with ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()

      if (result.success) {
        // Transform database format to hook format
        const config: AgentConfig = {
          name: result.config.name,
          personality: result.config.personality,
          language: result.config.language,
          capabilities: result.config.capabilities || [],
          responseTemplates: result.config.response_templates || {},
        }

        // Add settings fields
        if (result.config.settings) {
          const settings = result.config.settings
          config.responseLength = settings.responseLength
          config.formalityLevel = settings.formalityLevel
          config.customInstructions = settings.customInstructions
          config.temperature = settings.temperature
          config.maxTokens = settings.maxTokens
          config.model = settings.model
        }

        return config
      } else {
        throw new Error(result.error || "Failed to fetch agent configuration")
      }
    } catch (err: any) {
      console.error("Error fetching agent config:", err)
      setError(err.message || "Failed to fetch agent configuration")
      return null
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, user])

  const updateAgentConfig = useCallback(async (agentId: string, config: AgentConfig) => {
    if (!isAuthenticated || !user) {
      setError("Please log in to update agent configuration")
      return false
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const token = await getAuthToken()

      const response = await fetch(`${apiBaseUrl}/api/agents/${agentId}/config`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Server responded with ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()

      if (result.success) {
        setSuccess("Agent configuration updated successfully")
        return true
      } else {
        throw new Error(result.error || "Failed to update agent configuration")
      }
    } catch (err: any) {
      console.error("Error updating agent config:", err)
      setError(err.message || "Failed to update agent configuration")
      return false
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, user])

  const testAgentConfig = useCallback(async (agentId: string, message: string) => {
    if (!isAuthenticated || !user) {
      setError("Please log in to test agent configuration")
      return null
    }

    setIsLoading(true)
    setError(null)

    try {
      const token = await getAuthToken()

      const response = await fetch(`${apiBaseUrl}/api/agents/${agentId}/test`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Server responded with ${response.status}: ${response.statusText}`)
      }

      // Handle streaming response
      const reader = response.body?.getReader()
      if (!reader) throw new Error("Response body is not readable")

      let result = ""
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split("\n").filter(line => line.trim() !== "")

        for (const line of lines) {
          if (!line.startsWith("data:")) continue
          
          const data = line.replace(/^data: /, "")
          try {
            const parsed = JSON.parse(data)
            
            if (parsed.type === "chunk") {
              result += parsed.content
            } else if (parsed.type === "error") {
              throw new Error(parsed.error)
            }
          } catch (e) {
            console.error("Error parsing streaming response:", e)
          }
        }
      }

      return result
    } catch (err: any) {
      console.error("Error testing agent config:", err)
      setError(err.message || "Failed to test agent configuration")
      return null
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, user])

  return {
    getAgentConfig,
    updateAgentConfig,
    testAgentConfig,
    isLoading,
    error,
    success,
    clearMessages,
  }
}