// Test API connectivity
fetch('http://localhost:5000/api/products')
  .then(response => {
    console.log('Response status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('Products data:', data);
  })
  .catch(error => {
    console.error('API Error:', error);
  });