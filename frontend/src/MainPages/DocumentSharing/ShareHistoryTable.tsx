"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function ShareHistoryTable() {
  const [sortColumn, setSortColumn] = useState("date")
  const [sortDirection, setSortDirection] = useState("desc")

  // Sample share history data
  const shareHistory = [
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

  // Sort data
  const sortedData = [...shareHistory].sort((a, b) => {
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
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input placeholder="Search shares..." className="pl-8 w-64" />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
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
              {sortedData.map((share) => (
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
                          : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                      }
                    >
                      {share.status === "active" ? "Active" : "Expired"}
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
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Link
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="h-4 w-4 mr-2" />
                          Resend Email
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Clock className="h-4 w-4 mr-2" />
                          Extend Access
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
