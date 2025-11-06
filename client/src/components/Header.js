import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import './Header.css';

const Header = () => {
  const { cartState, user, setUser } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    setUser(null);
    navigate('/');
    setMobileMenuOpen(false);
  };

  const cartItemCount = cartState.items.reduce((total, item) => total + item.quantity, 0);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo" onClick={() => setMobileMenuOpen(false)}>
            <div className="logo-icon">
              <Logo size={40} />
            </div>
            <div className="logo-text">
              <h1>Grab It</h1>
              <span className="logo-tagline">Quick & Easy Shopping</span>
            </div>
          </Link>
          
          <nav className={`nav ${mobileMenuOpen ? 'nav-open' : ''}`}>
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              🏠 Home
            </Link>
            <Link 
              to="/products" 
              className={`nav-link ${isActive('/products') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              📦 Products
            </Link>
            {user && (
              <Link 
                to="/orders" 
                className={`nav-link ${isActive('/orders') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                📋 My Orders
              </Link>
            )}
          </nav>

          <div className="header-actions">
            <Link 
              to="/cart" 
              className="cart-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="cart-icon-container">
                <span className="cart-icon">🛒</span>
                {cartItemCount > 0 && (
                  <span className="cart-count">{cartItemCount}</span>
                )}
              </div>
              <span className="cart-text">Cart</span>
            </Link>
            
            <ThemeToggle />
            
            {user ? (
              <div className="user-menu">
                <div className="user-avatar">
                  <span className="avatar-icon">👤</span>
                </div>
                <div className="user-info">
                  <span className="user-greeting">Hello,</span>
                  <span className="user-name">{user.name}</span>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="btn btn-logout"
                  title="Logout"
                >
                  🚪
                </button>
              </div>
            ) : (
              <div className="auth-links">
                <Link 
                  to="/login" 
                  className="btn btn-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-secondary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
            
            <button 
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
