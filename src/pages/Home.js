import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../features/products/productsSlice';

const Hero = styled.section`
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/Sampler%20Box.png');
  background-size: cover;
  background-position: center;
  color: white;
  text-align: center;
  padding: 8rem 2rem;
  margin-bottom: 3rem;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  color: #FFD700;
`;

const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const Button = styled(Link)`
  display: inline-block;
  background: #8B4513;
  color: white;
  padding: 0.8rem 2rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  transition: background 0.3s;
  margin: 0 0.5rem;
  
  &:hover {
    background: #A0522D;
  }
`;

const PrimaryButton = styled(Button)`
  background: #FF8C00;
  
  &:hover {
    background: #FFA500;
  }
`;

const Section = styled.section`
  padding: 4rem 5%;
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  color: #8B4513;
`;

const FeaturedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const ProductCard = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const ProductImageWrapper = styled.div`
  height: 200px;
  width: 100%;
  background: #f5f5f5;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 3rem;
`;

const ProductInfo = styled.div`
  padding: 1.5rem;
`;

const ProductName = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #333;
`;

const ProductPrice = styled.p`
  font-weight: bold;
  color: #8B4513;
  margin: 0.5rem 0;
`;

const ViewMore = styled.div`
  text-align: center;
  margin-top: 3rem;
`;

const Home = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items);
  const status = useSelector((state) => state.products.status);
  const error = useSelector((state) => state.products.error);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  // Get featured products (first 4 products for demo)
  const featuredProducts = products.slice(0, 4);

  // Helper function to encode image URL properly
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    // Split path and filename to encode only the filename
    const parts = imagePath.split('/');
    const filename = parts.pop();
    const encodedFilename = encodeURIComponent(filename);
    return parts.join('/') + '/' + encodedFilename;
  };

  return (
    <div>
      <Hero>
        <HeroTitle>Delicious Homemade Treats</HeroTitle>
        <HeroSubtitle>
          Indulge in our freshly baked cookies, brownies, and sweet treats made with love and the finest ingredients.
        </HeroSubtitle>
        <div>
          <PrimaryButton to="/menu">Order Now</PrimaryButton>
          <Button to="/#featured">View Specials</Button>
        </div>
      </Hero>

      <Section id="featured">
        <SectionTitle>Our Featured Treats</SectionTitle>
        {status === 'loading' && <p>Loading...</p>}
        {status === 'failed' && <p>Error: {error}</p>}
        
        <FeaturedGrid>
          {featuredProducts.map((product) => (
            <ProductCard key={product.id}>
              <ProductImageWrapper>
                {product.image ? (
                  <ProductImage
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    onError={(e) => {
                      console.error('Failed to load image:', product.image, e.target.src);
                      e.target.style.display = 'none';
                      const placeholder = e.target.nextSibling;
                      if (placeholder) placeholder.style.display = 'flex';
                    }}
                    onLoad={() => {
                      console.log('Image loaded successfully:', product.image);
                    }}
                  />
                ) : null}
                <PlaceholderImage style={{ display: product.image ? 'none' : 'flex' }}>
                  🍪
                </PlaceholderImage>
              </ProductImageWrapper>
              <ProductInfo>
                <ProductName>{product.name}</ProductName>
                <p>{product.description}</p>
                <ProductPrice>₱{product.price.toFixed(2)}</ProductPrice>
                <Button to={`/menu#${product.id}`} style={{ display: 'block', textAlign: 'center', marginTop: '1rem' }}>
                  View Details
                </Button>
              </ProductInfo>
            </ProductCard>
          ))}
        </FeaturedGrid>

        <ViewMore>
          <Button to="/menu">View Full Menu →</Button>
        </ViewMore>
      </Section>

      <Section style={{ backgroundColor: '#FFF8F0' }}>
        <SectionTitle>How It Works</SectionTitle>
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '2rem' }}>
          <div style={{ textAlign: 'center', maxWidth: '250px' }}>
            <h3>1. Browse Our Menu</h3>
            <p>Choose from our delicious selection of cookies, brownies, and more.</p>
          </div>
          <div style={{ textAlign: 'center', maxWidth: '250px' }}>
            <h3>2. Customize Your Order</h3>
            <p>Select your favorites and customize your order to your liking.</p>
          </div>
          <div style={{ textAlign: 'center', maxWidth: '250px' }}>
            <h3>3. Checkout Securely</h3>
            <p>Pay with confidence using our secure payment system.</p>
          </div>
          <div style={{ textAlign: 'center', maxWidth: '250px' }}>
            <h3>4. Enjoy!</h3>
            <p>Sit back and wait for your delicious treats to arrive!</p>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Home;
