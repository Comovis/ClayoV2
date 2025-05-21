"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, AlertCircle, Ship, Calendar, FileText, Clock, MapPin, Eye, Share2, Upload, Shield } from 'lucide-react'
import { Progress } from "@/components/ui/progress"
import DocumentUploadModal from "../../MainComponents/UploadModal/UploadModal"
import { useUser } from "../../Auth/Contexts/UserContext"

export default function Dashboard({ hideSidebar = false }) {
  // Add this near the top of your component
  const { isAuthenticated, isLoading, user, company } = useUser()

  console.log("Dashboard rendering with auth state:", { isAuthenticated, isLoading, user, company })

  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [selectedVesselForUpload, setSelectedVesselForUpload] = useState<string | undefined>(undefined)

  // Handle upload completion
  const handleUploadComplete = (documentData: any) => {
    console.log("Document uploaded:", documentData)
    // You would update your documents state/cache here
    setUploadModalOpen(false)
    // Optionally show a success notification
  }

  // Add conditional rendering based on loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  // If not authenticated and not loading, this should be handled by ProtectedRoute
  // But we can add an extra check here for safety
  if (!isAuthenticated && !isLoading) {
    console.log("Dashboard: User not authenticated but somehow reached this component")
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">You need to be logged in to view this page.</p>
          <Button 
            className="mt-4" 
            onClick={() => window.location.href = "/login"}
          >
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-100">
      {/* Main Content */}
      <main className="p-6">
        <div className="grid grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Fleet Overview</h3>
                <Badge className="bg-blue-100 text-blue-800">3 Vessels</Badge>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Compliance Score</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Document Validity</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Inspection Readiness</span>
                    <span className="font-medium">65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Document Status</h3>
                <Button variant="outline" size="sm" onClick={() => window.location.href = "/document-hub"}>
                  <Eye className="h-4 w-4 mr-1" />
                  View All
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 border border-green-100 rounded-md p-3 flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Valid</p>
                    <p className="text-2xl font-bold">28</p>
                  </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-100 rounded-md p-3 flex items-center">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Expiring Soon</p>
                    <p className="text-2xl font-bold">6</p>
                  </div>
                </div>
                <div className="bg-red-50 border border-red-100 rounded-md p-3 flex items-center">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Expired</p>
                    <p className="text-2xl font-bold">1</p>
                  </div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-md p-3 flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                    <AlertTriangle className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Missing</p>
                    <p className="text-2xl font-bold">3</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Upcoming Port Calls</h3>
                <Button variant="outline" size="sm" onClick={() => window.location.href = "/port-preparation"}>
                  <Calendar className="h-4 w-4 mr-1" />
                  View All
                </Button>
              </div>
              <div className="space-y-3">
                <div 
                  className="flex items-center p-2 bg-blue-50 border border-blue-100 rounded-md cursor-pointer"
                  onClick={() => window.location.href = "/port-preparation"}
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">Singapore</p>
                      <Badge className="bg-yellow-100 text-yellow-800">Medium Risk</Badge>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Ship className="h-3 w-3 mr-1" />
                      <span>Humble Warrior</span>
                      <span className="mx-1">•</span>
                      <span>Nov 15, 2023</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center p-2 border rounded-md cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                    <MapPin className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">Shanghai</p>
                      <Badge className="bg-green-100 text-green-800">Low Risk</Badge>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Ship className="h-3 w-3 mr-1" />
                      <span>Humble Warrior</span>
                      <span className="mx-1">•</span>
                      <span>Dec 5, 2023</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center p-2 border rounded-md cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                    <MapPin className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">Rotterdam</p>
                      <Badge className="bg-green-100 text-green-800">Low Risk</Badge>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Ship className="h-3 w-3 mr-1" />
                      <span>Pacific Explorer</span>
                      <span className="mx-1">•</span>
                      <span>Nov 25, 2023</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Attention Required</h2>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                <div className="p-4 flex items-start">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Ship Security Plan Missing</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Humble Warrior is missing a required Ship Security Plan document. This is a common deficiency
                          found during PSC inspections.
                        </p>
                      </div>
                      <Badge className="bg-red-100 text-red-800">High Priority</Badge>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        <Ship className="h-3 w-3 inline mr-1" />
                        Humble Warrior
                        <span className="mx-1">•</span>
                        <Calendar className="h-3 w-3 inline mx-1" />
                        Required for Singapore (Nov 15)
                      </div>
                      <div>
                        <Button 
                          size="sm"
                          onClick={() => {
                            setSelectedVesselForUpload("Humble Warrior")
                            setUploadModalOpen(true)
                          }}
                        >
                          Upload Document
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 flex items-start">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Safety Management Certificate Expiring Soon</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Humble Warrior's Safety Management Certificate expires in 28 days (Nov 20, 2023), during the
                          scheduled port stay in Singapore.
                        </p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">Medium Priority</Badge>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        <Ship className="h-3 w-3 inline mr-1" />
                        Humble Warrior
                        <span className="mx-1">•</span>
                        <Calendar className="h-3 w-3 inline mx-1" />
                        Expires Nov 20, 2023
                      </div>
                      <div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => window.location.href = "/document-hub"}
                        >
                          Start Renewal Process
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 flex items-start">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Singapore PSC Inspection Preparation Required</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Humble Warrior has a medium risk of PSC inspection in Singapore. Current focus areas include
                          fire safety systems and MARPOL Annex I compliance.
                        </p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">Medium Priority</Badge>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        <Ship className="h-3 w-3 inline mr-1" />
                        Humble Warrior
                        <span className="mx-1">•</span>
                        <Calendar className="h-3 w-3 inline mx-1" />
                        Singapore arrival Nov 15, 2023
                      </div>
                      <div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => window.location.href = "/compliance"}
                        >
                          Prepare for Inspection
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-bold mb-4">Vessel Overview</h2>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
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
              </CardContent>
            </Card>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  <ActivityItem
                    icon={Upload}
                    iconColor="text-green-500"
                    iconBg="bg-green-100"
                    title="Safety Equipment Certificate uploaded"
                    description="Certificate uploaded for Pacific Explorer"
                    timestamp="Today, 10:23 AM"
                    user="Maria Rodriguez"
                  />

                  <ActivityItem
                    icon={Share2}
                    iconColor="text-blue-500"
                    iconBg="bg-blue-100"
                    title="Documents shared with Singapore MPA"
                    description="4 documents shared for Humble Warrior"
                    timestamp="Yesterday, 3:45 PM"
                    user="John Smith"
                  />

                  <ActivityItem
                    icon={AlertCircle}
                    iconColor="text-yellow-500"
                    iconBg="bg-yellow-100"
                    title="Certificate expiry warning"
                    description="IOPP Certificate expires in 45 days for Humble Warrior"
                    timestamp="Yesterday, 11:30 AM"
                    user="System"
                  />

                  <ActivityItem
                    icon={Shield}
                    iconColor="text-purple-500"
                    iconBg="bg-purple-100"
                    title="Deficiency prevention alert"
                    description="Potential inconsistency detected in vessel particulars"
                    timestamp="Oct 19, 2023"
                    user="System"
                  />

                  <ActivityItem
                    icon={MapPin}
                    iconColor="text-blue-500"
                    iconBg="bg-blue-100"
                    title="New port call created"
                    description="Singapore port call added for Humble Warrior"
                    timestamp="Oct 18, 2023"
                    user="Maria Rodriguez"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Quick Access</h2>
          <div className="grid grid-cols-4 gap-4">
            <QuickAccessCard
              icon={FileText}
              title="Document Hub"
              description="Manage vessel certificates and documents"
              link="/document-hub"
              color="bg-blue-500"
            />

            <QuickAccessCard
              icon={Shield}
              title="Deficiency Prevention"
              description="Identify and prevent potential PSC issues"
              link="/compliance"
              color="bg-purple-500"
            />

            <QuickAccessCard
              icon={MapPin}
              title="Port Preparation"
              description="Prepare for upcoming port calls"
              link="/port-preparation"
              color="bg-green-500"
            />

            <QuickAccessCard
              icon={Share2}
              title="Document Sharing"
              description="Securely share documents with stakeholders"
              link="/document-sharing"
              color="bg-orange-500"
            />
          </div>
        </div>
      </main>

      {/* Document Upload Modal */}
      <DocumentUploadModal 
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        initialVesselId={selectedVesselForUpload}
        onUploadComplete={handleUploadComplete}
      />
    </div>
  )
}

interface VesselOverviewItemProps {
  name: string
  type: string
  flag: string
  complianceScore: number
  documentStatus: {
    valid: number
    expiringSoon: number
    expired: number
    missing: number
  }
}

function VesselOverviewItem({ name, type, flag, complianceScore, documentStatus }: VesselOverviewItemProps) {
  let scoreColor = "bg-red-500"
  if (complianceScore >= 90) scoreColor = "bg-green-500"
  else if (complianceScore >= 70) scoreColor = "bg-yellow-500"

  return (
    <div className="p-4 flex items-center">
      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
        <Ship className="h-5 w-5 text-blue-600" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <h4 className="font-medium">{name}</h4>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 mr-2">
              <span className="text-sm font-medium">{complianceScore}</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.location.href = "/document-hub"}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <span>{type}</span>
          <span className="mx-1">•</span>
          <span>{flag}</span>
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
    </div>
  )
}

interface ActivityItemProps {
  icon: any
  iconColor: string
  iconBg: string
  title: string
  description: string
  timestamp: string
  user: string
}

function ActivityItem({ icon: Icon, iconColor, iconBg, title, description, timestamp, user }: ActivityItemProps) {
  return (
    <div className="p-4 flex items-start">
      <div className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center mr-3 flex-shrink-0`}>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </div>
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
        <div className="flex items-center mt-1 text-xs text-gray-500">
          <Clock className="h-3 w-3 mr-1" />
          <span>{timestamp}</span>
          <span className="mx-1">•</span>
          <span>{user}</span>
        </div>
      </div>
    </div>
  )
}

interface QuickAccessCardProps {
  icon: any
  title: string
  description: string
  link: string
  color: string
}

function QuickAccessCard({ icon: Icon, title, description, link, color }: QuickAccessCardProps) {
  return (
    <div 
      className="cursor-pointer"
      onClick={() => window.location.href = link}
    >
      <Card className="hover:shadow-md transition-shadow h-full">
        <CardContent className="p-6">
          <div className={`w-12 h-12 rounded-lg ${color} text-white flex items-center justify-center mb-4`}>
            <Icon className="h-6 w-6" />
          </div>
          <h3 className="font-medium mb-1">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </CardContent>
      </Card>
    </div>
  )
}
