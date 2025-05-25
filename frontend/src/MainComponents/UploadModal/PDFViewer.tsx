"use client"

import type React from "react"
import { useState, useEffect, memo } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, ExternalLink, FileText, Loader2, AlertTriangle, ZoomIn, ZoomOut } from "lucide-react"

// PDF Viewer Component
interface PDFViewerProps {
  fileUrl: string
  className?: string
  fileName?: string
}

const PDFViewer: React.FC<PDFViewerProps> = ({ fileUrl, className = "", fileName = "document.pdf" }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [zoom, setZoom] = useState(100)

  useEffect(() => {
    setIsLoading(true)
    setHasError(false)

    // Simple check if the URL is valid
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [fileUrl])

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = fileUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleOpenInNewTab = () => {
    window.open(fileUrl, "_blank")
  }

  const handleIframeLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleIframeError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  if (hasError) {
    return (
      <Card className={`p-6 ${className}`}>
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <div className="space-y-3">
              <p className="font-medium">PDF Preview Not Available</p>
              <p className="text-sm">
                This PDF cannot be displayed in the browser preview. You can still download or open it in a new tab.
              </p>
              <div className="flex gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="text-orange-700 border-orange-300 hover:bg-orange-100"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenInNewTab}
                  className="text-orange-700 border-orange-300 hover:bg-orange-100"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in New Tab
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      </Card>
    )
  }

  return (
    <Card className={`overflow-hidden ${className}`}>
      {/* PDF Viewer Header */}
      <div className="flex items-center justify-between p-3 bg-gray-50 border-b">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">PDF Document</span>
          {isLoading && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
        </div>

        <div className="flex items-center space-x-2">
          {/* Zoom Controls */}
          <div className="flex items-center space-x-1 mr-2">
            <Button variant="ghost" size="sm" onClick={() => setZoom(Math.max(50, zoom - 25))} disabled={zoom <= 50}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-xs text-gray-600 min-w-[3rem] text-center">{zoom}%</span>
            <Button variant="ghost" size="sm" onClick={() => setZoom(Math.min(200, zoom + 25))} disabled={zoom >= 200}>
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          {/* Action Buttons */}
          <Button variant="ghost" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleOpenInNewTab}>
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* PDF Content */}
      <div className="relative bg-gray-100" style={{ height: "600px" }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Loading PDF...</p>
            </div>
          </div>
        )}

        <iframe
          src={`${fileUrl}#zoom=${zoom}&toolbar=1&navpanes=0&scrollbar=1`}
          className="w-full h-full border-0"
          title="PDF Document Viewer"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: "top left",
            width: `${10000 / zoom}%`,
            height: `${10000 / zoom}%`,
          }}
        />
      </div>

      {/* Maritime-specific footer info */}
      <div className="p-3 bg-blue-50 border-t text-xs text-blue-700">
        <div className="flex items-center justify-between">
          <span>📋 Comovis Document Viewer</span>
          <span>Secure • Compliant • Reliable</span>
        </div>
      </div>
    </Card>
  )
}

// Document Preview Component
interface DocumentPreviewProps {
  file?: File
  previewUrl?: string
  className?: string
}

// Memoized Document Preview Component to prevent unnecessary re-renders and PDF flashing
const DocumentPreview = memo<DocumentPreviewProps>(({ file, previewUrl, className = "" }) => {
  const isPDF = file?.type === "application/pdf"
  const isImage = file?.type.startsWith("image/")

  if (isPDF && file) {
    const fileUrl = URL.createObjectURL(file)
    return (
      <div className={className}>
        <PDFViewer fileUrl={fileUrl} fileName={file.name} className="w-full" />
      </div>
    )
  }

  if (isImage && file) {
    const imageUrl = URL.createObjectURL(file)
    return (
      <div
        className={`flex justify-center items-center bg-gray-50 rounded-lg border-2 border-gray-200 p-6 ${className}`}
      >
        <img
          src={imageUrl || "/placeholder.svg"}
          alt="Document preview"
          className="max-w-full max-h-[500px] object-contain rounded shadow-lg"
          onLoad={() => URL.revokeObjectURL(imageUrl)}
        />
      </div>
    )
  }

  if (previewUrl) {
    return (
      <div
        className={`flex justify-center items-center bg-gray-50 rounded-lg border-2 border-gray-200 p-6 ${className}`}
      >
        <img
          src={previewUrl || "/placeholder.svg"}
          alt="Document preview"
          className="max-w-full max-h-[500px] object-contain rounded shadow-lg"
        />
      </div>
    )
  }

  return (
    <div
      className={`flex justify-center items-center bg-gray-100 rounded-lg border-2 border-gray-200 p-8 ${className}`}
    >
      <div className="text-center text-gray-400">
        <FileText className="h-16 w-16 mx-auto mb-4" />
        <p className="text-lg">Document preview loading...</p>
      </div>
    </div>
  )
})

DocumentPreview.displayName = "DocumentPreview"

export default DocumentPreview
