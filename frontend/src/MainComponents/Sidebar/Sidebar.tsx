"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { BarChart3, MessageSquare, Bot, Monitor, TrendingUp, Users } from "lucide-react"

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
            href="/dashboard"
            icon={BarChart3}
            label="Dashboard"
            active={location.pathname === "/dashboard"}
            collapsed={!isSidebarExpanded}
          />
          <NavItem
            href="/conversations"
            icon={MessageSquare}
            label="Conversations"
            active={location.pathname === "/conversations"}
            collapsed={!isSidebarExpanded}
          />
          <NavItem
            href="/agent-config"
            icon={Bot}
            label="AI Agent Training"
            active={location.pathname === "/agent-config"}
            collapsed={!isSidebarExpanded}
          />
          <NavItem
            href="/widget-config"
            icon={Monitor}
            label="Chat Widget"
            active={location.pathname === "/widget-config"}
            collapsed={!isSidebarExpanded}
          />
          <NavItem
            href="/analytics"
            icon={TrendingUp}
            label="Analytics"
            active={location.pathname === "/analytics"}
            collapsed={!isSidebarExpanded}
          />
          <NavItem
            href="/team"
            icon={Users}
            label="Team Management"
            active={location.pathname === "/team"}
            collapsed={!isSidebarExpanded}
          />
        </nav>
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center">
          <div className="relative">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          </div>
          {isSidebarExpanded ? (
            <div className="ml-2">
              <p className="text-sm font-medium text-green-600">Operational</p>
              <p className="text-xs text-gray-500">All systems online</p>
            </div>
          ) : (
            <span className="ml-2 text-xs font-medium text-green-600">OK</span>
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
