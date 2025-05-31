"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Search,
  Plus,
  Mail,
  Phone,
  MapPin,
  Building,
  Edit,
  Trash2,
  Users,
  Ship,
  AlertCircle,
  CheckCircle,
  Anchor,
  Loader2,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createContact, fetchVesselContacts, updateContact, deleteContact } from "../../../Hooks/useContacts"

interface Contact {
  id: string
  name: string
  role: string
  email: string
  phone?: string
  company?: string
  location: string
  type: string
  avatar?: string
  notes?: string
  emergencyContact?: boolean
  primaryContact?: boolean
  associatedPort?: string
  vesselId?: string
  contactType?: string // API field
  createdAt?: string
  updatedAt?: string
}

interface ContactsTabProps {
  selectedVessel: string
  vessels: Array<{
    id: string
    name: string
    type: string
    flag: string
  }>
}

// Common ports for quick selection
const commonPorts = [
  "Singapore",
  "Rotterdam",
  "Hong Kong",
  "Shanghai",
  "Busan",
  "Los Angeles",
  "Hamburg",
  "Dubai",
  "New York",
  "Tokyo",
]

// Get contact type badge color
const getContactTypeBadge = (type: string) => {
  const typeMap: Record<string, string> = {
    crew: "bg-blue-100 text-blue-800",
    agent: "bg-green-100 text-green-800",
    charterer: "bg-purple-100 text-purple-800",
    owner: "bg-orange-100 text-orange-800",
    surveyor: "bg-gray-100 text-gray-800",
    inspector: "bg-red-100 text-red-800",
    pilot: "bg-yellow-100 text-yellow-800",
    "class-surveyor": "bg-indigo-100 text-indigo-800",
    "port-authority": "bg-emerald-100 text-emerald-800",
  }
  return typeMap[type] || "bg-gray-100 text-gray-800"
}

// Predefined contact types
const predefinedContactTypes = [
  { value: "crew", label: "Crew Member" },
  { value: "agent", label: "Port Agent" },
  { value: "charterer", label: "Charterer" },
  { value: "owner", label: "Ship Owner" },
  { value: "surveyor", label: "Surveyor" },
  { value: "inspector", label: "Inspector" },
  { value: "pilot", label: "Pilot" },
  { value: "port-authority", label: "Port Authority" },
  { value: "class-surveyor", label: "Class Surveyor" },
  { value: "other", label: "Other" },
]

// Contact form component - moved outside to prevent re-creation
interface ContactFormProps {
  isEdit?: boolean
  newContactForm: any
  setNewContactForm: (form: any) => void
  customContactType: string
  setCustomContactType: (type: string) => void
  showCustomTypeInput: boolean
  setShowCustomTypeInput: (show: boolean) => void
  customPort: string
  setCustomPort: (port: string) => void
  showCustomPortInput: boolean
  setShowCustomPortInput: (show: boolean) => void
  isLoading: boolean
  onSubmit: () => void
  onCancel: () => void
}

const ContactForm = ({
  isEdit = false,
  newContactForm,
  setNewContactForm,
  customContactType,
  setCustomContactType,
  showCustomTypeInput,
  setShowCustomTypeInput,
  customPort,
  setCustomPort,
  showCustomPortInput,
  setShowCustomPortInput,
  isLoading,
  onSubmit,
  onCancel,
}: ContactFormProps) => {
  // Handle contact type change
  const handleContactTypeChange = useCallback(
    (value: string) => {
      setNewContactForm({ ...newContactForm, type: value })
      setShowCustomTypeInput(value === "other")
      if (value !== "other") {
        setCustomContactType("")
      }
    },
    [newContactForm, setNewContactForm, setShowCustomTypeInput, setCustomContactType],
  )

  // Handle port selection change
  const handlePortChange = useCallback(
    (value: string) => {
      if (value === "custom") {
        setShowCustomPortInput(true)
        setNewContactForm({ ...newContactForm, associatedPort: "" })
      } else if (value === "none") {
        setShowCustomPortInput(false)
        setCustomPort("")
        setNewContactForm({ ...newContactForm, associatedPort: "" })
      } else {
        setShowCustomPortInput(false)
        setCustomPort("")
        setNewContactForm({ ...newContactForm, associatedPort: value })
      }
    },
    [newContactForm, setNewContactForm, setShowCustomPortInput, setCustomPort],
  )

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contact-name">Name *</Label>
          <Input
            id="contact-name"
            placeholder="Full name"
            value={newContactForm.name}
            onChange={(e) => setNewContactForm({ ...newContactForm, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-role">Role/Position *</Label>
          <Input
            id="contact-role"
            placeholder="e.g., Captain, Port Agent, Chief Engineer"
            value={newContactForm.role}
            onChange={(e) => setNewContactForm({ ...newContactForm, role: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contact-email">Email *</Label>
          <Input
            id="contact-email"
            type="email"
            placeholder="email@example.com"
            value={newContactForm.email}
            onChange={(e) => setNewContactForm({ ...newContactForm, email: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-phone">Phone</Label>
          <Input
            id="contact-phone"
            placeholder="+1 234 567 8900"
            value={newContactForm.phone}
            onChange={(e) => setNewContactForm({ ...newContactForm, phone: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contact-company">Company/Organization</Label>
          <Input
            id="contact-company"
            placeholder="Company name (optional)"
            value={newContactForm.company}
            onChange={(e) => setNewContactForm({ ...newContactForm, company: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-location">Location *</Label>
          <Input
            id="contact-location"
            placeholder="e.g., On Board, Singapore, New York"
            value={newContactForm.location}
            onChange={(e) => setNewContactForm({ ...newContactForm, location: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contact-type">Contact Type</Label>
          <Select value={newContactForm.type} onValueChange={handleContactTypeChange}>
            <SelectTrigger id="contact-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {predefinedContactTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {showCustomTypeInput && (
            <div className="mt-2">
              <Input
                placeholder="Enter custom contact type"
                value={customContactType}
                onChange={(e) => setCustomContactType(e.target.value)}
              />
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="associated-port">Associated Port</Label>
          <Select
            value={showCustomPortInput ? "custom" : newContactForm.associatedPort || "none"}
            onValueChange={handlePortChange}
          >
            <SelectTrigger id="associated-port">
              <SelectValue placeholder="Select a port (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No specific port</SelectItem>
              {commonPorts.map((port) => (
                <SelectItem key={port} value={port}>
                  {port}
                </SelectItem>
              ))}
              <SelectItem value="custom">Other (enter manually)</SelectItem>
            </SelectContent>
          </Select>

          {showCustomPortInput && (
            <div className="mt-2">
              <Input placeholder="Enter port name" value={customPort} onChange={(e) => setCustomPort(e.target.value)} />
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-notes">Notes (Optional)</Label>
        <Textarea
          id="contact-notes"
          placeholder="Additional information, availability, languages spoken, etc."
          value={newContactForm.notes}
          onChange={(e) => setNewContactForm({ ...newContactForm, notes: e.target.value })}
          rows={3}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="emergency-contact"
            checked={newContactForm.emergencyContact}
            onChange={(e) => setNewContactForm({ ...newContactForm, emergencyContact: e.target.checked })}
            className="rounded border-gray-300"
          />
          <Label htmlFor="emergency-contact" className="text-sm">
            Emergency contact (24/7 availability)
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="primary-contact"
            checked={newContactForm.primaryContact}
            onChange={(e) => setNewContactForm({ ...newContactForm, primaryContact: e.target.checked })}
            className="rounded border-gray-300"
          />
          <Label htmlFor="primary-contact" className="text-sm">
            Primary contact for this role
          </Label>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEdit ? "Updating..." : "Adding..."}
            </>
          ) : isEdit ? (
            "Update Contact"
          ) : (
            "Add Contact"
          )}
        </Button>
      </div>
    </div>
  )
}

// Contact card component - moved outside to prevent re-creation
interface ContactCardProps {
  contact: Contact
  onSendEmail: (contact: Contact) => void
  onEdit: (contact: Contact) => void
  onDelete: (contactId: string) => void
  isLoading: boolean
}

const ContactCard = ({ contact, onSendEmail, onEdit, onDelete, isLoading }: ContactCardProps) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardContent className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-blue-100 text-blue-800">{contact.avatar}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="font-medium text-gray-900">{contact.name}</h3>
              <Badge className={getContactTypeBadge(contact.type)} variant="outline">
                {contact.type}
              </Badge>
              {contact.emergencyContact && (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  Emergency
                </Badge>
              )}
              {contact.primaryContact && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Primary
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-1">{contact.role}</p>

            {/* Port association */}
            {contact.associatedPort && (
              <div className="flex items-center text-xs bg-gray-50 rounded-full px-2 py-1 border border-gray-200 w-fit mb-2">
                <Anchor className="h-3 w-3 mr-1 flex-shrink-0 text-gray-500" />
                <span className="text-gray-700">{contact.associatedPort}</span>
              </div>
            )}

            <div className="space-y-1">
              <div className="flex items-center text-sm text-gray-500">
                <Mail className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate">{contact.email}</span>
              </div>
              {contact.phone && (
                <div className="flex items-center text-sm text-gray-500">
                  <Phone className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span>{contact.phone}</span>
                </div>
              )}
              {contact.company && (
                <div className="flex items-center text-sm text-gray-500">
                  <Building className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span className="truncate">{contact.company}</span>
                </div>
              )}
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                <span>{contact.location}</span>
              </div>
              {contact.notes && (
                <div className="text-sm text-gray-500 mt-2 p-2 bg-gray-50 rounded">
                  <span className="font-medium">Notes:</span> {contact.notes}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onSendEmail(contact)}>
                  <Mail className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Send email</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => onEdit(contact)}
                  disabled={isLoading}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit contact</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete ${contact.name}?`)) {
                      onDelete(contact.id)
                    }
                  }}
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete contact</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </CardContent>
  </Card>
)

export default function ContactsTab({ selectedVessel, vessels }: ContactsTabProps) {
  console.log("ContactsTab - selectedVessel:", selectedVessel)
  console.log("ContactsTab - vessels:", vessels)

  const [contacts, setContacts] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterPort, setFilterPort] = useState("all")
  const [addContactOpen, setAddContactOpen] = useState(false)
  const [editContactOpen, setEditContactOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [customContactType, setCustomContactType] = useState("")
  const [showCustomTypeInput, setShowCustomTypeInput] = useState(false)
  const [customPort, setCustomPort] = useState("")
  const [showCustomPortInput, setShowCustomPortInput] = useState(false)
  const [viewMode, setViewMode] = useState<"all" | "by-port">("all")

  // Get unique ports from contacts for filtering
  const uniquePorts = Array.from(
    new Set(contacts.map((contact) => contact.associatedPort).filter(Boolean) as string[]),
  ).sort()

  const [newContactForm, setNewContactForm] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    company: "",
    location: "",
    type: "other",
    notes: "",
    emergencyContact: false,
    primaryContact: false,
    associatedPort: "",
  })

  // Fetch contacts when vessel changes
  useEffect(() => {
    if (selectedVessel) {
      loadContacts(selectedVessel)
    }
    setSearchTerm("")
    setFilterType("all")
    setFilterPort("all")
  }, [selectedVessel])

  // Load contacts from API
  const loadContacts = async (vesselId: string) => {
    if (!vesselId) return

    setIsLoading(true)
    setError("")

    try {
      console.log("Fetching contacts for vessel:", vesselId)
      const contactsData = await fetchVesselContacts(vesselId)

      // Transform API data to match component's expected format
      const formattedContacts = contactsData.map((contact: any) => ({
        id: contact.id,
        name: contact.name,
        role: contact.role,
        email: contact.email,
        phone: contact.phone,
        company: contact.company,
        location: contact.location,
        type: contact.contactType,
        notes: contact.notes,
        emergencyContact: contact.emergencyContact,
        primaryContact: contact.primaryContact,
        associatedPort: contact.associatedPort,
        // Generate avatar from name if not provided
        avatar: contact.avatar || generateAvatar(contact.name),
        vesselId: contact.vesselId,
        createdAt: contact.createdAt,
        updatedAt: contact.updatedAt,
      }))

      console.log("Contacts loaded:", formattedContacts.length)
      setContacts(formattedContacts)
    } catch (err: any) {
      console.error("Error loading contacts:", err)
      setError(`Failed to load contacts: ${err.message}`)
      // If API fails, set empty contacts array
      setContacts([])
    } finally {
      setIsLoading(false)
    }
  }

  // Clear messages after 3 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("")
        setSuccess("")
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [error, success])

  // Filter contacts based on search, type, and port
  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.company && contact.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.associatedPort && contact.associatedPort.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesType = filterType === "all" || contact.type === filterType

    const matchesPort =
      filterPort === "all" ||
      (contact.associatedPort && contact.associatedPort.toLowerCase() === filterPort.toLowerCase())

    return matchesSearch && matchesType && matchesPort
  })

  // Group contacts by port for port-centric view
  const contactsByPort = uniquePorts
    .map((port) => {
      const portContacts = contacts.filter((contact) => contact.associatedPort === port)
      return {
        port,
        contacts: portContacts,
      }
    })
    .filter((group) => group.contacts.length > 0)

  // Generate avatar initials
  const generateAvatar = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Reset form
  const resetForm = useCallback(() => {
    setNewContactForm({
      name: "",
      role: "",
      email: "",
      phone: "",
      company: "",
      location: "",
      type: "other",
      notes: "",
      emergencyContact: false,
      primaryContact: false,
      associatedPort: "",
    })
    setCustomContactType("")
    setShowCustomTypeInput(false)
    setCustomPort("")
    setShowCustomPortInput(false)
  }, [])

  // Handle add contact
  const handleAddContact = useCallback(async () => {
    if (!newContactForm.name || !newContactForm.email || !newContactForm.role || !newContactForm.location) {
      setError("Name, email, role, and location are required")
      return
    }

    // Check if email already exists
    const emailExists = contacts.some((contact) => contact.email === newContactForm.email)
    if (emailExists) {
      setError("A contact with this email already exists")
      return
    }

    // Determine final contact type
    const finalType = newContactForm.type === "other" && customContactType ? customContactType : newContactForm.type

    // Determine final port
    const finalPort = showCustomPortInput ? customPort : newContactForm.associatedPort

    setIsLoading(true)
    setError("")

    try {
      // Prepare contact data for API
      const contactData = {
        vesselId: selectedVessel,
        name: newContactForm.name,
        role: newContactForm.role,
        email: newContactForm.email,
        phone: newContactForm.phone || undefined,
        company: newContactForm.company || undefined,
        location: newContactForm.location,
        contactType: finalType,
        associatedPort: finalPort || undefined,
        notes: newContactForm.notes || undefined,
        emergencyContact: newContactForm.emergencyContact,
        primaryContact: newContactForm.primaryContact,
      }

      // Call API to create contact
      const result = await createContact(contactData)

      // Add avatar to the result
      const newContact = {
        ...result,
        avatar: generateAvatar(result.name),
        type: result.contactType || finalType,
      }

      setContacts([...contacts, newContact])
      setSuccess("Contact added successfully!")
      setAddContactOpen(false)
      resetForm()
    } catch (err: any) {
      console.error("Error adding contact:", err)
      setError(`Failed to add contact: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }, [newContactForm, customContactType, showCustomPortInput, customPort, selectedVessel, contacts, resetForm])

  // Handle edit contact
  const handleEditContact = useCallback((contact: Contact) => {
    setSelectedContact(contact)

    // Check if contact type is a predefined one
    const isPredefinedType = predefinedContactTypes.some((pt) => pt.value === contact.type)

    // Check if port is in common ports
    const isCommonPort = commonPorts.includes(contact.associatedPort || "")

    setNewContactForm({
      name: contact.name,
      role: contact.role,
      email: contact.email,
      phone: contact.phone || "",
      company: contact.company || "",
      location: contact.location,
      type: isPredefinedType ? contact.type : "other",
      notes: contact.notes || "",
      emergencyContact: contact.emergencyContact || false,
      primaryContact: contact.primaryContact || false,
      associatedPort: isCommonPort ? contact.associatedPort || "" : "",
    })

    if (!isPredefinedType) {
      setCustomContactType(contact.type)
      setShowCustomTypeInput(true)
    } else {
      setCustomContactType("")
      setShowCustomTypeInput(false)
    }

    if (!isCommonPort && contact.associatedPort) {
      setCustomPort(contact.associatedPort)
      setShowCustomPortInput(true)
    } else {
      setCustomPort("")
      setShowCustomPortInput(false)
    }

    setEditContactOpen(true)
  }, [])

  // Handle update contact
  const handleUpdateContact = useCallback(async () => {
    if (!selectedContact) return

    if (!newContactForm.name || !newContactForm.email || !newContactForm.role || !newContactForm.location) {
      setError("Name, email, role, and location are required")
      return
    }

    // Check if email exists for other contacts
    const emailExists = contacts.some(
      (contact) => contact.email === newContactForm.email && contact.id !== selectedContact.id,
    )
    if (emailExists) {
      setError("A contact with this email already exists")
      return
    }

    // Determine final contact type
    const finalType = newContactForm.type === "other" && customContactType ? customContactType : newContactForm.type

    // Determine final port
    const finalPort = showCustomPortInput ? customPort : newContactForm.associatedPort

    setIsLoading(true)
    setError("")

    try {
      // Prepare update data for API
      const updateData = {
        name: newContactForm.name,
        role: newContactForm.role,
        email: newContactForm.email,
        phone: newContactForm.phone || undefined,
        company: newContactForm.company || undefined,
        location: newContactForm.location,
        contactType: finalType,
        associatedPort: finalPort || undefined,
        notes: newContactForm.notes || undefined,
        emergencyContact: newContactForm.emergencyContact,
        primaryContact: newContactForm.primaryContact,
      }

      // Call API to update contact
      const result = await updateContact(selectedContact.id, updateData)

      // Update the contact in the local state
      const updatedContact = {
        ...result,
        avatar: selectedContact.avatar || generateAvatar(result.name),
        type: result.contactType || finalType,
      }

      setContacts(contacts.map((contact) => (contact.id === selectedContact.id ? updatedContact : contact)))
      setSuccess("Contact updated successfully!")
      setEditContactOpen(false)
      setSelectedContact(null)
      resetForm()
    } catch (err: any) {
      console.error("Error updating contact:", err)
      setError(`Failed to update contact: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }, [selectedContact, newContactForm, customContactType, showCustomPortInput, customPort, contacts, resetForm])

  // Handle delete contact
  const handleDeleteContact = useCallback(
    async (contactId: string) => {
      setIsLoading(true)
      setError("")

      try {
        // Call API to delete contact
        await deleteContact(contactId)

        // Remove contact from local state
        setContacts(contacts.filter((contact) => contact.id !== contactId))
        setSuccess("Contact deleted successfully!")
      } catch (err: any) {
        console.error("Error deleting contact:", err)
        setError(`Failed to delete contact: ${err.message}`)
      } finally {
        setIsLoading(false)
      }
    },
    [contacts],
  )

  // Handle send email
  const handleSendEmail = useCallback(
    (contact: Contact) => {
      const subject = `Vessel ${vessels.find((v) => v.id === selectedVessel)?.name} - Port Operations`
      const body = `Dear ${contact.name},\n\nI hope this email finds you well.\n\n`
      const mailtoUrl = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      window.open(mailtoUrl, "_blank")
    },
    [vessels, selectedVessel],
  )

  // Handle form cancel
  const handleFormCancel = useCallback(() => {
    setAddContactOpen(false)
    setEditContactOpen(false)
    setSelectedContact(null)
    resetForm()
  }, [resetForm])

  const selectedVesselName = vessels.find((v) => v.id === selectedVessel)?.name

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Vessel Contacts</CardTitle>
            <CardDescription>Manage contacts for {selectedVesselName || "selected vessel"}</CardDescription>
          </div>
          <Sheet open={addContactOpen} onOpenChange={setAddContactOpen}>
            <SheetTrigger asChild>
              <Button size="sm" disabled={isLoading || !selectedVessel}>
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[600px] sm:w-[800px] sm:max-w-[90vw] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Add New Contact</SheetTitle>
                <SheetDescription>
                  Add a new contact for {selectedVesselName}. Fill in the required information below.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <ContactForm
                  isEdit={false}
                  newContactForm={newContactForm}
                  setNewContactForm={setNewContactForm}
                  customContactType={customContactType}
                  setCustomContactType={setCustomContactType}
                  showCustomTypeInput={showCustomTypeInput}
                  setShowCustomTypeInput={setShowCustomTypeInput}
                  customPort={customPort}
                  setCustomPort={setCustomPort}
                  showCustomPortInput={showCustomPortInput}
                  setShowCustomPortInput={setShowCustomPortInput}
                  isLoading={isLoading}
                  onSubmit={handleAddContact}
                  onCancel={handleFormCancel}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </CardHeader>
      <CardContent>
        {/* Display errors/success messages */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {selectedVessel ? (
          <div className="space-y-4">
            {isLoading && contacts.length === 0 ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <span className="ml-2 text-lg text-gray-600">Loading contacts...</span>
              </div>
            ) : (
              <>
                {/* View mode tabs */}
                <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "all" | "by-port")}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">All Contacts</TabsTrigger>
                    <TabsTrigger value="by-port">By Port</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all">
                    {/* Search and Filter */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search contacts or ports..."
                          className="pl-8"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                          <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="crew">Crew</SelectItem>
                          <SelectItem value="agent">Port Agents</SelectItem>
                          <SelectItem value="charterer">Charterers</SelectItem>
                          <SelectItem value="owner">Owners</SelectItem>
                          <SelectItem value="surveyor">Surveyors</SelectItem>
                          <SelectItem value="inspector">Inspectors</SelectItem>
                          <SelectItem value="pilot">Pilots</SelectItem>
                          <SelectItem value="port-authority">Port Authority</SelectItem>
                          <SelectItem value="class-surveyor">Class Surveyor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Port filter buttons */}
                    {uniquePorts.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Button
                          variant={filterPort === "all" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setFilterPort("all")}
                        >
                          All Ports
                        </Button>
                        {uniquePorts.map((port) => (
                          <Button
                            key={port}
                            variant={filterPort === port ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilterPort(port)}
                          >
                            {port}
                          </Button>
                        ))}
                      </div>
                    )}

                    {/* Results count */}
                    {(searchTerm || filterType !== "all" || filterPort !== "all") && (
                      <div className="text-sm text-gray-500 mb-4">
                        Showing {filteredContacts.length} of {contacts.length} contacts
                      </div>
                    )}

                    {/* Contacts List */}
                    <div className="grid gap-4">
                      {filteredContacts.map((contact) => (
                        <ContactCard
                          key={contact.id}
                          contact={contact}
                          onSendEmail={handleSendEmail}
                          onEdit={handleEditContact}
                          onDelete={handleDeleteContact}
                          isLoading={isLoading}
                        />
                      ))}
                    </div>

                    {filteredContacts.length === 0 && contacts.length > 0 && (
                      <div className="text-center py-8">
                        <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Contacts Found</h3>
                        <p className="text-gray-500 mb-4">
                          No contacts match your search criteria. Try adjusting your search or filter.
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSearchTerm("")
                            setFilterType("all")
                            setFilterPort("all")
                          }}
                        >
                          Clear Filters
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="by-port">
                    {/* Port-centric view */}
                    <div className="space-y-6">
                      {contactsByPort.map((group) => (
                        <div key={group.port} className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="bg-blue-100 text-blue-800 h-8 w-8 rounded-full flex items-center justify-center">
                              {group.port.substring(0, 2)}
                            </div>
                            <h3 className="text-lg font-medium">{group.port}</h3>
                            <Badge className="ml-2">{group.contacts.length} contacts</Badge>
                          </div>
                          <div className="grid gap-3 pl-10">
                            {group.contacts.map((contact) => (
                              <ContactCard
                                key={contact.id}
                                contact={contact}
                                onSendEmail={handleSendEmail}
                                onEdit={handleEditContact}
                                onDelete={handleDeleteContact}
                                isLoading={isLoading}
                              />
                            ))}
                          </div>
                        </div>
                      ))}

                      {contactsByPort.length === 0 && (
                        <div className="text-center py-8">
                          <Anchor className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No Port Associations</h3>
                          <p className="text-gray-500 mb-4">
                            No contacts have been associated with specific ports yet. Add port associations when
                            creating or editing contacts.
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            )}

            {!isLoading && contacts.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Contacts Found</h3>
                <p className="text-gray-500 mb-4">Add contacts for this vessel to get started.</p>
                <Button onClick={() => setAddContactOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Contact
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Ship className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Vessel</h3>
            <p className="text-gray-500">Choose a vessel to view and manage its contacts.</p>
          </div>
        )}
      </CardContent>

      {/* Edit Contact Sheet */}
      <Sheet open={editContactOpen} onOpenChange={setEditContactOpen}>
        <SheetContent className="w-[600px] sm:w-[800px] sm:max-w-[90vw] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit Contact</SheetTitle>
            <SheetDescription>Update contact information for {selectedContact?.name}.</SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <ContactForm
              isEdit={true}
              newContactForm={newContactForm}
              setNewContactForm={setNewContactForm}
              customContactType={customContactType}
              setCustomContactType={setCustomContactType}
              showCustomTypeInput={showCustomTypeInput}
              setShowCustomTypeInput={setShowCustomTypeInput}
              customPort={customPort}
              setCustomPort={setCustomPort}
              showCustomPortInput={showCustomPortInput}
              setShowCustomPortInput={setShowCustomPortInput}
              isLoading={isLoading}
              onSubmit={handleUpdateContact}
              onCancel={handleFormCancel}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Card>
  )
}
