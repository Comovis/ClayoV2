"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Ship,
  Calendar,
  AlertTriangle,
  CheckCircle,
  FileText,
  Info,
  Download,
  Eye,
  MapPin,
  Shield,
  Search,
  Filter,
  ArrowRight,
  FileWarning,
  AlertCircle,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { TooltipProvider } from "@/components/ui/tooltip"
import { MyFleet } from "../../MainComponents/VesselSelector/VesselSelectorSidePanel" // Import the MyFleet component

export default function PSCPredictionDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPort, setSelectedPort] = useState("singapore")
  const [activeVessel, setActiveVessel] = useState("Humble Warrior") // Add state for active vessel

  // Handle document upload
  const handleUploadClick = (type: "single" | "batch") => {
    console.log(`Opening ${type} upload modal for vessel: ${activeVessel}`)
    // Here you would implement the logic to open the appropriate upload modal
  }

  // Mock data for the dashboard
  const vesselData = {
    name: "Humble Warrior",
    type: "Crude Oil Tanker",
    flag: "Panama",
    age: 12,
    riskProfile: "Standard Risk",
    riskScore: 68,
    lastInspection: {
      date: "2024-12-10",
      port: "Rotterdam",
      regime: "Paris MOU",
      deficiencies: 3,
      detained: false,
    },
    inspectionWindow: {
      start: "2025-05-10",
      end: "2025-06-20",
      daysUntil: 15,
    },
    documentStatus: {
      valid: 12,
      expiringSoon: 3,
      expired: 0,
      missing: 1,
    },
  }

  // Mock port calls
  const portCalls = [
    {
      id: "singapore",
      name: "Singapore",
      country: "Singapore",
      eta: "2025-05-20",
      etd: "2025-05-22",
      daysAway: 3,
      inspectionProbability: 72,
      riskLevel: "high",
      focusAreas: ["Fire safety systems", "Safety Management System", "Pollution prevention"],
    },
    {
      id: "rotterdam",
      name: "Rotterdam",
      country: "Netherlands",
      eta: "2025-06-05",
      etd: "2025-06-07",
      daysAway: 19,
      inspectionProbability: 35,
      riskLevel: "medium",
      focusAreas: ["Crew rest hours", "Navigation equipment", "Emergency systems"],
    },
    {
      id: "hongkong",
      name: "Hong Kong",
      country: "China",
      eta: "2025-06-15",
      etd: "2025-06-17",
      daysAway: 29,
      inspectionProbability: 18,
      riskLevel: "low",
      focusAreas: ["Pollution prevention", "Safety drills", "Documentation"],
    },
  ]

  // Mock critical issues
  const criticalIssues = [
    {
      id: "issue-1",
      title: "Safety Management Certificate Expiring Soon",
      description: "Certificate expires in 28 days (during Singapore port call)",
      type: "document",
      severity: "high",
      action: "Renew certificate before port call",
    },
    {
      id: "issue-2",
      title: "Previous Fire Safety Deficiency Not Fully Addressed",
      description: "Fire damper maintenance deficiency from last PSC inspection requires follow-up documentation",
      type: "deficiency",
      severity: "high",
      action: "Complete maintenance and document resolution",
    },
    {
      id: "issue-3",
      title: "Singapore Focused Inspection Campaign",
      description:
        "Singapore MPA is conducting a focused campaign on MARPOL Annex I compliance during your port call period",
      type: "port",
      severity: "medium",
      action: "Prepare for detailed MARPOL inspection",
    },
  ]

  // Mock similar vessel data
  const similarVessels = [
    {
      type: "Crude Oil Tanker",
      flag: "Panama",
      port: "Singapore",
      inspectionDate: "2025-04-15",
      deficiencies: [
        "Fire damper maintenance records incomplete",
        "Oil Record Book entries inconsistent",
        "Emergency fire pump not operational",
      ],
      detained: true,
    },
    {
      type: "Crude Oil Tanker",
      flag: "Marshall Islands",
      port: "Singapore",
      inspectionDate: "2025-04-02",
      deficiencies: ["Crew rest hours not properly recorded", "Safety Management Certificate not properly endorsed"],
      detained: false,
    },
  ]

  // Get risk color
  const getRiskColor = (level) => {
    switch (level) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-green-500"
      default:
        return "text-gray-500"
    }
  }

  // Get risk badge
  const getRiskBadge = (level) => {
    switch (level) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">High Risk</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium Risk</Badge>
      case "low":
        return <Badge className="bg-green-100 text-green-800">Low Risk</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>
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

  // Get selected port
  const getSelectedPort = () => {
    return portCalls.find((port) => port.id === selectedPort)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Add the MyFleet component */}
      <MyFleet activeVessel={activeVessel} onVesselSelect={setActiveVessel} onUploadClick={handleUploadClick} />

      {/* Main content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>PSC Inspection Prediction</CardTitle>
                  <CardDescription>
                    Vessel: {vesselData.name} • {vesselData.type} • {vesselData.flag}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-blue-50">
                  AI-Powered
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-medium">Vessel Risk Profile</h3>
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        {vesselData.riskProfile}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-center my-4">
                      <div className="relative w-32 h-32">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          <circle
                            className="text-gray-200"
                            strokeWidth="10"
                            stroke="currentColor"
                            fill="transparent"
                            r="40"
                            cx="50"
                            cy="50"
                          />
                          <circle
                            className="text-yellow-500"
                            strokeWidth="10"
                            stroke="currentColor"
                            fill="transparent"
                            r="40"
                            cx="50"
                            cy="50"
                            strokeDasharray="251.2"
                            strokeDashoffset={251.2 - (vesselData.riskScore / 100) * 251.2}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-3xl font-bold">{vesselData.riskScore}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-center text-gray-500">Based on vessel characteristics and history</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-2">Inspection Window</h3>
                    <div className="flex items-center mb-4">
                      <Calendar className="h-10 w-10 text-blue-500 mr-3" />
                      <div>
                        <p className="text-xl font-medium">
                          {formatDate(vesselData.inspectionWindow.start)} -{" "}
                          {formatDate(vesselData.inspectionWindow.end)}
                        </p>
                        <p className="text-sm text-blue-600">
                          {vesselData.inspectionWindow.daysUntil} days until window opens
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Days since last inspection:</span>
                        <span className="font-medium">145 days</span>
                      </div>
                      <Progress value={72} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>0</span>
                        <span>Standard Risk Window (150-240 days)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-2">Document Status</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Valid</span>
                          <span className="font-medium">{vesselData.documentStatus.valid}</span>
                        </div>
                        <Progress
                          value={
                            (vesselData.documentStatus.valid /
                              (vesselData.documentStatus.valid +
                                vesselData.documentStatus.expiringSoon +
                                vesselData.documentStatus.expired +
                                vesselData.documentStatus.missing)) *
                            100
                          }
                          className="h-2 bg-gray-100"
                          indicatorClassName="bg-green-500"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Expiring Soon</span>
                          <span className="font-medium">{vesselData.documentStatus.expiringSoon}</span>
                        </div>
                        <Progress
                          value={
                            (vesselData.documentStatus.expiringSoon /
                              (vesselData.documentStatus.valid +
                                vesselData.documentStatus.expiringSoon +
                                vesselData.documentStatus.expired +
                                vesselData.documentStatus.missing)) *
                            100
                          }
                          className="h-2 bg-gray-100"
                          indicatorClassName="bg-yellow-500"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Missing</span>
                          <span className="font-medium">{vesselData.documentStatus.missing}</span>
                        </div>
                        <Progress
                          value={
                            (vesselData.documentStatus.missing /
                              (vesselData.documentStatus.valid +
                                vesselData.documentStatus.expiringSoon +
                                vesselData.documentStatus.expired +
                                vesselData.documentStatus.missing)) *
                            100
                          }
                          className="h-2 bg-gray-100"
                          indicatorClassName="bg-red-500"
                        />
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      <FileText className="mr-2 h-4 w-4" />
                      View Document Hub
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="ports">Port Risk Analysis</TabsTrigger>
                  <TabsTrigger value="factors">Risk Factors</TabsTrigger>
                  <TabsTrigger value="history">Inspection History</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-4">
                  <div className="space-y-6">
                    <Card className="mb-6">
                      <CardHeader>
                        <CardTitle>Critical Attention Items</CardTitle>
                        <CardDescription>Issues that require immediate attention</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {criticalIssues.map((issue) => (
                            <div
                              key={issue.id}
                              className={`flex items-start p-3 rounded-md ${
                                issue.severity === "high"
                                  ? "bg-red-50 border border-red-100"
                                  : "bg-yellow-50 border border-yellow-100"
                              }`}
                            >
                              <AlertTriangle
                                className={`h-5 w-5 mr-3 mt-0.5 ${
                                  issue.severity === "high" ? "text-red-500" : "text-yellow-500"
                                }`}
                              />
                              <div>
                                <h4 className="font-medium">{issue.title}</h4>
                                <p className="text-sm text-gray-600 mt-1">{issue.description}</p>
                                <div className="mt-2">
                                  <Button size="sm" variant="outline">
                                    {issue.type === "document" ? "View Document" : "View Details"}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Upcoming Port Calls</CardTitle>
                          <CardDescription>Inspection probability by port</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {portCalls.map((port) => (
                              <div
                                key={port.id}
                                className={`p-3 border rounded-md cursor-pointer hover:border-blue-300 ${
                                  selectedPort === port.id ? "border-blue-500 bg-blue-50" : ""
                                }`}
                                onClick={() => setSelectedPort(port.id)}
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex items-center">
                                    <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                                    <div>
                                      <p className="font-medium">{port.name}</p>
                                      <p className="text-xs text-gray-500">
                                        {port.country} • ETA: {formatDate(port.eta)}
                                      </p>
                                    </div>
                                  </div>
                                  {getRiskBadge(port.riskLevel)}
                                </div>
                                <div className="mt-3">
                                  <div className="flex justify-between text-sm mb-1">
                                    <span>Inspection Probability:</span>
                                    <span className={`font-medium ${getRiskColor(port.riskLevel)}`}>
                                      {port.inspectionProbability}%
                                    </span>
                                  </div>
                                  <Progress
                                    value={port.inspectionProbability}
                                    className="h-2"
                                    indicatorClassName={`${
                                      port.riskLevel === "high"
                                        ? "bg-red-500"
                                        : port.riskLevel === "medium"
                                          ? "bg-yellow-500"
                                          : "bg-green-500"
                                    }`}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Similar Vessels</CardTitle>
                          <CardDescription>Recent inspections of similar vessels</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {similarVessels.map((vessel, index) => (
                              <div key={index} className="p-3 border rounded-md">
                                <div className="flex justify-between items-start">
                                  <div className="flex items-center">
                                    <Ship className="h-5 w-5 text-gray-500 mr-2" />
                                    <div>
                                      <p className="font-medium">{vessel.type}</p>
                                      <p className="text-xs text-gray-500">
                                        {vessel.flag} • {vessel.port}
                                      </p>
                                    </div>
                                  </div>
                                  <Badge
                                    className={
                                      vessel.detained ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                                    }
                                  >
                                    {vessel.detained ? "Detained" : `${vessel.deficiencies.length} Deficiencies`}
                                  </Badge>
                                </div>
                                <div className="mt-3 pt-3 border-t">
                                  <p className="text-xs text-gray-500 mb-2">
                                    Inspection date: {formatDate(vessel.inspectionDate)}
                                  </p>
                                  <ul className="space-y-1 text-sm">
                                    {vessel.deficiencies.map((deficiency, i) => (
                                      <li key={i} className="flex items-start">
                                        <AlertCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                                        <span>{deficiency}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="ports" className="mt-4">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Port Risk Analysis</h3>
                      <div className="flex items-center space-x-2">
                        <div className="relative">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Search ports..."
                            className="pl-8 w-60"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                        <Button variant="outline" size="sm">
                          <Filter className="h-4 w-4 mr-2" />
                          Filter
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {portCalls.map((port) => (
                        <Card
                          key={port.id}
                          className={`cursor-pointer hover:border-blue-300 transition-colors ${
                            selectedPort === port.id ? "border-blue-500" : ""
                          }`}
                          onClick={() => setSelectedPort(port.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center">
                                <div className="bg-blue-100 text-blue-800 h-10 w-10 rounded-full flex items-center justify-center mr-3">
                                  {port.name.substring(0, 2)}
                                </div>
                                <div>
                                  <h3 className="font-medium">{port.name}</h3>
                                  <p className="text-xs text-gray-500">{port.country}</p>
                                </div>
                              </div>
                              {getRiskBadge(port.riskLevel)}
                            </div>

                            <div className="flex items-center mb-3">
                              <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                              <div>
                                <p className="text-sm">ETA: {formatDate(port.eta)}</p>
                                <p className="text-xs text-gray-500">
                                  {port.daysAway <= 7 ? (
                                    <span className="text-yellow-600 font-medium">
                                      {port.daysAway} days until arrival
                                    </span>
                                  ) : (
                                    <span>{port.daysAway} days until arrival</span>
                                  )}
                                </p>
                              </div>
                            </div>

                            <div className="mb-3">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-medium">Inspection Probability</span>
                                <span className={`text-xs ${getRiskColor(port.riskLevel)}`}>
                                  {port.inspectionProbability}%
                                </span>
                              </div>
                              <Progress
                                value={port.inspectionProbability}
                                className="h-2"
                                indicatorClassName={`${
                                  port.riskLevel === "high"
                                    ? "bg-red-500"
                                    : port.riskLevel === "medium"
                                      ? "bg-yellow-500"
                                      : "bg-green-500"
                                }`}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {selectedPort && (
                      <Card>
                        <CardHeader>
                          <CardTitle>{getSelectedPort()?.name} Port Analysis</CardTitle>
                          <CardDescription>Detailed inspection risk analysis</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h3 className="text-sm font-medium mb-3">Inspection Statistics</h3>
                              <div className="space-y-3">
                                <div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span>Overall Inspection Rate</span>
                                    <span className="font-medium">{getSelectedPort()?.inspectionProbability}%</span>
                                  </div>
                                  <Progress
                                    value={getSelectedPort()?.inspectionProbability}
                                    className="h-2"
                                    indicatorClassName={`${
                                      getSelectedPort()?.riskLevel === "high"
                                        ? "bg-red-500"
                                        : getSelectedPort()?.riskLevel === "medium"
                                          ? "bg-yellow-500"
                                          : "bg-green-500"
                                    }`}
                                  />
                                </div>
                                <div className="flex items-center mt-4">
                                  <Ship className="h-5 w-5 text-gray-500 mr-2" />
                                  <span className="text-sm">Similar vessels inspected in last 30 days: 8</span>
                                </div>
                                <div className="flex items-center">
                                  <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                                  <span className="text-sm">Detention rate for similar vessels: 4.2%</span>
                                </div>
                              </div>

                              <h3 className="text-sm font-medium mt-6 mb-3">Risk Factors</h3>
                              <div className="space-y-2">
                                <div className="p-3 border rounded-md">
                                  <div className="flex justify-between">
                                    <span className="text-sm font-medium">Time Since Last Inspection</span>
                                    <Badge className="bg-yellow-100 text-yellow-800">High Impact</Badge>
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1">
                                    145 days since last inspection (approaching standard risk window)
                                  </p>
                                </div>
                                <div className="p-3 border rounded-md">
                                  <div className="flex justify-between">
                                    <span className="text-sm font-medium">Port Inspection Rate</span>
                                    <Badge className="bg-red-100 text-red-800">High Impact</Badge>
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {getSelectedPort()?.name} has a {getSelectedPort()?.inspectionProbability}%
                                    inspection rate for similar vessels
                                  </p>
                                </div>
                                <div className="p-3 border rounded-md">
                                  <div className="flex justify-between">
                                    <span className="text-sm font-medium">Document Status</span>
                                    <Badge className="bg-yellow-100 text-yellow-800">Medium Impact</Badge>
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1">
                                    3 documents expiring soon, 1 document missing
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h3 className="text-sm font-medium mb-3">Current Focus Areas</h3>
                              <div className="p-3 bg-blue-50 border border-blue-100 rounded-md mb-4">
                                <h4 className="text-sm font-medium text-blue-800">Concentrated Inspection Campaign</h4>
                                <p className="text-xs text-blue-700 mt-1">
                                  {getSelectedPort()?.name} is currently conducting a focused campaign on MARPOL Annex I
                                  compliance until June 30, 2025.
                                </p>
                              </div>
                              <ul className="space-y-2">
                                {getSelectedPort()?.focusAreas.map((area, index) => (
                                  <li key={index} className="flex items-start">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 mt-0.5">
                                      <span className="text-xs font-bold">{index + 1}</span>
                                    </div>
                                    <span>{area}</span>
                                  </li>
                                ))}
                              </ul>

                              <h3 className="text-sm font-medium mt-6 mb-3">Recommended Actions</h3>
                              <div className="space-y-2">
                                <div className="flex items-start">
                                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                  <div>
                                    <p className="text-sm font-medium">Complete fire safety system inspection</p>
                                    <p className="text-xs text-gray-500">Focus on fire dampers and detection systems</p>
                                  </div>
                                </div>
                                <div className="flex items-start">
                                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                  <div>
                                    <p className="text-sm font-medium">Verify Oil Record Book entries</p>
                                    <p className="text-xs text-gray-500">
                                      Ensure all entries for last 3 months are complete and accurate
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-start">
                                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                  <div>
                                    <p className="text-sm font-medium">Renew Safety Management Certificate</p>
                                    <p className="text-xs text-gray-500">Certificate expires during port stay</p>
                                  </div>
                                </div>
                              </div>

                              <Button className="w-full mt-4">
                                <Download className="mr-2 h-4 w-4" />
                                Generate Port Preparation Checklist
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="factors" className="mt-4">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Vessel Risk Profile Calculation</CardTitle>
                        <CardDescription>How your vessel's risk profile is determined</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          <div className="p-3 border rounded-md">
                            <h4 className="font-medium">Vessel Factors</h4>
                            <ul className="mt-2 space-y-1 text-sm">
                              <li className="flex justify-between">
                                <span>Vessel type:</span>
                                <span className="font-medium">Crude Oil Tanker</span>
                              </li>
                              <li className="flex justify-between">
                                <span>Age:</span>
                                <span className="font-medium">{vesselData.age} years</span>
                              </li>
                              <li className="flex justify-between">
                                <span>Flag:</span>
                                <span className="font-medium">{vesselData.flag} (White List)</span>
                              </li>
                            </ul>
                          </div>

                          <div className="p-3 border rounded-md">
                            <h4 className="font-medium">Performance Factors</h4>
                            <ul className="mt-2 space-y-1 text-sm">
                              <li className="flex justify-between">
                                <span>Company:</span>
                                <span className="font-medium">Medium Performance</span>
                              </li>
                              <li className="flex justify-between">
                                <span>Class:</span>
                                <span className="font-medium">DNV (High Performance)</span>
                              </li>
                              <li className="flex justify-between">
                                <span>Deficiency ratio:</span>
                                <span className="font-medium">Medium (3 in last inspection)</span>
                              </li>
                            </ul>
                          </div>

                          <div className="p-3 border rounded-md">
                            <h4 className="font-medium">History Factors</h4>
                            <ul className="mt-2 space-y-1 text-sm">
                              <li className="flex justify-between">
                                <span>Detentions:</span>
                                <span className="font-medium">0 in 36 months</span>
                              </li>
                              <li className="flex justify-between">
                                <span>Last inspection:</span>
                                <span className="font-medium">{formatDate(vesselData.lastInspection.date)}</span>
                              </li>
                              <li className="flex justify-between">
                                <span>Inspection window:</span>
                                <span className="font-medium">Standard (5-8 months)</span>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Key Risk Factors</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <RiskFactor
                              name="Vessel Age"
                              value={`${vesselData.age} years`}
                              impact="medium"
                              description="Vessels older than 12 years face increased scrutiny"
                            />
                            <RiskFactor
                              name="Flag Performance"
                              value="White List"
                              impact="low"
                              description="Panama is on the Paris MOU White List"
                            />
                            <RiskFactor
                              name="Time Since Last Inspection"
                              value="145 days"
                              impact="high"
                              description="Approaching standard risk vessel inspection window (150-240 days)"
                            />
                            <RiskFactor
                              name="Previous Deficiencies"
                              value="3 deficiencies"
                              impact="medium"
                              description="Found during last inspection in Rotterdam (Dec 2024)"
                            />
                            <RiskFactor
                              name="Document Status"
                              value="3 expiring soon, 1 missing"
                              impact="high"
                              description="Documents with issues increase inspection likelihood"
                            />
                            <RiskFactor
                              name="Company Performance"
                              value="Medium"
                              impact="medium"
                              description="Based on PSC history of all vessels in your fleet"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>How PSC Inspection Prediction Works</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="p-4 border rounded-lg bg-blue-50">
                            <h3 className="text-lg font-medium mb-2">Time Window Approach</h3>
                            <p>
                              Port State Control inspections aren't random but follow predictable patterns based on risk
                              assessment frameworks. Most PSC regimes use time windows for inspections based on vessel
                              risk profile:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                              <div className="p-3 border rounded-md bg-red-50">
                                <div className="flex justify-between">
                                  <span className="font-medium">High-Risk Ships</span>
                                  <span>Every 2-4 months</span>
                                </div>
                              </div>
                              <div className="p-3 border rounded-md bg-yellow-50">
                                <div className="flex justify-between">
                                  <span className="font-medium">Standard Risk Ships</span>
                                  <span>Every 5-8 months</span>
                                </div>
                              </div>
                              <div className="p-3 border rounded-md bg-green-50">
                                <div className="flex justify-between">
                                  <span className="font-medium">Low-Risk Ships</span>
                                  <span>Every 9-18 months</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h3 className="text-sm font-medium mb-3">Our Prediction Algorithm</h3>
                              <p className="mb-4">Our AI-powered system calculates inspection probability using:</p>

                              <ul className="space-y-2">
                                <li className="flex items-start">
                                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                  <span>Historical PSC data from all major MOUs</span>
                                </li>
                                <li className="flex items-start">
                                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                  <span>Your vessel's specific risk profile and history</span>
                                </li>
                                <li className="flex items-start">
                                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                  <span>Port-specific inspection patterns and focus areas</span>
                                </li>
                                <li className="flex items-start">
                                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                  <span>Similar vessel inspection outcomes</span>
                                </li>
                                <li className="flex items-start">
                                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                  <span>Current document status and deficiency history</span>
                                </li>
                              </ul>
                            </div>

                            <div>
                              <h3 className="text-sm font-medium mb-3">Limitations of Prediction</h3>
                              <p className="mb-4">
                                While our system provides highly accurate predictions, PSC inspections maintain some
                                unpredictability:
                              </p>

                              <div className="space-y-3">
                                <div className="p-3 border rounded-md">
                                  <h4 className="font-medium">Overriding Factors</h4>
                                  <p className="text-sm mt-2">
                                    Inspections can be triggered by reports from pilots, incidents, or visible
                                    deficiencies regardless of time windows.
                                  </p>
                                </div>

                                <div className="p-3 border rounded-md">
                                  <h4 className="font-medium">Resource Limitations</h4>
                                  <p className="text-sm mt-2">
                                    Not all eligible vessels get inspected due to PSC officer availability and
                                    prioritization.
                                  </p>
                                </div>

                                <div className="p-3 border rounded-md">
                                  <h4 className="font-medium">Deliberate Unpredictability</h4>
                                  <p className="text-sm mt-2">
                                    PSC regimes intentionally maintain some randomness to prevent operators from
                                    preparing only when inspections are expected.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="history" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>PSC Inspection History</CardTitle>
                      <CardDescription>Historical inspections and deficiency analysis</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="p-4 border rounded-md">
                          <h3 className="font-medium mb-3">Last PSC Inspection</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Date</p>
                              <p className="font-medium">{formatDate(vesselData.lastInspection.date)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Port</p>
                              <p className="font-medium">{vesselData.lastInspection.port}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">PSC Regime</p>
                              <p className="font-medium">{vesselData.lastInspection.regime}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Deficiencies</p>
                              <p className="font-medium">{vesselData.lastInspection.deficiencies}</p>
                            </div>
                            <div className="md:col-span-2">
                              <p className="text-sm text-gray-500">Detention</p>
                              <p className="font-medium">{vesselData.lastInspection.detained ? "Yes" : "No"}</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="mt-3">
                            <Eye className="h-4 w-4 mr-2" />
                            View Full Report
                          </Button>
                        </div>

                        <div className="p-4 border rounded-md">
                          <h3 className="font-medium mb-3">Deficiency Analysis</h3>
                          <div className="space-y-3">
                            <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-md">
                              <div className="flex items-start">
                                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                                <div>
                                  <h4 className="font-medium">Fire Safety Systems</h4>
                                  <p className="text-sm mt-1">
                                    Fire damper maintenance deficiency from last PSC inspection requires follow-up
                                    documentation.
                                  </p>
                                  <Button size="sm" variant="outline" className="mt-2">
                                    View Deficiency Details
                                  </Button>
                                </div>
                              </div>
                            </div>
                            <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-md">
                              <div className="flex items-start">
                                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                                <div>
                                  <h4 className="font-medium">Safety Management System</h4>
                                  <p className="text-sm mt-1">
                                    Implementation of SMS procedures and documentation needs improvement.
                                  </p>
                                  <Button size="sm" variant="outline" className="mt-2">
                                    View Deficiency Details
                                  </Button>
                                </div>
                              </div>
                            </div>
                            <div className="p-3 bg-green-50 border border-green-100 rounded-md">
                              <div className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                <div>
                                  <h4 className="font-medium">Pollution Prevention</h4>
                                  <p className="text-sm mt-1">Oil record book entries were found to be in order.</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 border rounded-md">
                          <h3 className="font-medium mb-3">Inspection Timeline</h3>
                          <div className="relative pl-8 space-y-6 before:absolute before:left-4 before:top-0 before:h-full before:w-0.5 before:bg-gray-200">
                            <div className="relative">
                              <div className="absolute -left-8 mt-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-white border">
                                <Shield className="h-5 w-5 text-blue-500" />
                              </div>
                              <div className="p-3 border rounded-md">
                                <h4 className="font-medium">Rotterdam PSC Inspection</h4>
                                <div className="flex items-center mt-1 text-sm text-gray-500">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  <span>{formatDate(vesselData.lastInspection.date)}</span>
                                </div>
                                <p className="text-sm mt-2">
                                  3 deficiencies found, no detention. Focus areas included fire safety systems and SMS
                                  documentation.
                                </p>
                              </div>
                            </div>
                            <div className="relative">
                              <div className="absolute -left-8 mt-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-white border">
                                <Shield className="h-5 w-5 text-gray-400" />
                              </div>
                              <div className="p-3 border rounded-md border-dashed">
                                <h4 className="font-medium">Estimated Next Inspection Window</h4>
                                <div className="flex items-center mt-1 text-sm text-gray-500">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  <span>
                                    {formatDate(vesselData.inspectionWindow.start)} -{" "}
                                    {formatDate(vesselData.inspectionWindow.end)}
                                  </span>
                                </div>
                                <p className="text-sm mt-2">Based on standard risk profile (5-8 month window)</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <Alert className="bg-blue-50 border-blue-200">
                <Info className="h-4 w-4 text-blue-500" />
                <AlertTitle>AI-Powered Recommendations</AlertTitle>
                <AlertDescription>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-start">
                      <ArrowRight className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                      <span>
                        Your vessel is approaching its PSC inspection window. Focus on addressing the fire safety
                        deficiencies from your last inspection.
                      </span>
                    </div>
                    <div className="flex items-start">
                      <ArrowRight className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                      <span>
                        Singapore has a high inspection rate for vessels with your profile. Prepare for a likely
                        inspection during your upcoming port call.
                      </span>
                    </div>
                    <div className="flex items-start">
                      <ArrowRight className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                      <span>
                        Renew your Safety Management Certificate before arrival in Singapore to avoid potential
                        deficiencies.
                      </span>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">
                <FileWarning className="mr-2 h-4 w-4" />
                View Deficiency History
              </Button>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Generate Inspection Preparation Plan
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

interface RiskFactorProps {
  name: string
  value: string
  impact: "low" | "medium" | "high"
  description: string
}

function RiskFactor({ name, value, impact, description }: RiskFactorProps) {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-green-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <TooltipProvider>
      <div className="p-3 border rounded-md">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">{name}</h4>
          <Badge
            className={`${impact === "high" ? "bg-red-100 text-red-800" : impact === "medium" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}
          >
            {impact} impact
          </Badge>
        </div>
        <div className="mt-2">
          <div className="flex items-center">
            <span className={`text-lg font-bold ${getImpactColor(impact)}`}>{value}</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
      </div>
    </TooltipProvider>
  )
}
