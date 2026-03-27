import { API_ENDPOINTS } from "../config/api";

export const paymentSettingService = {
  getPublicPaymentSettings: async () => {
    const response = await fetch(API_ENDPOINTS.publicPaymentSettings);
    const result = await response.json();

    if (!response.ok || result?.status !== 1) {
      const error = new Error(result?.message || "Failed to fetch payment settings");
      error.response = result;
      throw error;
    }

    return result;
  },
};