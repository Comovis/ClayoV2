import { CheckCircle, Ship, FileText, Shield } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts"

export default function MarketSlide() {
  const marketSizeData = [
    { name: "Tankers", value: 17000 },
    { name: "Bulk Carriers", value: 12000 },
    { name: "Container Ships", value: 5500 },
    { name: "General Cargo", value: 18000 },
    { name: "Other", value: 7500 },
  ]

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

  const COLORS = ["#334155", "#475569", "#64748b", "#94a3b8", "#cbd5e1"]

  return (
    <div className="min-h-[500px]">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Target Market & User Personas</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Addressable Market</h3>
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Our initial target market includes commercial vessels over 500 GT that are subject to Port State Control
              inspections globally.
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
                  <div className="bg-gray-50 p-3 rounded-md italic text-sm text-gray-600">"{persona.quote}"</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
