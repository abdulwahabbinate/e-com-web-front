import { http } from './http'

const ADMIN_API_BASE_URL = 'http://localhost:5001/api/v1/admin'

export const paymentSettingService = {
  getPaymentSettings: async () => {
    return http.get(`${ADMIN_API_BASE_URL}/payment-settings/default`)
  },

  updatePaymentSettings: async (payload) => {
    return http.put(`${ADMIN_API_BASE_URL}/payment-settings/update`, payload)
  },
}