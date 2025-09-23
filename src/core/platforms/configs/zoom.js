/**
 * 📹 ZOOM PLATFORM CONFIGURATION
 * Complete OAuth configuration for Zoom APIs
 */

export const zoom = {
  name: 'Zoom',
  displayName: 'Zoom',
  icon: '📹',
  color: '#2d8cff',
  authUrl: 'https://zoom.us/oauth/authorize',
  tokenUrl: 'https://zoom.us/oauth/token',
  userInfoUrl: 'https://api.zoom.us/v2/users/me',
  userIdField: 'id',
  revokeUrl: null, // OAuth token revocation endpoint
  introspectUrl: null, // OAuth token introspection endpoint
  docsUrl: 'https://developers.zoom.us/docs/integrations/oauth/',
  description: 'Zoom video conferencing and communication platform',
  requiredScopes: ['user:read'],
  scopeDelimiter: ' ',
  requiresPKCE: false, // PKCE requirement for enhanced security
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
};
