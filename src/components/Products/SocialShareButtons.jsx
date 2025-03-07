
import React from 'react';
import {
  FacebookShareButton, FacebookIcon,
  TwitterShareButton, TwitterIcon,
  PinterestShareButton, PinterestIcon,
  WhatsappShareButton, WhatsappIcon
} from 'react-share';

const SocialShareButtons = ({ url, title, image, description }) => {
  return (
    <div className="social-share-container">
      <h5 className="share-title">Share this product:</h5>
      <div className="social-buttons">
        <FacebookShareButton url={url} quote={title} className="social-button">
          <FacebookIcon size={32} round />
        </FacebookShareButton>
        
        <TwitterShareButton url={url} title={title} className="social-button">
          <TwitterIcon size={32} round />
        </TwitterShareButton>
        
        <PinterestShareButton url={url} media={image} description={description} className="social-button">
          <PinterestIcon size={32} round />
        </PinterestShareButton>
        
        <WhatsappShareButton url={url} title={title} className="social-button">
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
      </div>
    </div>
  );
};

export default SocialShareButtons;
