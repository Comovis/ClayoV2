"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, Shield, FileCheck, Clock, Ship, CheckCircle, AlertTriangle } from "lucide-react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import BookDemoModal from "../../MainComponents/NavBar/BookDemoModal"

export default function RefinedHero() {
  const [isBookDemoOpen, setIsBookDemoOpen] = useState(false)

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white min-h-screen">
      {/* Background pattern */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000000' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 md:py-28 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl mx-auto lg:mx-0"
          >
            {/* Founder credibility */}
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-sm font-medium mb-4 sm:mb-6 max-w-full">
              <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 flex-shrink-0"></span>
              <span className="truncate">Built by Maritime Professionals, for Maritime Professionals</span>
            </div>

            {/* Problem-focused headline */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-slate-900 mb-4 sm:mb-6 leading-tight break-words">
              Prevent Vessel Detentions and Delays
            </h1>

            {/* Clear value proposition */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 mb-6 sm:mb-8 leading-relaxed break-words">
              We use AI technology to help maritime operators avoid costly detentions and delays at port calls. Comovis securely
              organises all your maritime documents, tracks expiry dates, and provides real-time port
              intelligence—accessible to your entire team, onshore and offshore.
            </p>

            {/* Professional CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12 w-full">
              <Button
                size="lg"
                className="bg-slate-800 hover:bg-slate-700 text-white text-base px-6 w-full sm:w-auto flex-shrink-0"
                onClick={() => setIsBookDemoOpen(true)}
              >
                Book a Demo <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Link to="/signup" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-slate-700 border-slate-300 hover:bg-slate-100 text-base w-full"
                >
                  Start Free Trial
                </Button>
              </Link>
            </div>

            {/* Solution-focused benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
              <div className="flex items-start min-w-0">
                <div className="bg-slate-100 p-2 rounded-lg mr-3 flex-shrink-0">
                  <Shield className="h-5 w-5 text-slate-700" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-slate-900 break-words">Prevent Detentions</h3>
                  <p className="text-sm text-slate-600 break-words">Avoid costly delays and fines</p>
                </div>
              </div>
              <div className="flex items-start min-w-0">
                <div className="bg-slate-100 p-2 rounded-lg mr-3 flex-shrink-0">
                  <FileCheck className="h-5 w-5 text-slate-700" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-slate-900 break-words">Organise All Documents</h3>
                  <p className="text-sm text-slate-600 break-words">Certificates, crew docs, port papers</p>
                </div>
              </div>
              <div className="flex items-start min-w-0">
                <div className="bg-slate-100 p-2 rounded-lg mr-3 flex-shrink-0">
                  <Clock className="h-5 w-5 text-slate-700" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-slate-900 break-words">Save Time</h3>
                  <p className="text-sm text-slate-600 break-words">40% less documentation work</p>
                </div>
              </div>
              <div className="flex items-start min-w-0">
                <div className="bg-slate-100 p-2 rounded-lg mr-3 flex-shrink-0">
                  <Ship className="h-5 w-5 text-slate-700" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-slate-900 break-words">Port Intelligence</h3>
                  <p className="text-sm text-slate-600 break-words">Real-time requirements</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative mt-8 lg:mt-0 w-full"
          >
            <LiveDetentionPreventionDemo />
          </motion.div>
        </div>
      </div>

      <BookDemoModal isOpen={isBookDemoOpen} onClose={() => setIsBookDemoOpen(false)} />
    </div>
  )
}

function LiveDetentionPreventionDemo() {
  const [currentScenario, setCurrentScenario] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [timelineStep, setTimelineStep] = useState(0)

  const scenarios = [
    {
      title: "Singapore Detention Prevented",
      vessel: "Pacific Explorer",
      savings: "$125,000",
      timeline: [
        { time: "90 days ago", event: "Certificate uploaded to Comovis", status: "success" },
        { time: "45 days ago", event: "First expiry warning sent", status: "warning" },
        { time: "15 days ago", event: "Critical alert triggered", status: "critical" },
        { time: "5 days ago", event: "Renewal reminder sent", status: "warning" },
        { time: "Today", event: "Certificate renewed ✓", status: "success" },
      ],
    },
    {
      title: "Port Requirements Identified",
      vessel: "Northern Star",
      savings: "$89,500",
      timeline: [
        { time: "Port approach", event: "Port requirements checked", status: "warning" },
        { time: "2 hours ago", event: "Missing document identified", status: "critical" },
        { time: "1 hour ago", event: "Document located in system", status: "warning" },
        { time: "30 min ago", event: "Document package prepared", status: "success" },
        { time: "Arrival", event: "All documents ready ✓", status: "success" },
      ],
    },
  ]

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setTimelineStep((prev) => {
        if (prev >= scenarios[currentScenario].timeline.length - 1) {
          // Move to next scenario
          setTimeout(() => {
            setCurrentScenario((prev) => (prev + 1) % scenarios.length)
            setTimelineStep(0)
          }, 1000)
          return prev
        }
        return prev + 1
      })
    }, 1200)

    return () => clearInterval(interval)
  }, [currentScenario, isPlaying])

  const scenario = scenarios[currentScenario]
  const currentStep = scenario.timeline[timelineStep]

  return (
    <div className="relative mb-8 sm:mb-16 w-full">
      {/* Main Demo Container */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl p-4 sm:p-6 text-white relative overflow-hidden mx-0 sm:mx-4 my-4 sm:my-8 w-full max-w-full">
        {/* Animated Background Pattern */}
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
        <div className="relative z-10 w-full">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center min-w-0 flex-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-500 flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-white text-base sm:text-lg break-words">Crisis Averted</h3>
                <p className="text-slate-300 text-xs sm:text-sm break-words">Real-time prevention in action</p>
              </div>
            </div>
          </div>

          {/* Scenario Title */}
          <motion.div
            key={currentScenario}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 sm:mb-6 w-full"
          >
            <h4 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-1 break-words">
              {scenario.title}
            </h4>
            <p className="text-slate-300 flex items-center text-xs sm:text-sm break-words">
              <Ship className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
              <span className="truncate">{scenario.vessel}</span>
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="space-y-2 sm:space-y-3 w-full">
            {scenario.timeline.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0.3, x: -20 }}
                animate={{
                  opacity: index <= timelineStep ? 1 : 0.3,
                  x: index <= timelineStep ? 0 : -20,
                  scale: index === timelineStep ? 1.02 : 1,
                }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`flex items-center p-2 sm:p-3 rounded-lg border transition-all duration-500 w-full min-w-0 ${
                  index <= timelineStep
                    ? step.status === "success"
                      ? "bg-green-500/20 border-green-400"
                      : step.status === "warning"
                        ? "bg-yellow-500/20 border-yellow-400"
                        : "bg-red-500/20 border-red-400"
                    : "bg-slate-700/50 border-slate-600"
                }`}
              >
                <div
                  className={`w-2 sm:w-3 h-2 sm:h-3 rounded-full mr-2 sm:mr-3 transition-all duration-500 flex-shrink-0 ${
                    index <= timelineStep
                      ? step.status === "success"
                        ? "bg-green-400 shadow-lg shadow-green-400/50"
                        : step.status === "warning"
                          ? "bg-yellow-400 shadow-lg shadow-yellow-400/50"
                          : "bg-red-400 shadow-lg shadow-red-400/50"
                      : "bg-slate-500"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-white font-medium text-xs sm:text-sm break-words flex-1 mr-2">
                      {step.event}
                    </span>
                    <span className="text-slate-400 text-xs hidden sm:inline flex-shrink-0">{step.time}</span>
                  </div>
                </div>
                {index === timelineStep && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-1 sm:ml-2 flex-shrink-0">
                    {step.status === "success" ? (
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
                    ) : step.status === "warning" ? (
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-red-400" />
                    )}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Control */}
          <div className="flex items-center justify-between mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-700 w-full">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center text-slate-300 hover:text-white transition-colors text-xs sm:text-sm"
            >
              {isPlaying ? (
                <>
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse flex-shrink-0" />
                  Live
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-slate-400 rounded-full mr-2 flex-shrink-0" />
                  Paused
                </>
              )}
            </button>
            <div className="flex space-x-1">
              {scenarios.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentScenario(index)
                    setTimelineStep(0)
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentScenario ? "bg-white" : "bg-slate-600"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Floating Success Indicator */}
     
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="absolute -top-2 sm:-top-4 lg:-top-8 right-2 sm:right-4 lg:right-8 bg-white rounded-lg shadow-xl p-2 sm:p-3 lg:p-4 border border-slate-200 z-20"
      >
        <div className="text-center">
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">$560K</div>
          <p className="text-slate-600 text-xs sm:text-sm">Saved This Month</p>
        </div>
      </motion.div>
    </div>
  )
}
