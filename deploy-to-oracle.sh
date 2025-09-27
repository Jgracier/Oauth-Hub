#!/bin/bash

# =============================================================================
# OAUTH HUB - ORACLE CLOUD DEPLOYMENT SCRIPT
# =============================================================================
# Deploys the OAuth Hub application to Oracle Cloud Infrastructure

set -e  # Exit on any error

echo "🚀 Starting OAuth Hub deployment to Oracle Cloud..."

# =============================================================================
# CONFIGURATION
# =============================================================================
ORACLE_REGION="${ORACLE_REGION:-us-ashburn-1}"
COMPARTMENT_ID="${COMPARTMENT_ID}"
SUBNET_ID="${SUBNET_ID}"
SSH_PUBLIC_KEY="${SSH_PUBLIC_KEY}"
INSTANCE_SHAPE="${INSTANCE_SHAPE:-VM.Standard.A1.Flex}"
INSTANCE_OCPUS="${INSTANCE_OCPUS:-2}"
INSTANCE_MEMORY="${INSTANCE_MEMORY:-12}"
IMAGE_ID="${IMAGE_ID}"  # Oracle Linux 8 or Ubuntu

# Database configuration
DB_USER="${DB_USER:-oauth_user}"
DB_PASSWORD="${DB_PASSWORD}"
DB_CONNECT_STRING="${DB_CONNECT_STRING}"

# Application configuration
APP_PORT="${APP_PORT:-3000}"
NODE_ENV="${NODE_ENV:-production}"

# =============================================================================
# FUNCTIONS
# =============================================================================

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

error() {
    echo "[ERROR] $1" >&2
    exit 1
}

# =============================================================================
# DEPLOYMENT STEPS
# =============================================================================

# 1. Validate prerequisites
log "Validating prerequisites..."
if [ -z "$COMPARTMENT_ID" ]; then
    error "COMPARTMENT_ID environment variable is required"
fi

if [ -z "$SUBNET_ID" ]; then
    error "SUBNET_ID environment variable is required"
fi

if [ -z "$SSH_PUBLIC_KEY" ]; then
    error "SSH_PUBLIC_KEY environment variable is required"
fi

# 2. Create Compute Instance
log "Creating Oracle Compute Instance..."
INSTANCE_ID=$(oci compute instance launch \
    --compartment-id "$COMPARTMENT_ID" \
    --shape "$INSTANCE_SHAPE" \
    --shape-config "{\"ocpus\": $INSTANCE_OCPUS, \"memoryInGBs\": $INSTANCE_MEMORY}" \
    --image-id "$IMAGE_ID" \
    --subnet-id "$SUBNET_ID" \
    --ssh-authorized-keys-file "$SSH_PUBLIC_KEY" \
    --display-name "oauth-hub-instance" \
    --wait-for-state RUNNING \
    --query 'data.id' \
    --raw-output)

if [ -z "$INSTANCE_ID" ]; then
    error "Failed to create compute instance"
fi

log "Instance created successfully: $INSTANCE_ID"

# 3. Get instance public IP
log "Getting instance public IP..."
PUBLIC_IP=$(oci compute instance get \
    --instance-id "$INSTANCE_ID" \
    --query 'data."public-ip"' \
    --raw-output)

if [ -z "$PUBLIC_IP" ]; then
    error "Failed to get instance public IP"
fi

log "Instance public IP: $PUBLIC_IP"

# 4. Wait for SSH to be available
log "Waiting for SSH to be available..."
MAX_RETRIES=30
RETRY_COUNT=0

while ! ssh -o StrictHostKeyChecking=no -o ConnectTimeout=10 ubuntu@"$PUBLIC_IP" "echo 'SSH available'" 2>/dev/null; do
    if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
        error "SSH connection failed after $MAX_RETRIES attempts"
    fi
    log "Waiting for SSH... (attempt $((RETRY_COUNT + 1))/$MAX_RETRIES)"
    sleep 10
    RETRY_COUNT=$((RETRY_COUNT + 1))
done

log "SSH connection established"

# 5. Setup instance and deploy application
log "Setting up instance and deploying application..."

ssh -o StrictHostKeyChecking=no ubuntu@"$PUBLIC_IP" << EOF
    set -e

    # Update system
    sudo apt update && sudo apt upgrade -y

    # Install Node.js
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs

    # Install PM2 for process management
    sudo npm install -g pm2

    # Install Oracle Instant Client (for oracledb)
    sudo apt-get install -y libaio1
    wget https://download.oracle.com/otn_software/linux/instantclient/1923000/instantclient-basic-linux.x64-19.23.0.0.0dbru.zip
    unzip instantclient-basic-linux.x64-19.23.0.0.0dbru.zip
    sudo mv instantclient_19_23 /opt/oracle/
    echo "export LD_LIBRARY_PATH=/opt/oracle/instantclient_19_23:\$LD_LIBRARY_PATH" >> ~/.bashrc
    source ~/.bashrc

    # Create application directory
    mkdir -p /home/ubuntu/oauth-hub
    cd /home/ubuntu/oauth-hub

    # Clone or copy application (assuming GitHub repo)
    git clone https://github.com/Jgracier/Oauth-Hub.git .
    npm install --production

    # Build frontend
    cd frontend
    npm install
    npm run build
    cd ..

    # Create environment file
    cat > .env << ENV_EOF
NODE_ENV=$NODE_ENV
PORT=$APP_PORT
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_CONNECT_STRING=$DB_CONNECT_STRING
CORS_ORIGIN=https://$PUBLIC_IP
ENV_EOF

    # Start application with PM2
    pm2 start server.js --name oauth-hub
    pm2 startup
    pm2 save

    # Setup firewall
    sudo ufw allow $APP_PORT
    sudo ufw allow 22
    sudo ufw --force enable

    log "Application deployed successfully"
EOF

# 6. Verify deployment
log "Verifying deployment..."
sleep 10

if curl -f "http://$PUBLIC_IP:$APP_PORT/health" > /dev/null 2>&1; then
    log "✅ Deployment successful!"
    log "🌐 Application URL: http://$PUBLIC_IP:$APP_PORT"
    log "🔒 Health check: http://$PUBLIC_IP:$APP_PORT/health"
    log "📊 Instance ID: $INSTANCE_ID"
else
    error "Deployment verification failed"
fi

# 7. Optional: Setup domain and SSL (using OCI Load Balancer or DNS)
if [ -n "$DOMAIN_NAME" ]; then
    log "Setting up domain: $DOMAIN_NAME"
    # Add OCI DNS zone and SSL certificate setup here
fi

log "🎉 OAuth Hub deployment completed successfully!"
