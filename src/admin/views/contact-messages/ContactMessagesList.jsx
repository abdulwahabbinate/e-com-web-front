import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'
import Swal from 'sweetalert2'
import CIcon from '@coreui/icons-react'
import {
  cilArrowTop,
  cilDescription,
  cilEnvelopeClosed,
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
  clearContactMessageError,
  clearSelectedContactMessage,
  fetchContactMessage,
  fetchContactMessages,
  updateContactMessageStatus,
} from '../../store/slices/contactMessageSlice'

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

const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'new', label: 'New' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
]

const perPageOptions = [
  { value: 5, label: '5' },
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 50, label: '50' },
]

const ContactMessagesList = () => {
  const dispatch = useDispatch()
  const { list, selectedItem, loading, error } = useSelector(
    (state) => state.contactMessages,
  )

  const [isDark, setIsDark] = useState(false)
  const [viewVisible, setViewVisible] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'desc',
  })

  useEffect(() => {
    dispatch(fetchContactMessages())
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
      dispatch(clearContactMessageError())
    }
  }, [error, dispatch])

  const handleSort = (key) => {
    setCurrentPage(1)
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const getSortValue = (item, key) => {
    switch (key) {
      case 'full_name':
        return item.full_name || ''
      case 'email':
        return item.email || ''
      case 'status':
        return item.status || ''
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
          item.full_name?.toLowerCase().includes(q) ||
          item.email?.toLowerCase().includes(q) ||
          item.phone?.toLowerCase().includes(q) ||
          item.subject?.toLowerCase().includes(q) ||
          item.message?.toLowerCase().includes(q),
      )
    }

    if (statusFilter !== 'all') {
      data = data.filter((item) => item.status === statusFilter)
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
  }, [list, search, statusFilter, sortConfig])

  const totalPages = Math.ceil(filteredAndSortedList.length / itemsPerPage) || 1
  const paginatedList = filteredAndSortedList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const getStatusBadge = (status) => {
    if (status === 'new') return 'danger'
    if (status === 'in_progress') return 'warning'
    if (status === 'resolved') return 'success'
    return 'secondary'
  }

  const formatStatusLabel = (status) => {
    if (status === 'in_progress') return 'In Progress'
    if (status === 'resolved') return 'Resolved'
    return 'New'
  }

  const handleOpenViewModal = async (id) => {
    const result = await dispatch(fetchContactMessage(id))
    if (result.meta.requestStatus === 'fulfilled') {
      setViewVisible(true)
    }
  }

  const handleStatusChange = async (id, status) => {
    const result = await dispatch(
      updateContactMessageStatus({
        id,
        payload: { status },
      }),
    )

    if (result.meta.requestStatus === 'fulfilled') {
      toastAlert.fire({
        icon: 'success',
        title: 'Message status updated successfully',
      })
    } else {
      toastAlert.fire({
        icon: 'error',
        title: result?.payload?.message || 'Status update failed',
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
      <CCard className="shadow-sm border-0 premium-table-card">
        <CCardHeader className="d-flex justify-content-between align-items-center premium-card-header flex-wrap gap-3">
          <div>
            <strong className="fs-5">Contact Messages</strong>
            <div className="text-medium-emphasis small">
              Manage all customer support messages
            </div>
          </div>
        </CCardHeader>

        <CCardBody>
          <CRow className="mb-4 g-3 align-items-center">
            <CCol xs={12} lg={6}>
              <CFormInput
                className="premium-input"
                placeholder="Search by name, email, subject, phone or message"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </CCol>

            <CCol xs={12} sm={6} lg={3}>
              <Select
                classNamePrefix="premium-react-select"
                options={statusOptions}
                value={statusOptions.find((opt) => opt.value === statusFilter)}
                onChange={(selected) => {
                  setStatusFilter(selected?.value || 'all')
                  setCurrentPage(1)
                }}
                isSearchable={false}
                styles={getSelectStyles(isDark)}
                menuPortalTarget={document.body}
              />
            </CCol>

            <CCol xs={12} sm={6} lg={3}>
              <div className="premium-per-page-wrap">
                <span className="premium-per-page-label">Items per page:</span>
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
                  onClick={() => handleSort('full_name')}
                >
                  <div className="premium-sortable-header__inner">
                    <span>Name</span>
                    {renderSortIcon('full_name')}
                  </div>
                </CTableHeaderCell>

                <CTableHeaderCell
                  className="premium-sortable-header"
                  onClick={() => handleSort('email')}
                >
                  <div className="premium-sortable-header__inner">
                    <span>Email</span>
                    {renderSortIcon('email')}
                  </div>
                </CTableHeaderCell>

                <CTableHeaderCell>Subject</CTableHeaderCell>

                <CTableHeaderCell
                  className="premium-sortable-header"
                  onClick={() => handleSort('status')}
                >
                  <div className="premium-sortable-header__inner">
                    <span>Status</span>
                    {renderSortIcon('status')}
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
                      <div className="fw-semibold">{item.full_name}</div>
                      <small className="text-medium-emphasis">{item.phone || '-'}</small>
                    </CTableDataCell>

                    <CTableDataCell>{item.email}</CTableDataCell>

                    <CTableDataCell>
                      <div className="fw-semibold">{item.subject || 'No Subject'}</div>
                      <small className="text-medium-emphasis">
                        {item.message?.length > 60
                          ? `${item.message.slice(0, 60)}...`
                          : item.message}
                      </small>
                    </CTableDataCell>

                    <CTableDataCell>
                      <CBadge color={getStatusBadge(item.status)}>
                        {formatStatusLabel(item.status)}
                      </CBadge>
                    </CTableDataCell>

                    <CTableDataCell>
                      {item.createdAt ? new Date(item.createdAt).toLocaleString() : '-'}
                    </CTableDataCell>

                    <CTableDataCell className="text-center">
                      <div className="d-flex justify-content-center gap-2 flex-wrap">
                        <CButton
                          color="light"
                          size="sm"
                          className="premium-action-btn border"
                          onClick={() => handleOpenViewModal(item._id)}
                        >
                          <CIcon icon={cilZoom} className="me-1" />
                          View
                        </CButton>

                        <Select
                          classNamePrefix="premium-react-select"
                          options={statusOptions.filter((item) => item.value !== 'all')}
                          value={statusOptions
                            .filter((item) => item.value !== 'all')
                            .find((opt) => opt.value === item.status)}
                          onChange={(selected) => {
                            if (selected?.value && selected.value !== item.status) {
                              handleStatusChange(item._id, selected.value)
                            }
                          }}
                          isSearchable={false}
                          styles={getSelectStyles(isDark)}
                          menuPortalTarget={document.body}
                        />
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan={7} className="text-center py-4">
                    {loading ? 'Loading...' : 'No contact messages found'}
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
        size="lg"
        visible={viewVisible}
        onClose={() => {
          setViewVisible(false)
          dispatch(clearSelectedContactMessage())
        }}
      >
        <CModalHeader>
          <CModalTitle>Contact Message Details</CModalTitle>
        </CModalHeader>

        <CModalBody>
          {loading && !selectedItem ? (
            <div className="text-center py-4">
              <CSpinner />
            </div>
          ) : selectedItem ? (
            <CRow>
              <CCol xs={12} md={6} className="mb-4">
                <div className="profile-info-block">
                  <div className="profile-info-label d-flex align-items-center gap-2">
                    <CIcon icon={cilUser} />
                    Full Name
                  </div>
                  <div className="profile-info-value">{selectedItem.full_name}</div>
                </div>
              </CCol>

              <CCol xs={12} md={6} className="mb-4">
                <div className="profile-info-block">
                  <div className="profile-info-label d-flex align-items-center gap-2">
                    <CIcon icon={cilEnvelopeClosed} />
                    Email
                  </div>
                  <div className="profile-info-value">{selectedItem.email}</div>
                </div>
              </CCol>

              <CCol xs={12} md={6} className="mb-4">
                <div className="profile-info-block">
                  <div className="profile-info-label d-flex align-items-center gap-2">
                    <CIcon icon={cilPhone} />
                    Phone
                  </div>
                  <div className="profile-info-value">{selectedItem.phone || '-'}</div>
                </div>
              </CCol>

              <CCol xs={12} md={6} className="mb-4">
                <div className="profile-info-block">
                  <div className="profile-info-label d-flex align-items-center gap-2">
                    <CIcon icon={cilDescription} />
                    Status
                  </div>
                  <div className="profile-info-value">
                    <CBadge color={getStatusBadge(selectedItem.status)}>
                      {formatStatusLabel(selectedItem.status)}
                    </CBadge>
                  </div>
                </div>
              </CCol>

              <CCol xs={12} className="mb-4">
                <div className="profile-info-block">
                  <div className="profile-info-label">Subject</div>
                  <div className="profile-info-value">{selectedItem.subject || 'No Subject'}</div>
                </div>
              </CCol>

              <CCol xs={12} className="mb-4">
                <div className="profile-info-block">
                  <div className="profile-info-label">Message</div>
                  <div className="profile-info-value" style={{ whiteSpace: 'pre-wrap' }}>
                    {selectedItem.message}
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
            </CRow>
          ) : null}
        </CModalBody>

        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => {
              setViewVisible(false)
              dispatch(clearSelectedContactMessage())
            }}
          >
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default ContactMessagesList