"use client"

import type React from "react"
import { type ReactNode, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useUser } from "../Auth/Contexts/UserContext"
import UnauthorizedMessage from "./UnauthorisedMsg"

interface ProtectedRouteProps {
  children: ReactNode
  requireFullAuth?: boolean // Distinguish between semi-auth and full-auth routes
  checkOnboardingStatus?: boolean // Check if onboarding is complete
  authRedirect?: boolean // New prop to handle auth page redirects (login/signup)
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireFullAuth = true,
  checkOnboardingStatus = false,
  authRedirect = false,
}) => {
  const { isAuthenticated, isLoading, user } = useUser()
  const navigate = useNavigate()
  const location = useLocation()
  const pathname = location.pathname

  // Get the redirect URL from query parameters if it exists
  const searchParams = new URLSearchParams(location.search)
  const redirectUrl = searchParams.get("redirect")

  // Completely public routes
  const publicRoutes = ["/login", "/signup", "/"]

  // Routes that require at least a user profile (semi-authenticated)
  const semiAuthRoutes = ["/confirm-email", "/email-confirmed", "/onboarding"]

  // Auth pages that should redirect authenticated users
  const authPages = ["/login", "/signup"]

  const isPublicPath = publicRoutes.includes(pathname)
  const isSemiAuthPath = semiAuthRoutes.includes(pathname)
  const isOnboardingPath = pathname === "/onboarding"
  const isAuthPage = authPages.includes(pathname)

  // Check if user has at least a profile (semi-authenticated)
  const hasSemiAuth = !!user?.id

  // Check if user has completed onboarding
  const hasCompletedOnboarding = user?.onboarding_step === "complete"

  useEffect(() => {
    if (isLoading) return

    // CASE 1: Auth page redirect - If user is authenticated and on login/signup, redirect them
    if (authRedirect && isAuthenticated && isAuthPage) {
      if (redirectUrl) {
        navigate(redirectUrl)
      } else {
        navigate("/dashboard")
      }
      return
    }

    // CASE 2: For fully protected routes - If user is not authenticated, redirect to login
    if (requireFullAuth && !isAuthenticated && !isPublicPath) {
      // Save the current path for redirect after login
      navigate(`/login?redirect=${encodeURIComponent(pathname)}`)
      return
    }

    // CASE 3: For semi-auth routes - If user doesn't have a profile, redirect to signup
    if (!requireFullAuth && !hasSemiAuth && !isPublicPath) {
      navigate(`/signup?redirect=${encodeURIComponent(pathname)}`)
      return
    }

    // CASE 4: Prevent users who have completed onboarding from accessing the onboarding page
    if (checkOnboardingStatus && isOnboardingPath && hasCompletedOnboarding) {
      navigate("/dashboard")
      return
    }

    // CASE 5: If user is authenticated and there's a redirect URL in the query params, use it
    if (isAuthenticated && redirectUrl && !isAuthPage) {
      navigate(redirectUrl)
      return
    }
  }, [
    isAuthenticated,
    isLoading,
    pathname,
    navigate,
    isPublicPath,
    requireFullAuth,
    hasSemiAuth,
    isOnboardingPath,
    hasCompletedOnboarding,
    redirectUrl,
    authRedirect,
    isAuthPage,
    checkOnboardingStatus,
  ])

  // If loading, show a loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // For auth pages with authRedirect=true, we don't need to show unauthorized message
  if (authRedirect) {
    return <>{children}</>
  }

  // For fully protected routes
  if (requireFullAuth && !isAuthenticated && !isPublicPath) {
    return <UnauthorizedMessage />
  }

  // For semi-auth routes
  if (!requireFullAuth && !hasSemiAuth && !isPublicPath) {
    return <UnauthorizedMessage />
  }

  // Prevent users who have completed onboarding from accessing the onboarding page
  if (checkOnboardingStatus && isOnboardingPath && hasCompletedOnboarding) {
    return null // This will be handled by the useEffect redirect
  }

  // If authentication requirements are met, render children
  return <>{children}</>
}

export default ProtectedRoute
