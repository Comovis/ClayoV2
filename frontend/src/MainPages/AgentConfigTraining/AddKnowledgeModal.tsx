"use client"
import { useState, useRef } from "react"
import type React from "react"

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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  Brain,
  Loader2,
  AlertCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  Upload,
  Globe,
  MessageSquare,
  FileText,
  ExternalLink,
} from "lucide-react"

type KnowledgeItem = {
  id: string
  type: "document" | "url" | "text"
  title: string
  size?: string
  url?: string
  content?: string
  uploadDate: string
  status: "processed" | "processing" | "error"
  category: string
}

interface AddKnowledgeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddKnowledge: (item: KnowledgeItem) => void
}

export default function AddKnowledgeModal({ open, onOpenChange, onAddKnowledge }: AddKnowledgeModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [knowledgeType, setKnowledgeType] = useState<"document" | "url" | "text" | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    // URL fields
    url: "",
    urlTitle: "",
    urlCategory: "Web Content",

    // Text fields
    textTitle: "",
    textContent: "",
    textCategory: "Custom",

    // Document fields
    files: null as FileList | null,
    docCategory: "General",
  })

  const [errors, setErrors] = useState({
    url: "",
    textTitle: "",
    textContent: "",
    files: "",
  })

  const totalSteps = 3
  const progress = (currentStep / totalSteps) * 100

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleAddKnowledge = async () => {
    setIsProcessing(true)

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 1500))

    let newItem: KnowledgeItem

    if (knowledgeType === "url") {
      newItem = {
        id: Date.now().toString(),
        type: "url",
        title: formData.urlTitle || new URL(formData.url).hostname,
        url: formData.url,
        uploadDate: new Date().toISOString().split("T")[0],
        status: "processing",
        category: formData.urlCategory,
      }
    } else if (knowledgeType === "text") {
      newItem = {
        id: Date.now().toString(),
        type: "text",
        title: formData.textTitle,
        content: formData.textContent,
        uploadDate: new Date().toISOString().split("T")[0],
        status: "processed",
        category: formData.textCategory,
      }
    } else if (knowledgeType === "document" && formData.files) {
      // For demo, just handle the first file
      const file = formData.files[0]
      newItem = {
        id: Date.now().toString(),
        type: "document",
        title: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        uploadDate: new Date().toISOString().split("T")[0],
        status: "processing",
        category: formData.docCategory,
      }
    } else {
      setIsProcessing(false)
      return
    }

    onAddKnowledge(newItem)

    // Reset form
    setFormData({
      url: "",
      urlTitle: "",
      urlCategory: "Web Content",
      textTitle: "",
      textContent: "",
      textCategory: "Custom",
      files: null,
      docCategory: "General",
    })
    setKnowledgeType(null)
    setCurrentStep(1)
    setIsProcessing(false)
    setErrors({ url: "", textTitle: "", textContent: "", files: "" })
    onOpenChange(false)
  }

  const handleClose = () => {
    if (!isProcessing) {
      setFormData({
        url: "",
        urlTitle: "",
        urlCategory: "Web Content",
        textTitle: "",
        textContent: "",
        textCategory: "Custom",
        files: null,
        docCategory: "General",
      })
      setKnowledgeType(null)
      setCurrentStep(1)
      setErrors({ url: "", textTitle: "", textContent: "", files: "" })
      onOpenChange(false)
    }
  }

  const handleNext = async () => {
    // Validation for step 2
    if (currentStep === 2) {
      let hasErrors = false
      const newErrors = { url: "", textTitle: "", textContent: "", files: "" }

      if (knowledgeType === "url") {
        if (!formData.url.trim()) {
          newErrors.url = "Please enter a URL"
          hasErrors = true
        } else if (!validateUrl(formData.url)) {
          newErrors.url = "Please enter a valid URL"
          hasErrors = true
        }
      } else if (knowledgeType === "text") {
        if (!formData.textTitle.trim()) {
          newErrors.textTitle = "Please enter a title"
          hasErrors = true
        }
        if (!formData.textContent.trim()) {
          newErrors.textContent = "Please enter content"
          hasErrors = true
        }
      } else if (knowledgeType === "document") {
        if (!formData.files || formData.files.length === 0) {
          newErrors.files = "Please select at least one file"
          hasErrors = true
        }
      }

      setErrors(newErrors)
      if (hasErrors) return

      // Auto-generate URL title if not provided
      if (knowledgeType === "url" && !formData.urlTitle.trim()) {
        try {
          const hostname = new URL(formData.url).hostname
          setFormData((prev) => ({ ...prev, urlTitle: hostname }))
        } catch {
          setFormData((prev) => ({ ...prev, urlTitle: "Website Content" }))
        }
      }
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
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

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFormData((prev) => ({ ...prev, files: e.dataTransfer.files }))
      setErrors((prev) => ({ ...prev, files: "" }))
    }
  }

  const handleFileSelect = (files: FileList | null) => {
    if (files && files.length > 0) {
      setFormData((prev) => ({ ...prev, files }))
      setErrors((prev) => ({ ...prev, files: "" }))
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Choose Knowledge Type"
      case 2:
        return knowledgeType === "url"
          ? "Add Website URL"
          : knowledgeType === "text"
            ? "Add Text Content"
            : "Upload Documents"
      case 3:
        return "Review & Add"
      default:
        return ""
    }
  }

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "Select the type of knowledge you want to add to your AI agent"
      case 2:
        return knowledgeType === "url"
          ? "Enter the website URL and details"
          : knowledgeType === "text"
            ? "Enter your custom text content"
            : "Upload documents to train your AI"
      case 3:
        return "Review your content and add it to the knowledge base"
      default:
        return ""
    }
  }

  const wordCount = formData.textContent
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] w-[95vw] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Brain className="mr-2 h-6 w-6 text-blue-500" />
            Add Knowledge Source
          </DialogTitle>
          <DialogDescription>Add new content to your AI agent's knowledge base</DialogDescription>
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

        {/* Step Content */}
        <div className="py-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{getStepTitle()}</h3>
            <p className="text-sm text-gray-600">{getStepDescription()}</p>
          </div>

          {/* Step 1: Choose Type */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid gap-3">
                <div
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    knowledgeType === "document"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setKnowledgeType("document")}
                >
                  <div className="flex items-start space-x-3">
                    <Upload className="h-6 w-6 text-blue-500 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-medium">Upload Documents</h4>
                      <p className="text-sm text-gray-600 mt-1">Upload PDF, DOC, or TXT files to train your AI</p>
                      <p className="text-xs text-gray-500 mt-1">Best for: Product manuals, policies, documentation</p>
                    </div>
                  </div>
                </div>

                <div
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    knowledgeType === "url" ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setKnowledgeType("url")}
                >
                  <div className="flex items-start space-x-3">
                    <Globe className="h-6 w-6 text-green-500 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-medium">Add Website URL</h4>
                      <p className="text-sm text-gray-600 mt-1">Import content from web pages and documentation</p>
                      <p className="text-xs text-gray-500 mt-1">Best for: FAQ pages, help articles, product pages</p>
                    </div>
                  </div>
                </div>

                <div
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    knowledgeType === "text"
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setKnowledgeType("text")}
                >
                  <div className="flex items-start space-x-3">
                    <MessageSquare className="h-6 w-6 text-purple-500 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-medium">Add Text Content</h4>
                      <p className="text-sm text-gray-600 mt-1">Enter custom text content directly</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Best for: Company info, custom instructions, quick facts
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Content Input */}
          {currentStep === 2 && (
            <div className="space-y-4">
              {/* Document Upload */}
              {knowledgeType === "document" && (
                <>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                      dragActive ? "border-blue-500 bg-blue-50" : "border-blue-300 hover:bg-blue-50"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className={`h-12 w-12 mx-auto mb-4 ${dragActive ? "text-blue-600" : "text-blue-500"}`} />
                    <p className="font-medium mb-2">{dragActive ? "Drop files here" : "Upload Documents"}</p>
                    <p className="text-sm text-gray-600 mb-3">Drag & drop files or click to browse</p>
                    <p className="text-xs text-gray-500 mb-4">PDF, DOC, TXT files (max 10MB each)</p>
                    <Button variant="outline" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      Choose Files
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      multiple
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={(e) => handleFileSelect(e.target.files)}
                    />
                  </div>

                  {errors.files && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.files}</span>
                    </div>
                  )}

                  {formData.files && formData.files.length > 0 && (
                    <div className="space-y-2">
                      <Label>Selected Files:</Label>
                      <div className="space-y-1">
                        {Array.from(formData.files).map((file, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm p-2 bg-gray-50 rounded">
                            <FileText className="h-4 w-4 text-blue-500" />
                            <span className="flex-1">{file.name}</span>
                            <span className="text-gray-500">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={formData.docCategory}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, docCategory: value }))}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Product Info">Product Info</SelectItem>
                        <SelectItem value="Documentation">Documentation</SelectItem>
                        <SelectItem value="Policies">Policies</SelectItem>
                        <SelectItem value="Training">Training</SelectItem>
                        <SelectItem value="General">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {/* URL Input */}
              {knowledgeType === "url" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="websiteUrl">Website URL *</Label>
                    <Input
                      id="websiteUrl"
                      placeholder="https://example.com/faq"
                      value={formData.url}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, url: e.target.value }))
                        setErrors((prev) => ({ ...prev, url: "" }))
                      }}
                      className={`h-11 ${errors.url ? "border-red-500" : ""}`}
                    />
                    {errors.url && (
                      <div className="flex items-center space-x-2 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.url}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="urlTitle">Title (Optional)</Label>
                    <Input
                      id="urlTitle"
                      placeholder="e.g., Company FAQ Page"
                      value={formData.urlTitle}
                      onChange={(e) => setFormData((prev) => ({ ...prev, urlTitle: e.target.value }))}
                      className="h-11"
                    />
                    <p className="text-xs text-gray-500">Leave blank to auto-generate from URL</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={formData.urlCategory}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, urlCategory: value }))}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FAQ">FAQ</SelectItem>
                        <SelectItem value="Documentation">Documentation</SelectItem>
                        <SelectItem value="Product Info">Product Info</SelectItem>
                        <SelectItem value="Support">Support</SelectItem>
                        <SelectItem value="Company Info">Company Info</SelectItem>
                        <SelectItem value="Web Content">Web Content</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Alert className="border-green-200 bg-green-50">
                    <ExternalLink className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      <div className="space-y-2">
                        <p className="font-medium text-sm">Supported Content Types:</p>
                        <ul className="text-xs space-y-1">
                          <li>• FAQ pages and documentation</li>
                          <li>• Product information pages</li>
                          <li>• Support articles and guides</li>
                          <li>• Company information pages</li>
                        </ul>
                      </div>
                    </AlertDescription>
                  </Alert>
                </>
              )}

              {/* Text Input */}
              {knowledgeType === "text" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="textTitle">Title *</Label>
                    <Input
                      id="textTitle"
                      placeholder="e.g., Company Policies, Product Information"
                      value={formData.textTitle}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, textTitle: e.target.value }))
                        setErrors((prev) => ({ ...prev, textTitle: "" }))
                      }}
                      className={`h-11 ${errors.textTitle ? "border-red-500" : ""}`}
                    />
                    {errors.textTitle && (
                      <div className="flex items-center space-x-2 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.textTitle}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="textContent">Content *</Label>
                    <Textarea
                      id="textContent"
                      placeholder="Enter the text content you want to add to the knowledge base..."
                      value={formData.textContent}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, textContent: e.target.value }))
                        setErrors((prev) => ({ ...prev, textContent: "" }))
                      }}
                      className={`min-h-[200px] resize-none ${errors.textContent ? "border-red-500" : ""}`}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Be specific and detailed for better AI understanding</span>
                      <span>{wordCount} words</span>
                    </div>
                    {errors.textContent && (
                      <div className="flex items-center space-x-2 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.textContent}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={formData.textCategory}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, textCategory: value }))}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Company Info">Company Info</SelectItem>
                        <SelectItem value="Product Info">Product Info</SelectItem>
                        <SelectItem value="Policies">Policies</SelectItem>
                        <SelectItem value="FAQ">FAQ</SelectItem>
                        <SelectItem value="Instructions">Instructions</SelectItem>
                        <SelectItem value="Custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Alert className="border-purple-200 bg-purple-50">
                    <FileText className="h-4 w-4 text-purple-600" />
                    <AlertDescription className="text-purple-800">
                      <div className="space-y-2">
                        <p className="font-medium text-sm">Examples of useful content:</p>
                        <ul className="text-xs space-y-1">
                          <li>• Company policies and procedures</li>
                          <li>• Product specifications and features</li>
                          <li>• Frequently asked questions</li>
                          <li>• Custom instructions for the AI</li>
                        </ul>
                      </div>
                    </AlertDescription>
                  </Alert>
                </>
              )}
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <Alert className="border-blue-200 bg-blue-50">
                <Check className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <div className="space-y-3">
                    <h4 className="font-medium">Ready to Add Knowledge</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span className="font-medium capitalize">{knowledgeType}</span>
                      </div>

                      {knowledgeType === "url" && (
                        <>
                          <div className="flex justify-between">
                            <span>Title:</span>
                            <span className="font-medium">{formData.urlTitle || "Auto-generated"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Category:</span>
                            <span className="font-medium">{formData.urlCategory}</span>
                          </div>
                          <div className="pt-2 border-t border-blue-200">
                            <p className="text-sm">
                              <span className="font-medium">URL:</span>
                            </p>
                            <p className="text-xs break-all mt-1">{formData.url}</p>
                          </div>
                        </>
                      )}

                      {knowledgeType === "text" && (
                        <>
                          <div className="flex justify-between">
                            <span>Title:</span>
                            <span className="font-medium">{formData.textTitle}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Category:</span>
                            <span className="font-medium">{formData.textCategory}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Word Count:</span>
                            <span className="font-medium">{wordCount} words</span>
                          </div>
                          <div className="pt-2 border-t border-blue-200">
                            <p className="text-sm">
                              <span className="font-medium">Content Preview:</span>
                            </p>
                            <p className="text-xs mt-1 leading-relaxed">
                              {formData.textContent.substring(0, 150)}
                              {formData.textContent.length > 150 && "..."}
                            </p>
                          </div>
                        </>
                      )}

                      {knowledgeType === "document" && formData.files && (
                        <>
                          <div className="flex justify-between">
                            <span>Files:</span>
                            <span className="font-medium">{formData.files.length} file(s)</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Category:</span>
                            <span className="font-medium">{formData.docCategory}</span>
                          </div>
                          <div className="pt-2 border-t border-blue-200">
                            <p className="text-sm font-medium mb-1">Files to upload:</p>
                            <div className="space-y-1">
                              {Array.from(formData.files).map((file, index) => (
                                <p key={index} className="text-xs">
                                  • {file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)
                                </p>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </AlertDescription>
              </Alert>

              <div className="text-xs text-gray-500 text-center">
                This content will be processed and added to your agent's knowledge base.
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleClose} disabled={isProcessing}>
              Cancel
            </Button>
            {currentStep > 1 && (
              <Button variant="outline" onClick={handlePrevious} disabled={isProcessing}>
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back
              </Button>
            )}
          </div>

          <div>
            {currentStep < totalSteps ? (
              <Button onClick={handleNext} disabled={currentStep === 1 && !knowledgeType}>
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleAddKnowledge} disabled={isProcessing} className="bg-blue-600 hover:bg-blue-700">
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Add Knowledge
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
