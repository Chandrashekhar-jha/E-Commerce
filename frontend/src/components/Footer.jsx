import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
       <footer style={{
        background: '#333',
        borderTop: '1px solid #444',
        padding: '40px 20px',
        marginTop: 'auto',
       }}>
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            alignItems: 'center',
            maxWidth: '1200px',
            margin: '0 auto',
            gap: '20px'
        }}>
            <div>
                <h3 style={{ color: '#f97316', marginBottom: '10px' }}>ShopNest</h3>
                <p style={{ color: '#bbb', fontSize: '14px' }}>
                    &copy; {new Date().getFullYear()} Premium E-commerce.
                </p>
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
                <Link to="/about" style={{ color: '#bbb', fontSize: '14px' }}>About Us</Link>
                <Link to="/return" style={{ color: '#bbb', fontSize: '14px' }}>Return Policy</Link>
                <Link to="/disclaimer" style={{ color: '#bbb', fontSize: '14px' }}>Disclaimer</Link>
            </div>

            <div style={{color: '#bbb', fontSize: '14px' }}>
                &copy; {new Date().getFullYear()} ShopNest. All rights reserved.
            </div>


        </div>
        </footer>
    )
}

export default Footer;