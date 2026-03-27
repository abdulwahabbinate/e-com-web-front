import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { paymentSettingService } from '../../services/paymentSettingService'

const getErrorPayload = (error, fallbackMessage) => {
  return (
    error?.response || {
      message: error?.message || fallbackMessage,
    }
  )
}

export const fetchPaymentSettings = createAsyncThunk(
  'paymentSettings/fetchPaymentSettings',
  async (_, thunkAPI) => {
    try {
      return await paymentSettingService.getPaymentSettings()
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorPayload(error, 'Failed to fetch payment settings')
      )
    }
  }
)

export const updatePaymentSettings = createAsyncThunk(
  'paymentSettings/updatePaymentSettings',
  async (payload, thunkAPI) => {
    try {
      return await paymentSettingService.updatePaymentSettings(payload)
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorPayload(error, 'Failed to update payment settings')
      )
    }
  }
)

const paymentSettingSlice = createSlice({
  name: 'paymentSettings',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearPaymentSettingError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaymentSettings.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPaymentSettings.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload?.data || null
      })
      .addCase(fetchPaymentSettings.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      .addCase(updatePaymentSettings.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updatePaymentSettings.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload?.data || null
      })
      .addCase(updatePaymentSettings.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearPaymentSettingError } = paymentSettingSlice.actions
export default paymentSettingSlice.reducer