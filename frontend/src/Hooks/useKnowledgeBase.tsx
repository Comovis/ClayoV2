"use client"

import { useState, useCallback } from "react"
import { useUser } from "../Auth/Contexts/UserContext"
import { supabase } from "../Auth/SupabaseAuth"

// API Base URL Configuration
const apiBaseUrl =
  import.meta.env.MODE === "development" ? import.meta.env.VITE_DEVELOPMENT_URL : import.meta.env.VITE_API_URL

export interface KnowledgeItem {
  id: string
  title: string
  content?: string
  category: string
  source_type: "document" | "url" | "text"
  source_url?: string
  file_path?: string
  file_size?: number
  file_type?: string
  processing_status: "pending" | "processing" | "completed" | "failed"
  created_at: string
  updated_at: string
}

interface UseKnowledgeBaseReturn {
  isLoading: boolean
  isUploading: boolean
  uploadProgress: number
  error: string | null
  success: string | null
  knowledgeItems: KnowledgeItem[]
  uploadDocument: (file: File, data: { title?: string; category?: string; agentId?: string }) => Promise<any>
  addUrl: (url: string, data: { category?: string; agentId?: string }) => Promise<any>
  addText: (title: string, content: string, data: { category?: string; agentId?: string }) => Promise<any>
  deleteKnowledgeItem: (id: string) => Promise<any>
  fetchKnowledgeItems: (agentId?: string) => Promise<any>
  getProcessingStatus: (id: string) => Promise<any>
  clearMessages: () => void
}

export function useKnowledgeBase(): UseKnowledgeBaseReturn {
  const { user, isAuthenticated, isLoading: userLoading } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([])

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
    if (!user?.organization_id) {
      throw new Error("Organization ID not found. Please contact support.")
    }
    return user.organization_id
  }

  const fetchKnowledgeItems = useCallback(
    async (agentId?: string) => {
      // Wait for user context to be fully loaded
      if (userLoading) {
        console.log("User context still loading, waiting...")
        return []
      }

      if (!isAuthenticated) {
        setError("Please log in to view knowledge items")
        return []
      }

      if (!user) {
        setError("User data not available")
        return []
      }

      if (!user.organization_id) {
        setError("Organization ID not found in user profile")
        return []
      }

      setIsLoading(true)
      setError(null)

      try {
        const token = await getAuthToken()
        const organizationId = getOrganizationId()

        let url = `${apiBaseUrl}/api/knowledge?organizationId=${organizationId}`
        if (agentId) {
          url += `&agentId=${agentId}`
        }

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || "Failed to fetch knowledge items")
        }

        if (result.success) {
          setKnowledgeItems(result.items)
          return result.items
        } else {
          throw new Error(result.error || "Failed to fetch knowledge items")
        }
      } catch (err: any) {
        console.error("Error fetching knowledge items:", err)
        setError(err.message || "Failed to fetch knowledge items")
        return []
      } finally {
        setIsLoading(false)
      }
    },
    [isAuthenticated, user, userLoading],
  )

  const uploadDocument = useCallback(
    async (file: File, data: { title?: string; category?: string; agentId?: string }) => {
      // Wait for user context to be fully loaded
      if (userLoading) {
        setError("Please wait for user data to load")
        return null
      }

      if (!isAuthenticated || !user) {
        setError("Please log in to upload documents")
        return null
      }

      if (!user.organization_id) {
        setError("Organization ID not found in user profile")
        return null
      }

      setIsUploading(true)
      setUploadProgress(0)
      setError(null)
      setSuccess(null)

      try {
        const token = await getAuthToken()
        const organizationId = getOrganizationId()

        // Create FormData for file upload
        const formData = new FormData()
        formData.append("file", file)
        if (data.title) formData.append("title", data.title)
        if (data.category) formData.append("category", data.category)
        if (data.agentId) formData.append("agentId", data.agentId)
        formData.append("organizationId", organizationId)

        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval)
              return 90
            }
            return prev + 10
          })
        }, 200)

        const response = await fetch(`${apiBaseUrl}/api/knowledge/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        })

        clearInterval(progressInterval)
        setUploadProgress(100)

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || "Failed to upload document")
        }

        if (result.success) {
          setSuccess("Document uploaded successfully")
          // Refresh the knowledge items list
          await fetchKnowledgeItems(data.agentId)
          return result.data
        } else {
          throw new Error(result.error || "Upload failed")
        }
      } catch (err: any) {
        console.error("Error uploading document:", err)
        setError(err.message || "Failed to upload document")
        return null
      } finally {
        setIsUploading(false)
      }
    },
    [fetchKnowledgeItems, isAuthenticated, user, userLoading],
  )

  const addUrl = useCallback(
    async (url: string, data: { category?: string; agentId?: string }) => {
      // Wait for user context to be fully loaded
      if (userLoading) {
        setError("Please wait for user data to load")
        return null
      }

      if (!isAuthenticated || !user) {
        setError("Please log in to add URLs")
        return null
      }

      if (!user.organization_id) {
        setError("Organization ID not found in user profile")
        return null
      }

      setIsUploading(true)
      setError(null)
      setSuccess(null)

      try {
        const token = await getAuthToken()
        const organizationId = getOrganizationId()

        const response = await fetch(`${apiBaseUrl}/api/knowledge/url`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url,
            category: data.category || "Web Content",
            agentId: data.agentId,
            organizationId: organizationId,
          }),
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || "Failed to add URL")
        }

        if (result.success) {
          setSuccess("URL added successfully")
          // Refresh the knowledge items list
          await fetchKnowledgeItems(data.agentId)
          return result.data
        } else {
          throw new Error(result.error || "Failed to add URL")
        }
      } catch (err: any) {
        console.error("Error adding URL:", err)
        setError(err.message || "Failed to add URL")
        return null
      } finally {
        setIsUploading(false)
      }
    },
    [fetchKnowledgeItems, isAuthenticated, user, userLoading],
  )

  const addText = useCallback(
    async (title: string, content: string, data: { category?: string; agentId?: string }) => {
      // Wait for user context to be fully loaded
      if (userLoading) {
        setError("Please wait for user data to load")
        return null
      }

      if (!isAuthenticated || !user) {
        setError("Please log in to add text content")
        return null
      }

      if (!user.organization_id) {
        setError("Organization ID not found in user profile")
        return null
      }

      setIsUploading(true)
      setError(null)
      setSuccess(null)

      try {
        const token = await getAuthToken()
        const organizationId = getOrganizationId()

        const response = await fetch(`${apiBaseUrl}/api/knowledge/text`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            content,
            category: data.category || "Custom",
            agentId: data.agentId,
            organizationId: organizationId,
          }),
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || "Failed to add text content")
        }

        if (result.success) {
          setSuccess("Text content added successfully")
          // Refresh the knowledge items list
          await fetchKnowledgeItems(data.agentId)
          return result.data
        } else {
          throw new Error(result.error || "Failed to add text content")
        }
      } catch (err: any) {
        console.error("Error adding text content:", err)
        setError(err.message || "Failed to add text content")
        return null
      } finally {
        setIsUploading(false)
      }
    },
    [fetchKnowledgeItems, isAuthenticated, user, userLoading],
  )

  const deleteKnowledgeItem = useCallback(
    async (id: string) => {
      // Wait for user context to be fully loaded
      if (userLoading) {
        setError("Please wait for user data to load")
        return false
      }

      if (!isAuthenticated || !user) {
        setError("Please log in to delete knowledge items")
        return false
      }

      if (!user.organization_id) {
        setError("Organization ID not found in user profile")
        return false
      }

      setIsLoading(true)
      setError(null)

      try {
        const token = await getAuthToken()
        const organizationId = getOrganizationId()

        const response = await fetch(`${apiBaseUrl}/api/knowledge/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            organizationId: organizationId,
          }),
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || "Failed to delete knowledge item")
        }

        if (result.success) {
          setSuccess("Knowledge item deleted successfully")
          // Update local state to remove the deleted item
          setKnowledgeItems((prev) => prev.filter((item) => item.id !== id))
          return true
        } else {
          throw new Error(result.error || "Failed to delete knowledge item")
        }
      } catch (err: any) {
        console.error("Error deleting knowledge item:", err)
        setError(err.message || "Failed to delete knowledge item")
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [isAuthenticated, user, userLoading],
  )

  const getProcessingStatus = useCallback(
    async (id: string) => {
      if (userLoading) {
        return {
          success: false,
          error: "Please wait for user data to load",
        }
      }

      if (!isAuthenticated || !user) {
        return {
          success: false,
          error: "Please log in to check processing status",
        }
      }

      try {
        const token = await getAuthToken()

        const response = await fetch(`${apiBaseUrl}/api/knowledge/status/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || "Failed to get processing status")
        }

        if (result.success) {
          return {
            success: true,
            status: result.status,
            metadata: result.metadata,
          }
        } else {
          throw new Error(result.error || "Failed to get processing status")
        }
      } catch (err: any) {
        console.error("Error getting processing status:", err)
        return {
          success: false,
          error: err.message || "Failed to get processing status",
        }
      }
    },
    [isAuthenticated, user, userLoading],
  )

  return {
    isLoading,
    isUploading,
    uploadProgress,
    error,
    success,
    knowledgeItems,
    uploadDocument,
    addUrl,
    addText,
    deleteKnowledgeItem,
    fetchKnowledgeItems,
    getProcessingStatus,
    clearMessages,
  }
}
