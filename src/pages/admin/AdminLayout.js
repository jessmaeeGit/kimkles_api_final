import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import styled from 'styled-components';
import { FaSignOutAlt, FaTachometerAlt, FaBox, FaShoppingBag, FaUsers, FaCreditCard, FaTags, FaBars, FaTimes } from 'react-icons/fa';

const AdminContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
`;

const Sidebar = styled.div`
  width: 280px;
  background: #1e293b;
  color: #f8fafc;
  padding: 1.5rem 0;
  position: fixed;
  height: 100%;
  transition: all 0.3s ease-in-out;
  z-index: 1000;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
  
  @media (max-width: 1024px) {
    transform: ${({ isOpen }) => (isOpen ? 'translateX(0)' : 'translateX(-100%)')};
    width: 300px;
  }
`;

const SidebarHeader = styled.div`
  padding: 0 1.5rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 1.5rem;
  
  h2 {
    color: #fff;
    font-size: 1.25rem;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  span {
    color: #f39c12;
  }
`;

const MenuItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0.875rem 1.75rem;
  color: #cbd5e1;
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: 0.9375rem;
  font-weight: 500;
  margin: 0.25rem 1rem;
  border-radius: 8px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #ffffff;
    transform: translateX(4px);
  }
  
  &.active {
    background: rgba(99, 102, 241, 0.15);
    color: #6366f1;
    font-weight: 600;
  }
  
  svg {
    margin-right: 0.875rem;
    font-size: 1.125rem;
    width: 1.25em;
    flex-shrink: 0;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  color: #ecf0f1;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.95rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #e74c3c;
  }
  
  svg {
    margin-right: 0.75rem;
    font-size: 1.1rem;
  }
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 280px;
  padding: 2rem 2.5rem;
  transition: all 0.3s ease;
  min-height: 100vh;
  background-color: #f8fafc;
  
  @media (max-width: 1024px) {
    margin-left: 0;
    padding: 1.5rem;
    width: 100%;
  }
  
  @media (max-width: 640px) {
    padding: 1.25rem;
  }
`;

const TopBar = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ToggleSidebar = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #2c3e50;
  cursor: pointer;
  display: none;
  
  @media (max-width: 992px) {
    display: block;
  }
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  span {
    font-weight: 500;
    color: #2c3e50;
  }
  
  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  
  // Get admin user from auth state
  const adminUser = {
    name: 'Admin User',
    email: 'admin@kimkles.com',
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=8B4513&color=fff'
  };
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <AdminContainer>
      <Sidebar isOpen={isSidebarOpen}>
        <SidebarHeader>
          <h2>Kimkles <span>Admin</span></h2>
        </SidebarHeader>
        
        <nav>
          <MenuItem to="/admin" className={isActive('/admin') || location.pathname === '/admin'}>
            <FaTachometerAlt /> Dashboard
          </MenuItem>
          
          <MenuItem to="/admin/products" className={location.pathname.startsWith('/admin/products') ? 'active' : ''}>
            <FaBox /> Products
          </MenuItem>
          
          <MenuItem to="/admin/orders" className={location.pathname.startsWith('/admin/orders') ? 'active' : ''}>
            <FaShoppingBag /> Orders
          </MenuItem>
          
          <MenuItem to="/admin/users" className={location.pathname.startsWith('/admin/users') ? 'active' : ''}>
            <FaUsers /> Users
          </MenuItem>
          
          <MenuItem to="/admin/payments" className={location.pathname.startsWith('/admin/payments') ? 'active' : ''}>
            <FaCreditCard /> Payments
          </MenuItem>
          
          <MenuItem to="/admin/promotions" className={location.pathname.startsWith('/admin/promotions') ? 'active' : ''}>
            <FaTags /> Promotions
          </MenuItem>
          
          <LogoutButton onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </LogoutButton>
        </nav>
      </Sidebar>
      
      <MainContent>
        <TopBar>
          <ToggleSidebar onClick={toggleSidebar}>
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </ToggleSidebar>
          
          <UserMenu>
            <span>{adminUser.name}</span>
            <img src={adminUser.avatar} alt={adminUser.name} />
          </UserMenu>
        </TopBar>
        
        <div className="content">
          <Outlet />
        </div>
      </MainContent>
    </AdminContainer>
  );
};

export default AdminLayout;
