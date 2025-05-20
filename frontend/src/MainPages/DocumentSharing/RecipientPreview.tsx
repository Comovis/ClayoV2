"use client"

import { Download, FileText, Eye, Ship, Calendar, Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import LogoBlack from "../../ReusableAssets/Logos/LogoBlack.svg"

export function RecipientPreview({ vessel, documents, customMessage, accessDuration, securityOptions = {} }) {
  // Format access duration
  const formatAccessDuration = (duration) => {
    if (duration === "24-hours") return "24 hours"
    if (duration === "7-days") return "7 days"
    if (duration === "30-days") return "30 days"
    return "Custom period"
  }

  return (
    <div className="space-y-6 py-2">
      {/* Header */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img src={LogoBlack || "/placeholder.svg"} alt="Comovis Logo" className="h-4 w-auto mr-3" />
            <div>
              <h2 className="text-lg font-bold"> Comovis Document Portal</h2>
              <p className="text-sm text-gray-500">Secure document sharing</p>
            </div>
          </div>
          <Badge className="bg-blue-100 text-blue-800">Expires in {formatAccessDuration(accessDuration)}</Badge>
        </div>
      </div>

      {/* Vessel Information */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-3">Vessel Information</h3>
        <div className="flex items-center">
          <div className="bg-blue-500 text-white h-12 w-12 rounded-full flex items-center justify-center mr-3">
            {vessel?.avatar}
          </div>
          <div>
            <h4 className="font-medium text-lg">{vessel?.name}</h4>
            <p className="text-gray-500">
              {vessel?.type} • {vessel?.flag}
            </p>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      {securityOptions?.watermark && (
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-3">Security Notice</h3>
          <div className="bg-yellow-50 border border-yellow-100 rounded-md p-3">
            <div className="flex items-start">
              <Shield className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">These documents are protected</p>
                <ul className="text-sm text-yellow-700 mt-1 list-disc pl-5">
                  {securityOptions?.watermark && <li>Documents are watermarked</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shared Documents */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-3">Shared Documents</h3>
        <div className="space-y-3">
          {documents?.map((doc, index) => (
            <div key={index} className="border rounded-md p-3">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-md mr-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-medium">{doc?.name}</h4>
                    <div className="flex items-center space-x-2">
                      <button className="text-gray-500 hover:text-gray-700">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-gray-500 hover:text-gray-700">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <span className="inline-flex items-center">
                      <Ship className="h-3 w-3 mr-1" />
                      {vessel?.name}
                    </span>
                    <span className="mx-1">•</span>
                    <span className="inline-flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Issued by {doc?.issuer}
                    </span>
                  </div>
                  {doc?.status === "expiring-soon" && (
                    <div className="text-xs text-yellow-600 mt-1">Expires in {doc?.expiryDays} days</div>
                  )}
                  {doc?.status === "valid" && <div className="text-xs text-green-600 mt-1">Valid</div>}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t">
          <button className="w-full bg-black text-white py-2 px-4 rounded-md flex items-center justify-center">
            <Download className="mr-2 h-4 w-4" />
            Download All Documents
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-2">
          <Shield className="h-4 w-4 text-gray-500 mr-1" />
          <span className="text-sm text-gray-500">Secure document sharing by Comovis</span>
        </div>
        <p className="text-xs text-gray-400">
          These documents are shared securely and may be watermarked. Access expires in{" "}
          {formatAccessDuration(accessDuration)}.
        </p>
      </div>
    </div>
  )
}
