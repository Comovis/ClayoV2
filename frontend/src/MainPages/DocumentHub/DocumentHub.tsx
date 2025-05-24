"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import {
  Search,
  Upload,
  AlertTriangle,
  Share2,
  CheckCircle,
  Clock,
  AlertCircle,
  Filter,
  Download,
  Plus,
  Eye,
  ChevronDown,
  X,
  LayoutGrid,
  List,
  FileText,
  Calendar,
  ExternalLink,
  RefreshCw,
  Loader2,
  Scale,
  Building2,
  Users,
  Briefcase,
  SearchIcon,
  CalendarDays,
  ShieldAlert,
  ClipboardList,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet"
import DocumentUploadModal from "../../MainComponents/UploadModal/UploadModal"
import BatchUploadModal from "../../MainComponents/UploadModal/BulkUpload"
import {
  DocumentTemplates,
  type DocumentTemplate,
} from "../../MainComponents/DocumentTemplates/DocumentTemplatesModule"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { MyFleet } from "../../MainComponents/VesselSelector/VesselSelectorSidePanel"
import { useFetchVessels } from "../../Hooks/useFetchVessels"
import { useDocuments } from "../../Hooks/useDocuments"
import { useDocumentPreview } from "../../Hooks/useDocumentPreview"
import PDFViewer from "../../MainComponents/UploadModal/PDFViewer"

// Define a vessel interface to track the selected vessel
interface SelectedVessel {
  id: string
  name: string
  type: string
  flag: string
  imo: string
}

export default function DocumentHub() {
  // Use the hooks
  const { vessels, isLoading: isVesselsLoading, error: vesselsError, fetchVessels } = useFetchVessels()
  const {
    documents,
    isLoading: isDocumentsLoading,
    error: documentsError,
    success: documentsSuccess,
    fetchDocuments,
    downloadDocument,
    batchDownload,
    archiveDocument,
    clearMessages,
  } = useDocuments()
  const { generatePreviewUrl, previewUrl, clearPreview } = useDocumentPreview()

  // State for the selected vessel with full details - START WITH NULL
  const [selectedVessel, setSelectedVessel] = useState<SelectedVessel | null>(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [singleUploadModalOpen, setSingleUploadModalOpen] = useState(false)
  const [batchUploadModalOpen, setBatchUploadModalOpen] = useState(false)
  const [selectedVesselForUpload, setSelectedVesselForUpload] = useState<string | undefined>(undefined)
  const [selectedDocument, setSelectedDocument] = useState<any>(null)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>(undefined)
  const [viewMode, setViewMode] = useState<"table" | "card">("table")
  const [isDocumentSheetOpen, setIsDocumentSheetOpen] = useState(false)
  const [isPreviewLoading, setIsPreviewLoading] = useState(false)

  // Filter state
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState({
    status: [],
    documentType: [],
    issuer: [],
    dateRange: null,
    expiryRange: null,
    category: [],
    permanent: null,
  })

  // Fetch vessels when the component mounts
  useEffect(() => {
    fetchVessels()
  }, [])

  // Set the first vessel as default when vessels are loaded
  useEffect(() => {
    if (vessels.length > 0 && !selectedVessel) {
      // Set the first vessel as default
      const firstVessel = vessels[0]
      setSelectedVessel({
        id: firstVessel.id,
        name: firstVessel.name,
        type: firstVessel.type,
        flag: firstVessel.flag,
        imo: firstVessel.imo,
      })
    }
  }, [vessels, selectedVessel])

  // Fetch documents when vessel changes (only if we have a valid vessel with UUID)
  useEffect(() => {
    if (selectedVessel?.id && selectedVessel.id.length > 10) {
      // Only fetch if we have what looks like a UUID (more than 10 characters)
      fetchDocuments(selectedVessel.id)
    }
  }, [selectedVessel?.id, fetchDocuments])

  // Clear messages after 5 seconds
  useEffect(() => {
    if (documentsError || documentsSuccess) {
      const timer = setTimeout(() => {
        clearMessages()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [documentsError, documentsSuccess, clearMessages])

  // Handle vessel selection from the side panel
  const handleVesselSelect = (vesselName: string) => {
    console.log("Selecting vessel:", vesselName)

    // Find the selected vessel in the vessels array
    const vessel = vessels.find((v) => v.name === vesselName)

    if (vessel) {
      console.log("Found vessel:", vessel)
      // Update the selected vessel with full details
      setSelectedVessel({
        id: vessel.id,
        name: vessel.name,
        type: vessel.type,
        flag: vessel.flag,
        imo: vessel.imo,
      })
    } else {
      console.warn("Vessel not found in vessels array:", vesselName)
    }
  }

  // Handle upload completion
  const handleUploadComplete = (documentData: any) => {
    console.log("Document uploaded:", documentData)
    setSingleUploadModalOpen(false)
    setBatchUploadModalOpen(false)
    // Refresh the document list
    if (selectedVessel?.id) {
      fetchDocuments(selectedVessel.id)
    }
  }

  // Helper function to open the appropriate upload modal
  const openUploadModal = (type: "single" | "batch") => {
    setSelectedVesselForUpload(selectedVessel?.id)
    if (type === "single") {
      setSingleUploadModalOpen(true)
    } else {
      setBatchUploadModalOpen(true)
    }
  }

  // Handle document selection and preview
  const handleDocumentSelect = async (document: any) => {
    setSelectedDocument(document)
    setIsDocumentSheetOpen(true)
    setIsPreviewLoading(true)

    // Generate preview URL if document has a file path
    if (document.file_path) {
      try {
        await generatePreviewUrl(document.file_path)
      } catch (error) {
        console.error("Error generating preview:", error)
      } finally {
        setIsPreviewLoading(false)
      }
    } else {
      setIsPreviewLoading(false)
    }
  }

  // Handle document download
  const handleDocumentDownload = async (documentId: string) => {
    const downloadUrl = await downloadDocument(documentId)
    if (downloadUrl) {
      // Open download URL in new tab
      window.open(downloadUrl, "_blank")
    }
  }

  // Handle document archive
  const handleDocumentArchive = async (documentId: string) => {
    const success = await archiveDocument(documentId)
    if (success) {
      // Document will be removed from the list automatically by the hook
    }
  }

  // Get status badge for table view
  const getStatusBadge = (status: string, daysRemaining?: number, permanent?: boolean) => {
    if (permanent) {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Permanent
        </Badge>
      )
    }

    switch (status) {
      case "valid":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Valid
          </Badge>
        )
      case "expiring_soon":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Expires in {daysRemaining} days
          </Badge>
        )
      case "expired":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Expired
          </Badge>
        )
      case "missing":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
            Missing
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  // Filter functions
  const clearAllFilters = () => {
    setActiveFilters({
      status: [],
      documentType: [],
      issuer: [],
      dateRange: null,
      expiryRange: null,
      category: [],
      permanent: null,
    })
  }

  const getFilteredDocuments = () => {
    return documents.filter((doc) => {
      // Search query filter
      const matchesSearch =
        !searchQuery ||
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.document_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.issuer?.toLowerCase().includes(searchQuery.toLowerCase())

      // Status filter
      const matchesStatus = activeFilters.status.length === 0 || activeFilters.status.includes(doc.status)

      // Document type filter
      const matchesDocType =
        activeFilters.documentType.length === 0 || activeFilters.documentType.includes(doc.document_type)

      // Issuer filter
      const matchesIssuer = activeFilters.issuer.length === 0 || activeFilters.issuer.includes(doc.issuer)

      // Category filter (based on tabs)
      const matchesCategory = activeFilters.category.length === 0 || activeFilters.category.includes(doc.category)

      // Permanent filter
      const matchesPermanent = activeFilters.permanent === null || doc.is_permanent === activeFilters.permanent

      // Date range filters
      const matchesIssueDate =
        !activeFilters.dateRange ||
        (new Date(doc.issue_date) >= activeFilters.dateRange.from &&
          new Date(doc.issue_date) <= activeFilters.dateRange.to)

      const matchesExpiryDate =
        !activeFilters.expiryRange ||
        doc.is_permanent ||
        (new Date(doc.expiry_date) >= activeFilters.expiryRange.from &&
          new Date(doc.expiry_date) <= activeFilters.expiryRange.to)

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDocType &&
        matchesIssuer &&
        matchesCategory &&
        matchesPermanent &&
        matchesIssueDate &&
        matchesExpiryDate
      )
    })
  }

  // Get unique values for filter options
  const getUniqueDocumentTypes = () => [...new Set(documents.map((doc) => doc.document_type).filter(Boolean))]
  const getUniqueIssuers = () => [...new Set(documents.map((doc) => doc.issuer).filter(Boolean))]
  const getActiveFilterCount = () => {
    return (
      activeFilters.status.length +
      activeFilters.documentType.length +
      activeFilters.issuer.length +
      activeFilters.category.length +
      (activeFilters.dateRange ? 1 : 0) +
      (activeFilters.expiryRange ? 1 : 0) +
      (activeFilters.permanent !== null ? 1 : 0)
    )
  }

  // Calculate document status counts
  const documentCounts = {
    valid: documents.filter((doc) => doc.status === "valid").length,
    expiring_soon: documents.filter((doc) => doc.status === "expiring_soon").length,
    expired: documents.filter((doc) => doc.status === "expired").length,
    missing: documents.filter((doc) => doc.status === "missing").length,
  }

  // Mock document templates data (keep existing)
  const documentTemplates: DocumentTemplate[] = [
    {
      id: "template-1",
      name: "Singapore Port Entry",
      description: "Standard documents required for Singapore port entry",
      documentCount: 5,
      category: "port-entry",
      createdAt: "2025-04-15T10:30:00",
      tags: ["Singapore", "Port Entry", "Standard"],
      isDefault: true,
    },
    // ... other templates
  ]

  const mockDocuments = [
    {
      id: "smc",
      name: "Safety Management Certificate",
      issuer: "Panama Maritime Authority",
      status: "valid",
      category: "statutory",
    },
    // ... other mock documents for templates
  ]

  const vesselTypes = ["Crude Oil Tanker", "Product Tanker", "Container Ship", "Bulk Carrier", "LNG Carrier", "Ro-Ro"]

  // Handle template functions (keep existing)
  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId)
    console.log("Selected template:", templateId)
  }

  const handleCreateTemplate = (template: Omit<DocumentTemplate, "id" | "createdAt">) => {
    console.log("Creating template:", template)
  }

  const handleEditTemplate = (template: DocumentTemplate) => {
    console.log("Editing template:", template)
  }

  const handleDeleteTemplate = (templateId: string) => {
    console.log("Deleting template:", templateId)
  }

  const handleDuplicateTemplate = (templateId: string) => {
    console.log("Duplicating template:", templateId)
  }

  // Show loading state while vessels are loading or no vessel is selected
  if (isVesselsLoading || !selectedVessel) {
    return (
      <div className="flex flex-col h-screen">
        <div className="flex flex-1 overflow-hidden">
          <MyFleet
            activeVessel={selectedVessel?.name || ""}
            onVesselSelect={handleVesselSelect}
            onUploadClick={openUploadModal}
          />
          <main className="flex-1 overflow-auto p-6">
            <div className="flex justify-center items-center h-full">
              <div className="text-center">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">
                  {isVesselsLoading ? "Loading vessel data..." : "Please select a vessel from the sidebar"}
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - using MyFleet component with useFetchVessels hook */}
        <MyFleet
          activeVessel={selectedVessel.name}
          onVesselSelect={handleVesselSelect}
          onUploadClick={openUploadModal}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">{selectedVessel.name}</h1>
              <p className="text-gray-500">
                {selectedVessel.type} • {selectedVessel.flag} • IMO: {selectedVessel.imo}
              </p>
              <p className="text-xs text-gray-400 mt-1">Vessel ID: {selectedVessel.id}</p>
            </div>
            <div className="flex space-x-2">
              <DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="relative">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                    {getActiveFilterCount() > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-blue-500 text-white"
                      >
                        {getActiveFilterCount()}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 p-0">
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm">Filter Documents</h3>
                      {getActiveFilterCount() > 0 && (
                        <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                          Clear All
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                    {/* Status Filter */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Status</Label>
                      <div className="space-y-2">
                        {[
                          { value: "valid", label: "Valid", color: "text-green-600" },
                          { value: "expiring_soon", label: "Expiring Soon", color: "text-yellow-600" },
                          { value: "expired", label: "Expired", color: "text-red-600" },
                          { value: "missing", label: "Missing", color: "text-gray-600" },
                        ].map((status) => (
                          <div key={status.value} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`status-${status.value}`}
                              checked={activeFilters.status.includes(status.value)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setActiveFilters((prev) => ({
                                    ...prev,
                                    status: [...prev.status, status.value],
                                  }))
                                } else {
                                  setActiveFilters((prev) => ({
                                    ...prev,
                                    status: prev.status.filter((s) => s !== status.value),
                                  }))
                                }
                              }}
                              className="rounded border-gray-300"
                            />
                            <label htmlFor={`status-${status.value}`} className={`text-sm ${status.color}`}>
                              {status.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Document Type Filter */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Document Type</Label>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {getUniqueDocumentTypes().map((type) => (
                          <div key={type} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`type-${type}`}
                              checked={activeFilters.documentType.includes(type)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setActiveFilters((prev) => ({
                                    ...prev,
                                    documentType: [...prev.documentType, type],
                                  }))
                                } else {
                                  setActiveFilters((prev) => ({
                                    ...prev,
                                    documentType: prev.documentType.filter((t) => t !== type),
                                  }))
                                }
                              }}
                              className="rounded border-gray-300"
                            />
                            <label htmlFor={`type-${type}`} className="text-sm text-gray-700 truncate">
                              {type}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Category Filter */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Category</Label>
                      <div className="space-y-2">
                        {[
                          { value: "statutory", label: "Statutory", icon: Scale },
                          { value: "class", label: "Classification", icon: Building2 },
                          { value: "crew", label: "Crew", icon: Users },
                          { value: "commercial", label: "Commercial", icon: Briefcase },
                          { value: "inspection", label: "Inspection", icon: SearchIcon },
                        ].map((category) => {
                          const IconComponent = category.icon
                          return (
                            <div key={category.value} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`category-${category.value}`}
                                checked={activeFilters.category.includes(category.value)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setActiveFilters((prev) => ({
                                      ...prev,
                                      category: [...prev.category, category.value],
                                    }))
                                  } else {
                                    setActiveFilters((prev) => ({
                                      ...prev,
                                      category: prev.category.filter((c) => c !== category.value),
                                    }))
                                  }
                                }}
                                className="rounded border-gray-300"
                              />
                              <label
                                htmlFor={`category-${category.value}`}
                                className="text-sm text-gray-700 flex items-center"
                              >
                                <IconComponent className="h-4 w-4 mr-2 text-gray-500" />
                                {category.label}
                              </label>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Issuing Authority Filter */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Issuing Authority</Label>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {getUniqueIssuers()
                          .slice(0, 10)
                          .map((issuer) => (
                            <div key={issuer} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`issuer-${issuer}`}
                                checked={activeFilters.issuer.includes(issuer)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setActiveFilters((prev) => ({
                                      ...prev,
                                      issuer: [...prev.issuer, issuer],
                                    }))
                                  } else {
                                    setActiveFilters((prev) => ({
                                      ...prev,
                                      issuer: prev.issuer.filter((i) => i !== issuer),
                                    }))
                                  }
                                }}
                                className="rounded border-gray-300"
                              />
                              <label htmlFor={`issuer-${issuer}`} className="text-sm text-gray-700 truncate">
                                {issuer}
                              </label>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Expiry Type Filter */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Expiry Type</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="permanent-all"
                            name="permanent"
                            checked={activeFilters.permanent === null}
                            onChange={() => setActiveFilters((prev) => ({ ...prev, permanent: null }))}
                            className="rounded border-gray-300"
                          />
                          <label htmlFor="permanent-all" className="text-sm text-gray-700">
                            All Documents
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="permanent-yes"
                            name="permanent"
                            checked={activeFilters.permanent === true}
                            onChange={() => setActiveFilters((prev) => ({ ...prev, permanent: true }))}
                            className="rounded border-gray-300"
                          />
                          <label htmlFor="permanent-yes" className="text-sm text-gray-700">
                            Permanent Only
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="permanent-no"
                            name="permanent"
                            checked={activeFilters.permanent === false}
                            onChange={() => setActiveFilters((prev) => ({ ...prev, permanent: false }))}
                            className="rounded border-gray-300"
                          />
                          <label htmlFor="permanent-no" className="text-sm text-gray-700">
                            With Expiry Date
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Quick Date Filters */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Quick Filters</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const thirtyDaysFromNow = new Date()
                            thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
                            setActiveFilters((prev) => ({
                              ...prev,
                              status: ["expiring_soon"],
                              expiryRange: {
                                from: new Date(),
                                to: thirtyDaysFromNow,
                              },
                            }))
                          }}
                          className="text-xs"
                        >
                          <CalendarDays className="h-3 w-3 mr-1" />
                          Expiring Soon
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setActiveFilters((prev) => ({
                              ...prev,
                              status: ["expired"],
                            }))
                          }}
                          className="text-xs"
                        >
                          <ShieldAlert className="h-3 w-3 mr-1" />
                          Expired
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const lastMonth = new Date()
                            lastMonth.setMonth(lastMonth.getMonth() - 1)
                            setActiveFilters((prev) => ({
                              ...prev,
                              dateRange: {
                                from: lastMonth,
                                to: new Date(),
                              },
                            }))
                          }}
                          className="text-xs"
                        >
                          <ClipboardList className="h-3 w-3 mr-1" />
                          Recent
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setActiveFilters((prev) => ({
                              ...prev,
                              category: ["statutory"],
                            }))
                          }}
                          className="text-xs"
                        >
                          <Scale className="h-3 w-3 mr-1" />
                          Statutory
                        </Button>
                      </div>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchDocuments(selectedVessel.id)}
                disabled={isDocumentsLoading}
              >
                {isDocumentsLoading ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Refresh
              </Button>

              {/* Split Button for Upload */}
              <div className="flex">
                <Button size="sm" className="rounded-r-none" onClick={() => openUploadModal("single")}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" className="rounded-l-none border-l border-primary/20 px-2">
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openUploadModal("single")}>
                      Single Document Upload
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openUploadModal("batch")}>Batch Upload</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Error and Success Messages */}
          {documentsError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{documentsError}</AlertDescription>
            </Alert>
          )}

          {documentsSuccess && (
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{documentsSuccess}</AlertDescription>
            </Alert>
          )}

          {vesselsError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{vesselsError}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Documents</TabsTrigger>
              <TabsTrigger value="statutory">Statutory</TabsTrigger>
              <TabsTrigger value="class">Classification</TabsTrigger>
              <TabsTrigger value="crew">Crew</TabsTrigger>
              <TabsTrigger value="commercial">Commercial</TabsTrigger>
              <TabsTrigger value="inspection">Inspection Reports</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-4">
                  <DocumentStatusBadge status="valid" count={documentCounts.valid} />
                  <DocumentStatusBadge status="expiringSoon" count={documentCounts.expiring_soon} />
                  <DocumentStatusBadge status="expired" count={documentCounts.expired} />
                  <DocumentStatusBadge status="missing" count={documentCounts.missing} />
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search documents..."
                      className="pl-8 w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex rounded-md overflow-hidden border">
                    <Button
                      variant={viewMode === "table" ? "default" : "ghost"}
                      className={`h-9 px-3 rounded-none ${viewMode === "table" ? "bg-black text-white hover:bg-black/90" : "bg-white text-gray-700 hover:bg-gray-100"}`}
                      onClick={() => setViewMode("table")}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "card" ? "default" : "ghost"}
                      className={`h-9 px-3 rounded-none border-l ${viewMode === "card" ? "bg-black text-white hover:bg-black/90" : "bg-white text-gray-700 hover:bg-gray-100"}`}
                      onClick={() => setViewMode("card")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Attention Required Card - only show if there are expiring/expired documents */}
              {(documentCounts.expiring_soon > 0 || documentCounts.expired > 0) && (
                <Card className="mb-6 border-l-4 border-l-yellow-400">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg font-medium">Attention Required</CardTitle>
                      <Button variant="ghost" size="sm">
                        Dismiss
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {documents
                        .filter((doc) => doc.status === "expiring_soon" || doc.status === "expired")
                        .slice(0, 3) // Show only first 3
                        .map((doc) => (
                          <li key={doc.id} className="flex items-center text-sm">
                            <AlertCircle
                              className={`h-4 w-4 mr-2 ${doc.status === "expired" ? "text-red-500" : "text-yellow-500"}`}
                            />
                            <span>
                              {doc.title} {doc.status === "expired" ? "has expired" : "expires soon"}
                            </span>
                            <Button variant="link" size="sm" className="ml-2">
                              {doc.status === "expired" ? "Renew Now" : "Renew Now"}
                            </Button>
                          </li>
                        ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {isDocumentsLoading ? (
                <div className="flex justify-center items-center p-8">
                  <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                  <span className="ml-2">Loading documents...</span>
                </div>
              ) : documents.length === 0 ? (
                <Card className="p-8 text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">No documents found</h3>
                  <p className="text-gray-500 mb-4">Start by uploading your first document for this vessel.</p>
                  <Button onClick={() => openUploadModal("single")}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Document
                  </Button>
                </Card>
              ) : viewMode === "card" ? (
                // Card View
                <div className="space-y-4">
                  {getFilteredDocuments().map((document) => (
                    <DocumentCard
                      key={document.id}
                      title={document.title}
                      issuer={document.issuer}
                      issueDate={document.issue_date}
                      expiryDate={document.expiry_date}
                      status={document.status}
                      permanent={document.is_permanent}
                      onClick={() => handleDocumentSelect(document)}
                      onDownload={() => handleDocumentDownload(document.id)}
                      onArchive={() => handleDocumentArchive(document.id)}
                    />
                  ))}
                </div>
              ) : (
                // Table View
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[300px]">Document</TableHead>
                        <TableHead>Issuer</TableHead>
                        <TableHead>Issue Date</TableHead>
                        <TableHead>Expiry Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getFilteredDocuments().map((document) => (
                        <TableRow
                          key={document.id}
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => handleDocumentSelect(document)}
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-gray-400" />
                              {document.title}
                            </div>
                          </TableCell>
                          <TableCell>{document.issuer}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                              {new Date(document.issue_date).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            {document.is_permanent ? "Permanent" : new Date(document.expiry_date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{getStatusBadge(document.status, undefined, document.is_permanent)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDocumentSelect(document)
                                }}
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDocumentDownload(document.id)
                                }}
                              >
                                <Download className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  openUploadModal("single")
                                }}
                              >
                                <Upload className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              )}
            </TabsContent>

            {/* Templates tab (keep existing) */}
            <TabsContent value="templates">
              <div className="bg-white rounded-lg border shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Document Templates</h2>
                  <div className="flex items-center gap-4">
                    <div className="relative w-64">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                      <Input placeholder="Search templates..." className="pl-8" />
                    </div>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Template
                    </Button>
                  </div>
                </div>

                <DocumentTemplates
                  templates={documentTemplates}
                  showCreateButton={false}
                  onSelectTemplate={handleSelectTemplate}
                  onCreateTemplate={handleCreateTemplate}
                  onEditTemplate={handleEditTemplate}
                  onDeleteTemplate={handleDeleteTemplate}
                  onDuplicateTemplate={handleDuplicateTemplate}
                  selectedTemplateId={selectedTemplateId}
                  documents={mockDocuments}
                  vesselTypes={vesselTypes}
                />
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Document Detail Sheet */}
      <Sheet
        open={isDocumentSheetOpen}
        onOpenChange={(open) => {
          setIsDocumentSheetOpen(open)
          if (!open) {
            clearPreview()
            setSelectedDocument(null)
            setIsPreviewLoading(false)
          }
        }}
      >
        <SheetContent
          side="right"
          className="w-full sm:max-w-md md:max-w-lg overflow-auto p-0"
          overlayClassName="bg-black/60"
        >
          {selectedDocument && (
            <div className="overflow-auto h-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">{selectedDocument.title}</h2>
                  <SheetClose asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                      <X className="h-4 w-4" />
                    </Button>
                  </SheetClose>
                </div>

                <div className="mb-6">
                  {isPreviewLoading ? (
                    <div className="w-full h-64 bg-gray-100 rounded-md border flex items-center justify-center">
                      <div className="text-center">
                        <Loader2 className="h-8 w-8 mx-auto mb-2 text-blue-500 animate-spin" />
                        <p className="text-gray-500 text-sm">Loading document preview...</p>
                      </div>
                    </div>
                  ) : previewUrl ? (
                    // Check if the document is a PDF based on file extension or MIME type
                    selectedDocument?.file_path?.toLowerCase().endsWith(".pdf") ||
                    selectedDocument?.mime_type === "application/pdf" ? (
                      <PDFViewer
                        fileUrl={previewUrl}
                        fileName={selectedDocument?.title || "document.pdf"}
                        className="w-full"
                      />
                    ) : (
                      <img
                        src={previewUrl || "/placeholder.svg"}
                        alt="Document Preview"
                        className="w-full object-contain rounded-md border max-h-96"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          e.currentTarget.src = "/placeholder.svg?height=400&width=300&text=Document+Preview"
                        }}
                      />
                    )
                  ) : (
                    <div className="w-full h-64 bg-gray-100 rounded-md border flex items-center justify-center">
                      <div className="text-center">
                        <FileText className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                        <p className="text-gray-500">Document Preview</p>
                        <p className="text-gray-400 text-sm mt-1">
                          {selectedDocument?.file_path?.toLowerCase().endsWith(".pdf")
                            ? "PDF document ready for viewing"
                            : "Click to load preview"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Document Information</h3>
                    <div className="bg-gray-50 rounded-md p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-gray-500">Title:</div>
                        <div className="text-sm font-medium">{selectedDocument.title}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-gray-500">Type:</div>
                        <div className="text-sm">{selectedDocument.document_type}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-gray-500">Issuer:</div>
                        <div className="text-sm">{selectedDocument.issuer}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-gray-500">Issue Date:</div>
                        <div className="text-sm flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1 text-gray-400" />
                          {new Date(selectedDocument.issue_date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-gray-500">Expiry Date:</div>
                        <div className="text-sm">
                          {selectedDocument.is_permanent ? (
                            "Permanent"
                          ) : (
                            <div className="flex items-center">
                              <Calendar className="h-3.5 w-3.5 mr-1 text-gray-400" />
                              {new Date(selectedDocument.expiry_date).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                      {selectedDocument.certificate_number && (
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-sm text-gray-500">Certificate No:</div>
                          <div className="text-sm">{selectedDocument.certificate_number}</div>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-gray-500">Status:</div>
                        <div className="text-sm">
                          {selectedDocument.status === "valid" ? (
                            <span className="inline-flex items-center text-green-700">
                              <CheckCircle className="h-3.5 w-3.5 mr-1" /> Valid
                            </span>
                          ) : selectedDocument.status === "expiring_soon" ? (
                            <span className="inline-flex items-center text-yellow-700">
                              <Clock className="h-3.5 w-3.5 mr-1" /> Expiring Soon
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-red-700">
                              <AlertCircle className="h-3.5 w-3.5 mr-1" /> Expired
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Deficiency Check</h3>
                    <div className="p-3 bg-green-50 border border-green-100 rounded-md flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm text-green-700">No deficiencies detected</span>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-4 border-t">
                    <Button className="flex-1" onClick={() => handleDocumentDownload(selectedDocument.id)}>
                      <Download className="h-4 w-4 mr-2" /> Download
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setIsDocumentSheetOpen(false)
                        openUploadModal("single")
                      }}
                    >
                      <Upload className="h-4 w-4 mr-2" /> Update
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="text-xs text-gray-500 flex items-center justify-center mt-2">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    <span>View full document details</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Document Upload Modals */}
      <DocumentUploadModal
        isOpen={singleUploadModalOpen}
        onClose={() => setSingleUploadModalOpen(false)}
        initialVesselId={selectedVesselForUpload}
        onUploadComplete={handleUploadComplete}
      />

      <BatchUploadModal
        isOpen={batchUploadModalOpen}
        onClose={() => setBatchUploadModalOpen(false)}
        initialVesselId={selectedVesselForUpload}
        onUploadComplete={handleUploadComplete}
      />
    </div>
  )
}

// Helper components (keep existing but update props)
function DocumentStatusBadge({ status, count }) {
  const statusConfig = {
    valid: {
      label: "Valid",
      icon: CheckCircle,
      className: "bg-green-50 text-green-700 border-green-200",
    },
    expiringSoon: {
      label: "Expiring Soon",
      icon: Clock,
      className: "bg-yellow-50 text-yellow-700 border-yellow-200",
    },
    expired: {
      label: "Expired",
      icon: AlertCircle,
      className: "bg-red-50 text-red-700 border-red-200",
    },
    missing: {
      label: "Missing",
      icon: AlertTriangle,
      className: "bg-gray-100 text-gray-700 border-gray-200",
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div className={`flex items-center px-3 py-1 rounded-md border ${config.className}`}>
      <Icon className="h-4 w-4 mr-1" />
      <span className="font-medium">{count}</span>
      <span className="ml-1">{config.label}</span>
    </div>
  )
}

function DocumentCard({
  title,
  issuer,
  issueDate,
  expiryDate,
  status,
  permanent = false,
  onClick,
  onDownload,
  onArchive,
}) {
  const statusConfig = {
    valid: {
      className: "border-l-green-500",
      icon: CheckCircle,
      iconColor: "text-green-500",
      textColor: "text-green-700",
    },
    expiring_soon: {
      className: "border-l-yellow-500",
      icon: Clock,
      iconColor: "text-yellow-500",
      textColor: "text-yellow-700",
    },
    expired: {
      className: "border-l-red-500",
      icon: AlertCircle,
      iconColor: "text-red-500",
      textColor: "text-red-700",
    },
    missing: {
      className: "border-l-gray-400",
      icon: AlertTriangle,
      iconColor: "text-gray-400",
      textColor: "text-gray-700",
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Card
      className={`mb-3 border-l-4 ${config.className} cursor-pointer hover:shadow-md transition-shadow`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between">
          <div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-gray-500">{issuer}</p>
          </div>
          <div className="flex items-center">
            <Icon className={`h-4 w-4 mr-1 ${config.iconColor}`} />
            <span className={`text-sm font-medium ${config.textColor}`}>
              {permanent ? "Permanent" : status === "expiring_soon" ? "Expiring Soon" : "Valid"}
            </span>
          </div>
        </div>
        <div className="flex justify-between mt-3">
          <div className="flex space-x-4 text-xs text-gray-500">
            <span>Issued: {new Date(issueDate).toLocaleDateString()}</span>
            <span>Expires: {permanent ? "N/A" : new Date(expiryDate).toLocaleDateString()}</span>
          </div>
          <div className="flex space-x-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation()
                onClick()
              }}
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation()
                onDownload()
              }}
            >
              <Download className="h-3.5 w-3.5" />
            </Button>
            <Button size="sm" variant="ghost">
              <Share2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
