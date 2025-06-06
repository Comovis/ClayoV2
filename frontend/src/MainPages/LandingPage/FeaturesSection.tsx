"use client"

import { motion } from "framer-motion"
import {
  MessageSquare,
  Brain,
  Users,
  Clock,
  Settings,
  Sliders,
  FileText,
  BarChart3,
  Smile,
  VolumeIcon as VolumeUp,
  Gauge,
} from "lucide-react"

export default function FeaturesSection() {
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
            Everything You Need for Customer Support & Sales
          </motion.h2>

          <motion.p
            className="text-xl text-slate-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Our AI platform handles customer inquiries, qualifies leads, and provides 24/7 support across all channels.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          <FeatureCard
            icon={<MessageSquare className="h-6 w-6 text-slate-700" />}
            title="Multi-Channel Support"
            description="Handle customer inquiries across chat, email, phone, and social media from a single unified platform."
            delay={0}
          />

          <FeatureCard
            icon={<Brain className="h-6 w-6 text-slate-700" />}
            title="AI Knowledge Base"
            description="Train your AI with your product information, FAQs, and company policies to provide accurate responses."
            delay={0.1}
          />

          <FeatureCard
            icon={<Users className="h-6 w-6 text-slate-700" />}
            title="Lead Qualification"
            description="Automatically qualify leads, collect contact information, and schedule appointments with your sales team."
            delay={0.2}
          />

          <FeatureCard
            icon={<Clock className="h-6 w-6 text-slate-700" />}
            title="24/7 Availability"
            description="Provide instant responses to customer inquiries at any time, even outside of business hours."
            delay={0.3}
          />

          <FeatureCard
            icon={<BarChart3 className="h-6 w-6 text-slate-700" />}
            title="Advanced Analytics"
            description="Gain insights into customer interactions, common questions, and conversion rates with detailed reports."
            delay={0.4}
          />

          <FeatureCard
            icon={<Settings className="h-6 w-6 text-slate-700" />}
            title="Easy Integration"
            description="Seamlessly integrate with your existing CRM, helpdesk, and e-commerce platforms."
            delay={0.5}
          />
        </div>

        {/* AI Personality Configuration */}
        <div className="bg-gradient-to-b from-slate-50 to-white rounded-2xl p-6 md:p-12">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <span className="inline-block text-sm font-semibold text-slate-500 tracking-wider uppercase mb-3">
              CUSTOMIZABLE AI
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">AI Personality Configuration</h3>
            <p className="text-slate-600 mb-8">
              Customize your AI assistant to match your brand voice and customer service style. Configure personality
              traits, response styles, and behavior patterns.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <PersonalityFeature
                icon={<Smile className="h-5 w-5 text-blue-500" />}
                title="Personality Types"
                description="Choose from Friendly, Professional, Helpful, or Enthusiastic personalities to match your brand."
                options={["Friendly", "Professional", "Helpful", "Enthusiastic"]}
                delay={0}
              />

              <PersonalityFeature
                icon={<VolumeUp className="h-5 w-5 text-green-500" />}
                title="Voice & Tone Settings"
                description="Configure response length, formality level, and emoji usage to create the perfect tone."
                options={["Casual", "Balanced", "Formal"]}
                delay={0.1}
              />

              <PersonalityFeature
                icon={<Sliders className="h-5 w-5 text-purple-500" />}
                title="Behavior Controls"
                description="Set how proactive your AI should be with suggestions and when it should ask clarifying questions."
                options={["Reactive", "Balanced", "Proactive"]}
                delay={0.2}
              />

              <PersonalityFeature
                icon={<FileText className="h-5 w-5 text-orange-500" />}
                title="Response Templates"
                description="Create custom templates for greetings, escalations, and common scenarios."
                options={["Greetings", "Escalations", "Closings"]}
                delay={0.3}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden"
            >
              <div className="bg-slate-800 p-4 text-white">
                <h4 className="font-medium flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  AI Personality Configuration
                </h4>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Personality Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Friendly", "Professional", "Helpful", "Enthusiastic"].map((type, i) => (
                      <div
                        key={i}
                        className={`p-2 border rounded-md text-center text-sm cursor-pointer transition-colors ${i === 0 ? "bg-blue-50 border-blue-200 text-blue-700" : "border-slate-200 hover:bg-slate-50"}`}
                      >
                        {type}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Response Length</label>
                  <div className="h-2 bg-slate-200 rounded-full">
                    <div className="h-2 bg-blue-500 rounded-full w-1/2"></div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>Concise</span>
                    <span>Balanced</span>
                    <span>Detailed</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Formality Level</label>
                  <div className="h-2 bg-slate-200 rounded-full">
                    <div className="h-2 bg-blue-500 rounded-full w-1/4"></div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>Casual</span>
                    <span>Balanced</span>
                    <span>Formal</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Emoji Usage</label>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Moderate</span>
                    <div className="w-10 h-5 bg-blue-500 rounded-full relative">
                      <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Gauge className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-sm font-medium">AI Performance Score</span>
                    </div>
                    <span className="text-lg font-bold text-green-600">92%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ icon, title, description, delay = 0 }) {
  return (
    <motion.div
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

function PersonalityFeature({ icon, title, description, options, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm"
    >
      <div className="flex items-start">
        <div className="bg-slate-100 p-2 rounded-lg mr-4 flex-shrink-0">{icon}</div>
        <div>
          <h4 className="font-medium text-slate-900 mb-1">{title}</h4>
          <p className="text-sm text-slate-600 mb-3">{description}</p>
          <div className="flex flex-wrap gap-2">
            {options.map((option, i) => (
              <span
                key={i}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800"
              >
                {option}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
