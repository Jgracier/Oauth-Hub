/**
 * Oracle Database Service
 * Handles all database operations for OAuth Hub
 */

import oracledb from 'oracledb';
import crypto from 'crypto';

// Configure Oracle client (only in production with Oracle DB)
if (process.env.NODE_ENV === 'production' && process.env.DB_CONNECT_STRING) {
  try {
    oracledb.initOracleClient({ libDir: process.env.ORACLE_CLIENT_LIB_DIR || '/usr/lib/oracle/21/client64/lib' });
  } catch (error) {
    console.warn('Oracle client initialization failed, will use mock database for development:', error.message);
  }
}

// Database configuration
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECT_STRING,
  poolMin: parseInt(process.env.DB_POOL_MIN) || 2,
  poolMax: parseInt(process.env.DB_POOL_MAX) || 10,
  poolIncrement: parseInt(process.env.DB_POOL_INCREMENT) || 1,
  poolTimeout: parseInt(process.env.DB_POOL_TIMEOUT) || 60,
  queueTimeout: parseInt(process.env.DB_QUEUE_TIMEOUT) || 60000
};

// Connection pool
let pool = null;

// Mock database for development
let mockDb = {
  users: new Map(),
  apiKeys: new Map(),
  oauthApps: new Map(),
  oauthTokens: new Map(),
  sessions: new Map(),
  apiUsage: new Map()
};

// Initialize with test user
const initializeMockData = () => {
  const testUser = {
    id: 'd9328688-b39f-444b-afce-f0723808ad7c',
    email: 'test@example.com',
    password_hash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeEyOoJvJc2GjMhCe', // bcrypt hash for TestPass123
    password_salt: null,
    full_name: 'Test User',
    oauth_provider: 'email',
    oauth_id: null,
    profile_picture: null,
    email_verified: false,
    subscription_plan: 'free',
    api_call_count: 0,
    api_call_limit: 5000,
    created_at: new Date(),
    updated_at: new Date()
  };
  mockDb.users.set(testUser.id, testUser);
  console.log('Mock database initialized with test user');
};

// Initialize mock data
initializeMockData();

export let useMockDb = false;

/**
 * Initialize database connection pool
 */
export async function initializeDatabase() {
  console.log('Initializing database...', {
    NODE_ENV: process.env.NODE_ENV,
    DB_CONNECT_STRING: process.env.DB_CONNECT_STRING ? 'present' : 'missing'
  });

  try {
    // Check if we should use Oracle DB
    if (process.env.NODE_ENV === 'production' && process.env.DB_CONNECT_STRING) {
      if (!pool) {
        pool = await oracledb.createPool(dbConfig);
        console.log('✅ Oracle database pool initialized successfully');
      }
      useMockDb = false;
      console.log('Using Oracle database');
      return pool;
    } else {
      // Use mock database for development
      console.log('🧪 Using mock database for development');
      useMockDb = true;
      return mockDb;
    }
  } catch (error) {
    console.warn('⚠️ Oracle database not available, falling back to mock database:', error.message);
    useMockDb = true;
    return mockDb;
  }
}

/**
 * Get database connection from pool
 */
export async function getConnection() {
  if (!pool) {
    await initializeDatabase();
  }
  return await pool.getConnection();
}

/**
 * Execute query with automatic connection management
 */
export async function executeQuery(sql, binds = [], options = {}) {
  if (useMockDb) {
    // Mock database operations for development
    const sqlUpper = sql.trim().toUpperCase();

    if (sqlUpper.startsWith('SELECT') && sqlUpper.includes('FROM USERS') && sqlUpper.includes('WHERE EMAIL')) {
      // Mock findByEmail
      const email = binds.email;
      for (const user of mockDb.users.values()) {
        if (user.email === email) {
          return { rows: [user] };
        }
      }
      return { rows: [] };
    }

    if (sqlUpper.startsWith('INSERT INTO USERS')) {
      // Mock user creation - just return success
      return { rowsAffected: 1 };
    }

    // Default mock response
    return { rows: [], rowsAffected: 0 };
  }

  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(sql, binds, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      ...options
    });
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error('Error closing connection:', error);
      }
    }
  }
}

/**
 * Execute query with transaction support
 */
export async function executeTransaction(callback) {
  let connection;
  try {
    connection = await getConnection();
    await connection.execute('BEGIN');

    const result = await callback(connection);

    await connection.execute('COMMIT');
    return result;
  } catch (error) {
    if (connection) {
      try {
        await connection.execute('ROLLBACK');
      } catch (rollbackError) {
        console.error('Error rolling back transaction:', rollbackError);
      }
    }
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error('Error closing connection:', error);
      }
    }
  }
}

// ============================================================================
// USER OPERATIONS
// ============================================================================

export const UserService = {
  /**
   * Create a new user
   */
  async create(email, passwordHash, passwordSalt, fullName = '', oauthProvider = 'email', oauthId = null) {
    if (useMockDb) {
      // Mock implementation
      console.log('Creating mock user:', { email, fullName });
      const id = crypto.randomUUID();
      const user = {
        id,
        email,
        password_hash: passwordHash,
        password_salt: passwordSalt,
        full_name: fullName,
        oauth_provider: oauthProvider,
        oauth_id: oauthId,
        profile_picture: null,
        email_verified: false,
        subscription_plan: 'free',
        api_call_count: 0,
        api_call_limit: 5000,
        created_at: new Date(),
        updated_at: new Date()
      };
      mockDb.users.set(id, user);
      console.log('Mock user created with ID:', id);
      return id;
    }

    const id = crypto.randomUUID();
    const sql = `
      INSERT INTO users (id, email, password_hash, password_salt, full_name, oauth_provider, oauth_id)
      VALUES (:id, :email, :passwordHash, :passwordSalt, :fullName, :oauthProvider, :oauthId)
      RETURNING id INTO :userId
    `;

    const binds = {
      id,
      email,
      passwordHash,
      passwordSalt,
      fullName,
      oauthProvider,
      oauthId,
      userId: { type: oracledb.STRING, dir: oracledb.BIND_OUT }
    };

    await executeQuery(sql, binds);
    return id;
  },

  /**
   * Find user by email
   */
  async findByEmail(email) {
    if (useMockDb) {
      // Mock implementation
      for (const user of mockDb.users.values()) {
        if (user.email === email) {
          return user;
        }
      }
      return null;
    }

    const sql = `
      SELECT id, email, password_hash, password_salt, full_name, profile_picture,
             oauth_provider, oauth_id, email_verified, subscription_plan,
             api_call_count, api_call_limit, created_at, updated_at
      FROM users
      WHERE email = :email
    `;

    const result = await executeQuery(sql, { email });
    return result.rows[0] || null;
  },

  /**
   * Find user by OAuth provider and ID
   */
  async findByOAuth(oauthProvider, oauthId) {
    const sql = `
      SELECT id, email, password_hash, password_salt, full_name, profile_picture,
             oauth_provider, oauth_id, email_verified, subscription_plan,
             api_call_count, api_call_limit, created_at, updated_at
      FROM users
      WHERE oauth_provider = :oauthProvider AND oauth_id = :oauthId
    `;

    const result = await executeQuery(sql, { oauthProvider, oauthId });
    return result.rows[0] || null;
  },

  /**
   * Update user profile
   */
  async updateProfile(id, updates) {
    const fields = [];
    const binds = { id };

    if (updates.fullName !== undefined) {
      fields.push('full_name = :fullName');
      binds.fullName = updates.fullName;
    }

    if (updates.profilePicture !== undefined) {
      fields.push('profile_picture = :profilePicture');
      binds.profilePicture = updates.profilePicture;
    }

    if (updates.emailVerified !== undefined) {
      fields.push('email_verified = :emailVerified');
      binds.emailVerified = updates.emailVerified;
    }

    if (fields.length === 0) return;

    const sql = `
      UPDATE users
      SET ${fields.join(', ')}
      WHERE id = :id
    `;

    await executeQuery(sql, binds);
  },

  /**
   * Increment API call count for user
   */
  async incrementApiCallCount(userId) {
    if (useMockDb) {
      // Mock implementation
      const user = mockDb.users.get(userId);
      if (user) {
        user.api_call_count = (user.api_call_count || 0) + 1;
      }
      return;
    }

    const sql = `
      UPDATE users
      SET api_call_count = api_call_count + 1
      WHERE id = :userId
    `;

    await executeQuery(sql, { userId });
  }
};

// ============================================================================
// API KEY OPERATIONS
// ============================================================================

export const ApiKeyService = {
  /**
   * Create a new API key
   */
  async create(userId, keyId, name, apiKey, apiKeyHash) {
    const id = crypto.randomUUID();
    const sql = `
      INSERT INTO api_keys (id, user_id, key_id, name, api_key, api_key_hash)
      VALUES (:id, :userId, :keyId, :name, :apiKey, :apiKeyHash)
    `;

    const binds = { id, userId, keyId, name, apiKey, apiKeyHash };
    await executeQuery(sql, binds);
    return id;
  },

  /**
   * Find API key by hash (for authentication)
   */
  async findByHash(apiKeyHash) {
    const sql = `
      SELECT ak.*, u.email, u.subscription_plan, u.api_call_limit
      FROM api_keys ak
      JOIN users u ON ak.user_id = u.id
      WHERE ak.api_key_hash = :apiKeyHash AND ak.is_active = 1
    `;

    const result = await executeQuery(sql, { apiKeyHash });
    return result.rows[0] || null;
  },

  /**
   * Find API key by key ID
   */
  async findByKeyId(keyId) {
    const sql = `
      SELECT ak.*, u.email
      FROM api_keys ak
      JOIN users u ON ak.user_id = u.id
      WHERE ak.key_id = :keyId AND ak.is_active = 1
    `;

    const result = await executeQuery(sql, { keyId });
    return result.rows[0] || null;
  },

  /**
   * Get all API keys for a user
   */
  async findByUserId(userId) {
    const sql = `
      SELECT id, key_id, name, last_used, created_at
      FROM api_keys
      WHERE user_id = :userId AND is_active = 1
      ORDER BY created_at DESC
    `;

    const result = await executeQuery(sql, { userId });
    return result.rows;
  },

  /**
   * Update last used timestamp
   */
  async updateLastUsed(id) {
    const sql = `
      UPDATE api_keys
      SET last_used = CURRENT_TIMESTAMP
      WHERE id = :id
    `;

    await executeQuery(sql, { id });
  },

  /**
   * Delete API key
   */
  async delete(keyId, userId) {
    const sql = `
      UPDATE api_keys
      SET is_active = 0
      WHERE key_id = :keyId AND user_id = :userId
    `;

    const result = await executeQuery(sql, { keyId, userId });
    return result.rowsAffected > 0;
  }
};

// ============================================================================
// OAUTH APP OPERATIONS
// ============================================================================

export const OAuthAppService = {
  /**
   * Create OAuth app credentials
   */
  async create(userId, platform, appName, clientId, clientSecret, redirectUri = null, scopes = []) {
    const id = crypto.randomUUID();
    const sql = `
      INSERT INTO oauth_apps (id, user_id, platform, app_name, client_id, client_secret, redirect_uri, scopes)
      VALUES (:id, :userId, :platform, :appName, :clientId, :clientSecret, :redirectUri, :scopes)
    `;

    const binds = {
      id,
      userId,
      platform,
      appName,
      clientId,
      clientSecret,
      redirectUri,
      scopes: JSON.stringify(scopes)
    };

    await executeQuery(sql, binds);
    return id;
  },

  /**
   * Find OAuth app by user and platform
   */
  async findByUserAndPlatform(userId, platform) {
    const sql = `
      SELECT id, app_name, client_id, client_secret, redirect_uri, scopes, additional_config, created_at
      FROM oauth_apps
      WHERE user_id = :userId AND platform = :platform AND is_active = 1
    `;

    const result = await executeQuery(sql, { userId, platform });
    const app = result.rows[0];

    if (app) {
      // Parse JSON fields
      app.scopes = JSON.parse(app.scopes || '[]');
      app.additionalConfig = JSON.parse(app.additionalConfig || '{}');
    }

    return app || null;
  },

  /**
   * Get all OAuth apps for a user
   */
  async findByUserId(userId) {
    const sql = `
      SELECT platform, app_name, client_id, created_at
      FROM oauth_apps
      WHERE user_id = :userId AND is_active = 1
      ORDER BY created_at DESC
    `;

    const result = await executeQuery(sql, { userId });
    return result.rows;
  },

  /**
   * Update OAuth app
   */
  async update(id, userId, updates) {
    const fields = [];
    const binds = { id, userId };

    if (updates.appName !== undefined) {
      fields.push('app_name = :appName');
      binds.appName = updates.appName;
    }

    if (updates.clientId !== undefined) {
      fields.push('client_id = :clientId');
      binds.clientId = updates.clientId;
    }

    if (updates.clientSecret !== undefined) {
      fields.push('client_secret = :clientSecret');
      binds.clientSecret = updates.clientSecret;
    }

    if (updates.redirectUri !== undefined) {
      fields.push('redirect_uri = :redirectUri');
      binds.redirectUri = updates.redirectUri;
    }

    if (updates.scopes !== undefined) {
      fields.push('scopes = :scopes');
      binds.scopes = JSON.stringify(updates.scopes);
    }

    if (fields.length === 0) return;

    const sql = `
      UPDATE oauth_apps
      SET ${fields.join(', ')}
      WHERE id = :id AND user_id = :userId
    `;

    await executeQuery(sql, binds);
  },

  /**
   * Delete OAuth app
   */
  async delete(platform, userId) {
    const sql = `
      UPDATE oauth_apps
      SET is_active = 0
      WHERE platform = :platform AND user_id = :userId
    `;

    const result = await executeQuery(sql, { platform, userId });
    return result.rowsAffected > 0;
  }
};

// ============================================================================
// OAUTH TOKEN OPERATIONS
// ============================================================================

export const OAuthTokenService = {
  /**
   * Store OAuth tokens
   */
  async create(userId, platform, platformUserId, accessToken, refreshToken = null, tokenType = 'Bearer', expiresAt = null, scopes = []) {
    const id = crypto.randomUUID();
    const sql = `
      INSERT INTO oauth_tokens (id, user_id, platform, platform_user_id, access_token, refresh_token, token_type, expires_at, scopes)
      VALUES (:id, :userId, :platform, :platformUserId, :accessToken, :refreshToken, :tokenType, :expiresAt, :scopes)
    `;

    const binds = {
      id,
      userId,
      platform,
      platformUserId,
      accessToken,
      refreshToken,
      tokenType,
      expiresAt,
      scopes: JSON.stringify(scopes)
    };

    await executeQuery(sql, binds);
    return id;
  },

  /**
   * Find OAuth tokens by user, platform, and platform user ID
   */
  async findByUserPlatform(userId, platform, platformUserId) {
    const sql = `
      SELECT id, access_token, refresh_token, token_type, expires_at, scopes, token_metadata, created_at
      FROM oauth_tokens
      WHERE user_id = :userId AND platform = :platform AND platform_user_id = :platformUserId AND is_active = 1
      ORDER BY created_at DESC
      FETCH FIRST 1 ROW ONLY
    `;

    const result = await executeQuery(sql, { userId, platform, platformUserId });
    const token = result.rows[0];

    if (token) {
      token.scopes = JSON.parse(token.scopes || '[]');
      token.tokenMetadata = JSON.parse(token.tokenMetadata || '{}');
    }

    return token || null;
  },

  /**
   * Update OAuth tokens
   */
  async update(id, updates) {
    const fields = [];
    const binds = { id };

    if (updates.accessToken !== undefined) {
      fields.push('access_token = :accessToken');
      binds.accessToken = updates.accessToken;
    }

    if (updates.refreshToken !== undefined) {
      fields.push('refresh_token = :refreshToken');
      binds.refreshToken = updates.refreshToken;
    }

    if (updates.expiresAt !== undefined) {
      fields.push('expires_at = :expiresAt');
      binds.expiresAt = updates.expiresAt;
    }

    if (updates.scopes !== undefined) {
      fields.push('scopes = :scopes');
      binds.scopes = JSON.stringify(updates.scopes);
    }

    if (fields.length === 0) return;

    const sql = `
      UPDATE oauth_tokens
      SET ${fields.join(', ')}
      WHERE id = :id
    `;

    await executeQuery(sql, binds);
  },

  /**
   * Delete OAuth tokens
   */
  async delete(userId, platform, platformUserId) {
    const sql = `
      UPDATE oauth_tokens
      SET is_active = 0
      WHERE user_id = :userId AND platform = :platform AND platform_user_id = :platformUserId
    `;

    const result = await executeQuery(sql, { userId, platform, platformUserId });
    return result.rowsAffected > 0;
  }
};

// ============================================================================
// SESSION OPERATIONS
// ============================================================================

export const SessionService = {
  /**
   * Create a new session
   */
  async create(userId, sessionToken, sessionTokenHash, ipAddress = null, userAgent = null, expiresAt) {
    const id = crypto.randomUUID();
    const sql = `
      INSERT INTO user_sessions (id, user_id, session_token, session_token_hash, ip_address, user_agent, expires_at)
      VALUES (:id, :userId, :sessionToken, :sessionTokenHash, :ipAddress, :userAgent, :expiresAt)
    `;

    const binds = { id, userId, sessionToken, sessionTokenHash, ipAddress, userAgent, expiresAt };
    await executeQuery(sql, binds);
    return id;
  },

  /**
   * Find session by token hash
   */
  async findByTokenHash(sessionTokenHash) {
    const sql = `
      SELECT s.*, u.email, u.full_name
      FROM user_sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.session_token_hash = :sessionTokenHash AND s.is_active = 1 AND s.expires_at > CURRENT_TIMESTAMP
    `;

    const result = await executeQuery(sql, { sessionTokenHash });
    return result.rows[0] || null;
  },

  /**
   * Delete session
   */
  async delete(sessionToken) {
    const sql = `
      UPDATE user_sessions
      SET is_active = 0
      WHERE session_token = :sessionToken
    `;

    const result = await executeQuery(sql, { sessionToken });
    return result.rowsAffected > 0;
  },

  /**
   * Clean up expired sessions
   */
  async cleanupExpired() {
    const sql = `
      UPDATE user_sessions
      SET is_active = 0
      WHERE expires_at <= CURRENT_TIMESTAMP AND is_active = 1
    `;

    const result = await executeQuery(sql);
    return result.rowsAffected;
  }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Hash API key for secure storage
 */
export function hashApiKey(apiKey) {
  return crypto.createHash('sha256').update(apiKey).digest('hex');
}

/**
 * Hash session token for secure storage
 */
export function hashSessionToken(sessionToken) {
  return crypto.createHash('sha256').update(sessionToken).digest('hex');
}

/**
 * Close database pool (for graceful shutdown)
 */
export async function closeDatabase() {
  if (pool) {
    await pool.close();
    pool = null;
    console.log('✅ Oracle database pool closed');
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  await closeDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeDatabase();
  process.exit(0);
});
