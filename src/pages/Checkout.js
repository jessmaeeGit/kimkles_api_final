import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { createOrder } from '../features/orders/orderSlice';
import { clearCart } from '../features/cart/cartSlice';
import { useAddressAutocomplete } from '../hooks/useAddressAutocomplete';

const CheckoutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 5%;
`;

const CheckoutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: 992px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const CheckoutSection = styled.section`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  color: #8B4513;
  margin-top: 0;
  padding-bottom: 1rem;
  border-bottom: 1px solid #E0D6C9;
  font-size: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #555;
  }
  
  input, select, textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #DDD;
    border-radius: 4px;
    font-size: 1rem;
    
    &:focus {
      outline: none;
      border-color: #8B4513;
      box-shadow: 0 0 0 2px rgba(139, 69, 19, 0.2);
    }
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const OrderSummary = styled.div`
  background: #FFF8F0;
  border-radius: 8px;
  padding: 1.5rem;
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #E0D6C9;
  
  &:last-child {
    border-bottom: none;
  }
`;

const TotalRow = styled(OrderItem)`
  font-weight: bold;
  font-size: 1.1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px solid #E0D6C9;
`;

const PayButton = styled.button`
  width: 100%;
  background: #8B4513;
  color: white;
  border: none;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1.5rem;
  transition: background 0.3s;

  &:hover {
    background: #A0522D;
  }

  &:disabled {
    background: #CCCCCC;
    cursor: not-allowed;
  }
`;

const PayPalButtonContainer = styled.div`
  position: relative;
  min-height: 200px;
`;

const PayPalFallback = styled.div`
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 2px dashed #0070ba;
  border-radius: 8px;
  margin: 1rem 0;
  padding: 1rem;
`;

const PayPalLoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: 8px;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const AddressSuggestions = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
  margin-top: 2px;
`;

const AddressSuggestion = styled.div`
  padding: 0.75rem;
  cursor: pointer;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f8f9fa;
  }

  ${({ isSelected }) => isSelected && `
    background-color: #e3f2fd;
  `}
`;

// Helper function to safely format currency values
const formatCurrency = (value) => {
  try {
    if (value === null || value === undefined || value === '') return '₱0.00';
    const num = typeof value === 'number' ? value : parseFloat(value);
    if (isNaN(num)) return '₱0.00';
    return `₱${num.toFixed(2)}`;
  } catch (error) {
    console.error('Error formatting currency:', error);
    return '₱0.00';
  }
};

const Checkout = () => {
  // Hooks must be called at the top level and in the same order
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // State hooks - all state declarations at the top
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    deliveryInstructions: '',
    paymentMethod: 'paypal',
  });
  const [promoCode, setPromoCode] = useState('');
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [selectedAddressDetails, setSelectedAddressDetails] = useState(null);

  // Address autocomplete state
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(-1);
  
  // Get cart state with safe defaults
  const cartState = useSelector((state) => state.cart || {});
  
  // Destructure with safe defaults
  const { 
    items = [], 
    subtotal = 0, 
    discount = 0, 
    discountAmount = 0, 
    shippingCost = 0, 
    total = 0 
  } = cartState;
  // Derive monetary values if not present on cart slice
  const derivedSubtotal = items.reduce((sum, it) => sum + (parseFloat(it.price) || 0) * (parseInt(it.quantity, 10) || 0), 0);
  const discountPercent = discount || 0;
  const derivedDiscountAmount = Number((derivedSubtotal * (discountPercent / 100)).toFixed(2));
  const derivedShippingCost = Number(((shippingCost || 0)).toFixed(2));
  const derivedTotal = Number((derivedSubtotal - derivedDiscountAmount + derivedShippingCost).toFixed(2));
  
  // Address autocomplete hook
  const { suggestions, loading: addressLoading, error: addressError, searchAddresses, clearSuggestions } = useAddressAutocomplete();
  const [{ loadingStatus }] = usePayPalScriptReducer();
  
  const NOTIFY_WEBHOOK_URL = process.env.REACT_APP_SMS_WEBHOOK_URL;
  const NOTIFY_TO_NUMBER = '+639121541566';
  
  const sendOrderNotification = async ({ orderId: notifyOrderId, amount }) => {
    try {
      if (!NOTIFY_WEBHOOK_URL) {
        console.warn('Notification webhook URL not configured (REACT_APP_SMS_WEBHOOK_URL)');
        return;
      }
      const message = `New order ${notifyOrderId} placed. Total: ₱${Number(amount || 0).toFixed(2)}`;
      const payload = {
        to: NOTIFY_TO_NUMBER,
        message,
        meta: {
          orderId: notifyOrderId,
          total: Number(amount || 0)
        }
      };
      await fetch(NOTIFY_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error('Failed to send notification:', err);
    }
  };
  
  // Effect hooks - all effects after state declarations
  useEffect(() => {
    // Set loading to false when component mounts
    setIsLoading(false);
    
    // Log cart state for debugging
    console.log('Cart State:', cartState);
    
    if (cartState) {
      console.log('Cart Items:', cartState.items);
      console.log('Subtotal:', cartState.subtotal);
      console.log('Total:', cartState.total);
    }
  }, [cartState]);
  
  // Debug: Log the values being used in the JSX
  useEffect(() => {
    console.group('Checkout Component Values');
    console.log('Items:', items);
    console.log('Subtotal:', derivedSubtotal, typeof derivedSubtotal);
    console.log('Discount %:', discountPercent, typeof discountPercent);
    console.log('Discount Amount:', derivedDiscountAmount, typeof derivedDiscountAmount);
    console.log('Shipping Cost:', derivedShippingCost, typeof derivedShippingCost);
    console.log('Total:', derivedTotal, typeof derivedTotal);

    // Test formatCurrency with different values
    console.log('Format Currency Test (0):', formatCurrency(0));
    console.log('Format Currency Test (null):', formatCurrency(null));
    console.log('Format Currency Test (undefined):', formatCurrency(undefined));
    console.log('Format Currency Test (string):', formatCurrency('abc'));
    console.groupEnd();
  }, [items, subtotal, discount, discountAmount, shippingCost, total]);

  // Monitor PayPal script loading
  useEffect(() => {
    const checkPayPalLoaded = () => {
      if (window.paypal && typeof window.paypal !== 'undefined') {
        console.log('✅ PayPal script loaded successfully');
        console.log('PayPal object:', window.paypal);
      } else {
        console.log('⏳ PayPal script not yet loaded');
      }
    };

    // Check immediately
    checkPayPalLoaded();

    // Check every 2 seconds for up to 10 seconds
    const interval = setInterval(() => {
      checkPayPalLoaded();
    }, 2000);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      console.log('🔍 PayPal script loading check completed');
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);
  
    const handlePaypalClick = async () => {
    setLoading(true);
    try {
      // Handle PayPal payment processing here
      // This is a placeholder for the actual payment processing logic
      console.log('Processing PayPal payment...');
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset loading state
      setLoading(false);
    } catch (error) {
      console.error('Payment error:', error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('📝 Form field changed:', name, '=', value);

    if (name === 'address') {
      console.log('🏠 Address field changed to:', value);
      setFormData({
        ...formData,
        [name]: value
      });

      // Clear structured address details when user manually types
      // (they'll be set again if they select from autocomplete)
      setSelectedAddressDetails(null);

      // Search for address suggestions
      console.log('🔍 Calling searchAddresses with:', value);
      searchAddresses(value);
      setShowSuggestions(true);
      setSelectedAddressIndex(-1);
    } else {
      setFormData({
        ...formData,
        [name]: value
      });

      // Hide suggestions when changing other fields
      if (name !== 'address') {
        setShowSuggestions(false);
        clearSuggestions();
      }
    }
  };

  // Address autocomplete handlers
  const handleAddressSelect = (suggestion) => {
    console.log('🎯 Address selected:', suggestion);
    setFormData({
      ...formData,
      address: suggestion.address
    });
    // Store structured address details for PayPal shipping address
    setSelectedAddressDetails(suggestion.details || null);
    setShowSuggestions(false);
    clearSuggestions();
  };

  const handleAddressKeyDown = (e) => {
    console.log('⌨️ Key pressed:', e.key, 'in address field');
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedAddressIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedAddressIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedAddressIndex >= 0 && selectedAddressIndex < suggestions.length) {
          handleAddressSelect(suggestions[selectedAddressIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        clearSuggestions();
        break;
      default:
        break;
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    // If payment method is PayPal, ensure payment was successful
    if (formData.paymentMethod === 'paypal' && !paymentSuccessful) {
      alert('Please complete your PayPal payment first before placing your order.');
      return;
    }
    
    // Validate form
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
      alert('Please fill in all required fields.');
      return;
    }
    
    if (items.length === 0) {
      alert('Your cart is empty. Please add items before placing an order.');
      return;
    }
    
    try {
      // Generate order ID
      const mockOrderId = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      // Prepare shipping address structure
      const shippingAddress = {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        street: formData.address,
        addressLine2: formData.deliveryInstructions || '',
        city: selectedAddressDetails?.city || '',
        state: selectedAddressDetails?.state || '',
        zipCode: selectedAddressDetails?.postcode || '',
        country: selectedAddressDetails?.country || 'Philippines',
      };
      
      // Create the order data with complete delivery form information
      const orderData = {
        id: mockOrderId,
        orderDate: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        ...formData,
        items,
        subtotal: derivedSubtotal,
        discount: derivedDiscountAmount,
        shipping: derivedShippingCost,
        total: derivedTotal,
        status: 'processing', // Start with processing, will update to shipped/delivered later
        paymentId: paymentDetails?.paymentId || null,
        paymentDetails: paymentDetails?.paymentDetails || null,
        shippingAddress: shippingAddress,
        paymentMethod: formData.paymentMethod === 'paypal' ? 'PayPal' : 'Credit Card',
        trackingNumber: null, // Will be assigned when shipped
        carrier: null,
      };
      
      // Store order in localStorage (in a real app, this would be sent to backend)
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.push(orderData);
      localStorage.setItem('orders', JSON.stringify(orders));
      
      // In a real app, you would send this to your backend
      // const result = await dispatch(createOrder(orderData)).unwrap();
      // setOrderId(result.id);
      
      setOrderId(mockOrderId);
      setOrderCompleted(true);
      dispatch(clearCart());
      
      // Fire-and-forget notification (do not block UX)
      sendOrderNotification({ orderId: mockOrderId, amount: derivedTotal });
      
      // Reset payment state
      setPaymentSuccessful(false);
      setPaymentDetails(null);
      
      // Redirect to order tracking
      navigate(`/track-order/${mockOrderId}`);
      
    } catch (error) {
      console.error('Error creating order:', error);
      alert('There was an error processing your order. Please try again.');
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // For non-PayPal payment methods or when form is submitted
    // This will be handled by handlePlaceOrder if PayPal payment is required
    handlePlaceOrder(e);
  };
  const createPayPalOrder = (data, actions) => {
    const orderTotal = parseFloat(derivedTotal) || 0;
    if (items.length === 0 || orderTotal <= 0) {
      console.error('Invalid order: no items or zero total', { itemsCount: items.length, total: orderTotal });
      throw new Error('Your cart is empty or total is zero.');
    }
    const itemList = items.map(item => ({
      name: item.name,
      unit_amount: {
        currency_code: 'PHP',
        value: parseFloat(item.price).toFixed(2),
      },
      quantity: String(item.quantity),
    }));

    const itemTotal = items.reduce((sum, it) => sum + (parseFloat(it.price) || 0) * (parseInt(it.quantity, 10) || 0), 0);
    const shippingVal = parseFloat(derivedShippingCost) || 0;
    const discountVal = parseFloat(derivedDiscountAmount) || 0;
    const computed = Number((itemTotal + shippingVal - discountVal).toFixed(2));

    const breakdown = {
      item_total: { currency_code: 'PHP', value: itemTotal.toFixed(2) },
    };
    if (shippingVal > 0) {
      breakdown.shipping = { currency_code: 'PHP', value: shippingVal.toFixed(2) };
    }
    if (discountVal > 0) {
      breakdown.discount = { currency_code: 'PHP', value: discountVal.toFixed(2) };
    }

    // Prepare shipping address from form data
    const shippingAddress = {
      address_line_1: formData.address || '',
      address_line_2: formData.deliveryInstructions || '',
      admin_area_2: selectedAddressDetails?.city || '', // City
      admin_area_1: selectedAddressDetails?.state || '', // State/Province
      postal_code: selectedAddressDetails?.postcode || '',
      country_code: selectedAddressDetails?.country ? 
        selectedAddressDetails.country.substring(0, 2).toUpperCase() : 'PH', // Default to Philippines
    };

    // Remove empty fields from shipping address
    Object.keys(shippingAddress).forEach(key => {
      if (!shippingAddress[key]) {
        delete shippingAddress[key];
      }
    });

    // Validate that we have at least address_line_1
    if (!shippingAddress.address_line_1) {
      throw new Error('Please provide a shipping address.');
    }

    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              currency_code: 'PHP',
              value: computed.toFixed(2),
              breakdown,
            },
            items: itemList,
            shipping: {
              name: {
                full_name: formData.fullName || '',
              },
              address: shippingAddress,
            },
          },
        ],
      })
      .catch(error => {
        console.error('Error creating PayPal order:', error);
        throw new Error('Failed to create PayPal order. Please try again.');
      });
  };

  const onApprove = async (data, actions) => {
    try {
      const details = await actions.order.capture();
      
      // Store payment details but don't navigate yet
      setPaymentDetails({
        paymentId: data.orderID,
        paymentDetails: details,
      });
      setPaymentSuccessful(true);
      
      console.log('Payment approved! Please click "Place Order" to complete your order.');
      
    } catch (error) {
      console.error('Payment processing failed:', error);
      alert('There was an error processing your payment. Please try again.');
      setPaymentSuccessful(false);
      setPaymentDetails(null);
    }
  };

  if (orderCompleted) {
    return (
      <CheckoutContainer>
        <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <h2>Thank You for Your Order!</h2>
          <p>Your order has been placed successfully.</p>
          <p>Order Number: <strong>{orderId}</strong></p>
          <p>We've sent a confirmation email to {formData.email}.</p>
          <div style={{ marginTop: '2rem' }}>
            <button 
              onClick={() => navigate('/')}
              style={{
                background: '#8B4513',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem',
                margin: '0.5rem',
              }}
            >
              Back to Home
            </button>
            
          </div>
        </div>
      </CheckoutContainer>
    );
  }

  return (
    <CheckoutContainer>
      <h1>Checkout</h1>
      
      <form onSubmit={handleSubmit}>
        <CheckoutGrid>
          <div>
            <CheckoutSection>
              <SectionTitle>Delivery Form</SectionTitle>
              
              <Row>
                <FormGroup>
                  <label htmlFor="fullName">Full Name *</label>
                  <input 
                    type="text" 
                    id="fullNamee" 
                    name="fullName" 
                    value={formData.fullName}
                    onChange={handleChange}
                    required 
                  />
                </FormGroup>
              </Row>
              <FormGroup>
                <label htmlFor="email">Email Address *</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
              </FormGroup>
              
              <FormGroup>
                <label htmlFor="phone">Phone Number *</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  value={formData.phone}
                  onChange={handleChange}
                  required 
                />
              </FormGroup>
              
              <FormGroup>
                <label htmlFor="address">Street Address *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    onKeyDown={handleAddressKeyDown}
                    onFocus={() => {
                      if (formData.address.length >= 3) {
                        searchAddresses(formData.address);
                        setShowSuggestions(true);
                      }
                    }}
                    onBlur={() => {
                      // Delay hiding suggestions to allow for clicks
                      setTimeout(() => {
                        setShowSuggestions(false);
                      }, 200);
                    }}
                    required
                    placeholder="Start typing your address..."
                    autoComplete="off"
                  />

                  {addressLoading && (
                    <div style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '0.8rem',
                      color: '#666'
                    }}>
                      🔍 Searching...
                    </div>
                  )}

                  {showSuggestions && suggestions.length > 0 && (
                    <AddressSuggestions>
                      {console.log('🎨 Rendering suggestions:', suggestions.length, suggestions)}
                      {suggestions.map((suggestion, index) => (
                        <AddressSuggestion
                          key={suggestion.id}
                          isSelected={index === selectedAddressIndex}
                          onMouseDown={(e) => { e.preventDefault(); handleAddressSelect(suggestion); }}
                          onTouchStart={(e) => { e.preventDefault(); handleAddressSelect(suggestion); }}
                          onClick={() => handleAddressSelect(suggestion)}
                          onMouseEnter={() => setSelectedAddressIndex(index)}
                        >
                          <div style={{ fontWeight: '500' }}>
                            {suggestion.address}
                          </div>
                          {suggestion.details.city && (
                            <div style={{
                              fontSize: '0.85rem',
                              color: '#666',
                              marginTop: '2px'
                            }}>
                              {suggestion.details.city}, {suggestion.details.state} {suggestion.details.postcode}
                            </div>
                          )}
                        </AddressSuggestion>
                      ))}
                    </AddressSuggestions>
                  )}

                  {showSuggestions && suggestions.length === 0 && !addressLoading && formData.address.length >= 3 && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: '0',
                      right: '0',
                      background: 'white',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      padding: '0.75rem',
                      marginTop: '2px',
                      fontSize: '0.85rem',
                      color: '#666'
                    }}>
                      No addresses found for "{formData.address}"
                    </div>
                  )}
                </div>
              </FormGroup>
              <FormGroup>
                <label htmlFor="deliveryInstructions">Delivery Instructions (Optional)</label>
                <textarea 
                  id="deliveryInstructions" 
                  name="deliveryInstructions" 
                  rows="3"
                  value={formData.deliveryInstructions}
                  onChange={handleChange}
                  placeholder="Special instructions for delivery"
                ></textarea>
              </FormGroup>
            </CheckoutSection>
            
            <CheckoutSection style={{ marginTop: '2rem' }}>
              <SectionTitle>Payment Method</SectionTitle>
              
              <FormGroup>
                <div style={{ marginBottom: '1rem' }}>
                  <input 
                    type="radio" 
                    id="paypal" 
                    name="paymentMethod" 
                    value="paypal" 
                    checked={formData.paymentMethod === 'paypal'}
                    onChange={handleChange}
                  />
                  <label htmlFor="paypal" style={{ marginLeft: '0.5rem' }}>PayPal</label>
                </div>
                
                <div>
                  <input 
                    type="radio" 
                    id="creditCard" 
                    name="paymentMethod" 
                    value="creditCard" 
                    checked={formData.paymentMethod === 'creditCard'}
                    onChange={handleChange}
                    disabled
                  />
                  <label htmlFor="creditCard" style={{ marginLeft: '0.5rem', opacity: 0.6 }}>
                    Credit/Debit Card (Coming Soon)
                  </label>
                </div>
              </FormGroup>
              
              {formData.paymentMethod === 'paypal' && (
                <div style={{ marginTop: '1.5rem' }}>
                  {(items.length === 0 || derivedTotal <= 0) ? (
                    <div style={{
                      background: '#FFF3CD',
                      color: '#856404',
                      border: '1px solid #FFEEBA',
                      borderRadius: '6px',
                      padding: '1rem'
                    }}>
                      Add items to your cart to check out with PayPal.
                    </div>
                  ) : (
                    <div style={{ minHeight: '200px', position: 'relative' }}>
                      <PayPalButtonContainer>
                        {loadingStatus === 'resolved' ? (
                          <PayPalButtons
                            style={{
                              layout: 'vertical',
                              color: 'gold',
                              shape: 'rect',
                              label: 'checkout',
                              height: 40,
                              tagline: false
                            }}
                            createOrder={createPayPalOrder}
                            onApprove={onApprove}
                            onError={(err) => {
                              console.error('PayPal error:', err);
                              setPaymentSuccessful(false);
                              setPaymentDetails(null);
                              const message = (err && err.message) ? err.message : '';
                              if (message.toLowerCase().includes('empty') || message.toLowerCase().includes('zero')) {
                                alert('Your cart is empty or total is zero. Please add items to your cart before checking out.');
                              } else {
                                alert('There was an error processing your payment. Please try again or use a different payment method.');
                              }
                            }}
                            onCancel={(data) => {
                              console.log('Payment cancelled', data);
                              setPaymentSuccessful(false);
                              setPaymentDetails(null);
                            }}
                            onInit={(data, actions) => {
                              console.log('PayPal button ready', data);
                              if (items.length === 0 || derivedTotal <= 0) {
                                return actions.disable();
                              }
                              return actions.enable();
                            }}
                            forceReRender={[derivedTotal, items.length]}
                          />
                        ) : (
                          <PayPalFallback>
                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💳</div>
                              <h3>{loadingStatus === 'rejected' ? 'PayPal failed to load' : 'PayPal is loading...'}</h3>
                              <p>If this takes too long, please try:</p>
                              <ul style={{ textAlign: 'left', display: 'inline-block', marginTop: '1rem' }}>
                                <li>Refreshing the page</li>
                                <li>Using a different browser</li>
                                <li>Checking your internet connection</li>
                                <li>Disabling ad blockers or browser extensions</li>
                              </ul>
                              <div style={{ marginTop: '1.5rem' }}>
                                <button
                                  onClick={() => window.location.reload()}
                                  style={{
                                    background: '#0070ba',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    marginRight: '0.5rem'
                                  }}
                                >
                                  Refresh Page
                                </button>
                              </div>
                            </div>
                          </PayPalFallback>
                        )}
                      </PayPalButtonContainer>

                      {loading && (
                        <PayPalLoadingOverlay>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            color: '#0070ba'
                          }}>
                            <div style={{ fontSize: '2rem', marginBottom: '1rem', animation: 'spin 1s linear infinite' }}>⟳</div>
                            <div>Processing payment...</div>
                          </div>
                        </PayPalLoadingOverlay>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CheckoutSection>
          </div>
          
          <div>
            <OrderSummary>
              <SectionTitle>Order Summary</SectionTitle>
              {items.map((item) => (
                <OrderItem key={item.id}>
                  <div>
                    {item.name} × {item.quantity}
                  </div>
                  <div>{formatCurrency(item.price * item.quantity)}</div>
                </OrderItem>
              ))}
              
              <OrderItem>
                <div>Subtotal</div>
                <div>{formatCurrency(derivedSubtotal)}</div>
              </OrderItem>
              
              {discountPercent > 0 && (
                <OrderItem>
                  <div>Discount ({discountPercent}%)</div>
                  <div style={{ color: 'green' }}>-{formatCurrency(derivedDiscountAmount)}</div>
                </OrderItem>
              )}
              
              <OrderItem>
                <div>Shipping</div>
                <div>{derivedShippingCost <= 0 ? 'Free' : formatCurrency(derivedShippingCost)}</div>
              </OrderItem>
              
              <TotalRow>
                <div>Total</div>
                <div>{formatCurrency(derivedTotal)}</div>
              </TotalRow>
              
              {formData.paymentMethod === 'paypal' && paymentSuccessful && (
                <div style={{
                  background: '#d4edda',
                  color: '#155724',
                  border: '1px solid #c3e6cb',
                  borderRadius: '6px',
                  padding: '1rem',
                  marginTop: '1.5rem',
                  textAlign: 'center',
                  fontWeight: '500'
                }}>
                  ✓ Payment successful! Click "Place Order" below to complete your order.
                </div>
              )}
              
              <PayButton 
                type="submit"
                onClick={handlePlaceOrder}
                disabled={
                  items.length === 0 || 
                  (formData.paymentMethod === 'paypal' && !paymentSuccessful)
                }
                style={{
                  marginTop: formData.paymentMethod === 'paypal' && paymentSuccessful ? '1rem' : '1.5rem'
                }}
              >
                Place Order
              </PayButton>
              
              {formData.paymentMethod === 'paypal' && !paymentSuccessful && (
                <p style={{ 
                  textAlign: 'center', 
                  marginTop: '0.5rem', 
                  fontSize: '0.85rem', 
                  color: '#666',
                  fontStyle: 'italic'
                }}>
                  Please complete your PayPal payment above to enable this button.
                </p>
              )}
              
              <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: '#666' }}>
                Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our privacy policy.
              </p>
            </OrderSummary>
          </div>
        </CheckoutGrid>
      </form>
    </CheckoutContainer>
  );
};

export default Checkout;
