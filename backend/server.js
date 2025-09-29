import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import session from 'express-session';
import Keycloak from 'keycloak-connect';
import KcAdminClient from '@keycloak/keycloak-admin-client';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

// Import UI pages from frontend
import { getModernAuthPage } from '../frontend/src/ui/pages/auth.js';
import { getModernDashboardPage } from '../frontend/src/ui/pages/dashboard.js';
import { getModernAppsPage } from '../frontend/src/ui/pages/apps.js';
import { getModernApiKeysPage } from '../frontend/src/ui/pages/api-keys.js';
import { getModernSubscriptionPage } from '../frontend/src/ui/pages/subscription.js';
import { getModernAnalyticsPage } from '../frontend/src/ui/pages/analytics.js';
import { getModernDocsPage } from '../frontend/src/ui/pages/docs.js';
import { getModernProfilePage } from '../frontend/src/ui/pages/profile.js';
import { getModernSettingsPage } from '../frontend/src/ui/pages/settings.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Keycloak setup
const memoryStore = new session.MemoryStore();
const keycloak = new Keycloak({ store: memoryStore });

// Keycloak Admin Client
const kcAdminClient = new KcAdminClient({
  baseUrl: process.env.KEYCLOAK_URL || 'http://localhost:8081',
  realmName: 'master'
});

(async () => {
  await kcAdminClient.auth({
    username: process.env.KEYCLOAK_ADMIN_USER || 'admin',
    password: process.env.KEYCLOAK_ADMIN_PASSWORD || 'admin',
    grantType: 'password',
    clientId: 'admin-cli'
  });
  await kcAdminClient.setConfig({
    realmName: 'oauth-hub'
  });
})();

// App setup
const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Sessions for Keycloak
app.use(session({
  secret: 'your-session-secret',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

// Keycloak middleware
app.use(keycloak.middleware());

app.use(express.static(path.join(__dirname, 'public')));

// Utility functions
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

// Routes
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    keycloak: 'connected',
    version: '3.0.0-keycloak'
  });
});

// Platforms
app.get('/api/platforms', (req, res) => {
  const platforms = [
    { id: 'google', name: 'Google', icon: '🔵', description: 'Google OAuth' },
    { id: 'github', name: 'GitHub', icon: '🐙', description: 'GitHub OAuth' },
  ];
    res.json({ platforms });
});

// Consent URL: Generate URL to Keycloak auth endpoint
app.get('/consent/:platform/:apiKey', keycloak.protect(), async (req, res) => {
  try {
    const { platform, apiKey } = req.params;
    const userId = req.kauth.grant.access_token.content.sub;

    const user = await kcAdminClient.users.findOne({ id: userId });
    const apps = JSON.parse(user.attributes?.oauth_apps || '[]');
    const app = apps.find(a => a.platform === platform && a.apiKey === apiKey);
    if (!app) return res.status(404).json({ error: 'App not found' });

    const authUrl = `${process.env.KEYCLOAK_URL || 'http://localhost:8080'}/realms/oauth-hub/protocol/openid-connect/auth`;
    const params = new URLSearchParams({
      client_id: app.clientId,
      redirect_uri: `${req.protocol}://${req.get('host')}/callback`,
      response_type: 'code',
      scope: 'openid profile email',
      state: JSON.stringify({ platform, apiKey, userId })
    });
    const consentUrl = `${authUrl}?${params}`;
    res.json({ platform: platform.toUpperCase(), consentUrl });
  } catch (error) {
    console.error('Consent error:', error);
    res.status(500).json({ error: 'Failed to generate consent URL' });
  }
});

// Callback: Handle code and exchange for tokens via Keycloak
app.get('/callback', keycloak.protect(), async (req, res) => {
  try {
    const { code, state } = req.query;
    const { platform, apiKey, userId } = JSON.parse(state);

    const tokenUrl = `${process.env.KEYCLOAK_URL || 'http://localhost:8080'}/realms/oauth-hub/protocol/openid-connect/token`;
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: 'oauth-hub-client',
        client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
        redirect_uri: `${req.protocol}://${req.get('host')}/callback`
      })
    });
    const tokens = await response.json();

    const user = await kcAdminClient.users.findOne({ id: userId });
    const appTokens = JSON.parse(user.attributes?.app_tokens || '[]');
    appTokens.push({ platform, apiKey, ...tokens });
    await kcAdminClient.users.update({ id: userId }, { attributes: { app_tokens: JSON.stringify(appTokens) } });

    res.send('<h1>Success! Tokens stored.</h1>');
  } catch (error) {
    console.error('Callback error:', error);
    res.status(500).send('Error');
  }
});

// Token Retrieval: Get from user attributes
app.get('/tokens/:platformUserId/:apiKey', keycloak.protect(), async (req, res) => {
  try {
    const { platformUserId, apiKey } = req.params;
    const userId = req.kauth.grant.access_token.content.sub;

    const user = await kcAdminClient.users.findOne({ id: userId });
    const appTokens = JSON.parse(user.attributes?.app_tokens || '[]');
    const token = appTokens.find(t => t.apiKey === apiKey && t.platform === req.query.platform);
    if (!token) return res.status(404).json({ error: 'No tokens' });

    res.json({ success: true, tokens: token });
  } catch (error) {
    console.error('Token retrieval error:', error);
    res.status(500).json({ error: 'Failed' });
  }
});

// Protected APIs using Keycloak
app.get('/api/user-apps', keycloak.protect(), async (req, res) => {
  const userId = req.kauth.grant.access_token.content.sub;
  const user = await kcAdminClient.users.findOne({ id: userId });
  res.json({ apps: JSON.parse(user.attributes?.oauth_apps || '[]') });
});

app.post('/api/save-app', keycloak.protect(), async (req, res) => {
  const userId = req.kauth.grant.access_token.content.sub;
  const { platform, clientId, clientSecret } = req.body;
  const user = await kcAdminClient.users.findOne({ id: userId });
  const apps = JSON.parse(user.attributes?.oauth_apps || '[]');
  apps.push({ id: generateId(), platform, appName: `OAuth App for ${platform}`, clientId, clientSecret, apiKey: generateApiKey() });
  await kcAdminClient.users.update({ id: userId }, { attributes: { oauth_apps: JSON.stringify(apps) } });
  res.json({ message: 'App saved' });
});

app.get('/api/api-keys', keycloak.protect(), async (req, res) => {
  const userId = req.kauth.grant.access_token.content.sub;
  const user = await kcAdminClient.users.findOne({ id: userId });
  res.json({ apiKeys: JSON.parse(user.attributes?.api_keys || '[]') });
});

app.post('/api/api-keys', keycloak.protect(), async (req, res) => {
  const userId = req.kauth.grant.access_token.content.sub;
  const { name } = req.body;
  const user = await kcAdminClient.users.findOne({ id: userId });
  const apiKeys = JSON.parse(user.attributes?.api_keys || '[]');
  const apiKey = generateApiKey();
  apiKeys.push({ id: generateId(), name, apiKey });
  await kcAdminClient.users.update({ id: userId }, { attributes: { api_keys: JSON.stringify(apiKeys) } });
  res.json({ apiKey });
});

app.get('/api/subscription/status', keycloak.protect(), async (req, res) => {
  const userId = req.kauth.grant.access_token.content.sub;
  const user = await kcAdminClient.users.findOne({ id: userId });
  const plan = user.attributes?.subscription_plan?.[0] || 'free';
  const usage = { apiCalls: { current: 0, limit: 5000 }, apiKeys: { current: 0 }, oauthApps: { current: 0 } };
  res.json({ plan, status: 'active', usage });
});

app.post('/api/subscription/checkout', keycloak.protect(), async (req, res) => {
  const userId = req.kauth.grant.access_token.content.sub;
  const { planId } = req.body;
  await kcAdminClient.users.update({ id: userId }, { attributes: { subscription_plan: planId } });
  res.json({ success: true });
});


// Logout
app.get('/logout', keycloak.protect(), (req, res, next) => {
  req.logout();
  res.redirect(`${process.env.KEYCLOAK_URL || 'http://localhost:8081'}/realms/oauth-hub/protocol/openid-connect/logout?redirect_uri=${encodeURIComponent(process.env.FRONTEND_URL || 'http://localhost:3000')}/auth`);
});

// UI Routes
app.get('/', (req, res) => res.redirect('/dashboard'));
app.get('/auth', (req, res) => {
  // Since using Keycloak, redirect to Keycloak login
  res.redirect(`${process.env.KEYCLOAK_URL || 'http://localhost:8081'}/realms/oauth-hub/protocol/openid-connect/auth?client_id=oauth-hub-client&redirect_uri=${encodeURIComponent(process.env.FRONTEND_URL || 'http://localhost:3000')}/dashboard&response_type=code&scope=openid profile email`);
});
app.get('/dashboard', keycloak.protect(), (req, res) => res.send(getModernDashboardPage(req.kauth.grant.access_token.content)));
app.get('/apps', keycloak.protect(), (req, res) => res.send(getModernAppsPage()));
app.get('/api-keys', keycloak.protect(), (req, res) => res.send(getModernApiKeysPage()));
app.get('/subscription', keycloak.protect(), (req, res) => res.send(getModernSubscriptionPage()));
app.get('/analytics', keycloak.protect(), (req, res) => res.send(getModernAnalyticsPage()));
app.get('/docs', keycloak.protect(), (req, res) => res.send(getModernDocsPage()));
app.get('/profile', keycloak.protect(), (req, res) => res.send(getModernProfilePage()));
app.get('/settings', keycloak.protect(), (req, res) => res.send(getModernSettingsPage()));

app.listen(port, () => console.log(`Server on port ${port}`));
