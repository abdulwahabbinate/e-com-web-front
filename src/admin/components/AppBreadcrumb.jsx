import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'
import routes from '../routes'

const AppBreadcrumb = () => {
  const currentLocation = useLocation().pathname

  const getRouteName = (pathname, routes) => {
    const currentRoute = routes.find((route) => route.path === pathname)
    return currentRoute ? currentRoute.name : false
  }

  const getBreadcrumbs = (location) => {
    const breadcrumbs = []
    location.split('/').reduce((prev, curr, index, array) => {
      const currentPathname = `${prev}/${curr}`
      const routeName = getRouteName(currentPathname, routes)

      if (routeName) {
        breadcrumbs.push({
          pathname: currentPathname,
          name: routeName,
          active: index + 1 === array.length,
        })
      }
      return currentPathname
    })
    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs(currentLocation)

  return (
    <CBreadcrumb className="my-0">
      <CBreadcrumbItem>
        <Link to="/admin/dashboard">Home</Link>
      </CBreadcrumbItem>

      {breadcrumbs.map((breadcrumb, index) => (
        <CBreadcrumbItem key={index} active={breadcrumb.active}>
          {breadcrumb.active ? breadcrumb.name : (
            <Link to={breadcrumb.pathname}>{breadcrumb.name}</Link>
          )}
        </CBreadcrumbItem>
      ))}
    </CBreadcrumb>
  )
}

export default React.memo(AppBreadcrumb)
