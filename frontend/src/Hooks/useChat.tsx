"use client"

import { useState, useCallback, useEffect } from "react"
import { useUser } from "../Auth/Contexts/UserContext"
import { supabase } from "../Auth/SupabaseAuth" // Import supabase

// API Base URL Configuration
const apiBaseUrl =
  import.meta.env.MODE === "development" ? import.meta.env.VITE_DEVELOPMENT_URL : import.meta.env.VITE_API_URL

export interface Message {
  id?: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp?: string
}

export interface ChatSession {
  id: string
  agent_id: string
  customer_id?: string
  status: string
  created_at: string
  updated_at: string
}

interface UseChatReturn {
  isLoading: boolean
  isStreaming: boolean
  error: string | null
  messages: Message[]
  currentSession: ChatSession | null
  createSession: (agentId: string, customerId?: string) => Promise<ChatSession | null>
  sendMessage: (message: string) => Promise<void>
  resetChat: () => void
}

export function useChat(initialAgentId?: string, initialCustomerId?: string): UseChatReturn {
  const { user, isAuthenticated } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null)
  const [currentAgentId, setCurrentAgentId] = useState<string | undefined>(initialAgentId)
  const [currentCustomerId, setCurrentCustomerId] = useState<string | undefined>(initialCustomerId)

  const getAuthToken = async () => {
    if (!isAuthenticated) {
      return null // Allow public chat
    }

    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

      if (sessionError || !sessionData.session) {
        return null
      }

      return sessionData.session.access_token
    } catch (error) {
      console.error("Error getting auth token:", error)
      return null
    }
  }

  const getOrganizationId = () => {
    if (user?.organization_id) {
      return user.organization_id
    }
    // For public chat, we might need a different approach
    // This could be passed as a prop or from URL params
    throw new Error("Organization ID not available for public chat")
  }

  const createSession = useCallback(
    async (agentId: string, customerId?: string) => {
      setIsLoading(true)
      setError(null)

      try {
        setCurrentAgentId(agentId)
        if (customerId) setCurrentCustomerId(customerId)

        const token = await getAuthToken()
        const isAuthenticatedUser = !!token

        // Choose the appropriate endpoint based on authentication
        const endpoint = isAuthenticatedUser
          ? `${apiBaseUrl}/api/chat/session`
          : `${apiBaseUrl}/api/public/chat/session`

        const headers = {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Content-Type": "application/json",
        }

        let body = {
          agentId,
          customerId,
        }

        // For public chat, we need organization ID
        if (!isAuthenticatedUser) {
          try {
            const organizationId = getOrganizationId()
            body = { ...body, organizationId }
          } catch (err) {
            throw new Error("Organization ID required for public chat")
          }
        }

        const response = await fetch(endpoint, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(body),
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || "Failed to create chat session")
        }

        if (result.success) {
          setCurrentSession(result.session)
          // Reset messages when creating a new session
          setMessages([])
          return result.session
        } else {
          throw new Error(result.error || "Failed to create chat session")
        }
      } catch (err: any) {
        console.error("Error creating chat session:", err)
        setError(err.message || "Failed to create chat session")
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [user, isAuthenticated],
  )

  const sendMessage = useCallback(
    async (message: string) => {
      if (!currentSession || !currentAgentId) {
        setError("No active chat session. Please create a session first.")
        return
      }

      setIsStreaming(true)
      setError(null)

      // Add user message immediately to the UI
      const userMessage: Message = {
        role: "user",
        content: message,
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, userMessage])

      try {
        const token = await getAuthToken()
        const isAuthenticatedUser = !!token

        // Choose the appropriate endpoint based on authentication
        const endpoint = isAuthenticatedUser
          ? `${apiBaseUrl}/api/chat/message`
          : `${apiBaseUrl}/api/public/chat/message`

        // Create a placeholder for the assistant's response
        const assistantMessageId = Date.now().toString()
        const assistantMessage: Message = {
          id: assistantMessageId,
          role: "assistant",
          content: "",
          timestamp: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, assistantMessage])

        const headers = {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Content-Type": "application/json",
        }

        let body = {
          message,
          sessionId: currentSession.id,
          agentId: currentAgentId,
        }

        // For public chat, we need organization ID
        if (!isAuthenticatedUser) {
          try {
            const organizationId = getOrganizationId()
            body = { ...body, organizationId }
          } catch (err) {
            throw new Error("Organization ID required for public chat")
          }
        }

        // Make the POST request for streaming
        const response = await fetch(endpoint, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(body),
        })

        if (!response.ok) {
          throw new Error("Failed to send message")
        }

        // Handle streaming response
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        if (reader) {
          let buffer = ""

          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split("\n")
            buffer = lines.pop() || ""

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                try {
                  const data = JSON.parse(line.slice(6))

                  if (data.type === "chunk") {
                    // Update the assistant's message with the new chunk
                    setMessages((prev) =>
                      prev.map((msg) =>
                        msg.id === assistantMessageId ? { ...msg, content: msg.content + (data.content || "") } : msg,
                      ),
                    )
                  } else if (data.type === "complete") {
                    // Stream is complete
                    setIsStreaming(false)
                    break
                  } else if (data.type === "error") {
                    throw new Error(data.error || "Error in chat stream")
                  }
                } catch (parseErr) {
                  console.error("Error parsing SSE message:", parseErr)
                }
              }
            }
          }
        }

        setIsStreaming(false)
      } catch (err: any) {
        console.error("Error sending message:", err)
        setError(err.message || "Failed to send message")
        setIsStreaming(false)
      }
    },
    [currentSession, currentAgentId, user, isAuthenticated],
  )

  const resetChat = useCallback(() => {
    setMessages([])
    setCurrentSession(null)
    setError(null)
  }, [])

  // Create a session automatically if agentId is provided
  useEffect(() => {
    if (initialAgentId && !currentSession) {
      createSession(initialAgentId, initialCustomerId)
    }
  }, [initialAgentId, initialCustomerId, currentSession, createSession])

  return {
    isLoading,
    isStreaming,
    error,
    messages,
    currentSession,
    createSession,
    sendMessage,
    resetChat,
  }
}
