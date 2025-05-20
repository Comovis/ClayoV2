"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"

export default function InteractiveDemo() {
  const [activeDemo, setActiveDemo] = useState("document-hub")

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
          <TabsList className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-transparent h-auto p-0 mb-8">
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
          </TabsList>

          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 shadow-sm">
            <TabsContent value="document-hub" className="m-0">
              <DocumentHubDemo />
            </TabsContent>

            <TabsContent value="port-prep" className="m-0">
              <PortPrepDemo />
            </TabsContent>

            <TabsContent value="document-sharing" className="m-0">
              <DocumentSharingDemo />
            </TabsContent>

            <TabsContent value="fleet-management" className="m-0">
              <FleetManagementDemo />
            </TabsContent>
          </div>
        </Tabs>
      </div>
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

function DocumentHubDemo() {
  return (
    <div>
      <h3 className="text-xl font-bold text-slate-900 mb-4">Document Hub</h3>
      <p className="text-slate-600 mb-6">
        Centralize all vessel certificates and documents in one secure location with automatic expiry tracking and
        renewal reminders.
      </p>

      <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
        <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
          <div className="flex items-center">
            <Ship className="h-5 w-5 text-slate-700 mr-2" />
            <h4 className="font-medium text-slate-800">Humble Warrior • Crude Oil Tanker • Panama</h4>
          </div>
          <Button size="sm" className="bg-slate-800 hover:bg-slate-700">
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
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

          <div className="space-y-3">
            <DocumentCard
              title="Safety Management Certificate"
              issuer="Panama Maritime Authority"
              status="warning"
              expiryDays={28}
            />
            <DocumentCard
              title="International Oil Pollution Prevention Certificate"
              issuer="DNV GL"
              status="warning"
              expiryDays={45}
            />
            <DocumentCard
              title="Certificate of Registry"
              issuer="Panama Maritime Authority"
              status="valid"
              expiryDays={365}
            />
            <DocumentCard title="International Load Line Certificate" issuer="DNV GL" status="valid" expiryDays={395} />
          </div>

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

function PortPrepDemo() {
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
            <PortRequirementItem
              title="Safety Management Certificate"
              status="warning"
              message="Expires in 28 days (during port stay)"
            />
            <PortRequirementItem title="Ship Security Plan" status="error" message="Document missing" />
          </div>

          <div className="bg-slate-100 border border-slate-200 rounded-md p-3">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-slate-700 mr-2 mt-0.5" />
              <div>
                <h4 className="font-medium text-slate-800">Port Intelligence Update</h4>
                <p className="text-sm text-slate-600">
                  Singapore MPA has announced a Concentrated Inspection Campaign focusing on MARPOL Annex I compliance.
                </p>
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

function DocumentSharingDemo() {
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
              <label className="block text-sm font-medium text-slate-700 mb-1">Recipient</label>
              <div className="flex items-center p-2 bg-slate-50 rounded-md border border-slate-200">
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center mr-2">
                  S
                </div>
                <div>
                  <p className="font-medium text-slate-800">Singapore MPA</p>
                  <p className="text-xs text-slate-500">portdocs@mpa.gov.sg</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">Documents to Share</label>
            <Card className="border-slate-200">
              <CardContent className="p-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <div className="flex items-center">
                      <input type="checkbox" className="mr-2" checked readOnly />
                      <div>
                        <p className="font-medium text-slate-800">Safety Management Certificate</p>
                        <p className="text-xs text-slate-500">Panama Maritime Authority</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs text-yellow-600 mr-2">Expires in 28 days</span>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-700 hover:bg-slate-100">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <div className="flex items-center">
                      <input type="checkbox" className="mr-2" checked readOnly />
                      <div>
                        <p className="font-medium text-slate-800">International Oil Pollution Prevention Certificate</p>
                        <p className="text-xs text-slate-500">DNV GL</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs text-yellow-600 mr-2">Expires in 45 days</span>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-700 hover:bg-slate-100">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <div className="flex items-center">
                      <input type="checkbox" className="mr-2" checked readOnly />
                      <div>
                        <p className="font-medium text-slate-800">Certificate of Registry</p>
                        <p className="text-xs text-slate-500">Panama Maritime Authority</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs text-green-600 mr-2">Valid</span>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-700 hover:bg-slate-100">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" className="text-slate-700 border-slate-300 hover:bg-slate-100">
              Cancel
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" className="text-slate-700 border-slate-300 hover:bg-slate-100">
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Button className="bg-slate-800 hover:bg-slate-700">
                <Share2 className="mr-2 h-4 w-4" />
                Share Documents
              </Button>
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
          <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-100">3 Vessels</Badge>
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
            />
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

function DocumentCard({ title, issuer, status, expiryDays }) {
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
    <Card className={`border-l-4 ${config.className} border-slate-200`}>
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
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function PortRequirementItem({ title, status, message }) {
  const statusConfig = {
    success: {
      icon: CheckCircle,
      iconClass: "text-green-500",
      messageClass: "text-green-700",
    },
    warning: {
      icon: Clock,
      iconClass: "text-yellow-500",
      messageClass: "text-yellow-700",
    },
    error: {
      icon: AlertCircle,
      iconClass: "text-red-500",
      messageClass: "text-red-700",
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100">
      <div className="flex items-center">
        <FileText className="h-4 w-4 text-slate-500 mr-2" />
        <span className="font-medium text-slate-800">{title}</span>
      </div>
      <div className="flex items-center">
        <div className="flex items-center mr-4">
          <Icon className={`h-4 w-4 ${config.iconClass} mr-1`} />
          <span className={`text-sm ${config.messageClass}`}>{message}</span>
        </div>
        <Button size="sm" className="h-7 bg-slate-800 hover:bg-slate-700">
          {status === "error" ? "Upload" : "View"}
        </Button>
      </div>
    </div>
  )
}

function VesselOverviewItem({ name, type, flag, complianceScore, documentStatus }) {
  let scoreColor = "bg-red-500"
  if (complianceScore >= 90) scoreColor = "bg-green-500"
  else if (complianceScore >= 70) scoreColor = "bg-yellow-500"

  return (
    <div className="p-3 border border-slate-200 rounded-md">
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
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 mr-2">
            <span className="text-sm font-medium text-slate-800">{complianceScore}</span>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-700 hover:bg-slate-100">
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex space-x-2 mt-2">
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
    </div>
  )
}
