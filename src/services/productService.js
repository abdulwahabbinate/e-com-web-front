import { API_ENDPOINTS } from "../config/api";

export const productService = {
  getCartProducts: async (ids = []) => {
    const query = ids.join(",");
    const response = await fetch(`${API_ENDPOINTS.productsCartItems}?ids=${query}`);
    const result = await response.json();

    if (!response.ok || result?.status !== 1) {
      throw new Error(result?.message || "Failed to fetch cart products");
    }

    return result;
  },
};