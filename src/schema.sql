-- OAuth Hub - Oracle Database Schema
-- Production-ready schema for credentials storage

-- =====================================================
-- USERS TABLE
-- Stores user account information
-- =====================================================
CREATE TABLE users (
    id VARCHAR2(36) PRIMARY KEY,
    email VARCHAR2(255) UNIQUE NOT NULL,
    password_hash VARCHAR2(255),
    password_salt VARCHAR2(255),
    full_name VARCHAR2(255),
    profile_picture VARCHAR2(500),
    oauth_provider VARCHAR2(50), -- 'email', 'google', 'github'
    oauth_id VARCHAR2(255), -- OAuth provider user ID
    email_verified NUMBER(1) DEFAULT 0,
    subscription_plan VARCHAR2(50) DEFAULT 'free',
    api_call_count NUMBER DEFAULT 0,
    api_call_limit NUMBER DEFAULT 5000,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- API_KEYS TABLE
-- Stores user-generated API keys for authentication
-- =====================================================
CREATE TABLE api_keys (
    id VARCHAR2(36) PRIMARY KEY,
    user_id VARCHAR2(36) NOT NULL,
    key_id VARCHAR2(36) UNIQUE NOT NULL,
    name VARCHAR2(255) NOT NULL,
    api_key VARCHAR2(100) UNIQUE NOT NULL, -- The actual API key (hashed for security)
    api_key_hash VARCHAR2(255) NOT NULL, -- Secure hash of the API key
    last_used TIMESTAMP,
    expires_at TIMESTAMP,
    is_active NUMBER(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_api_keys_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================================
-- OAUTH_APPS TABLE
-- Stores OAuth application credentials per platform
-- =====================================================
CREATE TABLE oauth_apps (
    id VARCHAR2(36) PRIMARY KEY,
    user_id VARCHAR2(36) NOT NULL,
    platform VARCHAR2(50) NOT NULL,
    app_name VARCHAR2(255) NOT NULL,
    client_id VARCHAR2(500) NOT NULL,
    client_secret VARCHAR2(500), -- Encrypted in production
    redirect_uri VARCHAR2(500),
    scopes CLOB, -- JSON array of scopes
    additional_config CLOB, -- JSON for platform-specific config
    is_active NUMBER(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_oauth_apps_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uk_oauth_apps UNIQUE (user_id, platform)
);

-- =====================================================
-- OAUTH_TOKENS TABLE
-- Stores OAuth access/refresh tokens per platform user
-- =====================================================
CREATE TABLE oauth_tokens (
    id VARCHAR2(36) PRIMARY KEY,
    user_id VARCHAR2(36) NOT NULL,
    platform VARCHAR2(50) NOT NULL,
    platform_user_id VARCHAR2(255) NOT NULL, -- User's ID on the OAuth platform
    access_token CLOB NOT NULL, -- Encrypted access token
    refresh_token CLOB, -- Encrypted refresh token (if available)
    token_type VARCHAR2(50) DEFAULT 'Bearer',
    expires_at TIMESTAMP,
    scopes CLOB, -- JSON array of granted scopes
    token_metadata CLOB, -- Additional token information (JSON)
    is_active NUMBER(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_oauth_tokens_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uk_oauth_tokens UNIQUE (user_id, platform, platform_user_id)
);

-- =====================================================
-- USER_SESSIONS TABLE
-- Stores user session information
-- =====================================================
CREATE TABLE user_sessions (
    id VARCHAR2(36) PRIMARY KEY,
    user_id VARCHAR2(36) NOT NULL,
    session_token VARCHAR2(255) UNIQUE NOT NULL,
    session_token_hash VARCHAR2(255) NOT NULL, -- Secure hash
    ip_address VARCHAR2(45),
    user_agent CLOB,
    expires_at TIMESTAMP NOT NULL,
    is_active NUMBER(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================================
-- API_USAGE TABLE
-- Tracks API usage for billing/analytics
-- =====================================================
CREATE TABLE api_usage (
    id VARCHAR2(36) PRIMARY KEY,
    user_id VARCHAR2(36) NOT NULL,
    api_key_id VARCHAR2(36),
    endpoint VARCHAR2(500),
    method VARCHAR2(10),
    status_code NUMBER,
    response_time_ms NUMBER,
    ip_address VARCHAR2(45),
    user_agent CLOB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_api_usage_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_api_usage_key FOREIGN KEY (api_key_id) REFERENCES api_keys(id) ON DELETE SET NULL
);

-- =====================================================
-- SUBSCRIPTION_USAGE TABLE
-- Tracks usage against subscription limits
-- =====================================================
CREATE TABLE subscription_usage (
    id VARCHAR2(36) PRIMARY KEY,
    user_id VARCHAR2(36) NOT NULL,
    period_start TIMESTAMP NOT NULL,
    period_end TIMESTAMP NOT NULL,
    api_calls NUMBER DEFAULT 0,
    api_keys_created NUMBER DEFAULT 0,
    oauth_apps_created NUMBER DEFAULT 0,
    tokens_created NUMBER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_subscription_usage_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uk_subscription_usage UNIQUE (user_id, period_start, period_end)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Users table indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_oauth_provider ON users(oauth_provider, oauth_id);

-- API Keys indexes
CREATE INDEX idx_api_keys_user ON api_keys(user_id);
CREATE INDEX idx_api_keys_key_hash ON api_keys(api_key_hash);
CREATE INDEX idx_api_keys_active ON api_keys(is_active);

-- OAuth Apps indexes
CREATE INDEX idx_oauth_apps_user ON oauth_apps(user_id);
CREATE INDEX idx_oauth_apps_platform ON oauth_apps(platform);
CREATE INDEX idx_oauth_apps_active ON oauth_apps(is_active);

-- OAuth Tokens indexes
CREATE INDEX idx_oauth_tokens_user ON oauth_tokens(user_id);
CREATE INDEX idx_oauth_tokens_platform ON oauth_tokens(platform);
CREATE INDEX idx_oauth_tokens_platform_user ON oauth_tokens(platform_user_id);
CREATE INDEX idx_oauth_tokens_active ON oauth_tokens(is_active);
CREATE INDEX idx_oauth_tokens_expires ON oauth_tokens(expires_at);

-- Sessions indexes
CREATE INDEX idx_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_sessions_token_hash ON user_sessions(session_token_hash);
CREATE INDEX idx_sessions_expires ON user_sessions(expires_at);

-- API Usage indexes
CREATE INDEX idx_api_usage_user ON api_usage(user_id);
CREATE INDEX idx_api_usage_created ON api_usage(created_at);
CREATE INDEX idx_api_usage_endpoint ON api_usage(endpoint);

-- =====================================================
-- TRIGGERS FOR AUTO-UPDATES
-- =====================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE TRIGGER trg_users_updated
    BEFORE UPDATE ON users
    FOR EACH ROW
BEGIN
    :NEW.updated_at := CURRENT_TIMESTAMP;
END;
/

CREATE OR REPLACE TRIGGER trg_api_keys_updated
    BEFORE UPDATE ON api_keys
    FOR EACH ROW
BEGIN
    :NEW.updated_at := CURRENT_TIMESTAMP;
END;
/

CREATE OR REPLACE TRIGGER trg_oauth_apps_updated
    BEFORE UPDATE ON oauth_apps
    FOR EACH ROW
BEGIN
    :NEW.updated_at := CURRENT_TIMESTAMP;
END;
/

CREATE OR REPLACE TRIGGER trg_oauth_tokens_updated
    BEFORE UPDATE ON oauth_tokens
    FOR EACH ROW
BEGIN
    :NEW.updated_at := CURRENT_TIMESTAMP;
END;
/

CREATE OR REPLACE TRIGGER trg_subscription_usage_updated
    BEFORE UPDATE ON subscription_usage
    FOR EACH ROW
BEGIN
    :NEW.updated_at := CURRENT_TIMESTAMP;
END;
/
