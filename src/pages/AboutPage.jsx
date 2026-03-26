import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Navbar, Footer } from "../components";
import useAboutPageContent from "../hooks/useAboutPageContent";
import "./AboutPage.css";

const mapFeatureIcon = (icon) => {
  const iconMap = {
    cilDiamond: "fa-diamond",
    cilTruck: "fa-truck",
    cilLoopCircular: "fa-refresh",
    cilRefresh: "fa-refresh",
    cilShieldAlt: "fa-shield",
    cilLockLocked: "fa-lock",
  };

  return iconMap[icon] || icon || "fa-check-circle";
};

const AboutPage = () => {
  const { content } = useAboutPageContent();

  const hero = content?.hero_section || {};
  const story = content?.story_section || {};
  const stats = content?.stats_section?.items || [];
  const featuresSection = content?.features_section || {};
  const cta = content?.cta_section || {};

  const features = useMemo(() => {
    return Array.isArray(featuresSection?.items)
      ? featuresSection.items.map((item, index) => ({
          id: index + 1,
          icon: mapFeatureIcon(item.icon),
          title: item.title || "",
          description: item.description || "",
        }))
      : [];
  }, [featuresSection]);

  return (
    <>
      <Navbar />

      <div className="premium-about-page">
        <section className="premium-about-hero">
          <div className="container">
            <div className="premium-about-hero-wrap">
              <div className="premium-about-hero-content">
                <span className="premium-about-badge">
                  {hero?.badge || "About Our Brand"}
                </span>

                <h1 className="premium-about-title">
                  {hero?.title || "A Premium Ecommerce Experience Built Around Modern Fashion"}
                </h1>

                <p className="premium-about-description">
                  {hero?.description ||
                    "We are building more than just an online store. Our goal is to create a polished shopping destination where modern design, premium product presentation, and customer trust come together in one seamless experience."}
                </p>

                <div className="premium-about-actions">
                  <Link
                    to={hero?.primary_button_link || "/product"}
                    className="premium-about-primary-btn"
                  >
                    {hero?.primary_button_text || "Explore Products"}
                  </Link>

                  <Link
                    to={hero?.secondary_button_link || "/contact"}
                    className="premium-about-secondary-btn"
                  >
                    {hero?.secondary_button_text || "Contact Us"}
                  </Link>
                </div>
              </div>

              <div className="premium-about-hero-card">
                <span className="premium-about-card-label">
                  {hero?.vision_badge || "Our Vision"}
                </span>

                <h4>{hero?.vision_title || "Style, Simplicity, and Premium Shopping"}</h4>

                <p>
                  {hero?.vision_description ||
                    "We design every page, every interaction, and every product experience to feel elegant, trustworthy, and future-ready for modern ecommerce brands."}
                </p>

                <div className="premium-about-mini-stats">
                  {(hero?.vision_stats || []).map((item, index) => (
                    <div key={index}>
                      <strong>{item.number}</strong>
                      <span>{item.label}</span>
                    </div>
                  ))}
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
                    src={story?.image}
                    alt={story?.title || "About our story"}
                    className="premium-about-image"
                  />
                </div>
              </div>

              <div className="col-lg-6">
                <div className="premium-about-section-head">
                  <span className="premium-about-badge light">
                    {story?.badge || "Our Story"}
                  </span>

                  <h2>
                    {story?.title || "Designed for Customers Who Value Premium Presentation"}
                  </h2>

                  <p>
                    {story?.paragraph_one ||
                      "Our platform is inspired by the world’s leading ecommerce experiences where clarity, product beauty, and usability are never compromised."}
                  </p>

                  <p>
                    {story?.paragraph_two ||
                      "From product cards to checkout, every detail is carefully crafted to create a smooth and professional customer journey. We believe premium design is not only about appearance, but also about trust, convenience, and consistency."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="premium-about-stats">
          <div className="container">
            <div className="premium-about-stats-grid">
              {stats.map((item, index) => (
                <div className="premium-about-stat-card" key={index}>
                  <h3>{item.number}</h3>
                  <p>{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="premium-about-features">
          <div className="container">
            <div className="products-section-header text-center mb-5">
              <span className="products-section-badge">
                {featuresSection?.badge || "Why Choose Us"}
              </span>

              <h2 className="products-section-title">
                {featuresSection?.title || "Built Like A Premium Ecommerce Brand"}
              </h2>

              <p className="products-section-subtitle mb-0">
                {featuresSection?.description ||
                  "Everything is designed to make the shopping experience clean, elegant, and reliable on every device."}
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
                <span className="premium-about-badge">
                  {cta?.badge || "Start Shopping"}
                </span>

                <h2>
                  {cta?.title || "Discover the next level of premium online shopping"}
                </h2>

                <p>
                  {cta?.description ||
                    "Browse our curated collection and enjoy a fashion-first ecommerce experience designed with modern customers in mind."}
                </p>
              </div>

              <div className="premium-about-cta-actions">
                <Link
                  to={cta?.primary_button_link || "/product"}
                  className="premium-about-primary-btn light"
                >
                  {cta?.primary_button_text || "Shop Now"}
                </Link>

                <Link
                  to={cta?.secondary_button_link || "/contact"}
                  className="premium-about-secondary-btn light"
                >
                  {cta?.secondary_button_text || "Get in Touch"}
                </Link>
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