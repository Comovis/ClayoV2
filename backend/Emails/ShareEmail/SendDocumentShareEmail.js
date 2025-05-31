const { render } = require("@react-email/render")
const React = require("react")
const DocumentShareEmail = require("./DocumentShareEmail")
const { Resend } = require("resend")
const { supabaseAdmin } = require("../../SupabaseClient")

// Hardcoded Resend API key (same as in SendInviteEmail.js)
const resend = new Resend("re_fZygLEii_AHipNeWqXfWbtejMrVFLW7yG")

/**
 * Sends a document share email to a recipient
 * @param {Object} params - Email parameters
 * @returns {Promise<Object>} Result of the operation
 */
async function sendDocumentShareEmail({
  recipientEmail,
  recipientName,
  senderName,
  senderCompany,
  vesselName,
  vesselIMO,
  shareLink,
  documentCount,
  expiryDate,
  customMessage,
}) {
  try {
    console.log("=== SENDING DOCUMENT SHARE EMAIL ===")
    console.log("Recipient:", recipientEmail)
    console.log("Sender:", senderName, "from", senderCompany)
    console.log("Vessel:", vesselName, "IMO:", vesselIMO)
    console.log("Documents:", documentCount)
    console.log("Share link:", shareLink)
    console.log("Expires:", expiryDate)

    console.log("Rendering email HTML...")
    const emailHtml = await render(
      React.createElement(DocumentShareEmail, {
        recipientName,
        senderName,
        senderCompany,
        vesselName,
        vesselIMO,
        shareLink,
        documentCount,
        expiryDate,
        customMessage,
      }),
    )

    // Create a subject line that includes vessel name for easy identification
    const subject = `${senderName} shared ${vesselName} documents with you via Comovis`

    console.log("Sending email via Resend...")
    const response = await resend.emails.send({
      from: "documents@comovis.co",
      to: recipientEmail,
      subject: subject,
      html: emailHtml,
    })

    console.log("Email sent successfully. Response:", response)
    return { success: true, messageId: response.id }
  } catch (error) {
    console.error("Error sending document share email:", error)
    return { success: false, error: error.message || "Failed to send email" }
  }
}

/**
 * Process and send document share emails for a specific share
 * @param {string} shareId - The ID of the document share
 * @param {string} userId - The ID of the authenticated user
 * @returns {Promise<Object>} Result of the operation
 */
async function processDocumentShareEmails(shareId, userId) {
  try {
    console.log("=== PROCESSING DOCUMENT SHARE EMAILS ===")
    console.log("ShareId:", shareId, "UserId:", userId)

    // Verify that the share belongs to the user
    console.log("Fetching share data...")
    const { data: shareData, error: shareError } = await supabaseAdmin
      .from("document_shares")
      .select("id, created_by, vessel_id, expires_at, message, share_token, status")
      .eq("id", shareId)
      .single()

    if (shareError || !shareData) {
      console.log("Share not found:", shareError)
      return { success: false, error: "Share not found" }
    }

    console.log("Share data:", shareData)

    if (shareData.created_by !== userId) {
      console.log("Permission denied - user doesn't own this share")
      return { success: false, error: "You don't have permission to send emails for this share" }
    }

    // Check if share is active
    if (shareData.status !== "active") {
      console.log("Share is not active:", shareData.status)
      return { success: false, error: "Cannot send emails for an inactive or revoked share" }
    }

    // Get the vessel name and IMO
    console.log("Fetching vessel data...")
    const { data: vessel, error: vesselError } = await supabaseAdmin
      .from("vessels")
      .select("name, imo_number")
      .eq("id", shareData.vessel_id)
      .single()

    if (vesselError) {
      console.log("Vessel fetch error:", vesselError)
      return { success: false, error: "Failed to fetch vessel information" }
    }

    console.log("Vessel data:", vessel)

    // Get the sender's full name and company
    console.log("Fetching user profile...")
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from("users")
      .select("full_name, email, company_id, companies(name)")
      .eq("id", userId)
      .single()

    if (profileError) {
      console.log("Profile fetch error:", profileError)
      return { success: false, error: "Failed to fetch sender information" }
    }

    console.log("User profile:", userProfile)

    // Get recipients
    console.log("Fetching recipients...")
    const { data: recipients, error: recipientsError } = await supabaseAdmin
      .from("document_share_recipients")
      .select("email, name, type")
      .eq("share_id", shareId)

    if (recipientsError) {
      console.log("Recipients fetch error:", recipientsError)
      return { success: false, error: "Failed to fetch recipients" }
    }

    console.log("Recipients:", recipients)

    if (!recipients || recipients.length === 0) {
      console.log("No recipients found")
      return { success: false, error: "No recipients found for this share" }
    }

    // Count the number of documents in the share
    console.log("Counting documents...")
    const { data: documents, error: countError } = await supabaseAdmin
      .from("document_share_documents")
      .select("document_id")
      .eq("share_id", shareId)

    if (countError) {
      console.log("Document count error:", countError)
      return { success: false, error: "Failed to count documents" }
    }

    console.log("Document count:", documents?.length || 0)

    // Generate the share URL
    const baseUrl = process.env.NODE_ENV === "production" ? "https://comovis.co" : "http://localhost:1601"
    const shareUrl = `${baseUrl}/share/${shareData.share_token}`

    console.log("Share URL:", shareUrl)

    // Send email to each recipient
    console.log("Sending emails to", recipients.length, "recipients...")
    const emailPromises = recipients.map(async (recipient, index) => {
      console.log(`Sending email ${index + 1}/${recipients.length} to:`, recipient.email)
      return sendDocumentShareEmail({
        recipientEmail: recipient.email,
        recipientName: recipient.name || "",
        senderName: userProfile.full_name,
        senderCompany: userProfile.companies?.name || "Comovis",
        vesselName: vessel.name,
        vesselIMO: vessel.imo_number,
        shareLink: shareUrl,
        documentCount: documents.length,
        expiryDate: shareData.expires_at,
        customMessage: shareData.message,
      })
    })

    // Wait for all emails to be sent
    const emailResults = await Promise.all(emailPromises)

    console.log("Email results:", emailResults)

    // Check if any emails failed to send
    const failedEmails = emailResults.filter((result) => !result.success)
    const successfulEmails = emailResults.filter((result) => result.success)

    console.log("Successful emails:", successfulEmails.length)
    console.log("Failed emails:", failedEmails.length)

    // Log the email sending in the database (if table exists)
    try {
      console.log("Logging email results to database...")
      const { error: logError } = await supabaseAdmin.from("document_share_emails").insert(
        recipients.map((recipient, index) => ({
          share_id: shareId,
          recipient_email: recipient.email,
          sent_at: new Date().toISOString(),
          status: emailResults[index].success ? "sent" : "failed",
          error_message: emailResults[index].success ? null : emailResults[index].error,
        })),
      )

      if (logError) {
        console.log("Email logging failed (table might not exist):", logError)
      } else {
        console.log("Email results logged successfully")
      }
    } catch (logException) {
      console.log("Email logging exception (table might not exist):", logException)
    }

    // Update the share record to indicate emails were sent
    try {
      console.log("Updating share record...")
      const { error: updateError } = await supabaseAdmin
        .from("document_shares")
        .update({
          emails_sent: true,
          emails_sent_at: new Date().toISOString(),
        })
        .eq("id", shareId)

      if (updateError) {
        console.log("Share update failed:", updateError)
      } else {
        console.log("Share record updated successfully")
      }
    } catch (updateException) {
      console.log("Share update exception:", updateException)
    }

    const result = {
      success: true,
      totalSent: successfulEmails.length,
      totalFailed: failedEmails.length,
      failedEmails: failedEmails.length > 0 ? failedEmails : undefined,
    }

    console.log("Final result:", result)
    return result
  } catch (error) {
    console.error("Error processing document share emails:", error)
    return { success: false, error: error.message || "Failed to process document share emails" }
  }
}

module.exports = { sendDocumentShareEmail, processDocumentShareEmails }
