"use client"

import type React from "react"
import { useState } from "react"
import { Mail, Lock, User, Building2, Loader2, AlertCircle, Shield, Anchor } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

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
    <div className="flex min-h-screen bg-white">
      {/* Signup Form Section - LEFT */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <img src={LogoBlack || "/placeholder.svg"} alt="Comovis Logo" className="h-8 mx-auto mb-4" />
            <p className="text-gray-600">Streamline your maritime compliance and prevent vessel detentions</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Registration error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="company" className="block text-sm font-medium mb-2">
                Company Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <Building2 size={20} />
                </div>
                <input
                  id="company"
                  name="company"
                  type="text"
                  placeholder="Oceanic Shipping Ltd."
                  required
                  className="w-full pl-10 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <User size={20} />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Smith"
                  required
                  className="w-full pl-10 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

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
                  placeholder="john@oceanicshipping.com"
                  required
                  className="w-full pl-10 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <Lock size={20} />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <Lock size={20} />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                  className={`w-full pl-10 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                    passwordMatch ? "border-gray-200" : "border-red-500"
                  }`}
                />
              </div>
              {!passwordMatch && <p className="text-sm text-red-500 mt-1">Passwords do not match</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-black text-white rounded-md hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-70 flex justify-center items-center mt-8"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Premium Geometric Design Section - RIGHT */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        {/* Complex gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-900/20 to-slate-900/30" />

        {/* Sophisticated flowing shapes */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Primary flowing shape */}
          <div className="absolute -top-32 -right-32 w-[800px] h-[800px] opacity-30">
            <svg viewBox="0 0 800 800" className="w-full h-full">
              <defs>
                <linearGradient id="flow1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(59, 130, 246, 0.4)" />
                  <stop offset="50%" stopColor="rgba(147, 197, 253, 0.2)" />
                  <stop offset="100%" stopColor="rgba(219, 234, 254, 0.1)" />
                </linearGradient>
                <filter id="glow1">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path
                d="M200,100 Q400,50 600,150 Q700,250 650,400 Q600,550 400,600 Q200,650 100,500 Q50,350 150,200 Q200,100 200,100"
                fill="url(#flow1)"
                filter="url(#glow1)"
                className="animate-pulse"
                style={{ animationDuration: "4s" }}
              />
            </svg>
          </div>

          {/* Secondary flowing shape */}
          <div className="absolute top-1/4 -left-24 w-[600px] h-[600px] opacity-20">
            <svg viewBox="0 0 600 600" className="w-full h-full">
              <defs>
                <linearGradient id="flow2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(99, 102, 241, 0.3)" />
                  <stop offset="100%" stopColor="rgba(165, 180, 252, 0.1)" />
                </linearGradient>
                <filter id="glow2">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path
                d="M150,200 Q300,100 450,200 Q500,300 400,450 Q300,500 200,400 Q100,300 150,200"
                fill="url(#flow2)"
                filter="url(#glow2)"
                className="animate-pulse"
                style={{ animationDuration: "6s", animationDelay: "1s" }}
              />
            </svg>
          </div>

          {/* Tertiary accent shape */}
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] opacity-25">
            <svg viewBox="0 0 400 400" className="w-full h-full">
              <defs>
                <radialGradient id="flow3">
                  <stop offset="0%" stopColor="rgba(147, 197, 253, 0.4)" />
                  <stop offset="100%" stopColor="rgba(59, 130, 246, 0.1)" />
                </radialGradient>
              </defs>
              <path
                d="M100,150 Q200,50 300,150 Q350,200 300,250 Q200,350 100,250 Q50,200 100,150"
                fill="url(#flow3)"
                className="animate-pulse"
                style={{ animationDuration: "5s", animationDelay: "2s" }}
              />
            </svg>
          </div>

          {/* Floating particles */}
          <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-blue-400/60 rounded-full animate-pulse shadow-lg shadow-blue-400/30" />
          <div
            className="absolute top-2/3 right-1/2 w-2 h-2 bg-indigo-300/40 rounded-full animate-pulse shadow-lg shadow-indigo-300/20"
            style={{ animationDelay: "1.5s", animationDuration: "3s" }}
          />
          <div
            className="absolute top-1/2 right-1/4 w-2.5 h-2.5 bg-blue-500/50 rounded-full animate-pulse shadow-lg shadow-blue-500/25"
            style={{ animationDelay: "0.5s", animationDuration: "4s" }}
          />
          <div
            className="absolute top-1/4 right-2/3 w-1.5 h-1.5 bg-slate-300/30 rounded-full animate-pulse"
            style={{ animationDelay: "2.5s", animationDuration: "2s" }}
          />
        </div>

        {/* Content overlay with better typography */}
        <div className="absolute inset-0 z-20 flex flex-col justify-center p-16">
          <div className="max-w-lg">
            <h2 className="text-3xl font-bold mb-8 leading-tight text-white font-inter">
              Navigate compliance with confidence
            </h2>

            <div className="space-y-6">
              <div className="flex items-start group">
                <div className="mr-5 mt-1 h-8 w-8 flex items-center justify-center rounded-full bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 group-hover:bg-blue-500/30 transition-all duration-300">
                  <Shield size={16} className="text-blue-200" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2 text-base font-inter">Automated Document Management</h3>
                  <p className="text-blue-100/70 leading-relaxed text-sm font-inter">
                    AI-powered certificate tracking with intelligent expiry alerts and compliance gap detection
                  </p>
                </div>
              </div>

              <div className="flex items-start group">
                <div className="mr-5 mt-1 h-8 w-8 flex items-center justify-center rounded-full bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 group-hover:bg-blue-500/30 transition-all duration-300">
                  <Anchor size={16} className="text-blue-200" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2 text-base font-inter">Detention Prevention</h3>
                  <p className="text-blue-100/70 leading-relaxed text-sm font-inter">
                    Proactive compliance monitoring that prevents costly delays and port state control issues
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
