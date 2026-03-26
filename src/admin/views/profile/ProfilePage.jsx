import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CRow,
  CImage,
  CAvatar,
  CSpinner,
  CBadge,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilCloudUpload,
  cilX,
  cilPencil,
  cilLocationPin,
  cilPhone,
  cilEnvelopeOpen,
  cilShieldAlt,
} from "@coreui/icons";
import Select from "react-select";
import Swal from "sweetalert2";
import {
  fetchAdminProfile,
  updateAdminProfile,
  clearAdminAuthError,
} from "../../store/slices/adminAuthSlice";

const toastAlert = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true,
});

const initialForm = {
  first_name: "",
  last_name: "",
  phone: "",
  email: "",
  role: "",
  bio: "",
  device_token: "",
  device_type: "",
  location: "",
  address: "",
  city: "",
  state: "",
  zip_code: "",
  gender: "",
  is_verified: false,
  is_profile_completed: false,
  is_notification_enabled: true,
  terms_and_conditions: false,
  privacy_policy: false,
};

const initialErrors = {
  first_name: "",
  last_name: "",
  phone: "",
  bio: "",
  device_token: "",
  device_type: "",
  location: "",
  address: "",
  city: "",
  state: "",
  zip_code: "",
  gender: "",
};

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

const ProfilePage = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const { admin, loading, error } = useSelector((state) => state.adminAuth);

  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [errors, setErrors] = useState(initialErrors);

  useEffect(() => {
    dispatch(fetchAdminProfile());

    return () => {
      dispatch(clearAdminAuthError());
    };
  }, [dispatch]);

  useEffect(() => {
    if (admin) {
      setFormData({
        first_name: admin.first_name || "",
        last_name: admin.last_name || "",
        phone: admin.phone || "",
        email: admin.email || "",
        role: admin.role || "",
        bio: admin.bio || "",
        device_token: admin.device_token || "",
        device_type: admin.device_type || "",
        location: admin.location || "",
        address: admin.address || "",
        city: admin.city || "",
        state: admin.state || "",
        zip_code: admin.zip_code || "",
        gender: admin.gender || "",
        is_verified: !!admin.is_verified,
        is_profile_completed: !!admin.is_profile_completed,
        is_notification_enabled: !!admin.is_notification_enabled,
        terms_and_conditions: !!admin.terms_and_conditions,
        privacy_policy: !!admin.privacy_policy,
      });
      setAvatarPreview(admin.avatar || "");
    }
  }, [admin]);

  useEffect(() => {
    if (error) {
      if (Array.isArray(error?.errors)) {
        const backendErrors = { ...initialErrors };

        error.errors.forEach((item) => {
          if (
            item?.field &&
            item?.message &&
            Object.prototype.hasOwnProperty.call(backendErrors, item.field)
          ) {
            backendErrors[item.field] = item.message;
          }
        });

        setErrors((prev) => ({
          ...prev,
          ...backendErrors,
        }));
      } else if (error?.message) {
        toastAlert.fire({
          icon: "error",
          title: error.message,
        });
      }
    }
  }, [error]);

  const fullName = useMemo(() => {
    return `${formData.first_name || ""} ${formData.last_name || ""}`.trim() || "Admin User";
  }, [formData.first_name, formData.last_name]);

  const initials = useMemo(() => {
    const f = formData.first_name?.charAt(0) || "A";
    const l = formData.last_name?.charAt(0) || "";
    return `${f}${l}`.toUpperCase();
  }, [formData.first_name, formData.last_name]);

  const validateForm = () => {
    const newErrors = { ...initialErrors };

    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }

    if (
      formData.gender &&
      !["male", "female"].includes(String(formData.gender).toLowerCase())
    ) {
      newErrors.gender = "Gender must be male or female";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
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

    if (error) {
      dispatch(clearAdminAuthError());
    }
  };

  const handleGenderChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      gender: selectedOption?.value || "",
    }));

    setErrors((prev) => ({
      ...prev,
      gender: "",
    }));

    if (error) {
      dispatch(clearAdminAuthError());
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0] || null;
    setAvatarFile(file);

    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const removeAvatarPreview = () => {
    setAvatarFile(null);
    setAvatarPreview(admin?.avatar || "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const resetForm = () => {
    if (!admin) return;

    setFormData({
      first_name: admin.first_name || "",
      last_name: admin.last_name || "",
      phone: admin.phone || "",
      email: admin.email || "",
      role: admin.role || "",
      bio: admin.bio || "",
      device_token: admin.device_token || "",
      device_type: admin.device_type || "",
      location: admin.location || "",
      address: admin.address || "",
      city: admin.city || "",
      state: admin.state || "",
      zip_code: admin.zip_code || "",
      gender: admin.gender || "",
      is_verified: !!admin.is_verified,
      is_profile_completed: !!admin.is_profile_completed,
      is_notification_enabled: !!admin.is_notification_enabled,
      terms_and_conditions: !!admin.terms_and_conditions,
      privacy_policy: !!admin.privacy_policy,
    });

    setAvatarFile(null);
    setAvatarPreview(admin.avatar || "");
    setErrors(initialErrors);
    setIsEditMode(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = new FormData();
    payload.append("first_name", formData.first_name);
    payload.append("last_name", formData.last_name);
    payload.append("phone", formData.phone);
    payload.append("bio", formData.bio);
    payload.append("device_token", formData.device_token);
    payload.append("device_type", formData.device_type);
    payload.append("location", formData.location);
    payload.append("address", formData.address);
    payload.append("city", formData.city);
    payload.append("state", formData.state);
    payload.append("zip_code", formData.zip_code);
    payload.append("gender", formData.gender);
    payload.append("is_verified", String(formData.is_verified));
    payload.append("is_profile_completed", String(formData.is_profile_completed));
    payload.append("is_notification_enabled", String(formData.is_notification_enabled));
    payload.append("terms_and_conditions", String(formData.terms_and_conditions));
    payload.append("privacy_policy", String(formData.privacy_policy));

    if (avatarFile) {
      payload.append("avatar", avatarFile);
    }

    const result = await dispatch(updateAdminProfile(payload));

    if (result.meta.requestStatus === "fulfilled") {
      setIsEditMode(false);
      toastAlert.fire({
        icon: "success",
        title: "Profile updated successfully",
      });
    }
  };

  const renderStatusBadge = (value, trueText = "Yes", falseText = "No") => (
    <CBadge color={value ? "success" : "secondary"}>
      {value ? trueText : falseText}
    </CBadge>
  );

  return (
    <div className="profile-page-premium">
      <CRow className="g-4 align-items-start">
        <CCol xl={4}>
          <div className="profile-summary-sticky">
            <CCard className="premium-table-card border-0 profile-premium-summary-card">
              <CCardHeader className="premium-card-header d-flex justify-content-between align-items-center">
                <strong>Profile Summary</strong>
                {!isEditMode ? (
                  <CButton
                    color="primary"
                    size="sm"
                    className="premium-main-btn"
                    onClick={() => setIsEditMode(true)}
                  >
                    <CIcon icon={cilPencil} className="me-2" />
                    Update Profile
                  </CButton>
                ) : null}
              </CCardHeader>

              <CCardBody className="text-center">
                <div className="position-relative d-inline-block mb-4">
                  {avatarPreview ? (
                    <div className="profile-premium-avatar-shell">
                      <CImage
                        src={avatarPreview}
                        width={140}
                        height={140}
                        rounded
                        className="profile-premium-avatar-image"
                      />
                    </div>
                  ) : (
                    <CAvatar size="xl" className="profile-premium-avatar-fallback">
                      {initials}
                    </CAvatar>
                  )}

                  {isEditMode && avatarFile ? (
                    <button
                      type="button"
                      onClick={removeAvatarPreview}
                      className="profile-avatar-remove-btn"
                    >
                      <CIcon icon={cilX} />
                    </button>
                  ) : null}
                </div>

                <h3 className="profile-premium-name">{fullName}</h3>
                <div className="profile-premium-role">{formData.role || "admin"}</div>

                <div className="profile-premium-contact-list mt-4">
                  <div className="profile-premium-contact-item">
                    <CIcon icon={cilEnvelopeOpen} />
                    <span>{formData.email || "-"}</span>
                  </div>

                  <div className="profile-premium-contact-item">
                    <CIcon icon={cilPhone} />
                    <span>{formData.phone || "-"}</span>
                  </div>

                  <div className="profile-premium-contact-item">
                    <CIcon icon={cilLocationPin} />
                    <span>{formData.location || formData.city || "-"}</span>
                  </div>
                </div>

                <div className="profile-premium-badges mt-4">
                  {renderStatusBadge(formData.is_verified, "Verified", "Not Verified")}
                  {renderStatusBadge(formData.is_profile_completed, "Completed", "Incomplete")}
                </div>

                {isEditMode ? (
                  <div className="mt-4">
                    <CButton
                      color="primary"
                      className="premium-main-btn"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <CIcon icon={cilCloudUpload} className="me-2" />
                      Upload Avatar
                    </CButton>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="d-none"
                      onChange={handleAvatarChange}
                    />
                  </div>
                ) : null}
              </CCardBody>
            </CCard>
          </div>
        </CCol>

        <CCol xl={8}>
          {!isEditMode ? (
            <>
              <CCard className="premium-table-card border-0 profile-premium-details-card">
                <CCardHeader className="premium-card-header d-flex justify-content-between align-items-center">
                  <strong>Profile Details</strong>
                  <CButton
                    color="primary"
                    className="premium-main-btn"
                    onClick={() => setIsEditMode(true)}
                  >
                    <CIcon icon={cilPencil} className="me-2" />
                    Update Profile
                  </CButton>
                </CCardHeader>

                <CCardBody>
                  <CRow className="g-4">
                    <CCol md={6}>
                      <div className="profile-info-block">
                        <div className="profile-info-label">First Name</div>
                        <div className="profile-info-value">{formData.first_name || "-"}</div>
                      </div>
                    </CCol>

                    <CCol md={6}>
                      <div className="profile-info-block">
                        <div className="profile-info-label">Last Name</div>
                        <div className="profile-info-value">{formData.last_name || "-"}</div>
                      </div>
                    </CCol>

                    <CCol md={6}>
                      <div className="profile-info-block">
                        <div className="profile-info-label">Email</div>
                        <div className="profile-info-value">{formData.email || "-"}</div>
                      </div>
                    </CCol>

                    <CCol md={6}>
                      <div className="profile-info-block">
                        <div className="profile-info-label">Role</div>
                        <div className="profile-info-value text-capitalize">
                          {formData.role || "-"}
                        </div>
                      </div>
                    </CCol>

                    <CCol md={6}>
                      <div className="profile-info-block">
                        <div className="profile-info-label">Phone</div>
                        <div className="profile-info-value">{formData.phone || "-"}</div>
                      </div>
                    </CCol>

                    <CCol md={6}>
                      <div className="profile-info-block">
                        <div className="profile-info-label">Gender</div>
                        <div className="profile-info-value">{formData.gender || "-"}</div>
                      </div>
                    </CCol>

                    <CCol md={12}>
                      <div className="profile-info-block">
                        <div className="profile-info-label">Bio</div>
                        <div className="profile-info-value">{formData.bio || "-"}</div>
                      </div>
                    </CCol>

                    <CCol md={6}>
                      <div className="profile-info-block">
                        <div className="profile-info-label">Device Token</div>
                        <div className="profile-info-value">{formData.device_token || "-"}</div>
                      </div>
                    </CCol>

                    <CCol md={6}>
                      <div className="profile-info-block">
                        <div className="profile-info-label">Device Type</div>
                        <div className="profile-info-value">{formData.device_type || "-"}</div>
                      </div>
                    </CCol>

                    <CCol md={12}>
                      <div className="profile-info-block">
                        <div className="profile-info-label">Address</div>
                        <div className="profile-info-value">
                          {[formData.address, formData.city, formData.state, formData.zip_code]
                            .filter(Boolean)
                            .join(", ") || "-"}
                        </div>
                      </div>
                    </CCol>

                    <CCol md={6}>
                      <div className="profile-info-block">
                        <div className="profile-info-label">Notifications</div>
                        <div className="profile-info-value">
                          {renderStatusBadge(formData.is_notification_enabled, "Enabled", "Disabled")}
                        </div>
                      </div>
                    </CCol>

                    <CCol md={6}>
                      <div className="profile-info-block">
                        <div className="profile-info-label">Security</div>
                        <div className="profile-info-value d-flex gap-2 flex-wrap">
                          {renderStatusBadge(formData.terms_and_conditions, "Terms Accepted", "Terms Pending")}
                          {renderStatusBadge(formData.privacy_policy, "Privacy Accepted", "Privacy Pending")}
                        </div>
                      </div>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>

              <CCard className="premium-table-card border-0 mt-4">
                <CCardHeader className="premium-card-header">
                  <strong>Account Security</strong>
                </CCardHeader>
                <CCardBody>
                  <div className="profile-security-banner">
                    <div className="profile-security-banner__icon">
                      <CIcon icon={cilShieldAlt} />
                    </div>
                    <div className="profile-security-banner__content">
                      <h5 className="mb-1">Secure your account</h5>
                      <p className="mb-0 text-medium-emphasis">
                        Change password is available from the header profile dropdown.
                      </p>
                    </div>
                  </div>
                </CCardBody>
              </CCard>
            </>
          ) : (
            <CCard className="premium-table-card border-0 profile-premium-details-card">
              <CCardHeader className="premium-card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
                <strong>Edit Profile</strong>
                <div className="d-flex gap-2 flex-wrap">
                  <CButton color="secondary" onClick={resetForm}>
                    Cancel
                  </CButton>
                  <CButton
                    color="primary"
                    className="premium-main-btn"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <CSpinner size="sm" className="me-2" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </CButton>
                </div>
              </CCardHeader>

              <CCardBody>
                <CForm onSubmit={handleSubmit} noValidate>
                  <CRow className="g-3">
                    <CCol md={6}>
                      <CFormLabel>First Name</CFormLabel>
                      <CFormInput
                        className={`premium-input ${errors.first_name ? "is-invalid" : ""}`}
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                      />
                      {errors.first_name ? (
                        <small className="text-danger d-block mt-1">{errors.first_name}</small>
                      ) : null}
                    </CCol>

                    <CCol md={6}>
                      <CFormLabel>Last Name</CFormLabel>
                      <CFormInput
                        className={`premium-input ${errors.last_name ? "is-invalid" : ""}`}
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                      />
                      {errors.last_name ? (
                        <small className="text-danger d-block mt-1">{errors.last_name}</small>
                      ) : null}
                    </CCol>

                    <CCol md={6}>
                      <CFormLabel>Email</CFormLabel>
                      <CFormInput className="premium-input" value={formData.email} disabled />
                    </CCol>

                    <CCol md={6}>
                      <CFormLabel>Role</CFormLabel>
                      <CFormInput className="premium-input text-capitalize" value={formData.role} disabled />
                    </CCol>

                    <CCol md={6}>
                      <CFormLabel>Phone</CFormLabel>
                      <CFormInput
                        className={`premium-input ${errors.phone ? "is-invalid" : ""}`}
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                      {errors.phone ? (
                        <small className="text-danger d-block mt-1">{errors.phone}</small>
                      ) : null}
                    </CCol>

                    <CCol md={6}>
                      <CFormLabel>Gender</CFormLabel>
                      <Select
                        classNamePrefix="premium-react-select"
                        className={errors.gender ? "is-invalid-react-select" : ""}
                        options={genderOptions}
                        value={
                          genderOptions.find((option) => option.value === formData.gender) || null
                        }
                        onChange={handleGenderChange}
                        placeholder="Select gender"
                        isClearable
                        menuPortalTarget={document.body}
                      />
                      {errors.gender ? (
                        <small className="text-danger d-block mt-1">{errors.gender}</small>
                      ) : null}
                    </CCol>

                    <CCol md={12}>
                      <CFormLabel>Bio</CFormLabel>
                      <CFormTextarea
                        className={`premium-input ${errors.bio ? "is-invalid" : ""}`}
                        rows={4}
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                      />
                      {errors.bio ? (
                        <small className="text-danger d-block mt-1">{errors.bio}</small>
                      ) : null}
                    </CCol>

                    <CCol md={6}>
                      <CFormLabel>Device Token</CFormLabel>
                      <CFormInput
                        className={`premium-input ${errors.device_token ? "is-invalid" : ""}`}
                        name="device_token"
                        value={formData.device_token}
                        onChange={handleChange}
                      />
                      {errors.device_token ? (
                        <small className="text-danger d-block mt-1">{errors.device_token}</small>
                      ) : null}
                    </CCol>

                    <CCol md={6}>
                      <CFormLabel>Device Type</CFormLabel>
                      <CFormInput
                        className={`premium-input ${errors.device_type ? "is-invalid" : ""}`}
                        name="device_type"
                        value={formData.device_type}
                        onChange={handleChange}
                      />
                      {errors.device_type ? (
                        <small className="text-danger d-block mt-1">{errors.device_type}</small>
                      ) : null}
                    </CCol>

                    <CCol xs={12}>
                      <div className="profile-form-section-title">Location Details</div>
                    </CCol>

                    <CCol md={6}>
                      <CFormLabel>Location</CFormLabel>
                      <CFormInput
                        className={`premium-input ${errors.location ? "is-invalid" : ""}`}
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g. Karachi, Pakistan"
                      />
                      {errors.location ? (
                        <small className="text-danger d-block mt-1">{errors.location}</small>
                      ) : null}
                    </CCol>

                    <CCol md={6}>
                      <CFormLabel>Address</CFormLabel>
                      <CFormInput
                        className={`premium-input ${errors.address ? "is-invalid" : ""}`}
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Street address"
                      />
                      {errors.address ? (
                        <small className="text-danger d-block mt-1">{errors.address}</small>
                      ) : null}
                    </CCol>

                    <CCol md={4}>
                      <CFormLabel>City</CFormLabel>
                      <CFormInput
                        className={`premium-input ${errors.city ? "is-invalid" : ""}`}
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="City"
                      />
                      {errors.city ? (
                        <small className="text-danger d-block mt-1">{errors.city}</small>
                      ) : null}
                    </CCol>

                    <CCol md={4}>
                      <CFormLabel>State</CFormLabel>
                      <CFormInput
                        className={`premium-input ${errors.state ? "is-invalid" : ""}`}
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="State"
                      />
                      {errors.state ? (
                        <small className="text-danger d-block mt-1">{errors.state}</small>
                      ) : null}
                    </CCol>

                    <CCol md={4}>
                      <CFormLabel>Zip Code</CFormLabel>
                      <CFormInput
                        className={`premium-input ${errors.zip_code ? "is-invalid" : ""}`}
                        name="zip_code"
                        value={formData.zip_code}
                        onChange={handleChange}
                        placeholder="Zip code"
                      />
                      {errors.zip_code ? (
                        <small className="text-danger d-block mt-1">{errors.zip_code}</small>
                      ) : null}
                    </CCol>

                    <CCol md={4}>
                      <CFormCheck
                        label="Verified"
                        name="is_verified"
                        checked={formData.is_verified}
                        onChange={handleChange}
                      />
                    </CCol>

                    <CCol md={4}>
                      <CFormCheck
                        label="Profile Completed"
                        name="is_profile_completed"
                        checked={formData.is_profile_completed}
                        onChange={handleChange}
                      />
                    </CCol>

                    <CCol md={4}>
                      <CFormCheck
                        label="Notifications Enabled"
                        name="is_notification_enabled"
                        checked={formData.is_notification_enabled}
                        onChange={handleChange}
                      />
                    </CCol>

                    <CCol md={6}>
                      <CFormCheck
                        label="Terms & Conditions Accepted"
                        name="terms_and_conditions"
                        checked={formData.terms_and_conditions}
                        onChange={handleChange}
                      />
                    </CCol>

                    <CCol md={6}>
                      <CFormCheck
                        label="Privacy Policy Accepted"
                        name="privacy_policy"
                        checked={formData.privacy_policy}
                        onChange={handleChange}
                      />
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          )}
        </CCol>
      </CRow>
    </div>
  );
};

export default ProfilePage;