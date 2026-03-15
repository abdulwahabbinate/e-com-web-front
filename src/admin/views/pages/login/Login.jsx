import React, { useState } from "react";
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
  CAlert,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilUser, cilLockLocked } from "@coreui/icons";
import { adminLogin } from "../../../store/slices/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, loading, error } = useSelector((state) => state.adminAuth);

  const [formData, setFormData] = useState({
    email_address: "",
    password: "",
  });

  if (token) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(adminLogin(formData));
    if (result.meta.requestStatus === "fulfilled") {
      navigate("/admin/dashboard");
    }
  };

  return (
    <div className="admin-login-page d-flex align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8} lg={6}>
            <CCard className="admin-login-card p-4">
              <CCardBody>
                <CForm onSubmit={handleSubmit}>
                  <h1>Admin Login</h1>
                  <p className="text-body-secondary">Sign in to your admin account</p>

                  {error ? <CAlert color="danger">{error}</CAlert> : null}

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Email"
                      name="email_address"
                      value={formData.email_address}
                      onChange={handleChange}
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </CInputGroup>

                  <CButton type="submit" color="primary" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                  </CButton>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;
