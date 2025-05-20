const React = require('react');
const { Body, Container, Head, Heading, Html, Text, Preview, Section, Hr } = require('@react-email/components');

function UpgradeEmail() {
  return React.createElement(
    Html,
    null,
    React.createElement(
      Head,
      null,
      React.createElement("style", null, "@import url('https://fonts.googleapis.com/css2?family=Inter&display=swap');")
    ),
    React.createElement(Preview, null, "Welcome to SignalFlow!"),
    React.createElement(
      Body,
      { style: { backgroundColor: 'white', fontFamily: "'Inter', sans-serif" } },
      React.createElement(
        Container,
        {
          style: {
            border: '1px solid #eaeaea',
            borderRadius: '8px',
            margin: '40px auto',
            padding: '20px',
            width: '465px',
          }
        },
        React.createElement(
          Section,
          { style: { textAlign: 'center', marginTop: '32px' } },
          React.createElement("img", {
            src: "https://loswauqksonswxwgeoiv.supabase.co/storage/v1/object/public/pics/signalflow.png",
            width: "140",
            height: "130",
            alt: "Signal Flow",
            style: { margin: 'auto' }
          })
        ),
        React.createElement(
          Heading,
          {
            style: {
              color: '#333',
              fontSize: '24px',
              textAlign: 'center',
              margin: '30px auto 0 auto'
            }
          },
          "Welcome to SignalFlow"
        ),
        React.createElement(
          Text,
          {
            style: {
              color: '#333',
              fontSize: '16px',
              lineHeight: '24px',
              textAlign: 'center',
              margin: '20px 0'
            }
          },
          "Congratulations on upgrading your plan! You've just taken a significant step toward trading success. At SignalFlow, you're joining a global community of traders who rely on data-driven insights rather than guesswork and vibes."
        ),
        React.createElement(
          Text,
          {
            style: {
              color: '#333',
              fontSize: '16px',
              lineHeight: '24px',
              textAlign: 'center',
              margin: '10px 0'
            }
          },
          "We believe you've turned a corner towards more informed trading decisions and greater potential for success in the markets."
        ),
        React.createElement(Hr, { style: { border: '1px solid #eaeaea', margin: '26px 0', width: '100%' } }),
        React.createElement(
          Text,
          {
            style: {
              color: '#666666',
              fontSize: '14px',
              lineHeight: '24px',
              textAlign: 'center',
              fontStyle: 'italic'
            }
          },
          "\"The secret of getting ahead is getting started.\" – Mark Twain"
        ),
        React.createElement(Hr, { style: { border: '1px solid #eaeaea', margin: '26px 0', width: '100%' } }),
        React.createElement(
          Text,
          {
            style: {
              color: '#666666',
              fontSize: '12px',
              lineHeight: '24px',
              textAlign: 'center'
            }
          },
          "Please do not reply to this email as it is not monitored."
        ),
        React.createElement(
          Text,
          {
            style: {
              color: '#666666',
              fontSize: '12px',
              lineHeight: '24px',
              textAlign: 'center'
            }
          },
          "SignalFlow, London, United Kingdom"
        )
      )
    )
  );
}

module.exports = UpgradeEmail;
