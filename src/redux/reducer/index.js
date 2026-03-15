import { combineReducers } from 'redux'
import handleCart from './handleCart'
import handleWishlist from './handleWishlist'

import authReducer from '../../admin/store/slices/authSlice'
import dashboardReducer from '../../admin/store/slices/dashboardSlice'
import categoryReducer from '../../admin/store/slices/categorySlice'
import productReducer from '../../admin/store/slices/productSlice'
import uiReducer from '../../admin/store/slices/uiSlice'

const rootReducers = combineReducers({
  handleCart,
  handleWishlist,

  adminAuth: authReducer,
  dashboard: dashboardReducer,
  categories: categoryReducer,
  products: productReducer,
  adminUi: uiReducer,
})

export default rootReducers
