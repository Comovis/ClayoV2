"use client"

import React from "react"
import { motion } from "framer-motion"
import { Ship, Shield, FileText, Share2, CheckCircle } from "lucide-react"

interface SystemInitializationLoadingProps {
  onComplete?: () => void
}

export default function SystemInitializationLoading({ onComplete }: SystemInitializationLoadingProps) {
  console.log("🎬 SystemInitializationLoading rendered")

  const systemModules = [
    {
      icon: Ship,
      message: "Loading your fleet registry",
      color: "text-blue-400",
    },
    {
      icon: Share2,
      message: "Syncing port call intelligence",
      color: "text-cyan-400",
    },
    {
      icon: Shield,
      message: "Analyzing compliance status",
      color: "text-green-400",
    },
    {
      icon: FileText,
      message: "Initializing document vault",
      color: "text-purple-400",
    },
    {
      icon: CheckCircle,
      message: "Activating secure sharing protocols",
      color: "text-emerald-400",
    },
  ]

  // Auto-complete after 3 seconds
  React.useEffect(() => {
    console.log("⏰ Setting up 3-second timer for loading completion...")
    const timer = setTimeout(() => {
      console.log("⏰ Timer completed, calling onComplete...")
      onComplete?.()
    }, 3000)

    return () => {
      console.log("🧹 Cleaning up timer...")
      clearTimeout(timer)
    }
  }, [onComplete])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center font-['Inter']">
      <div className="w-full max-w-md p-6">
        <motion.h3
          className="text-white text-2xl font-semibold mb-2 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome back
        </motion.h3>
        <motion.p
          className="text-gray-400 text-sm text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
         Please hold on whilst we get things set up.
        </motion.p>

        <div className="space-y-3">
          {systemModules.map((module, index) => {
            const IconComponent = module.icon
            return (
              <motion.div
                key={module.message}
                className="flex items-center space-x-4 p-3 bg-gray-900/50 rounded-lg border border-gray-800"
                initial={{ opacity: 0.3, x: -20 }}
                animate={{
                  opacity: [0.3, 1, 0.9],
                  x: [-20, 0, 0],
                  backgroundColor: ["rgba(17, 24, 39, 0.5)", "rgba(59, 130, 246, 0.08)", "rgba(17, 24, 39, 0.7)"],
                  borderColor: ["rgba(75, 85, 99, 1)", "rgba(59, 130, 246, 0.3)", "rgba(34, 197, 94, 0.4)"],
                }}
                transition={{
                  duration: 2.8,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: index * 0.35,
                }}
              >
                <motion.div
                  className="flex-shrink-0"
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: index * 0.35 + 1.8,
                  }}
                >
                  <IconComponent className={`w-5 h-5 ${module.color}`} />
                </motion.div>
                <span className="text-white text-sm font-medium flex-grow">{module.message}</span>
                <motion.div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  animate={{
                    backgroundColor: ["#6b7280", "#10b981", "#10b981"],
                    scale: [1, 1.3, 1.1],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: index * 0.35 + 2.2,
                  }}
                />
              </motion.div>
            )
          })}
        </div>

        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <motion.p
            className="text-gray-500 text-xs font-medium"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            Comovis Maritime Intelligence Platform
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}
