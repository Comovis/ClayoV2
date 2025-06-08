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

const {
  handleGetAgentConfig,
  handleUpdateAgentConfig,
  handleTestAgentConfig,
  handlePrepareAgentForChat,
} = require("./AppFeatures/AgentTrainingCreation/AgentConfigService")


// Import session handlers
const {
  handleGetAgentSessions,
  handleGetSessionMessages,
  handleUpdateSessionStatus,
  handleGetSessionAnalytics,
} = require("./AppFeatures/AgentTrainingCreation/SessionHandler")

// Import analytics handlers  
const {
  handleGetAgentAnalytics,
  handleGetOrganizationAnalytics,
  handleGetConversationMetrics,
} = require("./AppFeatures/AgentTrainingCreation/AnalyticsHandler")

// Import enhanced chat service (to replace existing chat endpoints)
const {
  handleChatMessage,
  handlePublicChatMessage,
  handleCreateChatSession,
  handleCreatePublicChatSession,
  processMessage, 
  createSession
} = require("./AppFeatures/AgentTrainingCreation/ChatService")

const {
  handleGetWidgetConfig,
  handleSaveWidgetConfig,
  handleGetPublicWidgetConfig,
} = require("./AppFeatures/WidgetConfig/WidgetConfigService")

// Import Blog Service functions
const {
  createBlogPost,
  getPublishedBlogPosts,
  getBlogPostBySlug,
  getAllBlogPostsForAdmin,
  updateBlogPost,
  deleteBlogPost,
  getBlogPostById
} = require("./AppFeatures/Blog/BlogService"); 


const {
  generateBlogPost,
  generateBlogTopicSuggestions,
  generateSEOMetadata,
  saveBlogPost,
  BLOG_TOPICS_SUGGESTIONS
} = require("./AppFeatures/Blog/AIBlogService");

const { createAgent, getAgents, updateAgent } = require("./AppFeatures/AgentTrainingCreation/AgentService")

const { handleGetAgentStatus } = require("./AppFeatures/AgentTrainingCreation/AgentStatusHandler")





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

//Hellox

// ===== GITHUB - WEBHOOK =====
// Add GitHub webhook endpoint
app.post('/github-webhook', express.json(), (req, res) => {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret) {
    console.error('Webhook secret not set in environment variables');
    return res.status(500).send('Server configuration error');
  }

  const signature = `sha256=${crypto.createHmac('sha256', secret).update(JSON.stringify(req.body)).digest('hex')}`;
  const githubSignature = req.headers['x-hub-signature-256'];

  if (!githubSignature || signature !== githubSignature) {
    console.error('Unauthorized: Signature mismatch');
    return res.status(401).send('Unauthorized');
  }

  console.log(`🚢 Received push event for ref: ${req.body.ref}`);

  if (req.body.ref === 'refs/heads/master') {
    console.log('⚓ Starting Clayo deployment...');
    
    // Respond to GitHub IMMEDIATELY
    res.status(200).send('Deployment initiated successfully');
    
    // Run deployment in background with setTimeout to ensure response is sent first
    setTimeout(() => {
      exec(
        'cd /var/www/Clayo/backend && git pull origin master && npm install --production && pm2 reload Clayo',
        (error, stdout, stderr) => {
          if (error) {
            console.error(`🚨 Deployment error: ${error.message}`);
            console.error(`stderr: ${stderr}`);
          } else {
            console.log(`✅ Deployment completed successfully`);
            console.log(`stdout: ${stdout}`);
            if (stderr) console.log(`stderr: ${stderr}`);
          }
        }
      );
    }, 100); // Small delay to ensure response is sent
    
  } else {
    res.status(200).send('Push event to non-master branch, no action taken');
  }
});




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



// ===== AGENT CONFIGURATION ENDPOINTS =====

// Get agent configuration
app.get("/api/agents/:agentId/config", authenticateUser, async (req, res) => {
  try {
    await handleGetAgentConfig(req, res)
  } catch (error) {
    console.error("Error getting agent config:", error)
    res.status(500).json({
      success: false,
      error: "Failed to get agent configuration",
    })
  }
})

// Update agent configuration
app.put("/api/agents/:agentId/config", authenticateUser, async (req, res) => {
  try {
    await handleUpdateAgentConfig(req, res)
  } catch (error) {
    console.error("Error updating agent config:", error)
    res.status(500).json({
      success: false,
      error: "Failed to update agent configuration",
    })
  }
})

// Test agent configuration
app.post("/api/agents/:agentId/test", authenticateUser, async (req, res) => {
  try {
    await handleTestAgentConfig(req, res)
  } catch (error) {
    console.error("Error testing agent config:", error)
    res.status(500).json({
      success: false,
      error: "Failed to test agent configuration",
    })
  }
})

// Prepare agent for chat (debugging endpoint)
app.get("/api/agents/:agentId/prepare", authenticateUser, async (req, res) => {
  try {
    await handlePrepareAgentForChat(req, res)
  } catch (error) {
    console.error("Error preparing agent for chat:", error)
    res.status(500).json({
      success: false,
      error: "Failed to prepare agent for chat",
    })
  }
})


// ===== SESSION MANAGEMENT ENDPOINTS =====

// Get all sessions for an agent
app.get("/api/agents/:agentId/sessions", authenticateUser, async (req, res) => {
  try {
    await handleGetAgentSessions(req, res)
  } catch (error) {
    console.error("Error getting agent sessions:", error)
    res.status(500).json({
      success: false,
      error: "Failed to get agent sessions",
    })
  }
})

// Get messages for a specific session
app.get("/api/sessions/:sessionId/messages", authenticateUser, async (req, res) => {
  try {
    await handleGetSessionMessages(req, res)
  } catch (error) {
    console.error("Error getting session messages:", error)
    res.status(500).json({
      success: false,
      error: "Failed to get session messages",
    })
  }
})

// Update session status (active, closed, escalated)
app.put("/api/sessions/:sessionId/status", authenticateUser, async (req, res) => {
  try {
    await handleUpdateSessionStatus(req, res)
  } catch (error) {
    console.error("Error updating session status:", error)
    res.status(500).json({
      success: false,
      error: "Failed to update session status",
    })
  }
})

// Get analytics for a specific session
app.get("/api/sessions/:sessionId/analytics", authenticateUser, async (req, res) => {
  try {
    await handleGetSessionAnalytics(req, res)
  } catch (error) {
    console.error("Error getting session analytics:", error)
    res.status(500).json({
      success: false,
      error: "Failed to get session analytics",
    })
  }
})

// ===== ANALYTICS ENDPOINTS =====

// Get comprehensive analytics for an agent
app.get("/api/agents/:agentId/analytics", authenticateUser, async (req, res) => {
  try {
    await handleGetAgentAnalytics(req, res)
  } catch (error) {
    console.error("Error getting agent analytics:", error)
    res.status(500).json({
      success: false,
      error: "Failed to get agent analytics",
    })
  }
})

// Get organization-wide analytics
app.get("/api/analytics/organization", authenticateUser, async (req, res) => {
  try {
    await handleGetOrganizationAnalytics(req, res)
  } catch (error) {
    console.error("Error getting organization analytics:", error)
    res.status(500).json({
      success: false,
      error: "Failed to get organization analytics",
    })
  }
})

// Get conversation metrics (response times, satisfaction, etc.)
app.get("/api/analytics/conversations", authenticateUser, async (req, res) => {
  try {
    await handleGetConversationMetrics(req, res)
  } catch (error) {
    console.error("Error getting conversation metrics:", error)
    res.status(500).json({
      success: false,
      error: "Failed to get conversation metrics",
    })
  }
})

// Get analytics for specific date range
app.get("/api/analytics/range", authenticateUser, async (req, res) => {
  try {
    const { startDate, endDate, agentId } = req.query
    req.query = { ...req.query, startDate, endDate, agentId }
    await handleGetAgentAnalytics(req, res)
  } catch (error) {
    console.error("Error getting date range analytics:", error)
    res.status(500).json({
      success: false,
      error: "Failed to get analytics for date range",
    })
  }
})

// ===== ENHANCED CHAT ENDPOINTS (REPLACE YOUR EXISTING ONES) =====

// REPLACE your existing "/api/chat/message" endpoint with this enhanced version
app.post("/api/chat/message", authenticateUser, async (req, res) => {
  try {
    await handleChatMessage(req, res)
  } catch (error) {
    console.error("Error processing enhanced chat message:", error)
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: "Failed to process chat message",
      })
    }
  }
})

// REPLACE your existing "/api/chat/session" endpoint with this enhanced version
app.post("/api/chat/session", authenticateUser, async (req, res) => {
  try {
    await handleCreateChatSession(req, res)
  } catch (error) {
    console.error("Error creating enhanced chat session:", error)
    res.status(500).json({
      success: false,
      error: "Failed to create chat session",
    })
  }
})

// REPLACE your existing "/api/public/chat/message" endpoint with this enhanced version
app.post("/api/public/chat/message", async (req, res) => {
  try {
    await handlePublicChatMessage(req, res)
  } catch (error) {
    console.error("Error processing enhanced public chat message:", error)
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: "Failed to process public chat message",
      })
    }
  }
})

// REPLACE your existing "/api/public/chat/session" endpoint with this enhanced version
app.post("/api/public/chat/session", async (req, res) => {
  try {
    await handleCreatePublicChatSession(req, res)
  } catch (error) {
    console.error("Error creating enhanced public chat session:", error)
    res.status(500).json({
      success: false,
      error: "Failed to create public chat session",
    })
  }
})


app.get("/api/agents/:agentId/status", authenticateUser, async (req, res) => {
  try {
    await handleGetAgentStatus(req, res)
  } catch (error) {
    console.error("Error fetching agent status:", error)
    res.status(500).json({
      success: false,
      error: "Failed to fetch agent status",
    })
  }
})


// ===== WIDGET CONFIGURATION ENDPOINTS =====

// Get widget configuration
app.get("/api/widget/config", authenticateUser, async (req, res) => {
  try {
    await handleGetWidgetConfig(req, res)
  } catch (error) {
    console.error("Error fetching widget config:", error)
    res.status(500).json({
      success: false,
      error: "Failed to fetch widget configuration",
    })
  }
})

// Save widget configuration
app.post("/api/widget/config", authenticateUser, async (req, res) => {
  try {
    await handleSaveWidgetConfig(req, res)
  } catch (error) {
    console.error("Error saving widget config:", error)
    res.status(500).json({
      success: false,
      error: "Failed to save widget configuration",
    })
  }
})

// Get public widget configuration (for embed)
app.get("/api/widget/config/public/:organizationId", async (req, res) => {
  try {
    await handleGetPublicWidgetConfig(req, res)
  } catch (error) {
    console.error("Error fetching public widget config:", error)
    res.status(500).json({
      success: false,
      error: "Failed to fetch widget configuration",
    })
  }
})



// =====================================================================
// Blog API Endpoints
// =====================================================================


// GET /api/blog/posts - Get all published blog posts
app.get("/api/blog/posts", async (req, res) => {
  try {
    const posts = await getPublishedBlogPosts();
    return res.status(200).json(posts);
  } catch (error) {
    console.error("Error in GET /api/blog/posts:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch blog posts.",
    });
  }
});

// GET /api/blog/posts/:slug - Get a single published blog post by slug
app.get("/api/blog/posts/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await getBlogPostBySlug(slug);
    return res.status(200).json(post);
  } catch (error) {
    console.error(`Error in GET /api/blog/posts/${req.params.slug}:`, error);
    if (
      error.message === "Blog post not found or not published." ||
      error.message.includes("No rows found")
    ) {
      return res.status(404).json({ success: false, error: error.message });
    }
    return res.status(500).json({
      success: false,
      error: "Failed to fetch blog post.",
    });
  }
});

// --- Admin Blog Endpoints (Authentication & Clayo Admin Privileges Required) ---

// GET /api/admin/blog/posts - Get all blog posts (including drafts) for admin view
app.get("/api/admin/blog/posts", authenticateUser, async (req, res) => {
  try {
    // Use the correct user ID field from your auth middleware
    const userId = req.user.user_id || req.user.id;
    const posts = await getAllBlogPostsForAdmin(userId);
    return res.status(200).json(posts);
  } catch (error) {
    console.error("Error in GET /api/admin/blog/posts:", error);
    if (error.message.includes("Unauthorized")) {
      return res.status(401).json({ success: false, error: error.message });
    }
    return res.status(500).json({
      success: false,
      error: "Failed to fetch all blog posts for admin.",
    });
  }
});

// GET /api/admin/blog/posts/:id - Get a single blog post by ID for admin
app.get("/api/admin/blog/posts/:id", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id || req.user.id;
    
    // You'll need to add this function to your BlogService.js
    const post = await getBlogPostById(id, userId);
    return res.status(200).json(post);
  } catch (error) {
    console.error(`Error in GET /api/admin/blog/posts/${req.params.id}:`, error);
    if (error.message.includes("Unauthorized")) {
      return res.status(401).json({ success: false, error: error.message });
    }
    if (error.message.includes("not found")) {
      return res.status(404).json({ success: false, error: error.message });
    }
    return res.status(500).json({
      success: false,
      error: "Failed to fetch blog post.",
    });
  }
});

// POST /api/admin/blog/posts - Create a new blog post (with optional image upload)
app.post("/api/admin/blog/posts", upload.single('image'), authenticateUser, async (req, res) => {
  try {
    console.log("=== BLOG POST CREATION REQUEST ===");
    console.log("req.body:", req.body);
    console.log("req.file:", req.file ? { ...req.file, buffer: '[Buffer]' } : null);
    
    const userId = req.user.user_id || req.user.id;
    const organizationId = req.user.organization_id;
    
    console.log("userId:", userId);
    console.log("organizationId:", organizationId);

    // Handle both FormData and JSON requests
    let postData;
    
    if (req.file) {
      // FormData request - data comes from req.body fields
      postData = {
        title: req.body.title,
        slug: req.body.slug,
        excerpt: req.body.excerpt || null,
        content: req.body.content,
        category: req.body.category || null,
        featuredImage: req.body.featuredImage || null,
        status: req.body.status || 'draft',
        seoTitle: req.body.seoTitle || null,
        seoDescription: req.body.seoDescription || null,
        seoKeywords: req.body.seoKeywords ? JSON.parse(req.body.seoKeywords) : [],
        readTime: req.body.readTime ? parseInt(req.body.readTime) : null,
        organizationId: organizationId
      };
    } else {
      // JSON request - data comes from req.body directly
      postData = {
        ...req.body,
        organizationId: organizationId
      };
    }

    console.log("Processed postData:", postData);

    // Validate required fields
    if (!postData.title || !postData.slug || !postData.content) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: title, slug, and content are required"
      });
    }

    const newPost = await createBlogPost(
      postData,
      userId,
      req.file ? req.file.buffer : null,
      req.file ? req.file.originalname : null
    );
    
    return res.status(201).json(newPost);
  } catch (error) {
    console.error("Error in POST /api/admin/blog/posts:", error);
    
    if (error.message.includes("Unauthorized")) {
      return res.status(401).json({ success: false, error: error.message });
    }
    if (error.message.includes("required") || 
        error.message.includes("slug already exists") ||
        error.message.includes("Only image files are allowed")) {
      return res.status(400).json({ success: false, error: error.message });
    }
    return res.status(500).json({
      success: false,
      error: "Failed to create blog post.",
    });
  }
});



// Clean endpoint for GET /api/admin/blog/posts/:id
app.get("/api/admin/blog/posts/:id", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.user_id || req.user.id

    const post = await getBlogPostById(id, userId)
    return res.status(200).json(post)
  } catch (error) {
    console.error(`Error in GET /api/admin/blog/posts/${req.params.id}:`, error)

    if (error.message.includes("Unauthorized")) {
      return res.status(401).json({ success: false, error: error.message })
    }
    if (error.message.includes("not found")) {
      return res.status(404).json({ success: false, error: error.message })
    }
    return res.status(500).json({
      success: false,
      error: "Failed to fetch blog post.",
    })
  }
})




// PUT /api/admin/blog/posts/:id - Update an existing blog post (with optional image upload)
app.put("/api/admin/blog/posts/:id", upload.single('image'), authenticateUser, async (req, res) => {
  try {
    console.log("=== BLOG POST UPDATE REQUEST ===");
    console.log("req.body:", req.body);
    console.log("req.file:", req.file ? { ...req.file, buffer: '[Buffer]' } : null);
    
    const { id } = req.params;
    const userId = req.user.user_id || req.user.id;
    
    // Handle both FormData and JSON requests
    let updateData;
    
    if (req.file) {
      // FormData request
      updateData = {
        title: req.body.title,
        slug: req.body.slug,
        excerpt: req.body.excerpt,
        content: req.body.content,
        category: req.body.category,
        featuredImage: req.body.featuredImage,
        status: req.body.status,
        seoTitle: req.body.seoTitle,
        seoDescription: req.body.seoDescription,
        seoKeywords: req.body.seoKeywords ? JSON.parse(req.body.seoKeywords) : undefined,
        readTime: req.body.readTime ? parseInt(req.body.readTime) : undefined,
      };
      
      // Remove undefined values
      Object.keys(updateData).forEach(key => 
        updateData[key] === undefined && delete updateData[key]
      );
    } else {
      // JSON request
      updateData = req.body;
    }

    console.log("Processed updateData:", updateData);

    const updatedPost = await updateBlogPost(
      id, 
      updateData, 
      userId,
      req.file ? req.file.buffer : null,
      req.file ? req.file.originalname : null
    );
    
    return res.status(200).json(updatedPost);
  } catch (error) {
    console.error(`Error in PUT /api/admin/blog/posts/${req.params.id}:`, error);
    
    if (error.message.includes("Unauthorized")) {
      return res.status(401).json({ success: false, error: error.message });
    }
    if (error.message.includes("not found")) {
      return res.status(404).json({ success: false, error: error.message });
    }
    if (error.message.includes("Only image files are allowed")) {
      return res.status(400).json({ success: false, error: error.message });
    }
    return res.status(500).json({
      success: false,
      error: "Failed to update blog post.",
    });
  }
});

// DELETE /api/admin/blog/posts/:id - Delete a blog post
app.delete("/api/admin/blog/posts/:id", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id || req.user.id;
    await deleteBlogPost(id, userId);
    return res.status(204).send();
  } catch (error) {
    console.error(`Error in DELETE /api/admin/blog/posts/${req.params.id}:`, error);
    if (error.message.includes("Unauthorized")) {
      return res.status(401).json({ success: false, error: error.message });
    }
    if (error.message.includes("not found")) {
      return res.status(404).json({ success: false, error: error.message });
    }
    return res.status(500).json({
      success: false,
      error: "Failed to delete blog post.",
    });
  }
});



/**
 * Generate a blog post with AI
 * POST /api/ai/blog/generate
 */
app.post("/api/ai/blog/generate", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id
    const result = await generateBlogPost({
      ...req.body,
      targetKeywords: req.body.targetKeywords || [],
      tone: req.body.tone || "controversial",
      wordCount: req.body.wordCount || 1500,
      includeCallToAction: req.body.includeCallToAction !== false,
      organizationId: req.user.organization_id,
      userId: userId,
    })
    return res.status(200).json(result)
  } catch (error) {
    console.error("Error in POST /api/ai/blog/generate:", error)
    if (error.message.includes("Unauthorized")) {
      return res.status(401).json({ success: false, error: error.message })
    }
    return res.status(500).json({
      success: false,
      error: "Failed to generate blog post with AI.",
    })
  }
})

/**
 * Generate blog topic suggestions with AI
 * POST /api/ai/blog/topics
 */
app.post("/api/ai/blog/topics", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id
    const result = await generateBlogTopicSuggestions({
      industry: req.body.industry,
      currentTrends: req.body.currentTrends,
      competitorAnalysis: req.body.competitorAnalysis,
      organizationId: req.user.organization_id,
      userId: userId,
    })
    return res.status(200).json(result)
  } catch (error) {
    console.error("Error in POST /api/ai/blog/topics:", error)
    if (error.message.includes("Unauthorized")) {
      return res.status(401).json({ success: false, error: error.message })
    }
    return res.status(500).json({
      success: false,
      error: "Failed to generate blog topic suggestions with AI.",
    })
  }
})

/**
 * Generate SEO metadata for a blog post with AI
 * POST /api/ai/blog/seo
 */
app.post("/api/ai/blog/seo", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id
    const { title, content, targetKeywords } = req.body

    const result = await generateSEOMetadata({
      title,
      content,
      targetKeywords: targetKeywords || [],
      userId: userId,
    })

    return res.status(200).json({
      success: true,
      seoData: result,
    })
  } catch (error) {
    console.error("Error in POST /api/ai/blog/seo:", error)
    if (error.message.includes("Unauthorized")) {
      return res.status(401).json({ success: false, error: error.message })
    }
    return res.status(500).json({
      success: false,
      error: "Failed to generate SEO metadata with AI.",
    })
  }
})

/**
 * Generate and save a blog post with AI in one step
 * POST /api/ai/blog/generate-and-save
 */
app.post("/api/ai/blog/generate-and-save", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id

    // First generate the blog post
    const generationResult = await generateBlogPost({
      ...req.body,
      targetKeywords: req.body.targetKeywords || [],
      tone: req.body.tone || "controversial",
      wordCount: req.body.wordCount || 1500,
      includeCallToAction: req.body.includeCallToAction !== false,
      organizationId: req.user.organization_id,
      userId: userId,
    })

    if (!generationResult.success) {
      return res.status(500).json(generationResult)
    }

    // Then save it to the database
    const saveResult = await saveBlogPost(generationResult.blog, req.user.organization_id, userId)

    if (!saveResult.success) {
      return res.status(500).json(saveResult)
    }

    return res.status(200).json({
      success: true,
      message: "Blog post generated and saved successfully",
      post: saveResult.post,
    })
  } catch (error) {
    console.error("Error in POST /api/ai/blog/generate-and-save:", error)
    if (error.message.includes("Unauthorized")) {
      return res.status(401).json({ success: false, error: error.message })
    }
    return res.status(500).json({
      success: false,
      error: "Failed to generate and save blog post with AI.",
    })
  }
})

/**
 * Check if a blog title already exists
 * POST /api/ai/blog/check-title
 */
app.post("/api/ai/blog/check-title", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id
    const { title } = req.body

    const result = await checkTitleExists(title, userId)
    return res.status(200).json(result)
  } catch (error) {
    console.error("Error in POST /api/ai/blog/check-title:", error)
    if (error.message.includes("Unauthorized")) {
      return res.status(401).json({ success: false, error: error.message })
    }
    return res.status(500).json({
      success: false,
      error: "Failed to check title existence.",
    })
  }
})



// Start server
app.listen(port, "0.0.0.0", () => {
  console.log(`🚢 AI Customer Support backend is running securely on port ${port}`)
  console.log(`🤖 AI endpoints enabled: Knowledge Base, Agents, Chat`)
})
