"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Share2,
  Copy,
  Mail,
  Clock,
  Shield,
  FileText,
  CheckCircle,
  LinkIcon,
  Eye,
  Plus,
  Ship,
  ExternalLink,
  Bell,
  FileWarning,
  AlertTriangle,
  CheckSquare,
  Info,
  CalendarClock,
  Search,
  Calendar,
  AlertCircle,
  RefreshCw,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"

// Import the components
import { RecipientPreview } from "./RecipientPreview"
import { ShareHistoryTable } from "./ShareHistoryTable"
import { ShareTemplateList } from "./ShareTemplateList"
import { VesselSelector, type Vessel, type PortInfo } from "../../MainComponents/VesselSelector/VesselSelector"
import { AccessLogsModal } from "../../MainComponents/AccessLogs/AccessLogs"
import { useFetchVessels } from "../../Hooks/useFetchVessels"
import { createDocumentShare, sendShareEmail } from "../../Hooks/useDocumentShares"
import { supabase } from "../../Auth/SupabaseAuth"
import { useDocuments } from "../../Hooks/useDocuments"

export default function PortDocumentSharing() {
  // State for UI
  const [activeTab, setActiveTab] = useState("upcoming")
  const [selectedPort, setSelectedPort] = useState("singapore")
  const [selectedVessel, setSelectedVessel] = useState("")
  const [selectedDocuments, setSelectedDocuments] = useState([])
  const [shareStatus, setShareStatus] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const [customMessage, setCustomMessage] = useState("")
  const [securityOptions, setSecurityOptions] = useState({
    watermark: true,
    preventDownloads: false,
    accessTracking: true,
    emailVerification: true,
  })
  const [accessDuration, setAccessDuration] = useState("7-days")
  const [favoriteVessels, setFavoriteVessels] = useState<Record<string, boolean>>({
    "humble-warrior": true,
    "pacific-explorer": false,
    "northern-star": false,
  })
  const [accessLogsOpen, setAccessLogsOpen] = useState(false)
  const [sendingDirectEmail, setSendingDirectEmail] = useState(false)
  const [directEmailSent, setDirectEmailSent] = useState(false)
  const [shareResult, setShareResult] = useState(null)
  const [customExpiryDate, setCustomExpiryDate] = useState("")

  // State for API integration
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingShares, setIsLoadingShares] = useState(false)
  // Use the documents hook instead of document shares
  const {
    documents: fetchedDocuments,
    isLoading: isLoadingDocuments,
    error: documentsError,
    fetchDocuments,
    clearMessages: clearDocumentMessages,
  } = useDocuments()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Use the fetch vessels hook
  const { vessels: fetchedVessels, isLoading: isLoadingVessels, error: vesselError, fetchVessels } = useFetchVessels()

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        setIsAuthenticated(!!data.session)
        console.log("Authentication status:", !!data.session)
      } catch (err) {
        console.error("Error checking authentication:", err)
        setIsAuthenticated(false)
      }
    }

    checkAuth()
  }, [])

  // Fetch vessels on component mount
  useEffect(() => {
    console.log("Fetching vessels...")
    fetchVessels()
  }, [fetchVessels])

  // Fetch vessel documents when authenticated and vessel is selected
  useEffect(() => {
    if (isAuthenticated && selectedVessel) {
      console.log("User authenticated and vessel selected, fetching documents...")
      fetchVesselDocuments(selectedVessel)
    }
  }, [isAuthenticated, selectedVessel])

  // Set the first vessel as selected when vessels are loaded
  useEffect(() => {
    if (fetchedVessels.length > 0 && !selectedVessel) {
      setSelectedVessel(fetchedVessels[0].id)
      console.log("Selected first vessel:", fetchedVessels[0].id)
    }
  }, [fetchedVessels, selectedVessel])

  // Fetch vessel documents when vessel is selected
  const fetchVesselDocuments = async (vesselId: string) => {
    if (!vesselId) {
      console.log("No vessel ID provided, skipping document fetch")
      return
    }

    console.log("Fetching documents for vessel:", vesselId)
    try {
      await fetchDocuments(vesselId)
      console.log("Documents fetched successfully")
    } catch (err) {
      console.error("Error fetching vessel documents:", err)
      setError("Failed to load vessel documents. Using sample data for visualization.")
    }
  }

  // Ports data (keep all dummy data)
  const ports = [
    {
      id: "singapore",
      name: "Singapore",
      country: "Singapore",
      code: "SGSIN",
      eta: "2025-05-20T08:00:00",
      etd: "2025-05-22T16:00:00",
      avatar: "SG",
      requiredDocs: ["smc", "iopp", "registry", "loadline", "crew-list"],
      complianceStatus: "warning",
      agent: {
        id: "sg-agent",
        name: "Singapore Maritime Services",
        email: "ops@sgmaritime.com",
      },
      authority: {
        id: "sg-mpa",
        name: "Singapore MPA",
        email: "portdocs@mpa.gov.sg",
      },
    },
    {
      id: "rotterdam",
      name: "Rotterdam",
      country: "Netherlands",
      code: "NLRTM",
      eta: "2025-06-05T10:00:00",
      etd: "2025-06-07T18:00:00",
      avatar: "RT",
      requiredDocs: ["smc", "iopp", "registry", "loadline", "crew-list", "ballast-plan"],
      complianceStatus: "compliant",
      agent: {
        id: "nl-agent",
        name: "Rotterdam Port Services",
        email: "ops@rotterdamport.nl",
      },
      authority: {
        id: "nl-port",
        name: "Rotterdam Port Authority",
        email: "docs@portofrotterdam.com",
      },
    },
    {
      id: "hongkong",
      name: "Hong Kong",
      country: "China",
      code: "HKHKG",
      eta: "2025-06-15T09:00:00",
      etd: "2025-06-17T14:00:00",
      avatar: "HK",
      requiredDocs: ["smc", "iopp", "registry", "loadline", "crew-list"],
      complianceStatus: "non-compliant",
      agent: {
        id: "hk-agent",
        name: "HK Maritime Agency",
        email: "agency@hkmaritime.com",
      },
      authority: {
        id: "hk-mardep",
        name: "Hong Kong Marine Department",
        email: "mardep@gov.hk",
      },
    },
  ]

  // Dummy vessels data for fallback
  const dummyVessels: Vessel[] = [
    {
      id: "humble-warrior",
      name: "Humble Warrior",
      type: "Crude Oil Tanker",
      flag: "Panama",
      avatar: "HW",
      imo: "9123456",
      callsign: "3FVR8",
      status: {
        valid: 12,
        expiringSoon: 3,
        expired: 0,
        missing: 1,
      },
      isFavorite: favoriteVessels["humble-warrior"],
    },
    {
      id: "pacific-explorer",
      name: "Pacific Explorer",
      type: "Container Ship",
      flag: "Singapore",
      avatar: "PE",
      imo: "9234567",
      callsign: "9VGS2",
      status: {
        valid: 14,
        expiringSoon: 1,
        expired: 0,
        missing: 0,
      },
      isFavorite: favoriteVessels["pacific-explorer"],
    },
    {
      id: "northern-star",
      name: "Northern Star",
      type: "Bulk Carrier",
      flag: "Marshall Islands",
      avatar: "NS",
      imo: "9345678",
      callsign: "V7CK9",
      status: {
        valid: 10,
        expiringSoon: 2,
        expired: 1,
        missing: 2,
      },
      isFavorite: favoriteVessels["northern-star"],
    },
  ]

  // Use fetched vessels if available, otherwise use dummy data
  const vessels =
    fetchedVessels.length > 0
      ? // Map fetched vessels to include status and isFavorite properties
        fetchedVessels.map((vessel) => ({
          ...vessel,
          status: vessel.documentStatus || {
            valid: 10,
            expiringSoon: 2,
            expired: 0,
            missing: 1,
          },
          isFavorite: favoriteVessels[vessel.id] || false,
        }))
      : dummyVessels

  // Use fetched documents if available, otherwise empty array
  const documents =
    fetchedDocuments.length > 0
      ? // Map fetched documents to the expected format
        fetchedDocuments.map((doc) => ({
          id: doc.id,
          name: doc.title,
          issuer: doc.issuer || "Unknown Issuer",
          status: doc.status || "valid",
          expiryDays: doc.expiry_date
            ? Math.ceil((new Date(doc.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
            : null,
          category: doc.document_category || "statutory",
          required: true,
          // Add the original document data for reference
          originalDoc: doc,
        }))
      : // No dummy data - empty array
        []

  // Add this after the documents mapping
  useEffect(() => {
    console.log("Fetched documents:", fetchedDocuments)
    console.log("Mapped documents:", documents)
    console.log("Required documents for port:", getRequiredDocuments(selectedPort))
  }, [fetchedDocuments, documents, selectedPort])

  // Upcoming port calls (keep dummy data)
  const upcomingPortCalls = [
    {
      portId: "singapore",
      vesselId: "humble-warrior",
      eta: "2025-05-20T08:00:00",
      etd: "2025-05-22T16:00:00",
      status: "approaching",
      daysUntil: 3,
      complianceStatus: "warning",
    },
    {
      portId: "rotterdam",
      vesselId: "humble-warrior",
      eta: "2025-06-05T10:00:00",
      etd: "2025-06-07T18:00:00",
      status: "scheduled",
      daysUntil: 19,
      complianceStatus: "compliant",
    },
    {
      portId: "hongkong",
      vesselId: "pacific-explorer",
      eta: "2025-06-15T09:00:00",
      etd: "2025-06-17T14:00:00",
      status: "scheduled",
      daysUntil: 29,
      complianceStatus: "non-compliant",
    },
  ]

  // Helper function to calculate expiry date based on selected duration
  const calculateExpiryDate = (duration) => {
    const now = new Date()

    if (duration === "24-hours") {
      return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()
    } else if (duration === "3-days") {
      return new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString()
    } else if (duration === "7-days") {
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
    } else if (duration === "30-days") {
      return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()
    } else if (duration === "never") {
      // Set to a far future date (e.g., 10 years)
      return new Date(now.getTime() + 10 * 365 * 24 * 60 * 60 * 1000).toISOString()
    } else if (duration === "custom" && customExpiryDate) {
      return new Date(customExpiryDate).toISOString()
    }

    // Default to 7 days
    return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
  }

  // Handle share action (with API integration)
  const handleShare = async () => {
    if (selectedVessel === "" || selectedDocuments.length === 0) {
      setError("Please select a vessel and at least one document.")
      return
    }

    setShareStatus("processing")
    setIsLoading(true)
    setError("")

    try {
      // Get recipients
      const port = getPort(selectedPort)
      const recipients = []

      if (document.getElementById("recipient-port-authority")?.checked) {
        recipients.push({
          email: port.authority.email,
          name: port.authority.name,
          type: "port-authority",
        })
      }

      if (document.getElementById("recipient-agent")?.checked) {
        recipients.push({
          email: port.agent.email,
          name: port.agent.name,
          type: "agent",
        })
      }

      // Prepare the share data
      const shareData = {
        vesselId: selectedVessel,
        documentIds: selectedDocuments,
        recipients: recipients,
        expiresAt: calculateExpiryDate(accessDuration),
        message: customMessage,
        securityOptions,
      }

      console.log("Creating document share with data:", shareData)

      // Try to create the share via API
      if (isAuthenticated) {
        try {
          const shareResult = await createDocumentShare(shareData)
          console.log("Share created successfully:", shareResult)
          setShareResult(shareResult)
        } catch (apiError) {
          console.error("API error, falling back to dummy data:", apiError)
          // Fall back to dummy share result
          setShareResult({
            id: "dummy-share-" + Date.now(),
            shareUrl: "https://comovis.co/share/HW-SG-MPA-7d9f3",
            expiresAt: calculateExpiryDate(accessDuration),
            createdAt: new Date().toISOString(),
            recipients: recipients,
            documents: selectedDocuments,
          })
        }
      } else {
        // Not authenticated, use dummy data
        console.log("Not authenticated, using dummy share result")
        setShareResult({
          id: "dummy-share-" + Date.now(),
          shareUrl: "https://comovis.co/share/HW-SG-MPA-7d9f3",
          expiresAt: calculateExpiryDate(accessDuration),
          createdAt: new Date().toISOString(),
          recipients: recipients,
          documents: selectedDocuments,
        })
      }

      // Update status to complete
      setShareStatus("complete")
      setSuccess("Documents shared successfully!")

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess("")
      }, 5000)

      // Refresh document shares if authenticated
      if (isAuthenticated) {
        // fetchDocumentShares()
      }
    } catch (error) {
      console.error("Error creating share:", error)
      setShareStatus("error")
      setError("Failed to create document share. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle send directly (with API integration)
  const handleSendDirectly = async () => {
    if (!shareResult?.id) return

    setSendingDirectEmail(true)
    setError("")

    try {
      if (isAuthenticated && !shareResult.id.startsWith("dummy-")) {
        // Try to send via API
        const result = await sendShareEmail(shareResult.id)

        if (result.success) {
          setDirectEmailSent(true)
          setSuccess(`Email sent successfully to ${result.totalSent} recipient(s)!`)
        } else {
          console.error("Failed to send emails:", result)
          setError("Failed to send emails. Please try again.")
        }
      } else {
        // Simulate email sending for dummy data
        console.log("Simulating email send for dummy data")
        setTimeout(() => {
          setDirectEmailSent(true)
          setSuccess("Email sent successfully to 2 recipient(s)! (Demo mode)")
        }, 1500)
      }

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess("")
      }, 5000)
    } catch (error) {
      console.error("Error sending emails:", error)
      setError("Failed to send emails. Please try again.")
    } finally {
      setSendingDirectEmail(false)
    }
  }

  // Get port by ID
  const getPort = (id) => {
    return ports.find((port) => port.id === id)
  }

  // Get vessel by ID
  const getVessel = (id) => {
    return vessels.find((vessel) => vessel.id === id)
  }

  const getSelectedVessel = () => {
    return vessels.find((vessel) => vessel.id === selectedVessel)
  }

  // Get document by ID
  const getDocument = (id) => {
    return documents.find((doc) => doc.id === id)
  }

  // Get required documents for a port
  const getRequiredDocuments = (portId) => {
    // Only show real fetched documents, no dummy data
    if (fetchedDocuments.length > 0) {
      return documents // Show all fetched documents
    }

    // Return empty array if no real documents
    return []
  }

  // Toggle document selection
  const toggleDocument = (id) => {
    if (selectedDocuments.includes(id)) {
      setSelectedDocuments(selectedDocuments.filter((doc) => doc !== id))
    } else {
      setSelectedDocuments([...selectedDocuments, id])
    }
  }

  // Select all documents
  const selectAllDocuments = () => {
    const requiredDocs = getRequiredDocuments(selectedPort).map((doc) => doc.id)
    if (selectedDocuments.length === requiredDocs.length) {
      // If all documents are already selected, deselect all
      setSelectedDocuments([])
    } else {
      // Otherwise, select all required documents
      setSelectedDocuments(requiredDocs)
    }
  }

  // Reset the sharing process
  const resetShare = () => {
    setShareStatus(null)
    setShareResult(null)
    setDirectEmailSent(false)
    setError("")
    setSuccess("")
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Format document status
  const formatDocumentStatus = (status, expiryDays) => {
    if (status === "valid") return <span className="text-xs text-green-600">Valid</span>
    if (status === "permanent") return <span className="text-xs text-green-600">Permanent</span>
    if (status === "expiring-soon") return <span className="text-xs text-yellow-600">Expires in {expiryDays} days</span>
    if (status === "expired") return <span className="text-xs text-red-600">Expired</span>
    return <span className="text-xs text-gray-600">{status}</span>
  }

  // Get compliance status badge
  const getComplianceStatusBadge = (status) => {
    if (status === "compliant") return <Badge className="bg-green-100 text-green-800">Compliant</Badge>
    if (status === "warning") return <Badge className="bg-yellow-100 text-yellow-800">Attention Needed</Badge>
    if (status === "non-compliant") return <Badge className="bg-red-100 text-red-800">Non-Compliant</Badge>
    return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>
  }

  // Get compliance status icon
  const getComplianceStatusIcon = (status) => {
    if (status === "compliant") return <CheckSquare className="h-5 w-5 text-green-500" />
    if (status === "warning") return <AlertTriangle className="h-5 w-5 text-yellow-500" />
    if (status === "non-compliant") return <AlertTriangle className="h-5 w-5 text-red-500" />
    return <Info className="h-5 w-5 text-gray-500" />
  }

  // Calculate compliance percentage
  const calculateCompliancePercentage = (portId) => {
    if (documents.length === 0) return 0

    const validDocs = documents.filter((doc) => doc.status === "valid" || doc.status === "permanent")

    return (validDocs.length / documents.length) * 100
  }

  // Toggle security option
  const toggleSecurityOption = (option) => {
    setSecurityOptions({
      ...securityOptions,
      [option]: !securityOptions[option],
    })
  }

  // Get selected documents as full objects
  const getSelectedDocumentsObjects = () => {
    return selectedDocuments.map((docId) => getDocument(docId)).filter(Boolean)
  }

  // Get port info for vessel selector
  const getPortInfoForVesselSelector = (): PortInfo | undefined => {
    const port = getPort(selectedPort)
    if (!port) return undefined

    return {
      id: port.id,
      name: port.name,
      country: port.country,
      eta: port.eta,
      requiredDocsCount: port.requiredDocs.length,
    }
  }

  // Handle toggling vessel favorite status
  const handleToggleFavorite = (vesselId: string) => {
    setFavoriteVessels({
      ...favoriteVessels,
      [vesselId]: !favoriteVessels[vesselId],
    })
  }

  // Handle email link button click
  const handleEmailLink = () => {
    const port = getPort(selectedPort)
    if (!port) return

    // Get recipient emails
    const recipientEmails = [port.authority.email, port.agent.email].join(",")

    // Create email subject
    const subject = `Port Documents for ${getVessel(selectedVessel)?.name} - ${port.name} Port Call`

    // Create email body
    const body = `Hello,

I've shared the required port documents for our upcoming port call in ${port.name}.

You can access the documents securely using this link:
${shareResult?.shareUrl || "https://comovis.co/share/HW-SG-MPA-7d9f3"}

The documents will be available until ${formatDate(port.etd)}.

${customMessage ? `\nAdditional notes:\n${customMessage}` : ""}

Regards,
${localStorage.getItem("userName") || "Comovis User"}`

    // Create mailto URL
    const mailtoUrl = `mailto:${recipientEmails}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

    // Open default email client
    window.open(mailtoUrl, "_blank")
  }

  // Initialize selected documents when port changes
  React.useEffect(() => {
    if (selectedPort) {
      const port = getPort(selectedPort)
      if (port) {
        setSelectedDocuments(port.requiredDocs)
      }
    }
  }, [selectedPort])

  // Show authentication prompt if not authenticated (but allow demo mode)
  const showAuthPrompt = !isAuthenticated && activeTab === "history"

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Port Document Sharing</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <Button variant="outline" size="sm" onClick={() => setAccessLogsOpen(true)}>
            <FileWarning className="h-4 w-4 mr-2" />
            Access Logs
          </Button>
        </div>
      </div>

      {/* Show authentication status */}
      {!isAuthenticated && (
        <Alert className="mb-4 bg-blue-50 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          <Info className="h-4 w-4" />
          <AlertTitle>Demo Mode</AlertTitle>
          <AlertDescription>
            You're viewing the interface in demo mode with sample data. Log in to access real functionality.
          </AlertDescription>
        </Alert>
      )}

      {/* Use the improved VesselSelector component with fetched vessels */}
      <VesselSelector
        vessels={vessels}
        selectedVessel={selectedVessel}
        onVesselChange={setSelectedVessel}
        portInfo={getPortInfoForVesselSelector()}
        formatDate={formatDate}
        onToggleFavorite={handleToggleFavorite}
        isLoading={isLoadingVessels}
        error={vesselError}
      />

      {/* Display errors/success messages */}
      {(error || documentsError) && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || documentsError}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-4 bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-200">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="upcoming">Upcoming Port Calls</TabsTrigger>
          <TabsTrigger value="history">Sharing History</TabsTrigger>
          <TabsTrigger value="templates">Document Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {/* Port Call Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {upcomingPortCalls.map((portCall) => {
              const port = getPort(portCall.portId)
              const vessel = getVessel(portCall.vesselId)
              const compliancePercentage = calculateCompliancePercentage(portCall.portId)

              return (
                <Card
                  key={`${portCall.portId}-${portCall.vesselId}`}
                  className={`cursor-pointer hover:border-blue-300 transition-colors ${selectedPort === portCall.portId ? "border-blue-500" : ""}`}
                  onClick={() => {
                    setSelectedPort(portCall.portId)
                    setSelectedVessel(portCall.vesselId)
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center">
                        <div className="bg-blue-100 text-blue-800 h-10 w-10 rounded-full flex items-center justify-center mr-3">
                          {port?.avatar}
                        </div>
                        <div>
                          <h3 className="font-medium">{port?.name}</h3>
                          <p className="text-xs text-gray-500">
                            {port?.country} • {port?.code}
                          </p>
                        </div>
                      </div>
                      {getComplianceStatusBadge(portCall.complianceStatus)}
                    </div>

                    <div className="flex items-center mb-3">
                      <Ship className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm">{vessel?.name}</span>
                    </div>

                    <div className="flex items-center mb-3">
                      <CalendarClock className="h-4 w-4 text-gray-500 mr-2" />
                      <div>
                        <p className="text-sm">ETA: {formatDate(portCall.eta)}</p>
                        <p className="text-xs text-gray-500">
                          {portCall.daysUntil <= 7 ? (
                            <span className="text-yellow-600 font-medium">{portCall.daysUntil} days until arrival</span>
                          ) : (
                            <span>{portCall.daysUntil} days until arrival</span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium">Document Compliance</span>
                        <span className="text-xs">{Math.round(compliancePercentage)}%</span>
                      </div>
                      <Progress value={compliancePercentage} className="h-2" />
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{documents.length} available documents</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {selectedPort && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main sharing form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Port Call Document Sharing</CardTitle>
                        <CardDescription>Prepare and share documents for your upcoming port call</CardDescription>
                      </div>
                      {getComplianceStatusIcon(getPort(selectedPort)?.complianceStatus)}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {shareStatus === null && (
                      <>
                        {/* Port Call Timeline */}
                        <div className="space-y-1.5">
                          <Label>Port Call Timeline</Label>
                          <Card>
                            <CardContent className="p-3">
                              <div className="flex items-center justify-between">
                                <div className="flex flex-col items-center">
                                  <span className="text-xs text-gray-500">ETA</span>
                                  <span className="font-medium">{formatDate(getPort(selectedPort)?.eta)}</span>
                                </div>
                                <div className="flex-1 mx-4 h-1 bg-gray-200 relative">
                                  <div className="absolute -top-2 left-0 h-5 w-5 rounded-full bg-blue-500"></div>
                                  <div className="absolute -top-2 right-0 h-5 w-5 rounded-full bg-blue-200"></div>
                                </div>
                                <div className="flex flex-col items-center">
                                  <span className="text-xs text-gray-500">ETD</span>
                                  <span className="font-medium">{formatDate(getPort(selectedPort)?.etd)}</span>
                                </div>
                              </div>

                              <div className="mt-4 text-center">
                                <span className="text-sm font-medium text-yellow-600">
                                  Document submission deadline:{" "}
                                  {formatDate(
                                    new Date(new Date(getPort(selectedPort)?.eta).getTime() - 24 * 60 * 60 * 1000),
                                  )}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Recipients */}
                        <div className="space-y-1.5">
                          <Label>Recipients</Label>
                          <Card>
                            <CardContent className="p-3">
                              <div className="space-y-3">
                                {/* Port Authority */}
                                <div className="flex items-center justify-between py-1">
                                  <div className="flex items-center">
                                    <Checkbox id="recipient-port-authority" defaultChecked />
                                    <div className="ml-2">
                                      <Label htmlFor="recipient-port-authority" className="cursor-pointer">
                                        {getPort(selectedPort)?.authority.name}
                                      </Label>
                                      <p className="text-xs text-gray-500">{getPort(selectedPort)?.authority.email}</p>
                                    </div>
                                  </div>
                                  <Badge className="mr-2" variant="outline">
                                    Port Authority
                                  </Badge>
                                </div>

                                {/* Agent */}
                                <div className="flex items-center justify-between py-1">
                                  <div className="flex items-center">
                                    <Checkbox id="recipient-agent" defaultChecked />
                                    <div className="ml-2">
                                      <Label htmlFor="recipient-agent" className="cursor-pointer">
                                        {getPort(selectedPort)?.agent.name}
                                      </Label>
                                      <p className="text-xs text-gray-500">{getPort(selectedPort)?.agent.email}</p>
                                    </div>
                                  </div>
                                  <Badge className="mr-2" variant="outline">
                                    Agent
                                  </Badge>
                                </div>

                                {/* Add New Recipient */}
                                <div className="mt-3 pt-3 border-t">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="outline" size="sm" className="w-full">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Recipient
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Add Recipient</DialogTitle>
                                        <DialogDescription>
                                          Add a new recipient to share documents with
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                          <Label htmlFor="recipient-email">Email</Label>
                                          <Input id="recipient-email" placeholder="email@example.com" />
                                        </div>
                                        <div className="space-y-2">
                                          <Label htmlFor="recipient-name">Name (Optional)</Label>
                                          <Input id="recipient-name" placeholder="Recipient name" />
                                        </div>
                                        <div className="space-y-2">
                                          <Label htmlFor="recipient-type">Type</Label>
                                          <Select defaultValue="other">
                                            <SelectTrigger id="recipient-type">
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="port-authority">Port Authority</SelectItem>
                                              <SelectItem value="agent">Agent</SelectItem>
                                              <SelectItem value="charterer">Charterer</SelectItem>
                                              <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>
                                      <div className="flex justify-end">
                                        <Button>Add Recipient</Button>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Required Documents */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center">
                            <Label>Required Port Documents</Label>
                            <div className="flex items-center">
                              <Button variant="ghost" size="sm" onClick={selectAllDocuments}>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                {selectedDocuments.length === getRequiredDocuments(selectedPort).length
                                  ? "Deselect All"
                                  : "Select All"}
                              </Button>
                            </div>
                          </div>

                          <Card>
                            <CardContent className="p-3">
                              <div className="relative mb-3">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                                <Input placeholder="Search documents..." className="pl-8" />
                              </div>

                              {getRequiredDocuments(selectedPort).length > 0 ? (
                                <ScrollArea className="h-64">
                                  <div className="space-y-1">
                                    {getRequiredDocuments(selectedPort).map((doc) => (
                                      <div key={doc.id} className="flex items-center justify-between py-2 border-b">
                                        <div className="flex items-center">
                                          <Checkbox
                                            id={doc.id}
                                            checked={selectedDocuments.includes(doc.id)}
                                            onCheckedChange={() => toggleDocument(doc.id)}
                                          />
                                          <div className="ml-2">
                                            <Label htmlFor={doc.id} className="cursor-pointer">
                                              {doc.name}
                                            </Label>
                                            <p className="text-xs text-gray-500">{doc.issuer}</p>
                                          </div>
                                        </div>
                                        <div className="flex items-center">
                                          {formatDocumentStatus(doc.status, doc.expiryDays)}
                                          <TooltipProvider>
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <Button variant="ghost" size="sm" className="ml-2 h-8 w-8 p-0">
                                                  <Eye className="h-4 w-4" />
                                                </Button>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                <p>Preview document</p>
                                              </TooltipContent>
                                            </Tooltip>
                                          </TooltipProvider>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </ScrollArea>
                              ) : (
                                // Empty state
                                <div className="h-64 flex flex-col items-center justify-center text-center p-8">
                                  <FileText className="h-12 w-12 text-gray-300 mb-4" />
                                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Documents Available</h3>
                                  <p className="text-sm text-gray-500 mb-4 max-w-sm">
                                    {isLoadingDocuments
                                      ? "Loading vessel documents..."
                                      : isAuthenticated
                                        ? "No documents found for this vessel. Upload documents to get started."
                                        : "Log in to view and manage vessel documents."}
                                  </p>
                                  {isAuthenticated && !isLoadingDocuments && (
                                    <Button variant="outline" size="sm">
                                      <Plus className="h-4 w-4 mr-2" />
                                      Upload Documents
                                    </Button>
                                  )}
                                </div>
                              )}

                              <div className="mt-3 pt-3 border-t flex justify-between items-center">
                                <span className="text-sm text-gray-500">
                                  {selectedDocuments.length} of {getRequiredDocuments(selectedPort).length} documents
                                  selected
                                </span>
                                <Button variant="outline" size="sm">
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Additional Document
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Security Options */}
                        <div className="space-y-1.5">
                          <Label>Security Options</Label>
                          <Card>
                            <CardContent className="p-3">
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <Shield className="h-4 w-4 text-gray-500 mr-2" />
                                    <Label className="cursor-pointer">Watermark Documents</Label>
                                  </div>
                                  <Switch
                                    checked={securityOptions.watermark}
                                    onCheckedChange={() => toggleSecurityOption("watermark")}
                                  />
                                </div>

                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <Shield className="h-4 w-4 text-gray-500 mr-2" />
                                    <Label className="cursor-pointer">Prevent Downloads</Label>
                                  </div>
                                  <Switch
                                    checked={securityOptions.preventDownloads}
                                    onCheckedChange={() => toggleSecurityOption("preventDownloads")}
                                  />
                                </div>

                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <Shield className="h-4 w-4 text-gray-500 mr-2" />
                                    <Label className="cursor-pointer">Access Tracking</Label>
                                  </div>
                                  <Switch
                                    checked={securityOptions.accessTracking}
                                    onCheckedChange={() => toggleSecurityOption("accessTracking")}
                                  />
                                </div>

                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <Shield className="h-4 w-4 text-gray-500 mr-2" />
                                    <Label className="cursor-pointer">Email Verification</Label>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Info className="h-4 w-4 ml-1 text-gray-400" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p className="max-w-xs">
                                            Recipients will need to verify their email address before accessing
                                            documents
                                          </p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                  <Switch
                                    checked={securityOptions.emailVerification}
                                    onCheckedChange={() => toggleSecurityOption("emailVerification")}
                                  />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Access Duration */}
                        <div className="space-y-1.5">
                          <Label>Access Duration</Label>
                          <div className="grid grid-cols-5 gap-2">
                            <div
                              className={`border rounded-md p-3 cursor-pointer ${accessDuration === "24-hours" ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"}`}
                              onClick={() => setAccessDuration("24-hours")}
                            >
                              <div className="flex flex-col items-center text-center">
                                <Clock className="h-5 w-5 text-gray-500 mb-1" />
                                <p className="text-sm font-medium">24 Hours</p>
                              </div>
                            </div>

                            <div
                              className={`border rounded-md p-3 cursor-pointer ${accessDuration === "3-days" ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"}`}
                              onClick={() => setAccessDuration("3-days")}
                            >
                              <div className="flex flex-col items-center text-center">
                                <Clock className="h-5 w-5 text-gray-500 mb-1" />
                                <p className="text-sm font-medium">3 Days</p>
                              </div>
                            </div>

                            <div
                              className={`border rounded-md p-3 cursor-pointer ${accessDuration === "7-days" ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"}`}
                              onClick={() => setAccessDuration("7-days")}
                            >
                              <div className="flex flex-col items-center text-center">
                                <Clock className="h-5 w-5 text-gray-500 mb-1" />
                                <p className="text-sm font-medium">7 Days</p>
                              </div>
                            </div>

                            <div
                              className={`border rounded-md p-3 cursor-pointer ${accessDuration === "never" ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"}`}
                              onClick={() => setAccessDuration("never")}
                            >
                              <div className="flex flex-col items-center text-center">
                                <Clock className="h-5 w-5 text-gray-500 mb-1" />
                                <p className="text-sm font-medium">Never Expires</p>
                              </div>
                            </div>

                            <div
                              className={`border rounded-md p-3 cursor-pointer ${accessDuration === "custom" ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"}`}
                              onClick={() => setAccessDuration("custom")}
                            >
                              <div className="flex flex-col items-center text-center">
                                <Calendar className="h-5 w-5 text-gray-500 mb-1" />
                                <p className="text-sm font-medium">Custom</p>
                              </div>
                            </div>
                          </div>

                          {accessDuration === "custom" && (
                            <div className="mt-2">
                              <Input
                                type="date"
                                className="w-full"
                                value={customExpiryDate}
                                onChange={(e) => setCustomExpiryDate(e.target.value)}
                              />
                            </div>
                          )}
                        </div>

                        {/* Custom Message */}
                        <div className="space-y-1.5">
                          <Label>Custom Message (Optional)</Label>
                          <Textarea
                            placeholder="Add a custom message to include with your shared documents..."
                            value={customMessage}
                            onChange={(e) => setCustomMessage(e.target.value)}
                            className="min-h-[100px]"
                          />
                        </div>
                      </>
                    )}

                    {shareStatus === "processing" && (
                      <div className="py-8">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent rounded-full animate-spin mb-4"></div>
                          <h3 className="text-lg font-medium">Creating Secure Share</h3>
                          <p className="text-gray-500 mt-1">Please wait while we prepare your documents...</p>
                        </div>
                      </div>
                    )}

                    {shareStatus === "complete" && (
                      <div className="py-4">
                        <div className="flex flex-col items-center justify-center mb-6">
                          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="h-8 w-8 text-green-500" />
                          </div>
                          <h3 className="text-lg font-medium">Document Sharing Link Created Successfully</h3>
                          <p className="text-gray-500 mt-1">
                            A secure link has been created that you can share with recipients
                          </p>
                        </div>

                        <Card className="mb-4">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Secure Access Link</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                              <code className="text-sm text-gray-800">
                                {shareResult?.shareUrl || "https://comovis.co/share/HW-SG-MPA-7d9f3"}
                              </code>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  const url = shareResult?.shareUrl || "https://comovis.co/share/HW-SG-MPA-7d9f3"
                                  navigator.clipboard.writeText(url)
                                  setSuccess("Link copied to clipboard!")
                                  setTimeout(() => setSuccess(""), 3000)
                                }}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="mt-3 text-sm text-gray-500 flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>
                                Link expires on{" "}
                                {shareResult?.expiresAt
                                  ? formatDate(shareResult.expiresAt)
                                  : formatDate(getPort(selectedPort)?.etd)}
                              </span>
                            </div>
                          </CardContent>
                        </Card>

                        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-md p-3">
                          <div className="flex items-start">
                            <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                            <div>
                              <h4 className="text-sm font-medium text-blue-800">Sharing Options</h4>
                              <p className="text-sm text-blue-700 mt-1">
                                <strong>Open Email Client:</strong> Opens your email app with a pre-filled message
                                containing the link.
                              </p>
                              <p className="text-sm text-blue-700 mt-1">
                                <strong>Send Directly:</strong> Comovis will send the link directly to recipients with
                                delivery tracking.
                              </p>
                            </div>
                          </div>
                        </div>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Shared Documents</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {selectedDocuments.map((docId) => {
                                const doc = getDocument(docId)
                                return (
                                  <li key={docId} className="flex items-center text-sm">
                                    <FileText className="h-4 w-4 text-gray-500 mr-2" />
                                    <span>{doc?.name}</span>
                                  </li>
                                )
                              })}
                            </ul>
                          </CardContent>
                        </Card>

                        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-3">
                          <div className="flex items-start">
                            <LinkIcon className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                            <div>
                              <h4 className="text-sm font-medium text-blue-800">Access Tracking</h4>
                              <p className="text-sm text-blue-700 mt-1">
                                You'll receive notifications when documents are viewed or downloaded.
                              </p>
                              <Button size="sm" variant="outline" className="mt-2">
                                View Access Log
                              </Button>
                            </div>
                          </div>
                        </div>

                        {directEmailSent && (
                          <div className="mt-4 bg-green-50 border border-green-200 rounded-md p-3">
                            <div className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                              <div>
                                <h4 className="text-sm font-medium text-green-800">Email Sent Successfully</h4>
                                <p className="text-sm text-green-700 mt-1">
                                  The secure link has been emailed directly to the recipients.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {shareStatus === "error" && (
                      <div className="text-center p-8 border rounded-md border-dashed">
                        <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-500" />
                        <p className="font-medium mb-1">Error creating share</p>
                        <p className="text-sm text-slate-500 mb-4">{error || "An unexpected error occurred"}</p>
                        <Button onClick={resetShare} variant="outline" size="sm">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Try Again
                        </Button>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={resetShare}>
                      Cancel
                    </Button>
                    {shareStatus === null && (
                      <div className="flex space-x-2">
                        <Button variant="outline" onClick={() => setShowPreview(true)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </Button>
                        <Button onClick={handleShare} disabled={selectedDocuments.length === 0 || isLoading}>
                          {isLoading ? (
                            <>
                              <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                              Creating Share...
                            </>
                          ) : (
                            <>
                              <Share2 className="mr-2 h-4 w-4" />
                              Create Sharing Link
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                    {shareStatus === "complete" && (
                      <div className="flex space-x-2">
                        <Button variant="outline" onClick={handleEmailLink}>
                          <Mail className="mr-2 h-4 w-4" />
                          Open Email Client
                        </Button>
                        <Button onClick={handleSendDirectly} disabled={sendingDirectEmail}>
                          {sendingDirectEmail ? (
                            <>
                              <div className="mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                              Sending...
                            </>
                          ) : (
                            <>
                              <Share2 className="mr-2 h-4 w-4" />
                              Send Directly
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </CardFooter>
                </Card>
              </div>

              {/* Right sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-6 space-y-4">
                  {/* Sharing Summary Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Sharing Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Vessel</h3>
                        <div className="flex items-center">
                          <Ship className="h-4 w-4 text-blue-500 mr-2" />
                          <span>{getVessel(selectedVessel)?.name}</span>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Recipients</h3>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                                {getPort(selectedPort)?.authority.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{getPort(selectedPort)?.authority.name}</span>
                          </div>
                          <div className="flex items-center">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                                {getPort(selectedPort)?.agent.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{getPort(selectedPort)?.agent.name}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Documents</h3>
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 text-blue-500 mr-2" />
                          <span>{selectedDocuments.length} documents selected</span>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Security</h3>
                        <div className="space-y-1">
                          {securityOptions.watermark && (
                            <div className="flex items-center">
                              <Shield className="h-4 w-4 text-blue-500 mr-2" />
                              <span className="text-sm">Watermarked documents</span>
                            </div>
                          )}
                          {securityOptions.preventDownloads && (
                            <div className="flex items-center">
                              <Shield className="h-4 w-4 text-blue-500 mr-2" />
                              <span className="text-sm">Downloads prevented</span>

                              <span className="text-sm">Downloads prevented</span>
                            </div>
                          )}
                          {securityOptions.accessTracking && (
                            <div className="flex items-center">
                              <Shield className="h-4 w-4 text-blue-500 mr-2" />
                              <span className="text-sm">Access tracking enabled</span>
                            </div>
                          )}
                          {securityOptions.emailVerification && (
                            <div className="flex items-center">
                              <Shield className="h-4 w-4 text-blue-500 mr-2" />
                              <span className="text-sm">Email verification required</span>
                            </div>
                          )}
                          {!securityOptions.watermark &&
                            !securityOptions.preventDownloads &&
                            !securityOptions.accessTracking &&
                            !securityOptions.emailVerification && (
                              <div className="flex items-center">
                                <span className="text-sm text-gray-500">No security options enabled</span>
                              </div>
                            )}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Access Duration</h3>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-blue-500 mr-2" />
                          <span className="text-sm">
                            {accessDuration === "24-hours" && "24 hours"}
                            {accessDuration === "3-days" && "3 days"}
                            {accessDuration === "7-days" && "7 days"}
                            {accessDuration === "never" && "Never expires"}
                            {accessDuration === "custom" && "Custom date"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Help Card */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Need Help?</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <p className="text-sm text-gray-500">
                          Learn about port document requirements and best practices.
                        </p>
                        <Button variant="outline" className="w-full" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Port Guide
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history">
          {showAuthPrompt ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <AlertCircle className="h-12 w-12 text-blue-500 mb-4" />
                <h2 className="text-xl font-bold mb-2">Login Required</h2>
                <p className="text-gray-500 mb-4">You need to be logged in to view your document sharing history.</p>
                <Button onClick={() => (window.location.href = "/login")}>Go to Login</Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Document Sharing History</CardTitle>
                <CardDescription>View and manage your document shares</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingShares || isLoadingDocuments ? (
                  <div className="flex justify-center items-center p-8">
                    <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mr-3"></div>
                    <p>Loading {isLoadingDocuments ? "documents" : "document shares"}...</p>
                  </div>
                ) : (
                  <ShareHistoryTable
                    // Pass both real and dummy data with hybrid approach
                    shares={[
                      {
                        id: "share1",
                        recipient: "Singapore MPA",
                        recipientEmail: "portdocs@mpa.gov.sg",
                        date: "2025-05-15T10:30:00",
                        vessel: "Humble Warrior",
                        documentCount: 5,
                        accessCount: 3,
                        expiryDate: "2025-05-21",
                        status: "active",
                      },
                      {
                        id: "share2",
                        recipient: "Shell Vetting",
                        recipientEmail: "vetting@shell.com",
                        date: "2025-05-10T14:45:00",
                        vessel: "Humble Warrior",
                        documentCount: 12,
                        accessCount: 5,
                        expiryDate: "2025-05-17",
                        status: "active",
                      },
                      {
                        id: "share3",
                        recipient: "Hong Kong Marine Department",
                        recipientEmail: "mardep@gov.hk",
                        date: "2025-05-01T09:30:00",
                        vessel: "Pacific Explorer",
                        documentCount: 4,
                        accessCount: 2,
                        expiryDate: "2025-05-08",
                        status: "expired",
                      },
                      {
                        id: "share4",
                        recipient: "DNV GL",
                        recipientEmail: "certification@dnvgl.com",
                        date: "2025-04-28T16:15:00",
                        vessel: "Northern Star",
                        documentCount: 8,
                        accessCount: 6,
                        expiryDate: "2025-05-28",
                        status: "active",
                      },
                      {
                        id: "share5",
                        recipient: "Rotterdam Port Authority",
                        recipientEmail: "docs@portofrotterdam.com",
                        date: "2025-04-20T11:05:00",
                        vessel: "Pacific Explorer",
                        documentCount: 6,
                        accessCount: 0,
                        expiryDate: "2025-04-27",
                        status: "expired",
                      },
                    ]}
                    onRefresh={() => {}}
                  />
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="templates">
          <ShareTemplateList />
        </TabsContent>
      </Tabs>

      {/* Recipient Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Recipient Preview</DialogTitle>
            <DialogDescription>This is how recipients will see your shared documents</DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto flex-1 pr-1">
            <RecipientPreview
              vessel={getVessel(selectedVessel)}
              documents={getSelectedDocumentsObjects()}
              customMessage={customMessage}
              accessDuration={accessDuration || "7-days"}
              securityOptions={securityOptions}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Access Logs Modal */}
      <AccessLogsModal open={accessLogsOpen} onOpenChange={setAccessLogsOpen} />
    </div>
  )
}
