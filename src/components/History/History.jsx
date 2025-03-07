
import { useState, useEffect } from 'react';
import { getUserTransactions, getAllCategories, getAllProducts, exportTransactionsToCSV, exportTransactionsToPDF } from '../../services/DataService';

const History = ({ user }) => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState({});
  const [products, setProducts] = useState({});
  
  // Filter and search states
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: '',
    searchTerm: ''
  });
  
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  useEffect(() => {
    if (user) {
      // Load transactions
      const userTransactions = getUserTransactions(user.id);
      setTransactions(userTransactions.reverse());
      
      // Create category lookup
      const allCategories = getAllCategories();
      const categoryMap = {};
      allCategories.forEach(category => {
        categoryMap[category.id] = category.name;
      });
      setCategories(categoryMap);
      
      // Create product lookup
      const allProducts = getAllProducts();
      const productMap = {};
      allProducts.forEach(product => {
        productMap[product.id] = product;
      });
      setProducts(productMap);
    }
  }, [user]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      type: 'all',
      category: 'all',
      dateFrom: '',
      dateTo: '',
      amountMin: '',
      amountMax: '',
      searchTerm: ''
    });
  };

  const handleCSVExport = () => {
    exportTransactionsToCSV(user.id, filteredTransactions);
  };

  const handlePDFExport = () => {
    exportTransactionsToPDF(user.id, filteredTransactions);
  };

  // Filter transactions based on all criteria
  const filteredTransactions = transactions.filter(transaction => {
    // Type filter
    if (filters.type !== 'all' && transaction.type !== filters.type) {
      return false;
    }
    
    // Category filter
    if (filters.category !== 'all' && 
        transaction.type === 'purchase' && 
        transaction.categoryId !== filters.category) {
      return false;
    }
    
    // Date range filter
    if (filters.dateFrom) {
      const dateFrom = new Date(filters.dateFrom);
      const transactionDate = new Date(transaction.timestamp);
      if (transactionDate < dateFrom) {
        return false;
      }
    }
    
    if (filters.dateTo) {
      const dateTo = new Date(filters.dateTo);
      // Set time to end of day
      dateTo.setHours(23, 59, 59);
      const transactionDate = new Date(transaction.timestamp);
      if (transactionDate > dateTo) {
        return false;
      }
    }
    
    // Amount range filter
    if (filters.amountMin && Math.abs(transaction.amount) < parseFloat(filters.amountMin)) {
      return false;
    }
    
    if (filters.amountMax && Math.abs(transaction.amount) > parseFloat(filters.amountMax)) {
      return false;
    }
    
    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const descriptionMatch = transaction.description.toLowerCase().includes(searchLower);
      const typeMatch = transaction.type.toLowerCase().includes(searchLower);
      const amountMatch = transaction.amount.toString().includes(searchLower);
      
      // For purchases, also search product and category names
      let productMatch = false;
      let categoryMatch = false;
      
      if (transaction.type === 'purchase') {
        if (transaction.productId && products[transaction.productId]) {
          productMatch = products[transaction.productId].name.toLowerCase().includes(searchLower);
        }
        
        if (transaction.categoryId && categories[transaction.categoryId]) {
          categoryMatch = categories[transaction.categoryId].toLowerCase().includes(searchLower);
        }
      }
      
      if (!(descriptionMatch || typeMatch || amountMatch || productMatch || categoryMatch)) {
        return false;
      }
    }
    
    return true;
  });

  const categoryOptions = Object.entries(categories).map(([id, name]) => (
    <option key={id} value={id}>{name}</option>
  ));

  return (
    <div className="container">
      <h1>Transaction History</h1>
      
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <div>
            <input
              type="text"
              name="searchTerm"
              value={filters.searchTerm}
              onChange={handleFilterChange}
              placeholder="Search transactions..."
              className="form-control"
              style={{ width: '300px' }}
            />
          </div>
          <div>
            <button 
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)} 
              className="btn btn-secondary"
            >
              {showAdvancedFilters ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
            </button>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleCSVExport} className="btn btn-primary">
              Export CSV
            </button>
            <button onClick={handlePDFExport} className="btn btn-primary">
              Export PDF
            </button>
          </div>
        </div>
        
        {showAdvancedFilters && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '15px',
            marginBottom: '15px'
          }}>
            <div>
              <label htmlFor="type" style={{ marginBottom: '5px', display: 'block' }}>Transaction Type</label>
              <select 
                id="type" 
                name="type" 
                value={filters.type} 
                onChange={handleFilterChange}
                className="form-control"
              >
                <option value="all">All Transactions</option>
                <option value="purchase">Purchases</option>
                <option value="replenishment">Replenishments</option>
              </select>
            </div>
            
            {(filters.type === 'purchase' || filters.type === 'all') && (
              <div>
                <label htmlFor="category" style={{ marginBottom: '5px', display: 'block' }}>Category</label>
                <select 
                  id="category" 
                  name="category" 
                  value={filters.category} 
                  onChange={handleFilterChange}
                  className="form-control"
                >
                  <option value="all">All Categories</option>
                  {categoryOptions}
                </select>
              </div>
            )}
            
            <div>
              <label htmlFor="dateFrom" style={{ marginBottom: '5px', display: 'block' }}>From Date</label>
              <input 
                type="date" 
                id="dateFrom" 
                name="dateFrom" 
                value={filters.dateFrom} 
                onChange={handleFilterChange}
                className="form-control"
              />
            </div>
            
            <div>
              <label htmlFor="dateTo" style={{ marginBottom: '5px', display: 'block' }}>To Date</label>
              <input 
                type="date" 
                id="dateTo" 
                name="dateTo" 
                value={filters.dateTo} 
                onChange={handleFilterChange}
                className="form-control"
              />
            </div>
            
            <div>
              <label htmlFor="amountMin" style={{ marginBottom: '5px', display: 'block' }}>Min Amount ($)</label>
              <input 
                type="number" 
                id="amountMin" 
                name="amountMin" 
                value={filters.amountMin} 
                onChange={handleFilterChange}
                className="form-control"
                min="0"
                step="0.01"
              />
            </div>
            
            <div>
              <label htmlFor="amountMax" style={{ marginBottom: '5px', display: 'block' }}>Max Amount ($)</label>
              <input 
                type="number" 
                id="amountMax" 
                name="amountMax" 
                value={filters.amountMax} 
                onChange={handleFilterChange}
                className="form-control"
                min="0"
                step="0.01"
              />
            </div>
          </div>
        )}
        
        {showAdvancedFilters && (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={resetFilters} className="btn btn-secondary">
              Clear Filters
            </button>
          </div>
        )}
      </div>
      
      <div className="card">
        <div style={{ marginBottom: '10px' }}>
          <strong>Found {filteredTransactions.length} transaction(s)</strong>
        </div>
        
        {filteredTransactions.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Description</th>
                {filters.type === 'purchase' || filters.type === 'all' ? <th>Category</th> : null}
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(transaction => (
                <tr key={transaction.id}>
                  <td>{new Date(transaction.timestamp).toLocaleString()}</td>
                  <td style={{ textTransform: 'capitalize' }}>{transaction.type}</td>
                  <td>{transaction.description}</td>
                  {(filters.type === 'purchase' || filters.type === 'all') && (
                    <td>
                      {transaction.type === 'purchase' ? (
                        transaction.categoryId ? 
                          categories[transaction.categoryId] : 
                          transaction.productIds && transaction.productIds.length > 1 ? 
                            'Multiple categories' : 
                            'Unknown'
                      ) : '-'}
                    </td>
                  )}
                  <td style={{ color: transaction.amount > 0 ? 'green' : 'red' }}>
                    {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No transactions found</p>
        )}
      </div>
    </div>
  );
};

export default History;
