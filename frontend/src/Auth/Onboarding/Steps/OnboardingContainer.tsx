"use client"

import { createContext, useContext, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Ship, Users, FileText, Building, Anchor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"

// Step 1: Welcome Screen
import WelcomeScreen from "./WelcomeScreen"
// Step 2: Organization Setup
import OrganizationProfile from "./OrganizationProfile"
// Step 3: Fleet Setup (combined with vessel addition)
import FleetSetup from "./FleetCreation"
// Step 6: Team Setup (optional)
import TeamSetup from "./TeamSetup"
// Completion
import OnboardingComplete from "./OnboardingComplete"

// Create context for onboarding data
const OnboardingContext = createContext<any>(null)

export const useOnboarding = () => useContext(OnboardingContext)

export default function OnboardingContainer() {
  // Define all steps in the onboarding process
  const steps = [
    {
      id: "welcome",
      title: "Welcome",
      component: WelcomeScreen,
      icon: Anchor,
      description: "Welcome to Comovis",
    },
    {
      id: "organization",
      title: "Company",
      component: OrganizationProfile,
      icon: Building,
      description: "Tell us about your maritime operations",
    },
    {
      id: "fleet",
      title: "Fleet Setup",
      component: FleetSetup,
      icon: Ship,
      description: "Add your vessels to the platform",
    },
    {
      id: "team",
      title: "Team",
      component: TeamSetup,
      icon: Users,
      description: "Invite your team members",
    },
    {
      id: "complete",
      title: "All Set!",
      component: OnboardingComplete,
      icon: FileText,
      description: "You're ready to start using Comovis",
    },
  ]

  // State for current step and collected data
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [onboardingData, setOnboardingData] = useState({
    // User data is now handled separately in signup
    name: "",
    companyName: "", // This will be pre-filled from the database

    // Organization data
    companyType: "",
    vesselCount: 1,
    regions: [],

    // Fleet data
    fleetSetupMethod: "", // "manual" or "bulk"
    vessels: [],

    // Team data
    teamMembers: [],
    skipTeamSetup: false,

    // Completion
    completed: false,
  })

  // Calculate progress percentage
  const progress = Math.round(((currentStepIndex + 1) / steps.length) * 100)

  // Update onboarding data
  const updateData = (newData: any) => {
    setOnboardingData((prev) => ({ ...prev, ...newData }))
  }

  // Navigation functions
  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1)
    }
  }

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1)
    }
  }

  const goToStep = (stepId: string) => {
    const index = steps.findIndex((step) => step.id === stepId)
    if (index !== -1) {
      setCurrentStepIndex(index)
    }
  }

  // Handle team setup skip
  const handleContinue = () => {
    if (steps[currentStepIndex].id === "team" && onboardingData.skipTeamSetup) {
      setCurrentStepIndex(currentStepIndex + 1)
    } else {
      nextStep()
    }
  }

  // Get current step component
  const CurrentStep = steps[currentStepIndex].component
  const currentStep = steps[currentStepIndex]

  return (
    <OnboardingContext.Provider value={{ onboardingData, updateData, nextStep, prevStep, goToStep, progress }}>
      <div className="flex justify-center items-center min-h-screen bg-slate-50 dark:bg-slate-900 p-4">
        <Card className="w-full max-w-4xl shadow-lg border-slate-200 dark:border-slate-800">
          {/* Progress bar */}
          <div className="w-full px-6 pt-6">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <currentStep.icon className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                <span className="font-medium text-lg">{currentStep.title}</span>
              </div>
              <span className="text-sm font-medium text-slate-500">
                Step {currentStepIndex + 1} of {steps.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-slate-500 mt-2">{currentStep.description}</p>
          </div>

          {/* Step indicators */}
          <div className="hidden md:flex justify-between px-6 pt-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex flex-col items-center ${
                  index <= currentStepIndex ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-600"
                }`}
                style={{ width: `${100 / steps.length}%` }}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                    index < currentStepIndex
                      ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                      : index === currentStepIndex
                        ? "bg-blue-600 dark:bg-blue-500 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600"
                  }`}
                >
                  {index < currentStepIndex ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="text-xs font-medium">{step.title}</span>
              </div>
            ))}
          </div>

          {/* Main content area */}
          <CardContent className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={steps[currentStepIndex].id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="min-h-[400px] flex flex-col"
              >
                <CurrentStep />
              </motion.div>
            </AnimatePresence>
          </CardContent>

          {/* Navigation footer */}
          <div className="border-t p-4 flex justify-between">
            <Button variant="ghost" onClick={prevStep} disabled={currentStepIndex === 0} className="flex items-center">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            {currentStepIndex < steps.length - 1 ? (
              <div className="flex gap-2">
                <Button onClick={handleContinue} className="flex items-center">
                  Continue
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            ) : (
              <Button onClick={() => updateData({ completed: true })}>Get Started</Button>
            )}
          </div>
        </Card>
      </div>
    </OnboardingContext.Provider>
  )
}
