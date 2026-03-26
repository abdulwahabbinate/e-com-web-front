import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import CIcon from '@coreui/icons-react'
import {
  cilChevronBottom,
  cilCloudUpload,
  cilImage,
  cilTrash,
  cilPlus,
  cilMinus,
} from '@coreui/icons'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CRow,
  CSpinner,
  CImage,
  CBadge,
} from '@coreui/react'
import {
  fetchAboutPage,
  createAboutPage,
  updateAboutPage,
  clearAboutPageError,
} from '../../store/slices/aboutPageSlice'

const toastAlert = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true,
})

const getInitialState = () => ({
  slug: 'about',
  hero_section: {
    badge: 'ABOUT OUR BRAND',
    title: 'A Premium Ecommerce Experience Built Around Modern Fashion',
    description:
      'We are building more than just an online store. Our goal is to create a polished shopping destination where modern design, premium product presentation, and customer trust come together in one seamless experience.',
    primary_button_text: 'Explore Products',
    primary_button_link: '/product',
    secondary_button_text: 'Contact Us',
    secondary_button_link: '/contact',
    vision_badge: 'OUR VISION',
    vision_title: 'Style, Simplicity, and Premium Shopping',
    vision_description:
      'We design every page, every interaction, and every product experience to feel elegant, trustworthy, and future-ready for modern ecommerce brands.',
    vision_stats: [
      { number: '10K+', label: 'Happy Shoppers' },
      { number: '250+', label: 'Premium Products' },
    ],
  },
  story_section: {
    badge: 'OUR STORY',
    title: 'Designed for Customers Who Value Premium Presentation',
    paragraph_one:
      'Our platform is inspired by the world’s leading ecommerce experiences where clarity, product beauty, and usability are never compromised.',
    paragraph_two:
      'From product cards to checkout, every detail is carefully crafted to create a smooth and professional customer journey. We believe premium design is not only about appearance, but also about trust, convenience, and consistency.',
    image: '',
    image_file: null,
  },
  stats_section: {
    items: [
      { number: '10K+', label: 'Customers served with a premium shopping experience' },
      { number: '250+', label: 'Curated products across modern fashion categories' },
      { number: '98%', label: 'Customer satisfaction driven by trust and quality' },
      { number: '24/7', label: 'Support-focused mindset for a better brand experience' },
    ],
  },
  features_section: {
    badge: 'WHY CHOOSE US',
    title: 'Built Like A Premium Ecommerce Brand',
    description:
      'Everything is designed to make the shopping experience clean, elegant, and reliable on every device.',
    items: [
      {
        icon: 'fa-diamond',
        title: 'Premium Quality',
        description:
          'We focus on refined materials, modern aesthetics, and timeless product quality for a premium shopping experience.',
      },
      {
        icon: 'fa-truck',
        title: 'Fast Delivery',
        description:
          'Our streamlined process helps deliver your favorite products quickly, safely, and with complete order confidence.',
      },
      {
        icon: 'fa-refresh',
        title: 'Easy Returns',
        description:
          'Enjoy a smooth and transparent return process designed to make online shopping more reliable and stress-free.',
      },
      {
        icon: 'fa-shield',
        title: 'Secure Shopping',
        description:
          'From browsing to checkout, every part of the experience is designed with trust, safety, and usability in mind.',
      },
    ],
  },
  cta_section: {
    badge: 'START SHOPPING',
    title: 'Discover the next level of premium online shopping',
    description:
      'Browse our curated collection and enjoy a fashion-first ecommerce experience designed with modern customers in mind.',
    primary_button_text: 'Shop Now',
    primary_button_link: '/product',
    secondary_button_text: 'Get in Touch',
    secondary_button_link: '/contact',
  },
})

const initialCollapseState = {
  hero: true,
  story: true,
  stats: true,
  features: true,
  cta: true,
}

const AboutPageContent = () => {
  const dispatch = useDispatch()
  const { item, loading, error } = useSelector((state) => state.aboutPage)

  const [formData, setFormData] = useState(getInitialState())
  const [errors, setErrors] = useState({})
  const [isExisting, setIsExisting] = useState(false)
  const [collapsedSections, setCollapsedSections] = useState(initialCollapseState)
  const [removeImages, setRemoveImages] = useState({})

  const storyImageRef = useRef(null)

  useEffect(() => {
    dispatch(fetchAboutPage())
  }, [dispatch])

  useEffect(() => {
    if (item) {
      setFormData({
        ...item,
        story_section: {
          ...item.story_section,
          image_file: null,
        },
      })
      setRemoveImages({})
      setIsExisting(true)
    }
  }, [item])

  useEffect(() => {
    if (error?.message && error?.message !== 'About page content not found') {
      toastAlert.fire({
        icon: 'error',
        title: error.message,
      })
    }

    if (error?.message === 'About page content not found') {
      setFormData(getInitialState())
      setIsExisting(false)
    }
  }, [error])

  useEffect(() => {
    return () => {
      dispatch(clearAboutPageError())
    }
  }, [dispatch])

  const toggleSection = (key) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
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

  const validateForm = () => {
    const newErrors = {}

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required'
    }

    if (!formData.hero_section?.title?.trim()) {
      newErrors['hero_section.title'] = 'Hero title is required'
    }

    if (!formData.story_section?.title?.trim()) {
      newErrors['story_section.title'] = 'Story title is required'
    }

    if (!formData.features_section?.title?.trim()) {
      newErrors['features_section.title'] = 'Features title is required'
    }

    if (!formData.cta_section?.title?.trim()) {
      newErrors['cta_section.title'] = 'CTA title is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSectionFieldChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const handleHeroVisionStatChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.hero_section.vision_stats]
      updated[index] = {
        ...updated[index],
        [field]: value,
      }

      return {
        ...prev,
        hero_section: {
          ...prev.hero_section,
          vision_stats: updated,
        },
      }
    })
  }

  const handleStatsChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.stats_section.items]
      updated[index] = {
        ...updated[index],
        [field]: value,
      }

      return {
        ...prev,
        stats_section: {
          ...prev.stats_section,
          items: updated,
        },
      }
    })
  }

  const handleFeatureChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.features_section.items]
      updated[index] = {
        ...updated[index],
        [field]: value,
      }

      return {
        ...prev,
        features_section: {
          ...prev.features_section,
          items: updated,
        },
      }
    })
  }

  const handleRemoveImage = () => {
    setRemoveImages((prev) => ({
      ...prev,
      story_image: true,
    }))

    setFormData((prev) => ({
      ...prev,
      story_section: {
        ...prev.story_section,
        image_file: null,
        image: '',
      },
    }))

    if (storyImageRef.current) {
      storyImageRef.current.value = ''
    }
  }

  const buildPayload = () => {
    const payload = new FormData()

    payload.append('slug', formData.slug)
    payload.append('hero_section', JSON.stringify(formData.hero_section))
    payload.append(
      'story_section',
      JSON.stringify((() => {
        const { image_file, ...rest } = formData.story_section
        return rest
      })()),
    )
    payload.append('stats_section', JSON.stringify(formData.stats_section))
    payload.append('features_section', JSON.stringify(formData.features_section))
    payload.append('cta_section', JSON.stringify(formData.cta_section))
    payload.append('remove_images', JSON.stringify(removeImages))

    if (formData.story_section.image_file instanceof File) {
      payload.append('story_image', formData.story_section.image_file)
    }

    return payload
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    const payload = buildPayload()

    let result
    if (isExisting) {
      result = await dispatch(updateAboutPage({ slug: 'about', payload }))
    } else {
      result = await dispatch(createAboutPage(payload))
    }

    if (result.meta.requestStatus === 'fulfilled') {
      toastAlert.fire({
        icon: 'success',
        title: isExisting
          ? 'About page content updated successfully'
          : 'About page content created successfully',
      })

      setErrors({})
      dispatch(fetchAboutPage())
    } else {
      applyBackendValidationErrors(result.payload)
    }
  }

  const renderSectionHeader = (title, subtitle, key, badgeText) => (
    <div
      className="premium-cms-section-header"
      onClick={() => toggleSection(key)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          toggleSection(key)
        }
      }}
    >
      <div className="premium-cms-section-header__left">
        <div className="premium-cms-section-header__meta">
          {badgeText ? <CBadge color="primary" className="premium-cms-badge">{badgeText}</CBadge> : null}
        </div>
        <div>
          <h5 className="premium-cms-section-title mb-1">{title}</h5>
          <div className="premium-cms-section-subtitle">{subtitle}</div>
        </div>
      </div>

      <button type="button" className={`premium-cms-collapse-btn ${collapsedSections[key] ? 'open' : ''}`}>
        <CIcon icon={cilChevronBottom} />
      </button>
    </div>
  )

  const renderImagePreview = (src) => {
    if (!src) {
      return (
        <div className="premium-cms-image-empty">
          <CIcon icon={cilImage} size="xl" />
          <span>No image selected</span>
        </div>
      )
    }

    return (
      <div className="premium-cms-image-preview">
        <CImage src={src} fluid rounded className="premium-cms-image-preview__img" />
        <button
          type="button"
          className="premium-cms-image-remove-btn"
          onClick={handleRemoveImage}
        >
          <CIcon icon={cilTrash} />
        </button>
      </div>
    )
  }

  const pageTitle = useMemo(() => {
    return isExisting ? 'Edit About Page Content' : 'Create About Page Content'
  }, [isExisting])

  return (
    <div className="premium-home-cms-page">
      <CCard className="shadow-sm border-0 premium-home-cms-card">
        <CCardHeader className="premium-card-header premium-home-cms-topbar">
          <div>
            <div className="premium-home-cms-eyebrow">CMS MANAGEMENT</div>
            <strong className="fs-4">About Page CMS</strong>
            <div className="text-medium-emphasis small mt-1">{pageTitle}</div>
          </div>

          <div className="premium-home-cms-status">
            <CBadge color={isExisting ? 'success' : 'warning'}>
              {isExisting ? 'Existing Content' : 'New Content'}
            </CBadge>
          </div>
        </CCardHeader>

        <CCardBody className="premium-home-cms-body">
          {loading && !item ? (
            <div className="text-center py-5">
              <CSpinner />
            </div>
          ) : (
            <CForm onSubmit={handleSubmit}>
              <div className="premium-home-cms-overview">
                <div className="premium-home-cms-overview__content">
                  <h4 className="mb-2">Manage your premium about page content</h4>
                  <p className="mb-0">
                    Update brand story, hero message, stats, why choose us cards, and call-to-action
                    content from one polished CMS panel.
                  </p>
                </div>

                <div className="premium-home-cms-overview__meta">
                  <div className="premium-home-cms-overview__chip">
                    <span>Slug</span>
                    <strong>{formData.slug}</strong>
                  </div>
                </div>
              </div>

              <div className="premium-cms-sections">
                <div className="premium-cms-section-card">
                  {renderSectionHeader(
                    'Hero Section',
                    'Manage the main about page introduction block.',
                    'hero',
                    'Hero',
                  )}

                  {collapsedSections.hero && (
                    <div className="premium-cms-section-body">
                      <CRow>
                        <CCol lg={4} md={6} className="mb-3">
                          <CFormLabel>Badge</CFormLabel>
                          <CFormInput
                            className="premium-input"
                            value={formData.hero_section.badge || ''}
                            onChange={(e) => handleSectionFieldChange('hero_section', 'badge', e.target.value)}
                          />
                        </CCol>

                        <CCol lg={8} className="mb-3">
                          <CFormLabel>Title</CFormLabel>
                          <CFormTextarea
                            className={`premium-input premium-textarea ${errors['hero_section.title'] ? 'is-invalid' : ''}`}
                            rows={3}
                            value={formData.hero_section.title || ''}
                            onChange={(e) => handleSectionFieldChange('hero_section', 'title', e.target.value)}
                          />
                          {errors['hero_section.title'] && (
                            <small className="text-danger">{errors['hero_section.title']}</small>
                          )}
                        </CCol>

                        <CCol lg={12} className="mb-3">
                          <CFormLabel>Description</CFormLabel>
                          <CFormTextarea
                            className="premium-input premium-textarea"
                            rows={5}
                            value={formData.hero_section.description || ''}
                            onChange={(e) => handleSectionFieldChange('hero_section', 'description', e.target.value)}
                          />
                        </CCol>

                        <CCol lg={3} md={6} className="mb-3">
                          <CFormLabel>Primary Button Text</CFormLabel>
                          <CFormInput
                            className="premium-input"
                            value={formData.hero_section.primary_button_text || ''}
                            onChange={(e) =>
                              handleSectionFieldChange('hero_section', 'primary_button_text', e.target.value)
                            }
                          />
                        </CCol>

                        <CCol lg={3} md={6} className="mb-3">
                          <CFormLabel>Primary Button Link</CFormLabel>
                          <CFormInput
                            className="premium-input"
                            value={formData.hero_section.primary_button_link || ''}
                            onChange={(e) =>
                              handleSectionFieldChange('hero_section', 'primary_button_link', e.target.value)
                            }
                          />
                        </CCol>

                        <CCol lg={3} md={6} className="mb-3">
                          <CFormLabel>Secondary Button Text</CFormLabel>
                          <CFormInput
                            className="premium-input"
                            value={formData.hero_section.secondary_button_text || ''}
                            onChange={(e) =>
                              handleSectionFieldChange('hero_section', 'secondary_button_text', e.target.value)
                            }
                          />
                        </CCol>

                        <CCol lg={3} md={6} className="mb-3">
                          <CFormLabel>Secondary Button Link</CFormLabel>
                          <CFormInput
                            className="premium-input"
                            value={formData.hero_section.secondary_button_link || ''}
                            onChange={(e) =>
                              handleSectionFieldChange('hero_section', 'secondary_button_link', e.target.value)
                            }
                          />
                        </CCol>

                        <CCol lg={4} md={6} className="mb-3">
                          <CFormLabel>Vision Badge</CFormLabel>
                          <CFormInput
                            className="premium-input"
                            value={formData.hero_section.vision_badge || ''}
                            onChange={(e) =>
                              handleSectionFieldChange('hero_section', 'vision_badge', e.target.value)
                            }
                          />
                        </CCol>

                        <CCol lg={8} className="mb-3">
                          <CFormLabel>Vision Title</CFormLabel>
                          <CFormInput
                            className="premium-input"
                            value={formData.hero_section.vision_title || ''}
                            onChange={(e) =>
                              handleSectionFieldChange('hero_section', 'vision_title', e.target.value)
                            }
                          />
                        </CCol>

                        <CCol lg={12} className="mb-3">
                          <CFormLabel>Vision Description</CFormLabel>
                          <CFormTextarea
                            className="premium-input premium-textarea"
                            rows={4}
                            value={formData.hero_section.vision_description || ''}
                            onChange={(e) =>
                              handleSectionFieldChange('hero_section', 'vision_description', e.target.value)
                            }
                          />
                        </CCol>
                      </CRow>

                      {formData.hero_section.vision_stats.map((item, index) => (
                        <div className="premium-cms-inline-card" key={index}>
                          <div className="premium-cms-inline-card__index">{index + 1}</div>

                          <CRow className="flex-grow-1">
                            <CCol lg={4} md={6} className="mb-3">
                              <CFormLabel>Number</CFormLabel>
                              <CFormInput
                                className="premium-input"
                                value={item.number || ''}
                                onChange={(e) => handleHeroVisionStatChange(index, 'number', e.target.value)}
                              />
                            </CCol>

                            <CCol lg={8} md={6} className="mb-3">
                              <CFormLabel>Label</CFormLabel>
                              <CFormInput
                                className="premium-input"
                                value={item.label || ''}
                                onChange={(e) => handleHeroVisionStatChange(index, 'label', e.target.value)}
                              />
                            </CCol>
                          </CRow>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="premium-cms-section-card">
                  {renderSectionHeader(
                    'Story Section',
                    'Manage brand story content and image.',
                    'story',
                    'Story',
                  )}

                  {collapsedSections.story && (
                    <div className="premium-cms-section-body">
                      <CRow>
                        <CCol lg={4} md={6} className="mb-3">
                          <CFormLabel>Badge</CFormLabel>
                          <CFormInput
                            className="premium-input"
                            value={formData.story_section.badge || ''}
                            onChange={(e) => handleSectionFieldChange('story_section', 'badge', e.target.value)}
                          />
                        </CCol>

                        <CCol lg={8} className="mb-3">
                          <CFormLabel>Title</CFormLabel>
                          <CFormTextarea
                            className={`premium-input premium-textarea ${errors['story_section.title'] ? 'is-invalid' : ''}`}
                            rows={3}
                            value={formData.story_section.title || ''}
                            onChange={(e) => handleSectionFieldChange('story_section', 'title', e.target.value)}
                          />
                          {errors['story_section.title'] && (
                            <small className="text-danger">{errors['story_section.title']}</small>
                          )}
                        </CCol>

                        <CCol lg={6} className="mb-3">
                          <CFormLabel>Paragraph One</CFormLabel>
                          <CFormTextarea
                            className="premium-input premium-textarea"
                            rows={5}
                            value={formData.story_section.paragraph_one || ''}
                            onChange={(e) =>
                              handleSectionFieldChange('story_section', 'paragraph_one', e.target.value)
                            }
                          />
                        </CCol>

                        <CCol lg={6} className="mb-3">
                          <CFormLabel>Paragraph Two</CFormLabel>
                          <CFormTextarea
                            className="premium-input premium-textarea"
                            rows={5}
                            value={formData.story_section.paragraph_two || ''}
                            onChange={(e) =>
                              handleSectionFieldChange('story_section', 'paragraph_two', e.target.value)
                            }
                          />
                        </CCol>

                        <CCol lg={12} className="mb-3">
                          <CFormLabel>Image Upload</CFormLabel>

                          <div
                            className={`premium-file-upload ${formData.story_section.image_file || formData.story_section.image ? 'has-file' : ''}`}
                            onClick={() => storyImageRef.current?.click()}
                            role="button"
                            tabIndex={0}
                          >
                            <div className="premium-file-upload__button">
                              <CIcon icon={cilCloudUpload} className="me-2" />
                              Choose File
                            </div>
                            <div className="premium-file-upload__name">
                              {formData.story_section.image_file?.name ||
                                (formData.story_section.image ? 'Image selected' : 'No file chosen')}
                            </div>
                          </div>

                          <input
                            ref={storyImageRef}
                            type="file"
                            accept="image/*"
                            className="d-none"
                            onChange={(e) => {
                              setRemoveImages((prev) => ({
                                ...prev,
                                story_image: false,
                              }))

                              setFormData((prev) => ({
                                ...prev,
                                story_section: {
                                  ...prev.story_section,
                                  image_file: e.target.files?.[0] || null,
                                },
                              }))
                            }}
                          />

                          <div className="mt-3">
                            {renderImagePreview(
                              formData.story_section.image_file
                                ? URL.createObjectURL(formData.story_section.image_file)
                                : formData.story_section.image,
                            )}
                          </div>
                        </CCol>
                      </CRow>
                    </div>
                  )}
                </div>

                <div className="premium-cms-section-card">
                  {renderSectionHeader(
                    'Stats Section',
                    'Manage the four highlight metrics.',
                    'stats',
                    'Stats',
                  )}

                  {collapsedSections.stats && (
                    <div className="premium-cms-section-body">
                      {formData.stats_section.items.map((item, index) => (
                        <div className="premium-cms-inline-card" key={index}>
                          <div className="premium-cms-inline-card__index">{index + 1}</div>

                          <CRow className="flex-grow-1">
                            <CCol lg={3} md={6} className="mb-3">
                              <CFormLabel>Number</CFormLabel>
                              <CFormInput
                                className="premium-input"
                                value={item.number || ''}
                                onChange={(e) => handleStatsChange(index, 'number', e.target.value)}
                              />
                            </CCol>

                            <CCol lg={9} md={6} className="mb-3">
                              <CFormLabel>Label</CFormLabel>
                              <CFormInput
                                className="premium-input"
                                value={item.label || ''}
                                onChange={(e) => handleStatsChange(index, 'label', e.target.value)}
                              />
                            </CCol>
                          </CRow>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="premium-cms-section-card">
                  {renderSectionHeader(
                    'Features Section',
                    'Manage the why choose us cards.',
                    'features',
                    'Features',
                  )}

                  {collapsedSections.features && (
                    <div className="premium-cms-section-body">
                      <CRow className="mb-4">
                        <CCol lg={4} md={6} className="mb-3">
                          <CFormLabel>Badge</CFormLabel>
                          <CFormInput
                            className="premium-input"
                            value={formData.features_section.badge || ''}
                            onChange={(e) => handleSectionFieldChange('features_section', 'badge', e.target.value)}
                          />
                        </CCol>

                        <CCol lg={8} className="mb-3">
                          <CFormLabel>Title</CFormLabel>
                          <CFormTextarea
                            className={`premium-input premium-textarea ${errors['features_section.title'] ? 'is-invalid' : ''}`}
                            rows={3}
                            value={formData.features_section.title || ''}
                            onChange={(e) => handleSectionFieldChange('features_section', 'title', e.target.value)}
                          />
                          {errors['features_section.title'] && (
                            <small className="text-danger">{errors['features_section.title']}</small>
                          )}
                        </CCol>

                        <CCol lg={12} className="mb-3">
                          <CFormLabel>Description</CFormLabel>
                          <CFormTextarea
                            className="premium-input premium-textarea"
                            rows={4}
                            value={formData.features_section.description || ''}
                            onChange={(e) => handleSectionFieldChange('features_section', 'description', e.target.value)}
                          />
                        </CCol>
                      </CRow>

                      {formData.features_section.items.map((item, index) => (
                        <div className="premium-cms-inline-card" key={index}>
                          <div className="premium-cms-inline-card__index">{index + 1}</div>

                          <CRow className="flex-grow-1">
                            <CCol lg={3} md={6} className="mb-3">
                              <CFormLabel>Icon</CFormLabel>
                              <CFormInput
                                className="premium-input"
                                value={item.icon || ''}
                                onChange={(e) => handleFeatureChange(index, 'icon', e.target.value)}
                              />
                            </CCol>

                            <CCol lg={4} md={6} className="mb-3">
                              <CFormLabel>Title</CFormLabel>
                              <CFormInput
                                className="premium-input"
                                value={item.title || ''}
                                onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                              />
                            </CCol>

                            <CCol lg={5} className="mb-3">
                              <CFormLabel>Description</CFormLabel>
                              <CFormTextarea
                                className="premium-input premium-textarea"
                                rows={3}
                                value={item.description || ''}
                                onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                              />
                            </CCol>
                          </CRow>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="premium-cms-section-card">
                  {renderSectionHeader(
                    'CTA Section',
                    'Manage the bottom about page CTA banner.',
                    'cta',
                    'CTA',
                  )}

                  {collapsedSections.cta && (
                    <div className="premium-cms-section-body">
                      <CRow>
                        <CCol lg={4} md={6} className="mb-3">
                          <CFormLabel>Badge</CFormLabel>
                          <CFormInput
                            className="premium-input"
                            value={formData.cta_section.badge || ''}
                            onChange={(e) => handleSectionFieldChange('cta_section', 'badge', e.target.value)}
                          />
                        </CCol>

                        <CCol lg={8} className="mb-3">
                          <CFormLabel>Title</CFormLabel>
                          <CFormTextarea
                            className={`premium-input premium-textarea ${errors['cta_section.title'] ? 'is-invalid' : ''}`}
                            rows={3}
                            value={formData.cta_section.title || ''}
                            onChange={(e) => handleSectionFieldChange('cta_section', 'title', e.target.value)}
                          />
                          {errors['cta_section.title'] && (
                            <small className="text-danger">{errors['cta_section.title']}</small>
                          )}
                        </CCol>

                        <CCol lg={12} className="mb-3">
                          <CFormLabel>Description</CFormLabel>
                          <CFormTextarea
                            className="premium-input premium-textarea"
                            rows={4}
                            value={formData.cta_section.description || ''}
                            onChange={(e) => handleSectionFieldChange('cta_section', 'description', e.target.value)}
                          />
                        </CCol>

                        <CCol lg={3} md={6} className="mb-3">
                          <CFormLabel>Primary Button Text</CFormLabel>
                          <CFormInput
                            className="premium-input"
                            value={formData.cta_section.primary_button_text || ''}
                            onChange={(e) =>
                              handleSectionFieldChange('cta_section', 'primary_button_text', e.target.value)
                            }
                          />
                        </CCol>

                        <CCol lg={3} md={6} className="mb-3">
                          <CFormLabel>Primary Button Link</CFormLabel>
                          <CFormInput
                            className="premium-input"
                            value={formData.cta_section.primary_button_link || ''}
                            onChange={(e) =>
                              handleSectionFieldChange('cta_section', 'primary_button_link', e.target.value)
                            }
                          />
                        </CCol>

                        <CCol lg={3} md={6} className="mb-3">
                          <CFormLabel>Secondary Button Text</CFormLabel>
                          <CFormInput
                            className="premium-input"
                            value={formData.cta_section.secondary_button_text || ''}
                            onChange={(e) =>
                              handleSectionFieldChange('cta_section', 'secondary_button_text', e.target.value)
                            }
                          />
                        </CCol>

                        <CCol lg={3} md={6} className="mb-3">
                          <CFormLabel>Secondary Button Link</CFormLabel>
                          <CFormInput
                            className="premium-input"
                            value={formData.cta_section.secondary_button_link || ''}
                            onChange={(e) =>
                              handleSectionFieldChange('cta_section', 'secondary_button_link', e.target.value)
                            }
                          />
                        </CCol>
                      </CRow>
                    </div>
                  )}
                </div>
              </div>

              <div className="premium-home-cms-submitbar">
                <div className="premium-home-cms-submitbar__left">
                  <div className="premium-home-cms-submitbar__title">Ready to save changes?</div>
                  <div className="premium-home-cms-submitbar__subtitle">
                    Review your brand content, story blocks and CTA copy before publishing updates.
                  </div>
                </div>

                <div className="premium-home-cms-submitbar__right">
                  <CButton
                    type="button"
                    color="light"
                    className="premium-home-cms-ghost-btn"
                    onClick={() => {
                      setCollapsedSections({
                        hero: true,
                        story: true,
                        stats: true,
                        features: true,
                        cta: true,
                      })
                    }}
                  >
                    <CIcon icon={cilPlus} className="me-2" />
                    Expand All
                  </CButton>

                  <CButton
                    type="button"
                    color="light"
                    className="premium-home-cms-ghost-btn"
                    onClick={() => {
                      setCollapsedSections({
                        hero: false,
                        story: false,
                        stats: false,
                        features: false,
                        cta: false,
                      })
                    }}
                  >
                    <CIcon icon={cilMinus} className="me-2" />
                    Collapse All
                  </CButton>

                  <CButton type="submit" color="primary" disabled={loading} className="premium-main-btn px-4">
                    {loading ? 'Saving...' : isExisting ? 'Update About Page' : 'Create About Page'}
                  </CButton>
                </div>
              </div>
            </CForm>
          )}
        </CCardBody>
      </CCard>
    </div>
  )
}

export default AboutPageContent