import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { orderService } from '../../services/orderService'

const getErrorPayload = (error, fallbackMessage) => {
  return (
    error?.response || {
      message: error?.message || fallbackMessage,
    }
  )
}

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, thunkAPI) => {
    try {
      return await orderService.getOrders()
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorPayload(error, 'Failed to fetch orders'),
      )
    }
  },
)

export const fetchOrder = createAsyncThunk(
  'orders/fetchOrder',
  async (id, thunkAPI) => {
    try {
      return await orderService.getOrder(id)
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorPayload(error, 'Failed to fetch order'),
      )
    }
  },
)

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ id, payload }, thunkAPI) => {
    try {
      return await orderService.updateOrderStatus(id, payload)
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorPayload(error, 'Failed to update order status'),
      )
    }
  },
)

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    list: [],
    selectedItem: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearOrderError: (state) => {
      state.error = null
    },
    clearSelectedOrder: (state) => {
      state.selectedItem = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload?.data || []
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      .addCase(fetchOrder.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.loading = false
        state.selectedItem = action.payload?.data || null
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
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
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearOrderError, clearSelectedOrder } = orderSlice.actions

export default orderSlice.reducer