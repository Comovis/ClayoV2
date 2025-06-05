"use client"

import { useState } from "react"
import { ChatWidget } from "./ChatWidget"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { ColorPicker } from "./WidgetColourPicker"

export function ChatWidgetDemo() {
  const [settings, setSettings] = useState({
    companyName: "AI Support Pro",
    companyLogo: "",
    accentColor: "#4f46e5",
    welcomeMessage: "👋 Hi there! How can I help you today?",
    agentName: "Support AI",
    agentAvatar: "",
    isEnabled: true,
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Chat Widget Customizer</h1>
        <p className="text-gray-600">Configure and preview your customer-facing chat widget</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Widget Settings</CardTitle>
              <CardDescription>Customize how your chat widget looks and behaves</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="appearance">
                <TabsList className="mb-4 grid w-full grid-cols-3">
                  <TabsTrigger value="appearance">Appearance</TabsTrigger>
                  <TabsTrigger value="behavior">Behavior</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>

                <TabsContent value="appearance" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        value={settings.companyName}
                        onChange={(e) => handleSettingChange("companyName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agentName">Agent Name</Label>
                      <Input
                        id="agentName"
                        value={settings.agentName}
                        onChange={(e) => handleSettingChange("agentName", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="welcomeMessage">Welcome Message</Label>
                    <Input
                      id="welcomeMessage"
                      value={settings.welcomeMessage}
                      onChange={(e) => handleSettingChange("welcomeMessage", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Accent Color</Label>
                    <ColorPicker
                      color={settings.accentColor}
                      onChange={(color) => handleSettingChange("accentColor", color)}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="companyLogo">Company Logo URL</Label>
                      <Input
                        id="companyLogo"
                        placeholder="https://example.com/logo.png"
                        value={settings.companyLogo}
                        onChange={(e) => handleSettingChange("companyLogo", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agentAvatar">Agent Avatar URL</Label>
                      <Input
                        id="agentAvatar"
                        placeholder="https://example.com/avatar.png"
                        value={settings.agentAvatar}
                        onChange={(e) => handleSettingChange("agentAvatar", e.target.value)}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="behavior" className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <h3 className="text-sm font-medium">Auto Open Chat</h3>
                      <p className="text-sm text-gray-500">Automatically open chat after page load</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <h3 className="text-sm font-medium">Show Notifications</h3>
                      <p className="text-sm text-gray-500">Display notification badge for new messages</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="space-y-2">
                    <Label>Auto Response Delay (seconds)</Label>
                    <div className="pt-2">
                      <Slider defaultValue={[1.5]} min={0.5} max={5} step={0.5} />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Instant (0.5s)</span>
                      <span>Natural (5s)</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Mobile Position</Label>
                    <Select defaultValue="bottom-right">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bottom-right">Bottom Right</SelectItem>
                        <SelectItem value="bottom-left">Bottom Left</SelectItem>
                        <SelectItem value="top-right">Top Right</SelectItem>
                        <SelectItem value="top-left">Top Left</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <h3 className="text-sm font-medium">Human Handoff</h3>
                      <p className="text-sm text-gray-500">Allow escalation to human agents</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <h3 className="text-sm font-medium">File Attachments</h3>
                      <p className="text-sm text-gray-500">Allow customers to send files</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <h3 className="text-sm font-medium">Collect Contact Info</h3>
                      <p className="text-sm text-gray-500">Ask for email before starting chat</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="space-y-2">
                    <Label>Business Hours</Label>
                    <Select defaultValue="24-7">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24-7">24/7 Support</SelectItem>
                        <SelectItem value="weekdays">Weekdays (9am-5pm)</SelectItem>
                        <SelectItem value="custom">Custom Hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-6 flex justify-end space-x-2">
                <Button variant="outline">Reset</Button>
                <Button>Save Settings</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Installation</CardTitle>
              <CardDescription>Add this code to your website to enable the chat widget</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md bg-gray-900 p-4">
                <pre className="text-sm text-gray-100">
                  <code>{`<script>
  (function(w,d,s,o,f,js,fjs){
    w['AI-Support-Widget']=o;w[o]=w[o]||function(){(w[o].q=w[o].q||[]).push(arguments)};
    js=d.createElement(s),fjs=d.getElementsByTagName(s)[0];
    js.id=o;js.src=f;js.async=1;fjs.parentNode.insertBefore(js,fjs);
  }(window,document,'script','aiSupport','https://widget.aisupportpro.com/widget.js'));
  
  aiSupport('init', {
    companyName: '${settings.companyName}',
    accentColor: '${settings.accentColor}',
    welcomeMessage: '${settings.welcomeMessage}'
  });
</script>`}</code>
                </pre>
              </div>
              <Button variant="outline" className="mt-4 w-full">
                Copy Code
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>See how your chat widget will appear to customers</CardDescription>
            </CardHeader>
            <CardContent className="h-[500px] bg-gray-100 relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                Website Content Area
              </div>
              {settings.isEnabled && <ChatWidget {...settings} />}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
