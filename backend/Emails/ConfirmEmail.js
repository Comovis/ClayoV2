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

const resend = new Resend("re_fZygLEii_AHipNeWqXfWbtejMrVFLW7yG")

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
    React.createElement(Preview, null, "Confirm your Comovis account"),
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
            src: "https://vvtzvlzhldqsvezfdfyd.supabase.co/storage/v1/object/public/media//COmvoisPNGLogoBlack.png",
            width: "140",
            height: "130",
            alt: "Comovis",
            style: { margin: "auto" },
          }),
        ),
        React.createElement(
          Heading,
          {
            style: {
              color: "#333",
              fontSize: "24px",
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
              color: "#333",
              fontSize: "16px",
              lineHeight: "24px",
              textAlign: "center",
              margin: "20px 0",
            },
          },
          "Thank you for registering with Comovis. To complete your registration and access your maritime compliance dashboard, please confirm your email address by clicking the button below.",
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
                borderRadius: "4px",
                color: "white",
                fontSize: "14px",
                textDecoration: "none",
                textAlign: "center",
                display: "inline-block",
                padding: "10px 22px",
                fontWeight: "bold",
              },
            },
            "Confirm Email Address",
          ),
        ),
        React.createElement(
          Text,
          {
            style: {
              color: "#333",
              fontSize: "16px",
              lineHeight: "24px",
              textAlign: "center",
              margin: "20px 0",
            },
          },
          "If you did not create an account with Comovis, please disregard this email.",
        ),
        React.createElement(
          Text,
          {
            style: {
              color: "#333",
              fontSize: "14px",
              lineHeight: "24px",
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
              fontSize: "14px",
              lineHeight: "24px",
              textAlign: "center",
              margin: "10px 0",
              wordBreak: "break-all",
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
              lineHeight: "24px",
              textAlign: "center",
              fontStyle: "italic",
            },
          },
          '"The pessimist complains about the wind; the optimist expects it to change; the realist adjusts the sails." – William Arthur Ward',
        ),
        React.createElement(Hr, { style: { border: "1px solid #eaeaea", margin: "26px 0", width: "100%" } }),
        React.createElement(
          Text,
          {
            style: {
              color: "#666666",
              fontSize: "12px",
              lineHeight: "24px",
              textAlign: "center",
            },
          },
          "Please do not reply to this email as it is not monitored.",
        ),
        React.createElement(
          Text,
          {
            style: {
              color: "#666666",
              fontSize: "12px",
              lineHeight: "24px",
              textAlign: "center",
            },
          },
          "Comovis, London, United Kingdom",
        ),
      ),
    ),
  )
}

module.exports = ConfirmationEmail