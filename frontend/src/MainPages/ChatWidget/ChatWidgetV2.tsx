"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  MessageSquare,
  Send,
  Minimize2,
  X,
  Bot,
  User,
  Phone,
  Mail,
  CheckCircle,
  ThumbsUp,
  ThumbsDown,
  Paperclip,
} from "lucide-react"

interface Message {
  id: number
  sender: "customer" | "ai"
  message: string
  timestamp: string
  typing?: boolean
  suggestions?: string[]
  attachments?: { name: string; type: string }[]
}

export default function CustomerChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "ai",
      message:
        "Hi! I'm Alex, your AI assistant. I can help you with orders, products, returns, and more. How can I help you today?",
      timestamp: "Just now",
      suggestions: ["Track my order", "Return an item", "Product questions", "Billing help"],
    },
  ])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [customerSatisfaction, setCustomerSatisfaction] = useState<"thumbsup" | "thumbsdown" | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = (messageText?: string) => {
    const text = messageText || newMessage
    if (text.trim()) {
      const userMessage: Message = {
        id: messages.length + 1,
        sender: "customer",
        message: text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      setMessages((prev) => [...prev, userMessage])
      setNewMessage("")
      setIsTyping(true)

      // Simulate AI response
      setTimeout(() => {
        setIsTyping(false)
        let aiResponse: Message

        if (text.toLowerCase().includes("order") || text.toLowerCase().includes("track")) {
          aiResponse = {
            id: messages.length + 2,
            sender: "ai",
            message:
              "I can help you track your order! Could you please provide your order number? It usually starts with # and has 5-6 digits.",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            suggestions: ["I don't have my order number", "Check my email for orders", "Call me instead"],
          }
        } else if (text.toLowerCase().includes("return")) {
          aiResponse = {
            id: messages.length + 2,
            sender: "ai",
            message:
              "I'd be happy to help with your return! Our return policy allows returns within 30 days. What item would you like to return?",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            suggestions: ["Start return process", "Check return policy", "Speak to human agent"],
          }
        } else if (text.includes("#") && /\d{4,6}/.test(text)) {
          aiResponse = {
            id: messages.length + 2,
            sender: "ai",
            message:
              "Perfect! I found your order. It was placed on Dec 1st and is currently being prepared for shipment. You should receive tracking information within 24 hours. Would you like me to send updates to your email?",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            suggestions: ["Yes, send updates", "Change shipping address", "Cancel this order"],
          }
        } else {
          aiResponse = {
            id: messages.length + 2,
            sender: "ai",
            message:
              "I understand you need help with that. Let me connect you with the right information. Is this related to an existing order, a product question, or something else?",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            suggestions: ["Existing order", "Product question", "Billing issue", "Technical support"],
          }
        }

        setMessages((prev) => [...prev, aiResponse])
      }, 1500)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion)
  }

  const handleFeedback = (type: "thumbsup" | "thumbsdown") => {
    setCustomerSatisfaction(type)
    const feedbackMessage: Message = {
      id: messages.length + 1,
      sender: "ai",
      message:
        type === "thumbsup"
          ? "Thank you for the positive feedback! Is there anything else I can help you with?"
          : "I'm sorry I couldn't help better. Let me connect you with a human agent who can assist you further.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      suggestions:
        type === "thumbsup"
          ? ["No, that's all", "Yes, I have another question"]
          : ["Connect to human agent", "Try again", "Call me instead"],
    }
    setMessages((prev) => [...prev, feedbackMessage])
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-16 h-16 bg-blue-600 hover:bg-blue-700 shadow-lg"
          size="lg"
        >
          <MessageSquare className="w-6 h-6" />
        </Button>
        {/* Notification badge */}
        <div className="absolute -top-2 -left-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">1</span>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-96 shadow-2xl transition-all duration-300 ${isMinimized ? "h-16" : "h-[600px]"}`}>
        <CardHeader className="flex flex-row items-center justify-between p-4 bg-blue-600 text-white rounded-t-lg">
          <div className="flex items-center space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-blue-500 text-white text-sm">
                <Bot className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-sm">Alex - AI Assistant</h3>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs opacity-90">Online • Responds instantly</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white hover:bg-blue-700 p-1"
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-blue-700 p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[536px]">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "customer" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] ${msg.sender === "customer" ? "order-2" : "order-1"}`}>
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        msg.sender === "customer"
                          ? "bg-blue-600 text-white rounded-br-sm"
                          : "bg-gray-100 text-gray-900 rounded-bl-sm"
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                    </div>
                    <div
                      className={`flex items-center mt-1 space-x-2 ${msg.sender === "customer" ? "justify-end" : "justify-start"}`}
                    >
                      <span className="text-xs text-gray-500">{msg.timestamp}</span>
                      {msg.sender === "ai" && (
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFeedback("thumbsup")}
                            className="p-1 h-auto"
                            disabled={customerSatisfaction !== null}
                          >
                            <ThumbsUp
                              className={`w-3 h-3 ${customerSatisfaction === "thumbsup" ? "text-green-600" : "text-gray-400"}`}
                            />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFeedback("thumbsdown")}
                            className="p-1 h-auto"
                            disabled={customerSatisfaction !== null}
                          >
                            <ThumbsDown
                              className={`w-3 h-3 ${customerSatisfaction === "thumbsdown" ? "text-red-600" : "text-gray-400"}`}
                            />
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Quick suggestions */}
                    {msg.suggestions && (
                      <div className="mt-2 space-y-1">
                        {msg.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="text-xs h-auto py-1 px-2 mr-1 mb-1"
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg px-4 py-2 rounded-bl-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions Bar */}
            <div className="border-t bg-gray-50 p-2">
              <div className="flex justify-center space-x-4">
                <Button variant="ghost" size="sm" className="text-xs">
                  <Phone className="w-3 h-3 mr-1" />
                  Call Me
                </Button>
                <Button variant="ghost" size="sm" className="text-xs">
                  <Mail className="w-3 h-3 mr-1" />
                  Email
                </Button>
                <Button variant="ghost" size="sm" className="text-xs">
                  <User className="w-3 h-3 mr-1" />
                  Human Agent
                </Button>
              </div>
            </div>

            {/* Input */}
            <div className="border-t p-4">
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" className="p-2">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  className="flex-1"
                />
                <Button onClick={() => sendMessage()} disabled={!newMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">Powered by AI • Usually replies instantly</span>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-gray-500">Secure</span>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
