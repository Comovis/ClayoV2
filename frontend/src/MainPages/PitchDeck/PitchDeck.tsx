"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  ChevronLeft,
  ChevronRight,
  Ship,
  Shield,
  FileText,
  Globe,
  Users,
  TrendingUp,
  BarChart4,
  CheckCircle,
  AlertTriangle,
  Clock,
  Anchor,
  Briefcase,
  Zap,
  Network,
  Brain,
  ArrowRight,
  Settings,
  MapPin,
  Truck,
  Database,
  Lock,
  Upload,
  Cpu,
  Scan,
  FileSearch,
  Server,
  CloudIcon as CloudLock,
  UserCheck,
} from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ChartContainer } from "@/components/ui/chart"

export default function PitchDeck() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const totalSlides = 12

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  // Revenue projection data
  const revenueData = [
    { year: 2025, revenue: 850000, vessels: 130 },
    { year: 2026, revenue: 2500000, vessels: 380 },
    { year: 2027, revenue: 5800000, vessels: 880 },
    { year: 2028, revenue: 11500000, vessels: 1750 },
    { year: 2029, revenue: 19800000, vessels: 3000 },
  ]

  // Market size data
  const marketSizeData = [
    { name: "Tankers", value: 17000 },
    { name: "Bulk Carriers", value: 12000 },
    { name: "Container Ships", value: 5500 },
    { name: "General Cargo", value: 18000 },
    { name: "Other", value: 7500 },
  ]

  // Detention data
  const detentionData = [
    { region: "Asia-Pacific", rate: 3.2, count: 1280 },
    { region: "Europe", rate: 2.8, count: 980 },
    { region: "North America", rate: 1.9, count: 670 },
    { region: "Middle East", rate: 4.1, count: 540 },
    { region: "Latin America", rate: 5.3, count: 390 },
  ]

  // Cost savings data
  const costSavingsData = [
    { category: "Detention Costs", withoutComovis: 520000, withComovis: 104000 },
    { category: "Documentation Delays", withoutComovis: 380000, withComovis: 95000 },
    { category: "Staff Overhead", withoutComovis: 220000, withComovis: 154000 },
    { category: "Compliance Penalties", withoutComovis: 180000, withComovis: 36000 },
  ]

  // Persona data
  const personaData = [
    {
      title: "Fleet Manager",
      pain: "Struggling to keep track of certificates across multiple vessels",
      goal: "Centralized view of compliance status",
      quote: "I need to know at a glance if all our vessels are compliant for upcoming port calls.",
      icon: Ship,
    },
    {
      title: "Technical Superintendent",
      pain: "Spending hours gathering documents for PSC inspections",
      goal: "Quick access to required documents",
      quote: "When a port authority requests documents, I need them immediately, not after hours of searching.",
      icon: FileText,
    },
    {
      title: "Designated Person Ashore (DPA)",
      pain: "Constant worry about compliance gaps and potential detentions",
      goal: "Proactive compliance risk management",
      quote: "I need to identify compliance gaps before they become deficiencies that lead to detentions.",
      icon: Shield,
    },
  ]

  // AI workflow examples - redesigned for operational focus
  const operationalWorkflows = [
    {
      title: "Voyage Planning & Optimization",
      description:
        "AI agents automatically plan optimal routes, considering weather, fuel costs, port schedules, and cargo requirements",
      currentProcess: "Manual route planning taking 4-6 hours per voyage",
      aiProcess: "Automated optimization in minutes with real-time adjustments",
      savings: "15-20% fuel cost reduction",
      icon: MapPin,
      color: "blue",
    },
    {
      title: "Crew Management & Scheduling",
      description:
        "Intelligent crew rotation, certification tracking, and optimal manning based on voyage requirements and regulations",
      currentProcess: "Manual crew scheduling across spreadsheets and emails",
      aiProcess: "Automated crew optimization with compliance verification",
      savings: "30% reduction in crew management overhead",
      icon: Users,
      color: "green",
    },
    {
      title: "Maintenance Planning & Execution",
      description: "Predictive maintenance scheduling based on equipment data, voyage plans, and port availability",
      currentProcess: "Reactive maintenance causing unexpected downtime",
      aiProcess: "Proactive maintenance preventing 90% of breakdowns",
      savings: "25% reduction in maintenance costs",
      icon: Settings,
      color: "purple",
    },
    {
      title: "Port Operations Coordination",
      description:
        "Automated coordination with port authorities, agents, and service providers for seamless port calls",
      currentProcess: "Manual coordination via phone calls and emails",
      aiProcess: "Automated scheduling and document preparation",
      savings: "40% reduction in port call duration",
      icon: Anchor,
      color: "orange",
    },
    {
      title: "Cargo Operations Management",
      description: "Intelligent cargo loading optimization, documentation, and tracking throughout the supply chain",
      currentProcess: "Manual cargo planning and paper-based tracking",
      aiProcess: "Automated cargo optimization and digital tracking",
      savings: "20% improvement in cargo efficiency",
      icon: Truck,
      color: "teal",
    },
    {
      title: "Fleet Performance Analytics",
      description: "Real-time fleet performance monitoring with automated insights and optimization recommendations",
      currentProcess: "Monthly reports with limited actionable insights",
      aiProcess: "Real-time analytics with automated recommendations",
      savings: "10-15% overall operational efficiency gain",
      icon: BarChart4,
      color: "indigo",
    },
  ]

  // Custom tooltip for revenue chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{`Year: ${label}`}</p>
          <p className="text-blue-600">
            <span className="inline-block w-3 h-3 bg-blue-600 rounded-full mr-2"></span>
            {`Revenue: £${(payload[0].value / 1000000).toFixed(1)}M`}
          </p>
          <p className="text-green-600">
            <span className="inline-block w-3 h-3 bg-green-600 rounded-full mr-2"></span>
            {`Vessels: ${payload[1].value.toLocaleString()}`}
          </p>
        </div>
      )
    }
    return null
  }

  // COLORS
  const COLORS = ["#334155", "#475569", "#64748b", "#94a3b8", "#cbd5e1"]
  const PRIMARY_COLOR = "#334155"
  const SECONDARY_COLOR = "#64748b"

  return (
    <div className="w-full h-full bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex justify-between items-center mb-8">
          <Button variant="outline" onClick={prevSlide} disabled={currentSlide === 0}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>

          <div className="flex space-x-1">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full ${currentSlide === index ? "bg-blue-600" : "bg-gray-300"}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>

          <Button variant="outline" onClick={nextSlide} disabled={currentSlide === totalSlides - 1}>
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Slides */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            {/* Cover Slide */}
            {currentSlide === 0 && (
              <div className="flex flex-col items-center justify-center min-h-[500px] text-center">
                <div className="mb-6 flex items-center">
                  <Ship className="h-16 w-16 text-slate-700 mr-3" />
                  <Anchor className="h-12 w-12 text-slate-600" />
                </div>
                <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Comovis
                </h1>
                <p className="text-2xl text-gray-600 mb-6 max-w-2xl">
                  Preventing vessel detentions and delays through intelligent maritime compliance
                </p>
                <Badge className="text-lg py-1 px-3 bg-slate-100 text-slate-800 border border-slate-200">
                  Pre-Seed Investment Opportunity • 2025
                </Badge>
              </div>
            )}

            {/* Problem Slide */}
            {currentSlide === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[500px]">
                <div>
                  <h2 className="text-3xl font-bold mb-6 text-gray-800">The Problem</h2>

                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="bg-slate-100 p-2 rounded-full mr-4">
                        <AlertTriangle className="h-6 w-6 text-slate-700" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Vessel Detentions</h3>
                        <p className="text-gray-600">
                          Over 7,500 vessels are detained annually due to compliance issues, costing operators millions.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-slate-100 p-2 rounded-full mr-4">
                        <Clock className="h-6 w-6 text-slate-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Documentation Chaos</h3>
                        <p className="text-gray-600">
                          Maritime operators struggle with fragmented document management across emails, paper files,
                          and disparate systems.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-slate-100 p-2 rounded-full mr-4">
                        <Globe className="h-6 w-6 text-slate-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Variable Port Requirements</h3>
                        <p className="text-gray-600">
                          Each port has unique, constantly changing compliance requirements that are difficult to track.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-amber-800 font-medium">
                      On average, a single detention costs a vessel operator $30,000-$120,000 in direct costs and lost
                      revenue.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col justify-center">
                  <h3 className="text-xl font-semibold mb-4 text-center">Port State Control Detentions by Region</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={detentionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="region" />
                      <YAxis yAxisId="left" orientation="left" stroke={PRIMARY_COLOR} />
                      <YAxis yAxisId="right" orientation="right" stroke={SECONDARY_COLOR} />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="count" name="Detentions" fill={PRIMARY_COLOR} />
                      <Bar yAxisId="right" dataKey="rate" name="Detention Rate (%)" fill={SECONDARY_COLOR} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Solution Slide - Enhanced with Technology */}
            {currentSlide === 2 && (
              <div className="min-h-[500px]">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Solution</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card className="border-t-4 border-t-slate-700">
                    <CardContent className="pt-6">
                      <div className="flex items-center mb-4">
                        <div className="bg-slate-100 p-2 rounded-full mr-3">
                          <Brain className="h-6 w-6 text-slate-700" />
                        </div>
                        <h3 className="font-semibold text-lg">AI Document Intelligence</h3>
                      </div>
                      <p className="text-gray-600 mb-4">
                        Revolutionary AI algorithms that can read and understand even the worst handwritten documents,
                        scanned PDFs, images, and Word files with 99.7% accuracy.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-slate-700">
                          <Scan className="h-4 w-4 text-green-500 mr-2" />
                          <span>OCR + Computer Vision</span>
                        </div>
                        <div className="flex items-center text-sm text-slate-700">
                          <FileSearch className="h-4 w-4 text-green-500 mr-2" />
                          <span>Automatic classification</span>
                        </div>
                        <div className="flex items-center text-sm text-slate-700">
                          <Cpu className="h-4 w-4 text-green-500 mr-2" />
                          <span>Real-time processing</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-t-4 border-t-slate-600">
                    <CardContent className="pt-6">
                      <div className="flex items-center mb-4">
                        <div className="bg-slate-100 p-2 rounded-full mr-3">
                          <Shield className="h-6 w-6 text-slate-600" />
                        </div>
                        <h3 className="font-semibold text-lg">Enterprise Security</h3>
                      </div>
                      <p className="text-gray-600 mb-4">
                        Military-grade AES-256 encryption at rest and in transit, EU data centers, and robust Row-Level
                        Security (RLS) for complete data protection.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-slate-600">
                          <Lock className="h-4 w-4 text-green-500 mr-2" />
                          <span>AES-256 encryption</span>
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                          <Server className="h-4 w-4 text-green-500 mr-2" />
                          <span>EU data centers</span>
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                          <UserCheck className="h-4 w-4 text-green-500 mr-2" />
                          <span>Robust RLS</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-t-4 border-t-slate-500">
                    <CardContent className="pt-6">
                      <div className="flex items-center mb-4">
                        <div className="bg-slate-100 p-2 rounded-full mr-3">
                          <Globe className="h-6 w-6 text-slate-500" />
                        </div>
                        <h3 className="font-semibold text-lg">Live Port Intelligence</h3>
                      </div>
                      <p className="text-gray-600 mb-4">
                        Real-time integration with port call data and port intelligence systems, providing
                        up-to-the-minute compliance requirements.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-slate-500">
                          <Database className="h-4 w-4 text-green-500 mr-2" />
                          <span>Live data feeds</span>
                        </div>
                        <div className="flex items-center text-sm text-slate-500">
                          <Network className="h-4 w-4 text-green-500 mr-2" />
                          <span>API integrations</span>
                        </div>
                        <div className="flex items-center text-sm text-slate-500">
                          <Zap className="h-4 w-4 text-green-500 mr-2" />
                          <span>Real-time updates</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Interactive Demo Preview */}
                <div className="bg-gradient-to-r from-slate-900 to-blue-900 p-8 rounded-2xl text-white">
                  <h3 className="text-2xl font-semibold mb-6 text-center">See Our Technology in Action</h3>

                  <Tabs defaultValue="document-processing" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-white/10">
                      <TabsTrigger value="document-processing" className="text-white data-[state=active]:bg-white/20">
                        Document Processing
                      </TabsTrigger>
                      <TabsTrigger value="security" className="text-white data-[state=active]:bg-white/20">
                        Security Features
                      </TabsTrigger>
                      <TabsTrigger value="live-data" className="text-white data-[state=active]:bg-white/20">
                        Live Port Data
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="document-processing" className="mt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                          <h4 className="font-semibold mb-3 flex items-center">
                            <Upload className="h-5 w-5 mr-2" />
                            Document Upload
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Processing handwritten SMC...</span>
                              <span>99.7%</span>
                            </div>
                            <Progress value={97} className="h-2" />
                            <div className="text-xs text-blue-200">
                              ✓ Text extracted ✓ Dates identified ✓ Issuer verified
                            </div>
                          </div>
                        </div>

                        <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                          <h4 className="font-semibold mb-3 flex items-center">
                            <FileSearch className="h-5 w-5 mr-2" />
                            Classification Results
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Document Type:</span>
                              <span className="text-green-300">Safety Management Certificate</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Expiry Date:</span>
                              <span className="text-yellow-300">2024-11-15</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Confidence:</span>
                              <span className="text-green-300">99.7%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="security" className="mt-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm text-center">
                          <CloudLock className="h-8 w-8 mx-auto mb-2 text-green-400" />
                          <h4 className="font-semibold">AES-256 Encryption</h4>
                          <p className="text-sm text-blue-200">Military-grade security</p>
                        </div>
                        <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm text-center">
                          <Server className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                          <h4 className="font-semibold">EU Data Centers</h4>
                          <p className="text-sm text-blue-200">GDPR compliant</p>
                        </div>
                        <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm text-center">
                          <UserCheck className="h-8 w-8 mx-auto mb-2 text-purple-400" />
                          <h4 className="font-semibold">Row-Level Security</h4>
                          <p className="text-sm text-blue-200">Granular access control</p>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="live-data" className="mt-6">
                      <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                        <h4 className="font-semibold mb-4 flex items-center">
                          <Database className="h-5 w-5 mr-2" />
                          Live Port Intelligence Feed
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-2 bg-white/10 rounded">
                            <span className="text-sm">Singapore MPA - New CIC Focus</span>
                            <Badge className="bg-green-500/20 text-green-300">Live</Badge>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-white/10 rounded">
                            <span className="text-sm">Rotterdam - Updated MARPOL Requirements</span>
                            <Badge className="bg-blue-500/20 text-blue-300">2 min ago</Badge>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-white/10 rounded">
                            <span className="text-sm">Hamburg - PSC Inspection Schedule</span>
                            <Badge className="bg-yellow-500/20 text-yellow-300">5 min ago</Badge>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            )}

            {/* Technology Deep Dive - NEW SLIDE */}
            {currentSlide === 3 && (
              <div className="min-h-[500px]">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Revolutionary AI Technology</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Custom AI Document Processing</h3>
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="bg-blue-100 p-2 rounded-lg mr-3">
                            <Scan className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-blue-900">Advanced OCR + Computer Vision</h4>
                            <p className="text-sm text-blue-700">
                              Processes even the worst handwritten documents, faded scans, and complex layouts with
                              99.7% accuracy
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <div className="bg-purple-100 p-2 rounded-lg mr-3">
                            <Brain className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-purple-900">Intelligent Classification</h4>
                            <p className="text-sm text-purple-700">
                              Automatically identifies document types, extracts key dates, and validates against
                              maritime standards
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <div className="bg-green-100 p-2 rounded-lg mr-3">
                            <Zap className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-green-900">Real-time Processing</h4>
                            <p className="text-sm text-green-700">
                              Documents processed in under 3 seconds with immediate validation and compliance checking
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 bg-slate-100 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Supported Formats</h4>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <span className="bg-white p-2 rounded text-center">PDF</span>
                        <span className="bg-white p-2 rounded text-center">JPG/PNG</span>
                        <span className="bg-white p-2 rounded text-center">Word</span>
                        <span className="bg-white p-2 rounded text-center">Handwritten</span>
                        <span className="bg-white p-2 rounded text-center">Scanned</span>
                        <span className="bg-white p-2 rounded text-center">Faxed</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">Enterprise Security Architecture</h3>
                    <div className="bg-gradient-to-br from-slate-50 to-gray-50 p-6 rounded-xl border border-slate-200">
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="bg-red-100 p-2 rounded-lg mr-3">
                            <Lock className="h-5 w-5 text-red-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-red-900">AES-256 Encryption</h4>
                            <p className="text-sm text-red-700">
                              Military-grade encryption at rest and in transit. Zero-knowledge architecture ensures even
                              we can't access your data
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <div className="bg-blue-100 p-2 rounded-lg mr-3">
                            <Server className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-blue-900">EU Data Centers</h4>
                            <p className="text-sm text-blue-700">
                              GDPR-compliant infrastructure with data residency guarantees. SOC 2 Type II certified
                              facilities
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <div className="bg-green-100 p-2 rounded-lg mr-3">
                            <UserCheck className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-green-900">Robust RLS</h4>
                            <p className="text-sm text-green-700">
                              Row-Level Security ensures users only see data they're authorized to access. Multi-tenant
                              isolation
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Demo Section */}
                <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 p-8 rounded-2xl text-white">
                  <h3 className="text-2xl font-semibold mb-6 text-center">Live Document Processing Demo</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                      <h4 className="font-semibold mb-3">Document Upload</h4>
                      <div className="border-2 border-dashed border-white/30 rounded-lg p-4 text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-white/70" />
                        <p className="text-sm text-white/70">Drop handwritten SMC here</p>
                      </div>
                      <div className="mt-3 text-xs text-white/60">Supports: Handwritten, Scanned, Faded, Rotated</div>
                    </div>

                    <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                      <h4 className="font-semibold mb-3">AI Processing</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>OCR Analysis</span>
                          <span className="text-green-300">✓ Complete</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Text Extraction</span>
                          <span className="text-green-300">✓ 99.7%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Classification</span>
                          <span className="text-yellow-300">⟳ Processing</span>
                        </div>
                        <Progress value={75} className="h-2 mt-2" />
                      </div>
                    </div>

                    <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                      <h4 className="font-semibold mb-3">Results</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <strong>Type:</strong> Safety Management Certificate
                        </div>
                        <div>
                          <strong>Issuer:</strong> Panama Maritime Authority
                        </div>
                        <div>
                          <strong>Expiry:</strong> <span className="text-yellow-300">2024-11-15</span>
                        </div>
                        <div>
                          <strong>Status:</strong> <span className="text-green-300">Valid</span>
                        </div>
                        <div>
                          <strong>Confidence:</strong> <span className="text-green-300">99.7%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center mt-6">
                    <p className="text-lg font-medium text-white/90">
                      Processing time: <span className="text-green-300">2.3 seconds</span> • Cost per document:{" "}
                      <span className="text-green-300">£0.05</span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Long-term Vision Slide - Redesigned */}
            {currentSlide === 4 && (
              <div className="min-h-[500px]">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4 text-gray-800">Long-term Vision</h2>
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-20"></div>
                      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full">
                        <Brain className="h-12 w-12 text-white" />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    The Maritime AI Operations Platform
                  </h3>
                  <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
                    Transforming maritime operations through intelligent AI agents that automate complex workflows,
                    eliminate manual processes, and optimize every aspect of vessel operations.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {operationalWorkflows.map((workflow, index) => (
                    <Card
                      key={index}
                      className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          <div
                            className={`bg-${workflow.color}-100 p-3 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300`}
                          >
                            <workflow.icon className={`h-6 w-6 text-${workflow.color}-600`} />
                          </div>
                          <h4 className="font-semibold text-gray-800 text-sm leading-tight">{workflow.title}</h4>
                        </div>

                        <p className="text-sm text-gray-600 mb-4 leading-relaxed">{workflow.description}</p>

                        <div className="space-y-3">
                          <div className="bg-red-50 p-3 rounded-lg border-l-4 border-red-200">
                            <p className="text-xs font-medium text-red-700 mb-1">Current Process</p>
                            <p className="text-xs text-red-600">{workflow.currentProcess}</p>
                          </div>

                          <div className="flex items-center justify-center py-2">
                            <ArrowRight className="h-4 w-4 text-gray-400" />
                          </div>

                          <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-200">
                            <p className="text-xs font-medium text-green-700 mb-1">AI-Powered Process</p>
                            <p className="text-xs text-green-600">{workflow.aiProcess}</p>
                          </div>

                          <div className={`bg-${workflow.color}-50 p-2 rounded-lg text-center`}>
                            <p className={`text-xs font-semibold text-${workflow.color}-700`}>{workflow.savings}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 p-8 rounded-2xl text-white">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center">
                      <div className="bg-white/10 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center backdrop-blur-sm">
                        <Zap className="h-10 w-10 text-yellow-400" />
                      </div>
                      <h4 className="font-semibold text-xl mb-2">Autonomous Operations</h4>
                      <p className="text-blue-100 text-sm leading-relaxed">
                        AI agents that handle complex operational decisions, from voyage planning to crew management,
                        reducing human intervention by 80%
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="bg-white/10 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center backdrop-blur-sm">
                        <Network className="h-10 w-10 text-green-400" />
                      </div>
                      <h4 className="font-semibold text-xl mb-2">Intelligent Ecosystem</h4>
                      <p className="text-blue-100 text-sm leading-relaxed">
                        Seamlessly connected maritime stakeholders through AI-driven coordination, eliminating
                        communication delays and errors
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="bg-white/10 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center backdrop-blur-sm">
                        <Database className="h-10 w-10 text-purple-400" />
                      </div>
                      <h4 className="font-semibold text-xl mb-2">Predictive Intelligence</h4>
                      <p className="text-blue-100 text-sm leading-relaxed">
                        Advanced analytics that predict operational challenges before they occur, enabling proactive
                        decision-making across the fleet
                      </p>
                    </div>
                  </div>

                  <div className="text-center mt-8 pt-6 border-t border-white/20">
                    <p className="text-lg font-medium text-blue-100">
                      "From reactive operations to predictive intelligence - transforming how maritime businesses
                      operate"
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Target Market & Personas */}
            {currentSlide === 5 && (
              <div className="min-h-[500px]">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Target Market & User Personas</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Addressable Market</h3>
                    <div className="mb-6">
                      <p className="text-gray-600 mb-4">
                        Our initial target market includes commercial vessels over 500 GT that are subject to Port State
                        Control inspections globally.
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          <span>
                            <strong>60,000+</strong> vessels in our target segment
                          </span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          <span>
                            <strong>5,000+</strong> ship management companies
                          </span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          <span>
                            <strong>$1.2B</strong> annual market opportunity
                          </span>
                        </li>
                      </ul>
                    </div>

                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={marketSizeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {marketSizeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">Key User Personas</h3>
                    <div className="space-y-4">
                      {personaData.map((persona, index) => (
                        <Card key={index} className="overflow-hidden">
                          <CardContent className="p-4">
                            <div className="flex items-center mb-3">
                              <div className="bg-blue-100 p-2 rounded-full mr-3">
                                <persona.icon className="h-5 w-5 text-blue-600" />
                              </div>
                              <h4 className="font-semibold">{persona.title}</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-3 mb-3">
                              <div>
                                <p className="text-xs text-gray-500">Pain Point</p>
                                <p className="text-sm">{persona.pain}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Goal</p>
                                <p className="text-sm">{persona.goal}</p>
                              </div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-md italic text-sm text-gray-600">
                              "{persona.quote}"
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Business Model */}
            {currentSlide === 6 && (
              <div className="min-h-[500px]">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Business Model</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">SaaS Subscription Model</h3>
                    <Card className="mb-6">
                      <CardContent className="pt-6">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left pb-2">Plan</th>
                              <th className="text-right pb-2">Price per Vessel</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b">
                              <td className="py-3">
                                <div className="font-medium">Essentials</div>
                                <div className="text-sm text-gray-500">For small operators (1-5 vessels)</div>
                              </td>
                              <td className="text-right py-3">
                                <div className="font-semibold">£389</div>
                                <div className="text-sm text-gray-500">per month</div>
                              </td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-3">
                                <div className="font-medium">Professional</div>
                                <div className="text-sm text-gray-500">For mid-sized operators (6-20 vessels)</div>
                              </td>
                              <td className="text-right py-3">
                                <div className="font-semibold">£309</div>
                                <div className="text-sm text-gray-500">per month</div>
                              </td>
                            </tr>
                            <tr>
                              <td className="py-3">
                                <div className="font-medium">Enterprise</div>
                                <div className="text-sm text-gray-500">For large operators (20+ vessels)</div>
                              </td>
                              <td className="text-right py-3">
                                <div className="font-semibold">£229-£269</div>
                                <div className="text-sm text-gray-500">per month</div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </CardContent>
                    </Card>

                    <h3 className="text-xl font-semibold mb-4">Additional Revenue Streams</h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="bg-purple-100 p-2 rounded-full mr-3 mt-1">
                          <Shield className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Premium Add-ons</h4>
                          <p className="text-sm text-gray-600">
                            Deficiency Prevention Intelligence (£77/vessel/month), Port Intelligence Premium
                            (£116/vessel/month)
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="bg-green-100 p-2 rounded-full mr-3 mt-1">
                          <Briefcase className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Implementation Services</h4>
                          <p className="text-sm text-gray-600">
                            Premium implementation (£3,900 one-time), Enterprise implementation (custom pricing)
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="bg-blue-100 p-2 rounded-full mr-3 mt-1">
                          <Globe className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">API Access & Integrations</h4>
                          <p className="text-sm text-gray-600">
                            Integration with existing fleet management systems and third-party services
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">Customer ROI</h3>
                    <p className="mb-4 text-gray-600">
                      Comovis delivers significant ROI for maritime operators through detention prevention and
                      operational efficiency:
                    </p>

                    <Card className="mb-6">
                      <CardContent className="pt-6">
                        <h4 className="font-medium mb-4">Cost Savings for a 10-Vessel Fleet</h4>
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart
                            data={costSavingsData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            layout="vertical"
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="category" type="category" width={150} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="withoutComovis" name="Without Comovis" fill="#ef4444" />
                            <Bar dataKey="withComovis" name="With Comovis" fill="#22c55e" />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2">Potential ROI: 4-5x</h4>
                      <div className="text-sm text-green-700">
                        <p className="mb-2">A mid-sized operator with 10 vessels can expect:</p>
                        <ul className="space-y-1 ml-5 list-disc">
                          <li>Annual Comovis investment: £37,080</li>
                          <li>Estimated annual savings: £171,000+</li>
                          <li>Net benefit: £133,920+</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Traction & Milestones */}
            {currentSlide === 7 && (
              <div className="min-h-[500px]">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Traction & Milestones</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Solution Readiness</h3>

                    <div className="space-y-6 mb-8">
                      <div className="flex items-start">
                        <div className="bg-green-100 p-2 rounded-full mr-4 mt-1">
                          <Ship className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Product Development</h4>
                          <p className="text-gray-600 mb-2">
                            Core platform developed with document management, expiry tracking, and port preparation
                            features
                          </p>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">MVP Complete</Badge>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="bg-blue-100 p-2 rounded-full mr-4 mt-1">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Market Validation</h4>
                          <p className="text-gray-600 mb-2">
                            Extensive interviews with 25+ maritime professionals confirming the problem and solution fit
                          </p>
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Problem Validated</Badge>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="bg-purple-100 p-2 rounded-full mr-4 mt-1">
                          <Globe className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Industry Engagement</h4>
                          <p className="text-gray-600">
                            Active discussions with 3 maritime associations and 2 classification societies for potential
                            partnerships
                          </p>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold mb-4">Market Metrics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4 text-center">
                          <h4 className="text-sm text-gray-500 uppercase">Detention Rate</h4>
                          <p className="text-2xl font-bold mt-1">3.2%</p>
                          <p className="text-xs text-gray-500 mt-1">global average</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4 text-center">
                          <h4 className="text-sm text-gray-500 uppercase">Detention Cost</h4>
                          <p className="text-2xl font-bold mt-1">$75,000</p>
                          <p className="text-xs text-gray-500 mt-1">average per incident</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4 text-center">
                          <h4 className="text-sm text-gray-500 uppercase">Target Market Size</h4>
                          <p className="text-2xl font-bold mt-1">60,000+</p>
                          <p className="text-xs text-gray-500 mt-1">vessels</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4 text-center">
                          <h4 className="text-sm text-gray-500 uppercase">Market Opportunity</h4>
                          <p className="text-2xl font-bold mt-1">$1.2B</p>
                          <p className="text-xs text-gray-500 mt-1">annual</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">Roadmap & Milestones</h3>

                    <div className="relative border-l-2 border-blue-200 pl-6 py-2 space-y-8">
                      <div className="relative">
                        <div className="absolute -left-8 top-0 bg-green-500 h-4 w-4 rounded-full"></div>
                        <Badge className="absolute -left-24 top-0">Completed</Badge>
                        <h4 className="font-medium">Q1 2025</h4>
                        <p className="text-gray-600 mt-1">MVP Development</p>
                        <ul className="mt-2 text-sm space-y-1">
                          <li className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                            <span>Core document management system</span>
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                            <span>Certificate expiry tracking</span>
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                            <span>Basic port requirements database</span>
                          </li>
                        </ul>
                      </div>

                      <div className="relative">
                        <div className="absolute -left-8 top-0 bg-blue-500 h-4 w-4 rounded-full"></div>
                        <Badge className="absolute -left-24 top-0">Current</Badge>
                        <h4 className="font-medium">Q2 2025</h4>
                        <p className="text-gray-600 mt-1">Pre-Seed Funding & Beta Launch</p>
                        <ul className="mt-2 text-sm space-y-1">
                          <li className="flex items-center">
                            <Clock className="h-4 w-4 text-blue-500 mr-2" />
                            <span>Secure pre-seed investment</span>
                          </li>
                          <li className="flex items-center">
                            <Clock className="h-4 w-4 text-blue-500 mr-2" />
                            <span>Onboard first 5 beta customers</span>
                          </li>
                          <li className="flex items-center">
                            <Clock className="h-4 w-4 text-blue-500 mr-2" />
                            <span>Initial team expansion</span>
                          </li>
                        </ul>
                      </div>

                      <div className="relative">
                        <div className="absolute -left-8 top-0 bg-gray-300 h-4 w-4 rounded-full"></div>
                        <Badge className="absolute -left-24 top-0">Planned</Badge>
                        <h4 className="font-medium">Q4 2025</h4>
                        <p className="text-gray-600 mt-1">Commercial Launch & Team Features</p>
                        <ul className="mt-2 text-sm text-gray-600 space-y-1">
                          <li className="flex items-start">
                            <span className="h-4 w-4 mr-2">-</span>
                            <span>Full commercial launch</span>
                          </li>
                          <li className="flex items-start">
                            <span className="h-4 w-4 mr-2">-</span>
                            <span>Multi-user collaboration</span>
                          </li>
                          <li className="flex items-start">
                            <span className="h-4 w-4 mr-2">-</span>
                            <span>Role-based permissions</span>
                          </li>
                        </ul>
                      </div>

                      <div className="relative">
                        <div className="absolute -left-8 top-0 bg-gray-300 h-4 w-4 rounded-full"></div>
                        <Badge className="absolute -left-24 top-0">Planned</Badge>
                        <h4 className="font-medium">Q2 2026</h4>
                        <p className="text-gray-600 mt-1">Seed Round & Advanced Features</p>
                        <ul className="mt-2 text-sm text-gray-600 space-y-1">
                          <li className="flex items-start">
                            <span className="h-4 w-4 mr-2">-</span>
                            <span>AI-powered deficiency prediction</span>
                          </li>
                          <li className="flex items-start">
                            <span className="h-4 w-4 mr-2">-</span>
                            <span>Advanced analytics dashboard</span>
                          </li>
                          <li className="flex items-start">
                            <span className="h-4 w-4 mr-2">-</span>
                            <span>API for integrations</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Market Strategy */}
            {currentSlide === 8 && (
              <div className="min-h-[500px]">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Go-to-Market Strategy</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Customer Acquisition Strategy</h3>

                    <Card className="mb-6">
                      <CardContent className="p-6 space-y-6">
                        <div className="flex items-start">
                          <div className="bg-blue-100 p-2 rounded-full mr-3">
                            <Users className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">Direct Sales</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Targeted outreach to technical managers and DPAs at shipping companies, with focus on
                              mid-sized fleets (5-20 vessels) initially.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <div className="bg-green-100 p-2 rounded-full mr-3">
                            <Globe className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">Industry Partnerships</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Strategic partnerships with classification societies, P&I clubs, and maritime associations
                              for referrals and co-marketing.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <div className="bg-purple-100 p-2 rounded-full mr-3">
                            <Ship className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">Industry Events & Trade Shows</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Presence at key maritime events like Nor-Shipping, Posidonia, and SMM Hamburg for
                              demonstrations and lead generation.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <div className="bg-amber-100 p-2 rounded-full mr-3">
                            <FileText className="h-5 w-5 text-amber-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">Content Marketing & Thought Leadership</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Educational content on compliance best practices, PSC statistics analysis, and case
                              studies demonstrating ROI.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <h3 className="text-xl font-semibold mb-4">Competitive Landscape</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-600 mb-4">
                        The maritime compliance software market is fragmented with most solutions focusing on specific
                        aspects:
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <div className="bg-red-100 h-6 w-6 rounded-full flex items-center justify-center mr-2 mt-1">
                            <span className="text-xs font-bold text-red-600">1</span>
                          </div>
                          <div>
                            <p className="font-medium">General Document Management Systems</p>
                            <p className="text-sm text-gray-600">
                              Not maritime-specific, lacking compliance intelligence
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="bg-red-100 h-6 w-6 rounded-full flex items-center justify-center mr-2 mt-1">
                            <span className="text-xs font-bold text-red-600">2</span>
                          </div>
                          <div>
                            <p className="font-medium">Legacy Fleet Management Software</p>
                            <p className="text-sm text-gray-600">Expensive, complex, poor user experience</p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="bg-red-100 h-6 w-6 rounded-full flex items-center justify-center mr-2 mt-1">
                            <span className="text-xs font-bold text-red-600">3</span>
                          </div>
                          <div>
                            <p className="font-medium">Port Information Services</p>
                            <p className="text-sm text-gray-600">Lack document management and compliance analysis</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">Our Competitive Advantage</h3>

                    <div className="space-y-6 mb-8">
                      <div className="bg-slate-100 p-4 rounded-lg border-l-4 border-slate-700">
                        <h4 className="font-medium">Specialized Maritime Focus</h4>
                        <div className="mt-2">
                          <div className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                            <p className="text-sm text-gray-700">
                              Built specifically for maritime compliance with deep industry knowledge embedded in the
                              platform.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-100 p-4 rounded-lg border-l-4 border-slate-600">
                        <h4 className="font-medium">Comprehensive Solution</h4>
                        <div className="mt-2">
                          <div className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                            <p className="text-sm text-gray-700">
                              The only platform that combines document management, port requirements, and secure sharing
                              in one integrated solution.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-100 p-4 rounded-lg border-l-4 border-slate-500">
                        <h4 className="font-medium">AI-Powered Compliance Analysis</h4>
                        <div className="mt-2">
                          <div className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                            <p className="text-sm text-gray-700">
                              Unique AI capabilities that identify potential compliance gaps before they lead to
                              deficiencies.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-100 p-4 rounded-lg border-l-4 border-slate-400">
                        <h4 className="font-medium">Superior User Experience</h4>
                        <div className="mt-2">
                          <div className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                            <p className="text-sm text-gray-700">
                              Modern, intuitive interface designed for maritime professionals with minimal training
                              required.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold mb-4">Market Expansion Strategy</h3>

                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="bg-blue-100 h-6 w-6 rounded-full flex items-center justify-center mr-2 mt-1">
                          <span className="text-xs font-bold text-blue-600">1</span>
                        </div>
                        <div>
                          <p className="font-medium">Phase 1: European Focus</p>
                          <p className="text-sm text-gray-600">
                            Initial focus on European shipping companies with global operations
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="bg-blue-100 h-6 w-6 rounded-full flex items-center justify-center mr-2 mt-1">
                          <span className="text-xs font-bold text-blue-600">2</span>
                        </div>
                        <div>
                          <p className="font-medium">Phase 2: Asia-Pacific Expansion</p>
                          <p className="text-sm text-gray-600">
                            Targeting Singapore, Hong Kong, and major Japanese shipping companies
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="bg-blue-100 h-6 w-6 rounded-full flex items-center justify-center mr-2 mt-1">
                          <span className="text-xs font-bold text-blue-600">3</span>
                        </div>
                        <div>
                          <p className="font-medium">Phase 3: Americas & Global</p>
                          <p className="text-sm text-gray-600">
                            Complete global coverage including North American and Latin American markets
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="bg-blue-100 h-6 w-6 rounded-full flex items-center justify-center mr-2 mt-1">
                          <span className="text-xs font-bold text-blue-600">4</span>
                        </div>
                        <div>
                          <p className="font-medium">Adjacent Markets</p>
                          <p className="text-sm text-gray-600">
                            Expand to offshore, cruise, and specialized vessel segments
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Financial Projections */}
            {currentSlide === 9 && (
              <div className="min-h-[500px]">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Financial Projections</h2>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">5-Year Projections</h3>

                  <ChartContainer
                    config={{
                      revenue: {
                        label: "Revenue (£)",
                        color: "#2563eb",
                      },
                      vessels: {
                        label: "Vessels",
                        color: "#16a34a",
                      },
                    }}
                    className="h-[400px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { year: 2025, revenue: 0, vessels: 0 },
                          { year: 2026, revenue: 650000, vessels: 180 },
                          { year: 2027, revenue: 2200000, vessels: 580 },
                          { year: 2028, revenue: 5800000, vessels: 1250 },
                          { year: 2029, revenue: 12500000, vessels: 2200 },
                        ]}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis
                          yAxisId="left"
                          orientation="left"
                          tickFormatter={(value) => `£${(value / 1000000).toLocaleString()}M`}
                          stroke="#2563eb"
                        />
                        <YAxis yAxisId="right" orientation="right" domain={[0, 3500]} stroke="#16a34a" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="revenue"
                          stroke="#2563eb"
                          strokeWidth={3}
                          activeDot={{ r: 6, fill: "#2563eb", stroke: "#ffffff", strokeWidth: 2 }}
                          name="Revenue (£M)"
                          dot={{ fill: "#2563eb", strokeWidth: 2, r: 4 }}
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="vessels"
                          stroke="#16a34a"
                          strokeWidth={3}
                          activeDot={{ r: 6, fill: "#16a34a", stroke: "#ffffff", strokeWidth: 2 }}
                          name="Vessels"
                          dot={{ fill: "#16a34a", strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Key Financial Metrics</h3>

                    <div className="space-y-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">Break-Even Point</h4>
                              <p className="text-sm text-gray-600">Expected in Q3 2026</p>
                            </div>
                            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Month 18</Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">Gross Margin</h4>
                              <p className="text-sm text-gray-600">SaaS with limited variable costs</p>
                            </div>
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">85%</Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">Monthly Burn Rate</h4>
                              <p className="text-sm text-gray-600">Current burn rate</p>
                            </div>
                            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">£75,000</Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">Customer Acquisition Cost</h4>
                              <p className="text-sm text-gray-600">Average per customer</p>
                            </div>
                            <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">£2,450</Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">Lifetime Value</h4>
                              <p className="text-sm text-gray-600">Average per customer</p>
                            </div>
                            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">£12,985</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">Use of Funds</h3>

                    <Card className="mb-6">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">Product Development</h4>
                            <div>
                              <span className="font-bold">40%</span>
                              <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                                <div className="w-[40%] h-2 bg-blue-500 rounded-full"></div>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">Sales & Marketing</h4>
                            <div>
                              <span className="font-bold">30%</span>
                              <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                                <div className="w-[30%] h-2 bg-green-500 rounded-full"></div>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">Operations & Support</h4>
                            <div>
                              <span className="font-bold">20%</span>
                              <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                                <div className="w-[20%] h-2 bg-purple-500 rounded-full"></div>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">Working Capital</h4>
                            <div>
                              <span className="font-bold">10%</span>
                              <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                                <div className="w-[10%] h-2 bg-amber-500 rounded-full"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <h3 className="text-xl font-semibold mb-4">Key Investments</h3>

                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Team Expansion</h4>
                          <p className="text-sm text-gray-600">
                            Adding 3 developers, 2 sales personnel, and 1 maritime compliance expert
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="bg-green-100 p-2 rounded-full mr-3">
                          <Ship className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">AI Compliance Engine</h4>
                          <p className="text-sm text-gray-600">
                            Development of advanced predictive analytics for deficiency prevention
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="bg-purple-100 p-2 rounded-full mr-3">
                          <Globe className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Market Expansion</h4>
                          <p className="text-sm text-gray-600">
                            Establishing presence in key maritime hubs in Europe and Asia
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Team */}
            {currentSlide === 10 && (
              <div className="min-h-[500px]">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Team</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                  {/* Current Team - Ivan */}
                  <div>
                    <Card className="overflow-hidden border-2 border-slate-700">
                      <div className="h-40 bg-gradient-to-r from-slate-700 to-slate-500"></div>
                      <CardContent className="pt-6 text-center">
                        <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 mx-auto -mt-20 overflow-hidden">
                          <img
                            src="/placeholder.svg?height=96&width=96&query=professional maritime executive"
                            alt="Ivan Gyimah"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="font-bold text-lg mt-2">Ivan Gyimah</h3>
                        <p className="text-blue-600 font-medium">Founder & CEO</p>
                        <p className="text-sm text-gray-600 mt-4 leading-relaxed">
                          Product Manager/Engineer who previously worked on Kpler's flagship mobile app with trade flows
                          module, port call integrations, and vessel voyage features. Also contributed to Kpler's web
                          experience team on core user-facing elements and cross-functional team integrations, plus
                          worked on MarineTraffic products. Built the entire Comovis product and AI algorithms from the
                          ground up.
                        </p>
                        <div className="mt-4 flex justify-center space-x-2 flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs">
                            Maritime Tech
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Product Development
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            AI Engineering
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Future Team Member - Sales */}
                  <div>
                    <Card className="overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50">
                      <div className="h-40 bg-gradient-to-r from-gray-300 to-gray-400"></div>
                      <CardContent className="pt-6 text-center">
                        <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-300 mx-auto -mt-20 flex items-center justify-center">
                          <Users className="h-12 w-12 text-gray-500" />
                        </div>
                        <h3 className="font-bold text-lg mt-2 text-gray-600">Sales Director</h3>
                        <p className="text-gray-500 font-medium">Target Hire - Q3 2025</p>
                        <p className="text-sm text-gray-500 mt-4 leading-relaxed">
                          Seeking experienced maritime sales professional with 8+ years in shipping technology or
                          compliance solutions. Strong relationships with ship management companies and technical
                          superintendents essential.
                        </p>
                        <div className="mt-4 flex justify-center space-x-2 flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs border-gray-400 text-gray-500">
                            Maritime Sales
                          </Badge>
                          <Badge variant="outline" className="text-xs border-gray-400 text-gray-500">
                            B2B SaaS
                          </Badge>
                          <Badge variant="outline" className="text-xs border-gray-400 text-gray-500">
                            Compliance
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Future Team Member - Marketing */}
                  <div>
                    <Card className="overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50">
                      <div className="h-40 bg-gradient-to-r from-gray-300 to-gray-400"></div>
                      <CardContent className="pt-6 text-center">
                        <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-300 mx-auto -mt-20 flex items-center justify-center">
                          <TrendingUp className="h-12 w-12 text-gray-500" />
                        </div>
                        <h3 className="font-bold text-lg mt-2 text-gray-600">Marketing Manager</h3>
                        <p className="text-gray-500 font-medium">Target Hire - Q4 2025</p>
                        <p className="text-sm text-gray-500 mt-4 leading-relaxed">
                          Looking for maritime industry marketing specialist with deep understanding of shipping
                          operations and compliance challenges. Experience with technical content marketing and trade
                          publication relationships preferred.
                        </p>
                        <div className="mt-4 flex justify-center space-x-2 flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs border-gray-400 text-gray-500">
                            Maritime Marketing
                          </Badge>
                          <Badge variant="outline" className="text-xs border-gray-400 text-gray-500">
                            Content Strategy
                          </Badge>
                          <Badge variant="outline" className="text-xs border-gray-400 text-gray-500">
                            Industry Events
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Advisory Opportunities</h3>

                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                      <div className="text-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-blue-100 mx-auto mb-3 flex items-center justify-center">
                          <Users className="h-8 w-8 text-blue-600" />
                        </div>
                        <h4 className="font-semibold text-blue-900">Seeking Strategic Advisors</h4>
                      </div>

                      <p className="text-sm text-blue-800 mb-4 text-center">
                        We're actively seeking experienced advisors to join our journey. If you're an investor with
                        relevant expertise or experienced generalists with strong investor networks and connections,
                        we'd love to explore advisory opportunities.
                      </p>

                      <div className="space-y-3">
                        <div className="bg-white p-3 rounded border border-blue-200">
                          <h5 className="font-medium text-blue-900">Maritime Industry Veterans</h5>
                          <p className="text-xs text-blue-700">
                            Former shipping executives, port authority leaders, classification society experts
                          </p>
                        </div>

                        <div className="bg-white p-3 rounded border border-blue-200">
                          <h5 className="font-medium text-blue-900">SaaS/Tech Scaling Experts</h5>
                          <p className="text-xs text-blue-700">
                            Experienced in B2B SaaS growth, enterprise sales, and international expansion
                          </p>
                        </div>

                        <div className="bg-white p-3 rounded border border-blue-200">
                          <h5 className="font-medium text-blue-900">Regulatory & Compliance Specialists</h5>
                          <p className="text-xs text-blue-700">
                            Deep knowledge of IMO regulations, port state control, and maritime law
                          </p>
                        </div>

                        <div className="bg-white p-3 rounded border border-blue-200">
                          <h5 className="font-medium text-blue-900">Experienced Generalists & Connectors</h5>
                          <p className="text-xs text-blue-700">
                            Strategic advisors with strong investor networks and connections to accelerate our growth
                          </p>
                        </div>
                      </div>

                      <div className="text-center mt-4">
                        <p className="text-xs text-blue-600 italic">
                          Interested investors are welcome to enquire about advisory positions
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">12-Month Hiring Plan</h3>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium">Current Team: 1 Member (Pre-Seed)</h4>
                          <Badge className="bg-slate-100 text-slate-800">Solo Founder</Badge>
                        </div>

                        <div className="mb-6">
                          <p className="text-sm text-gray-600 mb-3">
                            <strong>Current Status:</strong> Ivan has developed the complete product foundation, AI
                            algorithms, and technology stack, establishing a strong technical foundation for rapid
                            scaling.
                          </p>
                        </div>

                        <h4 className="font-medium mb-4">Planned Expansion: +3-4 Members</h4>

                        <ul className="space-y-3 text-sm">
                          <li className="flex items-start">
                            <div className="bg-blue-100 p-1 rounded mr-3 mt-0.5">
                              <Cpu className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <span className="font-medium">1 Full-Stack Developer</span>
                              <p className="text-gray-600 text-xs">
                                Focus on scaling platform architecture and AI model optimization
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start">
                            <div className="bg-green-100 p-1 rounded mr-3 mt-0.5">
                              <Users className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <span className="font-medium">1 Sales & Business Development</span>
                              <p className="text-gray-600 text-xs">
                                Maritime industry veteran with shipping company relationships
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start">
                            <div className="bg-purple-100 p-1 rounded mr-3 mt-0.5">
                              <TrendingUp className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                              <span className="font-medium">1 Marketing Manager</span>
                              <p className="text-gray-600 text-xs">
                                Content strategy and maritime industry event management
                              </p>
                            </div>
                          </li>
                        </ul>

                        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                          <div className="flex items-start">
                            <Brain className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                            <div>
                              <h5 className="font-semibold text-blue-900 mb-2">AI-First Company Philosophy</h5>
                              <p className="text-sm text-blue-800 leading-relaxed">
                                We're building Comovis as an AI-first company where automated AI fullstack agents will
                                work 24/7 building new features, while AI sales pipeline agents generate warm leads
                                autonomously. This approach means we won't need as many traditional developers or sales
                                staff as we scale, significantly reducing headcount and operational expenses compared to
                                conventional maritime software companies.
                              </p>
                            </div>
                          </div>

                          <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                            <div className="bg-white/60 p-2 rounded">
                              <span className="font-medium text-blue-900">AI Development Agents</span>
                              <p className="text-blue-700">24/7 automated feature development</p>
                            </div>
                            <div className="bg-white/60 p-2 rounded">
                              <span className="font-medium text-blue-900">AI Sales Agents</span>
                              <p className="text-blue-700">Autonomous lead generation and qualification</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {/* Investment Opportunity */}
            {currentSlide === 11 && (
              <div className="min-h-[500px]">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Investment Opportunity</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <Card className="mb-6 border-2 border-slate-700">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-xl font-semibold">Pre-Seed Round</h3>
                          <Badge className="bg-slate-100 text-slate-800">Active</Badge>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-gray-500">Target Amount</p>
                            <p className="text-2xl font-bold">£500,000</p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-500">Committed So Far</p>
                            <p className="text-xl font-medium text-green-600">£150,000 (30%)</p>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div className="bg-green-500 h-2 rounded-full" style={{ width: "30%" }}></div>
                            </div>
                          </div>

                          <div>
                            <p className="text-sm text-gray-500">Pre-Money Valuation</p>
                            <p className="text-xl font-medium">£2,500,000</p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-500">Minimum Investment</p>
                            <p className="text-xl font-medium">£25,000</p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-500">Instrument</p>
                            <p className="text-xl font-medium">SAFE Notes</p>
                          </div>

                          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                            <div className="flex items-center">
                              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                              <span className="font-medium text-green-800">SEIS Eligible</span>
                            </div>
                            <p className="text-sm text-green-700 mt-1">
                              For eligible UK investors - 50% income tax relief and capital gains tax exemption (capped
                              at £250,000)
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <h3 className="text-xl font-semibold mb-4">Why Invest Now?</h3>

                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="bg-green-100 p-2 rounded-full mr-3 mt-1">
                          <TrendingUp className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Ground Floor Opportunity</h4>
                          <p className="text-sm text-gray-600">
                            Invest at the earliest stage with favorable terms before commercial validation and higher
                            valuations.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="bg-blue-100 p-2 rounded-full mr-3 mt-1">
                          <Ship className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Massive Market Opportunity</h4>
                          <p className="text-sm text-gray-600">
                            £1.2B addressable market with minimal competition in the compliance-focused segment.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="bg-purple-100 p-2 rounded-full mr-3 mt-1">
                          <Users className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Strong Founding Team</h4>
                          <p className="text-sm text-gray-600">
                            Unique combination of maritime expertise and technology experience with 25+ years in the
                            industry.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="bg-amber-100 p-2 rounded-full mr-3 mt-1">
                          <BarChart4 className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Product-Market Fit</h4>
                          <p className="text-sm text-gray-600">
                            Extensive market research and interviews with maritime professionals confirm strong demand
                            for our solution.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">Funding Roadmap</h3>

                    <div className="relative border-l-2 border-blue-200 pl-6 py-2 space-y-8">
                      <div className="relative">
                        <div className="absolute -left-8 top-0 bg-green-500 h-4 w-4 rounded-full"></div>
                        <Badge className="absolute -left-24 top-0">Completed</Badge>
                        <h4 className="font-medium">Q4 2024</h4>
                        <p className="text-gray-600">Friends & Family Round</p>
                        <p className="font-medium text-green-600">£150,000</p>
                        <ul className="mt-1 text-sm text-gray-600 space-y-1">
                          <li>- MVP development</li>
                          <li>- Initial team assembly</li>
                          <li>- Beta testing with first customers</li>
                        </ul>
                      </div>

                      <div className="relative">
                        <div className="absolute -left-8 top-0 bg-blue-500 h-4 w-4 rounded-full"></div>
                        <Badge className="absolute -left-24 top-0">Current</Badge>
                        <h4 className="font-medium">Q2 2025</h4>
                        <p className="text-gray-600">Pre-Seed Round</p>
                        <p className="font-medium text-blue-600">£500,000</p>
                        <ul className="mt-1 text-sm text-gray-600 space-y-1">
                          <li>- Product expansion</li>
                          <li>- Team growth (10 new hires)</li>
                          <li>- Market expansion in Europe</li>
                          <li>- AI capabilities development</li>
                        </ul>
                      </div>

                      <div className="relative">
                        <div className="absolute -left-8 top-0 bg-gray-300 h-4 w-4 rounded-full"></div>
                        <Badge className="absolute -left-24 top-0">Planned</Badge>
                        <h4 className="font-medium">Q1 2026</h4>
                        <p className="text-gray-600">Seed Round</p>
                        <p className="font-medium">£2,500,000</p>
                        <ul className="mt-1 text-sm text-gray-600 space-y-1">
                          <li>- International expansion</li>
                          <li>- Sales team scaling</li>
                          <li>- Advanced features development</li>
                        </ul>
                      </div>

                      <div className="relative">
                        <div className="absolute -left-8 top-0 bg-gray-300 h-4 w-4 rounded-full"></div>
                        <Badge className="absolute -left-24 top-0">Planned</Badge>
                        <h4 className="font-medium">Q3 2027</h4>
                        <p className="text-gray-600">Series A</p>
                        <p className="font-medium">£8,000,000+</p>
                        <ul className="mt-1 text-sm text-gray-600 space-y-1">
                          <li>- Global market domination</li>
                          <li>- M&A opportunities</li>
                          <li>- New market segments</li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
                      <h3 className="text-lg font-semibold text-blue-800 mb-3">Investor Benefits</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                          <span className="text-blue-800">Quarterly investor updates and calls</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                          <span className="text-blue-800">Advisory opportunities for relevant expertise</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                          <span className="text-blue-800">Pro-rata rights for follow-on rounds</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                          <span className="text-blue-800">Maritime industry networking opportunities</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-12 text-center">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    Request Investor Deck & Data Room Access
                  </Button>
                  <p className="mt-4 text-gray-500">
                    For more information, please contact: <span className="font-medium">investors@comovis.com</span>
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
