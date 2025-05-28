"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Ship, Users, MessageSquare } from "lucide-react"

export default function FounderStory() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            className="inline-block text-sm font-semibold text-slate-500 tracking-wider uppercase mb-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            WHY WE'RE BUILDING THIS
          </motion.span>

          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Why We're Building This
          </motion.h2>

          <motion.p
            className="text-xl text-slate-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            A message from our founder
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            className="bg-slate-50 rounded-2xl p-8 md:p-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 rounded-full bg-slate-800 text-white flex items-center justify-center mr-6 text-xl font-bold">
                YN
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Your Name</h3>
                <p className="text-slate-600">Founder, Comovis</p>
                <p className="text-slate-500 text-sm">Former Product Manager at Kpler & MarineTraffic</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-slate-700 mb-6">
                "During my time as a Product Manager at Kpler and MarineTraffic, I worked closely with maritime
                operators and saw the same document management challenges over and over again. Vessels detained because
                someone missed a certificate expiry. Port calls delayed because teams couldn't find the right documents.
                Crew changes held up because medical certificates were buried in email chains.
              </p>

              <p className="text-slate-700 mb-6">
                The worst part? Every single one of these problems was preventable. We have the technology to organize
                everything automatically, to get alerts before deadlines, to have all documents accessible to the entire
                team. But somehow, the maritime industry is still stuck with scattered files and manual processes.
              </p>

              <p className="text-slate-700 mb-8">
                That's why I'm building Comovis. Not as another software company trying to sell to maritime—but as
                someone who's worked in maritime tech and knows exactly what needs to be solved. Every document, every
                team member, every deadline - all connected."
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 bg-white rounded-lg border border-slate-200">
                <Ship className="h-8 w-8 text-slate-700 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-900">2 Years</div>
                <div className="text-slate-600 text-sm">Maritime Tech Experience</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border border-slate-200">
                <Users className="h-8 w-8 text-slate-700 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-900">25+</div>
                <div className="text-slate-600 text-sm">Operators Interviewed</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border border-slate-200">
                <MessageSquare className="h-8 w-8 text-slate-700 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-900">100%</div>
                <div className="text-slate-600 text-sm">Industry Focused</div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-slate-600 mb-6 italic">
                "Every feature in Comovis solves a real problem I've experienced or heard about from maritime
                professionals."
              </p>
              <Button className="bg-slate-800 hover:bg-slate-700 text-white">
                Join Our Early Access Program <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
