import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar, Footer } from "../components";
import "./Auth.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
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
    console.log("Login Data:", formData);
    alert("Login UI is ready. You can connect API later.");
  };

  return (
    <>
      <Navbar />

      <div className="premium-auth-page">
        <div className="container py-4 py-lg-5">
          <div className="premium-auth-wrap">
            <div className="premium-auth-showcase">
              <span className="premium-auth-badge">Welcome Back</span>
              <h1>Sign in to continue your premium shopping experience</h1>
              <p>
                Access your account, manage your wishlist, review your orders,
                and continue shopping with a seamless and secure experience.
              </p>

              <div className="premium-auth-points">
                <div className="premium-auth-point">
                  <i className="fa fa-shopping-bag"></i>
                  <span>Track orders and manage your cart easily</span>
                </div>
                <div className="premium-auth-point">
                  <i className="fa fa-heart-o"></i>
                  <span>Save premium products in your wishlist</span>
                </div>
                <div className="premium-auth-point">
                  <i className="fa fa-shield"></i>
                  <span>Secure and modern account experience</span>
                </div>
              </div>
            </div>

            <div className="premium-auth-card">
              <div className="premium-auth-card-head">
                <span className="premium-auth-badge dark">Login</span>
                <h2>Sign In</h2>
                <p>Enter your details to access your account</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="premium-auth-field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="premium-auth-input"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="premium-auth-field">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="premium-auth-input"
                    placeholder="Enter your password"
                  />
                </div>

                <div className="premium-auth-row">
                  <label className="premium-auth-check">
                    <input
                      type="checkbox"
                      name="remember"
                      checked={formData.remember}
                      onChange={handleChange}
                    />
                    <span>Remember me</span>
                  </label>

                  <Link to="/" className="premium-auth-link">
                    Forgot Password?
                  </Link>
                </div>

                <button type="submit" className="premium-auth-primary-btn">
                  <i className="fa fa-sign-in"></i>
                  <span>Login</span>
                </button>
              </form>

              <div className="premium-auth-divider">
                <span>or continue with</span>
              </div>

              <div className="premium-auth-socials">
                <button type="button" className="premium-auth-social-btn">
                  <i className="fa fa-google"></i>
                  <span>Google</span>
                </button>

                <button type="button" className="premium-auth-social-btn">
                  <i className="fa fa-facebook"></i>
                  <span>Facebook</span>
                </button>
              </div>

              <p className="premium-auth-bottom-text">
                Don’t have an account?{" "}
                <Link to="/register" className="premium-auth-link">
                  Create Account
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

export default Login;