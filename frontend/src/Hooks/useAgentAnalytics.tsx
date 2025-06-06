"use client"

import { useState, useCallback } from "react"
import { useUser } from "../Auth/Contexts/UserContext"
import { supabase } from "../Auth/SupabaseAuth"

const apiBaseUrl =
  import.meta.env.MODE === "development" ? import.meta.env.VITE_DEVELOPMENT_URL : import.meta.env.VITE_API_URL

export interface AgentAnalytics {
  totalConversations: number
  activeConversations: number
  averageResponseTime: number
  customerSatisfaction: number
  resolutionRate: number
  escalationRate: number
  knowledgeBaseUsage: number
  dailyStats: Array<{
    date: string
    conversations: number
    avgResponseTime: number
  }>
  topQuestions: Array<{
    question: string
    count: number
  }>
  performanceMetrics: {
    accuracy: number
    helpfulness: number
    efficiency: number
  }
}

export interface ConversationMetrics {
  totalMessages: number
  averageConversationLength: number
  peakHours: Array<{
    hour: number
    count: number
  }>
  responseTimeDistribution: Array<{
    range: string
    count: number
  }>
}

export function useAgentAnalytics() {
  const { user, isAuthenticated } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analytics, setAnalytics] = useState<AgentAnalytics | null>(null)
  const [conversationMetrics, setConversationMetrics] = useState<ConversationMetrics | null>(null)

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

  const getAgentAnalytics = useCallback(
    async (agentId: string, dateRange?: { startDate: string; endDate: string }) => {
      if (!isAuthenticated || !user) {
        setError("Please log in to access analytics")
        return null
      }

      setIsLoading(true)
      setError(null)

      try {
        const token = await getAuthToken()

        let url = `${apiBaseUrl}/api/agents/${agentId}/analytics`

        if (dateRange) {
          const params = new URLSearchParams({
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
          })
          url += `?${params.toString()}`
        }

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `Failed to fetch analytics`)
        }

        const result = await response.json()

        if (result.success) {
          setAnalytics(result.analytics)
          return result.analytics
        } else {
          throw new Error(result.error || "Failed to fetch analytics")
        }
      } catch (err: any) {
        console.error("Error fetching analytics:", err)
        setError(err.message || "Failed to fetch analytics")
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [isAuthenticated, user],
  )

  const getOrganizationAnalytics = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setError("Please log in to access organization analytics")
      return null
    }

    setIsLoading(true)
    setError(null)

    try {
      const token = await getAuthToken()

      const response = await fetch(`${apiBaseUrl}/api/analytics/organization`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to fetch organization analytics`)
      }

      const result = await response.json()

      if (result.success) {
        return result.analytics
      } else {
        throw new Error(result.error || "Failed to fetch organization analytics")
      }
    } catch (err: any) {
      console.error("Error fetching organization analytics:", err)
      setError(err.message || "Failed to fetch organization analytics")
      return null
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, user])

  const getConversationMetrics = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setError("Please log in to access conversation metrics")
      return null
    }

    setIsLoading(true)
    setError(null)

    try {
      const token = await getAuthToken()

      const response = await fetch(`${apiBaseUrl}/api/analytics/conversations`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to fetch conversation metrics`)
      }

      const result = await response.json()

      if (result.success) {
        setConversationMetrics(result.metrics)
        return result.metrics
      } else {
        throw new Error(result.error || "Failed to fetch conversation metrics")
      }
    } catch (err: any) {
      console.error("Error fetching conversation metrics:", err)
      setError(err.message || "Failed to fetch conversation metrics")
      return null
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, user])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    analytics,
    conversationMetrics,
    isLoading,
    error,
    getAgentAnalytics,
    getOrganizationAnalytics,
    getConversationMetrics,
    clearError,
  }
}
