"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Upload, Brain, Bell, CheckCircle, ArrowRight, Users, Zap, Clock, Database, Shield, Lock } from "lucide-react"
import { useState, useEffect } from "react"

export default function HowItWorksSection() {
  // Live Process Demo Logic - Inline
  const [currentStep, setCurrentStep] = useState(0)
  const [isProcessing, setIsProcessing] = useState(true)

  const processSteps = [
    {
      title: "Knowledge Base Training",
      action: "Training AI with company data",
      files: ["Product Information", "FAQs", "Company Policies", "Support Scripts"],
      progress: 100,
      status: "complete",
    },
    {
      title: "Personality Configuration",
      action: "Customizing AI behavior",
      files: ["Voice & Tone Settings", "Response Templates", "Conversation Flow", "Escalation Rules"],
      progress: 75,
      status: "processing",
    },
    {
      title: "Channel Integration",
      action: "Deploying across channels",
      files: ["Website Chat Widget", "Email Integration", "Social Media", "CRM Connection"],
      progress: 100,
      status: "complete",
    },
    {
      title: "Performance Monitoring",
      action: "Analyzing AI performance",
      files: ["Customer Satisfaction", "Resolution Rate", "Response Time", "Conversion Rate"],
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
            How It Works
          </motion.h2>

          <motion.p
            className="text-xl text-slate-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Get started in minutes and see value from day one with our streamlined AI implementation process.
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
                title="Train Your AI"
                description="Upload your product information, FAQs, and company policies to train your AI assistant with your specific knowledge."
                delay={0}
              />

              <ProcessStep
                number="2"
                icon={<Brain className="h-6 w-6" />}
                title="Configure Personality"
                description="Customize your AI's personality, tone, and behavior to match your brand voice and customer service style."
                delay={0.1}
              />

              <ProcessStep
                number="3"
                icon={<Bell className="h-6 w-6" />}
                title="Deploy Across Channels"
                description="Integrate your AI assistant with your website, email, social media, and other customer touchpoints."
                delay={0.2}
              />

              <ProcessStep
                number="4"
                icon={<CheckCircle className="h-6 w-6" />}
                title="Monitor & Optimize"
                description="Review performance analytics, customer satisfaction scores, and continuously improve your AI's responses."
                delay={0.3}
              />
            </div>
          </motion.div>

          {/* Live Process Demo - Inline */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
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
                        <h3 className="font-bold text-white text-lg">Implementation Process</h3>
                        <p className="text-slate-300 text-sm">Step {currentStep + 1} of 4</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-300">Progress</div>
                      <div className="text-2xl font-bold text-green-400">{step.progress}%</div>
                    </div>
                  </div>

                  {/* Current Step */}
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                  >
                    <h4 className="text-xl font-semibold text-white mb-2">{step.title}</h4>
                    <div className="flex items-center text-slate-300 space-x-4">
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
                  <div className="text-2xl font-bold text-slate-900">1 Day</div>
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
                  <div className="text-2xl font-bold text-blue-600">85%</div>
                  <p className="text-slate-600 text-sm">Automation Rate</p>
                </div>
              </motion.div>
            </div>
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
                Your data security is our top priority. Our platform employs industry-leading security measures to
                protect your customer data and business information.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SecurityFeature
                  icon={<Database className="h-5 w-5 text-blue-400" />}
                  title="Secure Data Storage"
                  description="All data is encrypted at rest and stored in SOC 2 compliant data centers."
                />

                <SecurityFeature
                  icon={<Lock className="h-5 w-5 text-green-400" />}
                  title="End-to-End Encryption"
                  description="All communications are encrypted using TLS 1.3 protocols."
                />

                <SecurityFeature
                  icon={<Shield className="h-5 w-5 text-purple-400" />}
                  title="GDPR & CCPA Compliant"
                  description="Our platform is fully compliant with global privacy regulations."
                />

                <SecurityFeature
                  icon={<Users className="h-5 w-5 text-yellow-400" />}
                  title="Role-Based Access"
                  description="Granular permissions ensure data access control."
                />
              </div>

              <div className="mt-8">
                <Button className="bg-white text-slate-900 hover:bg-slate-100">
                  Learn More About Security
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
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

        {/* Security Protection Icons */}
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
