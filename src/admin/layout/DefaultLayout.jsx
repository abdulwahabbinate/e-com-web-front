import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import AppSidebar from '../components/AppSidebar'
import AppHeader from '../components/AppHeader'
import AppContent from '../components/AppContent'
import AppFooter from '../components/AppFooter'
import { resetSidebarForDesktop, resetSidebarForMobile } from '../store/slices/uiSlice'

const DefaultLayout = () => {
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.adminAuth)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992) {
        dispatch(resetSidebarForMobile())
      } else {
        dispatch(resetSidebarForDesktop())
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [dispatch])

  if (!token) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-body-tertiary premium-wrapper">
        <AppHeader />
        <div className="body flex-grow-1">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
