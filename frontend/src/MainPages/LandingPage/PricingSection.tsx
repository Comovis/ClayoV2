"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, ArrowRight, Zap, Crown, Building } from "lucide-react"
import { useState } from "react"

export default function PricingSection() {
  const [billingCycle, setBillingCycle] = useState("monthly")

  const plans = [
    {
      name: "Starter",
      icon: <Zap className="h-6 w-6" />,
      description: "Perfect for small businesses getting started",
      monthlyPrice: 49,
      yearlyPrice: 39,
      features: [
        "Up to 1,000 conversations/month",
        "Basic AI personality customization",
        "Email & chat support",
        "Standard analytics dashboard",
        "2 team members",
        "Basic integrations",
        "Knowledge base (up to 100 articles)",
      ],
      limitations: ["Limited to 2 channels", "Basic reporting only"],
      cta: "Start Free Trial",
      popular: false,
    },
    {
      name: "Professional",
      icon: <Crown className="h-6 w-6" />,
      description: "Ideal for growing businesses with higher volume",
      monthlyPrice: 149,
      yearlyPrice: 119,
      features: [
        "Up to 10,000 conversations/month",
        "Advanced AI personality & behavior controls",
        "Priority support + phone support",
        "Advanced analytics & reporting",
        "10 team members",
        "All integrations included",
        "Unlimited knowledge base articles",
        "Custom response templates",
        "Lead qualification & scoring",
        "Multi-language support (5 languages)",
      ],
      limitations: [],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      icon: <Building className="h-6 w-6" />,
      description: "For large organizations with custom needs",
      monthlyPrice: null,
      yearlyPrice: null,
      features: [
        "Unlimited conversations",
        "Custom AI training & fine-tuning",
        "Dedicated success manager",
        "Custom analytics & reporting",
        "Unlimited team members",
        "Custom integrations & API access",
        "Advanced security & compliance",
        "Custom response workflows",
        "Advanced lead qualification",
        "Multi-language support (20+ languages)",
        "White-label options",
        "SLA guarantees",
      ],
      limitations: [],
      cta: "Contact Sales",
      popular: false,
    },
  ]

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            className="inline-block text-sm font-semibold text-slate-500 tracking-wider uppercase mb-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            TRANSPARENT PRICING
          </motion.span>

          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Choose Your Plan
          </motion.h2>

          <motion.p
            className="text-xl text-slate-600 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Start with a 14-day free trial. No credit card required. Cancel anytime.
          </motion.p>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="inline-flex items-center bg-slate-100 rounded-lg p-1"
          >
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === "monthly" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === "yearly" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Yearly
              <Badge className="ml-2 bg-green-100 text-green-800 text-xs">Save 20%</Badge>
            </button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-slate-800 text-white px-4 py-1">Most Popular</Badge>
                </div>
              )}

              <Card className={`h-full ${plan.popular ? "border-slate-800 shadow-lg" : "border-slate-200"}`}>
                <CardHeader className="text-center pb-8">
                  <div
                    className={`w-12 h-12 rounded-lg mx-auto mb-4 flex items-center justify-center ${
                      plan.popular ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {plan.icon}
                  </div>

                  <CardTitle className="text-xl font-bold text-slate-900">{plan.name}</CardTitle>
                  <p className="text-slate-600 text-sm">{plan.description}</p>

                  <div className="mt-6">
                    {plan.monthlyPrice ? (
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-bold text-slate-900">
                          ${billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                        </span>
                        <span className="text-slate-600 ml-2">/month</span>
                      </div>
                    ) : (
                      <div className="text-2xl font-bold text-slate-900">Custom Pricing</div>
                    )}

                    {billingCycle === "yearly" && plan.monthlyPrice && (
                      <p className="text-sm text-green-600 mt-1">
                        Save ${(plan.monthlyPrice - plan.yearlyPrice) * 12}/year
                      </p>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <Button
                    className={`w-full mb-6 ${
                      plan.popular
                        ? "bg-slate-800 hover:bg-slate-700 text-white"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-900"
                    }`}
                  >
                    {plan.cta}
                    {plan.cta !== "Contact Sales" && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>

                  <div className="space-y-3">
                    <h4 className="font-medium text-slate-900 text-sm">Everything included:</h4>
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-600">{feature}</span>
                      </div>
                    ))}

                    {plan.limitations.length > 0 && (
                      <>
                        <h4 className="font-medium text-slate-900 text-sm mt-6">Limitations:</h4>
                        {plan.limitations.map((limitation, limitIndex) => (
                          <div key={limitIndex} className="flex items-start">
                            <div className="w-4 h-4 border border-slate-300 rounded mr-3 mt-0.5 flex-shrink-0"></div>
                            <span className="text-sm text-slate-500">{limitation}</span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 max-w-3xl mx-auto"
        >
          <h3 className="text-2xl font-bold text-slate-900 text-center mb-8">Frequently Asked Questions</h3>
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-lg p-6">
              <h4 className="font-medium text-slate-900 mb-2">Can I change plans anytime?</h4>
              <p className="text-slate-600 text-sm">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll
                prorate any billing differences.
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-6">
              <h4 className="font-medium text-slate-900 mb-2">What happens if I exceed my conversation limit?</h4>
              <p className="text-slate-600 text-sm">
                We'll notify you when you're approaching your limit. You can upgrade your plan or purchase additional
                conversations as needed.
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-6">
              <h4 className="font-medium text-slate-900 mb-2">Is there a setup fee?</h4>
              <p className="text-slate-600 text-sm">
                No setup fees for Starter and Professional plans. Enterprise plans may include implementation services
                with custom pricing.
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-6">
              <h4 className="font-medium text-slate-900 mb-2">Do you offer refunds?</h4>
              <p className="text-slate-600 text-sm">
                We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, we'll provide a full
                refund.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
