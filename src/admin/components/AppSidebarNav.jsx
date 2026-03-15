import React from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'
import { CBadge, CNavLink, CSidebarNav } from '@coreui/react'

const AppSidebarNav = ({ items }) => {
  const renderNavLinkContent = (name, icon, badge, indent = false) => {
    return (
      <>
        {icon ? icon : indent && <span className="nav-icon" />}
        <span className="nav-label">{name}</span>
        {badge && (
          <CBadge color={badge.color} className="ms-auto nav-badge">
            {badge.text}
          </CBadge>
        )}
      </>
    )
  }

  const renderNavItem = (item, index, indent = false) => {
    const { component, name, badge, icon, ...rest } = item
    const Component = component

    return (
      <Component key={index}>
        {rest.to || rest.href ? (
          <CNavLink {...(rest.to && { as: NavLink })} {...rest}>
            {renderNavLinkContent(name, icon, badge, indent)}
          </CNavLink>
        ) : (
          renderNavLinkContent(name, icon, badge, indent)
        )}
      </Component>
    )
  }

  return (
    <CSidebarNav as={SimpleBar}>
      {items && items.map((item, index) => renderNavItem(item, index))}
    </CSidebarNav>
  )
}

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
}

export default AppSidebarNav
