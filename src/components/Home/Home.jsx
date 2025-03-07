
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="container">
      <div className="home-hero">
        <h1>Welcome to Online Shop</h1>
        <p>Your one-stop destination for all your shopping needs</p>
        
        <div className="home-features">
          <div className="feature-card">
            <h3>Wide Selection</h3>
            <p>Browse through our extensive collection of products</p>
          </div>
          
          <div className="feature-card">
            <h3>Best Prices</h3>
            <p>Get the best deals on all your favorite items</p>
          </div>
          
          <div className="feature-card">
            <h3>Fast Delivery</h3>
            <p>Quick and reliable shipping to your doorstep</p>
          </div>
        </div>
        
        <div className="home-cta">
          <Link to="/products" className="btn btn-primary">Shop Now</Link>
          <Link to="/register" className="btn btn-secondary">Create Account</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
