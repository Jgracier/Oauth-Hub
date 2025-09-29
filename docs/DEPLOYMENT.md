# 🚀 Automated Deployment Setup

This guide shows you how to set up **automatic deployment** from GitHub to Cloudflare Workers using GitHub Actions.

## 📋 Prerequisites

- GitHub repository with your OAuth worker code
- Cloudflare account with Workers enabled
- Cloudflare API Token and Account ID

## 🔧 Setup Steps

### 1. Get Cloudflare Credentials

1. **Get Account ID:**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Copy your Account ID from the right sidebar

2. **Create API Token:**
   - Go to [API Tokens](https://dash.cloudflare.com/profile/api-tokens)
   - Click "Create Token"
   - Use "Custom token" template
   - **Permissions:**
     - `Account` - `Cloudflare Workers:Edit`
     - `Zone` - `Zone Settings:Read` (if using custom domains)
   - **Account Resources:** Include your account
   - **Zone Resources:** Include all zones (if using custom domains)

### 2. Add GitHub Secrets

In your GitHub repository:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add these secrets:

```
CLOUDFLARE_API_TOKEN = your_api_token_here
CLOUDFLARE_ACCOUNT_ID = your_account_id_here
```

### 3. Workflow Configuration

The GitHub Actions workflow (`.github/workflows/deploy.yml`) is already configured to:

- ✅ **Trigger on push** to `main` or `master` branch
- ✅ **Install dependencies** automatically
- ✅ **Deploy to Cloudflare** using Wrangler
- ✅ **Use your secrets** securely

## 🔄 Development Workflow

### Perfect Development Flow:

```bash
# 1. Work locally
git checkout -b feature/new-oauth-platform
# Make your changes...

# 2. Commit and push
git add .
git commit -m "Add TikTok OAuth support"
git push origin feature/new-oauth-platform

# 3. Create Pull Request
# GitHub Actions will deploy to preview environment

# 4. Merge to main
# GitHub Actions automatically deploys to production!
```

## 🎯 What Happens Automatically

### On Every Push to Main:
1. 🔄 **GitHub Actions triggers**
2. 📦 **Installs dependencies** (`npm ci`)
3. 🚀 **Deploys to Cloudflare** (`wrangler deploy`)
4. ✅ **Updates your live worker**

### On Pull Requests:
- 🧪 **Runs tests** (if configured)
- 🔍 **Validates deployment** 
- 📝 **Shows deployment status**

## 📊 Monitoring Deployments

### GitHub Actions Tab:
- View deployment status
- See build logs
- Monitor deployment history

### Cloudflare Dashboard:
- Check worker versions
- Monitor performance
- View analytics

## 🛠️ Advanced Configuration

### Environment-Specific Deployments:

```yaml
# Add to deploy.yml for staging/production
- name: Deploy to Staging
  if: github.ref == 'refs/heads/develop'
  run: wrangler deploy --env staging

- name: Deploy to Production  
  if: github.ref == 'refs/heads/main'
  run: wrangler deploy --env production
```

### Custom Domains:
Update `wrangler.toml` with your domains:

```toml
[env.production]
routes = [
  { pattern = "oauth.yourdomain.com/*", zone_name = "yourdomain.com" }
]
```

## 🔒 Security Best Practices

- ✅ **Never commit API tokens** to code
- ✅ **Use GitHub Secrets** for sensitive data
- ✅ **Rotate tokens** regularly
- ✅ **Monitor deployment logs** for issues
- ✅ **Use branch protection** rules

## 🚨 Troubleshooting

### Common Issues:

**❌ "Invalid API token"**
- Check token permissions include `Cloudflare Workers:Edit`
- Verify token hasn't expired

**❌ "Account ID not found"**  
- Double-check Account ID from Cloudflare dashboard
- Ensure it matches the secret exactly

**❌ "Deployment failed"**
- Check GitHub Actions logs
- Verify `wrangler.toml` configuration
- Ensure all required files are committed

## 🎉 Success!

Once set up, you'll have:
- 🔄 **Automatic deployments** on every push.
- 📊 **Deployment history** and monitoring.
- 🛡️ **Secure credential management**
- 🚀 **Zero-downtime deployments**

Your development workflow is now: **Code → Commit → Push → Auto-Deploy!** ✨
