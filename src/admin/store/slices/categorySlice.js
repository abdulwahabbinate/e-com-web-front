import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { categoryService } from '../../services/categoryService'

const getErrorPayload = (error, fallbackMessage) => {
  return (
    error?.response || {
      message: error?.message || fallbackMessage,
    }
  )
}

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, thunkAPI) => {
    try {
      const response = await categoryService.getCategories()
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorPayload(error, 'Failed to fetch categories')
      )
    }
  }
)

export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (payload, thunkAPI) => {
    try {
      return await categoryService.createCategory(payload)
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorPayload(error, 'Failed to create category')
      )
    }
  }
)

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, payload }, thunkAPI) => {
    try {
      return await categoryService.updateCategory(id, payload)
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorPayload(error, 'Failed to update category')
      )
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
      return thunkAPI.rejectWithValue(
        getErrorPayload(error, 'Failed to delete category')
      )
    }
  }
)

export const toggleCategoryStatus = createAsyncThunk(
  'categories/toggleCategoryStatus',
  async ({ id, payload }, thunkAPI) => {
    try {
      return await categoryService.updateCategory(id, payload)
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorPayload(error, 'Failed to update category status')
      )
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
  reducers: {
    clearCategoryError: (state) => {
      state.error = null
    },
  },
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

      .addCase(createCategory.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false
        const item = action.payload?.data
        if (item) state.list.unshift(item)
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      .addCase(updateCategory.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false
        const updated = action.payload?.data
        const index = state.list.findIndex((item) => item._id === updated?._id)
        if (index !== -1) state.list[index] = updated
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
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

export const { clearCategoryError } = categorySlice.actions
export default categorySlice.reducer