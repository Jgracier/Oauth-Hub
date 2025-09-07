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
   * Find user by email using original key format search
   */
  async findUserByEmail(email) {
    const { keys } = await this.env.USERS.list();
    for (const keyInfo of keys) {
      if (keyInfo.name.startsWith('user ') && keyInfo.name.endsWith(email)) {
        const userData = await this.env.USERS.get(keyInfo.name);
        if (userData) {
          const parsedUser = JSON.parse(userData);
          if (parsedUser.email === email) {
            return {
              userData: parsedUser,
              userKey: keyInfo.name
            };
          }
        }
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

    // Store user with original key format: "user FirstName LastName email"
    const userKey = `user ${firstName} ${lastName} ${email}`;
    await this.env.USERS.put(userKey, JSON.stringify(userData));

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
    
    // Store API key with original format: "api-Default Key FirstName LastName email"
    const apiKeyKey = `api-Default Key ${firstName} ${lastName} ${email}`;
    await this.env.API_KEYS.put(apiKeyKey, JSON.stringify({
      ...apiKeyInfo,
      keyId: generateId()
    }));

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

    // Get user's default API key using original format search
    let userApiKey = null;
    const { keys } = await this.env.API_KEYS.list();
    
    for (const keyInfo of keys) {
      if (keyInfo.name.includes('Default Key') && keyInfo.name.endsWith(user.email)) {
        const keyData = await this.env.API_KEYS.get(keyInfo.name);
        const parsed = JSON.parse(keyData);
        if (parsed.email === user.email) {
          userApiKey = parsed.apiKey;
          break;
        }
      }
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

    await this.env.USER_SESSIONS.put(`session:${sessionToken}`, JSON.stringify(sessionData), {
      expirationTtl: 86400 // 24 hours
    });

    return sessionToken;
  }

  /**
   * Validate session and return user data with OAuth profiles
   */
  async validateSession(request) {
    const sessionToken = getSessionFromRequest(request);
    if (!sessionToken) {
      return null;
    }

    const sessionData = await this.env.USER_SESSIONS.get(`session:${sessionToken}`);
    if (!sessionData) {
      return null;
    }

    const session = JSON.parse(sessionData);
    
    // Get full user data including OAuth profiles
    const userResult = await this.findUserByEmail(session.email);
    if (userResult) {
      session.user = userResult.userData; // Include full user data with OAuth profiles
    }

    return session;
  }

  /**
   * Destroy session
   */
  async destroySession(request) {
    const sessionToken = getSessionFromRequest(request);
    if (sessionToken) {
      await this.env.USER_SESSIONS.delete(`session:${sessionToken}`);
    }
  }
}
