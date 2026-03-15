import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authService } from "../../services/authService";

const initialToken = localStorage.getItem("admin_token");
const initialAdmin = localStorage.getItem("admin_user");

export const adminLogin = createAsyncThunk(
  "adminAuth/login",
  async (payload, thunkAPI) => {
    try {
      const response = await authService.login(payload);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Login failed");
    }
  }
);

const authSlice = createSlice({
  name: "adminAuth",
  initialState: {
    token: initialToken || null,
    admin: initialAdmin ? JSON.parse(initialAdmin) : null,
    loading: false,
    error: null,
  },
  reducers: {
    logoutAdmin: (state) => {
      state.token = null;
      state.admin = null;
      state.error = null;
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;

        const data = action.payload?.data || action.payload;

        state.token = data?.token || null;
        state.admin = data?.admin || null;

        localStorage.setItem("admin_token", data?.token || "");
        localStorage.setItem("admin_user", JSON.stringify(data?.admin || null));
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logoutAdmin } = authSlice.actions;
export default authSlice.reducer;
