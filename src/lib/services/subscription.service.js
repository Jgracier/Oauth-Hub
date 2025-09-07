/**
 * Subscription Service
 * Business logic for subscription management and access control
 */

export class SubscriptionService {
  constructor(env) {
    this.env = env;
  }

  /**
   * Check if user has access to specific features
   */
  async checkFeatureAccess(email, feature) {
    const userKey = await this.findUserByEmail(email);
    if (!userKey) return false;

    const userData = JSON.parse(await this.env.USERS.get(userKey));
    return this.hasFeatureAccess(userData, feature);
  }

  /**
   * Get user's current plan and limits
   */
  async getUserPlanLimits(email) {
    const userKey = await this.findUserByEmail(email);
    if (!userKey) {
      return this.getFreePlanLimits();
    }

    const userData = JSON.parse(await this.env.USERS.get(userKey));
    const plan = this.getUserPlan(userData);
    
    return this.getPlanLimits(plan);
  }

  /**
   * Check if user can create more API keys
   */
  async canCreateApiKey(email) {
    const limits = await this.getUserPlanLimits(email);
    
    // Count current API keys
    const keys = await this.env.API_KEYS.list();
    const userKeys = keys.keys.filter(key => key.name.includes(email));
    
    return userKeys.length < limits.apiKeys || limits.apiKeys === -1; // -1 = unlimited
  }

  /**
   * Check if user can create more OAuth apps
   */
  async canCreateOAuthApp(email) {
    const limits = await this.getUserPlanLimits(email);
    
    // Count current OAuth apps
    const keys = await this.env.API_KEYS.list();
    const userApps = keys.keys.filter(key => 
      key.name.startsWith('app-') && key.name.includes(email)
    );
    
    return userApps.length < limits.oauthApps || limits.oauthApps === -1;
  }

  /**
   * Check API call limits
   */
  async checkApiCallLimit(email) {
    const limits = await this.getUserPlanLimits(email);
    
    if (limits.apiCalls === -1) return true; // Unlimited
    
    // Get current month's API call count
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const usageKey = `usage-${email}-${currentMonth}`;
    
    const usage = await this.env.API_KEYS.get(usageKey);
    const currentCalls = usage ? JSON.parse(usage).calls : 0;
    
    return currentCalls < limits.apiCalls;
  }

  /**
   * Increment API call count
   */
  async incrementApiCallCount(email) {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const usageKey = `usage-${email}-${currentMonth}`;
    
    const usage = await this.env.API_KEYS.get(usageKey);
    const currentUsage = usage ? JSON.parse(usage) : { calls: 0, month: currentMonth };
    
    currentUsage.calls += 1;
    currentUsage.lastCall = new Date().toISOString();
    
    await this.env.API_KEYS.put(usageKey, JSON.stringify(currentUsage));
    
    return currentUsage.calls;
  }

  /**
   * Get user's current plan
   */
  getUserPlan(userData) {
    // Check for lifetime access (like Austyn)
    if (userData.subscription?.type === 'lifetime') {
      return userData.subscription.plan || 'enterprise';
    }

    // Check for active subscription
    if (userData.subscription?.status === 'active') {
      return userData.subscription.plan || 'pro';
    }

    // Check for promo code
    if (userData.promoCode) {
      return userData.promoCode.plan || 'pro';
    }

    return 'free';
  }

  /**
   * Check if user has access to specific feature
   */
  hasFeatureAccess(userData, feature) {
    const plan = this.getUserPlan(userData);
    const limits = this.getPlanLimits(plan);
    
    return limits.features.includes(feature);
  }

  /**
   * Get plan limits and features
   */
  getPlanLimits(plan) {
    const plans = {
      free: {
        apiKeys: 5,
        oauthApps: 3,
        apiCalls: 1000,
        features: [
          'basic_support',
          'standard_analytics'
        ]
      },
      pro: {
        apiKeys: -1, // Unlimited
        oauthApps: -1, // Unlimited
        apiCalls: 100000,
        features: [
          'basic_support',
          'standard_analytics',
          'priority_support',
          'advanced_analytics',
          'custom_branding',
          'webhook_notifications'
        ]
      },
      enterprise: {
        apiKeys: -1, // Unlimited
        oauthApps: -1, // Unlimited
        apiCalls: -1, // Unlimited
        features: [
          'basic_support',
          'standard_analytics',
          'priority_support',
          'advanced_analytics',
          'custom_branding',
          'webhook_notifications',
          'white_label',
          'dedicated_support',
          'custom_integrations',
          'sla_guarantee',
          'priority_platform_requests'
        ]
      }
    };

    return plans[plan] || plans.free;
  }

  /**
   * Get free plan limits
   */
  getFreePlanLimits() {
    return this.getPlanLimits('free');
  }

  /**
   * Find user by email
   */
  async findUserByEmail(email) {
    const keys = await this.env.USERS.list();
    
    for (const keyInfo of keys.keys) {
      if (keyInfo.name.includes(email)) {
        return keyInfo.name;
      }
    }
    
    return null;
  }

  /**
   * Get usage statistics for user
   */
  async getUserUsage(email) {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const usageKey = `usage-${email}-${currentMonth}`;
    
    const usage = await this.env.API_KEYS.get(usageKey);
    const currentUsage = usage ? JSON.parse(usage) : { calls: 0, month: currentMonth };
    
    // Get API keys count
    const keys = await this.env.API_KEYS.list();
    const userKeys = keys.keys.filter(key => key.name.includes(email) && !key.name.startsWith('usage-'));
    const apiKeysCount = userKeys.length;
    
    // Get OAuth apps count
    const userApps = keys.keys.filter(key => 
      key.name.startsWith('app-') && key.name.includes(email)
    );
    const oauthAppsCount = userApps.length;
    
    const limits = await this.getUserPlanLimits(email);
    
    return {
      apiCalls: {
        current: currentUsage.calls,
        limit: limits.apiCalls,
        percentage: limits.apiCalls === -1 ? 0 : (currentUsage.calls / limits.apiCalls) * 100
      },
      apiKeys: {
        current: apiKeysCount,
        limit: limits.apiKeys,
        percentage: limits.apiKeys === -1 ? 0 : (apiKeysCount / limits.apiKeys) * 100
      },
      oauthApps: {
        current: oauthAppsCount,
        limit: limits.oauthApps,
        percentage: limits.oauthApps === -1 ? 0 : (oauthAppsCount / limits.oauthApps) * 100
      }
    };
  }

  /**
   * Apply Austyn's special access
   */
  async giveAustynFullAccess() {
    try {
      // Find Austyn's user record
      const keys = await this.env.USERS.list();
      let austynKey = null;
      
      for (const keyInfo of keys.keys) {
        const userData = JSON.parse(await this.env.USERS.get(keyInfo.name));
        if (userData.name?.toLowerCase().includes('austyn') || 
            userData.firstName?.toLowerCase().includes('austyn') ||
            userData.email?.toLowerCase().includes('austyn')) {
          austynKey = keyInfo.name;
          break;
        }
      }

      if (!austynKey) {
        console.log('Austyn user not found in KV storage');
        return { success: false, message: 'Austyn user not found' };
      }

      const userData = JSON.parse(await this.env.USERS.get(austynKey));
      
      // Give Austyn lifetime enterprise access
      userData.subscription = {
        status: 'active',
        plan: 'enterprise',
        type: 'lifetime',
        promoCode: 'AUSTYN_FULL_ACCESS',
        startDate: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        description: 'Lifetime Enterprise Access - Special Grant',
        grantedBy: 'system',
        grantReason: 'Full access privilege'
      };

      await this.env.USERS.put(austynKey, JSON.stringify(userData));

      console.log(`Granted lifetime enterprise access to Austyn (${userData.email})`);
      
      return { 
        success: true, 
        message: `Lifetime enterprise access granted to ${userData.name} (${userData.email})`,
        userKey: austynKey,
        subscription: userData.subscription
      };

    } catch (error) {
      console.error('Failed to grant Austyn full access:', error);
      return { success: false, message: 'Failed to grant access', error: error.message };
    }
  }
}
