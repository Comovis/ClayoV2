import { cn } from "@/lib/utils"
import React from "react"

// Define the possible status types for content throughout the application
export type ContentStatusType = 
  // Document statuses
  | "valid" 
  | "expiring-soon" 
  | "expired" 
  | "missing" 
  | "permanent"
  // Compliance statuses
  | "compliant" 
  | "warning" 
  | "non-compliant"
  // Port requirement statuses
  | "critical" 
  | "important" 
  | "standard"
  // Risk levels
  | "low-risk"
  | "medium-risk"
  | "high-risk"
  // Custom statuses
  | "custom"

interface ContentStatusLabelProps {
  type: ContentStatusType
  children: React.ReactNode
  className?: string
  size?: "sm" | "md" | "lg"
  variant?: "filled" | "outline" | "subtle"
  icon?: React.ReactNode
}

export function ContentStatusLabel({ 
  type, 
  children, 
  className, 
  size = "md", 
  variant = "subtle",
  icon
}: ContentStatusLabelProps) {
  const getBaseStyles = () => {
    const sizeClasses = {
      sm: "text-xs py-0.5 px-1.5",
      md: "text-xs py-1 px-2",
      lg: "text-sm py-1 px-2.5"
    }
    
    return `inline-flex items-center font-medium rounded-sm ${sizeClasses[size]}`
  }
  
  const getStatusStyles = () => {
    // Define color schemes for different status types
    const colorSchemes = {
      // Document statuses
      "valid": {
        filled: "bg-green-500 text-white",
        outline: "border border-green-500 text-green-700",
        subtle: "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
      },
      "expiring-soon": {
        filled: "bg-amber-500 text-white",
        outline: "border border-amber-500 text-amber-700",
        subtle: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
      },
      "expired": {
        filled: "bg-red-500 text-white",
        outline: "border border-red-500 text-red-700",
        subtle: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300"
      },
      "missing": {
        filled: "bg-gray-500 text-white",
        outline: "border border-gray-500 text-gray-700",
        subtle: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
      },
      "permanent": {
        filled: "bg-green-500 text-white",
        outline: "border border-green-500 text-green-700",
        subtle: "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
      },
      
      // Compliance statuses
      "compliant": {
        filled: "bg-green-500 text-white",
        outline: "border border-green-500 text-green-700",
        subtle: "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
      },
      "warning": {
        filled: "bg-amber-500 text-white",
        outline: "border border-amber-500 text-amber-700",
        subtle: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
      },
      "non-compliant": {
        filled: "bg-red-500 text-white",
        outline: "border border-red-500 text-red-700",
        subtle: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300"
      },
      
      // Port requirement statuses
      "critical": {
        filled: "bg-red-500 text-white",
        outline: "border border-red-500 text-red-700",
        subtle: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300"
      },
      "important": {
        filled: "bg-amber-500 text-white",
        outline: "border border-amber-500 text-amber-700",
        subtle: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
      },
      "standard": {
        filled: "bg-blue-500 text-white",
        outline: "border border-blue-500 text-blue-700",
        subtle: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
      },
      
      // Risk levels
      "low-risk": {
        filled: "bg-green-500 text-white",
        outline: "border border-green-500 text-green-700",
        subtle: "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
      },
      "medium-risk": {
        filled: "bg-amber-500 text-white",
        outline: "border border-amber-500 text-amber-700",
        subtle: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
      },
      "high-risk": {
        filled: "bg-red-500 text-white",
        outline: "border border-red-500 text-red-700",
        subtle: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300"
      },
      
      // Custom status (default to gray)
      "custom": {
        filled: "bg-gray-500 text-white",
        outline: "border border-gray-500 text-gray-700",
        subtle: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
      }
    }
    
    return colorSchemes[type]?.[variant] || colorSchemes.custom[variant]
  }

  return (
    <span className={cn(getBaseStyles(), getStatusStyles(), className)}>
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </span>
  )
}

// Helper components for common use cases
export function DocumentStatusLabel({ status, children, ...props }: Omit<ContentStatusLabelProps, "type"> & { status: "valid" | "expiring-soon" | "expired" | "missing" | "permanent" }) {
  return (
    <ContentStatusLabel type={status} {...props}>
      {children}
    </ContentStatusLabel>
  )
}

export function ComplianceStatusLabel({ status, children, ...props }: Omit<ContentStatusLabelProps, "type"> & { status: "compliant" | "warning" | "non-compliant" }) {
  return (
    <ContentStatusLabel type={status} {...props}>
      {children}
    </ContentStatusLabel>
  )
}

export function PortRequirementLabel({ status, children, ...props }: Omit<ContentStatusLabelProps, "type"> & { status: "critical" | "important" | "standard" }) {
  return (
    <ContentStatusLabel type={status} {...props}>
      {children}
    </ContentStatusLabel>
  )
}

export function RiskLevelLabel({ level, children, ...props }: Omit<ContentStatusLabelProps, "type"> & { level: "low-risk" | "medium-risk" | "high-risk" }) {
  return (
    <ContentStatusLabel type={level} {...props}>
      {children}
    </ContentStatusLabel>
  )
}