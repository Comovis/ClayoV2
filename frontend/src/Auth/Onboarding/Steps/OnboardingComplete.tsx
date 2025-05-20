"use client"

import { CheckCircle, ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useOnboarding } from "./OnboardingContainer"

export default function OnboardingComplete() {
  const { onboardingData } = useOnboarding()

  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6">
        <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
      </div>

      <h1 className="text-2xl font-bold mb-2">Setup Complete!</h1>
      <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
        Your Comovis platform is ready to help you manage maritime compliance and prevent vessel detentions.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl mb-8">
        <div className="border rounded-lg p-4 text-center">
          <div className="font-semibold mb-1">{onboardingData.vessels ? onboardingData.vessels.length : 0}</div>
          <p className="text-sm text-slate-500">Vessels Added</p>
        </div>

        <div className="border rounded-lg p-4 text-center">
          <div className="font-semibold mb-1">{onboardingData.preferences ? onboardingData.preferences.length : 0}</div>
          <p className="text-sm text-slate-500">Features Enabled</p>
        </div>

        <div className="border rounded-lg p-4 text-center">
          <div className="font-semibold mb-1">{onboardingData.teamMembers ? onboardingData.teamMembers.length : 0}</div>
          <p className="text-sm text-slate-500">Team Members</p>
        </div>
      </div>

      <div className="space-y-4 w-full max-w-md">
        <Button className="w-full">
          Go to Dashboard
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        <div className="text-sm text-slate-500">
          Need help getting started? Check out our{" "}
          <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
            quick start guide
          </a>{" "}
          or{" "}
          <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
            contact support
          </a>
          .
        </div>
      </div>
    </div>
  )
}