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

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <PromoSplitSection />
      <HomeCategoriesSection />
      <LimitedOfferSection />
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

      <WhyChooseUsSection />
      <LookbookSection />
      <TestimonialsSection />
      <NewsletterSection />

      <Footer />
    </>
  );
};

export default Home;
