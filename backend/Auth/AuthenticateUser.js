const jwt = require('jsonwebtoken');
const { supabase } = require('../SupabaseClient');

// Authenticates the user by verifying the JWT token
const authenticateUser = (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader) {
    token = authHeader.split(' ')[1]; // Bearer <token>
  } else if (req.query.accessToken) {
    token = req.query.accessToken; // Fallback to token in query parameter
  } else {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // Verify the token using the Supabase JWT secret
    const payload = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);

    // Map `sub` to `user_id` for compatibility with other middlewares
    req.user = {
      ...payload,
      user_id: payload.sub, // Ensure user_id is accessible as expected
    };

    //console.log("User authenticated, User ID:", req.user.user_id); // Log to confirm user_id is defined
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = { authenticateUser };
