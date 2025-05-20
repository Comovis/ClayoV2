"use client"

import { Shield } from "lucide-react"
import { useOnboarding } from "./OnboardingContainer"
import LogoBlack from "../../../ReusableAssets/Logos/LogoBlack.svg"

export default function WelcomeScreen() {
  const { onboardingData } = useOnboarding()

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center p-3 mb-4">
          <img src={LogoBlack || "/placeholder.svg"} alt="Comovis Logo" className="h-8" />
        </div>
      
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-lg mx-auto">
        Welcome to Comovis. Your maritime compliance platform to prevent vessel detentions and delays
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-5 space-y-4">
          <h3 className="font-semibold flex items-center">
            <Shield className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
            Prevent Vessel Detentions
          </h3>

          <div className="space-y-3">
            <div className="flex">
              <div className="mr-3 text-blue-600 dark:text-blue-400">✓</div>
              <p className="text-sm">Centralized vessel documentation with expiry alerts</p>
            </div>
            <div className="flex">
              <div className="mr-3 text-blue-600 dark:text-blue-400">✓</div>
              <p className="text-sm">Real-time port requirement intelligence</p>
            </div>
            <div className="flex">
              <div className="mr-3 text-blue-600 dark:text-blue-400">✓</div>
              <p className="text-sm">AI-powered compliance gap analysis</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-5 space-y-4">
          <h3 className="font-semibold flex items-center">
            <Shield className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
            Streamline Operations
          </h3>

          <div className="space-y-3">
            <div className="flex">
              <div className="mr-3 text-blue-600 dark:text-blue-400">✓</div>
              <p className="text-sm">Streamlined Port State Control inspection preparation</p>
            </div>
            <div className="flex">
              <div className="mr-3 text-blue-600 dark:text-blue-400">✓</div>
              <p className="text-sm">Secure document sharing with authorities</p>
            </div>
            <div className="flex">
              <div className="mr-3 text-blue-600 dark:text-blue-400">✓</div>
              <p className="text-sm">Reduce port delays and operational costs</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-slate-500 dark:text-slate-400">
          Let's set up your Comovis platform to match your maritime operations.
        </p>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">
          This will only take a few minutes to complete.
        </p>
      </div>
    </div>
  )
}
