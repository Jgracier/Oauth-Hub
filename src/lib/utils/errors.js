// =============================================================================
// ❌ CUSTOM ERRORS - Typed error classes for better error handling
// =============================================================================

/**
 * Base application error class
 */
export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details = {}) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
    this.isOperational = true; // Distinguishes operational errors from programming errors
    
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      code: this.code,
      details: this.details,
      timestamp: this.timestamp,
      stack: this.stack
    };
  }
}

/**
 * Authentication related errors
 */
export class AuthError extends AppError {
  constructor(message, code = 'AUTH_FAILED', details = {}) {
    super(message, 401, code, details);
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor(details = {}) {
    super('Invalid credentials provided', 'INVALID_CREDENTIALS', details);
  }
}

export class SessionExpiredError extends AuthError {
  constructor(details = {}) {
    super('Session has expired', 'SESSION_EXPIRED', details);
  }
}

export class UnauthorizedError extends AuthError {
  constructor(message = 'Unauthorized access', details = {}) {
    super(message, 'UNAUTHORIZED', details);
    this.statusCode = 403;
  }
}

/**
 * Validation related errors
 */
export class ValidationError extends AppError {
  constructor(message, field = null, value = null, details = {}) {
    super(message, 400, 'VALIDATION_ERROR', {
      field,
      value,
      ...details
    });
  }
}

export class InvalidEmailError extends ValidationError {
  constructor(email, details = {}) {
    super('Invalid email format', 'email', email, details);
    this.code = 'INVALID_EMAIL';
  }
}

export class MissingFieldError extends ValidationError {
  constructor(field, details = {}) {
    super(`Missing required field: ${field}`, field, null, details);
    this.code = 'MISSING_FIELD';
  }
}

/**
 * Resource related errors
 */
export class ResourceError extends AppError {
  constructor(message, statusCode, code, resourceType, resourceId, details = {}) {
    super(message, statusCode, code, {
      resourceType,
      resourceId,
      ...details
    });
  }
}

export class NotFoundError extends ResourceError {
  constructor(resourceType, resourceId, details = {}) {
    super(
      `${resourceType} not found`,
      404,
      'RESOURCE_NOT_FOUND',
      resourceType,
      resourceId,
      details
    );
  }
}

export class AlreadyExistsError extends ResourceError {
  constructor(resourceType, resourceId, details = {}) {
    super(
      `${resourceType} already exists`,
      409,
      'RESOURCE_EXISTS',
      resourceType,
      resourceId,
      details
    );
  }
}

/**
 * OAuth related errors
 */
export class OAuthError extends AppError {
  constructor(message, platform, code = 'OAUTH_ERROR', details = {}) {
    super(message, 400, code, { platform, ...details });
  }
}

export class InvalidOAuthCodeError extends OAuthError {
  constructor(platform, details = {}) {
    super('Invalid or expired OAuth authorization code', platform, 'INVALID_OAUTH_CODE', details);
  }
}

export class OAuthConfigError extends OAuthError {
  constructor(platform, details = {}) {
    super(`OAuth app not configured for ${platform}`, platform, 'OAUTH_NOT_CONFIGURED', details);
    this.statusCode = 424; // Failed Dependency
  }
}

export class TokenExchangeError extends OAuthError {
  constructor(platform, originalError, details = {}) {
    super(`Failed to exchange OAuth code for tokens`, platform, 'TOKEN_EXCHANGE_FAILED', {
      originalError: originalError?.message,
      ...details
    });
  }
}

/**
 * External API related errors
 */
export class ExternalApiError extends AppError {
  constructor(message, service, statusCode = 502, details = {}) {
    super(message, statusCode, 'EXTERNAL_API_ERROR', { service, ...details });
  }
}

export class RateLimitError extends ExternalApiError {
  constructor(service, retryAfter = null, details = {}) {
    super(`Rate limit exceeded for ${service}`, service, 429, {
      retryAfter,
      ...details
    });
  }
}

/**
 * Database/Storage related errors
 */
export class StorageError extends AppError {
  constructor(message, operation, key = null, details = {}) {
    super(message, 500, 'STORAGE_ERROR', { operation, key, ...details });
  }
}

export class StorageTimeoutError extends StorageError {
  constructor(operation, key, timeout, details = {}) {
    super(
      `Storage operation timed out after ${timeout}ms`,
      operation,
      key,
      { timeout, ...details }
    );
  }
}

/**
 * Configuration related errors
 */
export class ConfigError extends AppError {
  constructor(message, configKey, details = {}) {
    super(message, 500, 'CONFIG_ERROR', { configKey, ...details });
  }
}

export class MissingConfigError extends ConfigError {
  constructor(configKey, details = {}) {
    super(`Missing required configuration: ${configKey}`, configKey, details);
    this.code = 'MISSING_CONFIG';
  }
}

/**
 * Error factory for creating appropriate error types
 */
export class ErrorFactory {
  static createFromHttpStatus(statusCode, message, details = {}) {
    switch (statusCode) {
      case 400:
        return new ValidationError(message, null, null, details);
      case 401:
        return new AuthError(message, 'AUTH_FAILED', details);
      case 403:
        return new UnauthorizedError(message, details);
      case 404:
        return new NotFoundError('Resource', 'unknown', details);
      case 409:
        return new AlreadyExistsError('Resource', 'unknown', details);
      case 429:
        return new RateLimitError('Unknown', null, details);
      default:
        return new AppError(message, statusCode, 'HTTP_ERROR', details);
    }
  }

  static createFromOAuthError(error, platform) {
    if (error.message?.includes('invalid_grant')) {
      return new InvalidOAuthCodeError(platform, { originalError: error.message });
    }
    if (error.message?.includes('unauthorized_client')) {
      return new OAuthConfigError(platform, { originalError: error.message });
    }
    return new OAuthError(error.message, platform, 'OAUTH_ERROR', { originalError: error.message });
  }
}

/**
 * Check if error is operational (expected) vs programming error
 */
export function isOperationalError(error) {
  if (error instanceof AppError) {
    return error.isOperational;
  }
  return false;
}

/**
 * Safe error serialization for logging
 */
export function serializeError(error) {
  if (error instanceof AppError) {
    return error.toJSON();
  }
  
  return {
    name: error.name || 'Error',
    message: error.message || 'Unknown error',
    stack: error.stack,
    statusCode: error.statusCode || 500,
    code: error.code || 'UNKNOWN_ERROR',
    timestamp: new Date().toISOString()
  };
}
