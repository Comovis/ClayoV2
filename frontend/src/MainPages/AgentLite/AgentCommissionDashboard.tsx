"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  ArrowUpRight,
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  ExternalLink,
  FileText,
  HelpCircle,
  Info,
  Mail,
  MoreHorizontal,
  Percent,
  PieChart,
  Plus,
  RefreshCw,
  Search,
  Ship,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function CommissionDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [dateRange, setDateRange] = useState("this-month")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="bg-white border-b p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Ship className="h-8 w-8 text-blue-600 mr-2" />
            <h1 className="text-xl font-bold">
              Comovis <span className="text-blue-600">Agent</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <HelpCircle className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Partner Support</span>
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-blue-100 text-blue-600">CL</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Commission Dashboard</h1>
            <p className="text-gray-500">Track your referrals and commission earnings</p>
          </div>
          <div className="flex gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="last-quarter">Last Quarter</SelectItem>
                <SelectItem value="year-to-date">Year to Date</SelectItem>
                <SelectItem value="all-time">All Time</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Commission Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <CommissionStatCard
            title="Total Earnings"
            value="$3,250.00"
            change="+$750.00"
            changeType="positive"
            icon={DollarSign}
            tooltip="Total commission earned from all referrals"
          />

          <CommissionStatCard
            title="Pending Earnings"
            value="$1,200.00"
            change="+$450.00"
            changeType="positive"
            icon={Clock}
            tooltip="Commission that will be paid in the next cycle"
          />

          <CommissionStatCard
            title="Conversion Rate"
            value="42%"
            change="+8%"
            changeType="positive"
            icon={Percent}
            tooltip="Percentage of referrals that convert to paid subscriptions"
          />

          <CommissionStatCard
            title="Active Referrals"
            value="5"
            change="+2"
            changeType="positive"
            icon={Users}
            tooltip="Number of clients currently on paid subscriptions"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-4 w-full md:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="referrals">Referrals</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle>Commission Earnings</CardTitle>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                    <CardDescription>Monthly commission earnings from referrals</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-md border border-dashed">
                      <div className="text-center">
                        <PieChart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Commission earnings chart would appear here</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="mb-6">
                  <CardHeader className="pb-2">
                    <CardTitle>Commission Tiers</CardTitle>
                    <CardDescription>Your current partner status and benefits</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center">
                            <Badge className="bg-blue-100 text-blue-800 mr-2">Current</Badge>
                            <span className="font-medium">Silver Partner</span>
                          </div>
                          <span className="text-sm font-medium">20%</span>
                        </div>
                        <Progress value={60} className="h-2" />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>3 active referrals</span>
                          <span>5 for Gold</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-gray-500">Gold Partner</span>
                          <span className="text-sm font-medium text-gray-500">25%</span>
                        </div>
                        <Progress value={0} className="h-2 bg-gray-100" />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>5-9 active referrals</span>
                          <span>+5% commission</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-gray-500">Platinum Partner</span>
                          <span className="text-sm font-medium text-gray-500">30%</span>
                        </div>
                        <Progress value={0} className="h-2 bg-gray-100" />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>10+ active referrals</span>
                          <span>+10% commission</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
                      <div className="flex items-start">
                        <Info className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                        <div className="text-sm text-blue-700">
                          <p>You need 2 more active referrals to reach Gold Partner status and earn 25% commission.</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Next Payment</CardTitle>
                    <CardDescription>Estimated for November 15, 2023</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="p-4 border rounded-md bg-gray-50">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-medium text-gray-500">Amount</span>
                        <span className="text-2xl font-bold">$1,200.00</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Payment Method</span>
                          <span>Bank Transfer</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Status</span>
                          <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                        </div>
                      </div>
                      <Button className="w-full mt-4" variant="outline">
                        <Wallet className="h-4 w-4 mr-2" />
                        View Payment Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>Recent Referral Activity</CardTitle>
                  <Button variant="link" size="sm">
                    View All Referrals
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  <ReferralActivityItem
                    companyName="Mediterranean Shipping"
                    vessels={2}
                    date="Oct 25, 2023"
                    status="trial"
                    commission="$0.00"
                    potentialCommission="$1,800.00"
                  />

                  <ReferralActivityItem
                    companyName="Global Carriers Ltd"
                    vessels={2}
                    date="Oct 10, 2023"
                    status="subscribed"
                    commission="$1,200.00"
                    potentialCommission="$0.00"
                  />

                  <ReferralActivityItem
                    companyName="Nordic Tankers"
                    vessels={3}
                    date="Sep 15, 2023"
                    status="subscribed"
                    commission="$2,050.00"
                    potentialCommission="$0.00"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Referrals Tab */}
          <TabsContent value="referrals" className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>Your Referrals</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search referrals..."
                        className="pl-8 w-[200px]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      New Referral
                    </Button>
                  </div>
                </div>
                <CardDescription>Track status and commission for all your referrals</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-y">
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Company</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Vessels</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Referral Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Plan</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">Commission</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <ReferralTableRow
                        company="Mediterranean Shipping"
                        vessels={2}
                        date="Oct 25, 2023"
                        status="trial"
                        plan="--"
                        commission="$0.00"
                        potentialCommission="$1,800.00"
                      />

                      <ReferralTableRow
                        company="Global Carriers Ltd"
                        vessels={2}
                        date="Oct 10, 2023"
                        status="subscribed"
                        plan="Professional"
                        commission="$1,200.00"
                        potentialCommission="$0.00"
                      />

                      <ReferralTableRow
                        company="Nordic Tankers"
                        vessels={3}
                        date="Sep 15, 2023"
                        status="subscribed"
                        plan="Enterprise"
                        commission="$2,050.00"
                        potentialCommission="$0.00"
                      />

                      <ReferralTableRow
                        company="Atlantic Shipping"
                        vessels={1}
                        date="Sep 5, 2023"
                        status="invited"
                        plan="--"
                        commission="$0.00"
                        potentialCommission="$900.00"
                      />

                      <ReferralTableRow
                        company="Pacific Maritime"
                        vessels={2}
                        date="Aug 20, 2023"
                        status="expired"
                        plan="--"
                        commission="$0.00"
                        potentialCommission="$0.00"
                      />
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between py-4 border-t">
                <div className="text-sm text-gray-500">Showing 5 of 8 referrals</div>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Referral Performance</CardTitle>
                <CardDescription>Track conversion rates and commission by referral</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-md border border-dashed">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Referral performance chart would appear here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>Payment History</CardTitle>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export for Accounting
                  </Button>
                </div>
                <CardDescription>Record of all commission payments</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-y">
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Payment Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Payment ID</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Period</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Method</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">Amount</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <PaymentHistoryRow
                        date="Oct 15, 2023"
                        id="PAY-2023-10-001"
                        period="September 2023"
                        method="Bank Transfer"
                        status="completed"
                        amount="$950.00"
                      />

                      <PaymentHistoryRow
                        date="Sep 15, 2023"
                        id="PAY-2023-09-001"
                        period="August 2023"
                        method="Bank Transfer"
                        status="completed"
                        amount="$750.00"
                      />

                      <PaymentHistoryRow
                        date="Aug 15, 2023"
                        id="PAY-2023-08-001"
                        period="July 2023"
                        method="Bank Transfer"
                        status="completed"
                        amount="$550.00"
                      />

                      <PaymentHistoryRow
                        date="Nov 15, 2023"
                        id="PAY-2023-11-001"
                        period="October 2023"
                        method="Bank Transfer"
                        status="pending"
                        amount="$1,200.00"
                      />
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Payment Settings</CardTitle>
                <CardDescription>Manage your commission payment preferences</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Payment Method</h3>
                    <div className="p-4 border rounded-md bg-gray-50">
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="font-medium">Bank Transfer (ACH)</p>
                          <p className="text-sm text-gray-500">Account ending in 4567</p>
                        </div>
                        <Button variant="ghost" size="sm" className="ml-auto">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Payment Schedule</h3>
                    <div className="p-4 border rounded-md bg-gray-50">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="font-medium">Monthly</p>
                          <p className="text-sm text-gray-500">Payments processed on the 15th of each month</p>
                        </div>
                        <Button variant="ghost" size="sm" className="ml-auto">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Tax Information</h3>
                    <div className="p-4 border rounded-md bg-gray-50">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="font-medium">W-9 Form</p>
                          <p className="text-sm text-gray-500">Last updated: August 10, 2023</p>
                        </div>
                        <Button variant="ghost" size="sm" className="ml-auto">
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Marketing Materials</CardTitle>
                  <CardDescription>Resources to help you promote Comovis</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <MarketingResourceItem
                      title="Email Templates"
                      description="Customizable email templates to introduce Comovis to vessel owners"
                      icon={Mail}
                    />

                    <MarketingResourceItem
                      title="Product Brochures"
                      description="PDF brochures highlighting Comovis features and benefits"
                      icon={FileText}
                    />

                    <MarketingResourceItem
                      title="ROI Calculator"
                      description="Tool to demonstrate cost savings from using Comovis"
                      icon={DollarSign}
                    />

                    <MarketingResourceItem
                      title="Case Studies"
                      description="Success stories from vessel owners using Comovis"
                      icon={Users}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Referral Tools</CardTitle>
                  <CardDescription>Tools to help you manage and track referrals</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <div className="p-4 border rounded-md">
                      <h3 className="font-medium mb-2">Your Referral Link</h3>
                      <div className="flex">
                        <Input readOnly value="https://comovis.com/r/captainlogistics" className="rounded-r-none" />
                        <Button variant="outline" className="rounded-l-none">
                          Copy
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Share this link with vessel owners to track your referrals automatically
                      </p>
                    </div>

                    <div className="p-4 border rounded-md">
                      <h3 className="font-medium mb-2">Custom Invitation</h3>
                      <p className="text-sm text-gray-500 mb-3">
                        Create personalized invitations for specific vessel owners
                      </p>
                      <Button className="w-full">Create Invitation</Button>
                    </div>

                    <div className="p-4 border rounded-md">
                      <h3 className="font-medium mb-2">Commission Calculator</h3>
                      <p className="text-sm text-gray-500 mb-3">
                        Estimate potential commission based on fleet size and subscription plan
                      </p>
                      <Button variant="outline" className="w-full">
                        Open Calculator
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Partner Training</CardTitle>
                <CardDescription>Resources to help you become a Comovis expert</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-md">
                    <div className="h-40 bg-gray-100 rounded-md mb-3 flex items-center justify-center">
                      <FileText className="h-12 w-12 text-gray-300" />
                    </div>
                    <h3 className="font-medium">Product Overview</h3>
                    <p className="text-sm text-gray-500 mt-1">Learn about Comovis features and benefits</p>
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      <ExternalLink className="h-3.5 w-3.5 mr-1" />
                      Watch Video
                    </Button>
                  </div>

                  <div className="p-4 border rounded-md">
                    <div className="h-40 bg-gray-100 rounded-md mb-3 flex items-center justify-center">
                      <FileText className="h-12 w-12 text-gray-300" />
                    </div>
                    <h3 className="font-medium">Sales Techniques</h3>
                    <p className="text-sm text-gray-500 mt-1">Effective ways to present Comovis to clients</p>
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      <ExternalLink className="h-3.5 w-3.5 mr-1" />
                      Watch Video
                    </Button>
                  </div>

                  <div className="p-4 border rounded-md">
                    <div className="h-40 bg-gray-100 rounded-md mb-3 flex items-center justify-center">
                      <FileText className="h-12 w-12 text-gray-300" />
                    </div>
                    <h3 className="font-medium">Partner Program Guide</h3>
                    <p className="text-sm text-gray-500 mt-1">Detailed overview of the partner program</p>
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      <Download className="h-3.5 w-3.5 mr-1" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

function CommissionStatCard({ title, value, change, changeType, icon: Icon, tooltip }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="relative group">
            <Info className="h-4 w-4 text-gray-400" />
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
              {tooltip}
            </div>
          </div>
        </div>
        <div className="flex items-baseline">
          <span className="text-3xl font-bold">{value}</span>
          {change && (
            <span className={`text-sm ml-2 ${changeType === "positive" ? "text-green-600" : "text-red-600"}`}>
              {changeType === "positive" ? (
                <ChevronUp className="h-3 w-3 inline" />
              ) : (
                <ChevronDown className="h-3 w-3 inline" />
              )}{" "}
              {change}
            </span>
          )}
        </div>
        <div className="mt-4 flex justify-between text-sm">
          <span className="text-gray-500">This {dateRange}</span>
          <Icon className="h-5 w-5 text-blue-500" />
        </div>
      </CardContent>
    </Card>
  )
}

function ReferralActivityItem({ companyName, vessels, date, status, commission, potentialCommission }) {
  const statusConfig = {
    invited: {
      badge: "Invited",
      badgeClass: "bg-blue-100 text-blue-800",
    },
    trial: {
      badge: "Trial",
      badgeClass: "bg-purple-100 text-purple-800",
    },
    subscribed: {
      badge: "Subscribed",
      badgeClass: "bg-green-100 text-green-800",
    },
    expired: {
      badge: "Expired",
      badgeClass: "bg-gray-100 text-gray-800",
    },
  }

  const config = statusConfig[status]

  return (
    <div className="p-4 hover:bg-gray-50">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium">{companyName}</h4>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <Ship className="h-3.5 w-3.5 mr-1" />
            <span>{vessels} vessels</span>
            <span className="mx-1">•</span>
            <Calendar className="h-3.5 w-3.5 mr-1" />
            <span>Referred: {date}</span>
          </div>
        </div>
        <Badge className={config.badgeClass}>{config.badge}</Badge>
      </div>
      <div className="flex justify-between items-center mt-3">
        <div>
          {status === "subscribed" ? (
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 text-green-500 mr-1" />
              <span className="font-medium text-green-700">{commission} earned</span>
            </div>
          ) : (
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 text-blue-500 mr-1" />
              <span className="font-medium text-blue-700">{potentialCommission} potential commission</span>
            </div>
          )}
        </div>
        <Button size="sm" variant="outline">
          <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
          {status === "subscribed" ? "View Details" : "Send Reminder"}
        </Button>
      </div>
    </div>
  )
}

function ReferralTableRow({ company, vessels, date, status, plan, commission, potentialCommission }) {
  const statusConfig = {
    invited: {
      badge: "Invited",
      badgeClass: "bg-blue-100 text-blue-800",
    },
    trial: {
      badge: "Trial",
      badgeClass: "bg-purple-100 text-purple-800",
    },
    subscribed: {
      badge: "Subscribed",
      badgeClass: "bg-green-100 text-green-800",
    },
    expired: {
      badge: "Expired",
      badgeClass: "bg-gray-100 text-gray-800",
    },
  }

  const config = statusConfig[status]

  return (
    <tr className="hover:bg-gray-50">
      <td className="py-3 px-4">{company}</td>
      <td className="py-3 px-4">{vessels}</td>
      <td className="py-3 px-4">{date}</td>
      <td className="py-3 px-4">
        <Badge className={config.badgeClass}>{config.badge}</Badge>
      </td>
      <td className="py-3 px-4">{plan}</td>
      <td className="py-3 px-4 text-right">
        {status === "subscribed" ? (
          <span className="font-medium text-green-700">{commission}</span>
        ) : potentialCommission !== "$0.00" ? (
          <span className="text-sm text-blue-700">Potential: {potentialCommission}</span>
        ) : (
          <span className="text-sm text-gray-500">--</span>
        )}
      </td>
      <td className="py-3 px-4 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>View Details</DropdownMenuItem>
            {status !== "subscribed" && <DropdownMenuItem>Send Reminder</DropdownMenuItem>}
            {status === "invited" && <DropdownMenuItem>Edit Invitation</DropdownMenuItem>}
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Commission Details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  )
}

function PaymentHistoryRow({ date, id, period, method, status, amount }) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="py-3 px-4">{date}</td>
      <td className="py-3 px-4">{id}</td>
      <td className="py-3 px-4">{period}</td>
      <td className="py-3 px-4">{method}</td>
      <td className="py-3 px-4">
        <Badge
          className={
            status === "completed"
              ? "bg-green-100 text-green-800"
              : status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-gray-100 text-gray-800"
          }
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </td>
      <td className="py-3 px-4 text-right font-medium">{amount}</td>
      <td className="py-3 px-4 text-right">
        <Button variant="ghost" size="sm">
          <Download className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  )
}

function MarketingResourceItem({ title, description, icon: Icon }) {
  return (
    <div className="p-4 border rounded-md">
      <div className="flex items-start">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
          <Icon className="h-5 w-5 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        <Button size="sm">
          <Download className="h-3.5 w-3.5 mr-1" />
          Download
        </Button>
      </div>
    </div>
  )
}

// Helper variable for date range
const dateRange = "month"
