"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Customer Success Manager",
      company: "TechFlow Solutions",
      avatar: "SC",
      rating: 5,
      content:
        "Our customer satisfaction scores increased by 40% within the first month. The AI handles routine inquiries perfectly, allowing our team to focus on complex issues.",
      metrics: {
        improvement: "40% increase in satisfaction",
        timeframe: "First month",
      },
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      role: "Operations Director",
      company: "GrowthCorp",
      avatar: "MR",
      rating: 5,
      content:
        "We've reduced response times from hours to minutes. The lead qualification feature alone has increased our conversion rate by 25%.",
      metrics: {
        improvement: "25% conversion increase",
        timeframe: "3 months",
      },
    },
    {
      id: 3,
      name: "Emily Watson",
      role: "Head of Customer Experience",
      company: "InnovateLabs",
      avatar: "EW",
      rating: 5,
      content:
        "The 24/7 availability has been a game-changer. Our international customers love getting instant support regardless of time zones.",
      metrics: {
        improvement: "24/7 global coverage",
        timeframe: "Immediate",
      },
    },
    {
      id: 4,
      name: "David Kim",
      role: "CEO",
      company: "StartupVenture",
      avatar: "DK",
      rating: 5,
      content:
        "As a small team, this AI platform gives us enterprise-level customer service capabilities. It's like having a full support team without the overhead.",
      metrics: {
        improvement: "Enterprise capabilities",
        timeframe: "Day one",
      },
    },
    {
      id: 5,
      name: "Lisa Thompson",
      role: "Sales Manager",
      company: "ScaleUp Inc",
      avatar: "LT",
      rating: 5,
      content:
        "The AI qualifies leads so effectively that our sales team only talks to prospects who are genuinely interested. Our close rate has doubled.",
      metrics: {
        improvement: "2x close rate",
        timeframe: "6 weeks",
      },
    },
    {
      id: 6,
      name: "James Wilson",
      role: "Support Team Lead",
      company: "CustomerFirst",
      avatar: "JW",
      rating: 5,
      content:
        "Implementation was seamless, and the AI learned our processes quickly. Our team productivity has increased significantly.",
      metrics: {
        improvement: "Significant productivity gain",
        timeframe: "2 weeks",
      },
    },
  ]

  return (
    <section id="testimonials" className="py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            className="inline-block text-sm font-semibold text-slate-500 tracking-wider uppercase mb-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            CUSTOMER SUCCESS STORIES
          </motion.span>

          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Trusted by Growing Businesses
          </motion.h2>

          <motion.p
            className="text-xl text-slate-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            See how companies like yours are transforming their customer service and sales with our AI platform.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <Quote className="h-4 w-4 text-slate-300 ml-auto" />
                  </div>

                  <blockquote className="text-slate-700 mb-6 leading-relaxed">"{testimonial.content}"</blockquote>

                  <div className="bg-slate-50 rounded-lg p-3 mb-4">
                    <div className="text-sm font-medium text-slate-900">{testimonial.metrics.improvement}</div>
                    <div className="text-xs text-slate-500">{testimonial.metrics.timeframe}</div>
                  </div>

                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarFallback className="bg-slate-200 text-slate-700 text-sm">
                        {testimonial.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-slate-900">{testimonial.name}</div>
                      <div className="text-sm text-slate-500">{testimonial.role}</div>
                      <div className="text-sm text-slate-500">{testimonial.company}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
            <h3 className="text-xl font-semibold text-slate-900 mb-6">Join 500+ Growing Companies</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">500+</div>
                <div className="text-sm text-slate-600">Active Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">1M+</div>
                <div className="text-sm text-slate-600">Conversations Handled</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">4.8/5</div>
                <div className="text-sm text-slate-600">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">99.9%</div>
                <div className="text-sm text-slate-600">Uptime</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
