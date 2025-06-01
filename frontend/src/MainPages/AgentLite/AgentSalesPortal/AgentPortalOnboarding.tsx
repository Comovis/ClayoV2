"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Download,
  Play,
  FileText,
  DollarSign,
  Users,
  CheckCircle,
  Mail,
  Phone,
  Calendar,
  Target,
  TrendingUp,
  Shield,
  Globe,
} from "lucide-react"

export default function AgentOnboardingMaterials() {
  const [activeTab, setActiveTab] = useState("welcome")
  const [completedSteps, setCompletedSteps] = useState([])

  const onboardingSteps = [
    {
      id: "welcome",
      title: "Welcome & Overview",
      description: "Introduction to the agent program",
      duration: "10 min",
      completed: true,
    },
    {
      id: "commission",
      title: "Commission Structure",
      description: "How you earn money",
      duration: "5 min",
      completed: false,
    },
    {
      id: "platform",
      title: "Platform Demo",
      description: "See what you're selling",
      duration: "15 min",
      completed: false,
    },
    {
      id: "sales",
      title: "Sales Training",
      description: "How to approach prospects",
      duration: "20 min",
      completed: false,
    },
    {
      id: "materials",
      title: "Marketing Materials",
      description: "Download resources",
      duration: "5 min",
      completed: false,
    },
    {
      id: "setup",
      title: "Account Setup",
      description: "Get your referral links",
      duration: "10 min",
      completed: false,
    },
  ]

  const commissionTiers = [
    {
      tier: "Bronze",
      requirement: "1-5 vessels/month",
      initialCommission: "15%",
      recurringCommission: "8%",
      bonuses: "None",
      example: "$450-2,250/month",
    },
    {
      tier: "Silver",
      requirement: "6-15 vessels/month",
      initialCommission: "20%",
      recurringCommission: "10%",
      bonuses: "$500 quarterly bonus",
      example: "$1,800-9,000/month",
    },
    {
      tier: "Gold",
      requirement: "16+ vessels/month",
      initialCommission: "25%",
      recurringCommission: "12%",
      bonuses: "$1,000 quarterly bonus",
      example: "$4,800+/month",
    },
  ]

  const salesMaterials = [
    {
      id: "pitch-deck",
      name: "Agent Pitch Deck",
      type: "PowerPoint",
      description: "Complete presentation for client meetings",
      size: "4.2 MB",
      pages: "12 slides",
    },
    {
      id: "roi-calculator",
      name: "ROI Calculator",
      type: "Excel",
      description: "Show clients their potential savings",
      size: "1.8 MB",
      pages: "Interactive",
    },
    {
      id: "case-studies",
      name: "Customer Case Studies",
      type: "PDF",
      description: "Real success stories from existing clients",
      size: "2.1 MB",
      pages: "8 pages",
    },
    {
      id: "comparison-sheet",
      name: "Competitor Comparison",
      type: "PDF",
      description: "How we stack up against alternatives",
      size: "1.2 MB",
      pages: "4 pages",
    },
    {
      id: "email-templates",
      name: "Email Templates",
      type: "Word",
      description: "Pre-written emails for different scenarios",
      size: "0.8 MB",
      pages: "6 templates",
    },
    {
      id: "objection-handling",
      name: "Objection Handling Guide",
      type: "PDF",
      description: "Responses to common client concerns",
      size: "1.5 MB",
      pages: "10 pages",
    },
  ]

  const trainingVideos = [
    {
      id: "platform-overview",
      title: "Platform Overview",
      duration: "8:30",
      description: "Complete walkthrough of all features",
    },
    {
      id: "document-management",
      title: "Document Management Demo",
      duration: "6:15",
      description: "Show how clients manage vessel documents",
    },
    {
      id: "port-preparation",
      title: "Port Preparation Features",
      duration: "5:45",
      description: "Demonstrate port call preparation tools",
    },
    {
      id: "compliance-tracking",
      title: "Compliance Tracking",
      duration: "4:20",
      description: "How the system tracks certificate expiry",
    },
    {
      id: "sales-demo",
      title: "Perfect Sales Demo",
      duration: "12:10",
      description: "Watch a successful client presentation",
    },
  ]

  const completionPercentage = (completedSteps.length / onboardingSteps.length) * 100

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Agent Onboarding Portal</h1>
        <p className="text-gray-600">Welcome to the Comovis Agent Program</p>

        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Onboarding Progress</span>
            <span className="text-sm text-gray-500">
              {completedSteps.length}/{onboardingSteps.length} completed
            </span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="welcome">Welcome</TabsTrigger>
          <TabsTrigger value="commission">Commission</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="setup">Setup</TabsTrigger>
        </TabsList>

        <TabsContent value="welcome">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                    Welcome to the Comovis Agent Program
                  </CardTitle>
                  <CardDescription>
                    You're now part of an exclusive network of maritime professionals earning significant commissions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-medium text-blue-900 mb-2">What You're Selling</h3>
                    <p className="text-blue-800 text-sm">
                      Comovis is a comprehensive maritime compliance platform that helps vessel operators manage
                      documents, prepare for port calls, and ensure regulatory compliance. It saves them time, reduces
                      risks, and streamlines their operations.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                      <DollarSign className="h-8 w-8 text-green-500 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium">High Commission Rates</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Earn 15-25% on initial sales plus 8-12% recurring commissions
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                      <Users className="h-8 w-8 text-blue-500 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium">Existing Relationships</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Leverage your current client base - no cold calling required
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                      <Shield className="h-8 w-8 text-purple-500 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium">Proven Solution</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          98% customer retention rate with measurable ROI for clients
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                      <Globe className="h-8 w-8 text-indigo-500 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium">Territory Protection</h4>
                        <p className="text-sm text-gray-600 mt-1">Exclusive agent rights for your port/region</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-medium text-green-900 mb-2">Success Story</h3>
                    <p className="text-green-800 text-sm">
                      "Our Rotterdam agent earned $18,200 in commissions last year by referring just 8-12 vessels per
                      month. The clients love the solution and it's become a valuable add-on service for our port agency
                      business."
                    </p>
                    <p className="text-green-700 text-xs mt-2 font-medium">- Maria van Berg, Rotterdam Port Services</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Onboarding Checklist</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {onboardingSteps.map((step, index) => (
                      <div key={step.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <div
                          className={`h-6 w-6 rounded-full flex items-center justify-center mr-3 ${
                            step.completed ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"
                          }`}
                        >
                          {step.completed ? <CheckCircle className="h-4 w-4" /> : index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{step.title}</p>
                          <p className="text-xs text-gray-500">{step.duration}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Onboarding Call
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Agent Agreement
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="commission">
          <Card>
            <CardHeader>
              <CardTitle>Commission Structure</CardTitle>
              <CardDescription>Understand how you earn money and advance through our tier system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {commissionTiers.map((tier, index) => (
                  <Card key={tier.tier} className={`${index === 1 ? "border-blue-500 border-2" : ""}`}>
                    <CardHeader className="text-center">
                      <CardTitle className="flex items-center justify-center">
                        {tier.tier}
                        {index === 1 && <Badge className="ml-2">Most Popular</Badge>}
                      </CardTitle>
                      <CardDescription>{tier.requirement}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{tier.example}</div>
                        <p className="text-sm text-gray-500">Estimated monthly earnings</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Initial Commission:</span>
                          <span className="font-medium">{tier.initialCommission}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Recurring Commission:</span>
                          <span className="font-medium">{tier.recurringCommission}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Quarterly Bonus:</span>
                          <span className="font-medium">{tier.bonuses}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-medium text-blue-900 mb-4">Commission Calculation Example</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Scenario: 10 vessels/month (Silver Tier)</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Average subscription per vessel:</span>
                        <span>$150/month</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Initial commission (20%):</span>
                        <span>$300/vessel</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly initial commissions:</span>
                        <span className="font-medium">$3,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Recurring commission (10%):</span>
                        <span>$15/vessel/month</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly recurring (after 12 months):</span>
                        <span className="font-medium">$1,800</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-medium">Total monthly (year 2):</span>
                        <span className="font-bold text-green-600">$4,800</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Payment Schedule</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>Initial commission paid when client activates</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>Recurring commissions paid monthly</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>Quarterly bonuses paid every 3 months</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>Payments via bank transfer or PayPal</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>Detailed monthly commission reports</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Training Videos</CardTitle>
                <CardDescription>Watch these videos to understand the platform and sales process</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trainingVideos.map((video) => (
                    <div key={video.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <Play className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{video.title}</p>
                          <p className="text-xs text-gray-500">{video.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{video.duration}</p>
                        <Button size="sm" variant="outline" className="mt-1">
                          Watch
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sales Process</CardTitle>
                <CardDescription>Follow this proven process for maximum success</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="h-8 w-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3 text-sm font-medium">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">Identify Pain Points</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Ask about their current document management challenges, compliance issues, and port preparation
                        processes.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="h-8 w-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3 text-sm font-medium">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">Demonstrate Value</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Show how Comovis solves their specific problems. Use the ROI calculator to quantify savings.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="h-8 w-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3 text-sm font-medium">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium">Handle Objections</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Use the objection handling guide to address common concerns about cost, implementation, and
                        change management.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="h-8 w-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3 text-sm font-medium">
                      4
                    </div>
                    <div>
                      <h4 className="font-medium">Offer Trial</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Suggest a 30-day free trial to let them experience the value firsthand with no risk.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="h-8 w-8 bg-green-500 text-white rounded-full flex items-center justify-center mr-3 text-sm font-medium">
                      5
                    </div>
                    <div>
                      <h4 className="font-medium">Close & Support</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Help with onboarding and stay involved to ensure success. Happy customers lead to referrals and
                        renewals.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="materials">
          <Card>
            <CardHeader>
              <CardTitle>Marketing Materials</CardTitle>
              <CardDescription>Download everything you need to sell effectively</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {salesMaterials.map((material) => (
                  <div key={material.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{material.name}</p>
                        <p className="text-sm text-gray-500">{material.description}</p>
                        <p className="text-xs text-gray-400">
                          {material.type} • {material.size} • {material.pages}
                        </p>
                      </div>
                    </div>
                    <Button size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-medium text-yellow-900 mb-2">Usage Guidelines</h3>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• All materials are branded and ready to use</li>
                  <li>• You may add your contact information to any document</li>
                  <li>• Do not modify pricing or technical specifications</li>
                  <li>• Always use the latest version (check monthly for updates)</li>
                  <li>• Contact support if you need custom materials for specific clients</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="setup">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Setup</CardTitle>
                <CardDescription>Complete your agent profile and get your referral links</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-medium text-green-900 mb-2">Your Referral Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Agent ID:</span>
                      <span className="font-mono">AG-SG-001</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Territory:</span>
                      <span>Singapore</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Referral Code:</span>
                      <span className="font-mono">SINGAPORE001</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Your Referral Link</label>
                  <div className="flex mt-1">
                    <input
                      type="text"
                      value="https://comovis.co/signup?ref=SINGAPORE001"
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-sm"
                    />
                    <Button className="rounded-l-none">Copy</Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Commission Tracking</label>
                  <p className="text-sm text-gray-600 mt-1">
                    All referrals through your link are automatically tracked. You'll receive monthly commission reports
                    and can view real-time stats in your agent portal.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
                <CardDescription>What to do after completing onboarding</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start p-3 bg-blue-50 rounded-lg">
                    <Target className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Set Your Goals</h4>
                      <p className="text-sm text-blue-800 mt-1">
                        Aim for 2-3 referrals in your first month. Most successful agents start with existing clients.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start p-3 bg-green-50 rounded-lg">
                    <Users className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-900">Identify Prospects</h4>
                      <p className="text-sm text-green-800 mt-1">
                        Make a list of 10-15 vessel operators you work with who might benefit from better compliance
                        management.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start p-3 bg-purple-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-purple-500 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-purple-900">Schedule Meetings</h4>
                      <p className="text-sm text-purple-800 mt-1">
                        Book 15-minute discovery calls with your top prospects. Use the scheduling link we'll provide.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start p-3 bg-yellow-50 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-900">Track Progress</h4>
                      <p className="text-sm text-yellow-800 mt-1">
                        Use your agent portal to monitor referrals, commissions, and performance metrics.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t">
                  <Button className="w-full">
                    <Phone className="h-4 w-4 mr-2" />
                    Schedule Your Success Call
                  </Button>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Book a 30-minute call with our team to plan your first month
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
