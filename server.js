import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import session from 'express-session';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import Joi from 'joi';
import winston from 'winston';
import bcrypt from 'bcryptjs'; // Updated
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({ format: winston.format.simple() })
  ]
});

// Import services (Sequelize)
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

// Import Passport config (full, including local strategies)
import { configurePassport, authenticateApiKey, authenticateJWT } from './src/lib/auth/passport-config.js';

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP'
});

// Validation schemas
const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  fullName: Joi.string().optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// App setup
const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(morgan('combined', { stream: { write: msg => logger.info(msg.trim()) } }));
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Sessions for Passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'oauth-hub-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production', maxAge: 24 * 60 * 60 * 1000 }
}));

app.use(passport.initialize());
app.use(passport.session());
configurePassport(); // Full config: local, external strategies

app.use(express.static(path.join(__dirname, 'public')));

// Database
let dbInitialized = false;

// Utility functions (kept)
function generateId() { return crypto.randomUUID(); }
function generateApiKey() { return 'oauth_' + crypto.randomBytes(32).toString('hex'); }
function getPlanLimits(plan) {
  const limits = {
    free: { apiCalls: 5000, apiKeys: 5, oauthApps: 3 },
    pro: { apiCalls: 50000, apiKeys: 25, oauthApps: 15 },
    enterprise: { apiCalls: 500000, apiKeys: -1, oauthApps: -1 }
  };
  return limits[plan] || limits.free;
}

// Routes - Auth with Passport
app.get('/health', async (req, res) => {
  try {
    const dbStatus = dbInitialized ? 'connected' : 'disconnected';
    let dbTestResult = 'unknown';
    if (dbInitialized) {
      try {
        // Test via Sequelize
        await UserService.findByEmail('test@example.com'); // Or simple query
        dbTestResult = 'healthy';
      } catch (dbError) {
        dbTestResult = 'error';
        logger.error('DB health check failed:', dbError);
      }
    }
    res.json({
      status: dbTestResult === 'healthy' ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      database: dbStatus,
      dbConnection: dbTestResult,
      version: '2.1.0-passport-enhanced'
    });
  } catch (error) {
    logger.error('Health check error:', error);
    res.status(500).json({ error: 'Health check failed' });
  }
});

// Signup with Passport local-signup
app.post('/auth/signup', (req, res, next) => {
  const { error } = signupSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  logger.info('Signup request:', { body: req.body });
  passport.authenticate('local-signup', (err, user, info) => {
    if (err) {
      logger.error('Signup error:', err);
      return res.status(500).json({ error: 'Signup failed' });
    }
    if (!user) return res.status(400).json({ error: info.message });

    // JWT token
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

// Login with Passport local-login
app.post('/auth/login', (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  passport.authenticate('local-login', (err, user, info) => {
    if (err) {
      logger.error('Login error:', err);
      return res.status(500).json({ error: 'Login failed' });
    }
    if (!user) return res.status(401).json({ error: info.message });

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

// External OAuth (Passport)
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/auth' }), (req, res) => {
  const token = jwt.sign({ id: req.user.id, email: req.user.email }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
  res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard?token=${token}`);
});

// Similar for GitHub, Facebook, etc.

// Get current user (JWT protected)
app.get('/auth/me', authenticateJWT, (req, res) => {
  res.json({
    user: { id: req.user.id, email: req.user.email, fullName: req.user.full_name, profilePicture: req.user.profile_picture }
  });
});

// Logout
app.post('/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.json({ message: 'Logged out successfully' });
  });
});

// App management (JWT protected)
app.post('/api/save-app', authenticateJWT, async (req, res) => {
  try {
    const { platform, clientId, clientSecret } = req.body;
    await OAuthAppService.create(req.user.id, platform, `OAuth App for ${platform}`, clientId, clientSecret);
    res.json({ message: 'App saved successfully' });
  } catch (error) {
    logger.error('Save app error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/user-apps', authenticateJWT, async (req, res) => {
  try {
    const apps = await OAuthAppService.findByUserId(req.user.id);
    res.json({ apps });
  } catch (error) {
    logger.error('Get apps error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/delete-app/:platform', authenticateJWT, async (req, res) => {
  try {
    const { platform } = req.params;
    await OAuthAppService.delete(platform, req.user.id);
    res.json({ message: 'App deleted successfully' });
  } catch (error) {
    logger.error('Delete app error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API Keys (similar, protected by JWT)
app.get('/api/api-keys', authenticateJWT, async (req, res) => {
  try {
    const apiKeys = await ApiKeyService.findByUserId(req.user.id);
    res.json({ apiKeys });
  } catch (error) {
    logger.error('Get API keys error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/api-keys', authenticateJWT, async (req, res) => {
  try {
    const { name } = req.body;
    const apiKey = generateApiKey();
    const apiKeyHash = hashApiKey(apiKey);
    const keyId = generateId();
    await ApiKeyService.create(req.user.id, keyId, name, apiKey, apiKeyHash);
    res.json({ apiKey, keyId, name });
  } catch (error) {
    logger.error('Create API key error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/api-keys/:keyId', authenticateJWT, async (req, res) => {
  try {
    const { keyId } = req.params;
    await ApiKeyService.delete(keyId, req.user.id);
    res.json({ message: 'API key deleted successfully' });
  } catch (error) {
    logger.error('Delete API key error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Platforms
app.get('/api/platforms', (req, res) => {
  try {
    // Assume PLATFORMS imported from core
    const platforms = Object.keys(PLATFORMS).map(key => ({
      id: key,
      name: PLATFORMS[key].displayName,
      icon: PLATFORMS[key].icon,
      description: PLATFORMS[key].description
    }));
    res.json({ platforms });
  } catch (error) {
    logger.error('Get platforms error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Consent URL (protected by api key auth)
app.get('/consent/:platform/:apiKey', authenticateApiKey, async (req, res) => {
  try {
    const { platform, apiKey } = req.params;
    const { state } = req.query;
    const userId = req.apiKey.user_id; // From authenticateApiKey

    // Validate with Joi if needed
    const userApp = await OAuthAppService.findByUserAndPlatform(userId, platform);
    if (!userApp) return res.status(404).json({ error: `No OAuth app configured for ${platform}` });

    const platformConfig = PLATFORMS[platform];
    if (!platformConfig) return res.status(400).json({ error: `Unsupported platform: ${platform}` });

    const redirectUri = `${req.protocol}://${req.get('host')}/callback`;
    const scopes = userApp.scopes || platformConfig.requiredScopes;
    const params = new URLSearchParams({
      client_id: userApp.client_id,
      redirect_uri: redirectUri,
      scope: scopes.join(platformConfig.scopeDelimiter || ' '),
      response_type: 'code',
      state: `platform=${platform}&apiKey=${apiKey}&userId=${userId}${state ? `&custom=${state}` : ''}`
    });

    if (platformConfig.additionalParams) {
      Object.entries(platformConfig.additionalParams).forEach(([key, value]) => params.append(key, value));
    }

    const consentUrl = `${platformConfig.authUrl}?${params.toString()}`;
    res.json({ platform: platform.toUpperCase(), consentUrl, message: `OAuth consent URL for ${platform.toUpperCase()}` });
  } catch (error) {
    logger.error('Consent URL generation error:', error);
    res.status(500).json({ error: 'Failed to generate consent URL' });
  }
});

// Callback (external OAuth)
app.get('/callback', async (req, res) => {
  try {
    const { code, state, error, error_description } = req.query;
    if (error) {
      // Error page (kept)
      const errorPage = `...`; // Existing HTML
      return res.send(errorPage);
    }

    if (!code || !state) return res.status(400).send('Missing authorization code or state');

    // Parse state
    const stateParams = new URLSearchParams(state);
    const platform = stateParams.get('platform');
    const apiKey = stateParams.get('apiKey');
    const userId = stateParams.get('userId');

    if (!platform || !apiKey || !userId) return res.status(400).send('Invalid state');

    const apiKeyData = await ApiKeyService.findByHash(hashApiKey(apiKey));
    if (!apiKeyData || apiKeyData.user_id !== userId) return res.status(401).send('Invalid API key or user');

    const userApp = await OAuthAppService.findByUserAndPlatform(userId, platform);
    if (!userApp) return res.status(404).send('OAuth app not found');

    const redirectUri = `${req.protocol}://${req.get('host')}/callback`;
    const tokenResponse = await exchangeCodeForToken(platform, code, userApp, redirectUri); // Assume function exists

    const userInfo = await getUserInfo(platform, tokenResponse.access_token, userApp); // Assume
    const platformConfig = PLATFORMS[platform];
    const platformUserId = extractPlatformUserId(platform, userInfo, platformConfig); // Assume

    await OAuthTokenService.create(
      userId, platform, platformUserId, tokenResponse.access_token, tokenResponse.refresh_token,
      tokenResponse.token_type, tokenResponse.expires_in ? new Date(Date.now() + tokenResponse.expires_in * 1000) : null,
      userApp.scopes || []
    );

    await UserService.incrementApiCallCount(userId);

    const successPage = `...`; // Existing HTML with postMessage
    res.send(successPage);
  } catch (error) {
    logger.error('OAuth callback error:', error);
    const errorPage = `...`; // Existing
    res.status(500).send(errorPage);
  }
});

// Token Retrieval (JWT protected, but apiKey for external)
app.get('/tokens/:platformUserId/:apiKey', authenticateApiKey, async (req, res) => {
  try {
    const { platformUserId, apiKey } = req.params;
    const { platform } = req.query;
    if (!platform) return res.status(400).json({ error: 'Platform required' });

    const apiKeyData = req.apiKey; // From middleware
    let tokenData = await OAuthTokenService.findByUserPlatform(apiKeyData.user_id, platform, platformUserId);

    if (!tokenData) return res.status(404).json({ error: 'No tokens found' });

    // Refresh if expired
    if (tokenData.expiresAt && new Date(tokenData.expiresAt) < new Date()) {
      if (tokenData.refreshToken) {
        try {
          const userApp = await OAuthAppService.findByUserAndPlatform(apiKeyData.user_id, platform);
          if (userApp) {
            const newTokens = await refreshAccessToken(platform, tokenData.refreshToken, userApp); // Assume
            await OAuthTokenService.update(tokenData.id, {
              accessToken: newTokens.access_token,
              refreshToken: newTokens.refresh_token,
              expiresAt: newTokens.expires_in ? new Date(Date.now() + newTokens.expires_in * 1000) : null
            });
            tokenData = { ...tokenData, ...newTokens };
            res.json({ success: true, tokens: { ...newTokens, platform, platformUserId }, refreshed: true });
            await UserService.incrementApiCallCount(apiKeyData.user_id);
            return;
          }
        } catch (refreshError) {
          logger.error('Token refresh failed:', refreshError);
        }
      }
    }

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
    await UserService.incrementApiCallCount(apiKeyData.user_id);
  } catch (error) {
    logger.error('Get tokens error:', error);
    res.status(500).json({ error: 'Failed to retrieve tokens' });
  }
});

app.post('/refresh/:platformUserId/:apiKey', authenticateApiKey, async (req, res) => {
  // Similar to above, focused refresh
  // ...
});

// Subscription APIs (JWT)
app.get('/api/subscription/status', authenticateJWT, async (req, res) => {
  try {
    const user = await UserService.findByEmail(req.user.email); // Or by ID
    if (!user) return res.status(404).json({ error: 'User not found' });

    const apiKeys = await ApiKeyService.findByUserId(user.id);
    const oauthApps = await OAuthAppService.findByUserId(user.id);
    const plan = user.subscription_plan || 'free';
    const limits = getPlanLimits(plan);

    const usage = {
      apiCalls: { current: user.api_call_count || 0, limit: limits.apiCalls, percentage: Math.round(((user.api_call_count || 0) / limits.apiCalls) * 100) },
      apiKeys: { current: apiKeys.length, limit: limits.apiKeys, percentage: Math.round((apiKeys.length / limits.apiKeys) * 100) },
      oauthApps: { current: oauthApps.length, limit: limits.oauthApps, percentage: Math.round((oauthApps.length / limits.oauthApps) * 100) }
    };

    res.json({ plan, status: 'active', usage, billingCycle: 'monthly' });
  } catch (error) {
    logger.error('Subscription status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/subscription/plans', (req, res) => {
  res.json({
    plans: [
      { id: 'free', name: 'Free', price: 0, interval: 'month', features: ['5 API keys', '3 OAuth apps', '5,000 API calls/month'] },
      { id: 'pro', name: 'Pro', price: 29, interval: 'month', features: ['25 API keys', '15 OAuth apps', '50,000 API calls/month', 'Priority support'] },
      { id: 'enterprise', name: 'Enterprise', price: 99, interval: 'month', features: ['Unlimited API keys', 'Unlimited OAuth apps', '500,000 API calls/month', 'Dedicated support'] }
    ]
  });
});

app.post('/api/subscription/checkout', authenticateJWT, async (req, res) => {
  try {
    const { planId } = req.body;
    // Mock: Update user plan
    await UserService.updateProfile(req.user.id, { subscriptionPlan: planId });
    res.json({ success: true, message: `Upgraded to ${planId}`, redirectUrl: '/dashboard' });
  } catch (error) {
    logger.error('Subscription checkout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Protected UI (JWT)
app.get('/', (req, res) => res.redirect('/dashboard'));
app.get('/auth', (req, res) => res.send(getModernAuthPage()));
app.get('/dashboard', authenticateJWT, (req, res) => res.send(getModernDashboardPage(req.user)));
app.get('/apps', authenticateJWT, (req, res) => res.send(getModernAppsPage()));
app.get('/api-keys', authenticateJWT, (req, res) => res.send(getModernApiKeysPage()));
app.get('/profile', authenticateJWT, (req, res) => res.send(getModernProfilePage(req.user)));
app.get('/settings', authenticateJWT, (req, res) => res.send(getModernSettingsPage()));
app.get('/docs', authenticateJWT, (req, res) => res.send(getModernDocsPage()));
app.get('/subscription', authenticateJWT, (req, res) => res.send(getModernSubscriptionPage()));

// Init
async function startServer() {
  try {
    await initializeDatabase();
    dbInitialized = true;
    logger.info('✅ Database connected (Sequelize + Oracle)');
    app.listen(port, '0.0.0.0', () => logger.info(`🚀 Server on port ${port}`));
  } catch (error) {
    logger.error('❌ Server start failed:', error);
    process.exit(1);
  }
}

startServer();
