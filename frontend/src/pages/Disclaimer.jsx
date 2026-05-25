import React from 'react';

const Disclaimer = () => {

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

      <h1 style={headingStyle}>Disclaimer</h1>

      <p style={textStyle}>
        The information provided on ShopNest is for general
        informational and educational purposes only.
      </p>

      <p style={textStyle}>
        While we strive to keep all information accurate and updated,
        we make no guarantees regarding completeness, reliability,
        or accuracy of any product, service, or content available
        on this platform.
      </p>

      <p style={textStyle}>
        Any action you take based on the information found on this
        website is strictly at your own risk. ShopNest will not be
        liable for any losses or damages related to the use of our platform.
      </p>

      <p style={textStyle}>
        External links provided on this website may lead to third-party
        websites. We do not control or take responsibility for the
        content, privacy policies, or practices of those websites.
      </p>

      <p style={textStyle}>
        By using this website, you agree to this disclaimer and its terms.
      </p>

    </div>
  );
};

export default Disclaimer;