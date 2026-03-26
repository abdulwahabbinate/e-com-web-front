import { API_ENDPOINTS } from "../config/api";

export const contactMessageService = {
  submitContactMessage: async (payload) => {
    const response = await fetch(API_ENDPOINTS.contactMessageSubmit, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok || result?.status !== 1) {
      const error = new Error(result?.message || "Failed to submit message");
      error.response = result;
      throw error;
    }

    return result;
  },
};