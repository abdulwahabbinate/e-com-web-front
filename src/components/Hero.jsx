import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Hero.css";

const slides = [
  {
    id: 1,
    badge: "New Season",
    title: "Premium Fashion Collection 2026",
    description:
      "Discover premium quality styles crafted for a modern shopping experience.",
    buttonText: "Shop Now",
    buttonLink: "/product",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: 2,
    badge: "Trending Now",
    title: "Minimal Looks. Maximum Impact.",
    description:
      "Explore handpicked pieces with premium feel, modern cuts, and refined detail.",
    buttonText: "Explore Collection",
    buttonLink: "/product",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: 3,
    badge: "Exclusive Picks",
    title: "Curated Essentials For Everyday Style",
    description:
      "Shop elevated essentials and seasonal collections designed for comfort and class.",
    buttonText: "Browse Products",
    buttonLink: "/product",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1400&auto=format&fit=crop",
  },
];

const Hero = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const currentSlide = slides[activeSlide];

  return (
    <section className="premium-hero">
      <div className="container">
        <div className="premium-hero-card">
          <div className="premium-hero-content">
            <span className="premium-hero-badge">{currentSlide.badge}</span>
            <h1>{currentSlide.title}</h1>
            <p>{currentSlide.description}</p>

            <div className="premium-hero-actions">
              <Link to={currentSlide.buttonLink} className="premium-hero-btn">
                {currentSlide.buttonText}
              </Link>
            </div>

            <div className="premium-hero-dots">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  className={`premium-hero-dot ${index === activeSlide ? "active" : ""}`}
                  onClick={() => setActiveSlide(index)}
                />
              ))}
            </div>
          </div>

          <div className="premium-hero-image-wrap">
            <img
              src={currentSlide.image}
              alt={currentSlide.title}
              className="premium-hero-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;