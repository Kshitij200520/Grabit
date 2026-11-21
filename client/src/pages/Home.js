import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import './Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    productAPI.getAll()
      .then(response => {
        if (active) {
          const products = Array.isArray(response.data) ? response.data : [];
          setFeaturedProducts(products.filter(product => product.featured));
        }
      })
      .catch(error => {
        console.error('Error loading featured products:', error);
        if (active) setFeaturedProducts([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="home">
      <div className="container">
        <section className="hero">
          <div className="hero-content">
            <h1>Welcome to Grab It</h1>
            <p>Quick & Easy Shopping - Get what you need, when you need it</p>
            <Link to="/products" className="btn btn-primary hero-btn">
              Grab Your Items Now
            </Link>
          </div>
        </section>

        <section className="featured-products">
          <h2>Featured Products</h2>
          <div className="products-grid">
            {loading ? (
              <p className="text-center">Loading featured products...</p>
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <p className="text-center">No featured products available.</p>
            )}
          </div>
        </section>

        <section className="features">
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">⚡</div>
              <h3>Lightning Fast</h3>
              <p>Grab what you need in just a few clicks</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🔒</div>
              <h3>Secure Checkout</h3>
              <p>Your payment and data are always protected</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🚀</div>
              <h3>Quick Delivery</h3>
              <p>Fast shipping to get your items quickly</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
