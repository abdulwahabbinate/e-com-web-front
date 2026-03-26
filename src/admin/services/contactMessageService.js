import { http } from './http'

const ADMIN_API_BASE_URL = 'http://localhost:5001/api/v1/admin'

export const contactMessageService = {
  getContactMessages: async () => {
    return http.get(`${ADMIN_API_BASE_URL}/contact-messages/all`)
  },

  getContactMessage: async (id) => {
    return http.get(`${ADMIN_API_BASE_URL}/contact-messages/${id}`)
  },

  updateContactMessageStatus: async (id, payload) => {
    return http.put(`${ADMIN_API_BASE_URL}/contact-messages/update-status/${id}`, payload)
  },
}