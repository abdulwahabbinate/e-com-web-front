import { http } from "./http";

const ADMIN_API_BASE_URL = "http://localhost:5001/api/v1/admin";

export const newsletterAdminService = {
  getStats: async () => {
    return http.get(`${ADMIN_API_BASE_URL}/newsletter/stats`);
  },

  getSubscribers: async () => {
    return http.get(`${ADMIN_API_BASE_URL}/newsletter/subscribers/all`);
  },

  getCampaigns: async () => {
    return http.get(`${ADMIN_API_BASE_URL}/newsletter/campaigns/all`);
  },

  sendCampaign: async (payload) => {
    return http.post(`${ADMIN_API_BASE_URL}/newsletter/send-campaign`, payload);
  },

  updateSubscriberStatus: async (id, payload) => {
    return http.put(`${ADMIN_API_BASE_URL}/newsletter/subscriber-status/${id}`, payload);
  },

  removeSubscriber: async (id) => {
    return http.delete(`${ADMIN_API_BASE_URL}/newsletter/subscriber/${id}`);
  },
};