const { render } = require("@react-email/render")
const React = require("react")
const InvitationEmail = require("./InviteEmail")
const { Resend } = require("resend")

const resend = new Resend("re_fZygLEii_AHipNeWqXfWbtejMrVFLW7yG")

async function sendInvitationEmail(recipientEmail, invitationLink, inviterName, inviterCompany, role) {
  try {
    // Add detailed logging for debugging
    console.log("==== EMAIL DEBUGGING ====")
    console.log("recipientEmail value:", recipientEmail)
    console.log("recipientEmail type:", typeof recipientEmail)
    console.log("recipientEmail stringified:", JSON.stringify(recipientEmail))

    if (typeof recipientEmail === "object") {
      console.log("recipientEmail object keys:", Object.keys(recipientEmail))
      if (recipientEmail.email) {
        console.log("Found email property:", recipientEmail.email)
      }
    }

    console.log("inviterName:", inviterName)
    console.log("inviterCompany:", inviterCompany)
    console.log("role:", role)
    console.log("========================")

    console.log("Rendering HTML for the Invitation Email...")
    const emailHtml = await render(
      React.createElement(InvitationEmail, {
        invitationLink,
        inviterName,
        inviterCompany,
        role,
      }),
    )

    // Log the exact parameters being sent to Resend
    console.log("Sending email with parameters:")
    console.log("from:", "invites@notifications.comovis.co")
    console.log("to:", recipientEmail)
    console.log("subject:", `${inviterName} invited you to join Comovis Maritime Compliance Platform`)
    console.log("html length:", emailHtml.length)

    console.log(`Sending Invitation Email to ${recipientEmail}...`)
    const response = await resend.emails.send({
      from: "invites@comovis.co",
      to: recipientEmail,
      subject: `${inviterName} invited you to join Comovis Maritime Compliance Platform`,
      html: emailHtml,
    })

    console.log(`Invitation email sent successfully to ${recipientEmail}. Response:`, response)
    return { success: true, messageId: response.id }
  } catch (error) {
    console.error("Error sending invitation email:", error?.response?.data || error.message || error)
    console.error("Error details:", JSON.stringify(error, null, 2))
    return { success: false, error: error?.response?.data || error.message || error }
  }
}

module.exports = { sendInvitationEmail }
