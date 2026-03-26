import { API_ENDPOINTS } from "../config/api";

export const homePageContentService = {
  getHomePageContent: async () => {
    const response = await fetch(API_ENDPOINTS.homePageContent);
    const result = await response.json();

    if (!response.ok || result?.status !== 1) {
      throw new Error(result?.message || "Failed to fetch home page content");
    }

    return result;
  },
};