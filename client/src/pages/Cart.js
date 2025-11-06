import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { cartAPI } from '../services/api';
import './Cart.css';

const Cart = () => {
  const { cartState, dispatch, user } = useCart();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      setLoading(false);
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadCart = async () => {
    try {
      console.log('🔍 Loading cart for user:', user._id);
      const response = await cartAPI.getCart();
      console.log('🔍 Cart API response:', response.data);
      
      dispatch({
        type: 'SET_CART',
        payload: response.data
      });
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(productId);
      return;
    }

    try {
      const response = await cartAPI.updateQuantity({
        productId,
        quantity: newQuantity
      });
      
      dispatch({
        type: 'SET_CART',
        payload: response.data
      });
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating quantity');
    }
  };

  const removeItem = async (productId) => {
    try {
      const response = await cartAPI.removeItem(productId);
      dispatch({
        type: 'SET_CART',
        payload: response.data.cart || response.data
      });
    } catch (error) {
      alert(error.response?.data?.message || 'Error removing item');
    }
  };

  const clearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await cartAPI.clearCart();
        dispatch({ type: 'CLEAR_CART' });
      } catch (error) {
        alert(error.response?.data?.message || 'Error clearing cart');
      }
    }
  };

  const proceedToCheckout = () => {
    navigate('/checkout');
  };

  if (!user) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="text-center">
            <h2>Please login to view your cart</h2>
            <Link to="/login" className="btn btn-primary">Login</Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Loading cart...</div>;
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          {cartState.items.length > 0 && (
            <button onClick={clearCart} className="btn btn-danger">
              Clear Cart
            </button>
          )}
        </div>

        {cartState.items.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <Link to="/products" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {cartState.items.map(item => {
                // Safety check for product data
                if (!item.product || !item.product._id) {
                  console.warn('Cart item missing product data:', item);
                  return null;
                }
                
                return (
                  <div key={item.product._id} className="cart-item">
                    <div className="item-image">
                      <img 
                        src={item.product.image || 'https://via.placeholder.com/150x150?text=No+Image'} 
                        alt={item.product.name || 'Product'} 
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/150x150?text=No+Image';
                        }}
                      />
                    </div>
                    <div className="item-details">
                      <h3>{item.product.name || 'Unknown Product'}</h3>
                      <p>{item.product.description || 'No description available'}</p>
                      <div className="item-price">₹{item.price || 0}</div>
                    </div>
                    <div className="item-quantity">
                      <button 
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                        className="quantity-btn"
                      >
                        -
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        className="quantity-btn"
                      >
                        +
                      </button>
                    </div>
                    <div className="item-total">
                      ₹{((item.price || 0) * item.quantity).toFixed(2)}
                    </div>
                    <button 
                      onClick={() => removeItem(item.product._id)}
                      className="remove-btn"
                    >
                      ×
                    </button>
                  </div>
                );
              }).filter(Boolean)}
            </div>

            <div className="cart-summary">
              <div className="card">
                <div className="card-header">
                  <h3>Order Summary</h3>
                </div>
                <div className="card-body">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>₹{cartState.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping:</span>
                    <span>₹50.00</span>
                  </div>
                  <div className="summary-row">
                    <span>Tax (18% GST):</span>
                    <span>₹{(cartState.totalAmount * 0.18).toFixed(2)}</span>
                  </div>
                  <hr />
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>₹{(cartState.totalAmount + 50 + (cartState.totalAmount * 0.18)).toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={proceedToCheckout}
                    className="btn btn-primary checkout-btn"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
