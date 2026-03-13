import React, { useState } from "react";
import { Navbar, Footer } from "../components";
import "./ContactPage.css";

const contactCards = [
  {
    id: 1,
    icon: "fa-map-marker",
    title: "Our Location",
    text: "Karachi, Pakistan",
  },
  {
    id: 2,
    icon: "fa-phone",
    title: "Call Us",
    text: "+92 300 1234567",
  },
  {
    id: 3,
    icon: "fa-envelope-o",
    title: "Email Support",
    text: "support@styleecommerce.com",
  },
  {
    id: 4,
    icon: "fa-clock-o",
    title: "Working Hours",
    text: "Mon - Sat / 10:00 AM - 8:00 PM",
  },
];

const faqs = [
  {
    id: 1,
    question: "How quickly do you respond to support requests?",
    answer:
      "We aim to respond to most customer queries within 24 hours during working days.",
  },
  {
    id: 2,
    question: "Can I ask about orders, returns, or product details here?",
    answer:
      "Yes, you can contact us for product questions, delivery updates, returns, and general support.",
  },
  {
    id: 3,
    question: "Is this form ready for future API integration?",
    answer:
      "Yes, the form is built in a clean way so it can easily be connected to your backend later.",
  },
];

const ContactPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Contact Form Data:", formData);
    alert("Contact UI is ready. You can connect API later.");
  };

  return (
    <>
      <Navbar />

      <div className="premium-contact-page">
        <section className="premium-contact-hero">
          <div className="container">
            <div className="premium-contact-hero-wrap">
              <div className="premium-contact-hero-content">
                <span className="premium-contact-badge">Contact Us</span>
                <h1 className="premium-contact-title">
                  We’re Here To Help You With Every Step Of Your Shopping Experience
                </h1>
                <p className="premium-contact-description">
                  Whether you want product information, order help, return support,
                  or general assistance, our team is ready to help you with a fast
                  and professional response.
                </p>
              </div>

              <div className="premium-contact-hero-card">
                <span className="premium-contact-card-label">Customer Support</span>
                <h4>Fast, Professional, and Reliable Assistance</h4>
                <p>
                  Reach out to our team for anything related to products, orders,
                  shipping, or support. We are focused on making your ecommerce
                  experience smooth and trusted.
                </p>

                <div className="premium-contact-mini-points">
                  <div>
                    <strong>24h</strong>
                    <span>Typical Response Time</span>
                  </div>
                  <div>
                    <strong>7 Days</strong>
                    <span>Easy Return Assistance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="premium-contact-info-section">
          <div className="container">
            <div className="row g-4">
              {contactCards.map((item) => (
                <div className="col-sm-6 col-xl-3" key={item.id}>
                  <div className="premium-contact-info-card h-100">
                    <div className="premium-contact-info-icon">
                      <i className={`fa ${item.icon}`}></i>
                    </div>
                    <h5>{item.title}</h5>
                    <p>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="premium-contact-main-section">
          <div className="container">
            <div className="row g-4">
              <div className="col-lg-7">
                <div className="premium-contact-form-card">
                  <div className="premium-contact-section-head">
                    <span className="premium-contact-badge light">Send Message</span>
                    <h2>Let’s Talk About Your Needs</h2>
                    <p>
                      Fill out the form below and send us your message. This form is
                      UI-ready and can be connected to your backend API later.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="premium-contact-label">Full Name</label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          className="premium-contact-input"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="premium-contact-label">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="premium-contact-input"
                          placeholder="Enter your email"
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="premium-contact-label">Phone Number</label>
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="premium-contact-input"
                          placeholder="Enter your phone number"
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="premium-contact-label">Subject</label>
                        <input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="premium-contact-input"
                          placeholder="Enter subject"
                        />
                      </div>

                      <div className="col-12">
                        <label className="premium-contact-label">Message</label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          className="premium-contact-input premium-contact-textarea"
                          placeholder="Write your message here..."
                        ></textarea>
                      </div>

                      <div className="col-12">
                        <button type="submit" className="premium-contact-submit-btn">
                          <i className="fa fa-paper-plane-o"></i>
                          <span>Send Message</span>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              <div className="col-lg-5">
                <div className="premium-contact-side-card">
                  <div className="premium-contact-section-head">
                    <span className="premium-contact-badge light">Support Info</span>
                    <h2>Frequently Asked Questions</h2>
                    <p>
                      Here are some quick answers to common customer support
                      questions.
                    </p>
                  </div>

                  <div className="premium-contact-faq-list">
                    {faqs.map((item) => (
                      <div className="premium-contact-faq-item" key={item.id}>
                        <h6>{item.question}</h6>
                        <p>{item.answer}</p>
                      </div>
                    ))}
                  </div>

                  <div className="premium-contact-help-box">
                    <div className="premium-contact-help-icon">
                      <i className="fa fa-headphones"></i>
                    </div>
                    <div>
                      <h6>Need immediate help?</h6>
                      <p>
                        Contact our support team for quick assistance related to
                        orders, returns, and product questions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default ContactPage;