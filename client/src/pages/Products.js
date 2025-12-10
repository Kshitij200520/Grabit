import React, { useState, useEffect, useCallback } from 'react';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      
      // Retry logic for better reliability
      let retries = 3;
      while (retries > 0) {
        try {
          const response = await productAPI.getAll(params);
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
          setProducts(products);
          break;
        } catch (error) {
          retries--;
          if (retries === 0) {
            console.error('All retries failed, setting empty array');
            setProducts([]);
            break;
          }
          await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms before retry
        }
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]); // Ensure it's always an array
    } finally {
      setLoading(false);
    }
  }, [search, category]);

  // Load all categories separately (not dependent on filtered products)
  const loadCategories = useCallback(async () => {
    try {
      const response = await productAPI.getAll(); // Get all products to extract categories
      console.log('Categories API response:', response);
      
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
        console.warn('Unexpected response format for categories:', response);
        products = [];
      }
      
      const uniqueCategories = [...new Set(products.map(p => p.category))].filter(Boolean);
      console.log('Extracted categories:', uniqueCategories);
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategories([]);
    }
  }, []);

  useEffect(() => {
    loadCategories(); // Load categories once
  }, [loadCategories]);

  useEffect(() => {
    loadProducts(); // Load products when search/category changes
  }, [loadProducts]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  return (
    <div className="products-page">
      <div className="container">
        <div className="products-header">
          <h1>Products</h1>
          
          <div className="filters">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={handleSearchChange}
                className="form-control"
              />
            </div>
            
            <div className="category-filter">
              <select
                value={category}
                onChange={handleCategoryChange}
                className="form-control"
              >
                <option value="">All Categories</option>
                {Array.isArray(categories) && categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading products...</div>
        ) : (
          <div className="products-grid">
            {Array.isArray(products) && products.length > 0 ? (
              products.map(product => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="no-products">
                <p>{Array.isArray(products) ? 'No products found.' : 'Loading products...'}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
