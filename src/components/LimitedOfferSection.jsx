import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./LimitedOfferSection.css";

const fallbackImage =
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200&auto=format&fit=crop";

const LimitedOfferSection = ({ section }) => {
  const targetDate = useMemo(() => {
    if (section?.offer_end_date) {
      const parsed = new Date(section.offer_end_date);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed;
      }
    }

    const future = new Date();
    future.setDate(future.getDate() + 5);
    future.setHours(23, 59, 59, 999);
    return future;
  }, [section]);

  const getTimeLeft = () => {
    const now = new Date().getTime();
    const distance = targetDate.getTime() - now;

    if (distance <= 0) {
      return { days: "00", hours: "00", minutes: "00", seconds: "00" };
    }

    const days = String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(
      2,
      "0"
    );
    const hours = String(
      Math.floor((distance / (1000 * 60 * 60)) % 24)
    ).padStart(2, "0");
    const minutes = String(
      Math.floor((distance / (1000 * 60)) % 60)
    ).padStart(2, "0");
    const seconds = String(Math.floor((distance / 1000) % 60)).padStart(2, "0");

    return { days, hours, minutes, seconds };
  };

  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    setTimeLeft(getTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <section className="limited-offer-section">
      <div className="container">
        <div className="limited-offer-card">
          <div className="limited-offer-content">
            <span className="limited-offer-badge">
              {section?.badge || "Limited Time Offer"}
            </span>

            <h2>{section?.title || "Premium Picks At Special Prices"}</h2>

            <p>
              {section?.description ||
                "Don’t miss this curated offer on selected styles crafted to elevate your everyday wardrobe."}
            </p>

            <div className="limited-offer-timer">
              <div className="limited-offer-time-box">
                <strong>{timeLeft.days}</strong>
                <span>Days</span>
              </div>
              <div className="limited-offer-time-box">
                <strong>{timeLeft.hours}</strong>
                <span>Hours</span>
              </div>
              <div className="limited-offer-time-box">
                <strong>{timeLeft.minutes}</strong>
                <span>Minutes</span>
              </div>
              <div className="limited-offer-time-box">
                <strong>{timeLeft.seconds}</strong>
                <span>Seconds</span>
              </div>
            </div>

            <Link
              to={section?.button_link || "/product"}
              className="limited-offer-btn"
            >
              {section?.button_text || "Shop Limited Offer"}
            </Link>
          </div>

          <div className="limited-offer-image-wrap">
            <img
              src={section?.image || fallbackImage}
              alt={section?.title || "Limited offer"}
              className="limited-offer-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LimitedOfferSection;