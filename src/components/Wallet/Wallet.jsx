
import React, { useState, useEffect } from 'react';
import { getUserTransactions, replenishWallet, getUserById } from '../../services/DataService';

const Wallet = ({ user, setUser }) => {
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });

  const loadTransactions = () => {
    if (!user) return;
    
    const userTransactions = getUserTransactions(user.id);
    setTransactions(userTransactions.reverse());
    // Update user to get the latest balance if needed
    if (setUser) {
      const updatedUser = getUserById(user.id);
      setUser(updatedUser);
    }
  };

  // Load transactions when component mounts
  useEffect(() => {
    loadTransactions();
  }, [user?.id]); // Only depend on user.id, not the entire user object

  const handleReplenish = (e) => {
    e.preventDefault();
    
    const replenishAmount = parseFloat(amount);
    if (isNaN(replenishAmount) || replenishAmount <= 0) {
      setMessage({ text: 'Please enter a valid amount', type: 'danger' });
      return;
    }
    
    replenishWallet(user.id, replenishAmount);
    setAmount('');
    loadTransactions();
    
    // Update user state with new balance if setUser is provided
    if (setUser) {
      const updatedUser = getUserById(user.id);
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
    
    setMessage({ text: 'Wallet replenished successfully', type: 'success' });
    
    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 3000);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="container">
      <h1>Wallet</h1>
      
      <div className="card wallet-container">
        <h3>Current Balance</h3>
        <div className="wallet-balance">${user.balance.toFixed(2)}</div>
        
        {message.text && (
          <div className={`alert alert-${message.type}`}>{message.text}</div>
        )}
        <form onSubmit={handleReplenish}>
          <div className="form-group">
            <label htmlFor="amount">Amount ($)</label>
            <input
              type="number"
              id="amount"
              className="form-control"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0.01"
              step="0.01"
              placeholder="Enter amount"
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '20px' }}>
            Add Funds
          </button>
        </form>
        
        {transactions.length > 0 ? (
          <div className="transactions-list">
            <h3>Transaction History</h3>
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
                {transactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td>{new Date(transaction.timestamp).toLocaleString()}</td>
                    <td style={{ textTransform: 'capitalize' }}>{transaction.type}</td>
                    <td>{transaction.description}</td>
                    <td style={{ color: transaction.amount > 0 ? 'green' : 'red' }}>
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No transactions yet.</p>
        )}
      </div>
    </div>
  );
};

export default Wallet;
