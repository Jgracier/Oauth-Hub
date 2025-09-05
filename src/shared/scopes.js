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
  pinterest: ['user_accounts:read'], // Pinterest user account info
  wordpress: [], // WordPress.com uses global access by default
  reddit: ['identity'], // Reddit basic identity scope
  github: ['user:email'], // GitHub basic user info + email
  spotify: ['user-read-private', 'user-read-email'], // Spotify user profile + email
  twitch: ['user:read:email'], // Twitch user info + email
  slack: ['identity.basic', 'identity.email'], // Slack basic identity + email
  microsoft: ['openid', 'profile', 'email'] // Microsoft basic profile + email
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
      'User Information': [
        { scope: 'identify', description: 'Access to user\'s username, discriminator, ID, and avatar' },
        { scope: 'email', description: 'Access to user\'s email address' },
        { scope: 'connections', description: 'Access to user\'s connected accounts (Twitch, YouTube, etc.)' }
      ],
      'Guild (Server) Management': [
        { scope: 'guilds', description: 'View user\'s guild information' },
        { scope: 'guilds.join', description: 'Join users to guilds' },
        { scope: 'guilds.members.read', description: 'Read guild member information' }
      ],
      'Bot & Commands': [
        { scope: 'bot', description: 'Add bot to user\'s selected guild' },
        { scope: 'applications.commands', description: 'Use slash commands in servers' },
        { scope: 'applications.commands.update', description: 'Update slash commands' },
        { scope: 'applications.commands.permissions.update', description: 'Update command permissions' }
      ],
      'Communication': [
        { scope: 'messages.read', description: 'Read messages from client channels' },
        { scope: 'voice', description: 'Connect to voice channels' },
        { scope: 'dm_channels.read', description: 'Read private messages' }
      ],
      'Rich Presence & Activities': [
        { scope: 'activities.read', description: 'Read user activity data (requires approval)' },
        { scope: 'activities.write', description: 'Update user activity (requires approval)' },
        { scope: 'rpc', description: 'Local RPC server access (requires approval)' },
        { scope: 'rpc.activities.write', description: 'Update user\'s activity via RPC' },
        { scope: 'rpc.voice.read', description: 'Read voice settings via RPC' },
        { scope: 'rpc.voice.write', description: 'Control voice settings via RPC' }
      ],
      'Webhooks & Integration': [
        { scope: 'webhook.incoming', description: 'Create incoming webhooks' },
        { scope: 'applications.builds.upload', description: 'Upload application builds' },
        { scope: 'applications.builds.read', description: 'Read application builds' },
        { scope: 'applications.store.update', description: 'Update store listings' }
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
  },
  
  wordpress: {
    name: 'WordPress.com',
    emoji: '📝',
    categories: {
      'Content Management': [
        { scope: 'posts', description: 'Create, read, update, and delete posts' },
        { scope: 'media', description: 'Upload and manage media files' },
        { scope: 'pages', description: 'Create, read, update, and delete pages' },
        { scope: 'comments', description: 'Manage comments on posts and pages' }
      ],
      'Site Management': [
        { scope: 'sites', description: 'Access site information and settings' },
        { scope: 'themes', description: 'Manage site themes and customization' },
        { scope: 'plugins', description: 'Manage site plugins and extensions' },
        { scope: 'users', description: 'Manage site users and permissions' }
      ],
      'Analytics & Insights': [
        { scope: 'stats', description: 'Access site statistics and analytics' },
        { scope: 'follows', description: 'Manage site followers and subscriptions' }
      ],
      'Global Access': [
        { scope: 'global', description: 'Access all user sites and Jetpack-connected sites' }
      ]
    }
  },
  
  reddit: {
    name: 'Reddit',
    emoji: '🔴',
    categories: {
      'User Information': [
        { scope: 'identity', description: 'Access to user account information' },
        { scope: 'mysubreddits', description: 'Access to subscribed subreddits' },
        { scope: 'privatemessages', description: 'Access to private messages' }
      ],
      'Content Management': [
        { scope: 'read', description: 'Read access to posts and comments' },
        { scope: 'submit', description: 'Submit posts and comments' },
        { scope: 'edit', description: 'Edit posts and comments' },
        { scope: 'save', description: 'Save and unsave posts and comments' }
      ],
      'Voting & Interaction': [
        { scope: 'vote', description: 'Upvote and downvote posts and comments' },
        { scope: 'report', description: 'Report posts and comments' },
        { scope: 'subscribe', description: 'Subscribe and unsubscribe from subreddits' }
      ],
      'Moderation': [
        { scope: 'modposts', description: 'Moderate posts (for moderators)' },
        { scope: 'modconfig', description: 'Manage subreddit configuration (for moderators)' },
        { scope: 'modlog', description: 'Access moderation log (for moderators)' },
        { scope: 'modcontributors', description: 'Manage approved contributors (for moderators)' },
        { scope: 'modflair', description: 'Manage user and post flair (for moderators)' },
        { scope: 'modmail', description: 'Access modmail (for moderators)' },
        { scope: 'modothers', description: 'Invite and remove moderators (for moderators)' },
        { scope: 'modself', description: 'Accept moderator invitations' },
        { scope: 'modwiki', description: 'Manage wiki pages (for moderators)' }
      ],
      'Account Management': [
        { scope: 'account', description: 'Manage account settings and preferences' },
        { scope: 'creddits', description: 'Spend Reddit coins on behalf of user' },
        { scope: 'flair', description: 'Manage user flair' },
        { scope: 'history', description: 'Access user\'s post and comment history' },
        { scope: 'livemanage', description: 'Manage live threads' }
      ],
      'Wiki & Advanced': [
        { scope: 'wikiread', description: 'Read wiki pages' },
        { scope: 'wikiedit', description: 'Edit wiki pages' },
        { scope: 'structuredstyles', description: 'Edit structured styles' }
      ]
    }
  },
  
  github: {
    name: 'GitHub',
    emoji: '🐙',
    categories: {
      'User Information': [
        { scope: 'user', description: 'Read/write access to profile info' },
        { scope: 'user:email', description: 'Access to user email addresses' },
        { scope: 'user:follow', description: 'Access to follow/unfollow users' }
      ],
      'Repository Access': [
        { scope: 'repo', description: 'Full access to public and private repositories' },
        { scope: 'public_repo', description: 'Access to public repositories only' },
        { scope: 'repo:status', description: 'Access to commit statuses' },
        { scope: 'repo_deployment', description: 'Access to deployment statuses' },
        { scope: 'repo:invite', description: 'Access to repository invitations' }
      ],
      'Organization & Team': [
        { scope: 'read:org', description: 'Read access to organization membership' },
        { scope: 'write:org', description: 'Write access to organization membership' },
        { scope: 'admin:org', description: 'Full access to organization' },
        { scope: 'read:public_key', description: 'Read access to public keys' },
        { scope: 'write:public_key', description: 'Write access to public keys' }
      ],
      'Gists & Notifications': [
        { scope: 'gist', description: 'Write access to gists' },
        { scope: 'notifications', description: 'Access to notifications' },
        { scope: 'read:discussion', description: 'Read access to team discussions' },
        { scope: 'write:discussion', description: 'Write access to team discussions' }
      ],
      'Packages & Security': [
        { scope: 'read:packages', description: 'Download packages from GitHub Package Registry' },
        { scope: 'write:packages', description: 'Upload packages to GitHub Package Registry' },
        { scope: 'delete:packages', description: 'Delete packages from GitHub Package Registry' },
        { scope: 'read:gpg_key', description: 'Read access to GPG keys' },
        { scope: 'write:gpg_key', description: 'Write access to GPG keys' }
      ],
      'GitHub Apps': [
        { scope: 'read:repo_hook', description: 'Read access to repository hooks' },
        { scope: 'write:repo_hook', description: 'Write access to repository hooks' },
        { scope: 'admin:repo_hook', description: 'Full access to repository hooks' },
        { scope: 'read:org_hook', description: 'Read access to organization hooks' },
        { scope: 'write:org_hook', description: 'Write access to organization hooks' },
        { scope: 'admin:org_hook', description: 'Full access to organization hooks' }
      ]
    }
  },
  
  spotify: {
    name: 'Spotify',
    emoji: '🎵',
    categories: {
      'User Profile': [
        { scope: 'user-read-private', description: 'Read access to user subscription details, country, etc.' },
        { scope: 'user-read-email', description: 'Read access to user email address' },
        { scope: 'user-read-birthdate', description: 'Read access to user birthdate' }
      ],
      'Playback Control': [
        { scope: 'user-read-playback-state', description: 'Read access to user\'s player state' },
        { scope: 'user-modify-playback-state', description: 'Write access to user\'s playback state' },
        { scope: 'user-read-currently-playing', description: 'Read access to user\'s currently playing content' },
        { scope: 'streaming', description: 'Control playback of Spotify track in Web Playback SDK' }
      ],
      'Library Management': [
        { scope: 'user-library-read', description: 'Read access to user\'s saved tracks and albums' },
        { scope: 'user-library-modify', description: 'Write/delete access to user\'s saved tracks and albums' },
        { scope: 'user-read-recently-played', description: 'Read access to user\'s recently played tracks' },
        { scope: 'user-top-read', description: 'Read access to user\'s top artists and tracks' }
      ],
      'Playlists': [
        { scope: 'playlist-read-private', description: 'Read access to user\'s private playlists' },
        { scope: 'playlist-read-collaborative', description: 'Read access to user\'s collaborative playlists' },
        { scope: 'playlist-modify-private', description: 'Write access to user\'s private playlists' },
        { scope: 'playlist-modify-public', description: 'Write access to user\'s public playlists' }
      ],
      'Social Features': [
        { scope: 'user-follow-read', description: 'Read access to user\'s followed artists and users' },
        { scope: 'user-follow-modify', description: 'Write access to user\'s followed artists and users' }
      ],
      'Images & Content': [
        { scope: 'ugc-image-upload', description: 'Write access to user-generated content images' },
        { scope: 'app-remote-control', description: 'Remote control playback of Spotify' }
      ]
    }
  },
  
  twitch: {
    name: 'Twitch',
    emoji: '🎮',
    categories: {
      'User Information': [
        { scope: 'user:read:email', description: 'View user email address' },
        { scope: 'user:read:subscriptions', description: 'View user subscriptions' },
        { scope: 'user:read:blocked_users', description: 'View user\'s blocked users list' },
        { scope: 'user:manage:blocked_users', description: 'Manage user\'s blocked users list' }
      ],
      'Channel Management': [
        { scope: 'channel:read:subscriptions', description: 'View channel subscription information' },
        { scope: 'channel:read:stream_key', description: 'View channel stream key' },
        { scope: 'channel:manage:broadcast', description: 'Manage channel broadcast configuration' },
        { scope: 'channel:manage:extensions', description: 'Manage channel extensions' },
        { scope: 'channel:manage:moderators', description: 'Add or remove channel moderators' },
        { scope: 'channel:manage:polls', description: 'Manage channel polls' },
        { scope: 'channel:manage:predictions', description: 'Manage channel predictions' },
        { scope: 'channel:manage:raids', description: 'Start raids on other channels' },
        { scope: 'channel:manage:redemptions', description: 'Manage channel point redemptions' },
        { scope: 'channel:manage:schedule', description: 'Manage channel schedule' },
        { scope: 'channel:manage:videos', description: 'Manage channel videos' },
        { scope: 'channel:manage:vips', description: 'Add or remove channel VIPs' }
      ],
      'Chat & Moderation': [
        { scope: 'chat:edit', description: 'Send live stream chat messages' },
        { scope: 'chat:read', description: 'View live stream chat messages' },
        { scope: 'moderator:read:blocked_terms', description: 'View blocked terms (as moderator)' },
        { scope: 'moderator:manage:blocked_terms', description: 'Manage blocked terms (as moderator)' },
        { scope: 'moderator:read:automod_settings', description: 'View AutoMod settings (as moderator)' },
        { scope: 'moderator:manage:automod_settings', description: 'Manage AutoMod settings (as moderator)' },
        { scope: 'moderator:read:chat_settings', description: 'View chat settings (as moderator)' },
        { scope: 'moderator:manage:chat_settings', description: 'Manage chat settings (as moderator)' }
      ],
      'Analytics & Insights': [
        { scope: 'analytics:read:extensions', description: 'View extension analytics' },
        { scope: 'analytics:read:games', description: 'View game analytics' },
        { scope: 'bits:read', description: 'View Bits information' },
        { scope: 'channel:read:charity', description: 'Read charity campaign information' },
        { scope: 'channel:read:goals', description: 'Read channel goals' },
        { scope: 'channel:read:hype_train', description: 'View hype train information' }
      ],
      'Clips & Videos': [
        { scope: 'clips:edit', description: 'Manage clips' },
        { scope: 'channel:read:editors', description: 'View channel editors' },
        { scope: 'channel:manage:guest_star', description: 'Manage guest star sessions' },
        { scope: 'channel:read:guest_star', description: 'Read guest star information' }
      ]
    }
  },
  
  slack: {
    name: 'Slack',
    emoji: '💬',
    categories: {
      'User Identity': [
        { scope: 'identity.basic', description: 'View user\'s basic profile info' },
        { scope: 'identity.email', description: 'View user\'s email address' },
        { scope: 'identity.avatar', description: 'View user\'s profile picture' },
        { scope: 'identity.team', description: 'View user\'s workspace/team info' }
      ],
      'Channels & Conversations': [
        { scope: 'channels:read', description: 'View basic information about public channels' },
        { scope: 'channels:write', description: 'Manage public channels' },
        { scope: 'channels:history', description: 'View messages and content in public channels' },
        { scope: 'groups:read', description: 'View basic information about private channels' },
        { scope: 'groups:write', description: 'Manage private channels' },
        { scope: 'groups:history', description: 'View messages and content in private channels' },
        { scope: 'im:read', description: 'View basic information about direct messages' },
        { scope: 'im:write', description: 'Start direct messages with people' },
        { scope: 'im:history', description: 'View messages and content in direct messages' },
        { scope: 'mpim:read', description: 'View basic information about group direct messages' },
        { scope: 'mpim:write', description: 'Start group direct messages with people' },
        { scope: 'mpim:history', description: 'View messages and content in group direct messages' }
      ],
      'Messaging': [
        { scope: 'chat:write', description: 'Send messages as user' },
        { scope: 'chat:write:bot', description: 'Send messages as bot user' },
        { scope: 'chat:write:user', description: 'Send messages as authenticated user' }
      ],
      'Files & Content': [
        { scope: 'files:read', description: 'View files shared in channels and conversations' },
        { scope: 'files:write:user', description: 'Upload, edit, and delete files as user' },
        { scope: 'links:read', description: 'View URLs in messages' },
        { scope: 'links:write', description: 'Show previews of URLs in messages' }
      ],
      'Team & Users': [
        { scope: 'users:read', description: 'View people in workspace' },
        { scope: 'users:read.email', description: 'View email addresses of people in workspace' },
        { scope: 'users:write', description: 'Set presence for user' },
        { scope: 'team:read', description: 'View workspace name, domain, and icon' },
        { scope: 'usergroups:read', description: 'View user groups' },
        { scope: 'usergroups:write', description: 'Create and manage user groups' }
      ],
      'Apps & Integrations': [
        { scope: 'commands', description: 'Add shortcuts and/or slash commands' },
        { scope: 'incoming-webhook', description: 'Post messages to specific channels in Slack' },
        { scope: 'workflow.steps:execute', description: 'Add steps that people can use in Workflow Builder' },
        { scope: 'calls:read', description: 'View information about calls in workspace' },
        { scope: 'calls:write', description: 'Start calls in workspace' }
      ],
      'Reactions & Pins': [
        { scope: 'reactions:read', description: 'View emoji reactions and their associated content' },
        { scope: 'reactions:write', description: 'Add and edit emoji reactions' },
        { scope: 'pins:read', description: 'View pinned content in channels and conversations' },
        { scope: 'pins:write', description: 'Add and remove pinned messages and files' }
      ],
      'Search & Stars': [
        { scope: 'search:read', description: 'Search workspace\'s content' },
        { scope: 'stars:read', description: 'View starred items' },
        { scope: 'stars:write', description: 'Add or remove stars' }
      ],
      'Reminders & DND': [
        { scope: 'reminders:read', description: 'View reminders created by user' },
        { scope: 'reminders:write', description: 'Add, remove, or mark reminders as complete' },
        { scope: 'dnd:read', description: 'View Do Not Disturb settings' },
        { scope: 'dnd:write', description: 'Edit Do Not Disturb settings' }
      ]
    }
  },
  
  microsoft: {
    name: 'Microsoft',
    emoji: '🏢',
    categories: {
      'User Profile': [
        { scope: 'openid', description: 'Sign in and read user profile' },
        { scope: 'profile', description: 'Read user\'s basic profile' },
        { scope: 'email', description: 'Read user\'s email address' },
        { scope: 'offline_access', description: 'Maintain access to data' },
        { scope: 'User.Read', description: 'Read user profile' },
        { scope: 'User.ReadWrite', description: 'Read and write user profile' },
        { scope: 'User.ReadBasic.All', description: 'Read all users\' basic profiles' },
        { scope: 'User.Read.All', description: 'Read all users\' full profiles' },
        { scope: 'User.ReadWrite.All', description: 'Read and write all users\' full profiles' }
      ],
      'Mail & Calendar': [
        { scope: 'Mail.Read', description: 'Read user mail' },
        { scope: 'Mail.ReadWrite', description: 'Read and write user mail' },
        { scope: 'Mail.Read.Shared', description: 'Read user and shared mail' },
        { scope: 'Mail.ReadWrite.Shared', description: 'Read and write user and shared mail' },
        { scope: 'Mail.Send', description: 'Send mail as user' },
        { scope: 'Mail.Send.Shared', description: 'Send mail on behalf of others' },
        { scope: 'Calendars.Read', description: 'Read user calendars' },
        { scope: 'Calendars.ReadWrite', description: 'Read and write user calendars' },
        { scope: 'Calendars.Read.Shared', description: 'Read user and shared calendars' },
        { scope: 'Calendars.ReadWrite.Shared', description: 'Read and write user and shared calendars' }
      ],
      'Files & OneDrive': [
        { scope: 'Files.Read', description: 'Read user files' },
        { scope: 'Files.ReadWrite', description: 'Read and write user files' },
        { scope: 'Files.Read.All', description: 'Read all files user can access' },
        { scope: 'Files.ReadWrite.All', description: 'Read and write all files user can access' },
        { scope: 'Files.Read.Selected', description: 'Read files user selects' },
        { scope: 'Files.ReadWrite.Selected', description: 'Read and write files user selects' }
      ],
      'Contacts & People': [
        { scope: 'Contacts.Read', description: 'Read user contacts' },
        { scope: 'Contacts.ReadWrite', description: 'Read and write user contacts' },
        { scope: 'Contacts.Read.Shared', description: 'Read user and shared contacts' },
        { scope: 'Contacts.ReadWrite.Shared', description: 'Read and write user and shared contacts' },
        { scope: 'People.Read', description: 'Read users\' relevant people lists' },
        { scope: 'People.Read.All', description: 'Read all users\' relevant people lists' }
      ],
      'Teams & Groups': [
        { scope: 'Group.Read.All', description: 'Read all groups' },
        { scope: 'Group.ReadWrite.All', description: 'Read and write all groups' },
        { scope: 'Directory.Read.All', description: 'Read directory data' },
        { scope: 'Directory.ReadWrite.All', description: 'Read and write directory data' },
        { scope: 'Directory.AccessAsUser.All', description: 'Access directory as signed-in user' }
      ],
      'Tasks & Notes': [
        { scope: 'Tasks.Read', description: 'Read user tasks' },
        { scope: 'Tasks.ReadWrite', description: 'Read and write user tasks' },
        { scope: 'Tasks.Read.Shared', description: 'Read user and shared tasks' },
        { scope: 'Tasks.ReadWrite.Shared', description: 'Read and write user and shared tasks' },
        { scope: 'Notes.Read', description: 'Read user OneNote notebooks' },
        { scope: 'Notes.ReadWrite', description: 'Read and write user OneNote notebooks' },
        { scope: 'Notes.Create', description: 'Create user OneNote notebooks' },
        { scope: 'Notes.Read.All', description: 'Read all OneNote notebooks user can access' },
        { scope: 'Notes.ReadWrite.All', description: 'Read and write all OneNote notebooks user can access' }
      ],
      'Sites & Applications': [
        { scope: 'Sites.Read.All', description: 'Read items in all site collections' },
        { scope: 'Sites.ReadWrite.All', description: 'Read and write items in all site collections' },
        { scope: 'Sites.Manage.All', description: 'Create, edit, and delete items and lists in all site collections' },
        { scope: 'Sites.FullControl.All', description: 'Have full control of all site collections' },
        { scope: 'Application.Read.All', description: 'Read applications' },
        { scope: 'Application.ReadWrite.All', description: 'Read and write applications' }
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