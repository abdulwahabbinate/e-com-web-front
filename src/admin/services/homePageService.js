import { http } from './http'

const ADMIN_API_BASE_URL = 'http://localhost:5001/api/v1/admin'
const PUBLIC_API_BASE_URL = 'http://localhost:5001/api/v1/'

export const homePageService = {
  getAdminHomePage: async (slug = 'home') => {
    return http.get(`${ADMIN_API_BASE_URL}/home-page/${slug}`)
  },

  createHomePage: async (payload) => {
    return http.post(`${ADMIN_API_BASE_URL}/home-page/create`, payload)
  },

  updateHomePage: async (slug, payload) => {
    return http.put(`${ADMIN_API_BASE_URL}/home-page/update/${slug}`, payload)
  },
}