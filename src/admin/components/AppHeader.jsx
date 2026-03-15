import React, { useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
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
  CNavItem,
  CNavLink,
  useColorModes,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilContrast,
  cilEnvelopeOpen,
  cilList,
  cilMenu,
  cilMoon,
  cilSun,
  cilCheckCircle,
} from '@coreui/icons'
import { setUi } from '../store/slices/uiSlice'
import AppBreadcrumb from './AppBreadcrumb'
import AppHeaderDropdown from './AppHeaderDropdown'

const AppHeader = () => {
  const headerRef = useRef()
  const dispatch = useDispatch()
  const { sidebarShow, theme } = useSelector((state) => state.adminUi)
  const { colorMode, setColorMode } = useColorModes('binatedigital-admin-theme')

  useEffect(() => {
    const onScroll = () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    }

    document.addEventListener('scroll', onScroll)
    return () => document.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setColorMode(theme)
  }, [theme, setColorMode])

  const handleThemeChange = (mode) => {
    setColorMode(mode)
    dispatch(setUi({ theme: mode }))
  }

  return (
    <CHeader position="sticky" className="mb-0 p-0 premium-header" ref={headerRef}>
      <CContainer fluid className="border-bottom px-4 premium-header-top">
        <CHeaderToggler
          onClick={() => dispatch(setUi({ sidebarShow: !sidebarShow }))}
          style={{ marginInlineStart: '-14px' }}
          className="premium-header-toggler"
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>

        <CHeaderNav className="d-none d-md-flex me-auto premium-top-links">
          <CNavItem>
            <CNavLink as={NavLink} to="/admin/dashboard">Dashboard</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink as={NavLink} to="/admin/categories">Categories</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink as={NavLink} to="/admin/settings">Settings</CNavLink>
          </CNavItem>
        </CHeaderNav>

        <CHeaderNav className="premium-header-icons">
          <CNavItem>
            <CNavLink href="#"><CIcon icon={cilBell} size="lg" /></CNavLink>
          </CNavItem>

          <CNavItem>
            <CNavLink href="#"><CIcon icon={cilList} size="lg" /></CNavLink>
          </CNavItem>

          <CNavItem>
            <CNavLink href="#"><CIcon icon={cilEnvelopeOpen} size="lg" /></CNavLink>
          </CNavItem>

          <CDropdown variant="nav-item">
            <CDropdownToggle caret={false} className="premium-theme-toggle">
              <CIcon
                icon={
                  colorMode === 'dark'
                    ? cilMoon
                    : colorMode === 'auto'
                    ? cilContrast
                    : cilSun
                }
                size="lg"
              />
            </CDropdownToggle>

            <CDropdownMenu placement="bottom-end" className="premium-theme-menu">
              <CDropdownItem
                active={colorMode === 'light'}
                onClick={() => handleThemeChange('light')}
                className="premium-theme-item"
              >
                <CIcon icon={cilSun} className="me-2" />
                Light
                {colorMode === 'light' && <CIcon icon={cilCheckCircle} className="ms-auto" />}
              </CDropdownItem>

              <CDropdownItem
                active={colorMode === 'dark'}
                onClick={() => handleThemeChange('dark')}
                className="premium-theme-item"
              >
                <CIcon icon={cilMoon} className="me-2" />
                Dark
                {colorMode === 'dark' && <CIcon icon={cilCheckCircle} className="ms-auto" />}
              </CDropdownItem>

              <CDropdownItem
                active={colorMode === 'auto'}
                onClick={() => handleThemeChange('auto')}
                className="premium-theme-item"
              >
                <CIcon icon={cilContrast} className="me-2" />
                Auto
                {colorMode === 'auto' && <CIcon icon={cilCheckCircle} className="ms-auto" />}
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>

          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>

      <CContainer fluid className="px-4 premium-breadcrumb-wrap">
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
