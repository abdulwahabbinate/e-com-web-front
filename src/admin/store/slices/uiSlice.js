import { createSlice } from '@reduxjs/toolkit'

const getInitialSidebarShow = () => {
  if (typeof window === 'undefined') return true
  return window.innerWidth >= 992
}

const initialState = {
  sidebarShow: getInitialSidebarShow(),
  sidebarNarrow: false,
  theme: 'light',
}

const uiSlice = createSlice({
  name: 'adminUi',
  initialState,
  reducers: {
    setUi: (state, action) => {
      Object.assign(state, action.payload)
    },
    resetSidebarForMobile: (state) => {
      state.sidebarShow = false
      state.sidebarNarrow = false
    },
    resetSidebarForDesktop: (state) => {
      state.sidebarShow = true
    },
  },
})

export const { setUi, resetSidebarForMobile, resetSidebarForDesktop } = uiSlice.actions
export default uiSlice.reducer
