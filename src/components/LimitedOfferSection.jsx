import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./LimitedOfferSection.css";

const LimitedOfferSection = () => {
  const targetDate = useMemo(() => {
    const future = new Date();
    future.setDate(future.getDate() + 5);
    future.setHours(23, 59, 59, 999);
    return future;
  }, []);

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
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="limited-offer-section">
      <div className="container">
        <div className="limited-offer-card">
          <div className="limited-offer-content">
            <span className="limited-offer-badge">Limited Time Offer</span>
            <h2>Premium Picks At Special Prices</h2>
            <p>
              Don’t miss this curated offer on selected styles crafted to elevate
              your everyday wardrobe.
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

            <Link to="/product" className="limited-offer-btn">
              Shop Limited Offer
            </Link>
          </div>

          <div className="limited-offer-image-wrap">
            <img
              src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200&auto=format&fit=crop"
              alt="Limited offer"
              className="limited-offer-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LimitedOfferSection;