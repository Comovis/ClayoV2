"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MessageSquare,
  Settings,
  BarChart3,
  Search,
  MoreHorizontal,
  Star,
  Clock,
  Bot,
  Phone,
  Mail,
  MessageCircle,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Send,
  Sliders,
  Save,
  RefreshCw,
  Smile,
  FileText,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"

export default function InteractiveDemoSection() {
  const [activeDemo, setActiveDemo] = useState("conversations")
  const [isBookDemoOpen, setIsBookDemoOpen] = useState(false)

  // Conversations Demo State - Inline
  const [selectedConversation, setSelectedConversation] = useState("1")
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const conversations = [
    {
      id: "1",
      customer: {
        name: "Sarah Johnson",
        email: "sarah@example.com",
        avatar: "SJ",
        company: "TechCorp Inc",
      },
      subject: "Product inquiry about pricing plans",
      status: "open",
      priority: "normal",
      channel: "chat",
      assignedTo: "AI Agent",
      lastMessage: "2 minutes ago",
      unreadCount: 2,
      tags: ["pricing", "enterprise"],
      sentiment: "neutral",
      participants: [
        { name: "Sarah Johnson", role: "Customer", type: "customer" },
        { name: "AI Assistant", role: "AI Agent", type: "ai" },
        { name: "John Smith", role: "Sales Rep", type: "agent" },
      ],
      messages: [
        {
          id: "1",
          type: "system",
          content: "Conversation started via website chat widget",
          timestamp: "10:25 AM",
        },
        {
          id: "2",
          type: "customer",
          sender: "Sarah Johnson",
          role: "Customer - TechCorp Inc",
          content: "Hi, I'm interested in learning more about your enterprise pricing plans.",
          timestamp: "10:30 AM",
        },
        {
          id: "3",
          type: "ai",
          sender: "AI Assistant",
          role: "AI Agent",
          content:
            "Hello Sarah! I'd be happy to help you with information about our enterprise pricing plans. To provide you with the most accurate pricing, could you tell me a bit about your company size and specific requirements?",
          timestamp: "10:30 AM",
        },
        {
          id: "4",
          type: "customer",
          sender: "Sarah Johnson",
          role: "Customer - TechCorp Inc",
          content:
            "We're a mid-size company with about 200 employees. We need a solution that can handle high volume customer support and lead qualification.",
          timestamp: "10:32 AM",
        },
        {
          id: "5",
          type: "ai",
          sender: "AI Assistant",
          role: "AI Agent",
          content:
            "Perfect! Based on your requirements, our Enterprise plan would be ideal for TechCorp Inc. It includes unlimited conversations, advanced analytics, priority support, and can easily scale with your team. Would you like me to schedule a demo with our sales team to show you the platform in action?",
          timestamp: "10:33 AM",
        },
      ],
    },
    {
      id: "2",
      customer: {
        name: "Mike Chen",
        email: "mike@startup.com",
        avatar: "MC",
        company: "StartupCo",
      },
      subject: "Technical support - Integration help",
      status: "resolved",
      priority: "high",
      channel: "email",
      assignedTo: "AI Agent",
      lastMessage: "1 hour ago",
      unreadCount: 0,
      tags: ["technical", "integration"],
      sentiment: "positive",
      participants: [
        { name: "Mike Chen", role: "Customer", type: "customer" },
        { name: "AI Assistant", role: "AI Agent", type: "ai" },
      ],
      messages: [
        {
          id: "1",
          type: "system",
          content: "Conversation started via email support",
          timestamp: "9:15 AM",
        },
        {
          id: "2",
          type: "customer",
          sender: "Mike Chen",
          role: "Customer - StartupCo",
          content:
            "I'm having trouble integrating your API with our existing system. The webhook isn't triggering properly.",
          timestamp: "9:20 AM",
        },
        {
          id: "3",
          type: "ai",
          sender: "AI Assistant",
          role: "AI Agent",
          content:
            "I can help you troubleshoot the webhook integration. Let me check a few things: 1) Have you verified the webhook URL is accessible? 2) Are you using the correct authentication headers? 3) What response code are you receiving?",
          timestamp: "9:21 AM",
        },
      ],
    },
  ]

  // Analytics Demo Data - Inline
  const analyticsData = {
    overview: {
      totalConversations: 1247,
      resolvedTickets: 1089,
      avgResponseTime: "2.3 min",
      customerSatisfaction: 4.6,
      conversionRate: "23%",
      aiResolutionRate: "87%",
    },
    chartData: [
      { name: "Mon", conversations: 45, resolved: 42, satisfaction: 4.5 },
      { name: "Tue", conversations: 52, resolved: 48, satisfaction: 4.7 },
      { name: "Wed", conversations: 38, resolved: 35, satisfaction: 4.4 },
      { name: "Thu", conversations: 61, resolved: 58, satisfaction: 4.8 },
      { name: "Fri", conversations: 49, resolved: 46, satisfaction: 4.6 },
      { name: "Sat", conversations: 33, resolved: 31, satisfaction: 4.5 },
      { name: "Sun", conversations: 28, resolved: 26, satisfaction: 4.3 },
    ],
    channels: [
      { name: "Website Chat", conversations: 456, percentage: 37 },
      { name: "Email", conversations: 312, percentage: 25 },
      { name: "Social Media", conversations: 234, percentage: 19 },
      { name: "Phone", conversations: 245, percentage: 19 },
    ],
    topIssues: [
      { issue: "Pricing Questions", count: 89, trend: "up" },
      { issue: "Technical Support", count: 67, trend: "down" },
      { issue: "Account Setup", count: 45, trend: "up" },
      { issue: "Billing Inquiries", count: 34, trend: "stable" },
    ],
  }

  // Agent Config Demo State - Inline
  const [agentConfig, setAgentConfig] = useState({
    personality: "friendly",
    responseLength: [50],
    formalityLevel: [25],
    emojiUsage: true,
    proactiveness: [75],
    escalationThreshold: [80],
    languages: ["English", "Spanish"],
    workingHours: {
      enabled: true,
      start: "09:00",
      end: "17:00",
      timezone: "UTC-5",
    },
  })

  return (
    <section id="demo" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            className="inline-block text-sm font-semibold text-slate-500 tracking-wider uppercase mb-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            INTERACTIVE DEMO
          </motion.span>

          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            See It In Action
          </motion.h2>

          <motion.p
            className="text-xl text-slate-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Explore our interactive demo to see how our AI platform can transform your customer service and sales
            operations.
          </motion.p>
        </div>

        <Tabs value={activeDemo} onValueChange={setActiveDemo} className="w-full">
          <TabsList className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-transparent h-auto p-0 mb-8">
            <TabButton
              value="conversations"
              activeValue={activeDemo}
              icon={<MessageSquare className="h-5 w-5" />}
              title="Conversations Portal"
              description="Manage customer interactions"
            />
            <TabButton
              value="analytics"
              activeValue={activeDemo}
              icon={<BarChart3 className="h-5 w-5" />}
              title="Analytics Dashboard"
              description="Track performance metrics"
            />
            <TabButton
              value="agent-config"
              activeValue={activeDemo}
              icon={<Settings className="h-5 w-5" />}
              title="AI Configuration"
              description="Customize your AI assistant"
            />
          </TabsList>

          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 shadow-sm">
            <TabsContent value="conversations" className="m-0">
              {/* Conversations Demo - Inline */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
                {/* Conversations List */}
                <div className="lg:col-span-1 bg-white rounded-lg border border-slate-200 overflow-hidden">
                  <div className="p-4 border-b border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-slate-900">Conversations</h3>
                      <Button size="sm" className="bg-slate-800 hover:bg-slate-700">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        New
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="Search conversations..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="overflow-y-auto h-[calc(600px-140px)]">
                    {conversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        onClick={() => setSelectedConversation(conversation.id)}
                        className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors ${
                          selectedConversation === conversation.id ? "bg-blue-50 border-blue-200" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-3">
                              <AvatarFallback className="bg-slate-200 text-slate-700 text-xs">
                                {conversation.customer.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium text-slate-900 text-sm">{conversation.customer.name}</h4>
                              <p className="text-xs text-slate-500">{conversation.customer.company}</p>
                            </div>
                          </div>
                          {conversation.unreadCount > 0 && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 mb-2 line-clamp-2">{conversation.subject}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={conversation.status === "open" ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {conversation.status}
                            </Badge>
                            <div className="flex items-center text-xs text-slate-500">
                              {conversation.channel === "chat" && <MessageCircle className="h-3 w-3 mr-1" />}
                              {conversation.channel === "email" && <Mail className="h-3 w-3 mr-1" />}
                              {conversation.channel === "phone" && <Phone className="h-3 w-3 mr-1" />}
                              <span>{conversation.channel}</span>
                            </div>
                          </div>
                          <span className="text-xs text-slate-500">{conversation.lastMessage}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Conversation Detail */}
                <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 overflow-hidden">
                  {selectedConversation && (
                    <>
                      {/* Header */}
                      <div className="p-4 border-b border-slate-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarFallback className="bg-slate-200 text-slate-700">
                                {conversations.find((c) => c.id === selectedConversation)?.customer.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-slate-900">
                                {conversations.find((c) => c.id === selectedConversation)?.customer.name}
                              </h3>
                              <p className="text-sm text-slate-500">
                                {conversations.find((c) => c.id === selectedConversation)?.customer.email}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-2" />
                              View Profile
                            </Button>
                            <Button size="sm" variant="outline">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center space-x-4">
                          <Badge variant="outline" className="text-xs">
                            {conversations.find((c) => c.id === selectedConversation)?.priority} priority
                          </Badge>
                          <div className="flex items-center text-xs text-slate-500">
                            <Bot className="h-3 w-3 mr-1" />
                            Assigned to AI Agent
                          </div>
                          <div className="flex items-center space-x-1">
                            {conversations
                              .find((c) => c.id === selectedConversation)
                              ?.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                          </div>
                        </div>
                      </div>

                      {/* Messages */}
                      <div className="flex-1 overflow-y-auto p-4 h-[400px] space-y-4">
                        {conversations
                          .find((c) => c.id === selectedConversation)
                          ?.messages.map((message) => (
                            <div key={message.id} className="space-y-2">
                              {message.type === "system" && (
                                <div className="text-center">
                                  <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                                    {message.content}
                                  </span>
                                </div>
                              )}
                              {message.type !== "system" && (
                                <div
                                  className={`flex ${message.type === "customer" ? "justify-start" : "justify-start"}`}
                                >
                                  <div className="flex items-start space-x-3 max-w-[80%]">
                                    <Avatar className="h-8 w-8 flex-shrink-0">
                                      <AvatarFallback
                                        className={`text-xs ${
                                          message.type === "ai"
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-slate-200 text-slate-700"
                                        }`}
                                      >
                                        {message.type === "ai" ? "AI" : message.sender?.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-2 mb-1">
                                        <span className="font-medium text-sm text-slate-900">{message.sender}</span>
                                        <span className="text-xs text-slate-500">{message.role}</span>
                                        <span className="text-xs text-slate-400">{message.timestamp}</span>
                                      </div>
                                      <div
                                        className={`p-3 rounded-lg ${
                                          message.type === "ai"
                                            ? "bg-blue-50 border border-blue-200"
                                            : "bg-slate-50 border border-slate-200"
                                        }`}
                                      >
                                        <p className="text-sm text-slate-700">{message.content}</p>
                                      </div>
                                      {message.type === "ai" && (
                                        <div className="flex items-center space-x-2 mt-2">
                                          <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                                            <ThumbsUp className="h-3 w-3 mr-1" />
                                            Helpful
                                          </Button>
                                          <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                                            <ThumbsDown className="h-3 w-3 mr-1" />
                                            Not helpful
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                      </div>

                      {/* Message Input */}
                      <div className="p-4 border-t border-slate-200">
                        <div className="flex items-center space-x-2">
                          <Input
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="flex-1"
                          />
                          <Button className="bg-slate-800 hover:bg-slate-700">
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2 text-xs text-slate-500">
                            <span className="flex items-center">
                              <Bot className="h-3 w-3 mr-1" />
                              AI suggestions enabled
                            </span>
                          </div>
                          <Button size="sm" variant="outline" className="text-xs">
                            Escalate to Human
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="m-0">
              {/* Analytics Demo - Inline */}
              <div className="space-y-6">
                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Total Conversations</p>
                          <p className="text-2xl font-bold text-slate-900">
                            {analyticsData.overview.totalConversations}
                          </p>
                        </div>
                        <MessageSquare className="h-8 w-8 text-blue-500" />
                      </div>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600">+12% from last week</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Resolved Tickets</p>
                          <p className="text-2xl font-bold text-slate-900">{analyticsData.overview.resolvedTickets}</p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-green-500" />
                      </div>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600">+8% from last week</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Avg Response Time</p>
                          <p className="text-2xl font-bold text-slate-900">{analyticsData.overview.avgResponseTime}</p>
                        </div>
                        <Clock className="h-8 w-8 text-orange-500" />
                      </div>
                      <div className="flex items-center mt-2">
                        <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600">-15% from last week</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Customer Satisfaction</p>
                          <p className="text-2xl font-bold text-slate-900">
                            {analyticsData.overview.customerSatisfaction}
                          </p>
                        </div>
                        <Star className="h-8 w-8 text-yellow-500" />
                      </div>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600">+0.2 from last week</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Conversion Rate</p>
                          <p className="text-2xl font-bold text-slate-900">{analyticsData.overview.conversionRate}</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-purple-500" />
                      </div>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600">+5% from last week</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">AI Resolution Rate</p>
                          <p className="text-2xl font-bold text-slate-900">{analyticsData.overview.aiResolutionRate}</p>
                        </div>
                        <Bot className="h-8 w-8 text-blue-500" />
                      </div>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600">+3% from last week</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts and Tables */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Conversation Trends */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BarChart3 className="h-5 w-5 mr-2" />
                        Conversation Trends
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analyticsData.chartData.map((day, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-600">{day.name}</span>
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span className="text-sm text-slate-600">{day.conversations}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="text-sm text-slate-600">{day.resolved}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Star className="h-3 w-3 text-yellow-500" />
                                <span className="text-sm text-slate-600">{day.satisfaction}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Channel Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <MessageCircle className="h-5 w-5 mr-2" />
                        Channel Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analyticsData.channels.map((channel, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-slate-600">{channel.name}</span>
                              <span className="text-sm text-slate-900">{channel.conversations}</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${channel.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Top Issues */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      Top Customer Issues
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.topIssues.map((issue, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium text-slate-900">{issue.issue}</span>
                            <Badge variant="secondary" className="text-xs">
                              {issue.count} cases
                            </Badge>
                          </div>
                          <div className="flex items-center">
                            {issue.trend === "up" && <TrendingUp className="h-4 w-4 text-red-500" />}
                            {issue.trend === "down" && <TrendingDown className="h-4 w-4 text-green-500" />}
                            {issue.trend === "stable" && <div className="w-4 h-4 bg-slate-400 rounded-full"></div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="agent-config" className="m-0">
              {/* Agent Config Demo - Inline */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Configuration Panel */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Smile className="h-5 w-5 mr-2" />
                        Personality Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-3">Personality Type</label>
                        <div className="grid grid-cols-2 gap-3">
                          {["friendly", "professional", "helpful", "enthusiastic"].map((type) => (
                            <button
                              key={type}
                              onClick={() => setAgentConfig({ ...agentConfig, personality: type })}
                              className={`p-3 border rounded-lg text-center text-sm font-medium transition-colors ${
                                agentConfig.personality === type
                                  ? "bg-blue-50 border-blue-200 text-blue-700"
                                  : "border-slate-200 hover:bg-slate-50"
                              }`}
                            >
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-3">
                          Response Length: {agentConfig.responseLength[0]}%
                        </label>
                        <Slider
                          value={agentConfig.responseLength}
                          onValueChange={(value) => setAgentConfig({ ...agentConfig, responseLength: value })}
                          max={100}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                          <span>Concise</span>
                          <span>Balanced</span>
                          <span>Detailed</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-3">
                          Formality Level: {agentConfig.formalityLevel[0]}%
                        </label>
                        <Slider
                          value={agentConfig.formalityLevel}
                          onValueChange={(value) => setAgentConfig({ ...agentConfig, formalityLevel: value })}
                          max={100}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                          <span>Casual</span>
                          <span>Balanced</span>
                          <span>Formal</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-slate-700">Enable Emoji Usage</label>
                        <Switch
                          checked={agentConfig.emojiUsage}
                          onCheckedChange={(checked) => setAgentConfig({ ...agentConfig, emojiUsage: checked })}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Sliders className="h-5 w-5 mr-2" />
                        Behavior Controls
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-3">
                          Proactiveness: {agentConfig.proactiveness[0]}%
                        </label>
                        <Slider
                          value={agentConfig.proactiveness}
                          onValueChange={(value) => setAgentConfig({ ...agentConfig, proactiveness: value })}
                          max={100}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                          <span>Reactive</span>
                          <span>Balanced</span>
                          <span>Proactive</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-3">
                          Escalation Threshold: {agentConfig.escalationThreshold[0]}%
                        </label>
                        <Slider
                          value={agentConfig.escalationThreshold}
                          onValueChange={(value) => setAgentConfig({ ...agentConfig, escalationThreshold: value })}
                          max={100}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                          <span>Low</span>
                          <span>Medium</span>
                          <span>High</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-3">Supported Languages</label>
                        <div className="flex flex-wrap gap-2">
                          {["English", "Spanish", "French", "German", "Italian"].map((lang) => (
                            <button
                              key={lang}
                              onClick={() => {
                                const newLanguages = agentConfig.languages.includes(lang)
                                  ? agentConfig.languages.filter((l) => l !== lang)
                                  : [...agentConfig.languages, lang]
                                setAgentConfig({ ...agentConfig, languages: newLanguages })
                              }}
                              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                agentConfig.languages.includes(lang)
                                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                                  : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                              }`}
                            >
                              {lang}
                            </button>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex space-x-3">
                    <Button className="flex-1 bg-slate-800 hover:bg-slate-700">
                      <Save className="h-4 w-4 mr-2" />
                      Save Configuration
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reset to Default
                    </Button>
                  </div>
                </div>

                {/* Preview Panel */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Eye className="h-5 w-5 mr-2" />
                        Live Preview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-slate-50 rounded-lg p-4 space-y-4">
                        <div className="flex items-start space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">AI</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="bg-white border border-slate-200 rounded-lg p-3">
                              <p className="text-sm text-slate-700">
                                {agentConfig.personality === "friendly" &&
                                  "Hi there! 😊 I'm here to help you with any questions you might have. What can I assist you with today?"}
                                {agentConfig.personality === "professional" &&
                                  "Good day. I am here to assist you with your inquiries. How may I be of service?"}
                                {agentConfig.personality === "helpful" &&
                                  "Hello! I'm ready to help you find exactly what you're looking for. What would you like to know?"}
                                {agentConfig.personality === "enthusiastic" &&
                                  "Hey! 🎉 I'm super excited to help you out today! What awesome thing can I help you with?"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-slate-200 text-slate-700 text-xs">U</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <p className="text-sm text-slate-700">I need help with pricing information.</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">AI</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="bg-white border border-slate-200 rounded-lg p-3">
                              <p className="text-sm text-slate-700">
                                {agentConfig.responseLength[0] < 33 && "What plan interests you?"}
                                {agentConfig.responseLength[0] >= 33 &&
                                  agentConfig.responseLength[0] < 66 &&
                                  "I'd be happy to help you with pricing information. Could you tell me which plan you're interested in?"}
                                {agentConfig.responseLength[0] >= 66 &&
                                  "I'd be delighted to provide you with comprehensive pricing information. To ensure I give you the most accurate and relevant details, could you please let me know which specific plan or service you're interested in learning about?"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BarChart3 className="h-5 w-5 mr-2" />
                        Performance Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-600">Response Accuracy</span>
                          <span className="text-lg font-bold text-green-600">94%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-600">Customer Satisfaction</span>
                          <span className="text-lg font-bold text-blue-600">4.7/5</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-600">Resolution Rate</span>
                          <span className="text-lg font-bold text-purple-600">87%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-600">Avg Response Time</span>
                          <span className="text-lg font-bold text-orange-600">1.2s</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <FileText className="h-5 w-5 mr-2" />
                        Training Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">Knowledge Base</span>
                          <Badge className="bg-green-100 text-green-800">Complete</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">Product Information</span>
                          <Badge className="bg-green-100 text-green-800">Complete</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">FAQs</span>
                          <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">Company Policies</span>
                          <Badge className="bg-green-100 text-green-800">Complete</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <div className="text-center mt-12">
          <Button
            size="lg"
            className="bg-slate-800 hover:bg-slate-700 text-white"
            onClick={() => setIsBookDemoOpen(true)}
          >
            Book a Personalized Demo
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}

function TabButton({ value, activeValue, icon, title, description }) {
  const isActive = value === activeValue

  return (
    <TabsTrigger
      value={value}
      className={`
        flex flex-col items-start p-4 rounded-lg border transition-all
        ${
          isActive
            ? "border-slate-800 bg-slate-50 shadow-sm data-[state=active]:bg-slate-50 data-[state=active]:text-slate-900"
            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 data-[state=active]:bg-transparent data-[state=active]:text-inherit"
        }
      `}
    >
      <div className={`p-2 rounded-lg mb-2 ${isActive ? "bg-slate-200" : "bg-slate-100"}`}>
        <div className={isActive ? "text-slate-800" : "text-slate-500"}>{icon}</div>
      </div>
      <div className="text-left">
        <div className="font-medium">{title}</div>
        <div className="text-xs text-slate-500">{description}</div>
      </div>
    </TabsTrigger>
  )
}
