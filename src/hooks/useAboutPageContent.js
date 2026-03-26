import { useEffect, useState } from "react";
import { aboutPageContentService } from "../services/aboutPageContentService";

const getFallbackData = () => ({
  slug: "about",
  hero_section: {
    badge: "About Our Brand",
    title: "A Premium Ecommerce Experience Built Around Modern Fashion",
    description:
      "We are building more than just an online store. Our goal is to create a polished shopping destination where modern design, premium product presentation, and customer trust come together in one seamless experience.",
    primary_button_text: "Explore Products",
    primary_button_link: "/product",
    secondary_button_text: "Contact Us",
    secondary_button_link: "/contact",
    vision_badge: "Our Vision",
    vision_title: "Style, Simplicity, and Premium Shopping",
    vision_description:
      "We design every page, every interaction, and every product experience to feel elegant, trustworthy, and future-ready for modern ecommerce brands.",
    vision_stats: [
      { number: "10K+", label: "Happy Shoppers" },
      { number: "250+", label: "Premium Products" },
    ],
  },
  story_section: {
    badge: "Our Story",
    title: "Designed for Customers Who Value Premium Presentation",
    paragraph_one:
      "Our platform is inspired by the world’s leading ecommerce experiences where clarity, product beauty, and usability are never compromised.",
    paragraph_two:
      "From product cards to checkout, every detail is carefully crafted to create a smooth and professional customer journey. We believe premium design is not only about appearance, but also about trust, convenience, and consistency.",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
  },
  stats_section: {
    items: [
      {
        number: "10K+",
        label: "Customers served with a premium shopping experience",
      },
      {
        number: "250+",
        label: "Curated products across modern fashion categories",
      },
      {
        number: "98%",
        label: "Customer satisfaction driven by trust and quality",
      },
      {
        number: "24/7",
        label: "Support-focused mindset for a better brand experience",
      },
    ],
  },
  features_section: {
    badge: "Why Choose Us",
    title: "Built Like A Premium Ecommerce Brand",
    description:
      "Everything is designed to make the shopping experience clean, elegant, and reliable on every device.",
    items: [
      {
        icon: "fa-diamond",
        title: "Premium Quality",
        description:
          "We focus on refined materials, modern aesthetics, and timeless product quality for a premium shopping experience.",
      },
      {
        icon: "fa-truck",
        title: "Fast Delivery",
        description:
          "Our streamlined process helps deliver your favorite products quickly, safely, and with complete order confidence.",
      },
      {
        icon: "fa-refresh",
        title: "Easy Returns",
        description:
          "Enjoy a smooth and transparent return process designed to make online shopping more reliable and stress-free.",
      },
      {
        icon: "fa-shield",
        title: "Secure Shopping",
        description:
          "From browsing to checkout, every part of the experience is designed with trust, safety, and usability in mind.",
      },
    ],
  },
  cta_section: {
    badge: "Start Shopping",
    title: "Discover the next level of premium online shopping",
    description:
      "Browse our curated collection and enjoy a fashion-first ecommerce experience designed with modern customers in mind.",
    primary_button_text: "Shop Now",
    primary_button_link: "/product",
    secondary_button_text: "Get in Touch",
    secondary_button_link: "/contact",
  },
});

const useAboutPageContent = () => {
  const [content, setContent] = useState(getFallbackData());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchContent = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await aboutPageContentService.getAboutPageContent();

        if (isMounted && result?.data) {
          setContent({
            ...getFallbackData(),
            ...result.data,
          });
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to fetch about page content");
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

export default useAboutPageContent;