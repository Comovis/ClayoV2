import { TrendingUp, Ship, Users, BarChart4, CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function InvestmentSlide() {
  return (
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
                    For eligible UK investors - 50% income tax relief and capital gains tax exemption (capped at
                    £250,000)
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
                  Invest at the earliest stage with favorable terms before commercial validation and higher valuations.
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
                  Unique combination of maritime expertise and technology experience with 25+ years in the industry.
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
                  Extensive market research and interviews with maritime professionals confirm strong demand for our
                  solution.
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
  )
}
