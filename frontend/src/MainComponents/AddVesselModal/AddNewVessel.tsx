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
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
// import DocumentUploadModal from "./UploadModal" // Remove this line
// import DocumentUploadChoiceModal from "./document-upload-choice-modal"
import DocumentUploadModal from "../../MainComponents/UploadModal/UploadModal"
import BatchUploadModal from "../../MainComponents/UploadModal/BulkUpload"

interface AddVesselModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AddVesselModal({ isOpen, onClose }: AddVesselModalProps) {
  const [step, setStep] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [selectedVessel, setSelectedVessel] = useState<any>(null)
  const [uploadDocuments, setUploadDocuments] = useState(false)
  const [isAddingVessel, setIsAddingVessel] = useState(false)
  const [addComplete, setAddComplete] = useState(false)
  // const [isDocumentUploadModalOpen, setIsDocumentUploadModalOpen] = useState(false) // Remove this line
  // const [isDocumentUploadChoiceModalOpen, setIsDocumentUploadChoiceModalOpen] = useState(false)
  const [isManualEntry, setIsManualEntry] = useState(false)
  const [isDocumentUploadModalOpen, setIsDocumentUploadModalOpen] = useState(false)
  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false)

  // Manual vessel entry form
  const [manualVesselData, setManualVesselData] = useState({
    name: "",
    imo: "",
    mmsi: "",
    type: "",
    flag: "",
    yearBuilt: "",
    grossTonnage: "",
    deadweight: "",
    length: "",
    beam: "",
    classificationSociety: "",
    owner: "",
    manager: "",
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
        setIsAddingVessel(false)
        setAddComplete(false)
        setIsManualEntry(false)
        setManualVesselData({
          name: "",
          imo: "",
          mmsi: "",
          type: "",
          flag: "",
          yearBuilt: "",
          grossTonnage: "",
          deadweight: "",
          length: "",
          beam: "",
          classificationSociety: "",
          owner: "",
          manager: "",
        })
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
  }

  // Submit manual vessel data
  const submitManualVessel = () => {
    // Create a vessel object from manual data
    const manualVessel = {
      id: `manual-${Date.now()}`,
      name: manualVesselData.name,
      imo: manualVesselData.imo,
      mmsi: manualVesselData.mmsi,
      type: manualVesselData.type,
      flag: manualVesselData.flag,
      yearBuilt: Number.parseInt(manualVesselData.yearBuilt) || new Date().getFullYear(),
      grossTonnage: Number.parseInt(manualVesselData.grossTonnage) || 0,
      deadweight: Number.parseInt(manualVesselData.deadweight) || 0,
      length: Number.parseInt(manualVesselData.length) || 0,
      beam: Number.parseInt(manualVesselData.beam) || 0,
      classificationSociety: manualVesselData.classificationSociety,
      owner: manualVesselData.owner,
      manager: manualVesselData.manager,
      image: "/vessel-generic.png",
    }

    setSelectedVessel(manualVessel)
    setStep(2)
  }

  // Handle vessel addition
  const addVessel = () => {
    setIsAddingVessel(true)

    // Simulate API delay
    setTimeout(() => {
      setIsAddingVessel(false)
      setAddComplete(true)
      setStep(3)
    }, 2000)
  }

  // Handle document upload option
  const handleDocumentUploadOption = (value: boolean) => {
    setUploadDocuments(value)
    if (value) {
      // If user wants to upload documents, add the vessel first
      addVessel()
    } else {
      // If user doesn't want to upload documents, complete the process
      addVessel()
    }
  }

  // Handle document upload completion
  const handleDocumentUploadComplete = (documentData: any) => {
    // setIsDocumentUploadModalOpen(false)
    // setIsDocumentUploadChoiceModalOpen(false)
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
                    <div className="space-y-2">
                      <Label htmlFor="vesselName">Vessel Name *</Label>
                      <Input
                        id="vesselName"
                        value={manualVesselData.name}
                        onChange={(e) => handleManualDataChange("name", e.target.value)}
                        placeholder="Enter vessel name"
                        className="h-10"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vesselIMO">IMO Number *</Label>
                      <Input
                        id="vesselIMO"
                        value={manualVesselData.imo}
                        onChange={(e) => handleManualDataChange("imo", e.target.value)}
                        placeholder="e.g. 9876543"
                        className="h-10"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vesselMMSI">MMSI</Label>
                      <Input
                        id="vesselMMSI"
                        value={manualVesselData.mmsi}
                        onChange={(e) => handleManualDataChange("mmsi", e.target.value)}
                        placeholder="e.g. 123456789"
                        className="h-10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vesselType">Vessel Type *</Label>
                      <Input
                        id="vesselType"
                        value={manualVesselData.type}
                        onChange={(e) => handleManualDataChange("type", e.target.value)}
                        placeholder="e.g. Crude Oil Tanker"
                        className="h-10"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vesselFlag">Flag *</Label>
                      <Input
                        id="vesselFlag"
                        value={manualVesselData.flag}
                        onChange={(e) => handleManualDataChange("flag", e.target.value)}
                        placeholder="e.g. Panama"
                        className="h-10"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vesselYearBuilt">Year Built</Label>
                      <Input
                        id="vesselYearBuilt"
                        value={manualVesselData.yearBuilt}
                        onChange={(e) => handleManualDataChange("yearBuilt", e.target.value)}
                        placeholder="e.g. 2015"
                        className="h-10"
                        type="number"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vesselGT">Gross Tonnage</Label>
                      <Input
                        id="vesselGT"
                        value={manualVesselData.grossTonnage}
                        onChange={(e) => handleManualDataChange("grossTonnage", e.target.value)}
                        placeholder="e.g. 84000"
                        className="h-10"
                        type="number"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vesselDWT">Deadweight</Label>
                      <Input
                        id="vesselDWT"
                        value={manualVesselData.deadweight}
                        onChange={(e) => handleManualDataChange("deadweight", e.target.value)}
                        placeholder="e.g. 115000"
                        className="h-10"
                        type="number"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vesselLength">Length Overall (m)</Label>
                      <Input
                        id="vesselLength"
                        value={manualVesselData.length}
                        onChange={(e) => handleManualDataChange("length", e.target.value)}
                        placeholder="e.g. 250"
                        className="h-10"
                        type="number"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vesselBeam">Beam (m)</Label>
                      <Input
                        id="vesselBeam"
                        value={manualVesselData.beam}
                        onChange={(e) => handleManualDataChange("beam", e.target.value)}
                        placeholder="e.g. 44"
                        className="h-10"
                        type="number"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vesselClass">Classification Society</Label>
                      <Input
                        id="vesselClass"
                        value={manualVesselData.classificationSociety}
                        onChange={(e) => handleManualDataChange("classificationSociety", e.target.value)}
                        placeholder="e.g. DNV GL"
                        className="h-10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vesselOwner">Owner</Label>
                      <Input
                        id="vesselOwner"
                        value={manualVesselData.owner}
                        onChange={(e) => handleManualDataChange("owner", e.target.value)}
                        placeholder="e.g. Global Shipping Co."
                        className="h-10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vesselManager">Manager</Label>
                      <Input
                        id="vesselManager"
                        value={manualVesselData.manager}
                        onChange={(e) => handleManualDataChange("manager", e.target.value)}
                        placeholder="e.g. Maritime Management Ltd."
                        className="h-10"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={submitManualVessel}
                      disabled={
                        !manualVesselData.name ||
                        !manualVesselData.imo ||
                        !manualVesselData.type ||
                        !manualVesselData.flag
                      }
                    >
                      Continue
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
                        <p className="font-medium">{selectedVessel.mmsi}</p>
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
                        <p className="font-medium">{selectedVessel.classificationSociety}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Owner</p>
                        <p className="font-medium">{selectedVessel.owner}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Manager</p>
                        <p className="font-medium">{selectedVessel.manager}</p>
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
                    >
                      <Ship className="h-6 w-6 mb-2" />
                      <span>Add Vessel Only</span>
                      <span className="text-xs text-gray-500 mt-1">Upload documents later</span>
                    </Button>

                    <Button
                      className="flex-1 h-24 flex flex-col items-center justify-center"
                      onClick={() => handleDocumentUploadOption(true)}
                    >
                      <Upload className="h-6 w-6 mb-2" />
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
        return (
          <>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {isManualEntry && (
              <Button
                onClick={submitManualVessel}
                disabled={
                  !manualVesselData.name || !manualVesselData.imo || !manualVesselData.type || !manualVesselData.flag
                }
              >
                Continue
              </Button>
            )}
          </>
        )

      case 2:
        return (
          <>
            <Button variant="outline" onClick={() => setStep(1)}>
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

      {/* Document Upload Choice Modal */}
      {/* <DocumentUploadChoiceModal
        isOpen={isDocumentUploadChoiceModalOpen}
        onClose={() => setIsDocumentUploadChoiceModalOpen(false)}
        vesselId={selectedVessel?.id}
      /> */}

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
