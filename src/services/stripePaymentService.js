import { API_ENDPOINTS } from "../config/api";

const parseJsonSafely = async (response) => {
  try {
    return await response.json();
  } catch (error) {
    return {};
  }
};

export const stripePaymentService = {
  createPaymentIntent: async (payload) => {
    const response = await fetch(API_ENDPOINTS.createStripePaymentIntent, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await parseJsonSafely(response);

    if (!response.ok || result?.status !== 1) {
      const error = new Error(
        result?.message || "Failed to create payment intent"
      );
      error.response = result;
      throw error;
    }

    return result;
  },
};