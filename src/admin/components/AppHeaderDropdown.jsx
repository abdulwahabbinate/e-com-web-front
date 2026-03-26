import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  CAvatar,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CImage,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilUser,
  cilSettings,
  cilAccountLogout,
  cilLockLocked,
} from '@coreui/icons'
import { logoutAdmin } from '../store/slices/adminAuthSlice'

const AppHeaderDropdown = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { admin } = useSelector((state) => state.adminAuth)

  const fullName =
    `${admin?.first_name || ''} ${admin?.last_name || ''}`.trim() || 'Admin User'

  const initials = `${admin?.first_name?.charAt(0) || 'A'}${admin?.last_name?.charAt(0) || ''}`.toUpperCase()

  const handleLogout = () => {
    dispatch(logoutAdmin())
    navigate('/admin/login')
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle className="admin-premium-avatar-toggle" caret={false}>
        <div className="admin-premium-avatar-wrap">
          {admin?.avatar ? (
            <CImage
              src={admin.avatar}
              width={40}
              height={40}
              className="admin-premium-avatar object-fit-cover"
            />
          ) : (
            <CAvatar className="admin-premium-avatar">{initials || 'A'}</CAvatar>
          )}
        </div>
      </CDropdownToggle>

      <CDropdownMenu className="admin-premium-dropdown-menu admin-premium-profile-menu">
        <div className="admin-premium-dropdown-header">
          <div className="admin-premium-profile-summary">
            <div className="admin-premium-profile-summary__avatar">
              {admin?.avatar ? (
                <img
                  src={admin.avatar}
                  alt={fullName}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 'inherit',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                initials || 'A'
              )}
            </div>
            <div className="admin-premium-profile-summary__content">
              <div className="admin-premium-profile-summary__name">{fullName}</div>
              <span className="admin-premium-profile-summary__email">
                {admin?.email || '-'}
              </span>
            </div>
          </div>
        </div>

        <CDropdownItem
          className="admin-premium-dropdown-item"
          onClick={() => navigate('/admin/profile')}
        >
          <CIcon icon={cilUser} className="me-2" />
          My Profile
        </CDropdownItem>

        <CDropdownItem
          className="admin-premium-dropdown-item"
          onClick={() => navigate('/admin/settings')}
        >
          <CIcon icon={cilSettings} className="me-2" />
          Account Settings
        </CDropdownItem>

        <CDropdownItem
          className="admin-premium-dropdown-item"
          onClick={() => navigate('/admin/change-password')}
        >
          <CIcon icon={cilLockLocked} className="me-2" />
          Change Password
        </CDropdownItem>

        <CDropdownItem
          className="admin-premium-dropdown-item"
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