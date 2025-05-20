"use client"

import { useState } from "react"
import { Users, UserPlus, X, Mail, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useOnboarding } from "./OnboardingContainer"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

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

  const handleAddTeamMember = () => {
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

    const newMember = {
      id: Date.now().toString(),
      email: newMemberEmail,
      role: newMemberRole,
      status: "pending",
    }

    updateData({
      teamMembers: [...onboardingData.teamMembers, newMember],
    })

    setNewMemberEmail("")
    setError("")
  }

  const handleRemoveTeamMember = (id: string) => {
    updateData({
      teamMembers: onboardingData.teamMembers.filter((member: any) => member.id !== id),
    })
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

            <Button onClick={handleAddTeamMember} className="whitespace-nowrap">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
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
                        <Badge variant="outline" className="ml-2">
                          Invitation Pending
                        </Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveTeamMember(member.id)}>
                      <X className="h-4 w-4" />
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
