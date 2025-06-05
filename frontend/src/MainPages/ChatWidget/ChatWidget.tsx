"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, X, Minus, Send, Paperclip, Smile, Bot, CheckCircle2, Clock, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

// Types
type Message = {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  status: "sending" | "sent" | "delivered" | "read"
  type: "text" | "image" | "file" | "quickReply"
}

type QuickReply = {
  id: string
  text: string
}

type ChatWidgetProps = {
  companyName?: string
  companyLogo?: string
  accentColor?: string
  welcomeMessage?: string
  agentName?: string
  agentAvatar?: string
  onSendMessage?: (message: string) => Promise<void>
}

export function ChatWidget({
  companyName = "AI Support Pro",
  companyLogo = "",
  accentColor = "#4f46e5",
  welcomeMessage = "👋 Hi there! How can I help you today?",
  agentName = "Support AI",
  agentAvatar = "",
  onSendMessage,
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([
    { id: "1", text: "Pricing information" },
    { id: "2", text: "Book a demo" },
    { id: "3", text: "Technical support" },
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  // Add welcome message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          content: welcomeMessage,
          sender: "ai",
          timestamp: new Date(),
          status: "read",
          type: "text",
        },
      ])
    }
  }, [isOpen, messages.length, welcomeMessage])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async () => {
    if (!message.trim()) return

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: message,
      sender: "user",
      timestamp: new Date(),
      status: "sending",
      type: "text",
    }

    setMessages((prev) => [...prev, userMessage])
    setMessage("")

    // Focus back on textarea
    setTimeout(() => {
      textareaRef.current?.focus()
    }, 0)

    // Show typing indicator
    setIsTyping(true)

    try {
      // Call the onSendMessage prop if provided
      if (onSendMessage) {
        await onSendMessage(message)
      }

      // Simulate AI response (replace with actual AI response)
      setTimeout(() => {
        // Update user message status
        setMessages((prev) => prev.map((m) => (m.id === userMessage.id ? { ...m, status: "read" } : m)))

        // Add AI response
        const aiResponse: Message = {
          id: `ai-${Date.now()}`,
          content: getSimulatedResponse(message),
          sender: "ai",
          timestamp: new Date(),
          status: "delivered",
          type: "text",
        }

        setMessages((prev) => [...prev, aiResponse])
        setIsTyping(false)

        // Update quick replies based on the conversation
        updateQuickReplies(message)
      }, 1500)
    } catch (error) {
      console.error("Error sending message:", error)
      setIsTyping(false)
    }
  }

  // Simulate AI responses (replace with actual AI integration)
  const getSimulatedResponse = (userMessage: string): string => {
    const lowerCaseMessage = userMessage.toLowerCase()

    if (
      lowerCaseMessage.includes("price") ||
      lowerCaseMessage.includes("cost") ||
      lowerCaseMessage.includes("pricing")
    ) {
      return "Our pricing starts at $49/month for the Basic plan. We also offer Professional ($99/month) and Enterprise (custom pricing) plans. Would you like me to send you our detailed pricing information?"
    }

    if (
      lowerCaseMessage.includes("demo") ||
      lowerCaseMessage.includes("book") ||
      lowerCaseMessage.includes("schedule")
    ) {
      return "I'd be happy to help you schedule a demo! Our team is available Monday through Friday, 9am-5pm EST. What day and time works best for you?"
    }

    if (
      lowerCaseMessage.includes("support") ||
      lowerCaseMessage.includes("help") ||
      lowerCaseMessage.includes("issue")
    ) {
      return "I can definitely help with technical support. Could you please describe the issue you're experiencing in more detail so I can assist you better?"
    }

    return "Thank you for your message! I'm here to help with any questions about our products and services. Is there something specific you'd like to know?"
  }

  // Update quick replies based on conversation context
  const updateQuickReplies = (userMessage: string) => {
    const lowerCaseMessage = userMessage.toLowerCase()

    if (lowerCaseMessage.includes("price") || lowerCaseMessage.includes("cost")) {
      setQuickReplies([
        { id: "p1", text: "Basic plan details" },
        { id: "p2", text: "Professional plan details" },
        { id: "p3", text: "Enterprise plan details" },
      ])
    } else if (lowerCaseMessage.includes("demo") || lowerCaseMessage.includes("book")) {
      setQuickReplies([
        { id: "d1", text: "This week" },
        { id: "d2", text: "Next week" },
        { id: "d3", text: "Send me available times" },
      ])
    } else if (lowerCaseMessage.includes("support") || lowerCaseMessage.includes("help")) {
      setQuickReplies([
        { id: "s1", text: "Installation issues" },
        { id: "s2", text: "Account access" },
        { id: "s3", text: "Talk to human agent" },
      ])
    }
  }

  const handleQuickReply = (text: string) => {
    setMessage(text)
    // Focus and select the text in the textarea
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
    setIsMinimized(false)
  }

  const minimizeChat = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMinimized(true)
  }

  const closeChat = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen(false)
  }

  const getMessageStatusIcon = (status: Message["status"]) => {
    switch (status) {
      case "sending":
        return <Clock className="h-3 w-3 text-gray-400" />
      case "sent":
        return <CheckCircle2 className="h-3 w-3 text-gray-400" />
      case "delivered":
        return <CheckCircle2 className="h-3 w-3 text-blue-500" />
      case "read":
        return <CheckCircle2 className="h-3 w-3 text-green-500" />
      default:
        return null
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-full max-w-[380px] rounded-lg border bg-white shadow-xl"
          >
            {/* Chat Header */}
            <div
              className="flex items-center justify-between rounded-t-lg p-4"
              style={{ backgroundColor: accentColor }}
            >
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8 border-2 border-white">
                  {companyLogo ? (
                    <AvatarImage src={companyLogo || "/placeholder.svg"} alt={companyName} />
                  ) : (
                    <AvatarFallback className="bg-white text-indigo-600">
                      {companyName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h3 className="font-medium text-white">{companyName}</h3>
                  <div className="flex items-center space-x-1">
                    <span className="h-2 w-2 rounded-full bg-green-400"></span>
                    <span className="text-xs text-green-100">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full text-white hover:bg-white/20"
                  onClick={minimizeChat}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full text-white hover:bg-white/20"
                  onClick={closeChat}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="h-[350px] overflow-y-auto p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn("flex", {
                      "justify-end": msg.sender === "user",
                      "justify-start": msg.sender === "ai",
                    })}
                  >
                    {msg.sender === "ai" && (
                      <Avatar className="mr-2 mt-1 h-8 w-8">
                        {agentAvatar ? (
                          <AvatarImage src={agentAvatar || "/placeholder.svg"} alt={agentName} />
                        ) : (
                          <AvatarFallback style={{ backgroundColor: accentColor }} className="text-white">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                    )}
                    <div
                      className={cn("max-w-[75%] rounded-lg px-4 py-2", {
                        "bg-primary text-primary-foreground": msg.sender === "user",
                        "bg-muted text-muted-foreground": msg.sender === "ai",
                      })}
                      style={{
                        backgroundColor: msg.sender === "user" ? accentColor : undefined,
                      }}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <div
                        className={cn("mt-1 flex items-center justify-end space-x-1", {
                          "justify-end": msg.sender === "user",
                          "justify-start": msg.sender === "ai",
                        })}
                      >
                        <span className="text-xs opacity-70">
                          {msg.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {msg.sender === "user" && getMessageStatusIcon(msg.status)}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <Avatar className="mr-2 mt-1 h-8 w-8">
                      {agentAvatar ? (
                        <AvatarImage src={agentAvatar || "/placeholder.svg"} alt={agentName} />
                      ) : (
                        <AvatarFallback style={{ backgroundColor: accentColor }} className="text-white">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="max-w-[75%] rounded-lg bg-muted px-4 py-3 text-muted-foreground">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                        <div
                          className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Quick Replies */}
            {quickReplies.length > 0 && (
              <div className="border-t px-4 py-2">
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((reply) => (
                    <Badge
                      key={reply.id}
                      variant="outline"
                      className="cursor-pointer bg-gray-50 px-3 py-1 hover:bg-gray-100"
                      onClick={() => handleQuickReply(reply.text)}
                    >
                      {reply.text}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Input */}
            <div className="border-t p-4">
              <div className="flex items-end space-x-2">
                <div className="relative flex-1">
                  <Textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    className="min-h-[60px] resize-none pr-10"
                    rows={1}
                  />
                  <div className="absolute bottom-2 right-2 flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-full text-gray-400 hover:text-gray-600"
                    >
                      <Smile className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-full text-gray-400 hover:text-gray-600"
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  style={{ backgroundColor: accentColor }}
                  className="h-10 w-10 rounded-full p-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2 text-center text-xs text-gray-500">Powered by AI Support Pro</div>
            </div>
          </motion.div>
        )}

        {isOpen && isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mb-4 flex w-auto items-center space-x-2 rounded-full border bg-white px-4 py-2 shadow-lg"
          >
            <Avatar className="h-6 w-6">
              {companyLogo ? (
                <AvatarImage src={companyLogo || "/placeholder.svg"} alt={companyName} />
              ) : (
                <AvatarFallback style={{ backgroundColor: accentColor }} className="text-white">
                  {companyName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <span className="text-sm font-medium">{companyName}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full p-0"
              onClick={(e) => {
                e.stopPropagation()
                setIsMinimized(false)
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleChat}
        style={{ backgroundColor: accentColor }}
        className="flex h-14 w-14 items-center justify-center rounded-full shadow-lg"
      >
        {isOpen ? <X className="h-6 w-6 text-white" /> : <MessageSquare className="h-6 w-6 text-white" />}
      </motion.button>
    </div>
  )
}
