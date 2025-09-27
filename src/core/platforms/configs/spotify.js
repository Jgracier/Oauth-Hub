/**
 * 🎵 SPOTIFY PLATFORM CONFIGURATION
 * Complete OAuth configuration for Spotify Web API
 */

const spotify = {
  name: 'Spotify',
  displayName: 'Spotify',
  icon: '🎵',
  color: '#1db954',
  authUrl: 'https://accounts.spotify.com/authorize',
  tokenUrl: 'https://accounts.spotify.com/api/token',
  userInfoUrl: 'https://api.spotify.com/v1/me',
  userIdField: 'id',
  revokeUrl: null, // OAuth token revocation endpoint
  introspectUrl: null, // OAuth token introspection endpoint
  docsUrl: 'https://developer.spotify.com/dashboard',
  description: 'Access Spotify Web API for music and playlists',
  requiredScopes: ['user-read-private'],
  scopeDelimiter: ' ',
  requiresPKCE: true, // PKCE requirement for enhanced security
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
    'Playback Control': {
      'user-read-playback-state': { name: 'User Read Playback State', description: 'Read current playback state' },
      'user-modify-playback-state': { name: 'User Modify Playback State', description: 'Control playback (play, pause, skip, etc.)' },
      'user-read-currently-playing': { name: 'User Read Currently Playing', description: 'Read currently playing track' }
    }
  }
};


export { spotify };



