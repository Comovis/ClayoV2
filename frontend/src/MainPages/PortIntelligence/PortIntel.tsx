"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Search,
  MessageSquare,
  Calendar,
  FileText,
  AlertTriangle,
  Plus,
  ThumbsUp,
  Tag,
  User,
  Clock,
  ExternalLink,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function PortKnowledgeBase({ portName = "Singapore" }) {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{portName} Knowledge Base</CardTitle>
            <CardDescription>Institutional knowledge and port insights</CardDescription>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Knowledge
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search port knowledge..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="notes">
          <TabsList className="mb-4">
            <TabsTrigger value="notes">Crew Notes</TabsTrigger>
            <TabsTrigger value="inspections">Inspection History</TabsTrigger>
            <TabsTrigger value="contacts">Key Contacts</TabsTrigger>
            <TabsTrigger value="updates">Port Updates</TabsTrigger>
          </TabsList>

          <TabsContent value="notes">
            <div className="space-y-4">
              <KnowledgeItem
                title="Ballast Water Reporting Tips"
                author="Michael Chen"
                role="Chief Officer"
                date="Mar 5, 2023"
                content="Singapore MPA is very strict about ballast water reporting. Make sure to include all ballast water operations from the last 3 ports, not just the most recent one. They specifically check the coordinates of ballast water exchange operations."
                tags={["ballast water", "reporting", "MPA"]}
                helpful={12}
                category="operational"
              />

              <KnowledgeItem
                title="Document Verification Process"
                author="John Doe"
                role="Master"
                date="Mar 10, 2023"
                content="During our last port call, the PSC officer spent extra time verifying our oil record book entries. They cross-checked the entries with the engine room logs and asked detailed questions about our oil filtering equipment maintenance. Make sure these records are consistent and well-maintained."
                tags={["inspection", "oil record book", "PSC"]}
                helpful={8}
                category="inspection"
              />

              <KnowledgeItem
                title="Shore Leave Requirements"
                author="Sarah Johnson"
                role="Second Officer"
                date="Mar 8, 2023"
                content="All crew members need their original seafarer's identity document and a shore pass to go ashore. The shore pass can be arranged through the agent. COVID vaccination certificates are still being checked as of our last visit."
                tags={["shore leave", "crew", "documentation"]}
                helpful={5}
                category="crew"
              />
            </div>
          </TabsContent>

          <TabsContent value="inspections">
            <div className="space-y-4">
              <InspectionItem
                date="Mar 10, 2023"
                authority="Singapore MPA"
                inspector="Mr. Tan"
                result="No deficiencies"
                focusAreas={["MARPOL Annex I", "Crew certificates", "Safety equipment"]}
                notes="Inspector was thorough but fair. Spent extra time checking oil record book entries and oil filtering equipment maintenance records."
              />

              <InspectionItem
                date="Oct 5, 2022"
                authority="Singapore MPA"
                inspector="Ms. Wong"
                result="1 deficiency (rectified)"
                focusAreas={["Fire safety", "Navigation equipment", "SOLAS compliance"]}
                notes="Minor deficiency related to fire drill records not being properly documented. Was able to rectify on-site by providing additional documentation."
                deficiencies={["Fire drill records incomplete (rectified during inspection)"]}
              />

              <InspectionItem
                date="May 18, 2022"
                authority="Singapore MPA"
                inspector="Mr. Lim"
                result="No deficiencies"
                focusAreas={["Ballast water management", "MARPOL compliance"]}
                notes="Focused inspection on ballast water management. Reviewed records and ballast water management plan in detail."
              />
            </div>
          </TabsContent>

          <TabsContent value="contacts">
            <div className="space-y-4">
              <ContactItem
                name="Lee Kuan"
                role="Port Agent"
                company="Singapore Maritime Services"
                phone="+65 9123 4567"
                email="lee.kuan@sgmaritime.com"
                notes="Very responsive and helpful. Prefers WhatsApp for urgent matters. Has good relationships with port authorities."
                lastContact="Mar 8, 2023"
              />

              <ContactItem
                name="Sarah Chen"
                role="Operations Manager"
                company="Singapore Terminal Services"
                phone="+65 8765 4321"
                email="sarah.chen@sgterms.com"
                notes="Handles berth allocations and cargo operations. Contact for any operational issues during port stay."
                lastContact="Mar 9, 2023"
              />

              <ContactItem
                name="Capt. Raj Singh"
                role="Port State Control Officer"
                company="Maritime and Port Authority"
                phone="+65 9876 5432"
                email="raj.singh@mpa.gov.sg"
                notes="Senior PSC officer who conducted our last inspection. Very thorough but fair in his assessment."
                lastContact="Mar 10, 2023"
              />
            </div>
          </TabsContent>

          <TabsContent value="updates">
            <div className="space-y-4">
              <UpdateItem
                title="MARPOL Annex I Inspection Campaign"
                date="Oct 15, 2023"
                source="Singapore MPA Official Notice"
                content="Singapore MPA has announced a Concentrated Inspection Campaign (CIC) focusing on MARPOL Annex I compliance from November 1 to December 31, 2023. Vessels should ensure all oil filtering equipment is operational and oil record books are properly maintained."
                link="https://www.mpa.gov.sg/notices"
                tags={["inspection", "MARPOL", "CIC"]}
              />

              <UpdateItem
                title="Updated Ballast Water Reporting Requirements"
                date="Sep 28, 2023"
                source="Singapore Shipping Association"
                content="Singapore has updated its ballast water reporting requirements. Vessels must now report all ballast water operations from the last 3 ports of call, including coordinates of ballast water exchange operations."
                link="https://www.ssa.org.sg/notices"
                tags={["ballast water", "reporting"]}
              />

              <UpdateItem
                title="Shore Leave COVID Requirements Relaxed"
                date="Sep 15, 2023"
                source="Singapore Immigration Authority"
                content="COVID-19 vaccination requirements for shore leave have been relaxed. While certificates are still checked, booster shots are no longer required for shore leave approval."
                link="https://www.ica.gov.sg/notices"
                tags={["shore leave", "COVID", "crew"]}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function KnowledgeItem({ title, author, role, date, content, tags = [], helpful, category }) {
  const categoryConfig = {
    operational: {
      icon: Clock,
      iconColor: "text-blue-500",
      badgeClass: "bg-blue-100 text-blue-800",
    },
    inspection: {
      icon: FileText,
      iconColor: "text-yellow-500",
      badgeClass: "bg-yellow-100 text-yellow-800",
    },
    crew: {
      icon: User,
      iconColor: "text-green-500",
      badgeClass: "bg-green-100 text-green-800",
    },
    safety: {
      icon: AlertTriangle,
      iconColor: "text-red-500",
      badgeClass: "bg-red-100 text-red-800",
    },
  }

  const config = categoryConfig[category]
  const Icon = config.icon

  return (
    <div className="p-4 border rounded-md">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <Icon className={`h-5 w-5 ${config.iconColor} mr-2`} />
          <h3 className="font-medium">{title}</h3>
        </div>
        <Badge className={config.badgeClass}>{category.charAt(0).toUpperCase() + category.slice(1)}</Badge>
      </div>

      <div className="flex items-center mb-3">
        <Avatar className="h-6 w-6 mr-2">
          <AvatarFallback>
            {author
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="text-sm text-gray-500">
          {author} ({role}) • {date}
        </div>
      </div>

      <p className="text-sm text-gray-700 mb-3">{content}</p>

      <div className="flex flex-wrap gap-1 mb-3">
        {tags.map((tag, index) => (
          <Badge key={index} variant="outline" className="bg-gray-50 text-gray-700">
            <Tag className="h-3 w-3 mr-1" />
            {tag}
          </Badge>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center text-sm text-gray-500">
          <ThumbsUp className="h-4 w-4 mr-1" />
          <span>{helpful} found helpful</span>
        </div>
        <div className="flex gap-1">
          <Button size="sm" variant="ghost">
            <ThumbsUp className="h-3.5 w-3.5 mr-1" />
            Helpful
          </Button>
          <Button size="sm" variant="ghost">
            <MessageSquare className="h-3.5 w-3.5 mr-1" />
            Comment
          </Button>
        </div>
      </div>
    </div>
  )
}

function InspectionItem({ date, authority, inspector, result, focusAreas = [], notes, deficiencies = [] }) {
  const resultClass = result.includes("No deficiencies")
    ? "bg-green-100 text-green-800"
    : result.includes("rectified")
      ? "bg-yellow-100 text-yellow-800"
      : "bg-red-100 text-red-800"

  return (
    <div className="p-4 border rounded-md">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <Calendar className="h-5 w-5 text-gray-500 mr-2" />
          <h3 className="font-medium">{date} Inspection</h3>
        </div>
        <Badge className={resultClass}>{result}</Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
        <div>
          <p className="text-gray-500">Authority</p>
          <p>{authority}</p>
        </div>
        <div>
          <p className="text-gray-500">Inspector</p>
          <p>{inspector}</p>
        </div>
      </div>

      <div className="mb-3">
        <p className="text-sm font-medium mb-1">Focus Areas:</p>
        <div className="flex flex-wrap gap-1">
          {focusAreas.map((area, index) => (
            <Badge key={index} variant="outline" className="bg-gray-50">
              {area}
            </Badge>
          ))}
        </div>
      </div>

      {deficiencies.length > 0 && (
        <div className="mb-3">
          <p className="text-sm font-medium mb-1">Deficiencies:</p>
          <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
            {deficiencies.map((deficiency, index) => (
              <li key={index}>{deficiency}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-gray-50 p-3 rounded-md mb-3">
        <p className="text-sm font-medium mb-1">Notes:</p>
        <p className="text-sm text-gray-700">{notes}</p>
      </div>

      <div className="flex justify-end">
        <Button size="sm" variant="outline">
          View Full Report
        </Button>
      </div>
    </div>
  )
}

function ContactItem({ name, role, company, phone, email, notes, lastContact }) {
  return (
    <div className="p-4 border rounded-md">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium">{name}</h3>
          <p className="text-sm text-gray-500">
            {role} at {company}
          </p>
        </div>
        <Badge variant="outline" className="bg-gray-50">
          Last Contact: {lastContact}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
        <div className="flex items-center">
          <span className="text-gray-500 mr-2">Phone:</span>
          <span>{phone}</span>
        </div>
        <div className="flex items-center">
          <span className="text-gray-500 mr-2">Email:</span>
          <span>{email}</span>
        </div>
      </div>

      <div className="bg-gray-50 p-3 rounded-md mb-3">
        <p className="text-sm font-medium mb-1">Notes:</p>
        <p className="text-sm text-gray-700">{notes}</p>
      </div>

      <div className="flex justify-end gap-2">
        <Button size="sm" variant="outline">
          <MessageSquare className="h-3.5 w-3.5 mr-1" />
          Message
        </Button>
        <Button size="sm">
          <User className="h-3.5 w-3.5 mr-1" />
          Contact
        </Button>
      </div>
    </div>
  )
}

function UpdateItem({ title, date, source, content, link, tags = [] }) {
  return (
    <div className="p-4 border rounded-md">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium">{title}</h3>
        <div className="text-xs text-gray-500">{date}</div>
      </div>

      <p className="text-xs text-gray-500 mb-2">Source: {source}</p>
      <p className="text-sm text-gray-700 mb-3">{content}</p>

      <div className="flex flex-wrap gap-1 mb-3">
        {tags.map((tag, index) => (
          <Badge key={index} variant="outline" className="bg-gray-50 text-gray-700">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="flex justify-end">
        <Button size="sm" variant="outline">
          <ExternalLink className="h-3.5 w-3.5 mr-1" />
          View Source
        </Button>
      </div>
    </div>
  )
}
