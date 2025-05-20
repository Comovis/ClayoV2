"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Ship,
  Calendar,
  Clock,
  MapPin,
  Search,
  FileText,
  Share2,
  Plus,
  ArrowUpRight,
  Bell,
  Anchor,
  Briefcase,
} from "lucide-react"

export default function AgentLiteDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("upcoming")

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="bg-white border-b p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Anchor className="h-8 w-8 text-blue-600 mr-2" />
            <h1 className="text-xl font-bold">
              Comovis <span className="text-blue-600">Agent</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Notifications</span>
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-blue-100 text-blue-600">CL</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Agent Dashboard</h1>
            <p className="text-gray-500">Captain Logistics • Singapore</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Client Vessel
            </Button>
            <Button>
              <Share2 className="h-4 w-4 mr-2" />
              Invite Vessel Owner
            </Button>
          </div>
        </div>

        {/* Agent Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-500">Client Vessels</h3>
                <Ship className="h-5 w-5 text-blue-500" />
              </div>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">12</span>
                <span className="text-sm text-green-600 ml-2">+2 this month</span>
              </div>
              <div className="mt-4 flex justify-between text-sm">
                <span className="text-gray-500">Vessel owners: 5</span>
                <Button variant="link" size="sm" className="p-0 h-auto">
                  View all
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-500">Upcoming Port Calls</h3>
                <Anchor className="h-5 w-5 text-blue-500" />
              </div>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">8</span>
                <span className="text-sm text-gray-600 ml-2">next 30 days</span>
              </div>
              <div className="mt-4 flex justify-between text-sm">
                <span className="text-gray-500">High priority: 3</span>
                <Button variant="link" size="sm" className="p-0 h-auto">
                  View all
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-500">Document Actions</h3>
                <FileText className="h-5 w-5 text-blue-500" />
              </div>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">15</span>
                <span className="text-sm text-yellow-600 ml-2">require attention</span>
              </div>
              <div className="mt-4 flex justify-between text-sm">
                <span className="text-gray-500">Expiring soon: 9</span>
                <Button variant="link" size="sm" className="p-0 h-auto">
                  View all
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Port Calls and Vessels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>Upcoming Port Calls</CardTitle>
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
                    <TabsList>
                      <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                      <TabsTrigger value="active">Active</TabsTrigger>
                      <TabsTrigger value="completed">Completed</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  <PortCallItem
                    vesselName="Humble Warrior"
                    vesselType="Crude Oil Tanker"
                    port="Singapore"
                    eta="Nov 15, 2023"
                    daysAway={28}
                    documentStatus={{
                      valid: 12,
                      expiringSoon: 3,
                      expired: 0,
                      missing: 1,
                    }}
                    priority="medium"
                  />

                  <PortCallItem
                    vesselName="Pacific Explorer"
                    vesselType="Container Ship"
                    port="Singapore"
                    eta="Nov 25, 2023"
                    daysAway={38}
                    documentStatus={{
                      valid: 14,
                      expiringSoon: 1,
                      expired: 0,
                      missing: 0,
                    }}
                    priority="low"
                  />

                  <PortCallItem
                    vesselName="Northern Star"
                    vesselType="Bulk Carrier"
                    port="Singapore"
                    eta="Dec 10, 2023"
                    daysAway={53}
                    documentStatus={{
                      valid: 10,
                      expiringSoon: 2,
                      expired: 1,
                      missing: 2,
                    }}
                    priority="high"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Document Actions Required</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  <DocumentActionItem
                    vesselName="Humble Warrior"
                    documentName="Safety Management Certificate"
                    issue="Expires in 28 days (during port stay)"
                    dueDate="Nov 20, 2023"
                    priority="medium"
                  />

                  <DocumentActionItem
                    vesselName="Northern Star"
                    documentName="Ship Security Plan"
                    issue="Document missing"
                    dueDate="Required for port entry"
                    priority="high"
                  />

                  <DocumentActionItem
                    vesselName="Pacific Explorer"
                    documentName="International Oil Pollution Prevention Certificate"
                    issue="Expires in 45 days"
                    dueDate="Dec 10, 2023"
                    priority="low"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>Client Vessels</CardTitle>
                  <div className="relative w-[180px]">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search vessels..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y max-h-[400px] overflow-auto">
                  <ClientVesselItem
                    name="Humble Warrior"
                    type="Crude Oil Tanker"
                    flag="Panama"
                    owner="Mediterranean Shipping"
                    documentStatus={{
                      valid: 12,
                      expiringSoon: 3,
                      expired: 0,
                      missing: 1,
                    }}
                  />

                  <ClientVesselItem
                    name="Pacific Explorer"
                    type="Container Ship"
                    flag="Singapore"
                    owner="Mediterranean Shipping"
                    documentStatus={{
                      valid: 14,
                      expiringSoon: 1,
                      expired: 0,
                      missing: 0,
                    }}
                  />

                  <ClientVesselItem
                    name="Northern Star"
                    type="Bulk Carrier"
                    flag="Marshall Islands"
                    owner="Global Carriers Ltd"
                    documentStatus={{
                      valid: 10,
                      expiringSoon: 2,
                      expired: 1,
                      missing: 2,
                    }}
                  />

                  <ClientVesselItem
                    name="Atlantic Voyager"
                    type="Container Ship"
                    flag="Liberia"
                    owner="Global Carriers Ltd"
                    documentStatus={{
                      valid: 15,
                      expiringSoon: 0,
                      expired: 0,
                      missing: 0,
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Vessel Owners</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  <VesselOwnerItem name="Mediterranean Shipping" vessels={2} subscription="None" />

                  <VesselOwnerItem name="Global Carriers Ltd" vessels={2} subscription="None" />

                  <VesselOwnerItem name="Nordic Tankers" vessels={3} subscription="Trial" />
                </div>
                <div className="p-4">
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Vessel Owner
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Upsell Section */}
        <Card className="mt-6 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-lg font-bold text-blue-800">Upgrade Your Clients to Comovis Pro</h3>
                <p className="text-blue-700 mt-1">
                  Help your clients improve compliance and reduce detention risk with the full Comovis platform.
                </p>
                <ul className="mt-2 space-y-1">
                  <li className="flex items-center text-sm text-blue-700">
                    <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                    Earn 20% commission on first-year subscriptions
                  </li>
                  <li className="flex items-center text-sm text-blue-700">
                    <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                    Unlock premium features for your Agent dashboard
                  </li>
                  <li className="flex items-center text-sm text-blue-700">
                    <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                    Provide better service with advanced compliance tools
                  </li>
                </ul>
              </div>
              <div className="flex flex-col gap-2">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  Invite Vessel Owner
                </Button>
                <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-200">
                  Learn More About Partner Program
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

function PortCallItem({ vesselName, vesselType, port, eta, daysAway, documentStatus, priority }) {
  const priorityConfig = {
    low: {
      badge: "Low Risk",
      badgeClass: "bg-green-100 text-green-800",
    },
    medium: {
      badge: "Medium Risk",
      badgeClass: "bg-yellow-100 text-yellow-800",
    },
    high: {
      badge: "High Risk",
      badgeClass: "bg-red-100 text-red-800",
    },
  }

  const config = priorityConfig[priority]

  return (
    <div className="p-4 hover:bg-gray-50">
      <div className="flex justify-between items-start">
        <div className="flex items-start">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
            <Ship className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-medium">{vesselName}</h4>
            <p className="text-sm text-gray-500">{vesselType}</p>
            <div className="flex items-center mt-1 text-sm">
              <MapPin className="h-3.5 w-3.5 text-gray-500 mr-1" />
              <span>{port}</span>
              <span className="mx-1">•</span>
              <Calendar className="h-3.5 w-3.5 text-gray-500 mr-1" />
              <span>{eta}</span>
              <span className="text-blue-600 ml-1">({daysAway} days)</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <Badge className={config.badgeClass}>{config.badge}</Badge>
          <div className="flex space-x-1 mt-2">
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
      <div className="flex justify-end mt-3">
        <Button size="sm" variant="outline" className="mr-2">
          <FileText className="h-3.5 w-3.5 mr-1" />
          Documents
        </Button>
        <Button size="sm">
          <Share2 className="h-3.5 w-3.5 mr-1" />
          Share Requirements
        </Button>
      </div>
    </div>
  )
}

function DocumentActionItem({ vesselName, documentName, issue, dueDate, priority }) {
  const priorityConfig = {
    low: {
      icon: Clock,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-100",
    },
    medium: {
      icon: AlertTriangle,
      iconColor: "text-yellow-500",
      iconBg: "bg-yellow-100",
    },
    high: {
      icon: AlertCircle,
      iconColor: "text-red-500",
      iconBg: "bg-red-100",
    },
  }

  const config = priorityConfig[priority]
  const Icon = config.icon

  return (
    <div className="p-4 hover:bg-gray-50">
      <div className="flex items-start">
        <div className={`w-10 h-10 rounded-full ${config.iconBg} flex items-center justify-center mr-3 flex-shrink-0`}>
          <Icon className={`h-5 w-5 ${config.iconColor}`} />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium">{documentName}</h4>
              <p className="text-sm text-gray-600 mt-1">{issue}</p>
            </div>
            <Badge
              className={
                priority === "high"
                  ? "bg-red-100 text-red-800"
                  : priority === "medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-blue-100 text-blue-800"
              }
            >
              {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
            </Badge>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              <Ship className="h-3 w-3 inline mr-1" />
              {vesselName}
              <span className="mx-1">•</span>
              <Calendar className="h-3 w-3 inline mx-1" />
              {dueDate}
            </div>
            <div>
              <Button size="sm">Notify Owner</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ClientVesselItem({ name, type, flag, owner, documentStatus }) {
  return (
    <div className="p-4 hover:bg-gray-50">
      <div className="flex items-center mb-2">
        <Ship className="h-4 w-4 text-gray-500 mr-2" />
        <h3 className="font-medium">{name}</h3>
      </div>
      <p className="text-sm text-gray-500 mb-2">
        {type} • {flag}
      </p>
      <p className="text-xs text-gray-500 mb-2">
        <Briefcase className="h-3 w-3 inline mr-1" />
        Owner: {owner}
      </p>
      <div className="flex space-x-2">
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
      <div className="flex justify-between mt-3">
        <Button size="sm" variant="outline">
          <FileText className="h-3.5 w-3.5 mr-1" />
          Documents
        </Button>
        <Button size="sm" variant="outline">
          <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
          Invite to Comovis
        </Button>
      </div>
    </div>
  )
}

function VesselOwnerItem({ name, vessels, subscription }) {
  return (
    <div className="p-4 hover:bg-gray-50">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="font-medium">{name}</h4>
          <p className="text-sm text-gray-500">
            <Ship className="h-3 w-3 inline mr-1" />
            {vessels} vessels
          </p>
        </div>
        <div>
          {subscription === "None" ? (
            <Badge className="bg-gray-100 text-gray-800">No Subscription</Badge>
          ) : subscription === "Trial" ? (
            <Badge className="bg-blue-100 text-blue-800">Trial</Badge>
          ) : (
            <Badge className="bg-green-100 text-green-800">Subscribed</Badge>
          )}
        </div>
      </div>
      <div className="flex justify-end mt-3">
        <Button size="sm" variant={subscription === "None" ? "default" : "outline"}>
          <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
          {subscription === "None" ? "Invite to Comovis" : "Manage Access"}
        </Button>
      </div>
    </div>
  )
}
