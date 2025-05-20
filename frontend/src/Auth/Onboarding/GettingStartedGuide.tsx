"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FileUp,
  Ship,
  Users,
  Bell,
  Calendar,
  CheckCircle2,
  ChevronRight,
  X,
  Anchor,
  Maximize2,
  Minimize2,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

interface Task {
  id: string
  title: string
  description: string
  icon: React.ElementType
  completed: boolean
  action: string
  route: string
  priority: "high" | "medium" | "low"
}

export default function GettingStartedGuide() {
  const [isMinimized, setIsMinimized] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "upload-documents",
      title: "Upload Vessel Documents",
      description: "Add essential certificates and documents for your vessels to start tracking compliance",
      icon: FileUp,
      completed: false,
      action: "Upload Documents",
      route: "/documents/upload",
      priority: "high",
    },
    {
      id: "complete-vessel-details",
      title: "Complete Vessel Details",
      description: "Add technical specifications and operational details to your vessels",
      icon: Ship,
      completed: false,
      action: "Update Vessels",
      route: "/fleet",
      priority: "high",
    },
    {
      id: "invite-team",
      title: "Invite Your Team",
      description: "Add team members to collaborate on maritime compliance",
      icon: Users,
      completed: false,
      action: "Invite Team",
      route: "/team/invite",
      priority: "medium",
    },
    {
      id: "setup-notifications",
      title: "Set Up Notifications",
      description: "Configure alerts for document expirations and compliance issues",
      icon: Bell,
      completed: false,
      action: "Configure Alerts",
      route: "/settings/notifications",
      priority: "medium",
    },
    {
      id: "schedule-inspection",
      title: "Schedule Your First Inspection",
      description: "Plan for upcoming Port State Control inspections",
      icon: Calendar,
      completed: false,
      action: "Schedule",
      route: "/inspections/schedule",
      priority: "low",
    },
  ])

  // Calculate completion percentage
  const completedTasks = tasks.filter((task) => task.completed).length
  const completionPercentage = Math.round((completedTasks / tasks.length) * 100)

  // Mark a task as completed
  const completeTask = (taskId: string) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed: true } : task)))
  }

  // Simulate checking if tasks are already completed (e.g., from database)
  useEffect(() => {
    // This would be replaced with an actual API call to check task status
    const checkCompletedTasks = async () => {
      // Simulating API response
      const mockCompletedTaskIds: string[] = []

      if (mockCompletedTaskIds.length > 0) {
        setTasks(tasks.map((task) => (mockCompletedTaskIds.includes(task.id) ? { ...task, completed: true } : task)))
      }
    }

    checkCompletedTasks()
  }, [])

  if (isDismissed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg border-blue-200 bg-white z-50"
              onClick={() => setIsDismissed(false)}
            >
              <Anchor className="h-6 w-6 text-blue-600" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Show getting started guide</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-4 right-4 z-50 w-full max-w-md"
      >
        <Card className="border-blue-200 shadow-lg">
          <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-blue-100 dark:bg-blue-800 p-1.5 rounded-full mr-2">
                  <Anchor className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-lg">Getting Started with Comovis</CardTitle>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsMinimized(!isMinimized)}>
                  {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsDismissed(true)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardDescription>
              Complete these steps to get the most out of your maritime compliance platform
            </CardDescription>
          </CardHeader>

          {!isMinimized && (
            <>
              <CardContent className="pt-4">
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">
                      {completedTasks} of {tasks.length} tasks completed
                    </span>
                    <span className="text-sm font-medium">{completionPercentage}%</span>
                  </div>
                  <Progress value={completionPercentage} className="h-2" />
                </div>

                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-3 rounded-lg border ${
                        task.completed
                          ? "bg-green-50 border-green-100 dark:bg-green-950 dark:border-green-900"
                          : task.priority === "high"
                            ? "bg-blue-50 border-blue-100 dark:bg-blue-950 dark:border-blue-900"
                            : "bg-white border-gray-200 dark:bg-gray-950 dark:border-gray-800"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 ${
                            task.completed ? "text-green-600 dark:text-green-400" : "text-blue-600 dark:text-blue-400"
                          }`}
                        >
                          {task.completed ? <CheckCircle2 className="h-5 w-5" /> : <task.icon className="h-5 w-5" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-medium text-sm">{task.title}</h3>
                            {!task.completed && task.priority === "high" && (
                              <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                                Priority
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{task.description}</p>
                          {!task.completed && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="mt-2 h-8 text-xs"
                              onClick={() => completeTask(task.id)}
                            >
                              {task.action}
                              <ChevronRight className="h-3 w-3 ml-1" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="pt-0 pb-4 flex justify-between">
                <Button variant="ghost" size="sm" onClick={() => setIsDismissed(true)}>
                  Dismiss
                </Button>
                <Button variant="outline" size="sm">
                  View All Tasks
                </Button>
              </CardFooter>
            </>
          )}
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}
