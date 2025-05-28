const { render } = require("@react-email/render")
const React = require("react")
const ConfirmationEmail = require("./ConfirmEmail")
const { Resend } = require("resend")

const resend = new Resend("re_fZygLEii_AHipNeWqXfWbtejMrVFLW7yG")

async function sendConfirmationEmail(recipientEmail, confirmationLink) {
  try {
    console.log("Rendering HTML for the Confirmation Email...")
    const emailHtml = await render(React.createElement(ConfirmationEmail, { confirmationLink }))

    console.log(`Sending Confirmation Email to ${recipientEmail}...`)
    const response = await resend.emails.send({
      from: "Verify@comovis.co",
      to: recipientEmail,
      subject: "Confirm Your Comovis Account",
      html: emailHtml,
    })

    console.log(`Confirmation email sent successfully to ${recipientEmail}. Response:`, response)
  } catch (error) {
    console.error("Error sending confirmation email:", error?.response?.data || error.message || error)
  }
}

module.exports = { sendConfirmationEmail }