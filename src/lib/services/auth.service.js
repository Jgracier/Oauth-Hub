// =============================================================================
// 🔐 AUTHENTICATION SERVICE - Centralized authentication logic
// =============================================================================

import { hashPassword, verifyPassword, createSessionToken, createSessionCookie, getSessionFromRequest } from '../auth/session.js';
import { validateEmail, generateApiKey, generateId, sanitizeInput } from '../utils/helpers.js';

export class AuthService {
  constructor(env) {
    this.env = env;
  }

  /**
   * Find user by email using efficient direct lookup
   */
  async findUserByEmail(email) {
    const emailKey = `email:${email}`;
    const userId = await this.env.USERS.get(emailKey);
    
    if (userId) {
      const userKey = `user:${userId}`;
      const userData = await this.env.USERS.get(userKey);
      
      if (userData) {
        return {
          userData: JSON.parse(userData),
          userKey: userKey
        };
      }
    }
    
    return null;
  }

  /**
   * Create new user account
   */
  async createUser(email, password, fullName) {
    // Check if user already exists
    const existingUser = await this.findUserByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password securely
    const { hash, salt } = await hashPassword(password);

    // Create user data
    const userId = generateId();
    const nameParts = (fullName || email.split('@')[0]).split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const userData = {
      id: userId,
      email: sanitizeInput(email),
      name: sanitizeInput(fullName || email.split('@')[0]),
      firstName: sanitizeInput(firstName),
      lastName: sanitizeInput(lastName),
      passwordHash: hash,
      passwordSalt: salt,
      createdAt: new Date().toISOString()
    };

    // Store user and email mapping
    await this.env.USERS.put(`user:${userId}`, JSON.stringify(userData));
    await this.env.USERS.put(`email:${email}`, userId);

    // Create default API key
    const apiKey = generateApiKey();
    const apiKeyInfo = {
      userId, 
      email,
      firstName,
      lastName,
      fullName: fullName || email.split('@')[0],
      keyName: 'Default Key',
      apiKey,
      createdAt: new Date().toISOString()
    };
    
    await this.env.API_KEYS.put(`user-api-key:${userId}:default`, JSON.stringify(apiKeyInfo));

    return { userData, apiKey };
  }

  /**
   * Authenticate user login
   */
  async authenticateUser(email, password) {
    const userResult = await this.findUserByEmail(email);
    if (!userResult) {
      throw new Error('Invalid email or password');
    }

    const user = userResult.userData;
    const isValid = await verifyPassword(password, user.passwordHash, user.passwordSalt);
    if (!isValid) {
      throw new Error('Invalid email or password');
    }

    // Get user's default API key
    let userApiKey = null;
    const apiKeyData = await this.env.API_KEYS.get(`user-api-key:${user.id}:default`);
    if (apiKeyData) {
      const parsed = JSON.parse(apiKeyData);
      userApiKey = parsed.apiKey;
    }

    return { user, apiKey: userApiKey };
  }

  /**
   * Create user session
   */
  async createSession(user) {
    const sessionToken = createSessionToken();
    const sessionData = {
      userId: user.id,
      email: user.email,
      name: user.name,
      createdAt: Date.now()
    };

    await this.env.USERS.put(`session:${sessionToken}`, JSON.stringify(sessionData), {
      expirationTtl: 86400 // 24 hours
    });

    return sessionToken;
  }

  /**
   * Validate session
   */
  async validateSession(request) {
    const sessionToken = getSessionFromRequest(request);
    if (!sessionToken) {
      return null;
    }

    const sessionData = await this.env.USERS.get(`session:${sessionToken}`);
    if (!sessionData) {
      return null;
    }

    return JSON.parse(sessionData);
  }

  /**
   * Destroy session
   */
  async destroySession(request) {
    const sessionToken = getSessionFromRequest(request);
    if (sessionToken) {
      await this.env.USERS.delete(`session:${sessionToken}`);
    }
  }
}
