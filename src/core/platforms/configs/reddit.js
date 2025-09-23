/**
 * 🤖 REDDIT PLATFORM CONFIGURATION
 * Complete OAuth configuration for Reddit API
 */

export const reddit = {
  name: 'Reddit',
  displayName: 'Reddit',
  icon: '🤖',
  color: '#ff4500',
  authUrl: 'https://www.reddit.com/api/v1/authorize',
  tokenUrl: 'https://www.reddit.com/api/v1/access_token',
  userInfoUrl: 'https://oauth.reddit.com/api/v1/me',
  userIdField: 'id',
  revokeUrl: null, // OAuth token revocation endpoint
  introspectUrl: null, // OAuth token introspection endpoint
  docsUrl: 'https://www.reddit.com/dev/api/',
  description: 'Access Reddit API for posts and user data',
  requiredScopes: ['identity'],
  scopeDelimiter: ' ',
  requiresPKCE: false, // PKCE requirement for enhanced security
  additionalParams: { response_type: 'code' },
  scopes: {
    'User': {
      'identity': { name: 'Identity', description: 'Access user identity and basic profile', required: true },
      'mysubreddits': { name: 'My Subreddits', description: 'Access list of subreddits user moderates and subscribes to' },
      'privatemessages': { name: 'Private Messages', description: 'Access and manage private messages' },
      'account': { name: 'Account', description: 'Update account information' }
    },
    'Content': {
      'read': { name: 'Read', description: 'Read posts, comments, and other content' },
      'submit': { name: 'Submit', description: 'Submit posts and comments' },
      'edit': { name: 'Edit', description: 'Edit posts and comments' },
      'save': { name: 'Save', description: 'Save and unsave posts and comments' },
      'vote': { name: 'Vote', description: 'Vote on posts and comments' },
      'report': { name: 'Report', description: 'Report posts and comments' }
    },
    'Subreddit Management': {
      'modconfig': { name: 'Mod Config', description: 'Manage subreddit configuration' },
      'modcontributors': { name: 'Mod Contributors', description: 'Manage approved submitters' },
      'modflair': { name: 'Mod Flair', description: 'Manage user and post flair' },
      'modlog': { name: 'Mod Log', description: 'Access moderation log' },
      'modmail': { name: 'Mod Mail', description: 'Access and manage modmail' },
      'modothers': { name: 'Mod Others', description: 'Manage other moderator actions' },
      'modposts': { name: 'Mod Posts', description: 'Moderate posts (approve, remove, etc.)' },
      'modself': { name: 'Mod Self', description: 'Accept moderator invitations' },
      'modtraffic': { name: 'Mod Traffic', description: 'Access subreddit traffic statistics' },
      'modwiki': { name: 'Mod Wiki', description: 'Manage wiki pages' }
    },
    'Wiki': {
      'wikiread': { name: 'Wiki Read', description: 'Read wiki pages' },
      'wikiedit': { name: 'Wiki Edit', description: 'Edit wiki pages' }
    },
    'History': {
      'history': { name: 'History', description: 'Access user browsing history' }
    },
    'Subscriptions': {
      'subscribe': { name: 'Subscribe', description: 'Manage subreddit subscriptions' }
    }
  }
};
