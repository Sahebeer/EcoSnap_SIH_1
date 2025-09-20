#!/bin/bash

# EcoImpact Manual Startup Script
# Bypasses MongoDB service issues

echo "🌱 Starting EcoImpact Application (Manual Mode)..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Function to cleanup
cleanup() {
    echo -e "\n${YELLOW}🛑 Shutting down services...${NC}"
    pkill -f "mongod.*--dbpath" 2>/dev/null || true
    pkill -f "node.*server.js" 2>/dev/null || true
    pkill -f "react-scripts start" 2>/dev/null || true
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Main execution
main() {
    echo -e "${GREEN}🌱 EcoImpact Manual Startup${NC}"
    echo -e "${BLUE}===========================${NC}\n"
    
    # Step 1: Clean up
    echo -e "${YELLOW}🔄 Cleaning up existing processes...${NC}"
    pkill -f "mongod.*--dbpath" 2>/dev/null || true
    pkill -f "node.*server.js" 2>/dev/null || true
    pkill -f "react-scripts start" 2>/dev/null || true
    sudo rm -f /tmp/mongodb-27017.sock 2>/dev/null || true
    sleep 2
    
    # Step 2: Start MongoDB manually
    echo -e "${BLUE}🗄️  Starting MongoDB manually...${NC}"
    mongod --dbpath /opt/homebrew/var/mongodb --logpath /tmp/mongodb.log &
    MONGODB_PID=$!
    sleep 5
    
    # Check if MongoDB started
    if ! kill -0 $MONGODB_PID 2>/dev/null; then
        echo -e "${RED}❌ MongoDB failed to start${NC}"
        exit 1
    fi
    
    # Wait for MongoDB to be ready
    for i in {1..10}; do
        if mongosh --eval "db.runCommand({ping: 1})" --quiet > /dev/null 2>&1; then
            echo -e "${GREEN}✅ MongoDB is ready!${NC}"
            break
        fi
        echo -e "${YELLOW}⏳ Waiting for MongoDB... (attempt $i/10)${NC}"
        sleep 2
    done
    
    # Step 3: Start Backend
    echo -e "${BLUE}🚀 Starting Backend Server...${NC}"
    cd "/Users/sahebjotsb/Downloads/Eco/2 copy/EcoSnapp-main-2/server"
    npm start &
    BACKEND_PID=$!
    sleep 5
    
    # Wait for backend
    for i in {1..10}; do
        if curl -s http://localhost:5001/health > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Backend server is ready!${NC}"
            break
        fi
        echo -e "${YELLOW}⏳ Waiting for backend... (attempt $i/10)${NC}"
        sleep 2
    done
    
    # Step 4: Start Frontend
    echo -e "${BLUE}🎨 Starting Frontend Server...${NC}"
    cd "/Users/sahebjotsb/Downloads/Eco/2 copy/EcoSnapp-main-2/client"
    npm start &
    FRONTEND_PID=$!
    sleep 5
    
    # Wait for frontend
    for i in {1..10}; do
        if curl -s http://localhost:3000 > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Frontend server is ready!${NC}"
            break
        fi
        echo -e "${YELLOW}⏳ Waiting for frontend... (attempt $i/10)${NC}"
        sleep 3
    done
    
    # Step 5: Show status
    echo -e "\n${GREEN}🎉 EcoImpact Application Started Successfully!${NC}"
    echo -e "${BLUE}📱 Frontend: http://localhost:3000${NC}"
    echo -e "${BLUE}🚀 Backend: http://localhost:5001${NC}"
    echo -e "${BLUE}🗄️  Database: MongoDB (localhost:27017)${NC}"
    echo -e "\n${YELLOW}📋 Login Credentials:${NC}"
    echo -e "Admin: admin@ecoimpact.com / Admin123!"
    echo -e "User: sahebjot@example.com / Password123!"
    echo -e "\n${GREEN}✨ Ready to use!${NC}"
    echo -e "\n${YELLOW}Press Ctrl+C to stop all services${NC}"
    
    # Keep script running
    wait
}

# Run main function
main "$@"
