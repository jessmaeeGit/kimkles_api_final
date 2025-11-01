import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock data - in a real app, this would come from an API
const initialProducts = [
  {
    id: '1',
    name: 'Biscoff Lava',
    description: 'Delicious biscoff cookie with creamy lava center',
    price: 45.99,
    category: 'cookies',
    image: '/images/Biscoff Lava.png',
    inStock: true,
  },
  {
    id: '2',
    name: 'Kimkles Creamcheese',
    description: 'Perfectly baked Kimkles with smooth cream cheese frosting',
    price: 25.99,
    category: 'cookies',
    image: '/images/Kimkles Creamcheese.png',
    inStock: true,
  },
  {
    id: '3',
    name: 'Red Velvet Creamcheese',
    description: 'Moist red velvet Kimkles with cream cheese frosting',
    price: 45.49,
    category: 'cookies',
    image: '/images/Redvelvet Creamcheese.png',
    inStock: true,
  },
  {
    id: '4',
    name: 'Plain Kimkles',
    description: 'Classic Kimkles cookie, simple and delicious',
    price: 12.99,
    category: 'cookies',
    image: '/images/Plain Kimkles.png',
    inStock: true,
  },
];

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // const response = await api.get('/api/products');
      // return response.data;
      
      // Simulate API call with timeout
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(initialProducts);
        }, 500);
      });
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    categories: ['all', 'cookies', 'brownies', 'cupcakes'],
    selectedCategory: 'all',
  },
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setSelectedCategory } = productsSlice.actions;

export const selectAllProducts = (state) => {
  const { items, selectedCategory } = state.products;
  if (selectedCategory === 'all') return items;
  return items.filter(product => product.category === selectedCategory);
};

export const selectProductById = (state, productId) =>
  state.products.items.find(product => product.id === productId);

export const selectProductsStatus = (state) => state.products.status;
export const selectProductsError = (state) => state.products.error;
export const selectCategories = (state) => state.products.categories;
export const selectSelectedCategory = (state) => state.products.selectedCategory;

export default productsSlice.reducer;
