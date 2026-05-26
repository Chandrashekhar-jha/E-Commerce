import React, { useState } from "react";
import { Link } from "react-router-dom";
import '../styles/product.css';

const PLACEHOLDER_IMAGE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="100%" height="100%" fill="%2318181b"/><g transform="translate(110, 90)" stroke="%23ff6f61" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21a2 2 0 1 0 0 4 2 2 0 1 0 0-4zM60 21a2 2 0 1 0 0 4 2 2 0 1 0 0-4z"/><path d="M3 3h10l12 30h45l10-20H19"/></g><text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" fill="%23a1a1a1" font-family="sans-serif" font-weight="600" font-size="14">ShopNest</text></svg>`;

const ProductCard = ({ product }) => {
    const productId = product._id || product.id;
    const productImage = product.imageUrl || product.image || PLACEHOLDER_IMAGE;
    const [isLoaded, setIsLoaded] = useState(false);

    // Fallback image loader if Unsplash/Cloudinary link fails
    const handleImageError = (e) => {
        e.target.src = PLACEHOLDER_IMAGE;
        setIsLoaded(true); // Stop skeleton loader if fallback triggers
    };

    return (
        <Link to={`/product/${productId}`} className="product-card-link">
            <div className="product-card">
                <img 
                    src={productImage} 
                    alt={product.name} 
                    className={`product-image ${isLoaded ? '' : 'image-loading'}`} 
                    onLoad={() => setIsLoaded(true)}
                    onError={handleImageError}
                    loading="lazy"
                />
                <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-price">₹{product.price.toFixed(2)}</p>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;