// =============================================================================
// 👤 USER SERVICE - User data operations
// =============================================================================

import { generateApiKey, generateId, sanitizeInput } from '../utils/helpers.js';
import { hashPassword } from '../auth/session.js';
import { Logger } from '../utils/logger.js';
import { 
  AlreadyExistsError, 
  NotFoundError, 
  ValidationError,
  StorageError,
  StorageTimeoutError
} from '../utils/errors.js';

export class UserService {
  constructor(env) {
    this.env = env;
    this.logger = new Logger('UserService', env);
  }

  /**
   * Find user by email
   */
  async findByEmail(email) {
    const startTime = Date.now();
    
    try {
      this.logger.debug('Finding user by email', { email: email?.substring(0, 3) + '***' });
      
      if (!email) {
        throw new ValidationError('Email is required', 'email', email);
      }

      const { keys } = await this.env.USERS.list();
      
      for (const keyInfo of keys) {
        if (keyInfo.name.startsWith('user ')) {
          try {
            const userData = await this.env.USERS.get(keyInfo.name);
            if (userData) {
              const parsedUser = JSON.parse(userData);
              if (parsedUser.email === email) {
                this.logger.info('User found successfully', { 
                  userId: parsedUser.id,
                  duration: Date.now() - startTime 
                });
                return {
                  userData: parsedUser,
                  userKey: keyInfo.name
                };
              }
            }
          } catch (parseError) {
            this.logger.warn('Failed to parse user data', { 
              userKey: keyInfo.name,
              error: parseError.message 
            });
            continue; // Skip corrupted user data
          }
        }
      }
      
      this.logger.debug('User not found', { 
        email: email?.substring(0, 3) + '***',
        duration: Date.now() - startTime 
      });
      return null;
      
    } catch (error) {
      this.logger.error('Failed to find user by email', {
        email: email?.substring(0, 3) + '***',
        duration: Date.now() - startTime
      }, error);
      
      if (error instanceof ValidationError) {
        throw error;
      }
      
      throw new StorageError('Failed to search for user', 'findByEmail', email, {
        originalError: error.message
      });
    }
  }

  /**
   * Create new user
   */
  async create(email, password, fullName) {
    const startTime = Date.now();
    
    try {
      this.logger.info('Creating new user', { 
        email: email?.substring(0, 3) + '***',
        hasFullName: !!fullName 
      });
      
      // Validate inputs
      if (!email) {
        throw new ValidationError('Email is required', 'email', email);
      }
      if (!password) {
        throw new ValidationError('Password is required', 'password');
      }
      if (password.length < 8) {
        throw new ValidationError('Password must be at least 8 characters', 'password');
      }

      // Check if user already exists
      const existingUser = await this.findByEmail(email);
      if (existingUser) {
        throw new AlreadyExistsError('User', email);
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
      
      this.logger.info('User created successfully', {
        userId,
        email: email?.substring(0, 3) + '***',
        duration: Date.now() - startTime
      });
      
      return { userData, userKey: cleanUserKey };
      
    } catch (error) {
      this.logger.error('Failed to create user', {
        email: email?.substring(0, 3) + '***',
        duration: Date.now() - startTime
      }, error);
      
      if (error instanceof ValidationError || error instanceof AlreadyExistsError) {
        throw error;
      }
      
      throw new StorageError('Failed to create user', 'create', email, {
        originalError: error.message
      });
    }
  }

  /**
   * Get user by session token
   */
  async getBySessionToken(sessionToken) {
    const startTime = Date.now();
    
    try {
      if (!sessionToken) {
        this.logger.debug('No session token provided');
        return null;
      }
      
      this.logger.debug('Getting user by session token', { 
        tokenPrefix: sessionToken?.substring(0, 8) + '***' 
      });
      
      const sessionData = await this.env.USERS.get(`session:${sessionToken}`);
      if (!sessionData) {
        this.logger.debug('Session not found', { 
          tokenPrefix: sessionToken?.substring(0, 8) + '***' 
        });
        return null;
      }
      
      const session = JSON.parse(sessionData);
      const user = await this.findByEmail(session.email);
      
      if (user) {
        this.logger.debug('User found by session token', {
          userId: user.userData.id,
          duration: Date.now() - startTime
        });
      }
      
      return user;
      
    } catch (error) {
      this.logger.error('Failed to get user by session token', {
        tokenPrefix: sessionToken?.substring(0, 8) + '***',
        duration: Date.now() - startTime
      }, error);
      
      throw new StorageError('Failed to get user by session', 'getBySessionToken', sessionToken, {
        originalError: error.message
      });
    }
  }
}
