import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import { setUi } from '../store/slices/uiSlice'
import AppSidebarNav from './AppSidebarNav'
import navigation from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const { sidebarNarrow, sidebarShow } = useSelector((state) => state.adminUi)

  const isDesktop = typeof window !== 'undefined' ? window.innerWidth >= 992 : true

  return (
    <CSidebar
      className="border-end premium-sidebar"
      colorScheme="dark"
      position="fixed"
      narrow={isDesktop ? sidebarNarrow : false}
      visible={sidebarShow}
      onVisibleChange={(visible) => dispatch(setUi({ sidebarShow: visible }))}
    >
      <CSidebarHeader className="border-bottom premium-sidebar-header">
        <CSidebarBrand className="d-flex align-items-center">
          <div className="sidebar-brand-full fw-semibold">E-Commerce Admin</div>
          <div className="sidebar-brand-narrow fw-bold">EA</div>
        </CSidebarBrand>

        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch(setUi({ sidebarShow: false, sidebarNarrow: false }))}
        />
      </CSidebarHeader>

      <AppSidebarNav items={navigation} />

      <CSidebarFooter className="border-top d-none d-lg-flex premium-sidebar-footer">
        <CSidebarToggler
          onClick={() => dispatch(setUi({ sidebarNarrow: !sidebarNarrow }))}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
