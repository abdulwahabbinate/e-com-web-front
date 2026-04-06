import { combineReducers } from 'redux'
import handleCart from './handleCart'
import handleWishlist from './handleWishlist'

import adminAuthReducer from '../../admin/store/slices/adminAuthSlice'
import homePageReducer from '../../admin/store/slices/homePageSlice'
import aboutPageReducer from '../../admin/store/slices/aboutPageSlice'
import contactPageReducer from '../../admin/store/slices/contactPageSlice'
import contactMessagesReducer from '../../admin/store/slices/contactMessageSlice'
import paymentSettingReducer from '../../admin/store/slices/paymentSettingSlice'
import dashboardReducer from '../../admin/store/slices/dashboardSlice'
import categoryReducer from '../../admin/store/slices/categorySlice'
import productReducer from '../../admin/store/slices/productSlice'
import ordersReducer from '../../admin/store/slices/orderSlice'
import uiReducer from '../../admin/store/slices/uiSlice'
import newsletterReducer from "../../admin/store/slices/newsletterSlice";

const rootReducers = combineReducers({
  handleCart,
  handleWishlist,
  adminAuth: adminAuthReducer,
  homePage: homePageReducer,
  aboutPage: aboutPageReducer,
  contactPage: contactPageReducer,
  contactMessages: contactMessagesReducer,
  paymentSettings: paymentSettingReducer,
  dashboard: dashboardReducer,
  categories: categoryReducer,
  products: productReducer,
  orders: ordersReducer,
  adminUi: uiReducer,
  newsletter: newsletterReducer,
})

export default rootReducers
