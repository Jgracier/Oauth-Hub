/**
 * 💼 LINKEDIN PLATFORM CONFIGURATION
 * Complete OAuth configuration for LinkedIn APIs
 */

const linkedin = {
  name: 'LinkedIn',
  displayName: 'LinkedIn',
  icon: '💼',
  color: '#0077b5',
  authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
  tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
  userInfoUrl: 'https://api.linkedin.com/v2/userinfo',
  userIdField: 'sub',
  revokeUrl: 'https://www.linkedin.com/oauth/v2/revoke', // OAuth token revocation endpoint
  introspectUrl: null, // OAuth token introspection endpoint
  docsUrl: 'https://developer.linkedin.com/',
  description: 'Access LinkedIn APIs for profile and company data',
  requiredScopes: ['openid', 'profile', 'email'],
  scopeDelimiter: ' ',
  requiresPKCE: false, // PKCE requirement for enhanced security // Space-delimited
  additionalParams: {
    response_type: 'code'
  },
  scopes: {
    'Authentication': {
      'openid': { name: 'OpenID Connect', description: 'OpenID Connect authentication', required: true },
      'profile': { name: 'Profile', description: 'Access basic profile information', required: true },
      'email': { name: 'Email', description: 'Access email address', required: true }
    },
    'Member Profile': {
      'r_liteprofile': { name: 'Lite Profile', description: 'Access basic profile information' },
      'r_basicprofile': { name: 'Basic Profile', description: 'Access full basic profile information' },
      'r_fullprofile': { name: 'Full Profile', description: 'Access complete profile information' },
      'r_contactinfo': { name: 'Contact Info', description: 'Access contact information' }
    },
    'Member Social': {
      'w_member_social': { name: 'Member Social Write', description: 'Post updates on behalf of user' },
      'r_member_social': { name: 'Member Social Read', description: 'Read member social activity' }
    },
    'Company Pages': {
      'rw_company_admin': { name: 'Company Admin', description: 'Administer company pages' },
      'r_organization_social': { name: 'Organization Social Read', description: 'Read organization social activity' },
      'w_organization_social': { name: 'Organization Social Write', description: 'Post on behalf of organization' },
      'rw_organization_admin': { name: 'Organization Admin', description: 'Administer organization pages' }
    },
    'Advertising': {
      'r_ads': { name: 'Ads Read', description: 'Read advertising account information' },
      'rw_ads': { name: 'Ads Read/Write', description: 'Manage advertising campaigns' },
      'r_ads_reporting': { name: 'Ads Reporting', description: 'Access advertising reports' }
    },
    'Marketing': {
      'r_marketing_leadgen_automation': { name: 'Lead Gen Automation Read', description: 'Read lead generation automation data' },
      'rw_marketing_leadgen_automation': { name: 'Lead Gen Automation Write', description: 'Manage lead generation automation' }
    },
    'Compliance': {
      'r_compliance': { name: 'Compliance Read', description: 'Access compliance data for regulatory purposes' }
    }
  }
};


export { linkedin };



