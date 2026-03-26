import React, { useMemo } from "react";
import "./TestimonialsSection.css";

const fallbackTestimonials = [
  {
    id: 1,
    rating: 5,
    name: "Ayesha Khan",
    designation: "Verified Buyer",
    review:
      "The quality and overall presentation feel premium. The shopping experience is smooth and polished.",
  },
  {
    id: 2,
    rating: 5,
    name: "Usman Ali",
    designation: "Regular Customer",
    review:
      "Clean design, easy browsing, and products feel much more refined than a typical online store.",
  },
  {
    id: 3,
    rating: 5,
    name: "Hina Ahmed",
    designation: "Fashion Customer",
    review:
      "I loved the premium look of the site and the product selection feels curated and trustworthy.",
  },
];

const TestimonialsSection = ({ section }) => {
  const testimonials = useMemo(() => {
    if (Array.isArray(section?.items) && section.items.length) {
      return section.items.map((item, index) => ({
        id: index + 1,
        rating: Number(item.rating || 5),
        name: item.name || "",
        designation: item.designation || "",
        review: item.review || "",
      }));
    }

    return fallbackTestimonials;
  }, [section]);

  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="testimonials-header text-center">
          <span className="testimonials-badge">
            {section?.badge || "Testimonials"}
          </span>
          <h2 className="testimonials-title">
            {section?.title || "What Customers Say"}
          </h2>
          <p className="testimonials-subtitle">
            {section?.description ||
              "Real feedback from shoppers who value clean design, quality, and style."}
          </p>
        </div>

        <div className="row g-4">
          {testimonials.map((item) => (
            <div key={item.id} className="col-lg-4 col-md-6 col-12">
              <div className="testimonials-card">
                <div className="testimonials-stars">
                  {Array.from({ length: item.rating || 5 }).map((_, index) => (
                    <i key={index} className="fa fa-star"></i>
                  ))}
                </div>
                <p>{item.review}</p>
                <div className="testimonials-user">
                  <strong>{item.name}</strong>
                  <span>{item.designation}</span>
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