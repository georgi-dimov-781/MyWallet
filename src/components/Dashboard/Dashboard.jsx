import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserTransactions, getAllProducts, getCategorySpendingReport } from '../../services/DataService';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const Dashboard = ({ user }) => {
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [spendingReport, setSpendingReport] = useState([]);

  useEffect(() => {
    if (user) {
      // Get recent transactions
      const transactions = getUserTransactions(user.id);
      setRecentTransactions(transactions.slice(-5).reverse());

      // Get products
      setProducts(getAllProducts().slice(0, 4));

      // Get spending report
      setSpendingReport(getCategorySpendingReport(user.id));
    }
  }, [user]);

  return (
    <div className="container">
      <h1>Dashboard</h1>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div className="card" style={{ flex: '1' }}>
          <h3>Wallet Balance</h3>
          <div className="wallet-balance">${user.balance.toFixed(2)}</div>
          <div style={{ textAlign: 'center' }}>
            <Link to="/wallet" className="btn btn-primary">Manage Wallet</Link>
          </div>
        </div>

        <div className="card" style={{ flex: '1' }}>
          <h3>Spending Overview</h3>
          {spendingReport.some(item => item.totalSpent > 0) ? (
            <div>
              {spendingReport
                .filter(item => item.totalSpent > 0)
                .map(item => (
                  <div key={item.categoryId} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span>{item.categoryName}</span>
                    <span>${item.totalSpent.toFixed(2)}</span>
                  </div>
                ))}
            </div>
          ) : (
            <p>No spending data available</p>
          )}
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <Link to="/reports" className="btn btn-primary">View Full Report</Link>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Recent Transactions</h3>
          <Link to="/history">View All</Link>
        </div>

        {recentTransactions.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map(transaction => (
                <tr key={transaction.id}>
                  <td>{new Date(transaction.timestamp).toLocaleDateString()}</td>
                  <td style={{ textTransform: 'capitalize' }}>{transaction.type}</td>
                  <td>{transaction.description}</td>
                  <td style={{ color: transaction.amount > 0 ? 'green' : 'red' }}>
                    {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No recent transactions</p>
        )}
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Featured Products</h3>
          <Link to="/products">View All</Link>
        </div>

        <div className="swiper-container">
          <Swiper
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={2}
            navigation={true}
            loop={products.length > 2}
            className="products-swiper"
          >
            {products.map(product => (
              <SwiperSlide key={product.id}>
                <div className="product-card">
                  <img 
                    src={product.image || 'https://placehold.co/300x200?text=Product+Image'} 
                    alt={product.name}
                    className="product-image"
                    onError={(e) => { e.target.src = 'https://placehold.co/300x200?text=Product+Image' }}
                  />
                  <div className="product-content">
                    <h3 className="product-title">{product.name}</h3>
                    <div className="product-price">${product.price.toFixed(2)}</div>
                    <Link 
                      to="/products" 
                      state={{ selectedProductId: product.id }} 
                      className="btn btn-primary" 
                      style={{ width: '100%' }}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;