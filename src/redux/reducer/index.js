import { combineReducers } from 'redux'
import handleCart from './handleCart'
import handleWishlist from './handleWishlist'

import adminAuthReducer from '../../admin/store/slices/adminAuthSlice'
import homePageReducer from '../../admin/store/slices/homePageSlice'
import aboutPageReducer from '../../admin/store/slices/aboutPageSlice'
import contactPageReducer from '../../admin/store/slices/contactPageSlice'
import contactMessagesReducer from '../../admin/store/slices/contactMessageSlice'
import dashboardReducer from '../../admin/store/slices/dashboardSlice'
import categoryReducer from '../../admin/store/slices/categorySlice'
import productReducer from '../../admin/store/slices/productSlice'
import uiReducer from '../../admin/store/slices/uiSlice'

const rootReducers = combineReducers({
  handleCart,
  handleWishlist,

  adminAuth: adminAuthReducer,
  homePage: homePageReducer,
  aboutPage: aboutPageReducer,
  contactPage: contactPageReducer,
  contactMessages: contactMessagesReducer,
  dashboard: dashboardReducer,
  categories: categoryReducer,
  products: productReducer,
  adminUi: uiReducer,
})

export default rootReducers
