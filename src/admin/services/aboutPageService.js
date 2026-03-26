import { http } from './http'

const ADMIN_API_BASE_URL = 'http://localhost:5001/api/v1/admin'
const PUBLIC_API_BASE_URL = 'http://localhost:5001/api/v1/'

export const aboutPageService = {
  getAdminAboutPage: async (slug = 'about') => {
    return http.get(`${ADMIN_API_BASE_URL}/about-page/${slug}`)
  },

  createAboutPage: async (payload) => {
    return http.post(`${ADMIN_API_BASE_URL}/about-page/create`, payload)
  },

  updateAboutPage: async (slug, payload) => {
    return http.put(`${ADMIN_API_BASE_URL}/about-page/update/${slug}`, payload)
  },

  getPublicAboutPage: async (slug = 'about') => {
    return http.get(`${PUBLIC_API_BASE_URL}/about-page/${slug}`)
  },
}