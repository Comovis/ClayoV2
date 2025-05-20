"use client"

import { useState } from "react"
import { Users, UserPlus, X, Mail, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Maritime-specific roles
const maritimeRoles = [
  { value: "team", label: "Team Member" },
  { value: "admin", label: "Admin" },
  { value: "fleet_manager", label: "Fleet Manager" },
  { value: "dpa", label: "Designated Person Ashore (DPA)" },
  { value: "technical_manager", label: "Technical Manager" },
  { value: "crewing_manager", label: "Crewing Manager" },
  { value: "readonly", label: "Read Only" },
]

// Mock function to simulate sending invites
const sendInvite = async (email: string, role: string) => {
  // In a real implementation, this would call your API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, id: Date.now().toString() })
    }, 1000)
  })
}

export default function TeamInvites() {
  const [activeTab, setActiveTab] = useState("pending")
  const [newMemberEmail, setNewMemberEmail] = useState("")
  const [newMemberRole, setNewMemberRole] = useState("team")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Mock data for team members
  const [teamMembers, setTeamMembers] = useState([
    { id: "1", email: "captain@example.com", role: "fleet_manager", status: "active", joinedAt: "2023-05-15" },
    { id: "2", email: "engineer@example.com", role: "technical_manager", status: "active", joinedAt: "2023-05-16" },
    { id: "3", email: "officer@example.com", role: "dpa", status: "pending", invitedAt: "2023-05-20" },
  ])

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
    if (teamMembers.some((member) => member.email === newMemberEmail)) {
      setError("This team member has already been added")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const result = await sendInvite(newMemberEmail, newMemberRole)

      if (result.success) {
        const newMember = {
          id: result.id as string,
          email: newMemberEmail,
          role: newMemberRole,
          status: "pending",
          invitedAt: new Date().toISOString().split("T")[0],
        }

        setTeamMembers([...teamMembers, newMember])
        setNewMemberEmail("")
        setSuccess(`Invitation sent to ${newMemberEmail}`)

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000)
      }
    } catch (err) {
      setError("Failed to send invitation. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendInvite = async (id: string) => {
    const member = teamMembers.find((m) => m.id === id)
    if (!member) return

    setIsLoading(true)

    try {
      await sendInvite(member.email, member.role)
      setSuccess(`Invitation resent to ${member.email}`)

      // Update the invited date
      setTeamMembers(
        teamMembers.map((m) => (m.id === id ? { ...m, invitedAt: new Date().toISOString().split("T")[0] } : m)),
      )

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError("Failed to resend invitation. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveTeamMember = (id: string) => {
    setTeamMembers(teamMembers.filter((member) => member.id !== id))
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

  const activeMembers = teamMembers.filter((member) => member.status === "active")
  const pendingMembers = teamMembers.filter((member) => member.status === "pending")

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold">Team Management</h2>
        <p className="text-slate-500 dark:text-slate-400">Invite and manage your maritime compliance team members</p>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Invite Team Members</CardTitle>
          <CardDescription>Add team members to collaborate on your maritime compliance operations</CardDescription>
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

            <Button onClick={handleAddTeamMember} disabled={isLoading} className="whitespace-nowrap">
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Send Invite
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

          {success && (
            <Alert variant="success" className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Team Members</CardTitle>
          <CardDescription>Manage your maritime compliance team</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="pending">Pending Invitations ({pendingMembers.length})</TabsTrigger>
              <TabsTrigger value="active">Active Members ({activeMembers.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              {pendingMembers.length > 0 ? (
                <div className="space-y-2">
                  {pendingMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium">{member.email}</p>
                        <div className="flex items-center mt-1">
                          <Badge className={getRoleBadgeColor(member.role)}>{getRoleLabel(member.role)}</Badge>
                          <Badge variant="outline" className="ml-2">
                            Invited on {member.invitedAt}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => handleResendInvite(member.id)}>
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Resend invitation</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveTeamMember(member.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 border rounded-md border-dashed">
                  <Users className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                  <p className="font-medium mb-1">No pending invitations</p>
                  <p className="text-sm text-slate-500">
                    Invite team members to collaborate on your maritime compliance operations
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="active">
              {activeMembers.length > 0 ? (
                <div className="space-y-2">
                  {activeMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium">{member.email}</p>
                        <div className="flex items-center mt-1">
                          <Badge className={getRoleBadgeColor(member.role)}>{getRoleLabel(member.role)}</Badge>
                          <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                            Active since {member.joinedAt}
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
                  <p className="font-medium mb-1">No active team members</p>
                  <p className="text-sm text-slate-500">
                    Your invited team members will appear here once they accept their invitations
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="border-t pt-4 text-sm text-slate-500">
          <p>
            Your plan allows for up to <span className="font-medium">10 team members</span>. Need more?{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Upgrade your plan
            </a>
            .
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
