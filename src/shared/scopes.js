// =============================================================================
// 🔐 OAUTH SCOPES DATABASE - Comprehensive Platform Scopes
// =============================================================================

// Required scopes that are automatically included and not shown in UI
// These include basic profile/authentication + user identity scopes for all platforms
export const REQUIRED_SCOPES = {
  google: ['openid', 'profile', 'email'], // OpenID Connect + basic profile
  facebook: ['public_profile', 'email'], // Facebook basic profile + email
  instagram: ['public_profile', 'email'], // Uses Facebook OAuth + email
  twitter: ['users.read'], // Basic user info (includes profile data)
  linkedin: ['openid', 'profile', 'email'], // LinkedIn basic profile + email
  tiktok: ['user.info.basic', 'user.info.profile'], // TikTok user profile scopes
  discord: ['identify', 'email'], // Discord basic identity + email
  pinterest: ['user_accounts:read'] // Pinterest user account info
};

export const PLATFORM_SCOPES = {
  google: {
    name: 'Google (YouTube)',
    emoji: '🎬',
    categories: {
      'Google Drive': [
        { scope: 'https://www.googleapis.com/auth/drive', description: 'Full access to Google Drive files' },
        { scope: 'https://www.googleapis.com/auth/drive.readonly', description: 'View Google Drive files' },
        { scope: 'https://www.googleapis.com/auth/drive.file', description: 'Access files created by this app' },
        { scope: 'https://www.googleapis.com/auth/drive.metadata', description: 'View and manage metadata of files' }
      ],
      'YouTube': [
        { scope: 'https://www.googleapis.com/auth/youtube', description: 'Manage YouTube account' },
        { scope: 'https://www.googleapis.com/auth/youtube.readonly', description: 'View YouTube account' },
        { scope: 'https://www.googleapis.com/auth/youtube.upload', description: 'Upload videos to YouTube' },
        { scope: 'https://www.googleapis.com/auth/youtube.force-ssl', description: 'View and manage YouTube videos' }
      ],
      'Gmail': [
        { scope: 'https://www.googleapis.com/auth/gmail.readonly', description: 'Read Gmail messages' },
        { scope: 'https://www.googleapis.com/auth/gmail.send', description: 'Send emails on behalf of user' },
        { scope: 'https://www.googleapis.com/auth/gmail.compose', description: 'Manage drafts and send emails' }
      ],
      'Google Cloud Platform': [
        { scope: 'https://www.googleapis.com/auth/cloud-platform', description: 'Full access to Google Cloud resources' },
        { scope: 'https://www.googleapis.com/auth/compute', description: 'Manage Google Compute Engine resources' },
        { scope: 'https://www.googleapis.com/auth/devstorage.full_control', description: 'Manage Cloud Storage data' }
      ]
    }
  },
  
  facebook: {
    name: 'Facebook',
    emoji: '📘',
    categories: {
      'Page Management': [
        { scope: 'pages_show_list', description: 'Access the list of Pages a person manages' },
        { scope: 'pages_read_engagement', description: 'Read engagement data for Pages' },
        { scope: 'pages_manage_posts', description: 'Create, edit and delete posts on Pages' },
        { scope: 'pages_manage_engagement', description: 'Create, edit and delete comments and reactions on Pages' }
      ],
      'Business': [
        { scope: 'business_management', description: 'Manage business assets' },
        { scope: 'ads_management', description: 'Manage advertising accounts' },
        { scope: 'ads_read', description: 'Read advertising insights and manage ad campaigns' }
      ],
      'Instagram': [
        { scope: 'instagram_basic', description: 'Access Instagram account info, photos and videos' },
        { scope: 'instagram_manage_comments', description: 'Manage comments on Instagram posts' },
        { scope: 'instagram_manage_insights', description: 'Read Instagram account insights' },
        { scope: 'instagram_content_publish', description: 'Publish content to Instagram' }
      ]
    }
  },
  
  instagram: {
    name: 'Instagram',
    emoji: '📸',
    categories: {
      'Graph API (Current)': [
        { scope: 'instagram_graph_user_profile', description: 'Read user profile information' },
        { scope: 'instagram_graph_user_media', description: 'Read user media' },
        { scope: 'pages_show_list', description: 'Access connected Facebook Pages' },
        { scope: 'pages_read_engagement', description: 'Read engagement data for Pages' }
      ],
      'Content Management': [
        { scope: 'instagram_manage_comments', description: 'Manage comments on posts' },
        { scope: 'instagram_manage_insights', description: 'View account insights and metrics' },
        { scope: 'instagram_content_publish', description: 'Publish photos and videos' }
      ],
      'Business Features': [
        { scope: 'instagram_manage_messages', description: 'Send and receive messages' },
        { scope: 'instagram_shopping_tag_products', description: 'Tag products in posts' }
      ]
    }
  },
  
  twitter: {
    name: 'X (Twitter)',
    emoji: '🐦',
    categories: {
      'Tweet Operations': [
        { scope: 'tweet.read', description: 'Read Tweets' },
        { scope: 'tweet.write', description: 'Create, delete, and edit Tweets' },
        { scope: 'tweet.moderate.write', description: 'Hide and unhide replies to Tweets' }
      ],
      'User Operations': [
        { scope: 'follows.read', description: 'Read following and followers lists' },
        { scope: 'follows.write', description: 'Follow and unfollow users' },
        { scope: 'offline.access', description: 'Make requests on behalf of user when they are not online' }
      ],
      'Engagement': [
        { scope: 'like.read', description: 'Read liked Tweets' },
        { scope: 'like.write', description: 'Like and unlike Tweets' },
        { scope: 'block.read', description: 'Read blocked accounts' },
        { scope: 'block.write', description: 'Block and unblock accounts' },
        { scope: 'mute.read', description: 'Read muted accounts' },
        { scope: 'mute.write', description: 'Mute and unmute accounts' }
      ],
      'Lists & Spaces': [
        { scope: 'list.read', description: 'Read Lists' },
        { scope: 'list.write', description: 'Create, delete, and manage Lists' },
        { scope: 'space.read', description: 'Read Spaces' }
      ],
      'Direct Messages': [
        { scope: 'dm.read', description: 'Read Direct Messages' },
        { scope: 'dm.write', description: 'Send Direct Messages' }
      ]
    }
  },
  
  linkedin: {
    name: 'LinkedIn',
    emoji: '💼',
    categories: {
      'Content Management': [
        { scope: 'w_compliance', description: 'Compliance and content management' },
        { scope: 'w_member_social', description: 'Post on behalf of members' },
        { scope: 'w_organization_social', description: 'Post on behalf of organizations' }
      ],
      'Advertising': [
        { scope: 'rw_ads', description: 'Manage advertising campaigns' },
        { scope: 'r_ads', description: 'Read advertising data' },
        { scope: 'r_ads_reporting', description: 'Access advertising analytics' }
      ],
      'Organization Management': [
        { scope: 'r_organization_social', description: 'Read organization social content' },
        { scope: 'rw_organization_admin', description: 'Manage organization pages' },
        { scope: 'r_basicprofile', description: 'Read basic organization profile' }
      ]
    }
  },
  
  tiktok: {
    name: 'TikTok',
    emoji: '🎵',
    categories: {
      'User Information': [
        { scope: 'user.info.stats', description: 'Access user statistics' }
      ],
      'Video Management': [
        { scope: 'video.list', description: 'Access user video list' },
        { scope: 'video.upload', description: 'Upload videos to TikTok' },
        { scope: 'video.publish', description: 'Publish videos on TikTok' }
      ],
      'Content Interaction': [
        { scope: 'share.sound.create', description: 'Create shareable sounds' },
        { scope: 'video.insights', description: 'Access video analytics and insights' }
      ]
    }
  },
  
  discord: {
    name: 'Discord',
    emoji: '🎮',
    categories: {
      'Guild (Server) Management': [
        { scope: 'guilds', description: 'View user\'s guild information' },
        { scope: 'guilds.join', description: 'Join users to guilds' },
        { scope: 'guilds.members.read', description: 'Read guild member information' }
      ],
      'Bot & Commands': [
        { scope: 'bot', description: 'Add bot to user\'s selected guild' },
        { scope: 'applications.commands', description: 'Use slash commands in servers' },
        { scope: 'applications.commands.update', description: 'Update slash commands' }
      ],
      'Communication': [
        { scope: 'messages.read', description: 'Read messages from client channels' },
        { scope: 'voice', description: 'Connect to voice channels' }
      ],
      'Rich Presence & Activities': [
        { scope: 'activities.read', description: 'Read user activity data (requires approval)' },
        { scope: 'activities.write', description: 'Update user activity (requires approval)' },
        { scope: 'rpc', description: 'Local RPC server access (requires approval)' }
      ]
    }
  },
  
  pinterest: {
    name: 'Pinterest',
    emoji: '📌',
    categories: {
      'Board Management': [
        { scope: 'boards:read', description: 'Read access to public boards' },
        { scope: 'boards:read_secret', description: 'Read access to private/secret boards' },
        { scope: 'boards:write', description: 'Create, update, or delete public boards' },
        { scope: 'boards:write_secret', description: 'Create, update, or delete private/secret boards' }
      ],
      'Pin Management': [
        { scope: 'pins:read', description: 'Read access to public pins' },
        { scope: 'pins:read_secret', description: 'Read access to private/secret pins' },
        { scope: 'pins:write', description: 'Create, update, or delete public pins' },
        { scope: 'pins:write_secret', description: 'Create, update, or delete private/secret pins' }
      ],
      'Business Features': [
        { scope: 'ads:read', description: 'Read access to advertising data and analytics' },
        { scope: 'ads:write', description: 'Create, update, or delete advertising content' },
        { scope: 'catalogs:read', description: 'Read catalog information and product feeds' },
        { scope: 'catalogs:write', description: 'Create or update catalog contents and product data' }
      ]
    }
  }
};

// Helper function to get all scopes for a platform
export function getPlatformScopes(platform) {
  const platformData = PLATFORM_SCOPES[platform];
  if (!platformData) return [];
  
  const allScopes = [];
  Object.entries(platformData.categories).forEach(([categoryName, scopes]) => {
    scopes.forEach(scopeData => {
      allScopes.push({
        ...scopeData,
        category: categoryName
      });
    });
  });
  
  return allScopes;
}

// Helper function to search scopes
export function searchScopes(platform, query) {
  const scopes = getPlatformScopes(platform);
  if (!query) return scopes;
  
  const searchTerm = query.toLowerCase();
  return scopes.filter(scope => 
    scope.scope.toLowerCase().includes(searchTerm) ||
    scope.description.toLowerCase().includes(searchTerm) ||
    scope.category.toLowerCase().includes(searchTerm)
  );
}

// Helper function to get final scopes including required ones
export function getFinalScopes(platform, selectedScopes = []) {
  const requiredScopes = REQUIRED_SCOPES[platform] || [];
  const allScopes = [...requiredScopes, ...selectedScopes];
  
  // Remove duplicates
  return [...new Set(allScopes)];
}