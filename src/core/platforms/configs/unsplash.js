/**
 * 📸 UNSPLASH PLATFORM CONFIGURATION
 * Complete OAuth configuration for Unsplash API
 */

export const unsplash = {
  name: 'Unsplash',
  displayName: 'Unsplash',
  icon: '📸',
  color: '#000000',
  authUrl: 'https://unsplash.com/oauth/authorize',
  tokenUrl: 'https://unsplash.com/oauth/token',
  userInfoUrl: 'https://api.unsplash.com/me',
  userIdField: 'id',
  docsUrl: 'https://unsplash.com/documentation#authorization',
  description: 'Unsplash photography platform and API',
  requiredScopes: ['public'],
  scopeDelimiter: '+',
  additionalParams: { response_type: 'code' },
  scopes: {
    'Basic': {
      'public': { name: 'Public', description: 'Access public photos and collections', required: true },
      'read_user': { name: 'Read User', description: 'Access private user data' },
      'write_user': { name: 'Write User', description: 'Update user profile' },
      'read_photos': { name: 'Read Photos', description: 'Access private photos' },
      'write_photos': { name: 'Write Photos', description: 'Upload and manage photos' },
      'write_likes': { name: 'Write Likes', description: 'Like and unlike photos' },
      'write_followers': { name: 'Write Followers', description: 'Follow and unfollow users' },
      'read_collections': { name: 'Read Collections', description: 'Access private collections' },
      'write_collections': { name: 'Write Collections', description: 'Create and manage collections' }
    }
  }
};
