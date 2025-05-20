const { supabaseAdmin } = require('../SupabaseClient');
const { sendConfirmationEmail } = require('./SendConfirmEmail');

/**
 * Generates a confirmation link and sends a confirmation email
 * @param {string} email - User's email address
 * @returns {Promise<Object>} Result of the operation
 */
async function sendUserConfirmationEmail(email) {
  try {
    if (!email) {
      throw new Error('Email is required');
    }

    console.log(`Generating confirmation link for ${email}...`);
    
    // Check if we're in development mode
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    // Set the redirect URL based on environment
    const redirectUrl = isDevelopment 
      ? 'http://localhost:1601/confirm-email'
      : 'https://comovis.co/confirm-email';
    
    console.log(`Using redirect URL: ${redirectUrl} (${isDevelopment ? 'development' : 'production'} mode)`);
    
    // Generate a signup link with Supabase
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'signup',
      email,
      options: {
        redirectTo: redirectUrl
      }
    });

    if (error) {
      console.error('Error generating confirmation link:', error);
      throw error;
    }

    // Get the action link from the response
    const confirmationLink = data.properties.action_link;
    
    // Send the confirmation email
    await sendConfirmationEmail(email, confirmationLink);
    
    return { success: true, message: 'Confirmation email sent successfully' };
  } catch (error) {
    console.error('Error in sendUserConfirmationEmail:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to send confirmation email' 
    };
  }
}

/**
 * Resends a confirmation email to a user
 * @param {string} email - User's email address
 * @returns {Promise<Object>} Result of the operation
 */
async function resendConfirmationEmail(email) {
  return sendUserConfirmationEmail(email);
}

module.exports = {
  sendUserConfirmationEmail,
  resendConfirmationEmail
};