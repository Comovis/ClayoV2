"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Ship,
  Calendar,
  Clock,
  Download,
  Share2,
  Search,
  Filter,
  Plus,
  Eye,
  Copy,
  Mail,
  LinkIcon,
  Shield,
  Users,
} from "lucide-react"

export default function DocumentSharing() {
  const [selectedVessel, setSelectedVessel] = useState("Humble Warrior")
  const [selectedDocuments, setSelectedDocuments] = useState([])
  const [shareMethod, setShareMethod] = useState("email")

  const toggleDocumentSelection = (docId) => {
    if (selectedDocuments.includes(docId)) {
      setSelectedDocuments(selectedDocuments.filter((id) => id !== docId))
    } else {
      setSelectedDocuments([...selectedDocuments, docId])
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Document Sharing</h1>
            <p className="text-gray-500">Share vessel documents with authorities and stakeholders</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create New Package
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left sidebar - Vessel selection */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Select Vessel</CardTitle>
                <div className="relative mt-2">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search vessels..." className="pl-8" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y max-h-[400px] overflow-auto">
                  <VesselSelectItem
                    name="Humble Warrior"
                    type="Crude Oil Tanker"
                    flag="Panama"
                    active={selectedVessel === "Humble Warrior"}
                    onClick={() => setSelectedVessel("Humble Warrior")}
                  />

                  <VesselSelectItem
                    name="Pacific Explorer"
                    type="Container Ship"
                    flag="Singapore"
                    active={selectedVessel === "Pacific Explorer"}
                    onClick={() => setSelectedVessel("Pacific Explorer")}
                  />

                  <VesselSelectItem
                    name="Northern Star"
                    type="Bulk Carrier"
                    flag="Marshall Islands"
                    active={selectedVessel === "Northern Star"}
                    onClick={() => setSelectedVessel("Northern Star")}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader className="pb-2">
                <CardTitle>Recent Shares</CardTitle>
                <CardDescription>Documents shared in the last 30 days</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  <RecentShareItem
                    title="Singapore MPA Documents"
                    vessel="Humble Warrior"
                    recipient="Singapore Maritime and Port Authority"
                    date="Oct 19, 2023"
                    documentCount={3}
                  />

                  <RecentShareItem
                    title="Class Certificates"
                    vessel="Pacific Explorer"
                    recipient="DNV GL"
                    date="Oct 15, 2023"
                    documentCount={5}
                  />

                  <RecentShareItem
                    title="Crew Certificates"
                    vessel="Humble Warrior"
                    recipient="Immigration Authority"
                    date="Oct 10, 2023"
                    documentCount={12}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main content - Document selection */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Humble Warrior Documents</CardTitle>
                    <CardDescription>Select documents to share</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-1" />
                      Filter
                    </Button>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Document type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Documents</SelectItem>
                        <SelectItem value="certificates">Certificates</SelectItem>
                        <SelectItem value="crew">Crew Documents</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-4 bg-blue-50 border-y border-blue-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Checkbox id="select-all" className="mr-2" />
                      <Label htmlFor="select-all">Select All Documents</Label>
                    </div>
                    <div className="text-sm text-blue-700">{selectedDocuments.length} documents selected</div>
                  </div>
                </div>
                <div className="divide-y">
                  <DocumentSelectItem
                    id="doc1"
                    title="Safety Management Certificate"
                    issuer="Panama Maritime Authority"
                    issueDate="2023-01-15"
                    expiryDate="2023-11-15"
                    status="expiringSoon"
                    selected={selectedDocuments.includes("doc1")}
                    onToggle={() => toggleDocumentSelection("doc1")}
                  />

                  <DocumentSelectItem
                    id="doc2"
                    title="International Oil Pollution Prevention Certificate"
                    issuer="DNV GL"
                    issueDate="2023-02-10"
                    expiryDate="2023-12-10"
                    status="expiringSoon"
                    selected={selectedDocuments.includes("doc2")}
                    onToggle={() => toggleDocumentSelection("doc2")}
                  />

                  <DocumentSelectItem
                    id="doc3"
                    title="Certificate of Registry"
                    issuer="Panama Maritime Authority"
                    issueDate="2022-05-20"
                    expiryDate="2024-05-20"
                    status="valid"
                    selected={selectedDocuments.includes("doc3")}
                    onToggle={() => toggleDocumentSelection("doc3")}
                  />

                  <DocumentSelectItem
                    id="doc4"
                    title="International Load Line Certificate"
                    issuer="DNV GL"
                    issueDate="2022-06-15"
                    expiryDate="2024-06-15"
                    status="valid"
                    selected={selectedDocuments.includes("doc4")}
                    onToggle={() => toggleDocumentSelection("doc4")}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between p-4 border-t">
                <div className="text-sm text-gray-500">
                  <Shield className="h-4 w-4 inline mr-1" />
                  Documents are shared securely with 30-day access
                </div>
                <Button disabled={selectedDocuments.length === 0}>Continue to Share</Button>
              </CardFooter>
            </Card>

            {selectedDocuments.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Share Documents</CardTitle>
                  <CardDescription>
                    Share {selectedDocuments.length} selected documents with authorities or stakeholders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={shareMethod} onValueChange={setShareMethod}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="email">
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </TabsTrigger>
                      <TabsTrigger value="link">
                        <LinkIcon className="h-4 w-4 mr-2" />
                        Secure Link
                      </TabsTrigger>
                      <TabsTrigger value="comovis">
                        <Users className="h-4 w-4 mr-2" />
                        Comovis Users
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="email" className="mt-4">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="recipient-email">Recipient Email</Label>
                          <Input id="recipient-email" placeholder="Enter email address" className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="email-subject">Subject</Label>
                          <Input
                            id="email-subject"
                            placeholder="Document package from Captain Logistics"
                            className="mt-1"
                            defaultValue={`Humble Warrior - Documents for Singapore Port Call (${selectedDocuments.length} documents)`}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email-message">Message</Label>
                          <Input
                            id="email-message"
                            placeholder="Add a message"
                            className="mt-1"
                            defaultValue="Please find the requested vessel documents attached. These documents are available for 30 days."
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="notify-download" />
                          <Label htmlFor="notify-download">Notify me when documents are viewed</Label>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="link" className="mt-4">
                      <div className="space-y-4">
                        <div>
                          <Label>Secure Link</Label>
                          <div className="flex mt-1">
                            <Input
                              readOnly
                              value="https://share.comovis.com/p/a1b2c3d4e5f6"
                              className="rounded-r-none"
                            />
                            <Button variant="outline" className="rounded-l-none">
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            This link provides access to the selected documents for 30 days
                          </p>
                        </div>
                        <div>
                          <Label htmlFor="link-expiry">Link Expiry</Label>
                          <Select defaultValue="30">
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select expiry period" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="7">7 days</SelectItem>
                              <SelectItem value="14">14 days</SelectItem>
                              <SelectItem value="30">30 days</SelectItem>
                              <SelectItem value="60">60 days</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="password-protect" />
                          <Label htmlFor="password-protect">Password protect this link</Label>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="comovis" className="mt-4">
                      <div className="space-y-4">
                        <div>
                          <Label>Share with Comovis Users</Label>
                          <p className="text-sm text-gray-500 mt-1">
                            Invite vessel owners to view these documents in their Comovis account
                          </p>
                        </div>
                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-md">
                          <div className="flex items-start">
                            <AlertCircle className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-blue-800">Upgrade Your Clients</h4>
                              <p className="text-sm text-blue-700 mt-1">
                                Mediterranean Shipping doesn't have a Comovis account yet. Invite them to join and earn
                                20% commission on their subscription.
                              </p>
                              <Button size="sm" className="mt-2">
                                Invite to Comovis
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="flex justify-between border-t">
                  <Button variant="outline">Cancel</Button>
                  <Button>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Documents
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function VesselSelectItem({ name, type, flag, active, onClick }) {
  return (
    <div
      className={`p-3 cursor-pointer ${active ? "bg-blue-50 border-l-4 border-l-blue-500" : "hover:bg-gray-50"}`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <Ship className={`h-4 w-4 mr-2 ${active ? "text-blue-500" : "text-gray-500"}`} />
        <h3 className="font-medium">{name}</h3>
      </div>
      <p className="text-sm text-gray-500 mt-1">
        {type} • {flag}
      </p>
    </div>
  )
}

function RecentShareItem({ title, vessel, recipient, date, documentCount }) {
  return (
    <div className="p-4 hover:bg-gray-50">
      <h4 className="font-medium">{title}</h4>
      <div className="flex items-center text-sm text-gray-500 mt-1">
        <Ship className="h-3 w-3 mr-1" />
        <span>{vessel}</span>
      </div>
      <div className="flex items-center text-sm text-gray-500 mt-1">
        <Users className="h-3 w-3 mr-1" />
        <span>{recipient}</span>
      </div>
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-gray-500">
          <Calendar className="h-3 w-3 inline mr-1" />
          {date}
        </span>
        <Badge className="bg-blue-100 text-blue-800">{documentCount} documents</Badge>
      </div>
      <div className="mt-2">
        <Button size="sm" variant="outline" className="w-full">
          <Eye className="h-3.5 w-3.5 mr-1" />
          View Package
        </Button>
      </div>
    </div>
  )
}

function DocumentSelectItem({ id, title, issuer, issueDate, expiryDate, status, selected, onToggle }) {
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
    <div className={`p-4 hover:bg-gray-50 ${selected ? "bg-blue-50" : ""}`}>
      <div className="flex items-start">
        <Checkbox id={id} className="mt-1 mr-3" checked={selected} onCheckedChange={onToggle} />
        <div className="flex-1">
          <div className="flex justify-between">
            <div>
              <Label htmlFor={id} className="font-medium cursor-pointer">
                {title}
              </Label>
              <p className="text-sm text-gray-500">{issuer}</p>
            </div>
            <div className="flex items-center">
              <Icon className={`h-4 w-4 mr-1 ${config.iconColor}`} />
              <span className={`text-sm font-medium ${config.textColor}`}>
                {status === "expiringSoon" ? `Expires ${expiryDate}` : status === "valid" ? "Valid" : "Expired"}
              </span>
            </div>
          </div>
          <div className="flex justify-between mt-3">
            <div className="flex space-x-4 text-xs text-gray-500">
              <span>Issued: {issueDate}</span>
              <span>Expires: {expiryDate}</span>
            </div>
            <div className="flex space-x-1">
              <Button size="sm" variant="ghost">
                <Eye className="h-3.5 w-3.5" />
              </Button>
              <Button size="sm" variant="ghost">
                <Download className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
