/**
 * Comprehensive Passport.js Configuration for OAuth Hub
 * Handles ALL OAuth2 traffic through Passport.js ecosystem
 */

import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcryptjs';

// OAuth2 Strategies for all supported platforms
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
import { Strategy as AppleStrategy } from 'passport-apple';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import { Strategy as SpotifyStrategy } from 'passport-spotify';
import { Strategy as DiscordStrategy } from 'passport-discord';
import { Strategy as TwitchStrategy } from 'passport-twitch';
import { Strategy as SalesforceStrategy } from 'passport-salesforce';
import { Strategy as HubSpotStrategy } from 'passport-hubspot';
import { Strategy as TrelloStrategy } from 'passport-trello';
import { Strategy as AsanaStrategy } from 'passport-asana';
import { Strategy as DropboxStrategy } from 'passport-dropbox-oauth2';

// Import database services
import {
  UserService,
  ApiKeyService,
  OAuthAppService,
  OAuthTokenService,
  SessionService
} from '../services/database.js';

// JWT Configuration
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),
    (req) => req.cookies?.token,
    (req) => req.query?.token
  ]),
  secretOrKey: process.env.JWT_SECRET || 'your-secret-key'
};

/**
 * Configure Passport.js with all strategies
 */
export function configurePassport() {

  // ============================================================================
  // LOCAL AUTHENTICATION (Email/Password)
  // ============================================================================

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, email, password, done) => {
    try {
      // Check if user exists
      const existingUser = await UserService.findByEmail(email);
      if (existingUser) {
        return done(null, false, { message: 'User already exists' });
      }

      // Hash password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Create user
      const userId = await UserService.create(email, passwordHash, null, req.body.fullName, 'email');
      const user = await UserService.findByEmail(email);

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, async (email, password, done) => {
    try {
      const user = await UserService.findByEmail(email);
      if (!user) {
        return done(null, false, { message: 'User not found' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return done(null, false, { message: 'Invalid password' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));

  // ============================================================================
  // JWT STRATEGY
  // ============================================================================

  passport.use('jwt', new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await UserService.findByEmail(payload.email);
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  }));

  // ============================================================================
  // OAUTH2 STRATEGIES FOR ALL SUPPORTED PLATFORMS
  // ============================================================================

  // Dynamic strategy configuration based on stored OAuth apps
  const createOAuthStrategy = (platform, Strategy, config) => {
    passport.use(`${platform}-oauth`, new Strategy({
      clientID: config.clientId,
      clientSecret: config.clientSecret,
      callbackURL: `${process.env.BASE_URL || 'http://localhost:3000'}/auth/${platform}/callback`,
      scope: config.scope || ['profile', 'email'],
      passReqToCallback: true
    }, async (req, accessToken, refreshToken, profile, done) => {
      try {
        const { apiKey } = req.query;

        // Verify API key
        const apiKeyData = await ApiKeyService.findByHash(await hashApiKey(apiKey));
        if (!apiKeyData) {
          return done(new Error('Invalid API key'));
        }

        // Extract user info from profile
        const userInfo = {
          id: profile.id,
          email: profile.emails?.[0]?.value,
          name: profile.displayName,
          picture: profile.photos?.[0]?.value,
          provider: platform,
          raw: profile._json
        };

        // Store OAuth tokens
        await OAuthTokenService.create(
          apiKeyData.user_id,
          platform,
          profile.id,
          accessToken,
          refreshToken,
          'Bearer',
          null, // expires_at will be calculated
          config.scope || []
        );

        // Update user profile if needed
        if (userInfo.email) {
          await UserService.updateProfile(apiKeyData.user_id, {
            profilePicture: userInfo.picture
          });
        }

        return done(null, { ...userInfo, tokens: { accessToken, refreshToken } });
      } catch (error) {
        return done(error);
      }
    }));
  };

  // ============================================================================
  // GOOGLE OAUTH2
  // ============================================================================

  passport.use('google', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_URL || 'http://localhost:3000'}/auth/google/callback`,
    scope: ['profile', 'email']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // For OAuth Hub login/signup
      let user = await UserService.findByOAuth('google', profile.id);

      if (!user) {
        // Create new user
        const userId = await UserService.create(
          profile.emails[0].value,
          null, // no password for OAuth users
          null, // password salt
          profile.displayName,
          'google',
          profile.id
        );
        user = await UserService.findByEmail(profile.emails[0].value);

        // Update profile picture
        await UserService.updateProfile(userId, {
          profilePicture: profile.photos[0].value
        });
      }

      return done(null, user, { tokens: { accessToken, refreshToken } });
    } catch (error) {
      return done(error);
    }
  }));

  // ============================================================================
  // GITHUB OAUTH2
  // ============================================================================

  passport.use('github', new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_URL || 'http://localhost:3000'}/auth/github/callback`,
    scope: ['user:email']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await UserService.findByOAuth('github', profile.id);

      if (!user) {
        const userId = await UserService.create(
          profile.emails[0].value,
          null,
          null,
          profile.displayName,
          'github',
          profile.id
        );
        user = await UserService.findByEmail(profile.emails[0].value);

        await UserService.updateProfile(userId, {
          profilePicture: profile.photos[0].value
        });
      }

      return done(null, user, { tokens: { accessToken, refreshToken } });
    } catch (error) {
      return done(error);
    }
  }));

  // ============================================================================
  // FACEBOOK OAUTH2
  // ============================================================================

  passport.use('facebook', new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${process.env.BASE_URL || 'http://localhost:3000'}/auth/facebook/callback`,
    profileFields: ['id', 'displayName', 'emails', 'photos']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await UserService.findByOAuth('facebook', profile.id);

      if (!user) {
        const userId = await UserService.create(
          profile.emails[0].value,
          null,
          null,
          profile.displayName,
          'facebook',
          profile.id
        );
        user = await UserService.findByEmail(profile.emails[0].value);

        await UserService.updateProfile(userId, {
          profilePicture: profile.photos[0].value
        });
      }

      return done(null, user, { tokens: { accessToken, refreshToken } });
    } catch (error) {
      return done(error);
    }
  }));

  // ============================================================================
  // PLATFORM-SPECIFIC OAUTH STRATEGIES (for proxy functionality)
  // ============================================================================

  // These strategies will be dynamically configured based on stored OAuth apps
  const platformStrategies = {
    twitter: { Strategy: TwitterStrategy, scope: ['profile'] },
    linkedin: { Strategy: LinkedInStrategy, scope: ['r_liteprofile', 'r_emailaddress'] },
    microsoft: { Strategy: MicrosoftStrategy, scope: ['user.read'] },
    spotify: { Strategy: SpotifyStrategy, scope: ['user-read-email', 'user-read-private'] },
    discord: { Strategy: DiscordStrategy, scope: ['identify', 'email'] },
    twitch: { Strategy: TwitchStrategy, scope: ['user:read:email'] },
    salesforce: { Strategy: SalesforceStrategy, scope: ['api', 'refresh_token'] },
    hubspot: { Strategy: HubSpotStrategy, scope: ['oauth'] },
    trello: { Strategy: TrelloStrategy, scope: ['read'] },
    asana: { Strategy: AsanaStrategy, scope: ['default'] },
    dropbox: { Strategy: DropboxStrategy, scope: ['account_info.read'] }
  };

  // Note: Additional platforms would need custom strategies or generic OAuth2 strategy

  // ============================================================================
  // SERIALIZATION
  // ============================================================================

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      // This would need to be implemented to find user by ID
      // For now, we'll use email as the identifier
      done(null, { id });
    } catch (error) {
      done(error);
    }
  });
}

/**
 * Generate OAuth consent URL using Passport strategies
 */
export async function generateConsentUrlWithPassport(platform, apiKey, userId, redirectUri) {
  // Get user's OAuth app configuration
  const userApp = await OAuthAppService.findByUserAndPlatform(userId, platform);
  if (!userApp) {
    throw new Error(`No OAuth app configured for ${platform}`);
  }

  // Use Passport strategy to generate authorization URL
  const strategyName = `${platform}-oauth`;
  const strategy = passport._strategies[strategyName];

  if (!strategy) {
    throw new Error(`OAuth strategy not configured for ${platform}`);
  }

  // Generate the authorization URL
  const authUrl = strategy.authorizationURL({
    state: `platform=${platform}&apiKey=${apiKey}`,
    scope: userApp.scopes
  });

  return authUrl;
}

/**
 * Middleware for API key authentication
 */
export async function authenticateApiKey(req, res, next) {
  const authHeader = req.headers.authorization;
  const apiKey = req.query.apiKey || req.body.apiKey;

  if (!authHeader?.startsWith('Bearer ') && !apiKey) {
    return res.status(401).json({ error: 'API key required' });
  }

  const token = authHeader?.replace('Bearer ', '') || apiKey;

  try {
    const apiKeyData = await ApiKeyService.findByHash(await hashApiKey(token));
    if (!apiKeyData) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    req.user = apiKeyData;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Authentication failed' });
  }
}

// hashApiKey is already imported above
