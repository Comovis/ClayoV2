"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MapPin, Clock, FileText, Ship } from "lucide-react"

export type Vessel = {
  id: string
  name: string
  type: string
  flag: string
  avatar: string
  imo: string
  callsign: string
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
}

export function VesselSelector({
  vessels,
  selectedVessel,
  onVesselChange,
  portInfo,
  formatDate = (dateString) => new Date(dateString).toLocaleDateString(),
}: VesselSelectorProps) {
  const getSelectedVessel = () => {
    return vessels.find((vessel) => vessel.id === selectedVessel)
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <Ship className="h-4 w-4 text-blue-600" />
            <Select value={selectedVessel} onValueChange={onVesselChange}>
              <SelectTrigger className="w-[250px] h-9">
                <SelectValue placeholder="Select vessel" />
              </SelectTrigger>
              <SelectContent>
                {vessels.map((vessel) => (
                  <SelectItem key={vessel.id} value={vessel.id}>
                    <div className="flex items-center">
                      <div className="bg-blue-100 text-blue-800 h-5 w-5 rounded-full flex items-center justify-center mr-2 text-xs">
                        {vessel.avatar}
                      </div>
                      <span>{vessel.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {getSelectedVessel() && (
            <div className="flex items-center bg-blue-50 px-3 py-1.5 rounded-md">
              <Avatar className="h-6 w-6 mr-2">
                <AvatarFallback className="bg-blue-500 text-white text-xs">
                  {getSelectedVessel()?.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-medium">{getSelectedVessel()?.name}</div>
                <div className="text-xs text-gray-500">
                  {getSelectedVessel()?.type} • {getSelectedVessel()?.flag}
                </div>
              </div>
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
