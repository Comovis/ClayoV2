"use client"

import type React from "react"
import { type ReactNode, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useUser } from "../Auth/Contexts/UserContext"
import UnauthorizedMessage from "./UnauthorisedMsg"

interface ProtectedRouteProps {
  children: ReactNode
  requireFullAuth?: boolean // New prop to distinguish between semi-auth and full-auth routes
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireFullAuth = true }) => {
  const { isAuthenticated, isLoading, user } = useUser()
  const navigate = useNavigate()
  const location = useLocation()
  const pathname = location.pathname

  // Completely public routes
  const publicRoutes = ["/login", "/signup", "/"]

  // Routes that require at least a user profile (semi-authenticated)
  const semiAuthRoutes = ["/confirm-email", "/email-confirmed", "/onboarding"]

  const isPublicPath = publicRoutes.includes(pathname)
  const isSemiAuthPath = semiAuthRoutes.includes(pathname)

  // Check if user has at least a profile (semi-authenticated)
  const hasSemiAuth = !!user?.id

  useEffect(() => {
    if (isLoading) return

    // For fully protected routes
    if (requireFullAuth && !isAuthenticated && !isPublicPath) {
      navigate(`/login?redirect=${encodeURIComponent(pathname)}`)
    }

    // For semi-auth routes
    if (!requireFullAuth && !hasSemiAuth && !isPublicPath) {
      navigate(`/signup?redirect=${encodeURIComponent(pathname)}`)
    }
  }, [isAuthenticated, isLoading, pathname, navigate, isPublicPath, requireFullAuth, hasSemiAuth])

  // If loading, show a loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // For fully protected routes
  if (requireFullAuth && !isAuthenticated && !isPublicPath) {
    return <UnauthorizedMessage />
  }

  // For semi-auth routes
  if (!requireFullAuth && !hasSemiAuth && !isPublicPath) {
    return <UnauthorizedMessage />
  }

  // If authentication requirements are met, render children
  return <>{children}</>
}

export default ProtectedRoute
