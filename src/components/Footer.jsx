import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const footerLinks = {
  shop: [
    { label: "All Products", path: "/product" },
    { label: "Premium T-Shirts", path: "/product?category=premium-tshirts" },
    { label: "Jeans", path: "/product?category=jeans" },
    { label: "Summer Collection", path: "/product?category=summer-tshirts" },
  ],
  support: [
    { label: "Contact Us", path: "/contact" },
    { label: "About Us", path: "/about" },
    { label: "Wishlist", path: "/wishlist" },
    { label: "Cart", path: "/cart" },
  ],
  policy: [
    { label: "Shipping Policy", path: "/" },
    { label: "Return Policy", path: "/" },
    { label: "Privacy Policy", path: "/" },
    { label: "Terms & Conditions", path: "/" },
  ],
};

const Footer = () => {
  return (
    <footer className="premium-footer">
      <div className="container">
        <div className="premium-footer-top">
          <div className="premium-footer-brand-col">
            <div className="premium-footer-brand">
              <span className="premium-footer-badge">STYLE</span>
              <h3>E-Commerce</h3>
              <p>Modern Fashion Store</p>
            </div>

            <p className="premium-footer-description">
              Premium ecommerce experience with clean design, refined product
              presentation, and modern shopping flows built for fashion-first
              brands.
            </p>

            <div className="premium-footer-newsletter">
              <h6>Join Our Newsletter</h6>
              <form className="premium-footer-form">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="premium-footer-input"
                />
                <button type="button" className="premium-footer-submit">
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div className="premium-footer-links-grid">
            <div className="premium-footer-links-col">
              <h5>Shop</h5>
              <ul>
                {footerLinks.shop.map((item) => (
                  <li key={item.label}>
                    <Link to={item.path}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="premium-footer-links-col">
              <h5>Support</h5>
              <ul>
                {footerLinks.support.map((item) => (
                  <li key={item.label}>
                    <Link to={item.path}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="premium-footer-links-col">
              <h5>Policies</h5>
              <ul>
                {footerLinks.policy.map((item) => (
                  <li key={item.label}>
                    <Link to={item.path}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="premium-footer-links-col">
              <h5>Contact</h5>
              <ul className="premium-footer-contact-list">
                <li>
                  <span className="premium-footer-contact-icon">
                    <i className="fa fa-map-marker"></i>
                  </span>
                  <span>Karachi, Pakistan</span>
                </li>
                <li>
                  <span className="premium-footer-contact-icon">
                    <i className="fa fa-phone"></i>
                  </span>
                  <span>+92 300 1234567</span>
                </li>
                <li>
                  <span className="premium-footer-contact-icon">
                    <i className="fa fa-envelope-o"></i>
                  </span>
                  <span>support@styleecommerce.com</span>
                </li>
              </ul>

              <div className="premium-footer-socials">
                <a href="/" aria-label="Facebook">
                  <i className="fa fa-facebook"></i>
                </a>
                <a href="/" aria-label="Instagram">
                  <i className="fa fa-instagram"></i>
                </a>
                <a href="/" aria-label="Twitter">
                  <i className="fa fa-twitter"></i>
                </a>
                <a href="/" aria-label="Pinterest">
                  <i className="fa fa-pinterest-p"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="premium-footer-bottom">
          <p className="mb-0">
            © {new Date().getFullYear()} E-Commerce. All rights reserved.
          </p>

          <div className="premium-footer-payments">
            <span>Secure Payments</span>
            <div className="premium-payment-icons">
              <span>Visa</span>
              <span>Mastercard</span>
              <span>PayPal</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;