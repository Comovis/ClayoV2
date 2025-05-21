const express = require("express")
const cors = require("cors")
require("dotenv").config()
const { sendUserConfirmationEmail, resendConfirmationEmail } = require("./Emails/EmailAuthLinkService")
const { createUserWithCompany } = require("./Auth/SignupAuthService")
const { authenticateUser } = require("./Auth/AuthenticateUser")
const { createAndSendInvitation } = require("./Emails/InviteTeamEmail/InviteAuthService")
const { handleCancelTeamInvitationRequest } = require("./Team/CancelTeamInvite")
const { handleInviteSignup } = require("./Auth/SignupInviteAPI")
const { handleFetchTeamMembersRequest } = require("./Team/FetchTeamData")
const { handleValidateInvitationRequest } = require("./Team/ValidateInvite")
const { handleFetchUserDataRequest } = require("./Auth/FetchUser")
const { handleSignIn } = require("./Auth/SignInAuthService")




// Create Express app
const app = express()

// Dynamic port configuration
const port = process.env.PORT || 2807

// Basic middleware
app.use(express.json())
app.use(cors())

app.post("/api/send-confirmation-email", async (req, res) => {
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

app.post("/api/resend-confirmation-email", async (req, res) => {
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


app.post("/api/signin", async (req, res) => {
  try {
    // The handleSignIn handler will manage the authentication process
    await handleSignIn(req, res)
  } catch (error) {
    console.error("Error during sign in:", error)
    res.status(500).json({ 
      success: false, 
      error: "Authentication failed", 
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    })
  }
})



app.post("/api/signup", async (req, res) => {
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
app.post("/api/invite-signup", async (req, res) => {
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



app.get("/api/auth/current-user", authenticateUser, async (req, res) => {
  try {
    // Get user ID from auth or header as backup
    const userId = req.user?.user_id || req.headers["x-user-id"]

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "User ID not found"
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
      error: "Failed to fetch user data"
    })
  }
})

// Start server
app.listen(port, "0.0.0.0", () => {
  console.log(`Comovis V2 backend is running on port ${port}`)
})
