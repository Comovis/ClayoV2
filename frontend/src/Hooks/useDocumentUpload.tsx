"use client"

import { useState, useCallback } from "react"
import { supabase } from "../Auth/SupabaseAuth"

// API Base URL Configuration
const apiBaseUrl =
  import.meta.env.MODE === "development" ? import.meta.env.VITE_DEVELOPMENT_URL : import.meta.env.VITE_API_URL

interface UploadData {
  vesselId: string
  title: string
  documentType: string
  category?: string
  issuer?: string
  certificateNumber?: string
  issueDate?: string
  expiryDate?: string
  isPermanent: boolean
}

interface UseDocumentUploadReturn {
  isUploading: boolean
  uploadProgress: number
  error: string | null
  success: string | null
  uploadDocument: (file: File, data: UploadData) => Promise<any>
  uploadBatchDocuments: (files: File[], documents: UploadData[]) => Promise<any>
  clearMessages: () => void
}

export function useDocumentUpload(): UseDocumentUploadReturn {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
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

  const uploadDocument = useCallback(async (file: File, data: UploadData) => {
    setIsUploading(true)
    setUploadProgress(0)
    setError(null)
    setSuccess(null)

    try {
      const token = await getAuthToken()

      // Create FormData for file upload
      const formData = new FormData()
      formData.append("file", file)
      formData.append("vesselId", data.vesselId)
      formData.append("title", data.title)
      formData.append("documentType", data.documentType)
      formData.append("category", data.category || "General")
      formData.append("issuer", data.issuer || "")
      formData.append("certificateNumber", data.certificateNumber || "")
      formData.append("issueDate", data.issueDate || "")
      formData.append("expiryDate", data.expiryDate || "")
      formData.append("isPermanent", data.isPermanent.toString())

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

      const response = await fetch(`${apiBaseUrl}/api/documents/upload`, {
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
        return result.document
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
  }, [])

  const uploadBatchDocuments = useCallback(async (files: File[], documents: UploadData[]) => {
    setIsUploading(true)
    setUploadProgress(0)
    setError(null)
    setSuccess(null)

    try {
      const token = await getAuthToken()
      const results = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const data = documents[i]

        // Update progress
        setUploadProgress((i / files.length) * 100)

        // Create FormData for each file
        const formData = new FormData()
        formData.append("file", file)
        formData.append("vesselId", data.vesselId)
        formData.append("title", data.title)
        formData.append("documentType", data.documentType)
        formData.append("category", data.category || "General")
        formData.append("issuer", data.issuer || "")
        formData.append("certificateNumber", data.certificateNumber || "")
        formData.append("issueDate", data.issueDate || "")
        formData.append("expiryDate", data.expiryDate || "")
        formData.append("isPermanent", data.isPermanent.toString())

        const response = await fetch(`${apiBaseUrl}/api/documents/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        })

        const result = await response.json()

        if (response.ok && result.success) {
          results.push(result.document)
        } else {
          console.error(`Failed to upload ${file.name}:`, result.error)
          // Continue with other files even if one fails
        }
      }

      setUploadProgress(100)
      setSuccess(`Successfully uploaded ${results.length} of ${files.length} documents`)
      return results
    } catch (err: any) {
      console.error("Error uploading batch documents:", err)
      setError(err.message || "Failed to upload documents")
      return []
    } finally {
      setIsUploading(false)
    }
  }, [])

  return {
    isUploading,
    uploadProgress,
    error,
    success,
    uploadDocument,
    uploadBatchDocuments,
    clearMessages,
  }
}
