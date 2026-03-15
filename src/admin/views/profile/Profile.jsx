import React from "react";
import { useSelector } from "react-redux";
import { CCard, CCardBody, CCardHeader } from "@coreui/react";

const Profile = () => {
  const { admin } = useSelector((state) => state.adminAuth);

  return (
    <CCard>
      <CCardHeader>Profile</CCardHeader>
      <CCardBody>
        <p><strong>Name:</strong> {admin?.name || "-"}</p>
        <p><strong>Email:</strong> {admin?.email_address || "-"}</p>
      </CCardBody>
    </CCard>
  );
};

export default Profile;
