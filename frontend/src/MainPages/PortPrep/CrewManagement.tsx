"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  FileText,
  Clock,
  Upload,
  Eye,
  Download,
  Plus,
  Filter,
  FileCheck,
  Info,
  Search,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"

export default function CrewCertificateManagement() {
  const [activeTab, setActiveTab] = useState("summary")

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Crew Certificate Management</h1>
          <p className="text-gray-500">Humble Warrior • Crude Oil Tanker • Panama</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload Certificate
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Crew Certificate Status</CardTitle>
              <CardDescription>Overview of all crew certificates</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                <span className="text-sm">Valid: 42</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                <span className="text-sm">Expiring: 5</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                <span className="text-sm">Expired: 0</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="summary" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="summary">Summary View</TabsTrigger>
              <TabsTrigger value="matrix">Certificate Matrix</TabsTrigger>
              <TabsTrigger value="expiring">Expiring Certificates</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="mt-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Crew Certificate Summary</h3>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                    <Button size="sm">
                      <FileCheck className="mr-2 h-4 w-4" />
                      Verify All
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <CrewSummaryCard
                    title="Navigation Department"
                    total={15}
                    valid={13}
                    expiring={2}
                    expired={0}
                    roles={["Master", "Chief Officer", "Second Officer", "Third Officer", "Deck Cadet"]}
                  />

                  <CrewSummaryCard
                    title="Engineering Department"
                    total={18}
                    valid={16}
                    expiring={2}
                    expired={0}
                    roles={["Chief Engineer", "Second Engineer", "Third Engineer", "Electrical Officer", "Oiler"]}
                  />

                  <CrewSummaryCard
                    title="Deck Department"
                    total={14}
                    valid={13}
                    expiring={1}
                    expired={0}
                    roles={["Bosun", "Able Seaman", "Ordinary Seaman"]}
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-md mt-4">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-800">Certificate Matrix Document</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        The complete crew certificate matrix is available as a document for download and sharing with
                        port authorities.
                      </p>
                      <div className="flex items-center mt-2 p-2 bg-white border rounded-md">
                        <FileText className="h-4 w-4 text-blue-500 mr-2" />
                        <div className="flex-1">
                          <div className="text-sm font-medium">Humble_Warrior_Crew_Certificate_Matrix.xlsx</div>
                          <div className="text-xs text-gray-500">Updated: Oct 15, 2023 • 245 KB</div>
                        </div>
                        <Button size="sm" variant="outline" className="ml-2">
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="ml-1">
                          <Download className="h-3.5 w-3.5 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="matrix" className="mt-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Certificate Matrix</h3>
                  <div className="flex items-center">
                    <Search className="h-4 w-4 text-gray-400 mr-2" />
                    <Input placeholder="Search crew or certificates..." className="w-60 h-8" />
                  </div>
                </div>

                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">Crew Member</TableHead>
                        <TableHead>CoC</TableHead>
                        <TableHead>Medical</TableHead>
                        <TableHead>STCW Basic</TableHead>
                        <TableHead>GMDSS</TableHead>
                        <TableHead>Advanced FF</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <div>
                              <div>John Doe</div>
                              <div className="text-xs text-gray-500">Master</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <CertificateStatus status="valid" expiry="Mar 15, 2024" />
                        </TableCell>
                        <TableCell>
                          <CertificateStatus status="valid" expiry="Feb 10, 2024" />
                        </TableCell>
                        <TableCell>
                          <CertificateStatus status="valid" expiry="Jul 22, 2025" />
                        </TableCell>
                        <TableCell>
                          <CertificateStatus status="valid" expiry="Jun 18, 2024" />
                        </TableCell>
                        <TableCell>
                          <CertificateStatus status="valid" expiry="Sep 05, 2024" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarFallback>MC</AvatarFallback>
                            </Avatar>
                            <div>
                              <div>Michael Chen</div>
                              <div className="text-xs text-gray-500">Chief Officer</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <CertificateStatus status="valid" expiry="Apr 30, 2024" />
                        </TableCell>
                        <TableCell>
                          <CertificateStatus status="valid" expiry="Jan 18, 2024" />
                        </TableCell>
                        <TableCell>
                          <CertificateStatus status="valid" expiry="May 12, 2025" />
                        </TableCell>
                        <TableCell>
                          <CertificateStatus status="valid" expiry="Aug 22, 2024" />
                        </TableCell>
                        <TableCell>
                          <CertificateStatus status="expiring" expiry="Nov 25, 2023" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarFallback>RP</AvatarFallback>
                            </Avatar>
                            <div>
                              <div>Raj Patel</div>
                              <div className="text-xs text-gray-500">Second Engineer</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <CertificateStatus status="valid" expiry="May 12, 2024" />
                        </TableCell>
                        <TableCell>
                          <CertificateStatus status="expiring" expiry="Dec 05, 2023" />
                        </TableCell>
                        <TableCell>
                          <CertificateStatus status="valid" expiry="Jun 30, 2025" />
                        </TableCell>
                        <TableCell>
                          <CertificateStatus status="na" expiry="" />
                        </TableCell>
                        <TableCell>
                          <CertificateStatus status="valid" expiry="Feb 15, 2024" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <div className="text-sm text-gray-500">Showing 3 of 22 crew members</div>
                  <Button variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Crew Member
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="expiring" className="mt-4">
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Certificate Renewal Required</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        5 crew certificates will expire in the next 60 days. Please initiate the renewal process.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <ExpiringCertificateItem
                    name="Michael Chen"
                    position="Chief Officer"
                    certificate="Advanced Firefighting"
                    expiryDate="Nov 25, 2023"
                    daysRemaining={26}
                  />

                  <ExpiringCertificateItem
                    name="Raj Patel"
                    position="Second Engineer"
                    certificate="Medical Certificate"
                    expiryDate="Dec 05, 2023"
                    daysRemaining={36}
                  />

                  <ExpiringCertificateItem
                    name="Sarah Johnson"
                    position="Third Officer"
                    certificate="GMDSS Operator"
                    expiryDate="Dec 18, 2023"
                    daysRemaining={49}
                  />

                  <ExpiringCertificateItem
                    name="Ahmed Hassan"
                    position="Able Seaman"
                    certificate="Medical Certificate"
                    expiryDate="Dec 22, 2023"
                    daysRemaining={53}
                  />

                  <ExpiringCertificateItem
                    name="Maria Rodriguez"
                    position="Second Officer"
                    certificate="Proficiency in Survival Craft"
                    expiryDate="Jan 10, 2024"
                    daysRemaining={72}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className={activeTab === "summary" ? "block" : "hidden"}>
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800">Singapore Port Requirements</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Singapore MPA requires all crew to have valid certificates with proper endorsements. Shore leave
                  requires valid COVID-19 vaccination certificates.
                </p>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Certificate Management</CardTitle>
          <CardDescription>Upload and manage crew certificates</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upload">
            <TabsList>
              <TabsTrigger value="upload">Upload Certificate</TabsTrigger>
              <TabsTrigger value="matrix">Upload Matrix</TabsTrigger>
              <TabsTrigger value="history">Certificate History</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="mt-4">
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-200 rounded-md p-6 text-center">
                  <div className="flex flex-col items-center">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <h3 className="font-medium text-gray-700 mb-1">Upload Individual Certificate</h3>
                    <p className="text-sm text-gray-500 mb-4">Drag and drop certificate files or click to browse</p>
                    <Button>Select Files</Button>
                  </div>
                </div>

                <div className="text-sm text-gray-500 mt-2">
                  <p>Supported file types: PDF, JPG, PNG</p>
                  <p>Maximum file size: 10MB</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="matrix" className="mt-4">
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-200 rounded-md p-6 text-center">
                  <div className="flex flex-col items-center">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <h3 className="font-medium text-gray-700 mb-1">Upload Certificate Matrix</h3>
                    <p className="text-sm text-gray-500 mb-4">Upload your crew certificate matrix spreadsheet</p>
                    <Button>Select File</Button>
                  </div>
                </div>

                <div className="text-sm text-gray-500 mt-2">
                  <p>Supported file types: XLSX, CSV</p>
                  <p>
                    <a href="#" className="text-blue-500 hover:underline">
                      Download template
                    </a>{" "}
                    for the correct format
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-md mt-2">
                  <h4 className="font-medium mb-2">Why use a certificate matrix?</h4>
                  <p className="text-sm text-gray-600">
                    A certificate matrix provides a comprehensive overview of all crew certificates in a single
                    document. This is often accepted by port authorities and simplifies document management for vessels
                    with large crews.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history" className="mt-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Certificate Update History</h3>
                  <div className="flex items-center">
                    <Search className="h-4 w-4 text-gray-400 mr-2" />
                    <Input placeholder="Search history..." className="w-60 h-8" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-3 border rounded-md">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <Upload className="h-4 w-4 text-blue-500 mr-2" />
                        <div>
                          <p className="font-medium">Certificate Matrix Updated</p>
                          <p className="text-xs text-gray-500">Oct 15, 2023 • 09:45 AM</p>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">Update</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Updated crew certificate matrix with 2 new crew members and 5 renewed certificates.
                    </p>
                  </div>

                  <div className="p-3 border rounded-md">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />
                        <div>
                          <p className="font-medium">Expiring Certificate Flagged</p>
                          <p className="text-xs text-gray-500">Oct 12, 2023 • 14:20 PM</p>
                        </div>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">Alert</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      System flagged Michael Chen's Advanced Firefighting certificate as expiring in 45 days.
                    </p>
                  </div>

                  <div className="p-3 border rounded-md">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <div>
                          <p className="font-medium">Certificate Renewed</p>
                          <p className="text-xs text-gray-500">Oct 05, 2023 • 11:30 AM</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Renewal</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      John Doe's Medical Certificate renewed. New expiry date: Feb 10, 2024.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function CrewSummaryCard({ title, total, valid, expiring, expired, roles }) {
  const validPercentage = (valid / total) * 100
  const expiringPercentage = (expiring / total) * 100
  const expiredPercentage = (expired / total) * 100

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-xs text-gray-500 mt-1">{total} certificates</p>
          </div>
          <Badge
            className={
              expired > 0
                ? "bg-red-100 text-red-800"
                : expiring > 0
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800"
            }
          >
            {expired > 0 ? "Action Required" : expiring > 0 ? "Attention Needed" : "All Valid"}
          </Badge>
        </div>

        <div className="space-y-2 mb-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Valid</span>
              <span className="font-medium text-green-700">{valid}</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${validPercentage}%` }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Expiring Soon</span>
              <span className="font-medium text-yellow-700">{expiring}</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${expiringPercentage}%` }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Expired</span>
              <span className="font-medium text-red-700">{expired}</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 rounded-full" style={{ width: `${expiredPercentage}%` }}></div>
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-500 mt-3">
          <p className="font-medium mb-1">Includes:</p>
          <div className="flex flex-wrap gap-1">
            {roles.map((role, index) => (
              <Badge key={index} variant="outline" className="font-normal bg-gray-50">
                {role}
              </Badge>
            ))}
          </div>
        </div>

        <Button size="sm" className="w-full mt-3" variant="outline">
          <Eye className="mr-2 h-3.5 w-3.5" />
          View Details
        </Button>
      </CardContent>
    </Card>
  )
}

function CertificateStatus({ status, expiry }) {
  if (status === "na") {
    return <span className="text-xs text-gray-400">N/A</span>
  }

  const statusConfig = {
    valid: {
      icon: CheckCircle,
      iconClass: "text-green-500",
      textClass: "text-green-700",
    },
    expiring: {
      icon: Clock,
      iconClass: "text-yellow-500",
      textClass: "text-yellow-700 font-medium",
    },
    expired: {
      icon: AlertCircle,
      iconClass: "text-red-500",
      textClass: "text-red-700 font-medium",
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div className="flex items-center">
      <Icon className={`h-3.5 w-3.5 ${config.iconClass} mr-1`} />
      <span className={`text-xs ${config.textClass}`}>{expiry}</span>
    </div>
  )
}

function ExpiringCertificateItem({ name, position, certificate, expiryDate, daysRemaining }) {
  return (
    <div className="p-3 border rounded-md">
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-3">
            <AvatarFallback>
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{name}</p>
            <p className="text-xs text-gray-500">{position}</p>
          </div>
        </div>
        <Badge className={daysRemaining <= 30 ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}>
          {daysRemaining} days
        </Badge>
      </div>

      <div className="mt-3 pl-11">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">{certificate}</p>
            <p className="text-xs text-gray-500">Expires: {expiryDate}</p>
          </div>
          <Button size="sm">Initiate Renewal</Button>
        </div>
        <Progress
          value={Math.min(100, (daysRemaining / 90) * 100)}
          className="h-1.5 mt-2"
          indicatorClassName={daysRemaining <= 30 ? "bg-red-500" : "bg-yellow-500"}
        />
      </div>
    </div>
  )
}
