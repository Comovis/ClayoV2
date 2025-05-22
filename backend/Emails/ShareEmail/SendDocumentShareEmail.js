const { render } = require("@react-email/render")
const React = require("react")
const DocumentShareEmail = require("./DocumentShareEmail")
const { Resend } = require("resend")
const { supabase } = require("../lib/supabaseClient")

const resend = new Resend(process.env.RESEND_API_KEY)

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
    // Add detailed logging for debugging
    console.log("==== DOCUMENT SHARE EMAIL DEBUGGING ====")
    console.log("recipientEmail:", recipientEmail)
    console.log("senderName:", senderName)
    console.log("vesselName:", vesselName)
    console.log("documentCount:", documentCount)
    console.log("expiryDate:", expiryDate)
    console.log("shareLink:", shareLink)
    console.log("======================================")

    console.log("Rendering HTML for the Document Share Email...")
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
      })
    )

    // Create a subject line that includes vessel name for easy identification
    const subject = `${senderName} shared ${vesselName} documents with you via Comovis`

    console.log(`Sending Document Share Email to ${recipientEmail}...`)
    const response = await resend.emails.send({
      from: "documents@notifications.comovis.co",
      to: recipientEmail,
      subject: subject,
      html: emailHtml,
    })

    console.log(`Document share email sent successfully to ${recipientEmail}. Response:`, response)
    return { success: true, messageId: response.id }
  } catch (error) {
    console.error("Error sending document share email:", error?.response?.data || error.message || error)
    console.error("Error details:", JSON.stringify(error, null, 2))
    return { success: false, error: error?.response?.data || error.message || error }
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
    // Verify that the share belongs to the user
    const { data: shareData, error: shareError } = await supabase
      .from("document_shares")
      .select("id, created_by, vessel_id, expires_at, message, share_token, status")
      .eq("id", shareId)
      .single()

    if (shareError || !shareData) {
      return { success: false, error: "Share not found" }
    }

    if (shareData.created_by !== userId) {
      return { success: false, error: "You don't have permission to send emails for this share" }
    }

    // Check if share is active
    if (shareData.status !== "active") {
      return { success: false, error: "Cannot send emails for an inactive or revoked share" }
    }

    // Get the vessel name and IMO
    const { data: vessel, error: vesselError } = await supabase
      .from("vessels")
      .select("name, imo_number")
      .eq("id", shareData.vessel_id)
      .single()

    if (vesselError) {
      return { success: false, error: "Failed to fetch vessel information" }
    }

    // Get the sender's full name and company
    const { data: userProfile, error: profileError } = await supabase
      .from("users")
      .select("full_name, email, company_id, companies(name)")
      .eq("id", userId)
      .single()

    if (profileError) {
      return { success: false, error: "Failed to fetch sender information" }
    }

    // Get recipients
    const { data: recipients, error: recipientsError } = await supabase
      .from("document_share_recipients")
      .select("email, name, type")
      .eq("share_id", shareId)

    if (recipientsError) {
      return { success: false, error: "Failed to fetch recipients" }
    }

    if (!recipients || recipients.length === 0) {
      return { success: false, error: "No recipients found for this share" }
    }

    // Count the number of documents in the share
    const { data: documents, error: countError } = await supabase
      .from("document_share_documents")
      .select("document_id")
      .eq("share_id", shareId)

    if (countError) {
      return { success: false, error: "Failed to count documents" }
    }

    // Generate the share URL
    const baseUrl = process.env.NODE_ENV === "production" 
      ? "https://comovis.co" 
      : "http://localhost:1601"
    const shareUrl = `${baseUrl}/share/${shareData.share_token}`

    // Send email to each recipient
    const emailPromises = recipients.map(async (recipient) => {
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

    // Check if any emails failed to send
    const failedEmails = emailResults.filter((result) => !result.success)

    // Log the email sending in the database
    const { error: logError } = await supabase.from("document_share_emails").insert(
      recipients.map((recipient, index) => ({
        share_id: shareId,
        recipient_email: recipient.email,
        sent_at: new Date().toISOString(),
        status: emailResults[index].success ? "sent" : "failed",
        error_message: emailResults[index].success ? null : emailResults[index].error,
      }))
    )

    if (logError) {
      console.error("Error logging email sending:", logError)
    }

    // Update the share record to indicate emails were sent
    const { error: updateError } = await supabase
      .from("document_shares")
      .update({
        emails_sent: true,
        emails_sent_at: new Date().toISOString(),
      })
      .eq("id", shareId)

    if (updateError) {
      console.error("Error updating share record:", updateError)
    }

    return {
      success: true,
      totalSent: emailResults.filter((result) => result.success).length,
      totalFailed: failedEmails.length,
      failedEmails: failedEmails.length > 0 ? failedEmails : undefined,
    }
  } catch (error) {
    console.error("Error processing document share emails:", error)
    return { success: false, error: error.message || "Failed to process document share emails" }
  }
}

module.exports = { sendDocumentShareEmail, processDocumentShareEmails }