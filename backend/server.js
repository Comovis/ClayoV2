const express = require("express")
const cors = require("cors")
const multer = require("multer")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
require("dotenv").config()
const crypto = require("crypto")
const { exec } = require("child_process")


// Import your existing handlers
const { sendUserConfirmationEmail, resendConfirmationEmail } = require("./Emails/EmailAuthLinkService")
const { createUserWithCompany } = require("./Auth/SignupAuthService")
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
const { handleGetVesselsRequest } = require("./AppFeatures/Vessels/FetchVessels")
const { handleAddVesselRequest } = require("./AppFeatures/Vessels/AddVessel")
const { processDocumentShareEmails } = require("./Emails/ShareEmail/SendDocumentShareEmail")
const {
  handleCreateDocumentShare,
  handleGetShareByToken,
  handleGetDocumentShares,
  handleRevokeDocumentShare,
  handleLogDocumentAccess,
} = require("./AppFeatures/DocumentSharing/DocumentSharingService")
const {
  handleDocumentUpload,
  handleGetDocument,
  handleGetVesselDocuments,
  handleUpdateDocument,
  handleArchiveDocument,
  handleDocumentDownload,
  handleCleanupTempFiles,
} = require("./AppFeatures/DocumentHub/DocumentUploadsHandler")

const { handleBatchDocumentDownload } = require("./AppFeatures/DocumentHub/BatchDownload")


const app = express()




app.use(cors({
  origin: [
    'https://comovis.co',
    'https://www.comovis.co',
    'http://localhost:1601', // for development
    
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


//


const port = process.env.PORT || 2807

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

// ===== FILE UPLOAD SECURITY =====

const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 1, // Only one file at a time
  },
  // Removed file type restrictions as requested
})

// ===== BASIC MIDDLEWARE =====
app.use(express.json({ limit: "10mb" }))
app.use(cors())

// ===== ENHANCED DOCUMENT SECURITY =====
app.use("/api/documents", (req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff")
  res.setHeader("X-Frame-Options", "DENY")
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private")
  res.setHeader("Pragma", "no-cache")
  next()
})



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
    console.log('⚓ Starting Comovis deployment...');
    
    // Respond to GitHub IMMEDIATELY
    res.status(200).send('Deployment initiated successfully');
    
    // Run deployment in background with setTimeout to ensure response is sent first
    setTimeout(() => {
      exec(
        'cd /var/www/Comovis/backend && git pull origin master && npm install --production && pm2 reload Comovis',
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

//thx









// ===== AUTH & USER SETUP ROUTES =====

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

    // Create user and company
    const result = await createUserWithCompany({
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

    // Return success response
    res.status(200).json({
      success: true,
      message: "Account created successfully",
      user: result.user,
      company: result.company,
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

// ===== FEATURES MAIN APP API ENDPOINTS =====

// GET endpoint for fetching vessels with query parameters
app.get("/api/get-vessels", authenticateUser, async (req, res) => {
  try {
    await handleGetVesselsRequest(req, res)
  } catch (error) {
    console.error("Error fetching vessels:", error)
    res.status(500).json({ error: "Failed to fetch vessels" })
  }
})

app.post("/api/add-vessel", authenticateUser, async (req, res) => {
  try {
    await handleAddVesselRequest(req, res)
  } catch (error) {
    console.error("Error adding vessel:", error)
    res.status(500).json({ error: "Failed to add vessel" })
  }
})

// Share Documents //
app.post("/api/send-document-share-email", authenticateUser, async (req, res) => {
  try {
    const { shareId } = req.body

    // Validate required fields
    if (!shareId) {
      return res.status(400).json({ error: "Share ID is required" })
    }

    // Get user ID from the authenticated user object
    const userId = req.user.user_id

    // If somehow the user ID is missing, return an error
    if (!userId) {
      return res.status(401).json({ error: "User ID not found in authenticated session" })
    }

    // Process and send the emails
    const result = await processDocumentShareEmails(shareId, userId)

    if (!result.success) {
      return res.status(400).json({ error: result.error })
    }

    // Return success response
    return res.status(200).json({
      message: "Document share emails sent",
      totalSent: result.totalSent,
      totalFailed: result.totalFailed,
    })
  } catch (error) {
    console.error("Error sending document share emails:", error)
    return res.status(500).json({ error: "Failed to send document share emails" })
  }
})

// Document Sharing Endpoints
app.post("/api/document-shares", authenticateUser, async (req, res) => {
  try {
    await handleCreateDocumentShare(req, res)
  } catch (error) {
    console.error("Error creating document share:", error)
    res.status(500).json({ error: "Failed to create document share" })
  }
})

app.get("/api/document-shares/:token", async (req, res) => {
  try {
    await handleGetShareByToken(req, res)
  } catch (error) {
    console.error("Error fetching document share:", error)
    res.status(500).json({ error: "Failed to fetch document share" })
  }
})

app.get("/api/document-shares", authenticateUser, async (req, res) => {
  try {
    await handleGetDocumentShares(req, res)
  } catch (error) {
    console.error("Error fetching document shares:", error)
    res.status(500).json({ error: "Failed to fetch document shares" })
  }
})

app.post("/api/document-shares/:id/revoke", authenticateUser, async (req, res) => {
  try {
    await handleRevokeDocumentShare(req, res)
  } catch (error) {
    console.error("Error revoking document share:", error)
    res.status(500).json({ error: "Failed to revoke document share" })
  }
})

app.post("/api/document-access-logs", async (req, res) => {
  try {
    await handleLogDocumentAccess(req, res)
  } catch (error) {
    console.error("Error logging document access:", error)
    res.status(500).json({ error: "Failed to log document access" })
  }
})

// Document Hub endpoints
app.post("/api/documents/upload", authenticateUser, upload.single("file"), async (req, res) => {
  try {
    await handleDocumentUpload(req, res)
  } catch (error) {
    console.error("Error uploading document:", error)
    res.status(500).json({ error: "Failed to upload document" })
  }
})

// Get a document by ID
app.get("/api/documents/:id", authenticateUser, async (req, res) => {
  try {
    await handleGetDocument(req, res)
  } catch (error) {
    console.error("Error retrieving document:", error)
    res.status(500).json({ error: "Failed to retrieve document" })
  }
})

// Get all documents for a vessel
app.get("/api/documents/vessel/:vesselId", authenticateUser, async (req, res) => {
  try {
    await handleGetVesselDocuments(req, res)
  } catch (error) {
    console.error("Error retrieving vessel documents:", error)
    res.status(500).json({ error: "Failed to retrieve vessel documents" })
  }
})

// Update a document
app.put("/api/documents/:id", authenticateUser, async (req, res) => {
  try {
    await handleUpdateDocument(req, res)
  } catch (error) {
    console.error("Error updating document:", error)
    res.status(500).json({ error: "Failed to update document" })
  }
})

// Archive a document (soft delete)
app.delete("/api/documents/:id", authenticateUser, async (req, res) => {
  try {
    await handleArchiveDocument(req, res)
  } catch (error) {
    console.error("Error archiving document:", error)
    res.status(500).json({ error: "Failed to archive document" })
  }
})

// Generate a download URL for a document
app.get("/api/documents/:id/download", authenticateUser, async (req, res) => {
  try {
    await handleDocumentDownload(req, res)
  } catch (error) {
    console.error("Error generating document download URL:", error)
    res.status(500).json({ error: "Failed to generate document download URL" })
  }
})

app.post("/api/documents/batch-download", authenticateUser, async (req, res) => {
  try {
    await handleBatchDocumentDownload(req, res)
  } catch (error) {
    console.error("Error generating batch download URLs:", error)
    res.status(500).json({
      success: false,
      error: "Failed to generate batch download URLs",
    })
  }
})



// Start server
app.listen(port, "0.0.0.0", () => {
  console.log(`🚢 Comovis V2 backend is running securely on port ${port}`)
  console.log(`🔒 Security features enabled: HTTPS enforcement, rate limiting for auth`)
})
