/**
 * 🏀 DRIBBBLE PLATFORM CONFIGURATION
 * Complete OAuth configuration for Dribbble API
 */

const dribbble = {
  name: 'Dribbble',
  displayName: 'Dribbble',
  icon: '🏀',
  color: '#ea4c89',
  authUrl: 'https://dribbble.com/oauth/authorize',
  tokenUrl: 'https://dribbble.com/oauth/token',
  userInfoUrl: 'https://api.dribbble.com/v2/user',
  userIdField: 'id',
  revokeUrl: null, // OAuth token revocation endpoint
  introspectUrl: null, // OAuth token introspection endpoint
  docsUrl: 'https://developer.dribbble.com/v2/oauth/',
  description: 'Dribbble design community platform',
  requiredScopes: ['public'],
  scopeDelimiter: ' ',
  requiresPKCE: false, // PKCE requirement for enhanced security
  additionalParams: { response_type: 'code' },
  scopes: {
    'Basic': {
      'public': { name: 'Public', description: 'Access public profile and shots', required: true },
      'write': { name: 'Write', description: 'Create and modify shots and comments' },
      'comment': { name: 'Comment', description: 'Post comments on shots' },
      'upload': { name: 'Upload', description: 'Upload shots and attachments' }
    }
  }
};


export { dribbble };



