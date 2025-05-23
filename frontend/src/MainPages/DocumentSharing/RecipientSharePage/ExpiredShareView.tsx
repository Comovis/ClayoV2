"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Mail, AlertTriangle } from "lucide-react"

interface ExpiredShareViewProps {
  shareInfo?: {
    vessel?: {
      name: string
    }
    port?: {
      name: string
    }
    sender?: {
      name: string
      email: string
      company: string
    }
    expiresAt: string
    isRevoked?: boolean
  }
}

export default function ExpiredShareView({ shareInfo }: ExpiredShareViewProps) {
  const isRevoked = shareInfo?.isRevoked

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            {isRevoked ? (
              <AlertTriangle className="h-8 w-8 text-red-600" />
            ) : (
              <Clock className="h-8 w-8 text-yellow-600" />
            )}
          </div>
          <CardTitle>
            {isRevoked ? "This Document Share Has Been Revoked" : "This Document Share Has Expired"}
          </CardTitle>
          <CardDescription>
            {isRevoked
              ? "Access to these documents has been revoked by the sender."
              : "The secure link to these documents is no longer active."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {shareInfo && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Vessel:</p>
                    <p className="text-sm text-gray-500">{shareInfo.vessel?.name || "Unknown Vessel"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Port:</p>
                    <p className="text-sm text-gray-500">{shareInfo.port?.name || "Unknown Port"}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Shared by:</p>
                <p className="text-sm text-gray-500">
                  {shareInfo.sender?.name || "Unknown Sender"} ({shareInfo.sender?.company || "Unknown Company"})
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">{isRevoked ? "Revoked on:" : "Expired on:"}</p>
                <p className="text-sm text-gray-500">
                  {new Date(shareInfo.expiresAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-center text-center">
          {shareInfo?.sender?.email && (
            <Button
              className="w-full mb-2"
              onClick={() => {
                const subject = `Request for Document Access - ${shareInfo.vessel?.name || "Vessel Documents"}`
                const body = `Hello ${shareInfo.sender?.name || ""},

I was trying to access the shared documents for ${shareInfo.vessel?.name || "the vessel"} but the link has ${isRevoked ? "been revoked" : "expired"}. 

Could you please share the documents again or provide access?

Thank you,`

                const mailtoUrl = `mailto:${shareInfo.sender.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
                window.open(mailtoUrl, "_blank")
              }}
            >
              <Mail className="mr-2 h-4 w-4" />
              Contact Sender
            </Button>
          )}
          <p className="text-xs text-gray-500 mt-2">
            If you need access to these documents, please contact the sender
            {shareInfo?.sender?.email && ` at ${shareInfo.sender.email}`}
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
