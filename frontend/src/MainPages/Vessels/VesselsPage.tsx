"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Ship,
  CheckCircle,
  Clock,
  AlertCircle,
  AlertTriangle,
  Plus,
  Search,
  SlidersHorizontal,
  MapPin,
  List,
  Map,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Link } from "react-router-dom"
import AddVesselModal from "../../MainComponents/AddVesselModal/AddNewVessel"
import { SubscriptionIndicator, type SubscriptionData } from "../../MainComponents/UserSubscriptions/SubscriptionIndicator"

export default function FleetPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState("grid")
  const [isAddVesselModalOpen, setIsAddVesselModalOpen] = useState(false)

  // Mock subscription data - would come from user context in real app
  const subscriptionData: SubscriptionData = {
    plan: "Professional",
    vesselLimit: 10,
    vesselsUsed: 3,
    expiresAt: "December 15, 2023",
  }

  // Mock vessel data
  const vessels = [
    {
      id: "v1",
      name: "Humble Warrior",
      type: "Crude Oil Tanker",
      flag: "Panama",
      imo: "9876543",
      complianceScore: 80,
      documentStatus: {
        valid: 12,
        expiringSoon: 3,
        expired: 0,
        missing: 1,
      },
      nextPort: "Singapore",
      eta: "Nov 15, 2023",
      location: { lat: 1.352083, lng: 103.819839 },
    },
    {
      id: "v2",
      name: "Pacific Explorer",
      type: "Container Ship",
      flag: "Singapore",
      imo: "9765432",
      complianceScore: 92,
      documentStatus: {
        valid: 14,
        expiringSoon: 1,
        expired: 0,
        missing: 0,
      },
      nextPort: "Rotterdam",
      eta: "Nov 25, 2023",
      location: { lat: 51.9225, lng: 4.47917 },
    },
    {
      id: "v3",
      name: "Northern Star",
      type: "Bulk Carrier",
      flag: "Marshall Islands",
      imo: "9654321",
      complianceScore: 65,
      documentStatus: {
        valid: 10,
        expiringSoon: 2,
        expired: 1,
        missing: 2,
      },
      nextPort: "Shanghai",
      eta: "Dec 10, 2023",
      location: { lat: 31.2304, lng: 121.4737 },
    },
  ]

  // Filter vessels based on search query
  const filteredVessels = vessels.filter(
    (vessel) =>
      vessel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vessel.imo.includes(searchQuery) ||
      vessel.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vessel.flag.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header with subscription info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Fleet Management</h1>
          <p className="text-gray-500">Manage your vessels and monitor compliance</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          {/* Subscription indicator */}
          <SubscriptionIndicator subscriptionData={subscriptionData} />

          {/* Add vessel button */}
          <Button
            onClick={() => setIsAddVesselModalOpen(true)}
            disabled={subscriptionData.vesselsUsed >= subscriptionData.vesselLimit}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Vessel
          </Button>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-500" />
          </div>
          <Input
            placeholder="Search by vessel name, IMO, type or flag..."
            className="pl-10 h-10 bg-white border border-gray-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="tanker">Tankers</SelectItem>
              <SelectItem value="container">Container Ships</SelectItem>
              <SelectItem value="bulk">Bulk Carriers</SelectItem>
            </SelectContent>
          </Select>

          <div className="border rounded-md flex">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="rounded-none border-l border-r border-gray-200"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "map" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("map")}
              className="rounded-l-none"
            >
              <Map className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs for vessel status */}
      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Vessels ({vessels.length})</TabsTrigger>
          <TabsTrigger value="compliant">
            Compliant ({vessels.filter((v) => v.complianceScore >= 80).length})
          </TabsTrigger>
          <TabsTrigger value="attention">
            Needs Attention ({vessels.filter((v) => v.complianceScore < 80).length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Vessels grid */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVessels.map((vessel) => (
            <VesselCard key={vessel.id} vessel={vessel} />
          ))}

          {/* Add vessel card - shown if under limit */}
          {subscriptionData.vesselsUsed < subscriptionData.vesselLimit && (
            <AddVesselCard onClick={() => setIsAddVesselModalOpen(true)} />
          )}
        </div>
      )}

      {/* Vessels list view */}
      {viewMode === "list" && (
        <div className="space-y-4">
          {filteredVessels.map((vessel) => (
            <VesselListItem key={vessel.id} vessel={vessel} />
          ))}
        </div>
      )}

      {/* Map view placeholder */}
      {viewMode === "map" && (
        <Card className="h-[500px] flex items-center justify-center">
          <CardContent className="text-center">
            <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium">Map View</h3>
            <p className="text-gray-500">Coming soon</p>
          </CardContent>
        </Card>
      )}

      {/* Add vessel modal */}
      <AddVesselModal isOpen={isAddVesselModalOpen} onClose={() => setIsAddVesselModalOpen(false)} />
    </div>
  )
}

function VesselCard({ vessel }) {
  let scoreColor = "bg-red-500"
  let scoreTextColor = "text-red-700"
  let scoreBgColor = "bg-red-50"

  if (vessel.complianceScore >= 90) {
    scoreColor = "bg-green-500"
    scoreTextColor = "text-green-700"
    scoreBgColor = "bg-green-50"
  } else if (vessel.complianceScore >= 70) {
    scoreColor = "bg-yellow-500"
    scoreTextColor = "text-yellow-700"
    scoreBgColor = "bg-yellow-50"
  }

  return (
    <Card
      className="overflow-hidden border-t-4 hover:shadow-md transition-shadow duration-200"
      style={{ borderTopColor: scoreColor.replace("bg-", "rgb(") }}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <Ship className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">{vessel.name}</CardTitle>
              <p className="text-sm text-gray-500">
                {vessel.type} • {vessel.flag}
              </p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full ${scoreBgColor} ${scoreTextColor} font-medium text-sm`}>
            {vessel.complianceScore}%
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">IMO Number</p>
            <p className="font-medium">{vessel.imo}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Document Status</p>
            <div className="flex flex-wrap gap-2 mt-1">
              <span className="inline-flex items-center text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded">
                <CheckCircle className="h-3 w-3 mr-1" /> {vessel.documentStatus.valid}
              </span>
              {vessel.documentStatus.expiringSoon > 0 && (
                <span className="inline-flex items-center text-xs text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded">
                  <Clock className="h-3 w-3 mr-1" /> {vessel.documentStatus.expiringSoon}
                </span>
              )}
              {vessel.documentStatus.expired > 0 && (
                <span className="inline-flex items-center text-xs text-red-700 bg-red-50 px-2 py-0.5 rounded">
                  <AlertCircle className="h-3 w-3 mr-1" /> {vessel.documentStatus.expired}
                </span>
              )}
              {vessel.documentStatus.missing > 0 && (
                <span className="inline-flex items-center text-xs text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                  <AlertTriangle className="h-3 w-3 mr-1" /> {vessel.documentStatus.missing}
                </span>
              )}
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500">Next Port</p>
            <div className="flex items-center">
              <p className="font-medium">{vessel.nextPort}</p>
              <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-100">ETA: {vessel.eta}</Badge>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <Link href={`/document-hub?vessel=${vessel.id}`}>
          <Button variant="outline" size="sm">
            Documents
          </Button>
        </Link>
        <Link href={`/port-preparation?vessel=${vessel.id}`}>
          <Button variant="outline" size="sm">
            Port Prep
          </Button>
        </Link>
        <Link href={`/vessels/${vessel.id}`}>
          <Button size="sm">Details</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

function VesselListItem({ vessel }) {
  let scoreColor = "bg-red-500"
  let scoreTextColor = "text-red-700"
  let scoreBgColor = "bg-red-50"

  if (vessel.complianceScore >= 90) {
    scoreColor = "bg-green-500"
    scoreTextColor = "text-green-700"
    scoreBgColor = "bg-green-50"
  } else if (vessel.complianceScore >= 70) {
    scoreColor = "bg-yellow-500"
    scoreTextColor = "text-yellow-700"
    scoreBgColor = "bg-yellow-50"
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <Ship className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium">{vessel.name}</h3>
              <p className="text-sm text-gray-500">
                {vessel.type} • {vessel.flag} • IMO: {vessel.imo}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div>
              <p className="text-xs text-gray-500">Compliance</p>
              <div className={`px-3 py-1 rounded-full ${scoreBgColor} ${scoreTextColor} font-medium text-sm`}>
                {vessel.complianceScore}%
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500">Documents</p>
              <div className="flex gap-1">
                <span className="inline-flex items-center text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded">
                  <CheckCircle className="h-3 w-3 mr-1" /> {vessel.documentStatus.valid}
                </span>
                {vessel.documentStatus.expiringSoon > 0 && (
                  <span className="inline-flex items-center text-xs text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded">
                    <Clock className="h-3 w-3 mr-1" /> {vessel.documentStatus.expiringSoon}
                  </span>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500">Next Port</p>
              <p className="text-sm font-medium">
                {vessel.nextPort} <span className="text-xs text-gray-500">({vessel.eta})</span>
              </p>
            </div>

            <div className="flex gap-2">
              <Link href={`/document-hub?vessel=${vessel.id}`}>
                <Button variant="outline" size="sm">
                  Documents
                </Button>
              </Link>
              <Link href={`/vessels/${vessel.id}`}>
                <Button size="sm">Details</Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function AddVesselCard({ onClick }) {
  return (
    <Card
      className="border-2 border-dashed flex flex-col items-center justify-center h-full min-h-[300px] cursor-pointer hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
      onClick={onClick}
    >
      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
          <Plus className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-medium mb-2">Add New Vessel</h3>
        <p className="text-gray-500 mb-4">Search for your vessel by name or IMO number</p>
        <Button>Add Vessel</Button>
      </CardContent>
    </Card>
  )
}
