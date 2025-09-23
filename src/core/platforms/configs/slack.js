/**
 * 💬 SLACK PLATFORM CONFIGURATION
 * Complete OAuth configuration for Slack API
 */

export const slack = {
  name: 'Slack',
  displayName: 'Slack',
  icon: '💬',
  color: '#4A154B',
  authUrl: 'https://slack.com/oauth/v2/authorize',
  tokenUrl: 'https://slack.com/api/oauth.v2.access',
  userInfoUrl: 'https://slack.com/api/auth.identity',
  userIdField: 'user.id',
  docsUrl: 'https://api.slack.com/authentication/oauth-v2',
  description: 'Access Slack workspaces and channels',
  requiredScopes: ['identity.basic'],
  scopeDelimiter: ',',
  additionalParams: { response_type: 'code' },
  requiresPKCE: true,
  authMethod: 'post',
  scopes: {
    'Identity': {
      'identity.basic': { name: 'Basic Info', description: 'Get your user ID and team ID', required: true },
      'identity.avatar': { name: 'Avatar', description: 'Get your profile picture' },
      'identity.email': { name: 'Email', description: 'Get your email address' },
      'identity.team': { name: 'Team', description: 'Get your team info' }
    },
    'Chat': {
      'chat:write': { name: 'Send Messages', description: 'Post messages to channels' },
      'chat:write.public': { name: 'Public Channels', description: 'Post to public channels' },
      'chat:write.customize': { name: 'Custom Messages', description: 'Post custom messages' }
    },
    'Files': {
      'files:write': { name: 'Upload Files', description: 'Upload files' },
      'files:read': { name: 'Read Files', description: 'View files' }
    },
    'Users': {
      'users:read': { name: 'Read Users', description: 'View user profiles' },
      'users.profile:read': { name: 'User Profiles', description: 'View user profile info' }
    },
    'Admin': {
      'admin.users:read': { name: 'Admin Users', description: 'Admin access to users' }
    }
  }
};
