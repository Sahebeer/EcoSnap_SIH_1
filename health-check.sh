#!/bin/bash

# EcoImpact Health Check Script
# Monitors all services and restarts if needed

echo "🔍 EcoImpact Health Check"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check MongoDB
check_mongodb() {
    if mongosh --eval "db.runCommand({ping: 1})" --quiet > /dev/null 2>&1; then
        echo -e "${GREEN}✅ MongoDB: Running${NC}"
        return 0
    else
        echo -e "${RED}❌ MongoDB: Not responding${NC}"
        return 1
    fi
}

# Check Backend
check_backend() {
    if curl -s http://localhost:5001/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend: Running${NC}"
        return 0
    else
        echo -e "${RED}❌ Backend: Not responding${NC}"
        return 1
    fi
}

# Check Frontend
check_frontend() {
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Frontend: Running${NC}"
        return 0
    else
        echo -e "${RED}❌ Frontend: Not responding${NC}"
        return 1
    fi
}

# Main check
echo "Checking services..."
check_mongodb
check_backend  
check_frontend

echo -e "\n${YELLOW}To restart all services, run: ./start-app.sh${NC}"
