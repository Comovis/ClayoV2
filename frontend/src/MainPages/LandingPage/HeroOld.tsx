"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, Shield, FileCheck, Clock, Ship, CheckCircle } from "lucide-react"

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white">
      {/* Background pattern */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000000' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <div className="container mx-auto px-4 py-20 sm:py-28 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-sm font-medium mb-6">
              <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
              Trusted by 200+ maritime companies worldwide
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
              Prevent Vessel Detentions with AI-Powered Compliance
            </h1>

            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Comovis helps maritime operators avoid costly detentions and delays by automating document management and
              providing real-time port requirement intelligence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button size="lg" className="bg-slate-800 hover:bg-slate-700 text-white text-base px-6">
                Book a Demo <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-slate-700 border-slate-300 hover:bg-slate-100 text-base"
              >
                Start Free Trial
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-start">
                <div className="bg-slate-100 p-2 rounded-lg mr-3">
                  <Shield className="h-5 w-5 text-slate-700" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">Prevent Detentions</h3>
                  <p className="text-sm text-slate-600">Avoid costly delays and fines</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-slate-100 p-2 rounded-lg mr-3">
                  <FileCheck className="h-5 w-5 text-slate-700" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">Centralize Documents</h3>
                  <p className="text-sm text-slate-600">All certificates in one place</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-slate-100 p-2 rounded-lg mr-3">
                  <Clock className="h-5 w-5 text-slate-700" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">Save Time</h3>
                  <p className="text-sm text-slate-600">40% less documentation work</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-slate-100 p-2 rounded-lg mr-3">
                  <Ship className="h-5 w-5 text-slate-700" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">Port Intelligence</h3>
                  <p className="text-sm text-slate-600">Real-time requirements</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative rounded-xl overflow-hidden shadow-2xl border border-slate-200">
              <img src="/maritime-compliance-dashboard.png" alt="Comovis Platform Dashboard" className="w-full h-auto" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-3 border border-slate-200">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Compliance Score</p>
                  <p className="text-lg font-bold text-green-600">92%</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-3 border border-slate-200">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-2">
                  <Clock className="h-5 w-5 text-slate-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Time Saved</p>
                  <p className="text-lg font-bold text-slate-800">40%</p>
                </div>
              </div>
            </div>

            {/* Client logos */}
            <div className="absolute -bottom-12 right-8 bg-white rounded-lg shadow-lg p-4 border border-slate-200">
              <p className="text-xs font-medium text-slate-500 mb-3">TRUSTED BY INDUSTRY LEADERS</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-6 bg-slate-200 rounded"></div>
                <div className="h-6 bg-slate-200 rounded"></div>
                <div className="h-6 bg-slate-200 rounded"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
