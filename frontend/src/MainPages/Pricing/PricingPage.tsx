"use client"

import { useState } from "react"
import { Check, HelpCircle, Ship, Shield, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState("annual")

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Simple, transparent pricing</h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the plan that's right for your fleet. All plans include a 30-day free trial so you can experience the
            full power of Comovis.
          </p>

          <div className="mt-8 flex justify-center">
            <div className="relative flex rounded-full bg-gray-100 p-1">
              <div className="flex items-center space-x-2">
                <Label
                  htmlFor="billing-toggle"
                  className={`px-3 py-1.5 text-sm ${billingCycle === "annual" ? "font-medium text-blue-600" : "text-gray-600"}`}
                >
                  Annual{" "}
                  <Badge variant="outline" className="ml-1 bg-blue-50 text-blue-700 border-blue-200">
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
                  className={`px-3 py-1.5 text-sm ${billingCycle === "monthly" ? "font-medium text-blue-600" : "text-gray-600"}`}
                >
                  Monthly
                </Label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Essentials Plan */}
          <Card className="border-2 border-gray-200 flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold">Essentials</CardTitle>
                  <CardDescription className="mt-1">For small operators</CardDescription>
                </div>
                <Ship className="h-8 w-8 text-blue-500" />
              </div>
              <div className="mt-4">
                <span className="text-4xl font-bold">£389</span>
                <span className="text-gray-600 ml-2">per vessel/month</span>
                <p className="text-sm text-gray-500 mt-1">
                  Billed {billingCycle === "annual" ? "annually" : "monthly"}
                </p>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-gray-500 mb-4">
                Perfect for small ship management companies or vessel owners with 1-5 vessels.
              </p>
              <ul className="space-y-3">
                <PricingFeature>Document Hub (basic)</PricingFeature>
                <PricingFeature>Port Preparation (limited)</PricingFeature>
                <PricingFeature>Up to 3 user accounts</PricingFeature>
                <PricingFeature>50GB document storage</PricingFeature>
                <PricingFeature>Email support (business hours)</PricingFeature>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Start 30-day free trial</Button>
            </CardFooter>
          </Card>

          {/* Professional Plan */}
          <Card className="border-2 border-blue-600 flex flex-col relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Badge className="bg-blue-600 text-white hover:bg-blue-700">Most Popular</Badge>
            </div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold">Professional</CardTitle>
                  <CardDescription className="mt-1">For mid-sized operators</CardDescription>
                </div>
                <Shield className="h-8 w-8 text-blue-500" />
              </div>
              <div className="mt-4">
                <span className="text-4xl font-bold">£309</span>
                <span className="text-gray-600 ml-2">per vessel/month</span>
                <p className="text-sm text-gray-500 mt-1">
                  Billed {billingCycle === "annual" ? "annually" : "monthly"}
                </p>
                <p className="text-sm text-blue-600 font-medium mt-1">10% volume discount for 10+ vessels</p>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-gray-500 mb-4">
                Ideal for growing fleet operators with 6-20 vessels who need advanced features.
              </p>
              <ul className="space-y-3">
                <PricingFeature>Document Hub (full)</PricingFeature>
                <PricingFeature>Port Preparation (full)</PricingFeature>
                <PricingFeature>Document Sharing</PricingFeature>
                <PricingFeature>Communication Hub</PricingFeature>
                <PricingFeature>Unlimited user accounts</PricingFeature>
                <PricingFeature>200GB document storage</PricingFeature>
                <PricingFeature>Priority email and phone support</PricingFeature>
                <PricingFeature>Quarterly compliance review</PricingFeature>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Start 30-day free trial</Button>
            </CardFooter>
          </Card>

          {/* Enterprise Plan */}
          <Card className="border-2 border-gray-200 flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold">Enterprise</CardTitle>
                  <CardDescription className="mt-1">For large operators</CardDescription>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
              <div className="mt-4">
                <span className="text-4xl font-bold">Custom</span>
                <p className="text-sm text-gray-500 mt-1">Typically £229-£269 per vessel/month</p>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-gray-500 mb-4">
                For large shipping companies with 20+ vessels who need a fully integrated solution.
              </p>
              <ul className="space-y-3">
                <PricingFeature>Everything in Professional</PricingFeature>
                <PricingFeature>Full API access</PricingFeature>
                <PricingFeature>Custom dashboards and reporting</PricingFeature>
                <PricingFeature>White-labeling options</PricingFeature>
                <PricingFeature>Dedicated account manager</PricingFeature>
                <PricingFeature>24/7 priority support</PricingFeature>
                <PricingFeature>Unlimited document storage</PricingFeature>
                <PricingFeature>Monthly compliance review</PricingFeature>
                <PricingFeature>Custom feature development</PricingFeature>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline">
                Contact sales
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Add-on Modules */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Add-on Modules</h2>
            <p className="mt-4 text-lg text-gray-600">Enhance your plan with specialized features</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <AddOnCard
              title="Deficiency Prevention Intelligence"
              price="£77"
              icon={<Shield className="h-6 w-6 text-purple-500" />}
              description="Advanced AI analysis to predict and prevent deficiencies"
              features={[
                "Advanced AI analysis of documents",
                "Historical deficiency patterns",
                "Predictive compliance risk scoring",
                "Custom inspection checklists",
              ]}
            />

            <AddOnCard
              title="Port Intelligence Premium"
              price="£116"
              icon={<MapPin className="h-6 w-6 text-green-500" />}
              description="Stay ahead with real-time port requirement updates"
              features={[
                "Real-time port requirement updates",
                "PSC inspection focus alerts",
                "Local regulation changes",
                "Port congestion data",
              ]}
            />

            <AddOnCard
              title="Crew Certification Management"
              price="£62"
              icon={<Users className="h-6 w-6 text-blue-500" />}
              description="Comprehensive crew document and certification tracking"
              features={[
                "Crew document tracking",
                "Certificate validity monitoring",
                "Rest hours compliance",
                "Training requirement tracking",
              ]}
            />
          </div>
        </div>
      </div>

      {/* Feature Comparison */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Compare Plans</h2>
          <p className="mt-4 text-lg text-gray-600">See which plan is right for your fleet</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="py-4 px-6 text-left font-medium text-gray-500">Feature</th>
                <th className="py-4 px-6 text-center font-medium text-gray-500">Essentials</th>
                <th className="py-4 px-6 text-center font-medium text-gray-500">Professional</th>
                <th className="py-4 px-6 text-center font-medium text-gray-500">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              <ComparisonRow
                feature="Document Hub"
                essentials="Basic"
                professional="Full"
                enterprise="Full + Custom"
                tooltip="Central repository for all vessel certificates and documents"
              />
              <ComparisonRow
                feature="Port Preparation"
                essentials="Limited"
                professional="Full"
                enterprise="Full + Custom"
                tooltip="Tools to prepare for port calls and inspections"
              />
              <ComparisonRow
                feature="Document Sharing"
                essentials="❌"
                professional="✅"
                enterprise="✅ + Enhanced"
                tooltip="Securely share documents with port authorities and stakeholders"
              />
              <ComparisonRow
                feature="Communication Hub"
                essentials="❌"
                professional="✅"
                enterprise="✅ + Enhanced"
                tooltip="Centralized communication with agents and authorities"
              />
              <ComparisonRow
                feature="Deficiency Prevention"
                essentials="❌"
                professional="Basic"
                enterprise="Advanced"
                tooltip="AI-powered tools to identify and prevent potential deficiencies"
              />
              <ComparisonRow
                feature="User accounts"
                essentials="3"
                professional="Unlimited"
                enterprise="Unlimited"
                tooltip="Number of user accounts included in the plan"
              />
              <ComparisonRow
                feature="Storage"
                essentials="50GB"
                professional="200GB"
                enterprise="Unlimited"
                tooltip="Document storage capacity"
              />
              <ComparisonRow
                feature="Support"
                essentials="Email"
                professional="Priority"
                enterprise="24/7 Dedicated"
                tooltip="Level of customer support provided"
              />
              <ComparisonRow
                feature="API Access"
                essentials="❌"
                professional="Limited"
                enterprise="Full"
                tooltip="Access to integrate with your existing systems"
              />
              <ComparisonRow
                feature="Custom Development"
                essentials="❌"
                professional="❌"
                enterprise="✅"
                tooltip="Custom feature development for your specific needs"
              />
            </tbody>
          </table>
        </div>
      </div>

      {/* Implementation Options */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Implementation & Onboarding</h2>
            <p className="mt-4 text-lg text-gray-600">Get started quickly with our implementation options</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Standard Implementation</CardTitle>
                <div className="mt-2">
                  <span className="text-2xl font-bold">Included</span>
                  <p className="text-sm text-gray-500 mt-1">with annual subscription</p>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <PricingFeature>System setup</PricingFeature>
                  <PricingFeature>Data migration assistance (limited)</PricingFeature>
                  <PricingFeature>Virtual training sessions (2)</PricingFeature>
                  <PricingFeature>Implementation timeline: 2-4 weeks</PricingFeature>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Learn More
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-2 border-blue-600">
              <CardHeader>
                <CardTitle>Premium Implementation</CardTitle>
                <div className="mt-2">
                  <span className="text-2xl font-bold">£3,900</span>
                  <p className="text-sm text-gray-500 mt-1">one-time fee</p>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <PricingFeature>Dedicated implementation manager</PricingFeature>
                  <PricingFeature>Full data migration</PricingFeature>
                  <PricingFeature>Custom configuration</PricingFeature>
                  <PricingFeature>Extended training (4 sessions)</PricingFeature>
                  <PricingFeature>Implementation timeline: 1-2 weeks</PricingFeature>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Select</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Enterprise Implementation</CardTitle>
                <div className="mt-2">
                  <span className="text-2xl font-bold">Custom</span>
                  <p className="text-sm text-gray-500 mt-1">tailored to your needs</p>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <PricingFeature>On-site implementation team</PricingFeature>
                  <PricingFeature>Full system integration</PricingFeature>
                  <PricingFeature>Custom workflows</PricingFeature>
                  <PricingFeature>Comprehensive training program</PricingFeature>
                  <PricingFeature>Implementation timeline: Customized</PricingFeature>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Contact Sales
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {/* ROI Calculator */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Return on Investment</h2>
            <p className="mt-4 text-lg text-gray-600">See how quickly Comovis pays for itself</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>ROI Example: Mid-sized operator with 10 vessels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-lg mb-2">Annual Investment</h3>
                  <p className="text-gray-600">
                    £309 × 10 vessels × 12 months = <span className="font-bold">£37,080</span>
                  </p>
                  <p className="text-gray-600">
                    With 10% volume discount: <span className="font-bold">£33,372</span> annually
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-lg mb-2">Estimated Annual Savings</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>Reduced PSC deficiencies:</span>
                      <span className="font-medium">£39,000+</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Time saved on document management:</span>
                      <span className="font-medium">£31,000+</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Reduced port delays due to documentation issues:</span>
                      <span className="font-medium">£78,000+</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Improved operational efficiency:</span>
                      <span className="font-medium">£23,000+</span>
                    </li>
                    <li className="flex justify-between border-t pt-2 mt-2">
                      <span className="font-bold">Total Estimated Savings:</span>
                      <span className="font-bold">£171,000+</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-lg mb-2 text-blue-800">Potential ROI</h3>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div className="bg-blue-600 h-4 rounded-full" style={{ width: "80%" }}></div>
                    </div>
                    <span className="ml-4 font-bold text-blue-800">4-5x</span>
                  </div>
                  <p className="text-sm text-blue-700 mt-2">Return on investment based on estimated savings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
            <p className="mt-4 text-lg text-gray-600">Have questions? We've got answers.</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How does the 30-day free trial work?</AccordionTrigger>
                <AccordionContent>
                  Our 30-day free trial gives you full access to the Professional plan features. You can set up your
                  vessels, upload documents, and explore all the features without any commitment. No credit card is
                  required to start your trial.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Can I change plans later?</AccordionTrigger>
                <AccordionContent>
                  Yes, you can upgrade or downgrade your plan at any time. When upgrading, the new features will be
                  immediately available. When downgrading, the changes will take effect at the start of your next
                  billing cycle.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>How does the per-vessel pricing work?</AccordionTrigger>
                <AccordionContent>
                  Our pricing is based on the number of vessels in your fleet. Each vessel is charged at the rate of
                  your selected plan. Volume discounts are available for the Professional plan when you have 10 or more
                  vessels, and custom pricing is available for Enterprise customers.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>What kind of support is included?</AccordionTrigger>
                <AccordionContent>
                  The Essentials plan includes email support during business hours. The Professional plan adds priority
                  email and phone support with faster response times. Enterprise customers receive 24/7 dedicated
                  support with a 2-hour response time guarantee and a dedicated account manager.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>Is there a minimum contract period?</AccordionTrigger>
                <AccordionContent>
                  For monthly billing, there is no minimum contract period. For annual billing, the minimum contract
                  period is 12 months. We offer a 10% discount for annual billing compared to monthly billing.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger>How secure is my data?</AccordionTrigger>
                <AccordionContent>
                  Comovis uses enterprise-grade security measures including encryption at rest and in transit, regular
                  security audits, and compliance with maritime industry standards. Your data is stored in ISO 27001
                  certified data centers with regular backups.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-blue-600 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to transform your maritime compliance?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of maritime companies already using Comovis to streamline their compliance operations.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              Start your free trial
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-blue-700">
              Schedule a demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function PricingFeature({ children }) {
  return (
    <li className="flex items-center">
      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
      <span className="text-gray-600">{children}</span>
    </li>
  )
}

function AddOnCard({ title, price, icon, description, features }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {icon}
            <CardTitle className="ml-2">{title}</CardTitle>
          </div>
        </div>
        <div className="mt-2">
          <span className="text-2xl font-bold">{price}</span>
          <span className="text-gray-600 ml-1">per vessel/month</span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">{description}</p>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Add to your plan
        </Button>
      </CardFooter>
    </Card>
  )
}

function ComparisonRow({ feature, essentials, professional, enterprise, tooltip }) {
  return (
    <TooltipProvider>
      <tr className="border-b">
        <td className="py-4 px-6 text-left">
          <div className="flex items-center">
            <span>{feature}</span>
            {tooltip && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-gray-400 ml-1 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </td>
        <td className="py-4 px-6 text-center">{essentials}</td>
        <td className="py-4 px-6 text-center font-medium">{professional}</td>
        <td className="py-4 px-6 text-center">{enterprise}</td>
      </tr>
    </TooltipProvider>
  )
}
