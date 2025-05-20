const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { sendUserConfirmationEmail, resendConfirmationEmail } = require('./Emails/EmailAuthLinkService');
const { createUserWithCompany } = require('./Auth/SignupAuthService');

// Create Express app
const app = express();

// Dynamic port configuration
const port = process.env.PORT || 2807;

// Basic middleware
app.use(express.json());
app.use(cors());


app.post('/api/send-confirmation-email', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    const result = await sendUserConfirmationEmail(email);
    
    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }
    
    res.status(200).json({ message: 'Confirmation email sent successfully' });
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    res.status(500).json({ error: 'Failed to send confirmation email' });
  }
});




app.post('/api/resend-confirmation-email', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    const result = await resendConfirmationEmail(email);
    
    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }
    
    res.status(200).json({ message: 'Confirmation email resent successfully' });
  } catch (error) {
    console.error('Error resending confirmation email:', error);
    res.status(500).json({ error: 'Failed to resend confirmation email' });
  }
});


app.post('/api/signup', async (req, res) => {
  try {
    const { email, password, fullName, companyName } = req.body;
    
    // Validate required fields
    if (!email || !password || !fullName || !companyName) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        details: 'Email, password, full name, and company name are required'
      });
    }
    
    // Create user and company
    const result = await createUserWithCompany({
      email,
      password,
      fullName,
      companyName
    });
    
    // Send confirmation email
    const emailResult = await sendUserConfirmationEmail(email);
    
    if (!emailResult.success) {
      console.warn(`User created but confirmation email failed: ${emailResult.error}`);
    }
    
    // Return success response
    res.status(200).json({
      success: true,
      message: 'Account created successfully',
      user: result.user,
      company: result.company,
      emailSent: emailResult.success
    });
  } catch (error) {
    console.error('Signup error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to create account',
      message: error.message || 'An unexpected error occurred'
    });
  }
});




// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Comovis V2 backend is running on port ${port}`);
});