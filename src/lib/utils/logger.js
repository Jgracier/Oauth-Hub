// =============================================================================
// 📝 LOGGER - Centralized logging with error tracking
// =============================================================================

export class Logger {
  constructor(context = 'App', env = null) {
    this.context = context;
    this.env = env;
  }

  /**
   * Log levels for different types of messages
   */
  static LEVELS = {
    ERROR: 'ERROR',
    WARN: 'WARN',
    INFO: 'INFO',
    DEBUG: 'DEBUG'
  };

  /**
   * Create structured log entry
   */
  createLogEntry(level, message, data = {}, error = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      context: this.context,
      message,
      data,
      ...(error && {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
          cause: error.cause
        }
      })
    };

    return logEntry;
  }

  /**
   * Log error with full context
   */
  error(message, data = {}, error = null) {
    const logEntry = this.createLogEntry(Logger.LEVELS.ERROR, message, data, error);
    console.error(`[${this.context}] ERROR:`, JSON.stringify(logEntry, null, 2));
    
    // Store error in analytics if env is available
    if (this.env) {
      this.trackError(logEntry).catch(err => 
        console.error('Failed to track error:', err)
      );
    }
    
    return logEntry;
  }

  /**
   * Log warning
   */
  warn(message, data = {}) {
    const logEntry = this.createLogEntry(Logger.LEVELS.WARN, message, data);
    console.warn(`[${this.context}] WARN:`, JSON.stringify(logEntry, null, 2));
    return logEntry;
  }

  /**
   * Log info
   */
  info(message, data = {}) {
    const logEntry = this.createLogEntry(Logger.LEVELS.INFO, message, data);
    console.log(`[${this.context}] INFO:`, JSON.stringify(logEntry, null, 2));
    return logEntry;
  }

  /**
   * Log debug (only in development)
   */
  debug(message, data = {}) {
    const logEntry = this.createLogEntry(Logger.LEVELS.DEBUG, message, data);
    console.debug(`[${this.context}] DEBUG:`, JSON.stringify(logEntry, null, 2));
    return logEntry;
  }

  /**
   * Track error in analytics for monitoring
   */
  async trackError(logEntry) {
    if (!this.env?.ANALYTICS) return;

    try {
      const errorKey = `error:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
      await this.env.ANALYTICS.put(errorKey, JSON.stringify({
        ...logEntry,
        errorId: errorKey,
        userAgent: globalThis.navigator?.userAgent || 'Unknown',
        url: globalThis.location?.href || 'Unknown'
      }));
    } catch (err) {
      console.error('Failed to store error analytics:', err);
    }
  }

  /**
   * Create child logger with additional context
   */
  child(additionalContext) {
    return new Logger(`${this.context}:${additionalContext}`, this.env);
  }

  /**
   * Log API request/response for debugging
   */
  logApiCall(method, path, statusCode, duration, data = {}) {
    const level = statusCode >= 400 ? Logger.LEVELS.ERROR : Logger.LEVELS.INFO;
    const message = `${method} ${path} - ${statusCode} (${duration}ms)`;
    
    if (level === Logger.LEVELS.ERROR) {
      this.error(message, { method, path, statusCode, duration, ...data });
    } else {
      this.info(message, { method, path, statusCode, duration, ...data });
    }
  }

  /**
   * Log performance metrics
   */
  logPerformance(operation, duration, data = {}) {
    const level = duration > 5000 ? Logger.LEVELS.WARN : Logger.LEVELS.INFO;
    const message = `Performance: ${operation} took ${duration}ms`;
    
    if (level === Logger.LEVELS.WARN) {
      this.warn(message, { operation, duration, ...data });
    } else {
      this.info(message, { operation, duration, ...data });
    }
  }
}
