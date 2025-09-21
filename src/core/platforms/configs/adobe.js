/**
 * 🎨 ADOBE PLATFORM CONFIGURATION
 * Complete OAuth configuration for Adobe Creative Cloud
 */

export const adobe = {
  name: 'Adobe',
  displayName: 'Adobe Creative Cloud',
  icon: '🎨',
  color: '#ff0000',
  authUrl: 'https://ims-na1.adobelogin.com/ims/authorize/v1',
  tokenUrl: 'https://ims-na1.adobelogin.com/ims/token/v1',
  userInfoUrl: 'https://ims-na1.adobelogin.com/ims/userinfo/v1',
  userIdField: 'user_id',
  docsUrl: 'https://developer.adobe.com/developer-console/docs/guides/authentication/OAuth/',
  description: 'Adobe Creative Cloud and Document Services',
  requiredScopes: ['openid'],
  scopeDelimiter: ',',
  additionalParams: { response_type: 'code' },
  scopes: {
    'Authentication': {
      'openid': { name: 'OpenID Connect', description: 'Basic authentication', required: true },
      'creative_sdk': { name: 'Creative SDK', description: 'Access Creative SDK services' }
    },
    'Creative Cloud': {
      'cc_files': { name: 'Creative Cloud Files', description: 'Access Creative Cloud file storage' },
      'cc_libraries': { name: 'Creative Cloud Libraries', description: 'Access Creative Cloud Libraries' }
    },
    'Document Services': {
      'pdf_services': { name: 'PDF Services', description: 'Access PDF Services API' },
      'document_generation': { name: 'Document Generation', description: 'Generate documents from templates' }
    }
  }
};
