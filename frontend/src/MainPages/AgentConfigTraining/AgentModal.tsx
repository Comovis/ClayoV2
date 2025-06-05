"use client"
import { useState } from "react"
import { useAgents } from "../../Hooks/useAgents"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Wand2, Users, Target, Brain, Sparkles, Loader2, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react"

type NewAgent = {
  name: string
  description: string
  personality: string
  language: string
  useCase: string
}

interface CreateAgentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateAgent?: (agent: any) => void
}

export default function CreateAgentModal({ open, onOpenChange, onCreateAgent }: CreateAgentModalProps) {
  const { createAgent, isLoading, error, success, clearMessages } = useAgents()
  const [currentStep, setCurrentStep] = useState(1)
  const [newAgent, setNewAgent] = useState<NewAgent>({
    name: "",
    description: "",
    personality: "friendly",
    language: "en",
    useCase: "customer-support",
  })

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const handleCreateAgent = async () => {
    if (!newAgent.name.trim() || !newAgent.description.trim()) return

    const agent = await createAgent({
      name: newAgent.name,
      description: newAgent.description,
      personality: newAgent.personality,
      language: newAgent.language,
      useCase: newAgent.useCase,
    })

    if (agent) {
      // Call the parent callback if provided
      if (onCreateAgent) {
        onCreateAgent(agent)
      }

      // Reset form
      setNewAgent({
        name: "",
        description: "",
        personality: "friendly",
        language: "en",
        useCase: "customer-support",
      })
      setCurrentStep(1)
      onOpenChange(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setNewAgent({
        name: "",
        description: "",
        personality: "friendly",
        language: "en",
        useCase: "customer-support",
      })
      setCurrentStep(1)
      clearMessages()
      onOpenChange(false)
    }
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceedFromStep1 = newAgent.name.trim() && newAgent.description.trim()
  const canProceedFromStep2 = newAgent.useCase
  const canProceedFromStep3 = newAgent.personality && newAgent.language

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Basic Information"
      case 2:
        return "Choose Template"
      case 3:
        return "Personality & Language"
      case 4:
        return "Review & Create"
      default:
        return ""
    }
  }

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "Give your AI agent a name and describe its purpose"
      case 2:
        return "Select a template that matches your use case"
      case 3:
        return "Configure how your agent communicates"
      case 4:
        return "Review and create your AI assistant"
      default:
        return ""
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] w-[95vw] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Wand2 className="mr-2 h-6 w-6 text-blue-500" />
            Create New AI Agent
          </DialogTitle>
          <DialogDescription>Set up a new AI assistant in just a few steps</DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-gray-500">{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Error Message */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Success Message */}
        {success && (
          <Alert className="bg-green-50 border-green-200">
            <Sparkles className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {/* Step Content */}
        <div className="py-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{getStepTitle()}</h3>
            <p className="text-sm text-gray-600">{getStepDescription()}</p>
          </div>

          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newAgentName">Agent Name *</Label>
                <Input
                  id="newAgentName"
                  placeholder="e.g., Customer Support Assistant"
                  value={newAgent.name}
                  onChange={(e) => setNewAgent((prev) => ({ ...prev, name: e.target.value }))}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newAgentDescription">Description *</Label>
                <Textarea
                  id="newAgentDescription"
                  placeholder="Describe what this agent will help with..."
                  value={newAgent.description}
                  onChange={(e) => setNewAgent((prev) => ({ ...prev, description: e.target.value }))}
                  className="min-h-[100px] resize-none"
                />
                <p className="text-xs text-gray-500">Be specific about the agent's role and responsibilities</p>
              </div>
            </div>
          )}

          {/* Step 2: Template Selection */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid gap-3">
                <div
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    newAgent.useCase === "customer-support"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setNewAgent((prev) => ({ ...prev, useCase: "customer-support" }))}
                >
                  <div className="flex items-start space-x-3">
                    <Users className="h-6 w-6 text-blue-500 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-medium">Customer Support</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Handle inquiries, answer FAQs, and escalate complex issues
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          Answer FAQs
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          Collect Info
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          Escalate Issues
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    newAgent.useCase === "sales"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setNewAgent((prev) => ({ ...prev, useCase: "sales" }))}
                >
                  <div className="flex items-start space-x-3">
                    <Target className="h-6 w-6 text-green-500 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-medium">Sales Assistant</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Qualify leads, provide product info, and schedule demos
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          Qualify Leads
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          Product Info
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          Schedule Demos
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    newAgent.useCase === "technical-support"
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setNewAgent((prev) => ({ ...prev, useCase: "technical-support" }))}
                >
                  <div className="flex items-start space-x-3">
                    <Brain className="h-6 w-6 text-purple-500 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-medium">Technical Support</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Troubleshoot issues and provide technical documentation
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          Troubleshooting
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          API Docs
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          Integration
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Configuration */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newAgentPersonality">Personality Style</Label>
                <Select
                  value={newAgent.personality}
                  onValueChange={(value) => setNewAgent((prev) => ({ ...prev, personality: value }))}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="friendly">Friendly & Casual</SelectItem>
                    <SelectItem value="professional">Professional & Formal</SelectItem>
                    <SelectItem value="helpful">Helpful & Supportive</SelectItem>
                    <SelectItem value="enthusiastic">Enthusiastic & Energetic</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">This affects how your agent communicates with users</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newAgentLanguage">Primary Language</Label>
                <Select
                  value={newAgent.language}
                  onValueChange={(value) => setNewAgent((prev) => ({ ...prev, language: value }))}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">The main language your agent will use</p>
              </div>
            </div>
          )}

          {/* Step 4: Preview */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <Alert className="border-blue-200 bg-blue-50">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <div className="space-y-3">
                    <h4 className="font-medium">Ready to Create</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Name:</span>
                        <span className="font-medium">{newAgent.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span className="font-medium">
                          {newAgent.useCase.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Personality:</span>
                        <span className="font-medium">
                          {newAgent.personality.charAt(0).toUpperCase() + newAgent.personality.slice(1)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Language:</span>
                        <span className="font-medium">{newAgent.language.toUpperCase()}</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-blue-200">
                      <p className="text-sm">
                        <span className="font-medium">Description:</span> {newAgent.description}
                      </p>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>

              <div className="text-xs text-gray-500 text-center">
                After creation, you can add knowledge sources and customize response templates.
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            {currentStep > 1 && (
              <Button variant="outline" onClick={handlePrevious} disabled={isLoading}>
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back
              </Button>
            )}
          </div>

          <div>
            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !canProceedFromStep1) ||
                  (currentStep === 2 && !canProceedFromStep2) ||
                  (currentStep === 3 && !canProceedFromStep3)
                }
              >
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleCreateAgent}
                disabled={!newAgent.name.trim() || !newAgent.description.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Create Agent
                  </>
                )}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
