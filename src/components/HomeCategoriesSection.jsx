import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { API_ENDPOINTS } from "../config/api";
import "./HomeCategoriesSection.css";

const HomeCategoriesSection = () => {
  const [menuSections, setMenuSections] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchMenuCategories = async () => {
      try {
        setLoading(true);

        const response = await fetch(API_ENDPOINTS.categoriesMenu);
        const result = await response.json();

        if (!response.ok || result?.status !== 1) {
          throw new Error(result?.message || "Failed to fetch category menu");
        }

        if (isMounted) {
          setMenuSections(Array.isArray(result?.data) ? result.data : []);
        }
      } catch (error) {
        console.log("Home menu categories fetch error:", error.message);
        if (isMounted) {
          setMenuSections([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMenuCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const buildGroupViewAllUrl = (group) => {
    const slugs = (group.children || [])
      .map((item) => item.slug)
      .filter(Boolean)
      .join(",");

    return `/product${slugs ? `?categories=${slugs}` : ""}`;
  };

  return (
    <section className="home-categories-section py-4">
      <div className="container">
        <div className="products-section-header text-center mb-4">
          <span className="products-section-badge">Shop by Category</span>
          <h2 className="products-section-title">Browse Premium Collections</h2>
          <p className="products-section-subtitle mb-0">
            Explore curated category groups designed around your storefront menu
          </p>
        </div>

        {loading ? (
          <div className="home-category-skeleton-grid">
            {[1, 2].map((section) => (
              <div key={section}>
                <Skeleton height={260} style={{ borderRadius: "28px" }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="home-category-sections">
            {menuSections.map((section) => (
              <div className="home-category-block" key={section.id}>
                <div className="home-category-block-head">
                  <div className="home-category-block-icon">{section.icon}</div>

                  <div className="home-category-block-copy">
                    <span className="home-category-block-chip">{section.title}</span>
                    <h3>{section.title} Collection</h3>
                    <p>{section.description}</p>
                  </div>
                </div>

                <div className="home-category-groups-grid">
                  {section.children.map((group) => (
                    <div key={group.id} className="home-category-group-card">
                      <div className="home-category-group-top">
                        <div>
                          <span className="home-category-group-label">Group</span>
                          <h4>{group.title}</h4>
                        </div>

                        <Link
                          to={buildGroupViewAllUrl(group)}
                          className="home-category-group-viewall"
                        >
                          View All
                        </Link>
                      </div>

                      <div className="home-category-links">
                        {group.children.map((item) => (
                          <Link
                            key={item.id}
                            to={`/product?category=${item.slug}`}
                            className="home-category-link-card"
                          >
                            <div className="home-category-link-image-wrap">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="home-category-link-image"
                                />
                              ) : (
                                <div className="home-category-link-fallback">
                                  <i className="fa fa-tags"></i>
                                </div>
                              )}
                            </div>

                            <div className="home-category-link-content">
                              <h5>{item.title}</h5>
                              <p>
                                {item.description?.trim()
                                  ? item.description
                                  : "Explore premium products in this collection."}
                              </p>

                              <span className="home-category-link-action">
                                Explore
                                <i className="fa fa-arrow-right"></i>
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeCategoriesSection;