"use client"

import { useState, useCallback } from "react"
import { useUser } from "../Auth/Contexts/UserContext"
import { supabase } from "../Auth/SupabaseAuth"

const apiBaseUrl =
  import.meta.env.MODE === "development" ? import.meta.env.VITE_DEVELOPMENT_URL : import.meta.env.VITE_API_URL

export interface Session {
  id: string
  agent_id: string
  customer_id?: string
  status: "active" | "closed" | "escalated"
  created_at: string
  updated_at: string
  message_count?: number
  last_message?: string
}

export interface SessionMessage {
  id: string
  session_id: string
  content: string
  message_type: "user" | "assistant"
  created_at: string
}

export function useAgentSessions() {
  const { user, isAuthenticated } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [messages, setMessages] = useState<SessionMessage[]>([])

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

  const getAgentSessions = useCallback(
    async (agentId: string) => {
      if (!isAuthenticated || !user) {
        setError("Please log in to access sessions")
        return []
      }

      setIsLoading(true)
      setError(null)

      try {
        const token = await getAuthToken()

        const response = await fetch(`${apiBaseUrl}/api/agents/${agentId}/sessions`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `Failed to fetch sessions`)
        }

        const result = await response.json()

        if (result.success) {
          setSessions(result.sessions || [])
          return result.sessions || []
        } else {
          throw new Error(result.error || "Failed to fetch sessions")
        }
      } catch (err: any) {
        console.error("Error fetching sessions:", err)
        setError(err.message || "Failed to fetch sessions")
        return []
      } finally {
        setIsLoading(false)
      }
    },
    [isAuthenticated, user],
  )

  const getSessionMessages = useCallback(
    async (sessionId: string) => {
      if (!isAuthenticated || !user) {
        setError("Please log in to access messages")
        return []
      }

      setIsLoading(true)
      setError(null)

      try {
        const token = await getAuthToken()

        const response = await fetch(`${apiBaseUrl}/api/sessions/${sessionId}/messages`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `Failed to fetch messages`)
        }

        const result = await response.json()

        if (result.success) {
          setMessages(result.messages || [])
          return result.messages || []
        } else {
          throw new Error(result.error || "Failed to fetch messages")
        }
      } catch (err: any) {
        console.error("Error fetching messages:", err)
        setError(err.message || "Failed to fetch messages")
        return []
      } finally {
        setIsLoading(false)
      }
    },
    [isAuthenticated, user],
  )

  const updateSessionStatus = useCallback(
    async (sessionId: string, status: "active" | "closed" | "escalated") => {
      if (!isAuthenticated || !user) {
        setError("Please log in to update session status")
        return false
      }

      setIsLoading(true)
      setError(null)

      try {
        const token = await getAuthToken()

        const response = await fetch(`${apiBaseUrl}/api/sessions/${sessionId}/status`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `Failed to update session status`)
        }

        const result = await response.json()

        if (result.success) {
          // Update local sessions state
          setSessions((prev) => prev.map((session) => (session.id === sessionId ? { ...session, status } : session)))
          return true
        } else {
          throw new Error(result.error || "Failed to update session status")
        }
      } catch (err: any) {
        console.error("Error updating session status:", err)
        setError(err.message || "Failed to update session status")
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [isAuthenticated, user],
  )

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    sessions,
    messages,
    isLoading,
    error,
    getAgentSessions,
    getSessionMessages,
    updateSessionStatus,
    clearError,
  }
}
