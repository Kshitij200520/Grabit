# E-COMMERCE SYSTEM DESIGN
## HIGH LEVEL DESIGN (HLD) & LOW LEVEL DESIGN (LLD)

![Project Banner](https://via.placeholder.com/1000x200/2196F3/white?text=GRAB+IT+E-COMMERCE+SYSTEM+DESIGN)

---

## 📋 TABLE OF CONTENTS
1. [System Overview](#system-overview)
2. [High Level Design (HLD)](#high-level-design-hld)
3. [Low Level Design (LLD)](#low-level-design-lld)
4. [Database Design](#database-design)
5. [API Design](#api-design)
6. [Architecture Patterns](#architecture-patterns)
7. [Security Design](#security-design)
8. [Scalability Considerations](#scalability-considerations)

---

## 🎯 SYSTEM OVERVIEW

![System Overview](https://via.placeholder.com/800x300/4CAF50/white?text=PROFESSIONAL+E-COMMERCE+PLATFORM)

### Project: Professional E-commerce Platform "Grab It"
**Type:** Full-stack Web Application  
**Architecture:** Client-Server with RESTful APIs  
**Technology Stack:** MERN (MongoDB, Express.js, React.js, Node.js)  
**Purpose:** Complete online shopping platform with cart, payments, and order management

#### Project Highlights:
![Project Features](https://via.placeholder.com/600x200/FF9800/white?text=FEATURES:+CART+|+PAYMENTS+|+ORDERS+|+THEMES)

---

## 🏗️ HIGH LEVEL DESIGN (HLD)

### 1. SYSTEM ARCHITECTURE

![System Architecture](https://via.placeholder.com/800x400/4CAF50/white?text=3-TIER+ARCHITECTURE)

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CLIENT TIER   │    │  SERVER TIER    │    │   DATA TIER     │
│                 │    │                 │    │                 │
│  React Frontend │◄──►│  Node.js/Express│◄──►│   MongoDB       │
│                 │    │                 │    │                 │
│ • Components    │    │ • REST APIs     │    │ • Collections   │
│ • State Mgmt    │    │ • Business Logic│    │ • Indexes       │
│ • UI/UX         │    │ • Authentication│    │ • Aggregation   │
│ • Routing       │    │ • Middleware    │    │ • Transactions  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

#### Architecture Flow Diagram:
![Architecture Flow](https://via.placeholder.com/700x300/2196F3/white?text=REQUEST+FLOW:+USER+→+REACT+→+API+→+DATABASE)

### 2. COMPONENT OVERVIEW

![Component Overview](https://via.placeholder.com/800x500/FF9800/white?text=GRAB+IT+E-COMMERCE+COMPONENTS)

```
┌──────────────────────────────────────────────────────────────┐
│                    GRAB IT E-COMMERCE SYSTEM                 │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Frontend  │  │   Backend   │  │  Database   │         │
│  │             │  │             │  │             │         │
│  │ React.js    │  │ Node.js     │  │ MongoDB     │         │
│  │ Components  │  │ Express.js  │  │ Collections │         │
│  │ Redux/State │  │ REST APIs   │  │ Documents   │         │
│  │ CSS/Styling │  │ Middleware  │  │ Indexes     │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│  EXTERNAL INTEGRATIONS                                       │
│  • Payment Gateway (Mock Razorpay)                          │
│  • Image Storage (Unsplash CDN)                             │
│  • Session Management                                        │
└──────────────────────────────────────────────────────────────┘
```

#### Technology Stack Visualization:
![Tech Stack](https://via.placeholder.com/600x300/9C27B0/white?text=MERN+STACK:+MongoDB+Express+React+Node.js)

### 3. USER FLOW DIAGRAM

![User Flow](https://via.placeholder.com/800x400/E91E63/white?text=USER+JOURNEY:+BROWSE+→+SELECT+→+CART+→+CHECKOUT)

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│ Browse  │───►│ Select  │───►│Add Cart │───►│Checkout │
│Products │    │Product  │    │/Buy Now │    │& Pay    │
└─────────┘    └─────────┘    └─────────┘    └─────────┘
     │              │              │              │
     ▼              ▼              ▼              ▼
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│Category │    │Product  │    │Cart     │    │Order    │
│Filter   │    │Details  │    │Management│   │Tracking │
└─────────┘    └─────────┘    └─────────┘    └─────────┘
```

#### User Experience Flow:
![UX Flow](https://via.placeholder.com/700x250/795548/white?text=UX+FLOW:+DISCOVERY+→+SELECTION+→+PURCHASE)

### 4. SYSTEM MODULES

![System Modules](https://via.placeholder.com/800x500/607D8B/white?text=SYSTEM+MODULES+ARCHITECTURE)

```
GRAB IT E-COMMERCE SYSTEM
│
├── 🎨 FRONTEND MODULES
│   ├── User Interface Components
│   ├── Product Catalog & Search
│   ├── Shopping Cart Management
│   ├── Order Processing
│   ├── User Authentication
│   └── Theme Management
│
├── 🔧 BACKEND MODULES
│   ├── Authentication & Authorization
│   ├── Product Management APIs
│   ├── Cart Management APIs
│   ├── Order Processing APIs
│   ├── Payment Integration
│   └── Delivery Management
│
└── 🗄️ DATABASE MODULES
    ├── User Management
    ├── Product Catalog
    ├── Shopping Cart
    ├── Order Management
    ├── Payment Records
    └── Delivery Tracking
```

#### Module Interaction Diagram:
![Module Interaction](https://via.placeholder.com/600x400/009688/white?text=MODULE+INTERACTIONS+%26+DEPENDENCIES)

---

## 🔧 LOW LEVEL DESIGN (LLD)

### 1. FRONTEND COMPONENT ARCHITECTURE

```
src/
│
├── components/
│   ├── common/
│   │   ├── Header.js           // Navigation & theme toggle
│   │   ├── Footer.js           // Site footer
│   │   ├── ThemeToggle.js      // Dark/Light mode switcher
│   │   └── Loading.js          // Loading spinner
│   │
│   ├── product/
│   │   ├── ProductCard.js      // Individual product display
│   │   ├── ProductList.js      // Product grid/list
│   │   ├── ProductDetail.js    // Detailed product view
│   │   └── ProductFilter.js    // Category/price filters
│   │
│   ├── cart/
│   │   ├── CartItem.js         // Single cart item
│   │   ├── CartSummary.js      // Cart totals
│   │   └── CartPage.js         // Full cart view
│   │
│   └── order/
│       ├── OrderItem.js        // Order history item
│       ├── OrderSummary.js     // Order details
│       └── OrdersPage.js       // Order history
│
├── contexts/
│   ├── ThemeContext.js         // Theme state management
│   └── CartContext.js          // Cart state management
│
├── pages/
│   ├── Home.js                 // Landing page
│   ├── Products.js             // Product catalog
│   ├── Cart.js                 // Shopping cart
│   └── Orders.js               // Order history
│
├── services/
│   ├── api.js                  // API configuration
│   ├── productService.js       // Product API calls
│   ├── cartService.js          // Cart API calls
│   └── orderService.js         // Order API calls
│
└── styles/
    ├── index.css               // Global styles
    ├── ThemeToggle.css         // Theme toggle styles
    └── components/             // Component-specific styles
```

### 2. BACKEND API ARCHITECTURE

```
server/
│
├── routes/
│   ├── users.js                // User authentication routes
│   ├── products.js             // Product CRUD routes
│   ├── cart.js                 // Cart management routes
│   ├── orders.js               // Order processing routes
│   ├── payments.js             // Payment handling routes
│   └── delivery.js             // Delivery management routes
│
├── models/
│   ├── User.js                 // User schema
│   ├── Product.js              // Product schema
│   ├── Cart.js                 // Cart schema
│   ├── Order.js                // Order schema
│   ├── Payment.js              // Payment schema
│   └── Delivery.js             // Delivery schema
│
├── middleware/
│   ├── auth.js                 // JWT authentication
│   ├── validation.js           // Input validation
│   └── errorHandler.js         // Error handling
│
├── services/
│   ├── authService.js          // Authentication logic
│   ├── paymentService.js       // Payment processing
│   └── deliveryService.js      // Delivery management
│
├── utils/
│   ├── jwt.js                  // JWT utilities
│   ├── validation.js           // Validation helpers
│   └── helpers.js              // Common utilities
│
└── config/
    ├── database.js             // MongoDB configuration
    └── environment.js          // Environment variables
```

### 3. DETAILED COMPONENT DESIGN

#### A. ProductCard Component
```javascript
// Low-level component structure
ProductCard.js
├── Props Interface
│   ├── product: Object (id, name, price, image, description)
│   ├── onAddToCart: Function
│   └── onBuyNow: Function
│
├── State Management
│   ├── loading: Boolean
│   └── error: String
│
├── Methods
│   ├── handleAddToCart()
│   ├── handleBuyNow()
│   └── handleImageError()
│
└── Render Logic
    ├── Product Image
    ├── Product Details
    ├── Price Display
    ├── Action Buttons
    └── Error Handling
```

#### B. Cart Management System
```javascript
// Cart state management flow
CartContext
├── State Structure
│   ├── items: Array<CartItem>
│   ├── totalAmount: Number
│   ├── totalItems: Number
│   └── loading: Boolean
│
├── Actions
│   ├── ADD_TO_CART
│   ├── REMOVE_FROM_CART
│   ├── UPDATE_QUANTITY
│   ├── CLEAR_CART
│   └── SET_LOADING
│
└── API Integration
    ├── fetchCart()
    ├── addToCart(productId, quantity)
    ├── updateCart(productId, quantity)
    └── removeFromCart(productId)
```

### 4. API ENDPOINT DESIGN

#### Authentication APIs
```
POST /api/users/register
├── Request Body: { name, email, password }
├── Validation: Email format, password strength
├── Process: Hash password, create user
└── Response: { user, token }

POST /api/users/login
├── Request Body: { email, password }
├── Validation: Email exists, password match
├── Process: Generate JWT token
└── Response: { user, token }
```

#### Product APIs
```
GET /api/products
├── Query Parameters: { category, search, page, limit }
├── Process: Filter, search, paginate
└── Response: { products[], totalCount, currentPage }

GET /api/products/:id
├── Parameters: Product ID
├── Process: Find by ID, populate details
└── Response: { product }
```

#### Cart APIs
```
POST /api/cart/add
├── Request Body: { productId, quantity }
├── Authentication: JWT token or session
├── Process: Add/update cart item
└── Response: { message, cart }

GET /api/cart
├── Authentication: JWT token or session
├── Process: Fetch user cart
└── Response: { items[], totalAmount }
```

---

## 🗄️ DATABASE DESIGN

### 1. COLLECTION SCHEMAS

#### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (default: 'user'),
  profile: {
    phone: String,
    address: Object
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### Products Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  category: String,
  stock: Number,
  image: String (URL),
  featured: Boolean,
  rating: Number,
  reviews: [{
    user: String,
    rating: Number,
    comment: String,
    date: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

#### Cart Collection
```javascript
{
  _id: ObjectId,
  user: String, // User ID or Guest ID
  items: [{
    product: ObjectId (ref: Products),
    quantity: Number,
    price: Number
  }],
  totalAmount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

#### Orders Collection
```javascript
{
  _id: ObjectId,
  user: String, // User ID or Guest ID
  orderItems: [{
    product: ObjectId (ref: Products),
    name: String,
    quantity: Number,
    price: Number,
    image: String
  }],
  shippingAddress: {
    fullName: String,
    address: String,
    city: String,
    postalCode: String,
    country: String
  },
  paymentMethod: String,
  paymentResult: {
    id: String,
    status: String,
    email: String
  },
  totalPrice: Number,
  orderStatus: String (default: 'pending'),
  deliveryInfo: {
    estimatedDate: Date,
    trackingNumber: String,
    deliveryExecutive: ObjectId (ref: DeliveryPersonnel)
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 2. DATABASE RELATIONSHIPS

![Database ER Diagram](https://via.placeholder.com/800x600/3F51B5/white?text=DATABASE+ER+DIAGRAM)

```
Users (1) ──────── (N) Orders
Users (1) ──────── (1) Cart
Products (1) ─────── (N) CartItems
Products (1) ─────── (N) OrderItems
Orders (1) ──────── (1) DeliveryInfo
DeliveryPersonnel (1) ─ (N) Orders
```

#### Entity Relationship Visualization:
![ER Model](https://via.placeholder.com/700x400/FF5722/white?text=ENTITY+RELATIONSHIPS+%26+CARDINALITY)

### 3. INDEXING STRATEGY

```javascript
// Products Collection Indexes
db.products.createIndex({ "category": 1 })
db.products.createIndex({ "name": "text", "description": "text" })
db.products.createIndex({ "price": 1 })
db.products.createIndex({ "featured": 1 })

// Orders Collection Indexes
db.orders.createIndex({ "user": 1 })
db.orders.createIndex({ "orderStatus": 1 })
db.orders.createIndex({ "createdAt": -1 })

// Cart Collection Indexes
db.cart.createIndex({ "user": 1 })
```

---

## 🔌 API DESIGN

### 1. RESTful API STRUCTURE

```
Base URL: http://localhost:5000/api

Authentication & Users:
├── POST   /users/register          Create new user account
├── POST   /users/login             User authentication
├── GET    /users/profile           Get user profile
└── PUT    /users/profile           Update user profile

Product Management:
├── GET    /products                Get all products (with filters)
├── GET    /products/:id            Get single product details
├── GET    /products/category/:cat  Get products by category
└── GET    /products/search/:query  Search products

Shopping Cart:
├── GET    /cart                    Get user cart
├── POST   /cart/add                Add item to cart
├── PUT    /cart/update/:productId  Update item quantity
├── DELETE /cart/remove/:productId  Remove item from cart
└── DELETE /cart/clear              Clear entire cart

Order Management:
├── GET    /orders                  Get user orders
├── POST   /orders                  Create new order
├── GET    /orders/:id              Get order details
└── PUT    /orders/:id/status       Update order status

Payment Processing:
├── POST   /payments/order          Create payment order
├── POST   /payments/verify         Verify payment
└── GET    /payments/history        Payment history

Delivery Management:
├── GET    /delivery                Get delivery personnel
├── GET    /delivery/available      Get available personnel
└── PUT    /delivery/:id/status     Update delivery status
```

### 2. REQUEST/RESPONSE FORMATS

#### Standard Response Format
```javascript
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ },
  "timestamp": "2025-10-01T10:30:00Z"
}

// Error Response
{
  "success": false,
  "message": "Error description",
  "error": { /* error details */ },
  "timestamp": "2025-10-01T10:30:00Z"
}
```

#### Authentication Headers
```javascript
Headers: {
  "Authorization": "Bearer <jwt_token>",
  "Content-Type": "application/json"
}
```

---

## 🏛️ ARCHITECTURE PATTERNS

### 1. MVC PATTERN

![MVC Architecture](https://via.placeholder.com/800x500/8BC34A/white?text=MVC+PATTERN+IMPLEMENTATION)

```
Model (MongoDB Schemas)
├── User Model
├── Product Model
├── Cart Model
└── Order Model

View (React Components)
├── User Interface
├── Product Display
├── Cart Interface
└── Order Interface

Controller (Express Routes)
├── User Controller
├── Product Controller
├── Cart Controller
└── Order Controller
```

#### MVC Flow Diagram:
![MVC Flow](https://via.placeholder.com/600x300/FFC107/black?text=USER+→+VIEW+→+CONTROLLER+→+MODEL+→+DATABASE)

### 2. LAYERED ARCHITECTURE

![Layered Architecture](https://via.placeholder.com/800x400/673AB7/white?text=4-LAYER+ARCHITECTURE)

```
┌─────────────────────────────────┐
│        PRESENTATION LAYER       │  React Components, UI/UX
├─────────────────────────────────┤
│         SERVICE LAYER           │  Business Logic, APIs
├─────────────────────────────────┤
│        DATA ACCESS LAYER        │  MongoDB Operations
├─────────────────────────────────┤
│         DATABASE LAYER          │  MongoDB Collections
└─────────────────────────────────┘
```

#### Layer Communication:
![Layer Communication](https://via.placeholder.com/600x350/00BCD4/white?text=LAYER+INTERACTIONS+%26+DATA+FLOW)

### 3. COMPONENT-BASED ARCHITECTURE
```
React Application
├── Container Components (Smart)
│   ├── ProductContainer
│   ├── CartContainer
│   └── OrderContainer
│
└── Presentational Components (Dumb)
    ├── ProductCard
    ├── CartItem
    └── OrderItem
```

---

## 🔒 SECURITY DESIGN

### 1. AUTHENTICATION & AUTHORIZATION
```javascript
// JWT Token Structure
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "userId": "user_id",
    "email": "user@example.com",
    "role": "user",
    "iat": timestamp,
    "exp": timestamp
  }
}

// Authorization Middleware
const authMiddleware = (req, res, next) => {
  // Extract token from header
  // Verify JWT token
  // Attach user info to request
  // Call next() or return error
}
```

### 2. DATA VALIDATION
```javascript
// Input Validation Schema
const productValidation = {
  name: { required: true, minLength: 3, maxLength: 100 },
  price: { required: true, type: 'number', min: 0 },
  category: { required: true, enum: ['Electronics', 'Fashion', 'Sports', 'Home'] },
  stock: { required: true, type: 'number', min: 0 }
}

// Password Security
- Minimum 8 characters
- Hash using bcrypt with salt rounds: 12
- Store only hashed passwords
```

### 3. SESSION MANAGEMENT
```javascript
// Guest User Session
const guestSession = {
  sessionId: 'guest_timestamp_random',
  cart: [],
  expiresIn: '24h'
}

// Authenticated User Session
const userSession = {
  userId: 'user_id',
  token: 'jwt_token',
  cart: [],
  expiresIn: '7d'
}
```

---

## 📈 SCALABILITY CONSIDERATIONS

### 1. HORIZONTAL SCALING

![Horizontal Scaling](https://via.placeholder.com/800x500/4CAF50/white?text=HORIZONTAL+SCALING+ARCHITECTURE)

```
Load Balancer
├── Server Instance 1
├── Server Instance 2
└── Server Instance 3
        │
        ▼
   MongoDB Cluster
   ├── Primary Node
   ├── Secondary Node 1
   └── Secondary Node 2
```

#### Scaling Strategy:
![Scaling Strategy](https://via.placeholder.com/700x300/795548/white?text=LOAD+BALANCING+%26+DATABASE+CLUSTERING)

### 2. CACHING STRATEGY
```javascript
// Redis Caching
const cacheStrategy = {
  productCatalog: '30min',     // Product listings
  userSessions: '24h',         // User sessions
  cartData: '2h',              // Shopping cart
  apiResponses: '5min'         // API responses
}
```

### 3. DATABASE OPTIMIZATION
```javascript
// Query Optimization
- Use indexes for frequent queries
- Implement pagination for large datasets
- Use aggregation pipelines for complex queries
- Monitor slow queries and optimize

// Connection Pooling
mongoose.connect(uri, {
  maxPoolSize: 10,         // Maximum connections
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferMaxEntries: 0
})
```

### 4. PERFORMANCE MONITORING
```javascript
// Metrics to Monitor
const performanceMetrics = {
  responseTime: 'API response times',
  throughput: 'Requests per second',
  errorRate: 'Error percentage',
  memoryUsage: 'Server memory consumption',
  dbConnections: 'Database connection pool',
  userSessions: 'Active user sessions'
}
```

---

## 📊 SYSTEM METRICS & KPIs

### 1. TECHNICAL METRICS
- **Response Time:** < 200ms for API calls
- **Uptime:** 99.9% availability
- **Throughput:** 1000+ concurrent users
- **Database Queries:** < 100ms average

### 2. BUSINESS METRICS
- **Conversion Rate:** Cart to Order conversion
- **User Engagement:** Session duration
- **Product Performance:** View to purchase ratio
- **System Health:** Error rates and monitoring

---

## 🎯 DEPLOYMENT ARCHITECTURE

### 1. DEVELOPMENT ENVIRONMENT
```
Local Development
├── React Dev Server (Port 3000)
├── Node.js Server (Port 5000)
└── MongoDB Local Instance (Port 27017)
```

### 2. PRODUCTION ARCHITECTURE

![Production Deployment](https://via.placeholder.com/800x500/FF5722/white?text=CLOUD+DEPLOYMENT+ARCHITECTURE)

```
Cloud Deployment (AWS/Azure/GCP)
├── Frontend: CDN + Static Hosting
├── Backend: Container Service (Docker)
├── Database: Managed MongoDB Service
├── Load Balancer: Application Load Balancer
└── Monitoring: CloudWatch/Application Insights
```

#### Deployment Flow:
![Deployment Flow](https://via.placeholder.com/700x350/9E9E9E/white?text=CI%2FCD+PIPELINE+%26+DEPLOYMENT+STRATEGY)

---

## 📝 CONCLUSION

This comprehensive system design document covers both High Level Design (HLD) and Low Level Design (LLD) for the "Grab It" e-commerce platform. The design ensures:

✅ **Scalability:** Modular architecture supports horizontal scaling  
✅ **Maintainability:** Clear separation of concerns and layered design  
✅ **Security:** JWT authentication and input validation  
✅ **Performance:** Optimized database queries and caching strategy  
✅ **User Experience:** Responsive design and smooth interactions  
✅ **Academic Excellence:** Professional system design principles  

This design serves as a comprehensive blueprint for implementing and scaling the e-commerce platform while maintaining code quality and system reliability.

---

**Document Version:** 1.0  
**Last Updated:** October 1, 2025  
**Prepared By:** System Design Team  
**Project:** Grab It E-commerce Platform