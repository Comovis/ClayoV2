"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../../Auth/SupabaseAuth"

// API Base URL Configuration
const apiBaseUrl =
  import.meta.env.MODE === "development" ? import.meta.env.VITE_DEVELOPMENT_URL : import.meta.env.VITE_API_URL

// Define types for user data based on your actual database schema
interface User {
  id: string
  email: string
  full_name: string
  company_id: string | null
  role: string
  is_company_admin: boolean
  onboarding_step: string
  created_at: string
  updated_at: string
}

interface Company {
  id: string
  name: string
  company_type: string | null
  vessel_count: number | null
  operating_regions: string[] | null
  onboarding_completed: boolean
  created_at: string
  updated_at: string
}

interface UserContextType {
  // Authentication state
  isAuthenticated: boolean
  isLoading: boolean
  isLoggingOut: boolean // New state to track logout process

  // User data
  user: User | null
  company: Company | null

  // Authentication functions
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<{ success: boolean; error?: any }>

  // User data functions
  refreshUserData: () => Promise<void>
  updateUserProfile: (data: Partial<User>) => Promise<void>
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined)

// Provider component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate()

  // State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null)
  const [company, setCompany] = useState<Company | null>(null)

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true)

      try {
        // Check for existing session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          console.error("Error getting session:", sessionError)
          setIsLoading(false)
          return
        }

        if (session) {
          // We have a session, so we're authenticated
          setIsAuthenticated(true)

          // Proceed with fetching user data using the API
          await fetchUserDataFromAPI(session.access_token)
        } else {
          setIsAuthenticated(false)
          setUser(null)
          setCompany(null)
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        setIsAuthenticated(true)
        await fetchUserDataFromAPI(session.access_token)
      } else if (event === "SIGNED_OUT") {
        setIsAuthenticated(false)
        setUser(null)
        setCompany(null)
        localStorage.removeItem("userId")
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  // Fetch user data from our backend API
  const fetchUserDataFromAPI = async (token: string) => {
    // Set a timeout to detect if the function is hanging
    const timeoutId = setTimeout(() => {
      console.error("API request timeout - forcing completion")
      setIsLoading(false)
    }, 5000)

    try {
      // Call our backend API to get the user data
      const response = await fetch(`${apiBaseUrl}/api/auth/current-user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      // Clear the timeout since we got a response
      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))

        // If user not found (404), handle gracefully
        if (response.status === 404) {
          setIsAuthenticated(false)
          return
        }

        throw new Error(errorData.error || `Failed to fetch user data: ${response.status}`)
      }

      const data = await response.json()

      if (data.success && data.user) {
        // Store user ID in localStorage for backup
        localStorage.setItem("userId", data.user.id)

        // Set the user and company data
        setUser(data.user)
        setCompany(data.company || null)
      } else {
        throw new Error("Failed to fetch user data")
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      clearTimeout(timeoutId)
      setIsLoading(false)
    }
  }

  // Fetch user data - this is a wrapper that will be used by other functions
  const fetchUserData = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session && session.user) {
        await fetchUserDataFromAPI(session.access_token)
      }
    } catch (error) {
      console.error("Error refreshing user data:", error)
    }
  }

  // Authentication functions
  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Login error:", error)
        throw error
      }

      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to log in",
      }
    }
  }

  const signup = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        console.error("Signup error:", error)
        throw error
      }

      // Store email in localStorage for verification page
      localStorage.setItem("userEmail", email)

      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to sign up",
      }
    }
  }

  // Simple and robust logout function
  const logout = async () => {
    // Set logging out state to true
    setIsLoggingOut(true)

    try {
      // Clear application state first for immediate UI feedback
      setUser(null)
      setCompany(null)
      setIsAuthenticated(false)

      // Sign out from Supabase with global scope to sign out from all devices
      const { error } = await supabase.auth.signOut({ scope: "global" })

      if (error) {
        console.error("Supabase sign out error:", error)
      }

      // Clear ALL localStorage items to ensure complete cleanup
      localStorage.clear()

      console.log("Logged out successfully, localStorage cleared")

      // Redirect to login page
      navigate("/login")

      return { success: true }
    } catch (error) {
      console.error("Logout error:", error)

      // Even if there's an error, clear localStorage and redirect
      localStorage.clear()
      navigate("/login")

      return { success: false, error }
    } finally {
      setIsLoggingOut(false)
    }
  }

  // User data functions
  const refreshUserData = async () => {
    try {
      await fetchUserData()
    } catch (error) {
      console.error("Error refreshing user data:", error)
    }
  }

  // Update user profile using our backend API
  const updateUserProfile = async (data: Partial<User>) => {
    if (!user?.id) {
      console.error("Cannot update profile: No user ID")
      return
    }

    try {
      // Get the current session to include the auth token
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

      if (sessionError || !sessionData.session) {
        throw new Error("Authentication required. Please log in again.")
      }

      // Call our backend API to update the user profile
      const response = await fetch(`${apiBaseUrl}/api/auth/update-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionData.session.access_token}`,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to update profile: ${response.status}`)
      }

      const responseData = await response.json()

      if (!responseData.success) {
        throw new Error(responseData.error || "Failed to update profile")
      }

      // Refresh user data
      await refreshUserData()
    } catch (error) {
      console.error("Error updating user profile:", error)
      throw error
    }
  }

  // Context value
  const contextValue: UserContextType = {
    isAuthenticated,
    isLoading,
    isLoggingOut,
    user,
    company,
    login,
    signup,
    logout,
    refreshUserData,
    updateUserProfile,
  }

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
}

// Custom hook to use the context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext)

  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }

  return context
}
