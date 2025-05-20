const { Resend } = require("resend")
const { render } = require("@react-email/render")
const React = require("react")
const { Body, Container, Head, Heading, Html, Text, Preview, Section, Link, Hr } = require("@react-email/components")

const resend = new Resend("re_QEXjrfmA_L4GVrubfEK8SJW7JFz6s63Mr")

// Your Welcome Email component
function WelcomeEmail() {
  return React.createElement(
    Html,
    null,
    React.createElement(
      Head,
      null,
      React.createElement("style", null, "@import url('https://fonts.googleapis.com/css2?family=Inter&display=swap');"),
    ),
    React.createElement(Preview, null, "Welcome to SignalFlow"),
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
            src: "https://vvtzvlzhldqsvezfdfyd.supabase.co/storage/v1/object/public/media//LogoBlack.svg",
            width: "140",
            height: "130",
            alt: "Signal Flow",
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
          "Welcome to Comovis!",
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
          "Thank you for joining SignalFlow, where technology and insight give you the edge in the Solana market. We understand that navigating the fast-paced world of crypto can be challenging—sifting through thousands of tokens, spotting stable projects, and identifying high-potential opportunities before they trend is humanly impossible. That's why we're here.",
        ),
        React.createElement(
          Text,
          {
            style: {
              color: "#333",
              fontSize: "16px",
              lineHeight: "24px",
              textAlign: "center",
              margin: "10px 0",
            },
          },
          "With SignalFlow, you're equipped with cutting-edge technology powered by AI and custom algorithms that analyze millions of data points every day. We do the heavy lifting so you don't have to, bespoke scoring models and filtering tokens to bring you real-time insights that you can execute with on the market.",
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
          '"Success is where preparation and opportunity meet." – Bobby Unser',
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

module.exports = WelcomeEmail