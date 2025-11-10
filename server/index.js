require('dotenv').config({ path: '../.env.local' });
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Strava OAuth Server is running' });
});

// Placeholder for OAuth routes (we'll add tomorrow)
app.get('/auth/strava', (req, res) => {
  res.json({ message: 'OAuth flow will be added here' });
});

app.get('/auth/callback', (req, res) => {
  res.json({ message: 'OAuth callback will be added here' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 OAuth Server running on http://localhost:${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});