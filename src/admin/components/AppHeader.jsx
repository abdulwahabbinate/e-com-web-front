import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  useColorModes,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCheckCircle,
  cilContrast,
  cilMenu,
  cilMoon,
  cilSun,
} from '@coreui/icons'
import { setUi } from '../store/slices/uiSlice'
import AppBreadcrumb from './AppBreadcrumb'
import AppHeaderDropdown from './AppHeaderDropdown'

const AppHeader = () => {
  const headerRef = useRef(null)
  const dispatch = useDispatch()

  const { sidebarShow, theme } = useSelector((state) => state.adminUi)
  const { admin } = useSelector((state) => state.adminAuth)

  const { colorMode, setColorMode } = useColorModes('binatedigital-admin-theme')

  useEffect(() => {
    const handleScroll = () => {
      if (!headerRef.current) return
      headerRef.current.classList.toggle('header-shadow', document.documentElement.scrollTop > 0)
    }

    document.addEventListener('scroll', handleScroll)
    return () => document.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setColorMode(theme)
  }, [theme, setColorMode])

  const handleThemeChange = (mode) => {
    setColorMode(mode)
    dispatch(setUi({ theme: mode }))
  }

  return (
    <CHeader position="sticky" className="mb-4 admin-premium-header" ref={headerRef}>
      <CContainer fluid className="px-3">
        <div className="admin-premium-header__top d-flex align-items-center justify-content-between gap-2 w-100">
          <div className="d-flex align-items-center gap-2 gap-sm-3 min-w-0">
            <CHeaderToggler
              className="admin-premium-header__toggler"
              onClick={() => dispatch(setUi({ sidebarShow: !sidebarShow }))}
            >
              <CIcon icon={cilMenu} size="lg" />
            </CHeaderToggler>

            <div className="admin-premium-header__brand min-w-0">
              <div className="admin-premium-header__brand-icon">
                <span className="admin-premium-header__brand-text">EA</span>
              </div>

              <div className="min-w-0">
                <div className="admin-premium-header__title text-truncate">
                  E-Commerce Admin
                </div>
                <div className="admin-premium-header__subtitle text-truncate">
                  Welcome back, {admin?.name || 'Super Admin'}
                </div>
              </div>
            </div>
          </div>

          <CHeaderNav className="admin-premium-header__actions ms-auto">
            <CDropdown variant="nav-item" alignment="end">
              <CDropdownToggle caret={false} className="admin-premium-header__icon-btn">
                <CIcon icon={cilContrast} />
              </CDropdownToggle>

              <CDropdownMenu className="admin-premium-dropdown-menu">
                <CDropdownItem
                  className="admin-premium-dropdown-item"
                  onClick={() => handleThemeChange('light')}
                >
                  <div className="d-flex align-items-center justify-content-between w-100">
                    <span className="d-flex align-items-center gap-2">
                      <CIcon icon={cilSun} />
                      Light
                    </span>
                    {colorMode === 'light' && <CIcon icon={cilCheckCircle} />}
                  </div>
                </CDropdownItem>

                <CDropdownItem
                  className="admin-premium-dropdown-item"
                  onClick={() => handleThemeChange('dark')}
                >
                  <div className="d-flex align-items-center justify-content-between w-100">
                    <span className="d-flex align-items-center gap-2">
                      <CIcon icon={cilMoon} />
                      Dark
                    </span>
                    {colorMode === 'dark' && <CIcon icon={cilCheckCircle} />}
                  </div>
                </CDropdownItem>

                <CDropdownItem
                  className="admin-premium-dropdown-item"
                  onClick={() => handleThemeChange('auto')}
                >
                  <div className="d-flex align-items-center justify-content-between w-100">
                    <span className="d-flex align-items-center gap-2">
                      <CIcon icon={cilContrast} />
                      Auto
                    </span>
                    {colorMode === 'auto' && <CIcon icon={cilCheckCircle} />}
                  </div>
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown>

            <AppHeaderDropdown />
          </CHeaderNav>
        </div>

        <div className="admin-premium-header__bottom">
          <AppBreadcrumb />
        </div>
      </CContainer>
    </CHeader>
  )
}

export default AppHeader