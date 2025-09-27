/**
 * 🔍 GOOGLE PLATFORM CONFIGURATION
 * Complete OAuth configuration for Google services
 */

const google = {
  name: 'Google',
  displayName: 'Google',
  icon: '🔍',
  color: '#4285f4',
  authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenUrl: 'https://oauth2.googleapis.com/token',
  userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
  revokeUrl: 'https://oauth2.googleapis.com/revoke',
  introspectUrl: null, // Google doesn't support standard introspection
  userIdField: 'id',
  docsUrl: 'https://console.cloud.google.com/',
  description: 'Access Google services like YouTube, Drive, Gmail',
  requiredScopes: ['openid', 'email', 'profile'],
  scopeDelimiter: ' ', // Space-delimited
  requiresPKCE: true, // Google supports PKCE for enhanced security
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
};


export { google };


