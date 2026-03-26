import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./Hero.css";

const fallbackSlides = [
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
];

const Hero = ({ section }) => {
  const slides = useMemo(() => {
    const dbSlides = Array.isArray(section?.slides)
      ? section.slides
          .filter((item) => item?.title)
          .map((item, index) => ({
            id: index + 1,
            badge: item.badge || section?.badge || "New Season",
            title: item.title || "",
            description: item.description || "",
            buttonText: item.button_text || "Shop Now",
            buttonLink: item.button_link || "/product",
            image: item.image || fallbackSlides[0].image,
          }))
      : [];

    return dbSlides.length ? dbSlides : fallbackSlides;
  }, [section]);

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    setActiveSlide(0);
  }, [slides]);

  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [slides]);

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

            {slides.length > 1 && (
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
            )}
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