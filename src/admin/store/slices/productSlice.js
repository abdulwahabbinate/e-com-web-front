import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { productService } from '../../services/productService'

const getErrorPayload = (error, fallbackMessage) => {
  return (
    error?.response || {
      message: error?.message || fallbackMessage,
    }
  )
}

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, thunkAPI) => {
    try {
      return await productService.getProducts()
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorPayload(error, 'Failed to fetch products')
      )
    }
  }
)

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (payload, thunkAPI) => {
    try {
      return await productService.createProduct(payload)
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorPayload(error, 'Failed to create product')
      )
    }
  }
)

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, payload }, thunkAPI) => {
    try {
      return await productService.updateProduct(id, payload)
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorPayload(error, 'Failed to update product')
      )
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
      return thunkAPI.rejectWithValue(
        getErrorPayload(error, 'Failed to delete product')
      )
    }
  }
)

export const toggleProductStatus = createAsyncThunk(
  'products/toggleProductStatus',
  async ({ id, payload }, thunkAPI) => {
    try {
      return await productService.updateProduct(id, payload)
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorPayload(error, 'Failed to update product status')
      )
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
  reducers: {
    clearProductError: (state) => {
      state.error = null
    },
  },
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

      .addCase(createProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false
        const item = action.payload?.data
        if (item) state.list.unshift(item)
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      .addCase(updateProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false
        const updated = action.payload?.data
        const index = state.list.findIndex((item) => item._id === updated?._id)
        if (index !== -1) state.list[index] = updated
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
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

export const { clearProductError } = productSlice.actions
export default productSlice.reducer