"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Ship, CheckCircle, Clock, AlertCircle, AlertTriangle } from "lucide-react"
import AddVesselModal from "../AddVesselModal/AddNewVessel"
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
  className?: string
}

export function MyFleet({ activeVessel, onVesselSelect, className = "" }: MyFleetProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddVesselModalOpen, setIsAddVesselModalOpen] = useState(false)

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

  const displayVessels = filteredVessels

  // Handle vessel added - refresh the vessels list
  const handleVesselAdded = () => {
    fetchVessels({ searchQuery })
    setIsAddVesselModalOpen(false)
  }

  return (
    <>
      <aside className={`w-72 border-r bg-gray-50 p-4 flex flex-col ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">My Fleet</h2>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsAddVesselModalOpen(true)}
            className="hover:bg-blue-50 hover:text-blue-600"
          >
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

          {!isLoading && !error && vessels.length === 0 && searchQuery === "" && (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <Ship className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No vessels in your fleet</h3>
              <p className="text-sm text-gray-500 mb-6 max-w-xs">
                Start managing your maritime compliance by adding your first vessel to the platform.
              </p>
              <Button size="sm" className="mb-2" onClick={() => setIsAddVesselModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Vessel
              </Button>
              <p className="text-xs text-gray-400">Build your fleet and track compliance</p>
            </div>
          )}

          {!isLoading && !error && vessels.length > 0 && filteredVessels.length === 0 && searchQuery !== "" && (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">No vessels found</h3>
              <p className="text-xs text-gray-500 mb-4">No vessels match "{searchQuery}"</p>
              <Button variant="link" size="sm" onClick={() => setSearchQuery("")}>
                Clear search
              </Button>
            </div>
          )}
        </div>
      </aside>

      {/* Add Vessel Modal */}
      <AddVesselModal
        isOpen={isAddVesselModalOpen}
        onClose={() => setIsAddVesselModalOpen(false)}
        onVesselAdded={handleVesselAdded}
      />
    </>
  )
}
