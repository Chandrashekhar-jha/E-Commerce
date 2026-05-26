import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlics';
import ProductCard from '../components/ProductCard';
import '../styles/global.css';

const PLACEHOLDER_IMAGE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500"><rect width="100%" height="100%" fill="%2318181b"/><g transform="translate(210, 190) scale(1.5)" stroke="%23ff6f61" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21a2 2 0 1 0 0 4 2 2 0 1 0 0-4zM60 21a2 2 0 1 0 0 4 2 2 0 1 0 0-4z"/><path d="M3 3h10l12 30h45l10-20H19"/></g><text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" fill="%23a1a1a1" font-family="sans-serif" font-weight="600" font-size="18">ShopNest</text></svg>`;

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Scroll to top when product ID changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
        setQty(data?.stock > 0 ? 1 : 0);
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

  // Fetch related products after the product loads
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product?.category) return;
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        // Filter by same category, excluding current product
        const filtered = data.filter(
          (p) => p.category === product.category && (p._id || p.id) !== (product._id || product.id)
        );
        setRelatedProducts(filtered.slice(0, 4));
      } catch (error) {
        console.error('Error fetching related products:', error);
      }
    };
    fetchRelatedProducts();
  }, [product]);

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;
    dispatch(
      addToCart({
        product: product._id || product.id,
        name: product.name,
        image: product.imageUrl || product.image || '',
        price: product.price,
        stock: product.stock,
        qty,
      })
    );
    navigate('/');
  };

  const handleBuyNow = () => {
    if (!product || product.stock <= 0) return;
    dispatch(
      addToCart({
        product: product._id || product.id,
        name: product.name,
        image: product.imageUrl || product.image || '',
        price: product.price,
        stock: product.stock,
        qty,
      })
    );
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="main-content loading-state">
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="main-content not-found-state">
        <p>Product not found.</p>
        <button className="btn" onClick={() => navigate('/')}>Back to home</button>
      </div>
    );
  }

  const handleImageError = (e) => {
    e.target.src = PLACEHOLDER_IMAGE;
    setIsImageLoaded(true);
  };

  const productImage = product.imageUrl || product.image || PLACEHOLDER_IMAGE;
  const inStock = product.stock > 0;

  return (
    <div className="main-content">
      <div className="product-detail">
        <div className="detail-image-wrap">
          <img 
            src={productImage} 
            alt={product.name} 
            className={`detail-image ${isImageLoaded ? '' : 'image-loading'}`} 
            onLoad={() => setIsImageLoaded(true)}
            onError={handleImageError} 
          />
          <div className={`stock-badge ${inStock ? 'in-stock' : 'out-stock'}`}>
            {inStock ? `In stock: ${product.stock}` : 'Out of stock'}
          </div>
        </div>

        <div className="detail-info">
          <div className="detail-heading">
            <h2>{product.name}</h2>
            <span className={`stock-badge ${inStock ? 'in-stock' : 'out-stock'}`}>
              {inStock ? 'Available' : 'Unavailable'}
            </span>
          </div>

          <p className="price">₹{product.price?.toFixed(2)}</p>

          <div className="detail-meta">
            <span>Category: <strong>{product.category || 'General'}</strong></span>
            <span>Stock: <strong>{product.stock ?? 0}</strong></span>
            <span>Ratings: <strong>{product.ratings?.toFixed(1) || '0.0'}</strong> / 5</span>
          </div>

          <div className="description-block">
            <h3>Product Description</h3>
            <p>{product.description || 'No description available.'}</p>
          </div>

          <div className="cart-actions">
            <div className="quantity-field">
              <label htmlFor="qty">Qty</label>
              <select
                id="qty"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                disabled={!inStock}
              >
                {Array.from(
                  { length: Math.min(product.stock, 10) },
                  (_, i) => i + 1
                ).map((count) => (
                  <option key={count} value={count}>
                    {count}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              className="btn add-to-cart"
              onClick={handleAddToCart}
              disabled={!inStock}
            >
              Add to Cart
            </button>
            <button
              type="button"
              className="btn buy-now"
              onClick={handleBuyNow}
              disabled={!inStock}
            >
              Buy Now
            </button>
          </div>

          <div className="stock-details">
            <p>
              <strong>Stock status:</strong>{' '}
              {inStock ? 'Ready to ship' : 'Currently unavailable'}
            </p>
            <p>
              <strong>Shipping:</strong>{' '}
              {inStock ? 'Free delivery in 3-5 days' : 'Backorder available'}
            </p>
          </div>

          <button className="btn ghost" type="button" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <div className="related-section">
          <h3>Related Products</h3>
          <div className="products-grid">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id || p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
