import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilUser, cilLockLocked, cilShieldAlt } from "@coreui/icons";
import {
  loginAdmin,
  clearAdminAuthError,
} from "../../../store/slices/adminAuthSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, loading, error } = useSelector((state) => state.adminAuth);

  const [formData, setFormData] = useState({
    email_address: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email_address: "",
    password: "",
  });

  useEffect(() => {
    return () => {
      dispatch(clearAdminAuthError());
    };
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      // backend validation error array support
      if (Array.isArray(error?.errors)) {
        const backendErrors = {
          email_address: "",
          password: "",
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
      } else if (error?.field && error?.message) {
        setErrors((prev) => ({
          ...prev,
          [error.field]: error.message,
        }));
      } else if (error?.message === "Invalid credentials") {
        setErrors((prev) => ({
          ...prev,
          password: "Invalid credentials",
        }));
      }
    }
  }, [error]);

  if (token) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email_address || !/\S+@\S+\.\S+/.test(formData.email_address)) {
      newErrors.email_address = "Valid email is required";
    }

    if (!formData.password || !formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors({
      email_address: newErrors.email_address || "",
      password: newErrors.password || "",
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

    const result = await dispatch(loginAdmin(formData));

    if (result.meta.requestStatus === "fulfilled") {
      navigate("/admin/dashboard");
    }
  };

  return (
    <div className="admin-login-page premium-login-page d-flex align-items-center">
      <CContainer fluid>
        <CRow className="justify-content-center align-items-center min-vh-100 g-0">
          <CCol xs={12} sm={11} md={10} lg={10} xl={9}>
            <CCard className="admin-login-card premium-login-card border-0">
              <CRow className="g-0">
                <CCol md={6} className="premium-login-brand-side d-none d-md-flex">
                  <div className="premium-login-brand-wrap">
                    <div className="premium-login-logo">
                      <CIcon icon={cilShieldAlt} size="xl" />
                    </div>

                    <h2 className="premium-login-title">E-Commerce Admin</h2>

                    <p className="premium-login-subtitle">
                      Securely manage your store, products, categories and content
                      from one premium dashboard.
                    </p>

                    <div className="premium-login-feature-list">
                      <div className="premium-login-feature-item">
                        Secure admin access
                      </div>
                      <div className="premium-login-feature-item">
                        Premium dashboard experience
                      </div>
                      <div className="premium-login-feature-item">
                        Fast and responsive management
                      </div>
                    </div>
                  </div>
                </CCol>

                <CCol xs={12} md={6}>
                  <CCardBody className="premium-login-form-side">
                    <div className="premium-login-form-panel">
                      <div className="premium-login-form-header">
                        <div className="premium-login-mini-logo d-md-none mb-3">
                          <CIcon icon={cilShieldAlt} size="lg" />
                        </div>

                        <h1 className="premium-login-form-title">Admin Login</h1>
                        <p className="premium-login-form-subtitle mb-0">
                          Sign in to your admin account
                        </p>
                      </div>

                      <CForm onSubmit={handleSubmit} noValidate>
                        <div className="mb-3">
                          <label className="premium-login-label">
                            Email Address
                          </label>

                          <CInputGroup className="premium-login-input-group">
                            <CInputGroupText className="premium-login-input-icon">
                              <CIcon icon={cilUser} />
                            </CInputGroupText>

                            <CFormInput
                              className={`premium-login-input ${
                                errors.email_address ? "is-invalid" : ""
                              }`}
                              placeholder="Enter your email"
                              name="email_address"
                              value={formData.email_address}
                              onChange={handleChange}
                              autoComplete="email"
                            />
                          </CInputGroup>

                          {errors.email_address ? (
                            <small className="text-danger d-block mt-1">
                              {errors.email_address}
                            </small>
                          ) : null}
                        </div>

                        <div className="mb-4">
                          <label className="premium-login-label">Password</label>

                          <CInputGroup className="premium-login-input-group">
                            <CInputGroupText className="premium-login-input-icon">
                              <CIcon icon={cilLockLocked} />
                            </CInputGroupText>

                            <CFormInput
                              type="password"
                              className={`premium-login-input ${
                                errors.password ? "is-invalid" : ""
                              }`}
                              placeholder="Enter your password"
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              autoComplete="current-password"
                            />
                          </CInputGroup>

                          {errors.password ? (
                            <small className="text-danger d-block mt-1">
                              {errors.password}
                            </small>
                          ) : null}
                        </div>

                        <div className="d-grid">
                          <CButton
                            type="submit"
                            color="primary"
                            disabled={loading}
                            className="premium-login-btn"
                          >
                            {loading ? (
                              <>
                                <CSpinner size="sm" className="me-2" />
                                Logging in...
                              </>
                            ) : (
                              "Login"
                            )}
                          </CButton>
                        </div>
                      </CForm>
                    </div>
                  </CCardBody>
                </CCol>
              </CRow>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;