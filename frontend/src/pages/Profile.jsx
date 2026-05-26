import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/profile.css';

const Profile = () => {
    const { isAuthenticated, user, logout } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const navigate = useNavigate();

    // Check authentication redirect
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!isAuthenticated) return;
            try {
                const token = user?.token || localStorage.getItem('authToken');
                const res = await fetch("/api/orders/myorders", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                const data = await res.json();
                if (data.success) {
                    setOrders(data.orders);
                } else {
                    setError(data.message || 'Failed to retrieve order history.');
                }
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError('An error occurred while loading orders.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [isAuthenticated, user]);

    const handleLogoutClick = () => {
        logout();
        navigate('/login');
    };

    const toggleExpandOrder = (orderId) => {
        if (expandedOrderId === orderId) {
            setExpandedOrderId(null);
        } else {
            setExpandedOrderId(orderId);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (!user) {
        return (
            <div className="main-content loading-state">
                <p>Loading profile details...</p>
            </div>
        );
    }

    return (
        <div className="profile-container">
            {/* Left Column: User Profile Card */}
            <div className="profile-card">
                <div className="avatar-circle">
                    {user.name ? user.name.charAt(0) : 'U'}
                </div>
                <div className="profile-info">
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                    <span className="profile-badge">{user.role || 'user'}</span>
                </div>
                <button 
                    onClick={handleLogoutClick} 
                    className="btn-logout" 
                    style={{ marginTop: '25px', width: '100%', borderRadius: '12px', padding: '12px' }}
                >
                    Logout Account
                </button>
            </div>

            {/* Right Column: Order History Section */}
            <div className="orders-section">
                <h2>Your Order History</h2>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '30px 0', color: '#a1a1a1' }}>
                        <p>Loading past orders...</p>
                    </div>
                ) : error ? (
                    <div style={{ padding: '15px', color: '#ffb7a6', background: 'rgba(255, 111, 97, 0.15)', borderRadius: '10px', border: '1px solid rgba(255, 111, 97, 0.25)' }}>
                        <p>{error}</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: '#a1a1a1' }}>
                        <p style={{ marginBottom: '15px' }}>You haven't placed any orders yet.</p>
                        <Link to="/shop" className="btn">
                            Explore Shop
                        </Link>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map((order) => {
                            const isExpanded = expandedOrderId === order._id;
                            return (
                                <div key={order._id} className="order-card">
                                    <div className="order-header" onClick={() => toggleExpandOrder(order._id)}>
                                        <div className="order-meta">
                                            <span className="order-id">Order ID: #{order._id.substring(order._id.length - 8)}</span>
                                            <span className="order-date">{formatDate(order.createdAt)}</span>
                                        </div>
                                        <div className="order-price-status">
                                            <span className="order-total-amount">₹{order.totalPrice.toFixed(2)}</span>
                                            <span className={`status-badge ${order.status}`}>
                                                {order.status}
                                            </span>
                                            <button className="expand-toggle-btn" type="button">
                                                {isExpanded ? 'Collapse' : 'Details'}
                                            </button>
                                        </div>
                                    </div>

                                    {isExpanded && (
                                        <div className="order-items-detail">
                                            <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem', marginBottom: '5px' }}>
                                                Shipping Address:
                                            </div>
                                            <div style={{ color: '#ccc', fontSize: '0.85rem', marginBottom: '15px', lineHeight: '1.5', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                                                <div><strong>{order.address?.fullName}</strong></div>
                                                <div>{order.address?.street}</div>
                                                <div>{order.address?.city}, {order.address?.state} - {order.address?.postalCode}</div>
                                            </div>

                                            <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem', marginBottom: '5px' }}>
                                                Items Purchased:
                                            </div>
                                            <div>
                                                {order.products.map((item, idx) => {
                                                    const productInfo = item.product || {};
                                                    const imageSrc = productInfo.imageUrl || productInfo.image || 'https://via.placeholder.com/150';
                                                    return (
                                                        <div key={idx} className="detail-item-row">
                                                            <img src={imageSrc} alt={productInfo.name || 'Product'} className="detail-item-image" />
                                                            <div className="detail-item-info">
                                                                <div className="detail-item-name">{productInfo.name || 'Deleted Product'}</div>
                                                                <div className="detail-item-qty">Qty: {item.quantity} × ₹{(productInfo.price || 0).toFixed(2)}</div>
                                                            </div>
                                                            <div className="detail-item-subtotal">
                                                                ₹{(item.quantity * (productInfo.price || 0)).toFixed(2)}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
