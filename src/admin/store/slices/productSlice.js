import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { productService } from '../../services/productService'

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, thunkAPI) => {
    try {
      const response = await productService.getProducts()
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to fetch products')
    }
  }
)

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (payload, thunkAPI) => {
    try {
      return await productService.createProduct(payload)
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to create product')
    }
  }
)

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, payload }, thunkAPI) => {
    try {
      return await productService.updateProduct(id, payload)
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to update product')
    }
  }
)

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, thunkAPI) => {
    try {
      await productService.deleteProduct(id)
      return id
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to delete product')
    }
  }
)

export const toggleProductStatus = createAsyncThunk(
  'products/toggleProductStatus',
  async ({ id, payload }, thunkAPI) => {
    try {
      return await productService.updateProduct(id, payload)
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to update product status')
    }
  }
)

const productSlice = createSlice({
  name: 'products',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload?.data || []
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        const item = action.payload?.data
        if (item) state.list.unshift(item)
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const updated = action.payload?.data
        const index = state.list.findIndex((item) => item._id === updated?._id)
        if (index !== -1) state.list[index] = updated
      })
      .addCase(toggleProductStatus.fulfilled, (state, action) => {
        const updated = action.payload?.data
        const index = state.list.findIndex((item) => item._id === updated?._id)
        if (index !== -1) state.list[index] = updated
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.list = state.list.filter((item) => item._id !== action.payload)
      })
  },
})

export default productSlice.reducer
