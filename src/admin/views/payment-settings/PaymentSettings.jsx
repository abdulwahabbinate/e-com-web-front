import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CAlert,
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSwitch,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilCreditCard,
  cilMoney,
  cilEnvelopeOpen,
  cilShieldAlt,
  cilInfo,
} from "@coreui/icons";
import Swal from "sweetalert2";
import {
  fetchPaymentSettings,
  updatePaymentSettings,
} from "../../store/slices/paymentSettingSlice";

const toastAlert = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true,
});

const PaymentSettings = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.paymentSettings);

  const [formData, setFormData] = useState({
    cash_on_delivery_enabled: false,
    card_payment_enabled: true,
    sandbox_mode: true,
    admin_notification_email: "",
    stripe_publishable_key: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchPaymentSettings());
  }, [dispatch]);

  useEffect(() => {
    if (data) {
      setFormData({
        cash_on_delivery_enabled: Boolean(data.cash_on_delivery_enabled),
        card_payment_enabled: Boolean(data.card_payment_enabled),
        sandbox_mode: Boolean(data.sandbox_mode),
        admin_notification_email: data.admin_notification_email || "",
        stripe_publishable_key: data.stripe_publishable_key || "",
      });
    }
  }, [data]);

  useEffect(() => {
    if (error?.message) {
      toastAlert.fire({
        icon: "error",
        title: error.message,
      });
    }
  }, [error]);

  const validateEmail = (email = "") => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateStripePublishableKey = (key = "") => {
    return /^pk_(test|live)_[A-Za-z0-9]+/.test(key.trim());
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.admin_notification_email.trim()) {
      if (!validateEmail(formData.admin_notification_email.trim())) {
        newErrors.admin_notification_email = "Please enter a valid admin email";
      }
    }

    if (formData.card_payment_enabled) {
      if (!formData.stripe_publishable_key.trim()) {
        newErrors.stripe_publishable_key = "Stripe publishable key is required";
      } else if (!validateStripePublishableKey(formData.stripe_publishable_key.trim())) {
        newErrors.stripe_publishable_key = "Please enter a valid Stripe publishable key";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const result = await dispatch(updatePaymentSettings(formData));

    if (result.meta.requestStatus === "fulfilled") {
      toastAlert.fire({
        icon: "success",
        title: "Payment settings updated successfully",
      });
    } else {
      toastAlert.fire({
        icon: "error",
        title: result?.payload?.message || "Update failed",
      });
    }
  };

  return (
    <>
      <CCard className="shadow-sm border-0 premium-table-card">
        <CCardHeader className="premium-card-header d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <strong className="fs-5">Payment Settings</strong>
            <div className="text-medium-emphasis small">
              Manage Stripe checkout and cash on delivery availability
            </div>
          </div>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            <CBadge color={formData.sandbox_mode ? "warning" : "success"}>
              {formData.sandbox_mode ? "Sandbox Mode" : "Live Mode"}
            </CBadge>

            <CBadge color={formData.card_payment_enabled ? "info" : "secondary"}>
              Card Payment {formData.card_payment_enabled ? "Enabled" : "Disabled"}
            </CBadge>

            <CBadge color={formData.cash_on_delivery_enabled ? "success" : "secondary"}>
              COD {formData.cash_on_delivery_enabled ? "Enabled" : "Disabled"}
            </CBadge>
          </div>
        </CCardHeader>

        <CCardBody>
          <CRow className="g-4 mb-4">
            <CCol xs={12}>
              <CAlert color={formData.sandbox_mode ? "warning" : "info"} className="mb-0 rounded-4">
                <div className="d-flex align-items-start gap-3">
                  <div className="mt-1">
                    <CIcon icon={cilInfo} size="lg" />
                  </div>

                  <div>
                    <div className="fw-semibold mb-1">
                      {formData.sandbox_mode
                        ? "Stripe Test Mode is Active"
                        : "Live Payment Mode is Active"}
                    </div>

                    <div className="small">
                      {formData.sandbox_mode
                        ? "Use Stripe test publishable key and test cards only. Recommended test card: 4242 4242 4242 4242."
                        : "Live payments will be processed with your active Stripe configuration. Make sure your backend secret key is also set correctly."}
                    </div>
                  </div>
                </div>
              </CAlert>
            </CCol>
          </CRow>

          <CForm onSubmit={handleSubmit}>
            <CRow className="g-4">
              <CCol xs={12} xl={7}>
                <CCard className="border-0 shadow-sm h-100 premium-dashboard-card">
                  <CCardHeader className="premium-dashboard-card-header">
                    <div className="fw-semibold">Gateway Configuration</div>
                    <div className="small text-medium-emphasis">
                      Configure Stripe details and notification email
                    </div>
                  </CCardHeader>

                  <CCardBody>
                    <CRow className="g-3">
                      <CCol xs={12}>
                        <CFormLabel className="fw-semibold d-flex align-items-center gap-2">
                          <CIcon icon={cilEnvelopeOpen} />
                          <span>Admin Notification Email</span>
                        </CFormLabel>
                        <CFormInput
                          className="premium-input"
                          name="admin_notification_email"
                          value={formData.admin_notification_email}
                          onChange={handleChange}
                          placeholder="Enter admin email"
                        />
                        {errors.admin_notification_email && (
                          <small className="text-danger">
                            {errors.admin_notification_email}
                          </small>
                        )}
                        <div className="small text-medium-emphasis mt-1">
                          New order notification will be sent to this email address.
                        </div>
                      </CCol>

                      <CCol xs={12}>
                        <CFormLabel className="fw-semibold d-flex align-items-center gap-2">
                          <CIcon icon={cilCreditCard} />
                          <span>Stripe Publishable Key</span>
                        </CFormLabel>
                        <CFormInput
                          className="premium-input"
                          name="stripe_publishable_key"
                          value={formData.stripe_publishable_key}
                          onChange={handleChange}
                          placeholder="pk_test_xxxxxxxxxxxxxxxxx"
                        />
                        {errors.stripe_publishable_key && (
                          <small className="text-danger">
                            {errors.stripe_publishable_key}
                          </small>
                        )}
                        <div className="small text-medium-emphasis mt-1">
                          Frontend checkout uses this Stripe publishable key.
                        </div>
                      </CCol>
                    </CRow>
                  </CCardBody>
                </CCard>
              </CCol>

              <CCol xs={12} xl={5}>
                <CCard className="border-0 shadow-sm h-100 premium-dashboard-card">
                  <CCardHeader className="premium-dashboard-card-header">
                    <div className="fw-semibold">Payment Availability</div>
                    <div className="small text-medium-emphasis">
                      Enable or disable checkout options for customers
                    </div>
                  </CCardHeader>

                  <CCardBody>
                    <div className="d-flex flex-column gap-3">
                      <div className="d-flex justify-content-between align-items-center border rounded-4 p-3 premium-setting-switch-card">
                        <div className="d-flex align-items-start gap-3">
                          <div className="premium-setting-icon-box text-info">
                            <CIcon icon={cilCreditCard} />
                          </div>
                          <div>
                            <div className="fw-semibold">Card Payment</div>
                            <div className="small text-medium-emphasis">
                              Enable secure Stripe checkout for debit and credit cards
                            </div>
                          </div>
                        </div>

                        <CFormSwitch
                          name="card_payment_enabled"
                          checked={formData.card_payment_enabled}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="d-flex justify-content-between align-items-center border rounded-4 p-3 premium-setting-switch-card">
                        <div className="d-flex align-items-start gap-3">
                          <div className="premium-setting-icon-box text-success">
                            <CIcon icon={cilMoney} />
                          </div>
                          <div>
                            <div className="fw-semibold">Cash on Delivery</div>
                            <div className="small text-medium-emphasis">
                              Allow customers to place order without online payment
                            </div>
                          </div>
                        </div>

                        <CFormSwitch
                          name="cash_on_delivery_enabled"
                          checked={formData.cash_on_delivery_enabled}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="d-flex justify-content-between align-items-center border rounded-4 p-3 premium-setting-switch-card">
                        <div className="d-flex align-items-start gap-3">
                          <div className="premium-setting-icon-box text-warning">
                            <CIcon icon={cilShieldAlt} />
                          </div>
                          <div>
                            <div className="fw-semibold">Sandbox Mode</div>
                            <div className="small text-medium-emphasis">
                              Keep Stripe in test mode while integrating and testing
                            </div>
                          </div>
                        </div>

                        <CFormSwitch
                          name="sandbox_mode"
                          checked={formData.sandbox_mode}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>

              <CCol xs={12}>
                <CCard className="border-0 shadow-sm premium-dashboard-card">
                  <CCardHeader className="premium-dashboard-card-header">
                    <div className="fw-semibold">Quick Notes</div>
                  </CCardHeader>

                  <CCardBody>
                    <CRow className="g-3">
                      <CCol md={4}>
                        <div className="premium-info-note-card h-100">
                          <div className="fw-semibold mb-2">Stripe Test Card</div>
                          <div className="small text-medium-emphasis">
                            4242 4242 4242 4242
                            <br />
                            Expiry: any future date
                            <br />
                            CVC: any 3 digits
                          </div>
                        </div>
                      </CCol>

                      <CCol md={4}>
                        <div className="premium-info-note-card h-100">
                          <div className="fw-semibold mb-2">Backend Requirement</div>
                          <div className="small text-medium-emphasis">
                            Make sure <code>STRIPE_SECRET_KEY</code> is correctly set in backend
                            environment variables.
                          </div>
                        </div>
                      </CCol>

                      <CCol md={4}>
                        <div className="premium-info-note-card h-100">
                          <div className="fw-semibold mb-2">Email Notifications</div>
                          <div className="small text-medium-emphasis">
                            Orders can notify both customer and admin if SMTP credentials are
                            configured properly.
                          </div>
                        </div>
                      </CCol>
                    </CRow>
                  </CCardBody>
                </CCard>
              </CCol>

              <CCol xs={12}>
                <div className="d-flex flex-wrap gap-2">
                  <CButton
                    type="submit"
                    color="primary"
                    className="premium-main-btn px-4"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Settings"}
                  </CButton>

                  <CButton
                    type="button"
                    color="light"
                    className="border px-4 premium-action-btn"
                    onClick={() => dispatch(fetchPaymentSettings())}
                    disabled={loading}
                  >
                    Refresh
                  </CButton>
                </div>
              </CCol>
            </CRow>
          </CForm>
        </CCardBody>
      </CCard>
    </>
  );
};

export default PaymentSettings;