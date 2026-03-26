import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { aboutPageService } from '../../services/aboutPageService'

const getErrorPayload = (error, fallbackMessage) => {
  return (
    error?.response || {
      message: error?.message || fallbackMessage,
    }
  )
}

export const fetchAboutPage = createAsyncThunk(
  'aboutPage/fetchAboutPage',
  async (_, thunkAPI) => {
    try {
      return await aboutPageService.getAdminAboutPage('about')
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorPayload(error, 'Failed to fetch about page content'),
      )
    }
  },
)

export const createAboutPage = createAsyncThunk(
  'aboutPage/createAboutPage',
  async (payload, thunkAPI) => {
    try {
      return await aboutPageService.createAboutPage(payload)
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorPayload(error, 'Failed to create about page content'),
      )
    }
  },
)

export const updateAboutPage = createAsyncThunk(
  'aboutPage/updateAboutPage',
  async ({ slug, payload }, thunkAPI) => {
    try {
      return await aboutPageService.updateAboutPage(slug, payload)
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorPayload(error, 'Failed to update about page content'),
      )
    }
  },
)

const aboutPageSlice = createSlice({
  name: 'aboutPage',
  initialState: {
    item: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearAboutPageError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAboutPage.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAboutPage.fulfilled, (state, action) => {
        state.loading = false
        state.item = action.payload?.data || null
      })
      .addCase(fetchAboutPage.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      .addCase(createAboutPage.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createAboutPage.fulfilled, (state, action) => {
        state.loading = false
        state.item = action.payload?.data || null
      })
      .addCase(createAboutPage.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      .addCase(updateAboutPage.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateAboutPage.fulfilled, (state, action) => {
        state.loading = false
        state.item = action.payload?.data || null
      })
      .addCase(updateAboutPage.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearAboutPageError } = aboutPageSlice.actions
export default aboutPageSlice.reducer