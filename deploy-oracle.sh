#!/bin/bash

# Oracle Cloud Auto-Deployment Script for OAuth Hub
# Deploys to CRM_SERVER space on Oracle Cloud Infrastructure

set -e

echo "🚀 Starting OAuth Hub deployment to Oracle Cloud..."

# Configuration
SERVER_IP="$CRM_SERVER_IP"
SSH_USER="$CRM_SERVER_USER"
SSH_KEY="$CRM_SERVER_SSH_PRIVATE_KEY"
DB_URL="$CRM_DATABASE_URL"
PROJECT_NAME="oauth-hub"
DEPLOY_PATH="/home/ubuntu/$PROJECT_NAME"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📋 Configuration:${NC}"
echo "Server: $SERVER_IP"
echo "User: $SSH_USER"
echo "Project: $PROJECT_NAME"
echo "Deploy Path: $DEPLOY_PATH"
echo ""

# Function to run SSH commands
ssh_cmd() {
    ssh -i <(echo "$SSH_KEY") -o StrictHostKeyChecking=no "$SSH_USER@$SERVER_IP" "$1"
}

# Function to copy files via SCP
scp_file() {
    scp -i <(echo "$SSH_KEY") -o StrictHostKeyChecking=no "$1" "$SSH_USER@$SERVER_IP:$2"
}

echo -e "${YELLOW}🔧 Setting up deployment environment...${NC}"

# Create temporary SSH key file
SSH_KEY_FILE=$(mktemp)
echo "$SSH_KEY" > "$SSH_KEY_FILE"
chmod 600 "$SSH_KEY_FILE"

# Update SSH functions to use the key file
ssh_cmd() {
    ssh -i "$SSH_KEY_FILE" -o StrictHostKeyChecking=no "$SSH_USER@$SERVER_IP" "$1"
}

scp_file() {
    scp -i "$SSH_KEY_FILE" -o StrictHostKeyChecking=no "$1" "$SSH_USER@$SERVER_IP:$2"
}

# Create deployment directory on server
ssh_cmd "mkdir -p $DEPLOY_PATH"
ssh_cmd "cd $DEPLOY_PATH && pwd"

# Install Node.js and npm if not present
echo -e "${YELLOW}📦 Checking Node.js installation...${NC}"
ssh_cmd "which node || (curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt-get install -y nodejs)"

# Install PM2 for process management
echo -e "${YELLOW}⚙️ Installing PM2 for process management...${NC}"
ssh_cmd "which pm2 || (sudo npm install -g pm2)"

# Copy application files
echo -e "${YELLOW}📤 Copying application files...${NC}"

# Create temporary deployment package
# Use --ignore-failed-read to handle files that change during archiving
tar -czf oauth-hub-deploy.tar.gz \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='*.log' \
    --exclude='.env' \
    --exclude='.DS_Store' \
    --exclude='*.tmp' \
    --exclude='*.swp' \
    --exclude='*.bak' \
    --ignore-failed-read \
    .

# Copy deployment package to server
scp_file "oauth-hub-deploy.tar.gz" "$DEPLOY_PATH/"

# Extract and setup on server
ssh_cmd "cd $DEPLOY_PATH && rm -rf * && tar -xzf oauth-hub-deploy.tar.gz && rm oauth-hub-deploy.tar.gz"

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
ssh_cmd "cd $DEPLOY_PATH && npm ci --production"

# Create environment file
echo -e "${YELLOW}🔐 Setting up environment variables...${NC}"
ssh_cmd "cd $DEPLOY_PATH && cat > .env << 'EOF'
# OAuth Hub Environment Configuration
NODE_ENV=production
PORT=3001

# Database Configuration
DATABASE_URL=$DB_URL

# OAuth Configuration
OAUTH_ISSUER=https://$SERVER_IP:3001
OAUTH_CLIENT_ID=oauth-hub
OAUTH_CLIENT_SECRET=$(openssl rand -base64 32)

# Server Configuration
HOST=0.0.0.0
HTTPS=true
SSL_CERT_PATH=/etc/ssl/certs/oauth-hub.crt
SSL_KEY_PATH=/etc/ssl/private/oauth-hub.key

# Session Configuration
SESSION_SECRET=$(openssl rand -hex 32)

# Logging
LOG_LEVEL=info
LOG_FILE=/var/log/oauth-hub.log

# Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100

# CORS
ALLOWED_ORIGINS=https://your-frontend-domain.com,http://localhost:3000
EOF"

# Setup SSL certificates (self-signed for now)
echo -e "${YELLOW}🔒 Setting up SSL certificates...${NC}"
ssh_cmd "sudo mkdir -p /etc/ssl/certs /etc/ssl/private"
ssh_cmd "sudo openssl req -x509 -newkey rsa:4096 -keyout /etc/ssl/private/oauth-hub.key -out /etc/ssl/certs/oauth-hub.crt -days 365 -nodes -subj '/C=US/ST=State/L=City/O=Organization/CN=$SERVER_IP'"

# Setup log directory
ssh_cmd "sudo mkdir -p /var/log && sudo touch /var/log/oauth-hub.log && sudo chmod 666 /var/log/oauth-hub.log"

# Start application with PM2
echo -e "${YELLOW}🚀 Starting OAuth Hub application...${NC}"
ssh_cmd "cd $DEPLOY_PATH && pm2 delete oauth-hub 2>/dev/null || true"
ssh_cmd "cd $DEPLOY_PATH && pm2 start server.js --name oauth-hub --env production"
ssh_cmd "cd $DEPLOY_PATH && pm2 save"
ssh_cmd "cd $DEPLOY_PATH && pm2 startup"
ssh_cmd "cd $DEPLOY_PATH && pm2 status"

# Setup firewall
echo -e "${YELLOW}🔥 Configuring firewall...${NC}"
ssh_cmd "sudo ufw allow 3001/tcp || true"
ssh_cmd "sudo ufw --force enable || true"

# Health check
echo -e "${YELLOW}🏥 Running health check...${NC}"
sleep 5
HEALTH_CHECK=$(ssh_cmd "curl -k -s https://localhost:3001/health || curl -s http://localhost:3001/health || echo 'failed'")

if [[ "$HEALTH_CHECK" == *"OK"* ]]; then
    echo -e "${GREEN}✅ Deployment successful!${NC}"
    echo -e "${GREEN}🌐 OAuth Hub is running at: https://$SERVER_IP:3001${NC}"
    echo ""
    echo -e "${YELLOW}📊 Application Status:${NC}"
    ssh_cmd "pm2 status oauth-hub"
    echo ""
    echo -e "${YELLOW}📝 Useful Commands:${NC}"
    echo "Check logs: $CRM_LOGS"
    echo "Check status: $CRM_STATUS"
    echo "SSH access: $CRM_SSH_CONNECT"
else
    echo -e "${RED}❌ Health check failed!${NC}"
    echo "Response: $HEALTH_CHECK"
    echo ""
    echo -e "${YELLOW}📋 Debugging:${NC}"
    ssh_cmd "pm2 logs oauth-hub --lines 20"
    exit 1
fi

# Cleanup temporary files
rm -f "$SSH_KEY_FILE"

echo -e "${GREEN}🎉 OAuth Hub deployment to Oracle Cloud completed successfully!${NC}"
