"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Monitor,
  Palette,
  Settings,
  Code,
  Copy,
  Download,
  Bot,
  Send,
  Minimize2,
  RefreshCw,
  Paperclip,
  Smile,
  Phone,
  Video,
  Upload,
  Star,
  Zap,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
} from "lucide-react"
import { useUser } from "../../Auth/Contexts/UserContext"
import { useWidgetConfig, type WidgetConfig } from "../../Hooks/useWidgetConfig"

// Define size presets
const SIZE_PRESETS = {
  normal: { width: 380, height: 600, label: "Normal" },
  medium: { width: 420, height: 650, label: "Medium" },
  large: { width: 480, height: 720, label: "Large" },
}

// Modern default configuration
const getModernDefaults = (organizationName?: string): WidgetConfig => ({
  // Appearance defaults - MODERN LOOK
  primaryColor: "#3B82F6", // Modern blue
  secondaryColor: "#EFF6FF", // Light blue
  textColor: "#374151", // Softer gray
  backgroundColor: "#ffffff",
  borderRadius: 20, // More rounded
  fontSize: 15, // Slightly larger
  fontFamily: "Inter, system-ui, sans-serif",
  headerHeight: 64, // Taller header

  // Behavior defaults
  welcomeMessage: "👋 Hi there! I'm here to help you with any questions you might have. How can I assist you today?",
  placeholderText: "Type your message...",
  position: "bottom-right",
  autoOpen: false,
  autoOpenDelay: 3000,
  showAvatar: true,
  showTypingIndicator: true,
  showOnlineStatus: true,

  // Branding defaults
  companyName: organizationName || "Your Company",
  companyLogo: "",
  agentName: "AI Assistant",
  agentAvatar: "",

  // Features defaults
  enableFileUpload: true,
  enableEmojis: true,
  enableSoundNotifications: false,
  enableOfflineMessage: true,
  offlineMessage: "We're currently offline. Leave a message and we'll get back to you!",
  showPoweredBy: true,
  enableRating: true,

  // Advanced defaults - MEDIUM SIZE BY DEFAULT
  customCSS: "",
  allowedDomains: [],
  maxMessageLength: 1000,
  rateLimitMessages: 10,
  rateLimitWindow: 60,
  widgetWidth: SIZE_PRESETS.medium.width,
  widgetHeight: SIZE_PRESETS.medium.height,
})

export default function ChatWidgetConfig() {
  const { user, organization } = useUser()
  const { getWidgetConfig, saveWidgetConfig, isLoading, error, success, clearMessages } = useWidgetConfig()

  const [activeTab, setActiveTab] = useState("appearance")
  const [previewMessages, setPreviewMessages] = useState([
    {
      id: 1,
      sender: "bot",
      content: "👋 Hi there! I'm here to help you with any questions you might have. How can I assist you today?",
      timestamp: new Date(),
      avatar: "🤖",
    },
  ])
  const [previewInput, setPreviewInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isMinimized, setIsMinimized] = useState(false)
  const [showRating, setShowRating] = useState(false)
  const [rating, setRating] = useState(0)
  const [embedCode, setEmbedCode] = useState("")
  const [selectedSize, setSelectedSize] = useState<keyof typeof SIZE_PRESETS>("medium")

  // Initialize with modern defaults
  const [config, setConfig] = useState<WidgetConfig>(() => getModernDefaults())

  // Load existing configuration on mount
  useEffect(() => {
    const loadConfig = async () => {
      const result = await getWidgetConfig()
      const modernDefaults = getModernDefaults(organization?.name)

      if (result && result.config) {
        // Check if this is an old config (missing modern styling)
        const isOldConfig = !result.config.primaryColor || result.config.primaryColor === "#000000"

        if (isOldConfig) {
          // For old configs, use modern defaults but keep user's custom settings
          const mergedConfig = {
            ...modernDefaults,
            // Only keep non-styling user preferences
            companyName: result.config.companyName || modernDefaults.companyName,
            agentName: result.config.agentName || modernDefaults.agentName,
            companyLogo: result.config.companyLogo || modernDefaults.companyLogo,
            welcomeMessage: result.config.welcomeMessage || modernDefaults.welcomeMessage,
            placeholderText: result.config.placeholderText || modernDefaults.placeholderText,
            position: result.config.position || modernDefaults.position,
            autoOpen: result.config.autoOpen ?? modernDefaults.autoOpen,
            showAvatar: result.config.showAvatar ?? modernDefaults.showAvatar,
            showTypingIndicator: result.config.showTypingIndicator ?? modernDefaults.showTypingIndicator,
            showOnlineStatus: result.config.showOnlineStatus ?? modernDefaults.showOnlineStatus,
            enableFileUpload: result.config.enableFileUpload ?? modernDefaults.enableFileUpload,
            enableEmojis: result.config.enableEmojis ?? modernDefaults.enableEmojis,
            enableSoundNotifications: result.config.enableSoundNotifications ?? modernDefaults.enableSoundNotifications,
            enableRating: result.config.enableRating ?? modernDefaults.enableRating,
            showPoweredBy: result.config.showPoweredBy ?? modernDefaults.showPoweredBy,
            maxMessageLength: result.config.maxMessageLength || modernDefaults.maxMessageLength,
          }
          setConfig(mergedConfig)
        } else {
          // For newer configs, merge with modern defaults to add any missing fields
          const mergedConfig = { ...modernDefaults, ...result.config }
          setConfig(mergedConfig)
        }

        setEmbedCode(result.embedCode)

        // Determine current size preset
        const configToCheck = isOldConfig ? modernDefaults : result.config
        const currentSize = Object.entries(SIZE_PRESETS).find(
          ([_, preset]) => preset.width === configToCheck.widgetWidth && preset.height === configToCheck.widgetHeight,
        )
        if (currentSize) {
          setSelectedSize(currentSize[0] as keyof typeof SIZE_PRESETS)
        }

        // Update welcome message in preview
        const finalWelcomeMessage = isOldConfig
          ? modernDefaults.welcomeMessage
          : result.config.welcomeMessage || modernDefaults.welcomeMessage
        setPreviewMessages([
          {
            id: 1,
            sender: "bot",
            content: finalWelcomeMessage,
            timestamp: new Date(),
            avatar: "🤖",
          },
        ])
      } else {
        // No saved config, use modern defaults
        setConfig(modernDefaults)
        setPreviewMessages([
          {
            id: 1,
            sender: "bot",
            content: modernDefaults.welcomeMessage,
            timestamp: new Date(),
            avatar: "🤖",
          },
        ])
      }
    }

    if (user) {
      loadConfig()
    }
  }, [user, getWidgetConfig]) // Removed organization?.name from dependencies to prevent re-loading

  const updateConfig = (key: keyof WidgetConfig, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
    clearMessages()

    // Update welcome message in real-time
    if (key === "welcomeMessage" && value.trim()) {
      setPreviewMessages((prev) => [
        {
          id: 1,
          sender: "bot",
          content: value,
          timestamp: new Date(),
          avatar: "🤖",
        },
        ...prev.slice(1),
      ])
    }

    // Force re-render for style changes
    if (
      [
        "primaryColor",
        "secondaryColor",
        "textColor",
        "backgroundColor",
        "borderRadius",
        "fontSize",
        "fontFamily",
      ].includes(key)
    ) {
      setLastSaved(null)
    }
  }

  const handleSizeChange = (size: keyof typeof SIZE_PRESETS) => {
    setSelectedSize(size)
    const preset = SIZE_PRESETS[size]
    updateConfig("widgetWidth", preset.width)
    updateConfig("widgetHeight", preset.height)
  }

  const sendPreviewMessage = () => {
    if (previewInput.trim()) {
      const newMessage = {
        id: previewMessages.length + 1,
        sender: "user" as const,
        content: previewInput,
        timestamp: new Date(),
        avatar: "👤",
      }
      setPreviewMessages((prev) => [...prev, newMessage])
      setPreviewInput("")

      // Show typing indicator
      setIsTyping(true)

      // Simulate bot response
      setTimeout(() => {
        setIsTyping(false)
        const responses = [
          "Thanks for your message! I'm here to help.",
          "That's a great question. Let me assist you with that.",
          "I understand. How else can I help you today?",
          "Perfect! Is there anything else you'd like to know?",
          "I'm glad I could help. What else can I do for you?",
        ]
        const randomResponse = responses[Math.floor(Math.random() * responses.length)]

        const botResponse = {
          id: previewMessages.length + 2,
          sender: "bot" as const,
          content: randomResponse,
          timestamp: new Date(),
          avatar: "🤖",
        }
        setPreviewMessages((prev) => [...prev, botResponse])

        // Show rating after a few messages if enabled
        if (config.enableRating && previewMessages.length > 4 && Math.random() > 0.7) {
          setTimeout(() => setShowRating(true), 1000)
        }
      }, 1500)
    }
  }

  const resetChat = () => {
    setPreviewMessages([
      {
        id: 1,
        sender: "bot",
        content: config.welcomeMessage,
        timestamp: new Date(),
        avatar: "🤖",
      },
    ])
    setPreviewInput("")
    setIsTyping(false)
    setShowRating(false)
    setRating(0)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const result = await saveWidgetConfig(config)
      if (result) {
        setLastSaved(new Date())
        setEmbedCode(result.embedCode)
      }
    } finally {
      setIsSaving(false)
    }
  }

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode)
  }

  const handleRating = (stars: number) => {
    setRating(stars)
    setTimeout(() => {
      setShowRating(false)
      const thankYouMessage = {
        id: previewMessages.length + 1,
        sender: "bot" as const,
        content: `Thank you for the ${stars}-star rating! Your feedback helps us improve.`,
        timestamp: new Date(),
        avatar: "🤖",
      }
      setPreviewMessages((prev) => [...prev, thankYouMessage])
    }, 1000)
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Chat Widget Configuration</h1>
          <p className="text-gray-500">Customize and deploy your AI chat widget</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={resetChat}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset Preview
          </Button>
          <Button onClick={handleSave} disabled={isSaving || isLoading}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Save & Deploy
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Preview - STICKY */}
        <div className="lg:col-span-2">
          <Card className="sticky top-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Live Preview</CardTitle>
              <CardDescription>
                See how your widget will look and behave in real-time
                {lastSaved && (
                  <span className="block text-sm text-gray-500 mt-1">Last saved: {lastSaved.toLocaleTimeString()}</span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg min-h-[600px]">
                <div className="relative">
                  {/* Position indicator */}
                  <div className="absolute -top-8 left-0 text-sm text-gray-600 font-medium">
                    Preview: {config.position.replace("-", " ")} • {SIZE_PRESETS[selectedSize].label}
                  </div>

                  {/* Chat Widget */}
                  <div
                    className={`bg-white shadow-2xl border transition-all duration-300 ${isMinimized ? "h-16" : ""}`}
                    style={{
                      width: `${config.widgetWidth}px`,
                      height: isMinimized ? "64px" : `${config.widgetHeight}px`,
                      borderRadius: `${config.borderRadius}px`,
                      fontSize: `${config.fontSize}px`,
                      fontFamily: config.fontFamily,
                    }}
                  >
                    {/* Widget Header */}
                    <div
                      className="p-4 flex items-center justify-between cursor-pointer"
                      style={{
                        backgroundColor: config.primaryColor,
                        color: config.backgroundColor,
                        borderRadius: `${config.borderRadius}px ${config.borderRadius}px ${
                          isMinimized ? config.borderRadius : 0
                        }px ${isMinimized ? config.borderRadius : 0}px`,
                        height: `${config.headerHeight}px`,
                      }}
                      onClick={() => setIsMinimized(!isMinimized)}
                    >
                      <div className="flex items-center space-x-3">
                        {config.companyLogo ? (
                          <img
                            src={config.companyLogo || "/placeholder.svg"}
                            alt="Company Logo"
                            className="w-8 h-8 rounded"
                          />
                        ) : config.showAvatar ? (
                          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            {config.agentAvatar ? (
                              <img
                                src={config.agentAvatar || "/placeholder.svg"}
                                alt="Agent"
                                className="w-8 h-8 rounded-full"
                              />
                            ) : (
                              <Bot className="h-5 w-5" />
                            )}
                          </div>
                        ) : null}
                        <div>
                          <h4 className="font-semibold text-sm">{config.companyName}</h4>
                          {config.showOnlineStatus && (
                            <div className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              <p className="text-xs opacity-90">Online</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-white hover:bg-white hover:bg-opacity-20"
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-white hover:bg-white hover:bg-opacity-20"
                        >
                          <Video className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-white hover:bg-white hover:bg-opacity-20"
                          onClick={() => setIsMinimized(!isMinimized)}
                        >
                          {isMinimized ? <Monitor className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    {!isMinimized && (
                      <>
                        {/* Messages */}
                        <ScrollArea
                          className="p-4 space-y-4"
                          style={{
                            backgroundColor: config.backgroundColor,
                            height: `${config.widgetHeight - config.headerHeight - 80}px`,
                          }}
                        >
                          {previewMessages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} mb-4`}
                            >
                              <div
                                className={`flex items-end space-x-2 max-w-[80%] ${
                                  message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                                }`}
                              >
                                {config.showAvatar && message.sender === "bot" && (
                                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                                    {config.agentAvatar ? (
                                      <img
                                        src={config.agentAvatar || "/placeholder.svg"}
                                        alt="Agent"
                                        className="w-6 h-6 rounded-full"
                                      />
                                    ) : (
                                      message.avatar
                                    )}
                                  </div>
                                )}
                                <div
                                  className={`p-3 rounded-2xl ${message.sender === "user" ? "text-white" : "border"}`}
                                  style={{
                                    backgroundColor:
                                      message.sender === "user" ? config.primaryColor : config.secondaryColor,
                                    color: message.sender === "user" ? config.backgroundColor : config.textColor,
                                    borderRadius:
                                      message.sender === "user"
                                        ? `${config.borderRadius}px ${config.borderRadius * 0.3}px ${
                                            config.borderRadius
                                          }px ${config.borderRadius}px`
                                        : `${config.borderRadius * 0.3}px ${config.borderRadius}px ${
                                            config.borderRadius
                                          }px ${config.borderRadius}px`,
                                  }}
                                >
                                  <p className="text-sm leading-relaxed">{message.content}</p>
                                  <p className="text-xs opacity-70 mt-1">
                                    {message.timestamp.toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}

                          {/* Typing Indicator */}
                          {isTyping && config.showTypingIndicator && (
                            <div className="flex justify-start mb-4">
                              <div className="flex items-end space-x-2 max-w-[80%]">
                                {config.showAvatar && (
                                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                                    🤖
                                  </div>
                                )}
                                <div
                                  className="p-3 rounded-2xl border"
                                  style={{
                                    backgroundColor: config.secondaryColor,
                                    color: config.textColor,
                                    borderRadius: `${config.borderRadius * 0.3}px ${config.borderRadius}px ${
                                      config.borderRadius
                                    }px ${config.borderRadius}px`,
                                  }}
                                >
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
                            </div>
                          )}

                          {/* Rating Widget */}
                          {showRating && config.enableRating && (
                            <div className="flex justify-start mb-4">
                              <div
                                className="p-4 rounded-2xl border"
                                style={{
                                  backgroundColor: config.secondaryColor,
                                  color: config.textColor,
                                  borderRadius: `${config.borderRadius * 0.3}px ${config.borderRadius}px ${
                                    config.borderRadius
                                  }px ${config.borderRadius}px`,
                                }}
                              >
                                <p className="text-sm mb-2">How was your experience?</p>
                                <div className="flex space-x-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      onClick={() => handleRating(star)}
                                      className="hover:scale-110 transition-transform"
                                    >
                                      <Star
                                        className={`h-4 w-4 ${
                                          star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                        }`}
                                      />
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </ScrollArea>

                        {/* Input Area */}
                        <div className="p-4 border-t" style={{ backgroundColor: config.backgroundColor }}>
                          <div className="flex items-center space-x-2">
                            {config.enableFileUpload && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                style={{ color: config.textColor }}
                              >
                                <Paperclip className="h-4 w-4" />
                              </Button>
                            )}
                            <Input
                              value={previewInput}
                              onChange={(e) => setPreviewInput(e.target.value)}
                              placeholder={config.placeholderText}
                              className="flex-1 border-gray-200"
                              style={{
                                fontSize: `${config.fontSize}px`,
                                borderRadius: `${config.borderRadius * 0.7}px`,
                                color: config.textColor,
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  sendPreviewMessage()
                                }
                              }}
                              maxLength={config.maxMessageLength}
                            />
                            {config.enableEmojis && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                style={{ color: config.textColor }}
                              >
                                <Smile className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              onClick={sendPreviewMessage}
                              disabled={!previewInput.trim()}
                              style={{
                                backgroundColor: config.primaryColor,
                                borderRadius: `${config.borderRadius * 0.7}px`,
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>

                          {config.showPoweredBy && (
                            <div className="text-center mt-2">
                              <p className="text-xs text-gray-400">Powered by Clayo</p>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Configuration Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Customize Widget</CardTitle>
              <CardDescription>Configure your chat widget appearance and behavior</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="appearance" className="text-xs">
                    <Palette className="h-3 w-3 mr-1" />
                    Style
                  </TabsTrigger>
                  <TabsTrigger value="behavior" className="text-xs">
                    <Settings className="h-3 w-3 mr-1" />
                    Behavior
                  </TabsTrigger>
                </TabsList>
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="branding" className="text-xs">
                    <Upload className="h-3 w-3 mr-1" />
                    Brand
                  </TabsTrigger>
                  <TabsTrigger value="features" className="text-xs">
                    <Zap className="h-3 w-3 mr-1" />
                    Features
                  </TabsTrigger>
                  <TabsTrigger value="deploy" className="text-xs">
                    <Code className="h-3 w-3 mr-1" />
                    Deploy
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="appearance" className="space-y-6 mt-4">
                  {/* SIZE PRESETS */}
                  <div>
                    <Label className="text-sm font-medium">Widget Size</Label>
                    <Select value={selectedSize} onValueChange={handleSizeChange}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">
                          Normal ({SIZE_PRESETS.normal.width}×{SIZE_PRESETS.normal.height})
                        </SelectItem>
                        <SelectItem value="medium">
                          Medium ({SIZE_PRESETS.medium.width}×{SIZE_PRESETS.medium.height})
                        </SelectItem>
                        <SelectItem value="large">
                          Large ({SIZE_PRESETS.large.width}×{SIZE_PRESETS.large.height})
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">Choose a preset size for your chat widget</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Welcome Message</Label>
                    <Textarea
                      value={config.welcomeMessage}
                      onChange={(e) => updateConfig("welcomeMessage", e.target.value)}
                      className="mt-2"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Input Placeholder</Label>
                    <Input
                      value={config.placeholderText}
                      onChange={(e) => updateConfig("placeholderText", e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Colors</Label>
                    <div className="grid grid-cols-1 gap-3 mt-2">
                      <div>
                        <Label htmlFor="primaryColor" className="text-xs text-gray-600">
                          Primary Color
                        </Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Input
                            id="primaryColor"
                            type="color"
                            value={config.primaryColor}
                            onChange={(e) => updateConfig("primaryColor", e.target.value)}
                            className="w-12 h-8 p-1 border rounded"
                          />
                          <Input
                            value={config.primaryColor}
                            onChange={(e) => updateConfig("primaryColor", e.target.value)}
                            className="flex-1 text-xs"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="secondaryColor" className="text-xs text-gray-600">
                          Secondary Color
                        </Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Input
                            id="secondaryColor"
                            type="color"
                            value={config.secondaryColor}
                            onChange={(e) => updateConfig("secondaryColor", e.target.value)}
                            className="w-12 h-8 p-1 border rounded"
                          />
                          <Input
                            value={config.secondaryColor}
                            onChange={(e) => updateConfig("secondaryColor", e.target.value)}
                            className="flex-1 text-xs"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="textColor" className="text-xs text-gray-600">
                          Text Color
                        </Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Input
                            id="textColor"
                            type="color"
                            value={config.textColor}
                            onChange={(e) => updateConfig("textColor", e.target.value)}
                            className="w-12 h-8 p-1 border rounded"
                          />
                          <Input
                            value={config.textColor}
                            onChange={(e) => updateConfig("textColor", e.target.value)}
                            className="flex-1 text-xs"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="backgroundColor" className="text-xs text-gray-600">
                          Background Color
                        </Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Input
                            id="backgroundColor"
                            type="color"
                            value={config.backgroundColor}
                            onChange={(e) => updateConfig("backgroundColor", e.target.value)}
                            className="w-12 h-8 p-1 border rounded"
                          />
                          <Input
                            value={config.backgroundColor}
                            onChange={(e) => updateConfig("backgroundColor", e.target.value)}
                            className="flex-1 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="fontFamily" className="text-sm font-medium">
                      Font Family
                    </Label>
                    <Select value={config.fontFamily} onValueChange={(value) => updateConfig("fontFamily", value)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter, system-ui, sans-serif">Inter</SelectItem>
                        <SelectItem value="Arial, sans-serif">Arial</SelectItem>
                        <SelectItem value="Helvetica, sans-serif">Helvetica</SelectItem>
                        <SelectItem value="Georgia, serif">Georgia</SelectItem>
                        <SelectItem value="Roboto, sans-serif">Roboto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="borderRadius" className="text-sm font-medium">
                      Border Radius: {config.borderRadius}px
                    </Label>
                    <Slider
                      id="borderRadius"
                      min={0}
                      max={24}
                      step={1}
                      value={[config.borderRadius]}
                      onValueChange={(value) => updateConfig("borderRadius", value[0])}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="fontSize" className="text-sm font-medium">
                      Font Size: {config.fontSize}px
                    </Label>
                    <Slider
                      id="fontSize"
                      min={12}
                      max={18}
                      step={1}
                      value={[config.fontSize]}
                      onValueChange={(value) => updateConfig("fontSize", value[0])}
                      className="mt-2"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="behavior" className="space-y-6 mt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoOpen" className="text-sm font-medium">
                        Auto-open widget
                      </Label>
                      <p className="text-xs text-gray-500">Automatically open after page load</p>
                    </div>
                    <Switch
                      id="autoOpen"
                      checked={config.autoOpen}
                      onCheckedChange={(checked) => updateConfig("autoOpen", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="showOnlineStatus" className="text-sm font-medium">
                      Online Status
                    </Label>
                    <Switch
                      id="showOnlineStatus"
                      checked={config.showOnlineStatus}
                      onCheckedChange={(checked) => updateConfig("showOnlineStatus", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="showTypingIndicator" className="text-sm font-medium">
                      Typing Indicator
                    </Label>
                    <Switch
                      id="showTypingIndicator"
                      checked={config.showTypingIndicator}
                      onCheckedChange={(checked) => updateConfig("showTypingIndicator", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableSoundNotifications" className="text-sm font-medium">
                      Sound Notifications
                    </Label>
                    <Switch
                      id="enableSoundNotifications"
                      checked={config.enableSoundNotifications}
                      onCheckedChange={(checked) => updateConfig("enableSoundNotifications", checked)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="position" className="text-sm font-medium">
                      Position
                    </Label>
                    <Select value={config.position} onValueChange={(value: any) => updateConfig("position", value)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bottom-right">Bottom Right</SelectItem>
                        <SelectItem value="bottom-left">Bottom Left</SelectItem>
                        <SelectItem value="top-right">Top Right</SelectItem>
                        <SelectItem value="top-left">Top Left</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="branding" className="space-y-6 mt-4">
                  <div>
                    <Label htmlFor="companyName" className="text-sm font-medium">
                      Company Name
                    </Label>
                    <Input
                      id="companyName"
                      value={config.companyName}
                      onChange={(e) => updateConfig("companyName", e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="agentName" className="text-sm font-medium">
                      Agent Name
                    </Label>
                    <Input
                      id="agentName"
                      value={config.agentName}
                      onChange={(e) => updateConfig("agentName", e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="companyLogo" className="text-sm font-medium">
                      Company Logo URL
                    </Label>
                    <Input
                      id="companyLogo"
                      value={config.companyLogo}
                      onChange={(e) => updateConfig("companyLogo", e.target.value)}
                      placeholder="https://example.com/logo.png"
                      className="mt-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">Recommended size: 32x32px</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="showAvatar" className="text-sm font-medium">
                        Show Avatar
                      </Label>
                      <p className="text-xs text-gray-500">Display avatar in messages</p>
                    </div>
                    <Switch
                      id="showAvatar"
                      checked={config.showAvatar}
                      onCheckedChange={(checked) => updateConfig("showAvatar", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="showPoweredBy" className="text-sm font-medium">
                        Powered by Clayo
                      </Label>
                      <p className="text-xs text-gray-500">Show branding in widget</p>
                    </div>
                    <Switch
                      id="showPoweredBy"
                      checked={config.showPoweredBy}
                      onCheckedChange={(checked) => updateConfig("showPoweredBy", checked)}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="features" className="space-y-6 mt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enableFileUpload" className="text-sm font-medium">
                        File Upload
                      </Label>
                      <p className="text-xs text-gray-500">Allow customers to upload files</p>
                    </div>
                    <Switch
                      id="enableFileUpload"
                      checked={config.enableFileUpload}
                      onCheckedChange={(checked) => updateConfig("enableFileUpload", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enableEmojis" className="text-sm font-medium">
                        Emoji Picker
                      </Label>
                      <p className="text-xs text-gray-500">Enable emoji selection</p>
                    </div>
                    <Switch
                      id="enableEmojis"
                      checked={config.enableEmojis}
                      onCheckedChange={(checked) => updateConfig("enableEmojis", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enableRating" className="text-sm font-medium">
                        Rating System
                      </Label>
                      <p className="text-xs text-gray-500">Allow customers to rate conversations</p>
                    </div>
                    <Switch
                      id="enableRating"
                      checked={config.enableRating}
                      onCheckedChange={(checked) => updateConfig("enableRating", checked)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="maxMessageLength" className="text-sm font-medium">
                      Max Message Length: {config.maxMessageLength} characters
                    </Label>
                    <Slider
                      id="maxMessageLength"
                      min={100}
                      max={2000}
                      step={50}
                      value={[config.maxMessageLength]}
                      onValueChange={(value) => updateConfig("maxMessageLength", value[0])}
                      className="mt-2"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="deploy" className="space-y-6 mt-4">
                  <div>
                    <Label className="text-sm font-medium">Installation Code</Label>
                    <div className="mt-2 space-y-3">
                      <div className="bg-gray-50 p-3 rounded-lg border max-h-40 overflow-y-auto">
                        <code className="text-xs text-gray-800 whitespace-pre-wrap break-all">
                          {embedCode || "Save configuration to generate embed code"}
                        </code>
                      </div>
                      <Button
                        onClick={copyEmbedCode}
                        className="w-full"
                        variant="outline"
                        size="sm"
                        disabled={!embedCode}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Code
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Deployment Instructions</Label>
                    <div className="mt-2 space-y-3 text-sm text-gray-600">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-2">How to Deploy:</h4>
                        <ol className="list-decimal list-inside space-y-1 text-blue-700">
                          <li>Copy the installation code above</li>
                          <li>Paste it before the closing &lt;/body&gt; tag on your website</li>
                          <li>The widget will automatically appear on your site</li>
                          <li>Test the widget to ensure it's working correctly</li>
                        </ol>
                      </div>

                      <div className="p-3 bg-green-50 rounded-lg">
                        <h4 className="font-medium text-green-800 mb-2">Widget Features:</h4>
                        <ul className="list-disc list-inside space-y-1 text-green-700">
                          <li>Real-time AI responses</li>
                          <li>Conversation history</li>
                          <li>File upload support</li>
                          <li>Mobile responsive design</li>
                          <li>Customizable appearance</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Widget Status</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span>Status</span>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Conversations today</span>
                        <span className="font-medium">23</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Response rate</span>
                        <span className="font-medium">94%</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Avg response time</span>
                        <span className="font-medium">2m 30s</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button className="w-full" variant="outline" asChild>
                      <a href="/conversations" target="_blank" rel="noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Live Conversations
                      </a>
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
