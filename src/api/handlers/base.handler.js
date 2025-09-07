// =============================================================================
// 🏗️ BASE HANDLER - Common functionality for all handlers
// =============================================================================

import { jsonResponse, htmlResponse } from '../../lib/utils/helpers.js';

export class BaseHandler {
  constructor(env) {
    this.env = env;
  }

  /**
   * Validate email parameter from request
   */
  validateEmailParam(request) {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    
    if (!email) {
      throw new Error('Email parameter required');
    }
    
    return email;
  }

  /**
   * Search KV store for user-specific records
   */
  async searchUserRecords(kvStore, keyFilter, email) {
    const { keys } = await kvStore.list();
    const userRecords = [];
    
    for (const keyInfo of keys) {
      if (keyFilter(keyInfo.name, email)) {
        const recordData = await kvStore.get(keyInfo.name);
        if (recordData) {
          const parsed = JSON.parse(recordData);
          if (this.isUserRecord(parsed, email)) {
            userRecords.push(parsed);
          }
        }
      }
    }
    
    return userRecords;
  }

  /**
   * Check if a record belongs to the user
   */
  isUserRecord(record, email) {
    return record.email === email || record.userEmail === email;
  }

  /**
   * Handle errors consistently
   */
  handleError(error, operation, corsHeaders) {
    console.error(`${operation} failed:`, error.message);
    return jsonResponse({ 
      error: `Failed to ${operation.toLowerCase()}`,
      message: error.message
    }, 500, corsHeaders);
  }

  /**
   * Success response helper
   */
  successResponse(data, corsHeaders) {
    return jsonResponse({
      success: true,
      ...data
    }, 200, corsHeaders);
  }

  /**
   * JSON response helper
   */
  jsonResponse(data, status = 200, headers = {}) {
    return jsonResponse(data, status, headers);
  }

  /**
   * HTML response helper
   */
  htmlResponse(html, status = 200, headers = {}) {
    return htmlResponse(html, status, headers);
  }
}
