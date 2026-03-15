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
  cilFolderOpen,
  cilImage,
  cilZoom,
  cilPencil,
  cilTrash,
} from '@coreui/icons'
import toast from 'react-hot-toast'
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
} from '../../store/slices/categorySlice'

const initialForm = {
  name: '',
  slug: '',
  image: '',
  description: '',
  menu_section: 'retail',
  group_title: '',
  sort_order: '',
  icon: '',
  is_active: true,
}

const CategoriesList = () => {
  const dispatch = useDispatch()
  const { list, loading, error } = useSelector((state) => state.categories)

  const [visible, setVisible] = useState(false)
  const [viewVisible, setViewVisible] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [editingItem, setEditingItem] = useState(null)
  const [search, setSearch] = useState('')
  const [menuFilter, setMenuFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState(initialForm)

  const itemsPerPage = 8

  useEffect(() => {
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
          item.name?.toLowerCase().includes(q) ||
          item.slug?.toLowerCase().includes(q) ||
          item.group_title?.toLowerCase().includes(q)
      )
    }

    if (menuFilter !== 'all') {
      data = data.filter((item) => item.menu_section === menuFilter)
    }

    return data
  }, [list, search, menuFilter])

  const totalPages = Math.ceil(filteredList.length / itemsPerPage)
  const paginatedList = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required'
    if (!formData.group_title.trim()) newErrors.group_title = 'Group title is required'
    if (!formData.menu_section.trim()) newErrors.menu_section = 'Menu section is required'
    if (formData.sort_order === '' || Number(formData.sort_order) < 0) {
      newErrors.sort_order = 'Valid sort order is required'
    }

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
      name: item?.name || '',
      slug: item?.slug || '',
      image: item?.image || '',
      description: item?.description || '',
      menu_section: item?.menu_section || 'retail',
      group_title: item?.group_title || '',
      sort_order: item?.sort_order ?? '',
      icon: item?.icon || '',
      is_active: item?.is_active ?? true,
    })
    setErrors({})
    setVisible(true)
  }

  const openViewModal = (item) => {
    setSelectedItem(item)
    setViewVisible(true)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    const payload = {
      ...formData,
      sort_order: Number(formData.sort_order),
    }

    let result
    if (editingItem?._id) {
      result = await dispatch(updateCategory({ id: editingItem._id, payload }))
    } else {
      result = await dispatch(createCategory(payload))
    }

    if (result.meta.requestStatus === 'fulfilled') {
      toast.success(editingItem ? 'Category updated successfully' : 'Category created successfully')
      setVisible(false)
      setEditingItem(null)
      setFormData(initialForm)
    } else {
      toast.error(result.payload || 'Something went wrong')
    }
  }

  const handleDelete = async (id) => {
    const ok = window.confirm('Are you sure you want to delete this category?')
    if (!ok) return

    const result = await dispatch(deleteCategory(id))
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Category deleted successfully')
    } else {
      toast.error(result.payload || 'Delete failed')
    }
  }

  const handleToggleStatus = async (item) => {
    const result = await dispatch(
      toggleCategoryStatus({
        id: item._id,
        payload: { ...item, is_active: !item.is_active },
      }),
    )

    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Category status updated')
    } else {
      toast.error(result.payload || 'Status update failed')
    }
  }

  return (
    <>
      <CCard className="shadow-sm border-0 premium-table-card">
        <CCardHeader className="d-flex justify-content-between align-items-center premium-card-header">
          <div>
            <strong className="fs-5">Categories</strong>
            <div className="text-medium-emphasis small">Manage all category records</div>
          </div>

          <CButton color="primary" className="px-4" onClick={openCreateModal}>
            Add Category
          </CButton>
        </CCardHeader>

        <CCardBody>
          <CRow className="mb-4 g-3">
            <CCol md={6}>
              <CFormInput
                placeholder="Search by name, slug, group title"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </CCol>

            <CCol md={3}>
              <CFormSelect
                value={menuFilter}
                onChange={(e) => {
                  setMenuFilter(e.target.value)
                  setCurrentPage(1)
                }}
              >
                <option value="all">All Sections</option>
                <option value="retail">Retail</option>
                <option value="wholesale">Wholesale</option>
              </CFormSelect>
            </CCol>
          </CRow>

          <CTable hover responsive align="middle" className="premium-table">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>
                <CTableHeaderCell>Image</CTableHeaderCell>
                <CTableHeaderCell>Name</CTableHeaderCell>
                <CTableHeaderCell>Group</CTableHeaderCell>
                <CTableHeaderCell>Section</CTableHeaderCell>
                <CTableHeaderCell>Sort</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
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

      <CModal size="lg" visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>{editingItem ? 'Edit Category' : 'Add Category'}</CModalTitle>
        </CModalHeader>

        <CForm onSubmit={handleSubmit}>
          <CModalBody>
            <CRow>
              <CCol md={6} className="mb-3">
                <CFormLabel>Name</CFormLabel>
                <CFormInput name="name" value={formData.name} onChange={handleChange} />
                {errors.name && <small className="text-danger">{errors.name}</small>}
              </CCol>

              <CCol md={6} className="mb-3">
                <CFormLabel>Slug</CFormLabel>
                <CFormInput name="slug" value={formData.slug} onChange={handleChange} />
                {errors.slug && <small className="text-danger">{errors.slug}</small>}
              </CCol>

              <CCol md={6} className="mb-3">
                <CFormLabel>Menu Section</CFormLabel>
                <CFormSelect name="menu_section" value={formData.menu_section} onChange={handleChange}>
                  <option value="retail">Retail</option>
                  <option value="wholesale">Wholesale</option>
                </CFormSelect>
                {errors.menu_section && <small className="text-danger">{errors.menu_section}</small>}
              </CCol>

              <CCol md={6} className="mb-3">
                <CFormLabel>Group Title</CFormLabel>
                <CFormInput name="group_title" value={formData.group_title} onChange={handleChange} />
                {errors.group_title && <small className="text-danger">{errors.group_title}</small>}
              </CCol>

              <CCol md={6} className="mb-3">
                <CFormLabel>Sort Order</CFormLabel>
                <CFormInput name="sort_order" type="number" value={formData.sort_order} onChange={handleChange} />
                {errors.sort_order && <small className="text-danger">{errors.sort_order}</small>}
              </CCol>

              <CCol md={6} className="mb-3">
                <CFormLabel>Image URL</CFormLabel>
                <CFormInput name="image" value={formData.image} onChange={handleChange} />
              </CCol>

              <CCol md={12} className="mb-3">
                <CFormLabel>Description</CFormLabel>
                <CFormTextarea rows={4} name="description" value={formData.description} onChange={handleChange} />
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
          <CModalTitle>Category Details</CModalTitle>
        </CModalHeader>

        <CModalBody>
          {selectedItem ? (
            <CRow>
              <CCol md={4} className="text-center mb-4">
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

              <CCol md={8}>
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
    </>
  )
}

export default CategoriesList
