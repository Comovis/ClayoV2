"use client"

import { Building, MapPin, Anchor, Ship } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useOnboarding } from "./OnboardingContainer"
import { useEffect, useState } from "react"
import { supabase } from "../../../Auth/SupabaseAuth"

// Maritime company types
const companyTypes = [
  { value: "shipowner", label: "Ship Owner" },
  { value: "operator", label: "Ship Operator" },
  { value: "manager", label: "Ship Manager" },
  { value: "charterer", label: "Charterer" },
  { value: "technical_manager", label: "Technical Manager" },
  { value: "agent", label: "Shipping Agent" },
  { value: "port", label: "Port Authority" },
  { value: "terminal", label: "Terminal Operator" },
  { value: "other", label: "Other" },
]

// Maritime regions - hello
const regions = [
  { id: "asia_pacific", name: "Asia Pacific" },
  { id: "europe", name: "Europe" },
  { id: "north_america", name: "North America" },
  { id: "south_america", name: "South America" },
  { id: "middle_east", name: "Middle East" },
  { id: "africa", name: "Africa" },
  { id: "mediterranean", name: "Mediterranean" },
  { id: "baltic", name: "Baltic" },
  { id: "caribbean", name: "Caribbean" },
]

// Vessel types
const vesselTypes = [
  { id: "tanker", name: "Tanker" },
  { id: "container", name: "Container Ship" },
  { id: "bulk", name: "Bulk Carrier" },
  { id: "general_cargo", name: "General Cargo" },
  { id: "roro", name: "Ro-Ro" },
  { id: "passenger", name: "Passenger/Cruise" },
  { id: "offshore", name: "Offshore Support" },
  { id: "special", name: "Special Purpose" },
]

export default function OrganizationProfile() {
  const { onboardingData, updateData } = useOnboarding()
  const [companyName, setCompanyName] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Initialize vesselTypes in onboardingData if it doesn't exist
  useEffect(() => {
    if (!onboardingData.vesselTypes) {
      updateData({ vesselTypes: [] })
    }
  }, [])

  useEffect(() => {
    async function fetchCompanyName() {
      try {
        setIsLoading(true)

        // Use the RPC function to get the company name safely
        const { data, error } = await supabase.rpc("get_company_name")

        if (error) {
          console.error("Error fetching company name:", error)
          return
        }

        if (data) {
          setCompanyName(data)
          // Only update the onboarding data if it's different
          if (onboardingData.companyName !== data) {
            updateData({ companyName: data })
          }
        }
      } catch (error) {
        console.error("Error in fetchCompanyName:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCompanyName()
  }, [])

  const handleRegionToggle = (regionId: string) => {
    const currentRegions = [...(onboardingData.regions || [])]
    if (currentRegions.includes(regionId)) {
      updateData({ regions: currentRegions.filter((id) => id !== regionId) })
    } else {
      updateData({ regions: [...currentRegions, regionId] })
    }
  }

  const handleVesselTypeToggle = (vesselTypeId: string) => {
    const currentVesselTypes = [...(onboardingData.vesselTypes || [])]
    if (currentVesselTypes.includes(vesselTypeId)) {
      updateData({ vesselTypes: currentVesselTypes.filter((id) => id !== vesselTypeId) })
    } else {
      updateData({ vesselTypes: [...currentVesselTypes, vesselTypeId] })
    }
  }

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Company Profile</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Tell us about your maritime operations so we can customise your compliance experience
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Company Details</CardTitle>
          <CardDescription>Basic information about your organisation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <div className="relative">
              <Building className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="companyName"
                value={isLoading ? "Loading..." : companyName || onboardingData.companyName}
                onChange={(e) => updateData({ companyName: e.target.value })}
                className="pl-10 bg-slate-50 dark:bg-slate-800"
                readOnly={isLoading || !!companyName}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyType">Company Type</Label>
            <Select value={onboardingData.companyType} onValueChange={(value) => updateData({ companyType: value })}>
              <SelectTrigger id="companyType">
                <SelectValue placeholder="Select company type" />
              </SelectTrigger>
              <SelectContent>
                {companyTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Fleet Information</CardTitle>
          <CardDescription>Tell us about your fleet composition</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex justify-between">
              <Label>Number of Vessels</Label>
              <span className="font-medium">{onboardingData.vesselCount}</span>
            </div>
            <Slider
              value={[onboardingData.vesselCount]}
              min={1}
              max={100}
              step={1}
              onValueChange={(value) => updateData({ vesselCount: value[0] })}
              className="py-4"
            />
            <div className="flex justify-between text-sm text-slate-500">
              <span>1</span>
              <span>25</span>
              <span>50</span>
              <span>75</span>
              <span>100+</span>
            </div>
          </div>

          <div className="pt-2">
            <p className="text-sm text-slate-500">
              Based on your fleet size, we recommend the{" "}
              <span className="font-medium">
                {onboardingData.vesselCount <= 5
                  ? "Essentials"
                  : onboardingData.vesselCount <= 20
                    ? "Professional"
                    : "Enterprise"}{" "}
                Plan
              </span>
            </p>
          </div>

          <div className="pt-4 space-y-2">
            <Label>Primary Vessel Types</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {vesselTypes.map((type) => (
                <div
                  key={type.id}
                  className={`
                    border rounded-md p-2 cursor-pointer transition-colors
                    ${
                      onboardingData.vesselTypes?.includes(type.id)
                        ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }
                  `}
                  onClick={() => handleVesselTypeToggle(type.id)}
                >
                  <div className="flex items-center">
                    <Ship
                      className={`h-3.5 w-3.5 mr-1.5 ${
                        onboardingData.vesselTypes?.includes(type.id)
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-slate-400"
                      }`}
                    />
                    <span className="text-sm">{type.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Operating Regions</CardTitle>
          <CardDescription>Select the primary regions where your vessels operate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {regions.map((region) => (
              <div
                key={region.id}
                className={`
                  border rounded-md p-2 cursor-pointer transition-colors
                  ${
                    onboardingData.regions?.includes(region.id)
                      ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }
                `}
                onClick={() => handleRegionToggle(region.id)}
              >
                <div className="flex items-center">
                  <MapPin
                    className={`h-3.5 w-3.5 mr-1.5 ${
                      onboardingData.regions?.includes(region.id)
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-slate-400"
                    }`}
                  />
                  <span className="text-sm">{region.name}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 border rounded-md border-dashed">
            <div className="flex">
              <div className="mr-4 flex-shrink-0">
                <Anchor className="h-10 w-10 text-blue-500" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Maritime Compliance Focus</h3>
                <p className="text-sm text-slate-500">
                  Comovis specializes in maritime compliance for international shipping. We'll customize your experience
                  based on your vessel types and operating regions to ensure you stay compliant with all relevant
                  regulations.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
