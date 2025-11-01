import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
  appliedPromo: null,
  discount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);
      
      if (existingItem) {
        existingItem.quantity += newItem.quantity || 1;
      } else {
        state.items.push({
          ...newItem,
          quantity: newItem.quantity || 1
        });
      }
      
      state.totalQuantity += newItem.quantity || 1;
      state.totalAmount += (newItem.price * (newItem.quantity || 1));
    },
    
    removeItem: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      
      if (existingItem) {
        state.totalQuantity--;
        state.totalAmount -= existingItem.price;
        
        if (existingItem.quantity === 1) {
          state.items = state.items.filter(item => item.id !== id);
        } else {
          existingItem.quantity--;
        }
      }
    },
    
    deleteItem: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      
      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.totalAmount -= existingItem.price * existingItem.quantity;
        state.items = state.items.filter(item => item.id !== id);
      }
    },
    
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      state.appliedPromo = null;
      state.discount = 0;
    },
    
    applyPromoCode: (state, action) => {
      // This is a simplified example. In a real app, you would validate the promo code with a server
      const { code, discountPercentage } = action.payload;
      state.appliedPromo = code;
      state.discount = discountPercentage;
      state.totalAmount = state.totalAmount * (1 - discountPercentage / 100);
    },
  },
});

export const { 
  addItem, 
  removeItem, 
  deleteItem, 
  clearCart, 
  applyPromoCode 
} = cartSlice.actions;

export default cartSlice.reducer;
