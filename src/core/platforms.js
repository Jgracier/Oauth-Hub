/**
 * 🎯 UNIFIED PLATFORM SYSTEM
 * All OAuth platform configurations AND handlers in one place
 * 
 * Adding a new platform requires changes to ONLY this file:
 * 1. Add platform configuration
 * 2. Add platform-specific handlers (if needed)
 * 
 * Everything else (UI, routing, storage) works automatically!
 */

export const PLATFORMS = {
  google: {
    name: 'Google',
    displayName: 'Google',
    icon: '🔍',
    color: '#4285f4',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
    userIdField: 'id',
    docsUrl: 'https://console.cloud.google.com/',
    description: 'Access Google services like YouTube, Drive, Gmail',
    requiredScopes: ['openid', 'email', 'profile'],
    scopeDelimiter: ' ', // Space-delimited
    additionalParams: {
      access_type: 'offline', // For refresh tokens
      prompt: 'consent' // Force consent screen
    },
    scopes: {
      'Authentication': {
        'openid': { name: 'OpenID Connect', description: 'Associate you with your personal info on Google', required: true },
        'email': { name: 'Email Address', description: 'See your primary Google Account email address', required: true },
        'profile': { name: 'Basic Profile', description: 'See your personal info, including any personal info you\'ve made publicly available', required: true }
      },
      'Drive': {
        'https://www.googleapis.com/auth/drive': { name: 'Google Drive', description: 'See, edit, create, and delete all of your Google Drive files' },
        'https://www.googleapis.com/auth/drive.readonly': { name: 'Google Drive (Read-only)', description: 'View your Google Drive files' },
        'https://www.googleapis.com/auth/drive.file': { name: 'Google Drive Files', description: 'View and manage Google Drive files and folders that you have opened or created with this app' },
        'https://www.googleapis.com/auth/drive.metadata': { name: 'Google Drive Metadata', description: 'View and manage metadata of files in your Google Drive' },
        'https://www.googleapis.com/auth/drive.metadata.readonly': { name: 'Google Drive Metadata (Read-only)', description: 'View metadata for files in your Google Drive' },
        'https://www.googleapis.com/auth/drive.photos.readonly': { name: 'Google Drive Photos (Read-only)', description: 'View the photos, videos and albums in your Google Photos' },
        'https://www.googleapis.com/auth/drive.scripts': { name: 'Google Drive Scripts', description: 'Modify your Google Apps Script scripts\' behavior' },
        'https://www.googleapis.com/auth/drive.appdata': { name: 'Google Drive App Data', description: 'View and manage its own configuration data in your Google Drive' },
        'https://www.googleapis.com/auth/drive.activity': { name: 'Google Drive Activity', description: 'View and add to the activity record of files in your Google Drive' },
        'https://www.googleapis.com/auth/drive.activity.readonly': { name: 'Google Drive Activity (Read-only)', description: 'View the activity record of files in your Google Drive' }
      },
      'YouTube': {
        'https://www.googleapis.com/auth/youtube': { name: 'YouTube', description: 'Manage your YouTube account' },
        'https://www.googleapis.com/auth/youtube.readonly': { name: 'YouTube (Read-only)', description: 'View your YouTube account' },
        'https://www.googleapis.com/auth/youtube.upload': { name: 'YouTube Upload', description: 'Upload YouTube videos and manage your YouTube videos' },
        'https://www.googleapis.com/auth/youtube.force-ssl': { name: 'YouTube SSL', description: 'See, edit, and permanently delete your YouTube videos, ratings, comments and captions' },
        'https://www.googleapis.com/auth/youtube.channel-memberships.creator': { name: 'YouTube Channel Memberships', description: 'See a list of your current active channel members, their current level, and when they became a member' },
        'https://www.googleapis.com/auth/youtubepartner': { name: 'YouTube Partner', description: 'View and manage your assets and associated content on YouTube' },
        'https://www.googleapis.com/auth/youtubepartner-channel-audit': { name: 'YouTube Partner Channel Audit', description: 'View private information of your YouTube channel relevant during the audit process with a YouTube partner' }
      },
      'Gmail': {
        'https://www.googleapis.com/auth/gmail.readonly': { name: 'Gmail (Read-only)', description: 'View your email messages and settings' },
        'https://www.googleapis.com/auth/gmail.modify': { name: 'Gmail Modify', description: 'View and modify but not delete your email' },
        'https://www.googleapis.com/auth/gmail.compose': { name: 'Gmail Compose', description: 'Manage drafts and send emails' },
        'https://www.googleapis.com/auth/gmail.send': { name: 'Gmail Send', description: 'Send email on your behalf' },
        'https://www.googleapis.com/auth/gmail.labels': { name: 'Gmail Labels', description: 'Manage mailbox labels' },
        'https://www.googleapis.com/auth/gmail.insert': { name: 'Gmail Insert', description: 'Insert mail into your mailbox' },
        'https://www.googleapis.com/auth/gmail.metadata': { name: 'Gmail Metadata', description: 'View your email message metadata such as labels and headers, but not the email body' },
        'https://www.googleapis.com/auth/gmail.settings.basic': { name: 'Gmail Settings Basic', description: 'Manage your basic mail settings' },
        'https://www.googleapis.com/auth/gmail.settings.sharing': { name: 'Gmail Settings Sharing', description: 'Manage your sensitive mail settings, including who can manage your mail' }
      },
      'Calendar': {
        'https://www.googleapis.com/auth/calendar': { name: 'Google Calendar', description: 'See, edit, share, and permanently delete all the calendars you can access using Google Calendar' },
        'https://www.googleapis.com/auth/calendar.readonly': { name: 'Google Calendar (Read-only)', description: 'View your calendars' },
        'https://www.googleapis.com/auth/calendar.events': { name: 'Google Calendar Events', description: 'View and edit events on all your calendars' },
        'https://www.googleapis.com/auth/calendar.events.readonly': { name: 'Google Calendar Events (Read-only)', description: 'View events on all your calendars' },
        'https://www.googleapis.com/auth/calendar.settings.readonly': { name: 'Google Calendar Settings (Read-only)', description: 'View your Calendar settings' }
      },
      'Analytics': {
        'https://www.googleapis.com/auth/analytics.readonly': { name: 'Google Analytics (Read-only)', description: 'View your Google Analytics data' },
        'https://www.googleapis.com/auth/analytics': { name: 'Google Analytics', description: 'View and manage your Google Analytics data' },
        'https://www.googleapis.com/auth/analytics.edit': { name: 'Google Analytics Edit', description: 'Edit Google Analytics management entities' },
        'https://www.googleapis.com/auth/analytics.manage.users': { name: 'Google Analytics Manage Users', description: 'Manage Google Analytics Account users by email address' },
        'https://www.googleapis.com/auth/analytics.manage.users.readonly': { name: 'Google Analytics Manage Users (Read-only)', description: 'View Google Analytics user permissions' },
        'https://www.googleapis.com/auth/analytics.provision': { name: 'Google Analytics Provision', description: 'Create a new Google Analytics account along with its default property and view' }
      },
      'Sheets': {
        'https://www.googleapis.com/auth/spreadsheets': { name: 'Google Sheets', description: 'See, edit, create, and delete your spreadsheets in Google Drive' },
        'https://www.googleapis.com/auth/spreadsheets.readonly': { name: 'Google Sheets (Read-only)', description: 'View your Google Spreadsheets' }
      },
      'Docs': {
        'https://www.googleapis.com/auth/documents': { name: 'Google Docs', description: 'See, edit, create, and delete all your Google Docs documents' },
        'https://www.googleapis.com/auth/documents.readonly': { name: 'Google Docs (Read-only)', description: 'View your Google Docs documents' }
      },
      'Photos': {
        'https://www.googleapis.com/auth/photoslibrary': { name: 'Google Photos', description: 'View and manage your Google Photos library' },
        'https://www.googleapis.com/auth/photoslibrary.readonly': { name: 'Google Photos (Read-only)', description: 'View your Google Photos library' },
        'https://www.googleapis.com/auth/photoslibrary.readonly.appcreateddata': { name: 'Google Photos App Data (Read-only)', description: 'Manage photos added by this app' },
        'https://www.googleapis.com/auth/photoslibrary.appendonly': { name: 'Google Photos Append Only', description: 'Add to your Google Photos library' },
        'https://www.googleapis.com/auth/photoslibrary.sharing': { name: 'Google Photos Sharing', description: 'Manage and add to shared albums on your behalf' }
      },
      'Contacts': {
        'https://www.googleapis.com/auth/contacts': { name: 'Google Contacts', description: 'See, edit, download, and permanently delete your contacts' },
        'https://www.googleapis.com/auth/contacts.readonly': { name: 'Google Contacts (Read-only)', description: 'View your contacts' }
      },
      'Cloud Platform': {
        'https://www.googleapis.com/auth/cloud-platform': { name: 'Google Cloud Platform', description: 'View and manage your data across Google Cloud Platform services' },
        'https://www.googleapis.com/auth/cloud-platform.read-only': { name: 'Google Cloud Platform (Read-only)', description: 'View your data across Google Cloud Platform services' }
      },
      'Maps': {
        'https://www.googleapis.com/auth/maps.readonly': { name: 'Google Maps (Read-only)', description: 'View your Google Maps activity' }
      },
      'Fitness': {
        'https://www.googleapis.com/auth/fitness.activity.read': { name: 'Google Fit Activity (Read-only)', description: 'View your fitness activity' },
        'https://www.googleapis.com/auth/fitness.activity.write': { name: 'Google Fit Activity Write', description: 'Add to your fitness activity data' },
        'https://www.googleapis.com/auth/fitness.body.read': { name: 'Google Fit Body (Read-only)', description: 'View body sensor information in Google Fit' },
        'https://www.googleapis.com/auth/fitness.body.write': { name: 'Google Fit Body Write', description: 'Add body sensor information to Google Fit' },
        'https://www.googleapis.com/auth/fitness.location.read': { name: 'Google Fit Location (Read-only)', description: 'View your stored location data in Google Fit' },
        'https://www.googleapis.com/auth/fitness.location.write': { name: 'Google Fit Location Write', description: 'Add location data to Google Fit' }
      }
    }
  },

  facebook: {
    name: 'Facebook',
    displayName: 'Facebook',
    icon: '📘',
    color: '#1877f2',
    authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
    userInfoUrl: 'https://graph.facebook.com/me?fields=id,name,email',
    userIdField: 'id',
    docsUrl: 'https://developers.facebook.com/',
    description: 'Access Facebook Graph API for posts, pages, and user data',
    requiredScopes: ['public_profile', 'email'],
    scopeDelimiter: ',', // Comma-delimited
    additionalParams: {
      response_type: 'code',
      access_type: 'offline' // For refresh tokens
    },
    scopes: {
      'Basic': {
        'public_profile': { name: 'Public Profile', description: 'Access public profile information', required: true },
        'email': { name: 'Email Address', description: 'Access email address', required: true }
      },
      'User Data': {
        'user_friends': { name: 'User Friends', description: 'Access friends list' },
        'user_birthday': { name: 'User Birthday', description: 'Access birthday information' },
        'user_hometown': { name: 'User Hometown', description: 'Access hometown information' },
        'user_location': { name: 'User Location', description: 'Access current city information' },
        'user_likes': { name: 'User Likes', description: 'Access list of all the pages this person has liked' },
        'user_photos': { name: 'User Photos', description: 'Access photos the person is tagged in or uploaded' },
        'user_posts': { name: 'User Posts', description: 'Access posts on the person\'s timeline' },
        'user_videos': { name: 'User Videos', description: 'Access videos the person is tagged in or uploaded' },
        'user_events': { name: 'User Events', description: 'Access list of events the person is attending' },
        'user_groups': { name: 'User Groups', description: 'Access list of groups the person is a member of' }
      },
      'Pages': {
        'pages_show_list': { name: 'Pages Show List', description: 'Access list of pages you manage' },
        'pages_read_engagement': { name: 'Pages Read Engagement', description: 'Read page posts and engagement data' },
        'pages_manage_posts': { name: 'Pages Manage Posts', description: 'Create, edit and delete page posts' },
        'pages_manage_metadata': { name: 'Pages Manage Metadata', description: 'Manage page settings and metadata' },
        'pages_read_user_content': { name: 'Pages Read User Content', description: 'Read content posted by users on your pages' },
        'pages_manage_ads': { name: 'Pages Manage Ads', description: 'Manage ads for your pages' },
        'pages_manage_instant_articles': { name: 'Pages Manage Instant Articles', description: 'Manage Instant Articles for your pages' },
        'pages_messaging': { name: 'Pages Messaging', description: 'Send and receive messages on behalf of your pages' },
        'pages_messaging_subscriptions': { name: 'Pages Messaging Subscriptions', description: 'Subscribe to messaging webhooks for your pages' }
      },
      'Instagram': {
        'instagram_basic': { name: 'Instagram Basic', description: 'Access Instagram account information' },
        'instagram_content_publish': { name: 'Instagram Content Publish', description: 'Publish content to Instagram' },
        'instagram_manage_comments': { name: 'Instagram Manage Comments', description: 'Manage comments on Instagram posts' },
        'instagram_manage_insights': { name: 'Instagram Manage Insights', description: 'Access Instagram insights and analytics' },
        'instagram_shopping_tag_products': { name: 'Instagram Shopping Tag Products', description: 'Tag products in Instagram posts' }
      },
      'Business': {
        'business_management': { name: 'Business Management', description: 'Manage business assets' },
        'ads_management': { name: 'Ads Management', description: 'Manage ad accounts and campaigns' },
        'ads_read': { name: 'Ads Read', description: 'Read ad account data' },
        'catalog_management': { name: 'Catalog Management', description: 'Manage product catalogs' },
        'leads_retrieval': { name: 'Leads Retrieval', description: 'Retrieve leads from lead ads' },
        'whatsapp_business_management': { name: 'WhatsApp Business Management', description: 'Manage WhatsApp Business accounts' },
        'whatsapp_business_messaging': { name: 'WhatsApp Business Messaging', description: 'Send messages via WhatsApp Business' }
      },
      'Gaming': {
        'gaming_user_locale': { name: 'Gaming User Locale', description: 'Access user locale for gaming' },
        'user_age_range': { name: 'User Age Range', description: 'Access user age range information' }
      },
      'Research': {
        'research_apis': { name: 'Research APIs', description: 'Access to research APIs (requires approval)' }
      }
    }
  },

  instagram: {
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
    scopeDelimiter: ',', // Comma-delimited
    additionalParams: {
      response_type: 'code'
    },
    scopes: {
      'Basic': {
        'user_profile': { name: 'User Profile', description: 'Access profile information', required: true }
      },
      'Media': {
        'user_media': { name: 'User Media', description: 'Access media (photos and videos)' }
      }
    }
  },

  twitter: {
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
  },

  linkedin: {
    name: 'LinkedIn',
    displayName: 'LinkedIn',
    icon: '💼',
    color: '#0077b5',
    authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
    userInfoUrl: 'https://api.linkedin.com/v2/userinfo',
    userIdField: 'sub',
    docsUrl: 'https://developer.linkedin.com/',
    description: 'Access LinkedIn APIs for profile and company data',
    requiredScopes: ['openid', 'profile', 'email'],
    scopeDelimiter: ' ', // Space-delimited
    additionalParams: {
      response_type: 'code'
    },
    scopes: {
      'Authentication': {
        'openid': { name: 'OpenID Connect', description: 'OpenID Connect authentication', required: true },
        'profile': { name: 'Profile', description: 'Access basic profile information', required: true },
        'email': { name: 'Email', description: 'Access email address', required: true }
      },
      'Member Profile': {
        'r_liteprofile': { name: 'Lite Profile', description: 'Access basic profile information' },
        'r_basicprofile': { name: 'Basic Profile', description: 'Access full basic profile information' },
        'r_fullprofile': { name: 'Full Profile', description: 'Access complete profile information' },
        'r_contactinfo': { name: 'Contact Info', description: 'Access contact information' }
      },
      'Member Social': {
        'w_member_social': { name: 'Member Social Write', description: 'Post updates on behalf of user' },
        'r_member_social': { name: 'Member Social Read', description: 'Read member social activity' }
      },
      'Company Pages': {
        'rw_company_admin': { name: 'Company Admin', description: 'Administer company pages' },
        'r_organization_social': { name: 'Organization Social Read', description: 'Read organization social activity' },
        'w_organization_social': { name: 'Organization Social Write', description: 'Post on behalf of organization' },
        'rw_organization_admin': { name: 'Organization Admin', description: 'Administer organization pages' }
      },
      'Advertising': {
        'r_ads': { name: 'Ads Read', description: 'Read advertising account information' },
        'rw_ads': { name: 'Ads Read/Write', description: 'Manage advertising campaigns' },
        'r_ads_reporting': { name: 'Ads Reporting', description: 'Access advertising reports' }
      },
      'Marketing': {
        'r_marketing_leadgen_automation': { name: 'Lead Gen Automation Read', description: 'Read lead generation automation data' },
        'rw_marketing_leadgen_automation': { name: 'Lead Gen Automation Write', description: 'Manage lead generation automation' }
      },
      'Compliance': {
        'r_compliance': { name: 'Compliance Read', description: 'Access compliance data for regulatory purposes' }
      }
    }
  },

  tiktok: {
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
    scopeDelimiter: ',', // Comma-delimited
    additionalParams: {
      response_type: 'code'
    },
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
  },

  discord: {
    name: 'Discord',
    displayName: 'Discord',
    icon: '🎮',
    color: '#5865f2',
    authUrl: 'https://discord.com/api/oauth2/authorize',
    tokenUrl: 'https://discord.com/api/oauth2/token',
    userInfoUrl: 'https://discord.com/api/users/@me',
    userIdField: 'id',
    docsUrl: 'https://discord.com/developers/',
    description: 'Access Discord API for bot and user functionality',
    requiredScopes: ['identify'],
    scopeDelimiter: ' ', // Space-delimited
    additionalParams: {
      response_type: 'code'
    },
    scopes: {
      'User': {
        'identify': { name: 'Identify', description: 'Access basic user information', required: true },
        'email': { name: 'Email', description: 'Access email address' },
        'connections': { name: 'Connections', description: 'Access linked third-party accounts' }
      },
      'Guilds': {
        'guilds': { name: 'Guilds', description: 'Access list of guilds user is in' },
        'guilds.join': { name: 'Guilds Join', description: 'Join guilds on behalf of user' },
        'guilds.members.read': { name: 'Guild Members Read', description: 'Read guild member information' }
      },
      'Bot': {
        'bot': { name: 'Bot', description: 'Add bot to guild with basic permissions' },
        'applications.builds.upload': { name: 'Application Builds Upload', description: 'Upload application builds' },
        'applications.builds.read': { name: 'Application Builds Read', description: 'Read application builds' },
        'applications.store.update': { name: 'Application Store Update', description: 'Update store information' },
        'applications.entitlements': { name: 'Application Entitlements', description: 'Read entitlements for applications' }
      },
      'Activities': {
        'activities.read': { name: 'Activities Read', description: 'Read user activities' },
        'activities.write': { name: 'Activities Write', description: 'Update user activities' }
      },
      'Relationships': {
        'relationships.read': { name: 'Relationships Read', description: 'Read user relationships (friends)' }
      },
      'RPC': {
        'rpc': { name: 'RPC', description: 'Control user client via RPC' },
        'rpc.notifications.read': { name: 'RPC Notifications Read', description: 'Receive notifications via RPC' },
        'rpc.voice.read': { name: 'RPC Voice Read', description: 'Read voice state via RPC' },
        'rpc.voice.write': { name: 'RPC Voice Write', description: 'Control voice state via RPC' },
        'rpc.activities.write': { name: 'RPC Activities Write', description: 'Update activities via RPC' }
      },
      'Webhooks': {
        'webhook.incoming': { name: 'Webhook Incoming', description: 'Create incoming webhooks' }
      },
      'Messages': {
        'messages.read': { name: 'Messages Read', description: 'Read message history' }
      }
    }
  },

  pinterest: {
    name: 'Pinterest',
    displayName: 'Pinterest',
    icon: '📌',
    color: '#bd081c',
    authUrl: 'https://www.pinterest.com/oauth/',
    tokenUrl: 'https://api.pinterest.com/v5/oauth/token',
    userInfoUrl: 'https://api.pinterest.com/v5/user_account',
    userIdField: 'id',
    docsUrl: 'https://developers.pinterest.com/',
    description: 'Access Pinterest API for boards and pins',
    requiredScopes: ['user_accounts:read'],
    scopeDelimiter: ',',
    additionalParams: { response_type: 'code' },
    scopes: {
      'User Account': {
        'user_accounts:read': { name: 'User Account Read', description: 'Read user account information', required: true }
      },
      'Boards': {
        'boards:read': { name: 'Boards Read', description: 'Read boards and board information' },
        'boards:write': { name: 'Boards Write', description: 'Create, edit, and delete boards' },
        'boards:read_secret': { name: 'Boards Read Secret', description: 'Read secret boards' },
        'boards:write_secret': { name: 'Boards Write Secret', description: 'Create and edit secret boards' }
      },
      'Pins': {
        'pins:read': { name: 'Pins Read', description: 'Read pins and pin information' },
        'pins:write': { name: 'Pins Write', description: 'Create, edit, and delete pins' },
        'pins:read_secret': { name: 'Pins Read Secret', description: 'Read secret pins' },
        'pins:write_secret': { name: 'Pins Write Secret', description: 'Create and edit secret pins' }
      },
      'Advertising': {
        'ads:read': { name: 'Ads Read', description: 'Read advertising account information' },
        'ads:write': { name: 'Ads Write', description: 'Create and manage advertising campaigns' }
      },
      'Catalogs': {
        'catalogs:read': { name: 'Catalogs Read', description: 'Read product catalog information' },
        'catalogs:write': { name: 'Catalogs Write', description: 'Create and manage product catalogs' }
      }
    }
  },

  wordpress: {
    name: 'WordPress',
    displayName: 'WordPress.com',
    icon: '📝',
    color: '#21759b',
    authUrl: 'https://public-api.wordpress.com/oauth2/authorize',
    tokenUrl: 'https://public-api.wordpress.com/oauth2/token',
    userInfoUrl: 'https://public-api.wordpress.com/rest/v1/me',
    userIdField: 'ID',
    docsUrl: 'https://developer.wordpress.com/apps/',
    description: 'Access WordPress.com API for sites and posts',
    requiredScopes: ['auth'],
    scopeDelimiter: ' ',
    additionalParams: { response_type: 'code' },
    scopes: {
      'Authentication': {
        'auth': { name: 'Authentication', description: 'Authenticate and access basic profile', required: true }
      },
      'Site Management': {
        'global': { name: 'Global Access', description: 'Access all sites and perform all actions' }
      }
    }
  },

  reddit: {
    name: 'Reddit',
    displayName: 'Reddit',
    icon: '🤖',
    color: '#ff4500',
    authUrl: 'https://www.reddit.com/api/v1/authorize',
    tokenUrl: 'https://www.reddit.com/api/v1/access_token',
    userInfoUrl: 'https://oauth.reddit.com/api/v1/me',
    userIdField: 'id',
    docsUrl: 'https://www.reddit.com/dev/api/',
    description: 'Access Reddit API for posts and user data',
    requiredScopes: ['identity'],
    scopeDelimiter: ' ',
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
  },

  github: {
    name: 'GitHub',
    displayName: 'GitHub',
    icon: '🐙',
    color: '#333333',
    authUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    userInfoUrl: 'https://api.github.com/user',
    userIdField: 'id',
    docsUrl: 'https://github.com/settings/developers',
    description: 'Access GitHub API for repositories and user data',
    requiredScopes: ['user:email'],
    scopeDelimiter: ' ',
    additionalParams: { 
      response_type: 'code',
      access_type: 'offline'
    },
    scopes: {
      'User': {
        'user': { name: 'User Profile', description: 'Grants read/write access to profile info only' },
        'user:email': { name: 'User Email', description: 'Grants read access to a user\'s email addresses', required: true },
        'user:follow': { name: 'User Follow', description: 'Grants access to follow or unfollow other users' },
        'read:user': { name: 'Read User', description: 'Grants access to read a user\'s profile data' }
      },
      'Repository': {
        'repo': { name: 'Full Repository Access', description: 'Grants read/write access to code, commit statuses, repository projects, collaborators, and deployment statuses for public and private repositories and organizations' },
        'public_repo': { name: 'Public Repository Access', description: 'Grants read/write access to code, commit statuses, collaborators, and deployment statuses for public repositories and organizations' },
        'repo:status': { name: 'Repository Status', description: 'Grants read/write access to public and private repository commit statuses' },
        'repo_deployment': { name: 'Repository Deployment', description: 'Grants access to deployment statuses for public and private repositories' },
        'repo:invite': { name: 'Repository Invite', description: 'Grants accept/decline abilities for invitations to collaborate on a repository' },
        'security_events': { name: 'Security Events', description: 'Grants read and write access to security events in the code scanning API' }
      },
      'Organizations': {
        'read:org': { name: 'Read Organization', description: 'Read-only access to organization membership, organization member teams, and organization projects' },
        'write:org': { name: 'Write Organization', description: 'Publicize and unpublicize organization membership' },
        'admin:org': { name: 'Admin Organization', description: 'Fully manage the organization and its teams, projects, and memberships' },
        'admin:org_hook': { name: 'Admin Organization Hook', description: 'Grants read, write, ping, and delete access to organization hooks' }
      },
      'Public Key': {
        'admin:public_key': { name: 'Admin Public Key', description: 'Fully manage public keys' },
        'write:public_key': { name: 'Write Public Key', description: 'Create, list, and view details for public keys' },
        'read:public_key': { name: 'Read Public Key', description: 'List and view details for public keys' }
      },
      'Repository Hooks': {
        'admin:repo_hook': { name: 'Admin Repository Hook', description: 'Grants read, write, ping, and delete access to repository hooks in public or private repositories' },
        'write:repo_hook': { name: 'Write Repository Hook', description: 'Grants read, write, and ping access to hooks in public or private repositories' },
        'read:repo_hook': { name: 'Read Repository Hook', description: 'Grants read and ping access to hooks in public or private repositories' }
      },
      'Gists': {
        'gist': { name: 'Gist', description: 'Grants write access to gists' }
      },
      'Notifications': {
        'notifications': { name: 'Notifications', description: 'Grants read access to a user\'s notifications' }
      },
      'Discussions': {
        'read:discussion': { name: 'Read Discussion', description: 'Allows read access to discussions' },
        'write:discussion': { name: 'Write Discussion', description: 'Allows read and write access to discussions' }
      },
      'Packages': {
        'read:packages': { name: 'Read Packages', description: 'Download packages from GitHub Package Registry' },
        'write:packages': { name: 'Write Packages', description: 'Upload packages to GitHub Package Registry' },
        'delete:packages': { name: 'Delete Packages', description: 'Delete packages from GitHub Package Registry' }
      },
      'GPG Keys': {
        'admin:gpg_key': { name: 'Admin GPG Key', description: 'Fully manage GPG keys' },
        'write:gpg_key': { name: 'Write GPG Key', description: 'Create, list, and view details for GPG keys' },
        'read:gpg_key': { name: 'Read GPG Key', description: 'List and view details for GPG keys' }
      },
      'Codespaces': {
        'codespace': { name: 'Codespace', description: 'Grants the ability to create and manage codespaces' }
      },
      'Projects': {
        'project': { name: 'Project', description: 'Grants read/write access to user and organization projects' },
        'read:project': { name: 'Read Project', description: 'Grants read only access to user and organization projects' }
      }
    }
  },

  spotify: {
    name: 'Spotify',
    displayName: 'Spotify',
    icon: '🎵',
    color: '#1db954',
    authUrl: 'https://accounts.spotify.com/authorize',
    tokenUrl: 'https://accounts.spotify.com/api/token',
    userInfoUrl: 'https://api.spotify.com/v1/me',
    userIdField: 'id',
    docsUrl: 'https://developer.spotify.com/dashboard',
    description: 'Access Spotify Web API for music and playlists',
    requiredScopes: ['user-read-private'],
    scopeDelimiter: ' ',
    additionalParams: { response_type: 'code' },
    scopes: {
      'User Profile': {
        'user-read-private': { name: 'User Read Private', description: 'Access user profile information', required: true },
        'user-read-email': { name: 'User Read Email', description: 'Access user email address' }
      },
      'Playlists': {
        'playlist-read-private': { name: 'Playlist Read Private', description: 'Read private playlists' },
        'playlist-read-collaborative': { name: 'Playlist Read Collaborative', description: 'Read collaborative playlists' },
        'playlist-modify-public': { name: 'Playlist Modify Public', description: 'Create and modify public playlists' },
        'playlist-modify-private': { name: 'Playlist Modify Private', description: 'Create and modify private playlists' }
      },
      'Library': {
        'user-library-read': { name: 'User Library Read', description: 'Read saved tracks and albums' },
        'user-library-modify': { name: 'User Library Modify', description: 'Manage saved tracks and albums' }
      },
      'Listening History': {
        'user-read-recently-played': { name: 'User Read Recently Played', description: 'Read recently played tracks' },
        'user-top-read': { name: 'User Top Read', description: 'Read top artists and tracks' },
        'user-read-playback-position': { name: 'User Read Playback Position', description: 'Read playback position in episodes' }
      },
      'Playback Control': {
        'user-read-playback-state': { name: 'User Read Playback State', description: 'Read current playback state' },
        'user-modify-playback-state': { name: 'User Modify Playback State', description: 'Control playback (play, pause, skip, etc.)' },
        'user-read-currently-playing': { name: 'User Read Currently Playing', description: 'Read currently playing track' }
      },
      'Following': {
        'user-follow-read': { name: 'User Follow Read', description: 'Read followed artists and users' },
        'user-follow-modify': { name: 'User Follow Modify', description: 'Manage followed artists and users' }
      },
      'Streaming': {
        'streaming': { name: 'Streaming', description: 'Play music and control playback in Spotify apps' }
      },
      'Connect': {
        'app-remote-control': { name: 'App Remote Control', description: 'Control Spotify app remotely' }
      },
      'Images': {
        'ugc-image-upload': { name: 'UGC Image Upload', description: 'Upload custom playlist cover images' }
      }
    }
  },

  twitch: {
    name: 'Twitch',
    displayName: 'Twitch',
    icon: '🎮',
    color: '#9146ff',
    authUrl: 'https://id.twitch.tv/oauth2/authorize',
    tokenUrl: 'https://id.twitch.tv/oauth2/token',
    userInfoUrl: 'https://api.twitch.tv/helix/users',
    userIdField: 'id',
    docsUrl: 'https://dev.twitch.tv/console',
    description: 'Access Twitch API for streams and user data',
    requiredScopes: ['user:read:email'],
    scopeDelimiter: ' ',
    additionalParams: { response_type: 'code' },
    scopes: {
      'User': {
        'user:read:email': { name: 'User Read Email', description: 'Read user email address', required: true },
        'user:read:follows': { name: 'User Read Follows', description: 'Read user follows' },
        'user:read:subscriptions': { name: 'User Read Subscriptions', description: 'Read user subscriptions' },
        'user:read:blocked_users': { name: 'User Read Blocked Users', description: 'Read blocked users' },
        'user:manage:blocked_users': { name: 'User Manage Blocked Users', description: 'Manage blocked users' }
      },
      'Channel': {
        'channel:read:subscriptions': { name: 'Channel Read Subscriptions', description: 'Read channel subscriptions' },
        'channel:read:hype_train': { name: 'Channel Read Hype Train', description: 'Read hype train events' },
        'channel:read:stream_key': { name: 'Channel Read Stream Key', description: 'Read channel stream key' },
        'channel:manage:broadcast': { name: 'Channel Manage Broadcast', description: 'Manage channel broadcast settings' },
        'channel:manage:extensions': { name: 'Channel Manage Extensions', description: 'Manage channel extensions' },
        'channel:manage:moderators': { name: 'Channel Manage Moderators', description: 'Manage channel moderators' },
        'channel:manage:polls': { name: 'Channel Manage Polls', description: 'Manage channel polls' },
        'channel:manage:predictions': { name: 'Channel Manage Predictions', description: 'Manage channel predictions' },
        'channel:manage:raids': { name: 'Channel Manage Raids', description: 'Manage channel raids' },
        'channel:manage:redemptions': { name: 'Channel Manage Redemptions', description: 'Manage channel point redemptions' },
        'channel:manage:schedule': { name: 'Channel Manage Schedule', description: 'Manage channel schedule' },
        'channel:manage:videos': { name: 'Channel Manage Videos', description: 'Manage channel videos' },
        'channel:read:editors': { name: 'Channel Read Editors', description: 'Read channel editors' },
        'channel:manage:ads': { name: 'Channel Manage Ads', description: 'Manage channel ads' }
      },
      'Bits': {
        'bits:read': { name: 'Bits Read', description: 'Read Bits information' }
      },
      'Analytics': {
        'analytics:read:extensions': { name: 'Analytics Read Extensions', description: 'Read extension analytics' },
        'analytics:read:games': { name: 'Analytics Read Games', description: 'Read game analytics' }
      },
      'Clips': {
        'clips:edit': { name: 'Clips Edit', description: 'Create and edit clips' }
      },
      'Moderation': {
        'moderation:read': { name: 'Moderation Read', description: 'Read moderation actions' },
        'moderator:manage:announcements': { name: 'Moderator Manage Announcements', description: 'Manage channel announcements' },
        'moderator:manage:automod': { name: 'Moderator Manage AutoMod', description: 'Manage AutoMod settings' },
        'moderator:manage:automod_settings': { name: 'Moderator Manage AutoMod Settings', description: 'Manage AutoMod configuration' },
        'moderator:manage:banned_users': { name: 'Moderator Manage Banned Users', description: 'Manage banned users' },
        'moderator:manage:chat_messages': { name: 'Moderator Manage Chat Messages', description: 'Manage chat messages' },
        'moderator:manage:chat_settings': { name: 'Moderator Manage Chat Settings', description: 'Manage chat settings' }
      },
      'Chat': {
        'chat:edit': { name: 'Chat Edit', description: 'Send chat messages' },
        'chat:read': { name: 'Chat Read', description: 'Read chat messages' }
      },
      'Whispers': {
        'whispers:read': { name: 'Whispers Read', description: 'Read whisper messages' },
        'whispers:edit': { name: 'Whispers Edit', description: 'Send whisper messages' }
      }
    }
  },

  slack: {
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
  },

  microsoft: {
    name: 'Microsoft',
    displayName: 'Microsoft',
    icon: '🏢',
    color: '#0078d4',
    authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    userInfoUrl: 'https://graph.microsoft.com/v1.0/me',
    userIdField: 'id',
    docsUrl: 'https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps',
    description: 'Access Microsoft Graph API for Office 365 and Azure',
    requiredScopes: ['User.Read'],
    scopeDelimiter: ' ',
    additionalParams: { response_type: 'code' },
    scopes: {
      'User': {
        'User.Read': { name: 'User Read', description: 'Read user profile', required: true },
        'User.ReadWrite': { name: 'User Read Write', description: 'Read and write user profile' },
        'User.ReadBasic.All': { name: 'User Read Basic All', description: 'Read basic profiles of all users' },
        'User.Read.All': { name: 'User Read All', description: 'Read all users\' full profiles' },
        'User.ReadWrite.All': { name: 'User Read Write All', description: 'Read and write all users\' full profiles' }
      },
      'Mail': {
        'Mail.Read': { name: 'Mail Read', description: 'Read user mail' },
        'Mail.ReadWrite': { name: 'Mail Read Write', description: 'Read and write user mail' },
        'Mail.Send': { name: 'Mail Send', description: 'Send mail as user' },
        'Mail.Read.Shared': { name: 'Mail Read Shared', description: 'Read user and shared mail' },
        'Mail.ReadWrite.Shared': { name: 'Mail Read Write Shared', description: 'Read and write user and shared mail' }
      },
      'Files': {
        'Files.Read': { name: 'Files Read', description: 'Read user files' },
        'Files.ReadWrite': { name: 'Files Read Write', description: 'Read and write user files' },
        'Files.Read.All': { name: 'Files Read All', description: 'Read all files that user can access' },
        'Files.ReadWrite.All': { name: 'Files Read Write All', description: 'Read and write all files that user can access' },
        'Files.Read.Selected': { name: 'Files Read Selected', description: 'Read files that the user selects' },
        'Files.ReadWrite.Selected': { name: 'Files Read Write Selected', description: 'Read and write files that the user selects' }
      },
      'Calendars': {
        'Calendars.Read': { name: 'Calendars Read', description: 'Read user calendars' },
        'Calendars.ReadWrite': { name: 'Calendars Read Write', description: 'Read and write user calendars' },
        'Calendars.Read.Shared': { name: 'Calendars Read Shared', description: 'Read user and shared calendars' },
        'Calendars.ReadWrite.Shared': { name: 'Calendars Read Write Shared', description: 'Read and write user and shared calendars' }
      },
      'Contacts': {
        'Contacts.Read': { name: 'Contacts Read', description: 'Read user contacts' },
        'Contacts.ReadWrite': { name: 'Contacts Read Write', description: 'Read and write user contacts' },
        'Contacts.Read.Shared': { name: 'Contacts Read Shared', description: 'Read user and shared contacts' },
        'Contacts.ReadWrite.Shared': { name: 'Contacts Read Write Shared', description: 'Read and write user and shared contacts' }
      },
      'Tasks': {
        'Tasks.Read': { name: 'Tasks Read', description: 'Read user tasks' },
        'Tasks.ReadWrite': { name: 'Tasks Read Write', description: 'Read and write user tasks' },
        'Tasks.Read.Shared': { name: 'Tasks Read Shared', description: 'Read user and shared tasks' },
        'Tasks.ReadWrite.Shared': { name: 'Tasks Read Write Shared', description: 'Read and write user and shared tasks' }
      },
      'Notes': {
        'Notes.Read': { name: 'Notes Read', description: 'Read user OneNote notebooks' },
        'Notes.ReadWrite': { name: 'Notes Read Write', description: 'Read and write user OneNote notebooks' },
        'Notes.Create': { name: 'Notes Create', description: 'Create user OneNote notebooks' },
        'Notes.Read.All': { name: 'Notes Read All', description: 'Read all OneNote notebooks that user can access' },
        'Notes.ReadWrite.All': { name: 'Notes Read Write All', description: 'Read and write all OneNote notebooks that user can access' }
      },
      'Sites': {
        'Sites.Read.All': { name: 'Sites Read All', description: 'Read items in all site collections' },
        'Sites.ReadWrite.All': { name: 'Sites Read Write All', description: 'Read and write items in all site collections' },
        'Sites.Manage.All': { name: 'Sites Manage All', description: 'Create, edit, and delete items and lists in all site collections' },
        'Sites.FullControl.All': { name: 'Sites Full Control All', description: 'Have full control of all site collections' }
      },
      'Groups': {
        'Group.Read.All': { name: 'Group Read All', description: 'Read all groups' },
        'Group.ReadWrite.All': { name: 'Group Read Write All', description: 'Read and write all groups' },
        'GroupMember.Read.All': { name: 'Group Member Read All', description: 'Read group memberships' },
        'GroupMember.ReadWrite.All': { name: 'Group Member Read Write All', description: 'Read and write group memberships' }
      },
      'Directory': {
        'Directory.Read.All': { name: 'Directory Read All', description: 'Read directory data' },
        'Directory.ReadWrite.All': { name: 'Directory Read Write All', description: 'Read and write directory data' },
        'Directory.AccessAsUser.All': { name: 'Directory Access As User All', description: 'Access directory as the signed-in user' }
      },
      'Applications': {
        'Application.Read.All': { name: 'Application Read All', description: 'Read applications' },
        'Application.ReadWrite.All': { name: 'Application Read Write All', description: 'Read and write applications' }
      }
    }
  },

  // ============================================================================
  // 🇺🇸 TIER 1 - ESSENTIAL AMERICAN PLATFORMS
  // ============================================================================

  apple: {
    name: 'Apple',
    displayName: 'Apple',
    icon: '🍎',
    color: '#000000',
    authUrl: 'https://appleid.apple.com/auth/authorize',
    tokenUrl: 'https://appleid.apple.com/auth/token',
    userInfoUrl: 'https://appleid.apple.com/auth/userinfo', // JWT token contains user info
    userIdField: 'sub',
    docsUrl: 'https://developer.apple.com/sign-in-with-apple/',
    description: 'Sign in with Apple - Privacy-focused authentication',
    requiredScopes: ['openid'],
    scopeDelimiter: ' ',
    additionalParams: { 
      response_type: 'code',
      response_mode: 'form_post' // Apple requires form_post
    },
    scopes: {
      'Authentication': {
        'openid': { name: 'OpenID Connect', description: 'Basic authentication with Apple ID', required: true }
      },
      'Profile': {
        'name': { name: 'Name', description: 'Access user\'s name (first time only)' },
        'email': { name: 'Email', description: 'Access user\'s email address' }
      }
    }
  },

  amazon: {
    name: 'Amazon',
    displayName: 'Amazon',
    icon: '📦',
    color: '#ff9900',
    authUrl: 'https://www.amazon.com/ap/oa',
    tokenUrl: 'https://api.amazon.com/auth/o2/token',
    userInfoUrl: 'https://api.amazon.com/user/profile',
    userIdField: 'user_id',
    docsUrl: 'https://developer.amazon.com/docs/login-with-amazon/web-docs.html',
    description: 'Login with Amazon for e-commerce and AWS integration',
    requiredScopes: ['profile'],
    scopeDelimiter: ' ',
    additionalParams: { response_type: 'code' },
    scopes: {
      'Profile': {
        'profile': { name: 'Profile', description: 'Access basic profile information', required: true },
        'profile:user_id': { name: 'User ID', description: 'Access unique user identifier' }
      },
      'Contact': {
        'postal_code': { name: 'Postal Code', description: 'Access user\'s postal code for shipping' }
      }
    }
  },

  shopify: {
    name: 'Shopify',
    displayName: 'Shopify',
    icon: '🛍️',
    color: '#7ab55c',
    authUrl: 'https://{shop}.myshopify.com/admin/oauth/authorize',
    tokenUrl: 'https://{shop}.myshopify.com/admin/oauth/access_token',
    userInfoUrl: 'https://{shop}.myshopify.com/admin/api/2023-10/shop.json',
    userIdField: 'shop.id',
    docsUrl: 'https://shopify.dev/docs/apps/auth/oauth',
    description: 'Access Shopify stores and e-commerce data',
    requiredScopes: ['read_products'],
    scopeDelimiter: ',',
    additionalParams: { response_type: 'code' },
    scopes: {
      'Products': {
        'read_products': { name: 'Read Products', description: 'View products, variants, and collections', required: true },
        'write_products': { name: 'Write Products', description: 'Create and modify products, variants, and collections' }
      },
      'Orders': {
        'read_orders': { name: 'Read Orders', description: 'View orders, transactions, and fulfillments' },
        'write_orders': { name: 'Write Orders', description: 'Create and modify orders, transactions, and fulfillments' },
        'read_all_orders': { name: 'Read All Orders', description: 'View all orders (requires additional permissions)' }
      },
      'Customers': {
        'read_customers': { name: 'Read Customers', description: 'View customer data and customer groups' },
        'write_customers': { name: 'Write Customers', description: 'Create and modify customer data' },
        'read_customer_events': { name: 'Read Customer Events', description: 'View customer events and activities' },
        'read_customer_merge': { name: 'Read Customer Merge', description: 'View customer merge operations' },
        'write_customer_merge': { name: 'Write Customer Merge', description: 'Perform customer merge operations' },
        'read_customer_payment_methods': { name: 'Read Customer Payment Methods', description: 'View customer payment methods' }
      },
      'Inventory': {
        'read_inventory': { name: 'Read Inventory', description: 'View inventory levels and locations' },
        'write_inventory': { name: 'Write Inventory', description: 'Modify inventory levels and locations' }
      },
      'Fulfillments': {
        'read_fulfillments': { name: 'Read Fulfillments', description: 'View fulfillment information' },
        'write_fulfillments': { name: 'Write Fulfillments', description: 'Create and modify fulfillments' }
      },
      'Draft Orders': {
        'read_draft_orders': { name: 'Read Draft Orders', description: 'View draft orders' },
        'write_draft_orders': { name: 'Write Draft Orders', description: 'Create and modify draft orders' }
      },
      'Discounts': {
        'read_discounts': { name: 'Read Discounts', description: 'View discount codes and automatic discounts' },
        'write_discounts': { name: 'Write Discounts', description: 'Create and modify discount codes and automatic discounts' },
        'read_price_rules': { name: 'Read Price Rules', description: 'View price rules for discounts' },
        'write_price_rules': { name: 'Write Price Rules', description: 'Create and modify price rules for discounts' }
      },
      'Marketing': {
        'read_marketing_events': { name: 'Read Marketing Events', description: 'View marketing events and campaigns' },
        'write_marketing_events': { name: 'Write Marketing Events', description: 'Create and modify marketing events and campaigns' }
      },
      'Payments': {
        'read_shopify_payments_payouts': { name: 'Read Shopify Payments Payouts', description: 'View Shopify Payments payout information' },
        'read_shopify_payments_disputes': { name: 'Read Shopify Payments Disputes', description: 'View Shopify Payments dispute information' },
        'read_shopify_payments_dispute_evidences': { name: 'Read Dispute Evidences', description: 'View dispute evidence information' }
      },
      'Content': {
        'read_content': { name: 'Read Content', description: 'View blog posts, pages, and redirects' },
        'write_content': { name: 'Write Content', description: 'Create and modify blog posts, pages, and redirects' },
        'read_online_store_pages': { name: 'Read Online Store Pages', description: 'View online store pages' },
        'read_online_store_navigation': { name: 'Read Online Store Navigation', description: 'View online store navigation' },
        'write_online_store_navigation': { name: 'Write Online Store Navigation', description: 'Modify online store navigation' }
      },
      'Themes': {
        'read_themes': { name: 'Read Themes', description: 'View themes and theme files' },
        'write_themes': { name: 'Write Themes', description: 'Create and modify themes and theme files' }
      },
      'Scripts': {
        'read_script_tags': { name: 'Read Script Tags', description: 'View script tags' },
        'write_script_tags': { name: 'Write Script Tags', description: 'Create and modify script tags' }
      },
      'Files': {
        'read_files': { name: 'Read Files', description: 'View uploaded files' },
        'write_files': { name: 'Write Files', description: 'Upload and manage files' }
      },
      'Gift Cards': {
        'read_gift_cards': { name: 'Read Gift Cards', description: 'View gift card information' },
        'write_gift_cards': { name: 'Write Gift Cards', description: 'Create and modify gift cards' }
      },
      'Localization': {
        'read_locales': { name: 'Read Locales', description: 'View store locales and translations' },
        'write_locales': { name: 'Write Locales', description: 'Modify store locales and translations' }
      },
      'Metaobjects': {
        'read_metaobjects': { name: 'Read Metaobjects', description: 'View metaobjects and custom data' },
        'write_metaobjects': { name: 'Write Metaobjects', description: 'Create and modify metaobjects and custom data' },
        'read_metaobject_definitions': { name: 'Read Metaobject Definitions', description: 'View metaobject definitions' },
        'write_metaobject_definitions': { name: 'Write Metaobject Definitions', description: 'Create and modify metaobject definitions' }
      },
      'Store Credit': {
        'read_store_credit_accounts': { name: 'Read Store Credit Accounts', description: 'View store credit account information' },
        'read_store_credit_account_transactions': { name: 'Read Store Credit Transactions', description: 'View store credit transactions' },
        'write_store_credit_account_transactions': { name: 'Write Store Credit Transactions', description: 'Create store credit transactions' }
      },
      'Returns': {
        'read_returns': { name: 'Read Returns', description: 'View return information' },
        'write_returns': { name: 'Write Returns', description: 'Process returns and exchanges' }
      },
      'Shipping': {
        'read_shipping': { name: 'Read Shipping', description: 'View shipping rates and zones' },
        'write_shipping': { name: 'Write Shipping', description: 'Modify shipping rates and zones' }
      },
      'Legal & Privacy': {
        'read_legal_policies': { name: 'Read Legal Policies', description: 'View store legal policies' },
        'read_privacy_settings': { name: 'Read Privacy Settings', description: 'View privacy settings' },
        'write_privacy_settings': { name: 'Write Privacy Settings', description: 'Modify privacy settings' }
      },
      'Validation': {
        'read_validations': { name: 'Read Validations', description: 'View validation rules' },
        'write_validations': { name: 'Write Validations', description: 'Create and modify validation rules' }
      },
      'Users': {
        'read_users': { name: 'Read Users', description: 'View staff users (Shopify Plus only)' }
      }
    }
  },

  stripe: {
    name: 'Stripe',
    displayName: 'Stripe',
    icon: '💳',
    color: '#635bff',
    authUrl: 'https://connect.stripe.com/oauth/authorize',
    tokenUrl: 'https://connect.stripe.com/oauth/token',
    userInfoUrl: 'https://api.stripe.com/v1/account',
    userIdField: 'id',
    docsUrl: 'https://stripe.com/docs/connect/oauth-reference',
    description: 'Stripe Connect for payment processing and marketplace platforms',
    requiredScopes: ['read_only'],
    scopeDelimiter: ' ',
    additionalParams: { response_type: 'code' },
    scopes: {
      'General Access': {
        'read_only': { name: 'Read Only', description: 'Read-only access to all account resources', required: true },
        'read_write': { name: 'Read Write', description: 'Read and write access to all account resources' }
      }
    }
  },

  paypal: {
    name: 'PayPal',
    displayName: 'PayPal',
    icon: '💰',
    color: '#0070ba',
    authUrl: 'https://www.paypal.com/signin/authorize',
    tokenUrl: 'https://api.paypal.com/v1/oauth2/token',
    userInfoUrl: 'https://api.paypal.com/v1/identity/oauth2/userinfo',
    userIdField: 'user_id',
    docsUrl: 'https://developer.paypal.com/docs/log-in-with-paypal/',
    description: 'PayPal authentication and payment processing',
    requiredScopes: ['openid'],
    scopeDelimiter: ' ',
    additionalParams: { response_type: 'code' },
    scopes: {
      'Authentication': {
        'openid': { name: 'OpenID Connect', description: 'Basic authentication with PayPal', required: true }
      },
      'Profile': {
        'profile': { name: 'Profile', description: 'Access basic profile information' },
        'email': { name: 'Email', description: 'Access email address' },
        'address': { name: 'Address', description: 'Access address information' },
        'phone': { name: 'Phone', description: 'Access phone number' }
      },
      'Payments': {
        'https://uri.paypal.com/services/payments/payment': { name: 'Payments', description: 'Create and manage payments' },
        'https://uri.paypal.com/services/payments/refund': { name: 'Refunds', description: 'Process refunds' },
        'https://uri.paypal.com/services/payments/payment/authcapture': { name: 'Auth Capture', description: 'Authorize and capture payments' }
      }
    }
  },

  salesforce: {
    name: 'Salesforce',
    displayName: 'Salesforce',
    icon: '☁️',
    color: '#00a1e0',
    authUrl: 'https://login.salesforce.com/services/oauth2/authorize',
    tokenUrl: 'https://login.salesforce.com/services/oauth2/token',
    userInfoUrl: 'https://login.salesforce.com/services/oauth2/userinfo',
    userIdField: 'user_id',
    docsUrl: 'https://help.salesforce.com/s/articleView?id=sf.remoteaccess_oauth_web_server_flow.htm',
    description: 'Salesforce CRM and cloud platform integration',
    requiredScopes: ['openid'],
    scopeDelimiter: ' ',
    additionalParams: { response_type: 'code' },
    scopes: {
      'Authentication': {
        'openid': { name: 'OpenID Connect', description: 'Basic authentication', required: true },
        'id': { name: 'Identity', description: 'Access identity information' },
        'profile': { name: 'Profile', description: 'Access profile information' }
      },
      'Data Access': {
        'api': { name: 'API Access', description: 'Access Salesforce APIs' },
        'web': { name: 'Web Access', description: 'Access Salesforce web interface' },
        'full': { name: 'Full Access', description: 'Full access to all data' }
      },
      'Refresh': {
        'refresh_token': { name: 'Refresh Token', description: 'Obtain refresh tokens for offline access' }
      }
    }
  },

  // ============================================================================
  // 💼 TIER 3 - BUSINESS ESSENTIALS
  // ============================================================================

  hubspot: {
    name: 'HubSpot',
    displayName: 'HubSpot',
    icon: '🧲',
    color: '#ff7a59',
    authUrl: 'https://app.hubspot.com/oauth/authorize',
    tokenUrl: 'https://api.hubapi.com/oauth/v1/token',
    userInfoUrl: 'https://api.hubapi.com/oauth/v1/access-tokens/{token}',
    userIdField: 'user_id',
    docsUrl: 'https://developers.hubspot.com/docs/api/oauth-quickstart-guide',
    description: 'HubSpot CRM and marketing automation platform',
    requiredScopes: ['oauth'],
    scopeDelimiter: ' ',
    additionalParams: { response_type: 'code' },
    scopes: {
      'Basic': {
        'oauth': { name: 'OAuth', description: 'Basic OAuth access', required: true }
      },
      'CRM Objects': {
        'crm.objects.contacts.read': { name: 'Read Contacts', description: 'Read contact records' },
        'crm.objects.contacts.write': { name: 'Write Contacts', description: 'Create and update contact records' },
        'crm.objects.companies.read': { name: 'Read Companies', description: 'Read company records' },
        'crm.objects.companies.write': { name: 'Write Companies', description: 'Create and update company records' },
        'crm.objects.deals.read': { name: 'Read Deals', description: 'Read deal records' },
        'crm.objects.deals.write': { name: 'Write Deals', description: 'Create and update deal records' },
        'crm.objects.line_items.read': { name: 'Read Line Items', description: 'Read line item records' },
        'crm.objects.line_items.write': { name: 'Write Line Items', description: 'Create and update line item records' },
        'crm.objects.owners.read': { name: 'Read Owners', description: 'Read owner information' },
        'crm.objects.quotes.read': { name: 'Read Quotes', description: 'Read quote records' },
        'crm.objects.quotes.write': { name: 'Write Quotes', description: 'Create and update quote records' }
      },
      'CRM Lists': {
        'crm.lists.read': { name: 'Read Lists', description: 'Read contact and company lists' },
        'crm.lists.write': { name: 'Write Lists', description: 'Create and update lists' }
      },
      'CRM Schemas': {
        'crm.schemas.contacts.read': { name: 'Read Contact Schema', description: 'Read contact property definitions' },
        'crm.schemas.contacts.write': { name: 'Write Contact Schema', description: 'Create and update contact properties' },
        'crm.schemas.companies.read': { name: 'Read Company Schema', description: 'Read company property definitions' },
        'crm.schemas.companies.write': { name: 'Write Company Schema', description: 'Create and update company properties' },
        'crm.schemas.deals.read': { name: 'Read Deal Schema', description: 'Read deal property definitions' },
        'crm.schemas.deals.write': { name: 'Write Deal Schema', description: 'Create and update deal properties' }
      },
      'Marketing': {
        'content': { name: 'Content', description: 'Access blog posts, landing pages, and website pages' },
        'forms': { name: 'Forms', description: 'Access and manage forms' },
        'files': { name: 'Files', description: 'Access file manager' },
        'hubdb': { name: 'HubDB', description: 'Access HubDB tables and rows' },
        'reports': { name: 'Reports', description: 'Access analytics and reporting data' },
        'social': { name: 'Social Media', description: 'Access social media publishing tools' },
        'automation': { name: 'Marketing Automation', description: 'Access workflows and automation' }
      },
      'Sales': {
        'tickets': { name: 'Service Tickets', description: 'Access and manage service tickets' },
        'e-commerce': { name: 'E-commerce', description: 'Access e-commerce bridge and product data' }
      },
      'Communication': {
        'conversations.read': { name: 'Read Conversations', description: 'Read conversations and messages' },
        'conversations.write': { name: 'Write Conversations', description: 'Send messages and manage conversations' }
      },
      'Integration Events': {
        'integration-sync': { name: 'Integration Sync', description: 'Sync data with external systems' },
        'timeline': { name: 'Timeline Events', description: 'Create timeline events on CRM records' }
      },
      'Settings': {
        'settings.users.read': { name: 'Read Users', description: 'Read user and team information' },
        'settings.users.write': { name: 'Write Users', description: 'Manage users and teams' },
        'settings.users.teams.read': { name: 'Read Teams', description: 'Read team information' },
        'settings.users.teams.write': { name: 'Write Teams', description: 'Manage team settings' }
      },
      'Business Units': {
        'business-intelligence': { name: 'Business Intelligence', description: 'Access business intelligence data' },
        'sales-email-read': { name: 'Read Sales Emails', description: 'Read sales email data' },
        'sales-email-write': { name: 'Write Sales Emails', description: 'Send and manage sales emails' }
      }
    }
  },

  mailchimp: {
    name: 'Mailchimp',
    displayName: 'Mailchimp',
    icon: '🐵',
    color: '#ffe01b',
    authUrl: 'https://login.mailchimp.com/oauth2/authorize',
    tokenUrl: 'https://login.mailchimp.com/oauth2/token',
    userInfoUrl: 'https://login.mailchimp.com/oauth2/metadata',
    userIdField: 'user_id',
    docsUrl: 'https://mailchimp.com/developer/marketing/guides/access-user-data-oauth-2/',
    description: 'Mailchimp email marketing and automation platform',
    requiredScopes: ['read'],
    scopeDelimiter: ' ',
    additionalParams: { response_type: 'code' },
    scopes: {
      'Basic': {
        'read': { name: 'Read', description: 'Read account and campaign data', required: true },
        'write': { name: 'Write', description: 'Create and modify campaigns and lists' }
      }
    }
  },

  zoom: {
    name: 'Zoom',
    displayName: 'Zoom',
    icon: '📹',
    color: '#2d8cff',
    authUrl: 'https://zoom.us/oauth/authorize',
    tokenUrl: 'https://zoom.us/oauth/token',
    userInfoUrl: 'https://api.zoom.us/v2/users/me',
    userIdField: 'id',
    docsUrl: 'https://developers.zoom.us/docs/integrations/oauth/',
    description: 'Zoom video conferencing and communication platform',
    requiredScopes: ['user:read'],
    scopeDelimiter: ' ',
    additionalParams: { response_type: 'code' },
    scopes: {
      'User Management': {
        'user:read': { name: 'User Read', description: 'View user profile and settings', required: true },
        'user:write': { name: 'User Write', description: 'Update user profile and settings' },
        'user:read:admin': { name: 'User Read Admin', description: 'View all users in account (admin)' },
        'user:write:admin': { name: 'User Write Admin', description: 'Manage all users in account (admin)' }
      },
      'Meetings': {
        'meeting:read': { name: 'Meeting Read', description: 'View meeting details and participants' },
        'meeting:write': { name: 'Meeting Write', description: 'Create, update, and delete meetings' },
        'meeting:read:admin': { name: 'Meeting Read Admin', description: 'View all meetings in account (admin)' },
        'meeting:write:admin': { name: 'Meeting Write Admin', description: 'Manage all meetings in account (admin)' }
      },
      'Webinars': {
        'webinar:read': { name: 'Webinar Read', description: 'View webinar details and registrants' },
        'webinar:write': { name: 'Webinar Write', description: 'Create, update, and delete webinars' },
        'webinar:read:admin': { name: 'Webinar Read Admin', description: 'View all webinars in account (admin)' },
        'webinar:write:admin': { name: 'Webinar Write Admin', description: 'Manage all webinars in account (admin)' }
      },
      'Recordings': {
        'recording:read': { name: 'Recording Read', description: 'Access and download meeting recordings' },
        'recording:write': { name: 'Recording Write', description: 'Delete and manage meeting recordings' },
        'recording:read:admin': { name: 'Recording Read Admin', description: 'Access all recordings in account (admin)' },
        'recording:write:admin': { name: 'Recording Write Admin', description: 'Manage all recordings in account (admin)' }
      },
      'Reports & Analytics': {
        'report:read:admin': { name: 'Report Read Admin', description: 'Access usage reports and analytics (admin)' },
        'dashboard:read:admin': { name: 'Dashboard Read Admin', description: 'Access dashboard metrics (admin)' }
      },
      'Account Management': {
        'account:read:admin': { name: 'Account Read Admin', description: 'View account settings and information (admin)' },
        'account:write:admin': { name: 'Account Write Admin', description: 'Manage account settings (admin)' },
        'billing:read:admin': { name: 'Billing Read Admin', description: 'View billing information (admin)' }
      },
      'Phone & SMS': {
        'phone:read': { name: 'Phone Read', description: 'Access phone system data' },
        'phone:write': { name: 'Phone Write', description: 'Manage phone system settings' },
        'phone:read:admin': { name: 'Phone Read Admin', description: 'Access all phone data (admin)' },
        'phone:write:admin': { name: 'Phone Write Admin', description: 'Manage all phone settings (admin)' }
      },
      'Chat & Team': {
        'chat_channel:read': { name: 'Chat Channel Read', description: 'Access chat channels and messages' },
        'chat_channel:write': { name: 'Chat Channel Write', description: 'Send messages and manage channels' },
        'chat_contact:read': { name: 'Chat Contact Read', description: 'Access chat contacts' },
        'chat_contact:write': { name: 'Chat Contact Write', description: 'Manage chat contacts' }
      },
      'Rooms & Workspaces': {
        'room:read:admin': { name: 'Room Read Admin', description: 'View Zoom Rooms information (admin)' },
        'room:write:admin': { name: 'Room Write Admin', description: 'Manage Zoom Rooms (admin)' }
      },
      'Tracking Fields': {
        'tracking_fields:read': { name: 'Tracking Fields Read', description: 'View tracking field data' },
        'tracking_fields:write': { name: 'Tracking Fields Write', description: 'Manage tracking fields' }
      }
    }
  },

  trello: {
    name: 'Trello',
    displayName: 'Trello',
    icon: '📋',
    color: '#0079bf',
    authUrl: 'https://trello.com/1/authorize',
    tokenUrl: 'https://trello.com/1/OAuthGetAccessToken', // OAuth 1.0a
    userInfoUrl: 'https://api.trello.com/1/members/me',
    userIdField: 'id',
    docsUrl: 'https://developer.atlassian.com/cloud/trello/guides/rest-api/authorization/',
    description: 'Trello project management and collaboration platform',
    requiredScopes: ['read'],
    scopeDelimiter: ',',
    additionalParams: { 
      response_type: 'token',
      scope: 'read,write,account'
    },
    scopes: {
      'Basic': {
        'read': { name: 'Read', description: 'Read boards, lists, and cards', required: true },
        'write': { name: 'Write', description: 'Create and modify boards, lists, and cards' },
        'account': { name: 'Account', description: 'Access account information' }
      }
    }
  },

  asana: {
    name: 'Asana',
    displayName: 'Asana',
    icon: '✅',
    color: '#f06a6a',
    authUrl: 'https://app.asana.com/-/oauth_authorize',
    tokenUrl: 'https://app.asana.com/-/oauth_token',
    userInfoUrl: 'https://app.asana.com/api/1.0/users/me',
    userIdField: 'data.gid',
    docsUrl: 'https://developers.asana.com/docs/oauth',
    description: 'Asana task and project management platform',
    requiredScopes: ['default'],
    scopeDelimiter: ' ',
    additionalParams: { response_type: 'code' },
    scopes: {
      'Basic': {
        'default': { name: 'Default', description: 'Access tasks, projects, and workspaces', required: true }
      }
    }
  },

  notion: {
    name: 'Notion',
    displayName: 'Notion',
    icon: '📝',
    color: '#000000',
    authUrl: 'https://api.notion.com/v1/oauth/authorize',
    tokenUrl: 'https://api.notion.com/v1/oauth/token',
    userInfoUrl: 'https://api.notion.com/v1/users/me',
    userIdField: 'id',
    docsUrl: 'https://developers.notion.com/docs/authorization',
    description: 'Notion workspace and productivity platform',
    requiredScopes: ['read'],
    scopeDelimiter: ' ',
    additionalParams: { response_type: 'code' },
    scopes: {
      'Basic': {
        'read': { name: 'Read', description: 'Read pages, databases, and blocks', required: true },
        'write': { name: 'Write', description: 'Create and modify pages, databases, and blocks' }
      }
    }
  },

  // ============================================================================
  // 🎨 TIER 5 - CREATIVE & DESIGN
  // ============================================================================

  adobe: {
    name: 'Adobe',
    displayName: 'Adobe Creative Cloud',
    icon: '🎨',
    color: '#ff0000',
    authUrl: 'https://ims-na1.adobelogin.com/ims/authorize/v1',
    tokenUrl: 'https://ims-na1.adobelogin.com/ims/token/v1',
    userInfoUrl: 'https://ims-na1.adobelogin.com/ims/userinfo/v1',
    userIdField: 'user_id',
    docsUrl: 'https://developer.adobe.com/developer-console/docs/guides/authentication/OAuth/',
    description: 'Adobe Creative Cloud and Document Services',
    requiredScopes: ['openid'],
    scopeDelimiter: ',',
    additionalParams: { response_type: 'code' },
    scopes: {
      'Authentication': {
        'openid': { name: 'OpenID Connect', description: 'Basic authentication', required: true },
        'creative_sdk': { name: 'Creative SDK', description: 'Access Creative SDK services' }
      },
      'Creative Cloud': {
        'cc_files': { name: 'Creative Cloud Files', description: 'Access Creative Cloud file storage' },
        'cc_libraries': { name: 'Creative Cloud Libraries', description: 'Access Creative Cloud Libraries' }
      },
      'Document Services': {
        'pdf_services': { name: 'PDF Services', description: 'Access PDF Services API' },
        'document_generation': { name: 'Document Generation', description: 'Generate documents from templates' }
      }
    }
  },

  figma: {
    name: 'Figma',
    displayName: 'Figma',
    icon: '🎯',
    color: '#f24e1e',
    authUrl: 'https://www.figma.com/oauth',
    tokenUrl: 'https://www.figma.com/api/oauth/token',
    userInfoUrl: 'https://api.figma.com/v1/me',
    userIdField: 'id',
    docsUrl: 'https://www.figma.com/developers/api#authentication',
    description: 'Figma collaborative design platform',
    requiredScopes: ['file_read'],
    scopeDelimiter: ' ',
    additionalParams: { 
      response_type: 'code',
      scope: 'file_read'
    },
    scopes: {
      'Files': {
        'file_read': { name: 'File Read', description: 'Read access to files and projects', required: true }
      }
    }
  },

  canva: {
    name: 'Canva',
    displayName: 'Canva',
    icon: '🖌️',
    color: '#00c4cc',
    authUrl: 'https://www.canva.com/api/oauth/authorize',
    tokenUrl: 'https://api.canva.com/rest/v1/oauth/token',
    userInfoUrl: 'https://api.canva.com/rest/v1/users/me',
    userIdField: 'id',
    docsUrl: 'https://www.canva.dev/docs/connect/authentication/',
    description: 'Canva design platform and API',
    requiredScopes: ['design:read'],
    scopeDelimiter: ' ',
    additionalParams: { response_type: 'code' },
    scopes: {
      'Design': {
        'design:read': { name: 'Design Read', description: 'Read designs and folders', required: true },
        'design:write': { name: 'Design Write', description: 'Create and modify designs' }
      },
      'Assets': {
        'asset:read': { name: 'Asset Read', description: 'Read brand assets and uploads' },
        'asset:write': { name: 'Asset Write', description: 'Upload and manage assets' }
      }
    }
  },

  dribbble: {
    name: 'Dribbble',
    displayName: 'Dribbble',
    icon: '🏀',
    color: '#ea4c89',
    authUrl: 'https://dribbble.com/oauth/authorize',
    tokenUrl: 'https://dribbble.com/oauth/token',
    userInfoUrl: 'https://api.dribbble.com/v2/user',
    userIdField: 'id',
    docsUrl: 'https://developer.dribbble.com/v2/oauth/',
    description: 'Dribbble design community platform',
    requiredScopes: ['public'],
    scopeDelimiter: ' ',
    additionalParams: { response_type: 'code' },
    scopes: {
      'Basic': {
        'public': { name: 'Public', description: 'Access public profile and shots', required: true },
        'write': { name: 'Write', description: 'Create and modify shots and comments' },
        'comment': { name: 'Comment', description: 'Post comments on shots' },
        'upload': { name: 'Upload', description: 'Upload shots and attachments' }
      }
    }
  },

  unsplash: {
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
  },

  // ============================================================================
  // ☁️ TIER 7 - CLOUD & STORAGE
  // ============================================================================

  dropbox: {
    name: 'Dropbox',
    displayName: 'Dropbox',
    icon: '📦',
    color: '#0061ff',
    authUrl: 'https://www.dropbox.com/oauth2/authorize',
    tokenUrl: 'https://api.dropboxapi.com/oauth2/token',
    userInfoUrl: 'https://api.dropboxapi.com/2/users/get_current_account',
    userIdField: 'account_id',
    docsUrl: 'https://developers.dropbox.com/oauth-guide',
    description: 'Dropbox cloud storage and file sharing platform',
    requiredScopes: ['files.metadata.read'],
    scopeDelimiter: ' ',
    additionalParams: { 
      response_type: 'code',
      token_access_type: 'offline' // For refresh tokens
    },
    scopes: {
      'Files': {
        'files.metadata.read': { name: 'Files Metadata Read', description: 'View file and folder metadata', required: true },
        'files.metadata.write': { name: 'Files Metadata Write', description: 'Edit file and folder metadata' },
        'files.content.read': { name: 'Files Content Read', description: 'View file contents' },
        'files.content.write': { name: 'Files Content Write', description: 'Edit file contents' }
      },
      'Sharing': {
        'sharing.read': { name: 'Sharing Read', description: 'View shared links and folder members' },
        'sharing.write': { name: 'Sharing Write', description: 'Create and modify shared links and folder permissions' }
      },
      'Account': {
        'account_info.read': { name: 'Account Info Read', description: 'View account information' }
      }
    }
  },

  box: {
    name: 'Box',
    displayName: 'Box',
    icon: '📁',
    color: '#0061d5',
    authUrl: 'https://account.box.com/api/oauth2/authorize',
    tokenUrl: 'https://api.box.com/oauth2/token',
    userInfoUrl: 'https://api.box.com/2.0/users/me',
    userIdField: 'id',
    docsUrl: 'https://developer.box.com/guides/authentication/oauth2/',
    description: 'Box enterprise cloud storage and collaboration platform',
    requiredScopes: ['root_readwrite'],
    scopeDelimiter: ' ',
    additionalParams: { response_type: 'code' },
    scopes: {
      'Basic': {
        'root_readonly': { name: 'Root Read Only', description: 'Read access to all files and folders' },
        'root_readwrite': { name: 'Root Read Write', description: 'Read/write access to all files and folders', required: true }
      }
    }
  },

  // ============================================================================
  // 🎯 HIGH IMPACT PLATFORMS
  // ============================================================================

  netflix: {
    name: 'Netflix',
    displayName: 'Netflix',
    icon: '🎬',
    color: '#e50914',
    authUrl: 'https://api.netflix.com/oauth/request_token',
    tokenUrl: 'https://api.netflix.com/oauth/access_token',
    userInfoUrl: 'https://api.netflix.com/users/current',
    userIdField: 'user.user_id',
    docsUrl: 'https://developer.netflix.com/docs/security',
    description: 'Netflix streaming platform (OAuth 1.0a)',
    requiredScopes: ['read'],
    scopeDelimiter: ' ',
    additionalParams: { oauth_version: '1.0' },
    scopes: {
      'Basic': {
        'read': { name: 'Read', description: 'Access user profile and viewing history', required: true }
      }
    }
  },

  steam: {
    name: 'Steam',
    displayName: 'Steam',
    icon: '🎮',
    color: '#1b2838',
    authUrl: 'https://steamcommunity.com/openid/login',
    tokenUrl: 'https://steamcommunity.com/openid/login', // OpenID flow
    userInfoUrl: 'https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/',
    userIdField: 'steamid',
    docsUrl: 'https://steamcommunity.com/dev',
    description: 'Steam gaming platform (OpenID)',
    requiredScopes: ['identity'],
    scopeDelimiter: ' ',
    additionalParams: { 
      'openid.mode': 'checkid_setup',
      'openid.ns': 'http://specs.openid.net/auth/2.0'
    },
    scopes: {
      'Basic': {
        'identity': { name: 'Identity', description: 'Access Steam profile information', required: true }
      }
    }
  },

  coinbase: {
    name: 'Coinbase',
    displayName: 'Coinbase',
    icon: '₿',
    color: '#0052ff',
    authUrl: 'https://www.coinbase.com/oauth/authorize',
    tokenUrl: 'https://api.coinbase.com/oauth/token',
    userInfoUrl: 'https://api.coinbase.com/v2/user',
    userIdField: 'data.id',
    docsUrl: 'https://developers.coinbase.com/docs/wallet/coinbase-connect',
    description: 'Coinbase cryptocurrency platform',
    requiredScopes: ['wallet:user:read'],
    scopeDelimiter: ' ',
    additionalParams: { response_type: 'code' },
    scopes: {
      'User Information': {
        'wallet:user:read': { name: 'User Read', description: 'View basic user information', required: true },
        'wallet:user:email': { name: 'User Email', description: 'Access user email address' },
        'wallet:user:update': { name: 'User Update', description: 'Update user information' }
      },
      'Accounts': {
        'wallet:accounts:read': { name: 'Accounts Read', description: 'View account information and balances' },
        'wallet:accounts:create': { name: 'Accounts Create', description: 'Create new cryptocurrency accounts' },
        'wallet:accounts:update': { name: 'Accounts Update', description: 'Update account information' },
        'wallet:accounts:delete': { name: 'Accounts Delete', description: 'Delete cryptocurrency accounts' }
      },
      'Transactions': {
        'wallet:transactions:read': { name: 'Transactions Read', description: 'View transaction history and details' },
        'wallet:transactions:send': { name: 'Transactions Send', description: 'Send cryptocurrency to other users' },
        'wallet:transactions:request': { name: 'Transactions Request', description: 'Request cryptocurrency from other users' },
        'wallet:transactions:transfer': { name: 'Transactions Transfer', description: 'Transfer between own accounts' }
      },
      'Addresses': {
        'wallet:addresses:read': { name: 'Addresses Read', description: 'View cryptocurrency addresses' },
        'wallet:addresses:create': { name: 'Addresses Create', description: 'Generate new cryptocurrency addresses' }
      },
      'Buys & Sells': {
        'wallet:buys:read': { name: 'Buys Read', description: 'View buy order history' },
        'wallet:buys:create': { name: 'Buys Create', description: 'Place buy orders' },
        'wallet:sells:read': { name: 'Sells Read', description: 'View sell order history' },
        'wallet:sells:create': { name: 'Sells Create', description: 'Place sell orders' }
      },
      'Deposits & Withdrawals': {
        'wallet:deposits:read': { name: 'Deposits Read', description: 'View deposit history' },
        'wallet:deposits:create': { name: 'Deposits Create', description: 'Make deposits' },
        'wallet:withdrawals:read': { name: 'Withdrawals Read', description: 'View withdrawal history' },
        'wallet:withdrawals:create': { name: 'Withdrawals Create', description: 'Make withdrawals' }
      },
      'Payment Methods': {
        'wallet:payment-methods:read': { name: 'Payment Methods Read', description: 'View linked payment methods' },
        'wallet:payment-methods:limits': { name: 'Payment Methods Limits', description: 'View payment method limits' }
      },
      'Notifications': {
        'wallet:notifications:read': { name: 'Notifications Read', description: 'View account notifications' }
      },
      'Checkouts': {
        'wallet:checkouts:read': { name: 'Checkouts Read', description: 'View checkout information' },
        'wallet:checkouts:create': { name: 'Checkouts Create', description: 'Create payment checkouts' }
      },
      'Orders': {
        'wallet:orders:read': { name: 'Orders Read', description: 'View order information' },
        'wallet:orders:create': { name: 'Orders Create', description: 'Create orders' }
      }
    }
  }
};

// Helper functions for easy access
export function getPlatform(platformName) {
  const platform = PLATFORMS[platformName.toLowerCase()];
  if (!platform) {
    throw new Error(`Unsupported platform: ${platformName}`);
  }
  return platform;
}

export function getAllPlatforms() {
  return Object.keys(PLATFORMS);
}

export function getPlatformNames() {
  return Object.keys(PLATFORMS).map(key => ({
    key,
    name: PLATFORMS[key].name,
    displayName: PLATFORMS[key].displayName
  }));
}

export function getPlatformScopes(platformName) {
  const platform = getPlatform(platformName);
  return platform.scopes || {};
}

// ============================================================================
// 🔧 OAUTH HANDLER FUNCTIONS
// All platform-specific OAuth logic consolidated here
// ============================================================================

/**
 * Generate OAuth consent URL with required scopes automatically included
 */
export async function generateConsentUrl(platform, userApp, apiKey, state, baseUrl = 'https://oauth-hub.com') {
  const platformConfig = PLATFORMS[platform.toLowerCase()];
  if (!platformConfig) {
    throw new Error(`Unsupported platform: ${platform}`);
  }

  // Combine required scopes with user-selected scopes
  const requiredScopes = platformConfig.requiredScopes || [];
  const userScopes = userApp.scopes || [];
  
  // Merge scopes, ensuring required scopes are always included
  const allScopes = [...new Set([...requiredScopes, ...userScopes])];
  const scopeString = allScopes.join(platformConfig.scopeDelimiter || ' ');

  // Build authorization URL parameters
  const params = new URLSearchParams({
    client_id: userApp.clientId,
    redirect_uri: `${baseUrl}/callback`,
    response_type: 'code', // Standard OAuth parameter
    scope: scopeString,
    state: state,
    ...platformConfig.additionalParams
  });

  // Handle PKCE for platforms that require it
  if (platformConfig.requiresPKCE) {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    
    params.set('code_challenge', codeChallenge);
    params.set('code_challenge_method', 'S256');
  }

  return `${platformConfig.authUrl}?${params.toString()}`;
}

/**
 * Exchange authorization code for access token with platform-specific handling
 */
export async function exchangeCodeForToken(platform, code, userApp, codeVerifier = null) {
  const platformConfig = PLATFORMS[platform.toLowerCase()];
  if (!platformConfig) {
    throw new Error(`Unsupported platform: ${platform}`);
  }

  const tokenParams = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: userApp.clientId,
    client_secret: userApp.clientSecret,
    code: code,
    redirect_uri: 'https://oauth-hub.com/callback'
  });

  // Add PKCE code verifier if required
  if (platformConfig.requiresPKCE && codeVerifier) {
    tokenParams.set('code_verifier', codeVerifier);
  }

  // Platform-specific token request handling
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json'
  };

  switch (platform.toLowerCase()) {
    case 'github':
      headers['User-Agent'] = 'OAuth-Hub/1.0';
      break;
    case 'slack':
      tokenParams.set('client_id', userApp.clientId);
      tokenParams.set('client_secret', userApp.clientSecret);
      break;
    case 'shopify':
      // Shopify uses different URL structure
      const shopDomain = userApp.shopDomain || 'shop';
      platformConfig.tokenUrl = platformConfig.tokenUrl.replace('{shop}', shopDomain);
      break;
  }

  const response = await fetch(platformConfig.tokenUrl, {
    method: 'POST',
    headers,
    body: tokenParams.toString()
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Token exchange failed: ${response.status} ${errorText}`);
  }

  const tokenResponse = await response.json();
  return normalizeTokenResponse(platform, tokenResponse);
}

/**
 * Normalize token response format across all platforms
 */
function normalizeTokenResponse(platform, tokenResponse) {
  const normalized = {
    accessToken: null,
    refreshToken: null,
    tokenType: 'Bearer',
    expiresIn: null,
    expiresAt: null,
    scope: null
  };

  // Handle platform-specific token response formats
  switch (platform.toLowerCase()) {
    case 'github':
      normalized.accessToken = tokenResponse.access_token;
      normalized.tokenType = tokenResponse.token_type || 'Bearer';
      normalized.scope = tokenResponse.scope;
      break;

    case 'google':
      normalized.accessToken = tokenResponse.access_token;
      normalized.refreshToken = tokenResponse.refresh_token;
      normalized.tokenType = tokenResponse.token_type || 'Bearer';
      normalized.expiresIn = tokenResponse.expires_in;
      normalized.scope = tokenResponse.scope;
      break;

    case 'apple':
      normalized.accessToken = tokenResponse.access_token;
      normalized.refreshToken = tokenResponse.refresh_token;
      normalized.tokenType = tokenResponse.token_type || 'Bearer';
      normalized.expiresIn = tokenResponse.expires_in;
      break;

    case 'amazon':
      normalized.accessToken = tokenResponse.access_token;
      normalized.refreshToken = tokenResponse.refresh_token;
      normalized.tokenType = tokenResponse.token_type || 'Bearer';
      normalized.expiresIn = tokenResponse.expires_in;
      break;

    case 'shopify':
      normalized.accessToken = tokenResponse.access_token;
      normalized.scope = tokenResponse.scope;
      break;

    case 'stripe':
      normalized.accessToken = tokenResponse.access_token;
      normalized.refreshToken = tokenResponse.refresh_token;
      normalized.tokenType = tokenResponse.token_type || 'Bearer';
      normalized.scope = tokenResponse.scope;
      break;

    case 'paypal':
      normalized.accessToken = tokenResponse.access_token;
      normalized.tokenType = tokenResponse.token_type || 'Bearer';
      normalized.expiresIn = tokenResponse.expires_in;
      normalized.scope = tokenResponse.scope;
      break;

    case 'salesforce':
      normalized.accessToken = tokenResponse.access_token;
      normalized.refreshToken = tokenResponse.refresh_token;
      normalized.tokenType = tokenResponse.token_type || 'Bearer';
      normalized.scope = tokenResponse.scope;
      break;

    case 'hubspot':
      normalized.accessToken = tokenResponse.access_token;
      normalized.refreshToken = tokenResponse.refresh_token;
      normalized.tokenType = tokenResponse.token_type || 'Bearer';
      normalized.expiresIn = tokenResponse.expires_in;
      break;

    case 'zoom':
      normalized.accessToken = tokenResponse.access_token;
      normalized.refreshToken = tokenResponse.refresh_token;
      normalized.tokenType = tokenResponse.token_type || 'Bearer';
      normalized.expiresIn = tokenResponse.expires_in;
      normalized.scope = tokenResponse.scope;
      break;

    case 'dropbox':
      normalized.accessToken = tokenResponse.access_token;
      normalized.refreshToken = tokenResponse.refresh_token;
      normalized.tokenType = tokenResponse.token_type || 'Bearer';
      normalized.expiresIn = tokenResponse.expires_in;
      normalized.scope = tokenResponse.scope;
      break;

    case 'coinbase':
      normalized.accessToken = tokenResponse.access_token;
      normalized.refreshToken = tokenResponse.refresh_token;
      normalized.tokenType = tokenResponse.token_type || 'Bearer';
      normalized.expiresIn = tokenResponse.expires_in;
      normalized.scope = tokenResponse.scope;
      break;

    // Additional American platforms
    case 'mailchimp':
      normalized.accessToken = tokenResponse.access_token;
      normalized.tokenType = tokenResponse.token_type || 'Bearer';
      normalized.expiresIn = tokenResponse.expires_in;
      normalized.scope = tokenResponse.scope;
      break;

    case 'trello':
      // Trello (OAuth 1.0a): { oauth_token, oauth_token_secret }
      normalized.accessToken = tokenResponse.oauth_token;
      normalized.refreshToken = tokenResponse.oauth_token_secret; // Store as refresh for consistency
      break;

    case 'asana':
      normalized.accessToken = tokenResponse.access_token;
      normalized.refreshToken = tokenResponse.refresh_token;
      normalized.tokenType = tokenResponse.token_type || 'Bearer';
      normalized.expiresIn = tokenResponse.expires_in;
      break;

    case 'notion':
      normalized.accessToken = tokenResponse.access_token;
      normalized.tokenType = tokenResponse.token_type || 'Bearer';
      break;

    case 'adobe':
      normalized.accessToken = tokenResponse.access_token;
      normalized.refreshToken = tokenResponse.refresh_token;
      normalized.tokenType = tokenResponse.token_type || 'Bearer';
      normalized.expiresIn = tokenResponse.expires_in;
      break;

    case 'figma':
      normalized.accessToken = tokenResponse.access_token;
      normalized.refreshToken = tokenResponse.refresh_token;
      normalized.tokenType = tokenResponse.token_type || 'Bearer';
      normalized.expiresIn = tokenResponse.expires_in;
      break;

    case 'canva':
      normalized.accessToken = tokenResponse.access_token;
      normalized.refreshToken = tokenResponse.refresh_token;
      normalized.tokenType = tokenResponse.token_type || 'Bearer';
      normalized.expiresIn = tokenResponse.expires_in;
      normalized.scope = tokenResponse.scope;
      break;

    case 'dribbble':
      normalized.accessToken = tokenResponse.access_token;
      normalized.tokenType = tokenResponse.token_type || 'Bearer';
      normalized.scope = tokenResponse.scope;
      break;

    case 'unsplash':
      normalized.accessToken = tokenResponse.access_token;
      normalized.tokenType = tokenResponse.token_type || 'Bearer';
      normalized.scope = tokenResponse.scope;
      break;

    case 'box':
      normalized.accessToken = tokenResponse.access_token;
      normalized.refreshToken = tokenResponse.refresh_token;
      normalized.tokenType = tokenResponse.token_type || 'Bearer';
      normalized.expiresIn = tokenResponse.expires_in;
      break;

    case 'netflix':
      // Netflix (OAuth 1.0a): { oauth_token, oauth_token_secret, user_id }
      normalized.accessToken = tokenResponse.oauth_token;
      normalized.refreshToken = tokenResponse.oauth_token_secret;
      break;

    case 'steam':
      // Steam (OpenID): Returns identity URL, not traditional OAuth tokens
      normalized.accessToken = tokenResponse.openid_identity || tokenResponse.access_token;
      break;

    default:
      // Generic OAuth 2.0 response
      normalized.accessToken = tokenResponse.access_token;
      normalized.refreshToken = tokenResponse.refresh_token;
      normalized.tokenType = tokenResponse.token_type || 'Bearer';
      normalized.expiresIn = tokenResponse.expires_in;
      normalized.scope = tokenResponse.scope;
  }

  // Calculate expiration timestamp if expiresIn is provided
  if (normalized.expiresIn) {
    normalized.expiresAt = Date.now() + (normalized.expiresIn * 1000);
  }

  return normalized;
}

/**
 * Get user info from OAuth provider with platform-specific handling
 */
export async function getUserInfo(platform, accessToken) {
  const platformConfig = PLATFORMS[platform.toLowerCase()];
  if (!platformConfig) {
    throw new Error(`Unsupported platform: ${platform}`);
  }

  // Build platform-specific headers
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Accept': 'application/json'
  };

  // Add platform-specific headers
  switch (platform.toLowerCase()) {
    case 'github':
      headers['User-Agent'] = 'OAuth-Hub/1.0';
      break;
    case 'twitch':
      headers['Client-ID'] = platformConfig.clientId;
      break;
    case 'shopify':
      headers['X-Shopify-Access-Token'] = accessToken;
      delete headers['Authorization'];
      break;
    case 'stripe':
      headers['Stripe-Version'] = '2020-08-27';
      break;
    case 'adobe':
      headers['x-api-key'] = platformConfig.clientId;
      break;
    case 'hubspot':
      // HubSpot may require specific headers for certain endpoints
      headers['Content-Type'] = 'application/json';
      break;
    case 'zoom':
      // Zoom requires specific User-Agent
      headers['User-Agent'] = 'OAuth-Hub/1.0';
      break;
    case 'salesforce':
      // Salesforce may require specific headers
      headers['Accept'] = 'application/json';
      break;
    case 'dropbox':
      headers['Dropbox-API-Select-User'] = platformConfig.selectUser || '';
      break;
    case 'box':
      headers['BoxApi'] = `shared_link=${platformConfig.sharedLink || ''}`;
      break;
    case 'steam':
      // Steam uses API key instead of OAuth token for some endpoints
      if (platformConfig.apiKey) {
        headers['Authorization'] = `Bearer ${platformConfig.apiKey}`;
      }
      break;
    case 'trello':
      // Trello may require specific headers
      headers['Accept'] = 'application/json';
      break;
    case 'asana':
      // Asana requires specific headers
      headers['Accept'] = 'application/json';
      break;
    case 'notion':
      // Notion requires specific version header
      headers['Notion-Version'] = '2022-06-28';
      break;
    case 'figma':
      // Figma may require specific headers
      headers['X-Figma-Token'] = accessToken;
      delete headers['Authorization'];
      break;
  }

  const response = await fetch(platformConfig.userInfoUrl, { headers });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`User info fetch failed for ${platform}: ${response.status} ${errorText}`);
  }

  const rawUserInfo = await response.json();
  
  // Extract platform user ID using platform-specific logic
  const platformUserId = extractPlatformUserId(platform, rawUserInfo, platformConfig);
  
  if (!platformUserId) {
    throw new Error(`Could not extract user ID from ${platform} response`);
  }

  return {
    platformUserId: platformUserId.toString(),
    userInfo: rawUserInfo
  };
}

/**
 * Extract platform user ID from user info response
 */
function extractPlatformUserId(platform, userInfo, platformConfig) {
  const userIdField = platformConfig.userIdField;
  
  // Handle platform-specific data structures
  switch (platform.toLowerCase()) {
    case 'apple':
      return userInfo.sub;
    case 'amazon':
      return userInfo.user_id;
    case 'shopify':
      return userInfo.shop?.id || userInfo.id;
    case 'stripe':
      return userInfo.id;
    case 'paypal':
      return userInfo.user_id || userInfo.payer_id;
    case 'salesforce':
      return userInfo.user_id || userInfo.id;
    case 'hubspot':
      return userInfo.user_id || userInfo.user;
    case 'zoom':
      return userInfo.id;
    case 'dropbox':
      return userInfo.account_id;
    case 'coinbase':
      return userInfo.data?.id || userInfo.id;

    // Additional American platforms
    case 'mailchimp':
      return userInfo.user_id;
    case 'trello':
      return userInfo.id;
    case 'asana':
      return userInfo.data?.gid || userInfo.gid || userInfo.id;
    case 'notion':
      return userInfo.id;
    case 'adobe':
      return userInfo.user_id || userInfo.userId || userInfo.id;
    case 'figma':
      return userInfo.id;
    case 'canva':
      return userInfo.id;
    case 'dribbble':
      return userInfo.id;
    case 'unsplash':
      return userInfo.id;
    case 'box':
      return userInfo.id;
    case 'netflix':
      return userInfo.user?.user_id || userInfo.user_id;
    case 'steam':
      return userInfo.steamid || userInfo.response?.players?.[0]?.steamid;

    // Existing platforms
    case 'github':
      return userInfo.id;
    case 'google':
      return userInfo.id || userInfo.sub;
    case 'twitter':
    case 'x':
      return userInfo.data?.id || userInfo.id;
    case 'linkedin':
      return userInfo.sub || userInfo.id;
    case 'discord':
      return userInfo.id;
    case 'spotify':
      return userInfo.id;
    case 'twitch':
      return Array.isArray(userInfo.data) ? userInfo.data[0]?.id : userInfo.id;
    case 'slack':
      return userInfo.user?.id || userInfo.id;
    case 'microsoft':
      return userInfo.id;
    default:
      // Generic fallback
      if (userIdField.includes('.')) {
        const fields = userIdField.split('.');
        let value = userInfo;
        for (const field of fields) {
          value = value?.[field];
          if (value === undefined) break;
        }
        return value;
      }
      return userInfo[userIdField];
  }
}

/**
 * Refresh OAuth access token with platform-specific handling
 */
export async function refreshAccessToken(platform, refreshToken, userApp) {
  const platformConfig = PLATFORMS[platform.toLowerCase()];
  if (!platformConfig) {
    throw new Error(`Unsupported platform: ${platform}`);
  }

  // Some platforms don't support refresh tokens
  const noRefreshPlatforms = ['github', 'shopify', 'trello', 'notion', 'dribbble', 'unsplash', 'netflix', 'steam'];
  if (noRefreshPlatforms.includes(platform.toLowerCase())) {
    throw new Error(`${platform} tokens do not expire and cannot be refreshed`);
  }

  const tokenParams = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: userApp.clientId,
    client_secret: userApp.clientSecret,
    refresh_token: refreshToken
  });

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json'
  };

  const response = await fetch(platformConfig.tokenUrl, {
    method: 'POST',
    headers,
    body: tokenParams.toString()
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Token refresh failed: ${response.status} ${errorText}`);
  }

  const tokenResponse = await response.json();
  return normalizeTokenResponse(platform, tokenResponse);
}

// ============================================================================
// 🔧 UTILITY FUNCTIONS
// ============================================================================

// PKCE helper functions
function generateCodeVerifier() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode.apply(null, array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

async function generateCodeChallenge(codeVerifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode.apply(null, new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}
