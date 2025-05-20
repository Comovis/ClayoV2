const { render } = require("@react-email/render")
const React = require("react")
const WelcomeEmail = require("./WelcomeEmail")
const { Resend } = require("resend")

const resend = new Resend("re_QEXjrfmA_L4GVrubfEK8SJW7JFz6s63Mr")

async function sendWelcomeEmail(recipientEmail) {
  try {
    console.log("Rendering HTML for the Welcome Email...")
    const emailHtml = await render(React.createElement(WelcomeEmail))

    console.log(`Sending Welcome Email to ${recipientEmail}...`)
    const response = await resend.emails.send({
      from: "welcome@trysignalflow.com",
      to: recipientEmail,
      subject: "Welcome to SignalFlow!",
      html: emailHtml,
    })

    console.log(`Welcome email sent successfully to ${recipientEmail}. Response:`, response)
  } catch (error) {
    console.error("Error sending welcome email:", error?.response?.data || error.message || error)
  }
}

module.exports = { sendWelcomeEmail }