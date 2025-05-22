"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Ship,
  Loader2,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  Upload,
  PlusCircle,
  Files,
  AlertCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import DocumentUploadModal from "../../MainComponents/UploadModal/UploadModal"
import BatchUploadModal from "../../MainComponents/UploadModal/BulkUpload"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAddVessel } from "../../Hooks/useAddVessel" // Import our custom hook

// Predefined vessel types
const vesselTypes = [
  { id: "tanker", name: "Tanker" },
  { id: "container", name: "Container Ship" },
  { id: "bulk", name: "Bulk Carrier" },
  { id: "general_cargo", name: "General Cargo" },
  { id: "roro", name: "Ro-Ro" },
  { id: "passenger", name: "Passenger/Cruise" },
  { id: "offshore", name: "Offshore Support" },
  { id: "special", name: "Special Purpose" },
  { id: "other", name: "Other" },
]

interface AddVesselModalProps {
  isOpen: boolean
  onClose: () => void
  onVesselAdded?: () => void
}

export default function AddVesselModal({ isOpen, onClose, onVesselAdded }: AddVesselModalProps) {
  const [step, setStep] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [selectedVessel, setSelectedVessel] = useState<any>(null)
  const [uploadDocuments, setUploadDocuments] = useState(false)
  const [addComplete, setAddComplete] = useState(false)
  const [isManualEntry, setIsManualEntry] = useState(false)
  const [isDocumentUploadModalOpen, setIsDocumentUploadModalOpen] = useState(false)
  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Use our custom hook
  const { addVessel, isLoading: isAddingVessel, error: addVesselError } = useAddVessel()

  // Simplified manual vessel entry form with only required fields
  const [manualVesselData, setManualVesselData] = useState({
    name: "",
    imo: "",
    type: "",
    customType: "",
    flag: "",
  })

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1)
        setSearchQuery("")
        setSearchResults([])
        setSelectedVessel(null)
        setUploadDocuments(false)
        setAddComplete(false)
        setIsManualEntry(false)
        setManualVesselData({
          name: "",
          imo: "",
          type: "",
          customType: "",
          flag: "",
        })
        setErrors({})
      }, 300)
    }
  }, [isOpen])

  // Mock search function - would be replaced with actual API call
  const handleSearch = () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setSearchResults([])

    // Simulate API delay
    setTimeout(() => {
      // Mock results based on search query
      const results = [
        {
          id: "v1",
          name: "Humble Warrior",
          imo: "9876543",
          mmsi: "123456789",
          type: "Crude Oil Tanker",
          flag: "Panama",
          yearBuilt: 2015,
          grossTonnage: 84000,
          deadweight: 115000,
          length: 250,
          beam: 44,
          classificationSociety: "DNV GL",
          owner: "Global Shipping Co.",
          manager: "Maritime Management Ltd.",
          image: "/vessel-tanker.png",
        },
        {
          id: "v2",
          name: "Pacific Explorer",
          imo: "9765432",
          mmsi: "234567890",
          type: "Container Ship",
          flag: "Singapore",
          yearBuilt: 2018,
          grossTonnage: 120000,
          deadweight: 140000,
          length: 366,
          beam: 51,
          classificationSociety: "Lloyd's Register",
          owner: "Ocean Container Lines",
          manager: "Pacific Ship Management",
          image: "/vessel-container.png",
        },
        {
          id: "v3",
          name: "Northern Star",
          imo: "9654321",
          mmsi: "345678901",
          type: "Bulk Carrier",
          flag: "Marshall Islands",
          yearBuilt: 2016,
          grossTonnage: 93000,
          deadweight: 180000,
          length: 292,
          beam: 45,
          classificationSociety: "ABS",
          owner: "Star Bulk Carriers",
          manager: "Northern Maritime Services",
          image: "/vessel-bulk.png",
        },
      ].filter(
        (vessel) => vessel.name.toLowerCase().includes(searchQuery.toLowerCase()) || vessel.imo.includes(searchQuery),
      )

      setSearchResults(results)
      setIsSearching(false)
    }, 1500)
  }

  // Handle vessel selection
  const selectVessel = (vessel) => {
    setSelectedVessel(vessel)
    setStep(2)
  }

  // Handle manual vessel data change
  const handleManualDataChange = (field: string, value: string) => {
    setManualVesselData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear error when user types
    if (errors[field]) {
      const newErrors = { ...errors }
      delete newErrors[field]
      setErrors(newErrors)
    }
  }

  // Validate the manual entry form
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!manualVesselData.name.trim()) {
      newErrors.name = "Vessel name is required"
    }

    if (!manualVesselData.imo.trim()) {
      newErrors.imo = "IMO number is required"
    } else if (!/^\d{7}$/.test(manualVesselData.imo.trim())) {
      newErrors.imo = "IMO number must be 7 digits"
    }

    if (!manualVesselData.type) {
      newErrors.type = "Vessel type is required"
    } else if (manualVesselData.type === "other" && !manualVesselData.customType.trim()) {
      newErrors.customType = "Please specify the vessel type"
    }

    if (!manualVesselData.flag.trim()) {
      newErrors.flag = "Flag state is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Submit manual vessel data
  const submitManualVessel = () => {
    if (!validateForm()) {
      return
    }

    // Create a vessel object from manual data
    const manualVessel = {
      id: `manual-${Date.now()}`,
      name: manualVesselData.name,
      imo: manualVesselData.imo,
      mmsi: "",
      type:
        manualVesselData.type === "other"
          ? manualVesselData.customType
          : vesselTypes.find((t) => t.id === manualVesselData.type)?.name || manualVesselData.type,
      flag: manualVesselData.flag,
      yearBuilt: new Date().getFullYear(),
      grossTonnage: 0,
      deadweight: 0,
      length: 0,
      beam: 0,
      classificationSociety: "",
      owner: "",
      manager: "",
      image: "/vessel-generic.png",
    }

    setSelectedVessel(manualVessel)
    setStep(2)
  }

  // Handle vessel addition - now using our API hook
  const handleAddVessel = async () => {
    if (!selectedVessel) return

    // Prepare vessel data for API
    const vesselData = {
      name: selectedVessel.name,
      imo_number: selectedVessel.imo,
      vessel_type: selectedVessel.type,
      flag_state: selectedVessel.flag,
    }

    // Call our API hook
    const result = await addVessel(vesselData)

    if (result.success) {
      // Update the selectedVessel with the returned data if needed
      if (result.vessel) {
        setSelectedVessel((prev) => ({
          ...prev,
          id: result.vessel.id,
          // Add any other properties from the API response
        }))
      }

      setAddComplete(true)
      setStep(3)

      // Call the callback if provided
      if (onVesselAdded) {
        onVesselAdded()
      }
    } else {
      // If there was an error, show it in the UI
      setErrors({
        api: result.error || "Failed to add vessel. Please try again.",
      })
    }
  }

  // Handle document upload option
  const handleDocumentUploadOption = (value: boolean) => {
    setUploadDocuments(value)
    // Call the API to add the vessel
    handleAddVessel()
  }

  // Handle document upload completion
  const handleDocumentUploadComplete = (documentData: any) => {
    setIsBulkUploadModalOpen(false)
    setIsDocumentUploadModalOpen(false)
    // In a real app, you would update the vessel with the new document data
    console.log("Document upload complete:", documentData)
  }

  // Render different steps of the add vessel process
  const renderStep = () => {
    switch (step) {
      case 1: // Search for vessel or manual entry
        return (
          <div className="space-y-6">
            <Tabs defaultValue="search" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="search" onClick={() => setIsManualEntry(false)}>
                  <Search className="h-4 w-4 mr-2" />
                  Search Vessel
                </TabsTrigger>
                <TabsTrigger value="manual" onClick={() => setIsManualEntry(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Manual Entry
                </TabsTrigger>
              </TabsList>

              <TabsContent value="search" className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="vesselSearch">Search for your vessel</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-grow">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        id="vesselSearch"
                        placeholder="Enter vessel name or IMO number"
                        className="pl-10 h-10 bg-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      />
                    </div>
                    <Button onClick={handleSearch} disabled={isSearching || !searchQuery.trim()}>
                      {isSearching ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Search
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    Search by vessel name or IMO number to find your vessel in our database
                  </p>
                </div>

                {isSearching ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
                    <p className="text-gray-500">Searching for vessels...</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Search Results</h3>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                      {searchResults.map((vessel) => (
                        <Card
                          key={vessel.id}
                          className="cursor-pointer hover:border-blue-300 transition-colors"
                          onClick={() => selectVessel(vessel)}
                        >
                          <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-12 h-12 rounded-md bg-blue-100 flex items-center justify-center mr-4">
                                <Ship className="h-6 w-6 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="font-medium">{vessel.name}</h4>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <span>IMO: {vessel.imo}</span>
                                  <span>•</span>
                                  <span>{vessel.type}</span>
                                  <span>•</span>
                                  <span>{vessel.flag}</span>
                                </div>
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : searchQuery && !isSearching ? (
                  <div className="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-lg border">
                    <AlertTriangle className="h-8 w-8 text-yellow-500 mb-4" />
                    <p className="font-medium">No vessels found</p>
                    <p className="text-sm text-gray-500 mt-1">Try searching with a different name or IMO number</p>
                    <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
                      Clear Search
                    </Button>
                  </div>
                ) : null}
              </TabsContent>

              <TabsContent value="manual" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Enter Vessel Details Manually</h3>
                  <p className="text-sm text-gray-500">Please provide the basic information about your vessel below</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Vessel Name - Required */}
                    <div className="space-y-2">
                      <Label htmlFor="vesselName" className="flex items-center">
                        Vessel Name <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        id="vesselName"
                        value={manualVesselData.name}
                        onChange={(e) => handleManualDataChange("name", e.target.value)}
                        placeholder="Enter vessel name"
                        className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && (
                        <div className="text-red-500 text-sm flex items-center mt-1">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.name}
                        </div>
                      )}
                    </div>

                    {/* IMO Number - Required */}
                    <div className="space-y-2">
                      <Label htmlFor="vesselIMO" className="flex items-center">
                        IMO Number <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        id="vesselIMO"
                        value={manualVesselData.imo}
                        onChange={(e) => handleManualDataChange("imo", e.target.value)}
                        placeholder="7-digit IMO number"
                        className={errors.imo ? "border-red-500" : ""}
                      />
                      {errors.imo && (
                        <div className="text-red-500 text-sm flex items-center mt-1">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.imo}
                        </div>
                      )}
                    </div>

                    {/* Vessel Type - Required (Dropdown) */}
                    <div className="space-y-2">
                      <Label htmlFor="vesselType" className="flex items-center">
                        Vessel Type <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Select
                        value={manualVesselData.type}
                        onValueChange={(value) => handleManualDataChange("type", value)}
                      >
                        <SelectTrigger id="vesselType" className={errors.type ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select vessel type" />
                        </SelectTrigger>
                        <SelectContent>
                          {vesselTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.type && (
                        <div className="text-red-500 text-sm flex items-center mt-1">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.type}
                        </div>
                      )}

                      {/* Custom Vessel Type - shown only when "Other" is selected */}
                      {manualVesselData.type === "other" && (
                        <div className="mt-2">
                          <Input
                            id="customVesselType"
                            value={manualVesselData.customType}
                            onChange={(e) => handleManualDataChange("customType", e.target.value)}
                            placeholder="Specify vessel type"
                            className={errors.customType ? "border-red-500" : ""}
                          />
                          {errors.customType && (
                            <div className="text-red-500 text-sm flex items-center mt-1">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              {errors.customType}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Flag State - Required */}
                    <div className="space-y-2">
                      <Label htmlFor="vesselFlag" className="flex items-center">
                        Flag State <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        id="vesselFlag"
                        value={manualVesselData.flag}
                        onChange={(e) => handleManualDataChange("flag", e.target.value)}
                        placeholder="e.g. Panama"
                        className={errors.flag ? "border-red-500" : ""}
                      />
                      {errors.flag && (
                        <div className="text-red-500 text-sm flex items-center mt-1">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.flag}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Navigation buttons for manual entry */}
                  <div className="flex justify-between items-center mt-6">
                    <Button variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button
                      onClick={submitManualVessel}
                      disabled={
                        !manualVesselData.name ||
                        !manualVesselData.imo ||
                        !manualVesselData.type ||
                        !manualVesselData.flag ||
                        (manualVesselData.type === "other" && !manualVesselData.customType)
                      }
                      className="bg-black text-white hover:bg-gray-800"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )

      case 2: // Confirm vessel details
        return (
          <div className="space-y-6">
            {selectedVessel && (
              <>
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Vessel image */}
                  <div className="w-full md:w-1/3">
                    <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                      <Ship className="h-16 w-16 text-gray-400" />
                    </div>
                  </div>

                  {/* Vessel details */}
                  <div className="w-full md:w-2/3 space-y-4">
                    <div>
                      <h3 className="text-xl font-medium">{selectedVessel.name}</h3>
                      <div className="flex items-center gap-2 text-gray-500">
                        <span>{selectedVessel.type}</span>
                        <span>•</span>
                        <span>{selectedVessel.flag}</span>
                        <Badge className="ml-1">{selectedVessel.yearBuilt}</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">IMO Number</p>
                        <p className="font-medium">{selectedVessel.imo}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">MMSI</p>
                        <p className="font-medium">{selectedVessel.mmsi || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Gross Tonnage</p>
                        <p className="font-medium">{selectedVessel.grossTonnage.toLocaleString()} GT</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Deadweight</p>
                        <p className="font-medium">{selectedVessel.deadweight.toLocaleString()} DWT</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Length Overall</p>
                        <p className="font-medium">{selectedVessel.length} m</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Beam</p>
                        <p className="font-medium">{selectedVessel.beam} m</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Classification Society</p>
                        <p className="font-medium">{selectedVessel.classificationSociety || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Owner</p>
                        <p className="font-medium">{selectedVessel.owner || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Manager</p>
                        <p className="font-medium">{selectedVessel.manager || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Document requirements */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Required Documents</h3>
                  <p className="text-gray-500">
                    Based on the vessel type and flag, the following documents will be required for compliance:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span>Safety Management Certificate (SMC)</span>
                    </div>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span>International Ship Security Certificate</span>
                    </div>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span>International Oil Pollution Prevention Certificate</span>
                    </div>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span>International Load Line Certificate</span>
                    </div>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span>Certificate of Registry</span>
                    </div>
                  </div>
                </div>

                {/* API Error message if any */}
                {errors.api && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-red-800 mb-1">Error</h4>
                        <p className="text-sm text-red-700">{errors.api}</p>
                      </div>
                    </div>
                  </div>
                )}

                <Separator />

                {/* Document upload option */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Would you like to upload documents now?</h3>
                  <p className="text-gray-500">
                    You can upload vessel documents now or do it later from the vessel details page.
                  </p>

                  <div className="flex space-x-4">
                    <Button
                      variant="outline"
                      className="flex-1 h-24 flex flex-col items-center justify-center"
                      onClick={() => handleDocumentUploadOption(false)}
                      disabled={isAddingVessel}
                    >
                      {isAddingVessel ? (
                        <Loader2 className="h-6 w-6 animate-spin mb-2" />
                      ) : (
                        <Ship className="h-6 w-6 mb-2" />
                      )}
                      <span>Add Vessel Only</span>
                      <span className="text-xs text-gray-500 mt-1">Upload documents later</span>
                    </Button>

                    <Button
                      className="flex-1 h-24 flex flex-col items-center justify-center"
                      onClick={() => handleDocumentUploadOption(true)}
                      disabled={isAddingVessel}
                    >
                      {isAddingVessel ? (
                        <Loader2 className="h-6 w-6 animate-spin mb-2" />
                      ) : (
                        <Upload className="h-6 w-6 mb-2" />
                      )}
                      <span>Add & Upload Documents</span>
                      <span className="text-xs text-gray-400 mt-1">Recommended</span>
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        )

      case 3: // Completion or document upload
        return (
          <div className="space-y-6">
            {addComplete && (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-medium mb-2">Vessel Added Successfully</h3>
                <p className="text-gray-500 mb-6">{selectedVessel?.name} has been added to your fleet</p>

                {uploadDocuments ? (
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-left">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">Next Step: Upload Documents</h4>
                    <p className="text-sm text-blue-700 mb-3">
                      Continue to upload the required documents for your vessel.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        onClick={() => {
                          // Open the single document upload modal
                          setIsDocumentUploadModalOpen(true)
                        }}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Single Document
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          // Open the bulk upload modal directly
                          setIsBulkUploadModalOpen(true)
                        }}
                      >
                        <Files className="h-4 w-4 mr-2" />
                        Bulk Upload
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Button onClick={onClose}>Done</Button>
                    <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 text-left mt-4">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-yellow-800 mb-1">Document Upload Reminder</h4>
                          <p className="text-sm text-yellow-700">
                            Don't forget to upload the required documents for your vessel to ensure compliance.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  // Render footer buttons based on current step
  const renderFooter = () => {
    switch (step) {
      case 1:
        // For step 1, we're now handling the buttons inside the tab content for manual entry
        // Don't show any footer buttons when in manual entry mode
        if (isManualEntry) {
          return null
        }
        return (
          <>
         
          </>
        )

      case 2:
        return (
          <>
            <Button variant="outline" onClick={() => setStep(1)} disabled={isAddingVessel}>
              Back
            </Button>
          </>
        )

      case 3:
        if (!uploadDocuments) {
          return (
            <>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={onClose}>Go to Fleet</Button>
            </>
          )
        }
        return null

      default:
        return null
    }
  }

  // Get step title based on current step
  const getStepTitle = () => {
    switch (step) {
      case 1:
        return isManualEntry ? "Add Vessel Manually" : "Add Vessel to Fleet"
      case 2:
        return "Confirm Vessel Details"
      case 3:
        return uploadDocuments ? "Upload Documents" : "Vessel Added"
      default:
        return "Add Vessel"
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{getStepTitle()}</DialogTitle>
          </DialogHeader>

          {/* Step indicator */}
          {step < 4 && (
            <div className="flex items-center justify-between mb-6">
              <div className="w-full">
                <div className="flex justify-between mb-2">
                  <span className={`text-sm font-medium ${step >= 1 ? "text-blue-600" : "text-gray-400"}`}>
                    {isManualEntry ? "Enter Details" : "Search"}
                  </span>
                  <span className={`text-sm font-medium ${step >= 2 ? "text-blue-600" : "text-gray-400"}`}>
                    Confirm
                  </span>
                  <span className={`text-sm font-medium ${step >= 3 ? "text-blue-600" : "text-gray-400"}`}>
                    Complete
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${(step / 3) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {renderStep()}

          <DialogFooter className="flex justify-between mt-6">{renderFooter()}</DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document Upload Modal */}
      <DocumentUploadModal
        isOpen={isDocumentUploadModalOpen}
        onClose={() => {
          setIsDocumentUploadModalOpen(false)
          onClose() // Close the parent modal when document upload is done
        }}
        initialVesselId={selectedVessel?.id}
        onUploadComplete={handleDocumentUploadComplete}
      />

      {/* Bulk Document Upload Modal */}
      <BatchUploadModal
        isOpen={isBulkUploadModalOpen}
        onClose={() => {
          setIsBulkUploadModalOpen(false)
          onClose() // Close the parent modal when document upload is done
        }}
        initialVesselId={selectedVessel?.id}
        onUploadComplete={handleDocumentUploadComplete}
      />
    </>
  )
}
