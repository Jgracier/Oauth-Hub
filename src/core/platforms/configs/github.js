/**
 * 🐙 GITHUB PLATFORM CONFIGURATION
 * Complete OAuth configuration for GitHub API
 */

export const github = {
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
};
