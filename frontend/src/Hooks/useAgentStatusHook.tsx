"use client"

import { useState, useCallback } from "react"
import { useUser } from "../Auth/Contexts/UserContext"
import { supabase } from "../Auth/SupabaseAuth"

const apiBaseUrl =
  import.meta.env.MODE === "development" ? import.meta.env.VITE_DEVELOPMENT_URL : import.meta.env.VITE_API_URL

export interface AgentStatus {
  agentName: string
  agentStatus: "active" | "inactive" | "training"
  activeSessions: number
  knowledgeItems: number
  lastUpdated: string
  isConfigured: boolean
}

export interface ServiceHealth {
  timestamp: string
  services: {
    chatService: string
    agentConfig: string
    sessionManagement: string
    analytics: string
    documentProcessor: string
    knowledgeBase: string
  }
  version: string
}

export function useAgentStatus() {
  const { user, isAuthenticated } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [agentStatus, setAgentStatus] = useState<AgentStatus | null>(null)
  const [serviceHealth, setServiceHealth] = useState<ServiceHealth | null>(null)

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

  const getAgentStatus = useCallback(
    async (agentId: string) => {
      if (!isAuthenticated || !user) {
        setError("Please log in to access agent status")
        return null
      }

      setIsLoading(true)
      setError(null)

      try {
        const token = await getAuthToken()

        const response = await fetch(`${apiBaseUrl}/api/agents/${agentId}/status`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `Failed to fetch agent status`)
        }

        const result = await response.json()

        if (result.success) {
          setAgentStatus(result.status)
          return result.status
        } else {
          throw new Error(result.error || "Failed to fetch agent status")
        }
      } catch (err: any) {
        console.error("Error fetching agent status:", err)
        setError(err.message || "Failed to fetch agent status")
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [isAuthenticated, user],
  )

  const getServiceHealth = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${apiBaseUrl}/api/health/ai-services`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to fetch service health`)
      }

      const result = await response.json()

      if (result.success) {
        setServiceHealth(result.health)
        return result.health
      } else {
        throw new Error(result.error || "Failed to fetch service health")
      }
    } catch (err: any) {
      console.error("Error fetching service health:", err)
      setError(err.message || "Failed to fetch service health")
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    agentStatus,
    serviceHealth,
    isLoading,
    error,
    getAgentStatus,
    getServiceHealth,
    clearError,
  }
}
