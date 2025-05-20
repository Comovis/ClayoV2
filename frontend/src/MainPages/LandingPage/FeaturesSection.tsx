"use client"

import { motion } from "framer-motion"
import { FileText, Shield, MapPin, Share2, AlertCircle, CheckCircle, Ship, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Features() {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
            description="Access real-time port requirements for over 300 global ports, including PSC inspection focus areas and local regulations."
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

        <div className="mt-20 bg-slate-50 rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-block text-sm font-semibold text-slate-500 tracking-wider uppercase mb-3">
                ADVANCED TECHNOLOGY
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Powered by Advanced AI</h3>
              <p className="text-slate-600 mb-6">
                Our machine learning algorithms analyze thousands of port state control inspection reports to identify
                patterns and predict potential deficiencies before they occur.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-slate-700">Document anomaly detection</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-slate-700">Predictive compliance risk scoring</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-slate-700">Automated document classification</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-slate-700">Port-specific requirement analysis</span>
                </li>
              </ul>

              <Button className="mt-8 bg-slate-800 hover:bg-slate-700 text-white">
                Learn More About Our Technology <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="relative">
              <img
                src="/placeholder-5ikpt.png"
                alt="AI-Powered Maritime Compliance"
                className="rounded-lg shadow-lg"
              />
            </div>
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
