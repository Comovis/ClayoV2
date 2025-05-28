"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Database, Lock, Shield, Users, CheckCircle, Globe, Server } from "lucide-react"
import { useState, useEffect } from "react"

export default function EnterpriseSecurity() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 md:p-12">
              <span className="inline-block text-sm font-semibold text-slate-500 tracking-wider uppercase mb-3">
                ENTERPRISE SECURITY
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Enterprise-Grade Security</h3>
              <p className="text-slate-600 mb-8">
                Your maritime documents contain sensitive operational data. Comovis employs military-grade security
                measures to protect your fleet's critical information with comprehensive monitoring and access controls.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SecurityFeature
                  icon={<Database className="h-5 w-5 text-slate-700" />}
                  title="EU-Based Secure Servers"
                  description="All data stored in GDPR-compliant EU data centers with 99.99% uptime guarantee."
                />

                <SecurityFeature
                  icon={<Lock className="h-5 w-5 text-slate-700" />}
                  title="End-to-End Encryption"
                  description="AES-256 encryption for all documents, both in transit and at rest."
                />

                <SecurityFeature
                  icon={<Shield className="h-5 w-5 text-slate-700" />}
                  title="Multi-Factor Authentication"
                  description="Additional security layers to protect access to your sensitive maritime documents."
                />

                <SecurityFeature
                  icon={<Users className="h-5 w-5 text-slate-700" />}
                  title="Access Controls"
                  description="Granular permissions ensure only authorized personnel access sensitive data."
                />
              </div>

              <Button className="mt-8 bg-slate-800 hover:bg-slate-700 text-white">
                Learn More About Security <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="relative bg-slate-900 p-8 md:p-12">
              <SecurityMonitoringDashboard />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function SecurityMonitoringDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [currentRegion, setCurrentRegion] = useState(0)

  const regions = [
    { name: "EU-West-1", status: "Active", connections: 1247, uptime: "99.99%" },
    { name: "EU-Central-1", status: "Active", connections: 892, uptime: "99.98%" },
    { name: "EU-North-1", status: "Active", connections: 634, uptime: "100%" },
  ]

  const complianceMetrics = [
    { label: "Data Encryption", value: "AES-256", status: "active" },
    { label: "Access Logging", value: "Enabled", status: "active" },
    { label: "Backup Status", value: "Current", status: "active" },
    { label: "Authentication", value: "Multi-Factor", status: "active" },
  ]

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    const regionInterval = setInterval(() => {
      setCurrentRegion((prev) => (prev + 1) % regions.length)
    }, 4000)

    return () => {
      clearInterval(timeInterval)
      clearInterval(regionInterval)
    }
  }, [])

  return (
    <div className="text-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="text-xl font-bold text-white">Security Dashboard</h4>
          <p className="text-slate-300 text-sm">
            {currentTime.toLocaleDateString()} • {currentTime.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
          <span className="text-green-400 font-medium text-sm">Operational</span>
        </div>
      </div>

      {/* Infrastructure Status */}
      <div className="bg-slate-800 rounded-lg p-4 mb-6">
        <h5 className="font-semibold text-white mb-4 flex items-center">
          <Globe className="h-4 w-4 mr-2" />
          Infrastructure Status
        </h5>
        <div className="space-y-3">
          {regions.map((region, index) => (
            <div
              key={region.name}
              className={`flex items-center justify-between p-3 rounded transition-colors ${
                index === currentRegion ? "bg-slate-700" : "bg-slate-800"
              }`}
            >
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                <div>
                  <span className="text-white text-sm font-medium">{region.name}</span>
                  <p className="text-slate-400 text-xs">{region.status}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center text-slate-300 text-xs">
                  <Server className="h-3 w-3 mr-1" />
                  <span>{region.connections}</span>
                </div>
                <p className="text-slate-400 text-xs">Uptime: {region.uptime}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Features */}
      <div className="bg-slate-800 rounded-lg p-4">
        <h5 className="font-semibold text-white mb-4 flex items-center">
          <Shield className="h-4 w-4 mr-2" />
          Security Features
        </h5>
        <div className="grid grid-cols-2 gap-3">
          {complianceMetrics.map((metric, index) => (
            <div key={metric.label} className="bg-slate-700 p-3 rounded">
              <p className="text-slate-300 text-xs mb-1">{metric.label}</p>
              <div className="flex items-center justify-between">
                <span className="text-white text-sm font-medium">{metric.value}</span>
                <CheckCircle className="h-3 w-3 text-green-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SecurityFeature({ icon, title, description }) {
  return (
    <div className="bg-slate-50 p-4 rounded-lg">
      <div className="flex items-center mb-2">
        {icon}
        <h4 className="font-medium text-slate-900 ml-2">{title}</h4>
      </div>
      <p className="text-sm text-slate-600">{description}</p>
    </div>
  )
}
