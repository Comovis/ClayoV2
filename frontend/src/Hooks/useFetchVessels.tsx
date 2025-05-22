"use client"

import { useState, useCallback } from "react"
import { supabase } from "../Auth/SupabaseAuth"

// Types for the hook parameters and return values
interface FetchVesselsOptions {
  searchQuery?: string
  vesselType?: string
}

interface DocumentStatus {
  valid: number
  expiringSoon: number
  expired: number
  missing: number
}

interface Vessel {
  id: string
  name: string
  type: string
  flag: string
  imo: string
  documentStatus: DocumentStatus
  complianceScore: number
  nextPort: string
  eta: string
  location: {
    lat: number
    lng: number
  }
}

interface UseFetchVesselsReturn {
  vessels: Vessel[]
  isLoading: boolean
  error: string | null
  fetchVessels: (options?: FetchVesselsOptions) => Promise<void>
  refreshVessels: () => Promise<void>
}

export function useFetchVessels(initialOptions?: FetchVesselsOptions): UseFetchVesselsReturn {
  const [vessels, setVessels] = useState<Vessel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [options, setOptions] = useState<FetchVesselsOptions>(initialOptions || {})

  // Mock data for fields we don't have yet
  const mockPortData = {
    nextPort: "Singapore",
    eta: "Nov 15, 2023",
    location: { lat: 1.352083, lng: 103.819839 },
  }

  // Document status mock data - would be calculated from actual documents in a real app
  const getRandomDocStatus = () => {
    return {
      valid: Math.floor(Math.random() * 15) + 5,
      expiringSoon: Math.floor(Math.random() * 5),
      expired: Math.floor(Math.random() * 2),
      missing: Math.floor(Math.random() * 3),
    }
  }

  // Calculate compliance score based on document status
  const calculateComplianceScore = (docStatus: DocumentStatus) => {
    const total = docStatus.valid + docStatus.expiringSoon + docStatus.expired + docStatus.missing
    const validWeight = 1
    const expiringSoonWeight = 0.5
    const expiredWeight = 0
    const missingWeight = 0

    if (total === 0) return 80 // Default score if no documents

    const score =
      ((docStatus.valid * validWeight +
        docStatus.expiringSoon * expiringSoonWeight +
        docStatus.expired * expiredWeight +
        docStatus.missing * missingWeight) /
        total) *
      100

    return Math.round(score)
  }

  // Fetch vessels from API
  const fetchVessels = useCallback(
    async (newOptions?: FetchVesselsOptions) => {
      // Update options if new ones are provided
      if (newOptions) {
        setOptions(newOptions)
      }

      // Use the most current options (either from state or newly provided)
      const currentOptions = newOptions || options

      setIsLoading(true)
      setError(null)

      try {
        // API Base URL Configuration
        const apiBaseUrl =
          import.meta.env.MODE === "development" ? import.meta.env.VITE_DEVELOPMENT_URL : import.meta.env.VITE_API_URL

        // Build query string from options
        const queryParams = new URLSearchParams()

        if (currentOptions.searchQuery) queryParams.append("search", currentOptions.searchQuery)
        if (currentOptions.vesselType && currentOptions.vesselType !== "all")
          queryParams.append("vesselType", currentOptions.vesselType)

        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : ""

        // Get the current session to include the auth token
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

        if (sessionError || !sessionData.session) {
          throw new Error("Authentication required. Please log in again.")
        }

        // Get the access token from the session
        const token = sessionData.session.access_token

        // Call the API to get vessels
        const response = await fetch(`${apiBaseUrl}/api/get-vessels${queryString}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch vessels")
        }

        // Enhance vessel data with mock data for fields we don't have yet
        const enhancedVessels = data.vessels.map((vessel: any) => {
          // Generate random document status for each vessel
          const documentStatus = getRandomDocStatus()

          return {
            id: vessel.id,
            name: vessel.name,
            type: vessel.vessel_type,
            flag: vessel.flag_state,
            imo: vessel.imo_number || "N/A",
            documentStatus,
            complianceScore: calculateComplianceScore(documentStatus),
            // Add mock data for fields we don't have yet
            nextPort: mockPortData.nextPort,
            eta: mockPortData.eta,
            location: mockPortData.location,
          }
        })

        setVessels(enhancedVessels)
      } catch (error) {
        console.error("Error loading vessels:", error)
        const errorMessage = error instanceof Error ? error.message : "Failed to load vessels. Please try again."
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    },
    [], // Remove options from dependency array to prevent infinite loops
  )

  // Refresh vessels with current options
  const refreshVessels = useCallback(() => {
    return fetchVessels(options) // Use the current options from state
  }, []) // Remove fetchVessels from dependency array

  return {
    vessels,
    isLoading,
    error,
    fetchVessels,
    refreshVessels,
  }
}
