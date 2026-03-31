import { API_ENDPOINTS } from "../config/api";

const parseJsonSafely = async (response) => {
  try {
    return await response.json();
  } catch (error) {
    return {};
  }
};

export const paymentSettingService = {
  getPublicPaymentSettings: async () => {
    const response = await fetch(API_ENDPOINTS.publicPaymentSettings);
    const result = await parseJsonSafely(response);

    if (!response.ok || result?.status !== 1) {
      const error = new Error(
        result?.message || "Failed to fetch payment settings"
      );
      error.response = result;
      throw error;
    }

    return result;
  },
};