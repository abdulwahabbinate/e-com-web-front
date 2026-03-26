import React, { useState } from "react";
import toast from "react-hot-toast";
import "./NewsletterSection.css";

const NewsletterSection = ({ section }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    toast.success("Subscribed successfully");
    setEmail("");
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

          <form className="newsletter-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder={section?.placeholder || "Enter your email address"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit">
              {section?.button_text || "Subscribe"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;