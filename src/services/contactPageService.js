import { API_ENDPOINTS } from "../config/api";

export const contactPageContentService = {
  getContactPageContent: async () => {
    const response = await fetch(API_ENDPOINTS.contactPageContent);
    const result = await response.json();

    if (!response.ok || result?.status !== 1) {
      throw new Error(result?.message || "Failed to fetch contact page content");
    }

    return result;
  },
};