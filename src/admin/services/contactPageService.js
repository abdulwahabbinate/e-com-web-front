import { http } from './http'

const ADMIN_API_BASE_URL = 'http://localhost:5001/api/v1/admin'
const PUBLIC_API_BASE_URL = 'http://localhost:5001/api/v1'

export const contactPageService = {
  getAdminContactPage: async (slug = 'contact') => {
    return http.get(`${ADMIN_API_BASE_URL}/contact-page/${slug}`)
  },

  createContactPage: async (payload) => {
    return http.post(`${ADMIN_API_BASE_URL}/contact-page/create`, payload)
  },

  updateContactPage: async (slug, payload) => {
    return http.put(`${ADMIN_API_BASE_URL}/contact-page/update/${slug}`, payload)
  },

  getPublicContactPage: async (slug = 'contact') => {
    return http.get(`${PUBLIC_API_BASE_URL}/contact-page/${slug}`)
  },
}