/**
 * 📘 FACEBOOK PLATFORM CONFIGURATION
 * Complete OAuth configuration for Facebook Graph API
 */

export const facebook = {
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
};
