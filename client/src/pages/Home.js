import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import './Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Try to seed products first (ignore errors)
        try {
          await productAPI.seed();
        } catch (seedError) {
          console.log('Seed might already exist, continuing...');
        }

        // Get featured products with retry logic
        let retries = 3;
        while (retries > 0) {
          try {
            const response = await productAPI.getAll({ featured: 'true' });
            setFeaturedProducts(response.data);
            break;
          } catch (error) {
            retries--;
            if (retries === 0) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

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
            {featuredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          {featuredProducts.length === 0 && (
            <p className="text-center">No featured products available.</p>
          )}
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
