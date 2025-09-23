/**
 * 🏢 MICROSOFT PLATFORM CONFIGURATION
 * Complete OAuth configuration for Microsoft Graph API
 */

export const microsoft = {
  name: 'Microsoft',
  displayName: 'Microsoft',
  icon: '🏢',
  color: '#0078d4',
  authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
  tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
  userInfoUrl: 'https://graph.microsoft.com/v1.0/me',
  userIdField: 'id',
  revokeUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/logout', // OAuth token revocation endpoint
  introspectUrl: null, // OAuth token introspection endpoint
  docsUrl: 'https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps',
  description: 'Access Microsoft Graph API for Office 365 and Azure',
  requiredScopes: ['User.Read'],
  scopeDelimiter: ' ',
  requiresPKCE: true, // PKCE requirement for enhanced security
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
};
