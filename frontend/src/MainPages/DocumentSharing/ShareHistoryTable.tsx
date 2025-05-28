"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Search,
  Filter,
  Eye,
  Copy,
  Mail,
  Clock,
  Calendar,
  ChevronDown,
  ArrowUpDown,
  RefreshCw,
  Download,
  AlertCircle,
  CheckCircle,
  Trash2,
  Info,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { revokeDocumentShare, sendShareEmail } from "../../Hooks/useDocumentShares"

interface ShareHistoryTableProps {
  shares?: any[]
  onRefresh?: () => void
}

export function ShareHistoryTable({ shares: propShares, onRefresh }: ShareHistoryTableProps) {
  const [sortColumn, setSortColumn] = useState("date")
  const [sortDirection, setSortDirection] = useState("desc")
  const [searchQuery, setSearchQuery] = useState("")
  const [shares, setShares] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isResending, setIsResending] = useState<string | null>(null)
  const [isRevoking, setIsRevoking] = useState<string | null>(null)

  // Sample share history data (fallback/dummy data)
  const dummyShareHistory = [
    {
      id: "share-1",
      recipient: "Singapore MPA",
      recipientEmail: "portdocs@mpa.gov.sg",
      date: "2025-05-14T10:23:00",
      vessel: "Humble Warrior",
      documentCount: 5,
      accessCount: 3,
      expiryDate: "2025-05-21",
      status: "active",
    },
    {
      id: "share-2",
      recipient: "Shell Vetting",
      recipientEmail: "vetting@shell.com",
      date: "2025-05-10T14:45:00",
      vessel: "Humble Warrior",
      documentCount: 12,
      accessCount: 5,
      expiryDate: "2025-05-17",
      status: "active",
    },
    {
      id: "share-3",
      recipient: "Hong Kong Marine Department",
      recipientEmail: "mardep@gov.hk",
      date: "2025-05-01T09:30:00",
      vessel: "Pacific Explorer",
      documentCount: 4,
      accessCount: 2,
      expiryDate: "2025-05-08",
      status: "expired",
    },
    {
      id: "share-4",
      recipient: "DNV GL",
      recipientEmail: "certification@dnvgl.com",
      date: "2025-04-28T16:15:00",
      vessel: "Northern Star",
      documentCount: 8,
      accessCount: 6,
      expiryDate: "2025-05-28",
      status: "active",
    },
    {
      id: "share-5",
      recipient: "Rotterdam Port Authority",
      recipientEmail: "docs@portofrotterdam.com",
      date: "2025-04-20T11:05:00",
      vessel: "Pacific Explorer",
      documentCount: 6,
      accessCount: 0,
      expiryDate: "2025-04-27",
      status: "expired",
    },
  ]

  // Fetch shares on component mount
  useEffect(() => {
    if (!propShares) {
      fetchShares()
    } else {
      // Use provided shares and map them to the expected format
      const mappedShares = propShares.map((share) => ({
        id: share.id,
        recipient: share.recipients?.[0]?.name || share.recipients?.[0]?.email || "Unknown",
        recipientEmail: share.recipients?.[0]?.email || "unknown@example.com",
        date: share.createdAt,
        vessel: share.vesselName || "Unknown Vessel",
        documentCount: share.documentCount || 0,
        accessCount: share.accessLogs?.length || 0,
        expiryDate: share.expiresAt,
        status: share.isRevoked ? "revoked" : share.isExpired ? "expired" : "active",
      }))
      setShares(mappedShares)
    }
  }, [propShares])

  // Fetch document shares
  const fetchShares = async () => {
    setIsLoading(true)
    setError("")

    try {
      // For now, we'll use dummy data since we're focusing on documents
      console.log("Using dummy share data while focusing on document management")
      setShares(dummyShareHistory)
    } catch (err) {
      console.error("Error fetching document shares:", err)
      setError("Failed to load document shares. Showing sample data.")
      setShares(dummyShareHistory)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle refresh
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh()
    } else {
      fetchShares()
    }
  }

  // Handle resend email
  const handleResendEmail = async (shareId: string) => {
    setIsResending(shareId)
    setError("")
    setSuccess("")

    try {
      const result = await sendShareEmail(shareId)

      if (result.success) {
        setSuccess(`Email resent successfully to ${result.totalSent} recipient(s)!`)

        // Clear success message after 5 seconds
        setTimeout(() => {
          setSuccess("")
        }, 5000)
      } else {
        setError("Failed to resend email. Please try again.")
      }
    } catch (error) {
      console.error("Error resending email:", error)
      setError("Failed to resend email. Please try again.")
    } finally {
      setIsResending(null)
    }
  }

  // Handle revoke access
  const handleRevokeAccess = async (shareId: string) => {
    setIsRevoking(shareId)
    setError("")
    setSuccess("")

    try {
      const result = await revokeDocumentShare(shareId)

      if (result.success) {
        setSuccess("Share access revoked successfully!")

        // Update the local state
        setShares((prevShares) =>
          prevShares.map((share) => (share.id === shareId ? { ...share, status: "revoked" } : share)),
        )

        // Clear success message after 5 seconds
        setTimeout(() => {
          setSuccess("")
        }, 5000)
      } else {
        setError("Failed to revoke access. Please try again.")
      }
    } catch (error) {
      console.error("Error revoking access:", error)
      setError("Failed to revoke access. Please try again.")
    } finally {
      setIsRevoking(null)
    }
  }

  // Handle copy link
  const handleCopyLink = (shareId: string) => {
    const shareUrl = `${window.location.origin}/share/${shareId}`
    navigator.clipboard.writeText(shareUrl)
    setSuccess("Share link copied to clipboard!")

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess("")
    }, 3000)
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Handle sort
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  // Filter and sort data
  const filteredData = shares.filter(
    (share) =>
      share.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      share.recipientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      share.vessel.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortColumn === "date") {
      return sortDirection === "asc" ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date)
    }
    if (sortColumn === "recipient") {
      return sortDirection === "asc" ? a.recipient.localeCompare(b.recipient) : b.recipient.localeCompare(a.recipient)
    }
    if (sortColumn === "vessel") {
      return sortDirection === "asc" ? a.vessel.localeCompare(b.vessel) : b.vessel.localeCompare(a.vessel)
    }
    if (sortColumn === "documentCount") {
      return sortDirection === "asc" ? a.documentCount - b.documentCount : b.documentCount - a.documentCount
    }
    if (sortColumn === "accessCount") {
      return sortDirection === "asc" ? a.accessCount - b.accessCount : b.accessCount - a.accessCount
    }
    return 0
  })

  return (
    <div>
      {/* Display errors/success messages */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-4 bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-200">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Notice about document focus */}
      <Alert className="mb-4 bg-blue-50 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
        <Info className="h-4 w-4" />
        <AlertTitle>Document Management Focus</AlertTitle>
        <AlertDescription>
          Currently focusing on document management. Share history shows sample data while we perfect the document
          fetching functionality.
        </AlertDescription>
      </Alert>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search shares..."
              className="pl-8 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Document Sharing History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mr-3"></div>
              <p>Loading document shares...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">
                    <div className="flex items-center cursor-pointer" onClick={() => handleSort("recipient")}>
                      Recipient
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center cursor-pointer" onClick={() => handleSort("vessel")}>
                      Vessel
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center cursor-pointer" onClick={() => handleSort("date")}>
                      Date Shared
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-center">
                    <div
                      className="flex items-center justify-center cursor-pointer"
                      onClick={() => handleSort("documentCount")}
                    >
                      Documents
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-center">
                    <div
                      className="flex items-center justify-center cursor-pointer"
                      onClick={() => handleSort("accessCount")}
                    >
                      Access Count
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center">
                        <p className="text-gray-500">
                          {searchQuery ? "No shares found matching your search." : "No document shares found"}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedData.map((share) => (
                    <TableRow key={share.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{share.recipient}</div>
                          <div className="text-sm text-gray-500">{share.recipientEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>{share.vessel}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                          <span>{formatDate(share.date)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{share.documentCount}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={share.accessCount > 0 ? "default" : "outline"}>{share.accessCount}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            share.status === "active"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : share.status === "revoked"
                                ? "bg-red-100 text-red-800 hover:bg-red-100"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                          }
                        >
                          {share.status === "active" ? "Active" : share.status === "revoked" ? "Revoked" : "Expired"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <span className="sr-only">Open menu</span>
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCopyLink(share.id)}>
                              <Copy className="h-4 w-4 mr-2" />
                              Copy Link
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleResendEmail(share.id)}
                              disabled={
                                isResending === share.id ||
                                isRevoking === share.id ||
                                share.status === "revoked" ||
                                share.status === "expired"
                              }
                            >
                              {isResending === share.id ? (
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Mail className="h-4 w-4 mr-2" />
                              )}
                              Resend Email
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Clock className="h-4 w-4 mr-2" />
                              Extend Access
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleRevokeAccess(share.id)}
                              disabled={
                                isResending === share.id ||
                                isRevoking === share.id ||
                                share.status === "revoked" ||
                                share.status === "expired"
                              }
                              className="text-red-600"
                            >
                              {isRevoking === share.id ? (
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4 mr-2" />
                              )}
                              Revoke Access
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
