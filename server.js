import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import session from 'express-session';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import Passport.js configuration
import { configurePassport, authenticateApiKey } from './src/lib/auth/passport-config.js';

// Import database services
import {
  initializeDatabase,
  UserService,
  ApiKeyService,
  OAuthAppService,
  OAuthTokenService,
  SessionService,
  hashApiKey,
  hashSessionToken
} from './src/lib/services/database.js';

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
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session configuration for Passport.js
app.use(session({
  secret: process.env.SESSION_SECRET || 'oauth-hub-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport.js with all strategies
configurePassport();

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Database initialization
let dbInitialized = false;

// Utility functions
function generateId() {
  return crypto.randomUUID();
}

function generateApiKey() {
  return 'oauth_' + crypto.randomBytes(32).toString('hex');
}

// Password utilities moved to Passport.js configuration

function getPlanLimits(plan) {
  const limits = {
    free: { apiCalls: 5000, apiKeys: 5, oauthApps: 3 },
    pro: { apiCalls: 50000, apiKeys: 25, oauthApps: 15 },
    enterprise: { apiCalls: 500000, apiKeys: -1, oauthApps: -1 } // -1 means unlimited
  };
  return limits[plan] || limits.free;
}

// Routes
app.get('/health', async (req, res) => {
  try {
    const dbStatus = dbInitialized ? 'connected' : 'disconnected';
    const timestamp = new Date().toISOString();

    // Test database connectivity
    let dbTestResult = 'unknown';
    if (dbInitialized) {
      try {
        await executeQuery('SELECT 1 FROM dual');
        dbTestResult = 'healthy';
      } catch (dbError) {
        dbTestResult = 'error';
        console.error('Database health check failed:', dbError);
      }
    }

    res.json({
      status: dbTestResult === 'healthy' ? 'healthy' : 'degraded',
      timestamp,
      database: dbStatus,
      dbConnection: dbTestResult,
      version: '2.0.0-oracle'
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      database: 'unknown',
      error: 'Health check failed'
    });
  }
});

// ============================================================================
// PASSPORT.JS AUTHENTICATION ROUTES
// ============================================================================

// Local signup
app.post('/auth/signup', (req, res, next) => {
  passport.authenticate('local-signup', (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: 'Signup failed' });
    }
    if (!user) {
      return res.status(400).json({ error: info.message });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'User created successfully',
      token,
      user: { id: user.id, email: user.email }
    });
  })(req, res, next);
});

// Local login
app.post('/auth/login', (req, res, next) => {
  passport.authenticate('local-login', (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: 'Login failed' });
    }
    if (!user) {
      return res.status(401).json({ error: info.message });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email }
    });
  })(req, res, next);
});

// Google OAuth
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth' }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard?token=${token}`);
  }
);

// GitHub OAuth
app.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/auth' }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard?token=${token}`);
  }
);

// Facebook OAuth
app.get('/auth/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/auth' }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard?token=${token}`);
  }
);

// JWT authentication middleware
const authenticateJWT = passport.authenticate('jwt', { session: false });

// Get current user
app.get('/auth/me', authenticateJWT, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      fullName: req.user.full_name,
      profilePicture: req.user.profile_picture
    }
  });
});

// Logout
app.post('/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

// App management routes
app.post('/save-app', async (req, res) => {
  try {
    const { email, platform, clientId, clientSecret } = req.body;

    // Find user by email
    const user = await UserService.findByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await OAuthAppService.create(user.id, platform, `OAuth App for ${platform}`, clientId, clientSecret);

    res.json({ message: 'App saved successfully' });
  } catch (error) {
    console.error('Save app error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/user-apps', async (req, res) => {
  try {
    const { email } = req.query;
    const user = await UserService.findByEmail(email);
    if (!user) {
      return res.json({ apps: [] });
    }

    const apps = await OAuthAppService.findByUserId(user.id);

    res.json({ apps });
  } catch (error) {
    console.error('Get apps error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/delete-app/:platform', async (req, res) => {
  try {
    const { email } = req.query;
    const { platform } = req.params;

    const user = await UserService.findByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await OAuthAppService.delete(platform, user.id);

    res.json({ message: 'App deleted successfully' });
  } catch (error) {
    console.error('Delete app error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API Keys routes
app.get('/api-keys', async (req, res) => {
  try {
    const { email } = req.query;
    const user = await UserService.findByEmail(email);
    if (!user) {
      return res.json({ apiKeys: [] });
    }

    const apiKeys = await ApiKeyService.findByUserId(user.id);

    res.json({ apiKeys });
  } catch (error) {
    console.error('Get API keys error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api-keys', async (req, res) => {
  try {
    const { email, name } = req.body;
    const user = await UserService.findByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const apiKey = generateApiKey();
    const apiKeyHash = hashApiKey(apiKey);
    const keyId = generateId();

    await ApiKeyService.create(user.id, keyId, name, apiKey, apiKeyHash);

    res.json({ apiKey, keyId, name });
  } catch (error) {
    console.error('Create API key error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api-keys/:keyId', async (req, res) => {
  try {
    const { keyId } = req.params;
    const { email } = req.query;

    const user = await UserService.findByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await ApiKeyService.delete(keyId, user.id);

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

// ============================================================================
// CORE OAUTH HUB ENDPOINTS - The Missing Pieces!
// ============================================================================

/**
 * Generate OAuth consent URL for a platform
 * GET /consent/{platform}/{apiKey}
 */
app.get('/consent/:platform/:apiKey', authenticateJWT, async (req, res) => {
  try {
    const { platform, apiKey } = req.params;
    const { state } = req.query;
    const userId = req.user.id;

    // Verify API key belongs to authenticated user
    const apiKeyData = await ApiKeyService.findByHash(hashApiKey(apiKey));
    if (!apiKeyData || apiKeyData.user_id !== userId) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    // Get user's OAuth app for this platform
    const userApp = await OAuthAppService.findByUserAndPlatform(userId, platform);
    if (!userApp) {
      return res.status(404).json({
        error: `No OAuth app configured for ${platform}. Please set up your app credentials first.`
      });
    }

    // Get platform configuration
    const platformConfig = PLATFORMS[platform];
    if (!platformConfig) {
      return res.status(400).json({ error: `Unsupported platform: ${platform}` });
    }

    // Generate consent URL using platform config and user app credentials
    const redirectUri = `${req.protocol}://${req.get('host')}/callback`;
    const scopes = userApp.scopes ? JSON.parse(userApp.scopes) : platformConfig.requiredScopes;

    // Build authorization URL
    const params = new URLSearchParams({
      client_id: userApp.client_id,
      redirect_uri: redirectUri,
      scope: scopes.join(platformConfig.scopeDelimiter || ' '),
      response_type: 'code',
      state: `platform=${platform}&apiKey=${apiKey}&userId=${userId}${state ? `&custom=${state}` : ''}`
    });

    // Add additional params if specified
    if (platformConfig.additionalParams) {
      Object.entries(platformConfig.additionalParams).forEach(([key, value]) => {
        params.append(key, value);
      });
    }

    const consentUrl = `${platformConfig.authUrl}?${params.toString()}`;

    res.json({
      platform: platform.toUpperCase(),
      consentUrl,
      message: `OAuth consent URL for ${platform.toUpperCase()}`
    });

  } catch (error) {
    console.error('Consent URL generation error:', error);
    res.status(500).json({ error: 'Failed to generate consent URL' });
  }
});

/**
 * OAuth callback handler - receives authorization code from OAuth providers
 * GET /callback?code=...&state=...
 */
app.get('/callback', async (req, res) => {
  try {
    const { code, state, error, error_description } = req.query;

    // Handle OAuth errors
    if (error) {
      const errorPage = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>OAuth Error</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
              .error { background: #fee; border: 1px solid #fcc; color: #c33; padding: 20px; border-radius: 8px; }
            </style>
          </head>
          <body>
            <div class="error">
              <h2>OAuth Authorization Failed</h2>
              <p><strong>Error:</strong> ${error}</p>
              ${error_description ? `<p><strong>Details:</strong> ${error_description}</p>` : ''}
              <p>You can close this window and try again.</p>
            </div>
            <script>
              // Notify parent window of error
              if (window.opener) {
                window.opener.postMessage({
                  type: 'oauth_error',
                  error: '${error}',
                  description: '${error_description || ''}'
                }, '*');
              }
            </script>
          </body>
        </html>
      `;
      return res.send(errorPage);
    }

    if (!code || !state) {
      return res.status(400).send('Missing authorization code or state');
    }

    // Parse state to get platform, API key, and user ID
    const stateParts = state.split('&');
    let platform, apiKey, userId;

    stateParts.forEach(part => {
      const [key, value] = part.split('=');
      if (key === 'platform') platform = value;
      if (key === 'apiKey') apiKey = value;
      if (key === 'userId') userId = value;
    });

    if (!platform || !apiKey || !userId) {
      return res.status(400).send('Invalid state parameter');
    }

    // Verify API key belongs to the user from state
    const apiKeyData = await ApiKeyService.findByHash(hashApiKey(apiKey));
    if (!apiKeyData || apiKeyData.user_id !== userId) {
      return res.status(401).send('Invalid API key or user');
    }

    // Get user's OAuth app
    const userApp = await OAuthAppService.findByUserAndPlatform(apiKeyData.user_id, platform);
    if (!userApp) {
      return res.status(404).send('OAuth app not found');
    }

    // Exchange code for tokens
    const redirectUri = `${req.protocol}://${req.get('host')}/callback`;
    const tokenResponse = await exchangeCodeForToken(platform, code, userApp, redirectUri);

    // Get user info from the platform
    const userInfo = await getUserInfo(platform, tokenResponse.access_token, userApp);

    // Extract platform user ID
    const platformConfig = PLATFORMS[platform];
    const platformUserId = extractPlatformUserId(platform, userInfo, platformConfig);

    // Store tokens in database
    await OAuthTokenService.create(
      apiKeyData.user_id,
      platform,
      platformUserId,
      tokenResponse.access_token,
      tokenResponse.refresh_token,
      tokenResponse.token_type,
      tokenResponse.expires_in ? new Date(Date.now() + tokenResponse.expires_in * 1000) : null,
      userApp.scopes || []
    );

    // Increment API call count
    await UserService.incrementApiCallCount(apiKeyData.user_id);

    // Success page with postMessage to parent window
    const successPage = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>OAuth Success</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
            .success { background: #efe; border: 1px solid #cfc; color: #363; padding: 20px; border-radius: 8px; }
          </style>
        </head>
        <body>
          <div class="success">
            <h2>✅ Authorization Successful!</h2>
            <p>Your ${platform.toUpperCase()} account has been connected successfully.</p>
            <p>You can now use the tokens to access ${platform.toUpperCase()} APIs.</p>
            <p>This window will close automatically.</p>
          </div>
          <script>
            // Notify parent window of success
            if (window.opener) {
              window.opener.postMessage({
                type: 'oauth_complete',
                platform: '${platform}',
                platformUserId: '${platformUserId}',
                tokens: ${JSON.stringify(tokenResponse)}
              }, '*');
            }

            // Close window after a delay
            setTimeout(() => {
              window.close();
            }, 3000);
          </script>
        </body>
      </html>
    `;

    res.send(successPage);

  } catch (error) {
    console.error('OAuth callback error:', error);

    const errorPage = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>OAuth Error</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
            .error { background: #fee; border: 1px solid #fcc; color: #c33; padding: 20px; border-radius: 8px; }
          </style>
        </head>
        <body>
          <div class="error">
            <h2>OAuth Authorization Failed</h2>
            <p>An error occurred while processing your authorization.</p>
            <p>Please try again or contact support if the problem persists.</p>
          </div>
          <script>
            // Notify parent window of error
            if (window.opener) {
              window.opener.postMessage({
                type: 'oauth_error',
                error: 'processing_error',
                description: 'Failed to process OAuth authorization'
              }, '*');
            }
          </script>
        </body>
      </html>
    `;

    res.status(500).send(errorPage);
  }
});

/**
 * Get OAuth tokens for a platform user
 * GET /tokens/{platformUserId}/{apiKey}
 */
app.get('/tokens/:platformUserId/:apiKey', async (req, res) => {
  try {
    const { platformUserId, apiKey } = req.params;
    const { platform } = req.query;

    if (!platform) {
      return res.status(400).json({ error: 'Platform parameter required' });
    }

    // Verify API key
    const apiKeyData = await ApiKeyService.findByHash(hashApiKey(apiKey));
    if (!apiKeyData) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    // Get stored tokens
    const tokenData = await OAuthTokenService.findByUserPlatform(
      apiKeyData.user_id,
      platform,
      platformUserId
    );

    if (!tokenData) {
      return res.status(404).json({ error: 'No tokens found for this user and platform' });
    }

    // Check if tokens are expired and try to refresh
    if (tokenData.expires_at && new Date(tokenData.expires_at) < new Date()) {
      if (tokenData.refresh_token) {
        try {
          // Get user's OAuth app for token refresh
          const userApp = await OAuthAppService.findByUserAndPlatform(apiKeyData.user_id, platform);
          if (userApp) {
            const newTokens = await refreshAccessToken(platform, tokenData.refresh_token, userApp);

            // Update stored tokens
            await OAuthTokenService.update(tokenData.id, {
              accessToken: newTokens.access_token,
              refreshToken: newTokens.refresh_token,
              expiresAt: newTokens.expires_in ? new Date(Date.now() + newTokens.expires_in * 1000) : null
            });

            // Return refreshed tokens
            res.json({
              success: true,
              tokens: {
                access_token: newTokens.access_token,
                refresh_token: newTokens.refresh_token,
                expires_in: newTokens.expires_in,
                platform,
                platformUserId
              },
              refreshed: true
            });
            return;
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          // Continue with expired tokens if refresh fails
        }
      }
    }

    // Return stored tokens
    res.json({
      success: true,
      tokens: {
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        token_type: tokenData.token_type,
        expires_at: tokenData.expires_at,
        platform,
        platformUserId
      }
    });

    // Increment API call count
    await UserService.incrementApiCallCount(apiKeyData.user_id);

  } catch (error) {
    console.error('Get tokens error:', error);
    res.status(500).json({ error: 'Failed to retrieve tokens' });
  }
});

/**
 * Refresh OAuth tokens
 * POST /refresh/{platformUserId}/{apiKey}
 */
app.post('/refresh/:platformUserId/:apiKey', async (req, res) => {
  try {
    const { platformUserId, apiKey } = req.params;
    const { platform } = req.body;

    if (!platform) {
      return res.status(400).json({ error: 'Platform parameter required' });
    }

    // Verify API key
    const apiKeyData = await ApiKeyService.findByHash(hashApiKey(apiKey));
    if (!apiKeyData) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    // Get stored tokens
    const tokenData = await OAuthTokenService.findByUserPlatform(
      apiKeyData.user_id,
      platform,
      platformUserId
    );

    if (!tokenData || !tokenData.refresh_token) {
      return res.status(404).json({ error: 'No refresh token available' });
    }

    // Get user's OAuth app
    const userApp = await OAuthAppService.findByUserAndPlatform(apiKeyData.user_id, platform);
    if (!userApp) {
      return res.status(404).json({ error: 'OAuth app not found' });
    }

    // Refresh tokens
    const newTokens = await refreshAccessToken(platform, tokenData.refresh_token, userApp);

    // Update stored tokens
    await OAuthTokenService.update(tokenData.id, {
      accessToken: newTokens.access_token,
      refreshToken: newTokens.refresh_token,
      expiresAt: newTokens.expires_in ? new Date(Date.now() + newTokens.expires_in * 1000) : null
    });

    res.json({
      success: true,
      tokens: {
        access_token: newTokens.access_token,
        refresh_token: newTokens.refresh_token,
        expires_in: newTokens.expires_in,
        platform,
        platformUserId
      }
    });

    // Increment API call count
    await UserService.incrementApiCallCount(apiKeyData.user_id);

  } catch (error) {
    console.error('Refresh tokens error:', error);
    res.status(500).json({ error: 'Failed to refresh tokens' });
  }
});

/**
 * Revoke OAuth tokens
 * DELETE /revoke-token/{platformUserId}/{apiKey}
 */
app.delete('/revoke-token/:platformUserId/:apiKey', async (req, res) => {
  try {
    const { platformUserId, apiKey } = req.params;
    const { platform } = req.query;

    if (!platform) {
      return res.status(400).json({ error: 'Platform parameter required' });
    }

    // Verify API key
    const apiKeyData = await ApiKeyService.findByHash(hashApiKey(apiKey));
    if (!apiKeyData) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    // Delete tokens
    const deleted = await OAuthTokenService.delete(apiKeyData.user_id, platform, platformUserId);

    if (!deleted) {
      return res.status(404).json({ error: 'Tokens not found' });
    }

    res.json({ success: true, message: 'Tokens revoked successfully' });

  } catch (error) {
    console.error('Revoke tokens error:', error);
    res.status(500).json({ error: 'Failed to revoke tokens' });
  }
});

// Demo OAuth routes removed - oauth2-server package was unused

// Analytics route (protected)
app.get('/analytics', authenticateJWT, (req, res) => {
  res.send(getModernAnalyticsPage());
});

// Subscription routes
app.get('/subscription/status', async (req, res) => {
  try {
    const { email } = req.query;
    const user = await UserService.findByEmail(email);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get actual usage counts from database
    const apiKeys = await ApiKeyService.findByUserId(user.id);
    const oauthApps = await OAuthAppService.findByUserId(user.id);

    const plan = user.subscription_plan || 'free';
    const limits = getPlanLimits(plan);

    const usage = {
      apiCalls: {
        current: user.api_call_count || 0,
        limit: limits.apiCalls,
        percentage: Math.round(((user.api_call_count || 0) / limits.apiCalls) * 100)
      },
      apiKeys: {
        current: apiKeys.length,
        limit: limits.apiKeys,
        percentage: Math.round((apiKeys.length / limits.apiKeys) * 100)
      },
      oauthApps: {
        current: oauthApps.length,
        limit: limits.oauthApps,
        percentage: Math.round((oauthApps.length / limits.oauthApps) * 100)
      }
    };

    res.json({
      plan,
      status: 'active',
      usage,
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

// Protected page routes (require JWT authentication)
app.get('/dashboard', authenticateJWT, (req, res) => {
  res.send(getModernDashboardPage());
});

app.get('/apps', authenticateJWT, (req, res) => {
  res.send(getModernAppsPage());
});

app.get('/api-keys', authenticateJWT, (req, res) => {
  res.send(getModernApiKeysPage());
});

app.get('/profile', authenticateJWT, (req, res) => {
  res.send(getModernProfilePage());
});

app.get('/settings', authenticateJWT, (req, res) => {
  res.send(getModernSettingsPage());
});

app.get('/docs', authenticateJWT, (req, res) => {
  res.send(getModernDocsPage());
});

app.get('/subscription', authenticateJWT, (req, res) => {
  res.send(getModernSubscriptionPage());
});

// Initialize database and start server
async function startServer() {
  try {
    // Initialize database connection
    await initializeDatabase();
    dbInitialized = true;
    console.log('✅ Database connection established');

    // Start the server
    app.listen(port, '0.0.0.0', () => {
      console.log(`🚀 OAuth Hub server running on port ${port}`);
      console.log(`📊 Using Oracle database for credential storage`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
