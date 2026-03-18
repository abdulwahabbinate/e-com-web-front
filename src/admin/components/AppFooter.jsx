import React from 'react'
import { useSelector } from 'react-redux'
import { CBadge, CFooter } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilClock,
  cilCode,
  cilGlobeAlt,
  cilShieldAlt,
  cilSpeedometer,
  cilUser,
} from '@coreui/icons'

const AppFooter = () => {
  const { admin } = useSelector((state) => state.adminAuth)
  const currentYear = new Date().getFullYear()

  return (
    <CFooter className="admin-premium-footer px-3 py-2">
      <div className="admin-premium-footer__inner w-100 d-flex flex-column flex-xl-row align-items-xl-center justify-content-between gap-2 gap-xl-3">
        <div className="admin-premium-footer__left d-flex align-items-center gap-2 gap-sm-3">
          <div className="admin-premium-footer__logo">
            <span>EA</span>
          </div>

          <div className="min-w-0">
            <div className="admin-premium-footer__title d-flex flex-wrap align-items-center gap-2">
              <span>E-Commerce Admin Panel</span>

              <CBadge
                color="success"
                shape="rounded-pill"
                className="admin-premium-footer__badge"
              >
                Live
              </CBadge>
            </div>

            <div className="admin-premium-footer__meta d-flex flex-wrap align-items-center gap-2 gap-sm-3 mt-1">
              <span className="d-inline-flex align-items-center gap-1">
                <CIcon icon={cilUser} size="sm" />
                {admin?.name || 'Super Admin'}
              </span>

              <span className="d-inline-flex align-items-center gap-1">
                <CIcon icon={cilShieldAlt} size="sm" />
                Secure Access
              </span>

              <span className="d-inline-flex align-items-center gap-1">
                <CIcon icon={cilClock} size="sm" />
                {currentYear} Zain Store
              </span>
            </div>
          </div>
        </div>

        <div className="admin-premium-footer__right d-flex flex-wrap align-items-center justify-content-xl-end gap-2">
          <span className="admin-premium-footer__chip">
            <CIcon icon={cilSpeedometer} size="sm" />
            Admin Dashboard
          </span>

          <span className="admin-premium-footer__chip">
            <CIcon icon={cilCode} size="sm" />
            MERN Stack
          </span>

          <span className="admin-premium-footer__chip">
            <CIcon icon={cilGlobeAlt} size="sm" />
            Manage Store
          </span>
        </div>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)