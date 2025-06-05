"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../SupabaseAuth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Bot,
  Building2,
  Users,
  MessageSquare,
  Mail,
  Phone,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
} from "lucide-react"

// API Base URL Configuration
const apiBaseUrl =
  import.meta.env.MODE === "development" ? import.meta.env.VITE_DEVELOPMENT_URL : import.meta.env.VITE_API_URL

const STEPS = [
  { id: "company", title: "Company Info", description: "Tell us about your business" },
  { id: "team", title: "Team Setup", description: "Configure your team structure" },
  { id: "channels", title: "Channels", description: "Connect your communication channels" },
  { id: "ai", title: "AI Configuration", description: "Set up your AI assistant" },
  { id: "complete", title: "Complete", description: "You're all set!" },
]

interface OnboardingData {
  companyName: string
  industry: string
  companySize: string
  website: string
  description: string
  teamSize: string
  departments: string[]
  workingHours: string
  timezone: string
  enabledChannels: string[]
  emailConfig: { enabled: boolean; address: string }
  chatConfig: { enabled: boolean; widget: boolean }
  phoneConfig: { enabled: boolean; number: string }
  aiPersonality: string
  responseStyle: string
  knowledgeAreas: string[]
  autoResponse: boolean
  escalationRules: boolean
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const [formData, setFormData] = useState<OnboardingData>({
    // Company info
    companyName: "",
    industry: "",
    companySize: "",
    website: "",
    description: "",

    // Team setup
    teamSize: "",
    departments: [],
    workingHours: "",
    timezone: "",

    // Channels
    enabledChannels: [],
    emailConfig: { enabled: false, address: "" },
    chatConfig: { enabled: false, widget: true },
    phoneConfig: { enabled: false, number: "" },

    // AI configuration
    aiPersonality: "",
    responseStyle: "",
    knowledgeAreas: [],
    autoResponse: true,
    escalationRules: true,
  })

  // Get auth token using Supabase session
  const getAuthToken = async () => {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !sessionData.session) {
      throw new Error("Authentication required. Please log in again.")
    }

    return sessionData.session.access_token
  }

  // Fetch existing onboarding data on component mount
  useEffect(() => {
    fetchOnboardingStatus()
  }, [])

  const fetchOnboardingStatus = async () => {
    try {
      setIsLoading(true)
      setError("")

      const token = await getAuthToken()

      console.log("Fetching onboarding status with token:", token ? "Token present" : "No token")

      const response = await fetch(`${apiBaseUrl}/api/get-onboarding-status`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      console.log("Response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Response error:", errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const result = await response.json()
      console.log("Onboarding status result:", result)

      if (!result.success) {
        throw new Error(result.message || result.error || "Failed to fetch onboarding status")
      }

      // If user has already completed onboarding, redirect to dashboard
      if (result.isCompleted) {
        navigate("/dashboard")
        return
      }

      // Set current step based on onboarding progress
      if (result.currentStep && result.currentStep !== "welcome") {
        const stepIndex = STEPS.findIndex((step) => step.id === result.currentStep)
        if (stepIndex !== -1) {
          setCurrentStep(stepIndex)
        }
      }

      // Pre-fill form with existing data
      if (result.organization) {
        const org = result.organization
        const settings = org.settings || {}

        setFormData((prev) => ({
          ...prev,
          companyName: org.name || "",
          industry: settings.industry || "",
          companySize: settings.company_size || "",
          website: org.domain || "",
          description: settings.description || "",
          teamSize: settings.team_size || "",
          departments: settings.departments || [],
          workingHours: settings.working_hours || "",
          timezone: settings.timezone || "",
          aiPersonality: settings.ai_config?.personality || "",
          responseStyle: settings.ai_config?.response_style || "",
          knowledgeAreas: settings.ai_config?.knowledge_areas || [],
          autoResponse: settings.ai_config?.auto_response ?? true,
          escalationRules: settings.ai_config?.escalation_rules ?? true,
        }))

        // Set channel configurations based on existing integrations
        if (result.integrations) {
          result.integrations.forEach((integration: any) => {
            if (integration.type === "email") {
              setFormData((prev) => ({
                ...prev,
                emailConfig: {
                  enabled: true,
                  address: integration.config?.address || "",
                },
              }))
            } else if (integration.type === "chat") {
              setFormData((prev) => ({
                ...prev,
                chatConfig: {
                  enabled: true,
                  widget: integration.config?.widget_enabled ?? true,
                },
              }))
            } else if (integration.type === "phone") {
              setFormData((prev) => ({
                ...prev,
                phoneConfig: {
                  enabled: true,
                  number: integration.config?.number || "",
                },
              }))
            }
          })
        }
      }
    } catch (err: any) {
      console.error("Error fetching onboarding status:", err)
      setError(err.message || "Failed to load your onboarding data")
    } finally {
      setIsLoading(false)
    }
  }

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = async () => {
    if (currentStep < STEPS.length - 1) {
      // Save current step before proceeding
      await saveCurrentStep()
      setCurrentStep((prev) => prev + 1)
    } else {
      await completeOnboarding()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const saveCurrentStep = async () => {
    setIsSaving(true)
    setError("")

    try {
      const token = await getAuthToken()
      const stepId = STEPS[currentStep].id
      let stepData = {}

      // Prepare data based on current step
      switch (stepId) {
        case "company":
          stepData = {
            companyName: formData.companyName,
            industry: formData.industry,
            companySize: formData.companySize,
            website: formData.website,
            description: formData.description,
          }
          break

        case "team":
          stepData = {
            teamSize: formData.teamSize,
            departments: formData.departments,
            workingHours: formData.workingHours,
            timezone: formData.timezone,
          }
          break

        case "channels":
          stepData = {
            emailConfig: formData.emailConfig,
            chatConfig: formData.chatConfig,
            phoneConfig: formData.phoneConfig,
          }
          break

        case "ai":
          stepData = {
            aiPersonality: formData.aiPersonality,
            responseStyle: formData.responseStyle,
            knowledgeAreas: formData.knowledgeAreas,
            autoResponse: formData.autoResponse,
            escalationRules: formData.escalationRules,
          }
          break
      }

      console.log("Saving step:", stepId, "with data:", stepData)

      // Call API to save step data
      const response = await fetch(`${apiBaseUrl}/api/update-onboarding-step`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          step: stepId,
          data: stepData,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Save step error:", errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message || result.error || "Failed to save step data")
      }

      console.log("Step saved successfully:", result)
    } catch (err: any) {
      console.error("Error saving step:", err)
      setError(err.message || "Failed to save your progress")
    } finally {
      setIsSaving(false)
    }
  }

  const completeOnboarding = async () => {
    setIsLoading(true)
    setError("")

    try {
      const token = await getAuthToken()

      console.log("Completing onboarding with data:", formData)

      // Call API to complete onboarding
      const response = await fetch(`${apiBaseUrl}/api/complete-onboarding`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Complete onboarding error:", errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message || result.error || "Failed to complete onboarding")
      }

      console.log("Onboarding completed successfully:", result)

      // Navigate to dashboard
      navigate("/dashboard")
    } catch (err: any) {
      console.error("Error completing onboarding:", err)
      setError(err.message || "Failed to complete onboarding")
      setIsLoading(false)
    }
  }

  const progress = ((currentStep + 1) / STEPS.length) * 100

  // Show authentication error if needed
  if (error && error.includes("Authentication required")) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span>Authentication Required</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">You need to be logged in to access the onboarding process.</p>
            <Button onClick={() => navigate("/login")} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading && currentStep === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-black mx-auto mb-4" />
          <p className="text-black">Loading your onboarding process...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center">
              <Bot className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2 text-black">Welcome to AI Customer Hub</h1>
          <p className="text-gray-600">Let's set up your AI-powered customer service platform</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep + 1} of {STEPS.length}
            </span>
            <span className="text-sm text-gray-600">{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />

          <div className="flex justify-between mt-4">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index <= currentStep ? "bg-black text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {index < currentStep ? <CheckCircle className="h-4 w-4" /> : index + 1}
                </div>
                <span className="text-xs mt-1 text-center max-w-20">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {currentStep === 0 && <Building2 className="h-5 w-5" />}
              {currentStep === 1 && <Users className="h-5 w-5" />}
              {currentStep === 2 && <MessageSquare className="h-5 w-5" />}
              {currentStep === 3 && <Bot className="h-5 w-5" />}
              {currentStep === 4 && <CheckCircle className="h-5 w-5" />}
              <span>{STEPS[currentStep].title}</span>
            </CardTitle>
            <CardDescription>{STEPS[currentStep].description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 0: Company Info */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => updateFormData("companyName", e.target.value)}
                      placeholder="Enter your company name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => updateFormData("website", e.target.value)}
                      placeholder="https://yourcompany.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select value={formData.industry} onValueChange={(value) => updateFormData("industry", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="ecommerce">E-commerce</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companySize">Company Size</Label>
                    <Select
                      value={formData.companySize}
                      onValueChange={(value) => updateFormData("companySize", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="51-200">51-200 employees</SelectItem>
                        <SelectItem value="201-1000">201-1000 employees</SelectItem>
                        <SelectItem value="1000+">1000+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Company Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateFormData("description", e.target.value)}
                    placeholder="Tell us about your business and what you do..."
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Step 1: Team Setup */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="teamSize">Support Team Size</Label>
                    <Select value={formData.teamSize} onValueChange={(value) => updateFormData("teamSize", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select team size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="just-me">Just me</SelectItem>
                        <SelectItem value="2-5">2-5 people</SelectItem>
                        <SelectItem value="6-15">6-15 people</SelectItem>
                        <SelectItem value="16-50">16-50 people</SelectItem>
                        <SelectItem value="50+">50+ people</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={formData.timezone} onValueChange={(value) => updateFormData("timezone", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                        <SelectItem value="UTC-7">Mountain Time (UTC-7)</SelectItem>
                        <SelectItem value="UTC-6">Central Time (UTC-6)</SelectItem>
                        <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                        <SelectItem value="UTC+0">UTC</SelectItem>
                        <SelectItem value="UTC+1">Central European Time (UTC+1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workingHours">Working Hours</Label>
                  <Select
                    value={formData.workingHours}
                    onValueChange={(value) => updateFormData("workingHours", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select working hours" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24/7">24/7</SelectItem>
                      <SelectItem value="business">Business hours (9 AM - 5 PM)</SelectItem>
                      <SelectItem value="extended">Extended hours (8 AM - 8 PM)</SelectItem>
                      <SelectItem value="custom">Custom hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Departments (select all that apply)</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {["Sales", "Support", "Technical", "Billing", "Marketing", "Operations"].map((dept) => (
                      <div key={dept} className="flex items-center space-x-2">
                        <Checkbox
                          id={dept}
                          checked={formData.departments.includes(dept)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              updateFormData("departments", [...formData.departments, dept])
                            } else {
                              updateFormData(
                                "departments",
                                formData.departments.filter((d) => d !== dept),
                              )
                            }
                          }}
                        />
                        <Label htmlFor={dept}>{dept}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Channels */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <p className="text-gray-600">Choose how customers can reach you. You can add more channels later.</p>

                {/* Email */}
                <Card className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Mail className="h-5 w-5 text-black" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Email Support</h3>
                          <p className="text-sm text-gray-600">Handle customer emails with AI assistance</p>
                        </div>
                        <Checkbox
                          checked={formData.emailConfig.enabled}
                          onCheckedChange={(checked) =>
                            updateFormData("emailConfig", { ...formData.emailConfig, enabled: checked })
                          }
                        />
                      </div>
                      {formData.emailConfig.enabled && (
                        <div className="mt-3">
                          <Input
                            placeholder="support@yourcompany.com"
                            value={formData.emailConfig.address}
                            onChange={(e) =>
                              updateFormData("emailConfig", { ...formData.emailConfig, address: e.target.value })
                            }
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Chat */}
                <Card className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-black" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Website Chat</h3>
                          <p className="text-sm text-gray-600">Add a chat widget to your website</p>
                        </div>
                        <Checkbox
                          checked={formData.chatConfig.enabled}
                          onCheckedChange={(checked) =>
                            updateFormData("chatConfig", { ...formData.chatConfig, enabled: checked })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Phone */}
                <Card className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Phone className="h-5 w-5 text-black" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Phone Support</h3>
                          <p className="text-sm text-gray-600">AI-powered phone conversations</p>
                        </div>
                        <Checkbox
                          checked={formData.phoneConfig.enabled}
                          onCheckedChange={(checked) =>
                            updateFormData("phoneConfig", { ...formData.phoneConfig, enabled: checked })
                          }
                        />
                      </div>
                      {formData.phoneConfig.enabled && (
                        <div className="mt-3">
                          <Input
                            placeholder="+1 (555) 123-4567"
                            value={formData.phoneConfig.number}
                            onChange={(e) =>
                              updateFormData("phoneConfig", { ...formData.phoneConfig, number: e.target.value })
                            }
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Step 3: AI Configuration */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="aiPersonality">AI Personality</Label>
                    <Select
                      value={formData.aiPersonality}
                      onValueChange={(value) => updateFormData("aiPersonality", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose AI personality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional & Formal</SelectItem>
                        <SelectItem value="friendly">Friendly & Casual</SelectItem>
                        <SelectItem value="helpful">Helpful & Supportive</SelectItem>
                        <SelectItem value="concise">Concise & Direct</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="responseStyle">Response Style</Label>
                    <Select
                      value={formData.responseStyle}
                      onValueChange={(value) => updateFormData("responseStyle", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose response style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="detailed">Detailed explanations</SelectItem>
                        <SelectItem value="balanced">Balanced responses</SelectItem>
                        <SelectItem value="brief">Brief & to the point</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Knowledge Areas (select areas your AI should be expert in)</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      "Product Support",
                      "Billing & Payments",
                      "Technical Issues",
                      "Sales Inquiries",
                      "Account Management",
                      "General Questions",
                    ].map((area) => (
                      <div key={area} className="flex items-center space-x-2">
                        <Checkbox
                          id={area}
                          checked={formData.knowledgeAreas.includes(area)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              updateFormData("knowledgeAreas", [...formData.knowledgeAreas, area])
                            } else {
                              updateFormData(
                                "knowledgeAreas",
                                formData.knowledgeAreas.filter((a) => a !== area),
                              )
                            }
                          }}
                        />
                        <Label htmlFor={area}>{area}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Auto-respond to simple questions</h4>
                      <p className="text-sm text-gray-600">AI will automatically respond to common questions</p>
                    </div>
                    <Checkbox
                      checked={formData.autoResponse}
                      onCheckedChange={(checked) => updateFormData("autoResponse", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Smart escalation rules</h4>
                      <p className="text-sm text-gray-600">Automatically escalate complex issues to human agents</p>
                    </div>
                    <Checkbox
                      checked={formData.escalationRules}
                      onCheckedChange={(checked) => updateFormData("escalationRules", checked)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Complete */}
            {currentStep === 4 && (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-10 w-10 text-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">You're all set!</h2>
                  <p className="text-gray-600">
                    Your AI Customer Hub is ready to start helping your customers. You can always adjust these settings
                    later in your dashboard.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium mb-2">What happens next?</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Your AI assistant will start learning from your knowledge base</li>
                    <li>• Integration setup guides will be available in your dashboard</li>
                    <li>• You can invite team members and configure advanced settings</li>
                  </ul>
                </div>
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t">
              <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0 || isSaving || isLoading}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              <Button
                onClick={handleNext}
                disabled={isLoading || isSaving || (currentStep === 0 && !formData.companyName)}
              >
                {isLoading || isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isSaving ? "Saving..." : "Setting up..."}
                  </>
                ) : currentStep === STEPS.length - 1 ? (
                  "Go to Dashboard"
                ) : (
                  <>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
