"use client"

import { motion } from "framer-motion"
import {
  Upload,
  Brain,
  Bell,
  CheckCircle,
  ArrowRight,
  Lock,
  Database,
  Shield,
  Users,
  Ship,
  Clock,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

export default function HowItWorksEnhanced() {
  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-b from-white to-slate-50">
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
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            How Comovis Works
          </motion.h2>

          <motion.p
            className="text-xl text-slate-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Get started in minutes and see value from day one with our streamlined maritime compliance process.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          {/* Steps Overview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-8">
              <ProcessStep
                number="1"
                icon={<Upload className="h-6 w-6" />}
                title="Upload Documents"
                description="Easily upload your vessel certificates and documents to our secure platform. Our AI automatically extracts key information like expiry dates and issuing authorities."
                delay={0}
              />

              <ProcessStep
                number="2"
                icon={<Brain className="h-6 w-6" />}
                title="AI Analysis"
                description="Our AI analyzes your documents to identify expiry dates, compliance gaps, and potential issues. The system categorizes documents and creates a structured database."
                delay={0.1}
              />

              <ProcessStep
                number="3"
                icon={<Bell className="h-6 w-6" />}
                title="Receive Alerts"
                description="Get timely notifications about expiring certificates, upcoming port requirements, and potential compliance issues with actionable insights."
                delay={0.2}
              />

              <ProcessStep
                number="4"
                icon={<CheckCircle className="h-6 w-6" />}
                title="Stay Compliant"
                description="Ensure your vessels are always ready for inspections and port calls. Access real-time port intelligence and prepare exact documents needed."
                delay={0.3}
              />
            </div>
          </motion.div>

          {/* Live Process Demo */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <LiveProcessDemo />
          </motion.div>
        </div>

        {/* Security Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 md:p-12 text-white">
              <span className="inline-block text-sm font-semibold text-slate-300 tracking-wider uppercase mb-3">
                ENTERPRISE SECURITY
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">Enterprise-Grade Security</h3>
              <p className="text-slate-300 mb-8">
                Your data security is our top priority. Comovis employs industry-leading security measures to protect
                your sensitive maritime documents.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SecurityFeature
                  icon={<Database className="h-5 w-5 text-blue-400" />}
                  title="EU-Based Secure Servers"
                  description="All data is stored in GDPR-compliant EU data centers with regular backups."
                />

                <SecurityFeature
                  icon={<Lock className="h-5 w-5 text-green-400" />}
                  title="End-to-End Encryption"
                  description="Your documents are encrypted both in transit and at rest."
                />

                 <SecurityFeature
                  icon={<Shield className="h-5 w-5 text-purple-400" />}
                  title="Robust Security Headers"
                  description="Content Security Policy (CSP), HSTS, and anti-clickjacking measures protect against web vulnerabilities."
                />

                <SecurityFeature
                  icon={<Users className="h-5 w-5 text-yellow-400" />}
                  title="Access Controls"
                  description="Granular permissions ensure only authorized personnel can access sensitive data."
                />
              </div>

          
            </div>
            <div className="relative hidden lg:block">
              <div className="h-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center">
                <SecurityVisualization />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function ProcessStep({ number, icon, title, description, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="flex items-start group"
    >
      <div className="flex-shrink-0 mr-6">
        <div className="bg-slate-100 p-3 rounded-xl group-hover:bg-slate-200 transition-colors">
          <div className="text-slate-700">{icon}</div>
        </div>
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-600 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  )
}

function LiveProcessDemo() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isProcessing, setIsProcessing] = useState(true)

  const processSteps = [
    {
      title: "Document Upload",
      vessel: "MV Baltic Trader",
      action: "Uploading certificates",
      files: ["Safety Certificate", "Radio Certificate", "Tonnage Certificate"],
      progress: 100,
      status: "complete",
    },
    {
      title: "AI Analysis",
      vessel: "MV Baltic Trader",
      action: "Analyzing documents",
      files: ["Extracting expiry dates", "Validating authenticity", "Checking compliance"],
      progress: 75,
      status: "processing",
    },
    {
      title: "Alert Generation",
      vessel: "MV Baltic Trader",
      action: "Generating alerts",
      files: ["Certificate expiring in 30 days", "Port requirement check", "Compliance status update"],
      progress: 100,
      status: "complete",
    },
    {
      title: "Compliance Ready",
      vessel: "MV Baltic Trader",
      action: "System ready",
      files: ["All documents verified", "Port intelligence updated", "Team notifications sent"],
      progress: 100,
      status: "complete",
    },
  ]

  useEffect(() => {
    if (!isProcessing) return

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % processSteps.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [isProcessing])

  const step = processSteps[currentStep]

  return (
    <div className="relative">
      {/* Main Demo Container */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl p-6 text-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              animation: "float 6s ease-in-out infinite",
            }}
          />
        </div>

        {/* Header */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mr-4">
                {currentStep === 0 && <Upload className="h-6 w-6 text-white" />}
                {currentStep === 1 && <Brain className="h-6 w-6 text-white" />}
                {currentStep === 2 && <Bell className="h-6 w-6 text-white" />}
                {currentStep === 3 && <CheckCircle className="h-6 w-6 text-white" />}
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Comovis Process</h3>
                <p className="text-slate-300 text-sm">Step {currentStep + 1} of 4</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-300">Progress</div>
              <div className="text-2xl font-bold text-green-400">{step.progress}%</div>
            </div>
          </div>

          {/* Current Step */}
          <motion.div key={currentStep} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <h4 className="text-xl font-semibold text-white mb-2">{step.title}</h4>
            <div className="flex items-center text-slate-300 space-x-4">
              <span className="flex items-center">
                <Ship className="h-4 w-4 mr-2" />
                {step.vessel}
              </span>
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {step.action}
              </span>
            </div>
          </motion.div>

          {/* Progress Steps */}
          <div className="space-y-3 mb-6">
            {step.files.map((file, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-500 ${
                  step.status === "complete"
                    ? "bg-green-500/20 border-green-400"
                    : step.status === "processing"
                      ? "bg-blue-500/20 border-blue-400"
                      : "bg-slate-700/50 border-slate-600"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full mr-3 transition-all duration-500 ${
                      step.status === "complete"
                        ? "bg-green-400 shadow-lg shadow-green-400/50"
                        : step.status === "processing"
                          ? "bg-blue-400 shadow-lg shadow-blue-400/50 animate-pulse"
                          : "bg-slate-500"
                    }`}
                  />
                  <span className="text-white font-medium text-sm">{file}</span>
                </div>
                {step.status === "complete" && <CheckCircle className="h-4 w-4 text-green-400" />}
                {step.status === "processing" && <Zap className="h-4 w-4 text-blue-400 animate-pulse" />}
              </motion.div>
            ))}
          </div>

          {/* Step Indicators */}
          <div className="flex items-center justify-center space-x-2 pt-4 border-t border-slate-700">
            {processSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentStep ? "bg-white scale-125" : "bg-slate-600"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Success Indicator */}
        {currentStep === 3 && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="absolute -top-4 -right-4 bg-green-500 rounded-full p-3 shadow-xl"
          >
            <CheckCircle className="h-6 w-6 text-white" />
          </motion.div>
        )}
      </div>

      {/* Floating Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-xl p-4 border border-slate-200 z-20"
      >
        <div className="text-center">
          <div className="text-2xl font-bold text-slate-900">3 mins</div>
          <p className="text-slate-600 text-sm">Setup Time</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="absolute -top-6 right-8 bg-white rounded-lg shadow-xl p-4 border border-slate-200 z-20"
      >
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">24/7</div>
          <p className="text-slate-600 text-sm">Monitoring</p>
        </div>
      </motion.div>
    </div>
  )
}

function SecurityFeature({ icon, title, description }) {
  return (
    <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
      <div className="flex items-center mb-2">
        {icon}
        <h4 className="font-medium text-white ml-2">{title}</h4>
      </div>
      <p className="text-sm text-slate-300">{description}</p>
    </div>
  )
}

function SecurityVisualization() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Central Security Shield */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        className="relative"
      >
        <div className="w-32 h-32 rounded-full border-2 border-blue-400/30 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full border-2 border-purple-400/50 flex items-center justify-center">
            <Shield className="h-8 w-8 text-white" />
          </div>
        </div>

        {/* Security Protection Icons (Good) */}
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          className="absolute -top-4 -right-4 bg-blue-500 rounded-full p-2 shadow-lg"
        >
          <Lock className="h-4 w-4 text-white" />
        </motion.div>

        <motion.div
          animate={{ y: [10, -10, 10] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
          className="absolute -bottom-4 -left-4 bg-green-500 rounded-full p-2 shadow-lg"
        >
          <Database className="h-4 w-4 text-white" />
        </motion.div>

        <motion.div
          animate={{ x: [-10, 10, -10] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 2 }}
          className="absolute top-1/2 -right-8 bg-purple-500 rounded-full p-2 shadow-lg"
        >
          <Users className="h-4 w-4 text-white" />
        </motion.div>
      </motion.div>

      {/* Bad Actor Threat Icons (Red) - Being Blocked */}
      <motion.div
        animate={{
          x: [0, -20, 0],
          opacity: [0.7, 0.3, 0.7],
        }}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
        className="absolute top-8 left-8 bg-red-500 rounded-full p-2 shadow-lg"
      >
        <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z"
            clipRule="evenodd"
          />
        </svg>
      </motion.div>

      <motion.div
        animate={{
          x: [0, 20, 0],
          y: [0, -15, 0],
          opacity: [0.7, 0.3, 0.7],
        }}
        transition={{ duration: 3.5, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
        className="absolute top-8 right-8 bg-red-500 rounded-full p-2 shadow-lg"
      >
        <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
        </svg>
      </motion.div>

      <motion.div
        animate={{
          y: [0, 20, 0],
          opacity: [0.7, 0.3, 0.7],
        }}
        transition={{ duration: 4.5, repeat: Number.POSITIVE_INFINITY, delay: 2 }}
        className="absolute bottom-8 left-12 bg-red-500 rounded-full p-2 shadow-lg"
      >
        <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </motion.div>

      <motion.div
        animate={{
          x: [0, -15, 0],
          y: [0, 15, 0],
          opacity: [0.7, 0.3, 0.7],
        }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
        className="absolute bottom-8 right-12 bg-red-500 rounded-full p-2 shadow-lg"
      >
        <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </motion.div>

      {/* Protective Barrier Effect */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        className="absolute inset-0 rounded-full border-2 border-blue-400/20"
      />
    </div>
  )
}
