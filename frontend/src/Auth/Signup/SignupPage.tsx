"use client"

import type React from "react"
import { useState } from "react"
import { Mail, Lock, User, Building2, Loader2, AlertCircle } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Simple image import for logo
import LogoBlack from "../../ReusableAssets/Logos/LogoBlack.svg"

// API Base URL Configuration
const apiBaseUrl =
  import.meta.env.MODE === "development" ? import.meta.env.VITE_DEVELOPMENT_URL : import.meta.env.VITE_API_URL

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [passwordMatch, setPasswordMatch] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    // Check if passwords match
    const password = (e.currentTarget.elements.namedItem("password") as HTMLInputElement).value
    const confirmPassword = (e.currentTarget.elements.namedItem("confirmPassword") as HTMLInputElement).value
    const email = (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value
    const companyName = (e.currentTarget.elements.namedItem("company") as HTMLInputElement).value
    const fullName = (e.currentTarget.elements.namedItem("name") as HTMLInputElement).value

    if (password !== confirmPassword) {
      setPasswordMatch(false)
      return
    }

    setPasswordMatch(true)
    setIsLoading(true)

    try {
      // Call our new backend signup endpoint that handles everything
      const response = await fetch(`${apiBaseUrl}/api/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          fullName,
          companyName,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to create account")
      }

      // Store email in localStorage for verification page
      localStorage.setItem("userEmail", email)

      // Redirect to email verification page
      navigate("/confirm-email")
    } catch (err: any) {
      console.error("Signup error:", err)
      setError(err.message || "An error occurred during signup")
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
            <CardTitle className="text-2xl font-bold text-black">Create your account</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-800">
                  <div>
                    <p className="font-medium">Registration error</p>
                    <p className="text-sm">{error}</p>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="company" className="text-sm font-medium text-black">
                  Company Name
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="company"
                    name="company"
                    type="text"
                    placeholder="Oceanic Shipping Ltd."
                    required
                    className="pl-10 h-12 border-gray-200 focus:border-black focus:ring-black bg-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-black">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Smith"
                    required
                    className="pl-10 h-12 border-gray-200 focus:border-black focus:ring-black bg-white"
                  />
                </div>
              </div>

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
                    placeholder="john@oceanicshipping.com"
                    required
                    className="pl-10 h-12 border-gray-200 focus:border-black focus:ring-black bg-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-black">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="pl-10 h-12 border-gray-200 focus:border-black focus:ring-black bg-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-black">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    required
                    className={`pl-10 h-12 border-gray-200 focus:border-black focus:ring-black bg-white ${
                      passwordMatch ? "" : "border-red-500"
                    }`}
                  />
                </div>
                {!passwordMatch && <p className="text-sm text-red-500 mt-1">Passwords do not match</p>}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-black text-white hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-70 mt-8"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="text-center mt-6">
              <p className="text-sm text-black">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
