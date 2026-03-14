import React from "react";
import { Link } from "react-router-dom";
import "./LookbookSection.css";

const looks = [
  {
    id: 1,
    title: "Urban Essentials",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Minimal Layering",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Modern Classics",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Weekend Edit",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop",
  },
];

const LookbookSection = () => {
  return (
    <section className="lookbook-section">
      <div className="container">
        <div className="lookbook-header text-center">
          <span className="lookbook-badge">Instagram / Lookbook</span>
          <h2 className="lookbook-title">Shop The Look</h2>
          <p className="lookbook-subtitle">
            Discover premium-inspired styles curated for a refined and modern look.
          </p>
        </div>

        <div className="row g-4">
          {looks.map((item) => (
            <div key={item.id} className="col-lg-3 col-sm-6 col-12">
              <div className="lookbook-card">
                <img src={item.image} alt={item.title} className="lookbook-image" />
                <div className="lookbook-overlay">
                  <span>{item.title}</span>
                  <Link to="/product">Shop Now</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LookbookSection;