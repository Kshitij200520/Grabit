# E-Commerce MERN Stack Project Setup Guide

## 🚀 Quick Setup for GitHub Upload

### Step 1: Install Git (If not already done)
1. Download Git from: https://git-scm.com/download/win
2. Run the installer with default settings
3. **Important**: Restart your terminal/PowerShell after installation

### Step 2: Configure Git (First time setup)
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 3: Initialize Repository and Upload to GitHub

Once Git is installed, run these commands in your project folder:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Complete MERN Stack E-commerce Project with HLD/LLD"

# Set main branch
git branch -M main
```

### Step 4: Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `ecommerce-mern-project` (or your preferred name)
3. Description: "Full-stack MERN e-commerce application with system design documentation"
4. Keep it Public (or Private if you prefer)
5. **DON'T** check "Add a README file" (we already have files)
6. Click "Create repository"

### Step 5: Connect and Push to GitHub
Replace `YOUR_USERNAME` with your actual GitHub username:

```bash
git remote add origin https://github.com/YOUR_USERNAME/ecommerce-mern-project.git
git push -u origin main
```

## 📋 Project Features to Highlight
- Full MERN Stack (MongoDB, Express, React, Node.js)
- Professional UI with Dark/Light Theme
- Shopping Cart & Order Management
- 65+ Unique Product Catalog
- System Design Documentation (HLD/LLD)
- Draw.io Professional Diagrams
- Guest Checkout Support
- JWT Authentication

## 🎯 Repository Structure
```
ecommerce-mern-project/
├── client/          # React frontend
├── server/          # Node.js/Express backend
├── *.md files       # Documentation
├── *.drawio         # System design diagrams
└── setup scripts    # Easy startup files
```

## 🔥 After Upload
Your repository URL will be:
`https://github.com/YOUR_USERNAME/ecommerce-mern-project`

Perfect for adding to your resume and showcasing to employers!