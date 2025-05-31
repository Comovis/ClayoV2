// Update the import to use supabaseAdmin
const { supabaseAdmin } = require("../../SupabaseClient")

/**
 * Creates a new document share with enhanced debugging
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
    console.log("=== CREATE DOCUMENT SHARE ===")
    console.log("shareData:", JSON.stringify(shareData, null, 2))
    console.log("userId:", userId)

    const { vesselId, documentIds, recipients, expiresAt, message, securityOptions } = shareData

    // Validation
    if (!vesselId || !documentIds || !recipients || !expiresAt) {
      const missingFields = []
      if (!vesselId) missingFields.push("vesselId")
      if (!documentIds) missingFields.push("documentIds")
      if (!recipients) missingFields.push("recipients")
      if (!expiresAt) missingFields.push("expiresAt")

      console.log("VALIDATION FAILED - Missing fields:", missingFields)
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`)
    }

    if (!Array.isArray(documentIds) || documentIds.length === 0) {
      throw new Error("documentIds must be a non-empty array")
    }

    if (!Array.isArray(recipients) || recipients.length === 0) {
      throw new Error("recipients must be a non-empty array")
    }

    // Verify vessel exists
    const { data: vesselData, error: vesselError } = await supabaseAdmin
      .from("vessels")
      .select("id, name")
      .eq("id", vesselId)
      .single()

    if (vesselError || !vesselData) {
      throw new Error("Vessel not found")
    }

    // Verify documents exist
    const { data: documentsData, error: documentsError } = await supabaseAdmin
      .from("documents")
      .select("id, title")
      .in("id", documentIds)

    if (documentsError || !documentsData || documentsData.length !== documentIds.length) {
      throw new Error("Some documents not found")
    }

    // Generate share token
    const shareToken = generateShareToken()

    // Create share record
    const shareRecord = {
      vessel_id: vesselId,
      created_by: userId,
      expires_at: expiresAt,
      message: message || null,
      security_options: securityOptions,
      share_token: shareToken,
      status: "active",
    }

    const { data: share, error } = await supabaseAdmin.from("document_shares").insert(shareRecord).select("id").single()

    if (error) {
      console.error("Share creation failed:", error)
      throw new Error("Failed to create document share")
    }

    // Add documents to share
    const shareDocuments = documentIds.map((docId) => ({
      share_id: share.id,
      document_id: docId,
    }))

    const { error: docsError } = await supabaseAdmin.from("document_share_documents").insert(shareDocuments)

    if (docsError) {
      console.error("Adding documents failed:", docsError)
      // Cleanup
      await supabaseAdmin.from("document_shares").delete().eq("id", share.id)
      throw new Error("Failed to add documents to share")
    }

    // Add recipients to share
    const shareRecipients = recipients.map((recipient) => ({
      share_id: share.id,
      email: recipient.email,
      name: recipient.name || null,
      type: recipient.type,
    }))

    const { error: recipientsError } = await supabaseAdmin.from("document_share_recipients").insert(shareRecipients)

    if (recipientsError) {
      console.error("Adding recipients failed:", recipientsError)
      // Cleanup
      await supabaseAdmin.from("document_share_documents").delete().eq("share_id", share.id)
      await supabaseAdmin.from("document_shares").delete().eq("id", share.id)
      throw new Error("Failed to add recipients to share")
    }

    // Generate share URL
    const baseUrl = process.env.NODE_ENV === "production" ? "https://comovis.co" : "http://localhost:1601"
    const shareUrl = `${baseUrl}/share/${shareToken}`

    console.log("Share created successfully:", share.id)

    // Return the data directly (no wrapper)
    return {
      id: share.id,
      shareToken,
      shareUrl,
      expiresAt,
      createdAt: new Date().toISOString(),
      recipients: recipients,
      documents: documentIds,
    }
  } catch (error) {
    console.error("Error in createDocumentShare:", error)
    throw error
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
    console.log("=== GET SHARE BY TOKEN ===")
    console.log("token:", token)

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

    if (error || !share) {
      throw new Error("Share not found")
    }

    // Check if expired or revoked
    if (share.status === "revoked") {
      const error = new Error("This share has been revoked")
      error.status = 410
      throw error
    }

    if (new Date(share.expires_at) < new Date()) {
      await supabaseAdmin.from("document_shares").update({ status: "expired" }).eq("id", share.id)
      const error = new Error("This share has expired")
      error.status = 410
      throw error
    }

    // Log share access with NULL document_id (share-level action)
    try {
      console.log("Logging share access with NULL document_id...")

      const logResult = await supabaseAdmin.from("document_access_logs").insert({
        share_id: share.id,
        document_id: null, // NULL for share-level actions
        user_id: null,
        action: "view_share",
        timestamp: new Date().toISOString(), // Use 'timestamp' column
        ip_address: ip || "unknown",
        user_agent: userAgent || "unknown",
        user_email: null,
      })

      if (logResult.error) {
        console.error("Access logging failed:", logResult.error)
      } else {
        console.log("Share access logged successfully")
      }
    } catch (logError) {
      console.error("Access logging exception:", logError)
      // Don't throw - continue with the response
    }

    // Format response
    return {
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
  } catch (error) {
    console.error("Error in getShareByToken:", error)
    throw error
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
    console.log("=== GET DOCUMENT SHARES ===")
    console.log("userId:", userId, "vesselId:", vesselId)

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
      throw new Error("Failed to fetch document shares")
    }

    // Transform data
    const shares = (data || []).map((share) => {
      const documents = share.document_share_documents.map((doc) => doc.documents)
      const recipients = share.document_share_recipients

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

    return shares
  } catch (error) {
    console.error("Error in getDocumentShares:", error)
    throw error
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
    console.log("=== REVOKE DOCUMENT SHARE ===")
    console.log("shareId:", shareId, "userId:", userId)

    // Check ownership
    const { data: share, error: fetchError } = await supabaseAdmin
      .from("document_shares")
      .select("id, created_by")
      .eq("id", shareId)
      .single()

    if (fetchError || !share) {
      throw new Error("Share not found")
    }

    if (share.created_by !== userId) {
      throw new Error("You do not have permission to revoke this share")
    }

    // Revoke
    const { error } = await supabaseAdmin.from("document_shares").update({ status: "revoked" }).eq("id", shareId)

    if (error) {
      throw new Error("Failed to revoke document share")
    }

    return { message: "Share revoked successfully" }
  } catch (error) {
    console.error("Error in revokeDocumentShare:", error)
    throw error
  }
}

/**
 * Logs document access with proper NULL handling for document_id
 * @param {Object} logData - Access log data
 * @param {string} logData.shareId - ID of the share
 * @param {string} logData.documentId - ID of the document (can be null for share-level actions)
 * @param {string} logData.action - Action performed (view_share, view_document, download)
 * @param {string} logData.email - Email of the user (optional)
 * @param {string} ip - IP address of the requester
 * @param {string} userAgent - User agent of the requester
 * @returns {Promise<Object>} Success status or error
 */
async function logDocumentAccess(logData, ip, userAgent) {
  try {
    console.log("=== LOG DOCUMENT ACCESS ===")
    console.log("logData:", logData)
    console.log("ip:", ip)
    console.log("userAgent:", userAgent)

    const { shareId, documentId, action, email } = logData

    if (!shareId || !action) {
      console.log("Missing required fields - shareId:", shareId, "action:", action)
      return { success: false, error: "Missing required fields: shareId and action are required" }
    }

    // Prepare the log entry with correct column names
    // documentId can be null for share-level actions like "view_share"
    const logEntry = {
      share_id: shareId,
      document_id: documentId || null, // Allow NULL for share-level actions
      user_id: null,
      user_email: email || null,
      action,
      timestamp: new Date().toISOString(), // Use 'timestamp' column
      ip_address: ip || "unknown",
      user_agent: userAgent || "unknown",
    }

    console.log("Attempting to insert log entry:", JSON.stringify(logEntry, null, 2))

    // Insert the log entry
    const { data, error } = await supabaseAdmin.from("document_access_logs").insert(logEntry).select("id").single()

    if (error) {
      console.error("Database insertion error:", error)
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      })

      return {
        success: false,
        error: `Database error: ${error.message} (Code: ${error.code})`,
        message: "Access logging failed but operation continued",
      }
    }

    console.log("Access logged successfully with ID:", data?.id)
    return { success: true, id: data?.id || "success" }
  } catch (error) {
    console.error("Error in logDocumentAccess:", error)
    console.error("Error stack:", error.stack)

    // Don't throw the error - return a failure response instead
    return {
      success: false,
      error: error.message,
      message: "Access logging failed but operation continued",
    }
  }
}

/**
 * API Handlers - These handle the Express requests/responses
 */
async function handleCreateDocumentShare(req, res) {
  try {
    console.log("=== API HANDLER: CREATE DOCUMENT SHARE ===")
    console.log("Request body:", JSON.stringify(req.body, null, 2))

    const shareData = req.body
    const userId = req.user?.user_id

    if (!userId) {
      return res.status(401).json({ error: "User ID not found in authenticated session" })
    }

    // Call the service function
    const result = await createDocumentShare(shareData, userId)

    console.log("Share created, returning 201 with data:", result)

    // Return the data directly (frontend expects this format)
    return res.status(201).json(result)
  } catch (error) {
    console.error("Error in handleCreateDocumentShare:", error)
    return res.status(400).json({ error: error.message })
  }
}

async function handleGetShareByToken(req, res) {
  try {
    const { token } = req.params
    const ip = req.ip
    const userAgent = req.headers["user-agent"]

    const result = await getShareByToken(token, ip, userAgent)
    return res.status(200).json(result)
  } catch (error) {
    console.error("Error in handleGetShareByToken:", error)
    const statusCode = error.status || 404
    return res.status(statusCode).json({ error: error.message })
  }
}

async function handleGetDocumentShares(req, res) {
  try {
    const { vesselId } = req.query
    const userId = req.user.user_id

    if (!userId) {
      return res.status(401).json({ error: "User ID not found in authenticated session" })
    }

    const result = await getDocumentShares(userId, vesselId)
    return res.status(200).json(result)
  } catch (error) {
    console.error("Error in handleGetDocumentShares:", error)
    return res.status(400).json({ error: error.message })
  }
}

async function handleRevokeDocumentShare(req, res) {
  try {
    const { id } = req.params
    const userId = req.user.user_id

    if (!userId) {
      return res.status(401).json({ error: "User ID not found in authenticated session" })
    }

    const result = await revokeDocumentShare(id, userId)
    return res.status(200).json(result)
  } catch (error) {
    console.error("Error in handleRevokeDocumentShare:", error)
    return res.status(400).json({ error: error.message })
  }
}

async function handleLogDocumentAccess(req, res) {
  try {
    console.log("=== API HANDLER: LOG DOCUMENT ACCESS ===")
    console.log("Request body:", JSON.stringify(req.body, null, 2))
    console.log("Request IP:", req.ip)
    console.log("Request User-Agent:", req.headers["user-agent"])

    const logData = req.body
    const ip = req.ip
    const userAgent = req.headers["user-agent"]

    const result = await logDocumentAccess(logData, ip, userAgent)

    console.log("Log access result:", result)

    // Always return success status, even if logging failed
    return res.status(201).json(result)
  } catch (error) {
    console.error("Error in handleLogDocumentAccess:", error)
    // Return success even on error to not break the frontend
    return res.status(201).json({
      success: false,
      error: error.message,
      message: "Logging failed but request processed",
    })
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
