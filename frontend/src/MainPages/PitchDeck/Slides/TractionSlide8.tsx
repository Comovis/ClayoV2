import { Ship, Users, Globe, CheckCircle, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function TractionSlide() {
  return (
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
                  Core platform developed with document management, expiry tracking, and port preparation features
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
  )
}
