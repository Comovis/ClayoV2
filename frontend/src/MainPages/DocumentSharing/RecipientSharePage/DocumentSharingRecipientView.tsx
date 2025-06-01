"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Download,
  FileText,
  Eye,
  Calendar,
  Clock,
  Info,
  Shield,
  ChevronLeft,
  ChevronRight,
  Printer,
  Search,
  CheckCircle,
  Mail,
  Loader2,
  AlertTriangle,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { fetchShareByToken, logDocumentAccess } from "../../../Hooks/useDocumentShares"
import ExpiredShareView from "./ExpiredShareView"
import DocumentPreview from "../../../MainComponents/UploadModal/PDFViewer"

export default function DocumentSharingRecipientView() {
  const { token } = useParams<{ token: string }>()
  const [currentDocumentIndex, setCurrentDocumentIndex] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [emailInput, setEmailInput] = useState("")
  const [isEmailVerificationRequired, setIsEmailVerificationRequired] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState("documents")
  const [fullScreenPreview, setFullScreenPreview] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [shareInfo, setShareInfo] = useState<any>(null)
  const [documents, setDocuments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isExpired, setIsExpired] = useState(false)

  // Fetch share data on component mount
  useEffect(() => {
    async function fetchShareData() {
      if (!token) {
        setError("No share token provided")
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const data = await fetchShareByToken(token)

        if (data.notFound) {
          setError("Share not found")
          return
        }

        if (data.expired) {
          setIsExpired(true)
          setShareInfo(data.shareInfo)
          return
        }

        setShareInfo(data)
        setDocuments(data.documents || [])
        setIsEmailVerificationRequired(data.security?.emailVerification || false)

        // If email verification is not required, mark as authenticated
        if (!data.security?.emailVerification) {
          setIsAuthenticated(true)
        }

        // Log access
        if (data.id) {
          logDocumentAccess(data.id, null, "view_share")
        }
      } catch (err) {
        console.error("Error fetching share data:", err)
        setError("Failed to load share data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchShareData()
  }, [token])

  // Filter documents based on search query
  const filteredDocuments = documents.filter(
    (doc) =>
      doc.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.issuer?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const currentDocument = filteredDocuments[currentDocumentIndex]

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Calculate days until expiration
  const calculateDaysUntil = (dateString: string) => {
    const targetDate = new Date(dateString)
    const today = new Date()
    const diffTime = targetDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Handle email verification submission
  const handleEmailVerification = (e: React.FormEvent) => {
    e.preventDefault()
    setEmailError("")

    if (shareInfo?.recipients?.some((recipient: any) => recipient.email.toLowerCase() === emailInput.toLowerCase())) {
      setIsAuthenticated(true)
    } else {
      setEmailError("Email not recognized. Please enter an email address that was authorized to view these documents.")
    }
  }

  // Navigate to previous document
  const prevDocument = () => {
    setCurrentDocumentIndex((prev) => (prev === 0 ? filteredDocuments.length - 1 : prev - 1))
  }

  // Navigate to next document
  const nextDocument = () => {
    setCurrentDocumentIndex((prev) => (prev === filteredDocuments.length - 1 ? 0 : prev + 1))
  }

  // Track document view
  const trackDocumentView = (documentId: string) => {
    if (!shareInfo?.id || !documentId) return
    logDocumentAccess(shareInfo.id, documentId, "view_document", emailInput)
  }

  // Track document download
  const trackDocumentDownload = (documentId: string) => {
    if (!shareInfo?.id || !documentId) return
    logDocumentAccess(shareInfo.id, documentId, "download", emailInput)
  }

  // Get document URL for preview
  const getDocumentPreviewUrl = (document: any) => {
    if (!document) return null

    console.log("Document object:", document) // Debug log

    // If document has a direct file URL or path
    if (document.file_url) {
      console.log("Using file_url:", document.file_url)
      return document.file_url
    }
    if (document.file_path) {
      console.log("Using file_path:", document.file_path)
      return document.file_path
    }
    if (document.url) {
      console.log("Using url:", document.url)
      return document.url
    }

    // Construct URL from document ID or other properties
    if (document.id) {
      const constructedUrl = `/api/documents/${document.id}/preview`
      console.log("Using constructed URL:", constructedUrl)
      return constructedUrl
    }

    console.log("No valid URL found for document")
    return null
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
          <h2 className="text-xl font-semibold">Loading secure documents...</h2>
          <p className="text-gray-500 mt-2">Please wait while we verify your access.</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle>Document Share Not Found</CardTitle>
            <CardDescription>The secure link you're trying to access is invalid or has been removed.</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button onClick={() => (window.location.href = "https://comovis.co")}>Go to Comovis</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Expired state
  if (isExpired) {
    return <ExpiredShareView shareInfo={shareInfo} />
  }

  // Email verification screen
  if (isEmailVerificationRequired && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle>Please Confirm Your Email</CardTitle>
            <CardDescription>
              To access these documents, please enter your email address for verification.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailVerification}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Shared by:</p>
                      <p className="text-sm text-gray-500">
                        {shareInfo?.sender?.name} ({shareInfo?.sender?.company})
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Vessel:</p>
                      <p className="text-sm text-gray-500">{shareInfo?.vessel?.name}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="email">
                    Your Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className={emailError ? "border-red-500" : ""}
                    required
                  />
                  {emailError ? (
                    <p className="text-sm text-red-500 mt-1">{emailError}</p>
                  ) : (
                    <p className="text-xs text-gray-500">
                      This email must match one of the addresses that was authorized to view these documents.
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full">
                  <Mail className="mr-2 h-4 w-4" />
                  Verify Email & Access Documents
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center text-center">
            <p className="text-xs text-gray-500 mt-2">
              If you're having trouble accessing these documents, please contact the sender at{" "}
              {shareInfo?.sender?.email}
            </p>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6">
        {/* Top Action Bar */}
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <Badge variant="outline" className="mr-2">
              Secure Document Share
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Expires in {calculateDaysUntil(shareInfo?.expiresAt)} days
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            {!shareInfo?.security?.preventDownloads && (
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download All
              </Button>
            )}
            <Button size="sm">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
        </div>

        {/* Share Info Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Vessel Information */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Vessel Information</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center mb-3">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {shareInfo?.vessel?.name?.charAt(0) || "V"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{shareInfo?.vessel?.name || "Unknown Vessel"}</h4>
                      <p className="text-sm text-gray-500">{shareInfo?.vessel?.type || "Unknown Type"}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">IMO Number:</span>
                      <span>{shareInfo?.vessel?.imo || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Flag:</span>
                      <span>{shareInfo?.vessel?.flag || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Call Sign:</span>
                      <span>{shareInfo?.vessel?.callsign || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Port Call Information */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Port Call Information</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center mb-3">
                    <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3">
                      {shareInfo?.port?.name?.charAt(0) || "P"}
                    </div>
                    <div>
                      <h4 className="font-medium">{shareInfo?.port?.name || "Unknown Port"}</h4>
                      <p className="text-sm text-gray-500">{shareInfo?.port?.country || "Unknown Country"}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    {shareInfo?.port?.eta && (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-gray-500 mr-1">ETA:</span>
                        <span>{formatDate(shareInfo.port.eta)}</span>
                      </div>
                    )}
                    {shareInfo?.port?.etd && (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-gray-500 mr-1">ETD:</span>
                        <span>{formatDate(shareInfo.port.etd)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Share Information */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Share Information</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center mb-3">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarFallback className="bg-green-100 text-green-600">
                        {shareInfo?.sender?.name?.charAt(0) || "S"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{shareInfo?.sender?.name || "Unknown Sender"}</h4>
                      <p className="text-sm text-gray-500">{shareInfo?.sender?.company || "Unknown Company"}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-gray-500 mr-1">Shared:</span>
                      <span>{formatDate(shareInfo?.sharedAt)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-gray-500 mr-1">Expires:</span>
                      <span>{formatDate(shareInfo?.expiresAt)}</span>
                    </div>
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-gray-500 mr-1">Security:</span>
                      <div className="flex space-x-1">
                        {shareInfo?.security?.watermarked && (
                          <Badge variant="outline" className="text-xs">
                            Watermarked
                          </Badge>
                        )}
                        {shareInfo?.security?.preventDownloads && (
                          <Badge variant="outline" className="text-xs">
                            View Only
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Message */}
            {shareInfo?.message && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Message from Sender</h3>
                <div className="bg-blue-50 border border-blue-100 rounded-md p-4 text-sm">
                  <p className="text-gray-700">{shareInfo.message}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Document Viewer Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Document List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Shared Documents</CardTitle>
                <CardDescription>
                  {documents.length} documents shared for {shareInfo?.port?.name || "port call"}
                </CardDescription>
                <div className="relative mt-2">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search documents..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  <div className="p-1">
                    {filteredDocuments.map((doc, index) => (
                      <div
                        key={doc.id}
                        className={`flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 ${
                          index === currentDocumentIndex ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                        }`}
                        onClick={() => {
                          setCurrentDocumentIndex(index)
                          trackDocumentView(doc.id)
                        }}
                      >
                        <div className="flex items-center">
                          <FileText
                            className={`h-5 w-5 mr-2 ${index === currentDocumentIndex ? "text-blue-500" : "text-gray-500"}`}
                          />
                          <div>
                            <h4 className="font-medium text-sm">{doc.name}</h4>
                            <p className="text-xs text-gray-500">{doc.issuer}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Badge variant="outline" className="text-xs">
                            {doc.fileType?.toUpperCase() || "PDF"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Document Preview */}
          <div className="lg:col-span-2">
            <Card className="h-full flex flex-col">
              <CardHeader className="pb-2 flex-shrink-0">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{currentDocument?.name || "Select a document"}</CardTitle>
                    <CardDescription>
                      {currentDocument?.issuer} • {currentDocument?.pages || 1} pages •{" "}
                      {currentDocument?.fileSize || "Unknown size"}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={prevDocument} disabled={filteredDocuments.length <= 1}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={nextDocument} disabled={filteredDocuments.length <= 1}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow p-0 relative">
                <div className="absolute inset-0 flex flex-col">
                  <Tabs defaultValue="preview" className="flex-grow flex flex-col">
                    <div className="px-4 pt-2">
                      <TabsList>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                        <TabsTrigger value="details">Details</TabsTrigger>
                      </TabsList>
                    </div>

                    <TabsContent value="preview" className="flex-grow m-0 p-4">
                      <div className="bg-gray-100 rounded-md h-full flex flex-col items-center justify-center relative">
                        {/* Document Watermark */}
                        {shareInfo?.security?.watermarked && (
                          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none rotate-[-30deg] text-gray-500 text-2xl font-bold z-10">
                            CONFIDENTIAL - {shareInfo?.vessel?.name} - {new Date().toLocaleDateString()}
                          </div>
                        )}

                        {/* Enhanced Document Preview with PDF Support */}
                        {currentDocument ? (
                          <div className="w-full h-full relative">
                            {(() => {
                              const previewUrl = getDocumentPreviewUrl(currentDocument)
                              console.log("Preview URL being passed to DocumentPreview:", previewUrl)
                              return (
                                <DocumentPreview
                                  previewUrl={previewUrl}
                                  fileName={currentDocument.name}
                                  className="w-full h-full"
                                />
                              )
                            })()}
                          </div>
                        ) : (
                          <div className="w-full max-w-md aspect-[3/4] bg-white shadow-md rounded-md border flex flex-col">
                            <div className="bg-gray-50 p-4 border-b">
                              <h3 className="font-bold text-center">Select a document to preview</h3>
                            </div>
                            <div className="flex-grow p-6 flex flex-col items-center justify-center">
                              <FileText className="h-16 w-16 text-gray-400 mb-4" />
                              <p className="text-gray-500 text-center">
                                Choose a document from the list to view its contents
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="absolute bottom-4 right-4 flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setFullScreenPreview(true)}
                            disabled={!currentDocument}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Full Screen
                          </Button>
                          {!shareInfo?.security?.preventDownloads && (
                            <Button
                              size="sm"
                              onClick={() => {
                                if (currentDocument?.id) {
                                  trackDocumentDownload(currentDocument.id)
                                }
                              }}
                              disabled={!currentDocument}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                          )}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="details" className="flex-grow m-0 p-4">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-2">Document Information</h3>
                          <div className="bg-gray-50 rounded-md p-4 space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="text-sm text-gray-500">Document Type:</div>
                              <div className="text-sm font-medium">{currentDocument?.name}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="text-sm text-gray-500">Issuer:</div>
                              <div className="text-sm">{currentDocument?.issuer}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="text-sm text-gray-500">Issue Date:</div>
                              <div className="text-sm">{currentDocument?.issueDate || "N/A"}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="text-sm text-gray-500">Expiry Date:</div>
                              <div className="text-sm">
                                {currentDocument?.expiryDate === "N/A" ? (
                                  "Not Applicable"
                                ) : (
                                  <div className="flex items-center">
                                    {currentDocument?.expiryDate || "N/A"}
                                    {currentDocument?.status === "valid" && (
                                      <CheckCircle className="h-3.5 w-3.5 ml-1 text-green-500" />
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="text-sm text-gray-500">File Type:</div>
                              <div className="text-sm">{currentDocument?.fileType?.toUpperCase() || "PDF"}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="text-sm text-gray-500">File Size:</div>
                              <div className="text-sm">{currentDocument?.fileSize || "Unknown"}</div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-2">Verification Status</h3>
                          <Alert className="bg-green-50 border-green-200">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <AlertTitle className="text-green-700">Document Verified</AlertTitle>
                            <AlertDescription className="text-green-600">
                              This document has been verified and is authentic.
                            </AlertDescription>
                          </Alert>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-2">Access Information</h3>
                          <div className="bg-gray-50 rounded-md p-4 space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="text-sm text-gray-500">Shared By:</div>
                              <div className="text-sm">{shareInfo?.sender?.name}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="text-sm text-gray-500">Company:</div>
                              <div className="text-sm">{shareInfo?.sender?.company}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="text-sm text-gray-500">Shared On:</div>
                              <div className="text-sm">{formatDate(shareInfo?.sharedAt)}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="text-sm text-gray-500">Access Expires:</div>
                              <div className="text-sm">
                                <div className="flex items-center">
                                  {formatDate(shareInfo?.expiresAt)}
                                  <span className="ml-1 text-yellow-600">
                                    ({calculateDaysUntil(shareInfo?.expiresAt)} days)
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
              <CardFooter className="border-t flex justify-between items-center">
                <div className="flex items-center text-sm text-gray-500">
                  <Info className="h-4 w-4 mr-1" />
                  {shareInfo?.security?.watermarked && "This document contains a digital watermark. "}
                  {shareInfo?.security?.accessTracking && "Document access is being tracked."}
                </div>
                <div className="flex space-x-2">
                  {!shareInfo?.security?.preventDownloads && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (currentDocument?.id) {
                          trackDocumentDownload(currentDocument.id)
                        }
                      }}
                      disabled={!currentDocument}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={() => {
                      if (currentDocument?.id) {
                        trackDocumentView(currentDocument.id)
                      }
                    }}
                    disabled={!currentDocument}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Expiration Notice */}
        <div className="mt-6">
          <Alert className="bg-yellow-50 border-yellow-200">
            <Clock className="h-4 w-4 text-yellow-500" />
            <AlertTitle className="text-yellow-700">Access Expiration Notice</AlertTitle>
            <AlertDescription className="text-yellow-600">
              Your access to these documents will expire on {formatDate(shareInfo?.expiresAt)} (
              {calculateDaysUntil(shareInfo?.expiresAt)} days from now).
            </AlertDescription>
          </Alert>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-8 py-4">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-500 mb-4 md:mb-0">
              &copy; 2025 Secure maritime document sharing by Comovis.
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="link" size="sm" className="text-gray-500">
                <Shield className="mr-1 h-4 w-4" />
                Security Information
              </Button>
              <Button variant="link" size="sm" className="text-gray-500">
                Comovis
              </Button>
            </div>
          </div>
        </div>
      </footer>

      {/* Full Screen Preview Dialog */}
      <Dialog open={fullScreenPreview} onOpenChange={setFullScreenPreview}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-0 overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-semibold">{currentDocument?.name}</h2>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={prevDocument}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={nextDocument}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                {!shareInfo?.security?.preventDownloads && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (currentDocument?.id) {
                        trackDocumentDownload(currentDocument.id)
                      }
                    }}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                )}
                <Button size="sm" variant="outline">
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
              </div>
            </div>
            <div className="flex-grow overflow-auto p-4 bg-gray-100">
              <div className="bg-white shadow-md rounded-md max-w-4xl mx-auto min-h-[800px] relative">
                {/* Document Watermark */}
                {shareInfo?.security?.watermarked && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none rotate-[-30deg] text-gray-500 text-4xl font-bold z-10">
                    CONFIDENTIAL - {shareInfo?.vessel?.name} - {new Date().toLocaleDateString()}
                  </div>
                )}

                {/* Full Screen Document Preview */}
                {currentDocument ? (
                  <div className="w-full h-full">
                    {getDocumentPreviewUrl(currentDocument) ? (
                      <DocumentPreview
                        previewUrl={getDocumentPreviewUrl(currentDocument)}
                        fileName={currentDocument.name}
                        className="w-full h-full"
                      />
                    ) : (
                      <div className="flex flex-col items-center p-8">
                        <div className="text-center mb-8">
                          <h1 className="text-2xl font-bold mb-2">{currentDocument?.name}</h1>
                          <p className="text-gray-500">Issued by: {currentDocument?.issuer}</p>
                          <div className="mt-2 flex justify-center space-x-4 text-sm">
                            <span>Issue Date: {currentDocument?.issueDate}</span>
                            <span>Expiry Date: {currentDocument?.expiryDate}</span>
                          </div>
                        </div>

                        <img
                          src="/placeholder.svg?height=600&width=800&text=Full+Document+Preview"
                          alt="Document preview"
                          className="max-h-full object-contain mb-8"
                        />

                        <div className="w-full max-w-md">
                          <div className="border-t pt-4 mt-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-500">Certificate Number:</p>
                                <p className="font-medium">SMC-2023-12345</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Vessel IMO:</p>
                                <p className="font-medium">{shareInfo?.vessel?.imo}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-400">
                      <FileText className="h-16 w-16 mx-auto mb-4" />
                      <p className="text-lg">No document selected</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="p-2 border-t bg-gray-50 flex justify-between items-center">
              <div className="text-sm text-gray-500">Page 1 of {currentDocument?.pages || 1}</div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
