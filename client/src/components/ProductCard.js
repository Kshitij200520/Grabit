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
    setLoading(true);
    try {
      console.log('🔍 Adding to cart:', {
        productId: product._id,
        productName: product.name,
        productPrice: product.price,
        user: user ? 'Logged In' : 'Guest'
      });
      
      const response = await cartAPI.addToCart({
        productId: product._id,
        quantity: 1
      });

      console.log('🔍 Add to cart response:', response.data);

      dispatch({
        type: 'SET_CART',
        payload: response.data.cart || response.data
      });

      const userType = user ? 'user' : 'guest';
      toast.success(`${product.name} added to cart as ${userType}! 🛒`);
    } catch (error) {
      console.error('❌ Add to cart error:', error);
      toast.error(error.response?.data?.message || 'Error adding to cart');
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Professional fallback image based on product category
  const getFallbackImage = (category, productName) => {
    const categoryFallbacks = {
      'Electronics': 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=500&h=500&fit=crop&crop=center',
      'Fashion': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&h=500&fit=crop&crop=center', 
      'Home & Garden': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop&crop=center',
      'Sports & Fitness': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop&crop=center',
      'Beauty & Personal Care': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&h=500&fit=crop&crop=center',
      'Books & Media': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop&crop=center',
      'Automotive': 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=500&h=500&fit=crop&crop=center'
    };
    
    return categoryFallbacks[category] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=500&fit=crop&crop=center';
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
    
    setLoading(true);
    try {
      // Add to cart first
      const response = await cartAPI.addToCart({
        productId: product._id,
        quantity: 1
      });

      dispatch({
        type: 'SET_CART',
        payload: response.data.cart || response.data
      });

      // Navigate to checkout - guest users can also purchase
      const userType = user ? 'user' : 'guest';
      toast.success(`Redirecting to checkout as ${userType}... 🚀`);
      
      if (!user) {
        toast.info('Guest checkout available! No registration required 🎉');
      }
      
      navigate('/checkout');
    } catch (error) {
      console.error('❌ Buy now error:', error);
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
          <img 
            src={getFallbackImage(product.category, product.name)}
            alt={product.name}
            loading="lazy"
            onError={(e) => {
              // Ultimate fallback if category image also fails
              e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=500&fit=crop&crop=center';
            }}
          />
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
