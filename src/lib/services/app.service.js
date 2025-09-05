// =============================================================================
// 📱 APP SERVICE - OAuth app credentials management
// =============================================================================

export class AppService {
  constructor(env) {
    this.env = env;
  }

  /**
   * Save OAuth app credentials
   */
  async save(platform, appData, userEmail) {
    const appKey = `app:${platform}`;
    const appCredentials = {
      platform: platform,
      name: appData.name || platform.charAt(0).toUpperCase() + platform.slice(1),
      clientId: appData.clientId,
      clientSecret: appData.clientSecret,
      scopes: appData.scopes || [],
      redirectUri: appData.redirectUri,
      userEmail: userEmail,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await this.env.API_KEYS.put(appKey, JSON.stringify(appCredentials));
    return appCredentials;
  }

  /**
   * Get all apps for a user
   */
  async getByUser(userEmail) {
    const { keys } = await this.env.API_KEYS.list();
    const userApps = [];

    for (const keyInfo of keys) {
      if (keyInfo.name.startsWith('app:')) {
        const appData = await this.env.API_KEYS.get(keyInfo.name);
        if (appData) {
          const app = JSON.parse(appData);
          if (app.userEmail === userEmail) {
            userApps.push(app);
          }
        }
      }
    }

    return userApps;
  }

  /**
   * Get app credentials by platform
   */
  async getByPlatform(platform) {
    const appKey = `app:${platform}`;
    const appData = await this.env.API_KEYS.get(appKey);
    
    if (!appData) {
      return null;
    }
    
    return JSON.parse(appData);
  }

  /**
   * Delete app credentials
   */
  async delete(platform, userEmail) {
    const appKey = `app:${platform}`;
    const appData = await this.env.API_KEYS.get(appKey);
    
    if (!appData) {
      return false;
    }
    
    const app = JSON.parse(appData);
    if (app.userEmail !== userEmail) {
      throw new Error('Unauthorized to delete this app');
    }
    
    await this.env.API_KEYS.delete(appKey);
    return true;
  }
}
