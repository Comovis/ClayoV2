//Use GitHub Pages Overview** 📚







;(() => {
    // Prevent multiple widget loads
    if (window.ClayoWidget) {
      return
    }
  
    // Configuration - will be replaced during build
    const API_BASE = "{{API_BASE}}" || "https://api.clayo.co"
    const WIDGET_VERSION = "{{VERSION}}" || "dev"
  
    console.log(`Clayo Widget v${WIDGET_VERSION} loaded`)
  
    // Default configuration
    const defaultConfig = {
      organizationId: null,
      primaryColor: "#000000",
      secondaryColor: "#f8fafc",
      position: "bottom-right",
      welcomeMessage: "Hello! How can I help you today?",
      companyName: "Support",
      agentName: "AI Assistant",
      showAvatar: true,
      enableFileUpload: true,
      enableEmojis: true,
      autoOpen: false,
      autoOpenDelay: 3000,
      widgetWidth: 380,
      widgetHeight: 600,
      borderRadius: 16,
      fontSize: 14,
      fontFamily: "Inter, system-ui, sans-serif",
      enableSoundNotifications: false,
      showPoweredBy: true,
      maxMessageLength: 1000,
    }
  
    // Merge user config with defaults
    const config = Object.assign({}, defaultConfig, window.ClayoConfig || {})
  
    // Validate required config
    if (!config.organizationId) {
      console.error("Clayo Widget: organizationId is required")
      return
    }
  
    // Widget state
    let isOpen = false
    let isMinimized = false
    const messages = []
    let sessionId = null
  
    // Load remote configuration
    async function loadRemoteConfig() {
      try {
        const response = await fetch(`${API_BASE}/widget/config?organizationId=${config.organizationId}`)
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.config) {
            Object.assign(config, data.config)
          }
        }
      } catch (error) {
        console.warn("Failed to load remote config, using defaults:", error)
      }
    }
  
    // Analytics tracking
    function trackEvent(event, data = {}) {
      try {
        fetch(`${API_BASE}/analytics/widget`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event,
            organizationId: config.organizationId,
            url: window.location.href,
            timestamp: new Date().toISOString(),
            version: WIDGET_VERSION,
            ...data,
          }),
        }).catch(() => {}) // Fail silently
      } catch (error) {
        // Fail silently
      }
    }
  
    // Create widget HTML
    function createWidget() {
      const widgetContainer = document.createElement("div")
      widgetContainer.id = "clayo-widget-container"
      widgetContainer.style.cssText = `
        position: fixed;
        ${getPositionStyles()}
        z-index: 2147483647;
        font-family: ${config.fontFamily};
        font-size: ${config.fontSize}px;
      `
  
      const widget = document.createElement("div")
      widget.id = "clayo-widget"
      widget.style.cssText = `
        width: ${config.widgetWidth}px;
        height: ${isMinimized ? "60px" : config.widgetHeight + "px"};
        background: white;
        border-radius: ${config.borderRadius}px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        border: 1px solid #e5e7eb;
        display: ${isOpen ? "flex" : "none"};
        flex-direction: column;
        transition: all 0.3s ease;
        overflow: hidden;
      `
  
      widget.innerHTML = getWidgetHTML()
      widgetContainer.appendChild(widget)
  
      // Create toggle button
      const toggleButton = document.createElement("div")
      toggleButton.id = "clayo-widget-toggle"
      toggleButton.style.cssText = `
        width: 60px;
        height: 60px;
        background: ${config.primaryColor};
        border-radius: 50%;
        display: ${isOpen ? "none" : "flex"};
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: all 0.3s ease;
        margin-top: 10px;
      `
  
      toggleButton.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 13.54 2.36 14.99 3.01 16.28L2 22L7.72 20.99C9.01 21.64 10.46 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C10.74 20 9.54 19.75 8.46 19.3L6 20L6.7 17.54C6.25 16.46 6 15.26 6 14C6 8.48 8.48 6 12 6C15.52 6 18 8.48 18 12C18 15.52 15.52 18 12 18Z" fill="white"/>
        </svg>
      `
  
      widgetContainer.appendChild(toggleButton)
      document.body.appendChild(widgetContainer)
  
      // Add event listeners
      addEventListeners()
  
      // Track widget load
      trackEvent("widget_loaded")
  
      // Auto-open if configured
      if (config.autoOpen) {
        setTimeout(() => {
          openWidget()
        }, config.autoOpenDelay)
      }
    }
  
    function getPositionStyles() {
      const margin = "20px"
      switch (config.position) {
        case "bottom-right":
          return `bottom: ${margin}; right: ${margin};`
        case "bottom-left":
          return `bottom: ${margin}; left: ${margin};`
        case "top-right":
          return `top: ${margin}; right: ${margin};`
        case "top-left":
          return `top: ${margin}; left: ${margin};`
        default:
          return `bottom: ${margin}; right: ${margin};`
      }
    }
  
    function getWidgetHTML() {
      return `
        <div id="clayo-widget-header" style="
          background: ${config.primaryColor};
          color: white;
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          border-radius: ${config.borderRadius}px ${config.borderRadius}px ${isMinimized ? config.borderRadius : 0}px ${isMinimized ? config.borderRadius : 0}px;
        ">
          <div style="display: flex; align-items: center; gap: 12px;">
            ${
              config.showAvatar
                ? `
              <div style="
                width: 40px;
                height: 40px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L9 7V9C9 10.1 9.9 11 11 11V22H13V11C14.1 11 15 10.1 15 9Z"/>
                </svg>
              </div>
            `
                : ""
            }
            <div>
              <div style="font-weight: 600; font-size: 14px;">${config.companyName}</div>
              <div style="font-size: 12px; opacity: 0.9;">
                <span style="
                  display: inline-block;
                  width: 8px;
                  height: 8px;
                  background: #10b981;
                  border-radius: 50%;
                  margin-right: 6px;
                "></span>
                Online
              </div>
            </div>
          </div>
          <div style="display: flex; gap: 8px;">
            <button id="clayo-minimize-btn" style="
              background: rgba(255, 255, 255, 0.2);
              border: none;
              border-radius: 4px;
              width: 32px;
              height: 32px;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              transition: background 0.2s;
            ">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M19 13H5V11H19V13Z"/>
              </svg>
            </button>
            <button id="clayo-close-btn" style="
              background: rgba(255, 255, 255, 0.2);
              border: none;
              border-radius: 4px;
              width: 32px;
              height: 32px;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              transition: background 0.2s;
            ">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>
              </svg>
            </button>
          </div>
        </div>
        ${
          !isMinimized
            ? `
          <div id="clayo-widget-messages" style="
            flex: 1;
            padding: 16px;
            overflow-y: auto;
            background: #f9fafb;
          ">
            <div id="clayo-messages-container">
              ${getMessagesHTML()}
            </div>
          </div>
          <div id="clayo-widget-input" style="
            padding: 16px;
            border-top: 1px solid #e5e7eb;
            background: white;
          ">
            <div style="display: flex; gap: 8px; align-items: flex-end;">
              <div style="flex: 1; position: relative;">
                <textarea id="clayo-message-input" placeholder="${config.placeholderText || "Type your message..."}" style="
                  width: 100%;
                  border: 1px solid #d1d5db;
                  border-radius: ${config.borderRadius * 0.7}px;
                  padding: 12px 16px;
                  resize: none;
                  font-family: inherit;
                  font-size: ${config.fontSize}px;
                  line-height: 1.4;
                  max-height: 100px;
                  min-height: 44px;
                  outline: none;
                  transition: border-color 0.2s;
                " maxlength="${config.maxMessageLength}"></textarea>
              </div>
              <button id="clayo-send-btn" style="
                background: ${config.primaryColor};
                border: none;
                border-radius: ${config.borderRadius * 0.7}px;
                width: 44px;
                height: 44px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: opacity 0.2s;
              ">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z"/>
                </svg>
              </button>
            </div>
            ${
              config.showPoweredBy
                ? `
              <div style="text-align: center; margin-top: 12px;">
                <a href="https://clayo.co" target="_blank" style="
                  color: #9ca3af;
                  font-size: 11px;
                  text-decoration: none;
                ">Powered by Clayo</a>
              </div>
            `
                : ""
            }
          </div>
        `
            : ""
        }
      `
    }
  
    function getMessagesHTML() {
      if (messages.length === 0) {
        return `
          <div style="
            background: white;
            border-radius: ${config.borderRadius * 0.7}px;
            padding: 16px;
            margin-bottom: 16px;
            border: 1px solid #e5e7eb;
          ">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
              ${
                config.showAvatar
                  ? `
                <div style="
                  width: 32px;
                  height: 32px;
                  background: ${config.primaryColor};
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  flex-shrink: 0;
                ">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L9 7V9C9 10.1 9.9 11 11 11V22H13V11C14.1 11 15 10.1 15 9Z"/>
                  </svg>
                </div>
              `
                  : ""
              }
              <div style="font-weight: 600; color: #374151; font-size: 13px;">${config.agentName}</div>
            </div>
            <div style="color: #4b5563; font-size: ${config.fontSize}px; line-height: 1.5;">
              ${config.welcomeMessage}
            </div>
          </div>
        `
      }
  
      return messages
        .map((message) => {
          const isUser = message.sender === "user"
          return `
          <div style="
            display: flex;
            ${isUser ? "justify-content: flex-end;" : "justify-content: flex-start;"}
            margin-bottom: 16px;
          ">
            <div style="
              max-width: 80%;
              ${isUser ? "order: 2;" : "order: 1;"}
            ">
              ${
                !isUser && config.showAvatar
                  ? `
                <div style="
                  width: 32px;
                  height: 32px;
                  background: ${config.primaryColor};
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  margin-bottom: 8px;
                ">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L9 7V9C9 10.1 9.9 11 11 11V22H13V11C14.1 11 15 10.1 15 9Z"/>
                  </svg>
                </div>
              `
                  : ""
              }
              <div style="
                background: ${isUser ? config.primaryColor : "white"};
                color: ${isUser ? "white" : "#374151"};
                padding: 12px 16px;
                border-radius: ${config.borderRadius * 0.7}px;
                ${isUser ? "" : "border: 1px solid #e5e7eb;"}
                font-size: ${config.fontSize}px;
                line-height: 1.5;
              ">
                ${message.content}
              </div>
              <div style="
                font-size: 11px;
                color: #9ca3af;
                margin-top: 4px;
                ${isUser ? "text-align: right;" : "text-align: left;"}
              ">
                ${formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        `
        })
        .join("")
    }
  
    // Event listeners and other functions...
    function addEventListeners() {
      const toggleBtn = document.getElementById("clayo-widget-toggle")
      if (toggleBtn) {
        toggleBtn.addEventListener("click", openWidget)
      }
  
      const closeBtn = document.getElementById("clayo-close-btn")
      if (closeBtn) {
        closeBtn.addEventListener("click", closeWidget)
      }
  
      const minimizeBtn = document.getElementById("clayo-minimize-btn")
      if (minimizeBtn) {
        minimizeBtn.addEventListener("click", toggleMinimize)
      }
  
      const header = document.getElementById("clayo-widget-header")
      if (header) {
        header.addEventListener("click", (e) => {
          if (e.target.closest("button")) return
          toggleMinimize()
        })
      }
  
      const sendBtn = document.getElementById("clayo-send-btn")
      if (sendBtn) {
        sendBtn.addEventListener("click", sendMessage)
      }
  
      const messageInput = document.getElementById("clayo-message-input")
      if (messageInput) {
        messageInput.addEventListener("keydown", (e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
          }
        })
  
        messageInput.addEventListener("input", autoResize)
      }
    }
  
    function openWidget() {
      isOpen = true
      const widget = document.getElementById("clayo-widget")
      const toggleBtn = document.getElementById("clayo-widget-toggle")
  
      if (widget) widget.style.display = "flex"
      if (toggleBtn) toggleBtn.style.display = "none"
  
      trackEvent("widget_opened")
  
      if (!sessionId) {
        initializeSession()
      }
    }
  
    function closeWidget() {
      isOpen = false
      const widget = document.getElementById("clayo-widget")
      const toggleBtn = document.getElementById("clayo-widget-toggle")
  
      if (widget) widget.style.display = "none"
      if (toggleBtn) toggleBtn.style.display = "flex"
  
      trackEvent("widget_closed")
    }
  
    function toggleMinimize() {
      isMinimized = !isMinimized
      const widget = document.getElementById("clayo-widget")
      if (widget) {
        widget.style.height = isMinimized ? "60px" : config.widgetHeight + "px"
        widget.innerHTML = getWidgetHTML()
        addEventListeners()
      }
  
      trackEvent(isMinimized ? "widget_minimized" : "widget_maximized")
    }
  
    function autoResize() {
      const textarea = document.getElementById("clayo-message-input")
      if (textarea) {
        textarea.style.height = "auto"
        textarea.style.height = Math.min(textarea.scrollHeight, 100) + "px"
      }
    }
  
    function sendMessage() {
      const messageInput = document.getElementById("clayo-message-input")
      if (!messageInput) return
  
      const content = messageInput.value.trim()
      if (!content) return
  
      addMessage({
        id: Date.now(),
        content: content,
        sender: "user",
        timestamp: new Date(),
      })
  
      messageInput.value = ""
      autoResize()
  
      trackEvent("message_sent", { messageLength: content.length })
      sendToAPI(content)
    }
  
    function addMessage(message) {
      messages.push(message)
      updateMessagesDisplay()
      scrollToBottom()
    }
  
    function updateMessagesDisplay() {
      const container = document.getElementById("clayo-messages-container")
      if (container) {
        container.innerHTML = getMessagesHTML()
      }
    }
  
    function scrollToBottom() {
      const messagesContainer = document.getElementById("clayo-widget-messages")
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight
      }
    }
  
    function formatTime(date) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  
    async function initializeSession() {
      try {
        const response = await fetch(`${API_BASE}/widget/session`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            organizationId: config.organizationId,
            userAgent: navigator.userAgent,
            url: window.location.href,
            referrer: document.referrer,
          }),
        })
  
        if (response.ok) {
          const data = await response.json()
          sessionId = data.sessionId
          trackEvent("session_created", { sessionId })
        }
      } catch (error) {
        console.error("Failed to initialize session:", error)
      }
    }
  
    async function sendToAPI(content) {
      if (!sessionId) {
        await initializeSession()
      }
  
      try {
        showTypingIndicator()
  
        const response = await fetch(`${API_BASE}/widget/message`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId: sessionId,
            organizationId: config.organizationId,
            content: content,
            timestamp: new Date().toISOString(),
          }),
        })
  
        hideTypingIndicator()
  
        if (response.ok) {
          const data = await response.json()
          if (data.response) {
            addMessage({
              id: Date.now(),
              content: data.response,
              sender: "bot",
              timestamp: new Date(),
            })
  
            trackEvent("message_received", { responseLength: data.response.length })
  
            if (config.enableSoundNotifications) {
              playNotificationSound()
            }
          }
        } else {
          addMessage({
            id: Date.now(),
            content: "Sorry, I'm having trouble responding right now. Please try again.",
            sender: "bot",
            timestamp: new Date(),
          })
          trackEvent("message_error", { error: "api_error" })
        }
      } catch (error) {
        hideTypingIndicator()
        console.error("Failed to send message:", error)
        addMessage({
          id: Date.now(),
          content: "Sorry, I'm having trouble connecting. Please check your internet connection and try again.",
          sender: "bot",
          timestamp: new Date(),
        })
        trackEvent("message_error", { error: "network_error" })
      }
    }
  
    function showTypingIndicator() {
      const container = document.getElementById("clayo-messages-container")
      if (container) {
        const typingDiv = document.createElement("div")
        typingDiv.id = "clayo-typing-indicator"
        typingDiv.innerHTML = `
          <div style="
            display: flex;
            justify-content: flex-start;
            margin-bottom: 16px;
          ">
            <div style="
              background: white;
              border: 1px solid #e5e7eb;
              padding: 12px 16px;
              border-radius: ${config.borderRadius * 0.7}px;
              display: flex;
              align-items: center;
              gap: 4px;
            ">
              <div style="
                width: 8px;
                height: 8px;
                background: #9ca3af;
                border-radius: 50%;
                animation: clayo-bounce 1.4s infinite ease-in-out both;
              "></div>
              <div style="
                width: 8px;
                height: 8px;
                background: #9ca3af;
                border-radius: 50%;
                animation: clayo-bounce 1.4s infinite ease-in-out both;
                animation-delay: -0.32s;
              "></div>
              <div style="
                width: 8px;
                height: 8px;
                background: #9ca3af;
                border-radius: 50%;
                animation: clayo-bounce 1.4s infinite ease-in-out both;
                animation-delay: -0.16s;
              "></div>
            </div>
          </div>
        `
        container.appendChild(typingDiv)
        scrollToBottom()
      }
    }
  
    function hideTypingIndicator() {
      const typingIndicator = document.getElementById("clayo-typing-indicator")
      if (typingIndicator) {
        typingIndicator.remove()
      }
    }
  
    function playNotificationSound() {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
  
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
  
        oscillator.frequency.value = 800
        oscillator.type = "sine"
  
        gainNode.gain.setValueAtTime(0, audioContext.currentTime)
        gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
  
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.3)
      } catch (error) {
        console.log("Audio not supported")
      }
    }
  
    // Add CSS animations
    const style = document.createElement("style")
    style.textContent = `
      @keyframes clayo-bounce {
        0%, 80%, 100% {
          transform: scale(0);
        }
        40% {
          transform: scale(1);
        }
      }
      
      #clayo-widget-toggle:hover {
        transform: scale(1.05);
      }
      
      #clayo-message-input:focus {
        border-color: ${config.primaryColor};
        box-shadow: 0 0 0 3px ${config.primaryColor}20;
      }
      
      #clayo-send-btn:hover {
        opacity: 0.9;
      }
      
      #clayo-send-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    `
    document.head.appendChild(style)
  
    // Initialize widget
    async function init() {
      await loadRemoteConfig()
  
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", createWidget)
      } else {
        createWidget()
      }
    }
  
    // Expose widget API
    window.ClayoWidget = {
      open: openWidget,
      close: closeWidget,
      toggle: () => {
        if (isOpen) closeWidget()
        else openWidget()
      },
      sendMessage: (content) => {
        if (content && typeof content === "string") {
          addMessage({
            id: Date.now(),
            content: content,
            sender: "user",
            timestamp: new Date(),
          })
          sendToAPI(content)
        }
      },
      updateConfig: (newConfig) => {
        Object.assign(config, newConfig)
        if (isOpen) {
          const widget = document.getElementById("clayo-widget")
          if (widget) {
            widget.innerHTML = getWidgetHTML()
            addEventListeners()
          }
        }
      },
      getVersion: () => WIDGET_VERSION,
    }
  
    // Initialize
    init()
  })()
  