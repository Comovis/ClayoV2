"use client"

import type React from "react"
import { useState } from "react"
import { Anchor, Check, ChevronsUpDown, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface BookDemoModalProps {
  isOpen: boolean
  onClose: () => void
}

// Country data with flags, codes, and names - focused on maritime nations
const countries = [
  { code: "+1", name: "United States", flag: "🇺🇸" },
  { code: "+44", name: "United Kingdom", flag: "🇬🇧" },
  { code: "+65", name: "Singapore", flag: "🇸🇬" },
  { code: "+47", name: "Norway", flag: "🇳🇴" },
  { code: "+45", name: "Denmark", flag: "🇩🇰" },
  { code: "+30", name: "Greece", flag: "🇬🇷" },
  { code: "+49", name: "Germany", flag: "🇩🇪" },
  { code: "+31", name: "Netherlands", flag: "🇳🇱" },
  { code: "+33", name: "France", flag: "🇫🇷" },
  { code: "+39", name: "Italy", flag: "🇮🇹" },
  { code: "+81", name: "Japan", flag: "🇯🇵" },
  { code: "+86", name: "China", flag: "🇨🇳" },
  { code: "+82", name: "South Korea", flag: "🇰🇷" },
  { code: "+852", name: "Hong Kong", flag: "🇭🇰" },
  { code: "+91", name: "India", flag: "🇮🇳" },
  { code: "+971", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "+966", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+61", name: "Australia", flag: "🇦🇺" },
  { code: "+64", name: "New Zealand", flag: "🇳🇿" },
  { code: "+27", name: "South Africa", flag: "🇿🇦" },
  { code: "+55", name: "Brazil", flag: "🇧🇷" },
  { code: "+52", name: "Mexico", flag: "🇲🇽" },
  { code: "+507", name: "Panama", flag: "🇵🇦" },
  { code: "+357", name: "Cyprus", flag: "🇨🇾" },
  { code: "+356", name: "Malta", flag: "🇲🇹" },
]

const BookDemoModal: React.FC<BookDemoModalProps> = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [countryOpen, setCountryOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState(countries[0])
  const [customCountryCode, setCustomCountryCode] = useState("")
  const [isCustomCode, setIsCustomCode] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    role: "",
    fleetSize: "",
    phoneNumber: "",
    message: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePhoneChange = (value: string) => {
    // Just store the phone number as entered
    setFormData((prev) => ({
      ...prev,
      phoneNumber: value,
    }))
  }

  const handleCustomCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Ensure the custom code starts with +
    let value = e.target.value
    if (value && !value.startsWith("+")) {
      value = "+" + value
    }
    setCustomCountryCode(value)
  }

  const handleSelectCustomCode = () => {
    setIsCustomCode(true)
    setCountryOpen(false)
  }

  const handleSelectCountry = (country: (typeof countries)[0]) => {
    setSelectedCountry(country)
    setIsCustomCode(false)
    setCountryOpen(false)
  }

  const getEffectiveCountryCode = () => {
    return isCustomCode ? customCountryCode : selectedCountry.code
  }

  const handleDemoRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Get the effective country code (either selected or custom)
      const countryCode = getEffectiveCountryCode()

      // Simulate form submission - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Here you would typically send the form data to your backend
      console.log("Demo request submitted:", {
        ...formData,
        countryCode,
        fullPhoneNumber: `${countryCode} ${formData.phoneNumber}`,
      })

      // Reset form and close modal
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        company: "",
        role: "",
        fleetSize: "",
        phoneNumber: "",
        message: "",
      })
      setCustomCountryCode("")
      setIsCustomCode(false)
      onClose()

      // You might want to show a success message here
    } catch (error) {
      console.error("Error submitting demo request:", error)
      // Handle error - show error message to user
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Anchor className="h-5 w-5 text-slate-800" />
            Book Your Personalised Demo
          </DialogTitle>
          <DialogDescription>
            See how Comovis can help prevent vessel detentions and streamline your maritime compliance.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleDemoRequest} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first-name">First name *</Label>
              <Input
                id="first-name"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last-name">Last name *</Label>
              <Input
                id="last-name"
                placeholder="Smith"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Work email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="john.smith@company.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company name *</Label>
            <Input
              id="company"
              placeholder="Shipping Company Ltd."
              value={formData.company}
              onChange={(e) => handleInputChange("company", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Contact number</Label>
            <div className="flex gap-2">
              {isCustomCode ? (
                <Input
                  value={customCountryCode}
                  onChange={handleCustomCodeChange}
                  placeholder="+XX"
                  className="w-[100px]"
                />
              ) : (
                <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={countryOpen}
                      className="w-[100px] justify-between"
                    >
                      <span className="flex items-center gap-1 truncate">
                        <span className="text-base">{selectedCountry.flag}</span>
                        <span>{selectedCountry.code}</span>
                      </span>
                      <ChevronsUpDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[220px] p-0">
                    <Command>
                      <CommandInput placeholder="Search country..." />
                      <CommandList>
                        <CommandEmpty>No country found.</CommandEmpty>
                        <CommandGroup className="max-h-[250px] overflow-y-auto">
                          {countries.map((country) => (
                            <CommandItem
                              key={country.code}
                              value={`${country.name} ${country.code}`}
                              onSelect={() => handleSelectCountry(country)}
                            >
                              <span className="flex items-center gap-2">
                                <span className="text-base">{country.flag}</span>
                                <span className="truncate">{country.name}</span>
                                <span className="text-xs text-slate-500 ml-auto">{country.code}</span>
                              </span>
                              <Check
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  selectedCountry.code === country.code ? "opacity-100" : "opacity-0",
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                        <CommandSeparator />
                        <CommandGroup>
                          <CommandItem onSelect={handleSelectCustomCode}>
                            <Plus className="mr-2 h-4 w-4" />
                            <span>Enter custom code</span>
                          </CommandItem>
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}
              <div className="flex-1 relative">
                <Input
                  id="phone"
                  type="tel"
                  placeholder="123 456 7890"
                  value={formData.phoneNumber}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className="w-full"
                />
                {isCustomCode && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 px-2 text-slate-500"
                    onClick={() => setIsCustomCode(false)}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Your role</Label>
            <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fleet-manager">Fleet Manager</SelectItem>
                <SelectItem value="compliance-officer">Compliance Officer</SelectItem>
                <SelectItem value="vessel-operator">Vessel Operator</SelectItem>
                <SelectItem value="port-agent">Port Agent</SelectItem>
                <SelectItem value="ship-owner">Ship Owner</SelectItem>
                <SelectItem value="maritime-lawyer">Maritime Lawyer</SelectItem>
                <SelectItem value="superintendent">Superintendent</SelectItem>
                <SelectItem value="executive">Executive</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fleet-size">Fleet size</Label>
            <Select value={formData.fleetSize} onValueChange={(value) => handleInputChange("fleetSize", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select fleet size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 vessel</SelectItem>
                <SelectItem value="2-5">2-5 vessels</SelectItem>
                <SelectItem value="6-20">6-20 vessels</SelectItem>
                <SelectItem value="21-50">21-50 vessels</SelectItem>
                <SelectItem value="51-100">51-100 vessels</SelectItem>
                <SelectItem value="100+">100+ vessels</SelectItem>
                <SelectItem value="service-provider">Service Provider</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">What are your main compliance challenges?</Label>
            <Textarea
              id="message"
              placeholder="Tell us about your current compliance process and challenges..."
              className="min-h-[80px]"
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" className="bg-slate-800 hover:bg-slate-700 text-white" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Scheduling...
                </>
              ) : (
                "Schedule Demo"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default BookDemoModal
