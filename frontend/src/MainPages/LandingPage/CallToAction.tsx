"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, Clock, Users } from "lucide-react"

export default function CTASection({ setIsBookDemoOpen }) {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-sm font-semibold text-slate-300 tracking-wider uppercase mb-4">
              READY TO GET STARTED?
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Transform Your Customer Service Today
            </h2>

            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Join hundreds of businesses already using our AI platform to provide exceptional customer service and
              boost sales.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                className="bg-white text-slate-900 hover:bg-slate-100 text-lg px-8 py-4"
                onClick={() => setIsBookDemoOpen(true)}
              >
                Book a Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-slate-400 text-white hover:bg-slate-800 text-lg px-8 py-4"
              >
                Start Free Trial
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex items-center justify-center space-x-3"
              >
                <CheckCircle className="h-6 w-6 text-green-400" />
                <span className="text-slate-300">14-day free trial</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center justify-center space-x-3"
              >
                <Clock className="h-6 w-6 text-blue-400" />
                <span className="text-slate-300">Setup in minutes</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex items-center justify-center space-x-3"
              >
                <Users className="h-6 w-6 text-purple-400" />
                <span className="text-slate-300">500+ happy customers</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
