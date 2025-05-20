"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Upload,
  Camera,
  X,
  Ship,
  FileText,
  Calendar,
  CheckCircle,
  Loader2,
  Search,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Check,
  Edit,
  Trash2,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface BatchUploadModalProps {
  isOpen: boolean
  onClose: () => void
  initialVesselId?: string
  onUploadComplete?: (documentData: any[]) => void
}

// Document types and issuing authorities data
const documentTypeGroups = {
  "SOLAS Certificates": [
    "Safety Management Certificate (SMC)",
    "Document of Compliance (DOC)",
    "Passenger Ship Safety Certificate",
    "Cargo Ship Safety Certificate",
    "Cargo Ship Safety Construction Certificate",
    "Cargo Ship Safety Equipment Certificate",
    "Cargo Ship Safety Radio Certificate",
    "International Ship Security Certificate (ISSC)",
    "Continuous Synopsis Record (CSR)",
  ],
  "MARPOL Certificates": [
    "International Oil Pollution Prevention Certificate (IOPP)",
    "International Air Pollution Prevention Certificate (IAPP)",
    "International Sewage Pollution Prevention Certificate (ISPP)",
    "International Energy Efficiency Certificate (IEEC)",
    "International Ballast Water Management Certificate",
  ],
  "Other IMO Certificates": [
    "International Load Line Certificate",
    "International Tonnage Certificate",
    "Minimum Safe Manning Document",
    "Certificate of Registry",
    "Maritime Labour Certificate (MLC)",
    "Ship Sanitation Control Certificate",
  ],
  "Class Certificates": ["Classification Certificate", "Statutory Certificate", "Certificate of Class"],
  "Trading Certificates": [
    "Certificate of Financial Responsibility (COFR)",
    "Civil Liability for Oil Pollution Damage (CLC)",
    "Bunker Civil Liability Certificate",
    "Wreck Removal Certificate",
  ],
  "Crew Certificates": [
    "Crew List",
    "Seafarer Employment Agreements",
    "Certificates of Competency",
    "Medical Certificates",
  ],
  Other: [
    "Ship Security Plan",
    "Garbage Management Plan",
    "Ballast Water Management Plan",
    "Ship Energy Efficiency Management Plan (SEEMP)",
    "Emergency Response Plan",
  ],
}

const issuingAuthorityGroups = {
  "Flag State Administrations": [
    "Panama Maritime Authority",
    "Marshall Islands Maritime Administrator",
    "Liberia Maritime Authority",
    "Singapore Maritime and Port Authority",
    "Bahamas Maritime Authority",
    "Malta Maritime Authority",
    "Cyprus Department of Merchant Shipping",
    "Hong Kong Marine Department",
  ],
  "Classification Societies": [
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
  ],
  "Other Organizations": [
    "International Maritime Organization (IMO)",
    "International Labour Organization (ILO)",
    "Port State Control",
    "Maritime and Coastguard Agency (UK)",
    "United States Coast Guard (USCG)",
  ],
}

// Flatten the groups for easier access
const allDocumentTypes = Object.values(documentTypeGroups).flat()
const allIssuingAuthorities = Object.values(issuingAuthorityGroups).flat()

// Document file interface
interface DocumentFile {
  id: string
  file: File
  previewUrl: string
  status: "pending" | "processing" | "extracted" | "completed" | "error"
  documentType: string
  customDocumentType?: string
  issuingAuthority: string
  customIssuingAuthority?: string
  documentNumber: string
  issueDate?: Date
  expiryDate?: Date
  isPermanent: boolean
  extractedData?: any
  isSelected: boolean
  isEditing: boolean
}

export default function BatchUploadModal({
  isOpen,
  onClose,
  initialVesselId,
  onUploadComplete,
}: BatchUploadModalProps) {
  // Step management
  const [uploadStep, setUploadStep] = useState(1)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)

  // Vessel selection
  const [selectedVessel, setSelectedVessel] = useState(initialVesselId || "")

  // File management
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [documentFiles, setDocumentFiles] = useState<DocumentFile[]>([])
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(null)

  // Batch editing
  const [isBatchEditing, setIsBatchEditing] = useState(false)
  const [batchDocumentType, setBatchDocumentType] = useState("")
  const [batchCustomDocumentType, setBatchCustomDocumentType] = useState("")
  const [batchIssuingAuthority, setBatchIssuingAuthority] = useState("")
  const [batchCustomIssuingAuthority, setBatchCustomIssuingAuthority] = useState("")
  const [batchIssueDate, setBatchIssueDate] = useState<Date | undefined>(new Date())
  const [batchExpiryDate, setBatchExpiryDate] = useState<Date | undefined>(undefined)
  const [batchIsPermanent, setBatchIsPermanent] = useState(false)

  // Filters
  const [documentTypeFilter, setDocumentTypeFilter] = useState("")
  const [issuingAuthorityFilter, setIssuingAuthorityFilter] = useState("")

  // Ref for scrolling
  const contentRef = useRef<HTMLDivElement>(null)

  // Vessel data - replace with your actual data source
  const vessels = [
    { id: "Humble Warrior", name: "Humble Warrior", type: "Crude Oil Tanker", flag: "Panama" },
    { id: "Pacific Explorer", name: "Pacific Explorer", type: "Container Ship", flag: "Singapore" },
    { id: "Northern Star", name: "Northern Star", type: "Bulk Carrier", flag: "Marshall Islands" },
  ]

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedVessel(initialVesselId || "")
    } else {
      // Reset state when modal closes
      setUploadStep(1)
      setDocumentFiles([])
      setSelectedFileIndex(null)
      setUploadProgress(0)
      setIsProcessing(false)
      setUploadComplete(false)
      setIsBatchEditing(false)
      setBatchDocumentType("")
      setBatchCustomDocumentType("")
      setBatchIssuingAuthority("")
      setBatchCustomIssuingAuthority("")
      setBatchIssueDate(new Date())
      setBatchExpiryDate(undefined)
      setBatchIsPermanent(false)
      setDocumentTypeFilter("")
      setIssuingAuthorityFilter("")
    }
  }, [isOpen, initialVesselId])

  // Scroll to top when step changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0
    }
  }, [uploadStep])

  // Generate preview URLs for files
  useEffect(() => {
    // Cleanup function to revoke URLs when component unmounts
    return () => {
      documentFiles.forEach((doc) => {
        if (doc.previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(doc.previewUrl)
        }
      })
    }
  }, [documentFiles])

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

    // Create document file objects
    const newDocumentFiles = validFiles.map((file) => {
      const previewUrl = file.type === "application/pdf" ? "/pdf-document.png" : URL.createObjectURL(file)

      return {
        id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        file,
        previewUrl,
        status: "pending",
        documentType: "",
        issuingAuthority: "",
        documentNumber: "",
        issueDate: new Date(),
        expiryDate: undefined,
        isPermanent: false,
        isSelected: false,
        isEditing: false,
      }
    })

    setDocumentFiles((prev) => [...prev, ...newDocumentFiles])
  }

  const removeFile = (id: string) => {
    setDocumentFiles((prev) => {
      const fileIndex = prev.findIndex((doc) => doc.id === id)
      if (fileIndex === -1) return prev

      // If removing the currently selected file
      if (selectedFileIndex === fileIndex) {
        setSelectedFileIndex(prev.length > 1 ? 0 : null)
      } else if (selectedFileIndex !== null && fileIndex < selectedFileIndex) {
        // Adjust selected index if removing a file before it
        setSelectedFileIndex(selectedFileIndex - 1)
      }

      return prev.filter((doc) => doc.id !== id)
    })
  }

  const toggleFileSelection = (id: string) => {
    setDocumentFiles((prev) => prev.map((doc) => (doc.id === id ? { ...doc, isSelected: !doc.isSelected } : doc)))
  }

  const selectAllFiles = (select: boolean) => {
    setDocumentFiles((prev) => prev.map((doc) => ({ ...doc, isSelected: select })))
  }

  const toggleFileEditing = (id: string) => {
    setDocumentFiles((prev) => prev.map((doc) => (doc.id === id ? { ...doc, isEditing: !doc.isEditing } : doc)))
  }

  const updateFile = (id: string, updates: Partial<DocumentFile>) => {
    setDocumentFiles((prev) => prev.map((doc) => (doc.id === id ? { ...doc, ...updates } : doc)))
  }

  const applyBatchChanges = () => {
    setDocumentFiles((prev) =>
      prev.map((doc) => {
        if (!doc.isSelected) return doc

        const updates: Partial<DocumentFile> = {}

        if (batchDocumentType) {
          updates.documentType = batchDocumentType
          if (batchDocumentType === "other") {
            updates.customDocumentType = batchCustomDocumentType
          }
        }

        if (batchIssuingAuthority) {
          updates.issuingAuthority = batchIssuingAuthority
          if (batchIssuingAuthority === "other") {
            updates.customIssuingAuthority = batchCustomIssuingAuthority
          }
        }

        if (batchIssueDate) {
          updates.issueDate = batchIssueDate
        }

        if (batchIsPermanent) {
          updates.isPermanent = true
          updates.expiryDate = undefined
        } else if (batchExpiryDate) {
          updates.isPermanent = false
          updates.expiryDate = batchExpiryDate
        }

        return { ...doc, ...updates }
      }),
    )

    // Reset batch editing state
    setIsBatchEditing(false)
    setBatchDocumentType("")
    setBatchCustomDocumentType("")
    setBatchIssuingAuthority("")
    setBatchCustomIssuingAuthority("")
    setBatchIssueDate(new Date())
    setBatchExpiryDate(undefined)
    setBatchIsPermanent(false)
  }

  const processFiles = async () => {
    if (documentFiles.length === 0 || !selectedVessel) return

    setIsProcessing(true)
    setUploadProgress(0)

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

      // Process each file with OCR (simulated)
      const updatedFiles = [...documentFiles]

      for (let i = 0; i < updatedFiles.length; i++) {
        updatedFiles[i].status = "processing"
        setDocumentFiles([...updatedFiles])

        // Simulate OCR processing delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Mock OCR results based on file name patterns
        let extractedData = {}
        const fileName = updatedFiles[i].file.name.toLowerCase()

        if (fileName.includes("safety")) {
          extractedData = {
            documentType: "Safety Management Certificate (SMC)",
            issueDate: new Date("2023-01-15"),
            expiryDate: new Date("2023-11-15"),
            issuingAuthority: "Panama Maritime Authority",
            documentNumber: "SMC-2023-12345",
          }
        } else if (fileName.includes("pollution")) {
          extractedData = {
            documentType: "International Oil Pollution Prevention Certificate (IOPP)",
            issueDate: new Date("2023-02-10"),
            expiryDate: new Date("2023-12-10"),
            issuingAuthority: "DNV GL",
            documentNumber: "IOPP-2023-67890",
          }
        } else if (fileName.includes("crew")) {
          extractedData = {
            documentType: "Crew List",
            issueDate: new Date("2023-03-05"),
            expiryDate: new Date("2023-09-05"),
            issuingAuthority: "Marshall Islands Maritime Administrator",
            documentNumber: "CL-2023-54321",
          }
        } else {
          // Default values if no pattern match
          extractedData = {
            documentType: "",
            issueDate: new Date(),
            expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            issuingAuthority: "",
            documentNumber: `DOC-${Math.floor(Math.random() * 10000)}`,
          }
        }

        // Update file with extracted data
        updatedFiles[i] = {
          ...updatedFiles[i],
          status: "extracted",
          documentType: extractedData.documentType || "",
          issueDate: extractedData.issueDate,
          expiryDate: extractedData.expiryDate,
          issuingAuthority: extractedData.issuingAuthority || "",
          documentNumber: extractedData.documentNumber || "",
          extractedData,
        }

        setDocumentFiles([...updatedFiles])
      }

      clearInterval(progressInterval)
      setUploadProgress(100)
      setIsProcessing(false)
      setUploadStep(2)

      // Select the first file for editing
      if (documentFiles.length > 0) {
        setSelectedFileIndex(0)
      }
    } catch (error) {
      console.error("Error processing files:", error)
      setIsProcessing(false)
      // Show error notification
    }
  }

  const handleSubmit = async () => {
    setIsProcessing(true)

    try {
      // Prepare document data for submission
      const documentsData = documentFiles.map((doc) => {
        // Handle "Other" document type and issuing authority
        const finalDocumentType = doc.documentType === "other" ? doc.customDocumentType : doc.documentType
        const finalIssuingAuthority =
          doc.issuingAuthority === "other" ? doc.customIssuingAuthority : doc.issuingAuthority

        return {
          vesselId: selectedVessel,
          documentType: finalDocumentType,
          issuingAuthority: finalIssuingAuthority,
          issueDate: doc.issueDate,
          expiryDate: doc.isPermanent ? null : doc.expiryDate,
          isPermanent: doc.isPermanent,
          documentNumber: doc.documentNumber,
          fileId: doc.id,
          fileName: doc.file.name,
        }
      })

      // Simulate API call
      setTimeout(() => {
        setIsProcessing(false)
        setUploadComplete(true)
        setUploadStep(3)

        // Call the onUploadComplete callback with the document data
        if (onUploadComplete) {
          onUploadComplete(documentsData)
        }
      }, 1500)
    } catch (error) {
      console.error("Error saving documents:", error)
      setIsProcessing(false)
      // Show error notification
    }
  }

  const resetAndUploadAnother = () => {
    setUploadStep(1)
    setDocumentFiles([])
    setSelectedFileIndex(null)
    setUploadProgress(0)
    setIsProcessing(false)
    setUploadComplete(false)
    setIsBatchEditing(false)
  }

  // Filter document types based on search
  const filterDocumentTypes = (group: string[]) => {
    if (!documentTypeFilter) return group
    return group.filter((item) => item.toLowerCase().includes(documentTypeFilter.toLowerCase()))
  }

  // Filter issuing authorities based on search
  const filterIssuingAuthorities = (group: string[]) => {
    if (!issuingAuthorityFilter) return group
    return group.filter((item) => item.toLowerCase().includes(issuingAuthorityFilter.toLowerCase()))
  }

  // Get the currently selected file
  const selectedFile = selectedFileIndex !== null ? documentFiles[selectedFileIndex] : null

  // Count selected files
  const selectedFilesCount = documentFiles.filter((doc) => doc.isSelected).length

  // Check if all files are selected
  const allFilesSelected = documentFiles.length > 0 && documentFiles.every((doc) => doc.isSelected)

  // Check if all files have required data
  const allFilesComplete =
    documentFiles.length > 0 &&
    documentFiles.every((doc) => {
      const hasDocumentType = doc.documentType && (doc.documentType !== "other" || doc.customDocumentType)
      const hasIssuingAuthority =
        doc.issuingAuthority && (doc.issuingAuthority !== "other" || doc.customIssuingAuthority)
      const hasValidDates = doc.issueDate && (doc.isPermanent || doc.expiryDate)
      return hasDocumentType && hasIssuingAuthority && hasValidDates
    })

  // Render different steps of the upload process
  const renderStep = () => {
    switch (uploadStep) {
      case 1: // File Selection
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

            {documentFiles.length > 0 && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Selected Files ({documentFiles.length})</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => setDocumentFiles([])}
                  >
                    Clear All
                  </Button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {documentFiles.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-3 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium truncate max-w-[300px]">{doc.file.name}</p>
                          <p className="text-xs text-gray-500">{(doc.file.size / 1024).toFixed(0)} KB</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeFile(doc.id)}>
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
                  <span>Processing files...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </div>
        )

      case 2: // Document Details
        return (
          <div className="grid grid-cols-1 gap-6">
            {/* Batch Actions Bar */}
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all"
                  checked={allFilesSelected}
                  onCheckedChange={(checked) => selectAllFiles(!!checked)}
                />
                <Label htmlFor="select-all" className="text-sm cursor-pointer">
                  Select All ({documentFiles.length})
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                {selectedFilesCount > 0 && (
                  <>
                    <Badge variant="outline" className="bg-blue-50">
                      {selectedFilesCount} selected
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsBatchEditing(true)}
                      disabled={isBatchEditing}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Batch Edit
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Batch Editing Panel */}
            {isBatchEditing && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Edit className="h-5 w-5 mr-2 text-blue-600" />
                    Batch Edit {selectedFilesCount} Documents
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="batchDocumentType">Document Type (Optional)</Label>
                      <Select value={batchDocumentType} onValueChange={setBatchDocumentType}>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Apply to all selected" />
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
                            const filteredTypes = filterDocumentTypes(types)
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

                      {batchDocumentType === "other" && (
                        <Input
                          className="mt-2 h-10"
                          placeholder="Specify document type"
                          value={batchCustomDocumentType}
                          onChange={(e) => setBatchCustomDocumentType(e.target.value)}
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="batchIssuingAuthority">Issuing Authority (Optional)</Label>
                      <Select value={batchIssuingAuthority} onValueChange={setBatchIssuingAuthority}>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Apply to all selected" />
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
                            const filteredAuthorities = filterIssuingAuthorities(authorities)
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

                      {batchIssuingAuthority === "other" && (
                        <Input
                          className="mt-2 h-10"
                          placeholder="Specify issuing authority"
                          value={batchCustomIssuingAuthority}
                          onChange={(e) => setBatchCustomIssuingAuthority(e.target.value)}
                        />
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="batchIssueDate">Issue Date (Optional)</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal h-10",
                              !batchIssueDate && "text-muted-foreground",
                            )}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {batchIssueDate ? format(batchIssueDate, "PPP") : <span>Apply to all selected</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={batchIssueDate}
                            onSelect={setBatchIssueDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="batchExpiryDate" className={batchIsPermanent ? "text-gray-400" : ""}>
                          Expiry Date (Optional)
                        </Label>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="batchPermanent"
                            checked={batchIsPermanent}
                            onCheckedChange={setBatchIsPermanent}
                          />
                          <Label htmlFor="batchPermanent" className="text-sm cursor-pointer">
                            Permanent
                          </Label>
                        </div>
                      </div>

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal h-10",
                              (!batchExpiryDate || batchIsPermanent) && "text-muted-foreground",
                            )}
                            disabled={batchIsPermanent}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {!batchIsPermanent && batchExpiryDate ? (
                              format(batchExpiryDate, "PPP")
                            ) : (
                              <span>{batchIsPermanent ? "N/A (Permanent)" : "Apply to all selected"}</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={batchExpiryDate}
                            onSelect={setBatchExpiryDate}
                            initialFocus
                            disabled={batchIsPermanent}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2 pt-0">
                  <Button variant="outline" onClick={() => setIsBatchEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={applyBatchChanges}>Apply to Selected</Button>
                </CardFooter>
              </Card>
            )}

            {/* Documents Table */}
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Document</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Issuing Authority</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documentFiles.map((doc, index) => {
                    const isComplete =
                      doc.documentType &&
                      (doc.documentType !== "other" || doc.customDocumentType) &&
                      doc.issuingAuthority &&
                      (doc.issuingAuthority !== "other" || doc.customIssuingAuthority) &&
                      doc.issueDate &&
                      (doc.isPermanent || doc.expiryDate)

                    return (
                      <TableRow
                        key={doc.id}
                        className={cn(selectedFileIndex === index && "bg-blue-50", doc.isSelected && "bg-gray-50")}
                      >
                        <TableCell>
                          <Checkbox
                            checked={doc.isSelected}
                            onCheckedChange={(checked) => toggleFileSelection(doc.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center cursor-pointer"
                              onClick={() => setSelectedFileIndex(index)}
                            >
                              <FileText className="h-4 w-4 text-blue-500" />
                            </div>
                            <div>
                              <p className="text-sm font-medium truncate max-w-[150px]">{doc.file.name}</p>
                              <p className="text-xs text-gray-500">{(doc.file.size / 1024).toFixed(0)} KB</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {doc.documentType ? (
                            <span className="text-sm">
                              {doc.documentType === "other" ? doc.customDocumentType : doc.documentType}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400">Not set</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {doc.issuingAuthority ? (
                            <span className="text-sm">
                              {doc.issuingAuthority === "other" ? doc.customIssuingAuthority : doc.issuingAuthority}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400">Not set</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {doc.issueDate ? (
                            <span className="text-sm">{format(doc.issueDate, "PP")}</span>
                          ) : (
                            <span className="text-sm text-gray-400">Not set</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {doc.isPermanent ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              Permanent
                            </Badge>
                          ) : doc.expiryDate ? (
                            <span className="text-sm">{format(doc.expiryDate, "PP")}</span>
                          ) : (
                            <span className="text-sm text-gray-400">Not set</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => setSelectedFileIndex(index)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Edit details</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-500"
                                    onClick={() => removeFile(doc.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Remove file</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            {isComplete ? (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="h-8 w-8 flex items-center justify-center text-green-500">
                                      <Check className="h-4 w-4" />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Complete</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            ) : (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="h-8 w-8 flex items-center justify-center text-amber-500">
                                      <AlertCircle className="h-4 w-4" />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Missing information</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Document Editor */}
            {selectedFile && (
              <Card className="border-blue-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Edit Document Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Document Preview */}
                  <div className="space-y-4">
                    <div className="border rounded-md p-3">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-base font-medium">Preview</h3>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={selectedFileIndex === 0}
                            onClick={() => setSelectedFileIndex(selectedFileIndex - 1)}
                          >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                          </Button>
                          <span className="text-sm text-gray-500">
                            {selectedFileIndex + 1} of {documentFiles.length}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={selectedFileIndex === documentFiles.length - 1}
                            onClick={() => setSelectedFileIndex(selectedFileIndex + 1)}
                          >
                            Next
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex justify-center items-center bg-gray-50 rounded-md h-[250px] overflow-hidden">
                        <img
                          src={selectedFile.previewUrl || "/placeholder.svg"}
                          alt="Document preview"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>

                      <div className="mt-3 flex justify-between items-center">
                        <span className="text-sm text-gray-500 truncate max-w-[200px]">{selectedFile.file.name}</span>
                        <Button variant="outline" size="sm">
                          <Search className="h-4 w-4 mr-1" />
                          Zoom
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Document Form */}
                  <div className="space-y-4">
                    {selectedFile.extractedData && (
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

                    <div className="space-y-2">
                      <Label htmlFor="documentType">Document Type</Label>
                      <Select
                        value={selectedFile.documentType}
                        onValueChange={(value) => updateFile(selectedFile.id, { documentType: value })}
                      >
                        <SelectTrigger className="h-10">
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
                            const filteredTypes = filterDocumentTypes(types)
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

                      {selectedFile.documentType === "other" && (
                        <Input
                          className="mt-2 h-10"
                          placeholder="Specify document type"
                          value={selectedFile.customDocumentType || ""}
                          onChange={(e) => updateFile(selectedFile.id, { customDocumentType: e.target.value })}
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="issuingAuthority">Issuing Authority</Label>
                      <Select
                        value={selectedFile.issuingAuthority}
                        onValueChange={(value) => updateFile(selectedFile.id, { issuingAuthority: value })}
                      >
                        <SelectTrigger className="h-10">
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
                            const filteredAuthorities = filterIssuingAuthorities(authorities)
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

                      {selectedFile.issuingAuthority === "other" && (
                        <Input
                          className="mt-2 h-10"
                          placeholder="Specify issuing authority"
                          value={selectedFile.customIssuingAuthority || ""}
                          onChange={(e) => updateFile(selectedFile.id, { customIssuingAuthority: e.target.value })}
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="documentNumber">Document Number</Label>
                      <Input
                        id="documentNumber"
                        className="h-10"
                        placeholder="Enter document number or identifier"
                        value={selectedFile.documentNumber}
                        onChange={(e) => updateFile(selectedFile.id, { documentNumber: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="issueDate">Issue Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal h-10",
                                !selectedFile.issueDate && "text-muted-foreground",
                              )}
                            >
                              <Calendar className="mr-2 h-4 w-4" />
                              {selectedFile.issueDate ? (
                                format(selectedFile.issueDate, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <CalendarComponent
                              mode="single"
                              selected={selectedFile.issueDate}
                              onSelect={(date) => updateFile(selectedFile.id, { issueDate: date })}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="expiryDate" className={selectedFile.isPermanent ? "text-gray-400" : ""}>
                            Expiry Date
                          </Label>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="permanent"
                              checked={selectedFile.isPermanent}
                              onCheckedChange={(checked) => updateFile(selectedFile.id, { isPermanent: checked })}
                            />
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
                                "w-full justify-start text-left font-normal h-10",
                                (!selectedFile.expiryDate || selectedFile.isPermanent) && "text-muted-foreground",
                              )}
                              disabled={selectedFile.isPermanent}
                            >
                              <Calendar className="mr-2 h-4 w-4" />
                              {!selectedFile.isPermanent && selectedFile.expiryDate ? (
                                format(selectedFile.expiryDate, "PPP")
                              ) : (
                                <span>{selectedFile.isPermanent ? "N/A (Permanent)" : "Pick a date"}</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <CalendarComponent
                              mode="single"
                              selected={selectedFile.expiryDate}
                              onSelect={(date) => updateFile(selectedFile.id, { expiryDate: date })}
                              initialFocus
                              disabled={selectedFile.isPermanent}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (selectedFileIndex > 0) {
                        setSelectedFileIndex(selectedFileIndex - 1)
                      }
                    }}
                    disabled={selectedFileIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (selectedFileIndex < documentFiles.length - 1) {
                        setSelectedFileIndex(selectedFileIndex + 1)
                      }
                    }}
                    disabled={selectedFileIndex === documentFiles.length - 1}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardFooter>
              </Card>
            )}

            {isProcessing && (
              <div className="flex justify-center items-center py-3">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Processing...</span>
              </div>
            )}
          </div>
        )

      case 3: // Upload Complete
        return (
          <div className="space-y-6 text-center px-4">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>

            <h3 className="text-2xl font-bold">Documents Uploaded Successfully</h3>
            <p className="text-gray-500 text-lg">
              {documentFiles.length} {documentFiles.length === 1 ? "document has" : "documents have"} been uploaded and
              added to the vessel's document library.
            </p>

            <Card className="mt-8">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-lg">Vessel:</span>
                    <span className="font-medium text-lg">{vessels.find((v) => v.id === selectedVessel)?.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-lg">Documents:</span>
                    <span className="font-medium text-lg">{documentFiles.length}</span>
                  </div>
                  <Separator />
                  <div className="max-h-[300px] overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Document Type</TableHead>
                          <TableHead>Issuing Authority</TableHead>
                          <TableHead>Expiry Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {documentFiles.map((doc) => (
                          <TableRow key={doc.id}>
                            <TableCell>
                              {doc.documentType === "other" ? doc.customDocumentType : doc.documentType}
                            </TableCell>
                            <TableCell>
                              {doc.issuingAuthority === "other" ? doc.customIssuingAuthority : doc.issuingAuthority}
                            </TableCell>
                            <TableCell>
                              {doc.isPermanent ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700">
                                  Permanent
                                </Badge>
                              ) : doc.expiryDate ? (
                                format(doc.expiryDate, "PP")
                              ) : (
                                "N/A"
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
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
              disabled={documentFiles.length === 0 || !selectedVessel || isProcessing}
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
        return (
          <>
            <Button variant="outline" onClick={() => setUploadStep(1)} className="h-12 px-6">
              Back
            </Button>
            <Button onClick={handleSubmit} disabled={!allFilesComplete || isProcessing} className="h-12 px-6">
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Saving
                </>
              ) : (
                `Upload ${documentFiles.length} ${documentFiles.length === 1 ? "Document" : "Documents"}`
              )}
            </Button>
          </>
        )

      case 3:
        return (
          <>
            <Button variant="outline" onClick={resetAndUploadAnother} className="h-12 px-6">
              Upload More
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
        return "Upload Documents"
      case 2:
        return "Document Details"
      case 3:
        return "Upload Complete"
      default:
        return "Upload Documents"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] w-[95vw] max-h-[90vh] overflow-y-auto" ref={contentRef}>
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
