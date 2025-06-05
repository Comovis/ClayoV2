const { Resend } = require("resend")
const { render } = require("@react-email/render")
const React = require("react")
const {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Text,
  Preview,
  Section,
  Link,
  Hr,
  Button,
} = require("@react-email/components")

const resend = new Resend("re_YkuriJ9C_HLQhKi8Bq1dtvtatwLhLKP4v")

// Your Confirmation Email component
function ConfirmationEmail(props) {
  const { confirmationLink } = props

  return React.createElement(
    Html,
    null,
    React.createElement(
      Head,
      null,
      React.createElement("style", null, "@import url('https://fonts.googleapis.com/css2?family=Inter&display=swap');"),
    ),
    React.createElement(Preview, null, "Confirm your Clayo account"),
    React.createElement(
      Body,
      { style: { backgroundColor: "white", fontFamily: "'Inter', sans-serif" } },
      React.createElement(
        Container,
        {
          style: {
            border: "1px solid #eaeaea",
            borderRadius: "8px",
            margin: "40px auto",
            padding: "20px",
            width: "465px",
          },
        },
        React.createElement(
          Section,
          { style: { textAlign: "center", marginTop: "32px" } },
          React.createElement("img", {
            src: "https://clayo.co/logo-black.png", // Updated to Clayo logo
            width: "140",
            height: "40",
            alt: "Clayo",
            style: { margin: "auto" },
          }),
        ),
        React.createElement(
          Heading,
          {
            style: {
              color: "#000000",
              fontSize: "24px",
              fontWeight: "bold",
              textAlign: "center",
              margin: "30px auto 0 auto",
            },
          },
          "Confirm Your Email Address",
        ),
        React.createElement(
          Text,
          {
            style: {
              color: "#333333",
              fontSize: "16px",
              lineHeight: "24px",
              textAlign: "center",
              margin: "20px 0",
            },
          },
          "Thank you for registering with Clayo. To complete your registration and access your AI-powered customer service platform, please confirm your email address by clicking the button below.",
        ),
        React.createElement(
          Section,
          { style: { textAlign: "center", margin: "30px 0" } },
          React.createElement(
            "a",
            {
              href: confirmationLink,
              style: {
                backgroundColor: "#000000",
                borderRadius: "6px",
                color: "white",
                fontSize: "14px",
                fontWeight: "600",
                textDecoration: "none",
                textAlign: "center",
                display: "inline-block",
                padding: "12px 24px",
                transition: "background-color 0.2s ease",
              },
            },
            "Confirm Email Address",
          ),
        ),
        React.createElement(
          Text,
          {
            style: {
              color: "#666666",
              fontSize: "14px",
              lineHeight: "20px",
              textAlign: "center",
              margin: "20px 0",
            },
          },
          "Once confirmed, you'll be able to:",
        ),
        React.createElement(
          Text,
          {
            style: {
              color: "#333333",
              fontSize: "14px",
              lineHeight: "20px",
              textAlign: "left",
              margin: "10px 0",
              paddingLeft: "20px",
            },
          },
          "• Set up your AI customer service agent\n• Configure multiple communication channels\n• Train your AI with your business knowledge\n• Start automating customer interactions 24/7",
        ),
        React.createElement(
          Text,
          {
            style: {
              color: "#666666",
              fontSize: "14px",
              lineHeight: "20px",
              textAlign: "center",
              margin: "20px 0",
            },
          },
          "If you did not create an account with Clayo, please disregard this email.",
        ),
        React.createElement(
          Text,
          {
            style: {
              color: "#666666",
              fontSize: "12px",
              lineHeight: "18px",
              textAlign: "center",
              margin: "20px 0",
            },
          },
          "If the button above doesn't work, you can also confirm your email by copying and pasting the following link into your browser:",
        ),
        React.createElement(
          Text,
          {
            style: {
              color: "#0070f3",
              fontSize: "12px",
              lineHeight: "18px",
              textAlign: "center",
              margin: "10px 0",
              wordBreak: "break-all",
              padding: "8px",
              backgroundColor: "#f8f9fa",
              borderRadius: "4px",
            },
          },
          confirmationLink,
        ),
        React.createElement(Hr, { style: { border: "1px solid #eaeaea", margin: "26px 0", width: "100%" } }),
        React.createElement(
          Text,
          {
            style: {
              color: "#666666",
              fontSize: "14px",
              lineHeight: "20px",
              textAlign: "center",
              fontStyle: "italic",
              margin: "16px 0",
            },
          },
          "\"The best customer service is if the customer doesn't need to call you, doesn't need to talk to you. It just works.\" – Jeff Bezos",
        ),
        React.createElement(Hr, { style: { border: "1px solid #eaeaea", margin: "26px 0", width: "100%" } }),
        React.createElement(
          Text,
          {
            style: {
              color: "#999999",
              fontSize: "12px",
              lineHeight: "16px",
              textAlign: "center",
              margin: "8px 0",
            },
          },
          "Please do not reply to this email as it is not monitored.",
        ),
        React.createElement(
          Text,
          {
            style: {
              color: "#999999",
              fontSize: "12px",
              lineHeight: "16px",
              textAlign: "center",
              margin: "8px 0",
            },
          },
          "Need help? Visit clayo.co/support or contact us at support@clayo.co",
        ),
        React.createElement(
          Text,
          {
            style: {
              color: "#999999",
              fontSize: "12px",
              lineHeight: "16px",
              textAlign: "center",
              margin: "8px 0",
            },
          },
          "Clayo, London, United Kingdom",
        ),
      ),
    ),
  )
}

module.exports = ConfirmationEmail
