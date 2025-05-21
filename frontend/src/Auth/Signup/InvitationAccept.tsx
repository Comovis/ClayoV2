"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, Ship, Shield, FileText, Globe, Loader2, AlertCircle } from "lucide-react"
import { supabase } from "../../Auth/SupabaseAuth"
import LogoBlack from "../../ReusableAssets/Logos/LogoBlack.svg"

export default function InvitationAccept() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [invitation, setInvitation] = useState<any>(null)
  const [fullName, setFullName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [token, setToken] = useState<string | null>(null)
  // const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [wrongEmailError, setWrongEmailError] = useState(false)

  // Get the token from the URL query parameter
  const location = useLocation()

  // API Base URL Configuration
  const apiBaseUrl =
    import.meta.env.MODE === "development" ? import.meta.env.VITE_DEVELOPMENT_URL : import.meta.env.VITE_API_URL

  useEffect(() => {
    // Get token from query params
    const queryParams = new URLSearchParams(location.search)
    const tokenFromUrl = queryParams.get("token")

    if (tokenFromUrl) {
      setToken(tokenFromUrl)
      console.log("Invitation token found in URL:", tokenFromUrl)
    } else {
      console.error("No invitation token found in URL")
      setError("Invalid invitation link. Please check your email and try again.")
      setLoading(false)
    }
  }, [location])

  useEffect(() => {
    // Only proceed with invitation check if we have a token
    if (token) {
      checkInvitation(token)
    }
  }, [token])

  async function checkInvitation(inviteToken: string) {
    try {
      setLoading(true)
      console.log("Checking invitation with token:", inviteToken)

      // Check if user is already logged in
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) throw sessionError

      if (sessionData.session) {
        setIsLoggedIn(true)
        setUserData({
          id: sessionData.session.user.id,
          email: sessionData.session.user.email,
        })
        console.log("User is logged in:", sessionData.session.user.email)
      }

      // Use the new backend API endpoint to validate the invitation token
      const response = await fetch(`${apiBaseUrl}/api/validate-invitation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: inviteToken }),
      })

      const result = await response.json()

      if (!response.ok) {
        console.error("Error validating invitation:", result.error)
        throw new Error(result.error || "Failed to validate invitation")
      }

      // Set the invitation data from the API response
      setInvitation(result.invitation)

      console.log("Invitation processed successfully:", result.invitation)
    } catch (error: any) {
      console.error("Error checking invitation:", error)
      setError(error.message || "Failed to verify invitation. It may be invalid or expired.")
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptInvitation = async (e: React.FormEvent) => {
    e.preventDefault()

    // If we're not logged in, make sure to clear any existing session data
    if (!isLoggedIn) {
      try {
        // Sign out any existing session to ensure we're starting fresh
        await supabase.auth.signOut()
        console.log("Cleared any existing session before signup")
      } catch (err) {
        console.error("Error clearing session:", err)
      }
    }

    // If user is already logged in, just accept the invitation
    if (isLoggedIn) {
      await acceptInvitation(userData.id)
      return
    }

    // Basic validation
    if (!fullName.trim()) {
      setError("Please enter your full name")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setError("")
    setIsProcessing(true)

    try {
      // Use our custom API endpoint instead of direct Supabase auth
      const response = await fetch(`${apiBaseUrl}/api/invite-signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: invitation.email,
          password: password,
          fullName: fullName.trim(),
          invitationToken: token,
          companyId: invitation.companyId,
          role: invitation.role,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to create account")
      }

      // If we have a user ID, accept the invitation
      if (data.user && data.user.id) {
        await acceptInvitation(data.user.id)
      } else {
        // This should not happen, but just in case
        setError("Failed to create or identify your account. Please try again.")
        setIsProcessing(false)
      }
    } catch (error: any) {
      console.error("Error accepting invitation:", error)
      setError(error.message || "Failed to create your account. Please try again.")
      setIsProcessing(false)
    }
  }

  // Update the acceptInvitation function to handle the specific error
  const acceptInvitation = async (userId: string) => {
    try {
      setIsProcessing(true)
      console.log("Accepting invitation with token:", token, "for user:", userId)

      // If the user is already logged in, we might want to update their name
      // if they don't have one set yet
      if (isLoggedIn && fullName.trim()) {
        try {
          // Update the user's name in the public.users table
          const { error: updateError } = await supabase
            .from("users")
            .update({ full_name: fullName.trim() })
            .eq("id", userId)

          if (updateError) {
            console.error("Error updating user name:", updateError)
          }
        } catch (err) {
          console.error("Error updating user name:", err)
        }
      }

      // Use the API endpoint to accept the invitation
      const response = await fetch(`${apiBaseUrl}/api/accept-invitation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          userId,
          fullName: fullName.trim() || null,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        console.error("Error accepting invitation:", result.error)

        // Check if this is a wrong email error
        if (result.error && result.error.includes("You are currently logged in as")) {
          setWrongEmailError(true)
          setError(result.error)
          setIsProcessing(false)
          return
        }

        throw new Error(result.error || "Failed to accept invitation")
      }

      console.log("Invitation accepted successfully")
      setIsComplete(true)

      // Clear the invited user flag as we're now redirecting
      localStorage.removeItem("isInvitedUser")

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 2000)
    } catch (error: any) {
      console.error("Error accepting invitation:", error)
      setError(error.message || "Failed to accept invitation. Please try again.")
      setIsProcessing(false)
    }
  }

  const handleResendConfirmationEmail = async () => {
    setIsProcessing(true)
    try {
      const response = await fetch(`${apiBaseUrl}/api/resend-confirmation-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: invitation.email }),
      })

      if (!response.ok) {
        throw new Error("Failed to resend confirmation email")
      }

      // Show success message
      setResendSuccess(true)
      setTimeout(() => setResendSuccess(false), 3000)
    } catch (error) {
      setError("Failed to resend confirmation email. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-lg font-medium">Verifying invitation...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Invalid Invitation</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => (window.location.href = "/")}>Return to Home</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Add this new UI component to handle wrong email error
  // Add this right after the error check in your component
  if (wrongEmailError) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-amber-600">Wrong Account</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="warning" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Email Mismatch</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <p className="text-center mb-4">To accept this invitation, you need to:</p>
            <ol className="list-decimal pl-6 mb-4 space-y-2">
              <li>Sign out of your current account</li>
              <li>Sign in with the email address the invitation was sent to</li>
              <li>Open the invitation link again</li>
            </ol>
          </CardContent>
          <CardFooter className="flex justify-center space-x-4">
            <Button
              variant="outline"
              onClick={async () => {
                await supabase.auth.signOut()
                window.location.href = "/login"
              }}
            >
              Sign Out
            </Button>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  
  if (isComplete) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-green-600">Invitation Accepted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-center mb-4">
              You have successfully joined {invitation.companyName}'s maritime compliance platform
            </p>
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="mb-2 text-sm font-medium">You now have access to:</p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Ship className="mr-2 h-5 w-5 text-slate-700" />
                  <span className="text-sm">Fleet compliance management</span>
                </li>
                <li className="flex items-start">
                  <FileText className="mr-2 h-5 w-5 text-slate-700" />
                  <span className="text-sm">Document expiry tracking</span>
                </li>
                <li className="flex items-start">
                  <Globe className="mr-2 h-5 w-5 text-slate-700" />
                  <span className="text-sm">Port requirement intelligence</span>
                </li>
                <li className="flex items-start">
                  <Shield className="mr-2 h-5 w-5 text-slate-700" />
                  <span className="text-sm">Port State Control inspection preparation</span>
                </li>
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" size="lg" onClick={() => (window.location.href = "/dashboard")}>
              Go to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (!invitation) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-8 w-8 mx-auto mb-4 text-amber-600" />
            <p className="text-lg font-medium">No valid invitation found</p>
            <p className="text-sm text-slate-500 mt-2">Please check your invitation link and try again.</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => (window.location.href = "/")}>Return to Home</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50 dark:bg-slate-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <img src={LogoBlack || "/placeholder.svg"} width="100" height="93" alt="Comovis" className="mx-auto" />
          </div>
          <CardTitle className="text-xl">Accept Invitation</CardTitle>
          <CardDescription>
            {invitation.inviterName} has invited you to join {invitation.companyName}'s maritime compliance platform as
            a <strong>{formatRoleName(invitation.role)}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoggedIn ? (
            <div className="space-y-4">
              <Alert className="bg-blue-50 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                <p>
                  You're logged in as <strong>{userData.email}</strong>. Click the button below to accept this
                  invitation with your current account.
                </p>
              </Alert>
              {/* Add name field for logged-in users if needed */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Your Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                />
                <p className="text-xs text-slate-500">
                  We'll use this name to identify you in the platform. Leave blank to keep your current name.
                </p>
              </div>
              <Button
                onClick={() => acceptInvitation(userData.id)}
                disabled={isProcessing}
                className="w-full"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Accept Invitation"
                )}
              </Button>
              <p className="text-center text-sm text-slate-500">
                Not {userData.email}?{" "}
                <button
                  className="text-blue-600 hover:underline"
                  onClick={async () => {
                    await supabase.auth.signOut()
                    window.location.reload()
                  }}
                >
                  Sign out
                </button>
              </p>
            </div>
          ) : (
            <form onSubmit={handleAcceptInvitation} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={invitation.email} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Your Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Create Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm font-medium text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating your account...
                  </>
                ) : (
                  "Accept Invitation"
                )}
              </Button>
              <p className="text-center text-sm text-slate-500">
                Already have an account?{" "}
                <a href="/login" className="text-blue-600 hover:underline">
                  Sign in
                </a>
              </p>
            </form>
          )}

          <Separator className="my-6" />

          <div className="rounded-lg bg-slate-50 p-4">
            <h3 className="mb-2 text-sm font-medium">With Comovis, you'll be able to:</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start">
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                Track vessel certificates and their expiry dates
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                Access real-time port requirement intelligence
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                Prepare for Port State Control inspections
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                Streamline maritime compliance documentation
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Function to format role names
function formatRoleName(role: string): string {
  if (!role) return ""

  // Replace underscores with spaces and capitalize each word
  return role
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}
