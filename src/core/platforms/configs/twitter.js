/**
 * 🐦 TWITTER/X PLATFORM CONFIGURATION
 * Complete OAuth configuration for X (Twitter) API v2
 */

export const twitter = {
  name: 'Twitter',
  displayName: 'X (Twitter)',
  icon: '🐦',
  color: '#1da1f2',
  authUrl: 'https://twitter.com/i/oauth2/authorize',
  tokenUrl: 'https://api.twitter.com/2/oauth2/token',
  userInfoUrl: 'https://api.twitter.com/2/users/me',
  userIdField: 'id',
  docsUrl: 'https://developer.x.com/',
  description: 'Access X (Twitter) API v2 for tweets, users, and engagement',
  requiredScopes: ['tweet.read', 'users.read'],
  scopeDelimiter: ' ', // Space-delimited
  additionalParams: {
    response_type: 'code',
    code_challenge_method: 'S256' // PKCE required
  },
  requiresPKCE: true, // Twitter requires PKCE
  scopes: {
    'Tweets': {
      'tweet.read': { name: 'Tweet Read', description: 'Read tweets', required: true },
      'tweet.write': { name: 'Tweet Write', description: 'Create and delete tweets' },
      'tweet.moderate.write': { name: 'Tweet Moderate Write', description: 'Hide and unhide replies to your tweets' }
    },
    'Users': {
      'users.read': { name: 'Users Read', description: 'Read user profile information', required: true }
    },
    'Follows': {
      'follows.read': { name: 'Follows Read', description: 'Read following and followers lists' },
      'follows.write': { name: 'Follows Write', description: 'Follow and unfollow users' }
    },
    'Spaces': {
      'space.read': { name: 'Space Read', description: 'Read Spaces' }
    },
    'Mutes': {
      'mute.read': { name: 'Mute Read', description: 'Read muted accounts' },
      'mute.write': { name: 'Mute Write', description: 'Mute and unmute accounts' }
    },
    'Blocks': {
      'block.read': { name: 'Block Read', description: 'Read blocked accounts' },
      'block.write': { name: 'Block Write', description: 'Block and unblock accounts' }
    },
    'Likes': {
      'like.read': { name: 'Like Read', description: 'Read liked tweets' },
      'like.write': { name: 'Like Write', description: 'Like and unlike tweets' }
    },
    'Lists': {
      'list.read': { name: 'List Read', description: 'Read lists' },
      'list.write': { name: 'List Write', description: 'Create and manage lists' }
    },
    'Bookmarks': {
      'bookmark.read': { name: 'Bookmark Read', description: 'Read bookmarked tweets' },
      'bookmark.write': { name: 'Bookmark Write', description: 'Bookmark and remove bookmarks from tweets' }
    }
  }
};
