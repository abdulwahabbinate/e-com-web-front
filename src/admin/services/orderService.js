import { http } from './http'

const ADMIN_API_BASE_URL = 'http://localhost:5001/api/v1/admin'

export const orderService = {
  getOrders: async () => {
    return http.get(`${ADMIN_API_BASE_URL}/orders/all`)
  },

  getOrder: async (id) => {
    return http.get(`${ADMIN_API_BASE_URL}/orders/${id}`)
  },

  updateOrderStatus: async (id, payload) => {
    return http.put(`${ADMIN_API_BASE_URL}/orders/update-status/${id}`, payload)
  },
}