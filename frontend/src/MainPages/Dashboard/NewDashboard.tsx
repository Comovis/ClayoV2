"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Ship,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  FileText,
  Users,
  TrendingUp,
  Calendar,
  Filter,
  Plus,
  ArrowRight,
  Anchor,
  Shield,
  Globe,
  Activity,
  BarChart3,
  AlertCircle,
  Waves,
  Navigation,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Mock data - in real app this would come from your API
const mockData = {
  fleetSummary: {
    totalVessels: 12,
    activeVoyages: 8,
    inPort: 4,
    complianceScore: 87,
    documentsExpiring: 6,
    criticalAlerts: 2,
  },
  vessels: [
    {
      id: "1",
      name: "Humble Warrior",
      type: "Crude Oil Tanker",
      flag: "Panama",
      imo: "9123456",
      status: "at_sea",
      location: "North Atlantic",
      nextPort: "Rotterdam",
      eta: "2025-01-28T14:00:00",
      complianceScore: 92,
      documentsStatus: { valid: 28, expiring: 3, expired: 0, missing: 1 },
      lastInspection: "2024-11-15",
      inspectionResult: "no_deficiencies",
      avatar: "HW",
    },
    {
      id: "2",
      name: "Pacific Explorer",
      type: "Container Ship",
      flag: "Singapore",
      imo: "9234567",
      status: "in_port",
      location: "Singapore",
      nextPort: "Shanghai",
      eta: "2025-02-05T09:00:00",
      complianceScore: 95,
      documentsStatus: { valid: 31, expiring: 1, expired: 0, missing: 0 },
      lastInspection: "2024-12-01",
      inspectionResult: "no_deficiencies",
      avatar: "PE",
    },
    {
      id: "3",
      name: "Northern Star",
      type: "Bulk Carrier",
      flag: "Marshall Islands",
      imo: "9345678",
      status: "at_sea",
      location: "Mediterranean",
      nextPort: "Genoa",
      eta: "2025-01-30T16:00:00",
      complianceScore: 78,
      documentsStatus: { valid: 24, expiring: 4, expired: 2, missing: 2 },
      lastInspection: "2024-10-20",
      inspectionResult: "minor_deficiencies",
      avatar: "NS",
    },
  ],
  criticalAlerts: [
    {
      id: "1",
      type: "document_expiry",
      severity: "high",
      vessel: "Humble Warrior",
      title: "Safety Management Certificate Expiring",
      description: "SMC expires in 5 days during port stay in Rotterdam",
      dueDate: "2025-01-30",
      action: "Renew certificate",
    },
    {
      id: "2",
      type: "inspection_due",
      severity: "medium",
      vessel: "Northern Star",
      title: "Annual Safety Inspection Due",
      description: "Annual safety inspection overdue by 15 days",
      dueDate: "2025-01-10",
      action: "Schedule inspection",
    },
  ],
  upcomingPortCalls: [
    {
      id: "1",
      vessel: "Humble Warrior",
      port: "Rotterdam",
      country: "Netherlands",
      eta: "2025-01-28T14:00:00",
      etd: "2025-01-30T08:00:00",
      status: "approaching",
      daysUntil: 3,
      documentsReady: 85,
      riskLevel: "medium",
    },
    {
      id: "2",
      vessel: "Pacific Explorer",
      port: "Shanghai",
      country: "China",
      eta: "2025-02-05T09:00:00",
      etd: "2025-02-07T18:00:00",
      status: "scheduled",
      daysUntil: 11,
      documentsReady: 95,
      riskLevel: "low",
    },
  ],
  recentActivity: [
    {
      id: "1",
      type: "document_upload",
      vessel: "Pacific Explorer",
      description: "IOPP Certificate uploaded",
      timestamp: "2 hours ago",
      user: "Captain Smith",
    },
    {
      id: "2",
      type: "inspection_completed",
      vessel: "Humble Warrior",
      description: "Port State Control inspection completed - No deficiencies",
      timestamp: "1 day ago",
      user: "System",
    },
    {
      id: "3",
      type: "document_shared",
      vessel: "Northern Star",
      description: "Documents shared with Genoa Port Authority",
      timestamp: "2 days ago",
      user: "Maria Rodriguez",
    },
  ],
}

export default function MaritimeDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d")
  const [searchQuery, setSearchQuery] = useState("")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "at_sea":
        return "bg-blue-100 text-blue-800"
      case "in_port":
        return "bg-green-100 text-green-800"
      case "anchored":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "at_sea":
        return <Waves className="h-4 w-4" />
      case "in_port":
        return <Anchor className="h-4 w-4" />
      case "anchored":
        return <Navigation className="h-4 w-4" />
      default:
        return <Ship className="h-4 w-4" />
    }
  }

  const getComplianceColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-yellow-600"
    return "text-red-600"
  }

  const formatETA = (eta: string) => {
    const date = new Date(eta)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Tomorrow"
    if (diffDays < 7) return `${diffDays} days`
    return date.toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Fleet Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Fleet</p>
                  <p className="text-3xl font-bold text-slate-900">{mockData.fleetSummary.totalVessels}</p>
                  <p className="text-sm text-slate-500">
                    {mockData.fleetSummary.activeVoyages} at sea • {mockData.fleetSummary.inPort} in port
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Ship className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Compliance Score</p>
                  <p className="text-3xl font-bold text-slate-900">{mockData.fleetSummary.complianceScore}%</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <p className="text-sm text-green-600">+3% this month</p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Documents Expiring</p>
                  <p className="text-3xl font-bold text-slate-900">{mockData.fleetSummary.documentsExpiring}</p>
                  <p className="text-sm text-slate-500">Next 30 days</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Critical Alerts</p>
                  <p className="text-3xl font-bold text-slate-900">{mockData.fleetSummary.criticalAlerts}</p>
                  <p className="text-sm text-slate-500">Require attention</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Critical Alerts Section */}
        {mockData.criticalAlerts.length > 0 && (
          <Card className="mb-8 border-l-4 border-l-red-500">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-slate-900 flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                  Critical Alerts
                </CardTitle>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockData.criticalAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-start justify-between p-4 bg-red-50 rounded-lg border border-red-200"
                  >
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <Badge className="bg-red-100 text-red-800 mr-2">{alert.severity.toUpperCase()}</Badge>
                        <span className="text-sm font-medium text-slate-600">{alert.vessel}</span>
                      </div>
                      <h4 className="font-semibold text-slate-900 mb-1">{alert.title}</h4>
                      <p className="text-sm text-slate-600 mb-2">{alert.description}</p>
                      <div className="flex items-center text-xs text-slate-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        Due: {new Date(alert.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                    <Button size="sm" className="ml-4">
                      {alert.action}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Fleet Status */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-slate-900">Fleet Status</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Analytics
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockData.vessels.map((vessel) => (
                    <div
                      key={vessel.id}
                      className="p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                              {vessel.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-slate-900">{vessel.name}</h3>
                            <p className="text-sm text-slate-500">
                              {vessel.type} • {vessel.flag}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(vessel.status)}>
                            {getStatusIcon(vessel.status)}
                            <span className="ml-1 capitalize">{vessel.status.replace("_", " ")}</span>
                          </Badge>
                          <div className="text-right">
                            <p className={`text-sm font-semibold ${getComplianceColor(vessel.complianceScore)}`}>
                              {vessel.complianceScore}%
                            </p>
                            <p className="text-xs text-slate-500">Compliance</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Current Location</p>
                          <p className="text-sm font-medium text-slate-900 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {vessel.location}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Next Port</p>
                          <p className="text-sm font-medium text-slate-900">{vessel.nextPort}</p>
                          <p className="text-xs text-slate-500">ETA: {formatETA(vessel.eta)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Last Inspection</p>
                          <p className="text-sm font-medium text-slate-900">
                            {new Date(vessel.lastInspection).toLocaleDateString()}
                          </p>
                          <div className="flex items-center">
                            {vessel.inspectionResult === "no_deficiencies" ? (
                              <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                            ) : (
                              <AlertCircle className="h-3 w-3 text-yellow-500 mr-1" />
                            )}
                            <p className="text-xs text-slate-500 capitalize">
                              {vessel.inspectionResult.replace("_", " ")}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-xs">
                          <span className="flex items-center text-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {vessel.documentsStatus.valid} Valid
                          </span>
                          {vessel.documentsStatus.expiring > 0 && (
                            <span className="flex items-center text-yellow-600">
                              <Clock className="h-3 w-3 mr-1" />
                              {vessel.documentsStatus.expiring} Expiring
                            </span>
                          )}
                          {vessel.documentsStatus.expired > 0 && (
                            <span className="flex items-center text-red-600">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {vessel.documentsStatus.expired} Expired
                            </span>
                          )}
                          {vessel.documentsStatus.missing > 0 && (
                            <span className="flex items-center text-slate-600">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              {vessel.documentsStatus.missing} Missing
                            </span>
                          )}
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Port Calls */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-slate-900 flex items-center">
                  <MapPin className="h-5 w-5 text-blue-500 mr-2" />
                  Upcoming Port Calls
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockData.upcomingPortCalls.map((portCall) => (
                    <div key={portCall.id} className="p-3 border border-slate-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-slate-900">{portCall.port}</h4>
                        <Badge
                          className={
                            portCall.riskLevel === "low"
                              ? "bg-green-100 text-green-800"
                              : portCall.riskLevel === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }
                        >
                          {portCall.riskLevel} risk
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{portCall.vessel}</p>
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                        <span>ETA: {formatETA(portCall.eta)}</span>
                        <span>{portCall.daysUntil} days</span>
                      </div>
                      <div className="mb-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span>Documents Ready</span>
                          <span>{portCall.documentsReady}%</span>
                        </div>
                        <Progress value={portCall.documentsReady} className="h-2" />
                      </div>
                      <Button size="sm" variant="outline" className="w-full">
                        Prepare Port Call
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-slate-900 flex items-center">
                  <Activity className="h-5 w-5 text-green-500 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockData.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">{activity.description}</p>
                        <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
                          <span>{activity.vessel}</span>
                          <span>{activity.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View All Activity
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-slate-900">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Invite Team Member
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Globe className="h-4 w-4 mr-2" />
                    Share Documents
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
