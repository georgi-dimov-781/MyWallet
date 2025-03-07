
import React, { memo, useState } from 'react';
import SocialShareButtons from './SocialShareButtons';

// Using memo to prevent unnecessary re-renders
const ProductCard = memo(({ product, onAddToCart, isInCart }) => {
  const [showShareOptions, setShowShareOptions] = useState(false);
  
  const handleAddToCart = () => {
    onAddToCart(product);
  };

  const toggleShareOptions = (e) => {
    e.stopPropagation();
    setShowShareOptions(!showShareOptions);
  };

  // Get the current URL to share
  const shareUrl = `${window.location.origin}/product/${product.id}`;

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} className="product-image" />
      <div className="product-content">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-category">{product.categoryName}</p>
        <p className="product-price">${product.price.toFixed(2)}</p>
        <p className="product-description">{product.description}</p>
        <div className="product-actions">
          <button 
            onClick={handleAddToCart} 
            className={`btn ${isInCart ? 'btn-outline-primary' : 'btn-primary'}`}
            disabled={isInCart}
          >
            {isInCart ? 'Added to Cart' : 'Add to Cart'}
          </button>
          <button 
            onClick={toggleShareOptions}
            className="btn btn-outline-secondary share-button"
          >
            <i className="fas fa-share-alt"></i> Share
          </button>
        </div>
        
        {showShareOptions && (
          <div className="share-options">
            <SocialShareButtons 
              url={shareUrl}
              title={product.name}
              image={product.image}
              description={product.description}
            />
          </div>
        )}
      </div>
    </div>
  );
});

export default ProductCard;
