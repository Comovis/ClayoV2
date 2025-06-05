"use client"

import { DialogFooter } from "@/components/ui/dialog"
import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useAgents } from "../../Hooks/useAgents"
import { useKnowledgeBase } from "../../Hooks/useKnowledgeBase"
import { useUser } from "../../Auth/Contexts/UserContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import CreateAgentModal from "./AgentModal"
import {
  Bot,
  Plus,
  Upload,
  FileText,
  Link,
  Trash2,
  Edit3,
  Save,
  Brain,
  MessageSquare,
  Sparkles,
  Globe,
  Clock,
  Target,
  TrendingUp,
  Eye,
  Loader2,
  BookOpen,
  Lightbulb,
  Volume2,
  Check,
  AlertCircle,
} from "lucide-react"

export default function AIAgentsPage() {
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

  // Fetch agents on component mount, but wait for user context to load
  useEffect(() => {
    if (!userLoading) {
      console.log("User context loaded, fetching agents...")
      fetchAgents()
    }
  }, [fetchAgents, userLoading])

  // Set first agent as selected when agents load
  useEffect(() => {
    if (agents.length > 0 && !selectedAgent) {
      setSelectedAgent(agents[0].id)
    }
  }, [agents, selectedAgent])

  // Fetch knowledge items when selected agent changes, but wait for user context
  useEffect(() => {
    if (selectedAgent && !userLoading) {
      console.log("Fetching knowledge items for agent:", selectedAgent)
      fetchKnowledgeItems(selectedAgent)
    }
  }, [selectedAgent, fetchKnowledgeItems, userLoading])

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
    // Refresh agents list
    fetchAgents()
  }

  const handleFileUpload = async (files: FileList) => {
    if (files && files.length > 0 && selectedAgent) {
      for (const file of Array.from(files)) {
        await uploadDocument(file, {
          title: file.name,
          category: "General",
          agentId: selectedAgent,
        })
      }
    }
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

  // Show loading state while user context is loading
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
        <Button onClick={() => setShowCreateAgentModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Agent
        </Button>
      </div>

      {/* Error Messages */}
      {agentsError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{agentsError}</AlertDescription>
        </Alert>
      )}

      {knowledgeError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{knowledgeError}</AlertDescription>
        </Alert>
      )}

      {knowledgeSuccess && (
        <Alert className="bg-green-50 border-green-200 mb-6">
          <Check className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{knowledgeSuccess}</AlertDescription>
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
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
                <TabsTrigger value="personality">Personality</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              {/* Knowledge Base Tab */}
              <TabsContent value="knowledge" className="space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Brain className="mr-2 h-5 w-5" />
                      AI Training & Knowledge Base
                    </CardTitle>
                    <CardDescription>Train your AI with your business information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Upload Section */}
                      <div className="space-y-4">
                        <h3 className="font-semibold">Add Knowledge Sources</h3>

                        {/* Document Upload */}
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
                          <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            multiple
                            accept=".pdf,.doc,.docx,.txt"
                            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                          />
                        </div>

                        {/* URL Input */}
                        <div className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center">
                          <Globe className="h-8 w-8 mx-auto mb-3 text-gray-500" />
                          <p className="font-medium mb-2">Add Website URLs</p>
                          <p className="text-sm text-gray-600 mb-3">FAQ pages, documentation, product pages</p>
                          <Button variant="outline" size="sm" onClick={() => setShowUrlDialog(true)}>
                            <Link className="mr-2 h-4 w-4" />
                            Add URL
                          </Button>
                        </div>

                        {/* Text Input */}
                        <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center">
                          <MessageSquare className="h-8 w-8 mx-auto mb-3 text-gray-500" />
                          <p className="font-medium mb-2">Add Text Content</p>
                          <p className="text-sm text-gray-600 mb-3">Company info, policies, custom instructions</p>
                          <Button variant="outline" size="sm" onClick={() => setShowTextDialog(true)}>
                            <Edit3 className="mr-2 h-4 w-4" />
                            Add Text
                          </Button>
                        </div>

                        {/* Upload Progress */}
                        {isUploading && (
                          <Alert className="border-blue-200 bg-blue-50">
                            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                            <AlertDescription className="text-blue-800">
                              <div className="space-y-2">
                                <p className="font-medium">Processing document...</p>
                                <Progress value={uploadProgress} className="h-2" />
                                <p className="text-sm">Uploading and indexing your content</p>
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
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Other tabs remain the same but with real agent data */}
              <TabsContent value="personality" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                        <Input id="agentName" defaultValue={currentAgent.name} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="personality">Personality Type</Label>
                        <Select defaultValue={currentAgent.personality}>
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
                        <Select defaultValue={currentAgent.language}>
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
                        />
                      </div>

                      <div className="space-y-4">
                        <Label>Capabilities</Label>
                        {currentAgent.capabilities.map((capability) => (
                          <div key={capability} className="flex items-center justify-between">
                            <span className="text-sm">{capability}</span>
                            <Switch defaultChecked />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <Volume2 className="mr-2 h-5 w-5" />
                        Voice & Tone Settings
                      </CardTitle>
                      <CardDescription>Configure how your agent sounds</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label>Response Length</Label>
                        <Select defaultValue="medium">
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
                        <Select defaultValue="balanced">
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

                      <Alert className="border-blue-200 bg-blue-50">
                        <Sparkles className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-800">
                          <p className="font-medium">AI Personality Preview</p>
                          <p className="text-sm mt-1">{currentAgent.response_templates.greeting}</p>
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="templates" className="space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <MessageSquare className="mr-2 h-5 w-5" />
                      Response Templates
                    </CardTitle>
                    <CardDescription>Customize how your AI responds to common scenarios</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="greeting">Greeting Message</Label>
                      <Textarea
                        id="greeting"
                        defaultValue={currentAgent.response_templates.greeting}
                        className="min-h-[80px]"
                      />
                      <p className="text-xs text-gray-500">This message is shown when a conversation starts</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="escalation">Escalation Message</Label>
                      <Textarea
                        id="escalation"
                        defaultValue={currentAgent.response_templates.escalation}
                        className="min-h-[80px]"
                      />
                      <p className="text-xs text-gray-500">Used when transferring to a human agent</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="closing">Closing Message</Label>
                      <Textarea
                        id="closing"
                        defaultValue={currentAgent.response_templates.closing}
                        className="min-h-[80px]"
                      />
                      <p className="text-xs text-gray-500">Shown at the end of conversations</p>
                    </div>

                    <Button className="w-full">
                      <Save className="mr-2 h-4 w-4" />
                      Save Templates
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Status</p>
                          <p className="text-2xl font-bold capitalize">{currentAgent.status}</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-gray-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Use Case</p>
                          <p className="text-lg font-bold capitalize">{currentAgent.use_case.replace("-", " ")}</p>
                        </div>
                        <Target className="h-8 w-8 text-gray-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Language</p>
                          <p className="text-2xl font-bold uppercase">{currentAgent.language}</p>
                        </div>
                        <Globe className="h-8 w-8 text-gray-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Created</p>
                          <p className="text-lg font-bold">{formatDate(currentAgent.created_at)}</p>
                        </div>
                        <Clock className="h-8 w-8 text-gray-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Agent Capabilities</CardTitle>
                    <CardDescription>What this agent can do</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {currentAgent.capabilities.map((capability, index) => (
                        <Badge key={index} variant="secondary">
                          {capability}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
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

      {/* Modals */}
      <CreateAgentModal
        open={showCreateAgentModal}
        onOpenChange={setShowCreateAgentModal}
        onCreateAgent={handleCreateAgent}
      />

      {/* URL Dialog */}
      <Dialog
        open={showUrlDialog}
        onOpenChange={(open) => {
          setShowUrlDialog(open)
          if (!open) clearMessages()
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Globe className="mr-2 h-5 w-5 text-gray-500" />
              Add Website URL
            </DialogTitle>
            <DialogDescription>Enter a URL to add web content to your AI's knowledge base</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="url">Website URL</Label>
              <Input
                id="url"
                placeholder="https://example.com/faq"
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value)
                  setUrlError("")
                }}
                className={urlError ? "border-red-500" : ""}
              />
              {urlError && (
                <div className="flex items-center space-x-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{urlError}</span>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUrlDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUrlSubmit} disabled={!urlInput.trim() || isValidatingUrl}>
              {isValidatingUrl ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Add URL
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Text Dialog */}
      <Dialog
        open={showTextDialog}
        onOpenChange={(open) => {
          setShowTextDialog(open)
          if (!open) clearMessages()
        }}
      >
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5 text-gray-500" />
              Add Text Content
            </DialogTitle>
            <DialogDescription>Add custom text content to your AI's knowledge base</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="textTitle">Title</Label>
              <Input
                id="textTitle"
                placeholder="e.g., Company Policies, Product Information"
                value={textTitle}
                onChange={(e) => setTextTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="textContent">Content</Label>
              <Textarea
                id="textContent"
                placeholder="Enter the text content you want to add to the knowledge base..."
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTextDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleTextSubmit} disabled={!textTitle.trim() || !textContent.trim()}>
              <Check className="mr-2 h-4 w-4" />
              Add Content
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Trash2 className="mr-2 h-5 w-5 text-gray-500" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>Are you sure you want to delete this item from your knowledge base?</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-700">
              This action cannot be undone. This will permanently remove the item from your AI agent's knowledge base.
            </p>
            {itemToDelete && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <p className="text-sm font-medium">{knowledgeItems.find((item) => item.id === itemToDelete)?.title}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false)
                setItemToDelete(null)
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => itemToDelete && handleDeleteKnowledgeItem(itemToDelete)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
