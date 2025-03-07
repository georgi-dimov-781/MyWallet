import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getCart, 
  getAllProducts, 
  removeFromCart, 
  updateCartItem, 
  clearCart,
  createTransaction,
  getUserById
} from '../../services/DataService';

const Cart = ({ user, setUser }) => {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState({});
  const [message, setMessage] = useState({ text: '', type: '' });
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null); // Added error state

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadCart();

      // Create product lookup object
      const allProducts = getAllProducts();
      const productMap = {};
      allProducts.forEach(product => {
        productMap[product.id] = product;
      });
      setProducts(productMap);
    }
  }, [user]);

  useEffect(() => {
    // Calculate cart total
    let sum = 0;
    cartItems.forEach(item => {
      const product = products[item.productId];
      if (product) {
        sum += product.price * item.quantity;
      }
    });
    setTotal(sum);
  }, [cartItems, products]);

  const loadCart = () => {
    const items = getCart(user.id);
    setCartItems(items);
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    updateCartItem(user.id, itemId, newQuantity);
    loadCart();
  };

  const handleRemoveItem = (itemId) => {
    removeFromCart(user.id, itemId);
    loadCart();
    setMessage({ text: 'Item removed from cart', type: 'success' });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleCheckout = () => {
    try {
      if (!user || !user.id) {
        throw new Error('User not authenticated');
      }

      setMessage({ text: 'Processing your purchase...', type: 'info' });

      // Get current user to ensure we have latest data
      const currentUser = getUserById(user.id);
      if (!currentUser) {
        throw new Error('User not found');
      }

      // Verify sufficient balance
      if (currentUser.balance < total) {
        throw new Error('Insufficient funds');
      }

      // Create a transaction for the purchase
      const productIds = cartItems.map(item => item.productId);
      const transaction = createTransaction(
        currentUser.id,
        total,
        'purchase',
        `Purchase of ${cartItems.length} ${cartItems.length === 1 ? 'item' : 'items'}`,
        productIds
      );

      if (!transaction) {
        throw new Error('Failed to create transaction');
      }

      // Clear the cart
      clearCart(currentUser.id);

      // Update the user in state with fresh data
      const updatedUser = getUserById(currentUser.id);
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      // Show success message and redirect
      setMessage({ text: 'Purchase completed successfully!', type: 'success' });
      setTimeout(() => {
        setMessage({ text: '', type: '' });
        navigate('/dashboard', { 
          state: { message: { text: 'Purchase completed successfully!', type: 'success' } }
        });
      }, 2000);
    } catch (error) {
      setError(error); // Set error state
      console.error("Checkout error:", error.message); // Log the error for debugging
      setMessage({ text: `An error occurred: ${error.message}`, type: 'danger' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  return (
    <div className="container">
      <h1>Shopping Cart</h1>

      {error && (
        <div className="alert alert-danger">
          An error occurred: {error.message}
        </div>
      )}

      {message.text && (
        <div className={`alert alert-${message.type}`} style={{ marginBottom: '20px' }}>
          {message.text}
        </div>
      )}

      {cartItems.length > 0 ? (
        <>
          <div className="cart-container">
            <div className="cart-items" style={{ marginBottom: '20px' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map(item => {
                    const product = products[item.productId];
                    return product ? (
                      <tr key={item.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img 
                              src={product.image || 'https://placehold.co/50x50?text=Product'} 
                              alt={product.name}
                              style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                              onError={(e) => { e.target.src = 'https://placehold.co/50x50?text=Product' }}
                            />
                            <span>{product.name}</span>
                          </div>
                        </td>
                        <td>${product.price.toFixed(2)}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <button 
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            >
                              -
                            </button>
                            <span style={{ minWidth: '30px', textAlign: 'center' }}>{item.quantity}</span>
                            <button 
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td>${(product.price * item.quantity).toFixed(2)}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ) : null;
                  })}
                </tbody>
              </table>
            </div>

            <div className="cart-summary card" style={{ padding: '20px' }}>
              <h3>Order Summary</h3>
              <div style={{ margin: '15px 0', display: 'flex', justifyContent: 'space-between' }}>
                <span>Total:</span>
                <strong>${total.toFixed(2)}</strong>
              </div>
              <div style={{ margin: '15px 0', display: 'flex', justifyContent: 'space-between' }}>
                <span>Your Balance:</span>
                <strong>${user.balance.toFixed(2)}</strong>
              </div>
              <button
                className="btn btn-primary btn-lg"
                onClick={handleCheckout}
                disabled={cartItems.length === 0 || total > user.balance}
                style={{ width: '100%', marginTop: '10px' }}
              >
                {total > user.balance ? 'Insufficient Balance' : 'Complete Purchase'}
              </button>
              {total > user.balance && (
                <div style={{ marginTop: '10px', color: 'red', fontSize: '0.9rem' }}>
                  Please add funds to your wallet before completing this purchase.
                </div>
              )}
              <button
                className="btn btn-outline-secondary"
                onClick={() => navigate('/wallet')}
                style={{ width: '100%', marginTop: '10px' }}
              >
                Go to Wallet
              </button>
            </div>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <button 
              className="btn btn-outline-primary"
              onClick={() => navigate('/products')}
            >
              Continue Shopping
            </button>
            <button 
              className="btn btn-outline-danger"
              onClick={() => {
                if (window.confirm('Are you sure you want to empty your cart?')) {
                  clearCart(user.id);
                  loadCart();
                  setMessage({ text: 'Cart emptied', type: 'success' });
                  setTimeout(() => setMessage({ text: '', type: '' }), 3000);
                }
              }}
            >
              Empty Cart
            </button>
          </div>
        </>
      ) : (
        <div className="empty-cart" style={{ textAlign: 'center', padding: '40px 0' }}>
          <h3>Your cart is empty</h3>
          <p>Add some products to your cart to continue shopping.</p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/products')}
              style={{ marginTop: '20px' }}
            >
              Browse Products
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;