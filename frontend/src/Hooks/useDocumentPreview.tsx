"use client"

import { useState, useCallback } from "react"
import { supabase } from "../Auth/SupabaseAuth"

interface UseDocumentPreviewReturn {
  isLoading: boolean
  error: string | null
  previewUrl: string | null
  generatePreviewUrl: (filePath: string) => Promise<string | null>
  clearPreview: () => void
}

export function useDocumentPreview(): UseDocumentPreviewReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const generatePreviewUrl = useCallback(async (filePath: string): Promise<string | null> => {
    setIsLoading(true)
    setError(null)

    try {
      // Generate a signed URL for document preview (30 minutes)
      const { data, error: urlError } = await supabase.storage.from("documents").createSignedUrl(filePath, 1800) // 30 minutes

      if (urlError) {
        throw new Error(`Failed to generate preview URL: ${urlError.message}`)
      }

      if (data?.signedUrl) {
        setPreviewUrl(data.signedUrl)
        return data.signedUrl
      }

      return null
    } catch (err: any) {
      console.error("Error generating preview URL:", err)
      setError(err.message || "Failed to generate preview URL")
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearPreview = useCallback(() => {
    setPreviewUrl(null)
    setError(null)
  }, [])

  return {
    isLoading,
    error,
    previewUrl,
    generatePreviewUrl,
    clearPreview,
  }
}
