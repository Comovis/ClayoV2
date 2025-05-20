const { render } = require('@react-email/render');
const React = require('react');
const UpgradeEmail = require('./UpgradeEmailUI');
const { Resend } = require('resend');

const resend = new Resend("re_QEXjrfmA_L4GVrubfEK8SJW7JFz6s63Mr");

async function sendUpgradeEmail(recipientEmail) {
  try {
    console.log("Rendering HTML for the Upgrade Email...");
    const emailHtml = await render(React.createElement(UpgradeEmail));

    console.log(`Sending Upgrade Email to ${recipientEmail}...`);
    const response = await resend.emails.send({
      from: 'welcome@trysignalflow.com',
      to: recipientEmail,
      subject: 'SignalFlow Upgrade Successful ',
      html: emailHtml,
    });

    console.log(`Upgrade email sent successfully to ${recipientEmail}. Response:`, response);
  } catch (error) {
    console.error("Error sending upgrade email:", error?.response?.data || error.message || error);
  }
}

module.exports = { sendUpgradeEmail };
