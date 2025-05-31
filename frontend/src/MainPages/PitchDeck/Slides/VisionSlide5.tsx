import {
  Brain,
  MapPin,
  Users,
  Settings,
  Anchor,
  Truck,
  BarChart4,
  ArrowRight,
  Zap,
  Network,
  Database,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function VisionSlide() {
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

  return (
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
          Transforming maritime operations through intelligent AI agents that automate complex workflows, eliminate
          manual processes, and optimize every aspect of vessel operations.
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
              AI agents that handle complex operational decisions, from voyage planning to crew management, reducing
              human intervention by 80%
            </p>
          </div>

          <div className="text-center">
            <div className="bg-white/10 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center backdrop-blur-sm">
              <Network className="h-10 w-10 text-green-400" />
            </div>
            <h4 className="font-semibold text-xl mb-2">Intelligent Ecosystem</h4>
            <p className="text-blue-100 text-sm leading-relaxed">
              Seamlessly connected maritime stakeholders through AI-driven coordination, eliminating communication
              delays and errors
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
            "From reactive operations to predictive intelligence - transforming how maritime businesses operate"
          </p>
        </div>
      </div>
    </div>
  )
}
