import React from "react";
import "./NewsletterSection.css";
import useNewsletterSubscribe from "../hooks/useNewsletterSubscribe";

const NewsletterSection = ({ section }) => {
  const { email, setEmail, loading, handleSubscribe } =
    useNewsletterSubscribe("homepage");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleSubscribe();
  };

  return (
    <section className="newsletter-section">
      <div className="container">
        <div className="newsletter-card">
          <div className="newsletter-content">
            <span className="newsletter-badge">
              {section?.badge || "Newsletter"}
            </span>

            <h2>
              {section?.title || "Get Updates On New Arrivals And Exclusive Offers"}
            </h2>

            <p>
              {section?.description ||
                "Subscribe to stay connected with premium picks, fresh collections, and limited-time deals."}
            </p>
          </div>

          <form className="newsletter-form" onSubmit={handleSubmit} noValidate>
            <input
              type="text"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              placeholder={section?.placeholder || "Enter your email address"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Subscribing..." : section?.button_text || "Subscribe"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;