import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaCheckCircle, FaTruck, FaBoxOpen, FaHome } from 'react-icons/fa';

const OrderTrackingContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 5%;
`;

const OrderHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  
  h1 {
    color: #8B4513;
    margin-bottom: 1rem;
  }
  
  p {
    color: #666;
    font-size: 1.1rem;
  }
`;

const OrderCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const OrderInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  div {
    h3 {
      color: #8B4513;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    p {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 500;
    }
  }
`;

const StatusTimeline = styled.div`
  position: relative;
  padding: 1rem 0 2rem;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 30px;
    height: 100%;
    width: 2px;
    background: #E0D6C9;
    z-index: 1;
  }
`;

const StatusItem = styled.div`
  position: relative;
  padding-left: 70px;
  margin-bottom: 2rem;
  z-index: 2;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &::before {
    content: '';
    position: absolute;
    left: 24px;
    top: 0;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: ${props => props.active ? '#8B4513' : '#E0D6C9'};
    z-index: 3;
  }
  
  h3 {
    margin: 0 0 0.5rem 0;
    color: ${props => props.active ? '#333' : '#999'};
    font-size: 1.1rem;
  }
  
  p {
    margin: 0;
    color: ${props => props.active ? '#666' : '#999'};
    font-size: 0.95rem;
  }
  
  svg {
    position: absolute;
    left: 20px;
    top: -2px;
    font-size: 1.5rem;
    color: ${props => props.active ? '#8B4513' : '#E0D6C9'};
  }
`;

const OrderItems = styled.div`
  margin-top: 3rem;
  
  h2 {
    color: #8B4513;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
  }
`;

const OrderItem = styled.div`
  display: flex;
  padding: 1rem 0;
  border-bottom: 1px solid #EEE;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ItemImage = styled.div`
  width: 80px;
  height: 80px;
  background: #F5F5F5;
  border-radius: 4px;
  margin-right: 1.5rem;
  background-image: ${props => props.image ? `url(${props.image})` : 'none'};
  background-size: cover;
  background-position: center;
`;

const ItemDetails = styled.div`
  flex: 1;
  
  h3 {
    margin: 0 0 0.5rem 0;
    color: #333;
    font-size: 1.1rem;
  }
  
  p {
    margin: 0;
    color: #666;
  }
`;

const ItemPrice = styled.div`
  font-weight: bold;
  color: #8B4513;
  text-align: right;
  
  .quantity {
    display: block;
    font-size: 0.9rem;
    color: #999;
    font-weight: normal;
  }
`;

const BackToHome = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #8B4513;
  text-decoration: none;
  margin-top: 2rem;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

// Helper function to format currency values
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

// Get order data from localStorage (in a real app, this would come from an API)
const getOrderFromStorage = (orderId) => {
  try {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const order = orders.find(o => o.id === orderId);
    return order || null;
  } catch (error) {
    console.error('Error retrieving order from storage:', error);
    return null;
  }
};

const OrderTracking = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch order from localStorage (in a real app, this would come from an API)
    const fetchOrder = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        const orderData = getOrderFromStorage(orderId);
        
        if (orderData) {
          setOrder(orderData);
        } else {
          console.warn('Order not found:', orderId);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [orderId]);
  
  if (loading) {
    return (
      <OrderTrackingContainer>
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <h2>Loading order details...</h2>
        </div>
      </OrderTrackingContainer>
    );
  }
  
  if (!order) {
    return (
      <OrderTrackingContainer>
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <h2>Order not found</h2>
          <p>We couldn't find an order with ID: {orderId}</p>
          <BackToHome to="/">
            <FaHome /> Back to Home
          </BackToHome>
        </div>
      </OrderTrackingContainer>
    );
  }
  
  const getStatusSteps = () => {
    const statuses = [
      { 
        id: 'processing', 
        title: 'Order Placed', 
        description: 'Your order has been received',
        icon: <FaCheckCircle />
      },
      { 
        id: 'shipped', 
        title: 'Shipped', 
        description: 'Your order is on the way',
        icon: <FaTruck />
      },
      { 
        id: 'delivered', 
        title: 'Delivered', 
        description: 'Your order has been delivered',
        icon: <FaBoxOpen />
      }
    ];
    
    const currentStatusIndex = statuses.findIndex(s => s.id === order.status);
    
    return statuses.map((status, index) => ({
      ...status,
      active: index <= currentStatusIndex
    }));
  };
  
  const statusSteps = getStatusSteps();
  const deliveryDate = new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <OrderTrackingContainer>
      <OrderHeader>
        <h1>Order #{order.id}</h1>
        <p>Placed on {new Date(order.orderDate).toLocaleDateString()}</p>
      </OrderHeader>
      
      <OrderCard>
        <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#8B4513' }}>Order Status</h2>
        
        <StatusTimeline>
          {statusSteps.map((step) => (
            <StatusItem key={step.id} active={step.active}>
              {step.icon}
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </StatusItem>
          ))}
        </StatusTimeline>
        
        <OrderInfo>
          <div>
            <h3>Estimated Delivery</h3>
            <p>{deliveryDate}</p>
          </div>
          
          <div>
            <h3>Shipping To</h3>
            <p><strong>{order.shippingAddress?.name || order.fullName || 'N/A'}</strong></p>
            <p>{order.shippingAddress?.street || order.address || 'N/A'}</p>
            {order.shippingAddress?.addressLine2 && (
              <p style={{ fontStyle: 'italic', color: '#666' }}>{order.shippingAddress.addressLine2}</p>
            )}
            {order.shippingAddress?.city && order.shippingAddress?.state ? (
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode || ''}</p>
            ) : (
              order.shippingAddress?.city && <p>{order.shippingAddress.city}</p>
            )}
            <p>{order.shippingAddress?.country || 'Philippines'}</p>
            {order.shippingAddress?.email && (
              <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                📧 {order.shippingAddress.email}
              </p>
            )}
            {order.shippingAddress?.phone && (
              <p style={{ fontSize: '0.9rem', color: '#666' }}>
                📞 {order.shippingAddress.phone}
              </p>
            )}
          </div>
          
          <div>
            <h3>Tracking Number</h3>
            {order.trackingNumber ? (
              <>
                <p>{order.trackingNumber}</p>
                {order.carrier && <p><small>Carrier: {order.carrier}</small></p>}
              </>
            ) : (
              <p style={{ color: '#666', fontStyle: 'italic' }}>Tracking number will be assigned when order is shipped</p>
            )}
          </div>
        </OrderInfo>
      </OrderCard>
      
      <OrderCard>
        <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#8B4513' }}>Order Summary</h2>
        
        <OrderItems>
          {order.items.map((item) => (
            <OrderItem key={item.id}>
              <ItemImage image={item.image} />
              <ItemDetails>
                <h3>{item.name}</h3>
                <p>Quantity: {item.quantity}</p>
              </ItemDetails>
              <ItemPrice>
                {formatCurrency(item.price * item.quantity)}
                <span className="quantity">{formatCurrency(item.price)} each</span>
              </ItemPrice>
            </OrderItem>
          ))}
          
          <div style={{ marginTop: '2rem', borderTop: '1px solid #EEE', paddingTop: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            
            {order.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'green' }}>
                <span>Discount</span>
                <span>-{formatCurrency(order.discount)}</span>
              </div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Shipping</span>
              <span>{order.shipping === 0 ? 'Free' : formatCurrency(order.shipping)}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #EEE', fontWeight: 'bold', fontSize: '1.1rem' }}>
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
            
            <div style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#666' }}>
              <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
            </div>
          </div>
        </OrderItems>
      </OrderCard>
      
      <BackToHome to="/">
        <FaHome /> Back to Home
      </BackToHome>
    </OrderTrackingContainer>
  );
};

export default OrderTracking;
