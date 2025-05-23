"use client"

import { useState, useCallback } from "react"
import { supabase } from "../Auth/SupabaseAuth"

// API Base URL Configuration
const apiBaseUrl =
  import.meta.env.MODE === "development" ? import.meta.env.VITE_DEVELOPMENT_URL : import.meta.env.VITE_API_URL

interface Document {
  id: string
  vessel_id: string
  title: string
  document_type: string
  document_category: string
  issuer: string
  certificate_number: string
  issue_date: string
  expiry_date: string | null
  is_permanent: boolean
  status: "valid" | "expiring_soon" | "expired" | "missing"
  file_path: string
  file_type: string
  file_size: number
  created_by: string
  created_at: string
  updated_at: string
  is_archived: boolean
  downloadUrl?: string
}

interface UseDocumentsReturn {
  documents: Document[]
  isLoading: boolean
  error: string | null
  success: string | null
  fetchDocuments: (vesselId: string) => Promise<void>
  getDocument: (documentId: string) => Promise<Document | null>
  updateDocument: (documentId: string, data: Partial<Document>) => Promise<boolean>
  archiveDocument: (documentId: string) => Promise<boolean>
  downloadDocument: (documentId: string) => Promise<string | null>
  batchDownload: (documentIds: string[]) => Promise<any>
  clearMessages: () => void
}

export function useDocuments(): UseDocumentsReturn {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const clearMessages = useCallback(() => {
    setError(null)
    setSuccess(null)
  }, [])

  const getAuthToken = async () => {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !sessionData.session) {
      throw new Error("Authentication required. Please log in again.")
    }

    return sessionData.session.access_token
  }

  const fetchDocuments = useCallback(async (vesselId: string) => {
    if (!vesselId) return

    setIsLoading(true)
    setError(null)

    try {
      const token = await getAuthToken()

      const response = await fetch(`${apiBaseUrl}/api/documents/vessel/${vesselId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch documents")
      }

      if (data.success) {
        setDocuments(data.documents || [])
      } else {
        throw new Error(data.error || "Failed to fetch documents")
      }
    } catch (err: any) {
      console.error("Error fetching documents:", err)
      setError(err.message || "Failed to fetch documents")
      setDocuments([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getDocument = useCallback(async (documentId: string): Promise<Document | null> => {
    try {
      const token = await getAuthToken()

      const response = await fetch(`${apiBaseUrl}/api/documents/${documentId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch document")
      }

      return data.success ? data.document : null
    } catch (err: any) {
      console.error("Error fetching document:", err)
      setError(err.message || "Failed to fetch document")
      return null
    }
  }, [])

  const updateDocument = useCallback(async (documentId: string, updateData: Partial<Document>): Promise<boolean> => {
    try {
      const token = await getAuthToken()

      const response = await fetch(`${apiBaseUrl}/api/documents/${documentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update document")
      }

      if (data.success) {
        // Update the document in the local state
        setDocuments((prev) => prev.map((doc) => (doc.id === documentId ? { ...doc, ...data.document } : doc)))
        setSuccess("Document updated successfully")
        return true
      }

      return false
    } catch (err: any) {
      console.error("Error updating document:", err)
      setError(err.message || "Failed to update document")
      return false
    }
  }, [])

  const archiveDocument = useCallback(async (documentId: string): Promise<boolean> => {
    try {
      const token = await getAuthToken()

      const response = await fetch(`${apiBaseUrl}/api/documents/${documentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to archive document")
      }

      if (data.success) {
        // Remove the document from local state
        setDocuments((prev) => prev.filter((doc) => doc.id !== documentId))
        setSuccess("Document archived successfully")
        return true
      }

      return false
    } catch (err: any) {
      console.error("Error archiving document:", err)
      setError(err.message || "Failed to archive document")
      return false
    }
  }, [])

  const downloadDocument = useCallback(async (documentId: string): Promise<string | null> => {
    try {
      const token = await getAuthToken()

      const response = await fetch(`${apiBaseUrl}/api/documents/${documentId}/download`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate download URL")
      }

      if (data.success) {
        return data.downloadUrl
      }

      return null
    } catch (err: any) {
      console.error("Error downloading document:", err)
      setError(err.message || "Failed to download document")
      return null
    }
  }, [])

  const batchDownload = useCallback(async (documentIds: string[]) => {
    try {
      const token = await getAuthToken()

      const response = await fetch(`${apiBaseUrl}/api/documents/batch-download`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ documentIds }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate batch download URLs")
      }

      if (data.success) {
        setSuccess(`Generated download URLs for ${data.documents.length} documents`)
        return data
      }

      return null
    } catch (err: any) {
      console.error("Error batch downloading documents:", err)
      setError(err.message || "Failed to generate batch download URLs")
      return null
    }
  }, [])

  return {
    documents,
    isLoading,
    error,
    success,
    fetchDocuments,
    getDocument,
    updateDocument,
    archiveDocument,
    downloadDocument,
    batchDownload,
    clearMessages,
  }
}
