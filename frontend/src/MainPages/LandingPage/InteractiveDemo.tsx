"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Ship,
  FileText,
  MapPin,
  Share2,
  CheckCircle,
  Clock,
  AlertCircle,
  AlertTriangle,
  Eye,
  Download,
  Calendar,
  Upload,
  ArrowRight,
  Search,
  Filter,
  Plus,
  Users,
  Shield,
  Mail,
  Copy,
  Info,
  ChevronDown,
  List,
  LayoutGrid,
  SlidersHorizontal,
} from "lucide-react"

export default function InteractiveDemo() {
  const [activeDemo, setActiveDemo] = useState("document-hub")
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [documentViewOpen, setDocumentViewOpen] = useState(false)
  const [viewMode, setViewMode] = useState("list")
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [shareStatus, setShareStatus] = useState(null)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [teamMemberModalOpen, setTeamMemberModalOpen] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const uploadProgressRef = useRef(null)

  // Simulate upload progress
  useEffect(() => {
    if (uploadModalOpen && uploadProgress < 100) {
      uploadProgressRef.current = setTimeout(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 100))
      }, 300)
    }

    if (uploadProgress === 100) {
      setTimeout(() => {
        setUploadModalOpen(false)
        setUploadProgress(0)
        setShowSuccessMessage(true)
        setTimeout(() => setShowSuccessMessage(false), 3000)
      }, 500)
    }

    return () => {
      if (uploadProgressRef.current) {
        clearTimeout(uploadProgressRef.current)
      }
    }
  }, [uploadModalOpen, uploadProgress])

  // Simulate share process
  const handleShare = () => {
    setShareStatus("processing")
    setTimeout(() => {
      setShareStatus("complete")
    }, 1500)
  }

  const handleDocumentView = (doc) => {
    setSelectedDocument(doc)
    setDocumentViewOpen(true)
  }

  return (
    <section id="demo" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            className="inline-block text-sm font-semibold text-slate-500 tracking-wider uppercase mb-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            INTERACTIVE DEMO
          </motion.span>

          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            See Comovis in Action
          </motion.h2>

          <motion.p
            className="text-xl text-slate-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Explore our interactive demo to see how Comovis can transform your maritime compliance operations.
          </motion.p>
        </div>

        <Tabs value={activeDemo} onValueChange={setActiveDemo} className="w-full">
          <TabsList className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-transparent h-auto p-0 mb-8">
            <TabButton
              value="document-hub"
              activeValue={activeDemo}
              icon={<FileText className="h-5 w-5" />}
              title="Document Hub"
              description="Centralized document management"
            />
            <TabButton
              value="port-prep"
              activeValue={activeDemo}
              icon={<MapPin className="h-5 w-5" />}
              title="Port Preparation"
              description="Port-specific requirements"
            />
            <TabButton
              value="document-sharing"
              activeValue={activeDemo}
              icon={<Share2 className="h-5 w-5" />}
              title="Document Sharing"
              description="Secure sharing with stakeholders"
            />
            <TabButton
              value="fleet-management"
              activeValue={activeDemo}
              icon={<Ship className="h-5 w-5" />}
              title="Fleet Management"
              description="Fleet-wide compliance overview"
            />
            <TabButton
              value="team-management"
              activeValue={activeDemo}
              icon={<Users className="h-5 w-5" />}
              title="Team Management"
              description="Roles and permissions"
            />
          </TabsList>

          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 shadow-sm">
            <TabsContent value="document-hub" className="m-0">
              <DocumentHubDemo
                onUploadClick={() => setUploadModalOpen(true)}
                onDocumentView={handleDocumentView}
                viewMode={viewMode}
                setViewMode={setViewMode}
                showSuccessMessage={showSuccessMessage}
              />
            </TabsContent>

            <TabsContent value="port-prep" className="m-0">
              <PortPrepDemo onUploadClick={() => setUploadModalOpen(true)} />
            </TabsContent>

            <TabsContent value="document-sharing" className="m-0">
              <DocumentSharingDemo
                onShareClick={() => setShareModalOpen(true)}
                shareStatus={shareStatus}
                handleShare={handleShare}
                setShareStatus={setShareStatus}
              />
            </TabsContent>

            <TabsContent value="fleet-management" className="m-0">
              <FleetManagementDemo />
            </TabsContent>

            <TabsContent value="team-management" className="m-0">
              <TeamManagementDemo onAddMemberClick={() => setTeamMemberModalOpen(true)} />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Document Upload Modal */}
      <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>Upload a new document to the Humble Warrior vessel</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="document-type">Document Type</Label>
              <Select defaultValue="smc">
                <SelectTrigger id="document-type">
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="smc">Safety Management Certificate</SelectItem>
                  <SelectItem value="iopp">Int'l Oil Pollution Prevention Certificate</SelectItem>
                  <SelectItem value="registry">Certificate of Registry</SelectItem>
                  <SelectItem value="loadline">International Load Line Certificate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="issuer">Issuer</Label>
              <Select defaultValue="panama">
                <SelectTrigger id="issuer">
                  <SelectValue placeholder="Select issuer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="panama">Panama Maritime Authority</SelectItem>
                  <SelectItem value="dnv">DNV GL</SelectItem>
                  <SelectItem value="abs">American Bureau of Shipping</SelectItem>
                  <SelectItem value="lr">Lloyd's Register</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="issue-date">Issue Date</Label>
              <Input id="issue-date" type="date" defaultValue="2023-05-15" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiry-date">Expiry Date</Label>
              <Input id="expiry-date" type="date" defaultValue="2024-05-15" />
            </div>
            <div className="space-y-2">
              <Label>Document File</Label>
              <div className="border-2 border-dashed rounded-md p-6 text-center">
                <Upload className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                <p className="text-sm text-slate-600 mb-2">Drag and drop your file here, or click to browse</p>
                <p className="text-xs text-slate-500">Supports PDF, JPG, PNG (max 10MB)</p>
              </div>
            </div>
            {uploadProgress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setUploadProgress(10)}>Upload Document</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Document View Modal */}
      <Dialog open={documentViewOpen} onOpenChange={setDocumentViewOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedDocument?.title}</DialogTitle>
            <DialogDescription>{selectedDocument?.issuer}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-slate-100 rounded-md p-4 flex items-center justify-center h-[300px]">
              <FileText className="h-16 w-16 text-slate-400" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Issue Date</p>
                <p className="font-medium">{selectedDocument?.issueDate || "2023-01-15"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Expiry Date</p>
                <p className="font-medium">{selectedDocument?.expiryDate || "2023-11-15"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Certificate Number</p>
                <p className="font-medium">SMC-2023-12345</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Status</p>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-yellow-700">Expires in 28 days</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <div className="space-x-2">
              <Button variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button onClick={() => setDocumentViewOpen(false)}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Modal */}
      <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Share Documents</DialogTitle>
            <DialogDescription>Share vessel documents with port authorities and stakeholders</DialogDescription>
          </DialogHeader>

          {shareStatus === null && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Recipients</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded-md">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center mr-2">
                        S
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">Singapore MPA</p>
                        <p className="text-xs text-slate-500">portdocs@mpa.gov.sg</p>
                      </div>
                    </div>
                    <Badge className="bg-slate-200 text-slate-800">Port Authority</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded-md">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center mr-2">
                        A
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">Agent Maritime Services</p>
                        <p className="text-xs text-slate-500">ops@agentmaritime.com</p>
                      </div>
                    </div>
                    <Badge className="bg-slate-200 text-slate-800">Agent</Badge>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-2">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Recipient
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Documents to Share</Label>
                <div className="border rounded-md">
                  <div className="p-3 space-y-2">
                    <div className="flex items-center justify-between py-1 border-b border-slate-100">
                      <div className="flex items-center">
                        <Checkbox id="doc1" defaultChecked />
                        <Label htmlFor="doc1" className="ml-2">
                          <div>
                            <p className="font-medium text-slate-800">Safety Management Certificate</p>
                            <p className="text-xs text-slate-500">Panama Maritime Authority</p>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs text-yellow-600 mr-2">Expires in 28 days</span>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-slate-100">
                      <div className="flex items-center">
                        <Checkbox id="doc2" defaultChecked />
                        <Label htmlFor="doc2" className="ml-2">
                          <div>
                            <p className="font-medium text-slate-800">
                              International Oil Pollution Prevention Certificate
                            </p>
                            <p className="text-xs text-slate-500">DNV GL</p>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs text-yellow-600 mr-2">Expires in 45 days</span>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-slate-100">
                      <div className="flex items-center">
                        <Checkbox id="doc3" defaultChecked />
                        <Label htmlFor="doc3" className="ml-2">
                          <div>
                            <p className="font-medium text-slate-800">Certificate of Registry</p>
                            <p className="text-xs text-slate-500">Panama Maritime Authority</p>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs text-green-600 mr-2">Valid</span>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Security Options</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 text-slate-500 mr-2" />
                      <span className="text-sm">Watermark Documents</span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 text-slate-500 mr-2" />
                      <span className="text-sm">Access Tracking</span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Custom Message (Optional)</Label>
                <Textarea placeholder="Add a custom message to include with your shared documents..." />
              </div>
            </div>
          )}

          {shareStatus === "processing" && (
            <div className="py-8">
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent rounded-full animate-spin mb-4"></div>
                <h3 className="text-lg font-medium">Creating Secure Share</h3>
                <p className="text-slate-500 mt-1">Please wait while we prepare your documents...</p>
              </div>
            </div>
          )}

          {shareStatus === "complete" && (
            <div className="py-4">
              <div className="flex flex-col items-center justify-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-lg font-medium">Documents Shared Successfully</h3>
                <p className="text-slate-500 mt-1">A secure link has been created for your recipients</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-md flex items-center justify-between mb-4">
                <code className="text-sm text-slate-800">https://comovis.io/share/HW-SG-MPA-7d9f3</code>
                <Button size="sm" variant="ghost">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center text-sm text-slate-500 mb-4">
                <Clock className="h-4 w-4 mr-1" />
                <span>Link expires in 7 days</span>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setShareStatus(null)}>
                  Back
                </Button>
                <div className="space-x-2">
                  <Button variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Link
                  </Button>
                  <Button onClick={() => setShareModalOpen(false)}>Done</Button>
                </div>
              </div>
            </div>
          )}

          {shareStatus === null && (
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setShareModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share Documents
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Team Member Modal */}
      <Dialog open={teamMemberModalOpen} onOpenChange={setTeamMemberModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>Invite a new team member to your Comovis account</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="member-email">Email</Label>
              <Input id="member-email" type="email" placeholder="colleague@company.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="member-name">Full Name</Label>
              <Input id="member-name" placeholder="John Smith" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="member-role">Role</Label>
              <Select defaultValue="user">
                <SelectTrigger id="member-role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="manager">Fleet Manager</SelectItem>
                  <SelectItem value="user">Standard User</SelectItem>
                  <SelectItem value="readonly">Read-Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="space-y-2 border rounded-md p-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="perm-documents" className="flex items-center cursor-pointer">
                    <FileText className="h-4 w-4 mr-2 text-slate-500" />
                    <span>Manage Documents</span>
                  </Label>
                  <Switch id="perm-documents" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="perm-vessels" className="flex items-center cursor-pointer">
                    <Ship className="h-4 w-4 mr-2 text-slate-500" />
                    <span>Manage Vessels</span>
                  </Label>
                  <Switch id="perm-vessels" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="perm-sharing" className="flex items-center cursor-pointer">
                    <Share2 className="h-4 w-4 mr-2 text-slate-500" />
                    <span>Share Documents</span>
                  </Label>
                  <Switch id="perm-sharing" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="perm-users" className="flex items-center cursor-pointer">
                    <Users className="h-4 w-4 mr-2 text-slate-500" />
                    <span>Manage Users</span>
                  </Label>
                  <Switch id="perm-users" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setTeamMemberModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setTeamMemberModalOpen(false)
                setShowSuccessMessage(true)
                setTimeout(() => setShowSuccessMessage(false), 3000)
              }}
            >
              Send Invitation
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}

function TabButton({ value, activeValue, icon, title, description }) {
  const isActive = value === activeValue

  return (
    <TabsTrigger
      value={value}
      className={`
        flex flex-col items-start p-4 rounded-lg border transition-all
        ${
          isActive
            ? "border-slate-800 bg-slate-50 shadow-sm data-[state=active]:bg-slate-50 data-[state=active]:text-slate-900"
            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 data-[state=active]:bg-transparent data-[state=active]:text-inherit"
        }
      `}
    >
      <div className={`p-2 rounded-lg mb-2 ${isActive ? "bg-slate-200" : "bg-slate-100"}`}>
        <div className={isActive ? "text-slate-800" : "text-slate-500"}>{icon}</div>
      </div>
      <div className="text-left">
        <div className="font-medium">{title}</div>
        <div className="text-xs text-slate-500">{description}</div>
      </div>
    </TabsTrigger>
  )
}

function DocumentHubDemo({ onUploadClick, onDocumentView, viewMode, setViewMode, showSuccessMessage }) {
  const documents = [
    {
      id: "doc-1",
      title: "Safety Management Certificate",
      issuer: "Panama Maritime Authority",
      issueDate: "2023-01-15",
      expiryDate: "2023-11-15",
      status: "warning",
      daysRemaining: 28,
      certificateNo: "SMC-2023-12345",
    },
    {
      id: "doc-2",
      title: "International Oil Pollution Prevention Certificate",
      issuer: "DNV GL",
      issueDate: "2023-02-10",
      expiryDate: "2023-12-10",
      status: "warning",
      daysRemaining: 45,
      certificateNo: "IOPP-2023-67890",
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
    },
  ]

  return (
    <div>
      <h3 className="text-xl font-bold text-slate-900 mb-4">Document Hub</h3>
      <p className="text-slate-600 mb-6">
        Centralize all vessel certificates and documents in one secure location with automatic expiry tracking and
        renewal reminders.
      </p>

      <AnimatePresence>
        {showSuccessMessage && (
          <motion.div
            className="bg-green-50 border border-green-200 rounded-md p-3 mb-4 flex items-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-green-700">Document successfully uploaded!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
        <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
          <div className="flex items-center">
            <Ship className="h-5 w-5 text-slate-700 mr-2" />
            <h4 className="font-medium text-slate-800">Humble Warrior • Crude Oil Tanker • Panama</h4>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex rounded-md overflow-hidden border">
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                className={`h-9 px-3 rounded-none ${viewMode === "table" ? "bg-slate-800 text-white hover:bg-slate-700" : "bg-white text-slate-700 hover:bg-slate-100"}`}
                onClick={() => setViewMode("table")}
                size="sm"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                className={`h-9 px-3 rounded-none border-l ${viewMode === "list" ? "bg-slate-800 text-white hover:bg-slate-700" : "bg-white text-slate-700 hover:bg-slate-100"}`}
                onClick={() => setViewMode("list")}
                size="sm"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            <Button size="sm" className="bg-slate-800 hover:bg-slate-700" onClick={onUploadClick}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>
        </div>

        <div className="p-4">
          <div className="flex space-x-4 mb-4">
            <div className="flex items-center px-3 py-1 rounded-md border bg-green-50 text-green-700 border-green-200">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span className="font-medium">12</span>
              <span className="ml-1">Valid</span>
            </div>
            <div className="flex items-center px-3 py-1 rounded-md border bg-yellow-50 text-yellow-700 border-yellow-200">
              <Clock className="h-4 w-4 mr-1" />
              <span className="font-medium">3</span>
              <span className="ml-1">Expiring Soon</span>
            </div>
            <div className="flex items-center px-3 py-1 rounded-md border bg-red-50 text-red-700 border-red-200">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span className="font-medium">0</span>
              <span className="ml-1">Expired</span>
            </div>
            <div className="flex items-center px-3 py-1 rounded-md border bg-slate-100 text-slate-700 border-slate-200">
              <AlertTriangle className="h-4 w-4 mr-1" />
              <span className="font-medium">1</span>
              <span className="ml-1">Missing</span>
            </div>
          </div>

          {viewMode === "list" ? (
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
                    className="cursor-pointer hover:bg-slate-50"
                    onClick={() => onDocumentView(document)}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-slate-400" />
                        {document.title}
                      </div>
                    </TableCell>
                    <TableCell>{document.issuer}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-slate-400" />
                        {document.issueDate}
                      </div>
                    </TableCell>
                    <TableCell>{document.permanent ? "Permanent" : document.expiryDate}</TableCell>
                    <TableCell>
                      {document.status === "valid" ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Valid
                        </Badge>
                      ) : document.status === "warning" ? (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          Expires in {document.daysRemaining} days
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          Expired
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View document</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                <Download className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Download document</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Share document</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  title={doc.title}
                  issuer={doc.issuer}
                  status={doc.status}
                  expiryDays={doc.daysRemaining}
                  onClick={() => onDocumentView(doc)}
                />
              ))}
            </div>
          )}

          <div className="mt-4 text-center">
            <Button variant="outline" size="sm" className="text-slate-700 border-slate-300 hover:bg-slate-100">
              View All Documents
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Button className="bg-slate-800 hover:bg-slate-700">
          Book a Demo <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function PortPrepDemo({ onUploadClick }) {
  return (
    <div>
      <h3 className="text-xl font-bold text-slate-900 mb-4">Port Preparation</h3>
      <p className="text-slate-600 mb-6">
        Prepare for port calls with real-time intelligence on port-specific requirements and inspection focus areas.
      </p>

      <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
        <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-slate-700 mr-2" />
            <h4 className="font-medium text-slate-800">Singapore Port Preparation</h4>
          </div>
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Medium Risk</Badge>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="flex flex-col p-3 bg-slate-50 rounded-md">
              <div className="text-sm text-slate-500 mb-1">Estimated Arrival</div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-slate-700 mr-2" />
                <span className="font-medium text-slate-800">Nov 15, 2023</span>
              </div>
              <div className="text-sm text-slate-600 mt-1">28 days remaining</div>
            </div>

            <div className="flex flex-col p-3 bg-slate-50 rounded-md">
              <div className="text-sm text-slate-500 mb-1">Readiness Status</div>
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                <span className="font-medium text-slate-800">2 Critical Issues</span>
              </div>
              <div className="text-sm text-yellow-600 mt-1">Action required</div>
            </div>

            <div className="flex flex-col p-3 bg-slate-50 rounded-md">
              <div className="text-sm text-slate-500 mb-1">Last Inspection</div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span className="font-medium text-slate-800">Mar 10, 2023</span>
              </div>
              <div className="text-sm text-slate-500 mt-1">No deficiencies</div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800">Critical Document Issues</h4>
                <p className="text-sm text-amber-700">
                  2 documents require immediate attention before your Singapore port call.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center">
                <FileText className="h-4 w-4 text-slate-500 mr-2" />
                <span className="font-medium">Safety Management Certificate</span>
              </div>
              <div className="flex items-center">
                <div className="flex items-center mr-4">
                  <Clock className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-sm text-yellow-700">Expires in 28 days (during port stay)</span>
                </div>
                <Button size="sm" className="bg-slate-800 hover:bg-slate-700" onClick={onUploadClick}>
                  Update
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center">
                <FileText className="h-4 w-4 text-slate-500 mr-2" />
                <span className="font-medium">Ship Security Plan</span>
              </div>
              <div className="flex items-center">
                <div className="flex items-center mr-4">
                  <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-sm text-red-700">Document missing</span>
                </div>
                <Button size="sm" className="bg-slate-800 hover:bg-slate-700" onClick={onUploadClick}>
                  Upload
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-slate-100 border border-slate-200 rounded-md p-3">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-slate-700 mr-2 mt-0.5" />
              <div>
                <h4 className="font-medium text-slate-800">Port Intelligence Update</h4>
                <p className="text-sm text-slate-600">
                  Singapore MPA has announced a Concentrated Inspection Campaign focusing on MARPOL Annex I compliance.
                </p>
                <div className="mt-2">
                  <Button size="sm" variant="outline" className="text-slate-700 border-slate-300 hover:bg-slate-200">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 border border-slate-200 rounded-md">
            <h4 className="font-medium text-slate-800 mb-2">Port-Specific Requirements</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 text-slate-500 mr-2" />
                  <span className="text-sm">Maritime Declaration of Health</span>
                </div>
                <Button size="sm" variant="outline" className="h-7">
                  <Download className="h-3.5 w-3.5 mr-1" />
                  Download Form
                </Button>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 text-slate-500 mr-2" />
                  <span className="text-sm">Crew List</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-xs text-green-700 mr-2">Submitted</span>
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 text-slate-500 mr-2" />
                  <span className="text-sm">Dangerous Goods Declaration</span>
                </div>
                <Button size="sm" variant="outline" className="h-7">
                  <Upload className="h-3.5 w-3.5 mr-1" />
                  Upload
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Button className="bg-slate-800 hover:bg-slate-700">
          Book a Demo <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function DocumentSharingDemo({ onShareClick, shareStatus, handleShare, setShareStatus }) {
  return (
    <div>
      <h3 className="text-xl font-bold text-slate-900 mb-4">Document Sharing</h3>
      <p className="text-slate-600 mb-6">
        Securely share vessel documents with port authorities, charterers, and other stakeholders with just a few
        clicks.
      </p>

      <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
        <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
          <div className="flex items-center">
            <Share2 className="h-5 w-5 text-slate-700 mr-2" />
            <h4 className="font-medium text-slate-800">Share Vessel Documents</h4>
          </div>
          <Button size="sm" className="bg-slate-800 hover:bg-slate-700" onClick={onShareClick}>
            Create New Share
          </Button>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Vessel</label>
              <div className="flex items-center p-2 bg-slate-50 rounded-md border border-slate-200">
                <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center mr-2">
                  HW
                </div>
                <div>
                  <p className="font-medium text-slate-800">Humble Warrior</p>
                  <p className="text-xs text-slate-500">Crude Oil Tanker • Panama</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Upcoming Port Call</label>
              <div className="flex items-center p-2 bg-slate-50 rounded-md border border-slate-200">
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center mr-2">
                  SG
                </div>
                <div>
                  <p className="font-medium text-slate-800">Singapore</p>
                  <p className="text-xs text-slate-500">ETA: Nov 15, 2023</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">Recent Shares</label>
            <Card className="border-slate-200">
              <CardContent className="p-0">
                <div className="divide-y">
                  <div className="p-3 hover:bg-slate-50 cursor-pointer">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Singapore MPA Documents</h4>
                        <p className="text-xs text-slate-500">Shared 2 days ago • 3 documents</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex items-center mt-2 text-xs text-slate-500">
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      <span>Viewed 3 times</span>
                      <span className="mx-2">•</span>
                      <Download className="h-3.5 w-3.5 mr-1" />
                      <span>Downloaded 1 time</span>
                      <span className="mx-2">•</span>
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      <span>Expires in 5 days</span>
                    </div>
                  </div>

                  <div className="p-3 hover:bg-slate-50 cursor-pointer">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Agent Maritime Services</h4>
                        <p className="text-xs text-slate-500">Shared 5 days ago • 5 documents</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex items-center mt-2 text-xs text-slate-500">
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      <span>Viewed 2 times</span>
                      <span className="mx-2">•</span>
                      <Download className="h-3.5 w-3.5 mr-1" />
                      <span>Downloaded 0 times</span>
                      <span className="mx-2">•</span>
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      <span>Expires in 2 days</span>
                    </div>
                  </div>

                  <div className="p-3 hover:bg-slate-50 cursor-pointer">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Charterer Documents</h4>
                        <p className="text-xs text-slate-500">Shared 2 weeks ago • 4 documents</p>
                      </div>
                      <Badge className="bg-slate-100 text-slate-800">Expired</Badge>
                    </div>
                    <div className="flex items-center mt-2 text-xs text-slate-500">
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      <span>Viewed 5 times</span>
                      <span className="mx-2">•</span>
                      <Download className="h-3.5 w-3.5 mr-1" />
                      <span>Downloaded 2 times</span>
                      <span className="mx-2">•</span>
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      <span>Expired</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">Quick Share Templates</label>
            <div className="grid grid-cols-3 gap-3">
              <div className="border rounded-md p-3 hover:bg-slate-50 cursor-pointer">
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <h4 className="font-medium text-sm">Port Authority</h4>
                  <p className="text-xs text-slate-500 mt-1">7 documents</p>
                </div>
              </div>

              <div className="border rounded-md p-3 hover:bg-slate-50 cursor-pointer">
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
                    <Ship className="h-5 w-5 text-green-600" />
                  </div>
                  <h4 className="font-medium text-sm">Charterer</h4>
                  <p className="text-xs text-slate-500 mt-1">5 documents</p>
                </div>
              </div>

              <div className="border rounded-md p-3 hover:bg-slate-50 cursor-pointer">
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                    <Shield className="h-5 w-5 text-purple-600" />
                  </div>
                  <h4 className="font-medium text-sm">Vetting</h4>
                  <p className="text-xs text-slate-500 mt-1">12 documents</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800">Enhanced Security Features</h4>
                <p className="text-sm text-blue-700">
                  Protect your documents with watermarking, access tracking, and expiration controls.
                </p>
                <div className="mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Button className="bg-slate-800 hover:bg-slate-700">
          Book a Demo <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function FleetManagementDemo() {
  return (
    <div>
      <h3 className="text-xl font-bold text-slate-900 mb-4">Fleet Management</h3>
      <p className="text-slate-600 mb-6">
        Manage compliance across your entire fleet with vessel-specific dashboards and fleet-wide analytics.
      </p>

      <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
        <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
          <div className="flex items-center">
            <Ship className="h-5 w-5 text-slate-700 mr-2" />
            <h4 className="font-medium text-slate-800">Fleet Overview</h4>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-100">3 Vessels</Badge>
            <Button size="sm" variant="outline" className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <div className="p-4">
          <div className="space-y-4 mb-6">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">Fleet Compliance Score</span>
                <span className="font-medium text-slate-800">78%</span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-slate-700 rounded-full" style={{ width: "78%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">Document Validity</span>
                <span className="font-medium text-slate-800">85%</span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-slate-700 rounded-full" style={{ width: "85%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">Inspection Readiness</span>
                <span className="font-medium text-slate-800">65%</span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-slate-700 rounded-full" style={{ width: "65%" }}></div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <VesselOverviewItem
              name="Humble Warrior"
              type="Crude Oil Tanker"
              flag="Panama"
              complianceScore={80}
              documentStatus={{
                valid: 12,
                expiringSoon: 3,
                expired: 0,
                missing: 1,
              }}
              nextPort="Singapore"
              eta="Nov 15, 2023"
            />

            <VesselOverviewItem
              name="Pacific Explorer"
              type="Container Ship"
              flag="Singapore"
              complianceScore={92}
              documentStatus={{
                valid: 14,
                expiringSoon: 1,
                expired: 0,
                missing: 0,
              }}
              nextPort="Rotterdam"
              eta="Nov 25, 2023"
            />

            <VesselOverviewItem
              name="Northern Star"
              type="Bulk Carrier"
              flag="Marshall Islands"
              complianceScore={65}
              documentStatus={{
                valid: 10,
                expiringSoon: 2,
                expired: 1,
                missing: 2,
              }}
              nextPort="Shanghai"
              eta="Dec 10, 2023"
            />
          </div>

          <div className="mt-4 flex justify-between">
            <Button variant="outline" size="sm" className="text-slate-700 border-slate-300 hover:bg-slate-100">
              <Plus className="h-4 w-4 mr-2" />
              Add Vessel
            </Button>
          
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Button className="bg-slate-800 hover:bg-slate-700">
          Book a Demo <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function TeamManagementDemo({ onAddMemberClick }) {
  return (
    <div>
      <h3 className="text-xl font-bold text-slate-900 mb-4">Team Management</h3>
      <p className="text-slate-600 mb-6">
        Manage your team members, assign roles, and control access permissions to ensure secure and efficient
        collaboration.
      </p>

      <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
        <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
          <div className="flex items-center">
            <Users className="h-5 w-5 text-slate-700 mr-2" />
            <h4 className="font-medium text-slate-800">Team Members</h4>
          </div>
          <Button size="sm" className="bg-slate-800 hover:bg-slate-700" onClick={onAddMemberClick}>
            <Plus className="h-4 w-4 mr-2" />
            Add Team Member
          </Button>
        </div>

        <div className="p-4">
          <div className="flex space-x-4 mb-4">
            <div className="flex items-center px-3 py-1 rounded-md border bg-blue-50 text-blue-700 border-blue-200">
              <Users className="h-4 w-4 mr-1" />
              <span className="font-medium">5</span>
              <span className="ml-1">Active Users</span>
            </div>
            <div className="flex items-center px-3 py-1 rounded-md border bg-green-50 text-green-700 border-green-200">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span className="font-medium">3</span>
              <span className="ml-1">Admins</span>
            </div>
            <div className="flex items-center px-3 py-1 rounded-md border bg-slate-100 text-slate-700 border-slate-200">
              <Clock className="h-4 w-4 mr-1" />
              <span className="font-medium">2</span>
              <span className="ml-1">Pending Invites</span>
            </div>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="Search team members..." className="pl-9" />
          </div>

          <div className="space-y-3 mb-4">
            <TeamMemberCard
              name="John Smith"
              email="john.smith@company.com"
              role="Administrator"
              status="active"
              avatar="JS"
              lastActive="2 hours ago"
            />

            <TeamMemberCard
              name="Sarah Johnson"
              email="sarah.j@company.com"
              role="Fleet Manager"
              status="active"
              avatar="SJ"
              lastActive="Just now"
            />

            <TeamMemberCard
              name="Michael Chen"
              email="m.chen@company.com"
              role="Document Manager"
              status="active"
              avatar="MC"
              lastActive="Yesterday"
            />

            <TeamMemberCard
              name="Emma Wilson"
              email="e.wilson@company.com"
              role="Standard User"
              status="active"
              avatar="EW"
              lastActive="3 days ago"
            />

            <TeamMemberCard
              name="Robert Davis"
              email="r.davis@company.com"
              role="Read-Only"
              status="active"
              avatar="RD"
              lastActive="1 week ago"
            />

            <TeamMemberCard
              name="Lisa Thompson"
              email="l.thompson@company.com"
              role="Administrator"
              status="pending"
              avatar="LT"
              lastActive="Invitation sent 2 days ago"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800">Role-Based Access Control</h4>
                <p className="text-sm text-blue-700">
                  Customize permissions for each team member based on their responsibilities. Control access to vessels,
                  documents, and sharing capabilities.
                </p>
                <div className="mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200"
                  >
                    Manage Roles
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Button className="bg-slate-800 hover:bg-slate-700">
          Book a Demo <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function DocumentCard({ title, issuer, status, expiryDays, onClick }) {
  const statusConfig = {
    valid: {
      className: "border-l-green-500",
      icon: CheckCircle,
      iconColor: "text-green-500",
      textColor: "text-green-700",
      message: `Valid until ${expiryDays} days`,
    },
    warning: {
      className: "border-l-yellow-500",
      icon: Clock,
      iconColor: "text-yellow-500",
      textColor: "text-yellow-700",
      message: `Expires in ${expiryDays} days`,
    },
    error: {
      className: "border-l-red-500",
      icon: AlertCircle,
      iconColor: "text-red-500",
      textColor: "text-red-700",
      message: "Expired",
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Card
      className={`border-l-4 ${config.className} border-slate-200 cursor-pointer hover:shadow-md transition-shadow`}
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="flex justify-between">
          <div>
            <h3 className="font-medium text-slate-800">{title}</h3>
            <p className="text-sm text-slate-500">{issuer}</p>
          </div>
          <div className="flex items-center">
            <Icon className={`h-4 w-4 mr-1 ${config.iconColor}`} />
            <span className={`text-sm font-medium ${config.textColor}`}>{config.message}</span>
          </div>
        </div>
        <div className="flex justify-end mt-2">
          <div className="flex space-x-1">
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-slate-700 hover:bg-slate-100">
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-slate-700 hover:bg-slate-100">
              <Download className="h-3.5 w-3.5" />
            </Button>
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-slate-700 hover:bg-slate-100">
              <Share2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function VesselOverviewItem({ name, type, flag, complianceScore, documentStatus, nextPort, eta }) {
  let scoreColor = "bg-red-500"
  let scoreTextColor = "text-red-700"
  let scoreBgColor = "bg-red-50"

  if (complianceScore >= 90) {
    scoreColor = "bg-green-500"
    scoreTextColor = "text-green-700"
    scoreBgColor = "bg-green-50"
  } else if (complianceScore >= 70) {
    scoreColor = "bg-yellow-500"
    scoreTextColor = "text-yellow-700"
    scoreBgColor = "bg-yellow-50"
  }

  return (
    <div className="p-3 border border-slate-200 rounded-md hover:shadow-sm transition-shadow">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mr-3">
            <Ship className="h-5 w-5 text-slate-700" />
          </div>
          <div>
            <h4 className="font-medium text-slate-800">{name}</h4>
            <p className="text-sm text-slate-500">
              {type} • {flag}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <div className={`px-3 py-1 rounded-full ${scoreBgColor} ${scoreTextColor} font-medium text-sm`}>
            {complianceScore}%
          </div>
          <Button variant="ghost" size="sm" className="ml-2 h-8 w-8 p-0">
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="inline-flex items-center text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded">
          <CheckCircle className="h-3 w-3 mr-1" /> {documentStatus.valid}
        </span>
        {documentStatus.expiringSoon > 0 && (
          <span className="inline-flex items-center text-xs text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded">
            <Clock className="h-3 w-3 mr-1" /> {documentStatus.expiringSoon}
          </span>
        )}
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

      <div className="mt-3 flex items-center text-sm">
        <MapPin className="h-4 w-4 text-slate-500 mr-1" />
        <span className="text-slate-700">Next Port: {nextPort}</span>
        <span className="mx-1 text-slate-400">•</span>
        <span className="text-slate-500">ETA: {eta}</span>
      </div>
    </div>
  )
}

function TeamMemberCard({ name, email, role, status, avatar, lastActive }) {
  const roleConfig = {
    Administrator: {
      badge: "bg-purple-100 text-purple-800",
      permissions: "Full access to all features",
    },
    "Fleet Manager": {
      badge: "bg-blue-100 text-blue-800",
      permissions: "Manage vessels and documents",
    },
    "Document Manager": {
      badge: "bg-green-100 text-green-800",
      permissions: "Upload and manage documents",
    },
    "Standard User": {
      badge: "bg-slate-100 text-slate-800",
      permissions: "View and share documents",
    },
    "Read-Only": {
      badge: "bg-gray-100 text-gray-800",
      permissions: "View-only access",
    },
  }

  const config = roleConfig[role]

  return (
    <div className="p-3 border border-slate-200 rounded-md hover:shadow-sm transition-shadow">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarFallback className="bg-slate-200 text-slate-700">{avatar}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-medium text-slate-800">{name}</h4>
            <p className="text-sm text-slate-500">{email}</p>
          </div>
        </div>
        <div className="flex items-center">
          <Badge className={config.badge}>{role}</Badge>
          <Button variant="ghost" size="sm" className="ml-2 h-8 w-8 p-0">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-3 flex justify-between items-center">
        <div className="text-xs text-slate-500">
          <span className="font-medium">Permissions:</span> {config.permissions}
        </div>
        <div className="flex items-center text-xs">
          {status === "active" ? (
            <span className="flex items-center text-green-600">
              <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
              Active • {lastActive}
            </span>
          ) : (
            <span className="flex items-center text-yellow-600">
              <span className="h-2 w-2 rounded-full bg-yellow-500 mr-1"></span>
              Pending • {lastActive}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
