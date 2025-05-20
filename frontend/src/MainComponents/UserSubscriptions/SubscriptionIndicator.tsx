"use client"

import { Info } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export interface SubscriptionData {
  plan: string
  vesselLimit: number
  vesselsUsed: number
  expiresAt: string
}

interface SubscriptionIndicatorProps {
  subscriptionData: SubscriptionData
  className?: string
}

export function SubscriptionIndicator({ subscriptionData, className = "" }: SubscriptionIndicatorProps) {
  // Calculate percentage of vessel limit used
  const vesselLimitPercentage = (subscriptionData.vesselsUsed / subscriptionData.vesselLimit) * 100

  // Determine color based on usage
  const getLimitColor = () => {
    if (vesselLimitPercentage < 70) return "text-green-600"
    if (vesselLimitPercentage < 90) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`bg-white border rounded-lg px-5 py-3 flex items-center justify-between h-[40px] shadow-sm ${className}`}
          >
            <div>
              <p className="text-base font-medium">{subscriptionData.plan} Plan</p>
            </div>
            <div className="flex items-center gap-3 ml-4">
              <div className="flex items-center gap-2">
                <Progress value={vesselLimitPercentage} className="h-2 w-24" />
                <span className={`text-sm font-medium ${getLimitColor()}`}>
                  {subscriptionData.vesselsUsed}/{subscriptionData.vesselLimit} vessels
                </span>
              </div>
              <Info className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Your subscription allows up to {subscriptionData.vesselLimit} vessels</p>
          <p className="text-xs text-gray-500">Expires: {subscriptionData.expiresAt}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
