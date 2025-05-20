"use client"

import { useState } from "react"
import { Ship, Upload, PlusCircle, X, Flag, Anchor, AlertCircle, CheckCircle, Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useOnboarding } from "./OnboardingContainer"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "../../SupabaseAuth"

// Vessel types
const vesselTypes = [
  "Crude Oil Tanker",
  "Product Tanker",
  "Chemical Tanker",
  "LNG Carrier",
  "LPG Carrier",
  "Bulk Carrier",
  "Container Ship",
  "General Cargo",
  "Ro-Ro",
  "Car Carrier",
  "Cruise Ship",
  "Ferry",
  "Offshore Supply Vessel",
  "Fishing Vessel",
  "Tug",
  "Other",
]

// Flag states (abbreviated list)
const flagStates = [
  "Panama",
  "Liberia",
  "Marshall Islands",
  "Hong Kong",
  "Singapore",
  "Malta",
  "Bahamas",
  "Greece",
  "Japan",
  "China",
  "Cyprus",
  "Norway",
  "United Kingdom",
  "Denmark",
  "United States",
  "Other",
]

export default function FleetSetup() {
  const { onboardingData, updateData } = useOnboarding()
  const [activeTab, setActiveTab] = useState("manual")
  const [imoNumber, setImoNumber] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [uploadState, setUploadState] = useState("initial") // initial, uploading, success, error
  const [uploadError, setUploadError] = useState("")
  const [isAddingVessel, setIsAddingVessel] = useState(false)
  const [currentVessel, setCurrentVessel] = useState({
    name: "",
    type: "",
    flag: "",
    imo: "",
  })

  // Sample vessels for demo
  const sampleVessels = [
    {
      id: "v1",
      name: "Humble Warrior",
      type: "Crude Oil Tanker",
      flag: "Panama",
      imo: "9876543",
    },
    {
      id: "v2",
      name: "Pacific Explorer",
      type: "Container Ship",
      flag: "Liberia",
      imo: "9876544",
    },
    {
      id: "v3",
      name: "Northern Star",
      type: "LNG Carrier",
      flag: "Marshall Islands",
      imo: "9876545",
    },
  ]

  const handleLookup = () => {
    if (!imoNumber) return

    setIsSearching(true)

    // Simulate API lookup
    setTimeout(() => {
      // Mock data for demo
      if (imoNumber === "9876543" || imoNumber === "9876543210") {
        setCurrentVessel({
          name: "Humble Warrior",
          type: "Crude Oil Tanker",
          flag: "Panama",
          imo: imoNumber,
        })
      } else {
        setCurrentVessel({
          name: "",
          type: "",
          flag: "",
          imo: imoNumber,
        })
      }
      setIsSearching(false)
    }, 1500)
  }

  const handleAddVessel = async () => {
    if (!currentVessel.name || !currentVessel.type || !currentVessel.flag) return

    setIsAddingVessel(true)

    try {
      // Get the current user's session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) throw sessionError

      if (!sessionData.session) {
        throw new Error("No active session found")
      }

      const userId = sessionData.session.user.id

      // Add the vessel directly to the database
      const { data: vesselId, error: vesselError } = await supabase.rpc("add_vessel", {
        p_vessel_name: currentVessel.name,
        p_imo_number: currentVessel.imo || imoNumber,
        p_vessel_type: currentVessel.type,
        p_flag_state: currentVessel.flag,
        p_user_id: userId,
      })

      if (vesselError) throw vesselError

      // Add to local state for UI
      const newVessel = {
        id: vesselId || Date.now().toString(),
        name: currentVessel.name,
        type: currentVessel.type,
        flag: currentVessel.flag,
        imo: currentVessel.imo || imoNumber,
      }

      updateData({
        vessels: [...(onboardingData.vessels || []), newVessel],
        fleetSetupMethod: "manual",
      })

      // Reset form
      setImoNumber("")
      setCurrentVessel({
        name: "",
        type: "",
        flag: "",
        imo: "",
      })
    } catch (error) {
      console.error("Error adding vessel:", error)
      // Show error message
    } finally {
      setIsAddingVessel(false)
    }
  }

  const handleUpload = () => {
    setUploadState("uploading")

    // Simulate upload process
    setTimeout(() => {
      setUploadState("success")
      updateData({
        vessels: sampleVessels,
        fleetSetupMethod: "bulk",
      })
    }, 2000)
  }

  const handleRemoveVessel = async (id: string) => {
    try {
      // If the vessel has a UUID format, it's already in the database
      if (id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {
        // Delete from database
        const { error } = await supabase.from("vessels").delete().eq("id", id)

        if (error) throw error
      }

      // Update local state
      updateData({
        vessels: onboardingData.vessels.filter((vessel: any) => vessel.id !== id),
      })
    } catch (error) {
      console.error("Error removing vessel:", error)
    }
  }

  const handleDownloadTemplate = () => {
    // In a real app, this would download a CSV template
    console.log("Downloading template...")
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold">Add Your Vessels</h2>
        <p className="text-slate-500 dark:text-slate-400">Let's add your vessels to start managing their compliance</p>
      </div>

      <Tabs defaultValue="manual" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="manual" className="flex items-center">
            <Ship className="h-4 w-4 mr-2" />
            Quick Add
          </TabsTrigger>
          <TabsTrigger value="bulk" className="flex items-center">
            <Upload className="h-4 w-4 mr-2" />
            Bulk Import
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Vessel Lookup</CardTitle>
              <CardDescription>Enter an IMO number to quickly find and add a vessel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Input
                    placeholder="Enter IMO Number (e.g., 9876543)"
                    value={imoNumber}
                    onChange={(e) => setImoNumber(e.target.value)}
                  />
                </div>
                <Button onClick={handleLookup} disabled={isSearching || !imoNumber}>
                  {isSearching ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                      Searching...
                    </>
                  ) : (
                    "Find Vessel"
                  )}
                </Button>
              </div>

              <div className="pt-2 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vesselName">Vessel Name</Label>
                  <Input
                    id="vesselName"
                    value={currentVessel.name}
                    onChange={(e) => setCurrentVessel({ ...currentVessel, name: e.target.value })}
                    placeholder="Enter vessel name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vesselType">Vessel Type</Label>
                  <Select
                    value={currentVessel.type}
                    onValueChange={(value) => setCurrentVessel({ ...currentVessel, type: value })}
                  >
                    <SelectTrigger id="vesselType">
                      <SelectValue placeholder="Select vessel type" />
                    </SelectTrigger>
                    <SelectContent>
                      {vesselTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="flagState">Flag State</Label>
                  <Select
                    value={currentVessel.flag}
                    onValueChange={(value) => setCurrentVessel({ ...currentVessel, flag: value })}
                  >
                    <SelectTrigger id="flagState">
                      <SelectValue placeholder="Select flag state" />
                    </SelectTrigger>
                    <SelectContent>
                      {flagStates.map((flag) => (
                        <SelectItem key={flag} value={flag}>
                          {flag}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button
                onClick={handleAddVessel}
                disabled={!currentVessel.name || !currentVessel.type || !currentVessel.flag || isAddingVessel}
                className="ml-auto"
              >
                {isAddingVessel ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                    Adding...
                  </>
                ) : (
                  <>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Vessel
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="bulk" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">CSV Import</CardTitle>
              <CardDescription>Download the template, fill it with your vessel data, and upload</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Card className="shadow-none border">
                  <CardContent className="pt-6 text-center">
                    <div className="inline-flex items-center justify-center p-2 bg-slate-100 dark:bg-slate-800 rounded-full mb-3">
                      <Download className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-semibold mb-2">Step 1</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Download the CSV template</p>
                    <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
                      <Download className="h-4 w-4 mr-2" />
                      Download Template
                    </Button>
                  </CardContent>
                </Card>

                <Card className="shadow-none border">
                  <CardContent className="pt-6 text-center">
                    <div className="inline-flex items-center justify-center p-2 bg-slate-100 dark:bg-slate-800 rounded-full mb-3">
                      <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-semibold mb-2">Step 2</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                      Fill the template with your vessel data
                    </p>
                    <Badge variant="outline">Required fields: IMO, Name, Type, Flag</Badge>
                  </CardContent>
                </Card>

                <Card className="shadow-none border">
                  <CardContent className="pt-6 text-center">
                    <div className="inline-flex items-center justify-center p-2 bg-slate-100 dark:bg-slate-800 rounded-full mb-3">
                      <Upload className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-semibold mb-2">Step 3</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Upload your completed CSV file</p>
                    <Button onClick={handleUpload} disabled={uploadState === "uploading" || uploadState === "success"}>
                      {uploadState === "uploading" ? (
                        <>
                          <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                          Uploading...
                        </>
                      ) : uploadState === "success" ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Uploaded
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload CSV
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {uploadState === "error" && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{uploadError || "There was an error uploading your file."}</AlertDescription>
                </Alert>
              )}

              {uploadState === "success" && (
                <Alert className="bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-200">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>Your vessels have been imported successfully.</AlertDescription>
                </Alert>
              )}

              <div className="p-3 border rounded-md border-dashed text-center">
                <p className="text-sm text-slate-500">
                  For demo purposes, clicking "Upload CSV" will import 3 sample vessels.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Your Vessels</CardTitle>
          <CardDescription>
            Vessels you've added ({onboardingData.vessels ? onboardingData.vessels.length : 0})
          </CardDescription>
        </CardHeader>
        <CardContent>
          {onboardingData.vessels && onboardingData.vessels.length > 0 ? (
            <div className="space-y-3">
              {onboardingData.vessels.map((vessel: any) => (
                <div key={vessel.id} className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                      <Ship className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium">{vessel.name}</p>
                      <div className="flex items-center mt-1">
                        <Badge variant="secondary" className="mr-2">
                          {vessel.type}
                        </Badge>
                        <span className="text-xs text-slate-500">
                          <Flag className="h-3 w-3 inline mr-1" />
                          {vessel.flag}
                        </span>
                        {vessel.imo && <span className="text-xs text-slate-500 ml-2">IMO: {vessel.imo}</span>}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleRemoveVessel(vessel.id)}>
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-6 border rounded-md border-dashed">
              <Anchor className="h-8 w-8 mx-auto mb-2 text-slate-400" />
              <p className="font-medium mb-1">No vessels added yet</p>
              <p className="text-sm text-slate-500">Add your first vessel to get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
