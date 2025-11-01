import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../features/auth/authSlice';
import styled from 'styled-components';
import { FaUtensils } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
  padding: 2rem;
`;

const LoginBox = styled.div`
  background: white;
  border-radius: 12px;
  padding: 3rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  color: #8B4513;
  font-size: 2rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
  font-size: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #333;
  font-weight: 500;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
  
  &:focus {
    outline: none;
    border-color: #8B4513;
  }
`;

const Button = styled.button`
  padding: 0.75rem;
  background: #8B4513;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
  
  &:hover {
    background: #A0522D;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  font-size: 0.9rem;
  text-align: center;
  padding: 0.5rem;
  background: #ffe6e6;
  border-radius: 4px;
`;

const LinkText = styled.div`
  text-align: center;
  margin-top: 1rem;
  color: #666;
  font-size: 0.9rem;
  
  a {
    color: #8B4513;
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // If already authenticated, redirect based on role
  React.useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Simple validation
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    // Check if it's admin login
    const adminAccounts = JSON.parse(localStorage.getItem('adminAccounts') || '[]');
    const adminAccount = adminAccounts.find(a => a.email === email && a.password === password);
    
    if (adminAccount) {
      // Admin login
      const adminUser = {
        email: adminAccount.email,
        name: adminAccount.name,
        role: 'admin',
        id: adminAccount.id || 'admin-1'
      };
      dispatch(login(adminUser));
      navigate('/admin');
      return;
    }

    // Check if it's customer login
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Customer login
      const customerUser = {
        email: user.email,
        name: user.name,
        role: 'customer',
        id: user.id
      };
      dispatch(login(customerUser));
      navigate('/');
      return;
    }

    // Invalid credentials
    setError('Invalid email or password');
  };

  return (
    <LoginContainer>
      <LoginBox>
        <Logo>
          <FaUtensils /> Kimkles Cravings
        </Logo>
        <Title>Welcome Back</Title>
        <Form onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <InputGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </InputGroup>
          <Button type="submit">Login</Button>
          <LinkText>
            Don't have an account? <Link to="/register">Register here</Link>
          </LinkText>
        </Form>
      </LoginBox>
    </LoginContainer>
  );
};

export default Login;

