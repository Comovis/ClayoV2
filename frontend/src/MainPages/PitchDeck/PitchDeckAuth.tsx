"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Ship, Lock } from "lucide-react"
import PitchDeck from "./PitchDeck"

const PITCH_DECK_PASSWORD = "9033Asd123-"

export default function PitchDeckAuth() {
  const [password, setPassword] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate a brief loading delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (password === PITCH_DECK_PASSWORD) {
      setIsAuthenticated(true)
      setError("")
    } else {
      setError("Incorrect password. Please try again.")
      setPassword("")
    }
    setIsLoading(false)
  }

  // If authenticated, show the pitch deck
  if (isAuthenticated) {
    return <PitchDeck />
  }

  // Show password form
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-700 to-slate-500 rounded-full blur-lg opacity-20"></div>
              <div className="relative bg-gradient-to-r from-slate-700 to-slate-500 p-4 rounded-full">
                <Ship className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Comovis Pitch Deck
          </CardTitle>
          <p className="text-gray-600">
            This presentation contains confidential information. Please enter the access password.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center">
                <Lock className="h-4 w-4 mr-2" />
                Access Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full"
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <Button type="submit" className="w-full bg-slate-700 hover:bg-slate-800" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Access Pitch Deck"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              For access inquiries, contact: <span className="font-medium">investors@comovis.com</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
