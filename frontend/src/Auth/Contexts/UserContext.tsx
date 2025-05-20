"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../../Auth/SupabaseAuth"

// Define types for user data
interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  role: string
  companyId: string
  createdAt: string
  lastLogin?: string
}

interface Company {
  id: string
  name: string
  operatingRegions: string[]
}

interface UserContextType {
  // Authentication state
  isAuthenticated: boolean
  isLoading: boolean
  
  // User data
  user: User | null
  company: Company | null
  
  // Authentication functions
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  
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
  const [user, setUser] = useState<User | null>(null)
  const [company, setCompany] = useState<Company | null>(null)
  
  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true)
      
      try {
        // Check for existing session
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session) {
          setIsAuthenticated(true)
          await fetchUserData(session.user.id)
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
        await fetchUserData(session.user.id)
      } else if (event === "SIGNED_OUT") {
        setIsAuthenticated(false)
        setUser(null)
        setCompany(null)
      }
    })
    
    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])
  
  // Fetch user data from database
  const fetchUserData = async (userId: string) => {
    try {
      // Fetch user profile
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single()
      
      if (userError) throw userError
      
      if (userData) {
        setUser(userData as User)
        
        // Fetch company data if user has a company
        if (userData.company_id) {
          const { data: companyData, error: companyError } = await supabase
            .from("companies")
            .select("*")
            .eq("id", userData.company_id)
            .single()
          
          if (companyError) throw companyError
          
          if (companyData) {
            setCompany(companyData as Company)
          }
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }
  
  // Authentication functions
  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      
      return { success: true }
    } catch (error: any) {
      console.error("Login error:", error)
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
      
      if (error) throw error
      
      // Store email in localStorage for verification page
      localStorage.setItem("userEmail", email)
      
      return { success: true }
    } catch (error: any) {
      console.error("Signup error:", error)
      return {
        success: false,
        error: error.message || "Failed to sign up",
      }
    }
  }
  
  const logout = async () => {
    try {
      await supabase.auth.signOut()
      navigate("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }
  
  // User data functions
  const refreshUserData = async () => {
    if (user?.id) {
      await fetchUserData(user.id)
    }
  }
  
  const updateUserProfile = async (data: Partial<User>) => {
    if (!user?.id) return
    
    try {
      const { error } = await supabase
        .from("users")
        .update(data)
        .eq("id", user.id)
      
      if (error) throw error
      
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