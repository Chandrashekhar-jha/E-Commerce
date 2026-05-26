import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import '../styles/product.css';
import { fallbackProducts } from '../data/fallbackProducts';

const Home = () => {
    const location = useLocation();
    const isShopPage = location.pathname === "/shop";

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("/api/products");
                if (!res.ok) throw new Error("API not ok");
                const data = await res.json();
                
                if (Array.isArray(data) && data.length > 0) {
                    setProducts(data);
                    const uniqueCategories = [...new Set(data.map(p => p.category).filter(Boolean))];
                    setCategories(uniqueCategories);
                } else {
                    throw new Error("Empty products array");
                }
            } catch (error) {
                console.error("Error fetching products, using fallback data:", error);
                setProducts(fallbackProducts);
                const uniqueCategories = [...new Set(fallbackProducts.map(p => p.category).filter(Boolean))];
                setCategories(uniqueCategories);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Filter products for the shop page
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name?.toLowerCase().includes(search.toLowerCase()) || 
                             product.description?.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = category === "" || product.category === category;
        return matchesSearch && matchesCategory;
    });

    // Products to display (all filtered if shop, otherwise first 4)
    const displayProducts = isShopPage ? filteredProducts : products.slice(0, 4);

    return (
        <div className="home-container main-content" >
            {!isShopPage ? (
                <>
                    <div className="hero-banner">
                        <h1>Welcome to ShopNest</h1>
                        <p>Your one-stop shop for all your needs</p>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', marginTop: '30px' }}>
                        <h2 style={{ margin: 0 }}>Featured Products</h2>
                        <Link to="/shop" className="btn" style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '0.9rem' }}>
                            View All Products
                        </Link>
                    </div>
                    
                    {loading ? (
                        <p style={{ color: '#a1a1a1', textAlign: 'center', padding: '40px 0' }}>Loading products...</p>
                    ) : (
                        <div className="products-grid">
                            {displayProducts.map((product) => (
                                <ProductCard key={product._id || product.id} product={product} />
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <>
                    <div className="shop-header" style={{ marginBottom: '30px' }}>
                        <h2>Explore Our Shop</h2>
                        <p style={{ color: '#a1a1a1', marginTop: '5px' }}>Find premium quality products handpicked for you.</p>
                    </div>

                    {/* Filter and Search Bar */}
                    <div className="shop-filters" style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
                        <input 
                            type="text" 
                            placeholder="Search products..." 
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)} 
                            className="search-bar" 
                            style={{ margin: 0, flex: 1, minWidth: '250px' }}
                        />
                        <select 
                            value={category} 
                            onChange={(e) => setCategory(e.target.value)}
                            className="admin-select"
                            style={{ padding: '14px 20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: '#18181b', color: '#fff', outline: 'none', minWidth: '180px', fontSize: '16px' }}
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {loading ? (
                        <p style={{ color: '#a1a1a1', textAlign: 'center', padding: '40px 0' }}>Loading products...</p>
                    ) : displayProducts.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '50px 0', color: '#a1a1a1' }}>
                            <p style={{ fontSize: '1.2rem', marginBottom: '15px' }}>No products found matching your search criteria.</p>
                            <button className="btn" onClick={() => { setSearch(""); setCategory(""); }}>Reset Filters</button>
                        </div>
                    ) : (
                        <div className="products-grid">
                            {displayProducts.map((product) => (
                                <ProductCard key={product._id || product.id} product={product} />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default Home;