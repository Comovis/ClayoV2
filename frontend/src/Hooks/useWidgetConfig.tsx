"use client"

import { useState, useCallback } from "react"
import { useUser } from "../Auth/Contexts/UserContext"
import { supabase } from "../Auth/SupabaseAuth"

const apiBaseUrl =
  import.meta.env.MODE === "development" ? import.meta.env.VITE_DEVELOPMENT_URL : import.meta.env.VITE_API_URL

export interface WidgetConfig {
  // Appearance
  primaryColor: string
  secondaryColor: string
  textColor: string
  backgroundColor: string
  borderRadius: number
  fontSize: number
  fontFamily: string
  headerHeight: number

  // Behavior
  welcomeMessage: string
  placeholderText: string
  position: "bottom-right" | "bottom-left" | "top-right" | "top-left"
  autoOpen: boolean
  autoOpenDelay: number
  showAvatar: boolean
  showTypingIndicator: boolean
  showOnlineStatus: boolean

  // Branding
  companyName: string
  companyLogo: string
  agentName: string
  agentAvatar: string

  // Features
  enableFileUpload: boolean
  enableEmojis: boolean
  enableSoundNotifications: boolean
  enableOfflineMessage: boolean
  offlineMessage: string
  showPoweredBy: boolean
  enableRating: boolean

  // Advanced
  customCSS: string
  allowedDomains: string[]
  maxMessageLength: number
  rateLimitMessages: number
  rateLimitWindow: number
  widgetWidth: number
  widgetHeight: number
}

export function useWidgetConfig() {
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

  const getWidgetConfig = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setError("Please log in to access widget configuration")
      return null
    }

    setIsLoading(true)
    setError(null)

    try {
      const token = await getAuthToken()

      const response = await fetch(`${apiBaseUrl}/api/widget/config`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to fetch widget configuration`)
      }

      const result = await response.json()

      if (result.success) {
        return {
          config: result.config.config || result.config,
          embedCode: result.embedCode,
        }
      } else {
        throw new Error(result.error || "Failed to fetch widget configuration")
      }
    } catch (err: any) {
      console.error("Error fetching widget config:", err)
      setError(err.message || "Failed to fetch widget configuration")
      return null
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, user])

  const saveWidgetConfig = useCallback(
    async (config: WidgetConfig) => {
      if (!isAuthenticated || !user) {
        setError("Please log in to save widget configuration")
        return null
      }

      setIsLoading(true)
      setError(null)
      setSuccess(null)

      try {
        const token = await getAuthToken()

        const response = await fetch(`${apiBaseUrl}/api/widget/config`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(config),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `Failed to save widget configuration`)
        }

        const result = await response.json()

        if (result.success) {
          setSuccess("Widget configuration saved successfully!")
          return {
            config: result.config,
            embedCode: result.embedCode,
          }
        } else {
          throw new Error(result.error || "Failed to save widget configuration")
        }
      } catch (err: any) {
        console.error("Error saving widget config:", err)
        setError(err.message || "Failed to save widget configuration")
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [isAuthenticated, user],
  )

  return {
    getWidgetConfig,
    saveWidgetConfig,
    isLoading,
    error,
    success,
    clearMessages,
  }
}
