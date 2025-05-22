"use client"

import { useState } from "react"
import { supabase } from "../Auth/SupabaseAuth"

interface VesselData {
  name: string
  imo_number?: string
  vessel_type: string
  flag_state: string
}

interface AddVesselResult {
  success: boolean
  vessel?: any
  error?: string
}

export function useAddVessel() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addVessel = async (vesselData: VesselData): Promise<AddVesselResult> => {
    setIsLoading(true)
    setError(null)

    try {
      // Get the API base URL based on environment
      const apiBaseUrl =
        import.meta.env.MODE === "development" ? import.meta.env.VITE_DEVELOPMENT_URL : import.meta.env.VITE_API_URL

      // Get the current session to include the auth token
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

      if (sessionError || !sessionData.session) {
        throw new Error("Authentication required. Please log in again.")
      }

      // Get the access token from the session
      const token = sessionData.session.access_token

      // Validate required fields
      if (!vesselData.name) {
        throw new Error("Vessel name is required")
      }

      if (!vesselData.vessel_type) {
        throw new Error("Vessel type is required")
      }

      if (!vesselData.flag_state) {
        throw new Error("Flag state is required")
      }

      // Validate IMO number format if provided
      if (vesselData.imo_number && !/^\d{7}$/.test(vesselData.imo_number)) {
        throw new Error("IMO number must be 7 digits")
      }

      // Call the API to add the vessel
      const response = await fetch(`${apiBaseUrl}/api/add-vessel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(vesselData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to add vessel")
      }

      return {
        success: true,
        vessel: data.vessel,
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
      setError(errorMessage)
      return {
        success: false,
        error: errorMessage,
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    addVessel,
    isLoading,
    error,
  }
}
