import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar, Footer } from "../components";
import "./Auth.css";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Register Data:", formData);
    alert("Register UI is ready. You can connect API later.");
  };

  return (
    <>
      <Navbar />

      <div className="premium-auth-page">
        <div className="container py-4 py-lg-5">
          <div className="premium-auth-wrap register-layout">
            <div className="premium-auth-showcase">
              <span className="premium-auth-badge">Create Account</span>
              <h1>Join a modern premium ecommerce experience</h1>
              <p>
                Create your account to save products, manage orders, and enjoy a
                smoother shopping journey built around premium design and trust.
              </p>

              <div className="premium-auth-points">
                <div className="premium-auth-point">
                  <i className="fa fa-user-o"></i>
                  <span>Create your personal shopping account</span>
                </div>
                <div className="premium-auth-point">
                  <i className="fa fa-heart"></i>
                  <span>Save favorites and build your wishlist</span>
                </div>
                <div className="premium-auth-point">
                  <i className="fa fa-credit-card"></i>
                  <span>Enjoy a faster checkout experience later</span>
                </div>
              </div>
            </div>

            <div className="premium-auth-card">
              <div className="premium-auth-card-head">
                <span className="premium-auth-badge dark">Register</span>
                <h2>Create Account</h2>
                <p>Fill in your information to get started</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-12">
                    <div className="premium-auth-field">
                      <label>Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="premium-auth-input"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="premium-auth-field">
                      <label>Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="premium-auth-input"
                        placeholder="Enter email"
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="premium-auth-field">
                      <label>Phone Number</label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="premium-auth-input"
                        placeholder="Enter phone"
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="premium-auth-field">
                      <label>Password</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="premium-auth-input"
                        placeholder="Enter password"
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="premium-auth-field">
                      <label>Confirm Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="premium-auth-input"
                        placeholder="Confirm password"
                      />
                    </div>
                  </div>
                </div>

                <div className="premium-auth-row mt-3">
                  <label className="premium-auth-check">
                    <input
                      type="checkbox"
                      name="agree"
                      checked={formData.agree}
                      onChange={handleChange}
                    />
                    <span>I agree to the terms and privacy policy</span>
                  </label>
                </div>

                <button type="submit" className="premium-auth-primary-btn mt-3">
                  <i className="fa fa-user-plus"></i>
                  <span>Create Account</span>
                </button>
              </form>

              <p className="premium-auth-bottom-text">
                Already have an account?{" "}
                <Link to="/login" className="premium-auth-link">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Register;