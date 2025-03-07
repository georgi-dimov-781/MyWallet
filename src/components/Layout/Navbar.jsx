import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext'; 
import { FaSun, FaMoon, FaBars, FaTimes } from 'react-icons/fa'; 

const Navbar = ({ user, onLogout }) => {
  const { darkMode, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-container">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '24px', marginRight: '8px', color: 'white' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499L12.136.326zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484L5.562 3zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z"/>
              </svg>
            </span>
            <Link to="/dashboard" className="navbar-brand">MyWallet</Link>
          </div>

          <div className="mobile-menu-toggle" onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </div>

          <div className="desktop-menu">
            <Link to="/dashboard" className="navbar-link">Dashboard</Link>
            <Link to="/wallet" className="navbar-link">Wallet</Link>
            <Link to="/products" className="navbar-link">Products</Link>
            <Link to="/cart" className="navbar-link">Cart</Link>
            <Link to="/history" className="navbar-link">History</Link>
            <Link to="/reports" className="navbar-link">Reports</Link>
            {user && user.isAdmin && (
              <Link to="/admin" className="navbar-link">Admin</Link>
            )}
          </div>

          <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
            <Link to="/dashboard" className="navbar-mobile-link" onClick={toggleMenu}>Dashboard</Link>
            <Link to="/wallet" className="navbar-mobile-link" onClick={toggleMenu}>Wallet</Link>
            <Link to="/products" className="navbar-mobile-link" onClick={toggleMenu}>Products</Link>
            <Link to="/cart" className="navbar-mobile-link" onClick={toggleMenu}>Cart</Link>
            <Link to="/history" className="navbar-mobile-link" onClick={toggleMenu}>History</Link>
            <Link to="/reports" className="navbar-mobile-link" onClick={toggleMenu}>Reports</Link>
            {user && user.isAdmin && (
              <Link to="/admin" className="navbar-mobile-link" onClick={toggleMenu}>Admin</Link>
            )}
            <div className="mobile-user-actions">
              <span>Balance: ${user?.balance !== undefined ? user.balance.toFixed(2) : '0.00'}</span>
              <span>Hi, {user?.fullName}</span>
              <Link to="/profile" className="navbar-mobile-link" onClick={toggleMenu}>Profile</Link>
              <button onClick={() => { toggleMenu(); onLogout(); }} className="navbar-button">Logout</button>
              <button onClick={() => { toggleTheme(); toggleMenu(); }} className="theme-button">
                {darkMode ? <><FaSun /> Light Mode</> : <><FaMoon /> Dark Mode</>}
              </button>
            </div>
          </div>

          <div className="desktop-user-actions">
            <span>Balance: ${user?.balance !== undefined ? user.balance.toFixed(2) : '0.00'}</span>
            <span>Hi, {user?.fullName}</span>
            <Link to="/profile" className="navbar-link">Profile</Link>
            <button onClick={onLogout} className="navbar-button">Logout</button>
            <button onClick={toggleTheme} className="theme-button">{darkMode ? <FaSun /> : <FaMoon />}</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;