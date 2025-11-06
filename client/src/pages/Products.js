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
          setProducts(response.data);
          
          // Extract unique categories
          const uniqueCategories = [...new Set(response.data.map(p => p.category))];
          setCategories(uniqueCategories);
          break;
        } catch (error) {
          retries--;
          if (retries === 0) throw error;
          await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms before retry
        }
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  }, [search, category]);

  useEffect(() => {
    loadProducts();
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
                {categories.map(cat => (
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
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
            {products.length === 0 && (
              <div className="no-products">
                <p>No products found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
