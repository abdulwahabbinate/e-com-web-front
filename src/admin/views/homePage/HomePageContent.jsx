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
  fetchHomePage,
  createHomePage,
  updateHomePage,
  clearHomePageError,
} from '../../store/slices/homePageSlice'

const toastAlert = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true,
})

const getInitialState = () => ({
  slug: 'home',
  hero_section: {
    badge: 'NEW SEASON',
    slides: [
      {
        badge: 'NEW SEASON',
        title: 'Premium Fashion Collection 2026',
        description: 'Discover premium quality styles crafted for a modern shopping experience.',
        button_text: 'Shop Now',
        button_link: '/shop',
        image: '',
        image_file: null,
      },
      {
        badge: 'NEW SEASON',
        title: 'Modern Fashion Picks',
        description: 'Fresh arrivals designed for stylish everyday wear.',
        button_text: 'Explore Now',
        button_link: '/shop',
        image: '',
        image_file: null,
      },
      {
        badge: 'NEW SEASON',
        title: 'Curated Premium Collection',
        description: 'Timeless essentials with premium quality.',
        button_text: 'View Collection',
        button_link: '/shop',
        image: '',
        image_file: null,
      },
    ],
  },
  promo_section: {
    left_card: {
      title: 'Refined Styles For Everyday Wear',
      description:
        'Discover premium essentials, elevated fits, and clean silhouettes designed for modern wardrobes.',
      button_text: 'Shop Collection',
      button_link: '/collection',
      image: '',
      image_file: null,
    },
    right_card: {
      title: 'Bulk Orders. Better Margins. Premium Picks.',
      description:
        'Explore curated wholesale-ready collections with polished quality, strong value, and modern appeal.',
      button_text: 'Explore Deals',
      button_link: '/wholesale',
      image: '',
      image_file: null,
    },
  },
  lookbook_section: {
    badge: 'INSTAGRAM / LOOKBOOK',
    title: 'Shop The Look',
    description: 'Discover premium-inspired styles curated for a refined and modern look.',
    items: [
      {
        title: 'Urban Essentials',
        description: '',
        button_text: 'Shop Now',
        button_link: '/shop',
        image: '',
        image_file: null,
      },
      {
        title: 'Minimal Layering',
        description: '',
        button_text: 'Shop Now',
        button_link: '/shop',
        image: '',
        image_file: null,
      },
      {
        title: 'Modern Classics',
        description: '',
        button_text: 'Shop Now',
        button_link: '/shop',
        image: '',
        image_file: null,
      },
      {
        title: 'Weekend Edit',
        description: '',
        button_text: 'Shop Now',
        button_link: '/shop',
        image: '',
        image_file: null,
      },
    ],
  },
  limited_offer_section: {
    badge: 'LIMITED TIME OFFER',
    title: 'Premium Picks At Special Prices',
    description: 'Don’t miss this curated offer on selected styles crafted to elevate your everyday wardrobe.',
    button_text: 'Shop Limited Offer',
    button_link: '/offers',
    offer_end_date: '',
    image: '',
    image_file: null,
  },
  features_section: {
    badge: 'WHY CHOOSE US',
    title: 'Designed For A Better Shopping Experience',
    description: 'Every detail is crafted to give your store a polished, trustworthy, and premium feel.',
    items: [
      {
        icon: 'cilTruck',
        title: 'Free Shipping',
        description: 'Enjoy seamless delivery on premium orders with dependable service.',
      },
      {
        icon: 'cilLoopCircular',
        title: 'Easy Returns',
        description: 'Simple and stress-free returns designed for confident shopping.',
      },
      {
        icon: 'cilLockLocked',
        title: 'Secure Checkout',
        description: 'Shop with confidence through a safe and protected payment flow.',
      },
      {
        icon: 'cilDiamond',
        title: 'Premium Quality',
        description: 'Carefully selected products built around quality and modern style.',
      },
    ],
  },
  testimonial_section: {
    badge: 'TESTIMONIALS',
    title: 'What Customers Say',
    description: 'Real feedback from shoppers who value clean design, quality, and style.',
    items: [
      {
        rating: 5,
        review: 'The quality and overall presentation feel premium. The shopping experience is smooth and polished.',
        name: 'Ayesha Khan',
        designation: 'Verified Buyer',
      },
      {
        rating: 5,
        review: 'Clean design, easy browsing, and products feel much more refined than a typical online store.',
        name: 'Usman Ali',
        designation: 'Regular Customer',
      },
      {
        rating: 5,
        review: 'I loved the premium look of the site and the product selection feels curated and trustworthy.',
        name: 'Hina Ahmed',
        designation: 'Fashion Customer',
      },
    ],
  },
  newsletter_section: {
    badge: 'NEWSLETTER',
    title: 'Get Updates On New Arrivals And Exclusive Offers',
    description: 'Subscribe to stay connected with premium picks, fresh collections, and limited-time deals.',
    placeholder: 'Enter your email address',
    button_text: 'Subscribe',
  },
})

const initialCollapseState = {
  hero: true,
  promo: true,
  lookbook: true,
  limited_offer: true,
  features: false,
  testimonials: false,
  newsletter: false,
}

const HomePageContent = () => {
  const dispatch = useDispatch()
  const { item, loading, error } = useSelector((state) => state.homePage)

  const [formData, setFormData] = useState(getInitialState())
  const [errors, setErrors] = useState({})
  const [isExisting, setIsExisting] = useState(false)
  const [collapsedSections, setCollapsedSections] = useState(initialCollapseState)
  const [removeImages, setRemoveImages] = useState({})

  const heroFileRefs = useRef([])
  const lookbookFileRefs = useRef([])
  const promoLeftFileRef = useRef(null)
  const promoRightFileRef = useRef(null)
  const limitedOfferFileRef = useRef(null)

  useEffect(() => {
    dispatch(fetchHomePage())
  }, [dispatch])

  useEffect(() => {
    if (item) {
      setFormData({
        ...item,
        hero_section: {
          ...item.hero_section,
          slides: (item.hero_section?.slides || []).map((slide) => ({
            ...slide,
            image_file: null,
          })),
        },
        promo_section: {
          left_card: {
            ...(item.promo_section?.left_card || {}),
            image_file: null,
          },
          right_card: {
            ...(item.promo_section?.right_card || {}),
            image_file: null,
          },
        },
        lookbook_section: {
          ...item.lookbook_section,
          items: (item.lookbook_section?.items || []).map((look) => ({
            ...look,
            image_file: null,
          })),
        },
        limited_offer_section: {
          ...(item.limited_offer_section || {}),
          image_file: null,
          offer_end_date: item?.limited_offer_section?.offer_end_date
            ? item.limited_offer_section.offer_end_date.slice(0, 10)
            : '',
        },
      })

      setRemoveImages({})
      setIsExisting(true)
    }
  }, [item])

  useEffect(() => {
    if (error?.message && error?.message !== 'Home page content not found') {
      toastAlert.fire({
        icon: 'error',
        title: error.message,
      })
    }

    if (error?.message === 'Home page content not found') {
      setFormData(getInitialState())
      setIsExisting(false)
    }
  }, [error])

  useEffect(() => {
    return () => {
      dispatch(clearHomePageError())
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

    if (!formData.hero_section?.slides?.length) {
      newErrors['hero_section.slides'] = 'At least one hero slide is required'
    }

    formData.hero_section?.slides?.forEach((slide, index) => {
      if (!slide.title?.trim()) {
        newErrors[`hero_section.slides.${index}.title`] = 'Hero slide title is required'
      }

      if (!slide.button_text?.trim()) {
        newErrors[`hero_section.slides.${index}.button_text`] = 'Button text is required'
      }
    })

    if (!formData.lookbook_section?.title?.trim()) {
      newErrors['lookbook_section.title'] = 'Lookbook title is required'
    }

    if (!formData.newsletter_section?.title?.trim()) {
      newErrors['newsletter_section.title'] = 'Newsletter title is required'
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

  const handleHeroChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedSlides = [...prev.hero_section.slides]
      updatedSlides[index] = {
        ...updatedSlides[index],
        [field]: value,
      }

      return {
        ...prev,
        hero_section: {
          ...prev.hero_section,
          slides: updatedSlides,
        },
      }
    })
  }

  const handleLookbookChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedItems = [...prev.lookbook_section.items]
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
      }

      return {
        ...prev,
        lookbook_section: {
          ...prev.lookbook_section,
          items: updatedItems,
        },
      }
    })
  }

  const handleFeatureChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedItems = [...prev.features_section.items]
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
      }

      return {
        ...prev,
        features_section: {
          ...prev.features_section,
          items: updatedItems,
        },
      }
    })
  }

  const handleTestimonialChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedItems = [...prev.testimonial_section.items]
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
      }

      return {
        ...prev,
        testimonial_section: {
          ...prev.testimonial_section,
          items: updatedItems,
        },
      }
    })
  }

  const handlePromoChange = (cardKey, field, value) => {
    setFormData((prev) => ({
      ...prev,
      promo_section: {
        ...prev.promo_section,
        [cardKey]: {
          ...prev.promo_section[cardKey],
          [field]: value,
        },
      },
    }))
  }

  const handleLimitedOfferChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      limited_offer_section: {
        ...prev.limited_offer_section,
        [field]: value,
      },
    }))
  }

  const handleRemoveImage = (fieldKey, sectionUpdater) => {
    setRemoveImages((prev) => ({
      ...prev,
      [fieldKey]: true,
    }))

    sectionUpdater()

    if (fieldKey === 'promo_left_image' && promoLeftFileRef.current) {
      promoLeftFileRef.current.value = ''
    }

    if (fieldKey === 'promo_right_image' && promoRightFileRef.current) {
      promoRightFileRef.current.value = ''
    }

    if (fieldKey === 'limited_offer_image' && limitedOfferFileRef.current) {
      limitedOfferFileRef.current.value = ''
    }

    if (fieldKey.startsWith('hero_slide_image_')) {
      const index = Number(fieldKey.split('_').pop())
      if (heroFileRefs.current[index]) {
        heroFileRefs.current[index].value = ''
      }
    }

    if (fieldKey.startsWith('lookbook_item_image_')) {
      const index = Number(fieldKey.split('_').pop())
      if (lookbookFileRefs.current[index]) {
        lookbookFileRefs.current[index].value = ''
      }
    }
  }

  const buildPayload = () => {
    const payload = new FormData()

    payload.append('slug', formData.slug)

    payload.append(
      'hero_section',
      JSON.stringify({
        ...formData.hero_section,
        slides: formData.hero_section.slides.map(({ image_file, ...item }) => item),
      }),
    )

    payload.append(
      'promo_section',
      JSON.stringify({
        left_card: (() => {
          const { image_file, ...rest } = formData.promo_section.left_card
          return rest
        })(),
        right_card: (() => {
          const { image_file, ...rest } = formData.promo_section.right_card
          return rest
        })(),
      }),
    )

    payload.append(
      'lookbook_section',
      JSON.stringify({
        ...formData.lookbook_section,
        items: formData.lookbook_section.items.map(({ image_file, ...item }) => item),
      }),
    )

    payload.append(
      'limited_offer_section',
      JSON.stringify((() => {
        const { image_file, ...rest } = formData.limited_offer_section
        return rest
      })()),
    )

    payload.append('features_section', JSON.stringify(formData.features_section))
    payload.append('testimonial_section', JSON.stringify(formData.testimonial_section))
    payload.append('newsletter_section', JSON.stringify(formData.newsletter_section))
    payload.append('remove_images', JSON.stringify(removeImages))

    formData.hero_section.slides.forEach((slide, index) => {
      if (slide.image_file instanceof File) {
        payload.append(`hero_slide_image_${index}`, slide.image_file)
      }
    })

    formData.lookbook_section.items.forEach((item, index) => {
      if (item.image_file instanceof File) {
        payload.append(`lookbook_item_image_${index}`, item.image_file)
      }
    })

    if (formData.promo_section.left_card.image_file instanceof File) {
      payload.append('promo_left_image', formData.promo_section.left_card.image_file)
    }

    if (formData.promo_section.right_card.image_file instanceof File) {
      payload.append('promo_right_image', formData.promo_section.right_card.image_file)
    }

    if (formData.limited_offer_section.image_file instanceof File) {
      payload.append('limited_offer_image', formData.limited_offer_section.image_file)
    }

    return payload
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    const payload = buildPayload()

    let result
    if (isExisting) {
      result = await dispatch(updateHomePage({ slug: 'home', payload }))
    } else {
      result = await dispatch(createHomePage(payload))
    }

    if (result.meta.requestStatus === 'fulfilled') {
      toastAlert.fire({
        icon: 'success',
        title: isExisting
          ? 'Home page content updated successfully'
          : 'Home page content created successfully',
      })

      setErrors({})
      dispatch(fetchHomePage())
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

  const renderImagePreview = (src, onRemove) => {
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
          onClick={onRemove}
        >
          <CIcon icon={cilTrash} />
        </button>
      </div>
    )
  }

  const pageTitle = useMemo(() => {
    return isExisting ? 'Edit Home Page Content' : 'Create Home Page Content'
  }, [isExisting])

  return (
    <div className="premium-home-cms-page">
      <CCard className="shadow-sm border-0 premium-home-cms-card">
        <CCardHeader className="premium-card-header premium-home-cms-topbar">
          <div>
            <div className="premium-home-cms-eyebrow">CMS MANAGEMENT</div>
            <strong className="fs-4">Home Page CMS</strong>
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
                  <h4 className="mb-2">Manage your storefront homepage with ease</h4>
                  <p className="mb-0">
                    Update sliders, promo banners, lookbook cards, offers, testimonials and newsletter content
                    from one premium control panel.
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
                    'Control homepage sliders and top fold content.',
                    'hero',
                    'Top Banner',
                  )}

                  {collapsedSections.hero && (
                    <div className="premium-cms-section-body">
                      <CRow className="mb-4">
                        <CCol md={6}>
                          <CFormLabel>Section Badge</CFormLabel>
                          <CFormInput
                            className="premium-input"
                            value={formData.hero_section.badge || ''}
                            onChange={(e) =>
                              handleSectionFieldChange('hero_section', 'badge', e.target.value)
                            }
                          />
                        </CCol>
                      </CRow>

                      {formData.hero_section.slides.map((slide, index) => (
                        <div className="premium-cms-subcard" key={index}>
                          <div className="premium-cms-subcard__header">
                            <div>
                              <h6 className="mb-1">Hero Slide {index + 1}</h6>
                              <small className="text-medium-emphasis">Main homepage banner slide</small>
                            </div>
                          </div>

                          <CRow>
                            <CCol lg={3} md={6} className="mb-3">
                              <CFormLabel>Badge</CFormLabel>
                              <CFormInput
                                className="premium-input"
                                value={slide.badge || ''}
                                onChange={(e) => handleHeroChange(index, 'badge', e.target.value)}
                              />
                            </CCol>

                            <CCol lg={5} md={6} className="mb-3">
                              <CFormLabel>Title</CFormLabel>
                              <CFormInput
                                className={`premium-input ${errors[`hero_section.slides.${index}.title`] ? 'is-invalid' : ''}`}
                                value={slide.title || ''}
                                onChange={(e) => handleHeroChange(index, 'title', e.target.value)}
                              />
                              {errors[`hero_section.slides.${index}.title`] && (
                                <small className="text-danger">
                                  {errors[`hero_section.slides.${index}.title`]}
                                </small>
                              )}
                            </CCol>

                            <CCol lg={2} md={6} className="mb-3">
                              <CFormLabel>Button Text</CFormLabel>
                              <CFormInput
                                className={`premium-input ${errors[`hero_section.slides.${index}.button_text`] ? 'is-invalid' : ''}`}
                                value={slide.button_text || ''}
                                onChange={(e) => handleHeroChange(index, 'button_text', e.target.value)}
                              />
                              {errors[`hero_section.slides.${index}.button_text`] && (
                                <small className="text-danger">
                                  {errors[`hero_section.slides.${index}.button_text`]}
                                </small>
                              )}
                            </CCol>

                            <CCol lg={2} md={6} className="mb-3">
                              <CFormLabel>Button Link</CFormLabel>
                              <CFormInput
                                className="premium-input"
                                value={slide.button_link || ''}
                                onChange={(e) => handleHeroChange(index, 'button_link', e.target.value)}
                              />
                            </CCol>

                            <CCol lg={8} className="mb-3">
                              <CFormLabel>Description</CFormLabel>
                              <CFormTextarea
                                className="premium-input premium-textarea"
                                rows={4}
                                value={slide.description || ''}
                                onChange={(e) => handleHeroChange(index, 'description', e.target.value)}
                              />
                            </CCol>

                            <CCol lg={4} className="mb-3">
                              <CFormLabel>Image Upload</CFormLabel>

                              <div
                                className={`premium-file-upload ${slide.image_file || slide.image ? 'has-file' : ''}`}
                                onClick={() => heroFileRefs.current[index]?.click()}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    heroFileRefs.current[index]?.click()
                                  }
                                }}
                              >
                                <div className="premium-file-upload__button">
                                  <CIcon icon={cilCloudUpload} className="me-2" />
                                  Choose File
                                </div>
                                <div className="premium-file-upload__name">
                                  {slide.image_file?.name || (slide.image ? 'Image selected' : 'No file chosen')}
                                </div>
                              </div>

                              <input
                                ref={(el) => {
                                  heroFileRefs.current[index] = el
                                }}
                                type="file"
                                accept="image/*"
                                className="d-none"
                                onChange={(e) => {
                                  setRemoveImages((prev) => ({
                                    ...prev,
                                    [`hero_slide_image_${index}`]: false,
                                  }))
                                  handleHeroChange(index, 'image_file', e.target.files?.[0] || null)
                                }}
                              />

                              <div className="mt-3">
                                {renderImagePreview(
                                  slide.image_file ? URL.createObjectURL(slide.image_file) : slide.image,
                                  () =>
                                    handleRemoveImage(`hero_slide_image_${index}`, () => {
                                      handleHeroChange(index, 'image_file', null)
                                      handleHeroChange(index, 'image', '')
                                    }),
                                )}
                              </div>
                            </CCol>
                          </CRow>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="premium-cms-section-card">
                  {renderSectionHeader(
                    'Promo Section',
                    'Manage feature cards below the main slider.',
                    'promo',
                    'Promo Cards',
                  )}

                  {collapsedSections.promo && (
                    <div className="premium-cms-section-body">
                      {['left_card', 'right_card'].map((cardKey, index) => {
                        const title = cardKey === 'left_card' ? 'Left Promo Card' : 'Right Promo Card'
                        const fieldKey = cardKey === 'left_card' ? 'promo_left_image' : 'promo_right_image'
                        const fileRef = cardKey === 'left_card' ? promoLeftFileRef : promoRightFileRef
                        const card = formData.promo_section[cardKey]

                        return (
                          <div className="premium-cms-subcard" key={cardKey}>
                            <div className="premium-cms-subcard__header">
                              <div>
                                <h6 className="mb-1">{title}</h6>
                                <small className="text-medium-emphasis">
                                  {index === 0 ? 'Primary promo block' : 'Secondary promo block'}
                                </small>
                              </div>
                            </div>

                            <CRow>
                              <CCol lg={6} className="mb-3">
                                <CFormLabel>Title</CFormLabel>
                                <CFormInput
                                  className="premium-input"
                                  value={card.title || ''}
                                  onChange={(e) => handlePromoChange(cardKey, 'title', e.target.value)}
                                />
                              </CCol>

                              <CCol lg={3} md={6} className="mb-3">
                                <CFormLabel>Button Text</CFormLabel>
                                <CFormInput
                                  className="premium-input"
                                  value={card.button_text || ''}
                                  onChange={(e) => handlePromoChange(cardKey, 'button_text', e.target.value)}
                                />
                              </CCol>

                              <CCol lg={3} md={6} className="mb-3">
                                <CFormLabel>Button Link</CFormLabel>
                                <CFormInput
                                  className="premium-input"
                                  value={card.button_link || ''}
                                  onChange={(e) => handlePromoChange(cardKey, 'button_link', e.target.value)}
                                />
                              </CCol>

                              <CCol lg={8} className="mb-3">
                                <CFormLabel>Description</CFormLabel>
                                <CFormTextarea
                                  className="premium-input premium-textarea"
                                  rows={4}
                                  value={card.description || ''}
                                  onChange={(e) => handlePromoChange(cardKey, 'description', e.target.value)}
                                />
                              </CCol>

                              <CCol lg={4} className="mb-3">
                                <CFormLabel>Image Upload</CFormLabel>

                                <div
                                  className={`premium-file-upload ${card.image_file || card.image ? 'has-file' : ''}`}
                                  onClick={() => fileRef.current?.click()}
                                  role="button"
                                  tabIndex={0}
                                >
                                  <div className="premium-file-upload__button">
                                    <CIcon icon={cilCloudUpload} className="me-2" />
                                    Choose File
                                  </div>
                                  <div className="premium-file-upload__name">
                                    {card.image_file?.name || (card.image ? 'Image selected' : 'No file chosen')}
                                  </div>
                                </div>

                                <input
                                  ref={fileRef}
                                  type="file"
                                  accept="image/*"
                                  className="d-none"
                                  onChange={(e) => {
                                    setRemoveImages((prev) => ({
                                      ...prev,
                                      [fieldKey]: false,
                                    }))
                                    handlePromoChange(cardKey, 'image_file', e.target.files?.[0] || null)
                                  }}
                                />

                                <div className="mt-3">
                                  {renderImagePreview(
                                    card.image_file ? URL.createObjectURL(card.image_file) : card.image,
                                    () =>
                                      handleRemoveImage(fieldKey, () => {
                                        handlePromoChange(cardKey, 'image_file', null)
                                        handlePromoChange(cardKey, 'image', '')
                                      }),
                                  )}
                                </div>
                              </CCol>
                            </CRow>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                <div className="premium-cms-section-card">
                  {renderSectionHeader(
                    'Lookbook Section',
                    'Manage the shop-the-look visual cards.',
                    'lookbook',
                    'Lookbook',
                  )}

                  {collapsedSections.lookbook && (
                    <div className="premium-cms-section-body">
                      <CRow className="mb-4">
                        <CCol lg={4} md={6} className="mb-3">
                          <CFormLabel>Badge</CFormLabel>
                          <CFormInput
                            className="premium-input"
                            value={formData.lookbook_section.badge || ''}
                            onChange={(e) =>
                              handleSectionFieldChange('lookbook_section', 'badge', e.target.value)
                            }
                          />
                        </CCol>

                        <CCol lg={4} md={6} className="mb-3">
                          <CFormLabel>Title</CFormLabel>
                          <CFormInput
                            className={`premium-input ${errors['lookbook_section.title'] ? 'is-invalid' : ''}`}
                            value={formData.lookbook_section.title || ''}
                            onChange={(e) =>
                              handleSectionFieldChange('lookbook_section', 'title', e.target.value)
                            }
                          />
                          {errors['lookbook_section.title'] && (
                            <small className="text-danger">{errors['lookbook_section.title']}</small>
                          )}
                        </CCol>

                        <CCol lg={4} className="mb-3">
                          <CFormLabel>Description</CFormLabel>
                          <CFormInput
                            className="premium-input"
                            value={formData.lookbook_section.description || ''}
                            onChange={(e) =>
                              handleSectionFieldChange('lookbook_section', 'description', e.target.value)
                            }
                          />
                        </CCol>
                      </CRow>

                      {formData.lookbook_section.items.map((item, index) => (
                        <div className="premium-cms-subcard" key={index}>
                          <div className="premium-cms-subcard__header">
                            <div>
                              <h6 className="mb-1">Lookbook Item {index + 1}</h6>
                              <small className="text-medium-emphasis">Homepage lookbook card</small>
                            </div>
                          </div>

                          <CRow>
                            <CCol lg={4} md={6} className="mb-3">
                              <CFormLabel>Title</CFormLabel>
                              <CFormInput
                                className="premium-input"
                                value={item.title || ''}
                                onChange={(e) => handleLookbookChange(index, 'title', e.target.value)}
                              />
                            </CCol>

                            <CCol lg={3} md={6} className="mb-3">
                              <CFormLabel>Button Text</CFormLabel>
                              <CFormInput
                                className="premium-input"
                                value={item.button_text || ''}
                                onChange={(e) => handleLookbookChange(index, 'button_text', e.target.value)}
                              />
                            </CCol>

                            <CCol lg={3} md={6} className="mb-3">
                              <CFormLabel>Button Link</CFormLabel>
                              <CFormInput
                                className="premium-input"
                                value={item.button_link || ''}
                                onChange={(e) => handleLookbookChange(index, 'button_link', e.target.value)}
                              />
                            </CCol>

                            <CCol lg={12} className="mb-3">
                              <CFormLabel>Image Upload</CFormLabel>

                              <div
                                className={`premium-file-upload ${item.image_file || item.image ? 'has-file' : ''}`}
                                onClick={() => lookbookFileRefs.current[index]?.click()}
                                role="button"
                                tabIndex={0}
                              >
                                <div className="premium-file-upload__button">
                                  <CIcon icon={cilCloudUpload} className="me-2" />
                                  Choose File
                                </div>
                                <div className="premium-file-upload__name">
                                  {item.image_file?.name || (item.image ? 'Image selected' : 'No file chosen')}
                                </div>
                              </div>

                              <input
                                ref={(el) => {
                                  lookbookFileRefs.current[index] = el
                                }}
                                type="file"
                                accept="image/*"
                                className="d-none"
                                onChange={(e) => {
                                  setRemoveImages((prev) => ({
                                    ...prev,
                                    [`lookbook_item_image_${index}`]: false,
                                  }))
                                  handleLookbookChange(index, 'image_file', e.target.files?.[0] || null)
                                }}
                              />

                              <div className="mt-3">
                                {renderImagePreview(
                                  item.image_file ? URL.createObjectURL(item.image_file) : item.image,
                                  () =>
                                    handleRemoveImage(`lookbook_item_image_${index}`, () => {
                                      handleLookbookChange(index, 'image_file', null)
                                      handleLookbookChange(index, 'image', '')
                                    }),
                                )}
                              </div>
                            </CCol>
                          </CRow>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="premium-cms-section-card">
                  {renderSectionHeader(
                    'Limited Offer Section',
                    'Manage countdown sale banner and featured offer.',
                    'limited_offer',
                    'Offer',
                  )}

                  {collapsedSections.limited_offer && (
                    <div className="premium-cms-section-body">
                      <CRow>
                        <CCol lg={4} md={6} className="mb-3">
                          <CFormLabel>Badge</CFormLabel>
                          <CFormInput
                            className="premium-input"
                            value={formData.limited_offer_section.badge || ''}
                            onChange={(e) => handleLimitedOfferChange('badge', e.target.value)}
                          />
                        </CCol>

                        <CCol lg={4} md={6} className="mb-3">
                          <CFormLabel>Button Text</CFormLabel>
                          <CFormInput
                            className="premium-input"
                            value={formData.limited_offer_section.button_text || ''}
                            onChange={(e) => handleLimitedOfferChange('button_text', e.target.value)}
                          />
                        </CCol>

                        <CCol lg={4} md={6} className="mb-3">
                          <CFormLabel>Button Link</CFormLabel>
                          <CFormInput
                            className="premium-input"
                            value={formData.limited_offer_section.button_link || ''}
                            onChange={(e) => handleLimitedOfferChange('button_link', e.target.value)}
                          />
                        </CCol>

                        <CCol lg={6} md={6} className="mb-3">
                          <CFormLabel>Title</CFormLabel>
                          <CFormInput
                            className="premium-input"
                            value={formData.limited_offer_section.title || ''}
                            onChange={(e) => handleLimitedOfferChange('title', e.target.value)}
                          />
                        </CCol>

                        <CCol lg={6} md={6} className="mb-3">
                          <CFormLabel>Offer End Date</CFormLabel>
                          <CFormInput
                            className="premium-input"
                            type="date"
                            value={formData.limited_offer_section.offer_end_date || ''}
                            onChange={(e) => handleLimitedOfferChange('offer_end_date', e.target.value)}
                          />
                        </CCol>

                        <CCol lg={8} className="mb-3">
                          <CFormLabel>Description</CFormLabel>
                          <CFormTextarea
                            className="premium-input premium-textarea"
                            rows={4}
                            value={formData.limited_offer_section.description || ''}
                            onChange={(e) => handleLimitedOfferChange('description', e.target.value)}
                          />
                        </CCol>

                        <CCol lg={4} className="mb-3">
                          <CFormLabel>Image Upload</CFormLabel>

                          <div
                            className={`premium-file-upload ${formData.limited_offer_section.image_file || formData.limited_offer_section.image ? 'has-file' : ''}`}
                            onClick={() => limitedOfferFileRef.current?.click()}
                            role="button"
                            tabIndex={0}
                          >
                            <div className="premium-file-upload__button">
                              <CIcon icon={cilCloudUpload} className="me-2" />
                              Choose File
                            </div>
                            <div className="premium-file-upload__name">
                              {formData.limited_offer_section.image_file?.name ||
                                (formData.limited_offer_section.image ? 'Image selected' : 'No file chosen')}
                            </div>
                          </div>

                          <input
                            ref={limitedOfferFileRef}
                            type="file"
                            accept="image/*"
                            className="d-none"
                            onChange={(e) => {
                              setRemoveImages((prev) => ({
                                ...prev,
                                limited_offer_image: false,
                              }))
                              handleLimitedOfferChange('image_file', e.target.files?.[0] || null)
                            }}
                          />

                          <div className="mt-3">
                            {renderImagePreview(
                              formData.limited_offer_section.image_file
                                ? URL.createObjectURL(formData.limited_offer_section.image_file)
                                : formData.limited_offer_section.image,
                              () =>
                                handleRemoveImage('limited_offer_image', () => {
                                  handleLimitedOfferChange('image_file', null)
                                  handleLimitedOfferChange('image', '')
                                }),
                            )}
                          </div>
                        </CCol>
                      </CRow>
                    </div>
                  )}
                </div>

                <div className="premium-cms-section-card">
                  {renderSectionHeader(
                    'Features Section',
                    'Manage trust-building features.',
                    'features',
                    'Benefits',
                  )}

                  {collapsedSections.features && (
                    <div className="premium-cms-section-body">
                      <CRow className="mb-4">
                        <CCol lg={4} md={6} className="mb-3">
                          <CFormLabel>Badge</CFormLabel>
                          <CFormInput
                            className="premium-input"
                            value={formData.features_section.badge || ''}
                            onChange={(e) =>
                              handleSectionFieldChange('features_section', 'badge', e.target.value)
                            }
                          />
                        </CCol>

                        <CCol lg={4} md={6} className="mb-3">
                          <CFormLabel>Title</CFormLabel>
                          <CFormInput
                            className="premium-input"
                            value={formData.features_section.title || ''}
                            onChange={(e) =>
                              handleSectionFieldChange('features_section', 'title', e.target.value)
                            }
                          />
                        </CCol>

                        <CCol lg={4} className="mb-3">
                          <CFormLabel>Description</CFormLabel>
                          <CFormInput
                            className="premium-input"
                            value={formData.features_section.description || ''}
                            onChange={(e) =>
                              handleSectionFieldChange('features_section', 'description', e.target.value)
                            }
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
                              <CFormInput
                                className="premium-input"
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
                    'Testimonials Section',
                    'Manage customer review cards.',
                    'testimonials',
                    'Reviews',
                  )}

                  {collapsedSections.testimonials && (
                    <div className="premium-cms-section-body">
                      <CRow className="mb-4">
                        <CCol lg={4} md={6} className="mb-3">
                          <CFormLabel>Badge</CFormLabel>
                          <CFormInput
                            className="premium-input"
                            value={formData.testimonial_section.badge || ''}
                            onChange={(e) =>
                              handleSectionFieldChange('testimonial_section', 'badge', e.target.value)
                            }
                          />
                        </CCol>

                        <CCol lg={4} md={6} className="mb-3">
                          <CFormLabel>Title</CFormLabel>
                          <CFormInput
                            className="premium-input"
                            value={formData.testimonial_section.title || ''}
                            onChange={(e) =>
                              handleSectionFieldChange('testimonial_section', 'title', e.target.value)
                            }
                          />
                        </CCol>

                        <CCol lg={4} className="mb-3">
                          <CFormLabel>Description</CFormLabel>
                          <CFormInput
                            className="premium-input"
                            value={formData.testimonial_section.description || ''}
                            onChange={(e) =>
                              handleSectionFieldChange('testimonial_section', 'description', e.target.value)
                            }
                          />
                        </CCol>
                      </CRow>

                      {formData.testimonial_section.items.map((item, index) => (
                        <div className="premium-cms-inline-card" key={index}>
                          <div className="premium-cms-inline-card__index">{index + 1}</div>

                          <CRow className="flex-grow-1">
                            <CCol lg={2} md={4} className="mb-3">
                              <CFormLabel>Rating</CFormLabel>
                              <CFormInput
                                className="premium-input"
                                type="number"
                                min="1"
                                max="5"
                                value={item.rating || 5}
                                onChange={(e) =>
                                  handleTestimonialChange(index, 'rating', Number(e.target.value))
                                }
                              />
                            </CCol>

                            <CCol lg={3} md={4} className="mb-3">
                              <CFormLabel>Name</CFormLabel>
                              <CFormInput
                                className="premium-input"
                                value={item.name || ''}
                                onChange={(e) => handleTestimonialChange(index, 'name', e.target.value)}
                              />
                            </CCol>

                            <CCol lg={3} md={4} className="mb-3">
                              <CFormLabel>Designation</CFormLabel>
                              <CFormInput
                                className="premium-input"
                                value={item.designation || ''}
                                onChange={(e) =>
                                  handleTestimonialChange(index, 'designation', e.target.value)
                                }
                              />
                            </CCol>

                            <CCol lg={4} className="mb-3">
                              <CFormLabel>Review</CFormLabel>
                              <CFormInput
                                className="premium-input"
                                value={item.review || ''}
                                onChange={(e) => handleTestimonialChange(index, 'review', e.target.value)}
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
                    'Newsletter Section',
                    'Manage signup CTA content.',
                    'newsletter',
                    'Newsletter',
                  )}

                  {collapsedSections.newsletter && (
                    <div className="premium-cms-section-body">
                      <CRow>
                        <CCol lg={4} md={6} className="mb-3">
                          <CFormLabel>Badge</CFormLabel>
                          <CFormInput
                            className="premium-input"
                            value={formData.newsletter_section.badge || ''}
                            onChange={(e) =>
                              handleSectionFieldChange('newsletter_section', 'badge', e.target.value)
                            }
                          />
                        </CCol>

                        <CCol lg={4} md={6} className="mb-3">
                          <CFormLabel>Placeholder</CFormLabel>
                          <CFormInput
                            className="premium-input"
                            value={formData.newsletter_section.placeholder || ''}
                            onChange={(e) =>
                              handleSectionFieldChange('newsletter_section', 'placeholder', e.target.value)
                            }
                          />
                        </CCol>

                        <CCol lg={4} md={6} className="mb-3">
                          <CFormLabel>Button Text</CFormLabel>
                          <CFormInput
                            className="premium-input"
                            value={formData.newsletter_section.button_text || ''}
                            onChange={(e) =>
                              handleSectionFieldChange('newsletter_section', 'button_text', e.target.value)
                            }
                          />
                        </CCol>

                        <CCol lg={6} className="mb-3">
                          <CFormLabel>Title</CFormLabel>
                          <CFormInput
                            className={`premium-input ${errors['newsletter_section.title'] ? 'is-invalid' : ''}`}
                            value={formData.newsletter_section.title || ''}
                            onChange={(e) =>
                              handleSectionFieldChange('newsletter_section', 'title', e.target.value)
                            }
                          />
                          {errors['newsletter_section.title'] && (
                            <small className="text-danger">{errors['newsletter_section.title']}</small>
                          )}
                        </CCol>

                        <CCol lg={6} className="mb-3">
                          <CFormLabel>Description</CFormLabel>
                          <CFormInput
                            className="premium-input"
                            value={formData.newsletter_section.description || ''}
                            onChange={(e) =>
                              handleSectionFieldChange('newsletter_section', 'description', e.target.value)
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
                    Review section content and publish updates to your homepage CMS.
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
                        promo: true,
                        lookbook: true,
                        limited_offer: true,
                        features: true,
                        testimonials: true,
                        newsletter: true,
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
                        promo: false,
                        lookbook: false,
                        limited_offer: false,
                        features: false,
                        testimonials: false,
                        newsletter: false,
                      })
                    }}
                  >
                    <CIcon icon={cilMinus} className="me-2" />
                    Collapse All
                  </CButton>

                  <CButton type="submit" color="primary" disabled={loading} className="premium-main-btn px-4">
                    {loading ? 'Saving...' : isExisting ? 'Update Home Page' : 'Create Home Page'}
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

export default HomePageContent