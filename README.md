# OAuth Hub - Enterprise OAuth Platform

A modern, scalable OAuth 2.0/OIDC platform built with Node.js, Express, and Keycloak, featuring a beautiful server-side rendered UI inspired by industry leaders.

## 🏗️ Project Structure

```
oauth-hub/
├── backend/                    # 🔧 Backend Logic
│   ├── server.js              # Main Express server with Keycloak
│   └── src/
│       ├── lib/auth/          # Auth utilities (Keycloak stubs)
│       └── core/platforms/    # Platform configurations
├── frontend/                   # 🎨 Frontend UI
│   └── src/ui/
│       ├── pages/             # Server-rendered pages
│       │   ├── auth.js        # Login/signup (redirects to Keycloak)
│       │   ├── dashboard.js   # Main dashboard
│       │   ├── apps.js        # OAuth app management
│       │   ├── api-keys.js    # API key management
│       │   ├── subscription.js# Billing & plans
│       │   ├── analytics.js   # Usage analytics
│       │   ├── docs.js        # API documentation
│       │   ├── profile.js     # User profile
│       │   └── settings.js    # User preferences
│       ├── navigation.js      # Navigation components
│       └── styles.js          # CSS & theming utilities
├── docs/                       # 📚 Documentation
│   ├── ADMIN_DOCUMENTATION.md
│   ├── DEPLOYMENT.md
│   ├── ORACLE_SETUP.md
│   └── PLATFORM_ARCHITECTURE.md
├── keycloak.json              # Keycloak client config
├── package.json               # Dependencies & scripts
├── Dockerfile                 # Container config
├── deploy-to-oracle.sh        # Oracle deployment script
└── README.md                  # This file
```

## 🚀 Features

### Authentication & Authorization
- **Keycloak Integration**: Full OAuth 2.0/OIDC support
- **Multi-Provider Login**: Google, GitHub, and custom providers
- **User Management**: Registration, login, profile management
- **Session Management**: Secure session handling with Keycloak

### OAuth Platform
- **Consent URLs**: Generate OAuth consent URLs for applications
- **Token Management**: Store and retrieve OAuth tokens
- **Multi-Platform Support**: Google, GitHub, and extensible to others
- **API Key Management**: Secure API key generation and management

### User Interface
- **Modern Design**: Inspired by ClickUp, Deepgram, and OpenAI
- **Responsive**: Mobile-first design with dark/light themes
- **Server-Side Rendering**: Fast, SEO-friendly pages
- **Interactive Components**: Dynamic forms and real-time updates

### Business Features
- **Subscription Management**: Plan upgrades and billing
- **Analytics Dashboard**: Usage statistics and insights
- **Documentation**: Integrated API documentation
- **Settings**: User preferences and configuration

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Authentication**: Keycloak (OAuth 2.0/OIDC)
- **Database**: Keycloak's built-in database for user data
- **Frontend**: Server-side rendered HTML with modern CSS
- **Deployment**: Docker-ready for cloud deployment

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker (for Keycloak)
- Git

### Installation

1. **Clone and setup:**
```bash
   git clone <repository-url>
   cd oauth-hub
   npm install
   ```

2. **Start Keycloak:**
   ```bash
   # Start Keycloak on port 8081
   docker run -d -p 8081:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:latest start-dev
   ```

3. **Configure Keycloak:**
   - Open http://localhost:8081
   - Login with admin/admin
   - Create realm: "oauth-hub"
   - Create client: "oauth-hub-client" (confidential)
   - Copy client secret to environment

4. **Start the application:**
   ```bash
   npm start
   ```

5. **Access the app:**
   - Open http://localhost:3000
   - Register/login through Keycloak
   - Explore the dashboard and features

## 📁 API Endpoints

### Authentication
- `GET /auth` - Redirect to Keycloak login
- `GET /logout` - Logout and redirect

### Protected Pages
- `GET /dashboard` - Main dashboard
- `GET /apps` - OAuth app management
- `GET /api-keys` - API key management
- `GET /subscription` - Subscription management
- `GET /analytics` - Usage analytics
- `GET /docs` - API documentation
- `GET /profile` - User profile
- `GET /settings` - User settings

### API Endpoints
- `GET /api/platforms` - Available OAuth platforms
- `GET /api/user-apps` - User's OAuth apps
- `POST /api/save-app` - Save OAuth app
- `GET /api/api-keys` - User's API keys
- `POST /api/api-keys` - Create API key
- `GET /api/subscription/status` - Subscription status
- `POST /api/subscription/checkout` - Upgrade subscription

### OAuth Endpoints
- `GET /consent/:platform/:apiKey` - Generate consent URL
- `GET /tokens/:platformUserId/:apiKey` - Retrieve tokens

## 🔧 Configuration

### Environment Variables
```env
KEYCLOAK_URL=http://localhost:8081
KEYCLOAK_ADMIN_USER=admin
KEYCLOAK_ADMIN_PASSWORD=admin
KEYCLOAK_CLIENT_SECRET=your-client-secret
PORT=3000
FRONTEND_URL=http://localhost:3000
```

### Keycloak Setup
1. **Realm**: oauth-hub
2. **Client**: oauth-hub-client
3. **Identity Providers**: Configure Google, GitHub with your app credentials
4. **User Attributes**: Used for storing app configs, API keys, tokens

## 🚢 Deployment

### Docker Deployment
```bash
# Build and run
docker build -t oauth-hub .
docker run -p 3000:3000 oauth-hub
```

### Oracle Cloud Deployment
- Push to GitHub for auto-deployment
- Configure environment variables in Oracle
- Set up Keycloak instance in Oracle

## 📚 Documentation

- **API Docs**: Available at `/docs` when logged in
- **Setup Guide**: See individual component READMEs
- **Contributing**: Follow standard Node.js contribution guidelines

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- UI inspired by ClickUp, Deepgram, and OpenAI designs
- OAuth implementation following industry best practices
- Keycloak for robust identity management