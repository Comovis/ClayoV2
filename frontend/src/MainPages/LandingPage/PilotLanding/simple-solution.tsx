"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Upload, Bell, CheckCircle, MapPin, FileText, Clock, Ship } from "lucide-react"
import { useState, useEffect } from "react"

export default function SimpleSolution() {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            className="inline-block text-sm font-semibold text-slate-500 tracking-wider uppercase mb-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            SIMPLE IMPLEMENTATION
          </motion.span>

          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            How Comovis Changes Everything
          </motion.h2>

          <motion.p
            className="text-xl text-slate-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            No more scattered files. No more missed expiries. No more document hunting. Just secure, organized maritime
            document management accessible to your entire team.
          </motion.p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="absolute left-1/2 top-12 bottom-12 w-0.5 bg-slate-200 hidden md:block"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
            <StepCard
              number="1"
              icon={<Upload className="h-6 w-6 text-slate-700" />}
              title="Upload Your Maritime Documents"
              description="Drag and drop any maritime document - certificates, crew papers, port documentation, inspection reports. Our AI automatically extracts expiry dates and key details, making everything accessible to your entire team."
              component={<DocumentUploadInterface />}
              isImageRight={false}
              delay={0}
            />

            <StepCard
              number="2"
              icon={<Bell className="h-6 w-6 text-slate-700" />}
              title="Get Smart Alerts"
              description="Receive notifications 90, 60, and 30 days before any certificate or document expires. Your entire team stays informed - never be caught off guard again."
              component={<UpcomingExpiriesInterface />}
              isImageRight={true}
              delay={0.2}
            />

            <StepCard
              number="3"
              icon={<MapPin className="h-6 w-6 text-slate-700" />}
              title="Prepare for Any Port"
              description="Know exactly what documents you need before arriving at any port. Get real-time updates on local requirements and PSC focus areas."
              component={<PortPreparationInterface />}
              isImageRight={false}
              delay={0.4}
            />

            <StepCard
              number="4"
              icon={<CheckCircle className="h-6 w-6 text-slate-700" />}
              title="Stay Compliant"
              description="Ensure your vessels are always ready for inspections and port calls. Access real-time port intelligence and prepare the exact documents needed."
              component={<FleetOverviewInterface />}
              isImageRight={true}
              delay={0.6}
            />
          </div>
        </div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-2xl font-bold text-slate-900 mb-4">That's It. Compliance Made Simple.</h3>
          <p className="text-slate-600 mb-8 text-lg max-w-2xl mx-auto">
            No complex workflows. No steep learning curves. Just the tools you need to keep all your maritime documents
            organized, secure, and accessible to your team wherever they are.
          </p>
          <Button size="lg" className="bg-slate-800 hover:bg-slate-700 text-white">
            See It In Action <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

function StepCard({ number, icon, title, description, component, isImageRight, delay = 0 }) {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <div className={`flex flex-col ${isImageRight ? "md:flex-row-reverse" : "md:flex-row"} gap-8 items-center`}>
        <div className="w-full md:w-1/2">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold z-10">
              {number}
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative z-0">
              <div className="bg-slate-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">{icon}</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">{title}</h3>
              <p className="text-slate-600">{description}</p>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2">{component}</div>
      </div>
    </motion.div>
  )
}

function DocumentUploadInterface() {
  const [uploadState, setUploadState] = useState("idle") // idle, uploading, processing, complete
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const currentDocument = "Safety_Management_Certificate.pdf"

  useEffect(() => {
    if (!isHovered) {
      setUploadState("idle")
      setUploadProgress(0)
      return
    }

    const startUpload = () => {
      setUploadState("uploading")
      setUploadProgress(0)

      // Upload progress
      const uploadInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(uploadInterval)
            setUploadState("processing")

            // Processing phase
            setTimeout(() => {
              setUploadState("complete")

              // Reset after showing complete state
              setTimeout(() => {
                setUploadState("idle")
                setUploadProgress(0)
                setTimeout(startUpload, 500) // Restart cycle
              }, 2000)
            }, 1500)

            return 100
          }
          return prev + 20
        })
      }, 300)
    }

    const timeout = setTimeout(startUpload, 500)
    return () => {
      clearTimeout(timeout)
    }
  }, [isHovered])

  return (
    <div
      className="bg-white rounded-lg shadow-lg border border-slate-200 p-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-slate-900 flex items-center">
          <Ship className="h-5 w-5 mr-2 text-slate-700" />
          Humble Warrior
        </h4>
        <span className="text-sm text-slate-500">Crude Oil Tanker</span>
      </div>

      <motion.div
        className={`border-2 border-dashed rounded-lg p-8 text-center mb-4 transition-colors ${
          uploadState === "complete"
            ? "border-green-400 bg-green-50"
            : uploadState === "uploading" || uploadState === "processing"
              ? "border-blue-400 bg-blue-50"
              : "border-slate-300 hover:border-blue-400"
        }`}
        whileHover={{ scale: 1.02 }}
      >
        <motion.div
          animate={{
            y: uploadState === "uploading" ? -5 : 0,
            scale: uploadState === "uploading" ? 1.1 : 1,
          }}
        >
          {uploadState === "complete" ? (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-green-700 font-medium mb-2">AI Processing Complete ✓</p>
              <p className="text-green-600 text-sm">Document analyzed and secured</p>
            </motion.div>
          ) : (
            <>
              <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 font-medium mb-2">Drop your maritime documents here</p>
              <p className="text-slate-500 text-sm">Certificates, crew docs, port papers • PDF, JPG, PNG</p>
            </>
          )}
        </motion.div>

        {(uploadState === "uploading" || uploadState === "processing") && (
          <motion.div className="mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <motion.div
                className="bg-blue-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-sm text-blue-600 mt-2">
              {uploadState === "uploading" ? `${uploadProgress}% uploaded` : "AI extracting expiry date..."}
            </p>
          </motion.div>
        )}
      </motion.div>

      {uploadState === "complete" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-lg p-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-4 w-4 text-green-600 mr-2" />
              <div>
                <span className="text-sm font-medium text-slate-900">{currentDocument}</span>
                <p className="text-xs text-slate-500">Expires: 2024-08-15 • Accessible to entire team</p>
              </div>
            </div>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </div>
        </motion.div>
      )}

      {uploadState === "idle" && (
        <div className="text-center text-slate-500 text-sm">
          <p>Hover to see upload demo</p>
        </div>
      )}
    </div>
  )
}

function UpcomingExpiriesInterface() {
  const [alertIndex, setAlertIndex] = useState(0)
  const [newAlert, setNewAlert] = useState(false)

  const alerts = [
    { cert: "Safety Management Certificate", days: 45, color: "yellow", vessel: "Pacific Explorer" },
    { cert: "IOPP Certificate", days: 120, color: "green", vessel: "Northern Star" },
    { cert: "Certificate of Registry", days: 180, color: "blue", vessel: "Humble Warrior" },
    { cert: "Radio License", days: 30, color: "red", vessel: "Ocean Pioneer" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setNewAlert(true)
      setTimeout(() => {
        setAlertIndex((prev) => (prev + 1) % alerts.length)
        setNewAlert(false)
      }, 500)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-bold text-slate-900 text-lg">Upcoming Expiries</h4>
        <motion.div
          animate={{
            scale: newAlert ? [1, 1.2, 1] : 1,
            rotate: newAlert ? [0, 10, -10, 0] : 0,
          }}
          transition={{ duration: 0.5 }}
        >
          <Bell className="h-5 w-5 text-blue-600" />
        </motion.div>
      </div>

      <div className="space-y-4">
        {alerts.slice(0, 3).map((alert, index) => (
          <motion.div
            key={alert.cert}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: index === alertIndex % 3 ? 1.02 : 1,
            }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border-l-4 ${
              alert.color === "yellow"
                ? "bg-yellow-50 border-yellow-400"
                : alert.color === "green"
                  ? "bg-green-50 border-green-400"
                  : alert.color === "blue"
                    ? "bg-blue-50 border-blue-400"
                    : "bg-red-50 border-red-400"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-semibold text-slate-900">{alert.cert}</h5>
                <motion.p
                  className="text-sm text-slate-600"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  {alert.vessel} • Expires in {alert.days} days
                </motion.p>
              </div>
              <div className="text-right">
                <motion.div
                  className={`text-2xl font-bold ${
                    alert.color === "yellow"
                      ? "text-yellow-600"
                      : alert.color === "green"
                        ? "text-green-600"
                        : alert.color === "blue"
                          ? "text-blue-600"
                          : "text-red-600"
                  }`}
                  animate={{
                    scale: index === alertIndex % 3 ? [1, 1.1, 1] : 1,
                  }}
                  transition={{ duration: 1 }}
                >
                  {alert.days}d
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-4 p-3 bg-slate-50 rounded-lg"
        animate={{ opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
      >
        <div className="flex items-center text-sm text-slate-600">
          <Clock className="h-4 w-4 mr-2" />
          <span>Next alert in 15 days</span>
          <motion.div
            className="ml-2 w-2 h-2 bg-green-500 rounded-full"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          />
        </div>
      </motion.div>
    </div>
  )
}

function PortPreparationInterface() {
  const [checklistProgress, setChecklistProgress] = useState(0)
  const [currentCheck, setCurrentCheck] = useState(0)

  const documents = [
    { name: "Safety Management Certificate", status: "valid" },
    { name: "IOPP Certificate", status: "valid" },
    { name: "Maritime Declaration of Health", status: "submitted" },
    { name: "Crew List", status: "updated" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCheck((prev) => {
        const next = (prev + 1) % documents.length
        setChecklistProgress(((next + 1) / documents.length) * 100)
        return next
      })
    }, 1500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-slate-900 flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-blue-600" />
          Singapore Port Call
        </h4>
        <motion.div
          className="text-sm text-green-600 font-medium flex items-center"
          animate={{ scale: checklistProgress === 100 ? [1, 1.1, 1] : 1 }}
        >
          <CheckCircle className="h-4 w-4 mr-1" />
          Ready
        </motion.div>
      </div>

      <motion.div
        className="mb-4 p-3 bg-blue-50 rounded-lg"
        animate={{ opacity: [0.9, 1, 0.9] }}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
      >
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">ETA:</span>
          <span className="font-medium text-slate-900">Nov 15, 2023</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-slate-600">Berth:</span>
          <span className="font-medium text-slate-900">Terminal 3, Berth 7</span>
        </div>
      </motion.div>

      <div className="space-y-2">
        <h5 className="font-medium text-slate-900 mb-3">Required Documents:</h5>

        {documents.map((doc, index) => (
          <motion.div
            key={doc.name}
            initial={{ opacity: 0.5, scale: 0.98 }}
            animate={{
              opacity: index <= currentCheck ? 1 : 0.5,
              scale: index === currentCheck ? 1.02 : 0.98,
              backgroundColor: index === currentCheck ? "#f0fdf4" : "#f8fafc",
            }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between p-2 rounded border border-green-200"
          >
            <div className="flex items-center">
              <motion.div
                animate={{
                  scale: index === currentCheck ? [1, 1.2, 1] : 1,
                  rotate: index <= currentCheck ? 0 : -90,
                }}
                transition={{ duration: 0.5 }}
              >
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              </motion.div>
              <span className="text-sm text-slate-700">{doc.name}</span>
            </div>
            <motion.span
              className="text-xs text-green-600 font-medium"
              animate={{ opacity: index <= currentCheck ? 1 : 0.5 }}
            >
              {doc.status}
            </motion.span>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200"
        animate={{
          scale: [1, 1.01, 1],
          borderColor: ["#fbbf24", "#f59e0b", "#fbbf24"],
        }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
      >
        <div className="flex items-start">
          <Bell className="h-4 w-4 text-amber-600 mr-2 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">Port Update</p>
            <p className="text-xs text-amber-700">PSC focusing on MARPOL compliance this month</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function FleetOverviewInterface() {
  const [selectedVessel, setSelectedVessel] = useState(0)
  const [complianceScores, setComplianceScores] = useState([92, 96, 78])

  const vessels = [
    {
      name: "Humble Warrior",
      type: "Crude Oil Tanker",
      initials: "HW",
      color: "slate",
      valid: 12,
      expiring: 3,
      expired: 0,
    },
    {
      name: "Pacific Explorer",
      type: "Container Ship",
      initials: "PE",
      color: "blue",
      valid: 14,
      expiring: 1,
      expired: 0,
    },
    { name: "Northern Star", type: "Bulk Carrier", initials: "NS", color: "red", valid: 10, expiring: 0, expired: 2 },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedVessel((prev) => (prev + 1) % vessels.length)
      // Simulate slight score changes
      setComplianceScores((prev) => prev.map((score) => Math.max(75, Math.min(98, score + (Math.random() - 0.5) * 2))))
    }, 2500)

    return () => clearInterval(interval)
  }, [])

  const overallScore = Math.round(complianceScores.reduce((a, b) => a + b, 0) / complianceScores.length)

  return (
    <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-slate-900">Fleet Overview</h4>
        <span className="text-sm text-slate-500">3 Vessels</span>
      </div>

      <div className="space-y-4">
        {vessels.map((vessel, index) => (
          <motion.div
            key={vessel.name}
            className="p-4 border border-slate-200 rounded-lg cursor-pointer"
            animate={{
              scale: index === selectedVessel ? 1.02 : 1,
              borderColor: index === selectedVessel ? "#3b82f6" : "#e2e8f0",
              backgroundColor: index === selectedVessel ? "#f8fafc" : "#ffffff",
            }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelectedVessel(index)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <motion.div
                  className={`w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-bold mr-3 ${
                    vessel.color === "slate" ? "bg-slate-700" : vessel.color === "blue" ? "bg-blue-600" : "bg-red-600"
                  }`}
                  animate={{
                    scale: index === selectedVessel ? [1, 1.1, 1] : 1,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {vessel.initials}
                </motion.div>
                <div>
                  <h5 className="font-medium text-slate-900">{vessel.name}</h5>
                  <p className="text-xs text-slate-500">{vessel.type}</p>
                </div>
              </div>
              <div className="text-right">
                <motion.div
                  className="text-lg font-bold text-green-600"
                  animate={{
                    scale: index === selectedVessel ? [1, 1.05, 1] : 1,
                  }}
                >
                  {Math.round(complianceScores[index])}%
                </motion.div>
                <p className="text-xs text-slate-500">Compliance</p>
              </div>
            </div>
            <motion.div className="flex space-x-2 text-xs" animate={{ opacity: index === selectedVessel ? 1 : 0.7 }}>
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded">{vessel.valid} Valid</span>
              {vessel.expiring > 0 && (
                <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded">{vessel.expiring} Expiring</span>
              )}
              {vessel.expired > 0 && (
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded">{vessel.expired} Expired</span>
              )}
            </motion.div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-4 p-3 bg-slate-50 rounded-lg"
        animate={{ opacity: [0.9, 1, 0.9] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      >
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Fleet Compliance Score:</span>
          <motion.span
            className="font-bold text-slate-900"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            {overallScore}%
          </motion.span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
          <motion.div
            className="bg-slate-700 h-2 rounded-full"
            animate={{ width: `${overallScore}%` }}
            transition={{ duration: 1 }}
          />
        </div>
      </motion.div>
    </div>
  )
}
