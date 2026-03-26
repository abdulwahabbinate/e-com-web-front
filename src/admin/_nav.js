import React from "react";
import CIcon from "@coreui/icons-react";
import {
  cilSpeedometer,
  cilHome,
  cilDescription,
  cilPhone,
  cilList,
  cilBasket,
  cilEnvelopeOpen,
  cilNotes,
  cilSettings,
  cilUser,
} from "@coreui/icons";
import { CNavItem } from "@coreui/react";

const _nav = [
  {
    component: CNavItem,
    name: "Dashboard",
    to: "/admin/dashboard",
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Home Page CMS",
    to: "/admin/home-page-content",
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "About Page CMS",
    to: "/admin/about-page-content",
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Contact Page CMS",
    to: "/admin/contact-page-content",
    icon: <CIcon icon={cilPhone} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Categories",
    to: "/admin/categories",
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Products",
    to: "/admin/products",
    icon: <CIcon icon={cilBasket} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Contact Messages",
    to: "/admin/contact-messages",
    icon: <CIcon icon={cilEnvelopeOpen} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Content",
    to: "/admin/content",
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Settings",
    to: "/admin/settings",
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Profile",
    to: "/admin/profile",
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
];

export default _nav;
