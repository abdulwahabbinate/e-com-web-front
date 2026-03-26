import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Navbar, Footer } from "../components";
import useContactPageContent from "../hooks/useContactPageContent";
import { contactMessageService } from "../services/contactMessageService";
import "./ContactPage.css";

const mapContactIcon = (icon) => {
  const iconMap = {
    cilLocationPin: "fa-map-marker",
    cilPhone: "fa-phone",
    cilEnvelopeOpen: "fa-envelope-o",
    cilClock: "fa-clock-o",
    cilHeadphones: "fa-headphones",
  };

  return iconMap[icon] || icon || "fa-circle";
};

const ContactPage = () => {
  const { content } = useContactPageContent();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const hero = content?.hero_section || {};
  const infoSection = content?.info_section || {};
  const formSection = content?.form_section || {};
  const faqSection = content?.faq_section || {};
  const supportCta = content?.support_cta_section || {};

  const contactCards = useMemo(() => {
    return Array.isArray(infoSection?.items)
      ? infoSection.items.map((item, index) => ({
          id: index + 1,
          icon: mapContactIcon(item.icon),
          title: item.title || "",
          text: item.value || "",
        }))
      : [];
  }, [infoSection]);

  const faqs = useMemo(() => {
    return Array.isArray(faqSection?.items)
      ? faqSection.items.map((item, index) => ({
          id: index + 1,
          question: item.question || "",
          answer: item.answer || "",
        }))
      : [];
  }, [faqSection]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    if (!formData.message.trim()) {
      toast.error("Please enter your message");
      return;
    }

    try {
      setSubmitting(true);

      await contactMessageService.submitContactMessage({
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      });

      toast.success("Your message has been sent successfully");

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      const backendErrors = error?.response?.errors || [];

      if (Array.isArray(backendErrors) && backendErrors.length > 0) {
        toast.error(backendErrors[0]?.message || "Validation failed");
      } else {
        toast.error(error?.message || "Failed to send message");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="premium-contact-page">
        <section className="premium-contact-hero">
          <div className="container">
            <div className="premium-contact-hero-wrap">
              <div className="premium-contact-hero-content">
                <span className="premium-contact-badge">
                  {hero?.badge || "Contact Us"}
                </span>

                <h1 className="premium-contact-title">
                  {hero?.title ||
                    "We’re Here To Help You With Every Step Of Your Shopping Experience"}
                </h1>

                <p className="premium-contact-description">
                  {hero?.description ||
                    "Whether you want product information, order help, return support, or general assistance, our team is ready to help you with a fast and professional response."}
                </p>
              </div>

              <div className="premium-contact-hero-card">
                <span className="premium-contact-card-label">
                  {hero?.support_badge || "Customer Support"}
                </span>

                <h4>
                  {hero?.support_title ||
                    "Fast, Professional, and Reliable Assistance"}
                </h4>

                <p>
                  {hero?.support_description ||
                    "Reach out to our team for anything related to products, orders, shipping, or support. We are focused on making your ecommerce experience smooth and trusted."}
                </p>

                <div className="premium-contact-mini-points">
                  {(hero?.support_stats || []).map((item, index) => (
                    <div key={index}>
                      <strong>{item.number}</strong>
                      <span>{item.label}</span>
                    </div>
                  ))}
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
                    <span className="premium-contact-badge light">
                      {formSection?.badge || "Send Message"}
                    </span>

                    <h2>{formSection?.title || "Let’s Talk About Your Needs"}</h2>

                    <p>
                      {formSection?.description ||
                        "Fill out the form below and send us your message. This form is UI-ready and can be connected to your backend API later."}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="premium-contact-label">
                          {formSection?.full_name_label || "Full Name"}
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          className="premium-contact-input"
                          placeholder={
                            formSection?.full_name_placeholder || "Enter your full name"
                          }
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="premium-contact-label">
                          {formSection?.email_label || "Email Address"}
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="premium-contact-input"
                          placeholder={
                            formSection?.email_placeholder || "Enter your email"
                          }
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="premium-contact-label">
                          {formSection?.phone_label || "Phone Number"}
                        </label>
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="premium-contact-input"
                          placeholder={
                            formSection?.phone_placeholder || "Enter your phone number"
                          }
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="premium-contact-label">
                          {formSection?.subject_label || "Subject"}
                        </label>
                        <input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="premium-contact-input"
                          placeholder={
                            formSection?.subject_placeholder || "Enter subject"
                          }
                        />
                      </div>

                      <div className="col-12">
                        <label className="premium-contact-label">
                          {formSection?.message_label || "Message"}
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          className="premium-contact-input premium-contact-textarea"
                          placeholder={
                            formSection?.message_placeholder || "Write your message here..."
                          }
                        ></textarea>
                      </div>

                      <div className="col-12">
                        <button
                          type="submit"
                          className="premium-contact-submit-btn"
                          disabled={submitting}
                        >
                          <i className="fa fa-paper-plane-o"></i>
                          <span>
                            {submitting
                              ? "Sending..."
                              : formSection?.submit_button_text || "Send Message"}
                          </span>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              <div className="col-lg-5">
                <div className="premium-contact-side-card">
                  <div className="premium-contact-section-head">
                    <span className="premium-contact-badge light">
                      {faqSection?.badge || "Support Info"}
                    </span>

                    <h2>
                      {faqSection?.title || "Frequently Asked Questions"}
                    </h2>

                    <p>
                      {faqSection?.description ||
                        "Here are some quick answers to common customer support questions."}
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
                      <i className={`fa ${mapContactIcon(supportCta?.icon || "fa-headphones")}`}></i>
                    </div>
                    <div>
                      <h6>{supportCta?.title || "Need immediate help?"}</h6>
                      <p>
                        {supportCta?.description ||
                          "Contact our support team for quick assistance related to orders, returns, and product questions."}
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