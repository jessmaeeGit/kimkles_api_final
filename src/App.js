import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import styled from 'styled-components';
import { store } from './app/store';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderTracking from './pages/OrderTracking';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Orders from './pages/admin/Orders';
import Users from './pages/admin/Users';
import { initializeAuth } from './features/auth/authSlice';
import './App.css';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem 5%;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const paypalOptions = {
  'client-id': process.env.REACT_APP_PAYPAL_CLIENT_ID,
  currency: 'PHP',
  intent: 'capture',
  components: 'buttons'
};

// Protected Route Component - redirects to login if not authenticated
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Public Route Component - redirects based on role if already authenticated
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  if (!isAuthenticated) {
    return children;
  }
  // Redirect based on role
  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }
  return <Navigate to="/" replace />;
};

// Layout Component for protected routes
const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <MainContent>
        {children}
      </MainContent>
      <Footer />
    </>
  );
};

// App Content Component (needs access to Redux)
const AppContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize auth state from localStorage on app load
    dispatch(initializeAuth());
  }, [dispatch]);

  return (
    <Router>
      <AppContainer>
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route
            path="/"
            element={
              <Layout>
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/menu"
            element={
              <Layout>
                <ProtectedRoute>
                  <Menu />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/cart"
            element={
              <Layout>
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/checkout"
            element={
              <Layout>
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/track-order/:orderId"
            element={
              <Layout>
                <ProtectedRoute>
                  <OrderTracking />
                </ProtectedRoute>
              </Layout>
            }
          />
          
          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="users" element={<Users />} />
          </Route>
          
          {/* Redirect any unknown routes to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AppContainer>
    </Router>
  );
};

function App() {
  return (
    <Provider store={store}>
      <PayPalScriptProvider options={paypalOptions}>
        <AppContent />
      </PayPalScriptProvider>
    </Provider>
  );
}

export default App;
