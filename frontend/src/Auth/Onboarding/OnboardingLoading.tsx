"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Bot, Brain, MessageSquare, Zap, Shield, CheckCircle, Sparkles } from "lucide-react"

interface OnboardingLoadingPageProps {
  onComplete?: () => void
}

export function OnboardingLoadingPage({ onComplete }: OnboardingLoadingPageProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const setupSteps = [
    {
      icon: Bot,
      message: "Initializing your AI assistant",
      color: "text-blue-400",
      bgColor: "rgba(59, 130, 246, 0.1)",
      borderColor: "rgba(59, 130, 246, 0.3)",
    },
    {
      icon: Brain,
      message: "Training neural networks",
      color: "text-purple-400",
      bgColor: "rgba(147, 51, 234, 0.1)",
      borderColor: "rgba(147, 51, 234, 0.3)",
    },
    {
      icon: MessageSquare,
      message: "Setting up conversation channels",
      color: "text-green-400",
      bgColor: "rgba(34, 197, 94, 0.1)",
      borderColor: "rgba(34, 197, 94, 0.3)",
    },
    {
      icon: Zap,
      message: "Optimizing response algorithms",
      color: "text-yellow-400",
      bgColor: "rgba(234, 179, 8, 0.1)",
      borderColor: "rgba(234, 179, 8, 0.3)",
    },
    {
      icon: Shield,
      message: "Securing customer data",
      color: "text-cyan-400",
      bgColor: "rgba(6, 182, 212, 0.1)",
      borderColor: "rgba(6, 182, 212, 0.3)",
    },
  ]

  // Progress through steps and complete after 4 seconds
  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < setupSteps.length - 1) {
          return prev + 1
        }
        return prev
      })
    }, 800)

    const completeTimer = setTimeout(() => {
      onComplete?.()
    }, 4000)

    return () => {
      clearInterval(stepInterval)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center font-['Inter'] relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-lg p-8 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6"
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 1, -1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <Bot className="h-10 w-10 text-white" />
          </motion.div>

          <motion.h1
            className="text-3xl font-bold text-white mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Setting up your AI Customer Hub
          </motion.h1>

          <motion.p
            className="text-gray-400 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            We're preparing everything for you...
          </motion.p>
        </motion.div>

        {/* Setup Steps */}
        <div className="space-y-4 mb-8">
          {setupSteps.map((step, index) => {
            const IconComponent = step.icon
            const isActive = index <= currentStep
            const isCompleted = index < currentStep

            return (
              <motion.div
                key={step.message}
                className="flex items-center space-x-4 p-4 rounded-xl border transition-all duration-500"
                style={{
                  backgroundColor: isActive ? step.bgColor : "rgba(17, 24, 39, 0.3)",
                  borderColor: isActive ? step.borderColor : "rgba(75, 85, 99, 0.3)",
                }}
                initial={{ opacity: 0.4, x: -20 }}
                animate={{
                  opacity: isActive ? 1 : 0.4,
                  x: 0,
                  scale: isActive ? 1.02 : 1,
                }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <motion.div
                  className="flex-shrink-0 relative"
                  animate={
                    isActive
                      ? {
                          scale: [1, 1.2, 1],
                        }
                      : {}
                  }
                  transition={{
                    duration: 1.5,
                    repeat: isActive && !isCompleted ? Number.POSITIVE_INFINITY : 0,
                  }}
                >
                  {isCompleted ? (
                    <motion.div
                      className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <CheckCircle className="w-5 h-5 text-white" />
                    </motion.div>
                  ) : (
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${isActive ? "bg-white/10" : "bg-gray-700"}`}
                    >
                      <IconComponent className={`w-5 h-5 ${isActive ? step.color : "text-gray-500"}`} />
                    </div>
                  )}

                  {isActive && !isCompleted && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-blue-400"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    />
                  )}
                </motion.div>

                <div className="flex-grow">
                  <motion.span
                    className={`text-sm font-medium ${isActive ? "text-white" : "text-gray-500"}`}
                    animate={isActive ? { opacity: [0.7, 1, 0.7] } : {}}
                    transition={{ duration: 2, repeat: isActive && !isCompleted ? Number.POSITIVE_INFINITY : 0 }}
                  >
                    {step.message}
                  </motion.span>
                </div>

                {isActive && !isCompleted && (
                  <motion.div className="flex space-x-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Progress Bar */}
        <motion.div
          className="w-full bg-gray-800 rounded-full h-2 mb-6 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStep + 1) / setupSteps.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </motion.div>

        {/* Footer */}
        <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
          <motion.div
            className="flex items-center justify-center space-x-2 text-gray-400 text-sm"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <Sparkles className="w-4 h-4" />
            <span>Powered by Clayo AI</span>
            <Sparkles className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
