
import { useState, useEffect } from 'react';
import { 
  getAllCategories, 
  getAllProducts, 
  addCategory, 
  updateCategory, 
  deleteCategory,
  addProduct,
  updateProduct,
  deleteProduct
} from '../../services/DataService';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('categories');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ name: '' });
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    image: 'https://via.placeholder.com/150'
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  const loadCategories = () => {
    const allCategories = getAllCategories();
    setCategories(allCategories);
  };

  const loadProducts = () => {
    const allProducts = getAllProducts();
    setProducts(allProducts);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setEditingCategory(null);
    setEditingProduct(null);
    resetForms();
  };

  const resetForms = () => {
    setCategoryForm({ name: '' });
    setProductForm({
      name: '',
      description: '',
      price: '',
      categoryId: '',
      image: 'https://via.placeholder.com/150'
    });
  };

  // Category handlers
  const handleCategoryChange = (e) => {
    setCategoryForm({
      ...categoryForm,
      [e.target.name]: e.target.value
    });
  };

  const handleCategorySubmit = (e) => {
    e.preventDefault();
    
    if (!categoryForm.name.trim()) {
      setMessage({ text: 'Category name is required', type: 'danger' });
      return;
    }
    
    try {
      if (editingCategory) {
        updateCategory(editingCategory.id, categoryForm);
        setMessage({ text: 'Category updated successfully', type: 'success' });
      } else {
        addCategory(categoryForm);
        setMessage({ text: 'Category added successfully', type: 'success' });
      }
      
      loadCategories();
      resetForms();
      setEditingCategory(null);
    } catch (error) {
      setMessage({ text: 'Error saving category', type: 'danger' });
    }
    
    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 3000);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({ name: category.name });
  };

  const handleDeleteCategory = (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        deleteCategory(categoryId);
        loadCategories();
        setMessage({ text: 'Category deleted successfully', type: 'success' });
      } catch (error) {
        setMessage({ text: 'Error deleting category', type: 'danger' });
      }
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
    }
  };

  // Product handlers
  const handleProductChange = (e) => {
    const value = e.target.name === 'price' ? parseFloat(e.target.value) || '' : e.target.value;
    
    setProductForm({
      ...productForm,
      [e.target.name]: value
    });
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    
    if (!productForm.name.trim() || !productForm.description.trim() || 
        !productForm.price || !productForm.categoryId) {
      setMessage({ text: 'All fields are required', type: 'danger' });
      return;
    }
    
    try {
      if (editingProduct) {
        updateProduct(editingProduct.id, productForm);
        setMessage({ text: 'Product updated successfully', type: 'success' });
      } else {
        addProduct(productForm);
        setMessage({ text: 'Product added successfully', type: 'success' });
      }
      
      loadProducts();
      resetForms();
      setEditingProduct(null);
    } catch (error) {
      setMessage({ text: 'Error saving product', type: 'danger' });
    }
    
    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 3000);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      categoryId: product.categoryId,
      image: product.image
    });
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        deleteProduct(productId);
        loadProducts();
        setMessage({ text: 'Product deleted successfully', type: 'success' });
      } catch (error) {
        setMessage({ text: 'Error deleting product', type: 'danger' });
      }
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
    }
  };

  return (
    <div className="container">
      <h1>Admin Panel</h1>
      
      <ul className="nav-tabs">
        <li>
          <a 
            href="#" 
            className={activeTab === 'categories' ? 'active' : ''}
            onClick={() => handleTabChange('categories')}
          >
            Categories
          </a>
        </li>
        <li>
          <a 
            href="#" 
            className={activeTab === 'products' ? 'active' : ''}
            onClick={() => handleTabChange('products')}
          >
            Products
          </a>
        </li>
      </ul>
      
      {message.text && (
        <div className={`alert alert-${message.type}`}>{message.text}</div>
      )}
      
      {activeTab === 'categories' && (
        <div>
          <div className="card">
            <h2>{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
            <form onSubmit={handleCategorySubmit}>
              <div className="form-group">
                <label htmlFor="name">Category Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  value={categoryForm.name}
                  onChange={handleCategoryChange}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary">
                  {editingCategory ? 'Update Category' : 'Add Category'}
                </button>
                {editingCategory && (
                  <button 
                    type="button" 
                    className="btn btn-danger"
                    onClick={() => {
                      setEditingCategory(null);
                      resetForms();
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
          
          <div className="card">
            <h2>Categories</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(category => (
                  <tr key={category.id}>
                    <td>{category.id}</td>
                    <td>{category.name}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                          className="btn btn-primary"
                          onClick={() => handleEditCategory(category)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-danger"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {categories.length === 0 && <p>No categories found</p>}
          </div>
        </div>
      )}
      
      {activeTab === 'products' && (
        <div>
          <div className="card">
            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleProductSubmit}>
              <div className="form-group">
                <label htmlFor="name">Product Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  value={productForm.name}
                  onChange={handleProductChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  className="form-control"
                  value={productForm.description}
                  onChange={handleProductChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  className="form-control"
                  value={productForm.price}
                  onChange={handleProductChange}
                  min="0.01"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label htmlFor="categoryId">Category</label>
                <select
                  id="categoryId"
                  name="categoryId"
                  className="form-control"
                  value={productForm.categoryId}
                  onChange={handleProductChange}
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="image">Image URL</label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  className="form-control"
                  value={productForm.image}
                  onChange={handleProductChange}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
                {editingProduct && (
                  <button 
                    type="button" 
                    className="btn btn-danger"
                    onClick={() => {
                      setEditingProduct(null);
                      resetForms();
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
          
          <div className="card">
            <h2>Products</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>
                      {categories.find(c => c.id === product.categoryId)?.name || 'Unknown'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                          className="btn btn-primary"
                          onClick={() => handleEditProduct(product)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-danger"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && <p>No products found</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
