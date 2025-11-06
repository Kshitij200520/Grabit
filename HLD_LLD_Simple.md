# SYSTEM DESIGN - HLD & LLD
## E-COMMERCE PROJECT

---

## 🏗️ HIGH LEVEL DESIGN (HLD)

### 1. SYSTEM ARCHITECTURE
![HLD Architecture](https://via.placeholder.com/800x600/4CAF50/white?text=HIGH+LEVEL+DESIGN+-+3+TIER+ARCHITECTURE)

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

### 2. COMPONENT OVERVIEW
![HLD Components](https://via.placeholder.com/800x500/2196F3/white?text=HLD+-+SYSTEM+COMPONENTS)

```
GRAB IT E-COMMERCE SYSTEM
│
├── 🎨 FRONTEND
│   ├── Product Catalog
│   ├── Shopping Cart
│   ├── Order Management
│   └── User Interface
│
├── 🔧 BACKEND
│   ├── REST APIs
│   ├── Authentication
│   ├── Business Logic
│   └── Data Processing
│
└── 🗄️ DATABASE
    ├── User Data
    ├── Product Catalog
    ├── Cart & Orders
    └── Payment Records
```

### 3. USER FLOW
![HLD User Flow](https://via.placeholder.com/700x400/FF9800/white?text=HLD+-+USER+FLOW+DIAGRAM)

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│ Browse  │───►│ Select  │───►│Add Cart │───►│Checkout │
│Products │    │Product  │    │/Buy Now │    │& Pay    │
└─────────┘    └─────────┘    └─────────┘    └─────────┘
```

---

## 🔧 LOW LEVEL DESIGN (LLD)

### 1. FRONTEND ARCHITECTURE
![LLD Frontend](https://via.placeholder.com/800x600/9C27B0/white?text=LLD+-+FRONTEND+ARCHITECTURE)

```
src/
├── components/
│   ├── ProductCard.js
│   ├── CartItem.js
│   ├── OrderItem.js
│   └── ThemeToggle.js
│
├── pages/
│   ├── Home.js
│   ├── Products.js
│   ├── Cart.js
│   └── Orders.js
│
├── services/
│   ├── api.js
│   ├── productService.js
│   └── cartService.js
│
└── contexts/
    ├── ThemeContext.js
    └── CartContext.js
```

### 2. BACKEND ARCHITECTURE
![LLD Backend](https://via.placeholder.com/800x600/E91E63/white?text=LLD+-+BACKEND+ARCHITECTURE)

```
server/
├── routes/
│   ├── products.js
│   ├── cart.js
│   ├── orders.js
│   └── users.js
│
├── models/
│   ├── Product.js
│   ├── Cart.js
│   ├── Order.js
│   └── User.js
│
├── middleware/
│   ├── auth.js
│   └── validation.js
│
└── services/
    ├── paymentService.js
    └── deliveryService.js
```

### 3. DATABASE DESIGN
![LLD Database](https://via.placeholder.com/800x500/607D8B/white?text=LLD+-+DATABASE+SCHEMA)

```
MongoDB Collections:

┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    USERS    │    │  PRODUCTS   │    │    CART     │
├─────────────┤    ├─────────────┤    ├─────────────┤
│ _id         │    │ _id         │    │ _id         │
│ name        │    │ name        │    │ user        │
│ email       │    │ price       │    │ items[]     │
│ password    │    │ category    │    │ totalAmount │
│ createdAt   │    │ stock       │    │ createdAt   │
└─────────────┘    │ image       │    └─────────────┘
                   │ createdAt   │
                   └─────────────┘

┌─────────────┐    ┌─────────────┐
│   ORDERS    │    │  PAYMENTS   │
├─────────────┤    ├─────────────┤
│ _id         │    │ _id         │
│ user        │    │ orderId     │
│ orderItems[]│    │ amount      │
│ totalPrice  │    │ status      │
│ status      │    │ method      │
│ createdAt   │    │ createdAt   │
└─────────────┘    └─────────────┘
```

### 4. API DESIGN
![LLD API](https://via.placeholder.com/700x500/795548/white?text=LLD+-+API+ENDPOINTS)

```
REST API Endpoints:

📦 PRODUCTS
├── GET    /api/products          # Get all products
├── GET    /api/products/:id      # Get single product
└── GET    /api/products/search   # Search products

🛒 CART
├── GET    /api/cart              # Get user cart
├── POST   /api/cart/add          # Add to cart
├── PUT    /api/cart/update/:id   # Update quantity
└── DELETE /api/cart/remove/:id   # Remove item

📋 ORDERS
├── GET    /api/orders            # Get user orders
├── POST   /api/orders            # Create order
└── GET    /api/orders/:id        # Get order details

🔐 USERS
├── POST   /api/users/register    # User registration
├── POST   /api/users/login       # User login
└── GET    /api/users/profile     # User profile
```

### 5. MVC PATTERN
![LLD MVC](https://via.placeholder.com/600x400/009688/white?text=LLD+-+MVC+ARCHITECTURE)

```
┌─────────────────┐
│      VIEW       │  React Components
│   (Frontend)    │  ├── ProductCard
│                 │  ├── CartItem
│                 │  └── OrderItem
└─────────────────┘
         │
         ▼ HTTP Requests
┌─────────────────┐
│   CONTROLLER    │  Express Routes
│   (Backend)     │  ├── productRoutes
│                 │  ├── cartRoutes
│                 │  └── orderRoutes
└─────────────────┘
         │
         ▼ Database Queries
┌─────────────────┐
│     MODEL       │  MongoDB Schemas
│   (Database)    │  ├── Product
│                 │  ├── Cart
│                 │  └── Order
└─────────────────┘
```

---

## 📊 SUMMARY

### HLD Focus:
- ✅ Overall System Architecture
- ✅ Component Interaction
- ✅ User Flow Design
- ✅ Technology Stack

### LLD Focus:
- ✅ Detailed Code Structure
- ✅ Database Schema Design
- ✅ API Endpoint Specifications
- ✅ MVC Implementation

**Document Type:** System Design  
**Project:** E-commerce Platform  
**Architecture:** MERN Stack  
**Date:** October 1, 2025