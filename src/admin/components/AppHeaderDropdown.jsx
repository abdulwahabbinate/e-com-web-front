import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
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
import { cilLockLocked, cilSettings, cilUser } from '@coreui/icons'
import { logoutAdmin } from '../store/slices/authSlice'

const AppHeaderDropdown = () => {
  const dispatch = useDispatch()
  const { admin } = useSelector((state) => state.adminAuth)

  const initial = admin?.name?.charAt(0)?.toUpperCase() || 'A'

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle caret={false} className="py-0">
        <CAvatar color="primary" textColor="white">
          {initial}
        </CAvatar>
      </CDropdownToggle>

      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">
          {admin?.name || 'Admin'}
        </CDropdownHeader>

        <CDropdownItem as={Link} to="/admin/profile">
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>

        <CDropdownItem as={Link} to="/admin/settings">
          <CIcon icon={cilSettings} className="me-2" />
          Settings
        </CDropdownItem>

        <CDropdownDivider />

        <CDropdownItem onClick={() => dispatch(logoutAdmin())}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
