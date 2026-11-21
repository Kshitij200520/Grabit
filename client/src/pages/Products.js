import React, { useEffect, useMemo, useState } from 'react';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import './Products.css';

const Products = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const categories = useMemo(
    () => [...new Set(allProducts.map(product => product.category))].filter(Boolean),
    [allProducts]
  );
  const products = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return allProducts.filter(product => {
      const matchesCategory = !category || product.category === category;
      const matchesSearch = !normalizedSearch ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.description.toLowerCase().includes(normalizedSearch);
      return matchesCategory && matchesSearch;
    });
  }, [allProducts, category, search]);

  useEffect(() => {
    let active = true;

    productAPI.getAll()
      .then(response => {
        if (active) {
          setAllProducts(Array.isArray(response.data) ? response.data : []);
        }
      })
      .catch(error => {
        console.error('Error loading products:', error);
        if (active) setAllProducts([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

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
