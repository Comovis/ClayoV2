"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Calendar,
  Download,
  FileText,
  Clock,
  MapPin,
  FileWarning,
  Info,
  Eye,
  Search,
  Plus,
  ExternalLink,
  Shield,
  FileCheck,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { PortNotesTab } from "../../MainComponents/PortNotes/PortNotes"
import DocumentUploadModal from "../../MainComponents/UploadModal/UploadModal"
import { VesselSelector, type Vessel, type PortInfo } from "../../MainComponents/VesselSelector/VesselSelector"
import PortAlerts from "../../MainComponents/PortAlerts/PortIntelAlerts"

export default function PortPreparation() {
  const [activeTab, setActiveTab] = useState("required")
  const [selectedPort, setSelectedPort] = useState("singapore")
  const [selectedVessel, setSelectedVessel] = useState("humble-warrior")
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [selectedDocumentType, setSelectedDocumentType] = useState("")
  const [verificationInProgress, setVerificationInProgress] = useState(false)

  // Vessels data
  const vessels: Vessel[] = [
    {
      id: "humble-warrior",
      name: "Humble Warrior",
      type: "Crude Oil Tanker",
      flag: "Panama",
      avatar: "HW",
      imo: "9123456",
      callsign: "3FVR8",
    },
    {
      id: "pacific-explorer",
      name: "Pacific Explorer",
      type: "Container Ship",
      flag: "Singapore",
      avatar: "PE",
      imo: "9234567",
      callsign: "9VGS2",
    },
    {
      id: "northern-star",
      name: "Northern Star",
      type: "Bulk Carrier",
      flag: "Marshall Islands",
      avatar: "NS",
      imo: "9345678",
      callsign: "V7CK9",
    },
  ]

  // Ports data
  const ports = [
    {
      id: "singapore",
      name: "Singapore",
      country: "Singapore",
      eta: "2023-11-15T00:00:00",
      requiredDocsCount: 7,
    },
    {
      id: "shanghai",
      name: "Shanghai",
      country: "China",
      eta: "2023-12-05T00:00:00",
      requiredDocsCount: 8,
    },
    {
      id: "busan",
      name: "Busan",
      country: "South Korea",
      eta: "2023-12-20T00:00:00",
      requiredDocsCount: 6,
    },
  ]

  // Get port by ID
  const getPort = (id) => {
    return ports.find((port) => port.id === id)
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
      requiredDocsCount: port.requiredDocsCount,
    }
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Handle document upload completion
  const handleUploadComplete = (documentData: any) => {
    console.log("Document uploaded:", documentData)
    setUploadModalOpen(false)
    // You would update your documents state/cache here
  }

  // Handle document verification
  const handleVerifyAllDocuments = () => {
    setVerificationInProgress(true)

    // Simulate verification process
    setTimeout(() => {
      setVerificationInProgress(false)
      // Show success notification or update UI
    }, 2000)
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Port Preparation</h1>
        <div className="flex gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Port Call
          </Button>
        </div>
      </div>

      {/* Use the reusable VesselSelector component */}
      <VesselSelector
        vessels={vessels}
        selectedVessel={selectedVessel}
        onVesselChange={setSelectedVessel}
        portInfo={getPortInfoForVesselSelector()}
        formatDate={formatDate}
      />

      {/* Upcoming Port Calls Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Upcoming Port Calls</h2>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input placeholder="Search ports..." className="pl-8 w-60 h-9 bg-white" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PortCallCard
            port="Singapore"
            country="Singapore"
            eta="Nov 15, 2023"
            daysAway={28}
            riskLevel="medium"
            isNext={true}
            isSelected={selectedPort === "singapore"}
            onClick={() => setSelectedPort("singapore")}
          />

          <PortCallCard
            port="Shanghai"
            country="China"
            eta="Dec 5, 2023"
            daysAway={48}
            riskLevel="low"
            isNext={false}
            isSelected={selectedPort === "shanghai"}
            onClick={() => setSelectedPort("shanghai")}
          />

          <PortCallCard
            port="Busan"
            country="South Korea"
            eta="Dec 20, 2023"
            daysAway={63}
            riskLevel="low"
            isNext={false}
            isSelected={selectedPort === "busan"}
            onClick={() => setSelectedPort("busan")}
          />
        </div>
      </div>

      {/* Singapore Port Preparation */}
      <Card className="mb-6 border-t-4 border-t-blue-500">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarFallback className="bg-blue-100 text-blue-600">SG</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>Singapore Port Preparation</CardTitle>
                <CardDescription>Maritime and Port Authority (MPA)</CardDescription>
              </div>
            </div>
            <Badge className={`bg-yellow-100 text-yellow-800 hover:bg-yellow-100`}>Medium Risk</Badge>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex flex-col p-4 bg-gray-50 rounded-md">
              <div className="text-sm text-gray-500 mb-1">Estimated Arrival</div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-blue-500 mr-2" />
                <span className="font-medium">Nov 15, 2023</span>
              </div>
              <div className="text-sm text-blue-600 mt-1">28 days remaining</div>
            </div>

            <div className="flex flex-col p-4 bg-gray-50 rounded-md">
              <div className="text-sm text-gray-500 mb-1">Readiness Status</div>
              <div className="flex items-center">
                <FileWarning className="h-4 w-4 text-yellow-500 mr-2" />
                <span className="font-medium">2 Critical Issues</span>
              </div>
              <div className="text-sm text-yellow-600 mt-1">Action required</div>
            </div>

            <div className="flex flex-col p-4 bg-gray-50 rounded-md">
              <div className="text-sm text-gray-500 mb-1">Last Inspection</div>
              <div className="flex items-center">
                <Shield className="h-4 w-4 text-green-500 mr-2" />
                <span className="font-medium">Mar 10, 2023</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">No deficiencies</div>
            </div>
          </div>

          {/* Port Requirement Alerts */}
          <PortAlerts portId={selectedPort} />

          <Tabs defaultValue="required" className="mb-6" onValueChange={setActiveTab} value={activeTab}>
            <TabsList>
              <TabsTrigger value="required">Required Documents</TabsTrigger>
              <TabsTrigger value="port-specific">Port-Specific Forms</TabsTrigger>
              <TabsTrigger value="notes">Port Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="required" className="mt-4">
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-800">Critical Document Issues</h4>
                      <p className="text-sm text-amber-700 mt-1">
                        2 documents require immediate attention before your Singapore port call.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Required Vessel Certificates</h3>
                  <div className="relative">
                    <Search className="absolute left-2 top-1.5 h-4 w-4 text-gray-400 pointer-events-none" />
                    <Input placeholder="Search documents..." className="pl-8 w-60 h-8 bg-white" />
                  </div>
                </div>

                <div className="space-y-2">
                  <RequiredDocumentItem
                    title="Safety Management Certificate"
                    status="warning"
                    message="Expires in 28 days (during port stay)"
                    actions={["view", "upload"]}
                    onUpload={() => {
                      setSelectedDocumentType("Safety Management Certificate (SMC)")
                      setUploadModalOpen(true)
                    }}
                  />
                  <RequiredDocumentItem
                    title="International Oil Pollution Prevention Certificate"
                    status="warning"
                    message="Expires in 45 days"
                    actions={["view", "upload"]}
                    onUpload={() => {
                      setSelectedDocumentType("International Oil Pollution Prevention Certificate (IOPP)")
                      setUploadModalOpen(true)
                    }}
                  />
                  <RequiredDocumentItem
                    title="Certificate of Registry"
                    status="success"
                    message="Valid until May 20, 2024"
                    actions={["view"]}
                  />
                  <RequiredDocumentItem
                    title="International Load Line Certificate"
                    status="success"
                    message="Valid until June 15, 2024"
                    actions={["view"]}
                  />
                  <RequiredDocumentItem
                    title="Ship Security Plan"
                    status="error"
                    message="Document missing"
                    actions={["upload", "request"]}
                    onUpload={() => {
                      setSelectedDocumentType("Ship Security Plan")
                      setUploadModalOpen(true)
                    }}
                  />
                  <RequiredDocumentItem
                    title="Crew Certificates"
                    status="success"
                    message="All valid"
                    actions={["view"]}
                  />
                  <RequiredDocumentItem
                    title="Ballast Water Management Plan"
                    status="success"
                    message="Valid until August 10, 2024"
                    actions={["view"]}
                  />
                </div>

                <div className="flex justify-between mt-4">
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => setUploadModalOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Document
                    </Button>
                    <Button variant="outline" className="bg-amber-50 hover:bg-amber-100 border-amber-200">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Note
                    </Button>
                  </div>
                  <Button onClick={handleVerifyAllDocuments} disabled={verificationInProgress}>
                    <FileCheck className="mr-2 h-4 w-4" />
                    {verificationInProgress ? "Verifying..." : "Verify All Documents"}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="port-specific" className="mt-4">
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Singapore-Specific Requirements</h3>
                  <div className="space-y-2">
                    <PortSpecificItem
                      title="Maritime and Port Authority Declaration Form"
                      status="info"
                      message="Submit 24 hours before arrival"
                      actions={["download", "fill"]}
                    />
                    <PortSpecificItem
                      title="Ballast Water Reporting Form"
                      status="info"
                      message="Required for all vessels"
                      actions={["download", "fill"]}
                    />
                    <PortSpecificItem
                      title="Crew COVID-19 Vaccination Certificates"
                      status="info"
                      message="Required for shore leave"
                      actions={["upload"]}
                      onUpload={() => {
                        setSelectedDocumentType("Crew COVID-19 Vaccination Certificates")
                        setUploadModalOpen(true)
                      }}
                    />
                    <PortSpecificItem
                      title="Dangerous Goods Declaration"
                      status="info"
                      message="Required for crude oil cargo"
                      actions={["download", "fill"]}
                    />
                  </div>
                </div>

                <div className="flex justify-between mt-4">
                  <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Port-Specific Form
                  </Button>
                  <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Download All Forms
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notes" className="mt-4">
              <PortNotesTab />
            </TabsContent>
          </Tabs>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800">Port Intelligence Update</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Singapore MPA has announced a Concentrated Inspection Campaign (CIC) focusing on MARPOL Annex I
                  compliance from November 1 to December 31, 2023. Vessels should ensure all oil filtering equipment is
                  operational and oil record books are properly maintained.
                </p>
                <div className="mt-2 flex items-center">
                  <Button size="sm" variant="outline" className="mr-2">
                    <ExternalLink className="h-3.5 w-3.5 mr-1" />
                    View Source
                  </Button>
                  <span className="text-xs text-blue-600">Source: Singapore MPA Official Notice • Oct 15, 2023</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">{/* Footer content removed as requested */}</CardFooter>
      </Card>

      {/* Port Requirements Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Port Requirements Overview</CardTitle>
          <CardDescription>Key requirements provided by port agents and authorities</CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="singapore">
            <TabsList>
              <TabsTrigger value="singapore">Singapore</TabsTrigger>
              <TabsTrigger value="shanghai">Shanghai</TabsTrigger>
              <TabsTrigger value="busan">Busan</TabsTrigger>
            </TabsList>

            <TabsContent value="singapore" className="mt-4">
              <div className="space-y-4">
                <PortRequirementCard
                  title="MARPOL Annex I Compliance"
                  category="Environmental"
                  description="Singapore is conducting a Concentrated Inspection Campaign on MARPOL Annex I compliance. Ensure oil filtering equipment is operational and oil record books are properly maintained."
                  status="critical"
                  source="Singapore MPA"
                  actions={["view-details"]}
                />

                <PortRequirementCard
                  title="Ballast Water Management"
                  category="Environmental"
                  description="Singapore requires D-2 standard compliance for ballast water management. Ensure your system is operational and records are up to date."
                  status="important"
                  source="Port Agent: Wilhelmsen Ships Service"
                  actions={["view-details"]}
                />

                <PortRequirementCard
                  title="Advance Notification Requirements"
                  category="Administrative"
                  description="Submit Pre-Arrival Notification at least 24 hours before arrival. For vessels carrying dangerous goods, submit declaration 48 hours in advance."
                  status="standard"
                  source="Singapore MPA"
                  actions={["view-details"]}
                />

                <PortRequirementCard
                  title="Crew Shore Leave Requirements"
                  category="Immigration"
                  description="All crew members must have valid COVID-19 vaccination certificates for shore leave. Ensure all crew passports have at least 6 months validity."
                  status="standard"
                  source="Immigration & Checkpoints Authority"
                  actions={["view-details"]}
                />
              </div>
            </TabsContent>

            <TabsContent value="shanghai" className="mt-4">
              <div className="flex justify-center items-center p-8 text-gray-500">
                <p>Select this port call to view requirements</p>
              </div>
            </TabsContent>

            <TabsContent value="busan" className="mt-4">
              <div className="flex justify-center items-center p-8 text-gray-500">
                <p>Select this port call to view requirements</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Document Upload Modal */}
      <DocumentUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        initialVesselId="Humble Warrior"
        onUploadComplete={handleUploadComplete}
      />
    </div>
  )
}

function PortCallCard({ port, country, eta, daysAway, riskLevel, isNext, isSelected, onClick }) {
  const riskConfig = {
    low: {
      badgeClass: "bg-green-100 text-green-800 hover:bg-green-100",
      borderClass: isNext ? "border-l-4 border-l-green-500" : "",
    },
    medium: {
      badgeClass: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      borderClass: isNext ? "border-l-4 border-l-yellow-500" : "",
    },
    high: {
      badgeClass: "bg-red-100 text-red-800 hover:bg-red-100",
      borderClass: isNext ? "border-l-4 border-l-red-500" : "",
    },
  }

  const config = riskConfig[riskLevel]

  return (
    <Card
      className={`${config.borderClass} ${isNext ? "bg-blue-50" : ""} ${isSelected ? "ring-2 ring-blue-500" : ""} cursor-pointer transition-all hover:shadow-md`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center">
            <MapPin className={`h-5 w-5 mr-2 ${isNext ? "text-blue-500" : "text-gray-500"}`} />
            <div>
              <h3 className="font-medium">{port}</h3>
              <p className="text-sm text-gray-500">{country}</p>
            </div>
          </div>
          <Badge className={config.badgeClass}>{riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk</Badge>
        </div>

        <div className="flex items-center mt-3 text-sm">
          <Calendar className="h-4 w-4 text-gray-500 mr-1" />
          <span className="text-gray-700">{eta}</span>
          <span className="ml-2 text-blue-600">({daysAway} days)</span>
        </div>

        {isNext && (
          <Button className="w-full mt-3" size="sm">
            Prepare Port Call
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

function RequiredDocumentItem({ title, status, message, actions = [], onUpload }) {
  const statusConfig = {
    success: {
      icon: CheckCircle,
      iconClass: "text-green-500",
      messageClass: "text-green-700",
    },
    warning: {
      icon: Clock,
      iconClass: "text-yellow-500",
      messageClass: "text-yellow-700",
    },
    error: {
      icon: AlertCircle,
      iconClass: "text-red-500",
      messageClass: "text-red-700",
    },
    info: {
      icon: Info,
      iconClass: "text-blue-500",
      messageClass: "text-blue-700",
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div className="flex items-center justify-between py-2 border-b">
      <div className="flex items-center">
        <FileText className="h-4 w-4 text-gray-500 mr-2" />
        <span className="font-medium">{title}</span>
      </div>
      <div className="flex items-center">
        <div className="flex items-center mr-4">
          <Icon className={`h-4 w-4 ${config.iconClass} mr-1`} />
          <span className={`text-sm ${config.messageClass}`}>{message}</span>
        </div>
        <div className="flex space-x-1">
          {actions.includes("view") && (
            <Button size="sm" variant="ghost" className="h-7 px-2">
              <Eye className="h-3.5 w-3.5" />
            </Button>
          )}
          {actions.includes("upload") && (
            <Button size="sm" className="h-7" onClick={onUpload}>
              Upload
            </Button>
          )}
          {actions.includes("request") && (
            <Button size="sm" variant="outline" className="h-7">
              Request
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function PortSpecificItem({ title, status, message, actions = [], onUpload }) {
  const statusConfig = {
    success: {
      icon: CheckCircle,
      iconClass: "text-green-500",
      messageClass: "text-green-700",
    },
    warning: {
      icon: Clock,
      iconClass: "text-yellow-500",
      messageClass: "text-yellow-700",
    },
    error: {
      icon: AlertCircle,
      iconClass: "text-red-500",
      messageClass: "text-red-700",
    },
    info: {
      icon: Info,
      iconClass: "text-blue-500",
      messageClass: "text-blue-700",
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div className="flex items-center justify-between py-2 border-b">
      <div className="flex items-center">
        <FileText className="h-4 w-4 text-gray-500 mr-2" />
        <span className="font-medium">{title}</span>
      </div>
      <div className="flex items-center">
        <div className="flex items-center mr-4">
          <Icon className={`h-4 w-4 ${config.iconClass} mr-1`} />
          <span className={`text-sm ${config.messageClass}`}>{message}</span>
        </div>
        <div className="flex space-x-1">
          {actions.includes("view") && (
            <Button size="sm" variant="ghost" className="h-7 px-2">
              <Eye className="h-3.5 w-3.5" />
            </Button>
          )}
          {actions.includes("upload") && (
            <Button size="sm" className="h-7" onClick={onUpload}>
              Upload
            </Button>
          )}
          {actions.includes("download") && (
            <Button size="sm" variant="ghost" className="h-7 px-2">
              <Download className="h-3.5 w-3.5" />
            </Button>
          )}
          {actions.includes("fill") && (
            <Button size="sm" className="h-7">
              Fill Form
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function PortRequirementCard({ title, category, description, status, source, actions = [] }) {
  const statusConfig = {
    critical: {
      badgeText: "Critical",
      badgeClass: "bg-red-100 text-red-800",
      borderClass: "border-l-red-500",
    },
    important: {
      badgeText: "Important",
      badgeClass: "bg-yellow-100 text-yellow-800",
      borderClass: "border-l-yellow-500",
    },
    standard: {
      badgeText: "Standard",
      badgeClass: "bg-blue-100 text-blue-800",
      borderClass: "border-l-blue-500",
    },
  }

  const config = statusConfig[status]

  return (
    <Card className={`border-l-4 ${config.borderClass}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-xs text-gray-500">{category}</p>
          </div>
          <Badge className={config.badgeClass}>{config.badgeText}</Badge>
        </div>

        <p className="text-sm text-gray-700 mb-2">{description}</p>

        <p className="text-xs text-gray-500 mb-3">Source: {source}</p>

        <div className="flex justify-end space-x-2">
          {actions.includes("view-details") && (
            <Button size="sm" variant="outline">
              <Eye className="h-3.5 w-3.5 mr-1" />
              Details
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
