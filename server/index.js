require('dotenv').config({ path: '../.env.local' });
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Strava API Configuration
const STRAVA_CLIENT_ID = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;
const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI;

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Strava OAuth Server is running',
    hasClientId: !!STRAVA_CLIENT_ID,
    hasClientSecret: !!STRAVA_CLIENT_SECRET
  });
});

// Step 1: Redirect user to Strava authorization page
app.get('/auth/strava', (req, res) => {
  const scope = 'read,activity:read_all';
  const authUrl = `https://www.strava.com/oauth/authorize?client_id=${STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&approval_prompt=force&scope=${scope}`;
  
  res.redirect(authUrl);
});

// Step 2: Handle OAuth callback from Strava
app.get('/auth/callback', async (req, res) => {
  const { code, error } = req.query;

  // Handle authorization denial
  if (error) {
    return res.redirect(`http://localhost:3000/login?error=${error}`);
  }

  if (!code) {
    return res.redirect('http://localhost:3000/login?error=no_code');
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await axios.post('https://www.strava.com/oauth/token', {
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      code: code,
      grant_type: 'authorization_code'
    });

    const { access_token, refresh_token, expires_at, athlete } = tokenResponse.data;

    // Redirect back to frontend with tokens
    const redirectUrl = `http://localhost:3000/?access_token=${access_token}&refresh_token=${refresh_token}&expires_at=${expires_at}&athlete_id=${athlete.id}`;
    res.redirect(redirectUrl);

  } catch (error) {
    console.error('Error exchanging code for token:', error.response?.data || error.message);
    res.redirect('http://localhost:3000/login?error=token_exchange_failed');
  }
});

// Step 3: Fetch activities from Strava API (proxy endpoint)
app.get('/api/activities', async (req, res) => {
  const { access_token, per_page = 30, page = 1 } = req.query;

  if (!access_token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const response = await axios.get('https://www.strava.com/api/v3/athlete/activities', {
      headers: {
        'Authorization': `Bearer ${access_token}`
      },
      params: {
        per_page,
        page
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching activities:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to fetch activities',
      details: error.response?.data || error.message
    });
  }
});

// Refresh access token
app.post('/auth/refresh', async (req, res) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    return res.status(400).json({ error: 'Refresh token required' });
  }

  try {
    const response = await axios.post('https://www.strava.com/oauth/token', {
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      refresh_token: refresh_token,
      grant_type: 'refresh_token'
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error refreshing token:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to refresh token'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 OAuth Server running on http://localhost:${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Strava OAuth: http://localhost:${PORT}/auth/strava`);
  console.log(`\n⚙️  Configuration:`);
  console.log(`   Client ID: ${STRAVA_CLIENT_ID ? '✓ Set' : '✗ Missing'}`);
  console.log(`   Client Secret: ${STRAVA_CLIENT_SECRET ? '✓ Set' : '✗ Missing'}`);
});