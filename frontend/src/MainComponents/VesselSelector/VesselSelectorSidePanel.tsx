"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Ship, CheckCircle, Clock, AlertCircle, AlertTriangle, Upload, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useFetchVessels } from "../../Hooks/useFetchVessels"

interface DocumentStatus {
  valid: number
  expiringSoon: number
  expired: number
  missing: number
}

interface VesselCardProps {
  name: string
  type: string
  flag: string
  active: boolean
  onClick: () => void
  documentStatus: DocumentStatus
}

function VesselCard({ name, type, flag, active, onClick, documentStatus }: VesselCardProps) {
  return (
    <div
      className={`p-3 rounded-md cursor-pointer ${active ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-100 border border-transparent"}`}
      onClick={onClick}
    >
      <div className="flex items-center mb-2">
        <Ship className={`h-4 w-4 mr-2 ${active ? "text-blue-500" : "text-gray-500"}`} />
        <h3 className="font-medium">{name}</h3>
      </div>
      <p className="text-sm text-gray-500 mb-2">
        {type} • {flag}
      </p>
      <div className="flex space-x-2">
        <span className="inline-flex items-center text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded">
          <CheckCircle className="h-3 w-3 mr-1" /> {documentStatus.valid}
        </span>
        <span className="inline-flex items-center text-xs text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded">
          <Clock className="h-3 w-3 mr-1" /> {documentStatus.expiringSoon}
        </span>
        {documentStatus.expired > 0 && (
          <span className="inline-flex items-center text-xs text-red-700 bg-red-50 px-2 py-0.5 rounded">
            <AlertCircle className="h-3 w-3 mr-1" /> {documentStatus.expired}
          </span>
        )}
        {documentStatus.missing > 0 && (
          <span className="inline-flex items-center text-xs text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
            <AlertTriangle className="h-3 w-3 mr-1" /> {documentStatus.missing}
          </span>
        )}
      </div>
    </div>
  )
}

interface MyFleetProps {
  activeVessel: string
  onVesselSelect: (vesselName: string) => void
  onUploadClick: (type: "single" | "batch") => void
  className?: string
}

export function MyFleet({ activeVessel, onVesselSelect, onUploadClick, className = "" }: MyFleetProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Use the useFetchVessels hook to get vessel data
  const { vessels, isLoading, error, fetchVessels } = useFetchVessels()

  // Fetch vessels when the component mounts or search query changes
  useEffect(() => {
    // Create a debounce timer to prevent too many API calls when typing in search
    const timer = setTimeout(() => {
      fetchVessels({ searchQuery })
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Filter vessels based on search query (client-side filtering as backup)
  const filteredVessels = vessels.filter(
    (vessel) =>
      vessel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vessel.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vessel.flag.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Fallback to mock data if there's an error or no vessels are loaded yet
  const mockVessels = [
    {
      id: "1",
      name: "Humble Warrior",
      type: "Crude Oil Tanker",
      flag: "Panama",
      documentStatus: {
        valid: 12,
        expiringSoon: 3,
        expired: 0,
        missing: 1,
      },
    },
    {
      id: "2",
      name: "Pacific Explorer",
      type: "Container Ship",
      flag: "Singapore",
      documentStatus: {
        valid: 14,
        expiringSoon: 1,
        expired: 0,
        missing: 0,
      },
    },
    {
      id: "3",
      name: "Northern Star",
      type: "Bulk Carrier",
      flag: "Marshall Islands",
      documentStatus: {
        valid: 10,
        expiringSoon: 2,
        expired: 1,
        missing: 2,
      },
    },
  ]

  // Use real vessels if available, otherwise use mock data
  const displayVessels = vessels.length > 0 ? filteredVessels : mockVessels

  return (
    <aside className={`w-72 border-r bg-gray-50 p-4 flex flex-col ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">My Fleet</h2>
        <Button size="sm" variant="ghost">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search vessels..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full mr-2"></div>
          <p className="text-sm text-gray-500">Loading vessels...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-4 text-red-500">
          <AlertTriangle className="h-5 w-5 mx-auto mb-2" />
          <p className="text-sm">Failed to load vessels</p>
          <Button variant="link" size="sm" onClick={() => fetchVessels()}>
            Try again
          </Button>
        </div>
      )}

      <div className="space-y-2 overflow-auto flex-1">
        {displayVessels.map((vessel) => (
          <VesselCard
            key={vessel.id}
            name={vessel.name}
            type={vessel.type}
            flag={vessel.flag}
            active={activeVessel === vessel.name}
            onClick={() => onVesselSelect(vessel.name)}
            documentStatus={vessel.documentStatus}
          />
        ))}
        {!isLoading && !error && displayVessels.length === 0 && (
          <div className="text-center py-4 text-gray-500">No vessels found matching "{searchQuery}"</div>
        )}
      </div>

      <div className="mt-4">
        {/* Split Button in Sidebar */}
        <div className="flex w-full">
          <Button className="rounded-r-none flex-1" variant="outline" onClick={() => onUploadClick("single")}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-l-none border-l-0 px-2">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onUploadClick("single")}>Single Document Upload</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onUploadClick("batch")}>Batch Upload</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </aside>
  )
}
