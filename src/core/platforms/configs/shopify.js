/**
 * 🛍️ SHOPIFY PLATFORM CONFIGURATION
 * Complete OAuth configuration for Shopify Admin API
 */

export const shopify = {
  name: 'Shopify',
  displayName: 'Shopify',
  icon: '🛍️',
  color: '#7ab55c',
  authUrl: 'https://{shop}.myshopify.com/admin/oauth/authorize',
  tokenUrl: 'https://{shop}.myshopify.com/admin/oauth/access_token',
  userInfoUrl: 'https://{shop}.myshopify.com/admin/api/2023-10/shop.json',
  userIdField: 'shop.id',
  revokeUrl: null, // OAuth token revocation endpoint
  introspectUrl: null, // OAuth token introspection endpoint
  docsUrl: 'https://shopify.dev/docs/apps/auth/oauth',
  description: 'Access Shopify stores and e-commerce data',
  requiredScopes: ['read_products'],
  scopeDelimiter: ',',
  requiresPKCE: false, // PKCE requirement for enhanced security
  additionalParams: { response_type: 'code' },
  scopes: {
    'Products': {
      'read_products': { name: 'Read Products', description: 'View products, variants, and collections', required: true },
      'write_products': { name: 'Write Products', description: 'Create and modify products, variants, and collections' }
    },
    'Orders': {
      'read_orders': { name: 'Read Orders', description: 'View orders, transactions, and fulfillments' },
      'write_orders': { name: 'Write Orders', description: 'Create and modify orders, transactions, and fulfillments' },
      'read_all_orders': { name: 'Read All Orders', description: 'View all orders (requires additional permissions)' }
    },
    'Customers': {
      'read_customers': { name: 'Read Customers', description: 'View customer data and customer groups' },
      'write_customers': { name: 'Write Customers', description: 'Create and modify customer data' },
      'read_customer_events': { name: 'Read Customer Events', description: 'View customer events and activities' },
      'read_customer_merge': { name: 'Read Customer Merge', description: 'View customer merge operations' },
      'write_customer_merge': { name: 'Write Customer Merge', description: 'Perform customer merge operations' },
      'read_customer_payment_methods': { name: 'Read Customer Payment Methods', description: 'View customer payment methods' }
    },
    'Inventory': {
      'read_inventory': { name: 'Read Inventory', description: 'View inventory levels and locations' },
      'write_inventory': { name: 'Write Inventory', description: 'Modify inventory levels and locations' }
    },
    'Fulfillments': {
      'read_fulfillments': { name: 'Read Fulfillments', description: 'View fulfillment information' },
      'write_fulfillments': { name: 'Write Fulfillments', description: 'Create and modify fulfillments' }
    },
    'Draft Orders': {
      'read_draft_orders': { name: 'Read Draft Orders', description: 'View draft orders' },
      'write_draft_orders': { name: 'Write Draft Orders', description: 'Create and modify draft orders' }
    },
    'Discounts': {
      'read_discounts': { name: 'Read Discounts', description: 'View discount codes and automatic discounts' },
      'write_discounts': { name: 'Write Discounts', description: 'Create and modify discount codes and automatic discounts' },
      'read_price_rules': { name: 'Read Price Rules', description: 'View price rules for discounts' },
      'write_price_rules': { name: 'Write Price Rules', description: 'Create and modify price rules for discounts' }
    },
    'Marketing': {
      'read_marketing_events': { name: 'Read Marketing Events', description: 'View marketing events and campaigns' },
      'write_marketing_events': { name: 'Write Marketing Events', description: 'Create and modify marketing events and campaigns' }
    },
    'Payments': {
      'read_shopify_payments_payouts': { name: 'Read Shopify Payments Payouts', description: 'View Shopify Payments payout information' },
      'read_shopify_payments_disputes': { name: 'Read Shopify Payments Disputes', description: 'View Shopify Payments dispute information' },
      'read_shopify_payments_dispute_evidences': { name: 'Read Dispute Evidences', description: 'View dispute evidence information' }
    },
    'Content': {
      'read_content': { name: 'Read Content', description: 'View blog posts, pages, and redirects' },
      'write_content': { name: 'Write Content', description: 'Create and modify blog posts, pages, and redirects' },
      'read_online_store_pages': { name: 'Read Online Store Pages', description: 'View online store pages' },
      'read_online_store_navigation': { name: 'Read Online Store Navigation', description: 'View online store navigation' },
      'write_online_store_navigation': { name: 'Write Online Store Navigation', description: 'Modify online store navigation' }
    },
    'Themes': {
      'read_themes': { name: 'Read Themes', description: 'View themes and theme files' },
      'write_themes': { name: 'Write Themes', description: 'Create and modify themes and theme files' }
    },
    'Scripts': {
      'read_script_tags': { name: 'Read Script Tags', description: 'View script tags' },
      'write_script_tags': { name: 'Write Script Tags', description: 'Create and modify script tags' }
    },
    'Files': {
      'read_files': { name: 'Read Files', description: 'View uploaded files' },
      'write_files': { name: 'Write Files', description: 'Upload and manage files' }
    },
    'Gift Cards': {
      'read_gift_cards': { name: 'Read Gift Cards', description: 'View gift card information' },
      'write_gift_cards': { name: 'Write Gift Cards', description: 'Create and modify gift cards' }
    },
    'Localization': {
      'read_locales': { name: 'Read Locales', description: 'View store locales and translations' },
      'write_locales': { name: 'Write Locales', description: 'Modify store locales and translations' }
    }
  }
};
