"use client"

import { useState, useEffect } from "react"
import { Users, UserPlus, X, Mail, AlertCircle, CheckCircle, RefreshCw, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useUser } from "../../Auth/Contexts/UserContext" // Import the useUser hook
import { supabase } from "../../Auth/SupabaseAuth"

// API Base URL Configuration
const apiBaseUrl =
  import.meta.env.MODE === "development" ? import.meta.env.VITE_DEVELOPMENT_URL : import.meta.env.VITE_API_URL

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

export default function TeamInvites() {
  // Use the UserContext
  const { isAuthenticated, isLoading: isUserLoading, user } = useUser()

  const [activeTab, setActiveTab] = useState("pending")
  const [newMemberEmail, setNewMemberEmail] = useState("")
  const [newMemberRole, setNewMemberRole] = useState("team")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [teamMembers, setTeamMembers] = useState([])
  const [isLoadingMembers, setIsLoadingMembers] = useState(true)

  // Fetch team members when user is authenticated
  useEffect(() => {
    console.log("🔍 TeamInvites component mounted")
    console.log("🔑 Auth state:", { isAuthenticated, isUserLoading, userId: user?.id })

    if (isAuthenticated && user && !isUserLoading) {
      console.log("👤 User is authenticated, fetching team members")
      fetchTeamMembers()
    } else if (!isUserLoading) {
      console.log("⚠️ User not authenticated or still loading")
      setIsLoadingMembers(false)
    }
  }, [isAuthenticated, isUserLoading, user])

  // Fetch team members from API
  const fetchTeamMembers = async () => {
    if (!isAuthenticated || !user) {
      console.log("⚠️ Cannot fetch team members: User not authenticated")
      setIsLoadingMembers(false)
      return
    }

    setIsLoadingMembers(true)
    setError("")

    try {
      console.log("🔍 Starting to fetch team members...")
      console.log("🌐 Environment mode:", import.meta.env.MODE)
      console.log("🌐 VITE_DEVELOPMENT_URL:", import.meta.env.VITE_DEVELOPMENT_URL)
      console.log("🌐 VITE_API_URL:", import.meta.env.VITE_API_URL)

      // Get user ID from context or localStorage
      const userId = user.id || localStorage.getItem("userId")
      if (!userId) {
        console.error("🛑 No user ID found in context or localStorage")
        throw new Error("No user ID available. Please log in again.")
      }
      console.log(`👤 Using user ID: ${userId}`)

      // Get auth token from Supabase
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

      if (sessionError) {
        console.error("🛑 Session error:", sessionError)
        throw new Error("Authentication required. Please log in again.")
      }

      if (!sessionData.session) {
        console.error("🛑 No active session found")
        throw new Error("No active session found. Please log in again.")
      }

      // Get the access token from the session
      const token = sessionData.session.access_token
      console.log("✅ Got authentication token")

      // Log the API URL being called
      const apiUrl = `${apiBaseUrl}/api/team-members`
      console.log(`📡 Fetching from API: ${apiUrl}`)
      console.log(`👤 User ID: ${userId}, Company ID: ${user.company_id}`)

      // Add a timeout for the fetch
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      try {
        // Fetch team members from API
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        })

        clearTimeout(timeoutId)
        console.log(`📥 Response status: ${response.status}`)

        // Parse the JSON response
        const data = await response.json()
        console.log("✅ Parsed response data:", data)

        if (!response.ok) {
          console.error("🛑 API error:", data.error || "Unknown error")
          throw new Error(data.error || `Failed to fetch team members: ${response.status}`)
        }

        // Check if the response has the expected structure
        if (!data.success) {
          console.error("🛑 API returned success: false", data)
          throw new Error(data.error || "API returned unsuccessful response")
        }

        // Ensure teamMembers is always an array
        const teamMembersArray = Array.isArray(data.teamMembers) ? data.teamMembers : []
        console.log(`✅ Received ${teamMembersArray.length} team members`)

        setTeamMembers(teamMembersArray)
        setIsLoadingMembers(false)
      } catch (fetchError) {
        clearTimeout(timeoutId)
        console.error("⚠️ Fetch error:", fetchError)

        if (fetchError.name === "AbortError") {
          console.error("⏱️ Request timed out after 10 seconds")

          // Use mock data as fallback for development
          if (import.meta.env.MODE === "development") {
            console.log("📦 Using mock data for development")
            setTeamMembers([
              {
                id: "1",
                email: user.email,
                name: user.full_name,
                role: user.role,
                status: "active",
                isCompanyAdmin: user.is_company_admin,
                joinedAt: new Date().toISOString().split("T")[0],
              },
              {
                id: "2",
                email: "pending@example.com",
                role: "technical_manager",
                status: "pending",
                invitedAt: new Date().toISOString().split("T")[0],
              },
              {
                id: "3",
                email: "revoked@example.com",
                role: "readonly",
                status: "revoked",
                invitedAt: "2023-05-10",
                revokedAt: "2023-05-18",
              },
            ])
          } else {
            throw new Error("Request timed out. Please try again.")
          }
        } else {
          throw fetchError
        }
      }
    } catch (error) {
      console.error("🛑 Error fetching team members:", error)
      setError("Failed to load team members. Please refresh the page.")
    } finally {
      setIsLoadingMembers(false)
      console.log("🏁 Team members fetch attempt completed")
    }
  }

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
          Authorization: `Bearer ${token}`,
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

      // Refresh the team members list to include the new invitation
      await fetchTeamMembers()

      setNewMemberEmail("")
      setNewMemberRole("team")
      setSuccess(`Invitation sent to ${newMemberEmail}`)

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess("")
      }, 3000)
    } catch (error) {
      console.error("Error sending invitation:", error)
      setError("Failed to send invitation. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendInvite = async (id) => {
    const member = teamMembers.find((m) => m.id === id && m.status === "pending")
    if (!member) return

    setIsResending(true)
    setError("")

    try {
      // Get the current session to include the auth token
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

      if (sessionError || !sessionData.session) {
        throw new Error("Authentication required. Please log in again.")
      }

      // Get the access token from the session
      const token = sessionData.session.access_token

      // Resend the invitation by sending a new invitation to the same email
      const response = await fetch(`${apiBaseUrl}/api/send-team-invitation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: member.email,
          role: member.role,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to resend invitation")
      }

      // Refresh the team members list
      await fetchTeamMembers()

      setSuccess(`Invitation resent to ${member.email}`)

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess("")
      }, 3000)
    } catch (error) {
      console.error("Error resending invitation:", error)
      setError("Failed to resend invitation. Please try again.")
    } finally {
      setIsResending(false)
    }
  }

  const handleRemoveTeamMember = async (id) => {
    const member = teamMembers.find((m) => m.id === id)
    if (!member) return

    setIsCancelling(true)
    setError("")

    try {
      // Get the current session to include the auth token
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

      if (sessionError || !sessionData.session) {
        throw new Error("Authentication required. Please log in again.")
      }

      // Get the access token from the session
      const token = sessionData.session.access_token

      if (member.status === "pending") {
        // Call the API to cancel the invitation
        const response = await fetch(`${apiBaseUrl}/api/cancel-team-invitation`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: member.email,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to cancel invitation")
        }
      } else {
        // For active members, we would need a separate endpoint to remove them
        // This is not implemented in the provided code, so we'll just show an error
        throw new Error("Removing active team members is not implemented yet")
      }

      // Refresh the team members list
      await fetchTeamMembers()

      setSuccess(`${member.status === "pending" ? "Invitation cancelled" : "Team member removed"} successfully`)

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess("")
      }, 3000)
    } catch (error) {
      console.error("Error removing team member:", error)
      setError("Failed to remove team member. Please try again.")
    } finally {
      setIsCancelling(false)
    }
  }

  const getRoleBadgeColor = (role) => {
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

  const getRoleLabel = (role) => {
    const roleObj = maritimeRoles.find((r) => r.value === role)
    return roleObj ? roleObj.label : role
  }

  const activeMembers = teamMembers.filter((member) => member.status === "active")
  const pendingMembers = teamMembers.filter((member) => member.status === "pending")
  const revokedMembers = teamMembers.filter((member) => member.status === "revoked")

  // If user is not authenticated or still loading, show appropriate UI
  if (isUserLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <p className="ml-2">Loading user data...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">Authentication Required</h2>
            <p className="text-gray-500 mb-4">You need to be logged in to access team management.</p>
            <Button onClick={() => (window.location.href = "/login")}>Go to Login</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header with title and description */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Team Management</h1>
          <p className="text-gray-500">Manage your maritime compliance team members</p>
        </div>
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
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  Inviting...
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
            <Alert className="bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-200">
              <CheckCircle className="h-4 w-4" />
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
          {isLoadingMembers ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="pending">Pending Invitations ({pendingMembers.length})</TabsTrigger>
                <TabsTrigger value="active">Active Members ({activeMembers.length})</TabsTrigger>
                <TabsTrigger value="revoked">Revoked Invitations ({revokedMembers.length})</TabsTrigger>
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
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleResendInvite(member.id)}
                                  disabled={isResending}
                                >
                                  {isResending ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                  ) : (
                                    <RefreshCw className="h-4 w-4" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Resend invitation</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveTeamMember(member.id)}
                            disabled={isCancelling}
                            title="Cancel invitation"
                          >
                            {isCancelling ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            ) : (
                              <X className="h-4 w-4" />
                            )}
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
                            {member.isCompanyAdmin && (
                              <Badge className="ml-2 bg-purple-50 text-purple-700 border-purple-200">
                                Company Admin
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveTeamMember(member.id)}
                          disabled={isCancelling || member.isCompanyAdmin}
                          title={member.isCompanyAdmin ? "Cannot remove company admin" : "Remove member"}
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
                    <p className="font-medium mb-1">No active team members</p>
                    <p className="text-sm text-slate-500">
                      Your invited team members will appear here once they accept their invitations
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="revoked">
                {revokedMembers.length > 0 ? (
                  <div className="space-y-2">
                    {revokedMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <p className="font-medium">{member.email}</p>
                          <div className="flex items-center mt-1">
                            <Badge className={getRoleBadgeColor(member.role)}>{getRoleLabel(member.role)}</Badge>
                            <Badge variant="outline" className="ml-2 bg-red-50 text-red-700 border-red-200">
                              Revoked on {member.revokedAt}
                            </Badge>
                          </div>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleResendInvite(member.id)}
                                disabled={isResending}
                              >
                                <Clock className="h-4 w-4 mr-2" />
                                Reinvite
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Send a new invitation</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8 border rounded-md border-dashed">
                    <Users className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                    <p className="font-medium mb-1">No revoked invitations</p>
                    <p className="text-sm text-slate-500">Revoked invitations will appear here for audit purposes</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
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
