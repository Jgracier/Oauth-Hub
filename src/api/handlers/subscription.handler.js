/**
 * Subscription Handler - Stripe Integration
 * Handles subscription management, billing, and access control
 */

import { BaseHandler } from './base.handler.js';
import { generateId } from '../../lib/utils/helpers.js';

export class SubscriptionHandler extends BaseHandler {
  constructor(env) {
    super(env);
    this.stripeApiKey = env.STRIPE_API_KEY;
  }

  /**
   * Create Stripe checkout session for subscription
   */
  async createCheckoutSession(email, priceId, successUrl, cancelUrl) {
    try {
      const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.stripeApiKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'payment_method_types[]': 'card',
          'line_items[0][price]': priceId,
          'line_items[0][quantity]': '1',
          'mode': 'subscription',
          'customer_email': email,
          'success_url': successUrl,
          'cancel_url': cancelUrl,
          'metadata[user_email]': email,
        }),
      });

      const session = await response.json();
      
      if (!response.ok) {
        throw new Error(session.error?.message || 'Failed to create checkout session');
      }

      return session;
    } catch (error) {
      console.error('Stripe checkout session creation failed:', error);
      throw error;
    }
  }

  /**
   * Handle Stripe webhook events
   */
  async handleWebhook(request) {
    try {
      const body = await request.text();
      const signature = request.headers.get('stripe-signature');
      
      // In production, verify webhook signature here
      const event = JSON.parse(body);

      switch (event.type) {
        case 'checkout.session.completed':
          await this.handleCheckoutCompleted(event.data.object);
          break;
        case 'invoice.payment_succeeded':
          await this.handlePaymentSucceeded(event.data.object);
          break;
        case 'invoice.payment_failed':
          await this.handlePaymentFailed(event.data.object);
          break;
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event.data.object);
          break;
        case 'customer.subscription.deleted':
          await this.handleSubscriptionCanceled(event.data.object);
          break;
      }

      return this.jsonResponse({ received: true });
    } catch (error) {
      console.error('Webhook handling failed:', error);
      return this.jsonResponse({ error: 'Webhook processing failed' }, 400);
    }
  }

  /**
   * Handle successful checkout completion
   */
  async handleCheckoutCompleted(session) {
    const userEmail = session.metadata?.user_email || session.customer_email;
    
    if (!userEmail) {
      console.error('No user email found in checkout session');
      return;
    }

    // Find user and update subscription status
    const userKey = await this.findUserByEmail(userEmail);
    if (!userKey) {
      console.error(`User not found for email: ${userEmail}`);
      return;
    }

    const userData = JSON.parse(await this.env.USERS.get(userKey));
    
    // Update user with subscription data
    userData.subscription = {
      status: 'active',
      stripeCustomerId: session.customer,
      stripeSubscriptionId: session.subscription,
      plan: 'pro', // Default to pro plan
      startDate: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await this.env.USERS.put(userKey, JSON.stringify(userData));
    
    console.log(`Subscription activated for user: ${userEmail}`);
  }

  /**
   * Handle successful payment
   */
  async handlePaymentSucceeded(invoice) {
    const customerId = invoice.customer;
    
    // Find user by Stripe customer ID
    const userKey = await this.findUserByStripeCustomerId(customerId);
    if (!userKey) {
      console.error(`User not found for Stripe customer: ${customerId}`);
      return;
    }

    const userData = JSON.parse(await this.env.USERS.get(userKey));
    
    // Update subscription status
    if (userData.subscription) {
      userData.subscription.status = 'active';
      userData.subscription.lastPayment = new Date().toISOString();
      userData.subscription.updatedAt = new Date().toISOString();
      
      await this.env.USERS.put(userKey, JSON.stringify(userData));
    }
  }

  /**
   * Handle failed payment
   */
  async handlePaymentFailed(invoice) {
    const customerId = invoice.customer;
    
    const userKey = await this.findUserByStripeCustomerId(customerId);
    if (!userKey) return;

    const userData = JSON.parse(await this.env.USERS.get(userKey));
    
    if (userData.subscription) {
      userData.subscription.status = 'past_due';
      userData.subscription.updatedAt = new Date().toISOString();
      
      await this.env.USERS.put(userKey, JSON.stringify(userData));
    }
  }

  /**
   * Handle subscription updates
   */
  async handleSubscriptionUpdated(subscription) {
    const customerId = subscription.customer;
    
    const userKey = await this.findUserByStripeCustomerId(customerId);
    if (!userKey) return;

    const userData = JSON.parse(await this.env.USERS.get(userKey));
    
    if (userData.subscription) {
      userData.subscription.status = subscription.status;
      userData.subscription.updatedAt = new Date().toISOString();
      
      await this.env.USERS.put(userKey, JSON.stringify(userData));
    }
  }

  /**
   * Handle subscription cancellation
   */
  async handleSubscriptionCanceled(subscription) {
    const customerId = subscription.customer;
    
    const userKey = await this.findUserByStripeCustomerId(customerId);
    if (!userKey) return;

    const userData = JSON.parse(await this.env.USERS.get(userKey));
    
    if (userData.subscription) {
      userData.subscription.status = 'canceled';
      userData.subscription.canceledAt = new Date().toISOString();
      userData.subscription.updatedAt = new Date().toISOString();
      
      await this.env.USERS.put(userKey, JSON.stringify(userData));
    }
  }

  /**
   * Apply promo code to user
   */
  async applyPromoCode(email, promoCode) {
    try {
      const userKey = await this.findUserByEmail(email);
      if (!userKey) {
        return this.jsonResponse({ error: 'User not found' }, 404);
      }

      const userData = JSON.parse(await this.env.USERS.get(userKey));
      
      // Check if promo code is valid
      const validPromoCodes = {
        'AUSTYN_FULL_ACCESS': {
          type: 'lifetime',
          plan: 'enterprise',
          description: 'Lifetime Enterprise Access'
        },
        'FOUNDER50': {
          type: 'discount',
          plan: 'pro',
          discount: 50,
          description: '50% Off Pro Plan'
        }
      };

      const promo = validPromoCodes[promoCode.toUpperCase()];
      if (!promo) {
        return this.jsonResponse({ error: 'Invalid promo code' }, 400);
      }

      // Apply promo code
      if (promo.type === 'lifetime') {
        userData.subscription = {
          status: 'active',
          plan: promo.plan,
          type: 'lifetime',
          promoCode: promoCode.toUpperCase(),
          startDate: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          description: promo.description
        };
      } else if (promo.type === 'discount') {
        userData.promoCode = {
          code: promoCode.toUpperCase(),
          discount: promo.discount,
          plan: promo.plan,
          appliedAt: new Date().toISOString()
        };
      }

      await this.env.USERS.put(userKey, JSON.stringify(userData));

      return this.jsonResponse({
        success: true,
        message: `Promo code applied: ${promo.description}`,
        subscription: userData.subscription || userData.promoCode
      });

    } catch (error) {
      console.error('Promo code application failed:', error);
      return this.jsonResponse({ error: 'Failed to apply promo code' }, 500);
    }
  }

  /**
   * Get user subscription status
   */
  async getSubscriptionStatus(email) {
    try {
      const userKey = await this.findUserByEmail(email);
      if (!userKey) {
        return this.jsonResponse({ error: 'User not found' }, 404);
      }

      const userData = JSON.parse(await this.env.USERS.get(userKey));
      
      const subscription = userData.subscription || null;
      const promoCode = userData.promoCode || null;

      return this.jsonResponse({
        success: true,
        subscription,
        promoCode,
        hasAccess: this.checkUserAccess(userData),
        plan: subscription?.plan || promoCode?.plan || 'free'
      });

    } catch (error) {
      console.error('Get subscription status failed:', error);
      return this.jsonResponse({ error: 'Failed to get subscription status' }, 500);
    }
  }

  /**
   * Check if user has access to features
   */
  checkUserAccess(userData) {
    // Check for lifetime access
    if (userData.subscription?.type === 'lifetime') {
      return true;
    }

    // Check for active subscription
    if (userData.subscription?.status === 'active') {
      return true;
    }

    // Check for valid promo code
    if (userData.promoCode) {
      return true;
    }

    return false;
  }

  /**
   * Get subscription plans
   */
  async getPlans() {
    const plans = [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        interval: 'month',
        features: [
          '5 API Keys',
          '3 OAuth Apps',
          '1,000 API Calls/month',
          'Basic Support'
        ],
        stripePriceId: null
      },
      {
        id: 'pro',
        name: 'Pro',
        price: 29,
        interval: 'month',
        features: [
          'Unlimited API Keys',
          'Unlimited OAuth Apps',
          '100,000 API Calls/month',
          'Priority Support',
          'Advanced Analytics',
          'Custom Branding'
        ],
        stripePriceId: 'price_1S4b9PLQrmO12AFI1qftfrGO'
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: 99,
        interval: 'month',
        features: [
          'Everything in Pro',
          'Unlimited API Calls',
          'White-label Solution',
          'Dedicated Support',
          'Custom Integrations',
          'SLA Guarantee'
        ],
        stripePriceId: 'price_1S4b9QLQrmO12AFIUmtGwLGs'
      }
    ];

    return this.jsonResponse({ success: true, plans });
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
   * Find user by Stripe customer ID
   */
  async findUserByStripeCustomerId(customerId) {
    const keys = await this.env.USERS.list();
    
    for (const keyInfo of keys.keys) {
      const userData = JSON.parse(await this.env.USERS.get(keyInfo.name));
      if (userData.subscription?.stripeCustomerId === customerId) {
        return keyInfo.name;
      }
    }
    
    return null;
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(email) {
    try {
      const userKey = await this.findUserByEmail(email);
      if (!userKey) {
        return this.jsonResponse({ error: 'User not found' }, 404);
      }

      const userData = JSON.parse(await this.env.USERS.get(userKey));
      
      if (!userData.subscription?.stripeSubscriptionId) {
        return this.jsonResponse({ error: 'No active subscription found' }, 400);
      }

      // Cancel subscription in Stripe
      const response = await fetch(`https://api.stripe.com/v1/subscriptions/${userData.subscription.stripeSubscriptionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.stripeApiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription in Stripe');
      }

      // Update user data
      userData.subscription.status = 'canceled';
      userData.subscription.canceledAt = new Date().toISOString();
      userData.subscription.updatedAt = new Date().toISOString();

      await this.env.USERS.put(userKey, JSON.stringify(userData));

      return this.jsonResponse({
        success: true,
        message: 'Subscription canceled successfully'
      });

    } catch (error) {
      console.error('Cancel subscription failed:', error);
      return this.jsonResponse({ error: 'Failed to cancel subscription' }, 500);
    }
  }
}
