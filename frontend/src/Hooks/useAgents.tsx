"use client"

import { useState, useCallback } from "react"
import { useUser } from "../Auth/Contexts/UserContext"
import { supabase } from "../Auth/SupabaseAuth"

// API Base URL Configuration
const apiBaseUrl =
  import.meta.env.MODE === "development" ? import.meta.env.VITE_DEVELOPMENT_URL : import.meta.env.VITE_API_URL

export interface Agent {
  id: string
  name: string
  description: string
  status: "active" | "training" | "inactive"
  personality: string
  language: string
  use_case: string
  capabilities: string[]
  response_templates: {
    greeting?: string
    escalation?: string
    closing?: string
  }
  settings: Record<string, any>
  created_at: string
  updated_at: string
}

interface CreateAgentData {
  name: string
  description: string
  personality: string
  language: string
  useCase: string
}

interface UseAgentsReturn {
  isLoading: boolean
  error: string | null
  success: string | null
  agents: Agent[]
  createAgent: (data: CreateAgentData) => Promise<Agent | null>
  updateAgent: (id: string, data: Partial<Agent>) => Promise<Agent | null>
  fetchAgents: () => Promise<Agent[]>
  clearMessages: () => void
}

export function useAgents(): UseAgentsReturn {
  const { user, isAuthenticated, isLoading: userLoading } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [agents, setAgents] = useState<Agent[]>([])

  const clearMessages = useCallback(() => {
    setError(null)
    setSuccess(null)
  }, [])

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

  const getOrganizationId = () => {
    console.log("Getting organization ID from user:", user)
    if (!user) {
      throw new Error("User data not available")
    }

    // Check if organization_id exists and is not empty
    if (!user.organization_id || user.organization_id === "") {
      throw new Error("Organization ID not found. Please contact support.")
    }

    return user.organization_id
  }

  const fetchAgents = useCallback(async () => {
    // Wait for user context to be fully loaded
    if (userLoading) {
      console.log("User context still loading, waiting...")
      return []
    }

    if (!isAuthenticated) {
      setError("Please log in to view agents")
      return []
    }

    if (!user) {
      setError("User data not available")
      return []
    }

    console.log("User data available:", user)
    console.log("Organization ID from user:", user.organization_id)

    if (!user.organization_id) {
      setError("Organization ID not found in user profile")
      return []
    }

    setIsLoading(true)
    setError(null)

    try {
      const token = await getAuthToken()
      const organizationId = getOrganizationId()

      console.log("Fetching agents for organization:", organizationId)

      const response = await fetch(`${apiBaseUrl}/api/agents?organizationId=${organizationId}`, {
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
        setAgents(result.agents)
        return result.agents
      } else {
        throw new Error(result.error || "Failed to fetch agents")
      }
    } catch (err) {
      console.error("Error fetching agents:", err)
      setError(err.message || "Failed to fetch agents")
      return []
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, user, userLoading])

  const createAgent = useCallback(
    async (data: CreateAgentData) => {
      // Wait for user context to be fully loaded
      if (userLoading) {
        setError("Please wait for user data to load")
        return null
      }

      if (!isAuthenticated || !user) {
        setError("Please log in to create agents")
        return null
      }

      if (!user.organization_id) {
        setError("Organization ID not found in user profile")
        return null
      }

      setIsLoading(true)
      setError(null)
      setSuccess(null)

      try {
        const token = await getAuthToken()
        const organizationId = getOrganizationId()

        // Map the agent templates based on use case
        const agentTemplates = {
          "customer-support": {
            capabilities: [
              "Answer FAQs",
              "Collect customer information",
              "Schedule appointments",
              "Escalate to humans",
            ],
            greeting: "Hi! I'm here to help you with any questions. How can I assist you today?",
            escalation: "Let me connect you with one of our human agents who can better assist you with this request.",
            closing: "Is there anything else I can help you with today?",
          },
          sales: {
            capabilities: [
              "Qualify leads",
              "Product information",
              "Pricing details",
              "Schedule demos",
              "CRM integration",
            ],
            greeting: "Hello! I'd be happy to help you learn more about our solutions. What brings you here today?",
            escalation: "I'll connect you with our sales team to discuss your specific requirements in detail.",
            closing: "Would you like to schedule a demo to see how our solution can benefit your business?",
          },
          "technical-support": {
            capabilities: [
              "Technical troubleshooting",
              "API documentation",
              "Integration support",
              "Error diagnosis",
              "Code examples",
            ],
            greeting: "Hi! I'm here to help you with any technical questions or issues. What can I assist you with?",
            escalation: "This looks like a complex technical issue. Let me connect you with our engineering team.",
            closing: "Did this solve your technical issue? Let me know if you need any additional help!",
          },
        }

        const template =
          agentTemplates[data.useCase as keyof typeof agentTemplates] || agentTemplates["customer-support"]

        const response = await fetch(`${apiBaseUrl}/api/agents`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: data.name,
            description: data.description,
            personality: data.personality,
            language: data.language,
            useCase: data.useCase,
            capabilities: template.capabilities,
            responseTemplates: {
              greeting: template.greeting,
              escalation: template.escalation,
              closing: template.closing,
            },
            organizationId: organizationId,
          }),
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || "Failed to create agent")
        }

        if (result.success) {
          setSuccess("Agent created successfully")
          // Add the new agent to the local state
          setAgents((prev) => [result.agent, ...prev])
          return result.agent
        } else {
          throw new Error(result.error || "Failed to create agent")
        }
      } catch (err: any) {
        console.error("Error creating agent:", err)
        setError(err.message || "Failed to create agent")
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [isAuthenticated, user, userLoading],
  )

  const updateAgent = useCallback(
    async (id: string, data: Partial<Agent>) => {
      // Wait for user context to be fully loaded
      if (userLoading) {
        setError("Please wait for user data to load")
        return null
      }

      if (!isAuthenticated || !user) {
        setError("Please log in to update agents")
        return null
      }

      if (!user.organization_id) {
        setError("Organization ID not found in user profile")
        return null
      }

      setIsLoading(true)
      setError(null)
      setSuccess(null)

      try {
        const token = await getAuthToken()
        const organizationId = getOrganizationId()

        const response = await fetch(`${apiBaseUrl}/api/agents/${id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...data, organizationId: organizationId }),
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || "Failed to update agent")
        }

        if (result.success) {
          setSuccess("Agent updated successfully")
          // Update the agent in the local state
          setAgents((prev) => prev.map((agent) => (agent.id === id ? result.agent : agent)))
          return result.agent
        } else {
          throw new Error(result.error || "Failed to update agent")
        }
      } catch (err: any) {
        console.error("Error updating agent:", err)
        setError(err.message || "Failed to update agent")
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [isAuthenticated, user, userLoading],
  )

  return {
    isLoading,
    error,
    success,
    agents,
    createAgent,
    updateAgent,
    fetchAgents,
    clearMessages,
  }
}
