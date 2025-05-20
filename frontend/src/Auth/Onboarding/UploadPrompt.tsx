"use client"

import { useState } from "react"
import { FileUp, X, AlertCircle, Ship, FileText, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

interface Vessel {
  id: string
  name: string
  type: string
  flag: string
  documentCount: number
}

interface DocumentUploadPromptProps {
  vessels?: Vessel[]
  onDismiss?: () => void
}

export default function DocumentUploadPrompt({ vessels = [], onDismiss }: DocumentUploadPromptProps) {
  const [isDismissed, setIsDismissed] = useState(false)

  if (isDismissed) {
    return null
  }

  // If no vessels are provided, use sample data
  const vesselData =
    vessels.length > 0
      ? vessels
      : [
          { id: "v1", name: "Humble Warrior", type: "Crude Oil Tanker", flag: "Panama", documentCount: 0 },
          { id: "v2", name: "Pacific Explorer", type: "Container Ship", flag: "Liberia", documentCount: 0 },
        ]

  const handleDismiss = () => {
    setIsDismissed(true)
    if (onDismiss) onDismiss()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-amber-200 shadow-md mb-6">
        <CardHeader className="pb-2 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900">
          <div className="flex justify-between">
            <div className="flex items-center">
              <div className="bg-amber-100 dark:bg-amber-800 p-1.5 rounded-full mr-2">
                <FileUp className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <CardTitle className="text-lg">Upload Vessel Documents</CardTitle>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleDismiss}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>Start tracking compliance by uploading essential documents for your vessels</CardDescription>
        </CardHeader>

        <CardContent className="pt-4">
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Important for compliance</AlertTitle>
            <AlertDescription>
              Vessels without proper documentation may face delays or detentions during Port State Control inspections.
            </AlertDescription>
          </Alert>

          <div className="space-y-3 mt-4">
            <h3 className="text-sm font-medium">Your vessels requiring documents:</h3>

            {vesselData.map((vessel) => (
              <div key={vessel.id} className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                    <Ship className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{vessel.name}</p>
                    <div className="flex items-center mt-1">
                      <Badge variant="secondary" className="mr-2 text-xs">
                        {vessel.type}
                      </Badge>
                      <span className="text-xs text-slate-500">{vessel.flag}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="mr-3 text-right">
                    <p className="text-sm font-medium">{vessel.documentCount} / 15</p>
                    <p className="text-xs text-slate-500">Documents</p>
                  </div>
                  <Button size="sm" className="whitespace-nowrap">
                    <FileText className="h-4 w-4 mr-1" />
                    Upload
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 border border-dashed rounded-md p-4 text-center">
            <Upload className="h-8 w-8 mx-auto mb-2 text-slate-400" />
            <h3 className="font-medium mb-1">Bulk Upload Available</h3>
            <p className="text-sm text-slate-500 mb-3">Save time by uploading multiple documents at once</p>
            <Button variant="outline">Bulk Upload</Button>
          </div>
        </CardContent>

        <CardFooter className="border-t pt-4 flex justify-between">
          <Button variant="ghost" onClick={handleDismiss}>
            Remind Me Later
          </Button>
          <Button>
            <FileUp className="h-4 w-4 mr-2" />
            Upload Documents
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
