import { useEffect, useState } from "react";
import { homePageContentService } from "../services/homePageContentService";

const getFallbackData = () => ({
  slug: "home",
  hero_section: {
    badge: "NEW SEASON",
    slides: [
      {
        badge: "New Season",
        title: "Premium Fashion Collection 2026",
        description:
          "Discover premium quality styles crafted for a modern shopping experience.",
        button_text: "Shop Now",
        button_link: "/product",
        image:
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1400&auto=format&fit=crop",
      },
      {
        badge: "Trending Now",
        title: "Minimal Looks. Maximum Impact.",
        description:
          "Explore handpicked pieces with premium feel, modern cuts, and refined detail.",
        button_text: "Explore Collection",
        button_link: "/product",
        image:
          "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1400&auto=format&fit=crop",
      },
      {
        badge: "Exclusive Picks",
        title: "Curated Essentials For Everyday Style",
        description:
          "Shop elevated essentials and seasonal collections designed for comfort and class.",
        button_text: "Browse Products",
        button_link: "/product",
        image:
          "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1400&auto=format&fit=crop",
      },
    ],
  },
  promo_section: {
    left_card: {
      badge: "New Season",
      title: "Refined Styles For Everyday Wear",
      description:
        "Discover premium essentials, elevated fits, and clean silhouettes designed for modern wardrobes.",
      button_text: "Shop Collection",
      button_link: "/product",
      image:
        "https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=1200&auto=format&fit=crop",
    },
    right_card: {
      badge: "Wholesale",
      title: "Bulk Orders. Better Margins. Premium Picks.",
      description:
        "Explore curated wholesale-ready collections with polished quality, strong value, and modern appeal.",
      button_text: "Explore Deals",
      button_link: "/product",
      image:
        "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1200&auto=format&fit=crop",
    },
  },
  lookbook_section: {
    badge: "Instagram / Lookbook",
    title: "Shop The Look",
    description:
      "Discover premium-inspired styles curated for a refined and modern look.",
    items: [
      {
        title: "Urban Essentials",
        button_text: "Shop Now",
        button_link: "/product",
        image:
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
      },
      {
        title: "Minimal Layering",
        button_text: "Shop Now",
        button_link: "/product",
        image:
          "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1000&auto=format&fit=crop",
      },
      {
        title: "Modern Classics",
        button_text: "Shop Now",
        button_link: "/product",
        image:
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1000&auto=format&fit=crop",
      },
      {
        title: "Weekend Edit",
        button_text: "Shop Now",
        button_link: "/product",
        image:
          "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop",
      },
    ],
  },
  limited_offer_section: {
    badge: "Limited Time Offer",
    title: "Premium Picks At Special Prices",
    description:
      "Don’t miss this curated offer on selected styles crafted to elevate your everyday wardrobe.",
    button_text: "Shop Limited Offer",
    button_link: "/product",
    offer_end_date: null,
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200&auto=format&fit=crop",
  },
  features_section: {
    badge: "Why Choose Us",
    title: "Designed For A Better Shopping Experience",
    description:
      "Every detail is crafted to give your store a polished, trustworthy, and premium feel.",
    items: [
      {
        icon: "fa-truck",
        title: "Free Shipping",
        description:
          "Enjoy seamless delivery on premium orders with dependable service.",
      },
      {
        icon: "fa-undo",
        title: "Easy Returns",
        description:
          "Simple and stress-free returns designed for confident shopping.",
      },
      {
        icon: "fa-lock",
        title: "Secure Checkout",
        description:
          "Shop with confidence through a safe and protected payment flow.",
      },
      {
        icon: "fa-diamond",
        title: "Premium Quality",
        description:
          "Carefully selected products built around quality and modern style.",
      },
    ],
  },
  testimonial_section: {
    badge: "Testimonials",
    title: "What Customers Say",
    description:
      "Real feedback from shoppers who value clean design, quality, and style.",
    items: [
      {
        rating: 5,
        review:
          "The quality and overall presentation feel premium. The shopping experience is smooth and polished.",
        name: "Ayesha Khan",
        designation: "Verified Buyer",
      },
      {
        rating: 5,
        review:
          "Clean design, easy browsing, and products feel much more refined than a typical online store.",
        name: "Usman Ali",
        designation: "Regular Customer",
      },
      {
        rating: 5,
        review:
          "I loved the premium look of the site and the product selection feels curated and trustworthy.",
        name: "Hina Ahmed",
        designation: "Fashion Customer",
      },
    ],
  },
  newsletter_section: {
    badge: "Newsletter",
    title: "Get Updates On New Arrivals And Exclusive Offers",
    description:
      "Subscribe to stay connected with premium picks, fresh collections, and limited-time deals.",
    placeholder: "Enter your email address",
    button_text: "Subscribe",
  },
});

const useHomePageContent = () => {
  const [content, setContent] = useState(getFallbackData());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchContent = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await homePageContentService.getHomePageContent();

        if (isMounted && result?.data) {
          setContent({
            ...getFallbackData(),
            ...result.data,
          });
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to fetch home page content");
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

export default useHomePageContent;