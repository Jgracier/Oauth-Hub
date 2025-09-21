/**
 * 📷 INSTAGRAM PLATFORM CONFIGURATION
 * Complete OAuth configuration for Instagram Basic Display API
 */

export const instagram = {
  name: 'Instagram',
  displayName: 'Instagram',
  icon: '📷',
  color: '#e4405f',
  authUrl: 'https://api.instagram.com/oauth/authorize',
  tokenUrl: 'https://api.instagram.com/oauth/access_token',
  userInfoUrl: 'https://graph.instagram.com/me?fields=id,username',
  userIdField: 'id',
  docsUrl: 'https://developers.facebook.com/',
  description: 'Access Instagram Basic Display API for media and profile',
  requiredScopes: ['user_profile'],
  scopeDelimiter: ',',
  additionalParams: { response_type: 'code' },
  scopes: {
    'Basic': {
      'user_profile': { name: 'User Profile', description: 'Access profile information', required: true }
    },
    'Media': {
      'user_media': { name: 'User Media', description: 'Access media (photos and videos)' }
    }
  }
};
