import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { dashboardService } from "../../services/dashboardService";

const getErrorPayload = (error, fallbackMessage) => {
  return (
    error?.response || {
      message: error?.message || fallbackMessage,
    }
  );
};

export const fetchDashboard = createAsyncThunk(
  "dashboard/fetchDashboard",
  async (_, thunkAPI) => {
    try {
      return await dashboardService.getDashboard();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorPayload(error, "Failed to fetch dashboard")
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    stats: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload?.data || null;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDashboardError } = dashboardSlice.actions;
export default dashboardSlice.reducer;