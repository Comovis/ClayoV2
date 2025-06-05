import type React from "react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

interface AnnouncementCardProps {
  type?: "product-launch" | "feature-update" | "comparison"
  badge?: string
  title: string
  subtitle?: string
  logos?: Array<{
    name: string
    icon: React.ReactNode
    gradient: string
  }>
  gradient?: string
  textColor?: string
  children?: React.ReactNode
}

export default function AnnouncementCard({
  type = "product-launch",
  badge,
  title,
  subtitle,
  logos,
  gradient = "from-gray-900 to-gray-700",
  textColor = "text-white",
  children,
}: AnnouncementCardProps) {
  if (type === "product-launch") {
    return (
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} p-8 md:p-12`}>
        {/* Logo Cards */}
        {logos && (
          <div className="mb-8 flex gap-6">
            {logos.map((logo, index) => (
              <div
                key={index}
                className={`flex h-32 w-48 items-center justify-center rounded-2xl bg-gradient-to-br ${logo.gradient} p-6`}
              >
                <div className="flex items-center gap-3">
                  {logo.icon}
                  <span className="text-xl font-semibold text-white">{logo.name}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Badge */}
        {badge && (
          <div className="mb-6 flex justify-center">
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20 px-4 py-2">
              <div className="mr-2 h-2 w-2 rounded-full bg-pink-400"></div>
              {badge}
            </Badge>
          </div>
        )}

        {/* Main Content */}
        <div className="text-center">
          <h1 className={`text-4xl md:text-6xl font-bold ${textColor} mb-4`}>{title}</h1>
          {subtitle && <p className={`text-lg md:text-xl ${textColor} opacity-90`}>{subtitle}</p>}
        </div>

        {children}
      </div>
    )
  }

  if (type === "feature-update") {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-gray-50 p-8 md:p-12">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{title}</h1>
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-900">
            <span className="text-2xl font-bold text-white">C</span>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute left-0 top-0 h-full w-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="mb-2 h-16 rounded-r-full bg-green-400"
              style={{
                width: `${20 + i * 5}px`,
                opacity: 0.3 + i * 0.1,
              }}
            />
          ))}
        </div>

        <div className="absolute right-0 top-0 h-full w-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="mb-2 h-16 rounded-l-full bg-green-400"
              style={{
                width: `${20 + (7 - i) * 5}px`,
                opacity: 0.3 + (7 - i) * 0.1,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10">{children}</div>
      </div>
    )
  }

  if (type === "comparison") {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 bg-gray-50">
          <div className="mb-4 flex items-center justify-center rounded-full bg-white px-4 py-2 w-fit mx-auto">
            <span className="text-sm font-medium text-gray-600">Generic Chatbot</span>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl bg-black px-4 py-2 text-white w-fit ml-auto">
              I want to update my billing address
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900">
                <span className="text-xs font-bold text-white">🤖</span>
              </div>
              <div className="text-sm text-gray-600">
                I'm sorry, but I'm not able to help with updating your billing address through chat.
                <br />
                <br />
                To proceed, please send an email to support@company.com with your request details.
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-400 to-pink-500">
          <div className="mb-4 flex items-center justify-center rounded-full bg-white px-4 py-2 w-fit mx-auto">
            <span className="text-sm font-medium text-gray-600">Chatbase AI Agent</span>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl bg-black px-4 py-2 text-white w-fit ml-auto">
              I want to update my billing address
            </div>
            <div className="rounded-2xl bg-white p-4">
              <div className="flex items-start gap-3 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900">
                  <span className="text-xs font-bold text-white">✨</span>
                </div>
                <div className="text-sm text-gray-600">Please share your new billing address:</div>
              </div>
              {children}
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return null
}
