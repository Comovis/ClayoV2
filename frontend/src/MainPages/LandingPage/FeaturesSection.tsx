"use client"

import { motion, AnimatePresence } from "framer-motion"
import { FileText, Shield, MapPin, Share2, AlertCircle, CheckCircle, Ship, Zap } from "lucide-react"
import { useState, useEffect } from "react"

export default function FeaturesEnhanced() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            className="inline-block text-sm font-semibold text-slate-500 tracking-wider uppercase mb-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            COMPREHENSIVE SOLUTION
          </motion.span>

          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Maritime Compliance Made Simple
          </motion.h2>

          <motion.p
            className="text-xl text-slate-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Comovis provides a comprehensive solution to the complex challenges of maritime compliance, helping you
            avoid detentions and streamline operations.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          <FeatureCard
            icon={<FileText className="h-6 w-6 text-slate-700" />}
            title="Document Hub"
            description="Centralize all vessel certificates and documents in one secure location with automatic expiry tracking and renewal reminders."
            delay={0}
            id="document-hub"
          />

          <FeatureCard
            icon={<MapPin className="h-6 w-6 text-slate-700" />}
            title="Port Intelligence"
            description="Access real-time port requirements as they change and instantly identify issues across your fleet. Prevent detentions & reduce delays."
            delay={0.1}
            id="port-intelligence"
          />

          <FeatureCard
            icon={<Shield className="h-6 w-6 text-slate-700" />}
            title="Deficiency Prevention"
            description="AI-powered analysis identifies potential compliance gaps before they become deficiencies during inspections."
            delay={0.2}
          />

          <FeatureCard
            icon={<Share2 className="h-6 w-6 text-slate-700" />}
            title="Secure Document Sharing"
            description="Share vessel documents securely with port authorities, charterers, and other stakeholders with just a few clicks."
            delay={0.3}
          />

          <FeatureCard
            icon={<AlertCircle className="h-6 w-6 text-slate-700" />}
            title="Compliance Alerts"
            description="Receive timely notifications about expiring certificates, upcoming inspections, and changing regulations."
            delay={0.4}
          />

          <FeatureCard
            icon={<Ship className="h-6 w-6 text-slate-700" />}
            title="Fleet Management"
            description="Manage compliance across your entire fleet with vessel-specific dashboards and fleet-wide analytics."
            delay={0.5}
            id="fleet-management"
          />
        </div>

        {/* Enhanced AI Section */}
        <div className="bg-gradient-to-b from-slate-50 to-white rounded-2xl p-6 md:p-12">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <span className="inline-block text-sm font-semibold text-slate-500 tracking-wider uppercase mb-3">
              ADVANCED TECHNOLOGY
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Powered by Advanced AI</h3>
            <p className="text-slate-600 mb-8">
              We use AI to ensure vessels are compliant across fleets at every port call. Our machine learning
              algorithms understand rapidly changing port requirements, ensuring you have the right documents and
              identify potential deficiencies before they occur.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* AI Capabilities List - With Checkmarks */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1"
            >
              <div className="space-y-4">
                <AICapabilityItem
                  title="Document Anomaly Detection"
                  description="Identifies inconsistencies and missing information before inspections."
                  delay={0}
                />

                <AICapabilityItem
                  title="Fine-Tuned Maritime AI"
                  description="Trained on various documents including scanned, PDF, handwritten and even different languages specifically tailored for the maritime industry."
                  delay={0.1}
                />

                <AICapabilityItem
                  title="Smart Classification"
                  description="Automatically categorises and organizes certificates and documents."
                  delay={0.2}
                />

                <AICapabilityItem
                  title="Port-Specific Analysis"
                  description="Provides tailored compliance recommendations for each destination."
                  delay={0.3}
                />
              </div>
            </motion.div>

            {/* Live AI Demo */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="order-1 lg:order-2"
            >
              <LiveAIDemo />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ icon, title, description, delay = 0, id }) {
  return (
    <motion.div
      id={id}
      className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="bg-slate-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </motion.div>
  )
}

function AICapabilityItem({ title, description, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="flex items-start"
    >
      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <h4 className="font-medium text-slate-900 mb-1">{title}</h4>
        <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  )
}

function LiveAIDemo() {
  const [currentAnalysis, setCurrentAnalysis] = useState(0)
  const [processingStep, setProcessingStep] = useState(0)
  const [isProcessing, setIsProcessing] = useState(true)

  const analyses = [
    {
      title: "Document Analysis in Progress",
      vessel: "MV Atlantic Voyager",
      documents: 47,
      steps: [
        { name: "Scanning certificates", status: "complete", time: "2.1s" },
        { name: "Checking expiry dates", status: "complete", time: "1.3s" },
        { name: "Validating authenticity", status: "processing", time: "3.2s" },
        { name: "Cross-referencing port requirements", status: "pending", time: "2.8s" },
        { name: "Generating risk assessment", status: "pending", time: "1.5s" },
      ],
      riskScore: 23,
    },
    {
      title: "Port Intelligence Analysis",
      vessel: "MV Pacific Explorer",
      documents: 52,
      steps: [
        { name: "Analyzing Singapore port requirements", status: "complete", time: "1.4s" },
        { name: "Checking PSC inspection history", status: "complete", time: "2.6s" },
        { name: "Identifying focus areas", status: "complete", time: "1.3s" },
        { name: "Comparing vessel documentation", status: "processing", time: "4.1s" },
        { name: "Preparing compliance report", status: "pending", time: "2.7s" },
      ],
      riskScore: 8,
    },
  ]

  useEffect(() => {
    if (!isProcessing) return

    const interval = setInterval(() => {
      setProcessingStep((prev) => {
        if (prev >= analyses[currentAnalysis].steps.length - 1) {
          setTimeout(() => {
            setCurrentAnalysis((prev) => (prev + 1) % analyses.length)
            setProcessingStep(0)
          }, 2000)
          return prev
        }
        return prev + 1
      })
    }, 1500)

    return () => clearInterval(interval)
  }, [currentAnalysis, isProcessing])

  const analysis = analyses[currentAnalysis]

  return (
    <div className="relative">
      {/* Main AI Demo Container */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl p-4 md:p-6 text-white relative overflow-hidden">
        {/* Animated Neural Network Background */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 400 300">
            <defs>
              <pattern id="neural" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1" fill="white" opacity="0.3">
                  <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite" />
                </circle>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#neural)" />
            <g stroke="white" strokeWidth="0.5" opacity="0.2">
              <line x1="0" y1="50" x2="400" y2="100">
                <animate attributeName="stroke-opacity" values="0.1;0.4;0.1" dur="4s" repeatCount="indefinite" />
              </line>
              <line x1="0" y1="150" x2="400" y2="120">
                <animate attributeName="stroke-opacity" values="0.1;0.4;0.1" dur="3s" repeatCount="indefinite" />
              </line>
              <line x1="0" y1="250" x2="400" y2="200">
                <animate attributeName="stroke-opacity" values="0.1;0.4;0.1" dur="5s" repeatCount="indefinite" />
              </line>
            </g>
          </svg>
        </div>

        {/* Header */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="flex items-center">
            
              <div>
                <h3 className="font-bold text-white text-base md:text-lg">AI Analysis Engine</h3>
                <p className="text-slate-300 text-xs md:text-sm">Real-time maritime intelligence</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="text-right">
                <div className="text-xs md:text-sm text-slate-300">Risk Score</div>
                <div
                  className={`text-lg md:text-2xl font-bold ${analysis.riskScore < 15 ? "text-green-400" : analysis.riskScore < 30 ? "text-yellow-400" : "text-red-400"}`}
                >
                  {analysis.riskScore}%
                </div>
              </div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </div>
          </div>

          {/* Current Analysis */}
          <motion.div
            key={currentAnalysis}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 md:mb-6"
          >
            <h4 className="text-lg md:text-xl font-semibold text-white mb-2">{analysis.title}</h4>
            <div className="flex flex-col sm:flex-row sm:items-center text-slate-300 space-y-1 sm:space-y-0 sm:space-x-4">
              <span className="flex items-center text-sm">
                <Ship className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                {analysis.vessel}
              </span>
              <span className="flex items-center text-sm">
                <FileText className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                {analysis.documents} documents
              </span>
            </div>
          </motion.div>

          {/* Processing Steps */}
          <div className="space-y-2 md:space-y-3">
            {analysis.steps.map((step, index) => {
              const isActive = index === processingStep
              const isComplete = index < processingStep
              const isPending = index > processingStep

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0.3, x: -20 }}
                  animate={{
                    opacity: isComplete || isActive ? 1 : 0.4,
                    x: 0,
                    scale: isActive ? 1.02 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-center justify-between p-2 md:p-3 rounded-lg border transition-all duration-500 ${
                    isComplete
                      ? "bg-green-500/20 border-green-400"
                      : isActive
                        ? "bg-blue-500/20 border-blue-400"
                        : "bg-slate-700/50 border-slate-600"
                  }`}
                >
                  <div className="flex items-center min-w-0 flex-1">
                    <div
                      className={`w-2 h-2 md:w-3 md:h-3 rounded-full mr-2 md:mr-3 flex-shrink-0 transition-all duration-500 ${
                        isComplete
                          ? "bg-green-400 shadow-lg shadow-green-400/50"
                          : isActive
                            ? "bg-blue-400 shadow-lg shadow-blue-400/50 animate-pulse"
                            : "bg-slate-500"
                      }`}
                    />
                    <span className="text-white font-medium text-xs md:text-sm truncate">{step.name}</span>
                  </div>
                  <div className="flex items-center space-x-1 md:space-x-2 flex-shrink-0">
                    <span className="text-slate-400 text-xs">{step.time}</span>
                  
                    {isActive && <Zap className="h-3 w-3 md:h-4 md:w-4 text-blue-400 animate-pulse" />}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Processing Complete Indicator */}
        <AnimatePresence>
          {processingStep === analysis.steps.length - 1 && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              className="absolute -top-2 -right-2 md:-top-4 md:-right-4 bg-green-500 rounded-full p-2 md:p-3 shadow-xl"
            >
            
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Single Floating Stat */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="absolute -top-4 md:-top-6 right-4 md:right-8 bg-white rounded-lg shadow-xl p-3 md:p-4 border border-slate-200 z-20"
      >
        <div className="text-center">
          <div className="text-xl md:text-2xl font-bold text-blue-600">10s</div>
          <p className="text-slate-600 text-xs md:text-sm">Avg Analysis Time</p>
        </div>
      </motion.div>
    </div>
  )
}
