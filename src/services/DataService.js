import { v4 as uuidv4 } from 'uuid';

// Initial data
const initialCategories = [
  { id: '1', name: 'Electronics' },
  { id: '2', name: 'Clothing' },
  { id: '3', name: 'Books' },
  { id: '4', name: 'Food' },
  { id: '5', name: 'Software' }
];

// Initial products
const initialProducts = [
  { id: '1', name: 'Laptop', description: 'Powerful laptop for professionals', price: 1200, categoryId: '1', image: 'https://placehold.co/150' },
  { id: '2', name: 'Smartphone', description: 'Latest model with great camera', price: 800, categoryId: '1', image: 'https://placehold.co/150' },
  { id: '3', name: 'T-shirt', description: 'Cotton t-shirt, very comfortable', price: 25, categoryId: '2', image: 'https://placehold.co/150' },
  { id: '4', name: 'Novel', description: 'Bestselling fiction novel', price: 15, categoryId: '3', image: 'https://placehold.co/150' },
  { id: '5', name: 'Pizza', description: 'Delicious pepperoni pizza', price: 12, categoryId: '4', image: 'https://placehold.co/150' },
  { id: '6', name: 'IDE License', description: 'Professional IDE for development', price: 99, categoryId: '5', image: 'https://placehold.co/150' }
];

const initialUsers = [
  { id: '1', username: 'admin', password: 'admin123', fullName: 'Admin User', email: 'admin@example.com', isAdmin: true, balance: 500, preferences: {} },
  { id: '2', username: 'user', password: 'user123', fullName: 'Regular User', email: 'user@example.com', isAdmin: false, balance: 500, preferences: {} }
];

// Helper function to initialize or get data from localStorage
const getStorageData = (key, initialData) => {
  const storedData = localStorage.getItem(key);
  if (storedData) {
    return JSON.parse(storedData);
  }
  localStorage.setItem(key, JSON.stringify(initialData));
  return initialData;
};

// Get or initialize data
const getCategories = () => getStorageData('categories', initialCategories);
const getProducts = () => getStorageData('products', initialProducts);
const getTransactions = () => getStorageData('transactions', []);

// Save data to localStorage
const saveData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// User functions
export const getUsers = () => {
  return JSON.parse(localStorage.getItem('users') || '[]');
};

export const authenticateUser = (username, password) => {
  const users = getUsers();
  return users.find(user => user.username === username && user.password === password);
};

export const registerUser = (userData) => {
  // Check if user exists
  const users = getUsers();
  const userExists = users.some(user => user.username === userData.username);
  if (userExists) {
    throw new Error('Username already exists');
  }

  // Create new user with $500 starting balance
  const newUser = {
    id: uuidv4(),
    username: userData.username,
    password: userData.password, // In a real app, this should be hashed
    fullName: userData.fullName,
    email: userData.email,
    isAdmin: userData.isAdmin || false,
    balance: 500, // Add $500 starting balance
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  saveData('users', users);
  return newUser;
};

// Create admin account if none exists
export const createAdminIfNone = () => {
  const users = getUsers();
  const adminExists = users.some(user => user.isAdmin);
  
  if (!adminExists) {
    const adminUser = {
      id: uuidv4(),
      username: 'admin',
      password: 'admin123', // In a real app, use a strong password
      fullName: 'Admin User',
      email: 'admin@example.com',
      isAdmin: true,
      balance: 1000,
      createdAt: new Date().toISOString()
    };
    users.push(adminUser);
    saveData('users', users);
    console.log('Admin account created:', adminUser);
    return adminUser;
  }
  return null;
};

export const getUserById = (userId) => {
  const users = getUsers();
  return users.find(user => user.id === userId);
};

export const updateUserBalance = (userId, amount) => {
  const users = getUsers();
  const userIndex = users.findIndex(user => user.id === userId);
  if (userIndex !== -1) {
    users[userIndex].balance += amount;
    saveData('users', users);
    return users[userIndex];
  }
  return null;
};

export const updateUserProfile = (userId, profileData) => {
  try {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const index = users.findIndex(u => u.id === userId);

    if (index === -1) {
      console.error(`User with ID ${userId} not found when updating profile`);
      return null;
    }

    // Handle preferences object specifically to ensure we don't lose existing preferences
    if (profileData.preferences) {
      profileData.preferences = {
        ...users[index].preferences || {},
        ...profileData.preferences
      };
    }

    users[index] = {
      ...users[index],
      ...profileData
    };

    localStorage.setItem('users', JSON.stringify(users));

    // Remove the password for security
    const { password, ...userWithoutPassword } = users[index];
    return userWithoutPassword;
  } catch (error) {
    console.error("Error updating user profile:", error);
    return null;
  }
};

export const updateUserPassword = (userId, currentPassword, newPassword) => {
  try {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const index = users.findIndex(u => u.id === userId);

    if (index === -1) {
      return false;
    }

    // Verify current password
    if (users[index].password !== currentPassword) {
      return false;
    }

    // Update password
    users[index].password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));

    return true;
  } catch (error) {
    console.error("Error updating password:", error);
    return false;
  }
};

// Transaction functions
export const addTransaction = (transaction) => {
  const transactions = getTransactions();
  const newTransaction = {
    id: uuidv4(),
    ...transaction,
    timestamp: new Date().toISOString()
  };
  transactions.push(newTransaction);
  saveData('transactions', transactions);
  return newTransaction;
};

export const getUserTransactions = (userId) => {
  const transactions = getTransactions();
  return transactions.filter(transaction => transaction.userId === userId);
};

export const createTransaction = (userId, amount, type, description, productIds = []) => {
  // Get user using getUserById
  const user = getUserById(userId);
  if (!user) {
    console.error('User not found');
    return null;
  }

  // Create transaction object
  let categoryId = null;
  if (type === 'purchase' && productIds.length > 0) {
    if (productIds.length === 1) {
      const product = getProductById(productIds[0]);
      if (product) {
        categoryId = product.categoryId;
      }
    }
  }

  const transactionData = {
    userId,
    amount: type === 'purchase' ? -Math.abs(amount) : Math.abs(amount),
    type,
    description,
    productId: productIds.length ===1 ? productIds[0] : null,
    categoryId,
    productIds: productIds.length > 0 ? productIds : undefined,
    timestamp: new Date().toISOString()
  };

  // Add transaction to storage
  const transaction = addTransaction(transactionData);

  // Update user balance for purchases and replenishments
  if (type === 'purchase') {
    user.balance = parseFloat((user.balance - Math.abs(amount)).toFixed(2));
  } else if (type === 'replenish') {
    user.balance = parseFloat((user.balance + Math.abs(amount)).toFixed(2));
  }

  // Save updated user
  updateUser(userId, user);

  return transaction;
};

// Category functions
export const getAllCategories = () => {
  return getCategories();
};

export const addCategory = (category) => {
  const categories = getCategories();
  const newCategory = {
    id: uuidv4(),
    ...category
  };
  categories.push(newCategory);
  saveData('categories', categories);
  return newCategory;
};

export const updateCategory = (categoryId, categoryData) => {
  const categories = getCategories();
  const categoryIndex = categories.findIndex(category => category.id === categoryId);
  if (categoryIndex !== -1) {
    categories[categoryIndex] = { ...categories[categoryIndex], ...categoryData };
    saveData('categories', categories);
    return categories[categoryIndex];
  }
  return null;
};

export const deleteCategory = (categoryId) => {
  const categories = getCategories();
  const newCategories = categories.filter(category => category.id !== categoryId);
  saveData('categories', newCategories);
  return categoryId;
};

// Product functions
export const getAllProducts = () => {
  return getProducts();
};

export const getProductById = (productId) => {
  const products = getProducts();
  return products.find(product => product.id === productId);
};

export const addProduct = (product) => {
  const products = getProducts();
  
  // Find the highest existing numeric ID
  let highestId = 0;
  products.forEach(p => {
    const numericId = parseInt(p.id, 10);
    if (!isNaN(numericId) && numericId > highestId) {
      highestId = numericId;
    }
  });
  
  // Create new product with next sequential ID
  const newProduct = {
    id: String(highestId + 1), // Convert to string to maintain consistency
    ...product,
    createdAt: new Date().toISOString()
  };
  
  products.push(newProduct);
  saveData('products', products);
  return newProduct;
};

// Product sorting functions
export const sortProducts = (products, sortBy = 'name', order = 'asc') => {
  const sortedProducts = [...products];
  
  switch (sortBy) {
    case 'price':
      sortedProducts.sort((a, b) => order === 'asc' ? a.price - b.price : b.price - a.price);
      break;
    case 'name':
      sortedProducts.sort((a, b) => {
        return order === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      });
      break;
    case 'newest':
      sortedProducts.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
        return order === 'asc' ? dateA - dateB : dateB - dateA;
      });
      break;
    default:
      // Default sort by name
      sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
  }
  
  return sortedProducts;
};

export const updateProduct = (productId, productData) => {
  const products = getProducts();
  const productIndex = products.findIndex(product => product.id === productId);
  if (productIndex !== -1) {
    products[productIndex] = { ...products[productIndex], ...productData };
    saveData('products', products);
    return products[productIndex];
  }
  return null;
};

export const deleteProduct = (productId) => {
  const products = getProducts();
  const newProducts = products.filter(product => product.id !== productId);
  saveData('products', newProducts);
  return productId;
};

// Wallet functions
export const replenishWallet = (userId, amount) => {
  const user = updateUserBalance(userId, amount);
  if (user) {
    addTransaction({
      userId,
      type: 'replenishment',
      amount,
      description: 'Wallet replenishment'
    });
    return user;
  }
  return null;
};

export const purchaseProduct = (userId, productId) => {
  const user = getUserById(userId);
  const product = getProductById(productId);

  if (!user || !product) return { success: false, message: 'User or product not found' };
  if (user.balance < product.price) return { success: false, message: 'Insufficient funds' };

  // Update user balance
  updateUserBalance(userId, -product.price);

  // Add transaction
  addTransaction({
    userId,
    type: 'purchase',
    amount: -product.price,
    productId,
    productName: product.name,
    categoryId: product.categoryId,
    description: `Purchase of ${product.name}`
  });

  return { success: true, message: 'Purchase successful', user: getUserById(userId) };
};

// Report functions
export const getCategorySpendingReport = (userId) => {
  const transactions = getUserTransactions(userId);
  const categories = getAllCategories();

  // Initialize report with all categories
  const report = categories.map(category => ({
    categoryId: category.id,
    categoryName: category.name,
    totalSpent: 0
  }));

  // Calculate spending for each category
  transactions.forEach(transaction => {
    if (transaction.type === 'purchase') {
      // Handle single product purchase with direct categoryId
      if (transaction.categoryId) {
        const categoryReport = report.find(item => item.categoryId === transaction.categoryId);
        if (categoryReport) {
          categoryReport.totalSpent += Math.abs(transaction.amount);
        }
      } 
      // Handle multi-product purchases by distributing amount among product categories
      else if (transaction.productIds && transaction.productIds.length > 1) {
        // Get unique product categories
        const purchasedProducts = transaction.productIds.map(id => getProductById(id));
        const productCategories = {};

        // Count products per category
        purchasedProducts.forEach(product => {
          if (product && product.categoryId) {
            productCategories[product.categoryId] = (productCategories[product.categoryId] || 0) + 1;
          }
        });

        // Calculate amount per product for fair distribution
        const amountPerProduct = Math.abs(transaction.amount) / transaction.productIds.length;

        // Distribute amount to each category
        Object.entries(productCategories).forEach(([categoryId, count]) => {
          const categoryReport = report.find(item => item.categoryId === categoryId);
          if (categoryReport) {
            categoryReport.totalSpent += amountPerProduct * count;
          }
        });
      }
    }
  });

  return report.sort((a, b) => b.totalSpent - a.totalSpent);
};


export const exportTransactionsToCSV = (userId, transactions = null) => {
  try {
    // If transactions are not provided, fetch them
    if (!transactions) {
      transactions = getUserTransactions(userId);
    }

    if (transactions.length === 0) {
      alert('No transactions to export');
      return;
    }

    // Create CSV headers
    let csvContent = 'Date,Type,Description,Category,Amount\n';

    // Get categories for lookup
    const allCategories = getAllCategories();
    const categoryMap = {};
    allCategories.forEach(category => {
      categoryMap[category.id] = category.name;
    });

    // Add transaction rows
    transactions.forEach(transaction => {
      const date = new Date(transaction.timestamp).toLocaleString();
      const type = transaction.type;
      const description = `"${transaction.description.replace(/"/g, '""')}"`;
      const category = transaction.type === 'purchase' && transaction.categoryId 
        ? categoryMap[transaction.categoryId] 
        : transaction.type === 'purchase' ? 'Unknown' : '-';
      const amount = transaction.amount.toFixed(2);

      csvContent += `${date},${type},${description},${category},${amount}\n`;
    });

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return true;
  } catch (error) {
    console.error('Error exporting CSV:', error);
    alert('Failed to export transactions to CSV');
    return false;
  }
};

export const exportTransactionsToPDF = (userId, transactions = null) => {
  try {
    // If transactions are not provided, fetch them
    if (!transactions) {
      transactions = getUserTransactions(userId);
    }

    if (transactions.length === 0) {
      alert('No transactions to export');
      return;
    }

    // Get user info for the report header
    const user = getUserById(userId);

    // Get categories for lookup
    const allCategories = getAllCategories();
    const categoryMap = {};
    allCategories.forEach(category => {
      categoryMap[category.id] = category.name;
    });

    // Create a simple PDF-like HTML page that we'll print
    const reportWindow = window.open('', '_blank');
    reportWindow.document.write(`
      <html>
        <head>
          <title>Transaction Report</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              line-height: 1.4;
            }
            h1, h2 {
              color: #1976d2;
            }
            .report-header {
              margin-bottom: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
            .transaction-amount {
              text-align: right;
            }
            .positive {
              color: green;
            }
            .negative {
              color: red;
            }
            .footer {
              margin-top: 30px;
              font-size: 12px;
              color: #666;
              text-align: center;
            }
            @media print {
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="no-print" style="text-align: right; margin-bottom: 20px;">
            <button onclick="window.print()">Print / Save as PDF</button>
          </div>

          <div class="report-header">
            <h1>Transaction Report</h1>
            <p><strong>User:</strong> ${user.fullName}</p>
            <p><strong>Date Generated:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Total Transactions:</strong> ${transactions.length}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${transactions.map(transaction => `
                <tr>
                  <td>${new Date(transaction.timestamp).toLocaleString()}</td>
                  <td style="text-transform: capitalize;">${transaction.type}</td>
                  <td>${transaction.description}</td>
                  <td>
                    ${transaction.type === 'purchase' && transaction.categoryId 
                      ? categoryMap[transaction.categoryId] 
                      : transaction.type === 'purchase' ? 'Unknown' : '-'}
                  </td>
                  <td class="transaction-amount ${transaction.amount > 0 ? 'positive' : 'negative'}">
                    ${transaction.amount > 0 ? '+' : ''}$${Math.abs(transaction.amount).toFixed(2)}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            <p>This report was generated from Wallet App on ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `);

    reportWindow.document.close();

    return true;
  } catch (error) {
    console.error('Error exporting PDF:', error);
    alert('Failed to export transactions to PDF');
    return false;
  }
};

// Cart functions
export const getCart = (userId) => {
  const localStorage = window.localStorage;
  const carts = JSON.parse(localStorage.getItem('carts') || '{}');
  return carts[userId] || [];
};

export const addToCart = (userId, productId, quantity = 1) => {
  const localStorage = window.localStorage;
  const carts = JSON.parse(localStorage.getItem('carts') || '{}');

  // Initialize cart if it doesn't exist
  if (!carts[userId]) {
    carts[userId] = [];
  }

  // Check if product already in cart
  const existingItem = carts[userId].find(item => item.productId === productId);

  if (existingItem) {
    // Update quantity if product already in cart
    existingItem.quantity += quantity;
  } else {
    // Add new item to cart
    carts[userId].push({
      id: Date.now().toString(),
      productId,
      quantity,
      addedAt: new Date().toISOString()
    });
  }

  localStorage.setItem('carts', JSON.stringify(carts));
  return carts[userId];
};

export const updateCartItem = (userId, itemId, newQuantity) => {
  const localStorage = window.localStorage;
  const carts = JSON.parse(localStorage.getItem('carts') || '{}');

  if (!carts[userId]) return [];

  const itemIndex = carts[userId].findIndex(item => item.id === itemId);

  if (itemIndex !== -1) {
    if (newQuantity > 0) {
      carts[userId][itemIndex].quantity = newQuantity;
    } else {
      // Remove item if quantity is 0 or less
      carts[userId].splice(itemIndex, 1);
    }

    localStorage.setItem('carts', JSON.stringify(carts));
  }

  return carts[userId];
};

export const removeFromCart = (userId, itemId) => {
  return updateCartItem(userId, itemId, 0);
};

export const clearCart = (userId) => {
  const localStorage = window.localStorage;
  const carts = JSON.parse(localStorage.getItem('carts') || '{}');

  carts[userId] = [];
  localStorage.setItem('carts', JSON.stringify(carts));

  return [];
};

export const updateUser = (userId, updatedUserData) => {
  const users = getUsers();
  const userIndex = users.findIndex(user => user.id === userId);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...updatedUserData };
    saveData('users', users);

    // Also update currentUser if it's this user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.id === userId) {
      localStorage.setItem('currentUser', JSON.stringify(updatedUserData));
    }

    return users[userIndex];
  }
  return null;
};