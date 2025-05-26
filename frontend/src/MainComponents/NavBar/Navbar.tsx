"use client"

import { useState, useEffect } from "react"
import type { FC } from "react"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import UserProfileDropdown from "./UserProfileDropdown"
import NotificationsPanel, { type Notification } from "../../MainComponents/Notifications/NotificationsPanel"
import MaritimeSearchBar from "./SearchBar/SearchBar"
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../MainComponents/Notifications/NotificationService"
import { useUser } from "../../Auth/Contexts/UserContext"

// Update the UserType interface to match the User interface from UserContext
interface AppHeaderProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  showSidePanel: boolean
  setShowSidePanel: (show: boolean) => void
  showRightPanel: boolean
  setShowRightPanel: (show: boolean) => void
}

// Define the window.chatDashboardAPI interface
declare global {
  interface Window {
    chatDashboardAPI?: {
      handleOpenTimeline: () => void
      handleOpenWeatherAlerts: () => void
      handleOpenFleetManagement: () => void
      handleOpenMap: () => void
      setShowSidePanel: (show: boolean) => void
      setShowRightPanel: (show: boolean) => void
      setActiveTab: (tab: string) => void
    }
  }
}

const AppHeader: FC<AppHeaderProps> = ({
  activeTab,
  setActiveTab,
  showSidePanel,
  setShowSidePanel,
  showRightPanel,
  setShowRightPanel,
}) => {
  const { user, logout } = useUser()
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Helper function to safely call dashboard API functions
  const callDashboardAPI = (functionName: string, ...args: any[]) => {
    if (
      typeof window !== "undefined" &&
      window.chatDashboardAPI &&
      window.chatDashboardAPI[functionName as keyof typeof window.chatDashboardAPI]
    ) {
      ;(window.chatDashboardAPI[functionName as keyof typeof window.chatDashboardAPI] as Function)(...args)
    }
  }

  // Fetch notifications on component mount
  useEffect(() => {
    // In a real app, you would fetch notifications from an API
    setNotifications(getNotifications())
  }, [])

  // Handle marking a notification as read
  const handleMarkAsRead = (id: string) => {
    markNotificationAsRead(id)
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, status: "read" } : notification)),
    )
  }

  // Handle marking all notifications as read
  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead()
    setNotifications((prev) => prev.map((notification) => ({ ...notification, status: "read" })))
  }

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    // Navigate to the appropriate page based on notification type
    if (notification.actionUrl) {
      // In a real app, you would use router.push or window.location
      console.log("Navigating to:", notification.actionUrl)
    }
  }

  // Handle search navigation
  const handleSearchNavigate = (url: string) => {
    // In a real app, you would use your router here
    console.log("Navigating to:", url)
    // Example: router.push(url)
    window.location.href = url
  }

  return (
    <div className="flex items-center justify-between p-3 border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-md backdrop-saturate-150 sticky top-0 z-10 dark:border-slate-800">
      {/* Left side - Logo/Sidebar toggle */}
      <div className="flex items-center">
        {!showSidePanel && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setShowSidePanel(true)
              callDashboardAPI("setShowSidePanel", true)
            }}
            className="mr-1 h-8 w-8 opacity-60 hover:opacity-100"
            title="Open conversations"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Center - Maritime Search Bar */}
      <div className="flex-1 max-w-md mx-4">
        <MaritimeSearchBar
          onNavigate={handleSearchNavigate}
          placeholder="Search vessels, documents, ports..."
          className="w-full"
        />
      </div>

      {/* Right side - Notifications and User Profile */}
      <div className="flex items-center space-x-2">
        {/* Notifications panel */}
        <NotificationsPanel
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
          onNotificationClick={handleNotificationClick}
        />

        {/* User profile dropdown */}
        <UserProfileDropdown user={user} onSignOut={logout} />
      </div>
    </div>
  )
}

export default AppHeader
