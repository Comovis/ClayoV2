"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Users, Zap, Sparkles, FileUp } from "lucide-react"
import { supabase } from "../../Auth/SupabaseAuth"
import LogoBlack from "../../ReusableAssets/Logos/LogoBlack.svg"

// API Base URL Configuration
const apiBaseUrl =
  import.meta.env.MODE === "development" ? import.meta.env.VITE_DEVELOPMENT_URL : import.meta.env.VITE_API_URL

interface WelcomeModalProps {
  isOpen: boolean
  onComplete: () => void
  organizationName?: string
}

export default function WelcomeModal({ isOpen, onComplete, organizationName }: WelcomeModalProps) {
  const [isCompleting, setIsCompleting] = useState(false)

  const completeOnboarding = async () => {
    setIsCompleting(true)

    try {
      // Get auth token
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

      if (sessionError || !sessionData.session) {
        throw new Error("Authentication required")
      }

      // Prepare minimal default data
      const minimalOnboardingData = {
        companyName: organizationName || "",
        industry: "",
        companySize: "",
        website: "",
        description: "",
        teamSize: "",
        departments: [],
        workingHours: "",
        timezone: "",
        enabledChannels: [],
        emailConfig: { enabled: false, address: "" },
        chatConfig: { enabled: true, widget: true },
        phoneConfig: { enabled: false, number: "" },
        aiPersonality: "helpful",
        responseStyle: "balanced",
        knowledgeAreas: ["General Questions"],
        autoResponse: true,
        escalationRules: true,
      }

      const response = await fetch(`${apiBaseUrl}/api/complete-onboarding`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionData.session.access_token}`,
        },
        body: JSON.stringify(minimalOnboardingData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Complete onboarding error:", errorText)
        throw new Error(`Failed to complete onboarding: ${response.status}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message || "Failed to complete onboarding")
      }

      console.log("Onboarding completed successfully")
      onComplete()
    } catch (error) {
      console.error("Error completing onboarding:", error)
      // Still complete to avoid blocking the user
      onComplete()
    } finally {
      setIsCompleting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Blurred backdrop */}
          <motion.div
            initial={{ backdropFilter: "blur(0px)" }}
            animate={{ backdropFilter: "blur(8px)" }}
            exit={{ backdropFilter: "blur(0px)" }}
            className="absolute inset-0 bg-black/20"
          />

          {/* Modal content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative z-10 w-full max-w-2xl"
          >
            <Card className="shadow-2xl border-0 bg-white">
              <CardContent className="p-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-20 h-20 bg-white border border-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm"
                  >
                    <img src={LogoBlack || "/placeholder.svg"} alt="Logo" className="h-10 w-15" />
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-bold text-gray-900 mb-4"
                  >
                    Welcome {organizationName || "Welcome to Clayo"}!
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl text-gray-600 leading-relaxed"
                  >
                    Outdated chatbots sleep. Your customers don't.
                  </motion.p>
                </div>

                {/* Features */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">24/7 Support</h3>
                      <p className="text-gray-600 text-sm">Never miss a customer inquiry</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Users className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Lead Qualification</h3>
                      <p className="text-gray-600 text-sm">Convert more prospects to sales</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Zap className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Instant Responses</h3>
                      <p className="text-gray-600 text-sm">No more waiting for answers</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FileUp className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">AI Trained on Your Data</h3>
                      <p className="text-gray-600 text-sm">Upload docs, FAQs, and content</p>
                    </div>
                  </div>
                </motion.div>

                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8"
                >
                  <p className="text-gray-700 text-center leading-relaxed">
                    It takes less than 2 minutes to setup your first AI agent and it can start handling customer
                    inquiries immediately. You can see value right away.
                  </p>
                </motion.div>

                {/* Action Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="text-center"
                >
                  <Button
                    onClick={completeOnboarding}
                    disabled={isCompleting}
                    className="w-full h-12 bg-black text-white hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-70 px-8 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {isCompleting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                        />
                        Setting up your AI...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-3 h-5 w-5" />
                        I'm ready to get started!
                      </>
                    )}
                  </Button>

                  <p className="text-gray-500 text-sm mt-4">You can customise all settings later in your dashboard</p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
