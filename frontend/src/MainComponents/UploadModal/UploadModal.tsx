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
import {
  Upload,
  Camera,
  X,
  Ship,
  FileText,
  Calendar,
  CheckCircle,
  Loader2,
  FileSymlink,
  ShieldCheck,
  Eye,
  ZoomIn,
  AlertTriangle,
} from "lucide-react"
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

interface DocumentUploadModalProps {
  isOpen: boolean
  onClose: () => void
  initialVesselId?: string
  onUploadComplete?: (documentData: any) => void
}

export default function DocumentUploadModalRedesigned({
  isOpen,
  onClose,
  initialVesselId,
  onUploadComplete,
}: DocumentUploadModalProps) {
  // Use the hooks you provided
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

  // Step management
  const [uploadStep, setUploadStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [processingError, setProcessingError] = useState<string | null>(null)

  // File management
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [filePreviewUrls, setFilePreviewUrls] = useState<string[]>([])
  const [selectedPreviewIndex, setSelectedPreviewIndex] = useState(0)

  // Vessel selection
  const [selectedVessel, setSelectedVessel] = useState(initialVesselId || "")

  // Document data (for step 3)
  const [documentType, setDocumentType] = useState("")
  const [customDocumentType, setCustomDocumentType] = useState("")
  const [issuingAuthority, setIssuingAuthority] = useState("")
  const [customIssuingAuthority, setCustomIssuingAuthority] = useState("")
  const [issueDate, setIssueDate] = useState<Date | undefined>(undefined)
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined)
  const [isPermanent, setIsPermanent] = useState(false)
  const [documentNumber, setDocumentNumber] = useState("")
  const [vesselName, setVesselName] = useState("")
  const [imoNumber, setImoNumber] = useState("")

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

  const issuingAuthorities = [
    "Panama Maritime Authority",
    "Marshall Islands Maritime Administrator",
    "Liberia Maritime Authority",
    "Singapore Maritime and Port Authority",
    "DNV GL",
    "Lloyd's Register",
    "American Bureau of Shipping (ABS)",
    "Bureau Veritas (BV)",
    "ClassNK",
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

  const resetAllState = () => {
    setUploadStep(1)
    setFiles([])
    setFilePreviewUrls([])
    setSelectedPreviewIndex(0)
    setIsProcessing(false)
    setUploadComplete(false)
    setProcessingError(null)
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
    setVesselName("")
    setImoNumber("")
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
        return "/placeholder.svg?height=600&width=400&text=PDF+Document"
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

    setFiles((prev) => [...prev, ...validFiles])
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
    setFilePreviewUrls((prev) => prev.filter((_, i) => i !== index))
    if (selectedPreviewIndex >= index && selectedPreviewIndex > 0) {
      setSelectedPreviewIndex((prev) => prev - 1)
    }
  }

  // Process files and move to preview step
  const processFiles = async () => {
    if (files.length === 0 || !selectedVessel) return

    setIsProcessing(true)
    setProcessingError(null)

    try {
      // For image files, we can generate a preview directly
      if (files[0].type.startsWith("image/")) {
        // Move to preview step
        setUploadStep(2)
      }
      // For PDF files, we'll just show a placeholder in the next step
      else {
        // Move to preview step
        setUploadStep(2)
      }
    } catch (error) {
      console.error("Error processing files:", error)
      setProcessingError(error instanceof Error ? error.message : "Failed to process document")
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle document upload using the useDocumentUpload hook
  const handleSubmit = async () => {
    if (files.length === 0 || !selectedVessel) return

    try {
      // Prepare document data
      const documentData = {
        vesselId: selectedVessel,
        title: documentType === "other" ? customDocumentType : documentType,
        documentType: documentType === "other" ? customDocumentType : documentType,
        category: "General", // Default category
        issuer: issuingAuthority === "other" ? customIssuingAuthority : issuingAuthority,
        certificateNumber: documentNumber,
        issueDate: issueDate?.toISOString().split("T")[0],
        expiryDate: isPermanent ? undefined : expiryDate?.toISOString().split("T")[0],
        isPermanent,
      }

      // Use the uploadDocument function from the hook
      const result = await uploadDocument(files[0], documentData)

      if (result) {
        setUploadComplete(true)
        setUploadStep(3)

        // Call the onUploadComplete callback
        if (onUploadComplete) {
          onUploadComplete(result)
        }
      }
    } catch (error) {
      console.error("Error uploading document:", error)
      setProcessingError(error instanceof Error ? error.message : "Failed to upload document")
    }
  }

  const resetAndUploadAnother = () => {
    resetAllState()
  }

  const renderStep = () => {
    switch (uploadStep) {
      case 1:
        return (
          <div className="space-y-6 px-2">
            <div className="space-y-3">
              <Label htmlFor="vessel">Select Vessel</Label>
              <Select value={selectedVessel} onValueChange={setSelectedVessel}>
                <SelectTrigger id="vessel" className="h-12">
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
                    className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:bg-blue-50 cursor-pointer transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={(e) => {
                      e.preventDefault()
                      handleFileChange(e)
                    }}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <Upload className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                    <p className="text-lg font-medium mb-2">Drop your maritime documents here</p>
                    <p className="text-sm text-gray-600 mb-4">or click to browse files</p>
                    <p className="text-xs text-gray-500 mb-4">Supports PDF, JPG, PNG (max 10MB each)</p>
                    <Button variant="outline" size="lg">
                      <FileText className="h-4 w-4 mr-2" />
                      Select Documents
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="camera" className="pt-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Camera className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium mb-2">Capture Document Photo</p>
                    <p className="text-sm text-gray-600 mb-4">Position certificate within frame for best results</p>
                    <Button variant="outline" size="lg" disabled>
                      <Camera className="h-4 w-4 mr-2" />
                      Open Camera (Coming Soon)
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {files.length > 0 && (
              <div className="space-y-3">
                <Label>Selected Documents ({files.length})</Label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-blue-50 p-3 rounded-md border">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-3 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium truncate max-w-[300px]">
                            {file.name.replace(/\.[^/.]+$/, "")}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(0)} KB • {file.type.split("/")[1].toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isProcessing && (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Processing documents...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-xs text-gray-500">Preparing your document for upload.</p>
              </div>
            )}

            {processingError && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <AlertDescription className="text-red-800">
                  <p className="font-medium">Processing Error</p>
                  <p className="text-sm">{processingError}</p>
                </AlertDescription>
              </Alert>
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
          <div className="space-y-6 px-2">
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

              {/* File Navigation */}
              {files.length > 1 && (
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={selectedPreviewIndex === 0}
                    onClick={() => setSelectedPreviewIndex((prev) => prev - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-sm font-medium">
                    Document {selectedPreviewIndex + 1} of {files.length}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={selectedPreviewIndex === files.length - 1}
                    onClick={() => setSelectedPreviewIndex((prev) => prev + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}

              {/* Document Title */}
              <div className="text-center">
                <h4 className="text-xl font-bold text-gray-800">
                  {files[selectedPreviewIndex]?.name.replace(/\.[^/.]+$/, "") || "Document"}
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  {files[selectedPreviewIndex]?.type} • {(files[selectedPreviewIndex]?.size / 1024).toFixed(0)} KB
                </p>
              </div>

              {/* Large Preview */}
              <div className="flex justify-center items-center bg-gray-100 rounded-lg border-2 border-gray-200 min-h-[500px] p-4">
                {filePreviewUrls.length > 0 ? (
                  <img
                    src={
                      filePreviewUrls[selectedPreviewIndex] ||
                      "/placeholder.svg?height=500&width=400&text=Document+Preview"
                    }
                    alt="Document preview"
                    className="max-w-full max-h-[500px] object-contain rounded shadow-lg"
                  />
                ) : (
                  <div className="text-center text-gray-400">
                    <FileSymlink className="h-16 w-16 mx-auto mb-4" />
                    <p className="text-lg">Document preview loading...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Document Information Form */}
            <Alert className="border-blue-200 bg-blue-50">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <div className="space-y-2">
                  <p className="font-medium">Enter Document Information</p>
                  <p className="text-sm">
                    Please enter the key information for this document. This will help us organize your documents and
                    alert you before they expire.
                  </p>
                </div>
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              {/* Document Type */}
              <div className="space-y-2">
                <Label htmlFor="documentType">Document Type *</Label>
                <Select value={documentType} onValueChange={setDocumentType}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {documentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                    <SelectItem value="other">Other (specify)</SelectItem>
                  </SelectContent>
                </Select>
                {documentType === "other" && (
                  <Input
                    className="mt-2"
                    placeholder="Specify document type"
                    value={customDocumentType}
                    onChange={(e) => setCustomDocumentType(e.target.value)}
                  />
                )}
              </div>

              {/* Issuing Authority */}
              <div className="space-y-2">
                <Label htmlFor="issuingAuthority">Issuing Authority *</Label>
                <Select value={issuingAuthority} onValueChange={setIssuingAuthority}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select issuing authority" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {issuingAuthorities.map((authority) => (
                      <SelectItem key={authority} value={authority}>
                        {authority}
                      </SelectItem>
                    ))}
                    <SelectItem value="other">Other (specify)</SelectItem>
                  </SelectContent>
                </Select>
                {issuingAuthority === "other" && (
                  <Input
                    className="mt-2"
                    placeholder="Specify issuing authority"
                    value={customIssuingAuthority}
                    onChange={(e) => setCustomIssuingAuthority(e.target.value)}
                  />
                )}
              </div>

              {/* Document Number */}
              <div className="space-y-2">
                <Label htmlFor="documentNumber">Certificate/Document Number</Label>
                <Input
                  id="documentNumber"
                  className="h-12"
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
                        "w-full justify-start text-left font-normal h-12",
                        !issueDate && "text-muted-foreground",
                      )}
                    >
                      <Calendar className="mr-2 h-5 w-5" />
                      {issueDate ? format(issueDate, "PPP") : <span>Select issue date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent mode="single" selected={issueDate} onSelect={setIssueDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Expiry Date */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className={isPermanent ? "text-gray-400" : ""}>Expiry Date</Label>
                  <div className="flex items-center space-x-2">
                    <Switch id="permanent" checked={isPermanent} onCheckedChange={setIsPermanent} />
                    <Label htmlFor="permanent" className="text-sm cursor-pointer">
                      No Expiry
                    </Label>
                  </div>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-12",
                        (!expiryDate || isPermanent) && "text-muted-foreground",
                      )}
                      disabled={isPermanent}
                    >
                      <Calendar className="mr-2 h-5 w-5" />
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

            {uploadError && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <AlertDescription className="text-red-800">
                  <p className="font-medium">Upload Error</p>
                  <p className="text-sm">{uploadError}</p>
                </AlertDescription>
              </Alert>
            )}

            {isUploading && (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Uploading document...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </div>
        )

      case 3:
        return (
          <div className="space-y-6 text-center px-4">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900">Document Successfully Uploaded!</h3>
            <p className="text-gray-600 text-lg">
              Your maritime document has been securely stored and is now available in your vessel's document library.
            </p>

            <Card className="mt-8 text-left">
              <CardContent className="p-6">
                <h4 className="font-semibold mb-4">Upload Summary</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vessel:</span>
                    <span className="font-medium">{vessels.find((v) => v.id === selectedVessel)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Document Type:</span>
                    <span className="font-medium">{documentType === "other" ? customDocumentType : documentType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Issuing Authority:</span>
                    <span className="font-medium">
                      {issuingAuthority === "other" ? customIssuingAuthority : issuingAuthority}
                    </span>
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
              onClick={processFiles}
              disabled={files.length === 0 || !selectedVessel || isProcessing}
              className="h-12 px-6"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </>
        )

      case 2:
        const isFormValid =
          documentType &&
          (documentType !== "other" || customDocumentType) &&
          issuingAuthority &&
          (issuingAuthority !== "other" || customIssuingAuthority) &&
          issueDate &&
          (isPermanent || expiryDate)

        return (
          <>
            <Button variant="outline" onClick={() => setUploadStep(1)} className="h-12 px-6">
              Back
            </Button>
            <Button onClick={handleSubmit} disabled={!isFormValid || isUploading} className="h-12 px-6">
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload Document"
              )}
            </Button>
          </>
        )

      case 3:
        return (
          <>
            <Button variant="outline" onClick={resetAndUploadAnother} className="h-12 px-6">
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
        return "Upload Maritime Document"
      case 2:
        return "Document Information"
      case 3:
        return "Upload Complete"
      default:
        return "Upload Document"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{getStepTitle()}</DialogTitle>
        </DialogHeader>

        {/* Step indicator */}
        {uploadStep < 4 && (
          <div className="flex items-center justify-between mb-6 px-2">
            <div className="w-full">
              <div className="flex justify-between mb-2">
                <span className={`text-sm font-medium ${uploadStep >= 1 ? "text-blue-600" : "text-gray-400"}`}>
                  Select Document
                </span>
                <span className={`text-sm font-medium ${uploadStep >= 2 ? "text-blue-600" : "text-gray-400"}`}>
                  Enter Details
                </span>
                <span className={`text-sm font-medium ${uploadStep >= 3 ? "text-blue-600" : "text-gray-400"}`}>
                  Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${(uploadStep / 3) * 100}%` }}
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
