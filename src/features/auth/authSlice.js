import { createSlice } from '@reduxjs/toolkit';

// Initialize default admin account
const initializeAdminAccount = () => {
  const adminEmail = 'admin@kimkles.com';
  const adminPassword = 'admin123';
  
  const existingAdmins = JSON.parse(localStorage.getItem('adminAccounts') || '[]');
  const adminExists = existingAdmins.find(a => a.email === adminEmail);
  
  if (!adminExists) {
    const adminAccount = {
      email: adminEmail,
      password: adminPassword,
      name: 'Admin User',
      role: 'admin',
      createdAt: new Date().toISOString()
    };
    existingAdmins.push(adminAccount);
    localStorage.setItem('adminAccounts', JSON.stringify(existingAdmins));
  }
};

// Initialize default admin on module load
initializeAdminAccount();

const initialState = {
  isAuthenticated: false,
  user: null,
  registerError: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      // Store in localStorage to persist across refreshes
      localStorage.setItem('auth', JSON.stringify({ isAuthenticated: true, user: action.payload }));
    },
    register: (state, action) => {
      const { email, password, name } = action.payload;
      
      // Get existing users
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if user already exists
      const userExists = existingUsers.find(u => u.email === email);
      if (userExists) {
        throw new Error('User already exists with this email');
      }
      
      // Create new user
      const newUser = {
        id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        email: email,
        password: password, // In a real app, this would be hashed
        name: name || email.split('@')[0],
        role: 'customer',
        createdAt: new Date().toISOString()
      };
      
      // Add to users list
      existingUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(existingUsers));
      
      // Auto login after registration
      state.isAuthenticated = true;
      state.user = {
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        id: newUser.id
      };
      
      localStorage.setItem('auth', JSON.stringify({ 
        isAuthenticated: true, 
        user: state.user 
      }));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('auth');
    },
    initializeAuth: (state) => {
      // Load from localStorage on app initialization
      const storedAuth = localStorage.getItem('auth');
      if (storedAuth) {
        const parsed = JSON.parse(storedAuth);
        state.isAuthenticated = parsed.isAuthenticated;
        state.user = parsed.user;
      }
    },
  },
});

export const { login, register, logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer;

