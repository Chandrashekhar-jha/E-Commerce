import React from 'react';

const ReturnPolicy = () => {

  const containerStyle = {
    maxWidth: '900px',
    margin: '40px auto',
    padding: '40px',
    background: '#18181b',
    borderRadius: '16px',
    border: '1px solid rgba(255, 111, 97, 0.18)',
    boxShadow: '0 38px 90px rgba(0, 0, 0, 0.35)',
    color: '#ffffff',
  };

  const headingStyle = {
    color: '#ff6f61',
    marginBottom: '20px',
    textAlign: 'center',
  };

  const textStyle = {
    color: '#a1a1a1',
    lineHeight: '1.8',
    marginBottom: '20px',
    fontSize: '1rem',
  };

  return (
    <div style={containerStyle}>

      <h1 style={headingStyle}>Return Policy</h1>

      <p style={textStyle}>
        At ShopNest, customer satisfaction is our top priority.
      </p>

      <p style={textStyle}>
        Products can be returned within 7 days of delivery if they
        are damaged, defective, or incorrect.
      </p>

      <p style={textStyle}>
        To be eligible for a return, the item must be unused and in
        the same condition that you received it, including original
        packaging and accessories.
      </p>

      <p style={textStyle}>
        Refunds will be processed after successful inspection of
        the returned product. The amount may take 5-7 business days
        to reflect in your original payment method.
      </p>

      <p style={textStyle}>
        Certain items such as personal care products, digital goods,
        and customized items may not be eligible for returns.
      </p>

      <p style={textStyle}>
        For any return or refund queries, please contact our support team.
      </p>

    </div>
  );
};

export default ReturnPolicy;