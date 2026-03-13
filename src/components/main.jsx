import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Main.css";

const sliderData = [
  {
    id: 1,
    badge: "New Season",
    title: "Premium Fashion For Everyday Style",
    description:
      "Discover curated apparel, timeless essentials, and modern statement pieces crafted for a premium shopping experience.",
    primaryBtn: "Shop Collection",
    primaryLink: "/product",
    secondaryBtn: "Explore Premium T-Shirts",
    secondaryLink: "/product?category=premium-tshirts",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80",
    accent: "STYLE DROP",
  },
  {
    id: 2,
    badge: "Trending Now",
    title: "Minimal Looks With Luxury Details",
    description:
      "Upgrade your wardrobe with modern silhouettes, refined textures, and a clean premium aesthetic that matches your brand theme.",
    primaryBtn: "Shop New Arrivals",
    primaryLink: "/product?search=premium",
    secondaryBtn: "Browse Jeans",
    secondaryLink: "/product?category=jeans",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80",
    accent: "CURATED EDIT",
  },
  {
    id: 3,
    badge: "Exclusive Picks",
    title: "Build Your Signature Seasonal Collection",
    description:
      "From classic staples to premium statement pieces, shop a polished collection designed for fashion-first ecommerce stores.",
    primaryBtn: "Shop Summer Edit",
    primaryLink: "/product?category=summer-tshirts",
    secondaryBtn: "View Wishlist",
    secondaryLink: "/wishlist",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
    accent: "LIMITED STYLE",
  },
];

const Main = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % sliderData.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index) => {
    setActiveSlide(index);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? sliderData.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % sliderData.length);
  };

  return (
    <section className="premium-hero-section">
      <div className="container">
        <div className="premium-hero-slider">
          {sliderData.map((slide, index) => (
            <div
              key={slide.id}
              className={`premium-hero-slide ${index === activeSlide ? "active" : ""}`}
            >
              <div className="premium-hero-content">
                <span className="premium-hero-badge">{slide.badge}</span>
                <h1 className="premium-hero-title">{slide.title}</h1>
                <p className="premium-hero-description">{slide.description}</p>

                <div className="premium-hero-actions">
                  <Link to={slide.primaryLink} className="premium-hero-primary-btn">
                    {slide.primaryBtn}
                  </Link>
                  <Link to={slide.secondaryLink} className="premium-hero-secondary-btn">
                    {slide.secondaryBtn}
                  </Link>
                </div>
              </div>

              <div className="premium-hero-visual">
                <div className="premium-hero-image-wrap">
                  <img src={slide.image} alt={slide.title} className="premium-hero-image" />
                  <div className="premium-hero-floating-card">
                    <span>{slide.accent}</span>
                    <strong>Premium Ecommerce Theme</strong>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            className="premium-hero-arrow premium-hero-arrow-left"
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <i className="fa fa-angle-left"></i>
          </button>

          <button
            type="button"
            className="premium-hero-arrow premium-hero-arrow-right"
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <i className="fa fa-angle-right"></i>
          </button>
        </div>

        <div className="premium-hero-dots">
          {sliderData.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              className={`premium-hero-dot ${index === activeSlide ? "active" : ""}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Main;