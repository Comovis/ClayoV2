const { supabaseAdmin } = require('../SupabaseClient');

/**
 * Creates a new user with associated company in a single transaction
 * @param {Object} userData - User data for signup
 * @param {string} userData.email - User's email
 * @param {string} userData.password - User's password
 * @param {string} userData.fullName - User's full name
 * @param {string} userData.companyName - Company name
 * @returns {Promise<Object>} Created user and company data
 */
async function createUserWithCompany({ email, password, fullName, companyName }) {
  console.log(`Starting signup process for ${email} with company ${companyName}`);
  
  try {
    // 1. Create the auth user first
    console.log('Creating auth user...');
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false, // Set to true if you want to skip email verification
      user_metadata: {
        full_name: fullName,
      }
    });

    if (authError) {
      console.error('Auth user creation failed:', authError);
      throw new Error(`Auth error: ${authError.message}`);
    }

    if (!authData.user) {
      throw new Error('User creation failed: No user returned');
    }

    const userId = authData.user.id;
    console.log(`Auth user created with ID: ${userId}`);

    // 2. Create company
    console.log('Creating company record...');
    const { data: companyData, error: companyError } = await supabaseAdmin
      .from('companies')
      .insert([{ 
        name: companyName,
        vessel_count: null  // Explicitly set to null since it will be set during onboarding
      }])
      .select('id')
      .single();

    if (companyError) {
      console.error('Company creation failed:', companyError);
      // Attempt to clean up the auth user since company creation failed
      await cleanupAuthUser(userId);
      throw new Error(`Company creation error: ${companyError.message}`);
    }

    const companyId = companyData.id;
    console.log(`Company created with ID: ${companyId}`);

    // 3. Create user record linked to company
    console.log('Creating user record...');
    const { error: userError } = await supabaseAdmin
      .from('users')
      .insert([{
        id: userId,
        company_id: companyId,
        email: email,
        full_name: fullName,
        role: 'admin',
        is_company_admin: true,
        onboarding_step: 'welcome'
      }]);

    if (userError) {
      console.error('User record creation failed:', userError);
      // Clean up both auth user and company
      await cleanupCompany(companyId);
      await cleanupAuthUser(userId);
      throw new Error(`User record error: ${userError.message}`);
    }

    console.log('Signup process completed successfully');
    
    return {
      success: true,
      user: {
        id: userId,
        email,
        fullName
      },
      company: {
        id: companyId,
        name: companyName
      }
    };
  } catch (error) {
    console.error('Signup process failed:', error);
    throw error;
  }
}

/**
 * Cleanup function to delete an auth user if something fails
 * @param {string} userId - The user ID to delete
 */
async function cleanupAuthUser(userId) {
  try {
    console.log(`Cleaning up auth user ${userId}...`);
    await supabaseAdmin.auth.admin.deleteUser(userId);
    console.log(`Auth user ${userId} deleted successfully`);
  } catch (error) {
    console.error(`Failed to clean up auth user ${userId}:`, error);
  }
}

/**
 * Cleanup function to delete a company if something fails
 * @param {string} companyId - The company ID to delete
 */
async function cleanupCompany(companyId) {
  try {
    console.log(`Cleaning up company ${companyId}...`);
    await supabaseAdmin.from('companies').delete().eq('id', companyId);
    console.log(`Company ${companyId} deleted successfully`);
  } catch (error) {
    console.error(`Failed to clean up company ${companyId}:`, error);
  }
}

module.exports = {
  createUserWithCompany
};