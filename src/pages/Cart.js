import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaTrash, FaPlus, FaMinus, FaArrowLeft, FaCreditCard } from 'react-icons/fa';
import { addItem, removeItem, deleteItem,  applyPromoCode } from '../features/cart/cartSlice';

const CartContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 5%;
`;

const CartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #8B4513;
  margin: 0;
`;

const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #8B4513;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const CartContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  
  @media (min-width: 992px) {
    flex-direction: row;
  }
`;

const CartItems = styled.div`
  flex: 2;
`;

const CartSummary = styled.div`
  flex: 1;
  background: #FFF8F0;
  border-radius: 8px;
  padding: 1.5rem;
  height: fit-content;
`;

const SummaryTitle = styled.h3`
  margin-top: 0;
  color: #8B4513;
  padding-bottom: 1rem;
  border-bottom: 1px solid #E0D6C9;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 1rem 0;
  
  &.total {
    font-size: 1.2rem;
    font-weight: bold;
    border-top: 1px solid #E0D6C9;
    padding-top: 1rem;
    margin-top: 1.5rem;
  }
`;

const CheckoutButton = styled.button`
  width: 100%;
  background: #8B4513;
  color: white;
  border: none;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  transition: background 0.3s;
  
  &:hover {
    background: #A0522D;
  }
  
  &:disabled {
    background: #CCCCCC;
    cursor: not-allowed;
  }
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  
  h2 {
    color: #8B4513;
    margin-bottom: 1rem;
  }
  
  p {
    color: #666;
    margin-bottom: 2rem;
  }
`;

const CartItem = styled.div`
  display: flex;
  padding: 1.5rem 0;
  border-bottom: 1px solid #EEE;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ItemImage = styled.div`
  width: 100px;
  height: 100px;
  background: #F5F5F5;
  border-radius: 4px;
  margin-right: 1.5rem;
  background-image: ${props => props.image ? `url(${props.image})` : 'none'};
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 2rem;
  overflow: hidden;
  border: 1px solid #E0E0E0;
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const ItemName = styled.h4`
  margin: 0 0 0.5rem 0;
  color: #333;
`;

const ItemPrice = styled.p`
  margin: 0 0 0.5rem 0;
  color: #8B4513;
  font-weight: 500;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
`;

const QuantityButton = styled.button`
  background: #F0E6D2;
  border: 1px solid #DDD;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  color: #333;
  
  &:hover {
    background: #E0D6C9;
  }
`;

const QuantityInput = styled.input`
  width: 40px;
  height: 28px;
  text-align: center;
  border: 1px solid #DDD;
  border-left: none;
  border-right: none;
  -moz-appearance: textfield;
  
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  
  &:hover {
    color: #FF4500;
  }
`;

const PromoCodeContainer = styled.div`
  margin: 1.5rem 0;
  padding-top: 1.5rem;
  border-top: 1px solid #E0D6C9;
`;

const PromoCodeInput = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  
  input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid #DDD;
    border-radius: 4px;
  }
  
  button {
    background: #8B4513;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    
    &:hover {
      background: #A0522D;
    }
  }
`;

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalQuantity, totalAmount, discount } = useSelector((state) => state.cart);
  const [promoCode, setPromoCode] = useState('');
  
  // Helper function to encode image URL properly
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    // Split path and filename to encode only the filename
    const parts = imagePath.split('/');
    const filename = parts.pop();
    const encodedFilename = encodeURIComponent(filename);
    return parts.join('/') + '/' + encodedFilename;
  };
  
  const handleRemoveItem = (id) => {
    dispatch(deleteItem(id));
  };
  
  const handleDecreaseQuantity = (id) => {
    dispatch(removeItem(id));
  };
  
  const handleIncreaseQuantity = (item) => {
    dispatch(addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image
    }));
  };
  
  const handleApplyPromo = () => {
    // In a real app, you would validate this with your backend
    if (promoCode === 'SWEET10') {
      dispatch(applyPromoCode({ code: 'SWEET10', discountPercentage: 10 }));
    } else if (promoCode === 'WELCOME15') {
      dispatch(applyPromoCode({ code: 'WELCOME15', discountPercentage: 15 }));
    } else {
      alert('Invalid promo code');
    }
    setPromoCode('');
  };
  
  const handleCheckout = () => {
    navigate('/checkout');
  };
  
  const subtotal = totalAmount;
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  if (items.length === 0) {
    return (
      <CartContainer>
        <CartHeader>
          <Title>Your Cart</Title>
          <BackButton to="/menu">
            <FaArrowLeft /> Continue Shopping
          </BackButton>
        </CartHeader>
        
        <EmptyCart>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <BackButton to="/menu">
            <FaArrowLeft /> Browse Our Menu
          </BackButton>
        </EmptyCart>
      </CartContainer>
    );
  }

  return (
    <CartContainer>
      <CartHeader>
        <Title>Your Cart ({totalQuantity} {totalQuantity === 1 ? 'item' : 'items'})</Title>
        <BackButton to="/menu">
          <FaArrowLeft /> Continue Shopping
        </BackButton>
      </CartHeader>
      
      <CartContent>
        <CartItems>
          {items.map((item) => (
            <CartItem key={item.id}>
              <ItemImage image={getImageUrl(item.image)}>
                {!item.image && <span>🍪</span>}
              </ItemImage>
              <ItemDetails>
                <ItemName>{item.name}</ItemName>
                <ItemPrice>₱{item.price.toFixed(2)}</ItemPrice>
                <QuantityControls>
                  <QuantityButton onClick={() => handleDecreaseQuantity(item.id)}>
                    <FaMinus size={12} />
                  </QuantityButton>
                  <QuantityInput 
                    type="number" 
                    value={item.quantity} 
                    readOnly 
                  />
                  <QuantityButton onClick={() => handleIncreaseQuantity(item)}>
                    <FaPlus size={12} />
                  </QuantityButton>
                </QuantityControls>
                <RemoveButton onClick={() => handleRemoveItem(item.id)}>
                  <FaTrash size={14} /> Remove
                </RemoveButton>
              </ItemDetails>
              <div style={{ fontWeight: 'bold' }}>
                <div>₱{(item.price * item.quantity).toFixed(2)}</div>
              </div>
            </CartItem>
          ))}
        </CartItems>
        
        <CartSummary>
          <SummaryTitle>Order Summary</SummaryTitle>
          
          <SummaryRow>
            <span>Subtotal ({totalQuantity} {totalQuantity === 1 ? 'item' : 'items'})</span>
            <span>₱{subtotal.toFixed(2)}</span>
          </SummaryRow>
          
          {discount > 0 && (
            <SummaryRow>
              <span>Discount ({discount}%)</span>
              <span style={{ color: 'green' }}>-₱{discountAmount.toFixed(2)}</span>
            </SummaryRow>
          )}
          
          <SummaryRow className="total">
            <span>Total</span>
            <span>₱{total.toFixed(2)}</span>
          </SummaryRow>
          
          <PromoCodeContainer>
            <label htmlFor="promo-code">Promo Code</label>
            <PromoCodeInput>
              <input
                type="text"
                id="promo-code"
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <button onClick={handleApplyPromo}>Apply</button>
            </PromoCodeInput>
            <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
              Try: SWEET10 for 10% off or WELCOME15 for 15% off
            </p>
          </PromoCodeContainer>
          
          <CheckoutButton onClick={handleCheckout}>
            <FaCreditCard /> Proceed to Checkout
          </CheckoutButton>
          
          <p style={{ fontSize: '0.8rem', color: '#666', textAlign: 'center', marginTop: '1rem' }}>
            Secure checkout with PayPal
          </p>
        </CartSummary>
      </CartContent>
    </CartContainer>
  );
};

export default Cart;
