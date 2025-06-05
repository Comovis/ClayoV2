"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  MessageSquare,
  Search,
  Filter,
  Send,
  Paperclip,
  Bot,
  Star,
  ArrowRight,
  Phone,
  Mail,
  Globe,
  AlertCircle,
  Zap,
  Info,
  Download,
  FileText,
  Users,
  ArrowLeft,
  ExternalLink,
  Plus,
} from "lucide-react"

export default function ConversationsPage() {
  const [selectedConversation, setSelectedConversation] = useState("1")
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showCustomerInfo, setShowCustomerInfo] = useState(false)
  const [showParticipants, setShowParticipants] = useState(false)

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
          actionLink: "/analytics/sources",
          actionText: "View Source Analytics",
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
            "Hello Sarah! I'd be happy to help you with information about our enterprise plans. We offer several tiers designed for different business needs. What size is your organization?",
          timestamp: "10:31 AM",
        },
        {
          id: "4",
          type: "customer",
          sender: "Sarah Johnson",
          role: "Customer - TechCorp Inc",
          content:
            "We're a mid-size company with about 200 employees. We're looking for a solution that can handle high conversation volumes.",
          timestamp: "10:33 AM",
        },
        {
          id: "5",
          type: "ai",
          sender: "AI Assistant",
          role: "AI Agent",
          content:
            "Perfect! For a 200-employee organization, I'd recommend our Professional or Enterprise plan. Both support unlimited conversations. I've attached our pricing guide for your review.",
          timestamp: "10:34 AM",
          attachments: [
            {
              name: "Enterprise_Pricing_Guide.pdf",
              size: "2.4 MB",
              type: "document",
            },
            {
              name: "Feature_Comparison.xlsx",
              size: "156 KB",
              type: "spreadsheet",
            },
          ],
        },
        {
          id: "6",
          type: "system",
          content: "Customer downloaded Enterprise_Pricing_Guide.pdf",
          timestamp: "10:35 AM",
          actionLink: "/analytics/downloads",
          actionText: "View Download Analytics",
        },
        {
          id: "7",
          type: "customer",
          sender: "Sarah Johnson",
          role: "Customer - TechCorp Inc",
          content: "This looks great! Can someone from your sales team reach out to discuss implementation?",
          timestamp: "10:38 AM",
        },
        {
          id: "8",
          type: "system",
          content: "Lead qualification score updated: High Priority (85/100)",
          timestamp: "10:38 AM",
          isWarning: false,
          actionLink: "/leads/sarah-johnson",
          actionText: "View Lead Profile",
        },
      ],
    },
    {
      id: "2",
      customer: {
        name: "Mike Chen",
        email: "mike@startup.com",
        avatar: "MC",
        company: "StartupXYZ",
      },
      subject: "Technical support - Integration issues",
      status: "pending",
      priority: "high",
      channel: "email",
      assignedTo: "John Doe",
      lastMessage: "15 minutes ago",
      unreadCount: 0,
      tags: ["technical", "integration"],
      sentiment: "negative",
      participants: [
        { name: "Mike Chen", role: "Customer", type: "customer" },
        { name: "John Doe", role: "Technical Support", type: "agent" },
        { name: "AI Assistant", role: "AI Agent", type: "ai" },
      ],
      messages: [
        {
          id: "1",
          type: "customer",
          sender: "Mike Chen",
          role: "Customer - StartupXYZ",
          content:
            "I'm having trouble integrating your API with our existing system. The webhook endpoints are not responding as expected.",
          timestamp: "9:45 AM",
        },
        {
          id: "2",
          type: "system",
          content: "Conversation escalated to technical support team",
          timestamp: "9:46 AM",
          isWarning: true,
          actionLink: "/escalations/technical",
          actionText: "View Escalation Rules",
        },
        {
          id: "3",
          type: "agent",
          sender: "John Doe",
          role: "Technical Support Specialist",
          content:
            "Hi Mike, I'm John from our technical support team. I've escalated this from our AI agent. Can you share the specific error messages you're seeing?",
          timestamp: "10:15 AM",
        },
      ],
    },
    {
      id: "3",
      customer: {
        name: "Emily Davis",
        email: "emily@company.com",
        avatar: "ED",
        company: "Davis & Associates",
      },
      subject: "Billing question about recent charges",
      status: "resolved",
      priority: "normal",
      channel: "chat",
      assignedTo: "AI Agent",
      lastMessage: "1 hour ago",
      unreadCount: 0,
      tags: ["billing", "resolved"],
      sentiment: "positive",
      participants: [
        { name: "Emily Davis", role: "Customer", type: "customer" },
        { name: "AI Assistant", role: "AI Agent", type: "ai" },
      ],
      messages: [
        {
          id: "1",
          type: "customer",
          sender: "Emily Davis",
          role: "Customer - Davis & Associates",
          content: "I noticed an unexpected charge on my account. Can you help me understand what this is for?",
          timestamp: "8:30 AM",
        },
        {
          id: "2",
          type: "ai",
          sender: "AI Assistant",
          role: "AI Agent",
          content:
            "I'd be happy to help clarify that charge. Let me look up your account details. The charge appears to be for additional AI agent usage beyond your plan limits. Would you like me to break down the usage?",
          timestamp: "8:31 AM",
        },
        {
          id: "3",
          type: "customer",
          sender: "Emily Davis",
          role: "Customer - Davis & Associates",
          content: "Yes, that would be helpful. I want to make sure I understand our usage patterns.",
          timestamp: "8:35 AM",
        },
        {
          id: "4",
          type: "ai",
          sender: "AI Assistant",
          role: "AI Agent",
          content:
            "Here's a breakdown of your usage: [Usage Report]. The additional charge was for 150 extra conversations last month. I can help you upgrade to a plan that better fits your needs to avoid overage charges.",
          timestamp: "8:36 AM",
          attachments: [
            {
              name: "Usage_Report_October.pdf",
              size: "890 KB",
              type: "report",
            },
          ],
        },
        {
          id: "5",
          type: "customer",
          sender: "Emily Davis",
          role: "Customer - Davis & Associates",
          content: "Perfect, that makes sense now. Thank you for the clear explanation!",
          timestamp: "8:40 AM",
        },
        {
          id: "6",
          type: "system",
          content: "Conversation marked as resolved - Customer satisfaction: 5/5",
          timestamp: "8:41 AM",
          actionLink: "/analytics/satisfaction",
          actionText: "View Satisfaction Metrics",
        },
      ],
    },
  ]

  const currentConversation = conversations.find((c) => c.id === selectedConversation)

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      conv.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.subject.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || conv.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log("Sending message:", newMessage)
      setNewMessage("")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "normal":
        return "bg-blue-100 text-blue-800"
      case "low":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "chat":
        return <MessageSquare className="h-4 w-4" />
      case "email":
        return <Mail className="h-4 w-4" />
      case "phone":
        return <Phone className="h-4 w-4" />
      case "social":
        return <Globe className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "text-green-600"
      case "negative":
        return "text-red-600"
      case "neutral":
        return "text-gray-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header with title and description */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Conversations</h1>
          <p className="text-gray-500">Manage customer conversations across all channels</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button size="sm">
            <Zap className="mr-2 h-4 w-4" />
            Auto-assign
          </Button>
        </div>
      </div>

      {/* Main conversation interface */}
      <Card>
        <CardContent className="p-0">
          {/* Top Navigation Bar */}
          <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-lg font-semibold">Active Conversations</h2>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-blue-100 text-blue-800">{filteredConversations.length} active conversations</Badge>
            </div>
          </div>

          <div className="flex h-[800px]">
            {/* Conversations List */}
            <div className="w-1/3 border-r flex flex-col">
              <div className="p-4 border-b">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search conversations..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all" onClick={() => setStatusFilter("all")}>
                      All
                    </TabsTrigger>
                    <TabsTrigger value="open" onClick={() => setStatusFilter("open")}>
                      Open
                    </TabsTrigger>
                    <TabsTrigger value="pending" onClick={() => setStatusFilter("pending")}>
                      Pending
                    </TabsTrigger>
                    <TabsTrigger value="resolved" onClick={() => setStatusFilter("resolved")}>
                      Resolved
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="flex-1 overflow-y-auto">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedConversation === conversation.id ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                            {conversation.customer.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium text-sm">{conversation.customer.name}</h4>
                          <p className="text-xs text-gray-500">{conversation.customer.company}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {getChannelIcon(conversation.channel)}
                        {conversation.unreadCount > 0 && (
                          <Badge className="bg-red-500 text-white text-xs px-1 py-0">{conversation.unreadCount}</Badge>
                        )}
                      </div>
                    </div>

                    <p className="text-sm font-medium mb-2 line-clamp-1">{conversation.subject}</p>

                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(conversation.status)} variant="secondary">
                          {conversation.status}
                        </Badge>
                        <Badge className={getPriorityColor(conversation.priority)} variant="outline">
                          {conversation.priority}
                        </Badge>
                      </div>
                      <span className={`text-xs ${getSentimentColor(conversation.sentiment)}`}>
                        {conversation.sentiment}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Assigned to: {conversation.assignedTo}</span>
                      <span>{conversation.lastMessage}</span>
                    </div>

                    {conversation.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {conversation.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Conversation View */}
            <div className="flex-1 flex flex-col">
              {currentConversation ? (
                <>
                  {/* Conversation Header */}
                  <div className="border-b p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {currentConversation.customer.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center">
                            <h2 className="font-semibold">{currentConversation.customer.name}</h2>
                            <Badge className={getStatusColor(currentConversation.status)} variant="secondary">
                              {currentConversation.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500">
                            {currentConversation.customer.email} • {currentConversation.customer.company}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => setShowCustomerInfo(true)}>
                                <Info className="h-5 w-5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Customer Information</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => setShowParticipants(true)}>
                                <Users className="h-5 w-5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Participants</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <Button variant="outline" size="sm">
                          <Star className="mr-2 h-4 w-4" />
                          Rate
                        </Button>
                        <Button variant="outline" size="sm">
                          <ArrowRight className="mr-2 h-4 w-4" />
                          Escalate
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2">
                      <h3 className="font-medium">{currentConversation.subject}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span>Channel: {currentConversation.channel}</span>
                        <span>Assigned to: {currentConversation.assignedTo}</span>
                        <span className={getSentimentColor(currentConversation.sentiment)}>
                          Sentiment: {currentConversation.sentiment}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {currentConversation.messages.map((message) => {
                      if (message.type === "system") {
                        return (
                          <SystemMessage
                            key={message.id}
                            message={message.content}
                            timestamp={message.timestamp}
                            isWarning={message.isWarning}
                            actionLink={message.actionLink}
                            actionText={message.actionText}
                          />
                        )
                      } else if (message.type === "customer") {
                        return (
                          <CustomerMessage
                            key={message.id}
                            name={message.sender}
                            role={message.role}
                            message={message.content}
                            timestamp={message.timestamp}
                          />
                        )
                      } else if (message.type === "ai") {
                        return (
                          <AIMessage
                            key={message.id}
                            name={message.sender}
                            role={message.role}
                            message={message.content}
                            timestamp={message.timestamp}
                            attachments={message.attachments || []}
                          />
                        )
                      } else if (message.type === "agent") {
                        return (
                          <AgentMessage
                            key={message.id}
                            name={message.sender}
                            role={message.role}
                            message={message.content}
                            timestamp={message.timestamp}
                            attachments={message.attachments || []}
                          />
                        )
                      }
                    })}
                  </div>

                  {/* Message Input */}
                  <div className="border-t p-4">
                    <div className="flex items-center">
                      <Button variant="outline" size="icon" className="mr-2">
                        <Paperclip className="h-5 w-5" />
                      </Button>
                      <Textarea
                        placeholder="Type your message..."
                        className="flex-1 resize-none"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage()
                          }
                        }}
                      />
                      <Button className="ml-2" onClick={handleSendMessage}>
                        <Send className="h-5 w-5" />
                      </Button>
                    </div>
                    <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                      <div>Press Enter to send, Shift+Enter for new line</div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="text-xs">
                          <Bot className="mr-1 h-3 w-3" />
                          AI Suggest
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs">
                          Templates
                        </Button>
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          <span>{currentConversation.participants.length} participants</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                    <p className="text-gray-500">Choose a conversation from the list to view messages</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Information Sheet */}
      <Sheet open={showCustomerInfo} onOpenChange={setShowCustomerInfo}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Customer Information</SheetTitle>
            <SheetDescription>Details about {currentConversation?.customer.name}</SheetDescription>
          </SheetHeader>
          {currentConversation && <div className="py-4 space-y-6">{/* All the customer info content goes here */}</div>}
        </SheetContent>
      </Sheet>

      {/* Participants Sheet */}
      <Sheet open={showParticipants} onOpenChange={setShowParticipants}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <div className="flex items-center">
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="mr-2">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </SheetClose>
              <SheetTitle>Conversation Participants</SheetTitle>
            </div>
            <SheetDescription>People in this conversation</SheetDescription>
          </SheetHeader>
          {currentConversation && (
            <div className="py-4 space-y-4">
              <div className="space-y-3">
                {currentConversation.participants.map((participant, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-3">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {participant.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{participant.name}</div>
                        <div className="text-xs text-gray-500">{participant.role}</div>
                      </div>
                    </div>
                    <Badge
                      className={
                        participant.type === "customer"
                          ? "bg-blue-100 text-blue-800"
                          : participant.type === "ai"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-green-100 text-green-800"
                      }
                    >
                      {participant.type}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t">
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Participant
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

function SystemMessage({ message, timestamp, isWarning = false, actionLink, actionText }) {
  return (
    <div className="flex justify-center">
      <div
        className={`inline-block px-3 py-1 rounded-md text-xs ${
          isWarning ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-700"
        }`}
      >
        <div className="flex items-center">
          {isWarning ? <AlertCircle className="h-3 w-3 mr-1" /> : <Info className="h-3 w-3 mr-1" />}
          <span>{message}</span>
        </div>
        <div className="flex items-center justify-center mt-1">
          <span className="text-[10px] text-gray-500">{timestamp}</span>
          {actionLink && (
            <a href={actionLink} className="text-[10px] text-blue-600 ml-2 flex items-center">
              <ExternalLink className="h-2 w-2 mr-0.5" />
              {actionText}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

function CustomerMessage({ name, role, message, timestamp }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%]">
        <div className="flex items-baseline justify-end">
          <span className="text-xs text-gray-500 mr-2">{role}</span>
          <span className="font-medium text-sm">{name}</span>
        </div>
        <div className="bg-gray-100 rounded-lg rounded-tr-none p-3 mt-1 text-sm">{message}</div>
        <div className="text-xs text-gray-500 mt-1 text-right">{timestamp}</div>
      </div>
    </div>
  )
}

function AIMessage({ name, role, message, timestamp, attachments = [] }) {
  return (
    <div className="flex">
      <Avatar className="h-8 w-8 mr-2 mt-1">
        <AvatarFallback className="bg-purple-100 text-purple-600">
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-baseline">
          <span className="font-medium text-sm">{name}</span>
          <span className="text-xs text-gray-500 ml-2">{role}</span>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg rounded-tl-none p-3 mt-1 text-sm">
          {message}
        </div>

        {attachments.length > 0 && (
          <div className="mt-2 space-y-2">
            {attachments.map((attachment, index) => (
              <div
                key={index}
                className="flex items-center p-2 bg-gray-50 border rounded-md text-sm hover:bg-gray-100 cursor-pointer"
              >
                <FileText className="h-4 w-4 text-blue-500 mr-2" />
                <div className="flex-1">
                  <div className="font-medium">{attachment.name}</div>
                  <div className="text-xs text-gray-500 flex items-center">
                    <span>{attachment.size}</span>
                    <span className="mx-1">•</span>
                    <Badge variant="outline" className="text-[10px] h-4 px-1">
                      {attachment.type}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="text-xs text-gray-500 mt-1">{timestamp}</div>
      </div>
    </div>
  )
}

function AgentMessage({ name, role, message, timestamp, attachments = [] }) {
  return (
    <div className="flex">
      <Avatar className="h-8 w-8 mr-2 mt-1">
        <AvatarFallback className="bg-blue-100 text-blue-600">
          {name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-baseline">
          <span className="font-medium text-sm">{name}</span>
          <span className="text-xs text-gray-500 ml-2">{role}</span>
        </div>
        <div className="bg-blue-50 rounded-lg rounded-tl-none p-3 mt-1 text-sm">{message}</div>

        {attachments.length > 0 && (
          <div className="mt-2 space-y-2">
            {attachments.map((attachment, index) => (
              <div
                key={index}
                className="flex items-center p-2 bg-gray-50 border rounded-md text-sm hover:bg-gray-100 cursor-pointer"
              >
                <FileText className="h-4 w-4 text-blue-500 mr-2" />
                <div className="flex-1">
                  <div className="font-medium">{attachment.name}</div>
                  <div className="text-xs text-gray-500 flex items-center">
                    <span>{attachment.size}</span>
                    <span className="mx-1">•</span>
                    <Badge variant="outline" className="text-[10px] h-4 px-1">
                      {attachment.type}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="text-xs text-gray-500 mt-1">{timestamp}</div>
      </div>
    </div>
  )
}
