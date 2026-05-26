import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart, removeFromCart, clearCart } from '../redux/cartSlics';
import '../styles/auth.css';

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleClear = () => {
    dispatch(clearCart());
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.qty * item.price,
    0
  );

  return (
    <div className="cart-container main-content">
      <div className="cart-card">
        <div className="cart-header">
          <h2>Your Shopping Cart</h2>
          <p>{cartItems.length ? 'Review your selected items before proceeding.' : 'Your cart is currently empty.'}</p>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <p>No items in your cart yet.</p>
            <Link to="/shop" className="btn" style={{ padding: '12px 24px', borderRadius: '10px', marginTop: '15px' }}>Continue Shopping</Link>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.product} className="cart-item-row">
                  <img 
                    src={item.image || 'https://via.placeholder.com/80x80.png?text=Product'} 
                    alt={item.name} 
                    className="cart-item-image" 
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/80x80.png?text=Product';
                    }} 
                  />
                  <div className="cart-item-info">
                    <strong className="cart-item-name">{item.name}</strong>
                    <div className="cart-item-meta">
                      <span>Price: ₹{item.price.toFixed(2)}</span>
                      <span>Subtotal: <strong>₹{(item.qty * item.price).toFixed(2)}</strong></span>
                    </div>
                  </div>
                  
                  <div className="cart-item-actions">
                    <div className="qty-control">
                      <label htmlFor={`qty-${item.product}`}>Qty</label>
                      <select
                        id={`qty-${item.product}`}
                        value={item.qty}
                        onChange={(e) => {
                          const newQty = Number(e.target.value);
                          dispatch(addToCart({ ...item, qty: newQty }));
                        }}
                        className="cart-qty-select"
                      >
                        {Array.from(
                          { length: Math.min(item.stock ?? 10, 10) },
                          (_, i) => i + 1
                        ).map((count) => (
                          <option key={count} value={count}>
                            {count}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <button onClick={() => handleRemove(item.product)} className="btn-logout" style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '13px' }}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="cart-summary">
              <div className="cart-total">
                <span>Total Amount:</span>
                <span className="total-amount-val">₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="cart-actions">
                <button onClick={handleClear} className="btn-logout" style={{ padding: '12px 20px', borderRadius: '10px' }}>
                  Clear Cart
                </button>
                <Link to="/checkout" className="btn" style={{ padding: '12px 24px', borderRadius: '10px' }}>
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
