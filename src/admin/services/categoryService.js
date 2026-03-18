import { http } from './http'

const ADMIN_API_BASE_URL = 'http://localhost:5001/api/v1/admin'

export const categoryService = {
  getCategories: async () => {
    return http.get(`${ADMIN_API_BASE_URL}/categories/all`)
  },

  createCategory: async (payload) => {
    return http.post(`${ADMIN_API_BASE_URL}/categories/create`, payload)
  },

  updateCategory: async (id, payload) => {
    return http.put(`${ADMIN_API_BASE_URL}/categories/update/${id}`, payload)
  },

  deleteCategory: async (id) => {
    return http.delete(`${ADMIN_API_BASE_URL}/categories/delete/${id}`)
  },
}