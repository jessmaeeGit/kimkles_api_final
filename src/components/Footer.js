import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaFacebook, FaInstagram, FaTwitter, FaEnvelope } from 'react-icons/fa';

const FooterContainer = styled.footer`
  background: #8B4513;
  color: #FFF8DC;
  padding: 3rem 5%;
  margin-top: 3rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
`;

const FooterSection = styled.div`
  h3 {
    color: #FFD700;
    margin-bottom: 1.5rem;
    font-size: 1.2rem;
  }
  
  p, a {
    color: #FFF8DC;
    margin: 0.5rem 0;
    display: block;
    text-decoration: none;
    
    &:hover {
      color: #FFD700;
    }
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  
  a {
    font-size: 1.5rem;
  }
`;

const Copyright = styled.div`
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.9rem;
  color: rgba(255, 248, 220, 0.7);
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <h3>Kimkles Cravings</h3>
          <p>Delicious homemade treats baked with love and the finest ingredients.</p>
          <SocialIcons>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </a>
          </SocialIcons>
        </FooterSection>
        
        <FooterSection>
          <h3>Quick Links</h3>
          <Link to="/">Home</Link>
          <Link to="/menu">Our Menu</Link>
          <Link to="/#about">About Us</Link>
          <Link to="/#contact">Contact</Link>
        </FooterSection>
        
        <FooterSection>
          <h3>Contact Us</h3>
          <p><FaEnvelope /> info@kimklescravings.com</p>
          <p>☎️ (123) 456-7890</p>
          <p>📍 123 Bakery Street, Sweetville</p>
        </FooterSection>
        
        <FooterSection>
          <h3>Newsletter</h3>
          <p>Subscribe to our newsletter for the latest updates and special offers!</p>
          <div style={{ marginTop: '1rem' }}>
            <input 
              type="email" 
              placeholder="Your email address" 
              style={{
                padding: '0.5rem',
                width: '100%',
                borderRadius: '4px',
                border: '1px solid #DDD',
                marginBottom: '0.5rem'
              }} 
            />
            <button 
              style={{
                background: '#FFD700',
                color: '#8B4513',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                width: '100%'
              }}
            >
              Subscribe
            </button>
          </div>
        </FooterSection>
      </FooterContent>
      
      <Copyright>
        &copy; {new Date().getFullYear()} Kimkles Cravings. All rights reserved.
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;
