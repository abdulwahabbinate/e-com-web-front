import { API_ENDPOINTS } from "../config/api";

export const newsletterService = {
  subscribe: async (payload) => {
    const response = await fetch(API_ENDPOINTS.newsletterSubscribe, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok || result?.status !== 1) {
      const error = new Error(result?.message || "Failed to subscribe");
      error.response = result;
      throw error;
    }

    return result;
  },
};