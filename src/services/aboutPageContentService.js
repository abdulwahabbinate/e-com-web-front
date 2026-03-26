import { API_ENDPOINTS } from "../config/api";

export const aboutPageContentService = {
  getAboutPageContent: async () => {
    const response = await fetch(API_ENDPOINTS.aboutPageContent);
    const result = await response.json();

    if (!response.ok || result?.status !== 1) {
      throw new Error(result?.message || "Failed to fetch about page content");
    }

    return result;
  },
};