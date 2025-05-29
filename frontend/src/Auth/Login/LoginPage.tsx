"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useUser } from "../../Auth/Contexts/UserContext"
import SystemInitializationLoading from "./LoadingWelcomePage"

// Simple image import for logo
import LogoBlack from "../../ReusableAssets/Logos/LogoBlack.svg"

// API Base URL Configuration
const apiBaseUrl =
  import.meta.env.MODE === "development" ? import.meta.env.VITE_DEVELOPMENT_URL : import.meta.env.VITE_API_URL

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showLoadingScreen, setShowLoadingScreen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const navigate = useNavigate()

  // Get the login function from your UserContext
  const { login, refreshUserData } = useUser()

  // Add useEffect to check for lastInvitedEmail in localStorage
  useEffect(() => {
    // Check if there's a lastInvitedEmail in localStorage
    const lastInvitedEmail = localStorage.getItem("lastInvitedEmail")
    if (lastInvitedEmail) {
      // Pre-fill the email field
      setEmail(lastInvitedEmail)
      // Clear it from localStorage
      localStorage.removeItem("lastInvitedEmail")
    }
  }, [])

  const handleLoadingComplete = async () => {
    console.log("🚢 Loading complete, clearing loading flag and navigating...")

    // Clear the loading flag
    localStorage.removeItem("comovis_showing_loading")

    // Refresh user data and navigate
    await refreshUserData()
    navigate("/dashboard")
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    setShowLoadingScreen(false)

    console.log("🔐 Starting authentication process...")

    try {
      // Validate inputs
      if (!email || !password) {
        throw new Error("Email and password are required")
      }

      // Sanitize email
      const sanitizedEmail = email.toLowerCase().trim()

      console.log(`🔍 Attempting to sign in user: ${sanitizedEmail}`)

      // Set loading flag BEFORE authentication
      localStorage.setItem("comovis_showing_loading", "true")

      // First, use the context's login function to authenticate with Supabase
      const loginResult = await login(sanitizedEmail, password)

      if (!loginResult.success) {
        console.log("❌ Supabase authentication failed")
        localStorage.removeItem("comovis_showing_loading")
        throw new Error("Your email or password does not match our records")
      }

      console.log("✅ Supabase authentication successful")

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

      if (!response.ok) {
        console.log(`❌ API response not ok: ${response.status}`)
        localStorage.removeItem("comovis_showing_loading")
        if (response.status === 401 || response.status === 403) {
          throw new Error("Your email or password does not match our records")
        } else {
          throw new Error("Unable to sign in. Please try again later.")
        }
      }

      const data = await response.json()
      console.log("📊 API response data:", data)

      // Handle rate limiting specifically
      if (data.type === "RATE_LIMIT_AUTH") {
        localStorage.removeItem("comovis_showing_loading")
        throw new Error("Too many login attempts. Please wait 15 minutes before trying again.")
      }

      if (!data.success) {
        console.log("❌ API response indicates failure")
        localStorage.removeItem("comovis_showing_loading")
        throw new Error("Your email or password does not match our records")
      }

      console.log("✅ User authenticated successfully:", data.user.email)

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

      // Show loading screen
      console.log("🎬 Showing loading screen...")
      setIsLoading(false)
      setShowLoadingScreen(true)
    } catch (error) {
      console.error("❌ Login error:", error)
      localStorage.removeItem("comovis_showing_loading")

      // Display user-friendly error message with rate limiting priority
      if (error.message.includes("Too many login attempts")) {
        setError("Too many login attempts. Please wait 15 minutes before trying again.")
      } else if (
        error.message.includes("auth/invalid-email") ||
        error.message.includes("auth/user-not-found") ||
        error.message.includes("auth/wrong-password") ||
        error.message.includes("Invalid login credentials")
      ) {
        setError("Your email or password does not match our records")
      } else {
        setError(error.message || "Failed to sign in. Please try again later.")
      }
      setIsLoading(false)
      setShowLoadingScreen(false)
    }
  }

  // Show loading screen if authentication was successful
  if (showLoadingScreen) {
    console.log("🎬 Rendering loading screen")
    return <SystemInitializationLoading onComplete={handleLoadingComplete} />
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
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
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
                <Link to="/signup" className="text-blue-600 hover:underline font-medium">
                  Create an account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Maritime Media Section - RIGHT */}
      <div className="hidden lg:block lg:w-1/2 relative">
        {/* Deep ocean gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />

        {/* Subtle wave pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264.888-.14 1.005-.174 1.837-.83 2.718-1.085.878-.257 1.74-.424 2.58-.482 1.653-.23 2.343.105 3.942.105 1.6 0 2.29-.335 3.942-.105.842.058 1.704.225 2.582.482.88.254 1.713.91 2.718 1.084.17.123.53.257.887.14.36.12.72.026.887-.14 1.005-.174 1.837-.83 2.718-1.085.878-.257 1.74-.424 2.58-.482 1.653-.23 2.343.105 3.942.105 1.6 0 2.29-.335 3.942-.105.842.058 1.704.225 2.582.482.88.254 1.713.91 2.718 1.084.17.123.53.257.887.14.36.12.72.026.887-.14 1.005-.174 1.837-.83 2.718-1.085.878-.257 1.74-.424 2.58-.482 1.653-.23 2.343.105 3.942.105 1.6 0 2.29-.335 3.942-.105.842.058 1.704.225 2.582.482.88.254 1.713.91 2.718 1.084.17.123.53.257.887.14.36.12.72.026.887-.14 1.005-.174 1.837-.83 2.718-1.085.878-.257 1.74-.424 2.58-.482 1.653-.23 2.343.105 3.942.105V0H0v20h21.184z'%3E%3C/path%3E%3C/svg%3E\")",
            backgroundSize: "100px 20px",
          }}
        />

        <div className="absolute inset-0 z-20 flex flex-col justify-center p-12 text-white">
        <h2 className="text-3xl font-bold mb-6 text-white">Welcome back</h2>
          <p className="text-xl mb-8">Access your maritime compliance dashboard</p>

          <ul className="space-y-6">
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
              <div>
                <p className="font-medium">Monitor document expirations</p>
                <p className="text-sm text-blue-100/70 mt-1">
                  Track certificates, licenses, and crew documents with automated expiry alerts to maintain compliance
                </p>
              </div>
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
              <div>
                <p className="font-medium">Check & prepare for port requirements</p>
                <p className="text-sm text-blue-100/70 mt-1">
                  Access up-to-date port entry requirements and regulations
                </p>
              </div>
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
              <div>
                <p className="font-medium">Securely send documents</p>
                <p className="text-sm text-blue-100/70 mt-1">
                  Send documents instantly and securely to port authorities, agents, charterers, and other stakeholders
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
