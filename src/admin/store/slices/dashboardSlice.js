import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { dashboardService } from "../../services/dashboardService";

export const fetchDashboard = createAsyncThunk(
  "dashboard/fetchDashboard",
  async (_, thunkAPI) => {
    try {
      const response = await dashboardService.getDashboard();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Failed to fetch dashboard");
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
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload?.data || action.payload;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
