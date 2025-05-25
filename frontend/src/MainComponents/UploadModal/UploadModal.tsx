"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Camera, X, Ship, FileText, Calendar, CheckCircle, Loader2, Eye, ZoomIn, AlertTriangle, Sparkles, Edit3 } from 'lucide-react'
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { useFetchVessels } from "../../Hooks/useFetchVessels"
import { useDocumentUpload } from "../../Hooks/useDocumentUpload"
import { useDocumentPreview } from "../../Hooks/useDocumentPreview"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "../../Auth/SupabaseAuth"
import DocumentPreview from "./PDFViewer"

// API Base URL Configuration
const apiBaseUrl =
  import.meta.env.MODE === "development" ? import.meta.env.VITE_DEVELOPMENT_URL : import.meta.env.VITE_API_URL

/**
 * Parse extracted date string in DD/MM/YYYY format (maritime standard)
 * Handles formats like "05/06/2027" where 05=day, 06=month, 2027=year
 */
function parseExtractedDate(dateString: string | null | undefined): Date | null {
  if (!dateString) return null

  try {
    // If it's in DD/MM/YYYY format (maritime standard)
    if (dateString.includes("/")) {
      const parts = dateString.split("/")
      if (parts.length === 3) {
        // DD/MM/YYYY format from AI extraction
        const [day, month, year] = parts
        return new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day))
      }
    }

    // If it's in ISO format or other standard format
    const parsed = new Date(dateString)
    if (!isNaN(parsed.getTime())) {
      return parsed
    }

    return null
  } catch (error) {
    console.error("Error parsing date:", dateString, error)
    return null
  }
}

// Add helper function to determine if document is a certificate
const isCertificateDocument = (documentType: string, classification?: any) => {
  const certificateKeywords = [
    'certificate', 'cert', 'smc', 'doc', 'iopp', 'issc', 'mlc', 
    'safety management', 'document of compliance', 'classification',
    'load line', 'tonnage', 'registry', 'security', 'pollution'
  ];
  
  const docTypeText = documentType.toLowerCase();
  const categoryText = (classification?.category || '').toLowerCase();
  
  return certificateKeywords.some(keyword => 
    docTypeText.includes(keyword) || 
    categoryText === 'statutory'
  );
};

interface DocumentUploadModalProps {
  isOpen: boolean
  onClose: () => void
  initialVesselId?: string
  onUploadComplete?: (documentData: any) => void
}

export default function DocumentUploadModal({
  isOpen,
  onClose,
  initialVesselId,
  onUploadComplete,
}: DocumentUploadModalProps) {
  // Use the hooks
  const { vessels, isLoading: isVesselsLoading, error: vesselsError, fetchVessels } = useFetchVessels()
  const {
    isUploading,
    uploadProgress,
    error: uploadError,
    success: uploadSuccess,
    uploadDocument,
    clearMessages,
  } = useDocumentUpload()
  const {
    isLoading: isPreviewLoading,
    error: previewError,
    previewUrl,
    generatePreviewUrl,
    clearPreview,
  } = useDocumentPreview()

  // Step management - NEW FLOW
  const [uploadStep, setUploadStep] = useState(1)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [uploadedDocument, setUploadedDocument] = useState<any>(null)

  // File management
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [filePreviewUrls, setFilePreviewUrls] = useState<string[]>([])

  // Vessel selection
  const [selectedVessel, setSelectedVessel] = useState(initialVesselId || "")

  // Document data (extracted from AI + user edits)
  const [documentType, setDocumentType] = useState("")
  const [customDocumentType, setCustomDocumentType] = useState("")
  const [issuingAuthority, setIssuingAuthority] = useState("")
  const [customIssuingAuthority, setCustomIssuingAuthority] = useState("")
  const [issueDate, setIssueDate] = useState<Date | undefined>(undefined)
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined)
  const [isPermanent, setIsPermanent] = useState(false)
  const [documentNumber, setDocumentNumber] = useState("")
  const [documentTitle, setDocumentTitle] = useState("")

  // AI extraction state
  const [extractedData, setExtractedData] = useState<any>(null)
  const [isExtracting, setIsExtracting] = useState(false)

  // Loading state for save button
  const [isSaving, setIsSaving] = useState(false)

  // Document types for maritime
  const documentTypes = [
    "Safety Management Certificate (SMC)",
    "Document of Compliance (DOC)",
    "International Oil Pollution Prevention Certificate (IOPP)",
    "International Load Line Certificate",
    "International Tonnage Certificate",
    "Minimum Safe Manning Document",
    "Certificate of Registry",
    "Maritime Labour Certificate (MLC)",
    "Classification Certificate",
    "International Ship Security Certificate (ISSC)",
  ]

  // Fetch vessels when the modal opens
  useEffect(() => {
    if (isOpen) {
      fetchVessels()
    }
  }, [isOpen, fetchVessels])

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedVessel(initialVesselId || "")
    } else {
      resetAllState()
    }
  }, [isOpen, initialVesselId])

  // Auto-scroll when file is added
  useEffect(() => {
    if (files.length > 0) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        const element = document.querySelector('[data-scroll-target="preview"]')
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }, 100)
    }
  }, [files])

  const resetAllState = () => {
    setUploadStep(1)
    setFiles([])
    setFilePreviewUrls([])
    setUploadComplete(false)
    setUploadedDocument(null)
    setExtractedData(null)
    setIsExtracting(false)
    clearMessages()
    clearPreview()
    setDocumentType("")
    setCustomDocumentType("")
    setIssuingAuthority("")
    setCustomIssuingAuthority("")
    setIssueDate(undefined)
    setExpiryDate(undefined)
    setIsPermanent(false)
    setDocumentNumber("")
    setDocumentTitle("")
    setIsSaving(false)
  }

  // Generate preview URLs for files
  useEffect(() => {
    filePreviewUrls.forEach((url) => {
      if (url.startsWith("blob:")) {
        URL.revokeObjectURL(url)
      }
    })

    const newPreviewUrls = files.map((file) => {
      if (file.type === "application/pdf") {
        return "" // PDFViewer will handle this directly
      } else {
        return URL.createObjectURL(file)
      }
    })

    setFilePreviewUrls(newPreviewUrls)

    return () => {
      newPreviewUrls.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url)
        }
      })
    }
  }, [files])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    let selectedFiles: File[] = []

    if ("dataTransfer" in e && e.dataTransfer?.files) {
      selectedFiles = Array.from(e.dataTransfer.files)
    } else if ("target" in e && e.target.files) {
      selectedFiles = Array.from(e.target.files)
    }

    const validFiles = selectedFiles.filter((file) => {
      const validTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"]
      const validSize = file.size <= 10 * 1024 * 1024 // 10MB max
      return validTypes.includes(file.type) && validSize
    })

    if (validFiles.length > 0) {
      setFiles([validFiles[0]]) // Only take the first file for single upload
      setDocumentTitle(validFiles[0].name.replace(/\.[^/.]+$/, ""))
    }
  }

  const removeFile = () => {
    setFiles([])
    setFilePreviewUrls([])
    setDocumentTitle("")
  }

  // NEW: Direct upload with AI processing
  const handleDirectUpload = async () => {
    if (files.length === 0 || !selectedVessel) return

    setIsExtracting(true)
    setUploadStep(2) // Move to processing step immediately

    try {
      // Prepare minimal document data for upload
      const documentData = {
        vesselId: selectedVessel,
        title: documentTitle,
        documentType: "Unknown", // Will be classified by AI
        category: "General",
        issuer: "",
        certificateNumber: "",
        issueDate: new Date().toISOString().split("T")[0], // Default to today
        expiryDate: undefined,
        isPermanent: true, // Set to true for initial upload to bypass validation
      }

      // Upload document - this will trigger AI processing on backend
      const result = await uploadDocument(files[0], documentData)

      if (result) {
        console.log("Upload result:", result) // Add this for debugging

        // IMPORTANT: Make sure we're using the correct document ID
        const documentId = result.data?.id || result.id
        console.log("Document ID to use for updates:", documentId) // Add this for debugging

        setUploadedDocument({
          ...result,
          id: documentId, // Ensure we have the correct ID
        })

        // Extract the AI-processed data from the result
        if (result.extractedMetadata) {
          const metadata = result.extractedMetadata;
          setExtractedData(metadata);

          // Pre-fill form fields with extracted data
          setDocumentTitle(metadata.documentTitle || documentTitle);

          if (result.classification?.specificDocumentType) {
            setDocumentType(result.classification.specificDocumentType);
          } else if (metadata.documentType) {
            setDocumentType(metadata.documentType);
          } else if (result.classification?.primaryCategory) {
            setDocumentType(result.classification.primaryCategory);
          } else {
            setDocumentType("Unknown");
          }

          setIssuingAuthority(metadata.issuer || "");
          setDocumentNumber(metadata.documentNumber || "");

          if (metadata.issueDate) {
            const issueDate = parseExtractedDate(metadata.issueDate);
            if (issueDate) setIssueDate(issueDate);
          }

          // NEW: Auto-determine if document should be permanent
          const isDocumentCertificate = isCertificateDocument(
            result.classification?.specificDocumentType || metadata.documentType || documentType,
            result.classification
          );

          if (!isDocumentCertificate) {
            // Non-certificate documents are automatically permanent
            setIsPermanent(true);
            setExpiryDate(undefined);
            console.log("Document automatically marked as permanent (non-certificate)");
          } else if (metadata.expiryDate) {
            // Certificate with extracted expiry date
            const expiryDate = parseExtractedDate(metadata.expiryDate);
            if (expiryDate) {
              setExpiryDate(expiryDate);
              setIsPermanent(false);
            }
          } else {
            // Certificate without expiry date - let user decide
            setIsPermanent(false);
          }
        }

        // Generate preview URL for the uploaded document
        if (result.file_path) {
          await generatePreviewUrl(result.file_path)
        }

        setUploadStep(3) // Move to edit step
      }
    } catch (error) {
      console.error("Error uploading document:", error)
      setUploadStep(1) // Go back to step 1 on error
    } finally {
      setIsExtracting(false)
    }
  }

  // Final submission with user edits
  const handleFinalSubmit = async () => {
    if (!uploadedDocument) return

    setIsSaving(true) // Set loading state

    // Add debugging
    console.log("Updating document with ID:", uploadedDocument.id)
    console.log("Full uploadedDocument object:", uploadedDocument)

    try {
      // Get the current session to include the auth token (following team management pattern)
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

      if (sessionError || !sessionData.session) {
        throw new Error("Authentication required. Please log in again.")
      }

      // Get the access token from the session
      const token = sessionData.session.access_token

      const updateData = {
        title: documentTitle,
        documentType: documentType,
        issuer: issuingAuthority,
        certificateNumber: documentNumber,
        issueDate: issueDate?.toISOString().split("T")[0],
        expiryDate: isPermanent ? undefined : expiryDate?.toISOString().split("T")[0],
        isPermanent,
      }

      console.log("Update data:", updateData) // Add this for debugging

      // Call your existing update endpoint using the same pattern as team management
      const response = await fetch(`${apiBaseUrl}/api/documents/${uploadedDocument.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      })

      console.log("Update response status:", response.status) // Add this for debugging

      if (!response.ok) {
        // Better error handling for non-JSON responses
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`

        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorData.message || errorMessage
        } catch (jsonError) {
          // Response is not JSON, use the status text
          console.log("Response is not JSON:", jsonError)
        }

        throw new Error(errorMessage)
      }

      const result = await response.json()
      console.log("Document updated successfully:", result)

      setUploadStep(4)
      setUploadComplete(true)

      if (onUploadComplete) {
        onUploadComplete(result.document)
      }
    } catch (error) {
      console.error("Error updating document:", error)
      alert(`Failed to save document changes: ${error.message}`)
    } finally {
      setIsSaving(false) // Clear loading state
    }
  }

  const renderStep = () => {
    switch (uploadStep) {
      case 1:
        return (
          <div className="space-y-6 px-2">
            {/* Compact Upload Section */}
            <div className="space-y-3">
              <Label htmlFor="vessel">Select Vessel</Label>
              <Select value={selectedVessel} onValueChange={setSelectedVessel}>
                <SelectTrigger id="vessel" className="h-10">
                  <SelectValue placeholder={isVesselsLoading ? "Loading vessels..." : "Choose your vessel"} />
                </SelectTrigger>
                <SelectContent>
                  {isVesselsLoading ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      <span>Loading vessels...</span>
                    </div>
                  ) : vessels.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">No vessels found</div>
                  ) : (
                    vessels.map((vessel) => (
                      <SelectItem key={vessel.id} value={vessel.id}>
                        <div className="flex items-center">
                          <Ship className="h-4 w-4 mr-2 text-blue-500" />
                          <span>{vessel.name}</span>
                          <span className="ml-2 text-gray-500 text-xs">({vessel.type})</span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Compact Upload Method */}
            <div className="space-y-3">
              <Label>Upload Method</Label>
              <Tabs defaultValue="file" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="file">
                    <Upload className="h-4 w-4 mr-2" />
                    File Upload
                  </TabsTrigger>
                  <TabsTrigger value="camera">
                    <Camera className="h-4 w-4 mr-2" />
                    Camera
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="file" className="pt-4">
                  <div
                    className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center hover:bg-blue-50 cursor-pointer transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={(e) => {
                      e.preventDefault()
                      handleFileChange(e)
                    }}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <Upload className="h-8 w-8 mx-auto mb-3 text-blue-500" />
                    <p className="text-base font-medium mb-2">Drop your maritime document here</p>
                    <p className="text-sm text-gray-600 mb-3">or click to browse files</p>
                    <p className="text-xs text-gray-500 mb-3">Supports PDF, JPG, PNG (max 10MB)</p>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Select Document
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="application/pdf,image/jpeg,image/jpg,image/png"
                      onChange={handleFileChange}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="camera" className="pt-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Camera className="h-8 w-8 mx-auto mb-3 text-gray-400" />
                    <p className="text-base font-medium mb-2">Capture Document Photo</p>
                    <p className="text-sm text-gray-600 mb-3">Position certificate within frame for best results</p>
                    <Button variant="outline" size="sm" disabled>
                      <Camera className="h-4 w-4 mr-2" />
                      Open Camera (Coming Soon)
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Enhanced Document Preview */}
            {files.length > 0 && (
              <div className="space-y-4" data-scroll-target="preview">
                <Label>Document Preview</Label>
                <Card className="p-6">
                  {/* Document Title Input */}
                  <div className="mb-6">
                    <Label htmlFor="documentTitle" className="text-sm font-medium mb-2 block">
                      Document Title
                    </Label>
                    <Input
                      id="documentTitle"
                      value={documentTitle}
                      onChange={(e) => setDocumentTitle(e.target.value)}
                      placeholder="Document title"
                      className="font-medium h-10"
                    />
                  </div>

                  {/* Enhanced Preview with PDF Support */}
                  <DocumentPreview file={files[0]} className="min-h-[500px] mb-4" />

                  {/* File Info */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {files[0].type.split("/")[1].toUpperCase()} • {(files[0].size / 1024).toFixed(0)} KB
                      {files[0].type === "application/pdf" && (
                        <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          <FileText className="h-3 w-3 mr-1" />
                          PDF Document
                        </span>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" onClick={removeFile}>
                      <X className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </Card>

                <Alert className="border-blue-200 bg-blue-50">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <p className="font-medium">Ready for AI Processing</p>
                    <p className="text-sm">
                      Our AI will extract document details automatically. You can review and edit them in the next step.
                    </p>
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {uploadError && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <AlertDescription className="text-red-800">
                  <p className="font-medium">Upload Error</p>
                  <p className="text-sm">{uploadError}</p>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )

      case 2:
        return (
          <div className="space-y-6 px-2 text-center">
            <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900">Processing Document...</h3>

            <p className="text-gray-600 text-lg">
              Our AI is analyzing your document and extracting key information. This may take a few moments.
            </p>

            <div className="space-y-3 max-w-md mx-auto">
              <div className="flex justify-between text-sm">
                <span>Uploading & Processing...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 max-w-md mx-auto">
              <p className="text-sm text-blue-800">
                <strong>What's happening:</strong> We're uploading your document securely and using AI to extract
                certificate details, dates, and issuing authorities automatically.
              </p>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Document Preview */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Document Preview</h3>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <ZoomIn className="h-4 w-4 mr-1" />
                      Zoom
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Full Screen
                    </Button>
                  </div>
                </div>

                <DocumentPreview file={files[0]} previewUrl={previewUrl} className="min-h-[500px]" />
              </div>

              {/* Extracted Data Form */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Document Information</h3>
                  <div className="flex items-center text-sm text-green-600">
                    <Sparkles className="h-4 w-4 mr-1" />
                    AI Extracted
                  </div>
                </div>

                {extractedData && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <AlertDescription className="text-green-800">
                      <p className="font-medium">AI Processing Complete</p>
                      <p className="text-sm">
                        We've automatically extracted the key information. Please review and edit as needed.
                      </p>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  {/* Document Title */}
                  <div className="space-y-2">
                    <Label htmlFor="documentTitle">Document Title *</Label>
                    <Input
                      id="documentTitle"
                      className="h-10"
                      value={documentTitle}
                      onChange={(e) => setDocumentTitle(e.target.value)}
                      placeholder="Enter document title"
                    />
                  </div>

                  {/* Document Type */}
                  <div className="space-y-2">
                    <Label htmlFor="documentType">Document Type *</Label>
                    <div className="space-y-2">
                      {/* Show what AI extracted */}
                      {extractedData && (
                        <div className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded border">
                          <span className="font-medium">AI Extracted:</span> {documentType}
                        </div>
                      )}

                      {/* Allow user to edit the document type directly */}
                      <Input
                        id="documentType"
                        className="h-10"
                        value={documentType}
                        onChange={(e) => setDocumentType(e.target.value)}
                        placeholder="Enter document type"
                      />

                      {/* Optional: Keep dropdown for common types as suggestions */}
                      <div className="text-xs text-gray-500">
                        <span className="font-medium">Common types:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {documentTypes.slice(0, 5).map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setDocumentType(type)}
                              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs"
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Issuing Authority - UPDATED TO TEXT INPUT */}
                  <div className="space-y-2">
                    <Label htmlFor="issuingAuthority">
                      Issuing Authority *
                      {extractedData?.issuer && (
                        <span className="ml-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                          ✨ AI Extracted
                        </span>
                      )}
                    </Label>
                    <Input
                      id="issuingAuthority"
                      className="h-10"
                      value={issuingAuthority}
                      onChange={(e) => setIssuingAuthority(e.target.value)}
                      placeholder="Enter issuing authority (e.g., Bahamas Maritime Authority)"
                    />
                    {extractedData?.issuer && (
                      <p className="text-gray-500 text-sm">AI extracted: "{extractedData.issuer}" - Edit if needed</p>
                    )}
                  </div>

                  {/* Document Number */}
                  <div className="space-y-2">
                    <Label htmlFor="documentNumber">Certificate/Document Number</Label>
                    <Input
                      id="documentNumber"
                      className="h-10"
                      placeholder="Enter document number"
                      value={documentNumber}
                      onChange={(e) => setDocumentNumber(e.target.value)}
                    />
                  </div>

                  {/* Issue Date */}
                  <div className="space-y-2">
                    <Label>Issue Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal h-10",
                            !issueDate && "text-muted-foreground",
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {issueDate ? format(issueDate, "PPP") : <span>Select issue date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent mode="single" selected={issueDate} onSelect={setIssueDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Expiry Date - UPDATED with auto-permanent logic */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className={isPermanent ? "text-gray-400" : ""}>Expiry Date</Label>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="permanent" 
                          checked={isPermanent} 
                          onCheckedChange={setIsPermanent}
                          disabled={!isCertificateDocument(documentType, extractedData)} // Disable for non-certificates
                        />
                        <Label htmlFor="permanent" className="text-sm cursor-pointer">
                          No Expiry
                        </Label>
                      </div>
                    </div>
                    
                    {/* Show auto-permanent message for non-certificates */}
                    {!isCertificateDocument(documentType, extractedData) && (
                      <div className="text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded border">
                        <span className="font-medium">Auto-Permanent:</span> Non-certificate documents don't require expiry dates
                      </div>
                    )}
                    
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal h-10",
                            (!expiryDate || isPermanent) && "text-muted-foreground",
                          )}
                          disabled={isPermanent}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {!isPermanent && expiryDate ? (
                            format(expiryDate, "PPP")
                          ) : (
                            <span>{isPermanent ? "No expiry date" : "Select expiry date"}</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={expiryDate}
                          onSelect={setExpiryDate}
                          initialFocus
                          disabled={isPermanent}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </div>

            {uploadError && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <AlertDescription className="text-red-800">
                  <p className="font-medium">Error</p>
                  <p className="text-sm">{uploadError}</p>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )

      case 4:
        return (
          <div className="space-y-6 text-center px-4">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900">Document Successfully Processed!</h3>
            <p className="text-gray-600 text-lg">
              Your maritime document has been uploaded, processed by AI, and is now available in your vessel's document
              library.
            </p>

            <Card className="mt-8 text-left">
              <CardContent className="p-6">
                <h4 className="font-semibold mb-4">Final Document Details</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vessel:</span>
                    <span className="font-medium">{vessels.find((v) => v.id === selectedVessel)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Document:</span>
                    <span className="font-medium">{documentTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">{documentType === "other" ? customDocumentType : documentType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Issuing Authority:</span>
                    <span className="font-medium">{issuingAuthority}</span>
                  </div>
                  {documentNumber && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Document Number:</span>
                      <span className="font-medium">{documentNumber}</span>
                    </div>
                  )}
                  {issueDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Issue Date:</span>
                      <span className="font-medium">{format(issueDate, "PPP")}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expiry:</span>
                    <span className="font-medium">
                      {isPermanent ? "No Expiry" : expiryDate ? format(expiryDate, "PPP") : "Not set"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-6">
              <p className="text-sm text-blue-800">
                <strong>What's Next?</strong> Your document will be automatically monitored for expiry dates. You'll
                receive alerts 90, 30, and 7 days before expiration to ensure continuous compliance.
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const renderFooter = () => {
    switch (uploadStep) {
      case 1:
        return (
          <>
            <Button variant="outline" onClick={onClose} className="h-12 px-6">
              Cancel
            </Button>
            <Button
              onClick={handleDirectUpload}
              disabled={files.length === 0 || !selectedVessel || !documentTitle.trim() || isUploading}
              className="h-12 px-6"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-5 w-5" />
                  Upload & Process
                </>
              )}
            </Button>
          </>
        )

      case 2:
        return (
          <>
            <Button variant="outline" onClick={() => setUploadStep(1)} className="h-12 px-6" disabled={isExtracting}>
              Back
            </Button>
            <Button disabled className="h-12 px-6">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </Button>
          </>
        )

      case 3:
        const isFormValid =
          documentTitle.trim() &&
          documentType &&
          (documentType !== "other" || customDocumentType) &&
          issuingAuthority &&
          issueDate &&
          (isPermanent || expiryDate)

        return (
          <>
            <Button variant="outline" onClick={() => setUploadStep(1)} className="h-12 px-6">
              Start Over
            </Button>
            <Button onClick={handleFinalSubmit} disabled={!isFormValid || isSaving} className="h-12 px-6">
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Saving Document...
                </>
              ) : (
                <>
                  <Edit3 className="mr-2 h-5 w-5" />
                  Save Document
                </>
              )}
            </Button>
          </>
        )

      case 4:
        return (
          <>
            <Button variant="outline" onClick={() => resetAllState()} className="h-12 px-6">
              Upload Another Document
            </Button>
            <Button onClick={onClose} className="h-12 px-6">
              Done
            </Button>
          </>
        )

      default:
        return null
    }
  }

  const getStepTitle = () => {
    switch (uploadStep) {
      case 1:
        return "Select Maritime Document"
      case 2:
        return "Processing Document"
      case 3:
        return "Review & Edit Details"
      case 4:
        return "Upload Complete"
      default:
        return "Upload Document"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1200px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{getStepTitle()}</DialogTitle>
        </DialogHeader>

        {/* Step indicator */}
        {uploadStep < 5 && (
          <div className="flex items-center justify-between mb-6 px-2">
            <div className="w-full">
              <div className="flex justify-between mb-2">
                <span className={`text-sm font-medium ${uploadStep >= 1 ? "text-blue-600" : "text-gray-400"}`}>
                  Select & Preview
                </span>
                <span className={`text-sm font-medium ${uploadStep >= 2 ? "text-blue-600" : "text-gray-400"}`}>
                  Upload & Process
                </span>
                <span className={`text-sm font-medium ${uploadStep >= 3 ? "text-blue-600" : "text-gray-400"}`}>
                  Review & Edit
                </span>
                <span className={`text-sm font-medium ${uploadStep >= 4 ? "text-blue-600" : "text-gray-400"}`}>
                  Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${(uploadStep / 4) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {renderStep()}

        <DialogFooter className="flex justify-between mt-6">{renderFooter()}</DialogFooter>
      </DialogContent>
    </Dialog>
  )
}