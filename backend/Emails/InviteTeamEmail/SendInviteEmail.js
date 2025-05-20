const { render } = require("@react-email/render")
const React = require("react")
const InvitationEmail = require("./InviteEmail")
const { Resend } = require("resend")

const resend = new Resend("re_fZygLEii_AHipNeWqXfWbtejMrVFLW7yG")

async function sendInvitationEmail(recipientEmail, invitationLink, inviterName, inviterCompany, role) {
  try {
    console.log("Rendering HTML for the Invitation Email...")
    const emailHtml = await render(
      React.createElement(InvitationEmail, {
        invitationLink,
        inviterName,
        inviterCompany,
        role,
      }),
    )

    console.log(`Sending Invitation Email to ${recipientEmail}...`)
    const response = await resend.emails.send({
      from: "invites@notifications.comovis.co",
      to: recipientEmail,
      subject: `${inviterName} invited you to join Comovis Maritime Compliance Platform`,
      html: emailHtml,
    })

    console.log(`Invitation email sent successfully to ${recipientEmail}. Response:`, response)
    return { success: true, messageId: response.id }
  } catch (error) {
    console.error("Error sending invitation email:", error?.response?.data || error.message || error)
    return { success: false, error: error?.response?.data || error.message || error }
  }
}

module.exports = { sendInvitationEmail }
