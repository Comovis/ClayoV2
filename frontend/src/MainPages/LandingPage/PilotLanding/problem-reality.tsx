"use client"

import { motion } from "framer-motion"
import { AlertTriangle, Clock, FileX } from "lucide-react"

export default function ProblemReality() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            className="inline-block text-sm font-semibold text-slate-500 tracking-wider uppercase mb-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            THE REALITY TODAY
          </motion.span>

          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            The Reality of Maritime Document Management Today
          </motion.h2>

          <motion.p
            className="text-xl text-slate-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Every maritime professional knows these scenarios. Scattered documents, missed expiries, and last-minute
            scrambles are the norm.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">The 3 AM Phone Call</h3>
            <p className="text-slate-600 mb-4">
              "Your vessel is detained in Singapore. The Safety Management Certificate expired yesterday, and no one
              noticed."
            </p>
            <div className="text-red-600 text-sm font-medium">Cost: $50,000+ per day</div>
          </motion.div>

          <motion.div
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">The Last-Minute Scramble</h3>
            <p className="text-slate-600 mb-4">
              "We arrive at port tomorrow and just realized we don't have the required Maritime Declaration of Health.
              Can someone find the form?"
            </p>
            <div className="text-yellow-600 text-sm font-medium">Result: 8+ hours of stress and delays</div>
          </motion.div>

          <motion.div
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <FileX className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">The Document Hunt</h3>
            <p className="text-slate-600 mb-4">
              "The inspector wants to see our crew medical certificates. I know we have them somewhere... let me check
              these three different folders and ask the captain."
            </p>
            <div className="text-blue-600 text-sm font-medium">Time wasted: 2-3 hours per inspection</div>
          </motion.div>
        </div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Sound Familiar?</h3>
            <p className="text-slate-700">
              These aren't edge cases—they're the daily reality for maritime operators worldwide. We've experienced
              every one of these scenarios, and that's exactly why we're building Comovis.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
