import { AlertTriangle, Clock, Globe } from "lucide-react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

export default function ProblemSlide() {
  const detentionData = [
    { region: "Asia-Pacific", rate: 3.2, count: 1280 },
    { region: "Europe", rate: 2.8, count: 980 },
    { region: "North America", rate: 1.9, count: 670 },
    { region: "Middle East", rate: 4.1, count: 540 },
    { region: "Latin America", rate: 5.3, count: 390 },
  ]

  const PRIMARY_COLOR = "#334155"
  const SECONDARY_COLOR = "#64748b"

  return (
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
                Maritime operators struggle with fragmented document management across emails, paper files, and
                disparate systems.
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
            On average, a single detention costs a vessel operator $30,000-$120,000 in direct costs and lost revenue.
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
  )
}
