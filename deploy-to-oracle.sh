#!/bin/bash

# OAuth Hub - Oracle Cloud Deployment Script

set -e

echo "🚀 Starting OAuth Hub deployment to Oracle Cloud..."

# Configuration
APP_NAME="oauth-hub"
REGION="us-ashburn-1"  # Update to your preferred region
COMPARTMENT_ID="${OCI_COMPARTMENT_ID}"
SUBNET_ID="${OCI_SUBNET_ID}"
VCN_ID="${OCI_VCN_ID}"

# Build Docker image
echo "📦 Building Docker image..."
docker build -t oauth-hub:latest .

# Login to Oracle Cloud Container Registry (OCIR)
echo "🔐 Logging into Oracle Cloud Container Registry..."
docker login -u ${OCI_TENANCY_NAMESPACE}/${OCI_USERNAME} -p ${OCI_AUTH_TOKEN} ${REGION}.ocir.io

# Tag and push image
IMAGE_NAME="${REGION}.ocir.io/${OCI_TENANCY_NAMESPACE}/${APP_NAME}:latest"
echo "🏷️ Tagging image as ${IMAGE_NAME}"
docker tag oauth-hub:latest ${IMAGE_NAME}

echo "📤 Pushing image to OCIR..."
docker push ${IMAGE_NAME}

# Deploy to Oracle Container Engine for Kubernetes (OKE) or Functions
echo "⚙️ Deploying to Oracle Cloud..."

# Option 1: Deploy as Kubernetes deployment (if using OKE)
if [ "$DEPLOY_METHOD" = "kubernetes" ]; then
  # Create/update Kubernetes deployment
  cat <<EOF | kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: oauth-hub
  labels:
    app: oauth-hub
spec:
  replicas: 2
  selector:
    matchLabels:
      app: oauth-hub
  template:
    metadata:
      labels:
        app: oauth-hub
    spec:
      containers:
      - name: oauth-hub
        image: ${IMAGE_NAME}
        ports:
        - containerPort: 3000
        env:
        - name: PORT
          value: "3000"
        - name: NODE_ENV
          value: "production"
        - name: DB_USER
          valueFrom:
            secretKeyRef:
              name: oauth-hub-secrets
              key: db-user
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: oauth-hub-secrets
              key: db-password
        - name: DB_CONNECT_STRING
          valueFrom:
            secretKeyRef:
              name: oauth-hub-secrets
              key: db-connect-string
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: oauth-hub-secrets
              key: jwt-secret
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: oauth-hub-service
spec:
  selector:
    app: oauth-hub
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: LoadBalancer
EOF

elif [ "$DEPLOY_METHOD" = "functions" ]; then
  # Deploy as Oracle Functions
  fn deploy --app oauth-hub-app --image ${IMAGE_NAME}

else
  echo "❌ Please set DEPLOY_METHOD environment variable to 'kubernetes' or 'functions'"
  exit 1
fi

echo "✅ OAuth Hub successfully deployed to Oracle Cloud!"
echo "🌐 Your app will be available at the assigned Oracle Load Balancer URL"
echo "🔍 Check Oracle Cloud Console for deployment status"
