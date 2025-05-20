"use client"

import { motion } from "framer-motion"
import { Upload, Search, Bell, CheckCircle, ArrowRight, Lock, Database, Shield, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-slate-50">
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
            className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4"
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
            Get started in minutes and see value from day one with our streamlined onboarding process.
          </motion.p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="absolute left-1/2 top-12 bottom-12 w-0.5 bg-slate-200 hidden md:block"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
            <StepCard
              number="1"
              icon={<Upload className="h-6 w-6 text-slate-700" />}
              title="Upload Documents"
              description="Easily upload your vessel certificates and documents to our secure platform. Our AI automatically extracts key information like expiry dates and issuing authorities."
              imageUrl="/maritime-document-upload.png"
              imageAlt="Document Upload Interface"
              isImageRight={false}
              delay={0}
            />

            <StepCard
              number="2"
              icon={<Search className="h-6 w-6 text-slate-700" />}
              title="AI Analysis"
              description="Our AI analyzes your documents to identify expiry dates, compliance gaps, and potential issues. The system categorizes documents and creates a structured database of your fleet's compliance status."
              imageUrl="/placeholder.svg?height=300&width=500&query=AI%20analyzing%20maritime%20documents"
              imageAlt="AI Document Analysis"
              isImageRight={true}
              delay={0.2}
            />

            <StepCard
              number="3"
              icon={<Bell className="h-6 w-6 text-slate-700" />}
              title="Receive Alerts"
              description="Get timely notifications about expiring certificates, upcoming port requirements, and potential compliance issues. Our system provides actionable insights to help you maintain compliance."
              imageUrl="/placeholder.svg?height=300&width=500&query=maritime%20compliance%20alerts%20dashboard"
              imageAlt="Compliance Alerts Dashboard"
              isImageRight={false}
              delay={0.4}
            />

            <StepCard
              number="4"
              icon={<CheckCircle className="h-6 w-6 text-slate-700" />}
              title="Stay Compliant"
              description="Ensure your vessels are always ready for inspections and port calls. Access real-time port intelligence and prepare the exact documents needed for each port call to prevent detentions and delays."
              imageUrl="/placeholder.svg?height=300&width=500&query=vessel%20compliance%20status%20dashboard"
              imageAlt="Vessel Compliance Dashboard"
              isImageRight={true}
              delay={0.6}
            />
          </div>
        </div>

        <div className="mt-24">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 md:p-12">
                <span className="inline-block text-sm font-semibold text-slate-500 tracking-wider uppercase mb-3">
                  ENTERPRISE SECURITY
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Enterprise-Grade Security</h3>
                <p className="text-slate-600 mb-8">
                  Your data security is our top priority. Comovis employs industry-leading security measures to protect
                  your sensitive maritime documents.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SecurityFeature
                    icon={<Database className="h-5 w-5 text-slate-700" />}
                    title="EU-Based Secure Servers"
                    description="All data is stored in GDPR-compliant EU data centers with regular backups."
                  />

                  <SecurityFeature
                    icon={<Lock className="h-5 w-5 text-slate-700" />}
                    title="End-to-End Encryption"
                    description="Your documents are encrypted both in transit and at rest."
                  />

                  <SecurityFeature
                    icon={<Shield className="h-5 w-5 text-slate-700" />}
                    title="ISO 27001 Certified"
                    description="Our security practices meet international standards for information security."
                  />

                  <SecurityFeature
                    icon={<Users className="h-5 w-5 text-slate-700" />}
                    title="Access Controls"
                    description="Granular permissions ensure only authorized personnel can access sensitive data."
                  />
                </div>

                <Button className="mt-8 bg-slate-800 hover:bg-slate-700 text-white">
                  Learn More About Security <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="relative hidden lg:block">
                <img
                  src="/placeholder.svg?height=600&width=800&query=enterprise%20security%20data%20center%20with%20maritime%20focus"
                  alt="Enterprise-Grade Security"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function StepCard({ number, icon, title, description, imageUrl, imageAlt, isImageRight, delay = 0 }) {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <div className={`flex flex-col ${isImageRight ? "md:flex-row-reverse" : "md:flex-row"} gap-8 items-center`}>
        <div className="w-full md:w-1/2">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold z-10">
              {number}
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative z-0">
              <div className="bg-slate-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">{icon}</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">{title}</h3>
              <p className="text-slate-600">{description}</p>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={imageAlt}
            className="rounded-lg shadow-md border border-slate-200 w-full"
          />
        </div>
      </div>
    </motion.div>
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
