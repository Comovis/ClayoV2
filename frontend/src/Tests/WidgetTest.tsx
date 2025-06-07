"use client"

import { useEffect } from "react"

export default function TestWidgetPage() {
  useEffect(() => {
    // Check if widget already exists
    if (document.getElementById("clayo-chat-widget")) {
      console.log("Widget already exists, skipping initialization")
      return
    }
    // Configure the widget
    ;(window as any).ClayoConfig = {
      organizationId: "8341de1e-6c76-4e6d-91f2-8cb67debd9ed",
      agentId: "958903c3-685f-49e7-bd8f-6bee4a00f341",
      apiUrl:
        import.meta.env.MODE === "development" ? import.meta.env.VITE_DEVELOPMENT_URL : import.meta.env.VITE_API_URL,
      primaryColor: "#3B82F6",
      secondaryColor: "#EFF6FF",
      textColor: "#374151",
      backgroundColor: "#ffffff",
      position: "bottom-right",
      welcomeMessage:
        "👋 Hi there! I'm here to help you with any questions you might have. How can I assist you today?",
      companyName: "Clayo",
      agentName: "AI Assistant",
      showAvatar: true,
      enableFileUpload: true,
      enableEmojis: true,
      autoOpen: false,
      autoOpenDelay: 3000,
      widgetWidth: 420,
      widgetHeight: 650,
      borderRadius: 20,
      fontSize: 15,
      fontFamily: "Inter, system-ui, sans-serif",
      enableSoundNotifications: false,
      showPoweredBy: true,
      maxMessageLength: 1000,
      showOnlineStatus: true,
      showTypingIndicator: true,
      placeholderText: "Type your message...",
    }

    // Load the widget script
    const script = document.createElement("script")
    script.src = "/embed.js"
    script.async = true
    script.onload = () => {
      console.log("✅ Widget script loaded successfully")
    }
    document.body.appendChild(script)

    return () => {
      // More thorough cleanup
      console.log("🧹 Cleaning up widget...")

      // Remove script
      const existingScript = document.querySelector('script[src="/embed.js"]')
      if (existingScript) {
        existingScript.remove()
      }

      // Remove widget
      const widget = document.getElementById("clayo-chat-widget")
      if (widget) {
        widget.remove()
      }

      // Remove styles
      const styles = document.querySelector("style[data-clayo-widget]")
      if (styles) {
        styles.remove()
      }

      // Clear global variables
      delete (window as any).ClayoConfig
      delete (window as any).openWidget
      delete (window as any).closeWidget
      delete (window as any).sessionId
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Widget Test Page</h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Testing Instructions</h2>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Before Testing:</h3>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Make sure your Node.js backend server is running on port 2222</li>
                <li>Verify your environment variables are set correctly</li>
                <li>Check that the embed.js file is in your public folder</li>
                <li>Confirm the widget appears in bottom-right corner</li>
              </ol>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-900 mb-2">Test Flow:</h3>
              <ul className="text-sm text-green-800 space-y-1 list-disc list-inside">
                <li>Click the chat button to open widget</li>
                <li>Send a test message</li>
                <li>Verify streaming response works with your backend</li>
                <li>Test file upload button (if enabled)</li>
                <li>Check mobile responsiveness</li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-medium text-yellow-900 mb-2">Environment Variables:</h3>
              <div className="text-sm text-yellow-800 space-y-1">
                <div>
                  Development: <code className="bg-yellow-100 px-1 rounded">VITE_DEVELOPMENT_URL</code>
                </div>
                <div>
                  Production: <code className="bg-yellow-100 px-1 rounded">VITE_API_URL</code>
                </div>
                <div>
                  Current Mode: <code className="bg-yellow-100 px-1 rounded">{import.meta.env.MODE}</code>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Sample Content</h2>
            <p className="text-gray-600 mb-4">
              This page simulates how the widget will appear on your customers' websites. The widget should integrate
              seamlessly without affecting page layout.
            </p>
            <p className="text-gray-600 mb-4">
              Try interacting with the chat widget to test the full conversation flow using your existing
              TypeScript/Node.js backend infrastructure.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Sample conversation starters:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• "Hello, I need help with..."</li>
                <li>• "What services do you offer?"</li>
                <li>• "Can you help me with pricing?"</li>
                <li>• "I have a technical question"</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Configuration</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Backend:</span>
                <span className="font-mono text-xs">
                  {import.meta.env.MODE === "development"
                    ? import.meta.env.VITE_DEVELOPMENT_URL
                    : import.meta.env.VITE_API_URL}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mode:</span>
                <span className="font-mono">{import.meta.env.MODE}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Org ID:</span>
                <span className="font-mono text-xs">8341de1e-6c76...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Agent ID:</span>
                <span className="font-mono text-xs">958903c3-685f...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Endpoints:</span>
                <span className="text-xs">/api/public/chat/*</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Widget Size:</span>
                <span className="text-xs">420×650 (Medium)</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <h3 className="font-medium mb-2">Status Indicators:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Backend Connected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Widget Loaded</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Ready for Testing</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="text-xs text-gray-700 overflow-x-auto">
              {`Widget Configuration:
- Organization ID: 8341de1e-6c76-4e6d-91f2-8cb67debd9ed
- Agent ID: 958903c3-685f-49e7-bd8f-6bee4a00f341
- API URL: ${
                import.meta.env.MODE === "development"
                  ? import.meta.env.VITE_DEVELOPMENT_URL
                  : import.meta.env.VITE_API_URL
              }
- Mode: ${import.meta.env.MODE}

Expected API Endpoints:
- Session: POST /api/public/chat/session
- Message: POST /api/public/chat/message (streaming)`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
