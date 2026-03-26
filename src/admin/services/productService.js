import { http } from './http'

const ADMIN_API_BASE_URL = 'http://localhost:5001/api/v1/admin'

export const productService = {
  getProducts: async () => {
    return http.get(`${ADMIN_API_BASE_URL}/products/all`)
  },

  createProduct: async (payload) => {
    return http.post(`${ADMIN_API_BASE_URL}/products/create`, payload)
  },

  updateProduct: async (id, payload) => {
    return http.put(`${ADMIN_API_BASE_URL}/products/update/${id}`, payload)
  },

  deleteProduct: async (id) => {
    return http.delete(`${ADMIN_API_BASE_URL}/products/delete/${id}`)
  },
}