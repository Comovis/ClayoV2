import type React from "react"
export interface SearchResult {
  id: string
  title: string
  subtitle?: string
  type: "vessel" | "document" | "port" | "action" | "person"
  icon: React.ComponentType<{ className?: string }>
  url?: string
  action?: () => void
  metadata?: {
    status?: string
    flag?: string
    imo?: string
    expiryDays?: number
    country?: string
  }
}

export interface SearchCategory {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

export interface MaritimeSearchBarProps {
  onNavigate?: (url: string) => void
  className?: string
  placeholder?: string
  categories?: SearchCategory[]
  onSearch?: (query: string, category?: string) => Promise<SearchResult[]>
}
