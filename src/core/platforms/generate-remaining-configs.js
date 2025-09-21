/**
 * 🏭 PLATFORM CONFIG GENERATOR
 * Generates individual platform configuration files from the original platforms.js
 * This is a one-time utility script to extract remaining platforms
 */

import { writeFile } from 'fs/promises';
import { join } from 'path';

// Original platform data from platforms.js (extracted manually)
const REMAINING_PLATFORMS = {
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
    scopeDelimiter: ',',
    additionalParams: { response_type: 'code' },
    scopes: {
      'Basic': {
        'user_profile': { name: 'User Profile', description: 'Access profile information', required: true }
      },
      'Media': {
        'user_media': { name: 'User Media', description: 'Access media (photos and videos)' }
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
    scopeDelimiter: ' ',
    additionalParams: { response_type: 'code' },
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
        'bot': { name: 'Bot', description: 'Add bot to guild with basic permissions' }
      }
    }
  },

  // Add more platforms as needed...
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
        'users:read.email': { name: 'Users Read Email', description: 'View email addresses of people in workspace' }
      },
      'Chat': {
        'chat:write': { name: 'Chat Write', description: 'Send messages as user' },
        'chat:write.public': { name: 'Chat Write Public', description: 'Send messages to channels user isn\'t a member of' }
      },
      'Channels': {
        'channels:read': { name: 'Channels Read', description: 'View basic information about public channels' },
        'channels:write': { name: 'Channels Write', description: 'Manage public channels' },
        'channels:history': { name: 'Channels History', description: 'View messages and content in public channels' }
      }
    }
  }

  // ... Continue with all other platforms
};

/**
 * Generate a platform configuration file
 */
function generatePlatformFile(platformName, config) {
  const capitalizedName = platformName.charAt(0).toUpperCase() + platformName.slice(1);
  const templateHeader = `/**
 * ${config.icon} ${config.displayName.toUpperCase()} PLATFORM CONFIGURATION
 * Complete OAuth configuration for ${config.displayName}
 */

export const ${platformName} = ${JSON.stringify(config, null, 2)};`;

  return templateHeader;
}

/**
 * Generate all remaining platform configuration files
 */
async function generateAllConfigs() {
  const configsDir = './configs';
  
  for (const [platformName, config] of Object.entries(REMAINING_PLATFORMS)) {
    const fileContent = generatePlatformFile(platformName, config);
    const filePath = join(configsDir, `${platformName}.js`);
    
    try {
      await writeFile(filePath, fileContent, 'utf8');
      console.log(`✅ Generated ${platformName}.js`);
    } catch (error) {
      console.error(`❌ Failed to generate ${platformName}.js:`, error.message);
    }
  }
  
  console.log(`\n🎉 Generated ${Object.keys(REMAINING_PLATFORMS).length} platform configuration files!`);
}

// Usage: Run this script from the platforms directory
// node generate-remaining-configs.js
if (import.meta.url === `file://${process.argv[1]}`) {
  generateAllConfigs().catch(console.error);
}

export { generateAllConfigs, REMAINING_PLATFORMS };
