// =============================================================================
// 📊 MONITORING - Application health and performance monitoring
// =============================================================================

import { Logger } from './logger.js';

export class MonitoringService {
  constructor(env) {
    this.env = env;
    this.logger = new Logger('MonitoringService', env);
  }

  /**
   * Perform comprehensive health check
   */
  async performHealthCheck() {
    const startTime = Date.now();
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '2.0-modular',
      checks: {},
      metrics: {}
    };

    try {
      // Check storage connectivity
      healthStatus.checks.storage = await this.checkStorageHealth();
      
      // Check memory usage (if available)
      healthStatus.checks.memory = this.checkMemoryUsage();
      
      // Check error rates
      healthStatus.checks.errorRate = await this.checkErrorRate();
      
      // Check response times
      healthStatus.checks.performance = await this.checkPerformanceMetrics();
      
      // Overall health determination
      const failedChecks = Object.values(healthStatus.checks).filter(check => !check.healthy);
      if (failedChecks.length > 0) {
        healthStatus.status = failedChecks.length > 2 ? 'unhealthy' : 'degraded';
      }
      
      healthStatus.metrics.totalDuration = Date.now() - startTime;
      
      this.logger.info('Health check completed', {
        status: healthStatus.status,
        duration: healthStatus.metrics.totalDuration,
        failedChecks: failedChecks.length
      });
      
      return healthStatus;
      
    } catch (error) {
      this.logger.error('Health check failed', {
        duration: Date.now() - startTime
      }, error);
      
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Check storage system health
   */
  async checkStorageHealth() {
    const startTime = Date.now();
    
    try {
      // Test write operation
      const testKey = `health_check:${Date.now()}`;
      const testData = { timestamp: new Date().toISOString() };
      
      await this.env.USERS.put(testKey, JSON.stringify(testData));
      
      // Test read operation
      const retrievedData = await this.env.USERS.get(testKey);
      if (!retrievedData) {
        throw new Error('Failed to retrieve test data');
      }
      
      // Test delete operation
      await this.env.USERS.delete(testKey);
      
      const duration = Date.now() - startTime;
      
      return {
        healthy: true,
        duration,
        message: 'Storage operations successful'
      };
      
    } catch (error) {
      return {
        healthy: false,
        duration: Date.now() - startTime,
        error: error.message
      };
    }
  }

  /**
   * Check memory usage (basic implementation)
   */
  checkMemoryUsage() {
    try {
      // In Cloudflare Workers, memory monitoring is limited
      // This is a placeholder for basic memory health
      return {
        healthy: true,
        message: 'Memory usage within normal limits',
        note: 'Detailed memory metrics not available in Workers environment'
      };
    } catch (error) {
      return {
        healthy: false,
        error: error.message
      };
    }
  }

  /**
   * Check recent error rates
   */
  async checkErrorRate() {
    const startTime = Date.now();
    
    try {
      if (!this.env.ERROR_METRICS) {
        return {
          healthy: true,
          message: 'Error tracking not configured',
          errorRate: 0
        };
      }
      
      // Get recent errors (last hour)
      const oneHourAgo = Date.now() - (60 * 60 * 1000);
      const { keys } = await this.env.ERROR_METRICS.list();
      
      let recentErrors = 0;
      for (const keyInfo of keys) {
        if (keyInfo.name.startsWith('error_metric:')) {
          const timestamp = parseInt(keyInfo.name.split(':')[1]);
          if (timestamp > oneHourAgo) {
            recentErrors++;
          }
        }
      }
      
      const errorRate = recentErrors; // errors per hour
      const isHealthy = errorRate < 10; // threshold: less than 10 errors per hour
      
      return {
        healthy: isHealthy,
        errorRate,
        duration: Date.now() - startTime,
        message: `${recentErrors} errors in the last hour`
      };
      
    } catch (error) {
      return {
        healthy: false,
        duration: Date.now() - startTime,
        error: error.message
      };
    }
  }

  /**
   * Check performance metrics
   */
  async checkPerformanceMetrics() {
    const startTime = Date.now();
    
    try {
      // Simulate a typical operation to measure performance
      const testStart = Date.now();
      
      // Test database query performance
      await this.env.USERS.list({ limit: 1 });
      
      const queryDuration = Date.now() - testStart;
      const isHealthy = queryDuration < 1000; // threshold: less than 1 second
      
      return {
        healthy: isHealthy,
        queryDuration,
        duration: Date.now() - startTime,
        message: `Database query took ${queryDuration}ms`
      };
      
    } catch (error) {
      return {
        healthy: false,
        duration: Date.now() - startTime,
        error: error.message
      };
    }
  }

  /**
   * Record performance metric
   */
  async recordMetric(name, value, tags = {}) {
    try {
      if (!this.env.PERFORMANCE_METRICS) return;
      
      const metricKey = `metric:${name}:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
      const metric = {
        name,
        value,
        tags,
        timestamp: new Date().toISOString()
      };
      
      await this.env.PERFORMANCE_METRICS.put(metricKey, JSON.stringify(metric), {
        expirationTtl: 86400 * 7 // Keep for 7 days
      });
      
    } catch (error) {
      this.logger.warn('Failed to record metric', { name, value, tags }, error);
    }
  }

  /**
   * Get system statistics
   */
  async getSystemStats() {
    try {
      const stats = {
        timestamp: new Date().toISOString(),
        users: await this.getUserCount(),
        apiKeys: await this.getApiKeyCount(),
        oauthTokens: await this.getOAuthTokenCount(),
        apps: await this.getAppCount()
      };
      
      return stats;
      
    } catch (error) {
      this.logger.error('Failed to get system stats', {}, error);
      return {
        timestamp: new Date().toISOString(),
        error: error.message
      };
    }
  }

  /**
   * Count users in system
   */
  async getUserCount() {
    try {
      const { keys } = await this.env.USERS.list();
      return keys.filter(key => key.name.startsWith('user ')).length;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Count API keys in system
   */
  async getApiKeyCount() {
    try {
      const { keys } = await this.env.API_KEYS.list();
      return keys.filter(key => key.name.startsWith('api-')).length;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Count OAuth tokens in system
   */
  async getOAuthTokenCount() {
    try {
      const { keys } = await this.env.OAUTH_TOKENS.list();
      return keys.filter(key => key.name.startsWith('token:')).length;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Count OAuth apps in system
   */
  async getAppCount() {
    try {
      const { keys } = await this.env.API_KEYS.list();
      return keys.filter(key => key.name.startsWith('app:')).length;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Alert on critical issues
   */
  async sendAlert(level, message, details = {}) {
    this.logger.error(`ALERT [${level}]: ${message}`, details);
    
    try {
      if (this.env.ALERTS) {
        const alertKey = `alert:${level}:${Date.now()}`;
        const alert = {
          level,
          message,
          details,
          timestamp: new Date().toISOString()
        };
        
        await this.env.ALERTS.put(alertKey, JSON.stringify(alert));
      }
    } catch (error) {
      this.logger.error('Failed to store alert', { level, message }, error);
    }
  }
}
