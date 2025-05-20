"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Ship, Shield, Users, ArrowRight } from "lucide-react"
import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function PricingSection() {
  const [billingCycle, setBillingCycle] = useState("annual")

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
            PRICING
          </motion.span>

          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Simple, Transparent Pricing
          </motion.h2>

          <motion.p
            className="text-xl text-slate-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Choose the plan that's right for your fleet. All plans include a 30-day free trial.
          </motion.p>

          <div className="mt-8 flex justify-center">
            <div className="relative flex rounded-full bg-slate-100 p-1">
              <div className="flex items-center space-x-2">
                <Label
                  htmlFor="billing-toggle"
                  className={`px-3 py-1.5 text-sm ${billingCycle === "annual" ? "font-medium text-slate-900" : "text-slate-600"}`}
                >
                  Annual{" "}
                  <Badge variant="outline" className="ml-1 bg-green-50 text-green-700 border-green-200">
                    Save 10%
                  </Badge>
                </Label>
                <Switch
                  id="billing-toggle"
                  checked={billingCycle === "monthly"}
                  onCheckedChange={(checked) => setBillingCycle(checked ? "monthly" : "annual")}
                />
                <Label
                  htmlFor="billing-toggle"
                  className={`px-3 py-1.5 text-sm ${billingCycle === "monthly" ? "font-medium text-slate-900" : "text-slate-600"}`}
                >
                  Monthly
                </Label>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PricingCard
            title="Essentials"
            description="For small operators"
            price={billingCycle === "annual" ? "£389" : "£429"}
            icon={<Ship className="h-8 w-8 text-slate-700" />}
            features={[
              "Document Hub (basic)",
              "Port Preparation (limited)",
              "Up to 3 user accounts",
              "50GB document storage",
              "Email support (business hours)",
            ]}
            delay={0}
          />

          <PricingCard
            title="Professional"
            description="For mid-sized operators"
            price={billingCycle === "annual" ? "£309" : "£349"}
            icon={<Shield className="h-8 w-8 text-slate-700" />}
            features={[
              "Document Hub (full)",
              "Port Preparation (full)",
              "Document Sharing",
              "Communication Hub",
              "Unlimited user accounts",
              "200GB document storage",
              "Priority email and phone support",
              "Quarterly compliance review",
            ]}
            popular={true}
            discount="10% volume discount for 10+ vessels"
            delay={0.1}
          />

          <PricingCard
            title="Enterprise"
            description="For large operators"
            price="Custom"
            priceSubtext="Typically £229-£269 per vessel/month"
            icon={<Users className="h-8 w-8 text-slate-700" />}
            features={[
              "Everything in Professional",
              "Full API access",
              "Custom dashboards and reporting",
              "White-labeling options",
              "Dedicated account manager",
              "24/7 priority support",
              "Unlimited document storage",
              "Monthly compliance review",
              "Custom feature development",
            ]}
            buttonText="Contact Sales"
            buttonVariant="outline"
            delay={0.2}
          />
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Need More Information?</h3>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            Our team is ready to help you find the perfect solution for your fleet's compliance needs.
          </p>
          <Button size="lg" variant="outline" className="text-slate-700 border-slate-300 hover:bg-slate-100">
            Download Full Pricing Guide <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}

function PricingCard({
  title,
  description,
  price,
  priceSubtext,
  icon,
  features,
  popular = false,
  discount,
  buttonText = "Start 30-day free trial",
  buttonVariant = "default",
  delay = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="flex flex-col h-full"
    >
      <Card className={`border-2 ${popular ? "border-slate-800" : "border-slate-200"} flex flex-col h-full relative`}>
        {popular && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Badge className="bg-slate-800 text-white hover:bg-slate-700">Most Popular</Badge>
          </div>
        )}

        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-slate-900">{title}</CardTitle>
              <CardDescription className="mt-1 text-slate-500">{description}</CardDescription>
            </div>
            {icon}
          </div>
          <div className="mt-4">
            <span className="text-4xl font-bold text-slate-900">{price}</span>
            <span className="text-slate-600 ml-2">per vessel/month</span>
            {priceSubtext && <p className="text-sm text-slate-500 mt-1">{priceSubtext}</p>}
            {discount && <p className="text-sm text-slate-800 font-medium mt-1">{discount}</p>}
          </div>
        </CardHeader>

        <CardContent className="flex-grow">
          <p className="text-sm text-slate-500 mb-4">
            {title === "Essentials" && "Perfect for small ship management companies or vessel owners with 1-5 vessels."}
            {title === "Professional" &&
              "Ideal for growing fleet operators with 6-20 vessels who need advanced features."}
            {title === "Enterprise" &&
              "For large shipping companies with 20+ vessels who need a fully integrated solution."}
          </p>
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                <span className="text-slate-600">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>

        <CardFooter>
          <Button
            className="w-full"
            variant={buttonVariant}
            {...(popular
              ? { className: "w-full bg-slate-800 hover:bg-slate-700 text-white" }
              : {
                  className: `w-full ${buttonVariant === "outline" ? "text-slate-700 border-slate-300 hover:bg-slate-100" : "bg-slate-800 hover:bg-slate-700 text-white"}`,
                })}
          >
            {buttonText}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
