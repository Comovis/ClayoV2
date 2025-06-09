"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  MessageSquare,
  Users,
  Clock,
  Bot,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Plus,
  Filter,
  Inbox,
  BarChart3,
  PlusCircle,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { useUser } from "../../Auth/Contexts/UserContext"
import { useNavigate } from "react-router-dom"
import WelcomeModal from "./WelcomeModal"
import { useAgents } from "../../Hooks/useAgents"
import { useAgentAnalytics } from "../../Hooks/useAgentAnalytics"
import { useAgentSessions, type Session } from "../../Hooks/useAgentSessions"

interface DashboardStats {
  totalConversations: number
  activeConversations: number
  resolvedToday: number
  avgResponseTime: string
  customerSatisfaction: number
  aiResolutionRate: number
  totalLeads: number
  qualifiedLeads: number
}

interface RecentConversation {
  id: string
  customer: {
    name: string
    email: string
    avatar?: string
  }
  subject: string
  status: "active" | "pending" | "resolved"
  lastMessage: string
  lastMessageAt: string
  channel: string
  priority: number
}

export default function NewDashboard() {
  const { isAuthenticated, isLoading, user, organization } = useUser()
  const navigate = useNavigate()
  const { agents, fetchAgents, isLoading: agentsLoading } = useAgents()
  const { getOrganizationAnalytics, isLoading: analyticsLoading } = useAgentAnalytics()
  const { sessions, getAgentSessions, isLoading: sessionsLoading } = useAgentSessions()

  const [stats, setStats] = useState<DashboardStats>({
    totalConversations: 0,
    activeConversations: 0,
    resolvedToday: 0,
    avgResponseTime: "0m",
    customerSatisfaction: 0,
    aiResolutionRate: 0,
    totalLeads: 0,
    qualifiedLeads: 0,
  })
  const [recentConversations, setRecentConversations] = useState<Session[]>([])
  const [isDashboardLoading, setIsDashboardLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("7d")
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)

  useEffect(() => {
    if (isAuthenticated && user && organization) {
      // Check if user needs to complete onboarding
      if (user.onboarding_step !== "completed") {
        setShowWelcomeModal(true)
      }
      loadDashboardData()
    }
  }, [isAuthenticated, user, organization, timeRange])

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  // Handle authentication
  if (!isAuthenticated && !isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">You need to be logged in to view this page.</p>
          <Button className="mt-4" onClick={() => navigate("/login")}>
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  const loadDashboardData = async () => {
    setIsDashboardLoading(true)
    try {
      // Fetch agents
      const agentsList = await fetchAgents()

      // If we have agents, get analytics and sessions for the first agent
      if (agentsList && agentsList.length > 0) {
        const firstAgentId = agentsList[0].id

        // Get organization analytics
        const analytics = await getOrganizationAnalytics()
        if (analytics) {
          setStats({
            totalConversations: analytics.totalConversations || 0,
            activeConversations: analytics.activeConversations || 0,
            resolvedToday: analytics.resolvedToday || 0,
            avgResponseTime: formatResponseTime(analytics.averageResponseTime || 0),
            customerSatisfaction: analytics.customerSatisfaction || 0,
            aiResolutionRate: analytics.resolutionRate || 0,
            totalLeads: analytics.totalLeads || 0,
            qualifiedLeads: analytics.qualifiedLeads || 0,
          })
        }

        // Get recent sessions/conversations
        const recentSessions = await getAgentSessions(firstAgentId)
        if (recentSessions) {
          setRecentConversations(recentSessions)
        }
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setIsDashboardLoading(false)
    }
  }

  const formatResponseTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds}s`
    }
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const handleWelcomeComplete = () => {
    setShowWelcomeModal(false)
    // Refresh user data to update onboarding status
    if (user) {
      // Update user object locally to reflect completed onboarding
      user.onboarding_step = "completed"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800"
      case "escalated":
        return "bg-yellow-100 text-yellow-800"
      case "closed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleNavigation = (path: string) => {
    navigate(path)
  }

  const isDataEmpty = !agents || agents.length === 0

  return (
    <>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header with title and description */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-500">
              Welcome back, {user?.full_name || user?.email}! Monitor your AI customer service performance for{" "}
              {organization?.name || "your organization"}.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button
              className="bg-black text-white hover:bg-gray-800"
              onClick={() => handleNavigation("/conversations")}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Conversation
            </Button>
          </div>
        </div>

        {/* Organization Info */}
        {organization && (
          <Card className="mb-6 bg-white border border-gray-200">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center">
                    <Bot className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{organization.name}</CardTitle>
                    <p className="text-sm text-gray-600">
                      {organization.domain && `${organization.domain} • `}
                      Plan: {organization.subscription_plan || "Starter"}
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">{organization.subscription_status || "Active"}</Badge>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Empty State - No Agents */}
        {isDataEmpty && !isDashboardLoading && (
          <Card className="mb-6 border-dashed border-2 border-gray-200 bg-gray-50">
            <CardContent className="p-10 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Bot className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Set up your first AI agent</h3>
              <p className="text-gray-500 mb-6 max-w-md">
                Create an AI agent to start handling customer inquiries, qualifying leads, and providing 24/7 support.
              </p>
              <Button
                className="bg-black text-white hover:bg-gray-800"
                onClick={() => handleNavigation("/agent-config")}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Your First Agent
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        {(!isDataEmpty || isDashboardLoading) && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Total Conversations</CardTitle>
                <MessageSquare className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                {isDashboardLoading ? (
                  <div className="animate-pulse h-8 bg-gray-200 rounded mb-2"></div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{stats.totalConversations.toLocaleString()}</div>
                    {stats.totalConversations > 0 ? (
                      <p className="text-xs text-gray-600">
                        <span className="text-green-600 flex items-center">
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          Since {timeRange}
                        </span>
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500">No conversations yet</p>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Active Now</CardTitle>
                <Users className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                {isDashboardLoading ? (
                  <div className="animate-pulse h-8 bg-gray-200 rounded mb-2"></div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{stats.activeConversations}</div>
                    {stats.resolvedToday > 0 ? (
                      <p className="text-xs text-gray-600">
                        <span className="text-blue-600">{stats.resolvedToday} resolved today</span>
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500">No active conversations</p>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Avg Response Time</CardTitle>
                <Clock className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                {isDashboardLoading ? (
                  <div className="animate-pulse h-8 bg-gray-200 rounded mb-2"></div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{stats.avgResponseTime}</div>
                    {stats.avgResponseTime !== "0m" ? (
                      <p className="text-xs text-gray-600">
                        <span className="text-green-600 flex items-center">
                          <ArrowDownRight className="h-3 w-3 mr-1" />
                          Faster than average
                        </span>
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500">No data available yet</p>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">AI Resolution Rate</CardTitle>
                <Bot className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                {isDashboardLoading ? (
                  <div className="animate-pulse h-8 bg-gray-200 rounded mb-2"></div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      {stats.aiResolutionRate > 0 ? `${stats.aiResolutionRate}%` : "N/A"}
                    </div>
                    {stats.aiResolutionRate > 0 ? (
                      <p className="text-xs text-gray-600">
                        <span className="text-green-600 flex items-center">
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          Improving over time
                        </span>
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500">No resolutions yet</p>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Conversations */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Recent Conversations</CardTitle>
                    <CardDescription>Latest customer interactions across all channels</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleNavigation("/conversations")}>
                      View All
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isDashboardLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse flex items-start space-x-4 p-4 border rounded-lg">
                        <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : recentConversations.length > 0 ? (
                  recentConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleNavigation(`/conversations/${conversation.id}`)}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gray-200 text-gray-700">
                          {conversation.customer_id ? conversation.customer_id.substring(0, 2).toUpperCase() : "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium truncate">{conversation.customer_id || "Anonymous User"}</h4>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(conversation.status)}>{conversation.status}</Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Assign Agent</DropdownMenuItem>
                                <DropdownMenuItem>Mark as Priority</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.last_message || "No messages yet"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(conversation.updated_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Inbox className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No conversations yet</h3>
                    <p className="text-gray-500 mb-4 max-w-sm">
                      Start a conversation with your AI agent or set up your widget to collect customer inquiries.
                    </p>
                    <Button
                      className="bg-black text-white hover:bg-gray-800"
                      onClick={() => handleNavigation("/conversations/new")}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Start a Test Conversation
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Performance Metrics */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Performance</CardTitle>
                <CardDescription>Key metrics and performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isDashboardLoading ? (
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-2 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-2 bg-gray-200 rounded"></div>
                  </div>
                ) : stats.customerSatisfaction > 0 || stats.aiResolutionRate > 0 ? (
                  <>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-700">Customer Satisfaction</span>
                        <span className="font-medium">
                          {stats.customerSatisfaction > 0 ? `${stats.customerSatisfaction}/5.0` : "N/A"}
                        </span>
                      </div>
                      <Progress
                        value={stats.customerSatisfaction > 0 ? (stats.customerSatisfaction / 5) * 100 : 0}
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-700">AI Resolution Rate</span>
                        <span className="font-medium">
                          {stats.aiResolutionRate > 0 ? `${stats.aiResolutionRate}%` : "N/A"}
                        </span>
                      </div>
                      <Progress value={stats.aiResolutionRate} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-700">First Response Time</span>
                        <span className="font-medium">
                          {stats.avgResponseTime !== "0m" ? stats.avgResponseTime : "N/A"}
                        </span>
                      </div>
                      <Progress value={stats.avgResponseTime !== "0m" ? 85 : 0} className="h-2" />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <BarChart3 className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">No performance data yet</h3>
                    <p className="text-xs text-gray-500 mb-4">
                      Performance metrics will appear once your AI agent starts handling conversations.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Welcome Modal */}
      <WelcomeModal
        isOpen={showWelcomeModal}
        onComplete={handleWelcomeComplete}
        organizationName={organization?.name}
      />
    </>
  )
}
