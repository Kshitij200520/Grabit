# Grab It - Quick & Easy Shopping Platform

A full-stack shopping application demonstrating the complete workflow from adding items to cart to placing orders.

## Features

### Customer Workflow
1. **Browse Products** - View featured products and search/filter products
2. **Add to Cart** - Add products to shopping cart with quantity selection
3. **Cart Management** - Update quantities, remove items, view cart total
4. **Checkout Process** - Enter shipping information and payment method
5. **Order Placement** - Create order and receive confirmation
6. **Order Tracking** - View order history and details

### Technical Features
- User authentication (login/register)
- Real-time cart updates
- Inventory management (stock tracking)
- Order status tracking
- Responsive design
- Demo user for quick testing

## Tech Stack

### Frontend
- **React** - User interface library
- **React Router** - Client-side routing
- **Context API** - State management
- **Axios** - HTTP client
- **CSS3** - Styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context for state management
│   │   ├── services/       # API service functions
│   │   └── App.js          # Main app component
│   └── public/             # Static files
├── server/                 # Node.js backend
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── controllers/        # Route handlers
│   ├── middleware/         # Custom middleware
│   └── server.js           # Server entry point
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SD Assignment
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**
   Create a `.env` file in the server directory:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

5. **Start MongoDB**
   Make sure MongoDB is running on your system or use MongoDB Atlas.

### Running the Application

1. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```
   Server will run on http://localhost:5000

2. **Start the frontend (in a new terminal)**
   ```bash
   cd client
   npm start
   ```
   Client will run on http://localhost:3000

### Initial Setup

1. Visit http://localhost:3000
2. The application will automatically create sample products and a demo user
3. Use the demo account or register a new account to start shopping

## API Endpoints

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Cart
- `GET /api/cart/:userId` - Get user's cart
- `POST /api/cart/:userId/add` - Add item to cart
- `PUT /api/cart/:userId/update` - Update item quantity
- `DELETE /api/cart/:userId/remove/:productId` - Remove item
- `DELETE /api/cart/:userId/clear` - Clear cart

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders/user/:userId` - Get user's orders
- `PUT /api/orders/:id/status` - Update order status
- `PUT /api/orders/:id/pay` - Mark order as paid

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile/:id` - Get user profile
- `PUT /api/users/profile/:id` - Update user profile

## Workflow Demonstration

1. **Product Browsing**
   - Visit home page to see featured products
   - Go to Products page to see all products
   - Use search and category filters

2. **Adding to Cart**
   - Click "Add to Cart" on any product
   - View cart icon update with item count
   - Visit cart page to see added items

3. **Cart Management**
   - Increase/decrease quantities
   - Remove items
   - See real-time total updates

4. **Checkout Process**
   - Click "Proceed to Checkout"
   - Fill in shipping information
   - Select payment method
   - Review order summary

5. **Order Completion**
   - Click "Place Order"
   - Receive order confirmation
   - View order details
   - Check order history

## Demo Credentials

For quick testing, use the demo account:
- **Email:** demo@example.com
- **Password:** demo123

Or click "Try Demo Account" on the login page.

## Development Notes

- The application uses a proxy in the client's package.json to forward API requests to the backend during development
- Sample data is automatically seeded when the application starts
- The demo user is created automatically for testing purposes
- All monetary values are handled with proper decimal precision
- Stock management prevents overselling

## Future Enhancements

- Payment gateway integration
- Email notifications
- Advanced search and filters
- Product reviews and ratings
- Admin dashboard
- Order cancellation
- Wishlist functionality
- Multi-currency support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is for educational purposes and is part of a Software Development assignment.
