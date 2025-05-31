import { Users, Globe, Ship, FileText, CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function MarketStrategySlide() {
  return (
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
                    Targeted outreach to technical managers and DPAs at shipping companies, with focus on mid-sized
                    fleets (5-20 vessels) initially.
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
                    Strategic partnerships with classification societies, P&I clubs, and maritime associations for
                    referrals and co-marketing.
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
                    Presence at key maritime events like Nor-Shipping, Posidonia, and SMM Hamburg for demonstrations and
                    lead generation.
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
                    Educational content on compliance best practices, PSC statistics analysis, and case studies
                    demonstrating ROI.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <h3 className="text-xl font-semibold mb-4">Competitive Landscape</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600 mb-4">
              The maritime compliance software market is fragmented with most solutions focusing on specific aspects:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="bg-red-100 h-6 w-6 rounded-full flex items-center justify-center mr-2 mt-1">
                  <span className="text-xs font-bold text-red-600">1</span>
                </div>
                <div>
                  <p className="font-medium">General Document Management Systems</p>
                  <p className="text-sm text-gray-600">Not maritime-specific, lacking compliance intelligence</p>
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
                    Built specifically for maritime compliance with deep industry knowledge embedded in the platform.
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
                    The only platform that combines document management, port requirements, and secure sharing in one
                    integrated solution.
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
                    Unique AI capabilities that identify potential compliance gaps before they lead to deficiencies.
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
                    Modern, intuitive interface designed for maritime professionals with minimal training required.
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
                <p className="text-sm text-gray-600">Expand to offshore, cruise, and specialized vessel segments</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
