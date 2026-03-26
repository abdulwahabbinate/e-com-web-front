import React from "react";
import {
  Navbar,
  Footer,
  HomeProductsSection,
  HomeCategoriesSection,
  PromoSplitSection,
  LimitedOfferSection,
  WhyChooseUsSection,
  LookbookSection,
  TestimonialsSection,
  NewsletterSection,
} from "../components";
import Hero from "../components/Hero";
import useHomePageContent from "../hooks/useHomePageContent";

const Home = () => {
  const { content } = useHomePageContent();

  return (
    <>
      <Navbar />

      <Hero section={content?.hero_section} />
      <PromoSplitSection section={content?.promo_section} />
      <HomeCategoriesSection />
      <LimitedOfferSection section={content?.limited_offer_section} />

      <HomeProductsSection
        badge="Featured Collection"
        title="Featured Products"
        subtitle="Handpicked premium products curated for standout style"
        featuredOnly={true}
        limit={8}
      />

      <HomeProductsSection
        badge="New Arrivals"
        title="Latest Products"
        subtitle="Fresh premium styles added to the collection"
        featuredOnly={false}
        limit={8}
      />

      <WhyChooseUsSection section={content?.features_section} />
      <LookbookSection section={content?.lookbook_section} />
      <TestimonialsSection section={content?.testimonial_section} />
      <NewsletterSection section={content?.newsletter_section} />

      <Footer />
    </>
  );
};

export default Home;