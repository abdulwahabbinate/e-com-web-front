import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const CategoriesList = React.lazy(() => import('./views/categories/CategoriesList'))
const ProductsList = React.lazy(() => import('./views/products/ProductsList'))
const ContentList = React.lazy(() => import('./views/content/ContentList'))
const Settings = React.lazy(() => import('./views/settings/Settings'))
const Profile = React.lazy(() => import('./views/profile/Profile'))

const routes = [
  { path: '/admin/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/admin/categories', name: 'Categories', element: CategoriesList },
  { path: '/admin/products', name: 'Products', element: ProductsList },
  { path: '/admin/content', name: 'Content', element: ContentList },
  { path: '/admin/settings', name: 'Settings', element: Settings },
  { path: '/admin/profile', name: 'Profile', element: Profile },
]

export default routes
