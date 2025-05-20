"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertTriangle,
  Ship,
  Calendar,
  Download,
  FileText,
  MapPin,
  Users,
  Send,
  PaperclipIcon,
  Plus,
  Search,
  ExternalLink,
  Menu,
  X,
  InfoIcon,
  ArrowLeft,
  CheckCircle,
  ChevronDown,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function CommunicationHub() {
  const [activePort, setActivePort] = useState("singapore")
  const [selectedVessel, setSelectedVessel] = useState("humble-warrior")
  const [messageText, setMessageText] = useState("")
  const [showPortInfo, setShowPortInfo] = useState(false)
  const [showParticipants, setShowParticipants] = useState(false)
  const [showPortList, setShowPortList] = useState(false)

  // Vessels data
  const vessels = [
    {
      id: "humble-warrior",
      name: "Humble Warrior",
      type: "Crude Oil Tanker",
      flag: "Panama",
      avatar: "HW",
      imo: "9123456",
      callsign: "3FVR8",
    },
    {
      id: "pacific-explorer",
      name: "Pacific Explorer",
      type: "Container Ship",
      flag: "Singapore",
      avatar: "PE",
      imo: "9234567",
      callsign: "9VGS2",
    },
    {
      id: "northern-star",
      name: "Northern Star",
      type: "Bulk Carrier",
      flag: "Marshall Islands",
      avatar: "NS",
      imo: "9345678",
      callsign: "V7CK9",
    },
  ]

  // Ports data
  const ports = [
    {
      id: "singapore",
      name: "Singapore",
      country: "Singapore",
      eta: "2023-11-15T00:00:00",
      etd: "2023-11-17T00:00:00",
      requiredDocsCount: 7,
      unreadMessages: 3,
      vesselId: "humble-warrior",
      agent: {
        name: "Sarah Chen",
        role: "Port Agent - Singapore",
        email: "sarah.chen@sgagent.com",
        company: "Singapore Maritime Services",
      },
      authority: {
        name: "Singapore MPA",
        email: "operations@mpa.gov.sg",
      },
    },
    {
      id: "shanghai",
      name: "Shanghai",
      country: "China",
      eta: "2023-12-05T00:00:00",
      etd: "2023-12-07T00:00:00",
      requiredDocsCount: 8,
      unreadMessages: 0,
      vesselId: "humble-warrior",
      agent: {
        name: "Li Wei",
        role: "Port Agent - Shanghai",
        email: "li.wei@shanghaiagent.com",
        company: "Shanghai Port Services",
      },
      authority: {
        name: "Shanghai MSA",
        email: "operations@shmsa.gov.cn",
      },
    },
    {
      id: "busan",
      name: "Busan",
      country: "South Korea",
      eta: "2023-12-20T00:00:00",
      etd: "2023-12-22T00:00:00",
      requiredDocsCount: 6,
      unreadMessages: 0,
      vesselId: "humble-warrior",
      agent: {
        name: "Park Min-ho",
        role: "Port Agent - Busan",
        email: "minho.park@busanagent.com",
        company: "Busan Maritime Agency",
      },
      authority: {
        name: "Busan Regional Office",
        email: "operations@busanport.go.kr",
      },
    },
    {
      id: "rotterdam",
      name: "Rotterdam",
      country: "Netherlands",
      eta: "2023-11-10T00:00:00",
      etd: "2023-11-12T00:00:00",
      requiredDocsCount: 5,
      unreadMessages: 2,
      vesselId: "pacific-explorer",
      agent: {
        name: "Jan Visser",
        role: "Port Agent - Rotterdam",
        email: "jan.visser@rotterdamagent.com",
        company: "Rotterdam Maritime Services",
      },
      authority: {
        name: "Rotterdam Port Authority",
        email: "operations@portofrotterdam.com",
      },
    },
    {
      id: "antwerp",
      name: "Antwerp",
      country: "Belgium",
      eta: "2023-11-15T00:00:00",
      etd: "2023-11-17T00:00:00",
      requiredDocsCount: 6,
      unreadMessages: 0,
      vesselId: "pacific-explorer",
      agent: {
        name: "Luc Maertens",
        role: "Port Agent - Antwerp",
        email: "luc.maertens@antwerpagent.com",
        company: "Antwerp Maritime Agency",
      },
      authority: {
        name: "Antwerp Port Authority",
        email: "operations@portofantwerp.com",
      },
    },
    {
      id: "hongkong",
      name: "Hong Kong",
      country: "China",
      eta: "2023-12-01T00:00:00",
      etd: "2023-12-03T00:00:00",
      requiredDocsCount: 7,
      unreadMessages: 1,
      vesselId: "northern-star",
      agent: {
        name: "David Wong",
        role: "Port Agent - Hong Kong",
        email: "david.wong@hkagent.com",
        company: "Hong Kong Maritime Services",
      },
      authority: {
        name: "Hong Kong Marine Department",
        email: "operations@mardep.gov.hk",
      },
    },
  ]

  // Get port by ID
  const getPort = (id) => {
    return ports.find((port) => port.id === id)
  }

  // Get vessel by ID
  const getVessel = (id) => {
    return vessels.find((vessel) => vessel.id === id)
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Calculate days until arrival
  const getDaysUntilArrival = (etaString) => {
    const eta = new Date(etaString)
    const today = new Date()
    const diffTime = eta.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Handle send message
  const handleSendMessage = () => {
    if (messageText.trim()) {
      // In a real app, you would send the message to your API
      console.log("Sending message:", messageText)
      setMessageText("")
    }
  }

  const activePortData = getPort(activePort)
  const selectedVesselData = getVessel(selectedVessel)

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b px-4 py-2 flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={() => setShowPortList(true)}>
            <Menu className="h-5 w-5 mr-2" />
            <span className="font-medium">Conversations</span>
          </Button>
        </div>
        <div className="flex items-center">
          <VesselSelector
            vessels={vessels}
            selectedVessel={selectedVessel}
            onVesselChange={(vesselId) => {
              setSelectedVessel(vesselId)
              // Reset to first port call for this vessel
              const firstPortForVessel = ports.find((p) => p.vesselId === vesselId) || ports[0]
              if (firstPortForVessel) {
                setActivePort(firstPortForVessel.id)
              }
            }}
          />
        </div>
      </header>

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col h-full overflow-hidden max-w-5xl mx-auto">
        {/* Chat Header */}
        <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarFallback className="bg-blue-100 text-blue-600">{activePortData?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center">
                <h1 className="text-lg font-semibold">{activePortData?.name} Port Communication</h1>
                <Badge className="ml-2 bg-blue-100 text-blue-800">
                  {getDaysUntilArrival(activePortData?.eta)} days
                </Badge>
              </div>
              <p className="text-sm text-gray-500">
                ETA: {formatDate(activePortData?.eta)} • {activePortData?.country}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => setShowPortInfo(true)}>
                    <InfoIcon className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Port Information</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => setShowParticipants(true)}>
                    <Users className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Participants</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-2">
          <SystemMessage
            message="Port call created for Singapore. Arrival: Nov 15, 2023"
            timestamp="Oct 18, 2023 • 09:15"
          />

          <AgentMessage
            name="Sarah Chen"
            role="Port Agent - Singapore"
            message="Hello, I'm Sarah Chen, your appointed agent for Singapore port call. I've attached the required pre-arrival notification forms that need to be submitted 48 hours before arrival."
            timestamp="Oct 18, 2023 • 10:30"
            attachments={[
              {
                name: "Singapore_Pre_Arrival_Notification.pdf",
                size: "245 KB",
                type: "form",
              },
              {
                name: "Singapore_Crew_Declaration.xlsx",
                size: "132 KB",
                type: "form",
              },
            ]}
          />

          <UserMessage
            name="Captain James Wilson"
            role="Master - Humble Warrior"
            message="Thank you Sarah. We'll prepare these forms. Do we need to provide any additional documentation for our crude oil cargo?"
            timestamp="Oct 18, 2023 • 11:45"
          />

          <AgentMessage
            name="Sarah Chen"
            role="Port Agent - Singapore"
            message="Yes, for crude oil cargo you'll need to submit the Dangerous Goods Declaration and Material Safety Data Sheet (MSDS). I've attached the DG Declaration form. Please also prepare your oil record book for potential inspection as Singapore MPA is currently focusing on MARPOL Annex I compliance."
            timestamp="Oct 18, 2023 • 13:20"
            attachments={[
              {
                name: "Singapore_DG_Declaration.pdf",
                size: "198 KB",
                type: "form",
              },
            ]}
          />

          <SystemMessage
            message="Forms added to document requirements for Singapore port call"
            timestamp="Oct 18, 2023 • 13:22"
            actionLink="/port-prep/singapore"
            actionText="View in Port Prep"
          />

          <UserMessage
            name="Maria Rodriguez"
            role="Operations Manager - Fleet HQ"
            message="Sarah, we've noticed that our Safety Management Certificate expires on Nov 20, which is during our port stay in Singapore. Will this be an issue? We're in the process of renewal."
            timestamp="Oct 19, 2023 • 08:15"
          />

          <AgentMessage
            name="Sarah Chen"
            role="Port Agent - Singapore"
            message="That's cutting it close. Singapore MPA typically requires certificates to be valid throughout the port stay. I recommend expediting the renewal process. If that's not possible, you should prepare a letter from your flag state confirming the renewal is in process. I can help coordinate with MPA if needed."
            timestamp="Oct 19, 2023 • 09:05"
          />

          <SystemMessage
            message="Certificate issue flagged: Safety Management Certificate expires during port stay"
            timestamp="Oct 19, 2023 • 09:07"
            isWarning={true}
            actionLink="/document-hub?filter=smc"
            actionText="View Certificate"
          />

          <UserMessage
            name="Maria Rodriguez"
            role="Operations Manager - Fleet HQ"
            message="We'll work on getting that letter from the flag state. In the meantime, I've uploaded our current certificates to the document hub for your reference."
            timestamp="Oct 19, 2023 • 10:30"
          />

          <SystemMessage
            message="Documents shared: Safety Management Certificate, IOPP Certificate, Certificate of Registry"
            timestamp="Oct 19, 2023 • 10:32"
            actionLink="/document-sharing/history"
            actionText="View Shared Documents"
          />

          <AgentMessage
            name="Sarah Chen"
            role="Port Agent - Singapore"
            message="I've reviewed the certificates. Your IOPP Certificate also expires on Dec 10, which is within the 30-day window that sometimes triggers additional scrutiny. Please ensure your Chief Engineer has all maintenance records for oil filtering equipment readily available as this is a current focus area for inspections."
            timestamp="Oct 19, 2023 • 14:15"
          />

          <SystemMessage
            message="New form requirement added: Flag State Letter for SMC Renewal"
            timestamp="Oct 19, 2023 • 14:17"
            actionLink="/port-prep/singapore?tab=forms"
            actionText="View in Port Prep"
          />

          <UserMessage
            name="Captain James Wilson"
            role="Master - Humble Warrior"
            message="Understood. I'll ensure all oil filtering equipment records are in order and easily accessible. Is there anything else we should prepare specifically for the current MPA focus areas?"
            timestamp="Oct 20, 2023 • 07:30"
          />
        </div>

        {/* Message Input */}
        <div className="bg-white border-t p-4 sticky bottom-0">
          <div className="flex items-center">
            <Button variant="outline" size="icon" className="mr-2">
              <PaperclipIcon className="h-5 w-5" />
            </Button>
            <Textarea
              placeholder="Type your message..."
              className="flex-1 resize-none"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
            />
            <Button className="ml-2" onClick={handleSendMessage}>
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
            <div>Press Enter to send, Shift+Enter for new line</div>
            <div className="flex items-center">
              <Users className="h-3 w-3 mr-1" />
              <span>3 people in this conversation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Port List Sheet */}
      <Sheet open={showPortList} onOpenChange={setShowPortList}>
        <SheetContent side="left" className="w-full sm:max-w-md p-0">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Port Communications</h2>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon">
                    <X className="h-5 w-5" />
                  </Button>
                </SheetClose>
              </div>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input placeholder="Search conversations..." className="pl-8" />
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              <div className="p-2">
                <h3 className="text-sm font-medium text-gray-500 px-2 py-1">Upcoming Port Calls</h3>
                {ports
                  .filter((port) => port.vesselId === selectedVessel)
                  .map((port) => (
                    <PortCommunicationItem
                      key={port.id}
                      port={port.name}
                      country={port.country}
                      eta={formatDate(port.eta)}
                      daysAway={getDaysUntilArrival(port.eta)}
                      unreadCount={port.unreadMessages}
                      active={activePort === port.id}
                      onClick={() => {
                        setActivePort(port.id)
                        setShowPortList(false)
                      }}
                    />
                  ))}
              </div>
              <div className="p-2">
                <h3 className="text-sm font-medium text-gray-500 px-2 py-1">Recent Communications</h3>
                <PortCommunicationItem
                  port="Rotterdam"
                  country="Netherlands"
                  eta="Oct 5, 2023"
                  daysAway={-13}
                  unreadCount={0}
                  active={false}
                  onClick={() => {}}
                  isPast={true}
                />
                <PortCommunicationItem
                  port="Houston"
                  country="United States"
                  eta="Sep 18, 2023"
                  daysAway={-30}
                  unreadCount={0}
                  active={false}
                  onClick={() => {}}
                  isPast={true}
                />
              </div>
            </div>
            <div className="p-4 border-t">
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                New Communication
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Port Information Sheet */}
      <Sheet open={showPortInfo} onOpenChange={setShowPortInfo}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <div className="flex items-center">
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="mr-2">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </SheetClose>
              <SheetTitle>Port Information</SheetTitle>
            </div>
            <SheetDescription>Details about {activePortData?.name} port call</SheetDescription>
          </SheetHeader>
          <div className="py-4 space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Port Details</h3>
              <div className="bg-gray-50 rounded-md p-4 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-gray-500">Port:</div>
                  <div className="text-sm font-medium">{activePortData?.name}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-gray-500">Country:</div>
                  <div className="text-sm">{activePortData?.country}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-gray-500">ETA:</div>
                  <div className="text-sm">{formatDate(activePortData?.eta)}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-gray-500">ETD:</div>
                  <div className="text-sm">{formatDate(activePortData?.etd)}</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Port Agent</h3>
              <div className="bg-gray-50 rounded-md p-4 space-y-3">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {activePortData?.agent.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{activePortData?.agent.name}</div>
                    <div className="text-xs text-gray-500">{activePortData?.agent.role}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-gray-500">Email:</div>
                  <div className="text-sm">{activePortData?.agent.email}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-gray-500">Company:</div>
                  <div className="text-sm">{activePortData?.agent.company}</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Quick Links</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href={`/port-prep/${activePort}`}>
                    <Ship className="mr-2 h-4 w-4" />
                    View in Port Prep
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href={`/document-sharing?port=${activePort}`}>
                    <FileText className="mr-2 h-4 w-4" />
                    Share Documents
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href={`/document-hub?port=${activePort}`}>
                    <FileText className="mr-2 h-4 w-4" />
                    View Required Documents
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Participants Sheet */}
      <Sheet open={showParticipants} onOpenChange={setShowParticipants}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <div className="flex items-center">
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="mr-2">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </SheetClose>
              <SheetTitle>Conversation Participants</SheetTitle>
            </div>
            <SheetDescription>People in this conversation</SheetDescription>
          </SheetHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarFallback className="bg-blue-100 text-blue-600">SC</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">Sarah Chen</div>
                    <div className="text-xs text-gray-500">Port Agent - Singapore</div>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">Agent</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarFallback className="bg-blue-100 text-blue-600">JW</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">Captain James Wilson</div>
                    <div className="text-xs text-gray-500">Master - Humble Warrior</div>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800">Vessel</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarFallback className="bg-blue-100 text-blue-600">MR</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">Maria Rodriguez</div>
                    <div className="text-xs text-gray-500">Operations Manager - Fleet HQ</div>
                  </div>
                </div>
                <Badge className="bg-purple-100 text-purple-800">Company</Badge>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Participant
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

function PortCommunicationItem({ port, country, eta, daysAway, unreadCount, active, onClick, isPast = false }) {
  return (
    <div
      className={`p-3 cursor-pointer rounded-md mb-1 ${active ? "bg-blue-50 border-l-4 border-l-blue-500" : "hover:bg-gray-100"}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <MapPin className={`h-4 w-4 mr-2 ${active ? "text-blue-500" : "text-gray-500"}`} />
          <div>
            <h3 className="font-medium">{port}</h3>
            <p className="text-xs text-gray-500">{country}</p>
          </div>
        </div>
        {unreadCount > 0 && (
          <div className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </div>
        )}
      </div>
      <div className="flex items-center mt-2 text-xs text-gray-500">
        <Calendar className="h-3 w-3 mr-1" />
        <span>{eta}</span>
        {isPast ? <span className="ml-1">(Past)</span> : <span className="ml-1">({daysAway} days)</span>}
      </div>
    </div>
  )
}

function SystemMessage({ message, timestamp, isWarning = false, actionLink, actionText }) {
  return (
    <div className="flex justify-center">
      <div
        className={`inline-block px-3 py-1 rounded-md text-xs ${isWarning ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-700"}`}
      >
        <div className="flex items-center">
          {isWarning ? <AlertTriangle className="h-3 w-3 mr-1" /> : <Info className="h-3 w-3 mr-1" />}
          <span>{message}</span>
        </div>
        <div className="flex items-center justify-center mt-1">
          <span className="text-[10px] text-gray-500">{timestamp}</span>
          {actionLink && (
            <a href={actionLink} className="text-[10px] text-blue-600 ml-2 flex items-center">
              <ExternalLink className="h-2 w-2 mr-0.5" />
              {actionText}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

function AgentMessage({ name, role, message, timestamp, attachments = [] }) {
  return (
    <div className="flex">
      <Avatar className="h-8 w-8 mr-2 mt-1">
        <AvatarFallback className="bg-blue-100 text-blue-600">
          {name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-baseline">
          <span className="font-medium text-sm">{name}</span>
          <span className="text-xs text-gray-500 ml-2">{role}</span>
        </div>
        <div className="bg-blue-50 rounded-lg rounded-tl-none p-3 mt-1 text-sm">{message}</div>

        {attachments.length > 0 && (
          <div className="mt-2 space-y-2">
            {attachments.map((attachment, index) => (
              <div
                key={index}
                className="flex items-center p-2 bg-gray-50 border rounded-md text-sm hover:bg-gray-100 cursor-pointer"
              >
                <FileText className="h-4 w-4 text-blue-500 mr-2" />
                <div className="flex-1">
                  <div className="font-medium">{attachment.name}</div>
                  <div className="text-xs text-gray-500 flex items-center">
                    <span>{attachment.size}</span>
                    <span className="mx-1">•</span>
                    <Badge variant="outline" className="text-[10px] h-4 px-1">
                      {attachment.type}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="text-xs text-gray-500 mt-1">{timestamp}</div>
      </div>
    </div>
  )
}

function UserMessage({ name, role, message, timestamp }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%]">
        <div className="flex items-baseline justify-end">
          <span className="text-xs text-gray-500 mr-2">{role}</span>
          <span className="font-medium text-sm">{name}</span>
        </div>
        <div className="bg-gray-100 rounded-lg rounded-tr-none p-3 mt-1 text-sm">{message}</div>
        <div className="text-xs text-gray-500 mt-1 text-right">{timestamp}</div>
      </div>
    </div>
  )
}

function Info(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  )
}

function VesselSelector({ vessels, selectedVessel, onVesselChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const selectedVesselData = vessels.find((v) => v.id === selectedVessel)

  return (
    <div className="relative">
      <Button variant="outline" className="flex items-center gap-2 min-w-[180px]" onClick={() => setIsOpen(!isOpen)}>
        <Ship className="h-4 w-4" />
        <span className="font-medium">{selectedVesselData?.name}</span>
        <ChevronDown className="h-4 w-4 ml-auto" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-[250px] bg-white border rounded-md shadow-lg z-10">
          <div className="p-2 border-b">
            <h3 className="text-sm font-medium text-gray-500">Select Vessel</h3>
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {vessels.map((vessel) => (
              <div
                key={vessel.id}
                className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer ${selectedVessel === vessel.id ? "bg-blue-50" : ""}`}
                onClick={() => {
                  onVesselChange(vessel.id)
                  setIsOpen(false)
                }}
              >
                <Avatar className="h-8 w-8 mr-3">
                  <AvatarFallback className="bg-blue-100 text-blue-600">{vessel.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{vessel.name}</div>
                  <div className="text-xs text-gray-500">
                    {vessel.type} • {vessel.flag}
                  </div>
                </div>
                {selectedVessel === vessel.id && <CheckCircle className="h-4 w-4 text-blue-500 ml-auto" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
