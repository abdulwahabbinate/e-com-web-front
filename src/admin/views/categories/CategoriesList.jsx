import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CModalFooter,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CBadge,
  CPagination,
  CPaginationItem,
  CFormSwitch,
  CImage,
  CRow,
  CCol,
  CAvatar,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilFolderOpen,
  cilImage,
  cilZoom,
  cilPencil,
  cilTrash,
  cilX,
  cilArrowTop,
  cilSwapVertical,
} from '@coreui/icons'
import Swal from 'sweetalert2'
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
  clearCategoryError,
} from '../../store/slices/categorySlice'

const initialForm = {
  name: '',
  image: null,
  description: '',
  menu_section: 'retail',
  group_title: '',
  sort_order: '',
  is_active: true,
  remove_image: false,
}

const menuSectionOptions = [
  { value: 'retail', label: 'Retail' },
  { value: 'wholesale', label: 'Wholesale' },
]

const filterOptions = [
  { value: 'all', label: 'All Sections' },
  { value: 'retail', label: 'Retail' },
  { value: 'wholesale', label: 'Wholesale' },
]

const perPageOptions = [
  { value: 5, label: '5' },
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 50, label: '50' },
]

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

const CategoriesList = () => {
  const dispatch = useDispatch()
  const fileInputRef = useRef(null)
  const { list, loading, error } = useSelector((state) => state.categories)

  const [isDark, setIsDark] = useState(false)
  const [visible, setVisible] = useState(false)
  const [viewVisible, setViewVisible] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [editingItem, setEditingItem] = useState(null)
  const [search, setSearch] = useState('')
  const [menuFilter, setMenuFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [sortConfig, setSortConfig] = useState({
    key: 'name',
    direction: 'asc',
  })
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState(initialForm)
  const [imagePreview, setImagePreview] = useState('')

  useEffect(() => {
    dispatch(fetchCategories())
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
    if (error?.message && !error?.errors) {
      toastAlert.fire({
        icon: 'error',
        title: error.message,
      })
    }
  }, [error])

  const handleSort = (key) => {
    setCurrentPage(1)
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const getSortValue = (item, key) => {
    switch (key) {
      case 'name':
        return item.name || ''
      case 'group_title':
        return item.group_title || ''
      case 'menu_section':
        return item.menu_section || ''
      case 'sort_order':
        return Number(item.sort_order || 0)
      case 'is_active':
        return item.is_active ? 1 : 0
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
          item.name?.toLowerCase().includes(q) ||
          item.slug?.toLowerCase().includes(q) ||
          item.group_title?.toLowerCase().includes(q)
      )
    }

    if (menuFilter !== 'all') {
      data = data.filter((item) => item.menu_section === menuFilter)
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
  }, [list, search, menuFilter, sortConfig])

  const totalPages = Math.ceil(filteredAndSortedList.length / itemsPerPage)
  const paginatedList = filteredAndSortedList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = 'Category name is required'
    if (!formData.group_title.trim()) newErrors.group_title = 'Group title is required'
    if (!formData.menu_section || !['retail', 'wholesale'].includes(formData.menu_section.toLowerCase())) {
      newErrors.menu_section = 'menu_section must be retail or wholesale'
    }
    if (formData.sort_order !== '' && isNaN(formData.sort_order)) {
      newErrors.sort_order = 'sort_order must be a valid number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const applyBackendValidationErrors = (payload) => {
    const backendErrors = payload?.errors || []
    const mappedErrors = {}

    if (Array.isArray(backendErrors)) {
      backendErrors.forEach((err) => {
        if (err?.field) mappedErrors[err.field] = err.message
      })
    }

    setErrors(mappedErrors)

    if (payload?.message && !backendErrors.length) {
      toastAlert.fire({
        icon: 'error',
        title: payload.message,
      })
    }
  }

  const resetFormState = () => {
    setFormData(initialForm)
    setEditingItem(null)
    setErrors({})
    setImagePreview('')
    dispatch(clearCategoryError())

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const openCreateModal = () => {
    resetFormState()
    setVisible(true)
  }

  const openEditModal = (item) => {
    setEditingItem(item)
    setErrors({})
    setFormData({
      name: item?.name || '',
      image: null,
      description: item?.description || '',
      menu_section: item?.menu_section || 'retail',
      group_title: item?.group_title || '',
      sort_order: item?.sort_order ?? '',
      is_active: item?.is_active ?? true,
      remove_image: false,
    })
    setImagePreview(item?.image || '')
    setVisible(true)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const openViewModal = (item) => {
    setSelectedItem(item)
    setViewVisible(true)
  }

  const closeModal = () => {
    setVisible(false)
    resetFormState()
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null

    setFormData((prev) => ({
      ...prev,
      image: file,
      remove_image: false,
    }))

    if (file) {
      setImagePreview(URL.createObjectURL(file))
    } else {
      setImagePreview(editingItem?.image || '')
    }
  }

  const handleRemovePreviewImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
      remove_image: true,
    }))

    setImagePreview('')

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const buildPayload = () => {
    const payload = new FormData()
    payload.append('name', formData.name.trim())
    payload.append('description', formData.description?.trim() || '')
    payload.append('menu_section', formData.menu_section)
    payload.append('group_title', formData.group_title.trim())
    payload.append('sort_order', formData.sort_order === '' ? '0' : String(formData.sort_order))
    payload.append('is_active', String(formData.is_active))
    payload.append('remove_image', String(formData.remove_image))

    if (formData.image instanceof File) {
      payload.append('image', formData.image)
    }

    return payload
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    const payload = buildPayload()

    let result
    if (editingItem?._id) {
      result = await dispatch(updateCategory({ id: editingItem._id, payload }))
    } else {
      result = await dispatch(createCategory(payload))
    }

    if (result.meta.requestStatus === 'fulfilled') {
      toastAlert.fire({
        icon: 'success',
        title: editingItem ? 'Category updated successfully' : 'Category created successfully',
      })
      closeModal()
    } else {
      applyBackendValidationErrors(result.payload)
    }
  }

  const handleDelete = async (id) => {
    const swalResult = await Swal.fire({
      title: 'Are you sure?',
      text: 'This category and its image will be deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'premium-swal-popup',
      },
    })

    if (!swalResult.isConfirmed) return

    const result = await dispatch(deleteCategory(id))

    if (result.meta.requestStatus === 'fulfilled') {
      toastAlert.fire({
        icon: 'success',
        title: 'Category deleted successfully',
      })
    } else {
      toastAlert.fire({
        icon: 'error',
        title: result?.payload?.message || 'Delete failed',
      })
    }
  }

  const handleToggleStatus = async (item) => {
    const payload = new FormData()
    payload.append('name', item.name || '')
    payload.append('description', item.description || '')
    payload.append('menu_section', item.menu_section || 'retail')
    payload.append('group_title', item.group_title || '')
    payload.append('sort_order', String(item.sort_order ?? 0))
    payload.append('is_active', String(!item.is_active))
    payload.append('remove_image', 'false')

    const result = await dispatch(
      toggleCategoryStatus({
        id: item._id,
        payload,
      }),
    )

    if (result.meta.requestStatus === 'fulfilled') {
      toastAlert.fire({
        icon: 'success',
        title: 'Category status updated',
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
            <strong className="fs-5">Categories</strong>
            <div className="text-medium-emphasis small">Manage all category records</div>
          </div>

          <CButton color="primary" className="px-4 premium-main-btn" onClick={openCreateModal}>
            Add Category
          </CButton>
        </CCardHeader>

        <CCardBody>
          <CRow className="mb-4 g-3 align-items-center">
            <CCol xs={12} lg={6}>
              <CFormInput
                className="premium-input"
                placeholder="Search by name, slug, group title"
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
                options={filterOptions}
                value={filterOptions.find((opt) => opt.value === menuFilter)}
                onChange={(selected) => {
                  setMenuFilter(selected?.value || 'all')
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
                      setItemsPerPage(selected?.value || 5)
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
                <CTableHeaderCell>Image</CTableHeaderCell>

                <CTableHeaderCell
                  className="premium-sortable-header"
                  onClick={() => handleSort('name')}
                >
                  <div className="premium-sortable-header__inner">
                    <span>Name</span>
                    {renderSortIcon('name')}
                  </div>
                </CTableHeaderCell>

                <CTableHeaderCell
                  className="premium-sortable-header"
                  onClick={() => handleSort('group_title')}
                >
                  <div className="premium-sortable-header__inner">
                    <span>Group</span>
                    {renderSortIcon('group_title')}
                  </div>
                </CTableHeaderCell>

                <CTableHeaderCell
                  className="premium-sortable-header"
                  onClick={() => handleSort('menu_section')}
                >
                  <div className="premium-sortable-header__inner">
                    <span>Section</span>
                    {renderSortIcon('menu_section')}
                  </div>
                </CTableHeaderCell>

                <CTableHeaderCell
                  className="premium-sortable-header"
                  onClick={() => handleSort('sort_order')}
                >
                  <div className="premium-sortable-header__inner">
                    <span>Sort</span>
                    {renderSortIcon('sort_order')}
                  </div>
                </CTableHeaderCell>

                <CTableHeaderCell
                  className="premium-sortable-header"
                  onClick={() => handleSort('is_active')}
                >
                  <div className="premium-sortable-header__inner">
                    <span>Status</span>
                    {renderSortIcon('is_active')}
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
                      {item.image ? (
                        <CImage
                          src={item.image}
                          width={52}
                          height={52}
                          rounded
                          className="object-fit-cover border"
                        />
                      ) : (
                        <CAvatar size="md" color="light" className="border premium-no-image-avatar">
                          <CIcon icon={cilFolderOpen} size="lg" />
                        </CAvatar>
                      )}
                    </CTableDataCell>

                    <CTableDataCell>
                      <div className="fw-semibold">{item.name}</div>
                      <small className="text-medium-emphasis">{item.slug}</small>
                    </CTableDataCell>

                    <CTableDataCell>{item.group_title}</CTableDataCell>

                    <CTableDataCell>
                      <CBadge color={item.menu_section === 'retail' ? 'info' : 'warning'}>
                        {item.menu_section}
                      </CBadge>
                    </CTableDataCell>

                    <CTableDataCell>{item.sort_order}</CTableDataCell>

                    <CTableDataCell>
                      <CFormSwitch
                        checked={item.is_active}
                        onChange={() => handleToggleStatus(item)}
                      />
                    </CTableDataCell>

                    <CTableDataCell className="text-center">
                      <div className="d-flex justify-content-center gap-2 flex-wrap">
                        <CButton
                          color="light"
                          size="sm"
                          className="premium-action-btn border"
                          onClick={() => openViewModal(item)}
                        >
                          <CIcon icon={cilZoom} className="me-1" />
                          View
                        </CButton>

                        <CButton
                          color="info"
                          size="sm"
                          className="premium-action-btn text-white"
                          onClick={() => openEditModal(item)}
                        >
                          <CIcon icon={cilPencil} className="me-1" />
                          Edit
                        </CButton>

                        <CButton
                          color="danger"
                          size="sm"
                          className="premium-action-btn"
                          onClick={() => handleDelete(item._id)}
                        >
                          <CIcon icon={cilTrash} className="me-1" />
                          Delete
                        </CButton>
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan={8} className="text-center py-4">
                    {loading ? 'Loading...' : 'No categories found'}
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

      <CModal size="lg" visible={visible} onClose={closeModal}>
        <CModalHeader>
          <CModalTitle>{editingItem ? 'Edit Category' : 'Add Category'}</CModalTitle>
        </CModalHeader>

        <CForm onSubmit={handleSubmit}>
          <CModalBody>
            <CRow>
              <CCol xs={12} md={6} className="mb-3">
                <CFormLabel>Name</CFormLabel>
                <CFormInput
                  className="premium-input"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <small className="text-danger">{errors.name}</small>}
              </CCol>

              <CCol xs={12} md={6} className="mb-3">
                <CFormLabel>Menu Section</CFormLabel>
                <Select
                  classNamePrefix="premium-react-select"
                  options={menuSectionOptions}
                  value={menuSectionOptions.find((opt) => opt.value === formData.menu_section)}
                  onChange={(selected) => {
                    setFormData((prev) => ({
                      ...prev,
                      menu_section: selected?.value || 'retail',
                    }))
                    setErrors((prev) => ({
                      ...prev,
                      menu_section: '',
                    }))
                  }}
                  isSearchable={false}
                  styles={getSelectStyles(isDark)}
                  menuPortalTarget={document.body}
                />
                {errors.menu_section && <small className="text-danger">{errors.menu_section}</small>}
              </CCol>

              <CCol xs={12} md={6} className="mb-3">
                <CFormLabel>Group Title</CFormLabel>
                <CFormInput
                  className="premium-input"
                  name="group_title"
                  value={formData.group_title}
                  onChange={handleChange}
                />
                {errors.group_title && <small className="text-danger">{errors.group_title}</small>}
              </CCol>

              <CCol xs={12} md={6} className="mb-3">
                <CFormLabel>Sort Order</CFormLabel>
                <CFormInput
                  className="premium-input"
                  name="sort_order"
                  type="number"
                  value={formData.sort_order}
                  onChange={handleChange}
                />
                {errors.sort_order && <small className="text-danger">{errors.sort_order}</small>}
              </CCol>

              <CCol xs={12} className="mb-3">
                <CFormLabel>Image Upload</CFormLabel>

                <div
                  className={`premium-file-upload ${formData.image || imagePreview ? 'has-file' : ''}`}
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      fileInputRef.current?.click()
                    }
                  }}
                >
                  <div className="premium-file-upload__button">Choose File</div>
                  <div className="premium-file-upload__name">
                    {formData.image?.name || (imagePreview ? 'Image selected' : 'No file chosen')}
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="d-none"
                />
              </CCol>

              {imagePreview && (
                <CCol xs={12} className="mb-3">
                  <div
                    style={{
                      position: 'relative',
                      width: '140px',
                      display: 'inline-block',
                    }}
                  >
                    <CImage
                      src={imagePreview}
                      width={140}
                      height={140}
                      rounded
                      className="border object-fit-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemovePreviewImage}
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        border: 'none',
                        background: '#dc3545',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                      }}
                    >
                      <CIcon icon={cilX} size="sm" />
                    </button>
                  </div>
                </CCol>
              )}

              <CCol xs={12} className="mb-3">
                <CFormLabel>Description</CFormLabel>
                <CFormTextarea
                  className="premium-input"
                  rows={4}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </CCol>
            </CRow>
          </CModalBody>

          <CModalFooter className="flex-wrap gap-2">
            <CButton color="secondary" onClick={closeModal}>
              Cancel
            </CButton>
            <CButton type="submit" color="primary" disabled={loading} className="premium-main-btn">
              {loading ? 'Saving...' : editingItem ? 'Update' : 'Create'}
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>

      <CModal size="lg" visible={viewVisible} onClose={() => setViewVisible(false)}>
        <CModalHeader>
          <CModalTitle>Category Details</CModalTitle>
        </CModalHeader>

        <CModalBody>
          {selectedItem ? (
            <CRow>
              <CCol xs={12} md={4} className="text-center mb-4">
                {selectedItem.image ? (
                  <CImage src={selectedItem.image} fluid rounded className="border" />
                ) : (
                  <div className="d-flex justify-content-center">
                    <CAvatar size="xl" color="light" className="border premium-no-image-avatar">
                      <CIcon icon={cilImage} size="xxl" />
                    </CAvatar>
                  </div>
                )}
              </CCol>

              <CCol xs={12} md={8}>
                <div className="mb-2"><strong>Name:</strong> {selectedItem.name}</div>
                <div className="mb-2"><strong>Slug:</strong> {selectedItem.slug}</div>
                <div className="mb-2"><strong>Group:</strong> {selectedItem.group_title}</div>
                <div className="mb-2"><strong>Section:</strong> {selectedItem.menu_section}</div>
                <div className="mb-2"><strong>Sort Order:</strong> {selectedItem.sort_order}</div>
                <div className="mb-2">
                  <strong>Status:</strong>{' '}
                  <CBadge color={selectedItem.is_active ? 'success' : 'secondary'}>
                    {selectedItem.is_active ? 'Active' : 'Inactive'}
                  </CBadge>
                </div>
                <div className="mb-2"><strong>Description:</strong> {selectedItem.description || '-'}</div>
                <div className="mb-2"><strong>Created:</strong> {selectedItem.createdAt ? new Date(selectedItem.createdAt).toLocaleString() : '-'}</div>
                <div className="mb-2"><strong>Updated:</strong> {selectedItem.updatedAt ? new Date(selectedItem.updatedAt).toLocaleString() : '-'}</div>
              </CCol>
            </CRow>
          ) : null}
        </CModalBody>

        <CModalFooter>
          <CButton color="secondary" onClick={() => setViewVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default CategoriesList