import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { cartAPI } from '../services/api';
import { toast } from 'react-toastify';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, dispatch } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        } else {
          toast.error('Product not found');
          navigate('/products');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Error loading product');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      const response = await cartAPI.addToCart({
        productId: product._id,
        quantity: quantity
      });

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
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    setBuyingNow(true);
    try {
      // First add to cart
      const response = await cartAPI.addToCart({
        productId: product._id,
        quantity: quantity
      });

      dispatch({
        type: 'SET_CART',
        payload: response.data.cart || response.data
      });

      // Then navigate to checkout - guest users can also purchase
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
      setBuyingNow(false);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="spinner-large"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product not found</h2>
        <button onClick={() => navigate('/products')} className="btn btn-primary">
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="container">
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back
        </button>
        
        <div className="product-detail-content">
          <div className="product-image-section">
            <div className="main-image">
              {!imageError ? (
                <img 
                  src={product.image} 
                  alt={product.name}
                  onError={handleImageError}
                />
              ) : (
                <div className="image-placeholder-large">
                  <div className="placeholder-icon">📦</div>
                  <span>Image not available</span>
                </div>
              )}
              {product.featured && <div className="featured-badge-detail">⭐ Featured</div>}
              {product.stock === 0 && <div className="out-of-stock-overlay-detail">Out of Stock</div>}
            </div>
          </div>

          <div className="product-info-section">
            <div className="breadcrumb">
              <span>{product.category}</span>
            </div>
            
            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-price-detail">
              {formatPrice(product.price)}
            </div>

            <div className="product-stock-info">
              <span className={`stock-status ${product.stock <= 5 ? 'low-stock' : product.stock === 0 ? 'out-of-stock' : 'in-stock'}`}>
                {product.stock === 0 ? 'Out of Stock' : 
                 product.stock <= 5 ? `Only ${product.stock} left in stock!` : 
                 `${product.stock} available`}
              </span>
            </div>

            <div className="product-description-detail">
              <h3>Product Description</h3>
              <p>{product.description}</p>
            </div>

            {product.stock > 0 && (
              <div className="quantity-selector">
                <label>Quantity:</label>
                <div className="quantity-controls">
                  <button 
                    onClick={decrementQuantity}
                    className="quantity-btn"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="quantity-display">{quantity}</span>
                  <button 
                    onClick={incrementQuantity}
                    className="quantity-btn"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="product-actions">
              <button 
                className={`btn btn-secondary add-to-cart-detail ${addingToCart ? 'loading' : ''}`}
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addingToCart || buyingNow}
              >
                {addingToCart ? (
                  <>
                    <span className="spinner"></span>
                    Adding to Cart...
                  </>
                ) : (
                  '🛒 Add to Cart'
                )}
              </button>

              <button 
                className={`btn btn-primary buy-now-btn ${buyingNow ? 'loading' : ''}`}
                onClick={handleBuyNow}
                disabled={product.stock === 0 || addingToCart || buyingNow}
              >
                {buyingNow ? (
                  <>
                    <span className="spinner"></span>
                    Processing...
                  </>
                ) : (
                  '⚡ Buy Now'
                )}
              </button>
            </div>

            <div className="product-features">
              <div className="feature-item">
                <span className="feature-icon">🚚</span>
                <span>10-minute delivery guarantee</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">💳</span>
                <span>Secure payment with Razorpay</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🔄</span>
                <span>Easy returns & refunds</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📱</span>
                <span>Real-time order tracking</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
