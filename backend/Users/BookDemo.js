
const { supabaseAdmin } = require("../SupabaseClient")

// Handle demo booking request
const handleBookDemoRequest = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      company,
      phoneNumber,
      countryCode,
      role,
      fleetSize,
      message
    } = req.body;

    // Basic validation
    if (!firstName || !lastName || !email || !company) {
      return res.status(400).json({
        success: false,
        error: "First name, last name, email, and company are required"
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid email address"
      });
    }

    // Insert demo booking into database
    const { data, error } = await supabaseAdmin
      .from('demo_bookings')
      .insert([
        {
          first_name: firstName,
          last_name: lastName,
          email: email.toLowerCase().trim(),
          company: company.trim(),
          phone_number: phoneNumber?.trim() || null,
          country_code: countryCode || null,
          role: role || null,
          fleet_size: fleetSize || null,
          message: message?.trim() || null
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({
        success: false,
        error: "Failed to save demo booking"
      });
    }

    // Log successful booking
    console.log('Demo booking created:', {
      id: data.id,
      email: data.email,
      company: data.company,
      created_at: data.created_at
    });

    // Return success response
    res.status(201).json({
      success: true,
      message: "Demo booking submitted successfully",
      data: {
        id: data.id,
        email: data.email,
        company: data.company,
        created_at: data.created_at
      }
    });

  } catch (error) {
    console.error('Error handling demo booking:', error);
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
};

// Export the handler
module.exports = { handleBookDemoRequest };