import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CSpinner,
} from "@coreui/react";
import Swal from "sweetalert2";
import {
  changeAdminPassword,
  clearAdminAuthError,
} from "../../store/slices/adminAuthSlice";

const toastAlert = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true,
});

const ChangePassword = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.adminAuth);

  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  useEffect(() => {
    return () => {
      dispatch(clearAdminAuthError());
    };
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      if (Array.isArray(error?.errors)) {
        const backendErrors = {
          current_password: "",
          new_password: "",
          confirm_password: "",
        };

        error.errors.forEach((item) => {
          if (item?.field && item?.message) {
            backendErrors[item.field] = item.message;
          }
        });

        setErrors((prev) => ({
          ...prev,
          ...backendErrors,
        }));
      } else if (error?.message === "Current password is incorrect") {
        setErrors((prev) => ({
          ...prev,
          current_password: "Current password is incorrect",
        }));
      } else if (error?.message) {
        toastAlert.fire({
          icon: "error",
          title: error.message,
        });
      }
    }
  }, [error]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.current_password || !formData.current_password.trim()) {
      newErrors.current_password = "Current password is required";
    }

    if (!formData.new_password || formData.new_password.trim().length < 6) {
      newErrors.new_password = "New password must be at least 6 characters";
    }

    if (!formData.confirm_password || formData.confirm_password !== formData.new_password) {
      newErrors.confirm_password = "Confirm password does not match";
    }

    setErrors({
      current_password: newErrors.current_password || "",
      new_password: newErrors.new_password || "",
      confirm_password: newErrors.confirm_password || "",
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    if (error) {
      dispatch(clearAdminAuthError());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const result = await dispatch(changeAdminPassword(formData));

    if (result.meta.requestStatus === "fulfilled") {
      setFormData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
      setErrors({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });

      toastAlert.fire({
        icon: "success",
        title: "Password changed successfully",
      });
    }
  };

  return (
    <CRow className="justify-content-center">
      <CCol xl={8} lg={9}>
        <CCard className="premium-table-card border-0">
          <CCardHeader className="premium-card-header">
            <strong>Change Password</strong>
          </CCardHeader>

          <CCardBody>
            <div className="profile-security-banner mb-4">
              <div className="profile-security-banner__content">
                <h5 className="mb-1">Update your password</h5>
                <p className="mb-0 text-medium-emphasis">
                  Use a strong password with letters, numbers and symbols.
                </p>
              </div>
            </div>

            <CForm onSubmit={handleSubmit} noValidate>
              <CRow className="g-3">
                <CCol md={12}>
                  <CFormLabel>Current Password</CFormLabel>
                  <CFormInput
                    type="password"
                    className={`premium-input ${errors.current_password ? "is-invalid" : ""}`}
                    name="current_password"
                    value={formData.current_password}
                    onChange={handleChange}
                    autoComplete="current-password"
                  />
                  {errors.current_password ? (
                    <small className="text-danger d-block mt-1">
                      {errors.current_password}
                    </small>
                  ) : null}
                </CCol>

                <CCol md={6}>
                  <CFormLabel>New Password</CFormLabel>
                  <CFormInput
                    type="password"
                    className={`premium-input ${errors.new_password ? "is-invalid" : ""}`}
                    name="new_password"
                    value={formData.new_password}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  {errors.new_password ? (
                    <small className="text-danger d-block mt-1">
                      {errors.new_password}
                    </small>
                  ) : null}
                </CCol>

                <CCol md={6}>
                  <CFormLabel>Confirm Password</CFormLabel>
                  <CFormInput
                    type="password"
                    className={`premium-input ${errors.confirm_password ? "is-invalid" : ""}`}
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  {errors.confirm_password ? (
                    <small className="text-danger d-block mt-1">
                      {errors.confirm_password}
                    </small>
                  ) : null}
                </CCol>

                <CCol xs={12}>
                  <CButton
                    type="submit"
                    color="primary"
                    className="premium-main-btn"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <CSpinner size="sm" className="me-2" />
                        Updating...
                      </>
                    ) : (
                      "Change Password"
                    )}
                  </CButton>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default ChangePassword;