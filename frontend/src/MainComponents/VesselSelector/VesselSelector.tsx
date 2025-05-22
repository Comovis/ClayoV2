"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MapPin, Clock, FileText, Ship, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

export type Vessel = {
  id: string
  name: string
  type: string
  flag: string
  avatar?: string
  imo: string
  callsign?: string
  status?: {
    valid: number
    expiringSoon: number
    expired: number
    missing: number
  }
  documentStatus?: {
    valid: number
    expiringSoon: number
    expired: number
    missing: number
  }
  complianceScore?: number
  nextPort?: string
  eta?: string
  location?: {
    lat: number
    lng: number
  }
  isFavorite?: boolean
}

export type PortInfo = {
  id: string
  name: string
  country: string
  eta: string
  requiredDocsCount: number
}

interface VesselSelectorProps {
  vessels: Vessel[]
  selectedVessel: string
  onVesselChange: (vesselId: string) => void
  portInfo?: PortInfo
  formatDate?: (dateString: string) => string
  onToggleFavorite?: (vesselId: string) => void
  isLoading?: boolean
  error?: string | null
}

export function VesselSelector({
  vessels,
  selectedVessel,
  onVesselChange,
  portInfo,
  formatDate = (dateString) => new Date(dateString).toLocaleDateString(),
  onToggleFavorite,
  isLoading = false,
  error = null,
}: VesselSelectorProps) {
  const getSelectedVessel = () => {
    return vessels.find((vessel) => vessel.id === selectedVessel)
  }

  // Generate avatar fallback from vessel name if avatar is not provided
  const getAvatarFallback = (vessel: Vessel) => {
    if (vessel.avatar) return vessel.avatar
    return vessel.name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase()
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <Ship className="h-4 w-4 text-blue-600" />
            <Select value={selectedVessel} onValueChange={onVesselChange} disabled={isLoading}>
              <SelectTrigger className="w-[250px] h-9">
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="mr-2 h-4 w-4 border-2 border-t-transparent border-blue-600 rounded-full animate-spin"></div>
                    <SelectValue placeholder="Loading vessels..." />
                  </div>
                ) : error ? (
                  <SelectValue placeholder="Error loading vessels" />
                ) : (
                  <SelectValue placeholder="Select vessel" />
                )}
              </SelectTrigger>
              <SelectContent>
                {vessels.map((vessel) => (
                  <SelectItem key={vessel.id} value={vessel.id}>
                    <div className="flex items-center">
                      <div className="bg-blue-100 text-blue-800 h-5 w-5 rounded-full flex items-center justify-center mr-2 text-xs">
                        {getAvatarFallback(vessel)}
                      </div>
                      <span>{vessel.name}</span>
                      {vessel.isFavorite && <Star className="h-3 w-3 text-yellow-500 ml-2 fill-yellow-500" />}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {getSelectedVessel() && (
            <div className="flex items-center bg-blue-50 px-3 py-1.5 rounded-md">
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 border-2 border-t-transparent border-blue-600 rounded-full animate-spin"></div>
                  <span className="text-sm">Loading vessel details...</span>
                </div>
              ) : (
                <>
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarFallback className="bg-blue-500 text-white text-xs">
                      {getAvatarFallback(getSelectedVessel()!)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="mr-2">
                    <div className="text-sm font-medium">{getSelectedVessel()?.name}</div>
                    <div className="text-xs text-gray-500">
                      {getSelectedVessel()?.type} • {getSelectedVessel()?.flag}
                    </div>
                  </div>
                  {onToggleFavorite && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => onToggleFavorite(selectedVessel)}
                    >
                      <Star
                        className={`h-4 w-4 ${getSelectedVessel()?.isFavorite ? "text-yellow-500 fill-yellow-500" : "text-gray-400"}`}
                      />
                    </Button>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {getSelectedVessel() && portInfo && (
          <div className="flex flex-wrap gap-4 mt-2 border-t pt-2 text-sm">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 text-blue-600 mr-1.5" />
              <div>
                <span className="text-gray-500 text-xs">Next Port:</span>{" "}
                <span>
                  {portInfo.name}, {portInfo.country}
                </span>
              </div>
            </div>

            <div className="flex items-center">
              <Clock className="h-4 w-4 text-blue-600 mr-1.5" />
              <div>
                <span className="text-gray-500 text-xs">ETA:</span> <span>{formatDate(portInfo.eta)}</span>
              </div>
            </div>

            <div className="flex items-center">
              <FileText className="h-4 w-4 text-blue-600 mr-1.5" />
              <div>
                <span className="text-gray-500 text-xs">Required Docs:</span> <span>{portInfo.requiredDocsCount}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
