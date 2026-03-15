import { http } from "./http";

const ADMIN_API_BASE_URL = "http://localhost:5001/api/v1/admin";

export const dashboardService = {
  getDashboard: async () => {
    return http.get(`${ADMIN_API_BASE_URL}/dashboard`);
  },
};
