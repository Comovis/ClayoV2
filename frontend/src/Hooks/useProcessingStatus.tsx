"use client"

import { useState, useCallback, useEffect } from "react"
import { useKnowledgeBase } from "./useKnowledgeBase"

interface UseProcessingStatusReturn {
  isPolling: boolean
  startPolling: (itemId: string) => void
  stopPolling: () => void
  currentStatus: string | null
  error: string | null
}

export function useProcessingStatus(): UseProcessingStatusReturn {
  const { getProcessingStatus } = useKnowledgeBase()
  const [isPolling, setIsPolling] = useState(false)
  const [currentStatus, setCurrentStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)

  const startPolling = useCallback(
    (itemId: string) => {
      if (intervalId) {
        clearInterval(intervalId)
      }

      setIsPolling(true)
      setError(null)

      const pollStatus = async () => {
        try {
          const result = await getProcessingStatus(itemId)
          if (result.success) {
            setCurrentStatus(result.status)

            // Stop polling if processing is complete or failed
            if (result.status === "completed" || result.status === "failed") {
              stopPolling()
            }
          } else {
            setError(result.error || "Failed to get status")
            stopPolling()
          }
        } catch (err: any) {
          setError(err.message || "Failed to get status")
          stopPolling()
        }
      }

      // Poll immediately, then every 2 seconds
      pollStatus()
      const id = setInterval(pollStatus, 2000)
      setIntervalId(id)
    },
    [getProcessingStatus, intervalId],
  )

  const stopPolling = useCallback(() => {
    if (intervalId) {
      clearInterval(intervalId)
      setIntervalId(null)
    }
    setIsPolling(false)
  }, [intervalId])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [intervalId])

  return {
    isPolling,
    startPolling,
    stopPolling,
    currentStatus,
    error,
  }
}
