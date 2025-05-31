import { Users, TrendingUp, Brain, Cpu } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function TeamSlide() {
  return (
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
                  src="/placeholder.svg?height=96&width=96"
                  alt="Ivan Gyimah"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-lg mt-2">Ivan Gyimah</h3>
              <p className="text-blue-600 font-medium">Founder & CEO</p>
              <p className="text-sm text-gray-600 mt-4 leading-relaxed">
                Product Manager/Engineer who previously worked on Kpler's flagship mobile app with trade flows module,
                port call integrations, and vessel voyage features. Also contributed to Kpler's web experience team on
                core user-facing elements and cross-functional team integrations, plus worked on MarineTraffic products.
                Built the entire Comovis product and AI algorithms from the ground up.
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
                Seeking experienced maritime sales professional with 8+ years in shipping technology or compliance
                solutions. Strong relationships with ship management companies and technical superintendents essential.
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
                Looking for maritime industry marketing specialist with deep understanding of shipping operations and
                compliance challenges. Experience with technical content marketing and trade publication relationships
                preferred.
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
              We're actively seeking experienced advisors to join our journey. If you're an investor with relevant
              expertise or experienced generalists with strong investor networks and connections, we'd love to explore
              advisory opportunities.
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
                  <strong>Current Status:</strong> Ivan has developed the complete product foundation, AI algorithms,
                  and technology stack, establishing a strong technical foundation for rapid scaling.
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
                    <p className="text-gray-600 text-xs">Content strategy and maritime industry event management</p>
                  </div>
                </li>
              </ul>

              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <div className="flex items-start">
                  <Brain className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-blue-900 mb-2">AI-First Company Philosophy</h5>
                    <p className="text-sm text-blue-800 leading-relaxed">
                      We're building Comovis as an AI-first company where automated AI fullstack agents will work 24/7
                      building new features, while AI sales pipeline agents generate warm leads autonomously. This
                      approach means we won't need as many traditional developers or sales staff as we scale,
                      significantly reducing headcount and operational expenses compared to conventional maritime
                      software companies.
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
  )
}
