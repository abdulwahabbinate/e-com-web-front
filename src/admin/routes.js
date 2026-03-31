import React from "react";
import ProfilePage from "./views/profile/ProfilePage";
import ChangePassword from "./views/profile/ChangePassword";

const Dashboard = React.lazy(() => import("./views/dashboard/Dashboard"));
const HomePageContent = React.lazy(() => import("./views/homePage/HomePageContent"));
const AboutPageContent = React.lazy(() => import('./views/about-page/AboutPageContent'))
const ContactPageContent = React.lazy(() => import('./views/contact-page/ContactPageContent'))
const CategoriesList = React.lazy(() => import("./views/categories/CategoriesList"),);
const ProductsList = React.lazy(() => import("./views/products/ProductsList"));
const OrdersList = React.lazy(() => import("./views/orders/OrdersList"));
const ContactMessagesList = React.lazy(() => import('./views/contact-messages/ContactMessagesList'))
const PaymentSettings = React.lazy(() => import('./views/payment-settings/PaymentSettings'))
const ContentList = React.lazy(() => import("./views/content/ContentList"));
const Settings = React.lazy(() => import("./views/settings/Settings"));

const routes = [
  { path: "/admin/dashboard", name: "Dashboard", element: Dashboard },
  { path: "/admin/home-page-content", name: "Home Page CMS", element: HomePageContent },
  { path: '/about-page-content', name: 'About Page CMS', element: AboutPageContent, },
  { path: '/contact-page-content', name: 'Contact Page CMS', element: ContactPageContent, },
  { path: "/admin/categories", name: "Categories", element: CategoriesList },
  { path: "/admin/products", name: "Products", element: ProductsList },
  { path: "/admin/orders", name: "Orders", element: OrdersList },
  { path: '/admin/contact-messages', name: 'Contact Messages', element: ContactMessagesList, },
  { path: '/admin/payment-settings', name: 'Payment Settings', element: PaymentSettings },
  { path: "/admin/content", name: "Content", element: ContentList },
  { path: "/admin/settings", name: "Settings", element: Settings },
  { path: "/admin/profile", name: "Profile", element: ProfilePage },
  { path: "/admin/change-password", name: "Change Password", element: ChangePassword, },
];

export default routes;