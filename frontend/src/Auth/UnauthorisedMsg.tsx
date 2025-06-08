"use client"

import type React from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Shield, ArrowRight } from "lucide-react"

const UnauthorizedMessage: React.FC = () => {
  const navigate = useNavigate()

  const handleReturnHome = () => {
    navigate("/")
  }

  const handleSignIn = () => {
    navigate("/login")
  }

  return (
    <div className="min-h-[50vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-blue-500" />
            <h2 className="text-2xl font-semibold">Sign in Required</h2>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            It looks like you're trying to access a protected area of Clayo. Please sign in to continue managing your account.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Sign In Button */}
            <button
              onClick={handleSignIn}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-[#0a1128] text-white rounded-lg hover:bg-[#0a1128cc] transition-colors"
            >
              Sign In
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Return Home Button */}
            <button
              onClick={handleReturnHome}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Return Home
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default UnauthorizedMessage
