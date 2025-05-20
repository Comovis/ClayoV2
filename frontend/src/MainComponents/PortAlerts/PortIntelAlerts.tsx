"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Bell, AlertTriangle, Calendar, CheckCircle, Clock, ExternalLink, Eye } from "lucide-react"
import PortAlertsPanel from "./PortAlertsPanel"

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

export default function PortAlerts({ portId }: { portId?: string }) {
  const [isAlertsPanelOpen, setIsAlertsPanelOpen] = useState(false)
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null)
  const [alerts, setAlerts] = useState<PortAlert[]>([
    {
      id: "alert-1",
      portId: "singapore",
      portName: "Singapore",
      country: "Singapore",
      vesselId: "humble-warrior",
      vesselName: "Humble Warrior",
      message:
        "New requirement: Maritime Declaration of Health (MDH) now required for all vessels arriving from specific countries.",
      type: "warning",
      documentIds: ["mdh-form"],
      createdAt: "2023-10-15T10:30:00",
      isRead: false,
      actionRequired: true,
      dueDate: "2023-11-14T00:00:00",
      fullContent: `A. Ships that have called at ports in any of the countries listed below in the past 21 days; or

Angola, Bahrain, Benin, Burkina Faso, Cameroon, Cape Verde, Central African Republic, Congo, Cote d'Ivoire, Democratic Republic of Congo, Gabon, Gambia, Ghana, Guinea, Guinea-Bissau, Iran, Jordan, Kenya, Kuwait, Lebanon, Liberia, Mali, Mauritania, Niger, Nigeria, Oman, Qatar, Saudi Arabia, Senegal, Sierra Leone, South Africa, Sudan, Togo, UAE, Uganda, Yemen, Zimbabwe

B. Ships with crew/passengers who have travelled to any of these countries in the past 21 days; or

C. Ships with any person suspected of having infectious diseases or with a dead body onboard; or

D. Ships with any sick person onboard

The MDH along with the other documents as required, must be submitted to the Port Health Office, 12 hours before arrival at the Port of Singapore.

Other documents required as follows:
(a). Crew list / Passenger list;
(b). Current copy of the Ship Sanitation Certificate;
(c). Last 10 ports of call list; and
(d). List of all passengers and crew members with temperature above 37.5 degree Celsius.`,
      requiredDocuments: [
        "Maritime Declaration of Health (MDH)",
        "Crew List / Passenger List",
        "Ship Sanitation Certificate",
        "Last 10 Ports of Call List",
        "List of Crew/Passengers with Temperature Above 37.5°C",
      ],
    },
    {
      id: "alert-2",
      portId: "singapore",
      portName: "Singapore",
      country: "Singapore",
      vesselId: "humble-warrior",
      vesselName: "Humble Warrior",
      message:
        "MARPOL Annex I Concentrated Inspection Campaign starting November 1. Ensure compliance with oil filtering equipment requirements.",
      type: "critical",
      documentIds: ["iopp"],
      createdAt: "2023-10-14T14:20:00",
      isRead: true,
      actionRequired: true,
      dueDate: "2023-11-01T00:00:00",
      requiredDocuments: [
        "International Oil Pollution Prevention Certificate (IOPP)",
        "Oil Record Book",
        "Approved Equipment Certificates",
        "Maintenance Records",
      ],
    },
    {
      id: "alert-3",
      portId: "shanghai",
      portName: "Shanghai",
      country: "China",
      vesselId: "humble-warrior",
      vesselName: "Humble Warrior",
      message: "Port congestion alert: Expect delays of 2-3 days due to increased traffic.",
      type: "info",
      createdAt: "2023-10-13T09:15:00",
      isRead: false,
      actionRequired: false,
    },
    {
      id: "alert-4",
      portId: "busan",
      portName: "Busan",
      country: "South Korea",
      vesselId: "humble-warrior",
      vesselName: "Humble Warrior",
      message: "New ballast water management requirements effective December 1.",
      type: "warning",
      createdAt: "2023-10-12T11:45:00",
      isRead: false,
      actionRequired: true,
      dueDate: "2023-12-01T00:00:00",
    },
  ])

  // Filter alerts for the selected port if portId is provided
  const filteredAlerts = portId ? alerts.filter((alert) => alert.portId === portId) : alerts
  const unreadCount = filteredAlerts.filter((a) => !a.isRead).length

  const markAsRead = (alertId: string) => {
    setAlerts(alerts.map((alert) => (alert.id === alertId ? { ...alert, isRead: !alert.isRead } : alert)))
  }

  const handleViewAlert = (alertId: string) => {
    setSelectedAlertId(alertId)
    setIsAlertsPanelOpen(true)
  }

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

  // Show max 3 alerts in the card, with a "View All" button if there are more
  const displayedAlerts = filteredAlerts.slice(0, 3)
  const hasMoreAlerts = filteredAlerts.length > 3

  return (
    <>
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Port Requirement Alerts ({filteredAlerts.length})</CardTitle>
              <CardDescription>Recent changes to port requirements and regulations</CardDescription>
            </div>
            {unreadCount > 0 && <Badge className="bg-blue-100 text-blue-800">{unreadCount} New</Badge>}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {filteredAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle className="h-12 w-12 text-green-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-600">No Alerts</h3>
              <p className="text-gray-500 mt-1">
                You're all caught up! We'll notify you when port requirements change.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayedAlerts.map((alert) => (
                <Alert
                  key={alert.id}
                  className={`border-l-4 ${
                    alert.type === "critical"
                      ? "border-l-red-500 bg-red-50"
                      : alert.type === "warning"
                        ? "border-l-yellow-500 bg-yellow-50"
                        : "border-l-blue-500 bg-blue-50"
                  } ${!alert.isRead ? "ring-1 ring-blue-200" : ""} cursor-pointer hover:bg-opacity-80 transition-colors`}
                  onClick={() => handleViewAlert(alert.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start">
                      {getAlertIcon(alert.type)}
                      <div className="ml-2">
                        <AlertTitle className="flex items-center">
                          Requirement Change
                          {!alert.isRead && (
                            <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </AlertTitle>
                        <AlertDescription className="mt-1">{alert.message}</AlertDescription>

                        <div className="flex flex-wrap items-center mt-2 gap-2">
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

                        <div className="mt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-black text-white hover:bg-gray-800"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleViewAlert(alert.id)
                            }}
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation()
                        markAsRead(alert.id)
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
              ))}

              {hasMoreAlerts && (
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedAlertId(null)
                      setIsAlertsPanelOpen(true)
                    }}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View All Alerts ({filteredAlerts.length})
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alerts Panel (for both viewing all alerts and individual alert details) */}
      <PortAlertsPanel
        isOpen={isAlertsPanelOpen}
        onClose={() => {
          setIsAlertsPanelOpen(false)
          setSelectedAlertId(null)
        }}
        alerts={alerts}
        selectedAlertId={selectedAlertId}
        onMarkAsRead={markAsRead}
      />
    </>
  )
}
