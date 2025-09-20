#!/bin/bash

# EcoImpact App Startup Script
# This script ensures stable startup of all services

echo "🌱 Starting EcoImpact Application..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to kill existing processes
kill_existing_processes() {
    echo -e "${YELLOW}🔄 Cleaning up existing processes...${NC}"
    
    # Kill existing Node.js processes for this project
    pkill -f "node.*server.js" 2>/dev/null || true
    pkill -f "react-scripts start" 2>/dev/null || true
    
    # Stop MongoDB service if running
    brew services stop mongodb-community@7.0 2>/dev/null || true
    
    # Kill any remaining MongoDB processes
    sudo pkill -f "mongod" 2>/dev/null || true
    pkill -f "mongod" 2>/dev/null || true
    
    # Clean up socket files
    sudo rm -f /tmp/mongodb-27017.sock 2>/dev/null || true
    
    sleep 3
}

# Function to start MongoDB
start_mongodb() {
    echo -e "${BLUE}🗄️  Starting MongoDB...${NC}"
    
    # Check if MongoDB is already running
    if mongosh --eval "db.runCommand({ping: 1})" --quiet > /dev/null 2>&1; then
        echo -e "${GREEN}✅ MongoDB is already running!${NC}"
        return 0
    fi
    
    # Try to start MongoDB as user (not root)
    echo -e "${YELLOW}🔄 Starting MongoDB with user permissions...${NC}"
    
    # Method 1: Start with fork (preferred)
    mongod --dbpath /opt/homebrew/var/mongodb --logpath /tmp/mongodb.log --fork 2>/dev/null || {
        echo -e "${YELLOW}⚠️  Fork method failed, trying direct start...${NC}"
        
        # Method 2: Start without fork
        mongod --dbpath /opt/homebrew/var/mongodb --logpath /tmp/mongodb.log &
        MONGODB_PID=$!
        sleep 3
        
        # Check if it started successfully
        if ! kill -0 $MONGODB_PID 2>/dev/null; then
            echo -e "${RED}❌ MongoDB failed to start${NC}"
            return 1
        fi
    }
    
    # Wait for MongoDB to be ready
    for i in {1..15}; do
        if mongosh --eval "db.runCommand({ping: 1})" --quiet > /dev/null 2>&1; then
            echo -e "${GREEN}✅ MongoDB is ready!${NC}"
            return 0
        fi
        echo -e "${YELLOW}⏳ Waiting for MongoDB... (attempt $i/15)${NC}"
        sleep 2
    done
    
    echo -e "${RED}❌ MongoDB failed to start after 30 seconds${NC}"
    echo -e "${RED}MongoDB logs:${NC}"
    tail -10 /tmp/mongodb.log 2>/dev/null || echo "No logs available"
    return 1
}

# Function to start backend server
start_backend() {
    echo -e "${BLUE}🚀 Starting Backend Server...${NC}"
    
    cd "/Users/sahebjotsb/Downloads/Eco/2 copy/EcoSnapp-main-2/server"
    
    # Start backend in background
    npm start > /tmp/backend.log 2>&1 &
    BACKEND_PID=$!
    
    # Wait for backend to be ready
    for i in {1..15}; do
        if curl -s http://localhost:5001/health > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Backend server is ready!${NC}"
            return 0
        fi
        echo -e "${YELLOW}⏳ Waiting for backend... (attempt $i/15)${NC}"
        sleep 2
    done
    
    echo -e "${RED}❌ Backend server failed to start${NC}"
    echo -e "${RED}Backend logs:${NC}"
    tail -20 /tmp/backend.log
    return 1
}

# Function to start frontend server
start_frontend() {
    echo -e "${BLUE}🎨 Starting Frontend Server...${NC}"
    
    cd "/Users/sahebjotsb/Downloads/Eco/2 copy/EcoSnapp-main-2/client"
    
    # Start frontend in background
    npm start > /tmp/frontend.log 2>&1 &
    FRONTEND_PID=$!
    
    # Wait for frontend to be ready
    for i in {1..20}; do
        if curl -s http://localhost:3000 > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Frontend server is ready!${NC}"
            return 0
        fi
        echo -e "${YELLOW}⏳ Waiting for frontend... (attempt $i/20)${NC}"
        sleep 3
    done
    
    echo -e "${RED}❌ Frontend server failed to start${NC}"
    echo -e "${RED}Frontend logs:${NC}"
    tail -20 /tmp/frontend.log
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

# Function to handle cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Shutting down services...${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    pkill -f "mongod.*--dbpath" 2>/dev/null || true
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Main execution
main() {
    echo -e "${GREEN}🌱 EcoImpact Startup Script${NC}"
    echo -e "${BLUE}==============================${NC}\n"
    
    # Step 1: Clean up existing processes
    kill_existing_processes
    
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
