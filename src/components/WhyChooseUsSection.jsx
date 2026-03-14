import React from "react";
import "./WhyChooseUsSection.css";

const features = [
  {
    id: 1,
    icon: "fa-truck",
    title: "Free Shipping",
    description: "Enjoy seamless delivery on premium orders with dependable service.",
  },
  {
    id: 2,
    icon: "fa-undo",
    title: "Easy Returns",
    description: "Simple and stress-free returns designed for confident shopping.",
  },
  {
    id: 3,
    icon: "fa-lock",
    title: "Secure Checkout",
    description: "Shop with confidence through a safe and protected payment flow.",
  },
  {
    id: 4,
    icon: "fa-diamond",
    title: "Premium Quality",
    description: "Carefully selected products built around quality and modern style.",
  },
];

const WhyChooseUsSection = () => {
  return (
    <section className="why-choose-section">
      <div className="container">
        <div className="why-choose-header text-center">
          <span className="why-choose-badge">Why Choose Us</span>
          <h2 className="why-choose-title">Designed For A Better Shopping Experience</h2>
          <p className="why-choose-subtitle">
            Every detail is crafted to give your store a polished, trustworthy,
            and premium feel.
          </p>
        </div>

        <div className="row g-4">
          {features.map((item) => (
            <div key={item.id} className="col-lg-3 col-md-6 col-12">
              <div className="why-choose-card">
                <div className="why-choose-icon">
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
  );
};

export default WhyChooseUsSection;