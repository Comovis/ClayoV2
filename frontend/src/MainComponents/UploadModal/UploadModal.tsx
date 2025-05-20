"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Camera, X, Ship, FileText, Calendar, CheckCircle, Loader2, FileSymlink, Search } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

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
  // Step management
  const [uploadStep, setUploadStep] = useState(1)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)

  // File management
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [filePreviewUrls, setFilePreviewUrls] = useState<string[]>([])
  const [selectedPreviewIndex, setSelectedPreviewIndex] = useState(0)

  // Custom document type and issuing authority
  const [customDocumentType, setCustomDocumentType] = useState("")
  const [customIssuingAuthority, setCustomIssuingAuthority] = useState("")

  // Vessel selection
  const [selectedVessel, setSelectedVessel] = useState(initialVesselId || "")

  // Document details
  const [documentType, setDocumentType] = useState("")
  const [issuingAuthority, setIssuingAuthority] = useState("")
  const [issueDate, setIssueDate] = useState<Date | undefined>(new Date())
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined)
  const [isPermanent, setIsPermanent] = useState(false)
  const [documentNumber, setDocumentNumber] = useState("")

  // OCR results
  const [ocrResults, setOcrResults] = useState<any>(null)

  // State for filtering
  const [documentTypeFilter, setDocumentTypeFilter] = useState("")
  const [issuingAuthorityFilter, setIssuingAuthorityFilter] = useState("")

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedVessel(initialVesselId || "")
    } else {
      // Reset state when modal closes
      setUploadStep(1)
      setFiles([])
      setFilePreviewUrls([])
      setSelectedPreviewIndex(0)
      setUploadProgress(0)
      setIsProcessing(false)
      setUploadComplete(false)
      setDocumentType("")
      setCustomDocumentType("")
      setIssuingAuthority("")
      setCustomIssuingAuthority("")
      setIssueDate(new Date())
      setExpiryDate(undefined)
      setIsPermanent(false)
      setDocumentNumber("")
      setOcrResults(null)
      setDocumentTypeFilter("")
      setIssuingAuthorityFilter("")
    }
  }, [isOpen, initialVesselId])

  // Generate preview URLs for files
  useEffect(() => {
    // Revoke previous URLs to prevent memory leaks
    filePreviewUrls.forEach((url) => URL.revokeObjectURL(url))

    // Create new preview URLs
    const newPreviewUrls = files.map((file) => {
      if (file.type === "application/pdf") {
        // For PDFs, we'll use a placeholder icon
        return "/pdf-document.png"
      } else {
        // For images, create object URLs
        return URL.createObjectURL(file)
      }
    })

    setFilePreviewUrls(newPreviewUrls)

    // Cleanup function to revoke URLs when component unmounts
    return () => {
      newPreviewUrls.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url)
        }
      })
    }
  }, [files])

  // Vessel data - replace with your actual data source
  const vessels = [
    { id: "Humble Warrior", name: "Humble Warrior", type: "Crude Oil Tanker", flag: "Panama" },
    { id: "Pacific Explorer", name: "Pacific Explorer", type: "Container Ship", flag: "Singapore" },
    { id: "Northern Star", name: "Northern Star", type: "Bulk Carrier", flag: "Marshall Islands" },
  ]

  // Document types - replace with your actual data
  const documentTypes = [
    // SOLAS Certificates
    "Safety Management Certificate (SMC)",
    "Document of Compliance (DOC)",
    "Passenger Ship Safety Certificate",
    "Cargo Ship Safety Certificate",
    "Cargo Ship Safety Construction Certificate",
    "Cargo Ship Safety Equipment Certificate",
    "Cargo Ship Safety Radio Certificate",
    "International Ship Security Certificate (ISSC)",
    "Continuous Synopsis Record (CSR)",

    // MARPOL Certificates
    "International Oil Pollution Prevention Certificate (IOPP)",
    "International Air Pollution Prevention Certificate (IAPP)",
    "International Sewage Pollution Prevention Certificate (ISPP)",
    "International Energy Efficiency Certificate (IEEC)",
    "International Ballast Water Management Certificate",

    // Other IMO Certificates
    "International Load Line Certificate",
    "International Tonnage Certificate",
    "Minimum Safe Manning Document",
    "Certificate of Registry",
    "Maritime Labour Certificate (MLC)",
    "Ship Sanitation Control Certificate",

    // Class Certificates
    "Classification Certificate",
    "Statutory Certificate",
    "Certificate of Class",

    // Trading Certificates
    "Certificate of Financial Responsibility (COFR)",
    "Civil Liability for Oil Pollution Damage (CLC)",
    "Bunker Civil Liability Certificate",
    "Wreck Removal Certificate",

    // Crew Certificates
    "Crew List",
    "Seafarer Employment Agreements",
    "Certificates of Competency",
    "Medical Certificates",

    // Other
    "Ship Security Plan",
    "Garbage Management Plan",
    "Ballast Water Management Plan",
    "Ship Energy Efficiency Management Plan (SEEMP)",
    "Emergency Response Plan",
  ]

  // Document types grouped by category
  const documentTypeGroups = {
    "SOLAS Certificates": documentTypes.slice(0, 9),
    "MARPOL Certificates": documentTypes.slice(9, 14),
    "Other IMO Certificates": documentTypes.slice(14, 20),
    "Class Certificates": documentTypes.slice(20, 23),
    "Trading Certificates": documentTypes.slice(23, 27),
    "Crew Certificates": documentTypes.slice(27, 31),
    Other: documentTypes.slice(31),
  }

  // Issuing authorities - replace with your actual data
  const issuingAuthorities = [
    // Flag State Administrations
    "Panama Maritime Authority",
    "Marshall Islands Maritime Administrator",
    "Liberia Maritime Authority",
    "Singapore Maritime and Port Authority",
    "Bahamas Maritime Authority",
    "Malta Maritime Authority",
    "Cyprus Department of Merchant Shipping",
    "Hong Kong Marine Department",

    // Classification Societies
    "DNV GL",
    "Lloyd's Register",
    "American Bureau of Shipping (ABS)",
    "Bureau Veritas (BV)",
    "ClassNK",
    "RINA",
    "China Classification Society (CCS)",
    "Korean Register (KR)",
    "Russian Maritime Register of Shipping",
    "Indian Register of Shipping",

    // Other Organizations
    "International Maritime Organization (IMO)",
    "International Labour Organization (ILO)",
    "Port State Control",
    "Maritime and Coastguard Agency (UK)",
    "United States Coast Guard (USCG)",
  ]

  // Issuing authorities grouped by category
  const issuingAuthorityGroups = {
    "Flag State Administrations": issuingAuthorities.slice(0, 8),
    "Classification Societies": issuingAuthorities.slice(8, 18),
    "Other Organizations": issuingAuthorities.slice(18),
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    let selectedFiles: File[] = []

    if ("dataTransfer" in e && e.dataTransfer?.files) {
      selectedFiles = Array.from(e.dataTransfer.files)
    } else if ("target" in e && e.target.files) {
      selectedFiles = Array.from(e.target.files)
    }

    // Filter for valid file types and sizes
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

  const processFiles = async () => {
    if (files.length === 0 || !selectedVessel) return

    setIsProcessing(true)
    setUploadProgress(0)

    // Create FormData for file upload
    const formData = new FormData()
    files.forEach((file) => {
      formData.append("files", file)
    })
    formData.append("vesselId", selectedVessel)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // In a real implementation, you would make an API call here
      // const response = await fetch('/api/documents/upload', {
      //   method: 'POST',
      //   body: formData
      // })
      // const data = await response.json()

      // For now, simulate OCR processing
      setTimeout(() => {
        clearInterval(progressInterval)
        setUploadProgress(100)

        // Mock OCR results based on file name patterns
        // In a real implementation, this would come from your backend OCR service
        let mockOcrResults = {}

        if (files[0].name.toLowerCase().includes("safety")) {
          mockOcrResults = {
            documentType: "Safety Management Certificate (SMC)",
            issueDate: new Date("2023-01-15"),
            expiryDate: new Date("2023-11-15"),
            issuingAuthority: "Panama Maritime Authority",
            documentNumber: "SMC-2023-12345",
          }
        } else if (files[0].name.toLowerCase().includes("pollution")) {
          mockOcrResults = {
            documentType: "International Oil Pollution Prevention Certificate (IOPP)",
            issueDate: new Date("2023-02-10"),
            expiryDate: new Date("2023-12-10"),
            issuingAuthority: "DNV GL",
            documentNumber: "IOPP-2023-67890",
          }
        } else {
          // Default values if no pattern match
          mockOcrResults = {
            documentType: "",
            issueDate: new Date(),
            expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            issuingAuthority: "",
            documentNumber: "",
          }
        }

        setOcrResults(mockOcrResults)

        // Pre-fill form with OCR results
        setDocumentType(mockOcrResults.documentType || "")
        setIssueDate(mockOcrResults.issueDate)
        setExpiryDate(mockOcrResults.expiryDate)
        setIssuingAuthority(mockOcrResults.issuingAuthority || "")
        setDocumentNumber(mockOcrResults.documentNumber || "")

        setIsProcessing(false)
        setUploadStep(2)
      }, 2000)
    } catch (error) {
      console.error("Error uploading files:", error)
      setIsProcessing(false)
      // Show error notification
    }
  }

  const handleSubmit = async () => {
    setIsProcessing(true)

    // Handle "Other" document type
    const finalDocumentType = documentType === "other" ? customDocumentType : documentType

    // Handle "Other" issuing authority
    const finalIssuingAuthority = issuingAuthority === "other" ? customIssuingAuthority : issuingAuthority

    const documentData = {
      vesselId: selectedVessel,
      documentType: finalDocumentType,
      issuingAuthority: finalIssuingAuthority,
      issueDate,
      expiryDate: isPermanent ? null : expiryDate,
      isPermanent,
      documentNumber,
      fileIds: files.map((f, i) => `file-${i}`), // You'd get real IDs from your upload API
    }

    try {
      // In a real implementation, you would make an API call here
      // const response = await fetch('/api/documents', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(documentData)
      // })
      // const data = await response.json()

      // Simulate API call
      setTimeout(() => {
        setIsProcessing(false)
        setUploadComplete(true)
        setUploadStep(3)

        // Call the onUploadComplete callback with the document data
        if (onUploadComplete) {
          onUploadComplete(documentData)
        }
      }, 1500)
    } catch (error) {
      console.error("Error saving document:", error)
      setIsProcessing(false)
      // Show error notification
    }
  }

  const resetAndUploadAnother = () => {
    setUploadStep(1)
    setFiles([])
    setFilePreviewUrls([])
    setSelectedPreviewIndex(0)
    setUploadProgress(0)
    setIsProcessing(false)
    setUploadComplete(false)
    setDocumentType("")
    setCustomDocumentType("")
    setIssuingAuthority("")
    setCustomIssuingAuthority("")
    setIssueDate(new Date())
    setExpiryDate(undefined)
    setIsPermanent(false)
    setDocumentNumber("")
    setOcrResults(null)
    setDocumentTypeFilter("")
    setIssuingAuthorityFilter("")
  }

  // Render different steps of the upload process
  const renderStep = () => {
    switch (uploadStep) {
      case 1:
        return (
          <div className="space-y-6 px-2">
            <div className="space-y-3">
              <Label htmlFor="vessel">Vessel</Label>
              <Select value={selectedVessel} onValueChange={setSelectedVessel}>
                <SelectTrigger id="vessel" className="h-12">
                  <SelectValue placeholder="Select vessel" />
                </SelectTrigger>
                <SelectContent>
                  {vessels.map((vessel) => (
                    <SelectItem key={vessel.id} value={vessel.id}>
                      <div className="flex items-center">
                        <Ship className="h-4 w-4 mr-2 text-blue-500" />
                        <span>{vessel.name}</span>
                        <span className="ml-2 text-gray-500 text-xs">({vessel.type})</span>
                      </div>
                    </SelectItem>
                  ))}
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
                    className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-gray-50 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={(e) => {
                      e.preventDefault()
                      handleFileChange(e)
                    }}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <Upload className="h-10 w-10 mx-auto mb-3 text-gray-400" />
                    <p className="text-base font-medium mb-2">Drag and drop or click to upload</p>
                    <p className="text-sm text-gray-500 mb-3">PDF, JPG, PNG (max 10MB)</p>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={(e) => {
                        e.stopPropagation()
                        fileInputRef.current?.click()
                      }}
                    >
                      Select Files
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="camera" className="pt-4">
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Camera className="h-10 w-10 mx-auto mb-3 text-gray-400" />
                    <p className="text-base font-medium mb-2">Take a photo of your document</p>
                    <p className="text-sm text-gray-500 mb-3">Position document within frame</p>
                    <Button variant="outline" size="lg">
                      Open Camera
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {files.length > 0 && (
              <div className="space-y-3">
                <Label>Selected Files</Label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-3 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium truncate max-w-[300px]">{file.name}</p>
                          <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(0)} KB</p>
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
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </div>
        )

      case 2:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2">
            {/* Document Preview Panel */}
            <div className="space-y-6 order-2 md:order-1">
              <div className="border rounded-md p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-base font-medium">Preview</h3>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={selectedPreviewIndex === 0}
                      onClick={() => setSelectedPreviewIndex((prev) => prev - 1)}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-gray-500">
                      {selectedPreviewIndex + 1} of {files.length}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={selectedPreviewIndex === files.length - 1}
                      onClick={() => setSelectedPreviewIndex((prev) => prev + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>

                <div className="flex justify-center items-center bg-gray-50 rounded-md h-[350px] overflow-hidden">
                  {filePreviewUrls.length > 0 ? (
                    <img
                      src={filePreviewUrls[selectedPreviewIndex] || "/placeholder.svg"}
                      alt="Document preview"
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <FileSymlink className="h-14 w-14 mx-auto mb-3" />
                      <p>No preview available</p>
                    </div>
                  )}
                </div>

                <div className="mt-3 flex justify-between items-center">
                  <span className="text-sm text-gray-500">{files[selectedPreviewIndex]?.name || ""}</span>
                  <Button variant="outline" size="sm">
                    <Search className="h-4 w-4 mr-1" />
                    Zoom
                  </Button>
                </div>
              </div>
            </div>

            {/* Document Details Form */}
            <div className="space-y-6 order-1 md:order-2">
              <div className="space-y-3">
                <Label htmlFor="documentType">Document Type</Label>
                {ocrResults && (
                  <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-4">
                    <div className="flex items-start">
                      <div className="bg-blue-100 rounded-full p-1 mr-3">
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-base font-medium text-blue-800">Document details extracted</p>
                        <p className="text-sm text-blue-600">
                          We've pre-filled the form based on the document. Please verify all information.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <Select value={documentType} onValueChange={setDocumentType}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search document types..."
                        className="pl-8 h-10 mb-2"
                        onChange={(e) => setDocumentTypeFilter(e.target.value)}
                      />
                    </div>
                    {Object.entries(documentTypeGroups).map(([groupName, types]) => {
                      const filteredTypes = types.filter(
                        (type) => !documentTypeFilter || type.toLowerCase().includes(documentTypeFilter.toLowerCase()),
                      )
                      if (filteredTypes.length === 0) return null

                      return (
                        <div key={groupName} className="pt-2">
                          <div className="text-xs font-medium text-muted-foreground px-2 py-1.5">{groupName}</div>
                          {filteredTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </div>
                      )
                    })}
                    <div className="pt-2">
                      <div className="text-xs font-medium text-muted-foreground px-2 py-1.5">Other</div>
                      <SelectItem value="other">Other (specify)</SelectItem>
                    </div>
                  </SelectContent>
                </Select>

                {documentType === "other" && (
                  <Input
                    className="mt-2 h-12"
                    placeholder="Specify document type"
                    value={customDocumentType}
                    onChange={(e) => setCustomDocumentType(e.target.value)}
                  />
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="issuingAuthority">Issuing Authority</Label>
                <Select value={issuingAuthority} onValueChange={setIssuingAuthority}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select issuing authority" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search issuing authorities..."
                        className="pl-8 h-10 mb-2"
                        onChange={(e) => setIssuingAuthorityFilter(e.target.value)}
                      />
                    </div>
                    {Object.entries(issuingAuthorityGroups).map(([groupName, authorities]) => {
                      const filteredAuthorities = authorities.filter(
                        (authority) =>
                          !issuingAuthorityFilter ||
                          authority.toLowerCase().includes(issuingAuthorityFilter.toLowerCase()),
                      )
                      if (filteredAuthorities.length === 0) return null

                      return (
                        <div key={groupName} className="pt-2">
                          <div className="text-xs font-medium text-muted-foreground px-2 py-1.5">{groupName}</div>
                          {filteredAuthorities.map((authority) => (
                            <SelectItem key={authority} value={authority}>
                              {authority}
                            </SelectItem>
                          ))}
                        </div>
                      )
                    })}
                    <div className="pt-2">
                      <div className="text-xs font-medium text-muted-foreground px-2 py-1.5">Other</div>
                      <SelectItem value="other">Other (specify)</SelectItem>
                    </div>
                  </SelectContent>
                </Select>

                {issuingAuthority === "other" && (
                  <Input
                    className="mt-2 h-12"
                    placeholder="Specify issuing authority"
                    value={customIssuingAuthority}
                    onChange={(e) => setCustomIssuingAuthority(e.target.value)}
                  />
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="documentNumber">Document Number</Label>
                <Input
                  id="documentNumber"
                  className="h-12"
                  placeholder="Enter document number or identifier"
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="issueDate">Issue Date</Label>
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
                        {issueDate ? format(issueDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent mode="single" selected={issueDate} onSelect={setIssueDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="expiryDate" className={isPermanent ? "text-gray-400" : ""}>
                      Expiry Date
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Switch id="permanent" checked={isPermanent} onCheckedChange={setIsPermanent} />
                      <Label htmlFor="permanent" className="text-sm cursor-pointer">
                        Permanent
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
                          <span>{isPermanent ? "N/A (Permanent)" : "Pick a date"}</span>
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

              {isProcessing && (
                <div className="flex justify-center items-center py-3">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Processing...</span>
                </div>
              )}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6 text-center px-4">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>

            <h3 className="text-2xl font-bold">Document Uploaded Successfully</h3>
            <p className="text-gray-500 text-lg">
              Your document has been uploaded and added to the vessel's document library.
            </p>

            <Card className="mt-8">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-lg">Vessel:</span>
                    <span className="font-medium text-lg">{vessels.find((v) => v.id === selectedVessel)?.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-lg">Document Type:</span>
                    <span className="font-medium text-lg">
                      {documentType === "other" ? customDocumentType : documentType}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-lg">Issuing Authority:</span>
                    <span className="font-medium text-lg">
                      {issuingAuthority === "other" ? customIssuingAuthority : issuingAuthority}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-lg">Issue Date:</span>
                    <span className="font-medium text-lg">{issueDate ? format(issueDate, "PPP") : "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-lg">Expiry Date:</span>
                    <span className="font-medium text-lg">
                      {isPermanent ? "Permanent" : expiryDate ? format(expiryDate, "PPP") : "N/A"}
                    </span>
                  </div>
                  {documentNumber && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-lg">Document Number:</span>
                      <span className="font-medium text-lg">{documentNumber}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  // Render footer buttons based on current step
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
                  Processing
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </>
        )

      case 2:
        const isDocumentTypeValid = documentType && (documentType !== "other" || customDocumentType)
        const isIssuingAuthorityValid = issuingAuthority && (issuingAuthority !== "other" || customIssuingAuthority)

        return (
          <>
            <Button variant="outline" onClick={() => setUploadStep(1)} className="h-12 px-6">
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                !isDocumentTypeValid ||
                !isIssuingAuthorityValid ||
                (!expiryDate && !isPermanent) ||
                !issueDate ||
                isProcessing
              }
              className="h-12 px-6"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Saving
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
              Upload Another
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

  // Get step title based on current step
  const getStepTitle = () => {
    switch (uploadStep) {
      case 1:
        return "Upload Document"
      case 2:
        return "Document Details"
      case 3:
        return "Upload Complete"
      default:
        return "Upload Document"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[850px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{getStepTitle()}</DialogTitle>
        </DialogHeader>

        {/* Step indicator */}
        {uploadStep < 3 && (
          <div className="flex items-center justify-between mb-6 px-2">
            <div className="w-full">
              <div className="flex justify-between mb-2">
                <span className={`text-sm font-medium ${uploadStep >= 1 ? "text-blue-600" : "text-gray-400"}`}>
                  File Selection
                </span>
                <span className={`text-sm font-medium ${uploadStep >= 2 ? "text-blue-600" : "text-gray-400"}`}>
                  Document Details
                </span>
                <span className="text-sm font-medium text-gray-400">Complete</span>
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
