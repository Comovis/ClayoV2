"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../Auth/SupabaseAuth"

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Get the hash fragment from the URL
      const hashFragment = window.location.hash

      if (hashFragment) {
        try {
          // Process the hash fragment
          const { data, error } = await supabase.auth.getSession()

          if (error) throw error

          if (data.session) {
            console.log("User authenticated:", data.session.user.email)

            // Check if this is an invited user
            const isInvitedUser = localStorage.getItem("isInvitedUser") === "true"

            // Clear the flag as we're now redirecting
            localStorage.removeItem("isInvitedUser")

            // Redirect based on user type
            if (isInvitedUser) {
              navigate("/dashboard")
            } else {
              navigate("/onboarding")
            }
          } else {
            // No session, redirect to login
            navigate("/login")
          }
        } catch (error) {
          console.error("Error processing auth callback:", error)
          navigate("/login")
        }
      } else {
        // No hash fragment, redirect to home
        navigate("/")
      }
    }

    handleAuthCallback()
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Verifying your account...</p>
      </div>
    </div>
  )
}
