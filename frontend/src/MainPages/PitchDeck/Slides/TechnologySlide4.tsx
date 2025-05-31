import { Scan, Brain, Zap, Lock, Server, UserCheck, Upload } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function TechnologySlide() {
  return (
    <div className="min-h-[500px]">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Revolutionary AI Technology</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Custom AI Document Processing</h3>
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <Scan className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900">Advanced OCR + Computer Vision</h4>
                  <p className="text-sm text-blue-700">
                    Processes even the worst handwritten documents, faded scans, and complex layouts with 99.7% accuracy
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-purple-100 p-2 rounded-lg mr-3">
                  <Brain className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-purple-900">Intelligent Classification</h4>
                  <p className="text-sm text-purple-700">
                    Automatically identifies document types, extracts key dates, and validates against maritime
                    standards
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-lg mr-3">
                  <Zap className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-green-900">Real-time Processing</h4>
                  <p className="text-sm text-green-700">
                    Documents processed in under 3 seconds with immediate validation and compliance checking
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-slate-100 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Supported Formats</h4>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <span className="bg-white p-2 rounded text-center">PDF</span>
              <span className="bg-white p-2 rounded text-center">JPG/PNG</span>
              <span className="bg-white p-2 rounded text-center">Word</span>
              <span className="bg-white p-2 rounded text-center">Handwritten</span>
              <span className="bg-white p-2 rounded text-center">Scanned</span>
              <span className="bg-white p-2 rounded text-center">Faxed</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Enterprise Security Architecture</h3>
          <div className="bg-gradient-to-br from-slate-50 to-gray-50 p-6 rounded-xl border border-slate-200">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-red-100 p-2 rounded-lg mr-3">
                  <Lock className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-red-900">AES-256 Encryption</h4>
                  <p className="text-sm text-red-700">
                    Military-grade encryption at rest and in transit. Zero-knowledge architecture ensures even we can't
                    access your data
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <Server className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900">EU Data Centers</h4>
                  <p className="text-sm text-blue-700">
                    GDPR-compliant infrastructure with data residency guarantees. SOC 2 Type II certified facilities
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-lg mr-3">
                  <UserCheck className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-green-900">Robust RLS</h4>
                  <p className="text-sm text-green-700">
                    Row-Level Security ensures users only see data they're authorized to access. Multi-tenant isolation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Demo Section */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 p-8 rounded-2xl text-white">
        <h3 className="text-2xl font-semibold mb-6 text-center">Live Document Processing Demo</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
            <h4 className="font-semibold mb-3">Document Upload</h4>
            <div className="border-2 border-dashed border-white/30 rounded-lg p-4 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-white/70" />
              <p className="text-sm text-white/70">Drop handwritten SMC here</p>
            </div>
            <div className="mt-3 text-xs text-white/60">Supports: Handwritten, Scanned, Faded, Rotated</div>
          </div>

          <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
            <h4 className="font-semibold mb-3">AI Processing</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>OCR Analysis</span>
                <span className="text-green-300">✓ Complete</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Text Extraction</span>
                <span className="text-green-300">✓ 99.7%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Classification</span>
                <span className="text-yellow-300">⟳ Processing</span>
              </div>
              <Progress value={75} className="h-2 mt-2" />
            </div>
          </div>

          <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
            <h4 className="font-semibold mb-3">Results</h4>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Type:</strong> Safety Management Certificate
              </div>
              <div>
                <strong>Issuer:</strong> Panama Maritime Authority
              </div>
              <div>
                <strong>Expiry:</strong> <span className="text-yellow-300">2024-11-15</span>
              </div>
              <div>
                <strong>Status:</strong> <span className="text-green-300">Valid</span>
              </div>
              <div>
                <strong>Confidence:</strong> <span className="text-green-300">99.7%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-lg font-medium text-white/90">
            Processing time: <span className="text-green-300">2.3 seconds</span> • Cost per document:{" "}
            <span className="text-green-300">£0.05</span>
          </p>
        </div>
      </div>
    </div>
  )
}
