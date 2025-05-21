"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react'
import { Link, useNavigate } from "react-router-dom"
import { useUser } from "../../Auth/Contexts/UserContext" // Import the useUser hook

// Simple image import for logo
import LogoBlack from "../../ReusableAssets/Logos/LogoBlack.svg"

// API Base URL Configuration
const apiBaseUrl =
  import.meta.env.MODE === "development" ? import.meta.env.VITE_DEVELOPMENT_URL : import.meta.env.VITE_API_URL

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const navigate = useNavigate()
  
  // Get the login function from your UserContext
  const { login, refreshUserData } = useUser()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Validate inputs
      if (!email || !password) {
        throw new Error("Email and password are required")
      }

      // Sanitize email
      const sanitizedEmail = email.toLowerCase().trim()

      console.log(`Attempting to sign in user: ${sanitizedEmail}`)

      // First, use the context's login function to authenticate with Supabase
      const loginResult = await login(sanitizedEmail, password)
      
      if (!loginResult.success) {
        throw new Error(loginResult.error || "Authentication failed")
      }
      
      // Now call our custom API endpoint to get additional user data
      const response = await fetch(`${apiBaseUrl}/api/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: sanitizedEmail,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Sign in failed")
      }

      if (!data.success) {
        throw new Error(data.error || "Authentication unsuccessful")
      }

      console.log("User authenticated successfully:", data.user.email)

      // Store user data in localStorage if remember me is checked
      if (rememberMe) {
        localStorage.setItem("userId", data.user.id)
        localStorage.setItem("userEmail", data.user.email)
        localStorage.setItem("userRole", data.user.role || "")
        localStorage.setItem("companyId", data.user.company_id || "")
      }

      // Store session data regardless
      localStorage.setItem("accessToken", data.user.session.access_token)
      localStorage.setItem("refreshToken", data.user.session.refresh_token)
      localStorage.setItem("tokenExpiry", data.user.session.expires_at)
      
      // Refresh user data to ensure the context is updated
      await refreshUserData()

      // Use navigate instead of window.location for a smoother transition
      navigate("/dashboard")
    } catch (error) {
      console.error("Login error:", error)
      setError(error.message || "Failed to sign in. Please check your credentials and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Login Form Section - LEFT */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <img src={LogoBlack || "/placeholder.svg"} alt="Comovis Logo" className="h-8 mx-auto mb-4" />
            <p className="text-gray-600">Streamline your maritime compliance and prevent vessel detentions</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <Mail size={20} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@oceanicshipping.com"
                  required
                  className="w-full pl-10 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <Lock size={20} />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-black text-white rounded-md hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-70 flex justify-center items-center mt-8"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/signup" className="text-blue-600 hover:underline font-medium">
                  Create an account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Maritime Media Section - RIGHT */}
      <div className="hidden lg:block lg:w-1/2 relative bg-blue-900">
        {/* Maritime-themed sidebar content remains the same */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-blue-900/70 to-blue-900/40" />
        <img
          src="/container-ship-at-sea.png"
          alt="Maritime vessel at sea"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Welcome back</h2>
          <p className="text-xl mb-6">Access your maritime compliance dashboard</p>
          <ul className="space-y-4">
            <li className="flex items-start">
              <div className="mr-3 mt-1 h-6 w-6 flex items-center justify-center rounded-full bg-blue-500/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-100"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span>Monitor document expirations</span>
            </li>
            <li className="flex items-start">
              <div className="mr-3 mt-1 h-6 w-6 flex items-center justify-center rounded-full bg-blue-500/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-100"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span>Check port requirements</span>
            </li>
            <li className="flex items-start">
              <div className="mr-3 mt-1 h-6 w-6 flex items-center justify-center rounded-full bg-blue-500/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-100"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span>Prepare for inspections</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}