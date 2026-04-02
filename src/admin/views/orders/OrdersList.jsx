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

  return (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )
}

const getSelectStyles = (isDark = false) => ({
  control: (base, state) => ({
    ...base,
    minHeight: 48,
    height: 48,
    borderRadius: 14,
    borderColor: state.isFocused
      ? '#8b5cf6'
      : isDark
      ? 'rgba(255,255,255,0.08)'
      : '#dbe3f0',
    backgroundColor: isDark ? '#111827' : '#ffffff',
    boxShadow: state.isFocused
      ? '0 0 0 0.2rem rgba(111, 66, 193, 0.16)'
      : isDark
      ? '0 8px 20px rgba(0, 0, 0, 0.2)'
      : '0 8px 20px rgba(15, 23, 42, 0.06)',
    '&:hover': {
      borderColor: state.isFocused
        ? '#8b5cf6'
        : isDark
        ? 'rgba(255,255,255,0.14)'
        : '#cbd5e1',
    },
    transition: 'all 0.25s ease',
    paddingLeft: 4,
    cursor: 'pointer',
  }),
  valueContainer: (base) => ({
    ...base,
    padding: '0 10px',
    height: 48,
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
    fontWeight: 600,
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
    borderRadius: 16,
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
    borderRadius: 12,
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
    fontWeight: 600,
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

  const portalTarget =
    typeof document !== 'undefined' ? document.body : null

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

  const formatDateTime = (value) => {
    if (!value) {
      return {
        date: '-',
        time: '',
      }
    }

    const dateObj = new Date(value)

    return {
      date: dateObj.toLocaleDateString(),
      time: dateObj.toLocaleTimeString(),
      full: dateObj.toLocaleString(),
    }
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
  }, [
    list,
    search,
    orderStatusFilter,
    paymentStatusFilter,
    paymentMethodFilter,
    sortConfig,
  ])

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

  const hasActiveFilters =
    search.trim() ||
    orderStatusFilter !== 'all' ||
    paymentStatusFilter !== 'all' ||
    paymentMethodFilter !== 'all'

  const orderStatusOptionsWithoutAll = useMemo(
    () => orderStatusOptions.filter((item) => item.value !== 'all'),
    [],
  )

  const paymentStatusOptionsWithoutAll = useMemo(
    () => paymentStatusOptions.filter((item) => item.value !== 'all'),
    [],
  )

  const summaryCards = useMemo(
    () => [
      {
        title: 'Total Orders',
        value: stats.totalOrders,
        caption: 'All recorded orders',
        icon: cilCart,
        iconClass: 'bg-primary-subtle text-primary',
        cardClass: 'orders-kpi-card--indigo',
      },
      {
        title: 'Paid Orders',
        value: stats.paidOrders,
        caption: 'Successful payments',
        icon: cilCreditCard,
        iconClass: 'bg-success-subtle text-success',
        cardClass: 'orders-kpi-card--emerald',
      },
      {
        title: 'COD Orders',
        value: stats.codOrders,
        caption: 'Cash on delivery',
        icon: cilDescription,
        iconClass: 'bg-secondary-subtle text-secondary',
        cardClass: 'orders-kpi-card--slate',
      },
      {
        title: 'Revenue',
        value: formatCurrency(stats.totalRevenue),
        caption: 'Paid total value',
        icon: cilNotes,
        iconClass: 'bg-warning-subtle text-warning',
        cardClass: 'orders-kpi-card--amber',
      },
    ],
    [stats],
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

  const handleCloseModal = () => {
    setViewVisible(false)
    dispatch(clearSelectedOrder())
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

  const handleResetFilters = () => {
    setSearch('')
    setOrderStatusFilter('all')
    setPaymentStatusFilter('all')
    setPaymentMethodFilter('all')
    setItemsPerPage(10)
    setCurrentPage(1)
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

  const renderMethodChip = (method) => (
    <span
      className={`orders-method-chip ${
        method === 'cod' ? 'orders-method-chip--slate' : 'orders-method-chip--indigo'
      }`}
    >
      {formatPaymentMethodLabel(method)}
    </span>
  )

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

  const modalDate = formatDateTime(selectedItem?.createdAt)
  const showListLoading = loading && !viewVisible
  const showModalLoading = loading && viewVisible && !selectedItem

  return (
    <>
      <div className="orders-page">
        <CCard className="orders-hero-card premium-table-card border-0 shadow-sm mb-4">
          <CCardBody className="orders-hero-card__body">
            <div className="orders-hero-card__content">
              <span className="orders-hero-card__eyebrow">Order Operations</span>
              <h2 className="orders-hero-card__title">Orders Management</h2>
              <p className="orders-hero-card__subtitle">
                Track customer purchases, review payment activity, and update order
                progress from one clean premium workspace.
              </p>
            </div>

            <div className="orders-hero-card__meta">
              <div className="orders-hero-card__meta-card">
                <span>Showing</span>
                <strong>{filteredAndSortedList.length}</strong>
                <small>filtered results</small>
              </div>
              <div className="orders-hero-card__meta-card">
                <span>Page Size</span>
                <strong>{itemsPerPage}</strong>
                <small>items per page</small>
              </div>
            </div>
          </CCardBody>
        </CCard>

        <CRow className="g-3 mb-4">
          {summaryCards.map((card) => (
            <CCol xs={12} sm={6} xl={3} key={card.title}>
              <CCard className={`orders-kpi-card border-0 h-100 ${card.cardClass}`}>
                <CCardBody className="orders-kpi-card__body">
                  <div className={`orders-kpi-card__icon ${card.iconClass}`}>
                    <CIcon icon={card.icon} size="lg" />
                  </div>

                  <div className="orders-kpi-card__text">
                    <div className="orders-kpi-card__label">{card.title}</div>
                    <div className="orders-kpi-card__value">{card.value}</div>
                    <div className="orders-kpi-card__caption">{card.caption}</div>
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
          ))}
        </CRow>

        <CCard className="orders-table-card premium-table-card shadow-sm border-0">
          <CCardHeader className="orders-table-card__header premium-card-header">
            <div>
              <div className="orders-table-card__title">Orders</div>
              <div className="orders-table-card__subtitle">
                Manage all customer orders and payment statuses
              </div>
            </div>

            <div className="orders-table-card__header-badge">
              {filteredAndSortedList.length} result
              {filteredAndSortedList.length === 1 ? '' : 's'}
            </div>
          </CCardHeader>

          <CCardBody>
            <div className="orders-toolbar mb-4">
              <CRow className="g-3 align-items-end">
                <CCol xs={12} lg={4}>
                  <div className="orders-field-group">
                    <label className="orders-field-label">Search</label>
                    <CFormInput
                      className="premium-input orders-search-input"
                      placeholder="Order no, customer, email, phone, city or product"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value)
                        setCurrentPage(1)
                      }}
                    />
                  </div>
                </CCol>

                <CCol xs={12} sm={6} lg={2}>
                  <div className="orders-field-group">
                    <label className="orders-field-label">Order Status</label>
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
                      menuPortalTarget={portalTarget}
                    />
                  </div>
                </CCol>

                <CCol xs={12} sm={6} lg={2}>
                  <div className="orders-field-group">
                    <label className="orders-field-label">Payment Status</label>
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
                      menuPortalTarget={portalTarget}
                    />
                  </div>
                </CCol>

                <CCol xs={12} sm={6} lg={2}>
                  <div className="orders-field-group">
                    <label className="orders-field-label">Payment Method</label>
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
                      menuPortalTarget={portalTarget}
                    />
                  </div>
                </CCol>

                <CCol xs={12} sm={6} lg={2}>
                  <div className="orders-field-group">
                    <label className="orders-field-label">Items Per Page</label>
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
                      menuPortalTarget={portalTarget}
                    />
                  </div>
                </CCol>
              </CRow>

              <div className="orders-toolbar__footer">
                <div className="orders-toolbar__count">
                  Showing <strong>{paginatedList.length}</strong> of{' '}
                  <strong>{filteredAndSortedList.length}</strong> orders
                </div>

                {hasActiveFilters ? (
                  <CButton
                    color="light"
                    className="orders-reset-btn"
                    onClick={handleResetFilters}
                  >
                    Reset Filters
                  </CButton>
                ) : null}
              </div>
            </div>

            <div className="orders-table-wrap">
              <CTable
                hover
                responsive
                align="middle"
                className="premium-table premium-sortable-table orders-table"
              >
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
                    paginatedList.map((item, index) => {
                      const createdAt = formatDateTime(item.createdAt)

                      return (
                        <CTableRow key={item._id}>
                          <CTableDataCell className="fw-semibold">
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </CTableDataCell>

                          <CTableDataCell>
                            <div className="orders-cell-title">{item.order_number}</div>
                            <div className="orders-cell-subtitle">
                              {renderMethodChip(item.payment_method)}
                            </div>
                          </CTableDataCell>

                          <CTableDataCell>
                            <div className="orders-cell-title">
                              {getCustomerFullName(item)}
                            </div>
                            <div className="orders-customer-meta">
                              <span>{item.customer?.email || '-'}</span>
                              <span>{item.customer?.phone || '-'}</span>
                            </div>
                          </CTableDataCell>

                          <CTableDataCell>
                            <div className="orders-cell-title">
                              {item.total_items || 0} item(s)
                            </div>
                            <div className="orders-item-preview">
                              {item.items?.length
                                ? item.items
                                    .slice(0, 2)
                                    .map((product) => product.title)
                                    .join(', ')
                                : 'No products'}
                              {item.items?.length > 2 ? ' ...' : ''}
                            </div>
                          </CTableDataCell>

                          <CTableDataCell>
                            <div className="orders-cell-title">
                              {formatCurrency(item.total)}
                            </div>
                            <div className="orders-cell-subtitle">
                              Subtotal {formatCurrency(item.subtotal)}
                            </div>
                          </CTableDataCell>

                          <CTableDataCell>
                            <div className="orders-badge-stack">
                              <CBadge
                                color={getPaymentStatusBadge(item.payment_status)}
                                className="orders-status-badge"
                              >
                                {formatPaymentStatusLabel(item.payment_status)}
                              </CBadge>
                              <span className="orders-payment-method-text">
                                {formatPaymentMethodLabel(item.payment_method)}
                              </span>
                            </div>
                          </CTableDataCell>

                          <CTableDataCell>
                            <CBadge
                              color={getOrderStatusBadge(item.order_status)}
                              className="orders-status-badge"
                            >
                              {formatOrderStatusLabel(item.order_status)}
                            </CBadge>
                          </CTableDataCell>

                          <CTableDataCell>
                            <div className="orders-date-stack">
                              <strong>{createdAt.date}</strong>
                              <span>{createdAt.time}</span>
                            </div>
                          </CTableDataCell>

                          <CTableDataCell className="text-center">
                            <div className="premium-actions-group">
                              <CButton
                                color="light"
                                size="sm"
                                className="premium-action-btn orders-view-btn border"
                                onClick={() => handleOpenViewModal(item._id)}
                              >
                                <CIcon icon={cilZoom} className="me-1" />
                                View
                              </CButton>
                            </div>
                          </CTableDataCell>
                        </CTableRow>
                      )
                    })
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan={9} className="text-center py-5">
                        <div className="orders-empty-state">
                          {showListLoading ? (
                            <>
                              <CSpinner size="sm" className="me-2" />
                              Loading orders...
                            </>
                          ) : (
                            'No orders found'
                          )}
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </div>

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
      </div>

      <CModal
        className="orders-modal"
        size="xl"
        alignment="center"
        scrollable
        visible={viewVisible}
        onClose={handleCloseModal}
      >
        <CModalHeader>
          <div className="w-100">
            <CModalTitle>Order Details</CModalTitle>
            {selectedItem?.order_number ? (
              <div className="orders-modal__subtitle">
                Review status, payment, customer details, and ordered products for{' '}
                <strong>{selectedItem.order_number}</strong>
              </div>
            ) : null}
          </div>
        </CModalHeader>

        <CModalBody>
          {showModalLoading ? (
            <div className="text-center py-5">
              <CSpinner />
            </div>
          ) : selectedItem ? (
            <>
              <div className="orders-modal-top-grid">
                <div className="orders-detail-card">
                  <div className="orders-detail-card__label">
                    <CIcon icon={cilDescription} className="me-2" />
                    Order Number
                  </div>
                  <div className="orders-detail-card__value">
                    {selectedItem.order_number}
                  </div>
                </div>

                <div className="orders-detail-card">
                  <div className="orders-detail-card__label">
                    <CIcon icon={cilCreditCard} className="me-2" />
                    Payment Method
                  </div>
                  <div className="orders-detail-card__value">
                    {formatPaymentMethodLabel(selectedItem.payment_method)}
                  </div>
                </div>

                <div className="orders-detail-card">
                  <div className="orders-detail-card__label">Stripe Payment Intent</div>
                  <div className="orders-detail-card__value orders-detail-card__value--small">
                    {selectedItem.stripe_payment_intent_id || '-'}
                  </div>
                </div>
              </div>

              <div className="orders-status-panel">
                <div className="orders-status-panel__header">
                  <div>
                    <div className="orders-status-panel__title">Update Status</div>
                    <div className="orders-status-panel__subtitle">
                      Change order and payment states without leaving the modal
                    </div>
                  </div>

                  <div className="orders-status-panel__live">
                    <CBadge
                      color={getOrderStatusBadge(selectedItem.order_status)}
                      className="orders-status-badge"
                    >
                      {formatOrderStatusLabel(selectedItem.order_status)}
                    </CBadge>
                    <CBadge
                      color={getPaymentStatusBadge(selectedItem.payment_status)}
                      className="orders-status-badge"
                    >
                      {formatPaymentStatusLabel(selectedItem.payment_status)}
                    </CBadge>
                  </div>
                </div>

                <CRow className="g-3">
                  <CCol xs={12} md={6}>
                    <div className="orders-field-group">
                      <label className="orders-field-label">Order Status</label>
                      <Select
                        classNamePrefix="premium-react-select"
                        options={orderStatusOptionsWithoutAll}
                        value={orderStatusOptionsWithoutAll.find(
                          (opt) => opt.value === editOrderStatus,
                        )}
                        onChange={(selected) => {
                          setEditOrderStatus(selected?.value || 'placed')
                        }}
                        isSearchable={false}
                        styles={getSelectStyles(isDark)}
                        menuPortalTarget={portalTarget}
                      />
                    </div>
                  </CCol>

                  <CCol xs={12} md={6}>
                    <div className="orders-field-group">
                      <label className="orders-field-label">Payment Status</label>
                      <Select
                        classNamePrefix="premium-react-select"
                        options={paymentStatusOptionsWithoutAll}
                        value={paymentStatusOptionsWithoutAll.find(
                          (opt) => opt.value === editPaymentStatus,
                        )}
                        onChange={(selected) => {
                          setEditPaymentStatus(selected?.value || 'pending')
                        }}
                        isSearchable={false}
                        styles={getSelectStyles(isDark)}
                        menuPortalTarget={portalTarget}
                      />
                    </div>
                  </CCol>
                </CRow>

                <div className="orders-status-panel__actions">
                  <CButton
                    color="primary"
                    className="premium-main-btn"
                    disabled={loading}
                    onClick={handleSaveStatuses}
                  >
                    {loading ? 'Saving...' : 'Save Status Changes'}
                  </CButton>
                </div>
              </div>

              <CRow className="g-4">
                <CCol xs={12} lg={6}>
                  <CCard className="orders-section-card border-0 shadow-sm h-100">
                    <CCardHeader className="premium-card-header">
                      <strong>Customer Information</strong>
                    </CCardHeader>

                    <CCardBody>
                      <div className="orders-info-grid">
                        <div className="orders-info-card">
                          <div className="orders-info-card__label">
                            <CIcon icon={cilUser} className="me-2" />
                            Full Name
                          </div>
                          <div className="orders-info-card__value">
                            {getCustomerFullName(selectedItem)}
                          </div>
                        </div>

                        <div className="orders-info-card">
                          <div className="orders-info-card__label">
                            <CIcon icon={cilEnvelopeClosed} className="me-2" />
                            Email
                          </div>
                          <div className="orders-info-card__value">
                            {selectedItem.customer?.email || '-'}
                          </div>
                        </div>

                        <div className="orders-info-card">
                          <div className="orders-info-card__label">
                            <CIcon icon={cilPhone} className="me-2" />
                            Phone
                          </div>
                          <div className="orders-info-card__value">
                            {selectedItem.customer?.phone || '-'}
                          </div>
                        </div>

                        <div className="orders-info-card">
                          <div className="orders-info-card__label">Postal Code</div>
                          <div className="orders-info-card__value">
                            {selectedItem.customer?.postal_code || '-'}
                          </div>
                        </div>

                        <div className="orders-info-card">
                          <div className="orders-info-card__label">Country</div>
                          <div className="orders-info-card__value">
                            {selectedItem.customer?.country || '-'}
                          </div>
                        </div>

                        <div className="orders-info-card">
                          <div className="orders-info-card__label">City</div>
                          <div className="orders-info-card__value">
                            {selectedItem.customer?.city || '-'}
                          </div>
                        </div>

                        <div className="orders-info-card orders-info-card--full">
                          <div className="orders-info-card__label">Address</div>
                          <div className="orders-info-card__value">
                            {selectedItem.customer?.address || '-'}
                          </div>
                        </div>

                        <div className="orders-info-card orders-info-card--full">
                          <div className="orders-info-card__label">Customer Notes</div>
                          <div
                            className="orders-info-card__value"
                            style={{ whiteSpace: 'pre-wrap' }}
                          >
                            {selectedItem.customer?.notes || 'No notes added'}
                          </div>
                        </div>
                      </div>
                    </CCardBody>
                  </CCard>
                </CCol>

                <CCol xs={12} lg={6}>
                  <CCard className="orders-section-card border-0 shadow-sm h-100">
                    <CCardHeader className="premium-card-header">
                      <strong>Order Summary</strong>
                    </CCardHeader>

                    <CCardBody>
                      <div className="orders-info-grid">
                        <div className="orders-info-card">
                          <div className="orders-info-card__label">Subtotal</div>
                          <div className="orders-info-card__value">
                            {formatCurrency(selectedItem.subtotal)}
                          </div>
                        </div>

                        <div className="orders-info-card">
                          <div className="orders-info-card__label">Shipping</div>
                          <div className="orders-info-card__value">
                            {formatCurrency(selectedItem.shipping)}
                          </div>
                        </div>

                        <div className="orders-info-card">
                          <div className="orders-info-card__label">Total Items</div>
                          <div className="orders-info-card__value">
                            {selectedItem.total_items || 0}
                          </div>
                        </div>

                        <div className="orders-info-card">
                          <div className="orders-info-card__label">Grand Total</div>
                          <div className="orders-info-card__value">
                            {formatCurrency(selectedItem.total)}
                          </div>
                        </div>

                        <div className="orders-info-card">
                          <div className="orders-info-card__label">Created At</div>
                          <div className="orders-info-card__value">
                            {selectedItem.createdAt
                              ? new Date(selectedItem.createdAt).toLocaleString()
                              : '-'}
                          </div>
                        </div>

                        <div className="orders-info-card">
                          <div className="orders-info-card__label">Updated At</div>
                          <div className="orders-info-card__value">
                            {selectedItem.updatedAt
                              ? new Date(selectedItem.updatedAt).toLocaleString()
                              : '-'}
                          </div>
                        </div>

                        <div className="orders-info-card">
                          <div className="orders-info-card__label">Payment Status</div>
                          <div className="orders-info-card__value">
                            <CBadge
                              color={getPaymentStatusBadge(selectedItem.payment_status)}
                              className="orders-status-badge"
                            >
                              {formatPaymentStatusLabel(selectedItem.payment_status)}
                            </CBadge>
                          </div>
                        </div>

                        <div className="orders-info-card">
                          <div className="orders-info-card__label">Order Status</div>
                          <div className="orders-info-card__value">
                            <CBadge
                              color={getOrderStatusBadge(selectedItem.order_status)}
                              className="orders-status-badge"
                            >
                              {formatOrderStatusLabel(selectedItem.order_status)}
                            </CBadge>
                          </div>
                        </div>
                      </div>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>

              <CCard className="orders-section-card border-0 shadow-sm mt-4">
                <CCardHeader className="premium-card-header">
                  <strong>Ordered Items</strong>
                </CCardHeader>

                <CCardBody>
                  <div className="orders-table-wrap">
                    <CTable
                      hover
                      responsive
                      align="middle"
                      className="premium-table orders-table"
                    >
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
                              <CTableDataCell className="fw-semibold">
                                {index + 1}
                              </CTableDataCell>

                              <CTableDataCell>
                                <div className="orders-cell-title">{product.title}</div>
                                <div className="orders-cell-subtitle">
                                  Product ID: {product.product_id}
                                </div>
                              </CTableDataCell>

                              <CTableDataCell>
                                {product.image ? (
                                  <img
                                    src={product.image}
                                    alt={product.title}
                                    className="orders-item-thumb"
                                  />
                                ) : (
                                  <div className="orders-item-thumb orders-item-thumb--empty">
                                    N/A
                                  </div>
                                )}
                              </CTableDataCell>

                              <CTableDataCell>
                                {formatCurrency(product.price)}
                              </CTableDataCell>
                              <CTableDataCell>{product.qty}</CTableDataCell>
                              <CTableDataCell>
                                {formatCurrency(product.line_total)}
                              </CTableDataCell>
                            </CTableRow>
                          ))
                        ) : (
                          <CTableRow>
                            <CTableDataCell colSpan={6} className="text-center py-4">
                              <div className="orders-empty-state">No order items found</div>
                            </CTableDataCell>
                          </CTableRow>
                        )}
                      </CTableBody>
                    </CTable>
                  </div>
                </CCardBody>
              </CCard>
            </>
          ) : null}
        </CModalBody>

        <CModalFooter>
          <CButton color="secondary" onClick={handleCloseModal}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default OrdersList