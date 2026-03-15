import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import routes from '../routes'

const AppContent = () => {
  return (
    <CContainer fluid className="px-4">
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          {routes.map((route, idx) => (
            route.element && (
              <Route
                key={idx}
                path={route.path.replace('/admin/', '')}
                element={<route.element />}
              />
            )
          ))}
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
