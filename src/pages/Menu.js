import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {  useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { fetchProducts, selectAllProducts, selectCategories, selectSelectedCategory, setSelectedCategory } from '../features/products/productsSlice';
import { addItem } from '../features/cart/cartSlice';

const MenuContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 5%;
`;

const MenuHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  color: #8B4513;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  color: #666;
  max-width: 800px;
  margin: 0 auto 2rem;
  line-height: 1.6;
`;

const CategoryTabs = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const CategoryButton = styled.button`
  padding: 0.5rem 1.5rem;
  border: 2px solid #8B4513;
  background: ${props => props.active ? '#8B4513' : 'transparent'};
  color: ${props => props.active ? 'white' : '#8B4513'};
  border-radius: 20px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
  text-transform: capitalize;
  
  &:hover {
    background: #8B4513;
    color: white;
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const ProductCard = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
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
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ProductName = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.25rem;
`;

const ProductDescription = styled.p`
  color: #666;
  margin: 0 0 1rem 0;
  flex-grow: 1;
`;

const ProductPrice = styled.p`
  font-weight: bold;
  color: #8B4513;
  font-size: 1.25rem;
  margin: 0.5rem 0 1rem;
`;

const AddToCartButton = styled.button`
  background: #8B4513;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  width: 100%;
  transition: background 0.3s;
  margin-top: auto;
  
  &:hover {
    background: #A0522D;
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

const OutOfStockBadge = styled.span`
  display: inline-block;
  background: #ff6b6b;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-top: 0.5rem;
`;

const Menu = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  
  const products = useSelector(selectAllProducts);
  const categories = useSelector(selectCategories);
  const selectedCategory = useSelector(selectSelectedCategory);
  const status = useSelector((state) => state.products.status);
  const error = useSelector((state) => state.products.error);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  useEffect(() => {
    // Scroll to product if there's a hash in the URL
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        // Add a temporary highlight
        element.style.boxShadow = '0 0 0 3px rgba(255, 165, 0, 0.5)';
        setTimeout(() => {
          element.style.boxShadow = 'none';
        }, 2000);
      }
    }
  }, [location.hash, products]);

  const handleAddToCart = (product) => {
    dispatch(addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image
    }));
  };

  // Helper function to encode image URL properly
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    // Split path and filename to encode only the filename
    const parts = imagePath.split('/');
    const filename = parts.pop();
    const encodedFilename = encodeURIComponent(filename);
    return parts.join('/') + '/' + encodedFilename;
  };

  if (status === 'loading') {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading menu...</div>;
  }

  if (status === 'failed') {
    return <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>Error: {error}</div>;
  }

  return (
    <MenuContainer>
      <MenuHeader>
        <Title>Our Delicious Menu</Title>
        <Description>
          Explore our selection of freshly baked goods made with the finest ingredients. 
          All our treats are baked to order to ensure maximum freshness and flavor.
        </Description>
        
        <CategoryTabs>
          {categories.map((category) => (
            <CategoryButton
              key={category}
              active={selectedCategory === category}
              onClick={() => dispatch(setSelectedCategory(category))}
            >
              {category}
            </CategoryButton>
          ))}
        </CategoryTabs>
      </MenuHeader>

      <ProductsGrid>
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} id={product.id}>
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
                <ProductDescription>{product.description}</ProductDescription>
                <ProductPrice>₱{product.price.toFixed(2)}</ProductPrice>
                {product.inStock ? (
                  <AddToCartButton onClick={() => handleAddToCart(product)}>
                    Add to Cart
                  </AddToCartButton>
                ) : (
                  <OutOfStockBadge>Out of Stock</OutOfStockBadge>
                )}
              </ProductInfo>
            </ProductCard>
          ))
        ) : (
          <p>No products found in this category.</p>
        )}
      </ProductsGrid>
    </MenuContainer>
  );
};

export default Menu;
