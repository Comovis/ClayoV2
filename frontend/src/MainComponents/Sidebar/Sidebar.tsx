"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Link, useLocation } from "react-router-dom"
import { BarChart3, Ship, FileText, MapPin, Share2, Bell, Settings, LogOut } from "lucide-react"

import IconComovisBlack from "../../ReusableAssets/Logos/IconComovisBlack.svg"
import LogoBlack from "../../ReusableAssets/Logos/LogoBlack.svg"

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const location = useLocation()

  // Auto-collapse sidebar on initial load
  useEffect(() => {
    setSidebarOpen(false)
  }, [])

  // Handle sidebar hover
  const handleMouseEnter = () => {
    setIsHovering(true)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
  }

  // Determine if sidebar should be expanded
  const isSidebarExpanded = sidebarOpen || isHovering

  return (
    <div
      className={`bg-white border-r transition-all duration-300 ${isSidebarExpanded ? "w-64" : "w-16"} flex flex-col h-screen`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`p-4 border-b flex items-center ${isSidebarExpanded ? "justify-start" : "justify-center"}`}>
        <div className="flex items-center cursor-pointer" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {isSidebarExpanded ? (
            <img src={LogoBlack || "/placeholder.svg"} alt="Comovis Logo" className="h-7" />
          ) : (
            <img src={IconComovisBlack || "/placeholder.svg"} alt="Comovis Icon" className="h-8" />
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto py-4">
        <nav className="space-y-1 px-2">
          <NavItem
            href="/"
            icon={BarChart3}
            label="Dashboard"
            active={location.pathname === "/"}
            collapsed={!isSidebarExpanded}
          />
          <NavItem
            href="/fleet"
            icon={Ship}
            label="Fleet"
            active={location.pathname === "/fleet"}
            collapsed={!isSidebarExpanded}
          />
          <NavItem
            href="/document-hub"
            icon={FileText}
            label="Document Hub"
            active={location.pathname === "/document-hub"}
            collapsed={!isSidebarExpanded}
          />
          <NavItem
            href="/port-preparation"
            icon={MapPin}
            label="Port Preparation"
            active={location.pathname === "/port-preparation"}
            collapsed={!isSidebarExpanded}
          />
          <NavItem
            href="/document-sharing"
            icon={Share2}
            label="Document Sharing"
            active={location.pathname === "/document-sharing"}
            collapsed={!isSidebarExpanded}
          />
          <NavItem
            href="/notifications"
            icon={Bell}
            label="Notifications"
            active={location.pathname === "/notifications"}
            collapsed={!isSidebarExpanded}
          />
          <NavItem
            href="/settings"
            icon={Settings}
            label="Settings"
            active={location.pathname === "/settings"}
            collapsed={!isSidebarExpanded}
          />
        </nav>
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center">
          <Avatar className="h-8 w-8">
            <AvatarFallback>JS</AvatarFallback>
          </Avatar>
          {isSidebarExpanded && (
            <div className="ml-2">
              <p className="text-sm font-medium">John Smith</p>
              <p className="text-xs text-gray-500">Fleet Manager</p>
            </div>
          )}
          {isSidebarExpanded && (
            <Button variant="ghost" size="sm" className="ml-auto">
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function NavItem({ href, icon: Icon, label, active = false, collapsed = false }) {
  return (
    <Link
      to={href}
      className={`flex items-center px-3 py-2 rounded-md ${active ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`}
    >
      <Icon className={`h-5 w-5 ${active ? "text-blue-500" : "text-gray-500"}`} />
      {!collapsed && <span className="ml-3">{label}</span>}
    </Link>
  )
}
