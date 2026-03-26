import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { contactMessageService } from '../../services/contactMessageService'

const getErrorPayload = (error, fallbackMessage) => {
  return (
    error?.response || {
      message: error?.message || fallbackMessage,
    }
  )
}

export const fetchContactMessages = createAsyncThunk(
  'contactMessages/fetchContactMessages',
  async (_, thunkAPI) => {
    try {
      return await contactMessageService.getContactMessages()
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorPayload(error, 'Failed to fetch contact messages'),
      )
    }
  },
)

export const fetchContactMessage = createAsyncThunk(
  'contactMessages/fetchContactMessage',
  async (id, thunkAPI) => {
    try {
      return await contactMessageService.getContactMessage(id)
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorPayload(error, 'Failed to fetch contact message'),
      )
    }
  },
)

export const updateContactMessageStatus = createAsyncThunk(
  'contactMessages/updateContactMessageStatus',
  async ({ id, payload }, thunkAPI) => {
    try {
      return await contactMessageService.updateContactMessageStatus(id, payload)
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorPayload(error, 'Failed to update contact message status'),
      )
    }
  },
)

const contactMessageSlice = createSlice({
  name: 'contactMessages',
  initialState: {
    list: [],
    selectedItem: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearContactMessageError: (state) => {
      state.error = null
    },
    clearSelectedContactMessage: (state) => {
      state.selectedItem = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContactMessages.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchContactMessages.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload?.data || []
      })
      .addCase(fetchContactMessages.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      .addCase(fetchContactMessage.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchContactMessage.fulfilled, (state, action) => {
        state.loading = false
        state.selectedItem = action.payload?.data || null
      })
      .addCase(fetchContactMessage.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      .addCase(updateContactMessageStatus.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateContactMessageStatus.fulfilled, (state, action) => {
        state.loading = false

        const updated = action.payload?.data || null
        if (updated?._id) {
          const index = state.list.findIndex((item) => item._id === updated._id)
          if (index !== -1) {
            state.list[index] = updated
          }

          if (state.selectedItem?._id === updated._id) {
            state.selectedItem = updated
          }
        }
      })
      .addCase(updateContactMessageStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const {
  clearContactMessageError,
  clearSelectedContactMessage,
} = contactMessageSlice.actions

export default contactMessageSlice.reducer