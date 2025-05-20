"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Download, Eye, Calendar, Clock, RefreshCw } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AccessLogsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AccessLogsModal({ open, onOpenChange }: AccessLogsModalProps) {
  const [activeTab, setActiveTab] = useState("documents")
  const [filterPeriod, setFilterPeriod] = useState("all-time")

  // Sample access logs data
  const documentLogs = [
    {
      id: "log-1",
      document: "Safety Management Certificate",
      recipient: "Singapore MPA",
      action: "viewed",
      timestamp: "2025-05-17T10:23:00",
      ip: "203.142.16.78",
      location: "Singapore",
    },
    {
      id: "log-2",
      document: "Int'l Oil Pollution Prevention Certificate",
      recipient: "Singapore MPA",
      action: "downloaded",
      timestamp: "2025-05-17T10:25:00",
      ip: "203.142.16.78",
      location: "Singapore",
    },
    {
      id: "log-3",
      document: "Certificate of Registry",
      recipient: "Singapore Maritime Services",
      action: "viewed",
      timestamp: "2025-05-16T14:45:00",
      ip: "203.142.18.92",
      location: "Singapore",
    },
    {
      id: "log-4",
      document: "Crew List",
      recipient: "Singapore Maritime Services",
      action: "downloaded",
      timestamp: "2025-05-16T14:48:00",
      ip: "203.142.18.92",
      location: "Singapore",
    },
    {
      id: "log-5",
      document: "Safety Management Certificate",
      recipient: "Shell Vetting",
      action: "viewed",
      timestamp: "2025-05-15T09:30:00",
      ip: "82.45.128.33",
      location: "London, UK",
    },
  ]

  const shareLogs = [
    {
      id: "share-1",
      recipient: "Singapore MPA",
      documentCount: 5,
      created: "2025-05-14T10:23:00",
      expires: "2025-05-22T16:00:00",
      status: "active",
      accessCount: 4,
    },
    {
      id: "share-2",
      recipient: "Shell Vetting",
      documentCount: 12,
      created: "2025-05-10T14:45:00",
      expires: "2025-05-17T23:59:59",
      status: "expired",
      accessCount: 2,
    },
    {
      id: "share-3",
      recipient: "Rotterdam Port Authority",
      documentCount: 6,
      created: "2025-05-01T09:30:00",
      expires: "2025-06-07T18:00:00",
      status: "active",
      accessCount: 0,
    },
  ]

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Access Logs</DialogTitle>
          <DialogDescription>Track when and how your shared documents are accessed</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="documents">Document Access</TabsTrigger>
              <TabsTrigger value="shares">Share Links</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                <SelectTrigger className="w-[180px] h-8">
                  <SelectValue placeholder="Filter by period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="all-time">All Time</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm" className="h-8">
                <RefreshCw className="h-3.5 w-3.5 mr-1" />
                Refresh
              </Button>

              <Button variant="outline" size="sm" className="h-8">
                <Download className="h-3.5 w-3.5 mr-1" />
                Export
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input placeholder="Search logs..." className="pl-8 h-9" />
            </div>
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          <div className="overflow-y-auto flex-1 pr-1">
            <TabsContent value="documents" className="mt-0 h-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documentLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.document}</TableCell>
                      <TableCell>{log.recipient}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            log.action === "downloaded"
                              ? "bg-blue-50 text-blue-700 hover:bg-blue-50"
                              : "bg-gray-50 text-gray-700 hover:bg-gray-50"
                          }
                        >
                          {log.action === "downloaded" ? (
                            <Download className="h-3 w-3 mr-1" />
                          ) : (
                            <Eye className="h-3 w-3 mr-1" />
                          )}
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <Calendar className="h-3.5 w-3.5 text-gray-500 mr-1" />
                            <span>{formatDate(log.timestamp)}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">IP: {log.ip}</div>
                        </div>
                      </TableCell>
                      <TableCell>{log.location}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="shares" className="mt-0 h-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Documents</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Access Count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shareLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.recipient}</TableCell>
                      <TableCell>{log.documentCount}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 text-gray-500 mr-1" />
                          <span>{formatDate(log.created)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="h-3.5 w-3.5 text-gray-500 mr-1" />
                          <span>{formatDate(log.expires)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            log.status === "active"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                          }
                        >
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {log.accessCount}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
