import { Users, Ship, Globe } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

export default function FinancialsSlide() {
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

  return (
    <div className="min-h-[500px]">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Financial Projections</h2>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">5-Year Projections</h3>

        <div className="h-[400px]">
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
        </div>
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
                <p className="text-sm text-gray-600">Establishing presence in key maritime hubs in Europe and Asia</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
