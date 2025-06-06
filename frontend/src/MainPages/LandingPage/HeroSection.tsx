"use client"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Bot, Users, Zap, Shield, Send, Play, Pause, RotateCcw } from "lucide-react"
import BookDemoModal from "./book-demo-modal"
import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function HeroSection({ isBookDemoOpen, setIsBookDemoOpen }) {
  // Chat Demo Logic - Enhanced with User Controls
  const [messages, setMessages] = useState([
    {
      id: "initial-1",
      type: "bot",
      content: "👋 Hi there! I'm your AI assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [currentScenario, setCurrentScenario] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [autoplayEnabled, setAutoplayEnabled] = useState(true)
  const [demoActive, setDemoActive] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const messagesEndRef = useRef(null)
  const timeoutRef = useRef(null)

  const scenarios = [
    {
      title: "Customer Support",
      description: "See how AI handles order inquiries",
      icon: "🛒",
      userQuestions: [
        "Hi, I'm having trouble with my recent order",
        "Order #12345 - I haven't received a shipping confirmation yet",
        "That would be great, thank you!",
      ],
      botResponses: [
        "I'd be happy to help you with your order. Could you please provide your order number?",
        "Thanks for providing that information. I can see that your order was processed yesterday and is currently being prepared for shipping. You should receive a shipping confirmation email within the next 24 hours. Would you like me to send you an update once it ships?",
        "Perfect! I've set a reminder to notify you when your order ships. Is there anything else I can help you with today?",
      ],
    },
    {
      title: "Lead Qualification",
      description: "Watch AI qualify and convert prospects",
      icon: "💼",
      userQuestions: [
        "I'm interested in your premium plan",
        "We get about 200 customer inquiries daily across email and chat, and our team is overwhelmed",
        "Yes, that sounds perfect. My email is contact@example.com",
      ],
      botResponses: [
        "Great to hear you're interested in our premium plan! To help me recommend the best solution, could you tell me about your current customer support volume and main challenges?",
        "I understand - handling 200 daily inquiries manually can definitely overwhelm your team. Our Business Pro plan would be perfect for you. It can automate 80% of common inquiries, handle multiple channels simultaneously, and escalate complex issues to your team. Would you like me to send you detailed information and schedule a demo?",
        "Excellent! I've sent the detailed information to contact@example.com and our sales team will reach out within 1 business day to schedule your personalized demo. In the meantime, do you have any specific questions about our automation features?",
      ],
    },
    {
      title: "Technical Support",
      description: "AI troubleshooting technical issues",
      icon: "🔧",
      userQuestions: [
        "I'm having trouble connecting to your API",
        "I'm getting a 401 authentication error when making requests",
        "Perfect, that fixed it! Thank you so much",
      ],
      botResponses: [
        "I can help you troubleshoot your API connection. What specific error are you encountering?",
        "A 401 error indicates an authentication issue. Please check that you're using the correct API key in your request headers. The header should be 'Authorization: Bearer YOUR_API_KEY'. Also, ensure your API key hasn't expired. Would you like me to help you generate a new one?",
        "You're very welcome! I'm glad we could resolve that quickly. If you run into any other technical issues, feel free to reach out anytime. Is there anything else I can help you with today?",
      ],
    },
  ]

  // Scroll effect - only scroll within chat container
  useEffect(() => {
    if (messagesEndRef.current) {
      const chatContainer = messagesEndRef.current.closest(".overflow-y-auto")
      if (chatContainer) {
        setTimeout(() => {
          chatContainer.scrollTop = chatContainer.scrollHeight
        }, 100)
      }
    }
  }, [messages])

  // Demo automation effect
  useEffect(() => {
    if (!autoplayEnabled || !demoActive || isPaused) return

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    const scenario = scenarios[currentScenario]
    const totalSteps = scenario.userQuestions.length * 2 // Each question + response = 2 steps

    if (currentStep < totalSteps) {
      const isUserTurn = currentStep % 2 === 0
      const questionIndex = Math.floor(currentStep / 2)

      if (isUserTurn) {
        // User message - slower timing for better readability
        timeoutRef.current = setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: `user-${currentScenario}-${currentStep}-${Date.now()}`,
              type: "user",
              content: scenario.userQuestions[questionIndex],
              timestamp: new Date(),
            },
          ])
          setCurrentStep((prev) => prev + 1)
        }, 3000) // Increased from 2000ms
      } else {
        // Bot response - longer typing time
        timeoutRef.current = setTimeout(() => {
          setIsTyping(true)
          setTimeout(() => {
            setIsTyping(false)
            setMessages((prev) => [
              ...prev,
              {
                id: `bot-${currentScenario}-${currentStep}-${Date.now()}`,
                type: "bot",
                content: scenario.botResponses[questionIndex],
                timestamp: new Date(),
              },
            ])
            setCurrentStep((prev) => prev + 1)
          }, 2000) // Increased from 1500ms
        }, 1500) // Increased from 1000ms
      }
    } else {
      // Scenario complete, pause for longer before moving to next
      timeoutRef.current = setTimeout(() => {
        if (currentScenario < scenarios.length - 1) {
          // Move to next scenario
          setCurrentScenario((prev) => prev + 1)
          setCurrentStep(0)
          setMessages([
            {
              id: `initial-${currentScenario + 1}-${Date.now()}`,
              type: "bot",
              content: "👋 Hi there! I'm your AI assistant. How can I help you today?",
              timestamp: new Date(),
            },
          ])
        } else {
          // Restart from first scenario
          setCurrentScenario(0)
          setCurrentStep(0)
          setMessages([
            {
              id: `restart-${Date.now()}`,
              type: "bot",
              content: "👋 Hi there! I'm your AI assistant. How can I help you today?",
              timestamp: new Date(),
            },
          ])
        }
      }, 5000) // Increased from 3000ms
    }

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [currentStep, currentScenario, autoplayEnabled, demoActive, isPaused])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleUserMessage = (text) => {
    if (!text.trim()) return

    // Disable demo when user interacts
    setAutoplayEnabled(false)
    setDemoActive(false)
    setIsPaused(false)

    // Clear any pending timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        id: `manual-user-${Date.now()}`,
        type: "user",
        content: text,
        timestamp: new Date(),
      },
    ])

    setInputValue("")
  }

  const handleSendMessage = () => {
    handleUserMessage(inputValue)
  }

  const switchToScenario = (scenarioIndex) => {
    // Clear any pending timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    setCurrentScenario(scenarioIndex)
    setCurrentStep(0)
    setIsTyping(false)
    setMessages([
      {
        id: `switch-${scenarioIndex}-${Date.now()}`,
        type: "bot",
        content: "👋 Hi there! I'm your AI assistant. How can I help you today?",
        timestamp: new Date(),
      },
    ])

    // Re-enable demo if it was disabled
    if (!demoActive) {
      setDemoActive(true)
      setAutoplayEnabled(true)
    }
    setIsPaused(false)
  }

  const togglePlayPause = () => {
    setIsPaused(!isPaused)
    if (!autoplayEnabled) {
      setAutoplayEnabled(true)
      setDemoActive(true)
    }
  }

  const restartCurrentDemo = () => {
    // Clear any pending timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    setCurrentStep(0)
    setIsTyping(false)
    setMessages([
      {
        id: `restart-current-${Date.now()}`,
        type: "bot",
        content: "👋 Hi there! I'm your AI assistant. How can I help you today?",
        timestamp: new Date(),
      },
    ])

    setAutoplayEnabled(true)
    setDemoActive(true)
    setIsPaused(false)
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white min-h-[90vh] flex items-center">
      {/* Background pattern */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000000' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 md:py-28 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl mx-auto lg:mx-0"
          >
            {/* Founder credibility */}
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-sm font-medium mb-4 sm:mb-6 max-w-full">
              <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 flex-shrink-0"></span>
              <span className="truncate">24/7 AI Support & Sales Automation</span>
            </div>

            {/* Problem-focused headline */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-slate-900 mb-4 sm:mb-6 leading-tight break-words">
              Boost Customer Satisfaction & Sales Without the Costs
            </h1>

            {/* Clear value proposition */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 mb-6 sm:mb-8 leading-relaxed break-words">
              Our AI Customer Service and Sales Automation Platform trains on your company's documents, content, and
              FAQs to provide 24/7 support, qualify leads, schedule appointments, and process orders across multiple
              channels.
            </p>

            {/* Professional CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12 w-full">
              <Button
                size="lg"
                className="bg-slate-800 hover:bg-slate-700 text-white text-base px-6 w-full sm:w-auto flex-shrink-0"
                onClick={() => setIsBookDemoOpen(true)}
              >
                Book a Demo <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-slate-700 border-slate-300 hover:bg-slate-100 text-base w-full sm:w-auto"
              >
                Start Free Trial
              </Button>
            </div>

            {/* Solution-focused benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
              <div className="flex items-start min-w-0">
                <div className="bg-slate-100 p-2 rounded-lg mr-3 flex-shrink-0">
                  <Bot className="h-5 w-5 text-slate-700" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-slate-900 break-words">24/7 Support</h3>
                  <p className="text-sm text-slate-600 break-words">Never miss a customer inquiry</p>
                </div>
              </div>
              <div className="flex items-start min-w-0">
                <div className="bg-slate-100 p-2 rounded-lg mr-3 flex-shrink-0">
                  <Users className="h-5 w-5 text-slate-700" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-slate-900 break-words">Lead Qualification</h3>
                  <p className="text-sm text-slate-600 break-words">Convert more prospects to sales</p>
                </div>
              </div>
              <div className="flex items-start min-w-0">
                <div className="bg-slate-100 p-2 rounded-lg mr-3 flex-shrink-0">
                  <Zap className="h-5 w-5 text-slate-700" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-slate-900 break-words">Instant Responses</h3>
                  <p className="text-sm text-slate-600 break-words">No more waiting for answers</p>
                </div>
              </div>
              <div className="flex items-start min-w-0">
                <div className="bg-slate-100 p-2 rounded-lg mr-3 flex-shrink-0">
                  <Shield className="h-5 w-5 text-slate-700" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-slate-900 break-words">AI Trained on Your Data</h3>
                  <p className="text-sm text-slate-600 break-words">Upload docs, FAQs, and content</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative mt-8 lg:mt-0 w-full"
          >
            {/* Demo Selector */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-4"
            >
              <div className="flex flex-wrap gap-2 mb-3">
                {scenarios.map((scenario, index) => (
                  <button
                    key={index}
                    onClick={() => switchToScenario(index)}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      currentScenario === index
                        ? "bg-slate-800 text-white shadow-md"
                        : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="mr-2">{scenario.icon}</span>
                    <span className="hidden sm:inline">{scenario.title}</span>
                    <span className="sm:hidden">{scenario.title.split(" ")[0]}</span>
                  </button>
                ))}
              </div>

              {/* Demo Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={togglePlayPause}
                    className="flex items-center px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm transition-colors"
                  >
                    {isPaused || !autoplayEnabled ? (
                      <Play className="h-3 w-3 mr-1" />
                    ) : (
                      <Pause className="h-3 w-3 mr-1" />
                    )}
                    {isPaused || !autoplayEnabled ? "Play" : "Pause"}
                  </button>
                  <button
                    onClick={restartCurrentDemo}
                    className="flex items-center px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm transition-colors"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Restart
                  </button>
                </div>
                <div className="text-xs text-slate-500">{scenarios[currentScenario].description}</div>
              </div>
            </motion.div>

            {/* Chat Demo */}
            <div className="relative">
              <Card className="border-slate-200 shadow-lg overflow-hidden">
                <div className="bg-slate-800 text-white p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarFallback className="bg-slate-600">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-sm">AI Customer Assistant</h3>
                      <div className="flex items-center text-xs text-slate-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1"></span>
                        <span>Online</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                    {scenarios[currentScenario].title} Demo
                  </Badge>
                </div>

                <div className="h-[400px] overflow-y-auto p-4 bg-slate-50 scroll-smooth">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.type === "user"
                              ? "bg-slate-800 text-white rounded-tr-none"
                              : "bg-white border border-slate-200 rounded-tl-none"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div
                            className={`text-xs mt-1 ${message.type === "user" ? "text-slate-300" : "text-slate-500"}`}
                          >
                            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </div>
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white border border-slate-200 rounded-lg rounded-tl-none p-3 max-w-[80%]">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"
                              style={{ animationDelay: "0.4s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                <div className="p-4 border-t border-slate-200 bg-white">
                  <div className="flex items-center">
                    <Input
                      placeholder="Type your message..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="flex-1 mr-2"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSendMessage()
                        }
                      }}
                    />
                    <Button onClick={handleSendMessage} className="bg-slate-800 hover:bg-slate-700">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-xs text-slate-500 flex items-center">
                      <span
                        className={`h-1.5 w-1.5 rounded-full mr-1 ${
                          autoplayEnabled && !isPaused ? "bg-green-500" : "bg-slate-300"
                        }`}
                      ></span>
                      <span>{autoplayEnabled && !isPaused ? "Auto-demo active" : "Demo paused"}</span>
                    </div>
                    <div className="text-xs text-slate-500">Powered by AI</div>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>

      
    </div>
  )
}
