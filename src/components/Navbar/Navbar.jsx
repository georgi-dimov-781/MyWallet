
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand">Online Shop</Link>
        
        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products" className="nav-link">Products</Link>
          
          {user ? (
            <>
              <Link to="/cart" className="nav-link">Cart</Link>
              <Link to="/wallet" className="nav-link">Wallet</Link>
              <Link to="/history" className="nav-link">Orders</Link>
              <Link to="/profile" className="nav-link">Profile</Link>
              {user.isAdmin && <Link to="/admin" className="nav-link">Admin</Link>}
              <button onClick={handleLogout} className="btn btn-outline">Log Out</button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary">Log In</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
