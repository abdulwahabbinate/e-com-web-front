import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import Swal from "sweetalert2";
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilEnvelopeOpen,
  cilCheckCircle,
  cilTrash,
  cilPaperPlane,
  cilPeople,
  cilCart,
} from "@coreui/icons";
import {
  clearNewsletterMessages,
  fetchNewsletterCampaigns,
  fetchNewsletterStats,
  fetchNewsletterSubscribers,
  removeNewsletterSubscriber,
  sendNewsletterCampaign,
  updateNewsletterSubscriberStatus,
} from "../../store/slices/newsletterSlice";

const audienceOptions = [
  { value: "subscribers", label: "Newsletter Subscribers" },
  { value: "order_customers", label: "Order Customers" },
  { value: "all", label: "All Unique Recipients" },
];

const filterOptions = [
  { value: "all", label: "All Statuses" },
  { value: "subscribed", label: "Subscribed" },
  { value: "unsubscribed", label: "Unsubscribed" },
];

const subscriberStatusOptions = [
  { value: "subscribed", label: "Subscribed" },
  { value: "unsubscribed", label: "Unsubscribed" },
];

const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: 50,
    borderRadius: 16,
    backgroundColor: "var(--cui-card-bg, #ffffff)",
    borderColor: state.isFocused
      ? "#6366f1"
      : "var(--cui-border-color, #dbe3f0)",
    boxShadow: state.isFocused
      ? "0 0 0 0.18rem rgba(99, 102, 241, 0.16)"
      : "0 8px 20px rgba(15, 23, 42, 0.04)",
    "&:hover": {
      borderColor: "#6366f1",
    },
  }),

  valueContainer: (base) => ({
    ...base,
    padding: "0 12px",
  }),

  placeholder: (base) => ({
    ...base,
    color: "var(--cui-secondary-color, #64748b)",
    fontWeight: 500,
  }),

  singleValue: (base) => ({
    ...base,
    color: "var(--cui-body-color, #0f172a)",
    fontWeight: 600,
  }),

  input: (base) => ({
    ...base,
    color: "var(--cui-body-color, #0f172a)",
  }),

  indicatorSeparator: () => ({
    display: "none",
  }),

  dropdownIndicator: (base, state) => ({
    ...base,
    color: state.isFocused ? "#6366f1" : "var(--cui-secondary-color, #94a3b8)",
    "&:hover": {
      color: "#6366f1",
    },
  }),

  clearIndicator: (base) => ({
    ...base,
    color: "var(--cui-secondary-color, #94a3b8)",
    "&:hover": {
      color: "#ef4444",
    },
  }),

  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),

  menu: (base) => ({
    ...base,
    backgroundColor: "var(--cui-card-bg, #ffffff)",
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 20px 44px rgba(15, 23, 42, 0.16)",
    border: "1px solid var(--cui-border-color, rgba(148, 163, 184, 0.16))",
  }),

  menuList: (base) => ({
    ...base,
    padding: 8,
    backgroundColor: "var(--cui-card-bg, #ffffff)",
  }),

  option: (base, state) => ({
    ...base,
    borderRadius: 12,
    marginBottom: 4,
    cursor: "pointer",
    fontWeight: 600,
    backgroundColor: state.isSelected
      ? "#4f46e5"
      : state.isFocused
        ? "rgba(79, 70, 229, 0.12)"
        : "transparent",
    color: state.isSelected ? "#ffffff" : "var(--cui-body-color, #0f172a)",
    "&:active": {
      backgroundColor: "#4f46e5",
      color: "#ffffff",
    },
  }),
};

const smallSelectStyles = {
  ...selectStyles,
  control: (base, state) => ({
    ...selectStyles.control(base, state),
    minHeight: 40,
    borderRadius: 12,
    boxShadow: "none",
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "0 8px",
  }),
};

const NewsletterSubscribersList = () => {
  const dispatch = useDispatch();

  const { stats, subscribers, campaigns, loading, actionLoading } = useSelector(
    (state) => state.newsletter || {},
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(filterOptions[0]);
  const [campaignForm, setCampaignForm] = useState({
    subject: "",
    heading: "",
    preview_text: "",
    message: "",
    audience_type: "",
    cta_text: "",
    cta_link: "",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    dispatch(fetchNewsletterStats());
    dispatch(fetchNewsletterSubscribers());
    dispatch(fetchNewsletterCampaigns());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearNewsletterMessages());
    };
  }, [dispatch]);

  const filteredSubscribers = useMemo(() => {
    const normalizedSearch = String(searchTerm || "")
      .trim()
      .toLowerCase();

    return subscribers.filter((item) => {
      const matchesSearch =
        !normalizedSearch ||
        item.email?.toLowerCase().includes(normalizedSearch) ||
        item.source?.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter?.value === "all" || item.status === statusFilter?.value;

      return matchesSearch && matchesStatus;
    });
  }, [subscribers, searchTerm, statusFilter]);

  const statCards = [
    {
      title: "Total Subscribers",
      value: stats?.total_subscribers || 0,
      icon: cilEnvelopeOpen,
      iconClass: "bg-primary-subtle text-primary",
    },
    {
      title: "Active Subscribers",
      value: stats?.active_subscribers || 0,
      icon: cilCheckCircle,
      iconClass: "bg-success-subtle text-success",
    },
    {
      title: "Order Customers",
      value: stats?.total_order_customers || 0,
      icon: cilCart,
      iconClass: "bg-info-subtle text-info",
    },
    {
      title: "Campaigns Sent",
      value: stats?.total_campaigns || 0,
      icon: cilPeople,
      iconClass: "bg-warning-subtle text-warning",
    },
  ];

  const showToast = ({ icon = "success", title }) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title,
      showConfirmButton: false,
      timer: 2600,
      timerProgressBar: true,
    });
  };

  const getBackendFieldErrors = (errorPayload) => {
    const nextErrors = {};

    if (Array.isArray(errorPayload?.errors)) {
      errorPayload.errors.forEach((item) => {
        if (item?.field) {
          nextErrors[item.field] = item.message;
        }
      });
    }

    return nextErrors;
  };

  const validateCampaignForm = () => {
    const nextErrors = {};

    if (!campaignForm.audience_type) {
      nextErrors.audience_type = "Audience is required";
    }
    if (!String(campaignForm.subject || "").trim()) {
      nextErrors.subject = "Subject is required";
    }
    if (!String(campaignForm.heading || "").trim()) {
      nextErrors.heading = "Heading is required";
    }
    if (!String(campaignForm.preview_text || "").trim()) {
      nextErrors.preview_text = "Preview text is required";
    }
    if (!String(campaignForm.message || "").trim()) {
      nextErrors.message = "Message is required";
    }
    if (!String(campaignForm.cta_text || "").trim()) {
      nextErrors.cta_text = "CTA text is required";
    }
    if (!String(campaignForm.cta_link || "").trim()) {
      nextErrors.cta_link = "CTA link is required";
    } else if (!/^https?:\/\/.+/i.test(String(campaignForm.cta_link).trim())) {
      nextErrors.cta_link = "CTA link must start with http:// or https://";
    }

    return nextErrors;
  };

  const handleCampaignChange = (key, value) => {
    setCampaignForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    setFormErrors((prev) => ({
      ...prev,
      [key]: "",
    }));
  };

  const handleSendCampaign = async (e) => {
    e.preventDefault();

    const frontendErrors = validateCampaignForm();

    if (Object.keys(frontendErrors).length > 0) {
      setFormErrors(frontendErrors);
      return;
    }

    setFormErrors({});

    Swal.fire({
      title: "Sending campaign...",
      text: "Please wait while emails are being delivered.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const result = await dispatch(sendNewsletterCampaign(campaignForm));
    Swal.close();

    if (result.meta.requestStatus === "fulfilled") {
      const campaign = result.payload?.data;

      setCampaignForm({
        subject: "",
        heading: "",
        preview_text: "",
        message: "",
        audience_type: "",
        cta_text: "",
        cta_link: "",
      });
      setFormErrors({});

      dispatch(fetchNewsletterStats());
      dispatch(fetchNewsletterSubscribers());
      dispatch(fetchNewsletterCampaigns());

      showToast({
        icon: "success",
        title: `Campaign sent successfully to ${campaign?.recipient_count || 0} recipients`,
      });
      return;
    }

    const apiErrors = getBackendFieldErrors(result.payload);
    if (Object.keys(apiErrors).length > 0) {
      setFormErrors(apiErrors);
    }

    showToast({
      icon: "error",
      title:
        result.payload?.message ||
        "Unable to send campaign. Please check the form and try again.",
    });
  };

  const handleStatusChange = async (id, option) => {
    const result = await dispatch(
      updateNewsletterSubscriberStatus({
        id,
        payload: { status: option?.value },
      }),
    );

    if (result.meta.requestStatus === "fulfilled") {
      showToast({
        icon: "success",
        title: "Subscriber status updated successfully",
      });
      return;
    }

    showToast({
      icon: "error",
      title: result.payload?.message || "Failed to update subscriber status",
    });
  };

  const handleDelete = async (id) => {
    const confirmResult = await Swal.fire({
      title: "Remove subscriber?",
      text: "This subscriber will be removed from your newsletter list.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      confirmButtonColor: "#dc3545",
    });

    if (!confirmResult.isConfirmed) return;

    Swal.fire({
      title: "Removing subscriber...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const result = await dispatch(removeNewsletterSubscriber(id));
    Swal.close();

    if (result.meta.requestStatus === "fulfilled") {
      dispatch(fetchNewsletterStats());
      showToast({
        icon: "success",
        title: "Subscriber removed successfully",
      });
      return;
    }

    showToast({
      icon: "error",
      title: result.payload?.message || "Failed to remove subscriber",
    });
  };

  return (
    <div className="newsletter-admin-page">
      <CCard className="newsletter-admin-hero border-0 shadow-sm mb-4">
        <CCardBody className="newsletter-admin-hero__body">
          <div>
            <div className="newsletter-admin-hero__eyebrow">
              Newsletter Management
            </div>
            <h2 className="newsletter-admin-hero__title">
              Manage Subscribers & Send Premium Campaigns
            </h2>
            <p className="newsletter-admin-hero__subtitle mb-0">
              Review newsletter emails, manage subscriber status, and send
              premium campaigns to subscribers, order customers, or both.
            </p>
          </div>
        </CCardBody>
      </CCard>

      <CRow className="g-3 mb-4">
        {statCards.map((card) => (
          <CCol xs={12} sm={6} xl={3} key={card.title}>
            <CCard className="dashboard-summary-card shadow-sm border-0 h-100">
              <CCardBody className="d-flex align-items-center gap-3">
                <div className={`dashboard-summary-icon ${card.iconClass}`}>
                  <CIcon icon={card.icon} size="lg" />
                </div>
                <div>
                  <div className="dashboard-summary-title">{card.title}</div>
                  <div className="dashboard-summary-value">{card.value}</div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>

      <CCard className="premium-table-card border-0 shadow-sm mb-4">
        <CCardHeader className="premium-card-header newsletter-admin-card-header">
          <div>
            <div className="newsletter-admin-card-title">
              Send Email Campaign
            </div>
            <div className="newsletter-admin-card-subtitle">
              Reach subscribers, order customers, or all recipients
            </div>
          </div>
        </CCardHeader>

        <CCardBody>
          <form onSubmit={handleSendCampaign} noValidate>
            <CRow className="g-3">
              <CCol xs={12} md={6}>
                <CFormLabel className="orders-field-label">Audience</CFormLabel>
                <Select
                  options={audienceOptions}
                  value={
                    audienceOptions.find(
                      (option) => option.value === campaignForm.audience_type,
                    ) || null
                  }
                  onChange={(option) =>
                    handleCampaignChange("audience_type", option?.value || "")
                  }
                  isSearchable={false}
                  classNamePrefix="newsletter-select"
                  styles={selectStyles}
                  menuPortalTarget={
                    typeof document !== "undefined" ? document.body : null
                  }
                />
                {formErrors.audience_type ? (
                  <div className="newsletter-field-error">
                    {formErrors.audience_type}
                  </div>
                ) : null}
              </CCol>

              <CCol xs={12} md={6}>
                <CFormLabel className="orders-field-label">Subject</CFormLabel>
                <CFormInput
                  className={`premium-input ${formErrors.subject ? "is-invalid" : ""}`}
                  value={campaignForm.subject}
                  onChange={(e) =>
                    handleCampaignChange("subject", e.target.value)
                  }
                  placeholder="Enter email subject"
                />
                {formErrors.subject ? (
                  <div className="newsletter-field-error">
                    {formErrors.subject}
                  </div>
                ) : null}
              </CCol>

              <CCol xs={12} md={6}>
                <CFormLabel className="orders-field-label">Heading</CFormLabel>
                <CFormInput
                  className={`premium-input ${formErrors.heading ? "is-invalid" : ""}`}
                  value={campaignForm.heading}
                  onChange={(e) =>
                    handleCampaignChange("heading", e.target.value)
                  }
                  placeholder="Enter campaign heading"
                />
                {formErrors.heading ? (
                  <div className="newsletter-field-error">
                    {formErrors.heading}
                  </div>
                ) : null}
              </CCol>

              <CCol xs={12} md={6}>
                <CFormLabel className="orders-field-label">
                  Preview Text
                </CFormLabel>
                <CFormInput
                  className={`premium-input ${formErrors.preview_text ? "is-invalid" : ""}`}
                  value={campaignForm.preview_text}
                  onChange={(e) =>
                    handleCampaignChange("preview_text", e.target.value)
                  }
                  placeholder="Short summary shown in email preview"
                />
                {formErrors.preview_text ? (
                  <div className="newsletter-field-error">
                    {formErrors.preview_text}
                  </div>
                ) : null}
              </CCol>

              <CCol xs={12}>
                <CFormLabel className="orders-field-label">Message</CFormLabel>
                <CFormTextarea
                  className={`premium-input premium-textarea ${formErrors.message ? "is-invalid" : ""}`}
                  rows={7}
                  value={campaignForm.message}
                  onChange={(e) =>
                    handleCampaignChange("message", e.target.value)
                  }
                  placeholder="Write your campaign message here"
                />
                {formErrors.message ? (
                  <div className="newsletter-field-error">
                    {formErrors.message}
                  </div>
                ) : null}
              </CCol>

              <CCol xs={12} md={6}>
                <CFormLabel className="orders-field-label">CTA Text</CFormLabel>
                <CFormInput
                  className={`premium-input ${formErrors.cta_text ? "is-invalid" : ""}`}
                  value={campaignForm.cta_text}
                  onChange={(e) =>
                    handleCampaignChange("cta_text", e.target.value)
                  }
                  placeholder="Shop Now"
                />
                {formErrors.cta_text ? (
                  <div className="newsletter-field-error">
                    {formErrors.cta_text}
                  </div>
                ) : null}
              </CCol>

              <CCol xs={12} md={6}>
                <CFormLabel className="orders-field-label">CTA Link</CFormLabel>
                <CFormInput
                  className={`premium-input ${formErrors.cta_link ? "is-invalid" : ""}`}
                  value={campaignForm.cta_link}
                  onChange={(e) =>
                    handleCampaignChange("cta_link", e.target.value)
                  }
                  placeholder="https://yourstore.com/product"
                />
                {formErrors.cta_link ? (
                  <div className="newsletter-field-error">
                    {formErrors.cta_link}
                  </div>
                ) : null}
              </CCol>

              <CCol xs={12}>
                <CButton
                  type="submit"
                  color="primary"
                  className="premium-main-btn newsletter-submit-btn"
                  disabled={actionLoading}
                >
                  <CIcon icon={cilPaperPlane} className="me-2" />
                  {actionLoading ? "Sending Campaign..." : "Send Campaign"}
                </CButton>
              </CCol>
            </CRow>
          </form>
        </CCardBody>
      </CCard>

      <CCard className="premium-table-card border-0 shadow-sm mb-4">
        <CCardHeader className="premium-card-header newsletter-admin-card-header">
          <div>
            <div className="newsletter-admin-card-title">Subscribers List</div>
            <div className="newsletter-admin-card-subtitle">
              Search, filter, review and manage all subscriber emails
            </div>
          </div>
        </CCardHeader>

        <CCardBody>
          <CRow className="g-3 mb-3">
            <CCol xs={12} md={7}>
              <CFormLabel className="orders-field-label">Search</CFormLabel>
              <CFormInput
                className="premium-input"
                placeholder="Search by email or source"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </CCol>

            <CCol xs={12} md={5}>
              <CFormLabel className="orders-field-label">Status</CFormLabel>
              <Select
                options={filterOptions}
                value={statusFilter}
                onChange={(option) => setStatusFilter(option)}
                isSearchable={false}
                classNamePrefix="newsletter-select"
                styles={selectStyles}
                menuPortalTarget={
                  typeof document !== "undefined" ? document.body : null
                }
              />
            </CCol>
          </CRow>

          <CTable hover responsive className="dashboard-mini-table">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Email</CTableHeaderCell>
                <CTableHeaderCell>Source</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Subscribed</CTableHeaderCell>
                <CTableHeaderCell>Last Email</CTableHeaderCell>
                <CTableHeaderCell className="text-center">
                  Actions
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <CTableBody>
              {filteredSubscribers.length ? (
                filteredSubscribers.map((item) => (
                  <CTableRow key={item._id}>
                    <CTableDataCell>
                      <div className="fw-semibold">{item.email}</div>
                    </CTableDataCell>

                    <CTableDataCell>
                      <CBadge color="info">{item.source || "homepage"}</CBadge>
                    </CTableDataCell>

                    <CTableDataCell style={{ minWidth: "180px" }}>
                      <Select
                        options={subscriberStatusOptions}
                        value={
                          subscriberStatusOptions.find(
                            (option) => option.value === item.status,
                          ) || null
                        }
                        onChange={(option) =>
                          handleStatusChange(item._id, option)
                        }
                        isSearchable={false}
                        classNamePrefix="newsletter-select"
                        styles={smallSelectStyles}
                        menuPortalTarget={
                          typeof document !== "undefined" ? document.body : null
                        }
                      />
                    </CTableDataCell>

                    <CTableDataCell>
                      {item.subscribed_at
                        ? new Date(item.subscribed_at).toLocaleString()
                        : "-"}
                    </CTableDataCell>

                    <CTableDataCell>
                      {item.last_email_sent_at
                        ? new Date(item.last_email_sent_at).toLocaleString()
                        : "Never"}
                    </CTableDataCell>

                    <CTableDataCell className="text-center">
                      <CButton
                        color="light"
                        size="sm"
                        className="premium-action-btn border"
                        onClick={() => handleDelete(item._id)}
                      >
                        <CIcon icon={cilTrash} className="me-1" />
                        Delete
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan={6} className="text-center py-4">
                    {loading ? <CSpinner size="sm" /> : "No subscribers found"}
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      <CCard className="premium-table-card border-0 shadow-sm">
        <CCardHeader className="premium-card-header newsletter-admin-card-header">
          <div>
            <div className="newsletter-admin-card-title">Recent Campaigns</div>
            <div className="newsletter-admin-card-subtitle">
              Review sent campaigns and delivery summary
            </div>
          </div>
        </CCardHeader>

        <CCardBody>
          <CTable hover responsive className="dashboard-mini-table">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Subject</CTableHeaderCell>
                <CTableHeaderCell>Audience</CTableHeaderCell>
                <CTableHeaderCell>Recipients</CTableHeaderCell>
                <CTableHeaderCell>Success</CTableHeaderCell>
                <CTableHeaderCell>Failed</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Sent At</CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <CTableBody>
              {campaigns.length ? (
                campaigns.map((item) => (
                  <CTableRow key={item._id}>
                    <CTableDataCell>
                      <div className="fw-semibold">{item.subject}</div>
                      <small className="text-medium-emphasis">
                        {item.heading || "No Heading"}
                      </small>
                    </CTableDataCell>

                    <CTableDataCell>
                      <CBadge color="primary">{item.audience_type}</CBadge>
                    </CTableDataCell>

                    <CTableDataCell>{item.recipient_count || 0}</CTableDataCell>
                    <CTableDataCell>{item.success_count || 0}</CTableDataCell>
                    <CTableDataCell>{item.failed_count || 0}</CTableDataCell>

                    <CTableDataCell>
                      <CBadge
                        color={
                          item.status === "sent"
                            ? "success"
                            : item.status === "partial_failed"
                              ? "warning"
                              : "danger"
                        }
                      >
                        {item.status}
                      </CBadge>
                    </CTableDataCell>

                    <CTableDataCell>
                      {item.sent_at
                        ? new Date(item.sent_at).toLocaleString()
                        : "-"}
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan={7} className="text-center py-4">
                    {loading ? <CSpinner size="sm" /> : "No campaigns found"}
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default NewsletterSubscribersList;
