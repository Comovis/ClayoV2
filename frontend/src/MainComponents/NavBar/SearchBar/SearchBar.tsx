"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Search, Ship, FileText, MapPin, Clock, ArrowRight, Command, Hash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface SearchResult {
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

interface MaritimeSearchBarProps {
  onNavigate?: (url: string) => void
  className?: string
  placeholder?: string
}

export default function MaritimeSearchBar({
  onNavigate,
  className,
  placeholder = "Search vessels, documents, ports...",
}: MaritimeSearchBarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Mock data - in real app this would come from your APIs
  const mockData = {
    vessels: [
      {
        id: "humble-warrior",
        name: "Humble Warrior",
        type: "Crude Oil Tanker",
        flag: "Panama",
        imo: "9123456",
        status: "at_sea",
      },
      {
        id: "pacific-explorer",
        name: "Pacific Explorer",
        type: "Container Ship",
        flag: "Singapore",
        imo: "9234567",
        status: "in_port",
      },
      {
        id: "northern-star",
        name: "Northern Star",
        type: "Bulk Carrier",
        flag: "Marshall Islands",
        imo: "9345678",
        status: "at_sea",
      },
    ],
    documents: [
      {
        id: "smc-001",
        title: "Safety Management Certificate",
        vessel: "Humble Warrior",
        status: "expiring",
        expiryDays: 28,
      },
      {
        id: "iopp-002",
        title: "Oil Pollution Prevention Certificate",
        vessel: "Pacific Explorer",
        status: "valid",
        expiryDays: 180,
      },
      {
        id: "registry-003",
        title: "Certificate of Registry",
        vessel: "Northern Star",
        status: "valid",
        expiryDays: 365,
      },
    ],
    ports: [
      { id: "singapore", name: "Singapore", country: "Singapore", code: "SGSIN" },
      { id: "rotterdam", name: "Rotterdam", country: "Netherlands", code: "NLRTM" },
      { id: "hongkong", name: "Hong Kong", country: "China", code: "HKHKG" },
    ],
    quickActions: [
      { id: "upload-doc", title: "Upload Document", action: "upload" },
      { id: "add-vessel", title: "Add New Vessel", action: "add-vessel" },
      { id: "port-prep", title: "Port Preparation", action: "port-prep" },
      { id: "share-docs", title: "Share Documents", action: "share-docs" },
    ],
  }

  // Search function
  const performSearch = useCallback((searchQuery: string): SearchResult[] => {
    if (!searchQuery.trim()) return []

    const query = searchQuery.toLowerCase()
    const results: SearchResult[] = []

    // Search vessels
    mockData.vessels.forEach((vessel) => {
      if (
        vessel.name.toLowerCase().includes(query) ||
        vessel.type.toLowerCase().includes(query) ||
        vessel.flag.toLowerCase().includes(query) ||
        vessel.imo.includes(query)
      ) {
        results.push({
          id: vessel.id,
          title: vessel.name,
          subtitle: `${vessel.type} • ${vessel.flag} • IMO: ${vessel.imo}`,
          type: "vessel",
          icon: Ship,
          url: `/vessels/${vessel.id}`,
          metadata: {
            status: vessel.status,
            flag: vessel.flag,
            imo: vessel.imo,
          },
        })
      }
    })

    // Search documents
    mockData.documents.forEach((doc) => {
      if (doc.title.toLowerCase().includes(query)) {
        results.push({
          id: doc.id,
          title: doc.title,
          subtitle: `${doc.vessel} • ${doc.status === "expiring" ? `Expires in ${doc.expiryDays} days` : "Valid"}`,
          type: "document",
          icon: FileText,
          url: `/document-hub?search=${doc.title}`,
          metadata: {
            status: doc.status,
            expiryDays: doc.expiryDays,
          },
        })
      }
    })

    // Search ports
    mockData.ports.forEach((port) => {
      if (
        port.name.toLowerCase().includes(query) ||
        port.country.toLowerCase().includes(query) ||
        port.code.toLowerCase().includes(query)
      ) {
        results.push({
          id: port.id,
          title: port.name,
          subtitle: `${port.country} • ${port.code}`,
          type: "port",
          icon: MapPin,
          url: `/port-preparation?port=${port.id}`,
          metadata: {
            country: port.country,
          },
        })
      }
    })

    // Search quick actions
    mockData.quickActions.forEach((action) => {
      if (action.title.toLowerCase().includes(query)) {
        results.push({
          id: action.id,
          title: action.title,
          subtitle: "Quick Action",
          type: "action",
          icon: ArrowRight,
          action: () => {
            console.log(`Executing action: ${action.action}`)
            // Handle quick actions here
          },
        })
      }
    })

    return results.slice(0, 8) // Limit results
  }, [])

  // Handle search input change
  useEffect(() => {
    if (query.length > 0) {
      setIsLoading(true)
      const timeoutId = setTimeout(() => {
        const searchResults = performSearch(query)
        setResults(searchResults)
        setSelectedIndex(0)
        setIsLoading(false)
      }, 150) // Debounce search

      return () => clearTimeout(timeoutId)
    } else {
      setResults([])
      setSelectedIndex(0)
      setIsLoading(false)
    }
  }, [query, performSearch])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1))
          break
        case "ArrowUp":
          e.preventDefault()
          setSelectedIndex((prev) => Math.max(prev - 1, 0))
          break
        case "Enter":
          e.preventDefault()
          if (results[selectedIndex]) {
            handleResultSelect(results[selectedIndex])
          }
          break
        case "Escape":
          e.preventDefault()
          setIsOpen(false)
          inputRef.current?.blur()
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, results, selectedIndex])

  // Handle global keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        inputRef.current?.focus()
        setIsOpen(true)
      }
    }

    document.addEventListener("keydown", handleGlobalKeyDown)
    return () => document.removeEventListener("keydown", handleGlobalKeyDown)
  }, [])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Handle result selection
  const handleResultSelect = (result: SearchResult) => {
    // Add to recent searches
    setRecentSearches((prev) => {
      const updated = [query, ...prev.filter((s) => s !== query)].slice(0, 5)
      return updated
    })

    if (result.action) {
      result.action()
    } else if (result.url && onNavigate) {
      onNavigate(result.url)
    }

    setIsOpen(false)
    setQuery("")
    inputRef.current?.blur()
  }

  // Get status badge for documents
  const getStatusBadge = (type: string, metadata?: SearchResult["metadata"]) => {
    if (type === "document" && metadata?.status) {
      if (metadata.status === "expiring") {
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
            Expiring
          </Badge>
        )
      } else if (metadata.status === "valid") {
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
            Valid
          </Badge>
        )
      }
    } else if (type === "vessel" && metadata?.status) {
      if (metadata.status === "at_sea") {
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
            At Sea
          </Badge>
        )
      } else if (metadata.status === "in_port") {
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
            In Port
          </Badge>
        )
      }
    }
    return null
  }

  // Get recent searches for empty state
  const getRecentSearches = () => {
    return recentSearches.map((search) => ({
      id: `recent-${search}`,
      title: search,
      subtitle: "Recent search",
      type: "action" as const,
      icon: Clock,
      action: () => {
        setQuery(search)
        inputRef.current?.focus()
      },
    }))
  }

  const displayResults = query.length > 0 ? results : getRecentSearches()

  return (
    <div ref={searchRef} className={cn("relative w-full max-w-md", className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-20 h-9 bg-white/80 backdrop-blur-sm border-gray-200 focus:border-blue-300 focus:ring-blue-200"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <Command className="h-3 w-3" />K
          </kbd>
        </div>
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
          {isLoading ? (
            <div className="p-4 text-center">
              <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-sm text-gray-500">Searching...</p>
            </div>
          ) : displayResults.length > 0 ? (
            <div className="py-2">
              {query.length === 0 && recentSearches.length > 0 && (
                <>
                  <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Recent Searches
                  </div>
                  <Separator className="my-1" />
                </>
              )}

              {displayResults.map((result, index) => {
                const Icon = result.icon
                const isSelected = index === selectedIndex

                return (
                  <button
                    key={result.id}
                    className={cn(
                      "w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors",
                      isSelected && "bg-blue-50 border-r-2 border-blue-500",
                    )}
                    onClick={() => handleResultSelect(result)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div
                      className={cn(
                        "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
                        result.type === "vessel" && "bg-blue-100 text-blue-600",
                        result.type === "document" && "bg-green-100 text-green-600",
                        result.type === "port" && "bg-purple-100 text-purple-600",
                        result.type === "action" && "bg-gray-100 text-gray-600",
                        result.type === "person" && "bg-orange-100 text-orange-600",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">{result.title}</p>
                        {getStatusBadge(result.type, result.metadata)}
                      </div>
                      {result.subtitle && <p className="text-xs text-gray-500 truncate">{result.subtitle}</p>}
                    </div>

                    {isSelected && <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />}
                  </button>
                )
              })}

              {query.length > 0 && (
                <>
                  <Separator className="my-1" />
                  <div className="px-3 py-2 text-xs text-gray-500 flex items-center justify-between">
                    <span>Press Enter to select • ↑↓ to navigate • Esc to close</span>
                  </div>
                </>
              )}
            </div>
          ) : query.length > 0 ? (
            <div className="p-4 text-center">
              <Search className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No results found for "{query}"</p>
              <p className="text-xs text-gray-400 mt-1">Try searching for vessels, documents, or ports</p>
            </div>
          ) : (
            <div className="p-4 text-center">
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Quick Actions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {mockData.quickActions.slice(0, 4).map((action) => (
                      <Button
                        key={action.id}
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs justify-start"
                        onClick={() =>
                          handleResultSelect({
                            id: action.id,
                            title: action.title,
                            type: "action",
                            icon: ArrowRight,
                            action: () => console.log(`Quick action: ${action.action}`),
                          })
                        }
                      >
                        <Hash className="h-3 w-3 mr-1" />
                        {action.title}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">⌘K</kbd> to open • Start typing to search
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
