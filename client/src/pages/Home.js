import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import './Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Home component mounted, starting to load data...');
    
    const loadData = async () => {
      try {
        console.log('Attempting to load featured products...');
        
        // Try to seed products first (ignore errors)
        try {
          console.log('Attempting to seed products...');
          await productAPI.seed();
          console.log('Products seeded successfully');
        } catch (seedError) {
          console.log('Seed might already exist, continuing...', seedError);
        }

        // Get featured products with retry logic
        let retries = 3;
        while (retries > 0) {
          try {
            console.log(`Attempting to get products (retry ${4-retries}/3)...`);
            const response = await productAPI.getAll({ featured: 'true' });
            console.log('Products API response:', response);
            
            // Handle different response formats
            let products = [];
            if (Array.isArray(response.data)) {
              products = response.data;
            } else if (Array.isArray(response)) {
              products = response;
            } else if (response.data && typeof response.data === 'object') {
              // Handle object response format - extract array
              products = Object.values(response.data).filter(item => typeof item === 'object' && item._id);
            } else {
              console.warn('Unexpected response format:', response);
              products = [];
            }
            
            console.log('Processed products:', products);
            setFeaturedProducts(products);
            break;
          } catch (error) {
            console.error('API call failed:', error);
            retries--;
            if (retries === 0) {
              console.error('All retries failed, setting fallback empty array');
              setFeaturedProducts([]);
              break;
            }
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setFeaturedProducts([]); // Ensure it's always an array
      } finally {
        console.log('Setting loading to false');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  console.log('Home component rendering. Loading:', loading, 'Featured products:', featuredProducts.length);

  if (loading) {
    console.log('Showing loading screen...');
    return (
      <div className="loading">
        <h2>Loading...</h2>
        <p>Fetching products from database...</p>
      </div>
    );
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
            {Array.isArray(featuredProducts) && featuredProducts.length > 0 ? (
              featuredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <p className="text-center">
                {Array.isArray(featuredProducts) ? 'No featured products available.' : 'Loading products...'}
              </p>
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
