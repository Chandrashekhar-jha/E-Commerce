import React, { useState, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { clearCart } from '../redux/cartSlics';
import '../styles/auth.css';

const Checkout = () => {
    const { isAuthenticated, user } = useContext(AuthContext);
    const cartItems = useSelector((state) => state.cart.cartItems);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Shipping address form state
    const [fullName, setFullName] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [stateName, setStateName] = useState('');
    const [postalCode, setPostalCode] = useState('');

    const [loading, setLoading] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [placedOrderId, setPlacedOrderId] = useState('');

    // Check authentication redirect
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const totalPrice = cartItems.reduce(
        (acc, item) => acc + item.qty * item.price,
        0
    );

    // Dynamic Razorpay script loader
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async (e) => {
        e.preventDefault();

        if (!fullName || !street || !city || !stateName || !postalCode) {
            alert("Please fill in all shipping details.");
            return;
        }

        setLoading(true);

        try {
            // 1. Load Razorpay script
            const isScriptLoaded = await loadRazorpayScript();
            if (!isScriptLoaded) {
                alert("Failed to load Razorpay SDK. Please check your internet connection.");
                setLoading(false);
                return;
            }

            const token = user?.token || localStorage.getItem('authToken');

            // 2. Create payment order on backend
            const orderRes = await fetch("/api/payment/order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ amount: totalPrice })
            });

            const orderData = await orderRes.json();

            if (!orderData.success) {
                alert(orderData.message || "Failed to create payment order.");
                setLoading(false);
                return;
            }

            // 3. Open Razorpay Checkout overlay
            const options = {
                key: orderData.key_id,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "ShopNest",
                description: "E-Commerce Order Purchase",
                image: "/SHOP-NEsT.png",
                order_id: orderData.orderId,
                handler: async function (response) {
                    try {
                        setLoading(true);
                        // 4. Verify payment signature on backend
                        const verifyRes = await fetch("/api/payment/verify", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            })
                        });

                        const verifyData = await verifyRes.json();

                        if (verifyData.success) {
                            // 5. Place order on backend
                            const orderPayload = {
                                products: cartItems.map(item => ({
                                    product: item.product,
                                    quantity: item.qty
                                })),
                                totalPrice,
                                address: {
                                    fullName,
                                    street,
                                    city,
                                    state: stateName,
                                    postalCode
                                },
                                paymentId: verifyData.paymentId
                            };

                            const placeOrderRes = await fetch("/api/orders", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${token}`
                                },
                                body: JSON.stringify(orderPayload)
                            });

                            const placeOrderData = await placeOrderRes.json();

                            if (placeOrderData.success) {
                                // Clear cart
                                dispatch(clearCart());
                                setPlacedOrderId(placeOrderData.orderId);
                                setOrderPlaced(true);
                            } else {
                                alert(placeOrderData.message || "Payment verified, but failed to create order.");
                            }
                        } else {
                            alert("Payment signature verification failed.");
                        }
                    } catch (error) {
                        console.error("Verification error:", error);
                        alert("An error occurred during payment verification.");
                    } finally {
                        setLoading(false);
                    }
                },
                prefill: {
                    name: user?.name || "",
                    email: user?.email || ""
                },
                theme: {
                    color: "#ff6f61"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                alert("Payment failed: " + response.error.description);
            });
            rzp.open();

        } catch (error) {
            console.error("Payment setup error:", error);
            alert("An error occurred while establishing payment details.");
        } finally {
            setLoading(false);
        }
    };

    if (orderPlaced) {
        return (
            <div className="auth-container login-page">
                <div className="auth-form" style={{ textAlign: 'center', padding: '50px 30px' }}>
                    <div className="auth-header">
                        <h2>Order Confirmed!</h2>
                        <p style={{ color: '#b7ffc6', marginTop: '10px', fontSize: '1.1rem' }}>
                            ✔ Payment processed & order placed successfully.
                        </p>
                    </div>
                    <div style={{ margin: '20px 0', color: '#ccc', fontSize: '0.95rem' }}>
                        <p>Order ID: <strong>{placedOrderId}</strong></p>
                        <p style={{ marginTop: '5px' }}>A confirmation email has been sent to {user?.email}.</p>
                    </div>
                    <Link to="/" className="btn" style={{ marginTop: '10px' }}>
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="auth-container login-page">
                <div className="auth-form" style={{ textAlign: 'center' }}>
                    <div className="auth-header">
                        <h2>Checkout</h2>
                        <p>No items found in your shopping cart.</p>
                    </div>
                    <Link to="/shop" className="btn" style={{ marginTop: '20px' }}>
                        Go to Shop
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page-wrapper login-page">
            <div className="checkout-container">
                
                {/* Shipping Form */}
                <form onSubmit={handlePayment} className="auth-form checkout-shipping-form" style={{ width: '100%', maxWidth: '100%', transform: 'none', opacity: 1, animation: 'none' }}>
                    <div className="auth-header" style={{ textAlign: 'left' }}>
                        <h2>Shipping Address</h2>
                        <p>Enter the delivery details for your order.</p>
                    </div>
                    
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
                    
                    <input
                        type="text"
                        placeholder="Street Address"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        required
                    />
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <input
                            type="text"
                            placeholder="City"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="State"
                            value={stateName}
                            onChange={(e) => setStateName(e.target.value)}
                            required
                        />
                    </div>
                    
                    <input
                        type="text"
                        placeholder="Postal Code"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        required
                    />

                    <button type="submit" className="btn" disabled={loading} style={{ marginTop: '10px' }}>
                        {loading ? "Processing Payment..." : "Pay with Razorpay"}
                    </button>
                </form>

                {/* Order Summary */}
                <div className="auth-form checkout-summary-card" style={{ width: '100%', maxWidth: '100%', transform: 'none', opacity: 1, animation: 'none' }}>
                    <div className="auth-header" style={{ textAlign: 'left' }}>
                        <h2>Order Summary</h2>
                        <p>Review items in your cart.</p>
                    </div>
                    
                    <div style={{ maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px', paddingRight: '5px' }}>
                        {cartItems.map((item) => (
                            <div key={item.product} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
                                <div style={{ flex: 1, marginRight: '10px' }}>
                                    <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>{item.name}</div>
                                    <div style={{ color: '#a1a1a1', fontSize: '0.85rem', marginTop: '3px' }}>Qty: {item.qty}</div>
                                </div>
                                <div style={{ color: '#ff6f61', fontWeight: 700 }}>
                                    ₹{(item.qty * item.price).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                            <span>Subtotal:</span>
                            <span>₹{totalPrice.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                            <span>Shipping:</span>
                            <span style={{ color: '#b7ffc6' }}>FREE</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontWeight: 'bold', fontSize: '1.25rem', borderTop: '1px dotted rgba(255,255,255,0.1)', paddingTop: '10px', marginTop: '5px' }}>
                            <span>Total:</span>
                            <span style={{ color: '#ff6f61' }}>₹{totalPrice.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
