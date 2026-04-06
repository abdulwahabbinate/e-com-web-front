import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { newsletterAdminService } from "../../services/newsletterAdminService";

const getErrorPayload = (error, fallbackMessage) => {
  return (
    error?.response || {
      message: error?.message || fallbackMessage,
    }
  );
};

export const fetchNewsletterStats = createAsyncThunk(
  "newsletter/fetchStats",
  async (_, thunkAPI) => {
    try {
      return await newsletterAdminService.getStats();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorPayload(error, "Failed to fetch newsletter stats")
      );
    }
  }
);

export const fetchNewsletterSubscribers = createAsyncThunk(
  "newsletter/fetchSubscribers",
  async (_, thunkAPI) => {
    try {
      return await newsletterAdminService.getSubscribers();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorPayload(error, "Failed to fetch newsletter subscribers")
      );
    }
  }
);

export const fetchNewsletterCampaigns = createAsyncThunk(
  "newsletter/fetchCampaigns",
  async (_, thunkAPI) => {
    try {
      return await newsletterAdminService.getCampaigns();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorPayload(error, "Failed to fetch newsletter campaigns")
      );
    }
  }
);

export const sendNewsletterCampaign = createAsyncThunk(
  "newsletter/sendCampaign",
  async (payload, thunkAPI) => {
    try {
      return await newsletterAdminService.sendCampaign(payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorPayload(error, "Failed to send email campaign")
      );
    }
  }
);

export const updateNewsletterSubscriberStatus = createAsyncThunk(
  "newsletter/updateSubscriberStatus",
  async ({ id, payload }, thunkAPI) => {
    try {
      return await newsletterAdminService.updateSubscriberStatus(id, payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorPayload(error, "Failed to update subscriber status")
      );
    }
  }
);

export const removeNewsletterSubscriber = createAsyncThunk(
  "newsletter/removeSubscriber",
  async (id, thunkAPI) => {
    try {
      return await newsletterAdminService.removeSubscriber(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorPayload(error, "Failed to remove subscriber")
      );
    }
  }
);

const newsletterSlice = createSlice({
  name: "newsletter",
  initialState: {
    stats: null,
    subscribers: [],
    campaigns: [],
    loading: false,
    actionLoading: false,
    error: null,
    successMessage: "",
  },
  reducers: {
    clearNewsletterMessages: (state) => {
      state.error = null;
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewsletterStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewsletterStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload?.data || null;
      })
      .addCase(fetchNewsletterStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchNewsletterSubscribers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewsletterSubscribers.fulfilled, (state, action) => {
        state.loading = false;
        state.subscribers = action.payload?.data || [];
      })
      .addCase(fetchNewsletterSubscribers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchNewsletterCampaigns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewsletterCampaigns.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns = action.payload?.data || [];
      })
      .addCase(fetchNewsletterCampaigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(sendNewsletterCampaign.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
        state.successMessage = "";
      })
      .addCase(sendNewsletterCampaign.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.successMessage = action.payload?.message || "Campaign sent successfully";
        if (action.payload?.data) {
          state.campaigns = [action.payload.data, ...state.campaigns];
        }
      })
      .addCase(sendNewsletterCampaign.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      .addCase(updateNewsletterSubscriberStatus.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateNewsletterSubscriberStatus.fulfilled, (state, action) => {
        state.actionLoading = false;
        const updated = action.payload?.data || null;

        if (updated?._id) {
          const index = state.subscribers.findIndex((item) => item._id === updated._id);
          if (index !== -1) {
            state.subscribers[index] = updated;
          }
        }
      })
      .addCase(updateNewsletterSubscriberStatus.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      .addCase(removeNewsletterSubscriber.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(removeNewsletterSubscriber.fulfilled, (state, action) => {
        state.actionLoading = false;
        const deleted = action.payload?.data || null;
        if (deleted?._id) {
          state.subscribers = state.subscribers.filter((item) => item._id !== deleted._id);
        }
      })
      .addCase(removeNewsletterSubscriber.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearNewsletterMessages } = newsletterSlice.actions;
export default newsletterSlice.reducer;