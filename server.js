import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the existing modular OAuth system
import { PLATFORMS, generateConsentUrl, exchangeCodeForToken, getUserInfo, refreshAccessToken } from './src/core/platforms/index.js';

// Import UI components
import { getModernAuthPage } from './src/ui/pages/auth.js';
import { getModernDashboardPage } from './src/ui/pages/dashboard.js';
import { getModernAppsPage } from './src/ui/pages/apps.js';
import { getModernApiKeysPage } from './src/ui/pages/api-keys.js';
import { getModernAnalyticsPage } from './src/ui/pages/analytics.js';
import { getModernProfilePage } from './src/ui/pages/profile.js';
import { getModernSettingsPage } from './src/ui/pages/settings.js';
import { getModernDocsPage } from './src/ui/pages/docs.js';
import { getModernSubscriptionPage } from './src/ui/pages/subscription.js';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// In-memory storage (for demo - replace with database in production)
const users = new Map();
const userApps = new Map();
const apiKeys = new Map();
const sessions = new Map();

// Utility functions
function generateId() {
  return crypto.randomUUID();
}

function generateApiKey() {
  return 'oauth_' + crypto.randomBytes(32).toString('hex');
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

function verifyPassword(password, hash, salt) {
  const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === verifyHash;
}

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Authentication routes
app.post('/auth/signup', (req, res) => {
  try {
    const { email, password } = req.body;
    if (users.has(email)) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const { hash, salt } = hashPassword(password);
    const user = {
      id: generateId(),
      email,
      passwordHash: hash,
      passwordSalt: salt,
      createdAt: new Date()
    };

    users.set(email, user);
    res.json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    const user = users.get(email);

    if (!user || !verifyPassword(password, user.passwordHash, user.passwordSalt)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const sessionId = generateId();
    sessions.set(sessionId, { userId: user.id, email, createdAt: new Date() });

    res.json({ sessionId, user: { id: user.id, email } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/auth/logout', (req, res) => {
  try {
    const { sessionId } = req.body;
    sessions.delete(sessionId);
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/auth/me', (req, res) => {
  try {
    const { sessionId } = req.query;
    const session = sessions.get(sessionId);

    if (!session) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    const user = users.get(session.email);
    res.json({ user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error('Me error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// App management routes
app.post('/save-app', (req, res) => {
  try {
    const { email, platform, clientId, clientSecret } = req.body;

    if (!userApps.has(email)) {
      userApps.set(email, new Map());
    }

    const userAppMap = userApps.get(email);
    userAppMap.set(platform, {
      clientId,
      clientSecret,
      createdAt: new Date()
    });

    res.json({ message: 'App saved successfully' });
  } catch (error) {
    console.error('Save app error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/user-apps', (req, res) => {
  try {
    const { email } = req.query;
    const apps = userApps.get(email) || new Map();
    const appsArray = Array.from(apps.entries()).map(([platform, config]) => ({
      platform,
      clientId: config.clientId,
      createdAt: config.createdAt
    }));

    res.json({ apps: appsArray });
  } catch (error) {
    console.error('Get apps error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/delete-app/:platform', (req, res) => {
  try {
    const { email } = req.query;
    const { platform } = req.params;

    const userAppMap = userApps.get(email);
    if (userAppMap) {
      userAppMap.delete(platform);
    }

    res.json({ message: 'App deleted successfully' });
  } catch (error) {
    console.error('Delete app error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API Keys routes
app.get('/api-keys', (req, res) => {
  try {
    const { email } = req.query;
    const userKeys = Array.from(apiKeys.entries())
      .filter(([key, data]) => data.email === email)
      .map(([key, data]) => ({
        keyId: data.keyId,
        name: data.name,
        createdAt: data.createdAt,
        lastUsed: data.lastUsed
      }));

    res.json({ apiKeys: userKeys });
  } catch (error) {
    console.error('Get API keys error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api-keys', (req, res) => {
  try {
    const { email, name } = req.body;
    const apiKey = generateApiKey();
    const keyId = generateId();

    apiKeys.set(apiKey, {
      keyId,
      email,
      name,
      createdAt: new Date(),
      lastUsed: null
    });

    res.json({ apiKey, keyId, name });
  } catch (error) {
    console.error('Create API key error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api-keys/:keyId', (req, res) => {
  try {
    const { keyId } = req.params;
    const { email } = req.query;

    for (const [key, data] of apiKeys.entries()) {
      if (data.keyId === keyId && data.email === email) {
        apiKeys.delete(key);
        break;
      }
    }

    res.json({ message: 'API key deleted successfully' });
  } catch (error) {
    console.error('Delete API key error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Platforms route
app.get('/api/platforms', (req, res) => {
  try {
    const platforms = Object.keys(PLATFORMS).map(key => ({
      id: key,
      name: PLATFORMS[key].displayName,
      icon: PLATFORMS[key].icon,
      description: PLATFORMS[key].description
    }));

    res.json({ platforms });
  } catch (error) {
    console.error('Get platforms error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// OAuth routes
app.get('/oauth/authorize', (req, res) => {
  try {
    const { client_id, redirect_uri, scope, response_type, state } = req.query;

    // For demo purposes, we'll show a simple consent page
    const consentPage = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>OAuth Consent</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
            .consent-form { background: #f5f5f5; padding: 20px; border-radius: 8px; }
            button { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
          </style>
        </head>
        <body>
          <div class="consent-form">
            <h2>Application Requesting Access</h2>
            <p><strong>Client ID:</strong> ${client_id}</p>
            <p><strong>Scopes:</strong> ${scope || 'read'}</p>
            <form method="post" action="/oauth/authorize">
              <input type="hidden" name="client_id" value="${client_id}">
              <input type="hidden" name="redirect_uri" value="${redirect_uri}">
              <input type="hidden" name="scope" value="${scope}">
              <input type="hidden" name="response_type" value="${response_type}">
              <input type="hidden" name="state" value="${state}">
              <button type="submit" name="action" value="allow">Allow</button>
              <button type="submit" name="action" value="deny">Deny</button>
            </form>
          </div>
        </body>
      </html>
    `;

    res.send(consentPage);
  } catch (error) {
    console.error('Authorize error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/oauth/authorize', (req, res) => {
  try {
    const { client_id, redirect_uri, scope, response_type, state, action } = req.body;

    if (action === 'deny') {
      const denyUrl = `${redirect_uri}?error=access_denied${state ? `&state=${state}` : ''}`;
      return res.redirect(denyUrl);
    }

    // Generate authorization code
    const code = generateId();
    const redirectUrl = `${redirect_uri}?code=${code}${state ? `&state=${state}` : ''}`;

    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Authorize POST error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/oauth/token', (req, res) => {
  try {
    const { grant_type, code, client_id, client_secret } = req.body;

    if (grant_type !== 'authorization_code') {
      return res.status(400).json({ error: 'unsupported_grant_type' });
    }

    // For demo purposes, we'll create a simple access token
    const accessToken = generateId();
    const refreshToken = generateId();

    res.json({
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: 3600,
      refresh_token: refreshToken
    });
  } catch (error) {
    console.error('Token error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Analytics route
app.get('/analytics', (req, res) => {
  try {
    const { sessionId } = req.query;
    const session = sessions.get(sessionId);

    if (!session) {
      return res.redirect('/auth');
    }

    res.send(getModernAnalyticsPage());
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Subscription routes
app.get('/subscription/status', (req, res) => {
  try {
    const { email } = req.query;
    // Mock subscription status for demo
    res.json({
      plan: 'free',
      status: 'active',
      usage: {
        apiCalls: { current: 1250, limit: 5000, percentage: 25 },
        apiKeys: { current: 2, limit: 5, percentage: 40 },
        oauthApps: { current: 1, limit: 3, percentage: 33 }
      },
      billingCycle: 'monthly'
    });
  } catch (error) {
    console.error('Subscription status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/subscription/plans', (req, res) => {
  try {
    res.json({
      plans: [
        {
          id: 'free',
          name: 'Free',
          price: 0,
          interval: 'month',
          features: ['5 API keys', '3 OAuth apps', '5,000 API calls/month']
        },
        {
          id: 'pro',
          name: 'Pro',
          price: 29,
          interval: 'month',
          features: ['25 API keys', '15 OAuth apps', '50,000 API calls/month', 'Priority support']
        },
        {
          id: 'enterprise',
          name: 'Enterprise',
          price: 99,
          interval: 'month',
          features: ['Unlimited API keys', 'Unlimited OAuth apps', '500,000 API calls/month', 'Dedicated support']
        }
      ]
    });
  } catch (error) {
    console.error('Subscription plans error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/subscription/checkout', (req, res) => {
  try {
    const { planId, email } = req.body;
    // Mock checkout process
    res.json({
      success: true,
      message: `Successfully upgraded to ${planId} plan`,
      redirectUrl: '/dashboard'
    });
  } catch (error) {
    console.error('Subscription checkout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/subscription/promo', (req, res) => {
  try {
    const { code, email } = req.body;
    // Mock promo code validation
    if (code === 'WELCOME20') {
      res.json({
        valid: true,
        discount: 20,
        message: '20% discount applied!'
      });
    } else {
      res.json({
        valid: false,
        message: 'Invalid promo code'
      });
    }
  } catch (error) {
    console.error('Promo code error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/subscription/cancel', (req, res) => {
  try {
    const { email } = req.body;
    // Mock subscription cancellation
    res.json({
      success: true,
      message: 'Subscription cancelled successfully'
    });
  } catch (error) {
    console.error('Subscription cancel error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve web pages
app.get('/', (req, res) => {
  res.redirect('/dashboard');
});

app.get('/auth', (req, res) => {
  res.send(getModernAuthPage());
});

app.get('/dashboard', (req, res) => {
  const { sessionId } = req.query;
  if (!sessionId || !sessions.has(sessionId)) {
    return res.redirect('/auth');
  }
  res.send(getModernDashboardPage());
});

app.get('/apps', (req, res) => {
  const { sessionId } = req.query;
  if (!sessionId || !sessions.has(sessionId)) {
    return res.redirect('/auth');
  }
  res.send(getModernAppsPage());
});

app.get('/api-keys', (req, res) => {
  const { sessionId } = req.query;
  if (!sessionId || !sessions.has(sessionId)) {
    return res.redirect('/auth');
  }
  res.send(getModernApiKeysPage());
});

app.get('/profile', (req, res) => {
  const { sessionId } = req.query;
  if (!sessionId || !sessions.has(sessionId)) {
    return res.redirect('/auth');
  }
  res.send(getModernProfilePage());
});

app.get('/settings', (req, res) => {
  const { sessionId } = req.query;
  if (!sessionId || !sessions.has(sessionId)) {
    return res.redirect('/auth');
  }
  res.send(getModernSettingsPage());
});

app.get('/docs', (req, res) => {
  const { sessionId } = req.query;
  if (!sessionId || !sessions.has(sessionId)) {
    return res.redirect('/auth');
  }
  res.send(getModernDocsPage());
});

app.get('/subscription', (req, res) => {
  const { sessionId } = req.query;
  if (!sessionId || !sessions.has(sessionId)) {
    return res.redirect('/auth');
  }
  res.send(getModernSubscriptionPage());
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`OAuth Hub server running on port ${port}`);
});
