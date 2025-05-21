"use client"

import { useState, useMemo } from "react"
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
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
import TeamPage from "./MainPages/TeamManagement/TeamManagement" // Import the TeamPage component
import OnboardingPage from "./Auth/Onboarding/OnboardingPage"
import LandingPage from "./MainPages/LandingPage/LandingPage"
import DocumentSharingRecipientView from "./MainPages/SharePage/DocumentSharingRecipientView"
import SignupPage from "./Auth/Signup/SignupPage"
import LoginPage from "./Auth/Login/LoginPage"
import EmailVerificationPage from "./Auth/Signup/ConfirmEmail"

import InvitationAccept from "./Auth/Signup/InvitationAccept"
import UnauthorizedMessage from "./Auth/UnauthorisedMsg"
import { UserProvider } from "./Auth/Contexts/UserContext"

// Define a simple user type for demonstration
interface UserType {
  id?: string
  name?: string
  email?: string
  profileImage?: string
}

// Create a wrapper component to handle conditional header rendering
function AppContent() {
  // State for the navbar props
  const [activeTab, setActiveTab] = useState("aiChat")
  const [showSidePanel, setShowSidePanel] = useState(true)
  const [showRightPanel, setShowRightPanel] = useState(false)

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
      "/fleet",
      "/document-hub",
      "/port-preparation",
      "/document-sharing",
      "/pricing",
      "/team", // Add team path to known paths
      "/notifications",
      "/share",
    ],
    [],
  )

  // Check if current path is a known path
  const isKnownPath = knownPaths.includes(location.pathname)

  // If path is unknown, we should hide navbar, sidebar, and footer
  const isUnknownPath = !isKnownPath

  // Mock user data
  const user: UserType = {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
  }

  // Mock logout function
  const handleLogout = () => {
    console.log("User logged out")
    // Add actual logout logic here
  }

  return (
    <div className="flex h-screen">
      {/* Only show sidebar on known paths that are not landing pages or auth pages */}
      {!isLandingPage && !isAuthPage && !isUnknownPath && <Sidebar />}

      <div className="flex flex-col flex-1">
        {/* Conditionally render the appropriate header */}
        {isLandingPage ? (
          <LandingHeader user={user} logout={handleLogout} />
        ) : isAuthPage || isUnknownPath ? // No header on auth pages or unknown paths
        null : (
          <AppHeader
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            showSidePanel={showSidePanel}
            setShowSidePanel={setShowSidePanel}
            showRightPanel={showRightPanel}
            setShowRightPanel={setShowRightPanel}
            user={user}
            logout={handleLogout}
          />
        )}

        {/* Main content area */}
        <div className="flex-1 overflow-auto">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
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
            {/* Add Team Management route */}
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
            <Route
              path="/share"
              element={
                <ProtectedRoute>
                  <DocumentSharingRecipientView />
                </ProtectedRoute>
              }
            />
            {/* Catch-all route for unauthorized access */}
            <Route path="*" element={<UnauthorizedMessage />} />
          </Routes>
        </div>
        {/* Only show footer on known paths that are not auth pages */}
        {!isAuthPage && !isUnknownPath && <Footer />}
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </Router>
  )
}

export default App
