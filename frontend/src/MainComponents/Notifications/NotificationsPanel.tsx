"use client"

import { useState, useEffect, useRef } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { StatusLabel } from "../../MainComponents/StatusLabelling/NotificationStatusLabelling"

// Types for our notifications
export interface Notification {
  id: string
  title: string
  message: string
  type: "document" | "port" | "inspection" | "compliance" | "general"
  status: "unread" | "read"
  timestamp: string
  priority: "critical" | "high" | "medium" | "low"
  relatedEntityId?: string
  relatedEntityType?: "vessel" | "document" | "port" | "inspection"
  actionUrl?: string
}

interface NotificationsPanelProps {
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  onNotificationClick: (notification: Notification) => void
}

export default function NotificationsPanel({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onNotificationClick,
}: NotificationsPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const unreadCount = notifications.filter((n) => n.status === "unread").length

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const criticalNotifications = notifications.filter((n) => n.priority === "critical")
  const hasUnreadCritical = criticalNotifications.some((n) => n.status === "unread")

  // Map notification priority to status type
  const getStatusType = (priority: string): "information" | "action" | "urgent" => {
    switch (priority) {
      case "low":
        return "information"
      case "medium":
      case "high":
        return "action"
      case "critical":
        return "urgent"
      default:
        return "information"
    }
  }

  // Get status label text based on priority
  const getStatusText = (priority: string): string => {
    switch (priority) {
      case "critical":
        return "Urgent"
      case "high":
      case "medium":
        return "Action Required"
      case "low":
        return "Information"
      default:
        return "Information"
    }
  }

  return (
    <div className="relative" ref={panelRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ""}`}
      >
        <Bell className="h-5 w-5 text-black dark:text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <Card className="absolute right-0 mt-2 w-80 sm:w-96 overflow-hidden z-50 shadow-lg border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between border-b p-3">
            <h3 className="font-medium">Notifications</h3>
            <Button variant="ghost" size="sm" onClick={onMarkAllAsRead} className="text-xs">
              Mark all as read
            </Button>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <div className="px-3 pt-2">
              <TabsList className="w-full grid grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="documents">Docs</TabsTrigger>
                <TabsTrigger value="port">Port</TabsTrigger>
                <TabsTrigger value="alerts">Alerts</TabsTrigger>
              </TabsList>
            </div>

            {/* Fixed height for scrollable content */}
            <div className="overflow-y-auto" style={{ maxHeight: "400px" }}>
              <TabsContent value="all" className="m-0">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No notifications</div>
                ) : (
                  <ul className="divide-y">
                    {notifications.map((notification) => (
                      <li
                        key={notification.id}
                        className={cn(
                          "px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors",
                          notification.status === "unread" ? "bg-blue-50 dark:bg-blue-900/20" : "",
                        )}
                        onClick={() => {
                          onMarkAsRead(notification.id)
                          onNotificationClick(notification)
                        }}
                      >
                        <div className="flex flex-col">
                          <div className="flex items-start justify-between mb-1">
                            <p className="font-medium text-sm">{notification.title}</p>
                            <StatusLabel type={getStatusType(notification.priority)} className="ml-2 flex-shrink-0">
                              {getStatusText(notification.priority)}
                            </StatusLabel>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{notification.message}</p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500">{notification.timestamp}</p>
                            {notification.status === "unread" && (
                              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </TabsContent>

              <TabsContent value="documents" className="m-0">
                {renderFilteredNotifications("document")}
              </TabsContent>

              <TabsContent value="port" className="m-0">
                {renderFilteredNotifications("port")}
              </TabsContent>

              <TabsContent value="alerts" className="m-0">
                {renderFilteredNotifications(["compliance", "inspection"])}
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      )}
    </div>
  )

  function renderFilteredNotifications(types: string | string[]) {
    const typesArray = Array.isArray(types) ? types : [types]
    const filteredNotifications = notifications.filter((n) => typesArray.includes(n.type))

    if (filteredNotifications.length === 0) {
      return <div className="p-4 text-center text-gray-500">No notifications in this category</div>
    }

    return (
      <ul className="divide-y">
        {filteredNotifications.map((notification) => (
          <li
            key={notification.id}
            className={cn(
              "px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors",
              notification.status === "unread" ? "bg-blue-50 dark:bg-blue-900/20" : "",
            )}
            onClick={() => {
              onMarkAsRead(notification.id)
              onNotificationClick(notification)
            }}
          >
            <div className="flex flex-col">
              <div className="flex items-start justify-between mb-1">
                <p className="font-medium text-sm">{notification.title}</p>
                <StatusLabel type={getStatusType(notification.priority)} className="ml-2 flex-shrink-0">
                  {getStatusText(notification.priority)}
                </StatusLabel>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{notification.message}</p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">{notification.timestamp}</p>
                {notification.status === "unread" && <div className="h-2 w-2 rounded-full bg-blue-500"></div>}
              </div>
            </div>
          </li>
        ))}
      </ul>
    )
  }
}
