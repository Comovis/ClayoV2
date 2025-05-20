const { Resend } = require('resend');
const { render } = require('@react-email/render');
const React = require('react');
const { Body, Container, Head, Heading, Html, Text, Preview } = require('@react-email/components');

// Initialize Resend with the API key
const resend = new Resend("re_QEXjrfmA_L4GVrubfEK8SJW7JFz6s63Mr");

// Define a test email component
function TestEmail() {
  return React.createElement(
    Html,
    null,
    React.createElement(Head, null),
    React.createElement(Preview, null, "Test Email from Your App"),
    React.createElement(
      Body,
      { style: { fontFamily: "Arial, sans-serif", backgroundColor: "#f9f9f9", padding: "20px" } },
      React.createElement(
        Container,
        { style: { backgroundColor: "white", padding: "20px", borderRadius: "8px", maxWidth: "600px" } },
        React.createElement(Heading, { style: { color: "#333" } }, "Hello from Your App!"),
        React.createElement(Text, null, "This is a test email to confirm that your Resend email setup is working correctly.")
      )
    )
  );
}

// Function to send the test email
async function sendTestEmail() {
  try {
    console.log("Preparing to render HTML...");
    const emailHtml = await render(React.createElement(TestEmail)); // Await here to resolve the promise
    console.log("Rendered HTML:", emailHtml);

    const response = await resend.emails.send({
      from: 'notifications@trysignalflow.com',
      to: 'vitrexpur@gmail.com',
      subject: 'Test Email from Your App',
      html: emailHtml,
    });

    console.log("Email sent successfully! Response data:", response);
  } catch (error) {
    console.error("Error sending test email:", error?.response?.data || error.message || error);
  }
}

// Execute the test email send
sendTestEmail();
