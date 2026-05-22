import React from "react";
import {Link} from "react-router-dom";
import '../styles/product.css';
const ProductCard = ({ product }) => {
    return (
        <div className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">${product.price.toFixed(2)}</p>
            </div>
            <Link to={`/product/${product.id}`} className="product-link">
                View Details
            </Link>
        </div>
    )
}

export default ProductCard;