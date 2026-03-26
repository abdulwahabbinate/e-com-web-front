import { useEffect, useState } from "react";
import { contactPageContentService } from "../services/contactPageService";

const getFallbackData = () => ({
  slug: "contact",
  hero_section: {
    badge: "Contact Us",
    title: "We’re Here To Help You With Every Step Of Your Shopping Experience",
    description:
      "Whether you want product information, order help, return support, or general assistance, our team is ready to help you with a fast and professional response.",
    support_badge: "Customer Support",
    support_title: "Fast, Professional, and Reliable Assistance",
    support_description:
      "Reach out to our team for anything related to products, orders, shipping, or support. We are focused on making your ecommerce experience smooth and trusted.",
    support_stats: [
      { number: "24h", label: "Typical Response Time" },
      { number: "7 Days", label: "Easy Return Assistance" },
    ],
  },
  info_section: {
    items: [
      {
        icon: "fa-map-marker",
        title: "Our Location",
        value: "Karachi, Pakistan",
      },
      {
        icon: "fa-phone",
        title: "Call Us",
        value: "+92 300 1234567",
      },
      {
        icon: "fa-envelope-o",
        title: "Email Support",
        value: "support@styleecommerce.com",
      },
      {
        icon: "fa-clock-o",
        title: "Working Hours",
        value: "Mon - Sat / 10:00 AM - 8:00 PM",
      },
    ],
  },
  form_section: {
    badge: "Send Message",
    title: "Let’s Talk About Your Needs",
    description:
      "Fill out the form below and send us your message. This form is UI-ready and can be connected to your backend API later.",
    full_name_label: "Full Name",
    full_name_placeholder: "Enter your full name",
    email_label: "Email Address",
    email_placeholder: "Enter your email",
    phone_label: "Phone Number",
    phone_placeholder: "Enter your phone number",
    subject_label: "Subject",
    subject_placeholder: "Enter subject",
    message_label: "Message",
    message_placeholder: "Write your message here...",
    submit_button_text: "Send Message",
  },
  faq_section: {
    badge: "Support Info",
    title: "Frequently Asked Questions",
    description:
      "Here are some quick answers to common customer support questions.",
    items: [
      {
        question: "How quickly do you respond to support requests?",
        answer:
          "We aim to respond to most customer queries within 24 hours during working days.",
      },
      {
        question: "Can I ask about orders, returns, or product details here?",
        answer:
          "Yes, you can contact us for product questions, delivery updates, returns, and general support.",
      },
      {
        question: "Is this form ready for future API integration?",
        answer:
          "Yes, the form is built in a clean way so it can easily be connected to your backend later.",
      },
    ],
  },
  support_cta_section: {
    icon: "fa-headphones",
    title: "Need immediate help?",
    description:
      "Contact our support team for quick assistance related to orders, returns, and product questions.",
  },
});

const useContactPageContent = () => {
  const [content, setContent] = useState(getFallbackData());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchContent = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await contactPageContentService.getContactPageContent();

        if (isMounted && result?.data) {
          setContent({
            ...getFallbackData(),
            ...result.data,
          });
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to fetch contact page content");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchContent();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    content,
    loading,
    error,
  };
};

export default useContactPageContent;