import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
       <footer className="footer">
            <div className="footer-inner">
                <div className="footer-brand">
                    <h3>ShopNest</h3>
                    <p>Premium E-commerce experience for modern shoppers.</p>
                </div>

                <div className="footer-links">
                    <Link to="/about">About Us</Link>
                    <Link to="/return">Return Policy</Link>
                    <Link to="/disclaimer">Disclaimer</Link>
                </div>

                <div className="footer-copy">
                    &copy; {new Date().getFullYear()} ShopNest. All rights reserved.
                </div>
            </div>
       </footer>
    )
}

export default Footer;