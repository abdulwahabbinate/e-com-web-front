import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilList,
  cilBasket,
  cilNotes,
  cilSettings,
  cilUser,
} from '@coreui/icons'
import { CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/admin/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Categories',
    to: '/admin/categories',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Products',
    to: '/admin/products',
    icon: <CIcon icon={cilBasket} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Content',
    to: '/admin/content',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Settings',
    to: '/admin/settings',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Profile',
    to: '/admin/profile',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
]

export default _nav
