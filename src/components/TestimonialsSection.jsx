import React from "react";
import "./TestimonialsSection.css";

const testimonials = [
  {
    id: 1,
    name: "Ayesha Khan",
    role: "Verified Buyer",
    review:
      "The quality and overall presentation feel premium. The shopping experience is smooth and polished.",
  },
  {
    id: 2,
    name: "Usman Ali",
    role: "Regular Customer",
    review:
      "Clean design, easy browsing, and products feel much more refined than a typical online store.",
  },
  {
    id: 3,
    name: "Hina Ahmed",
    role: "Fashion Customer",
    review:
      "I loved the premium look of the site and the product selection feels curated and trustworthy.",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="testimonials-header text-center">
          <span className="testimonials-badge">Testimonials</span>
          <h2 className="testimonials-title">What Customers Say</h2>
          <p className="testimonials-subtitle">
            Real feedback from shoppers who value clean design, quality, and style.
          </p>
        </div>

        <div className="row g-4">
          {testimonials.map((item) => (
            <div key={item.id} className="col-lg-4 col-md-6 col-12">
              <div className="testimonials-card">
                <div className="testimonials-stars">
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                </div>
                <p>{item.review}</p>
                <div className="testimonials-user">
                  <strong>{item.name}</strong>
                  <span>{item.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;