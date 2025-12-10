# 🍃 MongoDB Atlas Cloud Database Setup

## Quick Setup Guide (5 Minutes):

### Step 1: MongoDB Atlas Account
1. Go to https://www.mongodb.com/atlas
2. Click "Try Free" and create account
3. Create a new cluster (free tier)

### Step 2: Database Setup
1. In Atlas dashboard, click "Connect"
2. Add your IP address (0.0.0.0/0 for development)
3. Create database user with username/password
4. Get connection string

### Step 3: Update .env File
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/grabit?retryWrites=true&w=majority
```

### Step 4: Test Connection
```bash
cd server
npm start
```

## Option 2: Local MongoDB Installation

### For Windows:
1. Download from: https://www.mongodb.com/try/download/community
2. Install MongoDB Community Server
3. Start MongoDB service
4. Use connection string: mongodb://localhost:27017/grabit

## Current Error Solution:
Your server is trying to connect to local MongoDB which isn't running.
Use MongoDB Atlas for quick setup!