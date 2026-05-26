import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (res.ok && data.token) {
                login(data);
                navigate("/");
            } else {
                alert(data.message || "Invalid email or password");
            }
        } catch (error) {
            console.error("Error logging in:", error);
            alert("An error occurred during login. Please try again.");
        }
    }

    return (
        <div className="auth-container login-page">
            <form onSubmit={handleSubmit} className="auth-form">
                <div className="auth-header">
                    <h2>Login</h2>
                    <p>Welcome back — sign in to continue shopping.</p>
                </div>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" className="btn">Login</button>
                <p className="login-footer">
                    Don’t have an account? <Link to="/register">Register</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;