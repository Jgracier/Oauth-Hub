/**
 * 🧲 HUBSPOT PLATFORM CONFIGURATION
 * Complete OAuth configuration for HubSpot APIs
 */

const hubspot = {
  name: 'HubSpot',
  displayName: 'HubSpot',
  icon: '🧲',
  color: '#ff7a59',
  authUrl: 'https://app.hubspot.com/oauth/authorize',
  tokenUrl: 'https://api.hubapi.com/oauth/v1/token',
  userInfoUrl: 'https://api.hubapi.com/oauth/v1/access-tokens/{token}',
  userIdField: 'user_id',
  revokeUrl: null, // OAuth token revocation endpoint
  introspectUrl: null, // OAuth token introspection endpoint
  docsUrl: 'https://developers.hubspot.com/docs/api/oauth-quickstart-guide',
  description: 'HubSpot CRM and marketing automation platform',
  requiredScopes: ['oauth'],
  scopeDelimiter: ' ',
  requiresPKCE: false, // PKCE requirement for enhanced security
  additionalParams: { response_type: 'code' },
  scopes: {
    'Basic': {
      'oauth': { name: 'OAuth', description: 'Basic OAuth access', required: true }
    },
    'CRM Objects': {
      'crm.objects.contacts.read': { name: 'Read Contacts', description: 'Read contact records' },
      'crm.objects.contacts.write': { name: 'Write Contacts', description: 'Create and update contact records' },
      'crm.objects.companies.read': { name: 'Read Companies', description: 'Read company records' },
      'crm.objects.companies.write': { name: 'Write Companies', description: 'Create and update company records' },
      'crm.objects.deals.read': { name: 'Read Deals', description: 'Read deal records' },
      'crm.objects.deals.write': { name: 'Write Deals', description: 'Create and update deal records' },
      'crm.objects.line_items.read': { name: 'Read Line Items', description: 'Read line item records' },
      'crm.objects.line_items.write': { name: 'Write Line Items', description: 'Create and update line item records' },
      'crm.objects.owners.read': { name: 'Read Owners', description: 'Read owner information' },
      'crm.objects.quotes.read': { name: 'Read Quotes', description: 'Read quote records' },
      'crm.objects.quotes.write': { name: 'Write Quotes', description: 'Create and update quote records' }
    },
    'CRM Lists': {
      'crm.lists.read': { name: 'Read Lists', description: 'Read contact and company lists' },
      'crm.lists.write': { name: 'Write Lists', description: 'Create and update lists' }
    },
    'CRM Schemas': {
      'crm.schemas.contacts.read': { name: 'Read Contact Schema', description: 'Read contact property definitions' },
      'crm.schemas.contacts.write': { name: 'Write Contact Schema', description: 'Create and update contact properties' },
      'crm.schemas.companies.read': { name: 'Read Company Schema', description: 'Read company property definitions' },
      'crm.schemas.companies.write': { name: 'Write Company Schema', description: 'Create and update company properties' },
      'crm.schemas.deals.read': { name: 'Read Deal Schema', description: 'Read deal property definitions' },
      'crm.schemas.deals.write': { name: 'Write Deal Schema', description: 'Create and update deal properties' }
    },
    'Marketing': {
      'content': { name: 'Content', description: 'Access blog posts, landing pages, and website pages' },
      'forms': { name: 'Forms', description: 'Access and manage forms' },
      'files': { name: 'Files', description: 'Access file manager' },
      'hubdb': { name: 'HubDB', description: 'Access HubDB tables and rows' },
      'reports': { name: 'Reports', description: 'Access analytics and reporting data' },
      'social': { name: 'Social Media', description: 'Access social media publishing tools' },
      'automation': { name: 'Marketing Automation', description: 'Access workflows and automation' }
    },
    'Sales': {
      'tickets': { name: 'Service Tickets', description: 'Access and manage service tickets' },
      'e-commerce': { name: 'E-commerce', description: 'Access e-commerce bridge and product data' }
    },
    'Communication': {
      'conversations.read': { name: 'Read Conversations', description: 'Read conversations and messages' },
      'conversations.write': { name: 'Write Conversations', description: 'Send messages and manage conversations' }
    },
    'Integration Events': {
      'integration-sync': { name: 'Integration Sync', description: 'Sync data with external systems' },
      'timeline': { name: 'Timeline Events', description: 'Create timeline events on CRM records' }
    },
    'Settings': {
      'settings.users.read': { name: 'Read Users', description: 'Read user and team information' },
      'settings.users.write': { name: 'Write Users', description: 'Manage users and teams' },
      'settings.users.teams.read': { name: 'Read Teams', description: 'Read team information' },
      'settings.users.teams.write': { name: 'Write Teams', description: 'Manage team settings' }
    },
    'Business Units': {
      'business-intelligence': { name: 'Business Intelligence', description: 'Access business intelligence data' },
      'sales-email-read': { name: 'Read Sales Emails', description: 'Read sales email data' },
      'sales-email-write': { name: 'Write Sales Emails', description: 'Send and manage sales emails' }
    }
  }
};


export { hubspot };



