import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilAccountLogout,
  cilLockLocked,
  cilSettings,
  cilUser,
} from '@coreui/icons'
import { logoutAdmin } from '../store/slices/authSlice'

const AppHeaderDropdown = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { admin } = useSelector((state) => state.adminAuth)

  const initial = admin?.name?.charAt(0)?.toUpperCase() || 'A'

  const handleLogout = () => {
    dispatch(logoutAdmin())
    navigate('/admin/login')
  }

  return (
    <CDropdown variant="nav-item" alignment="end">
      <CDropdownToggle caret={false} className="admin-premium-avatar-toggle">
        <div className="admin-premium-avatar-wrap">
          <CAvatar className="admin-premium-avatar">{initial}</CAvatar>
        </div>
      </CDropdownToggle>

      <CDropdownMenu className="pt-0 admin-premium-dropdown-menu admin-premium-profile-menu">
        <CDropdownHeader className="admin-premium-dropdown-header">
          <div className="admin-premium-profile-summary">
            <div className="admin-premium-profile-summary__avatar">{initial}</div>
            <div className="admin-premium-profile-summary__content">
              <div className="admin-premium-profile-summary__name">
                {admin?.name || 'Admin'}
              </div>
              <small className="admin-premium-profile-summary__email">
                {admin?.email || 'admin@binatedigital.com'}
              </small>
            </div>
          </div>
        </CDropdownHeader>

        <CDropdownItem as={Link} to="/admin/profile" className="admin-premium-dropdown-item">
          <CIcon icon={cilUser} className="me-2" />
          My Profile
        </CDropdownItem>

        <CDropdownItem as={Link} to="/admin/settings" className="admin-premium-dropdown-item">
          <CIcon icon={cilSettings} className="me-2" />
          Account Settings
        </CDropdownItem>

        <CDropdownItem
          as={Link}
          to="/admin/change-password"
          className="admin-premium-dropdown-item"
        >
          <CIcon icon={cilLockLocked} className="me-2" />
          Change Password
        </CDropdownItem>

        <CDropdownDivider />

        <CDropdownItem
          className="admin-premium-dropdown-item text-danger"
          onClick={handleLogout}
        >
          <CIcon icon={cilAccountLogout} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown