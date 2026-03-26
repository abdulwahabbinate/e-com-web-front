import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import CIcon from '@coreui/icons-react'
import {
  cilChevronBottom,
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
  CBadge,
} from '@coreui/react'
import {
  fetchContactPage,
  createContactPage,
  updateContactPage,
  clearContactPageError,
} from '../../store/slices/contactPageSlice'

const toastAlert = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true,
})

const getInitialState = () => ({
  slug: 'contact',
  hero_section: {
    badge: 'CONTACT US',
    title: 'We’re Here To Help You With Every Step Of Your Shopping Experience',
    description:
      'Whether you want product information, order help, return support, or general assistance, our team is ready to help you with a fast and professional response.',
    support_badge: 'CUSTOMER SUPPORT',
    support_title: 'Fast, Professional, and Reliable Assistance',
    support_description:
      'Reach out to our team for anything related to products, orders, shipping, or support. We are focused on making your ecommerce experience smooth and trusted.',
    support_stats: [
      { number: '24h', label: 'Typical Response Time' },
      { number: '7 Days', label: 'Easy Return Assistance' },
    ],
  },
  info_section: {
    items: [
      { icon: 'fa-map-marker', title: 'Our Location', value: 'Karachi, Pakistan' },
      { icon: 'fa-phone', title: 'Call Us', value: '+92 300 1234567' },
      { icon: 'fa-envelope-o', title: 'Email Support', value: 'support@styleecommerce.com' },
      { icon: 'fa-clock-o', title: 'Working Hours', value: 'Mon - Sat / 10:00 AM - 8:00 PM' },
    ],
  },
  form_section: {
    badge: 'SEND MESSAGE',
    title: 'Let’s Talk About Your Needs',
    description:
      'Fill out the form below and send us your message. This form is UI-ready and can be connected to your backend API later.',
    full_name_label: 'Full Name',
    full_name_placeholder: 'Enter your full name',
    email_label: 'Email Address',
    email_placeholder: 'Enter your email',
    phone_label: 'Phone Number',
    phone_placeholder: 'Enter your phone number',
    subject_label: 'Subject',
    subject_placeholder: 'Enter subject',
    message_label: 'Message',
    message_placeholder: 'Write your message here...',
    submit_button_text: 'Send Message',
  },
  faq_section: {
    badge: 'SUPPORT INFO',
    title: 'Frequently Asked Questions',
    description: 'Here are some quick answers to common customer support questions.',
    items: [
      {
        question: 'How quickly do you respond to support requests?',
        answer: 'We aim to respond to most customer queries within 24 hours during working days.',
      },
      {
        question: 'Can I ask about orders, returns, or product details here?',
        answer: 'Yes, you can contact us for product questions, delivery updates, returns, and general support.',
      },
      {
        question: 'Is this form ready for future API integration?',
        answer: 'Yes, the form is built in a clean way so it can easily be connected to your backend later.',
      },
    ],
  },
  support_cta_section: {
    icon: 'fa-headphones',
    title: 'Need immediate help?',
    description: 'Contact our support team for quick assistance related to orders, returns, and product questions.',
  },
})

const initialCollapseState = {
  hero: true,
  info: true,
  form: true,
  faq: true,
  support_cta: true,
}

const ContactPageContent = () => {
  const dispatch = useDispatch()
  const { item, loading, error } = useSelector((state) => state.contactPage)

  const [formData, setFormData] = useState(getInitialState())
  const [errors, setErrors] = useState({})
  const [isExisting, setIsExisting] = useState(false)
  const [collapsedSections, setCollapsedSections] = useState(initialCollapseState)

  useEffect(() => {
    dispatch(fetchContactPage())
  }, [dispatch])

  useEffect(() => {
    if (item) {
      setFormData(item)
      setIsExisting(true)
    }
  }, [item])

  useEffect(() => {
    if (error?.message && error?.message !== 'Contact page content not found') {
      toastAlert.fire({
        icon: 'error',
        title: error.message,
      })
    }

    if (error?.message === 'Contact page content not found') {
      setFormData(getInitialState())
      setIsExisting(false)
    }
  }, [error])

  useEffect(() => {
    return () => {
      dispatch(clearContactPageError())
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

    if (!formData.form_section?.title?.trim()) {
      newErrors['form_section.title'] = 'Form section title is required'
    }

    if (!formData.faq_section?.title?.trim()) {
      newErrors['faq_section.title'] = 'FAQ section title is required'
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

  const handleHeroSupportStatChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.hero_section.support_stats]
      updated[index] = {
        ...updated[index],
        [field]: value,
      }

      return {
        ...prev,
        hero_section: {
          ...prev.hero_section,
          support_stats: updated,
        },
      }
    })
  }

  const handleInfoCardChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.info_section.items]
      updated[index] = {
        ...updated[index],
        [field]: value,
      }

      return {
        ...prev,
        info_section: {
          ...prev.info_section,
          items: updated,
        },
      }
    })
  }

  const handleFaqChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.faq_section.items]
      updated[index] = {
        ...updated[index],
        [field]: value,
      }

      return {
        ...prev,
        faq_section: {
          ...prev.faq_section,
          items: updated,
        },
      }
    })
  }

  const buildPayload = () => {
    return {
      slug: formData.slug,
      hero_section: JSON.stringify(formData.hero_section),
      info_section: JSON.stringify(formData.info_section),
      form_section: JSON.stringify(formData.form_section),
      faq_section: JSON.stringify(formData.faq_section),
      support_cta_section: JSON.stringify(formData.support_cta_section),
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    const payload = buildPayload()

    let result
    if (isExisting) {
      result = await dispatch(updateContactPage({ slug: 'contact', payload }))
    } else {
      result = await dispatch(createContactPage(payload))
    }

    if (result.meta.requestStatus === 'fulfilled') {
      toastAlert.fire({
        icon: 'success',
        title: isExisting
          ? 'Contact page content updated successfully'
          : 'Contact page content created successfully',
      })

      setErrors({})
      dispatch(fetchContactPage())
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

  const pageTitle = useMemo(() => {
    return isExisting ? 'Edit Contact Page Content' : 'Create Contact Page Content'
  }, [isExisting])

  return (
    <div className="premium-home-cms-page">
      <CCard className="shadow-sm border-0 premium-home-cms-card">
        <CCardHeader className="premium-card-header premium-home-cms-topbar">
          <div>
            <div className="premium-home-cms-eyebrow">CMS MANAGEMENT</div>
            <strong className="fs-4">Contact Page CMS</strong>
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
                  <h4 className="mb-2">Manage your contact page from one premium panel</h4>
                  <p className="mb-0">
                    Update hero content, support info, contact cards, message form labels, FAQs,
                    and support CTA from a single polished CMS screen.
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
                    'Manage the main contact introduction and support card.',
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
                            rows={4}
                            value={formData.hero_section.description || ''}
                            onChange={(e) => handleSectionFieldChange('hero_section', 'description', e.target.value)}
                          />
                        </CCol>

                        <CCol lg={4} md={6} className="mb-3">
                          <CFormLabel>Support Badge</CFormLabel>
                          <CFormInput
                            className="premium-input"
                            value={formData.hero_section.support_badge || ''}
                            onChange={(e) =>
                              handleSectionFieldChange('hero_section', 'support_badge', e.target.value)
                            }
                          />
                        </CCol>

                        <CCol lg={8} className="mb-3">
                          <CFormLabel>Support Title</CFormLabel>
                          <CFormInput
                            className="premium-input"
                            value={formData.hero_section.support_title || ''}
                            onChange={(e) =>
                              handleSectionFieldChange('hero_section', 'support_title', e.target.value)
                            }
                          />
                        </CCol>

                        <CCol lg={12} className="mb-3">
                          <CFormLabel>Support Description</CFormLabel>
                          <CFormTextarea
                            className="premium-input premium-textarea"
                            rows={4}
                            value={formData.hero_section.support_description || ''}
                            onChange={(e) =>
                              handleSectionFieldChange('hero_section', 'support_description', e.target.value)
                            }
                          />
                        </CCol>
                      </CRow>

                      {formData.hero_section.support_stats.map((item, index) => (
                        <div className="premium-cms-inline-card" key={index}>
                          <div className="premium-cms-inline-card__index">{index + 1}</div>

                          <CRow className="flex-grow-1">
                            <CCol lg={4} md={6} className="mb-3">
                              <CFormLabel>Number</CFormLabel>
                              <CFormInput
                                className="premium-input"
                                value={item.number || ''}
                                onChange={(e) => handleHeroSupportStatChange(index, 'number', e.target.value)}
                              />
                            </CCol>

                            <CCol lg={8} md={6} className="mb-3">
                              <CFormLabel>Label</CFormLabel>
                              <CFormInput
                                className="premium-input"
                                value={item.label || ''}
                                onChange={(e) => handleHeroSupportStatChange(index, 'label', e.target.value)}
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
                    'Info Cards Section',
                    'Manage the four contact info cards.',
                    'info',
                    'Info Cards',
                  )}

                  {collapsedSections.info && (
                    <div className="premium-cms-section-body">
                      {formData.info_section.items.map((item, index) => (
                        <div className="premium-cms-inline-card" key={index}>
                          <div className="premium-cms-inline-card__index">{index + 1}</div>

                          <CRow className="flex-grow-1">
                            <CCol lg={3} md={6} className="mb-3">
                              <CFormLabel>Icon</CFormLabel>
                              <CFormInput
                                className="premium-input"
                                value={item.icon || ''}
                                onChange={(e) => handleInfoCardChange(index, 'icon', e.target.value)}
                              />
                            </CCol>

                            <CCol lg={4} md={6} className="mb-3">
                              <CFormLabel>Title</CFormLabel>
                              <CFormInput
                                className="premium-input"
                                value={item.title || ''}
                                onChange={(e) => handleInfoCardChange(index, 'title', e.target.value)}
                              />
                            </CCol>

                            <CCol lg={5} className="mb-3">
                              <CFormLabel>Value</CFormLabel>
                              <CFormInput
                                className="premium-input"
                                value={item.value || ''}
                                onChange={(e) => handleInfoCardChange(index, 'value', e.target.value)}
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
                    'Form Section',
                    'Manage the contact form content and labels.',
                    'form',
                    'Form',
                  )}

                  {collapsedSections.form && (
                    <div className="premium-cms-section-body">
                      <CRow>
                        <CCol lg={4} md={6} className="mb-3">
                          <CFormLabel>Badge</CFormLabel>
                          <CFormInput
                            className="premium-input"
                            value={formData.form_section.badge || ''}
                            onChange={(e) => handleSectionFieldChange('form_section', 'badge', e.target.value)}
                          />
                        </CCol>

                        <CCol lg={8} className="mb-3">
                          <CFormLabel>Title</CFormLabel>
                          <CFormTextarea
                            className={`premium-input premium-textarea ${errors['form_section.title'] ? 'is-invalid' : ''}`}
                            rows={3}
                            value={formData.form_section.title || ''}
                            onChange={(e) => handleSectionFieldChange('form_section', 'title', e.target.value)}
                          />
                          {errors['form_section.title'] && (
                            <small className="text-danger">{errors['form_section.title']}</small>
                          )}
                        </CCol>

                        <CCol lg={12} className="mb-3">
                          <CFormLabel>Description</CFormLabel>
                          <CFormTextarea
                            className="premium-input premium-textarea"
                            rows={4}
                            value={formData.form_section.description || ''}
                            onChange={(e) => handleSectionFieldChange('form_section', 'description', e.target.value)}
                          />
                        </CCol>

                        <CCol lg={3} md={6} className="mb-3">
                          <CFormLabel>Full Name Label</CFormLabel>
                          <CFormInput
                            className="premium-input"
                            value={formData.form_section.full_name_label || ''}
                            onChange={(e) =>
                              handleSectionFieldChange('form_section', 'full_name_label', e.target.value)
                            }
                          />
                        </CCol>
                        <CCol lg={3} md={6} className="mb-3">
                          <CFormLabel>Full Name Placeholder</CFormLabel>
                          <CFormInput
                            className="premium-input"
                            value={formData.form_section.full_name_placeholder || ''}
                            onChange={(e) =>
                              handleSectionFieldChange('form_section', 'full_name_placeholder', e.target.value)
                            }
                          />
                        </CCol>

                        <CCol lg={3} md={6} className="mb-3">
                          <CFormLabel>Email Label</CFormLabel>
                          <CFormInput
                            className="premium-input"
                            value={formData.form_section.email_label || ''}
                            onChange={(e) =>
                              handleSectionFieldChange('form_section', 'email_label', e.target.value)
                            }
                          />
                        </CCol>
                        <CCol lg={3} md={6} className="mb-3">
                          <CFormLabel>Email Placeholder</CFormLabel>
                          <CFormInput
                            className="premium-input"
                            value={formData.form_section.email_placeholder || ''}
                            onChange={(e) =>
                              handleSectionFieldChange('form_section', 'email_placeholder', e.target.value)
                            }
                          />
                        </CCol>

                        <CCol lg={3} md={6} className="mb-3">
                          <CFormLabel>Phone Label</CFormLabel>
                          <CFormInput
                            className="premium-input"
                            value={formData.form_section.phone_label || ''}
                            onChange={(e) =>
                              handleSectionFieldChange('form_section', 'phone_label', e.target.value)
                            }
                          />
                        </CCol>
                        <CCol lg={3} md={6} className="mb-3">
                          <CFormLabel>Phone Placeholder</CFormLabel>
                          <CFormInput
                            className="premium-input"
                            value={formData.form_section.phone_placeholder || ''}
                            onChange={(e) =>
                              handleSectionFieldChange('form_section', 'phone_placeholder', e.target.value)
                            }
                          />
                        </CCol>

                        <CCol lg={3} md={6} className="mb-3">
                          <CFormLabel>Subject Label</CFormLabel>
                          <CFormInput
                            className="premium-input"
                            value={formData.form_section.subject_label || ''}
                            onChange={(e) =>
                              handleSectionFieldChange('form_section', 'subject_label', e.target.value)
                            }
                          />
                        </CCol>
                        <CCol lg={3} md={6} className="mb-3">
                          <CFormLabel>Subject Placeholder</CFormLabel>
                          <CFormInput
                            className="premium-input"
                            value={formData.form_section.subject_placeholder || ''}
                            onChange={(e) =>
                              handleSectionFieldChange('form_section', 'subject_placeholder', e.target.value)
                            }
                          />
                        </CCol>

                        <CCol lg={6} md={6} className="mb-3">
                          <CFormLabel>Message Label</CFormLabel>
                          <CFormInput
                            className="premium-input"
                            value={formData.form_section.message_label || ''}
                            onChange={(e) =>
                              handleSectionFieldChange('form_section', 'message_label', e.target.value)
                            }
                          />
                        </CCol>
                        <CCol lg={6} md={6} className="mb-3">
                          <CFormLabel>Message Placeholder</CFormLabel>
                          <CFormInput
                            className="premium-input"
                            value={formData.form_section.message_placeholder || ''}
                            onChange={(e) =>
                              handleSectionFieldChange('form_section', 'message_placeholder', e.target.value)
                            }
                          />
                        </CCol>

                        <CCol lg={4} md={6} className="mb-3">
                          <CFormLabel>Submit Button Text</CFormLabel>
                          <CFormInput
                            className="premium-input"
                            value={formData.form_section.submit_button_text || ''}
                            onChange={(e) =>
                              handleSectionFieldChange('form_section', 'submit_button_text', e.target.value)
                            }
                          />
                        </CCol>
                      </CRow>
                    </div>
                  )}
                </div>

                <div className="premium-cms-section-card">
                  {renderSectionHeader(
                    'FAQ Section',
                    'Manage questions and answers.',
                    'faq',
                    'FAQ',
                  )}

                  {collapsedSections.faq && (
                    <div className="premium-cms-section-body">
                      <CRow className="mb-4">
                        <CCol lg={4} md={6} className="mb-3">
                          <CFormLabel>Badge</CFormLabel>
                          <CFormInput
                            className="premium-input"
                            value={formData.faq_section.badge || ''}
                            onChange={(e) => handleSectionFieldChange('faq_section', 'badge', e.target.value)}
                          />
                        </CCol>

                        <CCol lg={8} className="mb-3">
                          <CFormLabel>Title</CFormLabel>
                          <CFormTextarea
                            className={`premium-input premium-textarea ${errors['faq_section.title'] ? 'is-invalid' : ''}`}
                            rows={3}
                            value={formData.faq_section.title || ''}
                            onChange={(e) => handleSectionFieldChange('faq_section', 'title', e.target.value)}
                          />
                          {errors['faq_section.title'] && (
                            <small className="text-danger">{errors['faq_section.title']}</small>
                          )}
                        </CCol>

                        <CCol lg={12} className="mb-3">
                          <CFormLabel>Description</CFormLabel>
                          <CFormTextarea
                            className="premium-input premium-textarea"
                            rows={4}
                            value={formData.faq_section.description || ''}
                            onChange={(e) => handleSectionFieldChange('faq_section', 'description', e.target.value)}
                          />
                        </CCol>
                      </CRow>

                      {formData.faq_section.items.map((item, index) => (
                        <div className="premium-cms-inline-card" key={index}>
                          <div className="premium-cms-inline-card__index">{index + 1}</div>

                          <CRow className="flex-grow-1">
                            <CCol lg={12} className="mb-3">
                              <CFormLabel>Question</CFormLabel>
                              <CFormInput
                                className="premium-input"
                                value={item.question || ''}
                                onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                              />
                            </CCol>

                            <CCol lg={12} className="mb-3">
                              <CFormLabel>Answer</CFormLabel>
                              <CFormTextarea
                                className="premium-input premium-textarea"
                                rows={4}
                                value={item.answer || ''}
                                onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
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
                    'Support CTA Section',
                    'Manage the small support callout card.',
                    'support_cta',
                    'Support CTA',
                  )}

                  {collapsedSections.support_cta && (
                    <div className="premium-cms-section-body">
                      <CRow>
                        <CCol lg={3} md={6} className="mb-3">
                          <CFormLabel>Icon</CFormLabel>
                          <CFormInput
                            className="premium-input"
                            value={formData.support_cta_section.icon || ''}
                            onChange={(e) =>
                              handleSectionFieldChange('support_cta_section', 'icon', e.target.value)
                            }
                          />
                        </CCol>

                        <CCol lg={9} className="mb-3">
                          <CFormLabel>Title</CFormLabel>
                          <CFormInput
                            className="premium-input"
                            value={formData.support_cta_section.title || ''}
                            onChange={(e) =>
                              handleSectionFieldChange('support_cta_section', 'title', e.target.value)
                            }
                          />
                        </CCol>

                        <CCol lg={12} className="mb-3">
                          <CFormLabel>Description</CFormLabel>
                          <CFormTextarea
                            className="premium-input premium-textarea"
                            rows={4}
                            value={formData.support_cta_section.description || ''}
                            onChange={(e) =>
                              handleSectionFieldChange('support_cta_section', 'description', e.target.value)
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
                    Review your support content, form labels and FAQs before publishing updates.
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
                        info: true,
                        form: true,
                        faq: true,
                        support_cta: true,
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
                        info: false,
                        form: false,
                        faq: false,
                        support_cta: false,
                      })
                    }}
                  >
                    <CIcon icon={cilMinus} className="me-2" />
                    Collapse All
                  </CButton>

                  <CButton type="submit" color="primary" disabled={loading} className="premium-main-btn px-4">
                    {loading ? 'Saving...' : isExisting ? 'Update Contact Page' : 'Create Contact Page'}
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

export default ContactPageContent