import {
  Brain,
  Shield,
  Globe,
  Scan,
  FileSearch,
  Cpu,
  Lock,
  Server,
  UserCheck,
  Database,
  Network,
  Zap,
  Upload,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export default function SolutionSlide() {
  return (
    <div className="min-h-[500px]">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Solution</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-t-4 border-t-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center mb-4">
              <div className="bg-slate-100 p-2 rounded-full mr-3">
                <Brain className="h-6 w-6 text-slate-700" />
              </div>
              <h3 className="font-semibold text-lg">AI Document Intelligence</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Revolutionary AI algorithms that can read and understand even the worst handwritten documents, scanned
              PDFs, images, and Word files with 99.7% accuracy.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-slate-700">
                <Scan className="h-4 w-4 text-green-500 mr-2" />
                <span>OCR + Computer Vision</span>
              </div>
              <div className="flex items-center text-sm text-slate-700">
                <FileSearch className="h-4 w-4 text-green-500 mr-2" />
                <span>Automatic classification</span>
              </div>
              <div className="flex items-center text-sm text-slate-700">
                <Cpu className="h-4 w-4 text-green-500 mr-2" />
                <span>Real-time processing</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-slate-600">
          <CardContent className="pt-6">
            <div className="flex items-center mb-4">
              <div className="bg-slate-100 p-2 rounded-full mr-3">
                <Shield className="h-6 w-6 text-slate-600" />
              </div>
              <h3 className="font-semibold text-lg">Enterprise Security</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Military-grade AES-256 encryption at rest and in transit, EU data centers, and robust Row-Level Security
              (RLS) for complete data protection.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-slate-600">
                <Lock className="h-4 w-4 text-green-500 mr-2" />
                <span>AES-256 encryption</span>
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <Server className="h-4 w-4 text-green-500 mr-2" />
                <span>EU data centers</span>
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <UserCheck className="h-4 w-4 text-green-500 mr-2" />
                <span>Robust RLS</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-slate-500">
          <CardContent className="pt-6">
            <div className="flex items-center mb-4">
              <div className="bg-slate-100 p-2 rounded-full mr-3">
                <Globe className="h-6 w-6 text-slate-500" />
              </div>
              <h3 className="font-semibold text-lg">Live Port Intelligence</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Real-time integration with port call data and port intelligence systems, providing up-to-the-minute
              compliance requirements.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-slate-500">
                <Database className="h-4 w-4 text-green-500 mr-2" />
                <span>Live data feeds</span>
              </div>
              <div className="flex items-center text-sm text-slate-500">
                <Network className="h-4 w-4 text-green-500 mr-2" />
                <span>API integrations</span>
              </div>
              <div className="flex items-center text-sm text-slate-500">
                <Zap className="h-4 w-4 text-green-500 mr-2" />
                <span>Real-time updates</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Demo Preview */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-900 p-8 rounded-2xl text-white">
        <h3 className="text-2xl font-semibold mb-6 text-center">See Our Technology in Action</h3>

        <Tabs defaultValue="document-processing" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/10">
            <TabsTrigger value="document-processing" className="text-white data-[state=active]:bg-white/20">
              Document Processing
            </TabsTrigger>
            <TabsTrigger value="security" className="text-white data-[state=active]:bg-white/20">
              Security Features
            </TabsTrigger>
            <TabsTrigger value="live-data" className="text-white data-[state=active]:bg-white/20">
              Live Port Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="document-processing" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h4 className="font-semibold mb-3 flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  Document Upload
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processing handwritten SMC...</span>
                    <span>99.7%</span>
                  </div>
                  <Progress value={97} className="h-2" />
                  <div className="text-xs text-blue-200">✓ Text extracted ✓ Dates identified ✓ Issuer verified</div>
                </div>
              </div>

              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h4 className="font-semibold mb-3 flex items-center">
                  <FileSearch className="h-5 w-5 mr-2" />
                  Classification Results
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Document Type:</span>
                    <span className="text-green-300">Safety Management Certificate</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expiry Date:</span>
                    <span className="text-yellow-300">2024-11-15</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Confidence:</span>
                    <span className="text-green-300">99.7%</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm text-center">
                <Lock className="h-8 w-8 mx-auto mb-2 text-green-400" />
                <h4 className="font-semibold">AES-256 Encryption</h4>
                <p className="text-sm text-blue-200">Military-grade security</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm text-center">
                <Server className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                <h4 className="font-semibold">EU Data Centers</h4>
                <p className="text-sm text-blue-200">GDPR compliant</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm text-center">
                <UserCheck className="h-8 w-8 mx-auto mb-2 text-purple-400" />
                <h4 className="font-semibold">Row-Level Security</h4>
                <p className="text-sm text-blue-200">Granular access control</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="live-data" className="mt-6">
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h4 className="font-semibold mb-4 flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Live Port Intelligence Feed
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-white/10 rounded">
                  <span className="text-sm">Singapore MPA - New CIC Focus</span>
                  <Badge className="bg-green-500/20 text-green-300">Live</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-white/10 rounded">
                  <span className="text-sm">Rotterdam - Updated MARPOL Requirements</span>
                  <Badge className="bg-blue-500/20 text-blue-300">2 min ago</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-white/10 rounded">
                  <span className="text-sm">Hamburg - PSC Inspection Schedule</span>
                  <Badge className="bg-yellow-500/20 text-yellow-300">5 min ago</Badge>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
