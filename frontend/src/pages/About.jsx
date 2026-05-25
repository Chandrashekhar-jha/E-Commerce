import React from 'react';

const About = () => {

  const containerStyle = {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '40px',
    background: '#18181b',
    borderRadius: '16px',
    border: '1px solid rgba(255, 111, 97, 0.18)',
    boxShadow: '0 38px 90px rgba(0, 0, 0, 0.35)',
    textAlign: 'center',
  };

  const socialBtnStyle = {
    display: 'inline-block',
    margin: '10px',
    padding: '12px 24px',
    background: '#27272a',
    color: '#fff',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: '0.3s ease',
    border: '1px solid rgba(255, 111, 97, 0.18)',
  };

  const imageStyle = {
    width: '180px',
    height: '180px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid #fff',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    marginBottom: '20px',
    background: 'linear-gradient(135deg, #ff6f61, #ff9b6a)',
  };

  return (
    <div style={containerStyle}>

      <img
        src="/Jon_Snow_season_8.png"
        alt="Rajan"
        style={imageStyle}
      />

      <h2
        style={{
          color: '#ffffff',
          fontSize: '2rem',
          marginBottom: '10px',
        }}
      >
        About Me
      </h2>

      <h3
        style={{
          color: '#ff6f61',
          fontSize: '1.5rem',
          marginBottom: '20px',
        }}
      >
        Rajan Jha (@Rajan)
      </h3>

      <p
        style={{
          color: '#a1a1a1',
          fontSize: '1.1rem',
          lineHeight: '1.8',
          margin: '0 auto 30px',
          maxWidth: '600px',
        }}
      >
        <strong>Join the community and grow together.</strong>

        <br />
        <br />

        Welcome to my platform where we build, deploy, and scale
        highly engineered systems. This platform is focused on
        learning, innovation, and building modern web applications.
      </p>

      <div>
        <a
          href="https://github.com/Chandrashekhar-jha"
          target="_blank"
          rel="noreferrer"
          style={socialBtnStyle}
        >
          GitHub
        </a>

        <a
          href="https://www.linkedin.com/in/chandrashekhar-jha-b95240285/"
          target="_blank"
          rel="noreferrer"
          style={socialBtnStyle}
        >
          LinkedIn
        </a>

        <a
          href="https://instagram.com"
          target="_blank"
          rel="noreferrer"
          style={socialBtnStyle}
        >
          Instagram
        </a>
      </div>

    </div>
  );
};

export default About;