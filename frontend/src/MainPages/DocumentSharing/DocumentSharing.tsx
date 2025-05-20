"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
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

export default function PortDocumentSharing() {
  const [activeTab, setActiveTab] = useState("upcoming")
  const [selectedPort, setSelectedPort] = useState("singapore")
  const [selectedVessel, setSelectedVessel] = useState("humble-warrior")
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

  // Ports data
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

  // Vessels
  const vessels: Vessel[] = [
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

  // Documents
  const documents = [
    {
      id: "smc",
      name: "Safety Management Certificate",
      issuer: "Panama Maritime Authority",
      status: "expiring-soon",
      expiryDays: 28,
      category: "statutory",
      required: true,
    },
    {
      id: "iopp",
      name: "Int'l Oil Pollution Prevention Certificate",
      issuer: "DNV GL",
      status: "expiring-soon",
      expiryDays: 45,
      category: "statutory",
      required: true,
    },
    {
      id: "registry",
      name: "Certificate of Registry",
      issuer: "Panama Maritime Authority",
      status: "valid",
      expiryDays: 365,
      category: "statutory",
      required: true,
    },
    {
      id: "loadline",
      name: "International Load Line Certificate",
      issuer: "DNV GL",
      status: "valid",
      expiryDays: 395,
      category: "statutory",
      required: true,
    },
    {
      id: "tonnage",
      name: "International Tonnage Certificate",
      issuer: "Panama Maritime Authority",
      status: "permanent",
      category: "statutory",
      required: false,
    },
    {
      id: "crew-list",
      name: "Crew List",
      issuer: "Company",
      status: "valid",
      category: "crew",
      required: true,
    },
    {
      id: "ballast-plan",
      name: "Ballast Water Management Plan",
      issuer: "Company",
      status: "valid",
      expiryDays: 180,
      category: "environmental",
      required: false,
    },
  ]

  // Upcoming port calls
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
    const port = getPort(portId)
    if (!port) return []
    return documents.filter((doc) => port.requiredDocs.includes(doc.id))
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

  // Handle share action
  const handleShare = () => {
    setShareStatus("processing")

    // Simulate sharing process
    setTimeout(() => {
      setShareStatus("complete")
    }, 1500)
  }

  // Reset the sharing process
  const resetShare = () => {
    setShareStatus(null)
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
    const port = getPort(portId)
    if (!port) return 0

    const requiredDocs = port.requiredDocs
    const validDocs = requiredDocs.filter((docId) => {
      const doc = getDocument(docId)
      return doc && (doc.status === "valid" || doc.status === "permanent")
    })

    return (validDocs.length / requiredDocs.length) * 100
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
https://comovis.io/share/HW-SG-MPA-7d9f3

The documents will be available until ${formatDate(port.etd)}.

${customMessage ? `\nAdditional notes:\n${customMessage}` : ""}

Regards,
${localStorage.getItem("userName") || "Comovis User"}`

    // Create mailto URL
    const mailtoUrl = `mailto:${recipientEmails}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

    // Open default email client
    window.open(mailtoUrl, "_blank")
  }

  const handleSendDirectly = () => {
    setSendingDirectEmail(true)

    // Simulate sending email through Comovis' email infrastructure
    setTimeout(() => {
      setSendingDirectEmail(false)
      setDirectEmailSent(true)

      // Reset the success message after a few seconds
      setTimeout(() => {
        setDirectEmailSent(false)
      }, 5000)
    }, 2000)
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

      {/* Use the improved VesselSelector component */}
      <VesselSelector
        vessels={vessels}
        selectedVessel={selectedVessel}
        onVesselChange={setSelectedVessel}
        portInfo={getPortInfoForVesselSelector()}
        formatDate={formatDate}
        onToggleFavorite={handleToggleFavorite}
      />

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
                      <span className="text-xs text-gray-500">{port?.requiredDocs.length} required documents</span>
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

                              <div className="mt-3 pt-3 border-t flex justify-between items-center">
                                <span className="text-sm text-gray-500">
                                  {selectedDocuments.length} of {getRequiredDocuments(selectedPort).length} required
                                  documents selected
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
                              <Input type="date" className="w-full" />
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
                              <code className="text-sm text-gray-800">https://comovis.io/share/HW-SG-MPA-7d9f3</code>
                              <Button size="sm" variant="ghost">
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="mt-3 text-sm text-gray-500 flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>Link expires after port departure ({formatDate(getPort(selectedPort)?.etd)})</span>
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
                        <Button onClick={handleShare} disabled={selectedDocuments.length === 0}>
                          <Share2 className="mr-2 h-4 w-4" />
                          Create Sharing Link
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
          {/* Integrate the ShareHistoryTable component */}
          <ShareHistoryTable />
        </TabsContent>

        <TabsContent value="templates">
          {/* Integrate the ShareTemplateList component */}
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
