import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authService } from "../../services/authService";

const savedAdmin = localStorage.getItem("admin_data");
const savedToken = localStorage.getItem("admin_token");

const normalizeError = (error, fallbackMessage) => {
  const response = error?.response;

  if (response?.errors && Array.isArray(response.errors)) {
    return {
      message: response.message || fallbackMessage,
      errors: response.errors,
    };
  }

  if (response?.message) {
    return {
      message: response.message,
      errors: response.errors || [],
    };
  }

  return {
    message: error?.message || fallbackMessage,
    errors: [],
  };
};

export const loginAdmin = createAsyncThunk(
  "adminAuth/loginAdmin",
  async (payload, thunkAPI) => {
    try {
      return await authService.login(payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(normalizeError(error, "Login failed"));
    }
  }
);

export const fetchAdminProfile = createAsyncThunk(
  "adminAuth/fetchAdminProfile",
  async (_, thunkAPI) => {
    try {
      return await authService.getProfile();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        normalizeError(error, "Failed to fetch profile")
      );
    }
  }
);

export const updateAdminProfile = createAsyncThunk(
  "adminAuth/updateAdminProfile",
  async (payload, thunkAPI) => {
    try {
      return await authService.updateProfile(payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        normalizeError(error, "Failed to update profile")
      );
    }
  }
);

export const changeAdminPassword = createAsyncThunk(
  "adminAuth/changeAdminPassword",
  async (payload, thunkAPI) => {
    try {
      return await authService.changePassword(payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        normalizeError(error, "Failed to change password")
      );
    }
  }
);

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState: {
    admin: savedAdmin ? JSON.parse(savedAdmin) : null,
    token: savedToken || null,
    loading: false,
    error: null,
  },
  reducers: {
    logoutAdmin: (state) => {
      state.admin = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_data");
    },
    clearAdminAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.admin = action.payload?.data?.admin || null;
        state.token = action.payload?.data?.token || null;

        localStorage.setItem("admin_token", action.payload?.data?.token || "");
        localStorage.setItem(
          "admin_data",
          JSON.stringify(action.payload?.data?.admin || null)
        );
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          message: "Login failed",
          errors: [],
        };
      })

      // PROFILE
      .addCase(fetchAdminProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.admin = action.payload?.data || null;

        localStorage.setItem(
          "admin_data",
          JSON.stringify(action.payload?.data || null)
        );
      })
      .addCase(fetchAdminProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          message: "Failed to fetch profile",
          errors: [],
        };
      })

      // UPDATE PROFILE
      .addCase(updateAdminProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdminProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.admin = action.payload?.data || null;

        localStorage.setItem(
          "admin_data",
          JSON.stringify(action.payload?.data || null)
        );
      })
      .addCase(updateAdminProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          message: "Failed to update profile",
          errors: [],
        };
      })

      // CHANGE PASSWORD
      .addCase(changeAdminPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeAdminPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(changeAdminPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          message: "Failed to change password",
          errors: [],
        };
      });
  },
});

export const { logoutAdmin, clearAdminAuthError } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;