"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function PitchDeck() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const totalSlides = 10

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

            {/* Solution Slide */}
            {currentSlide === 2 && (
              <div className="min-h-[500px]">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Solution</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card className="border-t-4 border-t-slate-700">
                    <CardContent className="pt-6">
                      <div className="flex items-center mb-4">
                        <div className="bg-slate-100 p-2 rounded-full mr-3">
                          <FileText className="h-6 w-6 text-slate-700" />
                        </div>
                        <h3 className="font-semibold text-lg">Smart Document Hub</h3>
                      </div>
                      <p className="text-gray-600">
                        Centralized, AI-powered document management that automatically tracks expirations and identifies
                        compliance gaps.
                      </p>
                      <div className="mt-4 flex items-center text-sm text-slate-700">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span>Automatic expiry alerts</span>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-slate-700">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span>AI document analysis</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-t-4 border-t-slate-600">
                    <CardContent className="pt-6">
                      <div className="flex items-center mb-4">
                        <div className="bg-slate-100 p-2 rounded-full mr-3">
                          <Anchor className="h-6 w-6 text-slate-600" />
                        </div>
                        <h3 className="font-semibold text-lg">Port Preparation</h3>
                      </div>
                      <p className="text-gray-600">
                        Real-time port requirement intelligence to ensure vessels are fully compliant before arrival.
                      </p>
                      <div className="mt-4 flex items-center text-sm text-slate-600">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span>Port-specific checklists</span>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-slate-600">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span>Regulatory updates</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-t-4 border-t-slate-500">
                    <CardContent className="pt-6">
                      <div className="flex items-center mb-4">
                        <div className="bg-slate-100 p-2 rounded-full mr-3">
                          <Shield className="h-6 w-6 text-slate-500" />
                        </div>
                        <h3 className="font-semibold text-lg">Secure Sharing Portal</h3>
                      </div>
                      <p className="text-gray-600">
                        Streamlined document sharing with port authorities, agents, and charterers with full audit
                        trail.
                      </p>
                      <div className="mt-4 flex items-center text-sm text-slate-500">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span>Controlled access</span>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-slate-500">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span>Access tracking</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">The Result?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-4 rounded-md shadow-sm">
                      <h4 className="font-medium text-blue-800">Fewer Detentions</h4>
                      <p className="text-gray-600 mt-2">
                        Proactively identify and address compliance issues before they result in detentions.
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-md shadow-sm">
                      <h4 className="font-medium text-blue-800">Reduced Port Delays</h4>
                      <p className="text-gray-600 mt-2">
                        Ensure all documentation is ready and compliant before arrival to avoid costly delays.
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-md shadow-sm">
                      <h4 className="font-medium text-blue-800">Operational Efficiency</h4>
                      <p className="text-gray-600 mt-2">
                        Save hundreds of staff hours through automation and centralized management.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Target Market & Personas */}
            {currentSlide === 3 && (
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
            {currentSlide === 4 && (
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
            {currentSlide === 5 && (
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
            {currentSlide === 6 && (
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
            {currentSlide === 7 && (
              <div className="min-h-[500px]">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Financial Projections</h2>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">5-Year Projections</h3>

                  <ChartContainer
                    config={{
                      revenue: {
                        label: "Revenue (£)",
                        color: "hsl(215, 25%, 27%)",
                      },
                      vessels: {
                        label: "Vessels",
                        color: "hsl(217, 19%, 35%)",
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
                        />
                        <YAxis yAxisId="right" orientation="right" domain={[0, 3500]} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="revenue"
                          stroke="var(--color-revenue)"
                          activeDot={{ r: 8 }}
                          name="Revenue (£)"
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="vessels"
                          stroke="var(--color-vessels)"
                          name="Vessels"
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
            {currentSlide === 8 && (
              <div className="min-h-[500px]">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Team</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <Card className="overflow-hidden">
                      <div className="h-40 bg-gradient-to-r from-slate-700 to-slate-500"></div>
                      <CardContent className="pt-6 text-center">
                        <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 mx-auto -mt-20 overflow-hidden">
                          <img src="/executive-portrait.png" alt="CEO" className="w-full h-full object-cover" />
                        </div>
                        <h3 className="font-bold text-lg mt-2">Alexander Chen</h3>
                        <p className="text-blue-600 font-medium">CEO & Co-Founder</p>
                        <p className="text-sm text-gray-600 mt-4">
                          15+ years in maritime operations. Former Fleet Director at Maersk with MBA from INSEAD.
                        </p>
                        <div className="mt-4 flex justify-center space-x-2">
                          <Badge variant="outline">Maritime Operations</Badge>
                          <Badge variant="outline">Strategy</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <Card className="overflow-hidden">
                      <div className="h-40 bg-gradient-to-r from-slate-700 to-slate-500"></div>
                      <CardContent className="pt-6 text-center">
                        <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 mx-auto -mt-20 overflow-hidden">
                          <img
                            src="/professional-female-technical-director.png"
                            alt="CTO"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="font-bold text-lg mt-2">Sarah Nakamura</h3>
                        <p className="text-blue-600 font-medium">CTO & Co-Founder</p>
                        <p className="text-sm text-gray-600 mt-4">
                          Ex-Google engineer with 10+ years in SaaS development. MS in Computer Science from Stanford.
                        </p>
                        <div className="mt-4 flex justify-center space-x-2">
                          <Badge variant="outline">Software Architecture</Badge>
                          <Badge variant="outline">AI</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <Card className="overflow-hidden">
                      <div className="h-40 bg-gradient-to-r from-slate-700 to-slate-500"></div>
                      <CardContent className="pt-6 text-center">
                        <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 mx-auto -mt-20 overflow-hidden">
                          <img src="/maritime-compliance-expert.png" alt="CCO" className="w-full h-full object-cover" />
                        </div>
                        <h3 className="font-bold text-lg mt-2">Michael Petersen</h3>
                        <p className="text-blue-600 font-medium">Chief Compliance Officer</p>
                        <p className="text-sm text-gray-600 mt-4">
                          Former PSC inspector with 20+ years at DNV GL. Expert in maritime regulations and compliance.
                        </p>
                        <div className="mt-4 flex justify-center space-x-2">
                          <Badge variant="outline">Maritime Compliance</Badge>
                          <Badge variant="outline">PSC</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Key Advisors</h3>

                    <div className="space-y-4">
                      <div className="flex items-center p-4 border rounded-lg">
                        <div className="w-12 h-12 rounded-full bg-gray-200 mr-4 overflow-hidden">
                          <img src="/shipping-executive.png" alt="Advisor" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-medium">Captain James Wilson</h4>
                          <p className="text-sm text-gray-600">Former Director of Maritime Affairs, IMO</p>
                        </div>
                      </div>

                      <div className="flex items-center p-4 border rounded-lg">
                        <div className="w-12 h-12 rounded-full bg-gray-200 mr-4 overflow-hidden">
                          <img src="/female-tech-investor.png" alt="Advisor" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-medium">Dr. Elena Kostadinova</h4>
                          <p className="text-sm text-gray-600">
                            Partner at Blue Ocean Ventures, Maritime Tech Investor
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center p-4 border rounded-lg">
                        <div className="w-12 h-12 rounded-full bg-gray-200 mr-4 overflow-hidden">
                          <img
                            src="/placeholder.svg?height=48&width=48&query=maritime law expert"
                            alt="Advisor"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium">Richard Thornton</h4>
                          <p className="text-sm text-gray-600">Maritime Law Expert, Partner at Global Shipping Law</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">Team Growth Plan</h3>

                    <Card>
                      <CardContent className="p-6">
                        <h4 className="font-medium mb-4">Current Team: 8 Members</h4>

                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">Development</span>
                              <span className="text-sm text-gray-500">4 members</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{ width: "50%" }}></div>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">Operations</span>
                              <span className="text-sm text-gray-500">2 members</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{ width: "25%" }}></div>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">Maritime Expertise</span>
                              <span className="text-sm text-gray-500">2 members</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{ width: "25%" }}></div>
                            </div>
                          </div>
                        </div>

                        <h4 className="font-medium mt-6 mb-4">12-Month Hiring Plan: +10 Members</h4>

                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                            <span>3 Frontend & Backend Developers</span>
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                            <span>2 UI/UX Designers</span>
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                            <span>2 Sales & Business Development</span>
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                            <span>1 Maritime Compliance Specialist</span>
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                            <span>1 Customer Success Manager</span>
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                            <span>1 Marketing Manager</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {/* Investment Opportunity */}
            {currentSlide === 9 && (
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
                            <p className="text-2xl font-bold">£750,000</p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-500">Committed So Far</p>
                            <p className="text-xl font-medium text-green-600">£250,000 (33%)</p>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div className="bg-green-500 h-2 rounded-full" style={{ width: "33%" }}></div>
                            </div>
                          </div>

                          <div>
                            <p className="text-sm text-gray-500">Valuation Cap</p>
                            <p className="text-xl font-medium">£4,000,000</p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-500">Minimum Investment</p>
                            <p className="text-xl font-medium">£25,000</p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-500">Instrument</p>
                            <p className="text-xl font-medium">SAFE Notes</p>
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
                        <p className="font-medium text-blue-600">£750,000</p>
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
              </div>
            )}

            {/* Final Call to Action */}
            {currentSlide === 9 && (
              <div className="mt-12 text-center">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Request Investor Deck & Data Room Access
                </Button>
                <p className="mt-4 text-gray-500">
                  For more information, please contact: <span className="font-medium">investors@comovis.com</span>
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
