import type React from "react"
import { cn } from "@/lib/utils"

type StatusType = "information" | "action" | "urgent"

interface StatusLabelProps {
  type: StatusType
  children: React.ReactNode
  className?: string
}

export function StatusLabel({ type, children, className }: StatusLabelProps) {
  const getStatusStyles = () => {
    switch (type) {
      case "information":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "action":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
      case "urgent":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <span className={cn("inline-flex px-2 py-0.5 text-xs font-medium rounded-sm", getStatusStyles(), className)}>
      {children}
    </span>
  )
}
