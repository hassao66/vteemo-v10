#!/bin/bash

# vteemo Deployment Script
# This script helps deploy the vteemo frontend to production

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SERVER_IP="${SERVER_IP:-185.126.203.170}"
SERVER_USER="${SERVER_USER:-root}"
DEPLOY_PATH="${DEPLOY_PATH:-/var/www/vteemo}"
BUILD_DIR="dist"

echo -e "${GREEN}🚀 vteemo Deployment Script${NC}"
echo "=================================="
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ Error: .env file not found${NC}"
    echo "Please create .env file from .env.example"
    exit 1
fi

# Step 1: Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install

# Step 2: Run linter
echo -e "${YELLOW}🔍 Running linter...${NC}"
npm run lint || {
    echo -e "${RED}⚠️  Linting failed. Continue anyway? (y/n)${NC}"
    read -r response
    if [[ "$response" != "y" ]]; then
        exit 1
    fi
}

# Step 3: Build project
echo -e "${YELLOW}🏗️  Building project...${NC}"
npm run build

if [ ! -d "$BUILD_DIR" ]; then
    echo -e "${RED}❌ Error: Build directory not found${NC}"
    exit 1
fi

# Step 4: Ask for confirmation
echo ""
echo -e "${YELLOW}Ready to deploy to:${NC}"
echo "  Server: $SERVER_USER@$SERVER_IP"
echo "  Path: $DEPLOY_PATH/dist"
echo ""
echo -e "${YELLOW}Continue with deployment? (y/n)${NC}"
read -r confirm

if [[ "$confirm" != "y" ]]; then
    echo -e "${RED}Deployment cancelled${NC}"
    exit 0
fi

# Step 5: Create backup on server
echo -e "${YELLOW}💾 Creating backup on server...${NC}"
ssh "$SERVER_USER@$SERVER_IP" "if [ -d $DEPLOY_PATH/dist ]; then \
    mkdir -p $DEPLOY_PATH/backups && \
    tar -czf $DEPLOY_PATH/backups/dist-\$(date +%Y%m%d-%H%M%S).tar.gz -C $DEPLOY_PATH dist && \
    echo 'Backup created'; \
fi"

# Step 6: Upload files
echo -e "${YELLOW}📤 Uploading files to server...${NC}"
rsync -avz --delete \
    --exclude='.git' \
    --exclude='node_modules' \
    --exclude='.env' \
    "$BUILD_DIR/" "$SERVER_USER@$SERVER_IP:$DEPLOY_PATH/dist/"

# Step 7: Set permissions
echo -e "${YELLOW}🔐 Setting permissions...${NC}"
ssh "$SERVER_USER@$SERVER_IP" "chown -R www-data:www-data $DEPLOY_PATH && \
    chmod -R 755 $DEPLOY_PATH"

# Step 8: Reload Nginx
echo -e "${YELLOW}🔄 Reloading Nginx...${NC}"
ssh "$SERVER_USER@$SERVER_IP" "nginx -t && systemctl reload nginx"

# Success
echo ""
echo -e "${GREEN}✅ Deployment successful!${NC}"
echo ""
echo "Your site should now be live at:"
echo "  🌐 https://vteemo.com"
echo ""
echo "Next steps:"
echo "  1. Visit https://vteemo.com to verify"
echo "  2. Test authentication flow"
echo "  3. Check browser console for errors"
echo "  4. Monitor server logs: ssh $SERVER_USER@$SERVER_IP 'tail -f /var/log/nginx/vteemo_error.log'"
echo ""
