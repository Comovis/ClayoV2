// Update the import to use supabaseAdmin
const { supabaseAdmin } = require("../../SupabaseClient")

/**
 * Creates a new document share
 * @param {Object} shareData - Data for the new share
 * @param {string} shareData.vesselId - ID of the vessel
 * @param {string[]} shareData.documentIds - Array of document IDs to share
 * @param {Object[]} shareData.recipients - Array of recipient objects
 * @param {string} shareData.expiresAt - ISO date string when the share expires
 * @param {string} shareData.message - Optional message to include with the share
 * @param {Object} shareData.securityOptions - Security options for the share
 * @param {string} userId - ID of the user creating the share
 * @returns {Promise<Object>} Share details or error
 */
async function createDocumentShare(shareData, userId) {
  try {
    // Add debugging logs
    console.log("=== CREATE DOCUMENT SHARE DEBUG ===")
    console.log("supabaseAdmin exists:", !!supabaseAdmin)
    console.log("supabaseAdmin.from exists:", typeof supabaseAdmin?.from === "function")
    console.log("shareData:", JSON.stringify(shareData, null, 2))
    console.log("userId:", userId)

    const { vesselId, documentIds, recipients, expiresAt, message, securityOptions } = shareData

    // Validate required fields
    if (!vesselId || !documentIds || !recipients || !expiresAt) {
      return {
        success: false,
        error: "Missing required fields",
      }
    }

    // Generate a unique share token
    const shareToken = generateShareToken()

    // Create the share record in the database
    const { data: share, error } = await supabaseAdmin
      .from("document_shares")
      .insert({
        vessel_id: vesselId,
        created_by: userId,
        expires_at: expiresAt,
        message: message || null,
        security_options: securityOptions,
        share_token: shareToken,
        status: "active",
      })
      .select("id")
      .single()

    if (error) {
      console.error("Error creating document share:", error)
      return {
        success: false,
        error: "Failed to create document share",
      }
    }

    // Add documents to the share
    const shareDocuments = documentIds.map((docId) => ({
      share_id: share.id,
      document_id: docId,
    }))

    const { error: docsError } = await supabaseAdmin.from("document_share_documents").insert(shareDocuments)

    if (docsError) {
      console.error("Error adding documents to share:", docsError)
      return {
        success: false,
        error: "Failed to add documents to share",
      }
    }

    // Add recipients to the share
    const shareRecipients = recipients.map((recipient) => ({
      share_id: share.id,
      email: recipient.email,
      name: recipient.name || null,
      type: recipient.type,
    }))

    const { error: recipientsError } = await supabaseAdmin.from("document_share_recipients").insert(shareRecipients)

    if (recipientsError) {
      console.error("Error adding recipients to share:", recipientsError)
      return {
        success: false,
        error: "Failed to add recipients to share",
      }
    }

    // Generate the share URL
    const baseUrl = process.env.NODE_ENV === "production" ? "https://comovis.co" : "http://localhost:1601"
    const shareUrl = `${baseUrl}/share/${shareToken}`

    // Return the share details
    return {
      success: true,
      data: {
        id: share.id,
        shareToken,
        shareUrl,
        expiresAt,
        createdAt: new Date().toISOString(),
        recipients: recipients,
        documents: documentIds,
      },
    }
  } catch (error) {
    console.error("Error in document share creation:", error)
    return {
      success: false,
      error: "Internal server error",
    }
  }
}

/**
 * Gets a document share by token (for recipients)
 * @param {string} token - The share token
 * @param {string} ip - IP address of the requester
 * @param {string} userAgent - User agent of the requester
 * @returns {Promise<Object>} Share details or error
 */
async function getShareByToken(token, ip, userAgent) {
  try {
    // Get the share details
    const { data: share, error } = await supabaseAdmin
      .from("document_shares")
      .select(`
        id,
        vessel_id,
        created_by,
        created_at,
        expires_at,
        share_token,
        status,
        message,
        security_options,
        vessels (
          id,
          name,
          imo_number,
          vessel_type,
          flag_state
        ),
        users (
          id,
          full_name,
          email,
          company_id,
          companies (
            id,
            name
          )
        ),
        document_share_recipients (
          id,
          email,
          name,
          type
        ),
        document_share_documents (
          document_id,
          documents (
            id,
            title,
            document_type,
            issuer,
            category,
            issue_date,
            expiry_date,
            is_permanent,
            status,
            file_path,
            file_type,
            file_size
          )
        )
      `)
      .eq("share_token", token)
      .single()

    if (error) {
      console.error("Error fetching document share:", error)
      return {
        success: false,
        error: "Share not found",
      }
    }

    if (!share) {
      return {
        success: false,
        error: "Share not found",
      }
    }

    // Check if the share is expired or revoked
    if (share.status === "revoked") {
      return {
        success: false,
        error: "This share has been revoked",
        status: 410,
      }
    }

    if (new Date(share.expires_at) < new Date()) {
      // Update the share status to expired
      await supabaseAdmin.from("document_shares").update({ status: "expired" }).eq("id", share.id)

      return {
        success: false,
        error: "This share has expired",
        status: 410,
      }
    }

    // Format the response
    const formattedShare = {
      id: share.id,
      vessel: {
        id: share.vessels.id,
        name: share.vessels.name,
        imo: share.vessels.imo_number,
        type: share.vessels.vessel_type,
        flag: share.vessels.flag_state,
      },
      sender: {
        id: share.users.id,
        name: share.users.full_name,
        email: share.users.email,
        company: share.users.companies?.name || "Unknown Company",
      },
      recipients: share.document_share_recipients,
      documents: share.document_share_documents.map((doc) => doc.documents),
      createdAt: share.created_at,
      expiresAt: share.expires_at,
      message: share.message,
      security: share.security_options,
      status: share.status,
    }

    // Log the access
    await supabaseAdmin.from("document_access_logs").insert({
      share_id: share.id,
      document_id: null, // No specific document, viewing the share page
      user_id: null, // Anonymous access
      action: "view_share",
      ip_address: ip,
      user_agent: userAgent,
    })

    return {
      success: true,
      data: formattedShare,
    }
  } catch (error) {
    console.error("Error fetching document share:", error)
    return {
      success: false,
      error: "Internal server error",
    }
  }
}

/**
 * Gets document shares for a user
 * @param {string} userId - ID of the user
 * @param {string} vesselId - Optional vessel ID to filter by
 * @returns {Promise<Object>} List of shares or error
 */
async function getDocumentShares(userId, vesselId) {
  try {
    let query = supabaseAdmin
      .from("document_shares")
      .select(`
        id,
        vessel_id,
        vessels (name, imo_number),
        created_at,
        expires_at,
        share_token,
        status,
        security_options,
        document_share_recipients (
          email,
          name,
          type
        ),
        document_share_documents (
          documents (
            id,
            title,
            document_type
          )
        )
      `)
      .eq("created_by", userId)
      .order("created_at", { ascending: false })

    if (vesselId) {
      query = query.eq("vessel_id", vesselId)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching document shares:", error)
      return {
        success: false,
        error: "Failed to fetch document shares",
      }
    }

    // Transform the data to match our frontend expectations
    const shares = (data || []).map((share) => {
      const documents = share.document_share_documents.map((doc) => doc.documents)
      const recipients = share.document_share_recipients

      // Generate the share URL
      const baseUrl = process.env.NODE_ENV === "production" ? "https://comovis.co" : "http://localhost:1601"
      const shareUrl = `${baseUrl}/share/${share.share_token}`

      return {
        id: share.id,
        vesselId: share.vessel_id,
        vesselName: share.vessels.name,
        vesselIMO: share.vessels.imo_number,
        shareUrl,
        recipients,
        documents,
        documentCount: documents.length,
        createdAt: share.created_at,
        expiresAt: share.expires_at,
        isRevoked: share.status === "revoked",
        isExpired: share.status === "expired" || new Date(share.expires_at) < new Date(),
        securityOptions: share.security_options,
      }
    })

    return {
      success: true,
      data: shares,
    }
  } catch (error) {
    console.error("Error fetching document shares:", error)
    return {
      success: false,
      error: "Internal server error",
    }
  }
}

/**
 * Revokes a document share
 * @param {string} shareId - ID of the share to revoke
 * @param {string} userId - ID of the user revoking the share
 * @returns {Promise<Object>} Success status or error
 */
async function revokeDocumentShare(shareId, userId) {
  try {
    // Check if the share belongs to the user
    const { data: share, error: fetchError } = await supabaseAdmin
      .from("document_shares")
      .select("id, created_by")
      .eq("id", shareId)
      .single()

    if (fetchError || !share) {
      return {
        success: false,
        error: "Share not found",
      }
    }

    if (share.created_by !== userId) {
      return {
        success: false,
        error: "You do not have permission to revoke this share",
      }
    }

    // Revoke the share
    const { error } = await supabaseAdmin.from("document_shares").update({ status: "revoked" }).eq("id", shareId)

    if (error) {
      console.error("Error revoking document share:", error)
      return {
        success: false,
        error: "Failed to revoke document share",
      }
    }

    return {
      success: true,
      message: "Share revoked successfully",
    }
  } catch (error) {
    console.error("Error revoking document share:", error)
    return {
      success: false,
      error: "Internal server error",
    }
  }
}

/**
 * Logs document access
 * @param {Object} logData - Access log data
 * @param {string} logData.shareId - ID of the share
 * @param {string} logData.documentId - ID of the document (optional)
 * @param {string} logData.action - Action performed (view_share, view_document, download)
 * @param {string} logData.email - Email of the user (optional)
 * @param {string} ip - IP address of the requester
 * @param {string} userAgent - User agent of the requester
 * @returns {Promise<Object>} Success status or error
 */
async function logDocumentAccess(logData, ip, userAgent) {
  try {
    const { shareId, documentId, action, email } = logData

    // Validate required fields
    if (!shareId || !action) {
      return {
        success: false,
        error: "Missing required fields",
      }
    }

    // Create the access log
    const { data, error } = await supabaseAdmin
      .from("document_access_logs")
      .insert({
        share_id: shareId,
        document_id: documentId || null,
        user_id: null, // Anonymous access
        user_email: email || null,
        action,
        ip_address: ip,
        user_agent: userAgent,
      })
      .select("id")
      .single()

    if (error) {
      console.error("Error logging document access:", error)
      return {
        success: false,
        error: "Failed to log document access",
      }
    }

    return {
      success: true,
      id: data.id,
    }
  } catch (error) {
    console.error("Error logging document access:", error)
    return {
      success: false,
      error: "Internal server error",
    }
  }
}

/**
 * Handles the API request to create a document share
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
async function handleCreateDocumentShare(req, res) {
  try {
    const shareData = req.body
    const userId = req.user.user_id

    if (!userId) {
      return res.status(401).json({ error: "User ID not found in authenticated session" })
    }

    const result = await createDocumentShare(shareData, userId)

    if (!result.success) {
      return res.status(400).json({ error: result.error })
    }

    return res.status(201).json(result.data)
  } catch (error) {
    console.error("Error in handleCreateDocumentShare:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}

/**
 * Handles the API request to get a share by token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
async function handleGetShareByToken(req, res) {
  try {
    const { token } = req.params
    const ip = req.ip
    const userAgent = req.headers["user-agent"]

    const result = await getShareByToken(token, ip, userAgent)

    if (!result.success) {
      const statusCode = result.status || 404
      return res.status(statusCode).json({ error: result.error })
    }

    return res.status(200).json(result.data)
  } catch (error) {
    console.error("Error in handleGetShareByToken:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}

/**
 * Handles the API request to get document shares for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
async function handleGetDocumentShares(req, res) {
  try {
    const { vesselId } = req.query
    const userId = req.user.user_id

    if (!userId) {
      return res.status(401).json({ error: "User ID not found in authenticated session" })
    }

    const result = await getDocumentShares(userId, vesselId)

    if (!result.success) {
      return res.status(400).json({ error: result.error })
    }

    return res.status(200).json(result.data)
  } catch (error) {
    console.error("Error in handleGetDocumentShares:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}

/**
 * Handles the API request to revoke a document share
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
async function handleRevokeDocumentShare(req, res) {
  try {
    const { id } = req.params
    const userId = req.user.user_id

    if (!userId) {
      return res.status(401).json({ error: "User ID not found in authenticated session" })
    }

    const result = await revokeDocumentShare(id, userId)

    if (!result.success) {
      return res.status(400).json({ error: result.error })
    }

    return res.status(200).json({ success: true, message: result.message })
  } catch (error) {
    console.error("Error in handleRevokeDocumentShare:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}

/**
 * Handles the API request to log document access
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
async function handleLogDocumentAccess(req, res) {
  try {
    const logData = req.body
    const ip = req.ip
    const userAgent = req.headers["user-agent"]

    const result = await logDocumentAccess(logData, ip, userAgent)

    if (!result.success) {
      return res.status(400).json({ error: result.error })
    }

    return res.status(201).json({ success: true, id: result.id })
  } catch (error) {
    console.error("Error in handleLogDocumentAccess:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}

// Helper function to generate a random share token
function generateShareToken() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  const tokenLength = 12
  let token = ""

  for (let i = 0; i < tokenLength; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return token
}

module.exports = {
  createDocumentShare,
  getShareByToken,
  getDocumentShares,
  revokeDocumentShare,
  logDocumentAccess,
  handleCreateDocumentShare,
  handleGetShareByToken,
  handleGetDocumentShares,
  handleRevokeDocumentShare,
  handleLogDocumentAccess,
}
