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
import Analytics from "./MainPages/Analytics/Analytics"
import ProtectedRoute from "./Auth/ProtectedRoute"
import SignupPage from "./Auth/Signup/SignupPage"
import LoginPage from "./Auth/Login/LoginPage"
import EmailVerificationPage from "./Auth/Signup/ConfirmEmail"
import InvitationAccept from "./Auth/Signup/InvitationAccept"
import UnauthorizedMessage from "./Auth/UnauthorisedMsg"
import { UserProvider } from "./Auth/Contexts/UserContext"
import Conversations from "./MainPages/CustomerConversations/ConversationsPortal"
import PricingPage from "./MainPages/Pricing/PricingPage"
import TeamPage from "./MainPages/TeamManagement/TeamManagement"
import OnboardingPage from "./Auth/Onboarding/OnboardingPage"
import LandingPage from "./MainPages/LandingPage/LandingPage"
import ChatWidgetConfig from "./MainPages/ConfigureChatWidget/SetupChatWidget"
import AIAgentsPage from "./MainPages/AgentConfigTraining/AgentConfig" 
import TestWidgetPage from './Tests/WidgetTest'
import MainBlogPage from './MainPages/Blog/MainBlogPage'
import AdminBlogMgt from './MainPages/Blog/AdminBlogManagement'
import EditBlogPostPage from "./MainPages/Blog/AdminEditArticle"
import NewBlogPostPage from "./MainPages/Blog/AdminCreateNewArticle"

// Google Analytics Configuration
const GA_TRACKING_ID = "G-TY55DN5JKN"

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
      title: "Clayo - AI-Powered Customer Service Platform",
      description:
        "Transform your customer service with AI-powered conversations, automated responses, and intelligent customer support solutions.",
    },

    // Main application pages
    "/dashboard": {
      title: "Customer Service Dashboard | Clayo",
      description:
        "Monitor your customer conversations, AI performance, and support metrics with real-time analytics and insights.",
    },
    "/conversations": {
      title: "Customer Conversations | Clayo",
      description:
        "Manage customer conversations across all channels with AI-powered assistance and automated responses.",
    },
    "/agent-config": {
      // Add this metadata
      title: "AI Agent Training | Clayo",
      description: "Train your AI customer service agent with custom knowledge, responses, and conversation flows.",
    },
    "/widget-config": {
      title: "Chat Widget Setup | Clayo",
      description: "Configure and customize your website chat widget for seamless customer interactions.",
    },
    "/analytics": {
      title: "Customer Service Analytics | Clayo",
      description:
        "Analyze customer service performance, AI effectiveness, and conversation insights with detailed analytics.",
    },
    "/team": {
      title: "Team Management | Clayo",
      description: "Manage your customer service team, assign roles, and collaborate on customer support operations.",
    },
    "/pricing": {
      title: "AI Customer Service Pricing | Clayo",
      description: "Transparent pricing for AI-powered customer service. Plans for businesses of all sizes.",
    },

    // Authentication pages
    "/login": {
      title: "Login to AI Customer Service | Clayo",
      description: "Access your AI-powered customer service dashboard and manage your support operations.",
    },
    "/signup": {
      title: "Join AI Customer Service Platform | Clayo",
      description: "Start transforming your customer service with AI-powered conversations and automated support.",
    },
    "/onboarding": {
      title: "Setup Your AI Customer Service | Clayo",
      description: "Get started with Clayo - configure your AI agent and begin automated customer support.",
    },
    "/confirm-email": {
      title: "Verify Your Customer Service Account | Clayo",
      description: "Confirm your email address to access your AI-powered customer service platform.",
    },
    "/email-confirmed": {
      title: "Account Verified | Clayo",
      description: "Your customer service account has been verified. Access your AI dashboard now.",
    },
    "/accept-invite": {
      title: "Join Customer Service Team | Clayo",
      description: "Accept your team invitation and start collaborating on AI-powered customer support.",
    },
  }

  // Return specific page metadata or default
  return (
    pageMetadata[pathname] || {
      title: "AI Customer Service Platform | Clayo",
      description:
        "AI-powered customer service platform helping businesses automate support and improve customer satisfaction.",
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
      <meta property="og:url" content={`https://clayo.co${location.pathname}`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <link rel="canonical" href={`https://clayo.co${location.pathname}`} />

      {/* AI Customer Service specific keywords */}
      <meta
        name="keywords"
        content="AI customer service, automated support, customer conversations, AI chatbot, customer service platform, automated responses, AI agent, customer support automation, conversational AI"
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
      const loadingFlag = localStorage.getItem("clayo_showing_loading")
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
    location.pathname === "/accept-invite"

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
      "/conversations",
      "/agent-config", // Make sure this is included
      "/widget-config",
      "/analytics",
      "/pricing",
      "/team",
      "/tests",
      "/blog",
      "/admin/blog/mgt",
      "admin/blog/edit",
      "/admin/blog/new"

    ],
    [],
  )

  // Check if current path is a known path
  const isKnownPath = knownPaths.includes(location.pathname)

  // If path is unknown, we should hide navbar, sidebar, and footer
  const isUnknownPath = !isKnownPath

  return (
    <>
      {/* SEO metadata for all pages */}
      <SEOHead />

      <div className="flex h-screen w-full max-w-full overflow-x-hidden">
        {/* Only show sidebar on known paths that are not landing pages or auth pages */}
        {!isLandingPage && !isAuthPage && !isUnknownPath && !isShowingLoadingScreen && <Sidebar />}

        <div className="flex flex-col flex-1 min-w-0 max-w-full">
          {/* Conditionally render the appropriate header */}
          {isShowingLoadingScreen ? null : isLandingPage ? (
            <LandingHeader user={undefined} logout={undefined} />
          ) : isAuthPage || isUnknownPath ? null : (
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
          <div className="flex-1 overflow-auto w-full max-w-full">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />

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
              <Route path="/tests" element={<TestWidgetPage />} />
              <Route path="/blog" element={<MainBlogPage />} />
              <Route path="/admin/blog/mgt" element={<AdminBlogMgt />} />
              <Route path="/admin/blog/edit" element={<EditBlogPostPage />} />
              <Route path="/admin/blog/new" element={<NewBlogPostPage />} />

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
                path="/agent-config"
                element={
                  <ProtectedRoute>
                    <AIAgentsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/widget-config"
                element={
                  <ProtectedRoute>
                    <ChatWidgetConfig />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/conversations"
                element={
                  <ProtectedRoute>
                    <Conversations />
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

              {/* Catch-all route for unauthorized access */}
              <Route path="*" element={<UnauthorizedMessage />} />
            </Routes>
          </div>

          {/* Only show footer on known paths that are not auth pages */}
          {!isAuthPage && !isUnknownPath && !isShowingLoadingScreen && <Footer />}
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
