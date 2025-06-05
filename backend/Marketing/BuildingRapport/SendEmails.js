import { Resend } from 'resend';
import { parse } from 'csv-parse/sync';
import fs from 'fs';

const resend = new Resend('re_fZygLEii_AHipNeWqXfWbtejMrVFLW7yG');

async function sendEmails() {
  try {
    // Read and parse CSV file
    const csvData = fs.readFileSync('/Applications/ComovisTS/backend/Marketing/BuildingRapport/batch2.csv', 'utf-8');
    const recipients = parse(csvData, { columns: true, skip_empty_lines: true });

    // Filter out invalid or unavailable emails
    const validRecipients = recipients.filter(
      (recipient) => recipient.Email && recipient['Email Status'] !== 'Unavailable'
    );

    // Send emails one at a time with a 3-second delay
    const results = [];
    for (const { 'First Name': firstName, Email: email } of validRecipients) {
      const response = await resend.emails.send({
        from: 'Ivan <Ivan@comovis.co>',
        to: [email],
        subject: `Quick question on fleet document tracking (results shared)`,
        text: `Hi ${firstName},\n\nI'm Ivan - formerly with Kpler where I worked on MarineTraffic products after the acquisition. Now I'm building tools to simplify maritime compliance.\n\nLately, I've been talking to fleet managers about document tracking across vessels, and one pain point keeps coming up: expiring certificates and managing docs across fleets.\n\nHow's your team handling it - spreadsheets, manual checks, or something else?\n\nNo pitch - just genuinely curious. If you reply, I'll share anonymised insights from other managers. Either way, thanks for your time and have a great weekend!\n\nBest,\nIvan\nFounder, Comovis | Ex-Kpler \nHelping fleet managers reduce detention risks\nhttps://www.comovis.co`
      });
      results.push({ email, status: 'sent', response });
      console.log(`Email sent to ${email}`);
      // Add 3-second delay
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    console.log('All emails sent:', results);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

sendEmails();