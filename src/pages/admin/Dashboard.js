import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FaDollarSign, 
  FaShoppingCart, 
  FaUsers, 
  FaBoxOpen, 
  FaChartLine, 
  FaClock, 
  FaTags,
  FaArrowUp,
  FaArrowDown,
  FaEllipsisV
} from 'react-icons/fa';
import { format, subDays, subMonths } from 'date-fns';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const DashboardContainer = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.03), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  border: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03);
  }
  
  .icon {
    width: 56px;
    height: 56px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1.25rem;
    font-size: 1.5rem;
    color: white;
    background: ${props => {
      switch(props.variant) {
        case 'primary':
          return 'linear-gradient(135deg, #8B5E3C, #A67C52)';
        case 'success':
          return 'linear-gradient(135deg, #10b981, #34d399)';
        case 'info':
          return 'linear-gradient(135deg, #3b82f6, #60a5fa)';
        case 'warning':
          return 'linear-gradient(135deg, #f59e0b, #fbbf24)';
        default:
          return '#8B5E3C';
      }
    }};
  }
  
  .info {
    h3 {
      margin: 0;
      font-size: 1.75rem;
      font-weight: 700;
      color: #1e293b;
      line-height: 1.2;
    }
    
    p {
      margin: 0.25rem 0 0;
      color: #64748b;
      font-size: 0.9375rem;
      font-weight: 500;
    }
  }
`;

const ChartsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const ChartCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.03), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  border: 1px solid #f1f5f9;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03);
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    
    h3 {
      margin: 0;
      color: #1e293b;
      font-size: 1.25rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      
      svg {
        margin-right: 0.75rem;
        color: #8B5E3C;
      }
    }
    
    .period-selector {
      padding: 0.375rem 0.75rem;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
      background: white;
      color: #475569;
      font-size: 0.875rem;
      cursor: pointer;
      
      &:focus {
        outline: none;
        border-color: #8B5E3C;
      }
    }
  }
  
  .chart-placeholder {
    background: #f8f9fa;
    border-radius: 4px;
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #95a5a6;
    font-size: 0.9rem;
  }
`;

const RecentActivity = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  
  h3 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    color: #2c3e50;
    font-size: 1.25rem;
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 0.5rem;
      color: #8B4513;
    }
  }
`;

const ActivityList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ActivityItem = styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid #ecf0f1;
  display: flex;
  align-items: flex-start;
  
  &:last-child {
    border-bottom: none;
  }
  
  .activity-icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #f8f9fa;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1rem;
    color: #8B4513;
    flex-shrink: 0;
  }
  
  .activity-details {
    flex: 1;
    
    p {
      margin: 0 0 0.25rem;
      color: #2c3e50;
    }
    
    .time {
      font-size: 0.8rem;
      color: #95a5a6;
      display: flex;
      align-items: center;
      
      svg {
        margin-right: 0.25rem;
        font-size: 0.7rem;
      }
    }
  }
`;

// Mock data - in a real app, this would come from an API
const stats = [
  { 
    title: 'Total Revenue', 
    value: '$12,845', 
    change: '+12.5%', 
    icon: <FaDollarSign />, 
    variant: 'primary' 
  },
  { 
    title: 'Total Orders', 
    value: '1,284', 
    change: '+8.2%', 
    icon: <FaShoppingCart />, 
    variant: 'success' 
  },
  { 
    title: 'Total Customers', 
    value: '856', 
    change: '+5.7%', 
    icon: <FaUsers />, 
    variant: 'info' 
  },
  { 
    title: 'Products', 
    value: '42', 
    change: '+3.2%', 
    icon: <FaBoxOpen />, 
    variant: 'warning' 
  }
];

const recentActivities = [
  {
    id: 1,
    type: 'order',
    message: 'New order #ORD-1001 from John Doe',
    time: '2 minutes ago',
    icon: <FaShoppingCart />
  },
  {
    id: 2,
    type: 'product',
    message: 'Product "Chocolate Brownie" was updated',
    time: '15 minutes ago',
    icon: <FaBoxOpen />
  },
  {
    id: 3,
    type: 'user',
    message: 'New customer registered: jane.doe@example.com',
    time: '1 hour ago',
    icon: <FaUsers />
  },
  {
    id: 4,
    type: 'payment',
    message: 'Payment of $45.99 for order #ORD-1000 was processed',
    time: '3 hours ago',
    icon: <FaDollarSign />
  },
  {
    id: 5,
    type: 'promo',
    message: 'New promo code "SUMMER20" created',
    time: '5 hours ago',
    icon: <FaTags />
  }
];

const Dashboard = () => {
  return (
    <DashboardContainer>
      <h1>Dashboard</h1>
      
      <StatsGrid>
        {stats.map((stat, index) => (
          <StatCard key={index} variant={stat.variant}>
            <div className="icon">
              {stat.icon}
            </div>
            <div className="info">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
              <small style={{ color: stat.change.startsWith('+') ? '#27ae60' : '#e74c3c' }}>
                {stat.change} from last month
              </small>
            </div>
          </StatCard>
        ))}
      </StatsGrid>
      
      <ChartsContainer>
        <ChartCard>
          <h3><FaChartLine /> Sales Overview</h3>
          <div className="chart-placeholder">
            [Sales chart will be displayed here]
          </div>
        </ChartCard>
        
        <ChartCard>
          <h3><FaChartLine /> Revenue by Category</h3>
          <div className="chart-placeholder">
            [Pie chart will be displayed here]
          </div>
        </ChartCard>
      </ChartsContainer>
      
      <RecentActivity>
        <h3><FaClock /> Recent Activity</h3>
        <ActivityList>
          {recentActivities.map(activity => (
            <ActivityItem key={activity.id}>
              <div className="activity-icon">
                {activity.icon}
              </div>
              <div className="activity-details">
                <p>{activity.message}</p>
                <span className="time">
                  <FaClock /> {activity.time}
                </span>
              </div>
            </ActivityItem>
          ))}
        </ActivityList>
      </RecentActivity>
    </DashboardContainer>
  );
};

export default Dashboard;
