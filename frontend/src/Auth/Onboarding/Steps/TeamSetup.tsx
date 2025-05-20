"use client"

import { useState } from "react"
import { Users, UserPlus, X, Mail, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useOnboarding } from "./OnboardingContainer"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { supabase } from "../../SupabaseAuth"

// API Base URL Configuration
const apiBaseUrl =
  import.meta.env.MODE === "development" ? import.meta.env.VITE_DEVELOPMENT_URL : import.meta.env.VITE_API_URL

// Maritime-specific roles
const maritimeRoles = [
  { value: "team", label: "Team" },
  { value: "admin", label: "Admin" },
  { value: "fleet_manager", label: "Fleet Manager" },
  { value: "dpa", label: "Designated Person Ashore (DPA)" },
  { value: "technical_manager", label: "Technical Manager" },
  { value: "crewing_manager", label: "Crewing Manager" },
  { value: "readonly", label: "Read Only" },
]

export default function TeamSetup() {
  const { onboardingData, updateData, nextStep } = useOnboarding()
  const [newMemberEmail, setNewMemberEmail] = useState("")
  const [newMemberRole, setNewMemberRole] = useState("team")
  const [error, setError] = useState("")
  const [isInviting, setIsInviting] = useState(false)
  const [invitationSuccess, setInvitationSuccess] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)

  // Update the handleAddTeamMember function to include the auth token
  const handleAddTeamMember = async () => {
    if (!newMemberEmail) {
      setError("Please enter an email address")
      return
    }

    if (!newMemberEmail.includes("@") || !newMemberEmail.includes(".")) {
      setError("Please enter a valid email address")
      return
    }

    // Check if email already exists
    if (onboardingData.teamMembers.some((member: any) => member.email === newMemberEmail)) {
      setError("This team member has already been added")
      return
    }

    setIsInviting(true)
    setError("")

    try {
      // Get the current session to include the auth token
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

      if (sessionError || !sessionData.session) {
        throw new Error("Authentication required. Please log in again.")
      }

      // Get the access token from the session
      const token = sessionData.session.access_token

      // Send the invitation email via API with the auth token
      const response = await fetch(`${apiBaseUrl}/api/send-team-invitation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add the auth token here
        },
        body: JSON.stringify({
          email: newMemberEmail,
          role: newMemberRole,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send invitation")
      }

      // Add to local state
      const newMember = {
        id: data.invitationId || Date.now().toString(),
        email: newMemberEmail,
        role: newMemberRole,
        status: "pending",
        invitationSent: true,
        invitationId: data.invitationId,
      }

      updateData({
        teamMembers: [...onboardingData.teamMembers, newMember],
      })

      setNewMemberEmail("")
      setNewMemberRole("team")
      setInvitationSuccess(true)

      // Hide success message after 3 seconds
      setTimeout(() => {
        setInvitationSuccess(false)
      }, 3000)
    } catch (error) {
      console.error("Error sending invitation:", error)
      setError("Failed to send invitation. Please try again.")
    } finally {
      setIsInviting(false)
    }
  }

  const handleRemoveTeamMember = async (id: string) => {
    try {
      setIsCancelling(true)
      setError("")

      // Find the member to remove
      const memberToRemove = onboardingData.teamMembers.find((member: any) => member.id === id)

      if (!memberToRemove) {
        throw new Error("Team member not found")
      }

      if (memberToRemove.invitationSent) {
        // Get the current session to include the auth token
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

        if (sessionError || !sessionData.session) {
          throw new Error("Authentication required. Please log in again.")
        }

        // Get the access token from the session
        const token = sessionData.session.access_token

        console.log("Cancelling invitation for email:", memberToRemove.email)

        // Call the API to cancel the invitation using email instead of ID
        console.log("Cancelling invitation for email:", memberToRemove.email)
        const response = await fetch(`${apiBaseUrl}/api/cancel-team-invitation`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: memberToRemove.email,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to cancel invitation")
        }

        console.log("Invitation cancelled successfully:", data)

        // Update the local state to show the invitation as revoked
        const updatedTeamMembers = onboardingData.teamMembers.map((member: any) => {
          if (member.id === id) {
            return { ...member, status: "revoked" }
          }
          return member
        })

        updateData({
          teamMembers: updatedTeamMembers,
        })
      } else {
        // If it's just a local entry (not yet sent to server), remove it from local state
        updateData({
          teamMembers: onboardingData.teamMembers.filter((member: any) => member.id !== id),
        })
      }
    } catch (error) {
      console.error("Error removing team member:", error)
      setError("Failed to remove team member. Please try again.")
    } finally {
      setIsCancelling(false)
    }
  }

  const handleSkip = () => {
    updateData({ skipTeamSetup: true })
    nextStep()
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "team":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "admin":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
      case "dpa":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "fleet_manager":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "technical_manager":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "crewing_manager":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "readonly":
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
      default:
        return ""
    }
  }

  const getRoleLabel = (role: string) => {
    const roleObj = maritimeRoles.find((r) => r.value === role)
    return roleObj ? roleObj.label : role
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Invitation Pending</Badge>
      case "revoked":
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-800">
            Invitation Revoked
          </Badge>
        )
      case "accepted":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-800">
            Invitation Accepted
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold">Team Setup</h2>
        <p className="text-slate-500 dark:text-slate-400">
          Invite your team members to collaborate on your maritime compliance operations
        </p>
        <div className="mt-2">
          <Button variant="outline" size="sm" onClick={handleSkip}>
            Skip for now (you can add team members later)
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Invite Team Members</CardTitle>
          <CardDescription>Add team members who will access your Comovis platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Email address"
                value={newMemberEmail}
                onChange={(e) => {
                  setNewMemberEmail(e.target.value)
                  setError("")
                }}
                className="pl-10"
              />
            </div>

            <Select value={newMemberRole} onValueChange={setNewMemberRole}>
              <SelectTrigger className="w-full md:w-56">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                {maritimeRoles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={handleAddTeamMember} className="whitespace-nowrap" disabled={isInviting}>
              {isInviting ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  Inviting...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Member
                </>
              )}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {invitationSuccess && (
            <Alert className="bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-200">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>Invitation sent successfully!</AlertDescription>
            </Alert>
          )}

          <div className="pt-2">
            <p className="text-sm text-slate-500 mb-4">
              Your plan allows for up to{" "}
              <span className="font-medium">
                {onboardingData.vesselCount <= 5 ? "3" : onboardingData.vesselCount <= 20 ? "10" : "unlimited"} team
                members
              </span>
            </p>

            {onboardingData.teamMembers && onboardingData.teamMembers.length > 0 ? (
              <div className="space-y-2">
                {onboardingData.teamMembers.map((member: any) => (
                  <div key={member.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <p className="font-medium">{member.email}</p>
                      <div className="flex items-center mt-1">
                        <Badge className={getRoleBadgeColor(member.role)}>{getRoleLabel(member.role)}</Badge>
                        {getStatusBadge(member.status)}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveTeamMember(member.id)}
                      title={member.status === "pending" ? "Cancel invitation" : "Remove member"}
                      disabled={isCancelling}
                    >
                      {isCancelling ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 border rounded-md border-dashed">
                <Users className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                <p className="font-medium mb-1">No team members added yet</p>
                <p className="text-sm text-slate-500">
                  Add team members to collaborate on your maritime compliance operations
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
