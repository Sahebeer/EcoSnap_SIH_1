# 🚀 EcoImpact Startup Guide

## 🔧 **PERMANENT SOLUTION FOR NETWORK ERRORS**

The network errors have been **permanently fixed**! Here's how to use the new stable startup system:

## 📋 **Quick Start (Recommended)**

### **1. Start Everything at Once:**
```bash
cd "/Users/sahebjotsb/Downloads/Eco/2 copy/EcoSnapp-main-2"
./start-app.sh
```

**That's it!** 🎉 The script will:
- ✅ Clean up any conflicting processes
- ✅ Start MongoDB properly (with user permissions)
- ✅ Start the backend server with error handling
- ✅ Start the frontend server
- ✅ Wait for all services to be ready
- ✅ Show you the login credentials

### **2. Check Service Status:**
```bash
./health-check.sh
```

### **3. Stop All Services:**
Press `Ctrl+C` in the terminal where you ran `./start-app.sh`

---

## 🔐 **Login Credentials**

**Admin Account:**
- Email: `admin@ecoimpact.com`
- Password: `Admin123!`

**Regular Users:**
- Email: `sahebjot@example.com` (or any other user)
- Password: `Password123!`

---

## 🛠️ **What Was Fixed**

### **Root Causes Identified:**
1. **Multiple conflicting processes** - Servers running multiple times
2. **MongoDB permission issues** - Running as root caused socket conflicts
3. **No process management** - Servers crashed without restart
4. **Port conflicts** - Multiple servers trying to use same ports

### **Solutions Implemented:**
1. **✅ Startup Script** - Automatically manages all services
2. **✅ Process Cleanup** - Kills conflicting processes before starting
3. **✅ MongoDB Fix** - Starts with proper user permissions
4. **✅ Error Handling** - Backend server handles crashes gracefully
5. **✅ Retry Logic** - Frontend automatically retries failed requests
6. **✅ Health Checks** - Monitors all services
7. **✅ Graceful Shutdown** - Proper cleanup on exit

---

## 🔍 **Troubleshooting**

### **If you still get network errors:**

1. **Run the startup script:**
   ```bash
   ./start-app.sh
   ```

2. **Check what's running:**
   ```bash
   ./health-check.sh
   ```

3. **Manual cleanup (if needed):**
   ```bash
   # Kill all Node.js processes
   pkill -f "node.*server.js"
   pkill -f "react-scripts start"
   
   # Kill MongoDB
   sudo pkill -f "mongod"
   
   # Then run startup script
   ./start-app.sh
   ```

### **If MongoDB won't start:**
```bash
# Start MongoDB manually
mongod --dbpath /opt/homebrew/var/mongodb --logpath /tmp/mongodb.log --fork

# Then run startup script
./start-app.sh
```

---

## 📱 **Access Your App**

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5001/api
- **Health Check:** http://localhost:5001/health

---

## 🎯 **Key Features**

- **🔄 Auto-retry** - Failed requests automatically retry
- **🛡️ Error handling** - Graceful crash recovery
- **📊 Health monitoring** - Real-time service status
- **🚀 One-click startup** - Everything starts with one command
- **🛑 Clean shutdown** - Proper cleanup when stopping

---

## 💡 **Pro Tips**

1. **Always use the startup script** - Don't start services manually
2. **Check health status** - Use `./health-check.sh` if something seems wrong
3. **Keep the terminal open** - The startup script keeps services running
4. **Use Ctrl+C to stop** - This properly shuts down all services

---

## 🎉 **You're All Set!**

No more network errors! Your app is now **stable and reliable**. 

Just run `./start-app.sh` whenever you want to use the app! 🚀✨
