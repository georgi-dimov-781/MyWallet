import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAllProducts, getAllCategories, addToCart } from '../../services/DataService';
import './Products.css';
import SocialShareButtons from './SocialShareButtons';

const Products = ({ user }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [imageErrors, setImageErrors] = useState({});
  const [message, setMessage] = useState({ text: '', type: '' });

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const allProducts = getAllProducts();
    setProducts(allProducts);
    setCategories(getAllCategories());

    // Check for any message in the location state
    if (location.state?.message) {
      setMessage(location.state.message);
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      navigate(location.pathname, { replace: true, state: {} });
    }

    // Handle product selection from Dashboard's "View Details" link
    if (location.state?.selectedProductId) {
      const selectedProduct = allProducts.find(p => p.id === location.state.selectedProductId);
      if (selectedProduct) {
        setSelectedProduct(selectedProduct);
      }
      // Clear the state to prevent re-selecting on page refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseProductDetail = () => {
    setSelectedProduct(null);
  };

  const handleImageError = (productId) => {
    setImageErrors(prev => ({
      ...prev,
      [productId]: true
    }));
  };

  const handleAddToCart = (product) => {
    try {
      addToCart(user.id, product.id, 1);
      setMessage({ text: `${product.name} added to cart`, type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setMessage({ text: 'Failed to add product to cart', type: 'danger' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => product.categoryId === selectedCategory);

  return (
    <div className="container">
      <h1>Products</h1>

      {message.text && (
        <div className={`alert alert-${message.type}`} style={{ marginBottom: '20px' }}>
          {message.text}
        </div>
      )}

      {selectedProduct ? (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2>{selectedProduct.name}</h2>
            <button
              onClick={handleCloseProductDetail}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer'
              }}
            >
              &times;
            </button>
          </div>

          <div style={{ display: 'flex', gap: '30px' }}>
            <div style={{ flex: '1' }}>
              <img
                src={imageErrors[selectedProduct.id] ? 'https://placehold.co/300x300?text=Product+Image' : (selectedProduct.image || 'https://placehold.co/300x300?text=Product+Image')}
                alt={selectedProduct.name}
                style={{
                  width: '100%',
                  maxHeight: '300px',
                  objectFit: 'cover',
                  borderRadius: '8px'
                }}
                onError={() => handleImageError(selectedProduct.id)}
              />
            </div>

            <div style={{ flex: '2' }}>
              <p><strong>Category:</strong> {getCategoryName(selectedProduct.categoryId)}</p>
              <p><strong>Price:</strong> ${selectedProduct.price.toFixed(2)}</p>
              <p><strong>Description:</strong> {selectedProduct.description}</p>
              <SocialShareButtons url={`product/${selectedProduct.id}`} /> {/* Added SocialShareButtons here */}

              <button 
                className="btn btn-primary" 
                style={{ marginTop: '20px' }}
                onClick={() => handleAddToCart(selectedProduct)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="category-filter">Filter by Category: </label>
            <select 
              id="category-filter" 
              value={selectedCategory} 
              onChange={handleCategoryChange}
              className="form-control"
              style={{ display: 'inline-block', width: 'auto', marginLeft: '10px' }}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="products-grid">
            {filteredProducts.map(product => (
              <div 
                key={product.id} 
                className="product-card"
                onClick={() => handleProductSelect(product)}
              >
                <div className="product-image">
                  <img 
                    src={imageErrors[product.id] ? 'https://placehold.co/200x200?text=Product+Image' : (product.image || 'https://placehold.co/200x200?text=Product+Image')} 
                    alt={product.name}
                    onError={() => handleImageError(product.id)}
                  />
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-price">${product.price.toFixed(2)}</p>
                  <button 
                    className="btn btn-sm btn-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <p>No products found in this category.</p>
          )}
        </>
      )}
    </div>
  );
};

export default Products;