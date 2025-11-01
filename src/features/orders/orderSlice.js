import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { clearCart } from '../cart/cartSlice';

// Mock function to simulate API call
const createOrderAPI = async (orderData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...orderData,
        id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        status: 'processing',
        orderDate: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }, 1000);
  });
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData, { dispatch, getState }) => {
    try {
      const response = await createOrderAPI(orderData);
      // Clear the cart after successful order
      dispatch(clearCart());
      return response;
    } catch (error) {
      throw new Error('Failed to create order');
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    currentOrder: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    orderHistory: [],
  },
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    setOrderStatus: (state, action) => {
      if (state.currentOrder) {
        state.currentOrder.status = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentOrder = action.payload;
        state.orderHistory.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { clearCurrentOrder, setOrderStatus } = orderSlice.actions;

export const selectCurrentOrder = (state) => state.order.currentOrder;
export const selectOrderStatus = (state) => state.order.status;
export const selectOrderError = (state) => state.order.error;
export const selectOrderHistory = (state) => state.order.orderHistory;

export default orderSlice.reducer;
