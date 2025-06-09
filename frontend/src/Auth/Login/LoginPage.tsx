"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { useUser } from "../../Auth/Contexts/UserContext"

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    console.log("🔐 Starting authentication process...")

    try {
      // Validate inputs
      if (!email || !password) {
        throw new Error("Email and password are required")
      }

      // Sanitize email
      const sanitizedEmail = email.toLowerCase().trim()

      console.log(`🔍 Attempting to sign in user: ${sanitizedEmail}`)

      // Set a flag to prevent UserContext from auto-redirecting
      localStorage.setItem("login_in_progress", "true")

      // First, use the context's login function to authenticate with Supabase
      const loginResult = await login(sanitizedEmail, password)

      if (!loginResult.success) {
        console.log("❌ Supabase authentication failed")
        localStorage.removeItem("login_in_progress")
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
        localStorage.removeItem("login_in_progress")
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
        localStorage.removeItem("login_in_progress")
        throw new Error("Too many login attempts. Please wait 15 minutes before trying again.")
      }

      if (!data.success) {
        console.log("❌ API response indicates failure")
        localStorage.removeItem("login_in_progress")
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

      // Clear the login flag and refresh user data
      localStorage.removeItem("login_in_progress")
      await refreshUserData()

      // Navigate directly to dashboard - the welcome modal will handle onboarding
      console.log("🎯 Navigating to dashboard...")
      navigate("/dashboard")
    } catch (error) {
      console.error("❌ Login error:", error)
      localStorage.removeItem("login_in_progress")

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
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white">
          <CardHeader className="text-center pb-8">
            <div className="mb-6">
              <img src={LogoBlack || "/placeholder.svg"} alt="Comovis Logo" className="h-10 mx-auto mb-4" />
            </div>
            <CardTitle className="text-2xl font-bold text-black">Welcome back</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-black">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@oceanicshipping.com"
                    required
                    className="pl-10 h-12 border-gray-200 focus:border-black focus:ring-black bg-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-black">
                    Password
                  </Label>
                  <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="pl-10 h-12 border-gray-200 focus:border-black focus:ring-black bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                  className="border-gray-300 data-[state=checked]:bg-black data-[state=checked]:border-black"
                />
                <Label htmlFor="remember" className="text-sm text-black cursor-pointer">
                  Remember me
                </Label>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-black text-white hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-70 mt-8"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="text-center mt-6">
              <p className="text-sm text-black">
                Don't have an account?{" "}
                <Link to="/signup" className="text-blue-600 hover:underline font-medium">
                  Create an account
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
