"use client"

import { useState } from "react"
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
} from "lucide-react"
import { useUser } from "../../Auth/Contexts/UserContext"

interface WidgetConfig {
  // Appearance
  primaryColor: string
  secondaryColor: string
  textColor: string
  backgroundColor: string
  borderRadius: number
  fontSize: number
  fontFamily: string
  headerHeight: number

  // Behavior
  welcomeMessage: string
  placeholderText: string
  position: "bottom-right" | "bottom-left" | "top-right" | "top-left"
  autoOpen: boolean
  autoOpenDelay: number
  showAvatar: boolean
  showTypingIndicator: boolean
  showOnlineStatus: boolean

  // Branding
  companyName: string
  companyLogo: string
  agentName: string
  agentAvatar: string

  // Features
  enableFileUpload: boolean
  enableEmojis: boolean
  enableSoundNotifications: boolean
  enableOfflineMessage: boolean
  offlineMessage: string
  showPoweredBy: boolean
  enableRating: boolean

  // Advanced
  customCSS: string
  allowedDomains: string[]
  maxMessageLength: number
  rateLimitMessages: number
  rateLimitWindow: number
  widgetWidth: number
  widgetHeight: number
}

export default function ChatWidget() {
  const { user, organization } = useUser()
  const [activeTab, setActiveTab] = useState("appearance")
  const [previewMessages, setPreviewMessages] = useState([
    {
      id: 1,
      sender: "bot",
      content: "Hello! How can I help you today?",
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
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const [config, setConfig] = useState<WidgetConfig>({
    // Appearance defaults
    primaryColor: "#000000",
    secondaryColor: "#f8fafc",
    textColor: "#1f2937",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    fontSize: 14,
    fontFamily: "Inter, system-ui, sans-serif",
    headerHeight: 60,

    // Behavior defaults
    welcomeMessage: "Hello! How can I help you today?",
    placeholderText: "Type your message...",
    position: "bottom-right",
    autoOpen: false,
    autoOpenDelay: 3000,
    showAvatar: true,
    showTypingIndicator: true,
    showOnlineStatus: true,

    // Branding defaults
    companyName: organization?.name || "Your Company",
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

    // Advanced defaults
    customCSS: "",
    allowedDomains: [],
    maxMessageLength: 1000,
    rateLimitMessages: 10,
    rateLimitWindow: 60,
    widgetWidth: 380,
    widgetHeight: 600,
  })

  const updateConfig = (key: keyof WidgetConfig, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }))

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
    setError("")
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setLastSaved(new Date())
      setSuccess("Widget configuration saved successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (error) {
      console.error("Error saving widget config:", error)
      setError("Failed to save widget configuration. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const generateEmbedCode = () => {
    return `<!-- Clayo Chat Widget -->
<script>
  window.ClayoConfig = {
    apiKey: "your-api-key-here",
    primaryColor: "${config.primaryColor}",
    secondaryColor: "${config.secondaryColor}",
    position: "${config.position}",
    welcomeMessage: "${config.welcomeMessage}",
    companyName: "${config.companyName}",
    agentName: "${config.agentName}",
    showAvatar: ${config.showAvatar},
    enableFileUpload: ${config.enableFileUpload},
    enableEmojis: ${config.enableEmojis},
    autoOpen: ${config.autoOpen},
    autoOpenDelay: ${config.autoOpenDelay},
  };
</script>
<script src="https://widget.clayo.co/embed.js" async></script>`
  }

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(generateEmbedCode())
    setSuccess("Embed code copied to clipboard!")
    setTimeout(() => setSuccess(""), 3000)
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
      {/* Header - matching team page structure */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Chat Widget</h1>
          <p className="text-gray-500">Customize and deploy your AI chat widget</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={resetChat}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset Chat
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
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
        {/* Chat Preview - Main Content */}
        <div className="lg:col-span-2">
          <Card>
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
                    Preview: {config.position.replace("-", " ")}
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
                        borderRadius: `${config.borderRadius}px ${config.borderRadius}px ${isMinimized ? config.borderRadius : 0}px ${isMinimized ? config.borderRadius : 0}px`,
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
                                className={`flex items-end space-x-2 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
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
                                        ? `${config.borderRadius}px ${config.borderRadius * 0.3}px ${config.borderRadius}px ${config.borderRadius}px`
                                        : `${config.borderRadius * 0.3}px ${config.borderRadius}px ${config.borderRadius}px ${config.borderRadius}px`,
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
                                    borderRadius: `${config.borderRadius * 0.3}px ${config.borderRadius}px ${config.borderRadius}px ${config.borderRadius}px`,
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
                                  borderRadius: `${config.borderRadius * 0.3}px ${config.borderRadius}px ${config.borderRadius}px ${config.borderRadius}px`,
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
                                        className={`h-4 w-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
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

        {/* Configuration Panel - Expanded Sidebar */}
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
                          {generateEmbedCode()}
                        </code>
                      </div>
                      <Button onClick={copyEmbedCode} className="w-full" variant="outline" size="sm">
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Code
                      </Button>
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
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
