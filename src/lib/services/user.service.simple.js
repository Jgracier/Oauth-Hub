// =============================================================================
// 👤 SIMPLE USER SERVICE - User data operations without logging
// =============================================================================

import { generateId, sanitizeInput } from '../utils/helpers.js';
import { hashPassword } from '../auth/session.js';

export class SimpleUserService {
  constructor(env) {
    this.env = env;
  }

  /**
   * Find user by email
   */
  async findByEmail(email) {
    try {
      if (!email) {
        return null;
      }

      const { keys } = await this.env.USERS.list();
      
      for (const keyInfo of keys) {
        if (keyInfo.name.startsWith('user ')) {
          try {
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
          } catch (parseError) {
            console.warn('Failed to parse user data:', keyInfo.name);
            continue;
          }
        }
      }
      
      return null;
      
    } catch (error) {
      console.error('Failed to find user by email:', error.message);
      throw new Error('Failed to search for user');
    }
  }

  /**
   * Create new user
   */
  async create(email, password, fullName) {
    try {
      console.log('Creating user:', email?.substring(0, 3) + '***');
      
      // Validate inputs
      if (!email) {
        throw new Error('Email is required');
      }
      if (!password) {
        throw new Error('Password is required');
      }
      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters');
      }

      // Check if user already exists
      const existingUser = await this.findByEmail(email);
      if (existingUser) {
        throw new Error('User already exists');
      }
      
      // Hash password securely
      const { hash, salt } = await hashPassword(password);
      
      // Create new user
      const userId = generateId();
      
      // Parse first and last name from full name
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
      
      // Store user
      const cleanUserKey = `user ${firstName} ${lastName} ${email}`;
      await this.env.USERS.put(cleanUserKey, JSON.stringify(userData));
      
      console.log('User created successfully:', userId);
      
      return { userData, userKey: cleanUserKey };
      
    } catch (error) {
      console.error('Failed to create user:', error.message);
      throw error;
    }
  }

  /**
   * Get user by session token
   */
  async getBySessionToken(sessionToken) {
    try {
      if (!sessionToken) {
        return null;
      }
      
      const sessionData = await this.env.USERS.get(`session:${sessionToken}`);
      if (!sessionData) {
        return null;
      }
      
      const session = JSON.parse(sessionData);
      const user = await this.findByEmail(session.email);
      
      return user;
      
    } catch (error) {
      console.error('Failed to get user by session token:', error.message);
      throw new Error('Failed to get user by session');
    }
  }
}
