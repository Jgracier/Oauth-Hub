/**
 * 🎵 TIKTOK PLATFORM CONFIGURATION
 * Complete OAuth configuration for TikTok for Developers API
 */

export const tiktok = {
  name: 'TikTok',
  displayName: 'TikTok',
  icon: '🎵',
  color: '#ff0050',
  authUrl: 'https://www.tiktok.com/auth/authorize/',
  tokenUrl: 'https://open-api.tiktok.com/oauth/access_token/',
  userInfoUrl: 'https://open-api.tiktok.com/oauth/userinfo/?fields=open_id,union_id,avatar_url,display_name',
  userIdField: 'open_id',
  docsUrl: 'https://developers.tiktok.com/',
  description: 'Access TikTok for Developers API',
  requiredScopes: ['user.info.basic'],
  scopeDelimiter: ',',
  additionalParams: { response_type: 'code' },
  scopes: {
    'User Info': {
      'user.info.basic': { name: 'Basic User Info', description: 'Access basic user information', required: true },
      'user.info.profile': { name: 'User Profile', description: 'Access detailed user profile information' },
      'user.info.stats': { name: 'User Stats', description: 'Access user statistics and metrics' }
    },
    'Video Management': {
      'video.list': { name: 'Video List', description: 'Access user video list' },
      'video.upload': { name: 'Video Upload', description: 'Upload videos to TikTok' },
      'video.publish': { name: 'Video Publish', description: 'Publish videos on behalf of user' }
    },
    'Research API': {
      'research.adlib.basic': { name: 'Research Ad Library Basic', description: 'Access basic ad library research data' },
      'research.adlib.advanced': { name: 'Research Ad Library Advanced', description: 'Access advanced ad library research data' }
    }
  }
};
