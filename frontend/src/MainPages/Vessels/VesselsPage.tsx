"use client"

import { useState, useEffect } from "react"
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
  List,
  Map,
  MapPin,
  RefreshCw,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Link } from "react-router-dom"
import AddVesselModal from "../../MainComponents/AddVesselModal/AddNewVessel"
import {
  SubscriptionIndicator,
  type SubscriptionData,
} from "../../MainComponents/UserSubscriptions/SubscriptionIndicator"
import { useUser } from "../../Auth/Contexts/UserContext"
import { supabase } from "../../Auth/SupabaseAuth" // Import supabase client

export default function FleetPage() {
  const { isAuthenticated, isLoading: isUserLoading, user } = useUser()

  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState("grid")
  const [isAddVesselModalOpen, setIsAddVesselModalOpen] = useState(false)
  const [vessels, setVessels] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [vesselType, setVesselType] = useState("all")

  // Mock subscription data - would come from user context in real app
  const subscriptionData: SubscriptionData = {
    plan: "Professional",
    vesselLimit: 10,
    vesselsUsed: 3,
    expiresAt: "December 15, 2023",
  }

  // Mock data for fields we don't have yet
  const mockPortData = {
    nextPort: "Singapore",
    eta: "Nov 15, 2023",
    location: { lat: 1.352083, lng: 103.819839 },
  }

  // Document status mock data - would be calculated from actual documents in a real app
  const getRandomDocStatus = () => {
    return {
      valid: Math.floor(Math.random() * 15) + 5,
      expiringSoon: Math.floor(Math.random() * 5),
      expired: Math.floor(Math.random() * 2),
      missing: Math.floor(Math.random() * 3),
    }
  }

  // Calculate compliance score based on document status
  const calculateComplianceScore = (docStatus) => {
    const total = docStatus.valid + docStatus.expiringSoon + docStatus.expired + docStatus.missing
    const validWeight = 1
    const expiringSoonWeight = 0.5
    const expiredWeight = 0
    const missingWeight = 0

    if (total === 0) return 80 // Default score if no documents

    const score =
      ((docStatus.valid * validWeight +
        docStatus.expiringSoon * expiringSoonWeight +
        docStatus.expired * expiredWeight +
        docStatus.missing * missingWeight) /
        total) *
      100

    return Math.round(score)
  }

  // Fetch vessels from API
  const fetchVessels = async () => {
    // Don't fetch if user is not authenticated yet
    if (!isAuthenticated || isUserLoading) {
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // API Base URL Configuration
      const apiBaseUrl =
        import.meta.env.MODE === "development" ? import.meta.env.VITE_DEVELOPMENT_URL : import.meta.env.VITE_API_URL

      // Build query string from options
      const queryParams = new URLSearchParams()

      if (searchQuery) queryParams.append("search", searchQuery)
      if (vesselType !== "all") queryParams.append("vesselType", vesselType)

      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : ""

      // Get the current session to include the auth token
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

      if (sessionError || !sessionData.session) {
        throw new Error("Authentication required. Please log in again.")
      }

      // Get the access token from the session
      const token = sessionData.session.access_token

      // Call the API to get vessels
      const response = await fetch(`${apiBaseUrl}/api/get-vessels${queryString}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch vessels")
      }

      // Enhance vessel data with mock data for fields we don't have yet
      const enhancedVessels = data.vessels.map((vessel) => {
        // Generate random document status for each vessel
        const documentStatus = getRandomDocStatus()

        return {
          id: vessel.id,
          name: vessel.name,
          type: vessel.vessel_type,
          flag: vessel.flag_state,
          imo: vessel.imo_number || "N/A",
          documentStatus,
          complianceScore: calculateComplianceScore(documentStatus),
          // Add mock data for fields we don't have yet
          nextPort: mockPortData.nextPort,
          eta: mockPortData.eta,
          location: mockPortData.location,
        }
      })

      setVessels(enhancedVessels)
    } catch (error) {
      console.error("Error loading vessels:", error)
      setError("Failed to load vessels. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const refreshVessels = () => {
    fetchVessels()
  }

  // Load vessels when user is authenticated and when search or filter changes
  useEffect(() => {
    if (isAuthenticated && !isUserLoading) {
      fetchVessels()
    }
  }, [isAuthenticated, isUserLoading, searchQuery, vesselType])

  // Filter vessels based on search query (client-side filtering as backup)
  const filteredVessels = vessels.filter(
    (vessel) =>
      vessel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (vessel.imo && vessel.imo.includes(searchQuery)) ||
      vessel.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vessel.flag.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // If user is not authenticated or still loading, show appropriate UI
  if (isUserLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <p className="ml-2">Loading user data...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">Authentication Required</h2>
            <p className="text-gray-500 mb-4">You need to be logged in to view your vessels.</p>
            <Button onClick={() => (window.location.href = "/login")}>Go to Login</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

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
          <Select value={vesselType} onValueChange={setVesselType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Tanker">Tankers</SelectItem>
              <SelectItem value="Container">Container Ships</SelectItem>
              <SelectItem value="Bulk Carrier">Bulk Carriers</SelectItem>
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

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <p className="ml-2">Loading vessels...</p>
        </div>
      )}

      {/* Error state */}
      {!isLoading && error && (
        <Card className="mb-6">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">Failed to load vessels</h2>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button onClick={fetchVessels}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* No vessels state */}
      {!isLoading && !error && vessels.length === 0 && (
        <Card className="mb-6">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Ship className="h-12 w-12 text-gray-300 mb-4" />
            <h2 className="text-xl font-bold mb-2">No vessels found</h2>
            <p className="text-gray-500 mb-4">
              {searchQuery ? "No vessels match your search criteria." : "You haven't added any vessels yet."}
            </p>
            <Button onClick={() => setIsAddVesselModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Vessel
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Vessels grid */}
      {!isLoading && !error && viewMode === "grid" && vessels.length > 0 && (
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
      {!isLoading && !error && viewMode === "list" && vessels.length > 0 && (
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
      <AddVesselModal
        isOpen={isAddVesselModalOpen}
        onClose={() => {
          setIsAddVesselModalOpen(false)
          refreshVessels() // Refresh vessels when modal closes
        }}
      />
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
