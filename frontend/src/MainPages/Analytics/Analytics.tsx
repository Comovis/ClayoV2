"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, TrendingUp, TrendingDown, MessageSquare, Clock, Bot, Target, Download, Filter } from "lucide-react"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d")
  const [metric, setMetric] = useState("conversations")

  const stats = {
    totalConversations: 1247,
    avgResponseTime: "2m 30s",
    resolutionRate: 89,
    customerSatisfaction: 4.8,
    aiAutomation: 78,
    leadConversion: 12.5,
    revenue: 45600,
    activeUsers: 234,
  }

  const trends = {
    conversations: { value: "+12%", positive: true },
    responseTime: { value: "-15%", positive: true },
    satisfaction: { value: "+8%", positive: true },
    automation: { value: "+23%", positive: true },
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header with title and description */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-gray-500">Track performance and optimize your customer service</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Key Performance Metrics</CardTitle>
          <CardDescription>Overview of your customer service performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Total Conversations</span>
                <MessageSquare className="h-4 w-4 text-gray-400" />
              </div>
              <div className="text-2xl font-bold mb-1">{stats.totalConversations.toLocaleString()}</div>
              <div className="flex items-center text-sm">
                <span
                  className={`flex items-center ${trends.conversations.positive ? "text-green-600" : "text-red-600"}`}
                >
                  {trends.conversations.positive ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {trends.conversations.value}
                </span>
                <span className="text-gray-500 ml-1">from last period</span>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Avg Response Time</span>
                <Clock className="h-4 w-4 text-gray-400" />
              </div>
              <div className="text-2xl font-bold mb-1">{stats.avgResponseTime}</div>
              <div className="flex items-center text-sm">
                <span
                  className={`flex items-center ${trends.responseTime.positive ? "text-green-600" : "text-red-600"}`}
                >
                  {trends.responseTime.positive ? (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  )}
                  {trends.responseTime.value}
                </span>
                <span className="text-gray-500 ml-1">improvement</span>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Customer Satisfaction</span>
                <Target className="h-4 w-4 text-gray-400" />
              </div>
              <div className="text-2xl font-bold mb-1">{stats.customerSatisfaction}/5.0</div>
              <div className="flex items-center text-sm">
                <span
                  className={`flex items-center ${trends.satisfaction.positive ? "text-green-600" : "text-red-600"}`}
                >
                  {trends.satisfaction.positive ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {trends.satisfaction.value}
                </span>
                <span className="text-gray-500 ml-1">from last period</span>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">AI Automation Rate</span>
                <Bot className="h-4 w-4 text-gray-400" />
              </div>
              <div className="text-2xl font-bold mb-1">{stats.aiAutomation}%</div>
              <div className="flex items-center text-sm">
                <span className={`flex items-center ${trends.automation.positive ? "text-green-600" : "text-red-600"}`}>
                  {trends.automation.positive ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {trends.automation.value}
                </span>
                <span className="text-gray-500 ml-1">improvement</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analytics */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Detailed Analytics</CardTitle>
          <CardDescription>In-depth analysis of your customer service performance</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="conversations">Conversations</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="ai">AI Insights</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Conversation Volume Chart */}
                <div className="border rounded-lg p-4">
                  <div className="mb-4">
                    <h3 className="font-medium">Conversation Volume</h3>
                    <p className="text-sm text-gray-500">Daily conversation trends over time</p>
                  </div>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Chart visualization would go here</p>
                      <p className="text-sm text-gray-500">Integration with charting library needed</p>
                    </div>
                  </div>
                </div>

                {/* Response Time Trends */}
                <div className="border rounded-lg p-4">
                  <div className="mb-4">
                    <h3 className="font-medium">Response Time Trends</h3>
                    <p className="text-sm text-gray-500">Average response times by hour</p>
                  </div>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <Clock className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Response time chart would go here</p>
                      <p className="text-sm text-gray-500">Shows hourly response time patterns</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Channel Performance */}
              <div className="border rounded-lg p-4">
                <div className="mb-4">
                  <h3 className="font-medium">Channel Performance</h3>
                  <p className="text-sm text-gray-500">Performance metrics across different communication channels</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <h4 className="font-medium">Email</h4>
                    <p className="text-2xl font-bold text-blue-600">456</p>
                    <p className="text-sm text-gray-600">conversations</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <h4 className="font-medium">Chat</h4>
                    <p className="text-2xl font-bold text-green-600">789</p>
                    <p className="text-sm text-gray-600">conversations</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <h4 className="font-medium">Phone</h4>
                    <p className="text-2xl font-bold text-purple-600">123</p>
                    <p className="text-sm text-gray-600">conversations</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <h4 className="font-medium">Social</h4>
                    <p className="text-2xl font-bold text-orange-600">67</p>
                    <p className="text-sm text-gray-600">conversations</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="conversations" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <div className="mb-4">
                    <h3 className="font-medium">Conversation Status Distribution</h3>
                    <p className="text-sm text-gray-500">Current status of all conversations</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Active</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: "45%" }}></div>
                        </div>
                        <span className="text-sm font-medium">45%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Resolved</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: "35%" }}></div>
                        </div>
                        <span className="text-sm font-medium">35%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Pending</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "15%" }}></div>
                        </div>
                        <span className="text-sm font-medium">15%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Escalated</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: "5%" }}></div>
                        </div>
                        <span className="text-sm font-medium">5%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="mb-4">
                    <h3 className="font-medium">Top Issues</h3>
                    <p className="text-sm text-gray-500">Most common customer issues this period</p>
                  </div>
                  <div className="space-y-3">
                    {[
                      { issue: "Billing Questions", count: 156, trend: "+12%" },
                      { issue: "Technical Support", count: 134, trend: "+8%" },
                      { issue: "Account Access", count: 98, trend: "-5%" },
                      { issue: "Feature Requests", count: 67, trend: "+15%" },
                      { issue: "Bug Reports", count: 45, trend: "-2%" },
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{item.issue}</h4>
                          <p className="text-sm text-gray-600">{item.count} conversations</p>
                        </div>
                        <Badge variant={item.trend.startsWith("+") ? "default" : "secondary"}>{item.trend}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="border rounded-lg p-4">
                  <div className="mb-4">
                    <h3 className="font-medium">Resolution Rate</h3>
                    <p className="text-sm text-gray-500">Percentage of conversations resolved</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">{stats.resolutionRate}%</div>
                    <p className="text-sm text-gray-600">Target: 85%</p>
                    <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${stats.resolutionRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="mb-4">
                    <h3 className="font-medium">First Contact Resolution</h3>
                    <p className="text-sm text-gray-500">Issues resolved in first interaction</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">72%</div>
                    <p className="text-sm text-gray-600">Target: 70%</p>
                    <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "72%" }}></div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="mb-4">
                    <h3 className="font-medium">Agent Utilization</h3>
                    <p className="text-sm text-gray-500">Average agent workload</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-600 mb-2">84%</div>
                    <p className="text-sm text-gray-600">Optimal: 75-85%</p>
                    <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: "84%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ai" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <div className="mb-4">
                    <h3 className="font-medium">AI Performance Metrics</h3>
                    <p className="text-sm text-gray-500">How well your AI assistant is performing</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Automation Rate</span>
                      <span className="font-bold">{stats.aiAutomation}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Accuracy Score</span>
                      <span className="font-bold">94%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Confidence Level</span>
                      <span className="font-bold">87%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Escalation Rate</span>
                      <span className="font-bold">22%</span>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="mb-4">
                    <h3 className="font-medium">AI Learning Progress</h3>
                    <p className="text-sm text-gray-500">Knowledge base growth and improvements</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Knowledge Articles</span>
                        <span>245/300</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: "82%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Training Conversations</span>
                        <span>1,247/1,500</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "83%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Model Accuracy</span>
                        <span>94%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: "94%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="revenue" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="border rounded-lg p-4">
                  <div className="mb-4">
                    <h3 className="font-medium">Revenue Impact</h3>
                    <p className="text-sm text-gray-500">Revenue generated from customer service</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">${stats.revenue.toLocaleString()}</div>
                    <p className="text-sm text-gray-600">This month</p>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="mb-4">
                    <h3 className="font-medium">Lead Conversion</h3>
                    <p className="text-sm text-gray-500">Conversations that became sales</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">{stats.leadConversion}%</div>
                    <p className="text-sm text-gray-600">Conversion rate</p>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="mb-4">
                    <h3 className="font-medium">Cost Savings</h3>
                    <p className="text-sm text-gray-500">Savings from AI automation</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-600 mb-2">$12,400</div>
                    <p className="text-sm text-gray-600">This month</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
