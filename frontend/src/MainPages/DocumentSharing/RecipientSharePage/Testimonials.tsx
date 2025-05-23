"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Quote } from "lucide-react"

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            className="inline-block text-sm font-semibold text-slate-500 tracking-wider uppercase mb-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            SUCCESS STORIES
          </motion.span>

          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Trusted by Maritime Professionals
          </motion.h2>

          <motion.p
            className="text-xl text-slate-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            See what our customers say about how Comovis has transformed their compliance operations.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <TestimonialCard
            quote="Comovis has reduced our documentation workload by 40% and helped us avoid two potential detentions in the first month alone."
            name="Maria Rodriguez"
            title="Fleet Manager"
            company="Global Shipping Co."
            initials="MR"
            delay={0}
          />

          <TestimonialCard
            quote="The port intelligence feature is a game-changer. We now know exactly what to prepare for each port call, eliminating last-minute surprises."
            name="John Chen"
            title="Technical Superintendent"
            company="Pacific Maritime Services"
            initials="JC"
            delay={0.1}
          />

          <TestimonialCard
            quote="Document sharing with port authorities used to take hours. With Comovis, it's just a few clicks. The time savings are incredible."
            name="Sarah Patel"
            title="HSEQ Manager"
            company="Atlantic Tankers Ltd."
            initials="SP"
            delay={0.2}
          />
        </div>

        <div className="mt-16 bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 md:p-12">
              <div className="mb-6">
                <Quote className="h-12 w-12 text-slate-200" />
              </div>
              <blockquote className="text-xl font-medium text-slate-800 mb-6 leading-relaxed">
                "Implementing Comovis across our managed fleet has reduced superintendent workload by 35% while
                improving our PSC inspection outcomes. The port intelligence feature alone has prevented multiple
                potential deficiencies."
              </blockquote>
              <div>
                <p className="font-bold text-slate-900">Michael Thompson</p>
                <p className="text-slate-600">Fleet Director, Oceanic Ship Management</p>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <img
                src="/maritime-professional-office.png"
                alt="Maritime Professional Testimonial"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function TestimonialCard({ quote, name, title, company, initials, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="h-full border-slate-200">
        <CardContent className="p-6">
          <div className="mb-4">
            <Quote className="h-8 w-8 text-slate-200" />
          </div>
          <blockquote className="text-lg text-slate-800 mb-6">"{quote}"</blockquote>
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarFallback className="bg-slate-100 text-slate-700">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-slate-900">{name}</p>
              <p className="text-sm text-slate-500">
                {title}, {company}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
