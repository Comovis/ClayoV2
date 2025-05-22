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
  Img,
} = require("@react-email/components")
const React = require("react")

function DocumentShareEmail(props) {
  const {
    recipientName = "",
    senderName,
    senderCompany,
    vesselName,
    vesselIMO,
    shareLink,
    documentCount,
    expiryDate,
    customMessage,
  } = props

  // Format the expiry date
  const formattedExpiryDate = new Date(expiryDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Determine greeting - use name if available, otherwise generic
  const greeting = recipientName ? `Hello ${recipientName},` : "Hello,"

  return React.createElement(
    Html,
    null,
    React.createElement(
      Head,
      null,
      React.createElement("style", null, "@import url('https://fonts.googleapis.com/css2?family=Inter&display=swap');"),
    ),
    React.createElement(Preview, null, `${senderName} has shared vessel documents with you via Comovis`),
    React.createElement(
      Body,
      { style: { backgroundColor: "#f5f5f5", fontFamily: "'Inter', sans-serif" } },
      React.createElement(
        Container,
        {
          style: {
            backgroundColor: "white",
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
              color: "#1e3a8a",
              fontSize: "24px",
              textAlign: "center",
              margin: "30px auto 0 auto",
            },
          },
          "Maritime Documents Shared"
        ),
        React.createElement(
          Text,
          {
            style: {
              color: "#333",
              fontSize: "16px",
              lineHeight: "24px",
              margin: "20px 0",
            },
          },
          greeting
        ),
        React.createElement(
          Text,
          {
            style: {
              color: "#333",
              fontSize: "16px",
              lineHeight: "24px",
              margin: "20px 0",
            },
          },
          React.createElement("strong", null, senderName),
          " from ",
          React.createElement("strong", null, senderCompany),
          " has shared vessel documents with you through Comovis's secure document sharing platform."
        ),
        React.createElement(
          Section,
          {
            style: {
              backgroundColor: "#f8fafc",
              padding: "16px",
              borderRadius: "8px",
              margin: "24px 0",
            },
          },
          React.createElement(
            Text,
            {
              style: {
                margin: "0 0 8px 0",
                fontSize: "15px",
              },
            },
            React.createElement("strong", null, "Vessel:"),
            " ",
            vesselName,
            vesselIMO ? ` (IMO: ${vesselIMO})` : ""
          ),
          React.createElement(
            Text,
            {
              style: {
                margin: "8px 0",
                fontSize: "15px",
              },
            },
            React.createElement("strong", null, "Documents:"),
            " ",
            documentCount,
            documentCount === 1 ? " document" : " documents"
          ),
          React.createElement(
            Text,
            {
              style: {
                margin: "8px 0",
                fontSize: "15px",
              },
            },
            React.createElement("strong", null, "Access expires:"),
            " ",
            formattedExpiryDate
          )
        ),
        customMessage &&
          React.createElement(
            Section,
            {
              style: {
                margin: "24px 0",
              },
            },
            React.createElement(
              Text,
              {
                style: {
                  color: "#333",
                  fontSize: "15px",
                  fontStyle: "italic",
                  lineHeight: "24px",
                  margin: "0",
                },
              },
              `"${customMessage}"`
            )
          ),
        React.createElement(
          Section,
          { style: { textAlign: "center", margin: "30px 0" } },
          React.createElement(
            "a",
            {
              href: shareLink,
              style: {
                backgroundColor: "#1e3a8a",
                borderRadius: "4px",
                color: "white",
                fontSize: "14px",
                textDecoration: "none",
                textAlign: "center",
                display: "inline-block",
                padding: "12px 30px",
                fontWeight: "bold",
              },
            },
            "View Secure Documents"
          )
        ),
        React.createElement(
          Section,
          {
            style: {
              backgroundColor: "#f0f9ff",
              borderLeft: "4px solid #0ea5e9",
              padding: "12px 16px",
              borderRadius: "4px",
              margin: "24px 0",
            },
          },
          React.createElement(
            Text,
            {
              style: {
                color: "#0c4a6e",
                fontSize: "14px",
                margin: "0",
              },
            },
            "These documents are shared securely through Comovis. Your access is monitored for security purposes and will expire on ",
            formattedExpiryDate,
            "."
          )
        ),
        React.createElement(
          Text,
          {
            style: {
              color: "#666666",
              fontSize: "14px",
              lineHeight: "24px",
              textAlign: "center",
              margin: "20px 0",
            },
          },
          "If the button above doesn't work, you can also access the documents by copying and pasting the following link into your browser:"
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
          shareLink
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
          '"The sea is the same as it has been since before men ever went on it in boats." — Ernest Hemingway'
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
          "This is an automated message from Comovis Maritime Compliance Platform."
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
          "Comovis, London, United Kingdom"
        )
      )
    )
  )
}

module.exports = DocumentShareEmail