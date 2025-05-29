"use client"

import { useState, useMemo, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { Helmet, HelmetProvider } from "react-helmet-async"
import { Footer } from "./MainComponents/Footer/Footer"
import Dashboard from "./MainPages/Dashboard/MainDashboard"
import AppHeader from "./MainComponents/NavBar/Navbar"
import LandingHeader from "./MainComponents/NavBar/LandingNavbar"
import Sidebar from "./MainComponents/Sidebar/Sidebar"
import "./App.css"
import VesselsPage from "./MainPages/Vessels/VesselsPage"
import DocumentHub from "./MainPages/DocumentHub/DocumentHub"
import ProtectedRoute from "./Auth/ProtectedRoute"
import PortPreparation from "./MainPages/PortPrep/PortPrep"
import DocumentSharing from "./MainPages/DocumentSharing/DocumentSharing"
import PricingPage from "./MainPages/Pricing/PricingPage"
import NotificationsPage from "./MainPages/Notifications/Notifications"
import TeamPage from "./MainPages/TeamManagement/TeamManagement"
import OnboardingPage from "./Auth/Onboarding/OnboardingPage"
import LandingPage from "./MainPages/LandingPage/LandingPage"
import DocumentSharingRecipientView from "./MainPages/DocumentSharing/RecipientSharePage/DocumentSharingRecipientView"
import ExpiredShareView from "./MainPages/DocumentSharing/RecipientSharePage/ExpiredShareView"
import SignupPage from "./Auth/Signup/SignupPage"
import LoginPage from "./Auth/Login/LoginPage"
import EmailVerificationPage from "./Auth/Signup/ConfirmEmail"
import InvitationAccept from "./Auth/Signup/InvitationAccept"
import UnauthorizedMessage from "./Auth/UnauthorisedMsg"
import { UserProvider } from "./Auth/Contexts/UserContext"
import PitchDeckAuth from "./MainPages/PitchDeck/PitchDeckAuth"

// Google Analytics Configuration
const GA_TRACKING_ID = "G-16JECJB6TS"

// Initialize Google Analytics with debug logging
const initializeGoogleAnalytics = () => {
  console.log("🔍 Initializing Google Analytics with ID:", GA_TRACKING_ID)

  // Create script tag for gtag
  const script = document.createElement("script")
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`

  script.onload = () => {
    console.log("✅ Google Analytics script loaded successfully")
  }

  script.onerror = () => {
    console.error("❌ Failed to load Google Analytics script")
  }

  document.head.appendChild(script)

  // Initialize gtag with debug logging
  window.dataLayer = window.dataLayer || []
  function gtag(...args: any[]) {
    console.log("📊 GA Event:", args)
    window.dataLayer.push(args)
  }
  window.gtag = gtag

  gtag("js", new Date())
  gtag("config", GA_TRACKING_ID, {
    debug_mode: true, // Enable debug mode
    send_page_view: true,
  })

  console.log("🚀 Google Analytics initialized")
}

// Hook to track page views automatically with debug logging
const useAnalyticsTracking = () => {
  const location = useLocation()

  useEffect(() => {
    console.log("📍 Page changed to:", location.pathname)

    // Initialize GA on first load
    if (!window.gtag) {
      console.log("🔧 GA not initialized, initializing now...")
      initializeGoogleAnalytics()
    }

    // Wait a bit for GA to initialize, then track page view
    setTimeout(() => {
      if (window.gtag) {
        console.log("📊 Tracking page view:", location.pathname + location.search)
        window.gtag("config", GA_TRACKING_ID, {
          page_path: location.pathname + location.search,
          page_title: document.title,
          debug_mode: true,
        })

        // Also send a manual page_view event for debugging
        window.gtag("event", "page_view", {
          page_title: document.title,
          page_location: window.location.href,
          page_path: location.pathname + location.search,
        })
      } else {
        console.error("❌ window.gtag is not available")
      }
    }, 100)
  }, [location])
}

// SEO metadata configuration based on route
const getPageMetadata = (pathname: string) => {
  const pageMetadata: Record<string, { title: string; description: string }> = {
    // Landing and main pages
    "/": {
      title: "Comovis - Prevent Vessel Detentions",
      description:
        "AI-powered maritime compliance platform helping shipping companies prevent vessel detentions through intelligent document management and port preparation.",
    },

    // Main application pages
    "/dashboard": {
      title: "Fleet Compliance Dashboard | Comovis",
      description:
        "Monitor your fleet compliance status, track vessel readiness, and get AI-powered insights to prevent detentions.",
    },
    "/fleet": {
      title: "Vessel Fleet Management | Comovis",
      description:
        "Manage your vessel fleet, track compliance status, certificates, and ensure all ships meet port requirements.",
    },
    "/document-hub": {
      title: "Maritime Document Hub | Comovis",
      description:
        "Centralized document management for vessel certificates, crew documents, and maritime compliance paperwork.",
    },
    "/port-preparation": {
      title: "Port Arrival Preparation | Comovis",
      description:
        "AI-powered port preparation tools to ensure your vessels meet all port state control requirements before arrival.",
    },
    "/document-sharing": {
      title: "Secure Document Sharing | Comovis",
      description:
        "Securely share vessel documents with port authorities, agents, surveyors, and maritime stakeholders.",
    },
    "/notifications": {
      title: "Maritime Compliance Alerts | Comovis",
      description: "Stay updated with certificate expiry alerts, compliance notifications, and vessel status updates.",
    },
    "/team": {
      title: "Maritime Team Management | Comovis",
      description:
        "Manage your maritime operations team, assign vessel responsibilities, and control access permissions.",
    },
    "/pricing": {
      title: "Maritime Compliance Pricing | Comovis",
      description: "Transparent pricing for maritime compliance management. Plans for single vessels to large fleets.",
    },

    // Authentication pages
    "/login": {
      title: "Login to Maritime Platform | Comovis",
      description: "Access your maritime compliance dashboard and manage your vessel fleet operations.",
    },
    "/signup": {
      title: "Join Maritime Compliance Platform | Comovis",
      description: "Start preventing vessel detentions with AI-powered maritime compliance management.",
    },
    "/onboarding": {
      title: "Setup Your Maritime Operations | Comovis",
      description: "Get started with Comovis - configure your fleet and begin maritime compliance management.",
    },
    "/confirm-email": {
      title: "Verify Your Maritime Account | Comovis",
      description: "Confirm your email address to access your maritime compliance platform.",
    },
    "/email-confirmed": {
      title: "Account Verified | Comovis",
      description: "Your maritime account has been verified. Access your compliance dashboard now.",
    },
    "/accept-invite": {
      title: "Join Maritime Team | Comovis",
      description: "Accept your team invitation and start collaborating on maritime compliance operations.",
    },

    // Special pages
    "/pitch-deck": {
      title: "Investor Information | Comovis",
      description: "Learn about Comovis' mission to revolutionize maritime compliance and prevent vessel detentions.",
    },

    // Document sharing pages (dynamic)
    "/share": {
      title: "Shared Maritime Document | Comovis",
      description: "View shared vessel documents and maritime compliance information.",
    },
  }

  // Handle dynamic share routes
  if (pathname.startsWith("/share/")) {
    if (pathname.includes("/expired/")) {
      return {
        title: "Document Link Expired | Comovis",
        description: "This document sharing link has expired. Contact the sender for a new link.",
      }
    }
    return pageMetadata["/share"]
  }

  // Return specific page metadata or default
  return (
    pageMetadata[pathname] || {
      title: "Maritime Compliance Platform | Comovis",
      description: "AI-powered maritime compliance platform helping shipping companies prevent vessel detentions.",
    }
  )
}

// SEO Component
const SEOHead = () => {
  const location = useLocation()
  const { title, description } = getPageMetadata(location.pathname)

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`https://comovis.com${location.pathname}`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <link rel="canonical" href={`https://comovis.com${location.pathname}`} />

      {/* Maritime-specific keywords */}
      <meta
        name="keywords"
        content="maritime compliance, vessel detention prevention, port state control, ship certificates, maritime documents, fleet management, vessel compliance, shipping compliance, maritime AI"
      />
    </Helmet>
  )
}

// Define a simple user type for demonstration
interface UserType {
  id?: string
  name?: string
  email?: string
  profileImage?: string
}

// Create a wrapper component to handle conditional header rendering
function AppContent() {
  // Track page views automatically
  useAnalyticsTracking()

  // State for the navbar props
  const [activeTab, setActiveTab] = useState("aiChat")
  const [showSidePanel, setShowSidePanel] = useState(true)
  const [showRightPanel, setShowRightPanel] = useState(false)
  const [isShowingLoadingScreen, setIsShowingLoadingScreen] = useState(false)

  // Add this useEffect to monitor the loading flag
  useEffect(() => {
    const checkLoadingFlag = () => {
      const loadingFlag = localStorage.getItem("comovis_showing_loading")
      setIsShowingLoadingScreen(loadingFlag === "true")
    }

    // Check initially
    checkLoadingFlag()

    // Set up an interval to check periodically (since localStorage can change)
    const interval = setInterval(checkLoadingFlag, 100)

    return () => clearInterval(interval)
  }, [])

  // Use location to determine which header to show
  const location = useLocation()
  const isLandingPage = location.pathname === "/"
  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/onboarding" ||
    location.pathname === "/confirm-email" ||
    location.pathname === "/email-confirmed" ||
    location.pathname === "/accept-invite" ||
    location.pathname === "/pitch-deck"

  // Check if it's a share page (public document sharing)
  const isSharePage = location.pathname.startsWith("/share/")

  // Define all known paths in the application
  const knownPaths = useMemo(
    () => [
      "/",
      "/login",
      "/signup",
      "/accept-invite",
      "/confirm-email",
      "/email-confirmed",
      "/onboarding",
      "/dashboard",
      "/fleet",
      "/document-hub",
      "/port-preparation",
      "/document-sharing",
      "/pricing",
      "/team",
      "/notifications",
      "/pitch-deck",
    ],
    [],
  )

  // Check if current path is a known path or a share path
  const isKnownPath = knownPaths.includes(location.pathname) || isSharePage

  // If path is unknown, we should hide navbar, sidebar, and footer
  const isUnknownPath = !isKnownPath

  return (
    <>
      {/* SEO metadata for all pages */}
      <SEOHead />

      <div className="flex h-screen">
        {/* Only show sidebar on known paths that are not landing pages, auth pages, or share pages */}
        {!isLandingPage && !isAuthPage && !isUnknownPath && !isSharePage && !isShowingLoadingScreen && <Sidebar />}

        <div className="flex flex-col flex-1">
          {/* Conditionally render the appropriate header */}
          {isShowingLoadingScreen ? null : isLandingPage ? (
            <LandingHeader user={undefined} logout={undefined} />
          ) : isAuthPage || isUnknownPath || isSharePage ? null : (
            <AppHeader
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              showSidePanel={showSidePanel}
              setShowSidePanel={setShowSidePanel}
              showRightPanel={showRightPanel}
              setShowRightPanel={setShowRightPanel}
              user={undefined}
              logout={undefined}
            />
          )}

          {/* Main content area */}
          <div className="flex-1 overflow-auto">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />

              {/* Pitch deck route - password protected */}
              <Route path="/pitch-deck" element={<PitchDeckAuth />} />

              {/* Public document sharing routes - no authentication required */}
              <Route path="/share/:token" element={<DocumentSharingRecipientView />} />
              <Route path="/share/expired/:token" element={<ExpiredShareView />} />

              {/* Auth pages with redirect for authenticated users */}
              <Route
                path="/login"
                element={
                  <ProtectedRoute authRedirect={true} requireFullAuth={false}>
                    <LoginPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/signup"
                element={
                  <ProtectedRoute authRedirect={true} requireFullAuth={false}>
                    <SignupPage />
                  </ProtectedRoute>
                }
              />

              <Route path="/accept-invite" element={<InvitationAccept />} />
              <Route path="/confirm-email" element={<EmailVerificationPage />} />

              <Route
                path="/onboarding"
                element={
                  <ProtectedRoute requireFullAuth={false} checkOnboardingStatus={true}>
                    <OnboardingPage />
                  </ProtectedRoute>
                }
              />

              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard hideSidebar={true} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/fleet"
                element={
                  <ProtectedRoute>
                    <VesselsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/document-hub"
                element={
                  <ProtectedRoute>
                    <DocumentHub />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/port-preparation"
                element={
                  <ProtectedRoute>
                    <PortPreparation />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/document-sharing"
                element={
                  <ProtectedRoute>
                    <DocumentSharing />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pricing"
                element={
                  <ProtectedRoute>
                    <PricingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/team"
                element={
                  <ProtectedRoute>
                    <TeamPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <NotificationsPage />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all route for unauthorized access */}
              <Route path="*" element={<UnauthorizedMessage />} />
            </Routes>
          </div>

          {/* Only show footer on known paths that are not auth pages or share pages */}
          {!isAuthPage && !isUnknownPath && !isSharePage && !isShowingLoadingScreen && <Footer />}
        </div>
      </div>
    </>
  )
}

function App() {
  return (
    <HelmetProvider>
      <Router>
        <UserProvider>
          <AppContent />
        </UserProvider>
      </Router>
    </HelmetProvider>
  )
}

export default App
