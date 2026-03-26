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
  cilImage,
  cilImagePlus,
  cilZoom,
  cilPencil,
  cilTrash,
  cilBasket,
  cilX,
  cilArrowTop,
  cilSwapVertical,
} from '@coreui/icons'
import Swal from 'sweetalert2'
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  clearProductError,
} from '../../store/slices/productSlice'
import { fetchCategories } from '../../store/slices/categorySlice'

const initialForm = {
  title: '',
  short_description: '',
  description: '',
  category_id: '',
  price: '',
  compare_price: '',
  stock: '',
  sku: '',
  sizes: '',
  colors: '',
  is_featured: false,
  is_active: true,
}

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
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

  return (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )
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
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: (base, state) => ({
    ...base,
    color: isDark ? '#94a3b8' : '#475569',
    paddingRight: 12,
    transition: 'all 0.2s ease',
    transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    '&:hover': { color: '#6366f1' },
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

const parseCommaSeparated = (value) => {
  if (!value.trim()) return []
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

const ProductsList = () => {
  const dispatch = useDispatch()
  const fileInputRef = useRef(null)

  const { list, loading, error } = useSelector((state) => state.products)
  const { list: categoryList } = useSelector((state) => state.categories)

  const [isDark, setIsDark] = useState(false)
  const [visible, setVisible] = useState(false)
  const [viewVisible, setViewVisible] = useState(false)
  const [galleryVisible, setGalleryVisible] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [galleryImages, setGalleryImages] = useState([])
  const [selectedFiles, setSelectedFiles] = useState([])
  const [existingImages, setExistingImages] = useState([])
  const [newImagePreviews, setNewImagePreviews] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [sortConfig, setSortConfig] = useState({
    key: 'title',
    direction: 'asc',
  })
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState(initialForm)

  useEffect(() => {
    dispatch(fetchProducts())
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
    if (error?.message) {
      toastAlert.fire({
        icon: 'error',
        title: error.message,
      })
    }
  }, [error])

  const categoryOptions = useMemo(() => {
    return [
      { value: 'all', label: 'All Categories' },
      ...(categoryList || []).map((cat) => ({
        value: cat._id,
        label: cat.name,
      })),
    ]
  }, [categoryList])

  const formCategoryOptions = useMemo(() => {
    return (categoryList || []).map((cat) => ({
      value: cat._id,
      label: cat.name,
    }))
  }, [categoryList])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.category_id) newErrors.category_id = 'Category is required'
    if (formData.price === '' || isNaN(formData.price)) {
      newErrors.price = 'Valid price is required'
    }
    if (formData.stock !== '' && isNaN(formData.stock)) {
      newErrors.stock = 'Valid stock is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const applyBackendValidationErrors = (payload) => {
    const backendErrors = payload?.errors || []
    const mappedErrors = {}

    if (Array.isArray(backendErrors)) {
      backendErrors.forEach((err) => {
        if (err?.field) {
          mappedErrors[err.field] = err.message
        }
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
    setSelectedFiles([])
    setExistingImages([])
    setNewImagePreviews([])
    dispatch(clearProductError())

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
      title: item?.title || '',
      short_description: item?.short_description || '',
      description: item?.description || '',
      category_id: item?.category_id?._id || '',
      price: item?.price ?? '',
      compare_price: item?.compare_price ?? '',
      stock: item?.stock ?? '',
      sku: item?.sku || '',
      sizes: item?.sizes?.join(', ') || '',
      colors: item?.colors?.join(', ') || '',
      is_featured: item?.is_featured ?? false,
      is_active: item?.is_active ?? true,
    })
    setSelectedFiles([])
    setExistingImages(item?.images || [])
    setNewImagePreviews([])
    setVisible(true)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const openViewModal = (item) => {
    setSelectedItem(item)
    setViewVisible(true)
  }

  const openGallery = (images = []) => {
    setGalleryImages(images)
    setGalleryVisible(true)
  }

  const closeModal = () => {
    setVisible(false)
    resetFormState()
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }))
  }

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 10)
    setSelectedFiles(files)
    setNewImagePreviews(files.map((file) => URL.createObjectURL(file)))
  }

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index))
  }

  const removeNewImage = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index)
    const updatedPreviews = newImagePreviews.filter((_, i) => i !== index)

    setSelectedFiles(updatedFiles)
    setNewImagePreviews(updatedPreviews)

    if (updatedFiles.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const buildPayload = (override = {}) => {
    const merged = {
      ...formData,
      ...override,
    }

    const payload = new FormData()
    payload.append('title', merged.title.trim())
    payload.append('short_description', merged.short_description?.trim() || '')
    payload.append('description', merged.description?.trim() || '')
    payload.append('category_id', merged.category_id)
    payload.append('price', String(Number(merged.price || 0)))
    payload.append('compare_price', String(Number(merged.compare_price || 0)))
    payload.append('stock', String(Number(merged.stock || 0)))
    payload.append('sku', merged.sku?.trim() || '')
    payload.append('sizes', JSON.stringify(parseCommaSeparated(merged.sizes || '')))
    payload.append('colors', JSON.stringify(parseCommaSeparated(merged.colors || '')))
    payload.append('is_featured', String(merged.is_featured))
    payload.append('is_active', String(merged.is_active))

    const keepImages =
      typeof override.keep_existing_images !== 'undefined'
        ? override.keep_existing_images
        : existingImages

    payload.append('keep_existing_images', JSON.stringify(keepImages))
    payload.append(
      'remove_all_images',
      String(keepImages.length === 0 && selectedFiles.length === 0)
    )

    selectedFiles.forEach((file) => {
      if (file instanceof File) {
        payload.append('images', file)
      }
    })

    return payload
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    const payload = buildPayload()

    let result
    if (editingItem?._id) {
      result = await dispatch(updateProduct({ id: editingItem._id, payload }))
    } else {
      result = await dispatch(createProduct(payload))
    }

    if (result.meta.requestStatus === 'fulfilled') {
      toastAlert.fire({
        icon: 'success',
        title: editingItem ? 'Product updated successfully' : 'Product created successfully',
      })
      closeModal()
    } else {
      applyBackendValidationErrors(result.payload)
    }
  }

  const handleDelete = async (id) => {
    const swalResult = await Swal.fire({
      title: 'Are you sure?',
      text: 'This product and its images will be deleted.',
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

    const result = await dispatch(deleteProduct(id))
    if (result.meta.requestStatus === 'fulfilled') {
      toastAlert.fire({
        icon: 'success',
        title: 'Product deleted successfully',
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
    payload.append('title', item.title || '')
    payload.append('short_description', item.short_description || '')
    payload.append('description', item.description || '')
    payload.append('category_id', item.category_id?._id || item.category_id || '')
    payload.append('price', String(Number(item.price || 0)))
    payload.append('compare_price', String(Number(item.compare_price || 0)))
    payload.append('stock', String(Number(item.stock || 0)))
    payload.append('sku', item.sku || '')
    payload.append('sizes', JSON.stringify(item.sizes || []))
    payload.append('colors', JSON.stringify(item.colors || []))
    payload.append('is_featured', String(item.is_featured ?? false))
    payload.append('is_active', String(!item.is_active))
    payload.append('keep_existing_images', JSON.stringify(item.images || []))
    payload.append('remove_all_images', 'false')

    const result = await dispatch(toggleProductStatus({ id: item._id, payload }))

    if (result.meta.requestStatus === 'fulfilled') {
      toastAlert.fire({
        icon: 'success',
        title: 'Product status updated',
      })
    } else {
      toastAlert.fire({
        icon: 'error',
        title: result?.payload?.message || 'Status update failed',
      })
    }
  }

  const handleToggleFeatured = async (item) => {
    const payload = new FormData()
    payload.append('title', item.title || '')
    payload.append('short_description', item.short_description || '')
    payload.append('description', item.description || '')
    payload.append('category_id', item.category_id?._id || item.category_id || '')
    payload.append('price', String(Number(item.price || 0)))
    payload.append('compare_price', String(Number(item.compare_price || 0)))
    payload.append('stock', String(Number(item.stock || 0)))
    payload.append('sku', item.sku || '')
    payload.append('sizes', JSON.stringify(item.sizes || []))
    payload.append('colors', JSON.stringify(item.colors || []))
    payload.append('is_featured', String(!item.is_featured))
    payload.append('is_active', String(item.is_active ?? true))
    payload.append('keep_existing_images', JSON.stringify(item.images || []))
    payload.append('remove_all_images', 'false')

    const result = await dispatch(updateProduct({ id: item._id, payload }))

    if (result.meta.requestStatus === 'fulfilled') {
      toastAlert.fire({
        icon: 'success',
        title: 'Featured status updated',
      })
    } else {
      toastAlert.fire({
        icon: 'error',
        title: result?.payload?.message || 'Featured update failed',
      })
    }
  }

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
      case 'title':
        return item.title || ''
      case 'category':
        return item.category_id?.name || ''
      case 'price':
        return Number(item.price || 0)
      case 'compare_price':
        return Number(item.compare_price || 0)
      case 'stock':
        return Number(item.stock || 0)
      case 'is_featured':
        return item.is_featured ? 1 : 0
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
          item.title?.toLowerCase().includes(q) ||
          item.slug?.toLowerCase().includes(q) ||
          item.sku?.toLowerCase().includes(q) ||
          item.category_id?.name?.toLowerCase().includes(q)
      )
    }

    if (statusFilter === 'active') data = data.filter((item) => item.is_active)
    if (statusFilter === 'inactive') data = data.filter((item) => !item.is_active)

    if (categoryFilter !== 'all') {
      data = data.filter((item) => item.category_id?._id === categoryFilter)
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
  }, [list, search, statusFilter, categoryFilter, sortConfig])

  const totalPages = Math.ceil(filteredAndSortedList.length / itemsPerPage)
  const paginatedList = filteredAndSortedList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
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

  return (
    <>
      <CCard className="shadow-sm border-0 premium-table-card">
        <CCardHeader className="d-flex justify-content-between align-items-center premium-card-header flex-wrap gap-3">
          <div>
            <strong className="fs-5">Products</strong>
            <div className="text-medium-emphasis small">Manage all product records</div>
          </div>

          <CButton color="primary" className="px-4 premium-main-btn" onClick={openCreateModal}>
            Add Product
          </CButton>
        </CCardHeader>

        <CCardBody>
          <CRow className="mb-4 g-3 align-items-center">
            <CCol xs={12} lg={4}>
              <CFormInput
                className="premium-input"
                placeholder="Search by title, slug, sku, category"
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
                options={categoryOptions}
                value={categoryOptions.find((opt) => opt.value === categoryFilter)}
                onChange={(selected) => {
                  setCategoryFilter(selected?.value || 'all')
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

                <CTableHeaderCell className="premium-sortable-header" onClick={() => handleSort('title')}>
                  <div className="premium-sortable-header__inner">
                    <span>Title</span>
                    {renderSortIcon('title')}
                  </div>
                </CTableHeaderCell>

                <CTableHeaderCell className="premium-sortable-header" onClick={() => handleSort('category')}>
                  <div className="premium-sortable-header__inner">
                    <span>Category</span>
                    {renderSortIcon('category')}
                  </div>
                </CTableHeaderCell>

                <CTableHeaderCell className="premium-sortable-header" onClick={() => handleSort('price')}>
                  <div className="premium-sortable-header__inner">
                    <span>Price</span>
                    {renderSortIcon('price')}
                  </div>
                </CTableHeaderCell>

                <CTableHeaderCell className="premium-sortable-header" onClick={() => handleSort('compare_price')}>
                  <div className="premium-sortable-header__inner">
                    <span>Compare</span>
                    {renderSortIcon('compare_price')}
                  </div>
                </CTableHeaderCell>

                <CTableHeaderCell className="premium-sortable-header" onClick={() => handleSort('stock')}>
                  <div className="premium-sortable-header__inner">
                    <span>Stock</span>
                    {renderSortIcon('stock')}
                  </div>
                </CTableHeaderCell>

                <CTableHeaderCell className="premium-sortable-header" onClick={() => handleSort('is_featured')}>
                  <div className="premium-sortable-header__inner">
                    <span>Featured</span>
                    {renderSortIcon('is_featured')}
                  </div>
                </CTableHeaderCell>

                <CTableHeaderCell className="premium-sortable-header" onClick={() => handleSort('is_active')}>
                  <div className="premium-sortable-header__inner">
                    <span>Status</span>
                    {renderSortIcon('is_active')}
                  </div>
                </CTableHeaderCell>

                <CTableHeaderCell className="premium-sortable-header" onClick={() => handleSort('createdAt')}>
                  <div className="premium-sortable-header__inner">
                    <span>Created</span>
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
                      {item.images?.[0] ? (
                        <div className="position-relative d-inline-block">
                          <CImage
                            src={item.images[0]}
                            width={60}
                            height={60}
                            rounded
                            className="object-fit-cover border"
                            style={{ cursor: 'pointer' }}
                            onClick={() => openGallery(item.images)}
                          />
                          {item.images?.length > 1 ? (
                            <span className="premium-gallery-badge">
                              +{item.images.length - 1}
                            </span>
                          ) : null}
                        </div>
                      ) : (
                        <CAvatar size="md" color="light" className="border premium-no-image-avatar">
                          <CIcon icon={cilBasket} size="lg" />
                        </CAvatar>
                      )}
                    </CTableDataCell>

                    <CTableDataCell>
                      <div className="fw-semibold">{item.title}</div>
                      <small className="text-medium-emphasis">{item.sku}</small>
                    </CTableDataCell>

                    <CTableDataCell>{item.category_id?.name || '-'}</CTableDataCell>
                    <CTableDataCell><span className="fw-semibold">${item.price}</span></CTableDataCell>
                    <CTableDataCell>
                      <span className="text-decoration-line-through text-medium-emphasis">
                        ${item.compare_price}
                      </span>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={item.stock > 0 ? 'success' : 'danger'}>
                        {item.stock}
                      </CBadge>
                    </CTableDataCell>

                    <CTableDataCell>
                      <CFormSwitch
                        checked={item.is_featured}
                        onChange={() => handleToggleFeatured(item)}
                      />
                    </CTableDataCell>

                    <CTableDataCell>
                      <CFormSwitch
                        checked={item.is_active}
                        onChange={() => handleToggleStatus(item)}
                      />
                    </CTableDataCell>

                    <CTableDataCell>
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'}
                    </CTableDataCell>

                    <CTableDataCell className="text-center">
                      <div className="premium-actions-group">
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
                          color="secondary"
                          size="sm"
                          className="premium-action-btn"
                          onClick={() => openGallery(item.images)}
                        >
                          <CIcon icon={cilImagePlus} className="me-1" />
                          Gallery
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
                  <CTableDataCell colSpan={11} className="text-center py-4">
                    {loading ? 'Loading...' : 'No products found'}
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>

          {totalPages > 1 && (
            <div className="premium-pagination-wrap">
              <CPagination className="mb-0 premium-pagination">
                <CPaginationItem disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>
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

      <CModal size="xl" visible={visible} onClose={closeModal}>
        <CModalHeader>
          <CModalTitle>{editingItem ? 'Edit Product' : 'Add Product'}</CModalTitle>
        </CModalHeader>

        <CForm onSubmit={handleSubmit}>
          <CModalBody>
            <CRow>
              <CCol xs={12} md={6} className="mb-3">
                <CFormLabel>Title</CFormLabel>
                <CFormInput className="premium-input" name="title" value={formData.title} onChange={handleChange} />
                {errors.title && <small className="text-danger">{errors.title}</small>}
              </CCol>

              <CCol xs={12} md={6} className="mb-3">
                <CFormLabel>Category</CFormLabel>
                <Select
                  classNamePrefix="premium-react-select"
                  options={formCategoryOptions}
                  value={formCategoryOptions.find((opt) => opt.value === formData.category_id) || null}
                  onChange={(selected) => {
                    setFormData((prev) => ({
                      ...prev,
                      category_id: selected?.value || '',
                    }))
                    setErrors((prev) => ({
                      ...prev,
                      category_id: '',
                    }))
                  }}
                  isSearchable={false}
                  styles={getSelectStyles(isDark)}
                  menuPortalTarget={document.body}
                />
                {errors.category_id && <small className="text-danger">{errors.category_id}</small>}
              </CCol>

              <CCol xs={12} md={3} className="mb-3">
                <CFormLabel>Price</CFormLabel>
                <CFormInput className="premium-input" name="price" type="number" value={formData.price} onChange={handleChange} />
                {errors.price && <small className="text-danger">{errors.price}</small>}
              </CCol>

              <CCol xs={12} md={3} className="mb-3">
                <CFormLabel>Compare Price</CFormLabel>
                <CFormInput className="premium-input" name="compare_price" type="number" value={formData.compare_price} onChange={handleChange} />
              </CCol>

              <CCol xs={12} md={3} className="mb-3">
                <CFormLabel>Stock</CFormLabel>
                <CFormInput className="premium-input" name="stock" type="number" value={formData.stock} onChange={handleChange} />
                {errors.stock && <small className="text-danger">{errors.stock}</small>}
              </CCol>

              <CCol xs={12} md={3} className="mb-3">
                <CFormLabel>SKU</CFormLabel>
                <CFormInput className="premium-input" name="sku" value={formData.sku} onChange={handleChange} />
              </CCol>

              <CCol xs={12} md={6} className="mb-3">
                <CFormLabel>Sizes</CFormLabel>
                <CFormInput
                  className="premium-input"
                  name="sizes"
                  value={formData.sizes}
                  onChange={handleChange}
                  placeholder="S, M, L"
                />
              </CCol>

              <CCol xs={12} md={6} className="mb-3">
                <CFormLabel>Colors</CFormLabel>
                <CFormInput
                  className="premium-input"
                  name="colors"
                  value={formData.colors}
                  onChange={handleChange}
                  placeholder="Red, Blue, Black"
                />
              </CCol>

              <CCol xs={12} md={6} className="mb-3">
                <CFormLabel>Short Description</CFormLabel>
                <CFormInput
                  className="premium-input"
                  name="short_description"
                  value={formData.short_description}
                  onChange={handleChange}
                />
              </CCol>

              <CCol xs={12} md={6} className="mb-3 d-flex align-items-end">
                <div className="w-100">
                  <CFormSwitch
                    label="Featured Product"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleChange}
                  />
                  <CFormSwitch
                    className="mt-2"
                    label="Active Product"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                  />
                </div>
              </CCol>

              <CCol xs={12} className="mb-3">
                <CFormLabel>Product Images</CFormLabel>

                <div
                  className={`premium-file-upload ${selectedFiles.length || existingImages.length || newImagePreviews.length ? 'has-file' : ''}`}
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      fileInputRef.current?.click()
                    }
                  }}
                >
                  <div className="premium-file-upload__button">Choose Files</div>
                  <div className="premium-file-upload__name">
                    {selectedFiles.length
                      ? `${selectedFiles.length} new file(s) selected`
                      : existingImages.length
                        ? `${existingImages.length} existing image(s)`
                        : 'No files chosen'}
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={handleImagesChange}
                  className="d-none"
                />
              </CCol>

              {existingImages.length > 0 && (
                <CCol xs={12} className="mb-3">
                  <CFormLabel>Existing Images</CFormLabel>
                  <CRow className="g-3">
                    {existingImages.map((img, index) => (
                      <CCol xs={6} sm={4} md={3} key={`existing-${index}`}>
                        <div className="position-relative">
                          <CImage
                            src={img}
                            fluid
                            rounded
                            className="border object-fit-cover"
                            style={{ height: '120px', width: '100%' }}
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(index)}
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
                    ))}
                  </CRow>
                </CCol>
              )}

              {newImagePreviews.length > 0 && (
                <CCol xs={12} className="mb-3">
                  <CFormLabel>New Images</CFormLabel>
                  <CRow className="g-3">
                    {newImagePreviews.map((img, index) => (
                      <CCol xs={6} sm={4} md={3} key={`new-${index}`}>
                        <div className="position-relative">
                          <CImage
                            src={img}
                            fluid
                            rounded
                            className="border object-fit-cover"
                            style={{ height: '120px', width: '100%' }}
                          />
                          <button
                            type="button"
                            onClick={() => removeNewImage(index)}
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
                    ))}
                  </CRow>
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
            <CButton type="submit" color="primary" className="premium-main-btn" disabled={loading}>
              {loading ? 'Saving...' : editingItem ? 'Update' : 'Create'}
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>

      <CModal size="lg" visible={viewVisible} onClose={() => setViewVisible(false)}>
        <CModalHeader>
          <CModalTitle>Product Details</CModalTitle>
        </CModalHeader>

        <CModalBody>
          {selectedItem ? (
            <CRow>
              <CCol xs={12} md={4} className="text-center mb-4">
                {selectedItem.images?.[0] ? (
                  <CImage src={selectedItem.images[0]} fluid rounded className="border" />
                ) : (
                  <div className="d-flex justify-content-center">
                    <CAvatar size="xl" color="light" className="border premium-no-image-avatar">
                      <CIcon icon={cilImage} size="xxl" />
                    </CAvatar>
                  </div>
                )}
              </CCol>

              <CCol xs={12} md={8}>
                <div className="mb-2"><strong>Title:</strong> {selectedItem.title}</div>
                <div className="mb-2"><strong>Slug:</strong> {selectedItem.slug}</div>
                <div className="mb-2"><strong>Category:</strong> {selectedItem.category_id?.name || '-'}</div>
                <div className="mb-2"><strong>Price:</strong> ${selectedItem.price}</div>
                <div className="mb-2"><strong>Compare Price:</strong> ${selectedItem.compare_price}</div>
                <div className="mb-2"><strong>Stock:</strong> {selectedItem.stock}</div>
                <div className="mb-2"><strong>SKU:</strong> {selectedItem.sku}</div>
                <div className="mb-2"><strong>Sizes:</strong> {selectedItem.sizes?.join(', ') || '-'}</div>
                <div className="mb-2"><strong>Colors:</strong> {selectedItem.colors?.join(', ') || '-'}</div>
                <div className="mb-2">
                  <strong>Featured:</strong>{' '}
                  <CBadge color={selectedItem.is_featured ? 'success' : 'secondary'}>
                    {selectedItem.is_featured ? 'Yes' : 'No'}
                  </CBadge>
                </div>
                <div className="mb-2">
                  <strong>Status:</strong>{' '}
                  <CBadge color={selectedItem.is_active ? 'success' : 'secondary'}>
                    {selectedItem.is_active ? 'Active' : 'Inactive'}
                  </CBadge>
                </div>
                <div className="mb-2"><strong>Short Description:</strong> {selectedItem.short_description || '-'}</div>
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

      <CModal size="lg" visible={galleryVisible} onClose={() => setGalleryVisible(false)}>
        <CModalHeader>
          <CModalTitle>Product Images</CModalTitle>
        </CModalHeader>

        <CModalBody>
          <CRow>
            {galleryImages?.length ? (
              galleryImages.map((img, index) => (
                <CCol xs={12} sm={6} md={4} key={index} className="mb-3">
                  <CImage src={img} fluid rounded className="border" />
                </CCol>
              ))
            ) : (
              <CCol>
                <div className="text-center text-medium-emphasis">No images available</div>
              </CCol>
            )}
          </CRow>
        </CModalBody>
      </CModal>
    </>
  )
}

export default ProductsList