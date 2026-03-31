import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'
import Swal from 'sweetalert2'
import CIcon from '@coreui/icons-react'
import {
  cilArrowTop,
  cilCart,
  cilCreditCard,
  cilDescription,
  cilEnvelopeClosed,
  cilNotes,
  cilPhone,
  cilSwapVertical,
  cilUser,
  cilZoom,
} from '@coreui/icons'
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CPagination,
  CPaginationItem,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import {
  clearOrderError,
  clearSelectedOrder,
  fetchOrder,
  fetchOrders,
  updateOrderStatus,
} from '../../store/slices/orderSlice'

const toastAlert = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true,
})

const getResolvedDarkMode = () => {
  const theme = document.documentElement.getAttribute('data-coreui-theme')

  if (theme === 'dark') return true
  if (theme === 'light') return false

  return window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
}

const getSelectStyles = (isDark = false) => ({
  control: (base, state) => ({
    ...base,
    minHeight: 46,
    height: 46,
    borderRadius: 12,
    borderColor: state.isFocused
      ? '#8b5cf6'
      : isDark
      ? 'rgba(255,255,255,0.08)'
      : '#dbe3f0',
    backgroundColor: isDark ? '#111827' : '#ffffff',
    boxShadow: state.isFocused
      ? '0 0 0 0.2rem rgba(111, 66, 193, 0.16)'
      : isDark
      ? '0 4px 14px rgba(0, 0, 0, 0.22)'
      : '0 4px 14px rgba(15, 23, 42, 0.05)',
    '&:hover': {
      borderColor: state.isFocused
        ? '#8b5cf6'
        : isDark
        ? 'rgba(255,255,255,0.14)'
        : '#dbe3f0',
    },
    transition: 'all 0.25s ease',
    paddingLeft: 4,
    cursor: 'pointer',
  }),
  valueContainer: (base) => ({
    ...base,
    padding: '0 10px',
    height: 46,
    display: 'flex',
    alignItems: 'center',
  }),
  placeholder: (base) => ({
    ...base,
    color: isDark ? '#94a3b8' : '#64748b',
    fontWeight: 500,
  }),
  singleValue: (base) => ({
    ...base,
    color: isDark ? '#e5e7eb' : '#334155',
    fontWeight: 500,
  }),
  input: (base) => ({
    ...base,
    color: isDark ? '#e5e7eb' : '#334155',
    margin: 0,
    padding: 0,
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  dropdownIndicator: (base, state) => ({
    ...base,
    color: isDark ? '#94a3b8' : '#475569',
    paddingRight: 12,
    transition: 'all 0.2s ease',
    transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    '&:hover': {
      color: '#6366f1',
    },
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
  menu: (base) => ({
    ...base,
    marginTop: 8,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: isDark ? '#111827' : '#ffffff',
    border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #dbe3f0',
    boxShadow: isDark
      ? '0 16px 34px rgba(0,0,0,0.35)'
      : '0 12px 30px rgba(15, 23, 42, 0.12)',
    padding: 6,
  }),
  menuList: (base) => ({
    ...base,
    padding: 0,
  }),
  option: (base, state) => ({
    ...base,
    borderRadius: 10,
    marginBottom: 4,
    padding: '12px 14px',
    backgroundColor: state.isSelected
      ? isDark
        ? 'rgba(99,102,241,0.22)'
        : '#eef2ff'
      : state.isFocused
      ? isDark
        ? '#1f2937'
        : '#f8fafc'
      : 'transparent',
    color: isDark ? '#e5e7eb' : '#334155',
    fontWeight: 500,
    cursor: 'pointer',
  }),
})

const orderStatusOptions = [
  { value: 'all', label: 'All Order Statuses' },
  { value: 'placed', label: 'Placed' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

const paymentStatusOptions = [
  { value: 'all', label: 'All Payment Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'failed', label: 'Failed' },
]

const paymentMethodOptions = [
  { value: 'all', label: 'All Payment Methods' },
  { value: 'card', label: 'Card' },
  { value: 'cod', label: 'Cash on Delivery' },
]

const perPageOptions = [
  { value: 5, label: '5' },
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 50, label: '50' },
]

const OrdersList = () => {
  const dispatch = useDispatch()
  const { list, selectedItem, loading, error } = useSelector((state) => state.orders)

  const [isDark, setIsDark] = useState(false)
  const [viewVisible, setViewVisible] = useState(false)
  const [search, setSearch] = useState('')
  const [orderStatusFilter, setOrderStatusFilter] = useState('all')
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all')
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [editOrderStatus, setEditOrderStatus] = useState('placed')
  const [editPaymentStatus, setEditPaymentStatus] = useState('pending')
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'desc',
  })

  useEffect(() => {
    dispatch(fetchOrders())
  }, [dispatch])

  useEffect(() => {
    setIsDark(getResolvedDarkMode())

    const observer = new MutationObserver(() => {
      setIsDark(getResolvedDarkMode())
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-coreui-theme'],
    })

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleMediaChange = () => setIsDark(getResolvedDarkMode())

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaChange)
    } else {
      mediaQuery.addListener(handleMediaChange)
    }

    return () => {
      observer.disconnect()
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMediaChange)
      } else {
        mediaQuery.removeListener(handleMediaChange)
      }
    }
  }, [])

  useEffect(() => {
    if (error?.message) {
      toastAlert.fire({
        icon: 'error',
        title: error.message,
      })
      dispatch(clearOrderError())
    }
  }, [error, dispatch])

  const getCustomerFullName = (order) => {
    const firstName = order?.customer?.first_name || ''
    const lastName = order?.customer?.last_name || ''
    return `${firstName} ${lastName}`.trim() || 'N/A'
  }

  const formatCurrency = (value) => `$${Number(value || 0).toFixed(2)}`

  const formatOrderStatusLabel = (status) => {
    if (status === 'placed') return 'Placed'
    if (status === 'processing') return 'Processing'
    if (status === 'shipped') return 'Shipped'
    if (status === 'delivered') return 'Delivered'
    if (status === 'cancelled') return 'Cancelled'
    return 'Unknown'
  }

  const formatPaymentStatusLabel = (status) => {
    if (status === 'pending') return 'Pending'
    if (status === 'paid') return 'Paid'
    if (status === 'failed') return 'Failed'
    return 'Unknown'
  }

  const formatPaymentMethodLabel = (method) => {
    if (method === 'card') return 'Card'
    if (method === 'cod') return 'Cash on Delivery'
    return '-'
  }

  const getOrderStatusBadge = (status) => {
    if (status === 'placed') return 'primary'
    if (status === 'processing') return 'warning'
    if (status === 'shipped') return 'info'
    if (status === 'delivered') return 'success'
    if (status === 'cancelled') return 'danger'
    return 'secondary'
  }

  const getPaymentStatusBadge = (status) => {
    if (status === 'pending') return 'warning'
    if (status === 'paid') return 'success'
    if (status === 'failed') return 'danger'
    return 'secondary'
  }

  const handleSort = (key) => {
    setCurrentPage(1)
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const getSortValue = (item, key) => {
    switch (key) {
      case 'order_number':
        return item.order_number || ''
      case 'customer_name':
        return getCustomerFullName(item)
      case 'total':
        return Number(item.total || 0)
      case 'payment_status':
        return item.payment_status || ''
      case 'order_status':
        return item.order_status || ''
      case 'createdAt':
        return item.createdAt ? new Date(item.createdAt).getTime() : 0
      default:
        return item[key] || ''
    }
  }

  const filteredAndSortedList = useMemo(() => {
    let data = [...(list || [])]

    if (search.trim()) {
      const q = search.toLowerCase()

      data = data.filter(
        (item) =>
          item.order_number?.toLowerCase().includes(q) ||
          getCustomerFullName(item).toLowerCase().includes(q) ||
          item.customer?.email?.toLowerCase().includes(q) ||
          item.customer?.phone?.toLowerCase().includes(q) ||
          item.customer?.city?.toLowerCase().includes(q) ||
          item.customer?.country?.toLowerCase().includes(q) ||
          item.payment_method?.toLowerCase().includes(q) ||
          item.payment_status?.toLowerCase().includes(q) ||
          item.order_status?.toLowerCase().includes(q) ||
          item.items?.some((product) => product.title?.toLowerCase().includes(q)),
      )
    }

    if (orderStatusFilter !== 'all') {
      data = data.filter((item) => item.order_status === orderStatusFilter)
    }

    if (paymentStatusFilter !== 'all') {
      data = data.filter((item) => item.payment_status === paymentStatusFilter)
    }

    if (paymentMethodFilter !== 'all') {
      data = data.filter((item) => item.payment_method === paymentMethodFilter)
    }

    data.sort((a, b) => {
      const aValue = getSortValue(a, sortConfig.key)
      const bValue = getSortValue(b, sortConfig.key)

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue
      }

      const result = String(aValue).localeCompare(String(bValue), undefined, {
        numeric: true,
        sensitivity: 'base',
      })

      return sortConfig.direction === 'asc' ? result : -result
    })

    return data
  }, [list, search, orderStatusFilter, paymentStatusFilter, paymentMethodFilter, sortConfig])

  const stats = useMemo(() => {
    const totalOrders = list?.length || 0
    const paidOrders = list?.filter((item) => item.payment_status === 'paid').length || 0
    const codOrders = list?.filter((item) => item.payment_method === 'cod').length || 0
    const totalRevenue =
      list
        ?.filter((item) => item.payment_status === 'paid')
        .reduce((sum, item) => sum + Number(item.total || 0), 0) || 0

    return {
      totalOrders,
      paidOrders,
      codOrders,
      totalRevenue,
    }
  }, [list])

  const totalPages = Math.ceil(filteredAndSortedList.length / itemsPerPage) || 1
  const paginatedList = filteredAndSortedList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const handleOpenViewModal = async (id) => {
    const result = await dispatch(fetchOrder(id))

    if (result.meta.requestStatus === 'fulfilled') {
      const order = result.payload?.data || null
      setEditOrderStatus(order?.order_status || 'placed')
      setEditPaymentStatus(order?.payment_status || 'pending')
      setViewVisible(true)
    }
  }

  const handleSaveStatuses = async () => {
    if (!selectedItem?._id) return

    const result = await dispatch(
      updateOrderStatus({
        id: selectedItem._id,
        payload: {
          order_status: editOrderStatus,
          payment_status: editPaymentStatus,
        },
      }),
    )

    if (result.meta.requestStatus === 'fulfilled') {
      toastAlert.fire({
        icon: 'success',
        title: 'Order status updated successfully',
      })
    } else {
      toastAlert.fire({
        icon: 'error',
        title: result?.payload?.message || 'Order status update failed',
      })
    }
  }

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <CIcon icon={cilSwapVertical} className="premium-sort-icon inactive" />
    }

    return (
      <CIcon
        icon={cilArrowTop}
        className={`premium-sort-icon ${sortConfig.direction === 'desc' ? 'desc' : ''}`}
      />
    )
  }

  const paginationItems = useMemo(() => {
    const pages = []
    const maxVisible = 5
    let start = Math.max(1, currentPage - 2)
    let end = Math.min(totalPages, start + maxVisible - 1)

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i += 1) {
      pages.push(i)
    }

    return pages
  }, [currentPage, totalPages])

  return (
    <>
      <CRow className="g-3 mb-4">
        <CCol xs={12} sm={6} xl={3}>
          <CCard className="dashboard-summary-card shadow-sm border-0 h-100">
            <CCardBody className="d-flex align-items-center gap-3">
              <div className="dashboard-summary-icon bg-primary-subtle text-primary">
                <CIcon icon={cilCart} size="lg" />
              </div>
              <div>
                <div className="dashboard-summary-title">Total Orders</div>
                <div className="dashboard-summary-value">{stats.totalOrders}</div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xs={12} sm={6} xl={3}>
          <CCard className="dashboard-summary-card shadow-sm border-0 h-100">
            <CCardBody className="d-flex align-items-center gap-3">
              <div className="dashboard-summary-icon bg-success-subtle text-success">
                <CIcon icon={cilCreditCard} size="lg" />
              </div>
              <div>
                <div className="dashboard-summary-title">Paid Orders</div>
                <div className="dashboard-summary-value">{stats.paidOrders}</div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xs={12} sm={6} xl={3}>
          <CCard className="dashboard-summary-card shadow-sm border-0 h-100">
            <CCardBody className="d-flex align-items-center gap-3">
              <div className="dashboard-summary-icon bg-secondary-subtle text-secondary">
                <CIcon icon={cilDescription} size="lg" />
              </div>
              <div>
                <div className="dashboard-summary-title">COD Orders</div>
                <div className="dashboard-summary-value">{stats.codOrders}</div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xs={12} sm={6} xl={3}>
          <CCard className="dashboard-summary-card shadow-sm border-0 h-100">
            <CCardBody className="d-flex align-items-center gap-3">
              <div className="dashboard-summary-icon bg-warning-subtle text-warning">
                <CIcon icon={cilNotes} size="lg" />
              </div>
              <div>
                <div className="dashboard-summary-title">Revenue</div>
                <div className="dashboard-summary-value">{formatCurrency(stats.totalRevenue)}</div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CCard className="shadow-sm border-0 premium-table-card">
        <CCardHeader className="d-flex justify-content-between align-items-center premium-card-header flex-wrap gap-3">
          <div>
            <strong className="fs-5">Orders</strong>
            <div className="text-medium-emphasis small">
              Manage all customer orders and payment statuses
            </div>
          </div>
        </CCardHeader>

        <CCardBody>
          <CRow className="mb-4 g-3 align-items-center">
            <CCol xs={12} lg={4}>
              <CFormInput
                className="premium-input"
                placeholder="Search by order no, customer, email, city, phone or product"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </CCol>

            <CCol xs={12} sm={6} lg={2}>
              <Select
                classNamePrefix="premium-react-select"
                options={orderStatusOptions}
                value={orderStatusOptions.find((opt) => opt.value === orderStatusFilter)}
                onChange={(selected) => {
                  setOrderStatusFilter(selected?.value || 'all')
                  setCurrentPage(1)
                }}
                isSearchable={false}
                styles={getSelectStyles(isDark)}
                menuPortalTarget={document.body}
              />
            </CCol>

            <CCol xs={12} sm={6} lg={2}>
              <Select
                classNamePrefix="premium-react-select"
                options={paymentStatusOptions}
                value={paymentStatusOptions.find((opt) => opt.value === paymentStatusFilter)}
                onChange={(selected) => {
                  setPaymentStatusFilter(selected?.value || 'all')
                  setCurrentPage(1)
                }}
                isSearchable={false}
                styles={getSelectStyles(isDark)}
                menuPortalTarget={document.body}
              />
            </CCol>

            <CCol xs={12} sm={6} lg={2}>
              <Select
                classNamePrefix="premium-react-select"
                options={paymentMethodOptions}
                value={paymentMethodOptions.find((opt) => opt.value === paymentMethodFilter)}
                onChange={(selected) => {
                  setPaymentMethodFilter(selected?.value || 'all')
                  setCurrentPage(1)
                }}
                isSearchable={false}
                styles={getSelectStyles(isDark)}
                menuPortalTarget={document.body}
              />
            </CCol>

            <CCol xs={12} sm={6} lg={2}>
              <div className="premium-per-page-wrap justify-content-start justify-content-lg-end">
                <span className="premium-per-page-label">Items:</span>
                <div className="premium-per-page-select">
                  <Select
                    classNamePrefix="premium-react-select"
                    options={perPageOptions}
                    value={perPageOptions.find((opt) => opt.value === itemsPerPage)}
                    onChange={(selected) => {
                      setItemsPerPage(selected?.value || 10)
                      setCurrentPage(1)
                    }}
                    isSearchable={false}
                    styles={getSelectStyles(isDark)}
                    menuPortalTarget={document.body}
                  />
                </div>
              </div>
            </CCol>
          </CRow>

          <CTable hover responsive align="middle" className="premium-table premium-sortable-table">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>

                <CTableHeaderCell
                  className="premium-sortable-header"
                  onClick={() => handleSort('order_number')}
                >
                  <div className="premium-sortable-header__inner">
                    <span>Order No</span>
                    {renderSortIcon('order_number')}
                  </div>
                </CTableHeaderCell>

                <CTableHeaderCell
                  className="premium-sortable-header"
                  onClick={() => handleSort('customer_name')}
                >
                  <div className="premium-sortable-header__inner">
                    <span>Customer</span>
                    {renderSortIcon('customer_name')}
                  </div>
                </CTableHeaderCell>

                <CTableHeaderCell>Items</CTableHeaderCell>

                <CTableHeaderCell
                  className="premium-sortable-header"
                  onClick={() => handleSort('total')}
                >
                  <div className="premium-sortable-header__inner">
                    <span>Total</span>
                    {renderSortIcon('total')}
                  </div>
                </CTableHeaderCell>

                <CTableHeaderCell
                  className="premium-sortable-header"
                  onClick={() => handleSort('payment_status')}
                >
                  <div className="premium-sortable-header__inner">
                    <span>Payment</span>
                    {renderSortIcon('payment_status')}
                  </div>
                </CTableHeaderCell>

                <CTableHeaderCell
                  className="premium-sortable-header"
                  onClick={() => handleSort('order_status')}
                >
                  <div className="premium-sortable-header__inner">
                    <span>Order Status</span>
                    {renderSortIcon('order_status')}
                  </div>
                </CTableHeaderCell>

                <CTableHeaderCell
                  className="premium-sortable-header"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="premium-sortable-header__inner">
                    <span>Date</span>
                    {renderSortIcon('createdAt')}
                  </div>
                </CTableHeaderCell>

                <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <CTableBody>
              {paginatedList.length ? (
                paginatedList.map((item, index) => (
                  <CTableRow key={item._id}>
                    <CTableDataCell className="fw-semibold">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </CTableDataCell>

                    <CTableDataCell>
                      <div className="fw-semibold">{item.order_number}</div>
                      <small className="text-medium-emphasis">
                        {formatPaymentMethodLabel(item.payment_method)}
                      </small>
                    </CTableDataCell>

                    <CTableDataCell>
                      <div className="fw-semibold">{getCustomerFullName(item)}</div>
                      <small className="text-medium-emphasis">{item.customer?.email}</small>
                    </CTableDataCell>

                    <CTableDataCell>
                      <div className="fw-semibold">{item.total_items || 0} item(s)</div>
                      <small className="text-medium-emphasis">
                        {item.items?.length
                          ? item.items
                              .slice(0, 2)
                              .map((product) => product.title)
                              .join(', ')
                          : 'No products'}
                        {item.items?.length > 2 ? '...' : ''}
                      </small>
                    </CTableDataCell>

                    <CTableDataCell>{formatCurrency(item.total)}</CTableDataCell>

                    <CTableDataCell>
                      <div className="d-flex flex-column gap-1">
                        <CBadge color={getPaymentStatusBadge(item.payment_status)}>
                          {formatPaymentStatusLabel(item.payment_status)}
                        </CBadge>
                        <small className="text-medium-emphasis">
                          {formatPaymentMethodLabel(item.payment_method)}
                        </small>
                      </div>
                    </CTableDataCell>

                    <CTableDataCell>
                      <CBadge color={getOrderStatusBadge(item.order_status)}>
                        {formatOrderStatusLabel(item.order_status)}
                      </CBadge>
                    </CTableDataCell>

                    <CTableDataCell>
                      {item.createdAt ? new Date(item.createdAt).toLocaleString() : '-'}
                    </CTableDataCell>

                    <CTableDataCell className="text-center">
                      <div className="premium-actions-group">
                        <CButton
                          color="light"
                          size="sm"
                          className="premium-action-btn border"
                          onClick={() => handleOpenViewModal(item._id)}
                        >
                          <CIcon icon={cilZoom} className="me-1" />
                          View
                        </CButton>
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan={8} className="text-center py-4">
                    {loading ? 'Loading...' : 'No orders found'}
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>

          {totalPages > 1 && (
            <div className="premium-pagination-wrap">
              <CPagination className="mb-0 premium-pagination">
                <CPaginationItem
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                >
                  «
                </CPaginationItem>

                <CPaginationItem
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  ‹
                </CPaginationItem>

                {paginationItems.map((page) => (
                  <CPaginationItem
                    key={page}
                    active={page === currentPage}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </CPaginationItem>
                ))}

                <CPaginationItem
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  ›
                </CPaginationItem>

                <CPaginationItem
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                >
                  »
                </CPaginationItem>
              </CPagination>
            </div>
          )}
        </CCardBody>
      </CCard>

      <CModal
        size="xl"
        visible={viewVisible}
        onClose={() => {
          setViewVisible(false)
          dispatch(clearSelectedOrder())
        }}
      >
        <CModalHeader>
          <CModalTitle>Order Details</CModalTitle>
        </CModalHeader>

        <CModalBody>
          {loading && !selectedItem ? (
            <div className="text-center py-4">
              <CSpinner />
            </div>
          ) : selectedItem ? (
            <>
              <CRow className="g-3 mb-4">
                <CCol xs={12} md={6} lg={4}>
                  <div className="profile-info-block">
                    <div className="profile-info-label d-flex align-items-center gap-2">
                      <CIcon icon={cilDescription} />
                      Order Number
                    </div>
                    <div className="profile-info-value">{selectedItem.order_number}</div>
                  </div>
                </CCol>

                <CCol xs={12} md={6} lg={4}>
                  <div className="profile-info-block">
                    <div className="profile-info-label d-flex align-items-center gap-2">
                      <CIcon icon={cilCreditCard} />
                      Payment Method
                    </div>
                    <div className="profile-info-value">
                      {formatPaymentMethodLabel(selectedItem.payment_method)}
                    </div>
                  </div>
                </CCol>

                <CCol xs={12} md={6} lg={4}>
                  <div className="profile-info-block">
                    <div className="profile-info-label">Stripe Payment Intent</div>
                    <div className="profile-info-value">
                      {selectedItem.stripe_payment_intent_id || '-'}
                    </div>
                  </div>
                </CCol>
              </CRow>

              <CRow className="g-3 mb-4">
                <CCol xs={12} md={6}>
                  <div className="profile-info-block">
                    <div className="profile-info-label">Order Status</div>
                    <Select
                      classNamePrefix="premium-react-select"
                      options={orderStatusOptions.filter((item) => item.value !== 'all')}
                      value={orderStatusOptions
                        .filter((item) => item.value !== 'all')
                        .find((opt) => opt.value === editOrderStatus)}
                      onChange={(selected) => {
                        setEditOrderStatus(selected?.value || 'placed')
                      }}
                      isSearchable={false}
                      styles={getSelectStyles(isDark)}
                      menuPortalTarget={document.body}
                    />
                  </div>
                </CCol>

                <CCol xs={12} md={6}>
                  <div className="profile-info-block">
                    <div className="profile-info-label">Payment Status</div>
                    <Select
                      classNamePrefix="premium-react-select"
                      options={paymentStatusOptions.filter((item) => item.value !== 'all')}
                      value={paymentStatusOptions
                        .filter((item) => item.value !== 'all')
                        .find((opt) => opt.value === editPaymentStatus)}
                      onChange={(selected) => {
                        setEditPaymentStatus(selected?.value || 'pending')
                      }}
                      isSearchable={false}
                      styles={getSelectStyles(isDark)}
                      menuPortalTarget={document.body}
                    />
                  </div>
                </CCol>
              </CRow>

              <div className="mb-4">
                <CButton color="primary" className="premium-main-btn" onClick={handleSaveStatuses}>
                  Save Status Changes
                </CButton>
              </div>

              <CRow>
                <CCol xs={12} lg={6}>
                  <CCard className="premium-table-card border-0 shadow-sm mb-4">
                    <CCardHeader className="premium-card-header">
                      <strong>Customer Information</strong>
                    </CCardHeader>
                    <CCardBody>
                      <CRow>
                        <CCol xs={12} md={6} className="mb-4">
                          <div className="profile-info-block">
                            <div className="profile-info-label d-flex align-items-center gap-2">
                              <CIcon icon={cilUser} />
                              Full Name
                            </div>
                            <div className="profile-info-value">
                              {getCustomerFullName(selectedItem)}
                            </div>
                          </div>
                        </CCol>

                        <CCol xs={12} md={6} className="mb-4">
                          <div className="profile-info-block">
                            <div className="profile-info-label d-flex align-items-center gap-2">
                              <CIcon icon={cilEnvelopeClosed} />
                              Email
                            </div>
                            <div className="profile-info-value">
                              {selectedItem.customer?.email || '-'}
                            </div>
                          </div>
                        </CCol>

                        <CCol xs={12} md={6} className="mb-4">
                          <div className="profile-info-block">
                            <div className="profile-info-label d-flex align-items-center gap-2">
                              <CIcon icon={cilPhone} />
                              Phone
                            </div>
                            <div className="profile-info-value">
                              {selectedItem.customer?.phone || '-'}
                            </div>
                          </div>
                        </CCol>

                        <CCol xs={12} md={6} className="mb-4">
                          <div className="profile-info-block">
                            <div className="profile-info-label">Postal Code</div>
                            <div className="profile-info-value">
                              {selectedItem.customer?.postal_code || '-'}
                            </div>
                          </div>
                        </CCol>

                        <CCol xs={12} md={6} className="mb-4">
                          <div className="profile-info-block">
                            <div className="profile-info-label">Country</div>
                            <div className="profile-info-value">
                              {selectedItem.customer?.country || '-'}
                            </div>
                          </div>
                        </CCol>

                        <CCol xs={12} md={6} className="mb-4">
                          <div className="profile-info-block">
                            <div className="profile-info-label">City</div>
                            <div className="profile-info-value">
                              {selectedItem.customer?.city || '-'}
                            </div>
                          </div>
                        </CCol>

                        <CCol xs={12} className="mb-4">
                          <div className="profile-info-block">
                            <div className="profile-info-label">Address</div>
                            <div className="profile-info-value">
                              {selectedItem.customer?.address || '-'}
                            </div>
                          </div>
                        </CCol>

                        <CCol xs={12}>
                          <div className="profile-info-block">
                            <div className="profile-info-label">Customer Notes</div>
                            <div className="profile-info-value" style={{ whiteSpace: 'pre-wrap' }}>
                              {selectedItem.customer?.notes || 'No notes added'}
                            </div>
                          </div>
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>

                <CCol xs={12} lg={6}>
                  <CCard className="premium-table-card border-0 shadow-sm mb-4">
                    <CCardHeader className="premium-card-header">
                      <strong>Order Summary</strong>
                    </CCardHeader>
                    <CCardBody>
                      <CRow>
                        <CCol xs={12} md={6} className="mb-4">
                          <div className="profile-info-block">
                            <div className="profile-info-label">Subtotal</div>
                            <div className="profile-info-value">
                              {formatCurrency(selectedItem.subtotal)}
                            </div>
                          </div>
                        </CCol>

                        <CCol xs={12} md={6} className="mb-4">
                          <div className="profile-info-block">
                            <div className="profile-info-label">Shipping</div>
                            <div className="profile-info-value">
                              {formatCurrency(selectedItem.shipping)}
                            </div>
                          </div>
                        </CCol>

                        <CCol xs={12} md={6} className="mb-4">
                          <div className="profile-info-block">
                            <div className="profile-info-label">Total Items</div>
                            <div className="profile-info-value">
                              {selectedItem.total_items || 0}
                            </div>
                          </div>
                        </CCol>

                        <CCol xs={12} md={6} className="mb-4">
                          <div className="profile-info-block">
                            <div className="profile-info-label">Grand Total</div>
                            <div className="profile-info-value">
                              {formatCurrency(selectedItem.total)}
                            </div>
                          </div>
                        </CCol>

                        <CCol xs={12} md={6} className="mb-4">
                          <div className="profile-info-block">
                            <div className="profile-info-label">Created At</div>
                            <div className="profile-info-value">
                              {selectedItem.createdAt
                                ? new Date(selectedItem.createdAt).toLocaleString()
                                : '-'}
                            </div>
                          </div>
                        </CCol>

                        <CCol xs={12} md={6} className="mb-4">
                          <div className="profile-info-block">
                            <div className="profile-info-label">Updated At</div>
                            <div className="profile-info-value">
                              {selectedItem.updatedAt
                                ? new Date(selectedItem.updatedAt).toLocaleString()
                                : '-'}
                            </div>
                          </div>
                        </CCol>

                        <CCol xs={12} md={6} className="mb-4">
                          <div className="profile-info-block">
                            <div className="profile-info-label">Payment Status</div>
                            <div className="profile-info-value">
                              <CBadge color={getPaymentStatusBadge(selectedItem.payment_status)}>
                                {formatPaymentStatusLabel(selectedItem.payment_status)}
                              </CBadge>
                            </div>
                          </div>
                        </CCol>

                        <CCol xs={12} md={6} className="mb-4">
                          <div className="profile-info-block">
                            <div className="profile-info-label">Order Status</div>
                            <div className="profile-info-value">
                              <CBadge color={getOrderStatusBadge(selectedItem.order_status)}>
                                {formatOrderStatusLabel(selectedItem.order_status)}
                              </CBadge>
                            </div>
                          </div>
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>

              <CCard className="premium-table-card border-0 shadow-sm">
                <CCardHeader className="premium-card-header">
                  <strong>Ordered Items</strong>
                </CCardHeader>

                <CCardBody>
                  <CTable hover responsive align="middle" className="premium-table">
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>#</CTableHeaderCell>
                        <CTableHeaderCell>Product</CTableHeaderCell>
                        <CTableHeaderCell>Image</CTableHeaderCell>
                        <CTableHeaderCell>Price</CTableHeaderCell>
                        <CTableHeaderCell>Qty</CTableHeaderCell>
                        <CTableHeaderCell>Line Total</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>

                    <CTableBody>
                      {selectedItem.items?.length ? (
                        selectedItem.items.map((product, index) => (
                          <CTableRow key={`${product.product_id}-${index}`}>
                            <CTableDataCell className="fw-semibold">{index + 1}</CTableDataCell>
                            <CTableDataCell>
                              <div className="fw-semibold">{product.title}</div>
                              <small className="text-medium-emphasis">
                                Product ID: {product.product_id}
                              </small>
                            </CTableDataCell>

                            <CTableDataCell>
                              {product.image ? (
                                <img
                                  src={product.image}
                                  alt={product.title}
                                  width="54"
                                  height="54"
                                  className="rounded object-fit-cover border"
                                />
                              ) : (
                                <div
                                  className="d-inline-flex align-items-center justify-content-center rounded border text-medium-emphasis"
                                  style={{ width: 54, height: 54 }}
                                >
                                  N/A
                                </div>
                              )}
                            </CTableDataCell>

                            <CTableDataCell>{formatCurrency(product.price)}</CTableDataCell>
                            <CTableDataCell>{product.qty}</CTableDataCell>
                            <CTableDataCell>{formatCurrency(product.line_total)}</CTableDataCell>
                          </CTableRow>
                        ))
                      ) : (
                        <CTableRow>
                          <CTableDataCell colSpan={6} className="text-center py-4">
                            No order items found
                          </CTableDataCell>
                        </CTableRow>
                      )}
                    </CTableBody>
                  </CTable>
                </CCardBody>
              </CCard>
            </>
          ) : null}
        </CModalBody>

        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => {
              setViewVisible(false)
              dispatch(clearSelectedOrder())
            }}
          >
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default OrdersList