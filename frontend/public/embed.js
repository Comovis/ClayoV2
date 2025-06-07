;(() => {
    function ready(fn) {
      if (document.readyState !== "loading") {
        fn()
      } else {
        document.addEventListener("DOMContentLoaded", fn)
      }
    }
  
    // Simple markdown parser for chat messages
    function parseMarkdown(text) {
      return (
        text
          // Bold text: **text** or __text__
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/__(.*?)__/g, "<strong>$1</strong>")
  
          // Italic text: *text* or _text_
          .replace(/\*(.*?)\*/g, "<em>$1</em>")
          .replace(/_(.*?)_/g, "<em>$1</em>")
  
          // FIXED: Links: [text](url) - corrected regex pattern
          .replace(
            /\[([^\]]+)\]$$([^)]+)$$/g,
            '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: #3B82F6; text-decoration: underline; cursor: pointer;">$1</a>',
          )
  
          // Code blocks: \`\`\`code\`\`\`
          .replace(
            /```([\s\S]*?)```/g,
            '<pre style="background: #f3f4f6; padding: 8px; border-radius: 4px; overflow-x: auto; font-family: monospace; margin: 8px 0;"><code>$1</code></pre>',
          )
  
          // Inline code: `code`
          .replace(
            /`([^`]+)`/g,
            '<code style="background: #f3f4f6; padding: 2px 4px; border-radius: 3px; font-family: monospace;">$1</code>',
          )
  
          // Line breaks: Convert \n to <br>
          .replace(/\n/g, "<br>")
  
          // Lists: - item or * item
          .replace(/^[\s]*[-*]\s+(.+)$/gm, '<li style="margin-left: 20px;">$1</li>')
  
          // Wrap consecutive <li> elements in <ul>
          .replace(/(<li[^>]*>.*?<\/li>)(\s*<li[^>]*>.*?<\/li>)*/g, '<ul style="margin: 8px 0; padding-left: 0;">$&</ul>')
      )
    }
  
    // Enhanced message adding with markdown support
    function addMessage(content, sender, config) {
      const messages = document.getElementById("clayo-widget-messages")
      const messageDiv = document.createElement("div")
      messageDiv.className = `clayo-message clayo-message-${sender}`
  
      const contentDiv = document.createElement("div")
      contentDiv.className = "clayo-message-content"
  
      // Parse markdown for bot messages, plain text for user messages
      if (sender === "bot") {
        contentDiv.innerHTML = parseMarkdown(content)
      } else {
        contentDiv.textContent = content
      }
  
      messageDiv.appendChild(contentDiv)
      messages.appendChild(messageDiv)
  
      // Scroll to bottom
      messages.scrollTop = messages.scrollHeight
  
      return contentDiv
    }
  
    function initClayoWidget() {
      console.log("🚀 Initializing Clayo Widget with Markdown Support...")
  
      // Check if widget already exists and remove it
      const existingWidget = document.getElementById("clayo-chat-widget")
      if (existingWidget) {
        console.log("🧹 Removing existing widget")
        existingWidget.remove()
      }
  
      const config = window.ClayoConfig || {}
      console.log("📋 Widget config:", config)
  
      if (!config.organizationId) {
        console.error("❌ Clayo Widget: organizationId is required")
        return
      }
  
      if (!config.agentId) {
        console.error("❌ Clayo Widget: agentId is required")
        return
      }
  
      const defaultConfig = {
        primaryColor: "#3B82F6",
        secondaryColor: "#EFF6FF",
        textColor: "#374151",
        backgroundColor: "#ffffff",
        position: "bottom-right",
        welcomeMessage:
          "👋 Hi there! I'm here to help you with any questions you might have. How can I assist you today?",
        companyName: "Support",
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
        apiUrl: "http://localhost:2222",
        showOnlineStatus: true,
        showTypingIndicator: true,
        placeholderText: "Type your message...",
      }
  
      const finalConfig = { ...defaultConfig, ...config }
      console.log("⚙️ Final config:", finalConfig)
  
      try {
        // Create widget container
        const widgetContainer = document.createElement("div")
        widgetContainer.id = "clayo-chat-widget"
        widgetContainer.innerHTML = createWidgetHTML(finalConfig)
  
        // Add enhanced styles with markdown support
        const styles = createWidgetStyles(finalConfig)
        const styleSheet = document.createElement("style")
        styleSheet.setAttribute("data-clayo-widget", "true")
        styleSheet.textContent = styles
        document.head.appendChild(styleSheet)
  
        // Add widget to page
        document.body.appendChild(widgetContainer)
        console.log("✅ Widget HTML added to page")
  
        // Initialize widget events
        initializeWidgetEvents(finalConfig)
        console.log("✅ Widget events initialized")
  
        // Auto-open if configured
        if (finalConfig.autoOpen) {
          setTimeout(() => {
            console.log("🔄 Auto-opening widget...")
            if (window.openWidget) {
              window.openWidget()
            }
          }, finalConfig.autoOpenDelay)
        }
  
        // Add a direct click handler to the document
        addGlobalClickHandler()
  
        console.log("🎉 Widget initialization complete!")
      } catch (error) {
        console.error("❌ Error initializing widget:", error)
      }
    }
  
    function addGlobalClickHandler() {
      // Add a global click handler to detect clicks on the widget button
      document.addEventListener("click", (event) => {
        const button = document.getElementById("clayo-widget-button")
        if (!button) return
  
        // Get button position
        const rect = button.getBoundingClientRect()
  
        // Check if click is within button bounds
        if (
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom
        ) {
          console.log("🎯 Global click handler detected click on button!")
          if (window.openWidget) {
            window.openWidget()
          }
        }
      })
    }
  
    function createWidgetHTML(config) {
      return `
        <div id="clayo-widget-button" class="clayo-widget-button" onclick="if(window.openWidget)window.openWidget()">
          <div class="clayo-widget-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 13.54 2.36 14.99 3.01 16.28L2 22L7.72 20.99C9.01 21.64 10.46 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="currentColor"/>
            </svg>
          </div>
          ${config.showOnlineStatus ? '<div class="clayo-online-indicator"></div>' : ""}
        </div>
        
        <div id="clayo-widget-chat" class="clayo-widget-chat clayo-widget-hidden">
          <div class="clayo-widget-header">
            <div class="clayo-widget-header-info">
              ${config.showAvatar ? `<div class="clayo-widget-avatar">${config.agentName.charAt(0)}</div>` : ""}
              <div>
                <div class="clayo-widget-company">${config.companyName}</div>
                ${config.showOnlineStatus ? '<div class="clayo-widget-status">Online</div>' : ""}
              </div>
            </div>
            <button id="clayo-widget-close" class="clayo-widget-close" onclick="if(window.closeWidget)window.closeWidget()">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          
          <div id="clayo-widget-messages" class="clayo-widget-messages">
            <div class="clayo-message clayo-message-bot">
              <div class="clayo-message-content">${parseMarkdown(config.welcomeMessage)}</div>
            </div>
          </div>
          
          <div class="clayo-widget-input-area">
            <div class="clayo-widget-input-container">
              ${config.enableFileUpload ? '<button class="clayo-attach-btn" title="Attach file">📎</button>' : ""}
              <input type="text" id="clayo-widget-input" placeholder="${config.placeholderText || "Type your message..."}" maxlength="${config.maxMessageLength || 1000}">
              ${config.enableEmojis ? '<button class="clayo-emoji-btn" title="Add emoji">😊</button>' : ""}
              <button id="clayo-widget-send" class="clayo-widget-send">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M15 1L1 8L4 9L6 15L8 8L15 1Z" fill="currentColor"/>
                </svg>
              </button>
            </div>
            ${config.showPoweredBy ? '<div class="clayo-powered-by">Powered by Clayo</div>' : ""}
          </div>
        </div>
      `
    }
  
    function createWidgetStyles(config) {
      const position = config.position || "bottom-right"
      const [vertical, horizontal] = position.split("-")
  
      return `
        #clayo-chat-widget {
          position: fixed;
          ${vertical}: 20px;
          ${horizontal}: 20px;
          z-index: 999999;
          font-family: ${config.fontFamily};
          font-size: ${config.fontSize}px;
          pointer-events: auto !important;
        }
        
        .clayo-widget-button {
          width: 60px;
          height: 60px;
          background: ${config.primaryColor};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          transition: all 0.3s ease;
          position: relative;
          color: white;
          pointer-events: auto !important;
        }
        
        .clayo-widget-button:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(0,0,0,0.2);
        }
        
        .clayo-online-indicator {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 12px;
          height: 12px;
          background: #10B981;
          border-radius: 50%;
          border: 2px solid white;
        }
        
        .clayo-widget-chat {
          width: ${config.widgetWidth}px;
          height: ${config.widgetHeight}px;
          background: white;
          border-radius: ${config.borderRadius}px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
          position: absolute;
          ${vertical}: 80px;
          ${horizontal}: 0;
          transition: all 0.3s ease;
          pointer-events: auto !important;
        }
        
        .clayo-widget-hidden {
          opacity: 0;
          visibility: hidden;
          transform: translateY(20px);
        }
        
        .clayo-widget-header {
          background: ${config.primaryColor};
          color: white;
          padding: 16px;
          border-radius: ${config.borderRadius}px ${config.borderRadius}px 0 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .clayo-widget-header-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .clayo-widget-avatar {
          width: 32px;
          height: 32px;
          background: rgba(255,255,255,0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }
        
        .clayo-widget-company {
          font-weight: 600;
          font-size: 14px;
        }
        
        .clayo-widget-status {
          font-size: 12px;
          opacity: 0.9;
        }
        
        .clayo-widget-close {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          opacity: 0.8;
          pointer-events: auto !important;
        }
        
        .clayo-widget-close:hover {
          opacity: 1;
          background: rgba(255,255,255,0.1);
        }
        
        .clayo-widget-messages {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          background: ${config.backgroundColor};
        }
        
        .clayo-message {
          margin-bottom: 16px;
          display: flex;
        }
        
        .clayo-message-bot {
          justify-content: flex-start;
        }
        
        .clayo-message-user {
          justify-content: flex-end;
        }
        
        .clayo-message-content {
          max-width: 80%;
          padding: 12px 16px;
          border-radius: ${config.borderRadius * 0.7}px;
          line-height: 1.4;
          word-wrap: break-word;
        }
        
        .clayo-message-bot .clayo-message-content {
          background: ${config.secondaryColor};
          color: ${config.textColor};
          border-bottom-left-radius: 4px;
        }
        
        .clayo-message-user .clayo-message-content {
          background: ${config.primaryColor};
          color: white;
          border-bottom-right-radius: 4px;
        }
        
        /* Enhanced markdown styles */
        .clayo-message-content a {
          color: #3B82F6 !important;
          text-decoration: underline !important;
          cursor: pointer !important;
          pointer-events: auto !important;
        }
  
        .clayo-message-content a:hover {
          color: #2563EB !important;
          text-decoration: underline !important;
        }
        
        .clayo-message-content strong {
          font-weight: 600;
        }
        
        .clayo-message-content em {
          font-style: italic;
        }
        
        .clayo-message-content code {
          background: rgba(0,0,0,0.1);
          padding: 2px 4px;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
        }
        
        .clayo-message-content pre {
          background: rgba(0,0,0,0.05);
          padding: 8px;
          border-radius: 4px;
          overflow-x: auto;
          font-family: 'Courier New', monospace;
          margin: 8px 0;
          white-space: pre-wrap;
        }
        
        .clayo-message-content ul {
          margin: 8px 0;
          padding-left: 0;
        }
        
        .clayo-message-content li {
          margin-left: 20px;
          list-style-type: disc;
          margin-bottom: 4px;
        }
        
        .clayo-widget-input-area {
          padding: 16px;
          border-top: 1px solid #E5E7EB;
          background: ${config.backgroundColor};
          border-radius: 0 0 ${config.borderRadius}px ${config.borderRadius}px;
        }
        
        .clayo-widget-input-container {
          display: flex;
          align-items: center;
          gap: 8px;
          background: white;
          border: 1px solid #E5E7EB;
          border-radius: ${config.borderRadius * 0.7}px;
          padding: 8px 12px;
        }
        
        #clayo-widget-input {
          flex: 1;
          border: none;
          outline: none;
          font-size: ${config.fontSize}px;
          font-family: ${config.fontFamily};
        }
        
        .clayo-attach-btn, .clayo-emoji-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          opacity: 0.6;
          pointer-events: auto !important;
        }
        
        .clayo-attach-btn:hover, .clayo-emoji-btn:hover {
          opacity: 1;
        }
        
        .clayo-widget-send {
          background: ${config.primaryColor};
          border: none;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: auto !important;
        }
        
        .clayo-widget-send:hover {
          opacity: 0.9;
        }
        
        .clayo-powered-by {
          text-align: center;
          font-size: 11px;
          color: #9CA3AF;
          margin-top: 8px;
        }
        
        @media (max-width: 480px) {
          #clayo-chat-widget {
            ${vertical}: 10px;
            ${horizontal}: 10px;
          }
          
          .clayo-widget-chat {
            width: calc(100vw - 20px);
            height: calc(100vh - 100px);
            ${horizontal}: 0;
          }
        }
      `
    }
  
    function initializeWidgetEvents(config) {
      console.log("🔧 Setting up widget events...")
  
      const button = document.getElementById("clayo-widget-button")
      const chat = document.getElementById("clayo-widget-chat")
      const closeBtn = document.getElementById("clayo-widget-close")
      const sendBtn = document.getElementById("clayo-widget-send")
      const input = document.getElementById("clayo-widget-input")
      const messages = document.getElementById("clayo-widget-messages")
  
      if (!button) {
        console.error("❌ Widget button not found!")
        return
      }
  
      if (!chat) {
        console.error("❌ Widget chat not found!")
        return
      }
  
      console.log("✅ Widget elements found:", { button, chat, closeBtn, sendBtn, input, messages })
  
      let isOpen = false
      window.sessionId = null
  
      function toggleWidget() {
        console.log("🔄 Toggling widget, current state:", isOpen)
        isOpen = !isOpen
        if (isOpen) {
          openWidget()
        } else {
          closeWidget()
        }
      }
  
      function openWidget() {
        console.log("📖 Opening widget...")
        isOpen = true
        chat.classList.remove("clayo-widget-hidden")
        button.style.display = "none"
  
        if (!window.sessionId) {
          createChatSession(config)
        }
      }
  
      function closeWidget() {
        console.log("📕 Closing widget...")
        isOpen = false
        chat.classList.add("clayo-widget-hidden")
        button.style.display = "flex"
      }
  
      function sendMessage() {
        const message = input.value.trim()
        console.log("📤 Sending message:", message)
  
        if (!message) {
          console.log("⚠️ Empty message, not sending")
          return
        }
  
        if (!window.sessionId) {
          console.log("⚠️ No session ID, creating session first...")
          createChatSession(config).then(() => {
            if (window.sessionId) {
              sendMessage()
            }
          })
          return
        }
  
        addMessage(message, "user", config)
        input.value = ""
  
        sendMessageToAPI(message, window.sessionId, config)
      }
  
      console.log("🎯 Adding event listeners...")
  
      // Multiple ways to handle button click
      button.addEventListener(
        "click",
        (e) => {
          console.log("🖱️ Button clicked via addEventListener!")
          e.preventDefault()
          e.stopPropagation()
          toggleWidget()
        },
        true,
      )
  
      // Also add onclick attribute directly
      button.onclick = (e) => {
        console.log("🖱️ Button clicked via onclick property!")
        e.preventDefault()
        e.stopPropagation()
        toggleWidget()
      }
  
      if (closeBtn) {
        closeBtn.addEventListener("click", (e) => {
          console.log("❌ Close button clicked!")
          e.preventDefault()
          e.stopPropagation()
          closeWidget()
        })
  
        closeBtn.onclick = (e) => {
          console.log("❌ Close button clicked via onclick!")
          e.preventDefault()
          e.stopPropagation()
          closeWidget()
        }
      }
  
      if (sendBtn) {
        sendBtn.addEventListener("click", (e) => {
          console.log("📤 Send button clicked!")
          e.preventDefault()
          e.stopPropagation()
          sendMessage()
        })
      }
  
      if (input) {
        input.addEventListener("keypress", (e) => {
          if (e.key === "Enter") {
            console.log("⌨️ Enter key pressed!")
            e.preventDefault()
            sendMessage()
          }
        })
      }
  
      window.openWidget = openWidget
      window.closeWidget = closeWidget
  
      console.log("✅ Event listeners added successfully")
    }
  
    async function createChatSession(config) {
      try {
        console.log("🔄 Creating chat session with:", {
          apiUrl: config.apiUrl,
          organizationId: config.organizationId,
          agentId: config.agentId,
        })
  
        const response = await fetch(`${config.apiUrl}/api/public/chat/session`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            organizationId: config.organizationId,
            agentId: config.agentId,
          }),
        })
  
        const result = await response.json()
        if (result.success) {
          window.sessionId = result.session.id
          console.log("✅ Chat session created:", result.session.id)
        } else {
          console.error("❌ Failed to create chat session:", result.error)
        }
      } catch (error) {
        console.error("❌ Error creating chat session:", error)
      }
    }
  
    async function sendMessageToAPI(message, sessionId, config) {
      try {
        console.log("📡 Sending message to API:", {
          message,
          sessionId: window.sessionId,
          agentId: config.agentId,
          organizationId: config.organizationId,
        })
  
        const response = await fetch(`${config.apiUrl}/api/public/chat/message`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
            sessionId: window.sessionId,
            agentId: config.agentId,
            organizationId: config.organizationId,
          }),
        })
  
        const reader = response.body.getReader()
        let botMessage = ""
        let messageElement = null
  
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
  
          const chunk = new TextDecoder().decode(value)
          const lines = chunk.split("\n")
  
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6))
  
                if (data.type === "chunk") {
                  if (!messageElement) {
                    messageElement = addMessage("", "bot", config)
                  }
                  botMessage += data.content
                  // Update with markdown parsing
                  messageElement.innerHTML = parseMarkdown(botMessage)
                } else if (data.type === "complete") {
                  console.log("✅ Message complete")
                  break
                } else if (data.type === "error") {
                  console.error("❌ Chat error:", data.error)
                  if (!messageElement) {
                    addMessage("Sorry, I encountered an error. Please try again.", "bot", config)
                  }
                }
              } catch (e) {
                // Ignore parsing errors for incomplete JSON
              }
            }
          }
        }
      } catch (error) {
        console.error("❌ Error sending message:", error)
        addMessage("Sorry, I encountered an error. Please try again.", "bot", config)
      }
    }
  
    ready(initClayoWidget)
  })()
  