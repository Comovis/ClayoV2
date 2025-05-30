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
const React = require("react")

// Function to format role names
function formatRoleName(role) {
  if (!role) return ""

  // Replace underscores with spaces and capitalize each word
  return role
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

// Your Invitation Email component
function InvitationEmail(props) {
  const { invitationLink, inviterName, inviterCompany, role } = props

  // Format the role name
  const formattedRole = formatRoleName(role)

  return React.createElement(
    Html,
    null,
    React.createElement(
      Head,
      null,
      React.createElement("style", null, "@import url('https://fonts.googleapis.com/css2?family=Inter&display=swap');"),
    ),
    React.createElement(Preview, null, "You've been invited to join Comovis Maritime Compliance Platform"),
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
          "You've Been Invited to Comovis",
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
          inviterName,
          " from ",
          inviterCompany,
          " has invited you to join their maritime compliance team as a ",
          React.createElement("strong", null, formattedRole),
          ". Comovis helps maritime operators prevent vessel detentions and delays by automating document management and providing real-time port requirement intelligence.",
        ),
        React.createElement(
          Section,
          { style: { textAlign: "center", margin: "30px 0" } },
          React.createElement(
            "a",
            {
              href: invitationLink,
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
            "Accept Invitation",
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
          "With Comovis, you'll be able to:",
        ),
        React.createElement(
          Text,
          {
            style: {
              color: "#333",
              fontSize: "16px",
              lineHeight: "24px",
              margin: "10px 0 10px 30px",
            },
          },
          "• Track vessel certificates and their expiry dates",
          React.createElement("br"),
          "• Access real-time port requirement intelligence",
          React.createElement("br"),
          "• Prepare for Port State Control inspections",
          React.createElement("br"),
          "• Streamline maritime compliance documentation",
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
          "If the button above doesn't work, you can also accept the invitation by copying and pasting the following link into your browser:",
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
          invitationLink,
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
          '"A ship in harbor is safe, but that is not what ships are built for." — John A. Shedd',
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

module.exports = InvitationEmail
