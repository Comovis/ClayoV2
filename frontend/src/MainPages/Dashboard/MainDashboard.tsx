"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  MessageSquare,
  Users,
  TrendingUp,
  Clock,
  Bot,
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Plus,
  Filter,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { useUser } from "../../Auth/Contexts/UserContext"
import { useNavigate } from "react-router-dom"

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

interface RecentLead {
  id: string
  title: string
  customer: string
  value: number
  status: string
  probability: number
  source: string
  createdAt: string
}

export default function NewDashboard() {
  const { isAuthenticated, isLoading, user, organization } = useUser()
  const navigate = useNavigate()

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
  const [recentConversations, setRecentConversations] = useState<RecentConversation[]>([])
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([])
  const [isDashboardLoading, setIsDashboardLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("7d")

  console.log("NewDashboard rendering with auth state:", { isAuthenticated, isLoading, user, organization })

  useEffect(() => {
    if (isAuthenticated && user && organization) {
      loadDashboardData()
    }
  }, [isAuthenticated, user, organization, timeRange])

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  // Handle authentication
  if (!isAuthenticated && !isLoading) {
    console.log("NewDashboard: User not authenticated")
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
      console.log("Loading dashboard data for organization:", organization?.name)

      // In a real app, these would be actual API calls using the user context
      // For now, we'll use mock data but customize it based on the organization
      const orgName = organization?.name || "Your Organization"

      setStats({
        totalConversations: 1247,
        activeConversations: 23,
        resolvedToday: 45,
        avgResponseTime: "2m 30s",
        customerSatisfaction: 4.8,
        aiResolutionRate: 78,
        totalLeads: 156,
        qualifiedLeads: 42,
      })

      setRecentConversations([
        {
          id: "1",
          customer: { name: "Sarah Johnson", email: "sarah@example.com" },
          subject: "Billing question about subscription",
          status: "active",
          lastMessage: "I need help understanding my latest invoice...",
          lastMessageAt: "2 minutes ago",
          channel: "email",
          priority: 2,
        },
        {
          id: "2",
          customer: { name: "Mike Chen", email: "mike@techcorp.com" },
          subject: "Technical integration support",
          status: "pending",
          lastMessage: "The API is returning a 404 error when...",
          lastMessageAt: "15 minutes ago",
          channel: "chat",
          priority: 3,
        },
        {
          id: "3",
          customer: { name: "Emma Davis", email: "emma@startup.io" },
          subject: "Feature request discussion",
          status: "resolved",
          lastMessage: "Thank you for the detailed explanation!",
          lastMessageAt: "1 hour ago",
          channel: "email",
          priority: 1,
        },
      ])

      setRecentLeads([
        {
          id: "1",
          title: "Enterprise Plan Upgrade",
          customer: "TechCorp Inc.",
          value: 25000,
          status: "proposal",
          probability: 75,
          source: "website",
          createdAt: "2 days ago",
        },
        {
          id: "2",
          title: "API Integration Project",
          customer: "StartupXYZ",
          value: 12000,
          status: "negotiation",
          probability: 60,
          source: "referral",
          createdAt: "5 days ago",
        },
        {
          id: "3",
          title: "Custom AI Training",
          customer: "RetailCorp",
          value: 8500,
          status: "qualified",
          probability: 40,
          source: "demo",
          createdAt: "1 week ago",
        },
      ])
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setIsDashboardLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityIcon = (priority: number) => {
    if (priority >= 3) return <AlertCircle className="h-4 w-4 text-red-500" />
    if (priority === 2) return <Clock className="h-4 w-4 text-yellow-500" />
    return <CheckCircle className="h-4 w-4 text-green-500" />
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleNavigation = (path: string) => {
    navigate(path)
  }

  return (
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
          <Button onClick={() => handleNavigation("/conversations")}>
            <Plus className="mr-2 h-4 w-4" />
            New Conversation
          </Button>
        </div>
      </div>

      {/* Organization Info */}
      {organization && (
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Bot className="h-6 w-6 text-blue-600" />
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total Conversations</CardTitle>
            <MessageSquare className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isDashboardLoading ? "..." : stats.totalConversations.toLocaleString()}
            </div>
            <p className="text-xs text-gray-600">
              <span className="text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +12% from last period
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Active Now</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isDashboardLoading ? "..." : stats.activeConversations}</div>
            <p className="text-xs text-gray-600">
              <span className="text-blue-600">{stats.resolvedToday} resolved today</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isDashboardLoading ? "..." : stats.avgResponseTime}</div>
            <p className="text-xs text-gray-600">
              <span className="text-green-600 flex items-center">
                <ArrowDownRight className="h-3 w-3 mr-1" />
                -15% faster
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">AI Resolution Rate</CardTitle>
            <Bot className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isDashboardLoading ? "..." : `${stats.aiResolutionRate}%`}</div>
            <p className="text-xs text-gray-600">
              <span className="text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +5% improvement
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

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
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading conversations...</p>
                </div>
              ) : (
                recentConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleNavigation(`/conversations/${conversation.id}`)}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={conversation.customer.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gray-200 text-gray-700">
                        {conversation.customer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium truncate">{conversation.customer.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {conversation.channel}
                          </Badge>
                          {getPriorityIcon(conversation.priority)}
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
                      <p className="text-sm font-medium text-gray-900 mt-1">{conversation.subject}</p>
                      <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                      <p className="text-xs text-gray-500 mt-1">{conversation.lastMessageAt}</p>
                    </div>
                  </div>
                ))
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
                <div className="text-center py-4">
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-2 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-2 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-700">Customer Satisfaction</span>
                      <span className="font-medium">{stats.customerSatisfaction}/5.0</span>
                    </div>
                    <Progress value={(stats.customerSatisfaction / 5) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-700">AI Resolution Rate</span>
                      <span className="font-medium">{stats.aiResolutionRate}%</span>
                    </div>
                    <Progress value={stats.aiResolutionRate} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-700">First Response Time</span>
                      <span className="font-medium">Under 5min</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Recent Leads */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Recent Leads</CardTitle>
                  <CardDescription>Latest sales opportunities</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleNavigation("/leads")}>
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {isDashboardLoading ? (
                <div className="text-center py-4">
                  <div className="animate-pulse space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-3 border rounded-lg">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                recentLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleNavigation(`/leads/${lead.id}`)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm">{lead.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {lead.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{lead.customer}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-medium text-green-600">{formatCurrency(lead.value)}</span>
                      <span className="text-xs text-gray-500">{lead.probability}% likely</span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => handleNavigation("/conversations/new")}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Start New Conversation
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => handleNavigation("/leads/new")}>
                <Users className="mr-2 h-4 w-4" />
                Add New Lead
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => handleNavigation("/ai-training")}
              >
                <Bot className="mr-2 h-4 w-4" />
                Train AI Assistant
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => handleNavigation("/analytics")}>
                <TrendingUp className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
