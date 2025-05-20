"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, Ship, Shield, FileText, Globe, Loader2, AlertCircle } from "lucide-react"
import { supabase } from "../../Auth/SupabaseAuth"
import LogoBlack from "../../../ReusableAssets/Logos/LogoBlack.svg"

export default function InvitationPage({ params }: { params: { token: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [invitation, setInvitation] = useState<any>(null)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    async function checkInvitation() {
      try {
        setLoading(true)

        // Check if user is already logged in
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) throw sessionError

        if (sessionData.session) {
          setIsLoggedIn(true)
          setUserData({
            id: sessionData.session.user.id,
            email: sessionData.session.user.email,
          })
        }

        // Get the invitation details
        const { data, error } = await supabase
          .from("team_invitations")
          .select(`
            id,
            email,
            role,
            invitation_token,
            company_id,
            invited_by,
            companies(name),
            users!team_invitations_invited_by_fkey(name)
          `)
          .eq("invitation_token", params.token)
          .eq("invitation_status", "pending")
          .gt("expires_at", new Date().toISOString())
          .single()

        if (error) throw error

        if (!data) {
          setError("This invitation is invalid or has expired.")
          return
        }

        setInvitation({
          id: data.id,
          email: data.email,
          role: data.role,
          token: data.invitation_token,
          companyId: data.company_id,
          invitedBy: data.invited_by,
          companyName: data.companies?.name || "Comovis",
          inviterName: data.users?.name || "A team administrator",
        })
      } catch (error) {
        console.error("Error checking invitation:", error)
        setError("Failed to verify invitation. It may be invalid or expired.")
      } finally {
        setLoading(false)
      }
    }

    checkInvitation()
  }, [params.token])

  const handleAcceptInvitation = async (e: React.FormEvent) => {
    e.preventDefault()

    // If user is already logged in, just accept the invitation
    if (isLoggedIn) {
      await acceptInvitation(userData.id)
      return
    }

    // Basic validation
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
      // Create a new user account
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: invitation.email,
        password: password,
        options: {
          data: {
            name: "",
            role: invitation.role,
            company_id: invitation.companyId,
          },
        },
      })

      if (signUpError) throw signUpError

      if (!signUpData.user) {
        throw new Error("Failed to create user account")
      }

      // Accept the invitation
      await acceptInvitation(signUpData.user.id)
    } catch (error) {
      console.error("Error accepting invitation:", error)
      setError("Failed to create your account. Please try again.")
      setIsProcessing(false)
    }
  }

  const acceptInvitation = async (userId: string) => {
    try {
      setIsProcessing(true)

      // Accept the invitation
      const { data, error } = await supabase.rpc("accept_team_invitation", {
        p_invitation_token: params.token,
        p_user_id: userId,
      })

      if (error) throw error

      setIsComplete(true)

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (error) {
      console.error("Error accepting invitation:", error)
      setError("Failed to accept invitation. Please try again.")
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
            <Button onClick={() => router.push("/")}>Return to Home</Button>
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
            <Button className="w-full" size="lg" onClick={() => router.push("/dashboard")}>
              Go to Dashboard
            </Button>
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
            a <strong>{invitation.role}</strong>
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
