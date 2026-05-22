import React, { useEffect } from "react";
import ProductCard from "../components/ProductCard";


const Home = () => {
    const [products, setProducts] = React.useState([]);
    const [loading] = React.useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("/api/products");
                const data = await res.json();
                setProducts(data.slice(0, 4)); 
            } catch (error) {
                console.error("Error fetching products:", error);
            } 
           };
        fetchProducts();
    }, []);

    return (
        <div className="home-container" >
            <div className="hero-banner">
                <h1>Welcome to ShopNest</h1>
                <p>Your one-stop shop for all your needs</p>
            </div>
            <h2>Featured Products</h2>
            {loading ? (
                <p>Loading products...</p>
            ) : (
                <div className="products-grid">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Home;