import React from 'react'
import { useSelector } from 'react-redux'
import { CFooter } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMediaPlay, cilUser, cilShieldAlt } from '@coreui/icons'

const AppFooter = () => {
  const { admin } = useSelector((state) => state.adminAuth)
  const currentYear = new Date().getFullYear()

  return (
    <CFooter className="premium-footer px-4">
      <div className="premium-footer-left">
        <span className="premium-footer-title">E-Commerce Admin Panel</span>
        <span className="premium-footer-separator">•</span>
        <span className="premium-footer-copy">© {currentYear} BinateDigital</span>
      </div>

      <div className="premium-footer-right">
        <span className="premium-footer-chip premium-footer-status">
          <CIcon icon={cilMediaPlay} className="me-1 footer-status-icon" />
          Online
        </span>

        <span className="premium-footer-chip">
          <CIcon icon={cilUser} className="me-1" />
          {admin?.name || 'Super Admin'}
        </span>

        <span className="premium-footer-chip">
          <CIcon icon={cilShieldAlt} className="me-1" />
          Secure
        </span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
