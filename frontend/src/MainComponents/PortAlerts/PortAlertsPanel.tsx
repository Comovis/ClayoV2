"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Bell,
  AlertTriangle,
  Clock,
  Calendar,
  CheckCircle,
  Search,
  Filter,
  ArrowLeft,
  ExternalLink,
  Ship,
  MapPin,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

type PortAlert = {
  id: string
  portId: string
  portName: string
  country: string
  vesselId: string
  vesselName: string
  message: string
  type: "warning" | "info" | "critical"
  documentIds?: string[]
  createdAt: string
  isRead: boolean
  actionRequired: boolean
  dueDate?: string
  fullContent?: string
  requiredDocuments?: string[]
}

interface PortAlertsPanelProps {
  isOpen: boolean
  onClose: () => void
  alerts: PortAlert[]
  selectedAlertId?: string | null
  onMarkAsRead: (alertId: string) => void
}

export default function PortAlertsPanel({
  isOpen,
  onClose,
  alerts,
  selectedAlertId,
  onMarkAsRead,
}: PortAlertsPanelProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterPort, setFilterPort] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const [viewMode, setViewMode] = useState<"list" | "detail">(selectedAlertId ? "detail" : "list")
  const [currentAlertId, setCurrentAlertId] = useState<string | null>(selectedAlertId)

  // Update view mode and current alert when selectedAlertId changes
  useEffect(() => {
    if (selectedAlertId) {
      setCurrentAlertId(selectedAlertId)
      setViewMode("detail")
    } else if (isOpen) {
      setViewMode("list")
    }
  }, [selectedAlertId, isOpen])

  // Get unique ports from alerts
  const uniquePorts = [...new Set(alerts.map((alert) => alert.portName))]

  // Get the current alert if in detail view
  const currentAlert = currentAlertId ? alerts.find((alert) => alert.id === currentAlertId) : null

  // Filter alerts based on search, type, port, and tab
  const filteredAlerts = alerts.filter((alert) => {
    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      alert.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.portName.toLowerCase().includes(searchQuery.toLowerCase())

    // Type filter
    const matchesType = filterType === "all" || alert.type === filterType

    // Port filter
    const matchesPort = filterPort === "all" || alert.portName === filterPort

    // Tab filter
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "unread" && !alert.isRead) ||
      (activeTab === "actionRequired" && alert.actionRequired)

    return matchesSearch && matchesType && matchesPort && matchesTab
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "info":
      default:
        return <Bell className="h-5 w-5 text-blue-500" />
    }
  }

  const getAlertBadge = (type: string) => {
    switch (type) {
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">Action Required</Badge>
      case "critical":
        return <Badge className="bg-red-100 text-red-800">Urgent</Badge>
      case "info":
      default:
        return <Badge className="bg-blue-100 text-blue-800">Information</Badge>
    }
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    return `${Math.floor(diffInSeconds / 86400)} days ago`
  }

  const handleViewAlert = (alertId: string) => {
    setCurrentAlertId(alertId)
    setViewMode("detail")
  }

  const handleBackToList = () => {
    setViewMode("list")
    setCurrentAlertId(null)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl md:max-w-2xl overflow-auto p-0"
        overlayClassName="bg-black/60"
      >
        {viewMode === "list" ? (
          <div className="p-6 h-full flex flex-col">
            <SheetHeader className="mb-4">
              <SheetTitle>Port Requirement Alerts</SheetTitle>
              <SheetDescription>View and manage all alerts across your fleet and upcoming port calls</SheetDescription>
            </SheetHeader>

            <div className="space-y-4 flex-1 flex flex-col overflow-hidden">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-grow">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search alerts..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[130px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="info">Information</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterPort} onValueChange={setFilterPort}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Filter by port" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ports</SelectItem>
                      {uniquePorts.map((port) => (
                        <SelectItem key={port} value={port}>
                          {port}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Tabs defaultValue="all" className="flex-1 flex flex-col" onValueChange={setActiveTab} value={activeTab}>
                <TabsList>
                  <TabsTrigger value="all">All Alerts</TabsTrigger>
                  <TabsTrigger value="unread">Unread</TabsTrigger>
                  <TabsTrigger value="actionRequired">Action Required</TabsTrigger>
                </TabsList>

                <div className="mt-2 text-sm text-gray-500">
                  {filteredAlerts.length} {filteredAlerts.length === 1 ? "alert" : "alerts"} found
                </div>

                <ScrollArea className="flex-1 mt-2">
                  <div className="space-y-3 pr-4">
                    {filteredAlerts.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <Bell className="h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-600">No Alerts Found</h3>
                        <p className="text-gray-500 mt-1">Try adjusting your filters or search query</p>
                      </div>
                    ) : (
                      filteredAlerts.map((alert) => (
                        <Alert
                          key={alert.id}
                          className={`border-l-4 cursor-pointer ${
                            alert.type === "critical"
                              ? "border-l-red-500 bg-red-50"
                              : alert.type === "warning"
                                ? "border-l-yellow-500 bg-yellow-50"
                                : "border-l-blue-500 bg-blue-50"
                          } ${!alert.isRead ? "ring-1 ring-blue-200" : ""}`}
                          onClick={() => handleViewAlert(alert.id)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-start">
                              {getAlertIcon(alert.type)}
                              <div className="ml-2">
                                <AlertTitle className="flex items-center">
                                  {alert.portName}, {alert.country}
                                  {!alert.isRead && (
                                    <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                                  )}
                                </AlertTitle>
                                <AlertDescription className="mt-1 line-clamp-2">{alert.message}</AlertDescription>

                                <div className="flex flex-wrap items-center mt-2 gap-2">
                                  <div className="flex items-center text-xs text-gray-500">
                                    <Ship className="h-3 w-3 mr-1" />
                                    {alert.vesselName}
                                  </div>
                                  <div className="flex items-center text-xs text-gray-500">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {getTimeAgo(alert.createdAt)}
                                  </div>
                                  {alert.dueDate && (
                                    <div className="flex items-center text-xs text-gray-500">
                                      <Calendar className="h-3 w-3 mr-1" />
                                      Due: {formatDate(alert.dueDate)}
                                    </div>
                                  )}
                                  {getAlertBadge(alert.type)}
                                </div>
                              </div>
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 rounded-full"
                              onClick={(e) => {
                                e.stopPropagation()
                                onMarkAsRead(alert.id)
                              }}
                            >
                              {alert.isRead ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <CheckCircle className="h-4 w-4 text-gray-300" />
                              )}
                            </Button>
                          </div>
                        </Alert>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </Tabs>
            </div>
          </div>
        ) : (
          <>
            {currentAlert && (
              <div className="overflow-auto h-full">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <Button variant="ghost" size="sm" onClick={handleBackToList} className="mr-2">
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Back to Alerts
                    </Button>
                    <div className="flex-1"></div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 rounded-full"
                      onClick={() => onMarkAsRead(currentAlert.id)}
                    >
                      {currentAlert.isRead ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-gray-300" />
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    {getAlertIcon(currentAlert.type)}
                    <h2 className="text-lg font-semibold">
                      {currentAlert.portName}, {currentAlert.country}
                    </h2>
                    {getAlertBadge(currentAlert.type)}
                  </div>

                  {/* Vessel and Port Context Information */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="text-xs text-gray-500 mb-1">Vessel</div>
                      <div className="flex items-center">
                        <Ship className="h-4 w-4 text-blue-500 mr-2" />
                        <span className="font-medium">{currentAlert.vesselName}</span>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="text-xs text-gray-500 mb-1">Port</div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-blue-500 mr-2" />
                        <span className="font-medium">
                          {currentAlert.portName}, {currentAlert.country}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-gray-500 mb-4">
                    Issued: {formatDate(currentAlert.createdAt)}
                    {currentAlert.dueDate && ` • Due: ${formatDate(currentAlert.dueDate)}`}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">{currentAlert.message}</h3>

                    <div className="prose max-w-none">
                      <p className="whitespace-pre-line">
                        {currentAlert.fullContent ||
                          "No additional details are available for this alert. Please contact your port agent for more information."}
                      </p>
                    </div>

                    {currentAlert.requiredDocuments && currentAlert.requiredDocuments.length > 0 && (
                      <div className="mt-6 space-y-3">
                        <h4 className="text-md font-semibold">Required Documents</h4>
                        <div className="bg-gray-50 p-4 rounded-md space-y-2">
                          {currentAlert.requiredDocuments.map((doc, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-gray-300 mt-0.5" />
                              <span>{doc}</span>
                            </div>
                          ))}
                        </div>
                        <p className="text-sm text-gray-500">
                          These documents have been added to your required documents checklist.
                        </p>
                      </div>
                    )}

                    {currentAlert.type !== "info" && (
                      <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mt-4">
                        <div className="flex items-start">
                          <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-amber-800">Action Required</h4>
                            <p className="text-sm text-amber-700 mt-1">
                              This alert requires your attention before your port call. Please ensure all required
                              documents are prepared and submitted on time.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center mt-8 pt-4 border-t">
                    <Button variant="outline" size="sm" asChild>
                      <a href="#" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Source
                      </a>
                    </Button>
                    <SheetClose asChild>
                      <Button>Close</Button>
                    </SheetClose>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
