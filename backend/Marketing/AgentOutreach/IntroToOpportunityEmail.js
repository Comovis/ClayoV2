import { Resend } from 'resend';
import { parse } from 'csv-parse/sync';
import fs from 'fs';

const resend = new Resend('re_fZygLEii_AHipNeWqXfWbtejMrVFLW7yG');

async function sendEmails() {
  try {
    // Read and parse CSV file
    const csvData = fs.readFileSync('/Applications/ComovisTS/backend/Marketing/AgentOutreach/batch1.csv', 'utf-8');
    const recipients = parse(csvData, { columns: true, skip_empty_lines: true });

    // Filter out invalid or unavailable emails
    const validRecipients = recipients.filter(
      (recipient) => recipient.Email && recipient['Email Status'] !== 'Unavailable'
    );

    // Initialize log array
    const emailLog = [];

    // Send emails one at a time with a 3-second delay
    const results = [];
    for (const { 'First Name': firstName, 'Company': company, Email: email } of validRecipients) {
      const response = await resend.emails.send({
        from: 'Ivan <Ivan@comovis.co>',
        to: [email],
        subject: 'Partnership Opportunity: Earn £500-£2000+ Monthly Commission',
        html: `
          <p>Hi ${firstName},</p>
          <p>I hope this email finds you well. I'm reaching out because I believe there's a significant opportunity for <b>${company}</b> to generate additional revenue while helping your vessel operator clients.</p>
          <p><b>The Opportunity:</b><br>
          We've developed a maritime compliance platform that's helping vessel operators streamline their document management and port preparation processes. We're looking for established port agents to become our local partners.</p>
          <p><b>What's in it for you:</b><br>
          • 20% commission on all new customers you refer (typically £500-£2000+ per vessel annually)<br>
          • Recurring 10% commission on renewals<br>
          • No upfront costs or commitments<br>
          • Full training and marketing support provided</p>
          <p><b>Why this works:</b><br>
          Your clients are already struggling with:<br>
          • Document compliance for port calls<br>
          • Manual processes for certificate tracking<br>
          • Last-minute scrambles for required paperwork<br>
          • Communication gaps with port authorities</p>
          <p>Our platform solves these exact problems, and you're perfectly positioned to introduce it.</p>
          <p><b>Next Steps:</b><br>
          Would you be open to a 15-minute call this week to discuss how this could work for you and your dedicated port? If so, please respond and let's get started. I can show you exactly how other agents are earning £1000+ monthly through our program.</p>
          <p>Best,<br>
          Ivan<br>
          Founder, Comovis | Ex-Kpler<br>
          Helping fleet managers reduce detention risks<br>
          <a href="https://www.comovis.co">https://www.comovis.co</a></p>
        `
      });
      const delivered = response.error ? 'No' : 'Yes';
      emailLog.push({ firstName, email, emailType: 'IntroToOpportunity', delivered });
      results.push({ email, status: 'sent', response });
      console.log(`Email sent to ${email}`);
      // Add 3-second delay
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    // Write log to JSON file in the same directory
    fs.writeFileSync('/Applications/ComovisTS/backend/Marketing/AgentOutreach/email_log.json', JSON.stringify(emailLog, null, 2));

    console.log('All emails sent:', results);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

sendEmails();