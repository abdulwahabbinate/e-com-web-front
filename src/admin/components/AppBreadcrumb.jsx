import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CBreadcrumb, CBreadcrumbItem, CContainer } from '@coreui/react'
import routes from '../routes'

const getRouteName = (pathname, routes) => {
  const currentRoute = routes.find((route) => route.path === pathname)
  return currentRoute ? currentRoute.name : false
}

const getBreadcrumbs = (location, routes) => {
  const breadcrumbs = []
  location.pathname.split('/').reduce((prev, curr, index, array) => {
    const currentPath = `${prev}/${curr}`
    const routeName = getRouteName(currentPath, routes)

    if (routeName) {
      breadcrumbs.push({
        pathname: currentPath,
        name: routeName,
        active: index + 1 === array.length,
      })
    }
    return currentPath
  })

  return breadcrumbs
}

const AppBreadcrumb = () => {
  const currentLocation = useLocation()
  const breadcrumbs = getBreadcrumbs(currentLocation, routes)

  return (
    <CContainer fluid className="px-0">
      <CBreadcrumb className="m-0 admin-premium-breadcrumb">
        <CBreadcrumbItem>
          <Link to="/admin/dashboard">Home</Link>
        </CBreadcrumbItem>

        {breadcrumbs.map((breadcrumb, index) =>
          breadcrumb.active ? (
            <CBreadcrumbItem active key={index}>
              {breadcrumb.name}
            </CBreadcrumbItem>
          ) : (
            <CBreadcrumbItem key={index}>
              <Link to={breadcrumb.pathname}>{breadcrumb.name}</Link>
            </CBreadcrumbItem>
          ),
        )}
      </CBreadcrumb>
    </CContainer>
  )
}

export default React.memo(AppBreadcrumb)