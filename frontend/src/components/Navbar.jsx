import React, { useContext, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import '../styles/navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/login');
  }


  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" onClick={closeMenu}>
          <img 
            src="/SHOP-NEsT.png" 
            alt="ShopNest Logo" 
            className="navbar-logo" 
          />
          ShopNest
        </Link>
      </div>

      <button className={`navbar-toggle ${isOpen ? 'open' : ''}`} onClick={toggleMenu} aria-label="Toggle navigation">
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>

      <div className={`navbar-menu ${isOpen ? 'active' : ''}`}>
        <ul className="navbar-links">
          <li>
            <Link to="/shop" onClick={closeMenu}>Shop</Link>
          </li>

          <li>
            <Link to="/cart" onClick={closeMenu}>Cart ({cartItems.length})</Link>
          </li>

          {user ? (
            <>
              <li>
                <Link to="/profile" onClick={closeMenu}>Hi, {user.name}</Link>
              </li>

              {user && (user.role?.toLowerCase() === "admin" || user.isAdmin) && (
                <li>
                  <Link to="/admin" onClick={closeMenu}>Admin Dashboard</Link>
                </li>
              )}

              <li>
                <button onClick={handleLogout} className="btn-logout">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" onClick={closeMenu}>Login</Link>
              </li>
              <li>
                <Link to="/register" onClick={closeMenu}>Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;