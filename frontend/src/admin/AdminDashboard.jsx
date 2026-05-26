import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/admin.css';
import '../styles/global.css';

const AdminDashboard = () => {
    const { isAuthenticated, user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Tab state
    const [activeTab, setActiveTab] = useState('overview');

    // Analytics state
    const [analytics, setAnalytics] = useState(null);
    const [analyticsLoading, setAnalyticsLoading] = useState(true);

    // Products state
    const [products, setProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(true);
    const [productSearch, setProductSearch] = useState('');
    const [productCategoryFilter, setProductCategoryFilter] = useState('');

    // Orders state
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);

    // Users state
    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(true);
    const [usersSearch, setUsersSearch] = useState('');

    // Modal forms states
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // Form inputs state
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    // Authentication and Role guard
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        if (user && user.role !== 'admin') {
            alert("Access denied. Admin authorization required.");
            navigate('/');
        }
    }, [isAuthenticated, user, navigate]);

    // Fetch Overview (Analytics) data
    const fetchAnalytics = async () => {
        setAnalyticsLoading(true);
        try {
            const token = user?.token || localStorage.getItem('authToken');
            const res = await fetch("/api/analytics", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            setAnalytics(data);
        } catch (err) {
            console.error("Error fetching analytics:", err);
        } finally {
            setAnalyticsLoading(false);
        }
    };

    // Fetch Products
    const fetchProducts = async () => {
        setProductsLoading(true);
        try {
            const res = await fetch("/api/products");
            const data = await res.json();
            setProducts(data);
        } catch (err) {
            console.error("Error fetching products:", err);
        } finally {
            setProductsLoading(false);
        }
    };

    // Fetch Orders
    const fetchOrders = async () => {
        setOrdersLoading(true);
        try {
            const token = user?.token || localStorage.getItem('authToken');
            const res = await fetch("/api/orders", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setOrders(data.orders);
            }
        } catch (err) {
            console.error("Error fetching orders:", err);
        } finally {
            setOrdersLoading(false);
        }
    };

    // Fetch Users
    const fetchUsers = async () => {
        setUsersLoading(true);
        try {
            const token = user?.token || localStorage.getItem('authToken');
            const res = await fetch("/api/auth/users", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error("Error fetching users:", err);
        } finally {
            setUsersLoading(false);
        }
    };

    // Load tab-specific data
    useEffect(() => {
        if (user && user.role === 'admin') {
            if (activeTab === 'overview') fetchAnalytics();
            if (activeTab === 'products') fetchProducts();
            if (activeTab === 'orders') fetchOrders();
            if (activeTab === 'users') fetchUsers();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, user]);

    // Handle Open/Close add modal
    const openAddModal = () => {
        setName('');
        setDescription('');
        setPrice('');
        setCategory('');
        setStock('');
        setImageFile(null);
        setImagePreview(null);
        setShowAddModal(true);
    };

    // Handle Open Edit modal
    const openEditModal = (product) => {
        setEditingProduct(product);
        setName(product.name);
        setDescription(product.description);
        setPrice(product.price);
        setCategory(product.category);
        setStock(product.stock);
        setImageFile(null);
        setImagePreview(product.imageUrl || product.image || null);
        setShowEditModal(true);
    };

    // Create product submit
    const handleAddProduct = async (e) => {
        e.preventDefault();
        setFormLoading(true);

        const token = user?.token || localStorage.getItem('authToken');
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('category', category);
        formData.append('stock', stock);
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData
            });

            if (res.ok) {
                alert("Product created successfully.");
                setShowAddModal(false);
                fetchProducts();
            } else {
                const data = await res.json();
                alert(data.message || "Failed to create product.");
            }
        } catch (err) {
            console.error("Product add error:", err);
            alert("An error occurred while creating the product.");
        } finally {
            setFormLoading(false);
        }
    };

    // Edit product submit
    const handleEditProduct = async (e) => {
        e.preventDefault();
        setFormLoading(true);

        const token = user?.token || localStorage.getItem('authToken');
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('category', category);
        formData.append('stock', stock);
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            const res = await fetch(`/api/products/${editingProduct._id}`, {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData
            });

            if (res.ok) {
                alert("Product updated successfully.");
                setShowEditModal(false);
                fetchProducts();
            } else {
                const data = await res.json();
                alert(data.message || "Failed to update product.");
            }
        } catch (err) {
            console.error("Product edit error:", err);
            alert("An error occurred while updating the product.");
        } finally {
            setFormLoading(false);
        }
    };

    // Delete product
    const handleDeleteProduct = async (productId) => {
        if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;

        const token = user?.token || localStorage.getItem('authToken');
        try {
            const res = await fetch(`/api/products/${productId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.ok) {
                alert("Product removed successfully.");
                fetchProducts();
            } else {
                const data = await res.json();
                alert(data.message || "Failed to delete product.");
            }
        } catch (err) {
            console.error("Product delete error:", err);
            alert("An error occurred while deleting the product.");
        }
    };

    // Update order status dropdown
    const handleStatusChange = async (orderId, newStatus) => {
        const token = user?.token || localStorage.getItem('authToken');
        try {
            const res = await fetch(`/api/orders/${orderId}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            const data = await res.json();
            if (data.success) {
                alert(`Order status updated to: ${newStatus}`);
                fetchOrders();
            } else {
                alert(data.message || "Failed to update order status.");
            }
        } catch (err) {
            console.error("Order status update error:", err);
            alert("An error occurred while updating the status.");
        }
    };

    // Delete Order
    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to delete this order? This action cannot be undone.")) return;

        const token = user?.token || localStorage.getItem('authToken');
        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            const data = await res.json();
            if (res.ok && data.success) {
                alert("Order deleted successfully.");
                fetchOrders();
            } else {
                alert(data.message || "Failed to delete order.");
            }
        } catch (err) {
            console.error("Order delete error:", err);
            alert("An error occurred while deleting the order.");
        }
    };

    // Toggle user role
    const handleToggleRole = async (userId, currentRole) => {
        const token = user?.token || localStorage.getItem('authToken');
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        try {
            const res = await fetch(`/api/auth/users/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ role: newRole })
            });

            const data = await res.json();
            if (res.ok) {
                alert("User role updated successfully.");
                fetchUsers();
            } else {
                alert(data.message || "Failed to update user role.");
            }
        } catch (err) {
            console.error("Role toggle error:", err);
            alert("An error occurred while modifying user role.");
        }
    };

    // Delete User
    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to remove this user profile?")) return;

        const token = user?.token || localStorage.getItem('authToken');
        try {
            const res = await fetch(`/api/auth/users/${userId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            const data = await res.json();
            if (res.ok) {
                alert("User deleted successfully.");
                fetchUsers();
            } else {
                alert(data.message || "Failed to delete user.");
            }
        } catch (err) {
            console.error("Delete user error:", err);
            alert("An error occurred while deleting the user.");
        }
    };

    // Local filters for products
    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name?.toLowerCase().includes(productSearch.toLowerCase()) || 
                             p.description?.toLowerCase().includes(productSearch.toLowerCase());
        const matchesCategory = productCategoryFilter === "" || p.category === productCategoryFilter;
        return matchesSearch && matchesCategory;
    });

    const uniqueProductCategories = [...new Set(products.map(p => p.category).filter(Boolean))];

    if (!user || user.role !== 'admin') {
        return (
            <div className="main-content not-found-state">
                <p>Checking administrative credentials...</p>
                <button className="btn" onClick={() => navigate('/')}>Back to Home</button>
            </div>
        );
    }

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h2>Admin Control Panel</h2>
                <div style={{ color: '#a1a1a1', fontSize: '0.95rem' }}>
                    Welcome, <strong>{user.name}</strong> (Administrator)
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="admin-tabs">
                <button 
                    onClick={() => setActiveTab('overview')} 
                    className={`admin-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                >
                    Overview Dashboard
                </button>
                <button 
                    onClick={() => setActiveTab('products')} 
                    className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
                >
                    Manage Products
                </button>
                <button 
                    onClick={() => setActiveTab('orders')} 
                    className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
                >
                    Manage Orders
                </button>
                <button 
                    onClick={() => setActiveTab('users')} 
                    className={`admin-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
                >
                    Manage Users
                </button>
            </div>

            {/* Tab Panel 1: Overview */}
            {activeTab === 'overview' && (
                <div>
                    {analyticsLoading ? (
                        <p style={{ color: '#a1a1a1', textAlign: 'center', padding: '40px 0' }}>Loading analytics...</p>
                    ) : analytics ? (
                        <>
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <h4>Total Revenue</h4>
                                    <p>₹{analytics.totalRevenue?.toFixed(2) || '0.00'}</p>
                                </div>
                                <div className="stat-card">
                                    <h4>Total Orders</h4>
                                    <p>{analytics.totalOrders ?? 0}</p>
                                </div>
                                <div className="stat-card">
                                    <h4>Total Customers</h4>
                                    <p>{analytics.totalUsers ?? 0}</p>
                                </div>
                                <div className="stat-card">
                                    <h4>Total Products</h4>
                                    <p>{analytics.totalProducts ?? 0}</p>
                                </div>
                            </div>

                            <div className="admin-section">
                                <h3>Top Selling Products</h3>
                                {analytics.topProducts && analytics.topProducts.length > 0 ? (
                                    <div className="top-products-grid">
                                        {analytics.topProducts.map((p, idx) => (
                                            <div key={p.productId} className="top-product-item">
                                                <div>
                                                    <strong>#{idx + 1} {p.name}</strong>
                                                    <div style={{ color: '#888', fontSize: '0.85rem', marginTop: '3px' }}>Price: ₹{p.price.toFixed(2)}</div>
                                                </div>
                                                <span className="sold">{p.totalSold} Units Sold</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p style={{ color: '#888', fontSize: '0.95rem' }}>No products have been sold yet.</p>
                                )}
                            </div>
                        </>
                    ) : (
                        <p style={{ color: '#ffb7a6' }}>Failed to retrieve dashboard analytics.</p>
                    )}
                </div>
            )}

            {/* Tab Panel 2: Products Manager */}
            {activeTab === 'products' && (
                <div className="admin-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                        <h3>Catalog Products</h3>
                        <button onClick={openAddModal} className="btn" style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '0.9rem' }}>
                            + Add New Product
                        </button>
                    </div>

                    {/* Local Search and Category Filters */}
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
                        <input 
                            type="text" 
                            placeholder="Search catalog..." 
                            value={productSearch} 
                            onChange={(e) => setProductSearch(e.target.value)} 
                            className="search-bar" 
                            style={{ margin: 0, flex: 1, minWidth: '200px', padding: '10px 15px', fontSize: '15px' }}
                        />
                        <select 
                            value={productCategoryFilter} 
                            onChange={(e) => setProductCategoryFilter(e.target.value)}
                            className="admin-select"
                            style={{ padding: '10px 15px', borderRadius: '8px', minWidth: '160px' }}
                        >
                            <option value="">All Categories</option>
                            {uniqueProductCategories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {productsLoading ? (
                        <p style={{ color: '#a1a1a1', textAlign: 'center', padding: '30px 0' }}>Loading products list...</p>
                    ) : filteredProducts.length === 0 ? (
                        <p style={{ color: '#888' }}>No products match your search or filter criteria.</p>
                    ) : (
                        <div className="admin-table-container">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Stock</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map((p) => (
                                        <tr key={p._id}>
                                            <td style={{ fontWeight: 600 }}>{p.name}</td>
                                            <td>{p.category}</td>
                                            <td style={{ color: '#ff6f61', fontWeight: 'bold' }}>₹{p.price.toFixed(2)}</td>
                                            <td>
                                                {p.stock === 0 ? (
                                                    <span className="status-badge pending" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.25)', display: 'inline-block' }}>Out of Stock</span>
                                                ) : p.stock < 10 ? (
                                                    <span className="status-badge processing" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fde047', border: '1px solid rgba(245, 158, 11, 0.25)', display: 'inline-block' }}>Low Stock ({p.stock})</span>
                                                ) : (
                                                    <span className="status-badge delivered" style={{ background: 'rgba(51, 199, 107, 0.15)', color: '#b7ffc6', border: '1px solid rgba(51, 199, 107, 0.25)', display: 'inline-block' }}>In Stock ({p.stock})</span>
                                                )}
                                            </td>
                                            <td>
                                                <div className="action-btn-group">
                                                    <button onClick={() => openEditModal(p)} className="admin-btn edit">
                                                        Edit
                                                    </button>
                                                    <button onClick={() => handleDeleteProduct(p._id)} className="admin-btn delete">
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Tab Panel 3: Orders Control */}
            {activeTab === 'orders' && (
                <div className="admin-section">
                    <h3>Global Orders</h3>

                    {ordersLoading ? (
                        <p style={{ color: '#a1a1a1', textAlign: 'center', padding: '30px 0' }}>Loading orders list...</p>
                    ) : orders.length === 0 ? (
                        <p style={{ color: '#888' }}>No customer orders have been placed yet.</p>
                    ) : (
                        <div className="admin-table-container">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Date</th>
                                        <th>Total Price</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((o) => (
                                        <tr key={o._id}>
                                            <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                                                #{o._id.substring(o._id.length - 8)}
                                            </td>
                                            <td>
                                                <strong>{o.user?.name || 'Unknown User'}</strong>
                                                <div style={{ color: '#888', fontSize: '0.8rem', marginTop: '2px' }}>{o.user?.email || 'N/A'}</div>
                                            </td>
                                            <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                                            <td style={{ color: '#ff6f61', fontWeight: 'bold' }}>₹{o.totalPrice.toFixed(2)}</td>
                                            <td>
                                                <span className={`status-badge ${o.status}`}>
                                                    {o.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                                                    <select 
                                                        value={o.status} 
                                                        onChange={(e) => handleStatusChange(o._id, e.target.value)}
                                                        className="admin-select"
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="processing">Processing</option>
                                                        <option value="shipped">Shipped</option>
                                                        <option value="delivered">Delivered</option>
                                                    </select>

                                                    {o.status !== 'delivered' && (
                                                        <button 
                                                            onClick={() => handleStatusChange(o._id, 'delivered')}
                                                            className="admin-btn edit" 
                                                            style={{ fontSize: '0.75rem', padding: '6px 10px', background: 'rgba(51, 199, 107, 0.15)', color: '#b7ffc6', border: '1px solid rgba(51, 199, 107, 0.25)' }}
                                                        >
                                                            Deliver
                                                        </button>
                                                    )}

                                                    <button 
                                                        onClick={() => handleDeleteOrder(o._id)}
                                                        className="admin-btn delete"
                                                        style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Tab Panel 4: Users control */}
            {activeTab === 'users' && (
                <div className="admin-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                        <h3>Registered Accounts</h3>
                        <input 
                            type="text" 
                            placeholder="Search users..." 
                            value={usersSearch} 
                            onChange={(e) => setUsersSearch(e.target.value)} 
                            className="search-bar" 
                            style={{ margin: 0, padding: '10px 15px', borderRadius: '8px', maxWidth: '300px', fontSize: '0.9rem' }}
                        />
                    </div>

                    {usersLoading ? (
                        <p style={{ color: '#a1a1a1', textAlign: 'center', padding: '30px 0' }}>Loading users list...</p>
                    ) : users.filter(u => u.name?.toLowerCase().includes(usersSearch.toLowerCase()) || u.email?.toLowerCase().includes(usersSearch.toLowerCase())).length === 0 ? (
                        <p style={{ color: '#888' }}>No accounts match your criteria.</p>
                    ) : (
                        <div className="admin-table-container">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Role Control</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users
                                        .filter(u => u.name?.toLowerCase().includes(usersSearch.toLowerCase()) || u.email?.toLowerCase().includes(usersSearch.toLowerCase()))
                                        .map((u) => (
                                            <tr key={u._id}>
                                                <td style={{ fontWeight: 600 }}>{u.name}</td>
                                                <td>{u.email}</td>
                                                <td>
                                                    <span className={`status-badge ${u.role === 'admin' ? 'delivered' : 'pending'}`} style={{ textTransform: 'capitalize' }}>
                                                        {u.role || 'user'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button 
                                                        onClick={() => handleToggleRole(u._id, u.role)}
                                                        className="admin-btn edit"
                                                        disabled={u._id === user._id}
                                                        style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                                                    >
                                                        Toggle Admin
                                                    </button>
                                                </td>
                                                <td>
                                                    <button 
                                                        onClick={() => handleDeleteUser(u._id)}
                                                        className="admin-btn delete"
                                                        disabled={u._id === user._id}
                                                        style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                                                    >
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Modal 1: Add Product */}
            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Add New Product</h3>
                            <button className="modal-close" onClick={() => setShowAddModal(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleAddProduct} className="admin-form">
                            <div className="form-group">
                                <label htmlFor="add-name">Product Name</label>
                                <input id="add-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="add-desc">Description</label>
                                <textarea id="add-desc" value={description} onChange={(e) => setDescription(e.target.value)} required />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div className="form-group">
                                    <label htmlFor="add-price">Price (INR)</label>
                                    <input id="add-price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="add-stock">Stock Quantity</label>
                                    <input id="add-stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="add-cat">Category</label>
                                <input id="add-cat" type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="add-image">Product Image File</label>
                                <input 
                                    id="add-image" 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        setImageFile(file);
                                        setImagePreview(file ? URL.createObjectURL(file) : null);
                                    }} 
                                />
                                {imagePreview && (
                                    <div style={{ marginTop: '10px', textAlign: 'center' }}>
                                        <img src={imagePreview} alt="Preview" style={{ maxWidth: '120px', maxHeight: '120px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }} />
                                    </div>
                                )}
                            </div>
                            <div className="form-actions">
                                <button type="button" className="admin-tab-btn" onClick={() => setShowAddModal(false)} style={{ background: 'rgba(255,255,255,0.05)', color: '#fff' }}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn" disabled={formLoading} style={{ padding: '10px 20px', borderRadius: '10px' }}>
                                    {formLoading ? "Adding..." : "Add Product"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal 2: Edit Product */}
            {showEditModal && (
                <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Edit Product</h3>
                            <button className="modal-close" onClick={() => setShowEditModal(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleEditProduct} className="admin-form">
                            <div className="form-group">
                                <label htmlFor="edit-name">Product Name</label>
                                <input id="edit-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="edit-desc">Description</label>
                                <textarea id="edit-desc" value={description} onChange={(e) => setDescription(e.target.value)} required />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div className="form-group">
                                    <label htmlFor="edit-price">Price (INR)</label>
                                    <input id="edit-price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="edit-stock">Stock Quantity</label>
                                    <input id="edit-stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="edit-cat">Category</label>
                                <input id="edit-cat" type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="edit-image">Replace Image File (Optional)</label>
                                <input 
                                    id="edit-image" 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        setImageFile(file);
                                        setImagePreview(file ? URL.createObjectURL(file) : (editingProduct?.imageUrl || editingProduct?.image || null));
                                    }} 
                                />
                                {imagePreview && (
                                    <div style={{ marginTop: '10px', textAlign: 'center' }}>
                                        <img src={imagePreview} alt="Preview" style={{ maxWidth: '120px', maxHeight: '120px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }} />
                                    </div>
                                )}
                            </div>
                            <div className="form-actions">
                                <button type="button" className="admin-tab-btn" onClick={() => setShowEditModal(false)} style={{ background: 'rgba(255,255,255,0.05)', color: '#fff' }}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn" disabled={formLoading} style={{ padding: '10px 20px', borderRadius: '10px' }}>
                                    {formLoading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AdminDashboard;
