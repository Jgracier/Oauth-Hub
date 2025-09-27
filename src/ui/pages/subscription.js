/**
 * Subscription Management Page
 * Modern UI for managing subscriptions, billing, and plan upgrades
 */

import { MODERN_CSS, MODERN_ICONS, THEME_PREVENTION_SCRIPT } from '../styles.js';
import { getModernLayout, getModernScripts } from '../navigation.js';
import { getAuthManagerScript } from '../../lib/auth/auth-manager.js';

export function getModernSubscriptionPage() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Subscription - OAuth Hub</title>
    
    ${THEME_PREVENTION_SCRIPT}
    
    <style>${MODERN_CSS}</style>
    <style>
        .subscription-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }

        .subscription-header {
            text-align: center;
            margin-bottom: 3rem;
        }

        .subscription-header h1 {
            font-size: 2.5rem;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 1rem;
        }

        .subscription-header p {
            font-size: 1.1rem;
            color: #94a3b8;
            max-width: 600px;
            margin: 0 auto;
        }

        .current-plan-card {
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            border: 1px solid #334155;
            border-radius: 16px;
            padding: 2rem;
            margin-bottom: 3rem;
            position: relative;
            overflow: hidden;
        }

        .current-plan-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4);
        }

        .plan-header {
            display: flex;
            justify-content: between;
            align-items: center;
            margin-bottom: 1.5rem;
        }

        .plan-info h2 {
            font-size: 1.5rem;
            font-weight: 600;
            color: #ffffff;
            margin-bottom: 0.5rem;
        }

        .plan-status {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            background: #059669;
            color: #ffffff;
            border-radius: 20px;
            font-size: 0.875rem;
            font-weight: 500;
        }

        .plan-status.inactive {
            background: #dc2626;
        }

        .plan-status.trial {
            background: #d97706;
        }

        .usage-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-top: 2rem;
        }

        .usage-card {
            background: #0f172a;
            border: 1px solid #1e293b;
            border-radius: 12px;
            padding: 1.5rem;
        }

        .usage-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }

        .usage-title {
            font-size: 0.875rem;
            font-weight: 500;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .usage-value {
            font-size: 1.5rem;
            font-weight: 700;
            color: #ffffff;
        }

        .usage-limit {
            font-size: 0.875rem;
            color: #64748b;
        }

        .usage-bar {
            width: 100%;
            height: 8px;
            background: #1e293b;
            border-radius: 4px;
            overflow: hidden;
            margin-top: 1rem;
        }

        .usage-progress {
            height: 100%;
            background: linear-gradient(90deg, #3b82f6, #06b6d4);
            border-radius: 4px;
            transition: width 0.3s ease;
        }

        .usage-progress.warning {
            background: linear-gradient(90deg, #f59e0b, #d97706);
        }

        .usage-progress.danger {
            background: linear-gradient(90deg, #ef4444, #dc2626);
        }

        .plans-section {
            margin-top: 4rem;
        }

        .plans-header {
            text-align: center;
            margin-bottom: 3rem;
        }

        .plans-header h2 {
            font-size: 2rem;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 1rem;
        }

        .plans-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }

        .plan-card {
            background: #1e293b;
            border: 1px solid #334155;
            border-radius: 16px;
            padding: 2rem;
            position: relative;
            transition: all 0.3s ease;
        }

        .plan-card:hover {
            border-color: #3b82f6;
            transform: translateY(-4px);
        }

        .plan-card.recommended {
            border-color: #3b82f6;
            background: linear-gradient(135deg, #1e293b 0%, #1e40af 100%);
        }

        .plan-card.recommended::before {
            content: 'Recommended';
            position: absolute;
            top: -1px;
            left: 50%;
            transform: translateX(-50%);
            background: #3b82f6;
            color: #ffffff;
            padding: 0.5rem 1rem;
            border-radius: 0 0 8px 8px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .plan-name {
            font-size: 1.25rem;
            font-weight: 600;
            color: #ffffff;
            margin-bottom: 0.5rem;
        }

        .plan-price {
            display: flex;
            align-items: baseline;
            gap: 0.5rem;
            margin-bottom: 1.5rem;
        }

        .plan-amount {
            font-size: 2.5rem;
            font-weight: 700;
            color: #ffffff;
        }

        .plan-currency {
            font-size: 1.25rem;
            color: #94a3b8;
        }

        .plan-interval {
            font-size: 0.875rem;
            color: #64748b;
        }

        .plan-features {
            list-style: none;
            padding: 0;
            margin: 0 0 2rem 0;
        }

        .plan-features li {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.5rem 0;
            color: #e2e8f0;
            font-size: 0.875rem;
        }

        .plan-features li::before {
            content: '${MODERN_ICONS.check}';
            color: #10b981;
            font-weight: 600;
        }

        .plan-button {
            width: 100%;
            padding: 0.875rem 1.5rem;
            background: #3b82f6;
            color: #ffffff;
            border: none;
            border-radius: 8px;
            font-size: 0.875rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .plan-button:hover {
            background: #2563eb;
            transform: translateY(-1px);
        }

        .plan-button:disabled {
            background: #374151;
            color: #6b7280;
            cursor: not-allowed;
            transform: none;
        }

        .plan-button.current {
            background: #059669;
        }

        .plan-button.current:hover {
            background: #047857;
        }

        .promo-section {
            background: #0f172a;
            border: 1px solid #1e293b;
            border-radius: 16px;
            padding: 2rem;
            margin-top: 3rem;
            text-align: center;
        }

        .promo-header {
            font-size: 1.25rem;
            font-weight: 600;
            color: #ffffff;
            margin-bottom: 1rem;
        }

        .promo-form {
            display: flex;
            gap: 1rem;
            max-width: 400px;
            margin: 0 auto;
        }

        .promo-input {
            flex: 1;
            padding: 0.875rem 1rem;
            background: #1e293b;
            border: 1px solid #334155;
            border-radius: 8px;
            color: #ffffff;
            font-size: 0.875rem;
        }

        .promo-input:focus {
            outline: none;
            border-color: #3b82f6;
        }

        .promo-button {
            padding: 0.875rem 1.5rem;
            background: #8b5cf6;
            color: #ffffff;
            border: none;
            border-radius: 8px;
            font-size: 0.875rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .promo-button:hover {
            background: #7c3aed;
        }

        .billing-section {
            margin-top: 4rem;
        }

        .billing-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
        }

        .billing-header h2 {
            font-size: 1.5rem;
            font-weight: 600;
            color: #ffffff;
        }

        .cancel-button {
            padding: 0.5rem 1rem;
            background: transparent;
            color: #ef4444;
            border: 1px solid #ef4444;
            border-radius: 6px;
            font-size: 0.875rem;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .cancel-button:hover {
            background: #ef4444;
            color: #ffffff;
        }

        .billing-info {
            background: #1e293b;
            border: 1px solid #334155;
            border-radius: 12px;
            padding: 1.5rem;
        }

        .billing-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.75rem 0;
            border-bottom: 1px solid #334155;
        }

        .billing-row:last-child {
            border-bottom: none;
        }

        .billing-label {
            color: #94a3b8;
            font-size: 0.875rem;
        }

        .billing-value {
            color: #ffffff;
            font-weight: 500;
        }

        @media (max-width: 768px) {
            .subscription-container {
                padding: 1rem;
            }

            .plans-grid {
                grid-template-columns: 1fr;
            }

            .promo-form {
                flex-direction: column;
            }

            .billing-header {
                flex-direction: column;
                gap: 1rem;
                align-items: stretch;
            }
        }
    </style>
</head>
<body>
    ${getModernLayout('subscription')}
    
    <main class="main-content">
        <div class="subscription-container">
            <!-- Header -->
            <div class="subscription-header">
                <h1>Subscription & Billing</h1>
                <p>Manage your subscription, view usage, and upgrade your plan to unlock more features.</p>
            </div>

            <!-- Current Plan Card -->
            <div class="current-plan-card">
                <div class="plan-header">
                    <div class="plan-info">
                        <h2 id="current-plan-name">Loading...</h2>
                        <div class="plan-status" id="plan-status">
                            ${MODERN_ICONS.check} Active
                        </div>
                    </div>
                </div>

                <!-- Usage Grid -->
                <div class="usage-grid">
                    <div class="usage-card">
                        <div class="usage-header">
                            <div class="usage-title">API Calls</div>
                            <div class="usage-value" id="api-calls-value">-</div>
                        </div>
                        <div class="usage-limit" id="api-calls-limit">of - this month</div>
                        <div class="usage-bar">
                            <div class="usage-progress" id="api-calls-progress"></div>
                        </div>
                    </div>

                    <div class="usage-card">
                        <div class="usage-header">
                            <div class="usage-title">API Keys</div>
                            <div class="usage-value" id="api-keys-value">-</div>
                        </div>
                        <div class="usage-limit" id="api-keys-limit">of - allowed</div>
                        <div class="usage-bar">
                            <div class="usage-progress" id="api-keys-progress"></div>
                        </div>
                    </div>

                    <div class="usage-card">
                        <div class="usage-header">
                            <div class="usage-title">OAuth Apps</div>
                            <div class="usage-value" id="oauth-apps-value">-</div>
                        </div>
                        <div class="usage-limit" id="oauth-apps-limit">of - allowed</div>
                        <div class="usage-bar">
                            <div class="usage-progress" id="oauth-apps-progress"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Plans Section -->
            <div class="plans-section">
                <div class="plans-header">
                    <h2>Choose Your Plan</h2>
                    <p>Upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
                </div>

                <div class="plans-grid" id="plans-grid">
                    <!-- Plans will be loaded dynamically -->
                </div>
            </div>

            <!-- Promo Code Section -->
            <div class="promo-section">
                <div class="promo-header">Have a Promo Code?</div>
                <p style="color: #94a3b8; margin-bottom: 1.5rem;">Enter your promo code to unlock special offers and discounts.</p>
                <form class="promo-form" onsubmit="applyPromoCode(event)">
                    <input 
                        type="text" 
                        class="promo-input" 
                        placeholder="Enter promo code"
                        id="promo-code-input"
                        required
                    >
                    <button type="submit" class="promo-button">Apply Code</button>
                </form>
            </div>

            <!-- Billing Section -->
            <div class="billing-section" id="billing-section" style="display: none;">
                <div class="billing-header">
                    <h2>Billing Information</h2>
                    <button class="cancel-button" onclick="cancelSubscription()">
                        Cancel Subscription
                    </button>
                </div>

                <div class="billing-info">
                    <div class="billing-row">
                        <div class="billing-label">Current Plan</div>
                        <div class="billing-value" id="billing-plan">-</div>
                    </div>
                    <div class="billing-row">
                        <div class="billing-label">Status</div>
                        <div class="billing-value" id="billing-status">-</div>
                    </div>
                    <div class="billing-row">
                        <div class="billing-label">Next Billing Date</div>
                        <div class="billing-value" id="billing-next-date">-</div>
                    </div>
                    <div class="billing-row">
                        <div class="billing-label">Amount</div>
                        <div class="billing-value" id="billing-amount">-</div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    ${getModernScripts()}
    ${getAuthManagerScript()}

    <script>
        let currentUser = null;
        let currentSubscription = null;
        let availablePlans = [];

        // Initialize page
        document.addEventListener('DOMContentLoaded', async () => {
            await checkAuth();
            await loadSubscriptionData();
            await loadPlans();
        });

        async function checkAuth() {
            try {
                const response = await fetch('/check-session', {
                    credentials: 'include'
                });
                
                if (!response.ok) {
                    window.location.href = '/auth';
                    return;
                }
                
                currentUser = await response.json();
            } catch (error) {
                console.error('Auth check failed:', error);
                window.location.href = '/auth';
            }
        }

        async function loadSubscriptionData() {
            if (!currentUser?.email) return;

            try {
                const response = await fetch(`/subscription/status?email=${encodeURIComponent(currentUser.email)}`, {
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    currentSubscription = data;
                    updateSubscriptionUI(data);
                    await loadUsageData();
                }
            } catch (error) {
                console.error('Failed to load subscription data:', error);
            }
        }

        function updateSubscriptionUI(data) {
            const { subscription, plan, hasAccess } = data;
            
            // Update current plan
            document.getElementById('current-plan-name').textContent = 
                plan.charAt(0).toUpperCase() + plan.slice(1) + ' Plan';
            
            // Update status
            const statusEl = document.getElementById('plan-status');
            if (hasAccess) {
                statusEl.innerHTML = `${MODERN_ICONS.check} Active`;
                statusEl.className = 'plan-status';
            } else {
                statusEl.innerHTML = `${MODERN_ICONS.x} Inactive`;
                statusEl.className = 'plan-status inactive';
            }

            // Show billing section if has paid subscription
            if (subscription && subscription.stripeSubscriptionId) {
                document.getElementById('billing-section').style.display = 'block';
                updateBillingInfo(subscription);
            }
        }

        function updateBillingInfo(subscription) {
            document.getElementById('billing-plan').textContent = 
                subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1);
            document.getElementById('billing-status').textContent = 
                subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1);
            
            if (subscription.startDate) {
                const nextDate = new Date(subscription.startDate);
                nextDate.setMonth(nextDate.getMonth() + 1);
                document.getElementById('billing-next-date').textContent = 
                    nextDate.toLocaleDateString();
            }
        }

        async function loadUsageData() {
            // This would typically come from a usage endpoint
            // For now, we'll simulate the data
            const usage = {
                apiCalls: { current: 1250, limit: 100000, percentage: 1.25 },
                apiKeys: { current: 3, limit: -1, percentage: 0 },
                oauthApps: { current: 5, limit: -1, percentage: 0 }
            };

            updateUsageUI(usage);
        }

        function updateUsageUI(usage) {
            // API Calls
            document.getElementById('api-calls-value').textContent = 
                usage.apiCalls.current.toLocaleString();
            document.getElementById('api-calls-limit').textContent = 
                `of ${usage.apiCalls.limit === -1 ? 'unlimited' : usage.apiCalls.limit.toLocaleString()} this month`;
            
            const apiCallsProgress = document.getElementById('api-calls-progress');
            apiCallsProgress.style.width = `${Math.min(usage.apiCalls.percentage, 100)}%`;
            if (usage.apiCalls.percentage > 80) {
                apiCallsProgress.className = 'usage-progress danger';
            } else if (usage.apiCalls.percentage > 60) {
                apiCallsProgress.className = 'usage-progress warning';
            }

            // API Keys
            document.getElementById('api-keys-value').textContent = usage.apiKeys.current;
            document.getElementById('api-keys-limit').textContent = 
                `of ${usage.apiKeys.limit === -1 ? 'unlimited' : usage.apiKeys.limit} allowed`;
            
            const apiKeysProgress = document.getElementById('api-keys-progress');
            apiKeysProgress.style.width = `${Math.min(usage.apiKeys.percentage, 100)}%`;

            // OAuth Apps
            document.getElementById('oauth-apps-value').textContent = usage.oauthApps.current;
            document.getElementById('oauth-apps-limit').textContent = 
                `of ${usage.oauthApps.limit === -1 ? 'unlimited' : usage.oauthApps.limit} allowed`;
            
            const oauthAppsProgress = document.getElementById('oauth-apps-progress');
            oauthAppsProgress.style.width = `${Math.min(usage.oauthApps.percentage, 100)}%`;
        }

        async function loadPlans() {
            try {
                const response = await fetch('/subscription/plans');
                if (response.ok) {
                    const data = await response.json();
                    availablePlans = data.plans;
                    renderPlans(data.plans);
                }
            } catch (error) {
                console.error('Failed to load plans:', error);
            }
        }

        function renderPlans(plans) {
            const grid = document.getElementById('plans-grid');
            const currentPlan = currentSubscription?.plan || 'free';
            
            grid.innerHTML = plans.map(plan => `
                <div class="plan-card ${plan.id === 'pro' ? 'recommended' : ''}">
                    <div class="plan-name">${plan.name}</div>
                    <div class="plan-price">
                        <span class="plan-currency">$</span>
                        <span class="plan-amount">${plan.price}</span>
                        <span class="plan-interval">/${plan.interval}</span>
                    </div>
                    <ul class="plan-features">
                        ${plan.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                    <button 
                        class="plan-button ${currentPlan === plan.id ? 'current' : ''}" 
                        onclick="selectPlan('${plan.id}')"
                        ${currentPlan === plan.id ? 'disabled' : ''}
                    >
                        ${currentPlan === plan.id ? 'Current Plan' : 
                          plan.price === 0 ? 'Downgrade' : 'Upgrade'}
                    </button>
                </div>
            `).join('');
        }

        async function selectPlan(planId) {
            if (!currentUser?.email) return;

            const plan = availablePlans.find(p => p.id === planId);
            if (!plan || !plan.stripePriceId) {
                alert('This plan is not available for purchase yet.');
                return;
            }

            try {
                const response = await fetch('/subscription/checkout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: currentUser.email,
                        priceId: plan.stripePriceId
                    }),
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    window.location.href = data.checkoutUrl;
                } else {
                    const error = await response.json();
                    alert('Failed to create checkout session: ' + error.error);
                }
            } catch (error) {
                console.error('Checkout failed:', error);
                alert('Failed to start checkout process.');
            }
        }

        async function applyPromoCode(event) {
            event.preventDefault();
            
            if (!currentUser?.email) return;

            const promoCode = document.getElementById('promo-code-input').value.trim();
            if (!promoCode) return;

            try {
                const response = await fetch('/subscription/promo', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: currentUser.email,
                        promoCode: promoCode
                    }),
                    credentials: 'include'
                });

                const data = await response.json();
                
                if (response.ok) {
                    alert('Promo code applied successfully: ' + data.message);
                    await loadSubscriptionData();
                    document.getElementById('promo-code-input').value = '';
                } else {
                    alert('Failed to apply promo code: ' + data.error);
                }
            } catch (error) {
                console.error('Promo code application failed:', error);
                alert('Failed to apply promo code.');
            }
        }

        async function cancelSubscription() {
            if (!confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
                return;
            }

            try {
                const response = await fetch('/subscription/cancel', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: currentUser.email
                    }),
                    credentials: 'include'
                });

                const data = await response.json();
                
                if (response.ok) {
                    alert('Subscription canceled successfully.');
                    await loadSubscriptionData();
                } else {
                    alert('Failed to cancel subscription: ' + data.error);
                }
            } catch (error) {
                console.error('Subscription cancellation failed:', error);
                alert('Failed to cancel subscription.');
            }
        }
    </script>
</body>
</html>`;
}
