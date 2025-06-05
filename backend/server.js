const express = require("express")
const cors = require("cors")
const multer = require("multer")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
require("dotenv").config()
const crypto = require("crypto")
const { exec } = require("child_process")
const { supabaseAdmin } = require("./SupabaseClient")

// Import AI Customer Support service functions
const {
  uploadDocument,
  addUrl,
  addText,
  getKnowledgeItems,
  deleteKnowledgeItem,
  getProcessingStatus,
} = require("./AppFeatures/AgentTrainingCreation/FileKnowledgeService")

const { createAgent, getAgents, updateAgent } = require("./AppFeatures/AgentTrainingCreation/AgentService")

const { processMessage, createSession } = require("./AppFeatures/AgentTrainingCreation/ChatService")

// Import your existing handlers
const {
  updateOrganizationOnboarding,
  updateOnboardingStep,
  getUserOnboardingStatus,
} = require("./Auth/OnboardingService")



const { sendUserConfirmationEmail, resendConfirmationEmail } = require("./Emails/EmailAuthLinkService")
const { createUserWithOrganization } = require("./Auth/SignupAuthService")
const { authenticateUser } = require("./Auth/AuthenticateUser")
const { createAndSendInvitation } = require("./Emails/InviteTeamEmail/InviteAuthService")
const { handleCancelTeamInvitationRequest } = require("./Team/CancelTeamInvite")
const { handleInviteSignup } = require("./Auth/SignupInviteAPI")
const { handleFetchTeamMembersRequest } = require("./Team/FetchTeamData")
const { handleValidateInvitationRequest } = require("./Team/ValidateInvite")
const { handleFetchUserDataRequest } = require("./Users/FetchAuthenticatedUser")
const { handleGetUserData } = require("./Users/GetUserData")
const { handleSignIn } = require("./Auth/SignInAuthService")
const { handleAcceptInvitationRequest } = require("./Team/AcceptInvitation")
const { handleBookDemoRequest } = require("./Users/BookDemo")

const app = express()

app.use(
  cors({
    origin: ["https://clayo.co", "https://www.clayo.co", "http://localhost:1003"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)

//Live
const port = process.env.PORT || 2222

// ===== SECURITY MIDDLEWARE =====

// 1. HTTPS Enforcement (Force secure connections)
app.use((req, res, next) => {
  if (process.env.NODE_ENV === "production" && !req.secure && req.get("x-forwarded-proto") !== "https") {
    return res.redirect(301, `https://${req.get("host")}${req.url}`)
  }
  next()
})

// 2. Security Headers (Maritime-grade protection)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https://*.supabase.co"],
        fontSrc: ["'self'", "https:", "data:"],
      },
    },
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
    crossOriginEmbedderPolicy: false, // Allow document previews
  }),
)

// 3. Rate Limiting (Anti-brute force protection for auth only)

// Strict rate limiting for authentication endpoints only
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window per IP
  message: {
    error: "Too many authentication attempts from this IP. Please try again in 15 minutes.",
    type: "RATE_LIMIT_AUTH",
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for successful requests
  skipSuccessfulRequests: true,
})

// ===== FILE UPLOAD CONFIGURATION =====
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "image/jpeg",
      "image/png",
    ]

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error("File type not allowed"), false)
    }
  },
})

// ===== BASIC MIDDLEWARE =====
app.use(express.json({ limit: "10mb" }))

// ===== KNOWLEDGE BASE ENDPOINTS =====

// Upload document to knowledge base
app.post("/api/knowledge/upload", authenticateUser, upload.single("file"), async (req, res) => {
  try {
    const { agentId, category, title } = req.body
    const organizationId = req.user.organization_id

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded",
      })
    }

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        error: "Organization ID not found",
      })
    }

    const result = await uploadDocument({
      file: req.file,
      organizationId,
      agentId,
      category,
      title,
      userId: req.user.user_id,
    })

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error,
      })
    }

    res.status(200).json({
      success: true,
      message: "Document uploaded and queued for processing",
      data: result.data,
    })
  } catch (error) {
    console.error("Knowledge upload error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to upload document",
    })
  }
})

// Add URL to knowledge base
app.post("/api/knowledge/url", authenticateUser, async (req, res) => {
  try {
    const { url, agentId, category } = req.body
    const organizationId = req.user.organization_id

    if (!url) {
      return res.status(400).json({
        success: false,
        error: "URL is required",
      })
    }

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        error: "Organization ID not found",
      })
    }

    const result = await addUrl({
      url,
      organizationId,
      agentId,
      category,
      userId: req.user.user_id,
    })

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error,
      })
    }

    res.status(200).json({
      success: true,
      message: "URL content added to knowledge base",
      data: result.data,
    })
  } catch (error) {
    console.error("Knowledge URL error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to process URL",
    })
  }
})

// Add text content to knowledge base
app.post("/api/knowledge/text", authenticateUser, async (req, res) => {
  try {
    const { title, content, agentId, category } = req.body
    const organizationId = req.user.organization_id

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        error: "Title and content are required",
      })
    }

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        error: "Organization ID not found",
      })
    }

    const result = await addText({
      title,
      content,
      organizationId,
      agentId,
      category,
      userId: req.user.user_id,
    })

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error,
      })
    }

    res.status(200).json({
      success: true,
      message: "Text content added to knowledge base",
      data: result.data,
    })
  } catch (error) {
    console.error("Knowledge text error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to add text content",
    })
  }
})

// Get knowledge base items
app.get("/api/knowledge", authenticateUser, async (req, res) => {
  try {
    const { agentId } = req.query
    const organizationId = req.user.organization_id

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        error: "Organization ID not found",
      })
    }

    const result = await getKnowledgeItems(organizationId, agentId)

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error,
      })
    }

    res.status(200).json({
      success: true,
      items: result.items,
    })
  } catch (error) {
    console.error("Get knowledge error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to fetch knowledge base",
    })
  }
})

// Get processing status
app.get("/api/knowledge/status/:id", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Knowledge item ID is required",
      })
    }

    const result = await getProcessingStatus(id)

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error,
      })
    }

    res.status(200).json({
      success: true,
      status: result.status,
      metadata: result.metadata,
    })
  } catch (error) {
    console.error("Get status error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to get processing status",
    })
  }
})

// Delete knowledge item
app.delete("/api/knowledge/:id", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params
    const organizationId = req.user.organization_id

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Knowledge item ID is required",
      })
    }

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        error: "Organization ID not found",
      })
    }

    const result = await deleteKnowledgeItem(id, organizationId)

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error,
      })
    }

    res.status(200).json({
      success: true,
      message: "Knowledge item deleted successfully",
    })
  } catch (error) {
    console.error("Delete knowledge error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to delete knowledge item",
    })
  }
})

// ===== AI AGENT ENDPOINTS =====

// Create new AI agent
app.post("/api/agents", authenticateUser, async (req, res) => {
  try {
    const agentData = {
      ...req.body,
      organizationId: req.user.organization_id,
      createdBy: req.user.user_id,
    }

    if (!agentData.name) {
      return res.status(400).json({
        success: false,
        error: "Agent name is required",
      })
    }

    const result = await createAgent(agentData)

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error,
      })
    }

    res.status(200).json({
      success: true,
      message: "AI agent created successfully",
      agent: result.agent,
    })
  } catch (error) {
    console.error("Create agent error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to create AI agent",
    })
  }
})

// Get AI agents for organization
app.get("/api/agents", authenticateUser, async (req, res) => {
  try {
    const organizationId = req.user.organization_id

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        error: "Organization ID not found",
      })
    }

    const result = await getAgents(organizationId)

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error,
      })
    }

    res.status(200).json({
      success: true,
      agents: result.agents,
    })
  } catch (error) {
    console.error("Get agents error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to fetch AI agents",
    })
  }
})

// Update AI agent
app.put("/api/agents/:id", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body
    const organizationId = req.user.organization_id

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Agent ID is required",
      })
    }

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        error: "Organization ID not found",
      })
    }

    const result = await updateAgent(id, updateData, organizationId)

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error,
      })
    }

    res.status(200).json({
      success: true,
      message: "AI agent updated successfully",
      agent: result.agent,
    })
  } catch (error) {
    console.error("Update agent error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to update AI agent",
    })
  }
})

// ===== CHAT ENDPOINTS =====

// Create new chat session
app.post("/api/chat/session", authenticateUser, async (req, res) => {
  try {
    const { agentId, customerId } = req.body
    const organizationId = req.user.organization_id

    if (!agentId) {
      return res.status(400).json({
        success: false,
        error: "Agent ID is required",
      })
    }

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        error: "Organization ID not found",
      })
    }

    const result = await createSession({
      agentId,
      customerId,
      organizationId,
    })

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error,
      })
    }

    res.status(200).json({
      success: true,
      message: "Chat session created successfully",
      session: result.session,
    })
  } catch (error) {
    console.error("Create session error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to create chat session",
    })
  }
})

// Handle chat messages with streaming (your proven approach)
app.post("/api/chat/message", authenticateUser, async (req, res) => {
  try {
    const { message, sessionId, agentId } = req.body
    const organizationId = req.user.organization_id

    if (!message || !sessionId || !agentId) {
      return res.status(400).json({
        success: false,
        error: "Message, session ID, and agent ID are required",
      })
    }

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        error: "Organization ID not found",
      })
    }

    // Set up SSE for streaming response (your proven pattern)
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Cache-Control",
    })

    const onChunk = (chunk) => {
      res.write(`data: ${JSON.stringify({ type: "chunk", content: chunk })}\n\n`)
    }

    const result = await processMessage({
      message,
      sessionId,
      agentId,
      organizationId,
      onChunk,
    })

    res.write(`data: ${JSON.stringify({ type: "complete", result })}\n\n`)
    res.end()
  } catch (error) {
    console.error("Chat message error:", error)
    res.write(`data: ${JSON.stringify({ type: "error", error: error.message })}\n\n`)
    res.end()
  }
})

// ===== PUBLIC CHAT ENDPOINT (for customer-facing chat widget) =====

// Public chat endpoint (no authentication required for customers)
app.post("/api/public/chat/message", async (req, res) => {
  try {
    const { message, sessionId, agentId, organizationId } = req.body

    if (!message || !sessionId || !agentId || !organizationId) {
      return res.status(400).json({
        success: false,
        error: "Message, session ID, agent ID, and organization ID are required",
      })
    }

    // Set up SSE for streaming response
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Cache-Control",
    })

    const onChunk = (chunk) => {
      res.write(`data: ${JSON.stringify({ type: "chunk", content: chunk })}\n\n`)
    }

    const result = await processMessage({
      message,
      sessionId,
      agentId,
      organizationId,
      onChunk,
    })

    res.write(`data: ${JSON.stringify({ type: "complete", result })}\n\n`)
    res.end()
  } catch (error) {
    console.error("Public chat error:", error)
    res.write(`data: ${JSON.stringify({ type: "error", error: error.message })}\n\n`)
    res.end()
  }
})

// Public session creation (for customer-facing chat widget)
app.post("/api/public/chat/session", async (req, res) => {
  try {
    const { agentId, organizationId, customerId } = req.body

    if (!agentId || !organizationId) {
      return res.status(400).json({
        success: false,
        error: "Agent ID and organization ID are required",
      })
    }

    const result = await createSession({
      agentId,
      customerId: customerId || null,
      organizationId,
    })

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error,
      })
    }

    res.status(200).json({
      success: true,
      message: "Chat session created successfully",
      session: result.session,
    })
  } catch (error) {
    console.error("Public session creation error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to create chat session",
    })
  }
})

// ===== YOUR EXISTING ENDPOINTS =====

app.post("/api/send-confirmation-email", authLimiter, async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: "Email is required" })
    }

    const result = await sendUserConfirmationEmail(email)

    if (!result.success) {
      return res.status(500).json({ error: result.error })
    }

    res.status(200).json({ message: "Confirmation email sent successfully" })
  } catch (error) {
    console.error("Error sending confirmation email:", error)
    res.status(500).json({ error: "Failed to send confirmation email" })
  }
})

app.post("/api/resend-confirmation-email", authLimiter, async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: "Email is required" })
    }

    const result = await resendConfirmationEmail(email)

    if (!result.success) {
      return res.status(500).json({ error: result.error })
    }

    res.status(200).json({ message: "Confirmation email resent successfully" })
  } catch (error) {
    console.error("Error resending confirmation email:", error)
    res.status(500).json({ error: "Failed to resend confirmation email" })
  }
})

app.post("/api/signin", authLimiter, async (req, res) => {
  try {
    await handleSignIn(req, res)
  } catch (error) {
    console.error("Error during sign in:", error)
    res.status(500).json({
      success: false,
      error: "Authentication failed",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

// Updated signup endpoint to match your style
app.post("/api/signup", authLimiter, async (req, res) => {
  try {
    const { email, password, fullName, companyName } = req.body

    // Validate required fields
    if (!email || !password || !fullName || !companyName) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
        details: "Email, password, full name, and company name are required",
      })
    }

    // Create user and organization (updated function name)
    const result = await createUserWithOrganization({
      email,
      password,
      fullName,
      companyName,
    })

    // Send confirmation email
    const emailResult = await sendUserConfirmationEmail(email)

    if (!emailResult.success) {
      console.warn(`User created but confirmation email failed: ${emailResult.error}`)
    }

    // Return success response (updated to use 'organization' instead of 'company')
    res.status(200).json({
      success: true,
      message: "Account created successfully",
      user: result.user,
      organization: result.organization, // Updated from 'company' to 'organization'
      emailSent: emailResult.success,
    })
  } catch (error) {
    console.error("Signup error:", error)

    res.status(500).json({
      success: false,
      error: "Failed to create account",
      message: error.message || "An unexpected error occurred",
    })
  }
})

// POST /api/book-demo
app.post("/api/book-demo", async (req, res) => {
  try {
    await handleBookDemoRequest(req, res)
  } catch (error) {
    console.error("Error booking demo:", error)
    res.status(500).json({
      success: false,
      error: "Failed to book demo",
    })
  }
})

// Add this to your existing routes in server.js
app.post("/api/invite-signup", authLimiter, async (req, res) => {
  try {
    await handleInviteSignup(req, res)
  } catch (error) {
    console.error("Error in invite signup:", error)
    res.status(500).json({ error: "Failed to process invitation signup" })
  }
})

app.post("/api/send-team-invitation", authenticateUser, async (req, res) => {
  try {
    const { email, role } = req.body

    if (!email || !role) {
      return res.status(400).json({ error: "Email and role are required" })
    }

    // Get user ID from the authenticated user object
    const userId = req.user.user_id

    // If somehow the user ID is missing, return an error
    if (!userId) {
      return res.status(401).json({ error: "User ID not found in authenticated session" })
    }

    const result = await createAndSendInvitation(email, role, userId)

    if (!result.success) {
      return res.status(500).json({ error: result.error })
    }

    res.status(200).json({
      message: "Team invitation sent successfully",
      invitationId: result.invitationId,
    })
  } catch (error) {
    console.error("Error sending team invitation:", error)
    res.status(500).json({ error: "Failed to send team invitation" })
  }
})

app.post("/api/accept-invitation", async (req, res) => {
  try {
    await handleAcceptInvitationRequest(req, res)
  } catch (error) {
    console.error("Error accepting invitation:", error)
    res.status(500).json({
      success: false,
      error: "Failed to accept invitation",
    })
  }
})

app.post("/api/validate-invitation", async (req, res) => {
  try {
    await handleValidateInvitationRequest(req, res)
  } catch (error) {
    console.error("Error validating invitation token:", error)
    res.status(500).json({
      success: false,
      error: "Failed to validate invitation token",
    })
  }
})

// Add this to your existing routes file or where you define your API routes
app.post("/api/cancel-team-invitation", authenticateUser, async (req, res) => {
  try {
    // The handleCancelTeamInvitationRequest handler will handle the request
    await handleCancelTeamInvitationRequest(req, res)
  } catch (error) {
    console.error("Error cancelling team invitation:", error)
    res.status(500).json({ error: "Failed to cancel team invitation" })
  }
})

app.get("/api/team-members", authenticateUser, async (req, res) => {
  try {
    await handleFetchTeamMembersRequest(req, res)
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch team members",
    })
  }
})

app.get("/api/get-users", authenticateUser, async (req, res) => {
  try {
    await handleGetUserData(req, res)
  } catch (error) {
    console.error("Error retrieving user data:", error)
    res.status(500).json({ error: "Failed to retrieve user data" })
  }
})

app.get("/api/auth/current-user", authenticateUser, async (req, res) => {
  try {
    // Get user ID from auth or header as backup
    const userId = req.user?.user_id || req.headers["x-user-id"]

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "User ID not found",
      })
    }

    // Ensure req.user exists
    if (!req.user && userId) {
      req.user = { user_id: userId }
    }

    await handleFetchUserDataRequest(req, res)
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch user data",
    })
  }
})

// Simple auth middleware - just get user ID
const getUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
      return res.status(401).json({ success: false, error: "No token" })
    }

    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token)

    if (error || !user) {
      return res.status(401).json({ success: false, error: "Invalid token" })
    }

    // Get user from database
    const { data: userData } = await supabaseAdmin.from("users").select("*").eq("email", user.email).single()

    if (!userData) {
      return res.status(401).json({ success: false, error: "User not found" })
    }

    req.userId = userData.id
    req.organizationId = userData.organization_id
    next()
  } catch (error) {
    res.status(401).json({ success: false, error: "Auth failed" })
  }
}

// Get onboarding status
app.get("/api/get-onboarding-status", getUser, async (req, res) => {
  try {
    // Get organization data
    const { data: org } = await supabaseAdmin.from("organizations").select("*").eq("id", req.organizationId).single()

    // Get user data
    const { data: user } = await supabaseAdmin.from("users").select("*").eq("id", req.userId).single()

    res.json({
      success: true,
      currentStep: user?.onboarding_step || "company",
      isCompleted: user?.onboarding_step === "completed",
      organization: org,
      integrations: [],
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Update onboarding step
app.post("/api/update-onboarding-step", getUser, async (req, res) => {
  try {
    const { step, data } = req.body

    // Update organization settings
    const currentSettings = {}
    const updatedSettings = { ...currentSettings, ...data }

    await supabaseAdmin.from("organizations").update({ settings: updatedSettings }).eq("id", req.organizationId)

    // Update user step
    await supabaseAdmin.from("users").update({ onboarding_step: step }).eq("id", req.userId)

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Complete onboarding
app.post("/api/complete-onboarding", getUser, async (req, res) => {
  try {
    const data = req.body

    // Update organization
    await supabaseAdmin
      .from("organizations")
      .update({
        name: data.companyName,
        domain: data.website,
        settings: { ...data, onboarding_completed: true },
      })
      .eq("id", req.organizationId)

    // Update user
    await supabaseAdmin.from("users").update({ onboarding_step: "completed" }).eq("id", req.userId)

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Start server
app.listen(port, "0.0.0.0", () => {
  console.log(`🚢 AI Customer Support backend is running securely on port ${port}`)
  console.log(`🤖 AI endpoints enabled: Knowledge Base, Agents, Chat`)
})
