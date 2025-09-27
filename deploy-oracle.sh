#!/bin/bash

# Oracle Cloud Infrastructure - Node.js Application Deployment Script
# Follows OCI Compute Instance best practices for Node.js deployment
# Based on Oracle Cloud Infrastructure documentation and best practices
# Reference: https://docs.oracle.com/en-us/iaas/Content/Compute/References/bestpracticescompute.htm

set -euo pipefail

echo "🚀 Starting OAuth Hub deployment to Oracle Cloud Infrastructure..."

# Configuration - Following OCI naming conventions and best practices
SERVER_IP="${CRM_SERVER_IP}"
SSH_USER="${CRM_SERVER_USER:-ubuntu}"
SSH_KEY="${CRM_SERVER_SSH_PRIVATE_KEY}"
PROJECT_NAME="oauth-hub"
DEPLOY_PATH="/home/${SSH_USER}/${PROJECT_NAME}"
NODE_ENV="${NODE_ENV:-production}"
PORT="${PORT:-3001}"
BACKUP_SUFFIX="$(date +%Y%m%d_%H%M%S)"

# OCI-specific configuration
OCI_REGION="${OCI_REGION:-us-ashburn-1}"
LOG_DIR="/var/log/${PROJECT_NAME}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Validate required environment variables
validate_config() {
    echo -e "${BLUE}🔍 Validating OCI configuration...${NC}"

    if [[ -z "${SERVER_IP}" ]]; then
        echo -e "${RED}❌ Error: CRM_SERVER_IP environment variable is required${NC}"
        exit 1
    fi

    if [[ -z "${SSH_KEY}" ]]; then
        echo -e "${RED}❌ Error: CRM_SERVER_SSH_PRIVATE_KEY environment variable is required${NC}"
        exit 1
    fi

    echo -e "${GREEN}✅ OCI configuration validated${NC}"
}

# Create secure temporary SSH key file
setup_ssh() {
    echo -e "${BLUE}🔐 Setting up secure SSH connection to OCI Compute instance...${NC}"

    SSH_KEY_FILE=$(mktemp)
    echo "${SSH_KEY}" > "${SSH_KEY_FILE}"
    chmod 600 "${SSH_KEY_FILE}"

    # Test SSH connection with timeout (following OCI best practices)
    if ! timeout 30 ssh -i "${SSH_KEY_FILE}" -o StrictHostKeyChecking=no -o ConnectTimeout=10 "${SSH_USER}@${SERVER_IP}" "echo 'SSH connection to OCI instance successful'" 2>/dev/null; then
        echo -e "${RED}❌ Error: Cannot connect to OCI Compute instance ${SERVER_IP}${NC}"
        rm -f "${SSH_KEY_FILE}"
        exit 1
    fi

    echo -e "${GREEN}✅ SSH connection to OCI Compute instance established${NC}"
}

# OCI-compliant SSH command wrapper with proper error handling
ssh_cmd() {
    ssh -i "${SSH_KEY_FILE}" \
        -o StrictHostKeyChecking=no \
        -o ConnectTimeout=30 \
        -o ServerAliveInterval=60 \
        -o LogLevel=ERROR \
        "${SSH_USER}@${SERVER_IP}" "$1"
}

# OCI-compliant SCP command wrapper
scp_file() {
    scp -i "${SSH_KEY_FILE}" \
        -o StrictHostKeyChecking=no \
        -o ConnectTimeout=30 \
        -o LogLevel=ERROR \
        "$1" "${SSH_USER}@${SERVER_IP}:$2"
}

# Create backup of existing deployment
create_backup() {
    echo -e "${YELLOW}💾 Creating backup of existing deployment...${NC}"

    if ssh_cmd "test -d ${DEPLOY_PATH}"; then
        ssh_cmd "sudo cp -r ${DEPLOY_PATH} ${DEPLOY_PATH}.backup.${BACKUP_SUFFIX} 2>/dev/null || true"
        echo -e "${GREEN}✅ Backup created: ${DEPLOY_PATH}.backup.${BACKUP_SUFFIX}${NC}"
    else
        echo -e "${BLUE}ℹ️  No existing deployment found, skipping backup${NC}"
    fi
}

# Setup OCI Compute instance environment
setup_oci_environment() {
    echo -e "${BLUE}🏗️  Setting up OCI Compute instance environment...${NC}"

    # Create application user if needed (following OCI best practices)
    ssh_cmd "sudo useradd -m -s /bin/bash ${SSH_USER} 2>/dev/null || true"

    # Setup log directory with proper permissions
    ssh_cmd "sudo mkdir -p ${LOG_DIR}"
    ssh_cmd "sudo chown ${SSH_USER}:${SSH_USER} ${LOG_DIR}"

    # Ensure Node.js is available
    if ! ssh_cmd "which node"; then
        echo -e "${YELLOW}📦 Installing Node.js on OCI instance...${NC}"
        ssh_cmd "curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -"
        ssh_cmd "sudo apt-get install -y nodejs"
    fi

    # Ensure PM2 is available
    if ! ssh_cmd "which pm2"; then
        echo -e "${YELLOW}⚙️ Installing PM2 process manager...${NC}"
        ssh_cmd "sudo npm install -g pm2"
    fi

    echo -e "${GREEN}✅ OCI Compute instance environment ready${NC}"
}

# Validate configuration first
validate_config

# Setup secure SSH
setup_ssh

echo -e "${YELLOW}📋 OCI Compute Instance Deployment Configuration:${NC}"
echo "Server: ${SERVER_IP}"
echo "User: ${SSH_USER}"
echo "Project: ${PROJECT_NAME}"
echo "Deploy Path: ${DEPLOY_PATH}"
echo "Environment: ${NODE_ENV}"
echo "Port: ${PORT}"
echo "OCI Region: ${OCI_REGION}"
echo "Log Directory: ${LOG_DIR}"
echo "Backup Suffix: ${BACKUP_SUFFIX}"
echo ""

# Create backup before deployment
create_backup

# Setup OCI environment
setup_oci_environment

echo -e "${BLUE}📤 Deploying OAuth Hub to OCI Compute instance...${NC}"

# Create deployment directory
ssh_cmd "mkdir -p ${DEPLOY_PATH}"

# Use rsync for reliable file transfer (following OCI best practices)
echo -e "${YELLOW}Using rsync for secure file transfer...${NC}"

# Direct rsync transfer over SSH - no intermediate archives needed
rsync -avz \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='*.log' \
    --exclude='.env' \
    --exclude='.DS_Store' \
    --exclude='*.tmp' \
    --exclude='*.swp' \
    --exclude='*.bak' \
    --exclude='.github' \
    --exclude='deploy-oracle.sh' \
    --exclude='create-repo.ps1' \
    --exclude='test-validation.ps1' \
    --exclude='env-example.txt' \
    --delete \
    -e "ssh -i ${SSH_KEY_FILE} -o StrictHostKeyChecking=no -o ConnectTimeout=30 -o LogLevel=ERROR" \
    ./ "${SSH_USER}@${SERVER_IP}:${DEPLOY_PATH}/"

echo -e "${GREEN}✅ Files transferred successfully to OCI instance${NC}"

# Install dependencies on OCI instance
echo -e "${YELLOW}📦 Installing dependencies on OCI instance...${NC}"
ssh_cmd "cd ${DEPLOY_PATH} && npm ci --production"

# Setup environment variables securely
echo -e "${BLUE}🔐 Setting up environment configuration...${NC}"
ssh_cmd "cd ${DEPLOY_PATH} && cat > .env << 'EOF'
# OAuth Hub Environment Configuration for OCI
NODE_ENV=${NODE_ENV}
PORT=${PORT}

# OCI-specific configuration
OCI_REGION=${OCI_REGION}

# Server configuration
HOST=0.0.0.0
HTTPS=false

# Logging
LOG_LEVEL=info
LOG_FILE=${LOG_DIR}/oauth-hub.log

# Session configuration (generate secure random values)
SESSION_SECRET=$(openssl rand -hex 32 2>/dev/null || echo 'change-this-in-production')

# Rate limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=1000
ALLOWED_ORIGINS=https://your-frontend.com,http://localhost:3000
EOF"

# Set proper permissions
ssh_cmd "cd ${DEPLOY_PATH} && chmod 600 .env"

# Start application with PM2 (following OCI best practices)
echo -e "${YELLOW}🚀 Starting OAuth Hub with PM2...${NC}"

# Stop existing application if running
ssh_cmd "pm2 delete ${PROJECT_NAME} 2>/dev/null || true"

# Start new application with explicit environment
ssh_cmd "cd ${DEPLOY_PATH} && NODE_ENV=${NODE_ENV} PORT=${PORT} OCI_REGION=${OCI_REGION} pm2 start server.js --name ${PROJECT_NAME}"

# Save PM2 configuration
ssh_cmd "pm2 save"

# Setup PM2 startup (optional, requires sudo)
echo -e "${BLUE}⚙️  Configuring PM2 auto-startup...${NC}"
if ssh_cmd "sudo pm2 startup 2>/dev/null | grep -q 'sudo env'"; then
    echo -e "${GREEN}✅ PM2 auto-startup configured${NC}"
else
    echo -e "${YELLOW}⚠️  PM2 auto-startup requires manual configuration${NC}"
fi

# Configure OCI firewall (Security Lists)
echo -e "${BLUE}🔥 Configuring OCI Security Lists...${NC}"
ssh_cmd "sudo ufw allow ${PORT}/tcp 2>/dev/null || echo 'Configure OCI Security List to allow port ${PORT}'"

# Health check with proper timeout
echo -e "${YELLOW}🏥 Running health check...${NC}"
echo -e "${YELLOW}Waiting 15 seconds for application to initialize...${NC}"
sleep 15

HEALTH_CHECK=$(ssh_cmd "curl -s --max-time 10 http://localhost:${PORT}/health 2>/dev/null || echo 'failed'")

# Check if health response contains "OK" status
if [[ "${HEALTH_CHECK}" == *"\"status\":\"OK\""* ]] || [[ "${HEALTH_CHECK}" == *"status": "OK"* ]]; then
    echo -e "${GREEN}✅ OAuth Hub deployment successful!${NC}"
    echo -e "${GREEN}🌐 Application is running at: http://${SERVER_IP}:${PORT}${NC}"
    echo ""
    echo -e "${YELLOW}📊 Application Status:${NC}"
    ssh_cmd "pm2 status ${PROJECT_NAME}"
    echo ""
    echo -e "${YELLOW}📝 OCI Management Commands:${NC}"
    echo "SSH Access: ssh ${SSH_USER}@${SERVER_IP}"
    echo "View Logs: ssh ${SSH_USER}@${SERVER_IP} 'pm2 logs ${PROJECT_NAME}'"
    echo "Restart App: ssh ${SSH_USER}@${SERVER_IP} 'pm2 restart ${PROJECT_NAME}'"
    echo "Check Status: ssh ${SSH_USER}@${SERVER_IP} 'pm2 status ${PROJECT_NAME}'"
    echo ""
    echo -e "${BLUE}🔒 OCI Security Notes:${NC}"
    echo "- Ensure OCI Security List allows inbound traffic on port ${PORT}"
    echo "- Consider using OCI Load Balancer for production"
    echo "- Regularly update OCI instance and dependencies"
else
    echo -e "${RED}❌ Health check failed!${NC}"
    echo "Response: ${HEALTH_CHECK}"
    echo ""
    echo -e "${YELLOW}📋 Troubleshooting:${NC}"
    ssh_cmd "pm2 logs ${PROJECT_NAME} --lines 20"
    echo ""
    echo -e "${RED}💡 Possible issues:${NC}"
    echo "- Check OCI Security List allows port ${PORT}"
    echo "- Verify Node.js dependencies installed correctly"
    echo "- Check application logs: pm2 logs ${PROJECT_NAME}"
    exit 1
fi

# Cleanup
rm -f "${SSH_KEY_FILE}"

echo -e "${GREEN}🎉 OAuth Hub successfully deployed to OCI Compute instance!${NC}"
echo -e "${GREEN}📍 Access your OAuth Hub at: http://${SERVER_IP}:${PORT}${NC}"