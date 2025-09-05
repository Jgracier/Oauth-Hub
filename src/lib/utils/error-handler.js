// =============================================================================
// 🛡️ GLOBAL ERROR HANDLER - Centralized error handling and response formatting
// =============================================================================

import { jsonResponse } from './helpers.js';
import { Logger } from './logger.js';
import { 
  AppError, 
  ValidationError, 
  AuthError, 
  NotFoundError,
  AlreadyExistsError,
  OAuthError,
  ExternalApiError,
  StorageError,
  isOperationalError,
  serializeError
} from './errors.js';

export class GlobalErrorHandler {
  constructor(env) {
    this.env = env;
    this.logger = new Logger('GlobalErrorHandler', env);
  }

  /**
   * Handle errors and return appropriate HTTP response
   */
  async handleError(error, request = null, corsHeaders = {}) {
    const startTime = Date.now();
    
    try {
      // Log the error with context
      const context = this.buildErrorContext(error, request);
      
      if (isOperationalError(error)) {
        this.logger.warn('Operational error occurred', context, error);
      } else {
        this.logger.error('Unexpected error occurred', context, error);
      }

      // Track error metrics
      await this.trackErrorMetrics(error, context);

      // Return appropriate response
      return this.createErrorResponse(error, corsHeaders);
      
    } catch (handlingError) {
      // If error handling itself fails, log and return generic error
      this.logger.error('Error handler failed', {
        originalError: serializeError(error),
        handlingError: serializeError(handlingError),
        duration: Date.now() - startTime
      });
      
      return jsonResponse({
        error: 'Internal server error',
        message: 'An unexpected error occurred'
      }, 500, corsHeaders);
    }
  }

  /**
   * Build error context for logging
   */
  buildErrorContext(error, request) {
    const context = {
      errorType: error.constructor.name,
      statusCode: error.statusCode || 500,
      code: error.code || 'UNKNOWN_ERROR',
      timestamp: new Date().toISOString()
    };

    if (request) {
      const url = new URL(request.url);
      context.request = {
        method: request.method,
        path: url.pathname,
        userAgent: request.headers.get('User-Agent'),
        ip: request.headers.get('CF-Connecting-IP') || 
            request.headers.get('X-Forwarded-For') || 
            'unknown'
      };
    }

    if (error instanceof AppError) {
      context.details = error.details;
    }

    return context;
  }

  /**
   * Create appropriate HTTP error response
   */
  createErrorResponse(error, corsHeaders) {
    // Handle known error types
    if (error instanceof ValidationError) {
      return jsonResponse({
        error: error.message,
        code: error.code,
        field: error.details.field,
        value: error.details.value
      }, error.statusCode, corsHeaders);
    }

    if (error instanceof AuthError) {
      return jsonResponse({
        error: error.message,
        code: error.code
      }, error.statusCode, corsHeaders);
    }

    if (error instanceof NotFoundError) {
      return jsonResponse({
        error: error.message,
        code: error.code,
        resourceType: error.details.resourceType,
        resourceId: error.details.resourceId
      }, error.statusCode, corsHeaders);
    }

    if (error instanceof AlreadyExistsError) {
      return jsonResponse({
        error: error.message,
        code: error.code,
        resourceType: error.details.resourceType
      }, error.statusCode, corsHeaders);
    }

    if (error instanceof OAuthError) {
      return jsonResponse({
        error: error.message,
        code: error.code,
        platform: error.details.platform
      }, error.statusCode, corsHeaders);
    }

    if (error instanceof ExternalApiError) {
      return jsonResponse({
        error: 'External service error',
        code: error.code,
        service: error.details.service,
        retryAfter: error.details.retryAfter
      }, error.statusCode, corsHeaders);
    }

    if (error instanceof StorageError) {
      return jsonResponse({
        error: 'Data storage error',
        code: error.code,
        operation: error.details.operation
      }, error.statusCode, corsHeaders);
    }

    if (error instanceof AppError) {
      return jsonResponse({
        error: error.message,
        code: error.code
      }, error.statusCode, corsHeaders);
    }

    // Handle unknown errors
    return jsonResponse({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred'
    }, 500, corsHeaders);
  }

  /**
   * Track error metrics for monitoring
   */
  async trackErrorMetrics(error, context) {
    if (!this.env?.ERROR_METRICS) return;

    try {
      const metricKey = `error_metric:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
      const metric = {
        timestamp: new Date().toISOString(),
        errorType: error.constructor.name,
        statusCode: error.statusCode || 500,
        code: error.code || 'UNKNOWN_ERROR',
        path: context.request?.path,
        method: context.request?.method,
        userAgent: context.request?.userAgent,
        ip: context.request?.ip,
        isOperational: isOperationalError(error)
      };

      await this.env.ERROR_METRICS.put(metricKey, JSON.stringify(metric), {
        expirationTtl: 86400 * 30 // Keep for 30 days
      });
    } catch (trackingError) {
      this.logger.warn('Failed to track error metrics', {
        trackingError: serializeError(trackingError)
      });
    }
  }

  /**
   * Handle critical errors that should trigger alerts
   */
  async handleCriticalError(error, context) {
    this.logger.error('CRITICAL ERROR DETECTED', context, error);
    
    // In a production environment, you might want to:
    // - Send alerts to monitoring services
    // - Trigger incident response
    // - Scale up resources if needed
    
    try {
      if (this.env?.CRITICAL_ALERTS) {
        await this.env.CRITICAL_ALERTS.put(
          `critical:${Date.now()}`,
          JSON.stringify({
            error: serializeError(error),
            context,
            timestamp: new Date().toISOString()
          })
        );
      }
    } catch (alertError) {
      this.logger.error('Failed to send critical error alert', {
        alertError: serializeError(alertError)
      });
    }
  }

  /**
   * Middleware wrapper for request handlers
   */
  wrapHandler(handler) {
    return async (request, corsHeaders) => {
      try {
        return await handler(request, corsHeaders);
      } catch (error) {
        return await this.handleError(error, request, corsHeaders);
      }
    };
  }
}
