"use client"

import { useState } from "react"
import { Upload, Download, FileText, CheckCircle, AlertCircle, Ship, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useOnboarding } from "./OnboardingContainer"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function BulkImport() {
  const { onboardingData, updateData } = useOnboarding()
  const [uploadState, setUploadState] = useState("initial") // initial, uploading, success, error
  const [uploadError, setUploadError] = useState("")

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

  const handleDownloadTemplate = () => {
    // In a real app, this would download a CSV template
    console.log("Downloading template...")
  }

  const handleUpload = () => {
    setUploadState("uploading")

    // Simulate upload process
    setTimeout(() => {
      setUploadState("success")
      updateData({ vessels: sampleVessels })
    }, 2000)
  }

  const handleRemoveVessel = (id: string) => {
    updateData({
      vessels: onboardingData.vessels.filter((vessel: any) => vessel.id !== id),
    })
  }

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Bulk Import Vessels</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Import multiple vessels at once from a CSV file
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>CSV Import</CardTitle>
          <CardDescription>Download the template, fill it with your vessel data, and upload</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="inline-flex items-center justify-center p-3 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
                  <Download className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold mb-2">Step 1</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Download the CSV template</p>
                <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="inline-flex items-center justify-center p-3 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
                  <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold mb-2">Step 2</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  Fill the template with your vessel data
                </p>
                <Badge variant="outline">Required fields: IMO, Name, Type, Flag</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="inline-flex items-center justify-center p-3 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
                  <Upload className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold mb-2">Step 3</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Upload your completed CSV file</p>
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

          <div className="mt-6 p-4 border rounded-md border-dashed text-center">
            <p className="text-sm text-slate-500 mb-2">
              For demo purposes, clicking "Upload CSV" will import 3 sample vessels.
            </p>
            <p className="text-xs text-slate-400">
              In a real implementation, this would allow you to select and upload a CSV file.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Imported Vessels</CardTitle>
          <CardDescription>
            Vessels imported from your CSV file ({onboardingData.vessels ? onboardingData.vessels.length : 0})
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
                        <span className="text-xs text-slate-500">Flag: {vessel.flag}</span>
                        {vessel.imo && <span className="text-xs text-slate-500 ml-2">IMO: {vessel.imo}</span>}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveVessel(vessel.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 border rounded-md border-dashed">
              <Upload className="h-8 w-8 mx-auto mb-2 text-slate-400" />
              <p className="font-medium mb-1">No vessels imported yet</p>
              <p className="text-sm text-slate-500">Upload a CSV file to import your vessels</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
