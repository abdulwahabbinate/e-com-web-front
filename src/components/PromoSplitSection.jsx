import React from "react";
import { Link } from "react-router-dom";
import "./PromoSplitSection.css";

const promoCards = [
  {
    id: 1,
    badge: "New Season",
    title: "Refined Styles For Everyday Wear",
    description:
      "Discover premium essentials, elevated fits, and clean silhouettes designed for modern wardrobes.",
    buttonText: "Shop Collection",
    buttonLink: "/product",
    theme: "dark",
    image:
      "https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    badge: "Wholesale",
    title: "Bulk Orders. Better Margins. Premium Picks.",
    description:
      "Explore curated wholesale-ready collections with polished quality, strong value, and modern appeal.",
    buttonText: "Explore Deals",
    buttonLink: "/product",
    theme: "light",
    image:
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1200&auto=format&fit=crop",
  },
];

const PromoSplitSection = () => {
  return (
    <section className="promo-split-section">
      <div className="container">
        <div className="promo-split-grid">
          {promoCards.map((card) => (
            <div
              key={card.id}
              className={`promo-split-card promo-split-card-${card.theme}`}
            >
              <div className="promo-split-content">
                <span className="promo-split-badge">{card.badge}</span>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                <Link to={card.buttonLink} className="promo-split-btn">
                  {card.buttonText}
                </Link>
              </div>

              <div className="promo-split-image-wrap">
                <img src={card.image} alt={card.title} className="promo-split-image" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoSplitSection;