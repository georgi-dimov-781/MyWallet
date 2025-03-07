
# Online Shop App

This is e-wallet web application built with React and Vite. This application provides online shopping experience with user authentication, product management, shopping cart, and admin features.

## Features

### User Features
- **Home Page**: Landing page with app introduction and featured content
- **User Authentication**: Register and login functionality
- **Product Browsing**: View all products with filtering and search capabilities
- **Shopping Cart**: Add products to cart and manage cart items
- **User Profile**: Update personal information and preferences
- **Wallet System**: Manage virtual wallet for transactions
- **Order History**: View past orders and transaction details
- **Reports**: Visualize spending patterns with charts and graphs

### Admin Features
- **Product Management**: Add, edit, and delete products
- **Category Management**: Create and manage product categories

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation and Setup

1. Clone the repository or download the source code

2. Navigate to the project directory
```bash
cd OnlineShopApp
```

3. Install dependencies
```bash
npm install
# or if you're using yarn
yarn install
```

4. Start the development server
```bash
npm run dev
# or with yarn
yarn dev
```

5. Open your browser and navigate to `http://0.0.0.0:5173` (or the port shown in your terminal)

## Usage Guide

### For Customers
1. **Register/Login**: Create an account or log in to an existing one
2. **Browse Products**: Explore products by category or use the search functionality
3. **Add to Cart**: Click "Add to Cart" on desired products
4. **Checkout**: Review cart and complete purchase
5. **View History**: Check order history in the History section
6. **Manage Profile**: Update personal information in Profile Settings

### For Admins
1. **Access Admin Panel**: Navigate to the Admin section (requires admin privileges)
2. **Manage Products**: Add new products, update information, or remove items
3. **Manage Categories**: Create or edit product categories

## Technology Stack

- React.js
- React Router for navigation
- Chart.js for data visualization
- Vite for fast development and building
- CSS for styling

## Running in Production

To build the application for production deployment:

```bash
npm run build
# or with yarn
yarn build
```
