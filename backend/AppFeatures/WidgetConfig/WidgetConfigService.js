const { supabaseAdmin } = require("../../SupabaseClient")

/**
 * Get widget configuration for an organization
 */
async function getWidgetConfig(organizationId) {
  try {
    const { data, error } = await supabaseAdmin
      .from("widget_configurations")
      .select("*")
      .eq("organization_id", organizationId)
      .single()

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows returned
      throw error
    }

    // Return default config if none exists
    if (!data) {
      return {
        success: true,
        config: getDefaultWidgetConfig(organizationId),
      }
    }

    return {
      success: true,
      config: data,
    }
  } catch (error) {
    console.error("Error fetching widget config:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Save widget configuration
 */
async function saveWidgetConfig(organizationId, config) {
  try {
    const { data, error } = await supabaseAdmin
      .from("widget_configurations")
      .upsert({
        organization_id: organizationId,
        config: config,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    return {
      success: true,
      config: data,
    }
  } catch (error) {
    console.error("Error saving widget config:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Generate widget embed code
 */
function generateEmbedCode(organizationId, config) {
  const widgetUrl = process.env.WIDGET_CDN_URL || "https://widget.clayo.co"

  return `<!-- Clayo Chat Widget -->
<script>
  window.ClayoConfig = {
    organizationId: "${organizationId}",
    primaryColor: "${config.primaryColor || "#000000"}",
    secondaryColor: "${config.secondaryColor || "#f8fafc"}",
    position: "${config.position || "bottom-right"}",
    welcomeMessage: "${config.welcomeMessage || "Hello! How can I help you today?"}",
    companyName: "${config.companyName || "Your Company"}",
    agentName: "${config.agentName || "AI Assistant"}",
    showAvatar: ${config.showAvatar || true},
    enableFileUpload: ${config.enableFileUpload || true},
    enableEmojis: ${config.enableEmojis || true},
    autoOpen: ${config.autoOpen || false},
    autoOpenDelay: ${config.autoOpenDelay || 3000},
    widgetWidth: ${config.widgetWidth || 380},
    widgetHeight: ${config.widgetHeight || 600},
    borderRadius: ${config.borderRadius || 16},
    fontSize: ${config.fontSize || 14},
    fontFamily: "${config.fontFamily || "Inter, system-ui, sans-serif"}",
    enableSoundNotifications: ${config.enableSoundNotifications || false},
    showPoweredBy: ${config.showPoweredBy !== false},
    maxMessageLength: ${config.maxMessageLength || 1000}
  };
</script>
<script src="${widgetUrl}/embed.js" async></script>`
}

/**
 * Get default widget configuration
 */
function getDefaultWidgetConfig(organizationId) {
  return {
    organization_id: organizationId,
    config: {
      // Appearance
      primaryColor: "#000000",
      secondaryColor: "#f8fafc",
      textColor: "#1f2937",
      backgroundColor: "#ffffff",
      borderRadius: 16,
      fontSize: 14,
      fontFamily: "Inter, system-ui, sans-serif",
      headerHeight: 60,

      // Behavior
      welcomeMessage: "Hello! How can I help you today?",
      placeholderText: "Type your message...",
      position: "bottom-right",
      autoOpen: false,
      autoOpenDelay: 3000,
      showAvatar: true,
      showTypingIndicator: true,
      showOnlineStatus: true,

      // Branding
      companyName: "Your Company",
      companyLogo: "",
      agentName: "AI Assistant",
      agentAvatar: "",

      // Features
      enableFileUpload: true,
      enableEmojis: true,
      enableSoundNotifications: false,
      enableOfflineMessage: true,
      offlineMessage: "We're currently offline. Leave a message and we'll get back to you!",
      showPoweredBy: true,
      enableRating: true,

      // Advanced
      customCSS: "",
      allowedDomains: [],
      maxMessageLength: 1000,
      rateLimitMessages: 10,
      rateLimitWindow: 60,
      widgetWidth: 380,
      widgetHeight: 600,
    },
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

/**
 * Handle getting widget configuration
 */
async function handleGetWidgetConfig(req, res) {
  try {
    const organizationId = req.user.organization_id

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        error: "Organization ID not found",
      })
    }

    const result = await getWidgetConfig(organizationId)

    if (!result.success) {
      return res.status(500).json(result)
    }

    res.status(200).json({
      success: true,
      config: result.config,
      embedCode: generateEmbedCode(organizationId, result.config.config || result.config),
    })
  } catch (error) {
    console.error("Handle get widget config error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to get widget configuration",
    })
  }
}

/**
 * Handle saving widget configuration
 */
async function handleSaveWidgetConfig(req, res) {
  try {
    const organizationId = req.user.organization_id
    const config = req.body

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        error: "Organization ID not found",
      })
    }

    console.log("Saving widget configuration:", {
      organizationId,
      configKeys: Object.keys(config),
    })

    const result = await saveWidgetConfig(organizationId, config)

    if (!result.success) {
      return res.status(500).json(result)
    }

    res.status(200).json({
      success: true,
      message: "Widget configuration saved successfully",
      config: result.config,
      embedCode: generateEmbedCode(organizationId, config),
    })
  } catch (error) {
    console.error("Handle save widget config error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to save widget configuration",
    })
  }
}

/**
 * Handle getting public widget configuration (for embed)
 */
async function handleGetPublicWidgetConfig(req, res) {
  try {
    const { organizationId } = req.params

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        error: "Organization ID is required",
      })
    }

    const result = await getWidgetConfig(organizationId)

    if (!result.success) {
      return res.status(500).json(result)
    }

    // Only return public configuration (no sensitive data)
    const publicConfig = {
      ...result.config.config,
      organizationId: organizationId,
    }

    res.status(200).json({
      success: true,
      config: publicConfig,
    })
  } catch (error) {
    console.error("Handle get public widget config error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to get widget configuration",
    })
  }
}

module.exports = {
  getWidgetConfig,
  saveWidgetConfig,
  generateEmbedCode,
  getDefaultWidgetConfig,
  handleGetWidgetConfig,
  handleSaveWidgetConfig,
  handleGetPublicWidgetConfig,
}
