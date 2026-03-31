export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001/api/v1";

export const API_ENDPOINTS = {
  categoriesMenu: `${API_BASE_URL}/categories/menu`,
  homePageContent: `${API_BASE_URL}/home-page/home`,
  aboutPageContent: `${API_BASE_URL}/about-page/about`,
  contactPageContent: `${API_BASE_URL}/contact-page/contact`,
  contactMessageSubmit: `${API_BASE_URL}/contact-message/submit`,
  categories: `${API_BASE_URL}/categories/all`,
  products: `${API_BASE_URL}/products/all`,
  productById: `${API_BASE_URL}/products`,
  productsCartItems: `${API_BASE_URL}/products/cart-items`,
  settings: `${API_BASE_URL}/settings`,
  publicPaymentSettings: `${API_BASE_URL}/payment-settings/default`,
  createOrder: `${API_BASE_URL}/orders/create`,
  createStripePaymentIntent: `${API_BASE_URL}/stripe/create-payment-intent`,
};