#!/bin/bash

# EcoImpact Simple Startup Script
# This script handles MongoDB service conflicts properly

echo "🌱 Starting EcoImpact Application..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Function to stop conflicting services
stop_conflicts() {
    echo -e "${YELLOW}🔄 Stopping conflicting services...${NC}"
    
    # Stop MongoDB service
    brew services stop mongodb-community@7.0 2>/dev/null || true
    
    # Kill any remaining processes
    pkill -f "node.*server.js" 2>/dev/null || true
    pkill -f "react-scripts start" 2>/dev/null || true
    
    # Clean up socket files
    sudo rm -f /tmp/mongodb-27017.sock 2>/dev/null || true
    
    sleep 2
}

# Function to start MongoDB
start_mongodb() {
    echo -e "${BLUE}🗄️  Starting MongoDB...${NC}"
    
    # Start MongoDB service
    brew services start mongodb-community@7.0
    
    # Wait for MongoDB to be ready
    for i in {1..10}; do
        if mongosh --eval "db.runCommand({ping: 1})" --quiet > /dev/null 2>&1; then
            echo -e "${GREEN}✅ MongoDB is ready!${NC}"
            return 0
        fi
        echo -e "${YELLOW}⏳ Waiting for MongoDB... (attempt $i/10)${NC}"
        sleep 2
    done
    
    echo -e "${RED}❌ MongoDB failed to start${NC}"
    return 1
}

# Function to start backend
start_backend() {
    echo -e "${BLUE}🚀 Starting Backend Server...${NC}"
    
    cd "/Users/sahebjotsb/Downloads/Eco/2 copy/EcoSnapp-main-2/server"
    npm start &
    BACKEND_PID=$!
    
    # Wait for backend
    for i in {1..15}; do
        if curl -s http://localhost:5001/health > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Backend server is ready!${NC}"
            return 0
        fi
        echo -e "${YELLOW}⏳ Waiting for backend... (attempt $i/15)${NC}"
        sleep 2
    done
    
    echo -e "${RED}❌ Backend server failed to start${NC}"
    return 1
}

# Function to start frontend
start_frontend() {
    echo -e "${BLUE}🎨 Starting Frontend Server...${NC}"
    
    cd "/Users/sahebjotsb/Downloads/Eco/2 copy/EcoSnapp-main-2/client"
    npm start &
    FRONTEND_PID=$!
    
    # Wait for frontend
    for i in {1..20}; do
        if curl -s http://localhost:3000 > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Frontend server is ready!${NC}"
            return 0
        fi
        echo -e "${YELLOW}⏳ Waiting for frontend... (attempt $i/20)${NC}"
        sleep 3
    done
    
    echo -e "${RED}❌ Frontend server failed to start${NC}"
    return 1
}

# Function to show status
show_status() {
    echo -e "\n${GREEN}🎉 EcoImpact Application Started Successfully!${NC}"
    echo -e "${BLUE}📱 Frontend: http://localhost:3000${NC}"
    echo -e "${BLUE}🚀 Backend: http://localhost:5001${NC}"
    echo -e "${BLUE}🗄️  Database: MongoDB (localhost:27017)${NC}"
    echo -e "\n${YELLOW}📋 Login Credentials:${NC}"
    echo -e "Admin: admin@ecoimpact.com / Admin123!"
    echo -e "User: sahebjot@example.com / Password123!"
    echo -e "\n${GREEN}✨ Ready to use!${NC}"
}

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Shutting down services...${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    brew services stop mongodb-community@7.0 2>/dev/null || true
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Main execution
main() {
    echo -e "${GREEN}🌱 EcoImpact Simple Startup${NC}"
    echo -e "${BLUE}============================${NC}\n"
    
    # Step 1: Stop conflicts
    stop_conflicts
    
    # Step 2: Start MongoDB
    if ! start_mongodb; then
        echo -e "${RED}❌ Failed to start MongoDB. Exiting.${NC}"
        exit 1
    fi
    
    # Step 3: Start Backend
    if ! start_backend; then
        echo -e "${RED}❌ Failed to start backend. Exiting.${NC}"
        exit 1
    fi
    
    # Step 4: Start Frontend
    if ! start_frontend; then
        echo -e "${RED}❌ Failed to start frontend. Exiting.${NC}"
        exit 1
    fi
    
    # Step 5: Show status
    show_status
    
    # Keep script running
    echo -e "\n${YELLOW}Press Ctrl+C to stop all services${NC}"
    wait
}

# Run main function
main "$@"
