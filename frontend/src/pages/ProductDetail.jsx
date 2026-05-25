import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/global.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return <div className="main-content"><p>Loading product details...</p></div>;
  }

  if (!product) {
    return (
      <div className="main-content">
        <p>Product not found.</p>
        <button className="btn" onClick={() => navigate('/')}>Back to home</button>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="product-detail">
        <img src={product.image} alt={product.name} className="detail-image" />
        <div className="detail-info">
          <h2>{product.name}</h2>
          <p className="price">${product.price?.toFixed(2)}</p>
          <p>{product.description || 'No description available.'}</p>
          <button className="btn" onClick={() => navigate('/')}>Back to home</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
