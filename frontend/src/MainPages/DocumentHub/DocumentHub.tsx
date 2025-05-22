"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

// Define a vessel interface to track the selected vessel
interface SelectedVessel {
  id: string
  name: string
  type: string
  flag: string
  imo: string
}

export default function DocumentHub() {
  // Use the useFetchVessels hook to get vessel data
  const { vessels, isLoading, error, fetchVessels } = useFetchVessels()

  // State for the selected vessel with full details
  const [selectedVessel, setSelectedVessel] = useState<SelectedVessel>({
    id: "1",
    name: "Humble Warrior",
    type: "Crude Oil Tanker",
    flag: "Panama",
    imo: "9876543",
  })

  const [searchQuery, setSearchQuery] = useState("")
  const [singleUploadModalOpen, setSingleUploadModalOpen] = useState(false)
  const [batchUploadModalOpen, setBatchUploadModalOpen] = useState(false)
  const [selectedVesselForUpload, setSelectedVesselForUpload] = useState<string | undefined>(undefined)
  const [selectedDocument, setSelectedDocument] = useState<any>(null)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>(undefined)
  const [viewMode, setViewMode] = useState<"table" | "card">("table")
  const [isDocumentSheetOpen, setIsDocumentSheetOpen] = useState(false)

  // Fetch vessels when the component mounts
  useEffect(() => {
    fetchVessels()
  }, [])

  // Update selected vessel when vessels are loaded
  useEffect(() => {
    if (vessels.length > 0) {
      // Find the vessel with the same name as the currently selected vessel
      const currentVessel = vessels.find((vessel) => vessel.name === selectedVessel.name)

      // If found, update the selected vessel with full details
      if (currentVessel) {
        setSelectedVessel({
          id: currentVessel.id,
          name: currentVessel.name,
          type: currentVessel.type,
          flag: currentVessel.flag,
          imo: currentVessel.imo,
        })
      }
    }
  }, [vessels])

  // Handle vessel selection from the side panel
  const handleVesselSelect = (vesselName: string) => {
    // Find the selected vessel in the vessels array
    const vessel = vessels.find((v) => v.name === vesselName)

    if (vessel) {
      // Update the selected vessel with full details
      setSelectedVessel({
        id: vessel.id,
        name: vessel.name,
        type: vessel.type,
        flag: vessel.flag,
        imo: vessel.imo,
      })
    } else {
      // Fallback to just updating the name if vessel not found
      setSelectedVessel({
        ...selectedVessel,
        name: vesselName,
      })
    }
  }

  // Mock documents data
  const documents = [
    {
      id: "doc-1",
      title: "Safety Management Certificate",
      issuer: "Panama Maritime Authority",
      issueDate: "2023-01-15",
      expiryDate: "2023-11-15",
      status: "expiringSoon",
      daysRemaining: 28,
      certificateNo: "SMC-2023-12345",
      category: "statutory",
    },
    {
      id: "doc-2",
      title: "International Oil Pollution Prevention Certificate",
      issuer: "DNV GL",
      issueDate: "2023-02-10",
      expiryDate: "2023-12-10",
      status: "expiringSoon",
      daysRemaining: 45,
      certificateNo: "IOPP-2023-67890",
      category: "statutory",
    },
    {
      id: "doc-3",
      title: "Certificate of Registry",
      issuer: "Panama Maritime Authority",
      issueDate: "2022-05-20",
      expiryDate: "2024-05-20",
      status: "valid",
      daysRemaining: 365,
      certificateNo: "REG-2022-54321",
      category: "statutory",
    },
    {
      id: "doc-4",
      title: "International Load Line Certificate",
      issuer: "DNV GL",
      issueDate: "2022-06-15",
      expiryDate: "2024-06-15",
      status: "valid",
      daysRemaining: 395,
      certificateNo: "ILL-2022-98765",
      category: "statutory",
    },
    {
      id: "doc-5",
      title: "International Tonnage Certificate",
      issuer: "Panama Maritime Authority",
      issueDate: "2020-08-10",
      expiryDate: "Permanent",
      status: "valid",
      permanent: true,
      certificateNo: "ITC-2020-24680",
      category: "statutory",
    },
    {
      id: "doc-6",
      title: "Minimum Safe Manning Document",
      issuer: "Panama Maritime Authority",
      issueDate: "2022-09-05",
      expiryDate: "2024-09-05",
      status: "valid",
      daysRemaining: 480,
      certificateNo: "MSMD-2022-13579",
      category: "statutory",
    },
  ]

  // Mock document templates data
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
    {
      id: "template-2",
      name: "Rotterdam PSC Inspection",
      description: "Documents for Port State Control inspection in Rotterdam",
      documentCount: 8,
      category: "psc",
      vesselType: "Crude Oil Tanker",
      createdAt: "2025-04-10T14:20:00",
      tags: ["Rotterdam", "PSC", "Inspection"],
    },
    {
      id: "template-3",
      name: "Annual Class Survey",
      description: "Documents required for annual class survey",
      documentCount: 12,
      category: "class",
      createdAt: "2025-03-22T09:15:00",
      tags: ["Class", "Survey", "Annual"],
    },
    {
      id: "template-4",
      name: "SIRE Vetting",
      description: "Complete document set for SIRE vetting inspection",
      documentCount: 15,
      category: "vetting",
      vesselType: "Crude Oil Tanker",
      createdAt: "2025-03-05T11:45:00",
      tags: ["SIRE", "Vetting", "Oil Tanker"],
    },
    {
      id: "template-5",
      name: "US Coast Guard COC",
      description: "Documents for US Coast Guard Certificate of Compliance",
      documentCount: 10,
      category: "port-entry",
      createdAt: "2025-02-18T16:30:00",
      tags: ["USCG", "COC", "US Ports"],
    },
  ]

  // Mock documents data for template creation
  const mockDocuments = [
    {
      id: "smc",
      name: "Safety Management Certificate",
      issuer: "Panama Maritime Authority",
      status: "valid",
      category: "statutory",
    },
    {
      id: "iopp",
      name: "Int'l Oil Pollution Prevention Certificate",
      issuer: "DNV GL",
      status: "expiring-soon",
      category: "statutory",
    },
    {
      id: "registry",
      name: "Certificate of Registry",
      issuer: "Panama Maritime Authority",
      status: "valid",
      category: "statutory",
    },
    {
      id: "loadline",
      name: "International Load Line Certificate",
      issuer: "DNV GL",
      status: "valid",
      category: "statutory",
    },
    {
      id: "tonnage",
      name: "International Tonnage Certificate",
      issuer: "Panama Maritime Authority",
      status: "permanent",
      category: "statutory",
    },
    {
      id: "crew-list",
      name: "Crew List",
      issuer: "Company",
      status: "valid",
      category: "crew",
    },
    {
      id: "ballast-plan",
      name: "Ballast Water Management Plan",
      issuer: "Company",
      status: "valid",
      category: "environmental",
    },
  ]

  // Mock vessel types
  const vesselTypes = ["Crude Oil Tanker", "Product Tanker", "Container Ship", "Bulk Carrier", "LNG Carrier", "Ro-Ro"]

  // Handle upload completion
  const handleUploadComplete = (documentData: any) => {
    console.log("Document uploaded:", documentData)
    // You would update your documents state/cache here
    setSingleUploadModalOpen(false)
    setBatchUploadModalOpen(false)
    // Optionally refresh the document list
  }

  // Helper function to open the appropriate upload modal
  const openUploadModal = (type: "single" | "batch") => {
    setSelectedVesselForUpload(selectedVessel.name)
    if (type === "single") {
      setSingleUploadModalOpen(true)
    } else {
      setBatchUploadModalOpen(true)
    }
  }

  // Handle template selection
  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId)
    console.log("Selected template:", templateId)
  }

  // Handle template creation
  const handleCreateTemplate = (template: Omit<DocumentTemplate, "id" | "createdAt">) => {
    console.log("Creating template:", template)
    // In a real app, you would send this to your API
  }

  // Handle template editing
  const handleEditTemplate = (template: DocumentTemplate) => {
    console.log("Editing template:", template)
    // In a real app, you would update this template via your API
  }

  // Handle template deletion
  const handleDeleteTemplate = (templateId: string) => {
    console.log("Deleting template:", templateId)
    // In a real app, you would delete this template via your API
  }

  // Handle template duplication
  const handleDuplicateTemplate = (templateId: string) => {
    console.log("Duplicating template:", templateId)
    // In a real app, you would duplicate this template via your API
  }

  // Handle document selection
  const handleDocumentSelect = (document: any) => {
    setSelectedDocument({
      title: document.title,
      issuer: document.issuer,
      issueDate: document.issueDate,
      expiryDate: document.expiryDate,
      certificateNo: document.certificateNo,
      status: document.status,
      daysRemaining: document.daysRemaining,
      permanent: document.permanent,
    })
    setIsDocumentSheetOpen(true)
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
      case "expiringSoon":
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
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
           

              {/* Split Button in Main Content */}
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
                  <DocumentStatusBadge status="valid" count={12} />
                  <DocumentStatusBadge status="expiringSoon" count={3} />
                  <DocumentStatusBadge status="expired" count={0} />
                  <DocumentStatusBadge status="missing" count={1} />
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search documents..." className="pl-8 w-64" />
                  </div>
                  {/* Replace the ToggleGroup with this simpler button group */}
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
                    <li className="flex items-center text-sm">
                      <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />
                      <span>Safety Management Certificate expires in 28 days</span>
                      <Button variant="link" size="sm" className="ml-2">
                        Renew Now
                      </Button>
                    </li>
                    <li className="flex items-center text-sm">
                      <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />
                      <span>IOPP Certificate expires in 45 days</span>
                      <Button variant="link" size="sm" className="ml-2">
                        Renew Now
                      </Button>
                    </li>
                    <li className="flex items-center text-sm">
                      <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                      <span>Ship Security Plan needs to be uploaded</span>
                      <Button variant="link" size="sm" className="ml-2" onClick={() => openUploadModal("single")}>
                        Upload
                      </Button>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {viewMode === "card" ? (
                // Card View
                <div className="space-y-4">
                  {documents.map((document) => (
                    <DocumentCard
                      key={document.id}
                      title={document.title}
                      issuer={document.issuer}
                      issueDate={document.issueDate}
                      expiryDate={document.expiryDate}
                      status={document.status}
                      daysRemaining={document.daysRemaining}
                      permanent={document.permanent}
                      onClick={() => handleDocumentSelect(document)}
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
                      {documents.map((document) => (
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
                              {document.issueDate}
                            </div>
                          </TableCell>
                          <TableCell>{document.permanent ? "Permanent" : document.expiryDate}</TableCell>
                          <TableCell>
                            {getStatusBadge(document.status, document.daysRemaining, document.permanent)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-1">
                              <Button size="sm" variant="ghost">
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Download className="h-3.5 w-3.5" />
                              </Button>
                              <Button size="sm" variant="ghost">
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

            {/* Other tab contents would be similar */}
            <TabsContent value="statutory">
              <p>Statutory documents content</p>
            </TabsContent>

            {/* New Templates tab */}
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
      <Sheet open={isDocumentSheetOpen} onOpenChange={setIsDocumentSheetOpen}>
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
                  <img
                    src="/document-preview.png"
                    alt="Document Preview"
                    className="w-full object-contain rounded-md border"
                  />
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
                        <div className="text-sm text-gray-500">Issuer:</div>
                        <div className="text-sm">{selectedDocument.issuer}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-gray-500">Issue Date:</div>
                        <div className="text-sm flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1 text-gray-400" />
                          {selectedDocument.issueDate}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-gray-500">Expiry Date:</div>
                        <div
                          className={`text-sm ${selectedDocument.status === "expiringSoon" ? "text-yellow-600 font-medium" : ""}`}
                        >
                          {selectedDocument.permanent ? (
                            "Permanent"
                          ) : (
                            <div className="flex items-center">
                              <Calendar className="h-3.5 w-3.5 mr-1 text-gray-400" />
                              {selectedDocument.expiryDate}
                              {selectedDocument.daysRemaining && (
                                <span className="ml-1">({selectedDocument.daysRemaining} days)</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-gray-500">Certificate No:</div>
                        <div className="text-sm">{selectedDocument.certificateNo}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-gray-500">Status:</div>
                        <div className="text-sm">
                          {selectedDocument.status === "valid" ? (
                            <span className="inline-flex items-center text-green-700">
                              <CheckCircle className="h-3.5 w-3.5 mr-1" /> Valid
                            </span>
                          ) : selectedDocument.status === "expiringSoon" ? (
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

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Document History</h3>
                    <div className="bg-gray-50 rounded-md p-4 space-y-3">
                      <div className="flex items-start">
                        <div className="h-4 w-4 rounded-full bg-blue-500 mt-1 mr-2"></div>
                        <div>
                          <div className="text-sm font-medium">Document uploaded</div>
                          <div className="text-xs text-gray-500">May 15, 2023 • John Smith</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="h-4 w-4 rounded-full bg-gray-300 mt-1 mr-2"></div>
                        <div>
                          <div className="text-sm font-medium">Document verified</div>
                          <div className="text-xs text-gray-500">May 16, 2023 • System</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="h-4 w-4 rounded-full bg-gray-300 mt-1 mr-2"></div>
                        <div>
                          <div className="text-sm font-medium">Document viewed</div>
                          <div className="text-xs text-gray-500">May 20, 2023 • Sarah Johnson</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-4 border-t">
                    <Button className="flex-1">
                      <Download className="h-4 w-4 mr-2" /> Download
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => openUploadModal("single")}>
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

function DocumentCard({ title, issuer, issueDate, expiryDate, status, daysRemaining, permanent = false, onClick }) {
  const statusConfig = {
    valid: {
      className: "border-l-green-500",
      icon: CheckCircle,
      iconColor: "text-green-500",
      textColor: "text-green-700",
    },
    expiringSoon: {
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
              {permanent ? "Permanent" : status === "expiringSoon" ? `Expires in ${daysRemaining} days` : "Valid"}
            </span>
          </div>
        </div>
        <div className="flex justify-between mt-3">
          <div className="flex space-x-4 text-xs text-gray-500">
            <span>Issued: {issueDate}</span>
            <span>Expires: {permanent ? "N/A" : expiryDate}</span>
          </div>
          <div className="flex space-x-1">
            <Button size="sm" variant="ghost">
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button size="sm" variant="ghost">
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
