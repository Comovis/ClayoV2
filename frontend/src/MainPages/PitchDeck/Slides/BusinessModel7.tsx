import { Shield, Briefcase, Globe } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

export default function BusinessModelSlide() {
  const costSavingsData = [
    { category: "Detention Costs", withoutComovis: 520000, withComovis: 104000 },
    { category: "Documentation Delays", withoutComovis: 380000, withComovis: 95000 },
    { category: "Staff Overhead", withoutComovis: 220000, withComovis: 154000 },
    { category: "Compliance Penalties", withoutComovis: 180000, withComovis: 36000 },
  ]

  return (
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
                  Deficiency Prevention Intelligence (£77/vessel/month), Port Intelligence Premium (£116/vessel/month)
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
            Comovis delivers significant ROI for maritime operators through detention prevention and operational
            efficiency:
          </p>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <h4 className="font-medium mb-4">Cost Savings for a 10-Vessel Fleet</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={costSavingsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} layout="vertical">
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
  )
}
