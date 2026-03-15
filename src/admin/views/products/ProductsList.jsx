import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CFormSelect,
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
} from '@coreui/icons'
import toast from 'react-hot-toast'
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
} from '../../store/slices/productSlice'
import { fetchCategories } from '../../store/slices/categorySlice'

const initialForm = {
  title: '',
  slug: '',
  short_description: '',
  description: '',
  category_id: '',
  price: '',
  compare_price: '',
  stock: '',
  sku: '',
  image_1: '',
  image_2: '',
  image_3: '',
  is_featured: true,
  is_active: true,
}

const ProductsList = () => {
  const dispatch = useDispatch()
  const { list, loading, error } = useSelector((state) => state.products)
  const { list: categoryList } = useSelector((state) => state.categories)

  const [visible, setVisible] = useState(false)
  const [viewVisible, setViewVisible] = useState(false)
  const [galleryVisible, setGalleryVisible] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [galleryImages, setGalleryImages] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState(initialForm)

  const itemsPerPage = 8

  useEffect(() => {
    dispatch(fetchProducts())
    dispatch(fetchCategories())
  }, [dispatch])

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  const filteredList = useMemo(() => {
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

    return data
  }, [list, search, statusFilter, categoryFilter])

  const totalPages = Math.ceil(filteredList.length / itemsPerPage)
  const paginatedList = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required'
    if (!formData.category_id) newErrors.category_id = 'Category is required'
    if (formData.price === '' || Number(formData.price) <= 0) {
      newErrors.price = 'Valid price is required'
    }
    if (formData.stock === '' || Number(formData.stock) < 0) {
      newErrors.stock = 'Valid stock is required'
    }
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const openCreateModal = () => {
    setEditingItem(null)
    setFormData(initialForm)
    setErrors({})
    setVisible(true)
  }

  const openEditModal = (item) => {
    setEditingItem(item)
    setFormData({
      title: item?.title || '',
      slug: item?.slug || '',
      short_description: item?.short_description || '',
      description: item?.description || '',
      category_id: item?.category_id?._id || '',
      price: item?.price ?? '',
      compare_price: item?.compare_price ?? '',
      stock: item?.stock ?? '',
      sku: item?.sku || '',
      image_1: item?.images?.[0] || '',
      image_2: item?.images?.[1] || '',
      image_3: item?.images?.[2] || '',
      is_featured: item?.is_featured ?? true,
      is_active: item?.is_active ?? true,
    })
    setErrors({})
    setVisible(true)
  }

  const openViewModal = (item) => {
    setSelectedItem(item)
    setViewVisible(true)
  }

  const openGallery = (images = []) => {
    setGalleryImages(images)
    setGalleryVisible(true)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    const payload = {
      title: formData.title,
      slug: formData.slug,
      short_description: formData.short_description,
      description: formData.description,
      category_id: formData.category_id,
      price: Number(formData.price),
      compare_price: Number(formData.compare_price || 0),
      stock: Number(formData.stock),
      sku: formData.sku,
      images: [formData.image_1, formData.image_2, formData.image_3].filter(Boolean),
      is_featured: formData.is_featured,
      is_active: formData.is_active,
    }

    let result
    if (editingItem?._id) {
      result = await dispatch(updateProduct({ id: editingItem._id, payload }))
    } else {
      result = await dispatch(createProduct(payload))
    }

    if (result.meta.requestStatus === 'fulfilled') {
      toast.success(editingItem ? 'Product updated successfully' : 'Product created successfully')
      setVisible(false)
      setEditingItem(null)
      setFormData(initialForm)
    } else {
      toast.error(result.payload || 'Something went wrong')
    }
  }

  const handleDelete = async (id) => {
    const ok = window.confirm('Are you sure you want to delete this product?')
    if (!ok) return

    const result = await dispatch(deleteProduct(id))
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Product deleted successfully')
    } else {
      toast.error(result.payload || 'Delete failed')
    }
  }

  const handleToggleStatus = async (item) => {
    const payload = {
      ...item,
      category_id: item.category_id?._id || item.category_id,
      is_active: !item.is_active,
    }

    const result = await dispatch(toggleProductStatus({ id: item._id, payload }))

    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Product status updated')
    } else {
      toast.error(result.payload || 'Status update failed')
    }
  }

  const handleToggleFeatured = async (item) => {
    const payload = {
      ...item,
      category_id: item.category_id?._id || item.category_id,
      is_featured: !item.is_featured,
    }

    const result = await dispatch(updateProduct({ id: item._id, payload }))

    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Featured status updated')
    } else {
      toast.error(result.payload || 'Featured update failed')
    }
  }

  return (
    <>
      <CCard className="shadow-sm border-0 premium-table-card">
        <CCardHeader className="d-flex justify-content-between align-items-center premium-card-header">
          <div>
            <strong className="fs-5">Products</strong>
            <div className="text-medium-emphasis small">Manage all product records</div>
          </div>

          <CButton color="primary" className="px-4" onClick={openCreateModal}>
            Add Product
          </CButton>
        </CCardHeader>

        <CCardBody>
          <CRow className="mb-4 g-3">
            <CCol md={4}>
              <CFormInput
                placeholder="Search by title, slug, sku, category"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </CCol>

            <CCol md={3}>
              <CFormSelect
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value)
                  setCurrentPage(1)
                }}
              >
                <option value="all">All Categories</option>
                {categoryList?.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </CFormSelect>
            </CCol>

            <CCol md={3}>
              <CFormSelect
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setCurrentPage(1)
                }}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </CFormSelect>
            </CCol>
          </CRow>

          <CTable hover responsive align="middle" className="premium-table">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>
                <CTableHeaderCell>Image</CTableHeaderCell>
                <CTableHeaderCell>Title</CTableHeaderCell>
                <CTableHeaderCell>Category</CTableHeaderCell>
                <CTableHeaderCell>Price</CTableHeaderCell>
                <CTableHeaderCell>Compare</CTableHeaderCell>
                <CTableHeaderCell>Stock</CTableHeaderCell>
                <CTableHeaderCell>Featured</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Created</CTableHeaderCell>
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

                    <CTableDataCell>
                      <span className="fw-semibold">${item.price}</span>
                    </CTableDataCell>

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
                      {new Date(item.createdAt).toLocaleDateString()}
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
            <CPagination className="mt-4 justify-content-end">
              <CPaginationItem
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </CPaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
                Next
              </CPaginationItem>
            </CPagination>
          )}
        </CCardBody>
      </CCard>

      <CModal size="xl" visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>{editingItem ? 'Edit Product' : 'Add Product'}</CModalTitle>
        </CModalHeader>

        <CForm onSubmit={handleSubmit}>
          <CModalBody>
            <CRow>
              <CCol md={6} className="mb-3">
                <CFormLabel>Title</CFormLabel>
                <CFormInput name="title" value={formData.title} onChange={handleChange} />
                {errors.title && <small className="text-danger">{errors.title}</small>}
              </CCol>

              <CCol md={6} className="mb-3">
                <CFormLabel>Slug</CFormLabel>
                <CFormInput name="slug" value={formData.slug} onChange={handleChange} />
                {errors.slug && <small className="text-danger">{errors.slug}</small>}
              </CCol>

              <CCol md={6} className="mb-3">
                <CFormLabel>Category</CFormLabel>
                <CFormSelect name="category_id" value={formData.category_id} onChange={handleChange}>
                  <option value="">Select category</option>
                  {categoryList?.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </CFormSelect>
                {errors.category_id && <small className="text-danger">{errors.category_id}</small>}
              </CCol>

              <CCol md={3} className="mb-3">
                <CFormLabel>Price</CFormLabel>
                <CFormInput name="price" type="number" value={formData.price} onChange={handleChange} />
                {errors.price && <small className="text-danger">{errors.price}</small>}
              </CCol>

              <CCol md={3} className="mb-3">
                <CFormLabel>Compare Price</CFormLabel>
                <CFormInput
                  name="compare_price"
                  type="number"
                  value={formData.compare_price}
                  onChange={handleChange}
                />
              </CCol>

              <CCol md={4} className="mb-3">
                <CFormLabel>Stock</CFormLabel>
                <CFormInput name="stock" type="number" value={formData.stock} onChange={handleChange} />
                {errors.stock && <small className="text-danger">{errors.stock}</small>}
              </CCol>

              <CCol md={4} className="mb-3">
                <CFormLabel>SKU</CFormLabel>
                <CFormInput name="sku" value={formData.sku} onChange={handleChange} />
                {errors.sku && <small className="text-danger">{errors.sku}</small>}
              </CCol>

              <CCol md={4} className="mb-3">
                <CFormLabel>Short Description</CFormLabel>
                <CFormInput
                  name="short_description"
                  value={formData.short_description}
                  onChange={handleChange}
                />
              </CCol>

              <CCol md={4} className="mb-3">
                <CFormLabel>Image 1 URL</CFormLabel>
                <CFormInput name="image_1" value={formData.image_1} onChange={handleChange} />
              </CCol>

              <CCol md={4} className="mb-3">
                <CFormLabel>Image 2 URL</CFormLabel>
                <CFormInput name="image_2" value={formData.image_2} onChange={handleChange} />
              </CCol>

              <CCol md={4} className="mb-3">
                <CFormLabel>Image 3 URL</CFormLabel>
                <CFormInput name="image_3" value={formData.image_3} onChange={handleChange} />
              </CCol>

              <CCol md={6} className="mb-3">
                <CFormSwitch
                  label="Featured Product"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleChange}
                />
              </CCol>

              <CCol md={6} className="mb-3">
                <CFormSwitch
                  label="Active Product"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                />
              </CCol>

              <CCol md={12} className="mb-3">
                <CFormLabel>Description</CFormLabel>
                <CFormTextarea
                  rows={4}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </CCol>
            </CRow>
          </CModalBody>

          <CModalFooter>
            <CButton color="secondary" onClick={() => setVisible(false)}>
              Cancel
            </CButton>
            <CButton type="submit" color="primary">
              {editingItem ? 'Update' : 'Create'}
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
              <CCol md={4} className="text-center mb-4">
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

              <CCol md={8}>
                <div className="mb-2"><strong>Title:</strong> {selectedItem.title}</div>
                <div className="mb-2"><strong>Slug:</strong> {selectedItem.slug}</div>
                <div className="mb-2"><strong>Category:</strong> {selectedItem.category_id?.name || '-'}</div>
                <div className="mb-2"><strong>Price:</strong> ${selectedItem.price}</div>
                <div className="mb-2"><strong>Compare Price:</strong> ${selectedItem.compare_price}</div>
                <div className="mb-2"><strong>Stock:</strong> {selectedItem.stock}</div>
                <div className="mb-2"><strong>SKU:</strong> {selectedItem.sku}</div>
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
                <div className="mb-2"><strong>Created:</strong> {new Date(selectedItem.createdAt).toLocaleString()}</div>
                <div className="mb-2"><strong>Updated:</strong> {new Date(selectedItem.updatedAt).toLocaleString()}</div>
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
                <CCol md={4} key={index} className="mb-3">
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
