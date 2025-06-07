"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Import your new hooks with corrected paths
import { useAgentConfig } from "../../Hooks/useAgentsConfig"
import { useAgentSessions } from "../../Hooks/useAgentSessions"
import { useAgentAnalytics } from "../../Hooks/useAgentAnalytics"
import { useAgentStatus } from "../../Hooks/useAgentStatusHook"

import {
  Save,
  Lightbulb,
  Volume2,
  Sparkles,
  Check,
  AlertCircle,
  Loader2,
  MessageSquare,
  BarChart3,
  Activity,
  Clock,
  TrendingUp,
} from "lucide-react"

interface EnhancedAgentConfigTabsProps {
  agent: any
  onAgentUpdate?: () => void
}

export function EnhancedAgentConfigTabs({ agent, onAgentUpdate }: EnhancedAgentConfigTabsProps) {
  // Use all your new hooks
  const { updateAgentConfig, testAgentConfig, isLoading, error, success, clearMessages } = useAgentConfig()
  const { sessions, getAgentSessions, updateSessionStatus, isLoading: sessionsLoading } = useAgentSessions()
  const { analytics, getAgentAnalytics, isLoading: analyticsLoading } = useAgentAnalytics()
  const { agentStatus, getAgentStatus, isLoading: statusLoading } = useAgentStatus()

  // Form state for personality tab (removed maxTokens)
  const [formData, setFormData] = useState({
    name: agent.name || "",
    personality: agent.personality || "friendly",
    language: agent.language || "en",
    responseLength: agent.settings?.responseLength || "medium",
    formalityLevel: agent.settings?.formalityLevel || "balanced",
    customInstructions: agent.settings?.customInstructions || "",
    temperature: agent.settings?.temperature || 0.7,
    model: agent.settings?.model || "gpt-4o-mini",
    capabilities: agent.capabilities || [],
  })

  // Template state
  const [templates, setTemplates] = useState({
    greeting: agent.response_templates?.greeting || "Hello! I'm here to help you today. How can I assist you?",
    escalation:
      agent.response_templates?.escalation ||
      "I'd like to connect you with a human agent who can better assist you with this request.",
    closing:
      agent.response_templates?.closing ||
      "Thank you for contacting us today! Is there anything else I can help you with?",
  })

  const [hasChanges, setHasChanges] = useState(false)
  const [testMessage, setTestMessage] = useState("Hello, can you help me?")
  const [testResult, setTestResult] = useState("")
  const [isTesting, setIsTesting] = useState(false)

  // Load data when component mounts or agent changes
  useEffect(() => {
    if (agent.id) {
      getAgentSessions(agent.id)
      getAgentAnalytics(agent.id)
      getAgentStatus(agent.id)
    }
  }, [agent.id, getAgentSessions, getAgentAnalytics, getAgentStatus])

  // Track changes (removed maxTokens from comparison)
  useEffect(() => {
    const hasFormChanges = Object.keys(formData).some((key) => {
      if (key === "capabilities") {
        return JSON.stringify(formData[key]) !== JSON.stringify(agent[key] || [])
      }
      if (
        key === "customInstructions" ||
        key === "responseLength" ||
        key === "formalityLevel" ||
        key === "temperature" ||
        key === "model"
      ) {
        return formData[key] !== (agent.settings?.[key] || "")
      }
      return formData[key] !== (agent[key] || "")
    })

    const hasTemplateChanges = Object.keys(templates).some(
      (key) => templates[key] !== (agent.response_templates?.[key] || ""),
    )

    setHasChanges(hasFormChanges || hasTemplateChanges)
  }, [formData, templates, agent])

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    clearMessages()
  }

  const handleTemplateChange = (template: string, value: string) => {
    setTemplates((prev) => ({ ...prev, [template]: value }))
    clearMessages()
  }

  const handleCapabilityToggle = (capability: string, enabled: boolean) => {
    setFormData((prev) => ({
      ...prev,
      capabilities: enabled ? [...prev.capabilities, capability] : prev.capabilities.filter((c) => c !== capability),
    }))
    clearMessages()
  }

  const handleSave = async () => {
    const configToSave = {
      ...formData,
      responseTemplates: templates,
      settings: {
        responseLength: formData.responseLength,
        formalityLevel: formData.formalityLevel,
        customInstructions: formData.customInstructions,
        temperature: formData.temperature,
        model: formData.model,
        // maxTokens is now fixed at 300 and not configurable
      },
    }

    const success = await updateAgentConfig(agent.id, configToSave)
    if (success) {
      setHasChanges(false)
      onAgentUpdate?.()
    }
  }

  const handleTest = async () => {
    setIsTesting(true)
    setTestResult("")

    try {
      const result = await testAgentConfig(agent.id, testMessage)
      setTestResult(result || "Test completed successfully!")
    } catch (error) {
      setTestResult("Test failed: " + error.message)
    } finally {
      setIsTesting(false)
    }
  }

  const availableCapabilities = [
    "Customer Support",
    "Product Information",
    "Order Management",
    "Technical Support",
    "Billing Inquiries",
    "General Questions",
  ]

  return (
    <div className="space-y-6">
      {/* Error/Success Messages */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="personality" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personality">Personality</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* ENHANCED PERSONALITY TAB */}
        <TabsContent value="personality" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personality & Behavior */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Lightbulb className="mr-2 h-5 w-5" />
                  Personality & Behavior
                </CardTitle>
                <CardDescription>Define how your AI agent communicates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="agentName">Agent Name</Label>
                  <Input
                    id="agentName"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="personality">Personality Type</Label>
                  <Select
                    value={formData.personality}
                    onValueChange={(value) => handleInputChange("personality", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="friendly">Friendly & Casual</SelectItem>
                      <SelectItem value="professional">Professional & Formal</SelectItem>
                      <SelectItem value="helpful">Helpful & Supportive</SelectItem>
                      <SelectItem value="enthusiastic">Enthusiastic & Energetic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Primary Language</Label>
                  <Select value={formData.language} onValueChange={(value) => handleInputChange("language", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructions">Custom Instructions</Label>
                  <Textarea
                    id="instructions"
                    placeholder="Additional instructions for how the AI should behave..."
                    className="min-h-[100px]"
                    value={formData.customInstructions}
                    onChange={(e) => handleInputChange("customInstructions", e.target.value)}
                  />
                </div>

                <div className="space-y-4">
                  <Label>Capabilities</Label>
                  {availableCapabilities.map((capability) => (
                    <div key={capability} className="flex items-center justify-between">
                      <span className="text-sm">{capability}</span>
                      <Switch
                        checked={formData.capabilities.includes(capability)}
                        onCheckedChange={(checked) => handleCapabilityToggle(capability, checked)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Voice & Tone Settings */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Volume2 className="mr-2 h-5 w-5" />
                  Voice & Tone Settings
                </CardTitle>
                <CardDescription>Configure how your agent sounds and responds</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Response Length</Label>
                  <Select
                    value={formData.responseLength}
                    onValueChange={(value) => handleInputChange("responseLength", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short & Concise</SelectItem>
                      <SelectItem value="medium">Medium Length</SelectItem>
                      <SelectItem value="long">Detailed & Thorough</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Formality Level</Label>
                  <Select
                    value={formData.formalityLevel}
                    onValueChange={(value) => handleInputChange("formalityLevel", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="casual">Very Casual</SelectItem>
                      <SelectItem value="balanced">Balanced</SelectItem>
                      <SelectItem value="formal">Very Formal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>AI Model</Label>
                  <Select value={formData.model} onValueChange={(value) => handleInputChange("model", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4o-mini">GPT-4o Mini (Fast)</SelectItem>
                      <SelectItem value="gpt-4o">GPT-4o (Balanced)</SelectItem>
                      <SelectItem value="gpt-4">GPT-4 (Advanced)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Creativity Level (Temperature: {formData.temperature})</Label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={formData.temperature}
                    onChange={(e) => handleInputChange("temperature", Number.parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Conservative</span>
                    <span>Creative</span>
                  </div>
                </div>

                {/* Response Length Info - Fixed at 300 tokens */}
                <Alert className="border-blue-200 bg-blue-50">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <p className="font-medium">Response Length</p>
                    <p className="text-sm mt-1">
                      All responses are optimized to fit within 300 tokens for consistent performance and speed.
                    </p>
                  </AlertDescription>
                </Alert>

                {/* Test Configuration */}
                <div className="space-y-4 pt-4 border-t">
                  <Label>Test Configuration</Label>
                  <div className="space-y-2">
                    <Input
                      placeholder="Enter test message..."
                      value={testMessage}
                      onChange={(e) => setTestMessage(e.target.value)}
                    />
                    <Button onClick={handleTest} disabled={isTesting} className="w-full">
                      {isTesting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Testing...
                        </>
                      ) : (
                        "Test Configuration"
                      )}
                    </Button>
                  </div>
                  {testResult && (
                    <div className="p-3 bg-gray-50 rounded-md">
                      <p className="text-sm">{testResult}</p>
                    </div>
                  )}
                </div>

                <Alert className="border-blue-200 bg-blue-50">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <p className="font-medium">Configuration Preview</p>
                    <p className="text-sm mt-1">
                      {formData.personality} personality, {formData.responseLength} responses, {formData.formalityLevel}{" "}
                      tone using {formData.model}
                    </p>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ENHANCED TEMPLATES TAB */}
        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <MessageSquare className="mr-2 h-5 w-5" />
                Response Templates
              </CardTitle>
              <CardDescription>
                Customize how your AI responds to common scenarios. These templates will be used automatically in
                appropriate situations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="greeting">Greeting Message</Label>
                <Textarea
                  id="greeting"
                  value={templates.greeting}
                  onChange={(e) => handleTemplateChange("greeting", e.target.value)}
                  className="min-h-[80px]"
                  placeholder="Enter the message shown when a conversation starts..."
                />
                <p className="text-xs text-gray-500">
                  This message is shown when a conversation starts. Keep it welcoming and helpful.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="escalation">Escalation Message</Label>
                <Textarea
                  id="escalation"
                  value={templates.escalation}
                  onChange={(e) => handleTemplateChange("escalation", e.target.value)}
                  className="min-h-[80px]"
                  placeholder="Enter the message used when transferring to a human agent..."
                />
                <p className="text-xs text-gray-500">
                  Used when the AI needs to transfer the conversation to a human agent.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="closing">Closing Message</Label>
                <Textarea
                  id="closing"
                  value={templates.closing}
                  onChange={(e) => handleTemplateChange("closing", e.target.value)}
                  className="min-h-[80px]"
                  placeholder="Enter the message shown at the end of conversations..."
                />
                <p className="text-xs text-gray-500">
                  Shown at the end of conversations. Make it friendly and leave the door open for future help.
                </p>
              </div>

              {/* Template Preview */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-sm font-medium">Template Preview</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <p className="text-sm font-medium text-blue-800">Greeting</p>
                    <p className="text-sm text-blue-700 mt-1">{templates.greeting}</p>
                  </div>

                  <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                    <p className="text-sm font-medium text-yellow-800">Escalation</p>
                    <p className="text-sm text-yellow-700 mt-1">{templates.escalation}</p>
                  </div>

                  <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                    <p className="text-sm font-medium text-green-800">Closing</p>
                    <p className="text-sm text-green-700 mt-1">{templates.closing}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ANALYTICS TAB */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Status Card */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Status</span>
                </div>
                <p className="text-2xl font-bold mt-2">
                  {statusLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : agentStatus?.agentStatus || "Unknown"}
                </p>
                <p className="text-xs text-gray-500 mt-1">{agentStatus?.activeSessions || 0} active sessions</p>
              </CardContent>
            </Card>

            {/* Conversations Card */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Conversations</span>
                </div>
                <p className="text-2xl font-bold mt-2">
                  {analyticsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : analytics?.totalConversations || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">Total conversations</p>
              </CardContent>
            </Card>

            {/* Response Time Card */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">Avg Response</span>
                </div>
                <p className="text-2xl font-bold mt-2">
                  {analyticsLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    `${analytics?.averageResponseTime || 0}s`
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-1">Average response time</p>
              </CardContent>
            </Card>

            {/* Satisfaction Card */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">Satisfaction</span>
                </div>
                <p className="text-2xl font-bold mt-2">
                  {analyticsLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    `${analytics?.customerSatisfaction || 0}%`
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-1">Customer satisfaction</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analytics */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Performance Metrics
              </CardTitle>
              <CardDescription>Detailed analytics for your AI agent</CardDescription>
            </CardHeader>
            <CardContent>
              {analyticsLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                  <p className="mt-2 text-gray-600">Loading analytics...</p>
                </div>
              ) : analytics ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{analytics.resolutionRate}%</p>
                      <p className="text-sm text-gray-600">Resolution Rate</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{analytics.escalationRate}%</p>
                      <p className="text-sm text-gray-600">Escalation Rate</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">{analytics.knowledgeBaseUsage}%</p>
                      <p className="text-sm text-gray-600">Knowledge Base Usage</p>
                    </div>
                  </div>

                  {analytics.topQuestions && analytics.topQuestions.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3">Top Questions</h4>
                      <div className="space-y-2">
                        {analytics.topQuestions.slice(0, 5).map((item, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span className="text-sm">{item.question}</span>
                            <Badge variant="outline">{item.count}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <h3 className="font-medium text-gray-700 mb-1">No Analytics Data</h3>
                  <p className="text-sm text-gray-500">
                    Analytics data will appear once your agent starts handling conversations.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      {hasChanges && (
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isLoading} size="lg">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Configuration
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
