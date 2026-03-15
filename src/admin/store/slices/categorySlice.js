import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { categoryService } from '../../services/categoryService'

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, thunkAPI) => {
    try {
      const response = await categoryService.getCategories()
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to fetch categories')
    }
  }
)

export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (payload, thunkAPI) => {
    try {
      return await categoryService.createCategory(payload)
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to create category')
    }
  }
)

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, payload }, thunkAPI) => {
    try {
      return await categoryService.updateCategory(id, payload)
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to update category')
    }
  }
)

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id, thunkAPI) => {
    try {
      await categoryService.deleteCategory(id)
      return id
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to delete category')
    }
  }
)

export const toggleCategoryStatus = createAsyncThunk(
  'categories/toggleCategoryStatus',
  async ({ id, payload }, thunkAPI) => {
    try {
      return await categoryService.updateCategory(id, payload)
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to update category status')
    }
  }
)

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload?.data || []
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        const item = action.payload?.data
        if (item) state.list.unshift(item)
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const updated = action.payload?.data
        const index = state.list.findIndex((item) => item._id === updated?._id)
        if (index !== -1) state.list[index] = updated
      })
      .addCase(toggleCategoryStatus.fulfilled, (state, action) => {
        const updated = action.payload?.data
        const index = state.list.findIndex((item) => item._id === updated?._id)
        if (index !== -1) state.list[index] = updated
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.list = state.list.filter((item) => item._id !== action.payload)
      })
  },
})

export default categorySlice.reducer
