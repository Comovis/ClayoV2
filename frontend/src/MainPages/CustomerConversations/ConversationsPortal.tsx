"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  MessageSquare,
  Search,
  Filter,
  Send,
  Paperclip,
  Bot,
  ArrowRight,
  AlertCircle,
  Zap,
  Info,
  Loader2,
  RefreshCw,
  MessageCircle,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { useAgentSessions, type SessionMessage } from "../../Hooks/useAgentSessions"

interface ConversationsPortalProps {
  agentId: string
}

export default function ConversationsPortal({ agentId }: ConversationsPortalProps) {
  const {
    sessions,
    messages,
    isLoading,
    error,
    getAgentSessions,
    getSessionMessages,
    updateSessionStatus,
    clearError,
  } = useAgentSessions()

  const [selectedSession, setSelectedSession] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showCustomerInfo, setShowCustomerInfo] = useState(false)
  const [showParticipants, setShowParticipants] = useState(false)

  // Load sessions on component mount
  useEffect(() => {
    if (agentId) {
      getAgentSessions(agentId)
    }
  }, [agentId, getAgentSessions])

  // Load messages when a session is selected
  useEffect(() => {
    if (selectedSession) {
      getSessionMessages(selectedSession)
    }
  }, [selectedSession, getSessionMessages])

  const currentSession = sessions.find((s) => s.id === selectedSession)

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      session.customer_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.last_message?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || session.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log("Sending message:", newMessage)
      setNewMessage("")
    }
  }

  const handleRefresh = () => {
    if (agentId) {
      getAgentSessions(agentId)
    }
  }

  const handleStatusUpdate = async (sessionId: string, status: "active" | "closed" | "escalated") => {
    await updateSessionStatus(sessionId, status)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800"
      case "closed":
        return "bg-green-100 text-green-800"
      case "escalated":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <MessageCircle className="h-3 w-3" />
      case "closed":
        return <CheckCircle className="h-3 w-3" />
      case "escalated":
        return <AlertCircle className="h-3 w-3" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  const EmptyState = ({ type }: { type: "sessions" | "messages" | "search" }) => {
    const configs = {
      sessions: {
        icon: MessageSquare,
        title: "No conversations yet",
        description: "When customers start conversations with this agent, they'll appear here.",
        action: (
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        ),
      },
      messages: {
        icon: MessageCircle,
        title: "Select a conversation",
        description: "Choose a conversation from the list to view messages and respond to customers.",
      },
      search: {
        icon: Search,
        title: "No conversations found",
        description: "Try adjusting your search terms or filters to find conversations.",
        action: (
          <Button
            onClick={() => {
              setSearchQuery("")
              setStatusFilter("all")
            }}
            variant="outline"
          >
            Clear filters
          </Button>
        ),
      },
    }

    const config = configs[type]
    const Icon = config.icon

    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <Icon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{config.title}</h3>
          <p className="text-gray-500 mb-4">{config.description}</p>
          {config.action}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Conversations</h1>
          <p className="text-gray-500">Manage customer conversations across all channels</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Refresh
          </Button>
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

      {/* Error Alert */}
      {error && (
        <Alert className="mb-6" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button variant="ghost" size="sm" onClick={clearError}>
              <XCircle className="h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Interface */}
      <Card>
        <CardContent className="p-0">
          {/* Top Navigation Bar */}
          <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-lg font-semibold">Active Conversations</h2>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-blue-100 text-blue-800">
                {filteredSessions.length} {filteredSessions.length === 1 ? "conversation" : "conversations"}
              </Badge>
            </div>
          </div>

          <div className="flex h-[800px]">
            {/* Sessions List */}
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
                    <TabsTrigger value="active" onClick={() => setStatusFilter("active")}>
                      Active
                    </TabsTrigger>
                    <TabsTrigger value="escalated" onClick={() => setStatusFilter("escalated")}>
                      Escalated
                    </TabsTrigger>
                    <TabsTrigger value="closed" onClick={() => setStatusFilter("closed")}>
                      Closed
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="flex-1 overflow-y-auto">
                {isLoading && sessions.length === 0 ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                    <span className="ml-2 text-gray-500">Loading conversations...</span>
                  </div>
                ) : filteredSessions.length === 0 ? (
                  <div className="p-4">
                    <EmptyState type={searchQuery || statusFilter !== "all" ? "search" : "sessions"} />
                  </div>
                ) : (
                  filteredSessions.map((session) => (
                    <div
                      key={session.id}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedSession === session.id ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                      }`}
                      onClick={() => setSelectedSession(session.id)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                              {session.customer_id?.substring(0, 2).toUpperCase() || "??"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium text-sm">{session.customer_id || "Unknown Customer"}</h4>
                            <p className="text-xs text-gray-500">Session #{session.id.substring(0, 8)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="h-4 w-4 text-gray-400" />
                          {session.message_count && session.message_count > 0 && (
                            <Badge className="bg-blue-500 text-white text-xs px-1 py-0">{session.message_count}</Badge>
                          )}
                        </div>
                      </div>

                      <p className="text-sm font-medium mb-2 line-clamp-1">
                        {session.last_message || "No messages yet"}
                      </p>

                      <div className="flex items-center justify-between mb-2">
                        <Badge className={getStatusColor(session.status)} variant="secondary">
                          <span className="flex items-center gap-1">
                            {getStatusIcon(session.status)}
                            {session.status}
                          </span>
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Agent: {session.agent_id.substring(0, 8)}</span>
                        <span>{formatTimestamp(session.updated_at)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Conversation View */}
            <div className="flex-1 flex flex-col">
              {currentSession ? (
                <>
                  {/* Session Header */}
                  <div className="border-b p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {currentSession.customer_id?.substring(0, 2).toUpperCase() || "??"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="font-semibold">{currentSession.customer_id || "Unknown Customer"}</h2>
                            <Badge className={getStatusColor(currentSession.status)} variant="secondary">
                              <span className="flex items-center gap-1">
                                {getStatusIcon(currentSession.status)}
                                {currentSession.status}
                              </span>
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500">
                            Session #{currentSession.id.substring(0, 8)} • Started{" "}
                            {formatTimestamp(currentSession.created_at)}
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
                              <p>Session Information</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusUpdate(currentSession.id, "escalated")}
                          disabled={currentSession.status === "escalated"}
                        >
                          <ArrowRight className="mr-2 h-4 w-4" />
                          Escalate
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusUpdate(currentSession.id, "closed")}
                          disabled={currentSession.status === "closed"}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Close
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {isLoading && messages.length === 0 ? (
                      <div className="flex items-center justify-center p-8">
                        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                        <span className="ml-2 text-gray-500">Loading messages...</span>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">No messages in this conversation yet</p>
                      </div>
                    ) : (
                      messages.map((message) => <MessageComponent key={message.id} message={message} />)
                    )}
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
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <EmptyState type="messages" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Session Information Sheet */}
      <Sheet open={showCustomerInfo} onOpenChange={setShowCustomerInfo}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Session Information</SheetTitle>
            <SheetDescription>Details about this conversation session</SheetDescription>
          </SheetHeader>
          {currentSession && (
            <div className="py-4 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Session ID</label>
                  <p className="text-sm">{currentSession.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Customer ID</label>
                  <p className="text-sm">{currentSession.customer_id || "Unknown"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <Badge className={getStatusColor(currentSession.status)} variant="secondary">
                    <span className="flex items-center gap-1">
                      {getStatusIcon(currentSession.status)}
                      {currentSession.status}
                    </span>
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Created</label>
                  <p className="text-sm">{new Date(currentSession.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Updated</label>
                  <p className="text-sm">{new Date(currentSession.updated_at).toLocaleString()}</p>
                </div>
                {currentSession.message_count && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Message Count</label>
                    <p className="text-sm">{currentSession.message_count}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

function MessageComponent({ message }: { message: SessionMessage }) {
  const isUser = message.message_type === "user"

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[80%] ${isUser ? "" : "flex items-start space-x-2"}`}>
        {!isUser && (
          <Avatar className="h-8 w-8 mt-1">
            <AvatarFallback className="bg-purple-100 text-purple-600">
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        )}
        <div className="flex-1">
          {!isUser && (
            <div className="flex items-baseline mb-1">
              <span className="font-medium text-sm">AI Assistant</span>
              <span className="text-xs text-gray-500 ml-2">AI Agent</span>
            </div>
          )}
          <div
            className={`rounded-lg p-3 text-sm ${
              isUser ? "bg-blue-500 text-white rounded-tr-none" : "bg-white border border-gray-200 rounded-tl-none"
            }`}
          >
            {message.content}
          </div>
          <div className={`text-xs text-gray-500 mt-1 ${isUser ? "text-right" : "text-left"}`}>
            {new Date(message.created_at).toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  )
}
