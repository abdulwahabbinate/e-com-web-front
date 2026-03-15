import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  CRow,
  CCol,
  CWidgetStatsA,
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CBadge,
  CButtonGroup,
  CButton,
  CProgress,
} from '@coreui/react'
import { CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import {
  cilArrowTop,
  cilArrowBottom,
  cilList,
  cilBasket,
  cilPeople,
  cilCart,
} from '@coreui/icons'
import { fetchDashboard } from '../../store/slices/dashboardSlice'
import { fetchCategories } from '../../store/slices/categorySlice'
import { fetchProducts } from '../../store/slices/productSlice'

const Dashboard = () => {
  const dispatch = useDispatch()

  const { stats, loading } = useSelector((state) => state.dashboard)
  const { list: categories = [] } = useSelector((state) => state.categories)
  const { list: products = [] } = useSelector((state) => state.products)

  const [range, setRange] = useState('Month')

  useEffect(() => {
    dispatch(fetchDashboard())
    dispatch(fetchCategories())
    dispatch(fetchProducts())
  }, [dispatch])

  const totalCategories = stats?.totalCategories ?? categories.length ?? 0
  const totalProducts = stats?.totalProducts ?? products.length ?? 0
  const totalUsers = stats?.totalUsers ?? 0
  const totalOrders = stats?.totalOrders ?? 0

  const recentCategories = useMemo(() => {
    return [...categories]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
  }, [categories])

  const recentProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
  }, [products])

  const chartLabels =
    range === 'Day'
      ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      : range === 'Year'
      ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']

  const chartDataUsers =
    range === 'Day'
      ? [12, 18, 15, 22, 28, 25, 30]
      : range === 'Year'
      ? [40, 52, 46, 60, 72, 69, 81, 78, 90, 95, 88, 104]
      : [30, 90, 110, 70, 15, 25, 75]

  const chartDataOrders =
    range === 'Day'
      ? [8, 12, 10, 16, 18, 21, 20]
      : range === 'Year'
      ? [22, 35, 28, 40, 52, 48, 59, 62, 70, 74, 69, 80]
      : [70, 20, 75, 95, 65, 80, 30]

  return (
    <>
      <div className="dashboard-page-title-wrap mb-4">
        <h2 className="dashboard-page-title">Dashboard</h2>
        <p className="dashboard-page-subtitle mb-0">
          Overview of products, categories, orders and recent activity
        </p>
      </div>

      <CRow className="g-4 mb-4">
        <CCol sm={6} xl={3}>
          <CWidgetStatsA
            className="premium-widget-card"
            color="primary"
            value={
              <div className="d-flex align-items-center justify-content-between">
                <span>{totalUsers}</span>
                <span className="dashboard-widget-trend">
                  <CIcon icon={cilArrowTop} className="me-1" />
                  12.4%
                </span>
              </div>
            }
            title="Users"
            chart={
              <CChartLine
                className="mt-3 mx-3"
                style={{ height: '70px' }}
                data={{
                  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                  datasets: [
                    {
                      data: [12, 18, 16, 22, 28, 25, 31],
                      borderColor: 'rgba(255,255,255,.65)',
                      backgroundColor: 'transparent',
                      tension: 0.4,
                      pointRadius: 2,
                    },
                  ],
                }}
                options={{
                  plugins: { legend: { display: false } },
                  maintainAspectRatio: false,
                  scales: { x: { display: false }, y: { display: false } },
                  elements: { line: { borderWidth: 2 } },
                }}
              />
            }
          />
        </CCol>

        <CCol sm={6} xl={3}>
          <CWidgetStatsA
            className="premium-widget-card"
            color="info"
            value={
              <div className="d-flex align-items-center justify-content-between">
                <span>{totalProducts}</span>
                <span className="dashboard-widget-trend">
                  <CIcon icon={cilArrowTop} className="me-1" />
                  9.8%
                </span>
              </div>
            }
            title="Products"
            chart={
              <CChartLine
                className="mt-3 mx-3"
                style={{ height: '70px' }}
                data={{
                  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                  datasets: [
                    {
                      data: [8, 14, 20, 18, 24, 26, 30],
                      borderColor: 'rgba(255,255,255,.65)',
                      backgroundColor: 'transparent',
                      tension: 0.4,
                      pointRadius: 2,
                    },
                  ],
                }}
                options={{
                  plugins: { legend: { display: false } },
                  maintainAspectRatio: false,
                  scales: { x: { display: false }, y: { display: false } },
                  elements: { line: { borderWidth: 2 } },
                }}
              />
            }
          />
        </CCol>

        <CCol sm={6} xl={3}>
          <CWidgetStatsA
            className="premium-widget-card"
            color="warning"
            value={
              <div className="d-flex align-items-center justify-content-between">
                <span>{totalCategories}</span>
                <span className="dashboard-widget-trend">
                  <CIcon icon={cilArrowTop} className="me-1" />
                  6.2%
                </span>
              </div>
            }
            title="Categories"
            chart={
              <CChartLine
                className="mt-3 mx-3"
                style={{ height: '70px' }}
                data={{
                  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                  datasets: [
                    {
                      data: [3, 5, 7, 8, 9, 10, 12],
                      borderColor: 'rgba(255,255,255,.65)',
                      backgroundColor: 'transparent',
                      tension: 0.4,
                      pointRadius: 2,
                    },
                  ],
                }}
                options={{
                  plugins: { legend: { display: false } },
                  maintainAspectRatio: false,
                  scales: { x: { display: false }, y: { display: false } },
                  elements: { line: { borderWidth: 2 } },
                }}
              />
            }
          />
        </CCol>

        <CCol sm={6} xl={3}>
          <CWidgetStatsA
            className="premium-widget-card"
            color="danger"
            value={
              <div className="d-flex align-items-center justify-content-between">
                <span>{totalOrders}</span>
                <span className="dashboard-widget-trend">
                  <CIcon icon={cilArrowBottom} className="me-1" />
                  3.1%
                </span>
              </div>
            }
            title="Orders"
            chart={
              <CChartLine
                className="mt-3 mx-3"
                style={{ height: '70px' }}
                data={{
                  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                  datasets: [
                    {
                      data: [20, 18, 25, 28, 24, 21, 19],
                      borderColor: 'rgba(255,255,255,.65)',
                      backgroundColor: 'transparent',
                      tension: 0.4,
                      pointRadius: 2,
                    },
                  ],
                }}
                options={{
                  plugins: { legend: { display: false } },
                  maintainAspectRatio: false,
                  scales: { x: { display: false }, y: { display: false } },
                  elements: { line: { borderWidth: 2 } },
                }}
              />
            }
          />
        </CCol>
      </CRow>

      <CCard className="premium-dashboard-card mb-4 border-0 shadow-sm">
        <CCardHeader className="premium-dashboard-card-header d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <div className="fw-bold fs-4">Traffic Overview</div>
            <div className="text-medium-emphasis">Visual performance summary</div>
          </div>

          <CButtonGroup size="sm">
            <CButton
              color={range === 'Day' ? 'secondary' : 'outline-secondary'}
              onClick={() => setRange('Day')}
            >
              Day
            </CButton>
            <CButton
              color={range === 'Month' ? 'secondary' : 'outline-secondary'}
              onClick={() => setRange('Month')}
            >
              Month
            </CButton>
            <CButton
              color={range === 'Year' ? 'secondary' : 'outline-secondary'}
              onClick={() => setRange('Year')}
            >
              Year
            </CButton>
          </CButtonGroup>
        </CCardHeader>

        <CCardBody>
          <div className="dashboard-chart-wrap">
            <CChartLine
              data={{
                labels: chartLabels,
                datasets: [
                  {
                    label: 'Users',
                    data: chartDataUsers,
                    borderColor: '#4f46e5',
                    backgroundColor: 'rgba(79,70,229,0.08)',
                    fill: true,
                    tension: 0.4,
                  },
                  {
                    label: 'Orders',
                    data: chartDataOrders,
                    borderColor: '#0ea5e9',
                    backgroundColor: 'rgba(14,165,233,0.06)',
                    fill: true,
                    tension: 0.4,
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    position: 'top',
                  },
                },
              }}
            />
          </div>
        </CCardBody>
      </CCard>

      <CRow className="g-4">
        <CCol lg={6}>
          <CCard className="premium-dashboard-card border-0 shadow-sm h-100">
            <CCardHeader className="premium-dashboard-card-header d-flex align-items-center">
              <CIcon icon={cilList} className="me-2" />
              <strong>Recent Categories</strong>
            </CCardHeader>

            <CCardBody>
              <CTable hover responsive className="dashboard-mini-table">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Name</CTableHeaderCell>
                    <CTableHeaderCell>Section</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {recentCategories.length ? (
                    recentCategories.map((item) => (
                      <CTableRow key={item._id}>
                        <CTableDataCell>
                          <div className="fw-semibold">{item.name}</div>
                          <small className="text-medium-emphasis">{item.slug}</small>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={item.menu_section === 'retail' ? 'info' : 'warning'}>
                            {item.menu_section}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={item.is_active ? 'success' : 'secondary'}>
                            {item.is_active ? 'Active' : 'Inactive'}
                          </CBadge>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan={3} className="text-center">
                        {loading ? 'Loading...' : 'No categories found'}
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol lg={6}>
          <CCard className="premium-dashboard-card border-0 shadow-sm h-100">
            <CCardHeader className="premium-dashboard-card-header d-flex align-items-center">
              <CIcon icon={cilBasket} className="me-2" />
              <strong>Recent Products</strong>
            </CCardHeader>

            <CCardBody>
              <CTable hover responsive className="dashboard-mini-table">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Title</CTableHeaderCell>
                    <CTableHeaderCell>Price</CTableHeaderCell>
                    <CTableHeaderCell>Stock</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {recentProducts.length ? (
                    recentProducts.map((item) => (
                      <CTableRow key={item._id}>
                        <CTableDataCell>
                          <div className="fw-semibold">{item.title}</div>
                          <small className="text-medium-emphasis">{item.category_id?.name || '-'}</small>
                        </CTableDataCell>
                        <CTableDataCell>${item.price}</CTableDataCell>
                        <CTableDataCell>
                          <CProgress
                            thin
                            color={item.stock > 10 ? 'success' : item.stock > 0 ? 'warning' : 'danger'}
                            value={Math.min((item.stock / 25) * 100, 100)}
                            className="mb-1"
                          />
                          <small>{item.stock}</small>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan={3} className="text-center">
                        {loading ? 'Loading...' : 'No products found'}
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow className="g-4 mt-1">
        <CCol md={6} xl={3}>
          <CCard className="dashboard-summary-card border-0 shadow-sm">
            <CCardBody>
              <div className="dashboard-summary-icon bg-primary-subtle text-primary">
                <CIcon icon={cilPeople} size="xl" />
              </div>
              <div className="mt-3">
                <div className="dashboard-summary-title">User Growth</div>
                <div className="dashboard-summary-value">+12.4%</div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={6} xl={3}>
          <CCard className="dashboard-summary-card border-0 shadow-sm">
            <CCardBody>
              <div className="dashboard-summary-icon bg-info-subtle text-info">
                <CIcon icon={cilBasket} size="xl" />
              </div>
              <div className="mt-3">
                <div className="dashboard-summary-title">Product Growth</div>
                <div className="dashboard-summary-value">+9.8%</div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={6} xl={3}>
          <CCard className="dashboard-summary-card border-0 shadow-sm">
            <CCardBody>
              <div className="dashboard-summary-icon bg-warning-subtle text-warning">
                <CIcon icon={cilList} size="xl" />
              </div>
              <div className="mt-3">
                <div className="dashboard-summary-title">Category Growth</div>
                <div className="dashboard-summary-value">+6.2%</div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={6} xl={3}>
          <CCard className="dashboard-summary-card border-0 shadow-sm">
            <CCardBody>
              <div className="dashboard-summary-icon bg-danger-subtle text-danger">
                <CIcon icon={cilCart} size="xl" />
              </div>
              <div className="mt-3">
                <div className="dashboard-summary-title">Order Trend</div>
                <div className="dashboard-summary-value">-3.1%</div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
