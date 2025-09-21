/**
 * 💬 SLACK PLATFORM CONFIGURATION
 * Complete OAuth configuration for Slack API
 */

export const slack = {
  name: 'Slack',
  displayName: 'Slack',
  icon: '💬',
  color: '#4a154b',
  authUrl: 'https://slack.com/oauth/v2/authorize',
  tokenUrl: 'https://slack.com/api/oauth.v2.access',
  userInfoUrl: 'https://slack.com/api/users.identity',
  userIdField: 'id',
  docsUrl: 'https://api.slack.com/apps',
  description: 'Access Slack API for messaging and workspace data',
  requiredScopes: ['users:read'],
  scopeDelimiter: ' ',
  additionalParams: { response_type: 'code' },
  scopes: {
    'Users': {
      'users:read': { name: 'Users Read', description: 'View people in workspace', required: true },
      'users:read.email': { name: 'Users Read Email', description: 'View email addresses of people in workspace' },
      'users:write': { name: 'Users Write', description: 'Set presence for users' },
      'users.profile:read': { name: 'Users Profile Read', description: 'View profile information about people in workspace' },
      'users.profile:write': { name: 'Users Profile Write', description: 'Edit profile information' }
    },
    'Chat': {
      'chat:write': { name: 'Chat Write', description: 'Send messages as user' },
      'chat:write.public': { name: 'Chat Write Public', description: 'Send messages to channels user isn\'t a member of' },
      'chat:write.customize': { name: 'Chat Write Customize', description: 'Send messages with customized username and avatar' }
    },
    'Channels': {
      'channels:read': { name: 'Channels Read', description: 'View basic information about public channels' },
      'channels:write': { name: 'Channels Write', description: 'Manage public channels' },
      'channels:manage': { name: 'Channels Manage', description: 'Manage channel settings and members' },
      'channels:join': { name: 'Channels Join', description: 'Join public channels' },
      'channels:history': { name: 'Channels History', description: 'View messages and content in public channels' }
    },
    'Groups': {
      'groups:read': { name: 'Groups Read', description: 'View basic information about private channels' },
      'groups:write': { name: 'Groups Write', description: 'Manage private channels user has access to' },
      'groups:history': { name: 'Groups History', description: 'View messages and content in private channels' }
    },
    'IM': {
      'im:read': { name: 'IM Read', description: 'View basic information about direct messages' },
      'im:write': { name: 'IM Write', description: 'Start direct messages with people' },
      'im:history': { name: 'IM History', description: 'View messages and content in direct messages' }
    },
    'MPIM': {
      'mpim:read': { name: 'MPIM Read', description: 'View basic information about group direct messages' },
      'mpim:write': { name: 'MPIM Write', description: 'Start group direct messages with people' },
      'mpim:history': { name: 'MPIM History', description: 'View messages and content in group direct messages' }
    },
    'Files': {
      'files:read': { name: 'Files Read', description: 'View files shared in channels and conversations' },
      'files:write': { name: 'Files Write', description: 'Upload, edit, and delete files' }
    },
    'Reactions': {
      'reactions:read': { name: 'Reactions Read', description: 'View emoji reactions and their associated content' },
      'reactions:write': { name: 'Reactions Write', description: 'Add and edit emoji reactions' }
    },
    'Pins': {
      'pins:read': { name: 'Pins Read', description: 'View pinned content in channels and conversations' },
      'pins:write': { name: 'Pins Write', description: 'Add and remove pinned messages and files' }
    },
    'Stars': {
      'stars:read': { name: 'Stars Read', description: 'View starred content in channels and conversations' },
      'stars:write': { name: 'Stars Write', description: 'Add and edit stars' }
    },
    'Search': {
      'search:read': { name: 'Search Read', description: 'Search messages, files, and other content' }
    },
    'Team': {
      'team:read': { name: 'Team Read', description: 'View the workspace name, email domain, and icon' }
    },
    'Identity': {
      'identity.basic': { name: 'Identity Basic', description: 'View basic information about user\'s identity' },
      'identity.email': { name: 'Identity Email', description: 'View user\'s email address' },
      'identity.avatar': { name: 'Identity Avatar', description: 'View user\'s Slack avatar' },
      'identity.team': { name: 'Identity Team', description: 'View user\'s workspace name' }
    },
    'Reminders': {
      'reminders:read': { name: 'Reminders Read', description: 'View reminders created by user' },
      'reminders:write': { name: 'Reminders Write', description: 'Add, edit, and delete reminders' }
    },
    'Commands': {
      'commands': { name: 'Commands', description: 'Add shortcuts and/or slash commands' }
    },
    'Incoming Webhooks': {
      'incoming-webhook': { name: 'Incoming Webhook', description: 'Post messages to specific channels' }
    }
  }
};
