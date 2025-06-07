"use client"
import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useAgents } from "../../Hooks/useAgents"
import { useKnowledgeBase } from "../../Hooks/useKnowledgeBase"
import { useUser } from "../../Auth/Contexts/UserContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import CreateAgentModal from "./AgentModal"

// Import your new hooks with corrected paths
import { useAgentConfig } from "../../Hooks/useAgentsConfig"
import { useAgentSessions } from "../../Hooks/useAgentSessions"
import { useAgentAnalytics } from "../../Hooks/useAgentAnalytics"
import { useAgentStatus } from "../../Hooks/useAgentStatusHook"

import {
  Bot,
  Plus,
  Upload,
  FileText,
  Link,
  Trash2,
  Edit3,
  Brain,
  MessageSquare,
  Globe,
  Eye,
  Loader2,
  BookOpen,
  Check,
  AlertCircle,
  BarChart3,
  Save,
  Lightbulb,
  Volume2,
  Sparkles,
  Activity,
  Clock,
  TrendingUp,
} from "lucide-react"

export default function UpdatedEnhancedAIAgentsPage() {
  const { isLoading: userLoading } = useUser()
  const { agents, fetchAgents, isLoading: agentsLoading, error: agentsError } = useAgents()
  const {
    knowledgeItems,
    fetchKnowledgeItems,
    uploadDocument,
    addUrl,
    addText,
    deleteKnowledgeItem,
    isLoading: knowledgeLoading,
    isUploading,
    uploadProgress,
    error: knowledgeError,
    success: knowledgeSuccess,
    clearMessages,
  } = useKnowledgeBase()

  // Use all your new hooks
  const { updateAgentConfig, isLoading, error, success, clearMessages: clearConfigMessages } = useAgentConfig()
  const { sessions, getAgentSessions, updateSessionStatus, isLoading: sessionsLoading } = useAgentSessions()
  const { analytics, getAgentAnalytics, isLoading: analyticsLoading } = useAgentAnalytics()
  const { agentStatus, getAgentStatus, isLoading: statusLoading } = useAgentStatus()

  const [selectedAgent, setSelectedAgent] = useState<string>("")
  const [activeTab, setActiveTab] = useState("knowledge")
  const [showUrlDialog, setShowUrlDialog] = useState(false)
  const [showTextDialog, setShowTextDialog] = useState(false)
  const [showCreateAgentModal, setShowCreateAgentModal] = useState(false)
  const [urlInput, setUrlInput] = useState("")
  const [textTitle, setTextTitle] = useState("")
  const [textContent, setTextContent] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const [urlError, setUrlError] = useState("")
  const [isValidatingUrl, setIsValidatingUrl] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)

  // Form state for personality tab (removed maxTokens)
  const [formData, setFormData] = useState({
    name: "",
    personality: "friendly",
    language: "en",
    responseLength: "medium",
    formalityLevel: "balanced",
    customInstructions: "",
    temperature: 0.7,
    model: "gpt-4o-mini",
    capabilities: [],
  })

  // Template state
  const [templates, setTemplates] = useState({
    greeting: "Hello! I'm here to help you today. How can I assist you?",
    escalation: "I'd like to connect you with a human agent who can better assist you with this request.",
    closing: "Thank you for contacting us today! Is there anything else I can help you with?",
  })

  const [hasChanges, setHasChanges] = useState(false)

  // Enhanced file validation
  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    console.log("🔍 Validating file:", {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified,
    })

    // Check file size (50MB limit)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `File size (${(file.size / 1024 / 1024).toFixed(1)}MB) exceeds 50MB limit`,
      }
    }

    // Check file type
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "text/plain",
    ]

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `File type ${file.type} is not supported. Please use PDF, DOC, DOCX, or TXT files.`,
      }
    }

    // Additional PDF validation
    if (file.type === "application/pdf") {
      if (file.size === 0) {
        return {
          isValid: false,
          error: "PDF file appears to be empty",
        }
      }
    }

    return { isValid: true }
  }

  // Enhanced file upload handler with better error handling
  const handleFileUpload = async (files: FileList) => {
    console.log("📁 Starting file upload process...")
    console.log("Files to upload:", files.length)

    if (!files || files.length === 0) {
      console.warn("No files provided")
      return
    }

    if (!selectedAgent) {
      console.error("No agent selected")
      alert("Please select an agent first")
      return
    }

    // Clear any previous errors
    clearMessages()

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      console.log(`\n📄 Processing file ${i + 1}/${files.length}: ${file.name}`)

      // Validate file before upload
      const validation = validateFile(file)
      if (!validation.isValid) {
        console.error("❌ File validation failed:", validation.error)
        alert(`File validation failed: ${validation.error}`)
        continue
      }

      console.log("✅ File validation passed")

      try {
        console.log("🚀 Starting upload for:", file.name)
        console.log("Upload details:", {
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          agentId: selectedAgent,
        })

        const result = await uploadDocument(file, {
          title: file.name,
          category: "General",
          agentId: selectedAgent,
        })

        if (result) {
          console.log("✅ Upload successful for:", file.name)
        } else {
          console.error("❌ Upload failed for:", file.name)
        }
      } catch (error) {
        console.error("❌ Upload error for", file.name, ":", error)
        // Don't break the loop, continue with next file
      }
    }

    console.log("📁 File upload process completed")
  }

  // Load agents on component mount
  useEffect(() => {
    if (!userLoading) {
      console.log("User context loaded, fetching agents...")
      fetchAgents()
    }
  }, [fetchAgents, userLoading])

  // Auto-select first agent
  useEffect(() => {
    if (agents.length > 0 && !selectedAgent) {
      setSelectedAgent(agents[0].id)
    }
  }, [agents, selectedAgent])

  // Load knowledge items and agent data when agent changes
  useEffect(() => {
    if (selectedAgent && !userLoading) {
      console.log("Fetching data for agent:", selectedAgent)
      fetchKnowledgeItems(selectedAgent)
      getAgentSessions(selectedAgent)
      getAgentAnalytics(selectedAgent)
      getAgentStatus(selectedAgent)

      // Update form data with current agent (removed maxTokens)
      const currentAgent = agents.find((agent) => agent.id === selectedAgent)
      if (currentAgent) {
        setFormData({
          name: currentAgent.name || "",
          personality: currentAgent.personality || "friendly",
          language: currentAgent.language || "en",
          responseLength: currentAgent.settings?.responseLength || "medium",
          formalityLevel: currentAgent.settings?.formalityLevel || "balanced",
          customInstructions: currentAgent.settings?.customInstructions || "",
          temperature: currentAgent.settings?.temperature || 0.7,
          model: currentAgent.settings?.model || "gpt-4o-mini",
          capabilities: currentAgent.capabilities || [],
        })

        setTemplates({
          greeting:
            currentAgent.response_templates?.greeting || "Hello! I'm here to help you today. How can I assist you?",
          escalation:
            currentAgent.response_templates?.escalation ||
            "I'd like to connect you with a human agent who can better assist you with this request.",
          closing:
            currentAgent.response_templates?.closing ||
            "Thank you for contacting us today! Is there anything else I can help you with?",
        })
      }
    }
  }, [selectedAgent, fetchKnowledgeItems, userLoading, agents, getAgentSessions, getAgentAnalytics, getAgentStatus])

  // Track changes (removed maxTokens from comparison)
  useEffect(() => {
    const currentAgent = agents.find((agent) => agent.id === selectedAgent)
    if (!currentAgent) return

    const hasFormChanges = Object.keys(formData).some((key) => {
      if (key === "capabilities") {
        return JSON.stringify(formData[key]) !== JSON.stringify(currentAgent[key] || [])
      }
      if (
        key === "customInstructions" ||
        key === "responseLength" ||
        key === "formalityLevel" ||
        key === "temperature" ||
        key === "model"
      ) {
        return formData[key] !== (currentAgent.settings?.[key] || "")
      }
      return formData[key] !== (currentAgent[key] || "")
    })

    const hasTemplateChanges = Object.keys(templates).some(
      (key) => templates[key] !== (currentAgent.response_templates?.[key] || ""),
    )

    setHasChanges(hasFormChanges || hasTemplateChanges)
  }, [formData, templates, agents, selectedAgent])

  const currentAgent = agents.find((agent) => agent.id === selectedAgent)

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleCreateAgent = (createdAgent: any) => {
    setSelectedAgent(createdAgent.id)
    setActiveTab("knowledge")
    fetchAgents()
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    console.log("📂 Files dropped")
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files)
    }
  }

  const handleUrlSubmit = async () => {
    if (!urlInput.trim() || !selectedAgent) return

    setUrlError("")
    setIsValidatingUrl(true)

    if (!validateUrl(urlInput)) {
      setUrlError("Please enter a valid URL")
      setIsValidatingUrl(false)
      return
    }

    await addUrl(urlInput, {
      category: "Web Content",
      agentId: selectedAgent,
    })

    setUrlInput("")
    setShowUrlDialog(false)
    setIsValidatingUrl(false)
  }

  const handleTextSubmit = async () => {
    if (!textTitle.trim() || !textContent.trim() || !selectedAgent) return

    await addText(textTitle, textContent, {
      category: "Custom",
      agentId: selectedAgent,
    })

    setTextTitle("")
    setTextContent("")
    setShowTextDialog(false)
  }

  const handleDeleteKnowledgeItem = async (id: string) => {
    const success = await deleteKnowledgeItem(id)
    if (success) {
      setShowDeleteDialog(false)
      setItemToDelete(null)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    clearConfigMessages()
  }

  const handleTemplateChange = (template: string, value: string) => {
    setTemplates((prev) => ({ ...prev, [template]: value }))
    clearConfigMessages()
  }

  const handleCapabilityToggle = (capability: string, enabled: boolean) => {
    setFormData((prev) => ({
      ...prev,
      capabilities: enabled ? [...prev.capabilities, capability] : prev.capabilities.filter((c) => c !== capability),
    }))
    clearConfigMessages()
  }

  const handleSave = async () => {
    const configToSave = {
      name: formData.name,
      personality: formData.personality,
      language: formData.language,
      capabilities: formData.capabilities,
      response_templates: templates,
      settings: {
        responseLength: formData.responseLength,
        formalityLevel: formData.formalityLevel,
        customInstructions: formData.customInstructions,
        temperature: formData.temperature,
        model: formData.model,
        // maxTokens is now fixed at 300 and not configurable
      },
    }

    const success = await updateAgentConfig(currentAgent.id, configToSave)
    if (success) {
      setHasChanges(false)
      fetchAgents()
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "training":
        return "bg-yellow-100 text-yellow-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getItemStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "pending":
        return "bg-blue-100 text-blue-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown size"
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  const availableCapabilities = [
    "Customer Support",
    "Product Information",
    "Order Management",
    "Technical Support",
    "Billing Inquiries",
    "General Questions",
  ]

  if (userLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-16">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">Loading user data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">AI Agent Training</h1>
          <p className="text-gray-500">Configure and train your AI assistants for customer service</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => (window.location.href = "/conversations")}>
            <MessageSquare className="mr-2 h-4 w-4" />
            View Conversations
          </Button>
          <Button onClick={() => setShowCreateAgentModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create New Agent
          </Button>
        </div>
      </div>

      {/* Enhanced Error Messages */}
      {agentsError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{agentsError}</AlertDescription>
        </Alert>
      )}

      {knowledgeError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div>
              <p className="font-medium">Upload Error:</p>
              <p>{knowledgeError}</p>
              <p className="text-xs mt-1">
                If this is a PDF extraction error, please try a different PDF or contact support.
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {knowledgeSuccess && (
        <Alert className="bg-green-50 border-green-200 mb-6">
          <Check className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{knowledgeSuccess}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-200 mb-6">
          <Check className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Agents List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Your AI Agents</CardTitle>
              <CardDescription>Select an agent to configure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {agentsLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                  <p className="mt-2 text-gray-600">Loading agents...</p>
                </div>
              ) : agents.length > 0 ? (
                agents.map((agent) => (
                  <div
                    key={agent.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedAgent === agent.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedAgent(agent.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{agent.name}</h4>
                        <p className="text-xs text-gray-500 truncate">{agent.description}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getStatusColor(agent.status)} variant="secondary">
                            {agent.status}
                          </Badge>
                          <span className="text-xs text-gray-500">{agent.use_case}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 px-4">
                  <Bot className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <h3 className="font-medium text-gray-700 mb-1">No AI Agents</h3>
                  <p className="text-sm text-gray-500 mb-4">You haven't created any AI agents yet</p>
                  <Button size="sm" onClick={() => setShowCreateAgentModal(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Agent
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Agent Configuration */}
        <div className="lg:col-span-3">
          {currentAgent ? (
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{currentAgent.name}</CardTitle>
                    <CardDescription>Manage knowledge base and agent configuration</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="knowledge">
                      <Brain className="mr-2 h-4 w-4" />
                      Knowledge Base
                    </TabsTrigger>
                    <TabsTrigger value="personality">
                      <Lightbulb className="mr-2 h-4 w-4" />
                      Personality
                    </TabsTrigger>
                    <TabsTrigger value="templates">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Templates
                    </TabsTrigger>
                    <TabsTrigger value="analytics">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Analytics
                    </TabsTrigger>
                  </TabsList>

                  {/* Knowledge Base Tab */}
                  <TabsContent value="knowledge" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Enhanced Upload Section */}
                      <div className="space-y-4">
                        <h3 className="font-semibold">Add Knowledge Sources</h3>

                        {/* Enhanced Document Upload */}
                        <div
                          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                            dragActive ? "border-blue-500 bg-blue-50" : "border-blue-300 hover:bg-blue-50"
                          }`}
                          onDragEnter={handleDrag}
                          onDragLeave={handleDrag}
                          onDragOver={handleDrag}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload
                            className={`h-8 w-8 mx-auto mb-3 ${dragActive ? "text-blue-600" : "text-gray-500"}`}
                          />
                          <p className="font-medium mb-2">{dragActive ? "Drop files here" : "Upload Documents"}</p>
                          <p className="text-sm text-gray-600 mb-3">Drag & drop files or click to browse</p>
                          <p className="text-xs text-gray-500">PDF, DOC, TXT files (max 50MB)</p>
                          <p className="text-xs text-blue-600 mt-1">Enhanced PDF processing with fallback extraction</p>
                          <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            multiple
                            accept=".pdf,.doc,.docx,.txt"
                            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                          />
                        </div>

                        <div className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center">
                          <Globe className="h-8 w-8 mx-auto mb-3 text-gray-500" />
                          <p className="font-medium mb-2">Add Website URLs</p>
                          <p className="text-sm text-gray-600 mb-3">FAQ pages, documentation, product pages</p>
                          <Button variant="outline" size="sm" onClick={() => setShowUrlDialog(true)}>
                            <Link className="mr-2 h-4 w-4" />
                            Add URL
                          </Button>
                        </div>

                        <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center">
                          <MessageSquare className="h-8 w-8 mx-auto mb-3 text-gray-500" />
                          <p className="font-medium mb-2">Add Text Content</p>
                          <p className="text-sm text-gray-600 mb-3">Company info, policies, custom instructions</p>
                          <Button variant="outline" size="sm" onClick={() => setShowTextDialog(true)}>
                            <Edit3 className="mr-2 h-4 w-4" />
                            Add Text
                          </Button>
                        </div>

                        {/* Enhanced Upload Progress */}
                        {isUploading && (
                          <Alert className="border-blue-200 bg-blue-50">
                            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                            <AlertDescription className="text-blue-800">
                              <div className="space-y-2">
                                <p className="font-medium">Processing document...</p>
                                <Progress value={uploadProgress} className="h-2" />
                                <p className="text-sm">Uploading and extracting text using enhanced PDF processing</p>
                              </div>
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>

                      {/* Knowledge Items List */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">Current Knowledge Base</h3>
                          <Badge variant="outline">{knowledgeItems.length} items</Badge>
                        </div>

                        {knowledgeLoading ? (
                          <div className="text-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                            <p className="mt-2 text-gray-600">Loading knowledge base...</p>
                          </div>
                        ) : knowledgeItems.length > 0 ? (
                          <div className="space-y-3 max-h-[500px] overflow-y-auto">
                            {knowledgeItems.map((item) => (
                              <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-start space-x-3">
                                    <div className="mt-1">
                                      {item.source_type === "document" && (
                                        <FileText className="h-5 w-5 text-gray-500" />
                                      )}
                                      {item.source_type === "url" && <Globe className="h-5 w-5 text-gray-500" />}
                                      {item.source_type === "text" && (
                                        <MessageSquare className="h-5 w-5 text-gray-500" />
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="font-medium text-sm">{item.title}</h4>
                                      {item.source_type === "document" && (
                                        <p className="text-xs text-gray-500">{formatFileSize(item.file_size)}</p>
                                      )}
                                      {item.source_type === "url" && (
                                        <p className="text-xs text-gray-500 truncate">{item.source_url}</p>
                                      )}
                                      {item.source_type === "text" && (
                                        <p className="text-xs text-gray-500 truncate">
                                          {item.content?.substring(0, 100)}...
                                        </p>
                                      )}
                                      <div className="flex items-center space-x-2 mt-1">
                                        <Badge
                                          className={getItemStatusColor(item.processing_status)}
                                          variant="secondary"
                                        >
                                          {item.processing_status}
                                        </Badge>
                                        <span className="text-xs text-gray-500">{formatDate(item.created_at)}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Button variant="ghost" size="sm">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        setItemToDelete(item.id)
                                        setShowDeleteDialog(true)
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                            <BookOpen className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                            <h3 className="font-medium text-gray-700 mb-1">No Knowledge Sources</h3>
                            <p className="text-sm text-gray-500 mb-4">
                              Your AI agent needs information to learn from. Add documents, URLs, or text to get
                              started.
                            </p>
                            <div className="flex justify-center space-x-2">
                              <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
                                <FileText className="mr-2 h-4 w-4" />
                                Add Document
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setShowUrlDialog(true)}>
                                <Link className="mr-2 h-4 w-4" />
                                Add URL
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  {/* Personality Tab */}
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
                            <Select
                              value={formData.language}
                              onValueChange={(value) => handleInputChange("language", value)}
                            >
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

                       

                          <Alert className="border-blue-200 bg-blue-50">
                            <Sparkles className="h-4 w-4 text-blue-600" />
                            <AlertDescription className="text-blue-800">
                              <p className="font-medium">Configuration Preview</p>
                              <p className="text-sm mt-1">
                                {formData.personality} personality, {formData.responseLength} responses,{" "}
                                {formData.formalityLevel} tone using {formData.model}
                              </p>
                            </AlertDescription>
                          </Alert>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Templates Tab */}
                  <TabsContent value="templates" className="space-y-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <MessageSquare className="mr-2 h-5 w-5" />
                          Response Templates
                        </CardTitle>
                        <CardDescription>
                          Customize how your AI responds to common scenarios. These templates will be used automatically
                          in appropriate situations.
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

                  {/* Analytics Tab */}
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
                            {statusLoading ? (
                              <Loader2 className="h-6 w-6 animate-spin" />
                            ) : (
                              agentStatus?.agentStatus || "Unknown"
                            )}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {agentStatus?.activeSessions || 0} active sessions
                          </p>
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
                            {analyticsLoading ? (
                              <Loader2 className="h-6 w-6 animate-spin" />
                            ) : (
                              analytics?.totalConversations || 0
                            )}
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
                                    <div
                                      key={index}
                                      className="flex justify-between items-center p-2 bg-gray-50 rounded"
                                    >
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
                  <div className="flex justify-end mt-6">
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
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-16 px-4">
              <Bot className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No Agent Selected</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Select an AI agent from the sidebar or create a new one to configure its settings.
              </p>
              <Button onClick={() => setShowCreateAgentModal(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create New Agent
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Create Agent Modal */}
      <CreateAgentModal
        open={showCreateAgentModal}
        onOpenChange={setShowCreateAgentModal}
        onCreateAgent={handleCreateAgent}
      />

      {/* URL Dialog */}
      <Dialog open={showUrlDialog} onOpenChange={setShowUrlDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Website URL</DialogTitle>
            <DialogDescription>
              Add a website URL to extract content from. This could be FAQ pages, documentation, or product pages.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">Website URL</Label>
              <Input
                id="url"
                placeholder="https://example.com/faq"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
              />
              {urlError && <p className="text-sm text-red-600">{urlError}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUrlDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUrlSubmit} disabled={isValidatingUrl}>
              {isValidatingUrl ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add URL"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Text Dialog */}
      <Dialog open={showTextDialog} onOpenChange={setShowTextDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Text Content</DialogTitle>
            <DialogDescription>
              Add custom text content like company information, policies, or specific instructions for your AI agent.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="textTitle">Title</Label>
              <Input
                id="textTitle"
                placeholder="e.g., Company Policies"
                value={textTitle}
                onChange={(e) => setTextTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="textContent">Content</Label>
              <Textarea
                id="textContent"
                placeholder="Enter your text content here..."
                className="min-h-[200px]"
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTextDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleTextSubmit}>Add Text</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Knowledge Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this knowledge item? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => itemToDelete && handleDeleteKnowledgeItem(itemToDelete)}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
