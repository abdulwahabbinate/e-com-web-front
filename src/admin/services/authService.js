import { http } from './http'

const ADMIN_API_BASE_URL = 'http://localhost:5001/api/v1/admin'

export const authService = {
  login: async (payload) => {
    return http.post(`${ADMIN_API_BASE_URL}/auth/login`, payload)
  },

  getProfile: async () => {
    return http.get(`${ADMIN_API_BASE_URL}/auth/profile`)
  },

  updateProfile: async (payload) => {
    return http.put(`${ADMIN_API_BASE_URL}/auth/profile/update`, payload)
  },

  changePassword: async (payload) => {
    return http.put(`${ADMIN_API_BASE_URL}/auth/change-password`, payload)
  },
}