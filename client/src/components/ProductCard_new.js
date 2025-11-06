import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { cartAPI } from '../services/api';
import { toast } from 'react-toastify';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { user, dispatch } = useCart();
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }

    setLoading(true);
    try {
      console.log('🔍 Adding to cart (ProductCard_new):', {
        userId: user._id,
        productId: product._id,
        productName: product.name,
        productPrice: product.price
      });
      
      const response = await cartAPI.addToCart(user._id, {
        productId: product._id,
        quantity: 1
      });

      console.log('🔍 Add to cart response (ProductCard_new):', response.data);

      dispatch({
        type: 'SET_CART',
        payload: response.data
      });

      toast.success(`${product.name} added to cart! 🛒`);
    } catch (error) {
      console.error('❌ Add to cart error (ProductCard_new):', error);
      toast.error(error.response?.data?.message || 'Error adding to cart');
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleCardClick = (e) => {
    // Don't navigate if clicking on button
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
      return;
    }
    navigate(`/product/${product._id}`);
  };

  const handleBuyNow = async (e) => {
    e.stopPropagation(); // Prevent card navigation
    
    if (!user) {
      toast.error('Please login to purchase');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      // Add to cart first
      const response = await cartAPI.addToCart(user._id, {
        productId: product._id,
        quantity: 1
      });

      dispatch({
        type: 'SET_CART',
        payload: response.data
      });

      // Navigate directly to checkout
      toast.success('Redirecting to checkout... 🚀');
      navigate('/checkout');
    } catch (error) {
      console.error('❌ Buy now error (ProductCard_new):', error);
      toast.error(error.response?.data?.message || 'Error processing purchase');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="product-card" onClick={handleCardClick}>
      {product.featured && <div className="featured-badge">⭐ Featured</div>}
      
      <div className="product-image">
        {!imageError ? (
          <img 
            src={product.image} 
            alt={product.name}
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="image-placeholder">
            <div className="placeholder-icon">📦</div>
            <span>Image not available</span>
          </div>
        )}
        {product.stock === 0 && <div className="out-of-stock-overlay">Out of Stock</div>}
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-details">
          <div className="price-section">
            <span className="product-price">{formatPrice(product.price)}</span>
            <span className="product-category">{product.category}</span>
          </div>
          <div className="stock-section">
            <span className={`product-stock ${product.stock <= 5 ? 'low-stock' : ''}`}>
              {product.stock > 0 ? (
                product.stock <= 5 ? `Only ${product.stock} left!` : `${product.stock} in stock`
              ) : 'Out of stock'}
            </span>
          </div>
        </div>
        
        <div className="product-actions">
          <button 
            className={`btn btn-secondary add-to-cart-btn ${loading ? 'loading' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            disabled={product.stock === 0 || loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Adding...
              </>
            ) : product.stock === 0 ? (
              'Out of Stock'
            ) : (
              '🛒 Add to Cart'
            )}
          </button>

          <button 
            className={`btn btn-primary buy-now-btn ${loading ? 'loading' : ''}`}
            onClick={handleBuyNow}
            disabled={product.stock === 0 || loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Processing...
              </>
            ) : product.stock === 0 ? (
              'Out of Stock'
            ) : (
              '⚡ Buy Now'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
