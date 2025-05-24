import type React from "react"
import { Worker, Viewer } from "@react-pdf-viewer/core"
import "@react-pdf-viewer/core/lib/styles/index.css"

interface PDFViewerProps {
  fileUrl: string
  className?: string
}

const PDFViewer: React.FC<PDFViewerProps> = ({ fileUrl, className = "" }) => {
  return (
    <div className={`pdf-viewer-container ${className}`} style={{ height: "600px" }}>
      <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.7.76/pdf.worker.js">
        <Viewer fileUrl={fileUrl} />
      </Worker>
    </div>
  )
}

export default PDFViewer