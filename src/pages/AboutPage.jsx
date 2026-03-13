import React from "react";
import { Navbar, Footer } from "../components";
import "./AboutPage.css";

const features = [
  {
    id: 1,
    icon: "fa-diamond",
    title: "Premium Quality",
    description:
      "We focus on refined materials, modern aesthetics, and timeless product quality for a premium shopping experience.",
  },
  {
    id: 2,
    icon: "fa-truck",
    title: "Fast Delivery",
    description:
      "Our streamlined process helps deliver your favorite products quickly, safely, and with complete order confidence.",
  },
  {
    id: 3,
    icon: "fa-refresh",
    title: "Easy Returns",
    description:
      "Enjoy a smooth and transparent return process designed to make online shopping more reliable and stress-free.",
  },
  {
    id: 4,
    icon: "fa-shield",
    title: "Secure Shopping",
    description:
      "From browsing to checkout, every part of the experience is designed with trust, safety, and usability in mind.",
  },
];

const AboutPage = () => {
  return (
    <>
      <Navbar />

      <div className="premium-about-page">
        <section className="premium-about-hero">
          <div className="container">
            <div className="premium-about-hero-wrap">
              <div className="premium-about-hero-content">
                <span className="premium-about-badge">About Our Brand</span>
                <h1 className="premium-about-title">
                  A Premium Ecommerce Experience Built Around Modern Fashion
                </h1>
                <p className="premium-about-description">
                  We are building more than just an online store. Our goal is to
                  create a polished shopping destination where modern design,
                  premium product presentation, and customer trust come together
                  in one seamless experience.
                </p>

                <div className="premium-about-actions">
                  <a href="/product" className="premium-about-primary-btn">
                    Explore Products
                  </a>
                  <a href="/contact" className="premium-about-secondary-btn">
                    Contact Us
                  </a>
                </div>
              </div>

              <div className="premium-about-hero-card">
                <span className="premium-about-card-label">Our Vision</span>
                <h4>Style, Simplicity, and Premium Shopping</h4>
                <p>
                  We design every page, every interaction, and every product
                  experience to feel elegant, trustworthy, and future-ready for
                  modern ecommerce brands.
                </p>

                <div className="premium-about-mini-stats">
                  <div>
                    <strong>10K+</strong>
                    <span>Happy Shoppers</span>
                  </div>
                  <div>
                    <strong>250+</strong>
                    <span>Premium Products</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="premium-about-story">
          <div className="container">
            <div className="row g-4 align-items-center">
              <div className="col-lg-6">
                <div className="premium-about-image-card">
                  <img
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80"
                    alt="Premium fashion store"
                    className="premium-about-image"
                  />
                </div>
              </div>

              <div className="col-lg-6">
                <div className="premium-about-section-head">
                  <span className="premium-about-badge light">Our Story</span>
                  <h2>Designed for Customers Who Value Premium Presentation</h2>
                  <p>
                    Our platform is inspired by the world’s leading ecommerce
                    experiences where clarity, product beauty, and usability are
                    never compromised.
                  </p>
                  <p>
                    From product cards to checkout, every detail is carefully
                    crafted to create a smooth and professional customer journey.
                    We believe premium design is not only about appearance, but
                    also about trust, convenience, and consistency.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="premium-about-stats">
          <div className="container">
            <div className="premium-about-stats-grid">
              <div className="premium-about-stat-card">
                <h3>10K+</h3>
                <p>Customers served with a premium shopping experience</p>
              </div>

              <div className="premium-about-stat-card">
                <h3>250+</h3>
                <p>Curated products across modern fashion categories</p>
              </div>

              <div className="premium-about-stat-card">
                <h3>98%</h3>
                <p>Customer satisfaction driven by trust and quality</p>
              </div>

              <div className="premium-about-stat-card">
                <h3>24/7</h3>
                <p>Support-focused mindset for a better brand experience</p>
              </div>
            </div>
          </div>
        </section>

        <section className="premium-about-features">
          <div className="container">
            <div className="products-section-header text-center mb-5">
              <span className="products-section-badge">Why Choose Us</span>
              <h2 className="products-section-title">
                Built Like A Premium Ecommerce Brand
              </h2>
              <p className="products-section-subtitle mb-0">
                Everything is designed to make the shopping experience clean,
                elegant, and reliable on every device.
              </p>
            </div>

            <div className="row g-4">
              {features.map((item) => (
                <div className="col-md-6 col-xl-3" key={item.id}>
                  <div className="premium-about-feature-card h-100">
                    <div className="premium-about-feature-icon">
                      <i className={`fa ${item.icon}`}></i>
                    </div>
                    <h5>{item.title}</h5>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="premium-about-cta">
          <div className="container">
            <div className="premium-about-cta-card">
              <div>
                <span className="premium-about-badge">Start Shopping</span>
                <h2>Discover the next level of premium online shopping</h2>
                <p>
                  Browse our curated collection and enjoy a fashion-first
                  ecommerce experience designed with modern customers in mind.
                </p>
              </div>

              <div className="premium-about-cta-actions">
                <a href="/product" className="premium-about-primary-btn light">
                  Shop Now
                </a>
                <a href="/contact" className="premium-about-secondary-btn light">
                  Get in Touch
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default AboutPage;