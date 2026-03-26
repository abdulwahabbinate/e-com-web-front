import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { contactPageService } from '../../services/contactPageService'

const getErrorPayload = (error, fallbackMessage) => {
  return (
    error?.response || {
      message: error?.message || fallbackMessage,
    }
  )
}

export const fetchContactPage = createAsyncThunk(
  'contactPage/fetchContactPage',
  async (_, thunkAPI) => {
    try {
      return await contactPageService.getAdminContactPage('contact')
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorPayload(error, 'Failed to fetch contact page content'),
      )
    }
  },
)

export const createContactPage = createAsyncThunk(
  'contactPage/createContactPage',
  async (payload, thunkAPI) => {
    try {
      return await contactPageService.createContactPage(payload)
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorPayload(error, 'Failed to create contact page content'),
      )
    }
  },
)

export const updateContactPage = createAsyncThunk(
  'contactPage/updateContactPage',
  async ({ slug, payload }, thunkAPI) => {
    try {
      return await contactPageService.updateContactPage(slug, payload)
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorPayload(error, 'Failed to update contact page content'),
      )
    }
  },
)

const contactPageSlice = createSlice({
  name: 'contactPage',
  initialState: {
    item: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearContactPageError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContactPage.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchContactPage.fulfilled, (state, action) => {
        state.loading = false
        state.item = action.payload?.data || null
      })
      .addCase(fetchContactPage.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      .addCase(createContactPage.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createContactPage.fulfilled, (state, action) => {
        state.loading = false
        state.item = action.payload?.data || null
      })
      .addCase(createContactPage.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      .addCase(updateContactPage.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateContactPage.fulfilled, (state, action) => {
        state.loading = false
        state.item = action.payload?.data || null
      })
      .addCase(updateContactPage.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearContactPageError } = contactPageSlice.actions
export default contactPageSlice.reducer