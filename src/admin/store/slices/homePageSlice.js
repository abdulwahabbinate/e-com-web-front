import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { homePageService } from '../../services/homePageService'

const getErrorPayload = (error, fallbackMessage) => {
  return (
    error?.response || {
      message: error?.message || fallbackMessage,
    }
  )
}

export const fetchHomePage = createAsyncThunk(
  'homePage/fetchHomePage',
  async (_, thunkAPI) => {
    try {
      return await homePageService.getAdminHomePage('home')
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorPayload(error, 'Failed to fetch home page content'),
      )
    }
  },
)

export const createHomePage = createAsyncThunk(
  'homePage/createHomePage',
  async (payload, thunkAPI) => {
    try {
      return await homePageService.createHomePage(payload)
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorPayload(error, 'Failed to create home page content'),
      )
    }
  },
)

export const updateHomePage = createAsyncThunk(
  'homePage/updateHomePage',
  async ({ slug, payload }, thunkAPI) => {
    try {
      return await homePageService.updateHomePage(slug, payload)
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorPayload(error, 'Failed to update home page content'),
      )
    }
  },
)

const homePageSlice = createSlice({
  name: 'homePage',
  initialState: {
    item: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearHomePageError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomePage.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchHomePage.fulfilled, (state, action) => {
        state.loading = false
        state.item = action.payload?.data || null
      })
      .addCase(fetchHomePage.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      .addCase(createHomePage.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createHomePage.fulfilled, (state, action) => {
        state.loading = false
        state.item = action.payload?.data || null
      })
      .addCase(createHomePage.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      .addCase(updateHomePage.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateHomePage.fulfilled, (state, action) => {
        state.loading = false
        state.item = action.payload?.data || null
      })
      .addCase(updateHomePage.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearHomePageError } = homePageSlice.actions
export default homePageSlice.reducer