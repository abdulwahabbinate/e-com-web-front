import React, { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Navbar.css";
import { API_ENDPOINTS } from "../config/api";

const quickSuggestions = [
  "Premium T-Shirts",
  "Jeans",
  "Sports Caps",
  "Winter Shirts",
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = useSelector((state) => state.handleCart) || [];
  const wishlistItems = useSelector((state) => state.handleWishlist) || [];

  const navRef = useRef(null);
  const megaWrapperRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const openTimeoutRef = useRef(null);

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [openMobileCategory, setOpenMobileCategory] = useState(null);
  const [openMobileSubCategory, setOpenMobileSubCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [megaMenuTop, setMegaMenuTop] = useState(90);
  const [bridgeTop, setBridgeTop] = useState(88);
  const [miniCartOpen, setMiniCartOpen] = useState(false);

  const [productMenu, setProductMenu] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const cartCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + (item.qty || 1), 0);
  }, [cartItems]);

  const cartSubtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + Number(item.price || 0) * Number(item.qty || 1),
      0
    );
  }, [cartItems]);

  const wishlistCount = useMemo(() => wishlistItems.length, [wishlistItems]);

  const filteredSuggestions = useMemo(() => {
    if (!searchTerm.trim()) return quickSuggestions;
    return quickSuggestions.filter((item) =>
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  useEffect(() => {
    let isMounted = true;

    const fetchMenuCategories = async () => {
      try {
        setCategoriesLoading(true);

        const response = await fetch(API_ENDPOINTS.categoriesMenu);
        const result = await response.json();

        if (!response.ok || result?.status !== 1) {
          throw new Error(result?.message || "Failed to fetch categories");
        }

        if (isMounted) {
          setProductMenu(Array.isArray(result?.data) ? result.data : []);
        }
      } catch (error) {
        console.log("Menu categories fetch error:", error.message);
        if (isMounted) {
          setProductMenu([]);
        }
      } finally {
        if (isMounted) {
          setCategoriesLoading(false);
        }
      }
    };

    fetchMenuCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (location.pathname === "/product") {
      const params = new URLSearchParams(location.search);
      setSearchTerm(params.get("search") || "");
    }
  }, [location]);

  useEffect(() => {
    if (!miniCartOpen) return;

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [miniCartOpen]);

  const clearHoverTimers = () => {
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }

    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const updateMegaMenuPosition = () => {
    if (navRef.current && window.innerWidth >= 1200) {
      const rect = navRef.current.getBoundingClientRect();
      setMegaMenuTop(rect.bottom);
      setBridgeTop(rect.bottom - 3);
    }
  };

  const openMegaMenuWithDelay = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    if (!megaMenuOpen) {
      openTimeoutRef.current = setTimeout(() => {
        updateMegaMenuPosition();
        setMegaMenuOpen(true);
      }, 70);
    }
  };

  const closeMegaMenuWithDelay = () => {
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }

    closeTimeoutRef.current = setTimeout(() => {
      setMegaMenuOpen(false);
    }, 220);
  };

  const closeMegaMenuImmediately = () => {
    clearHoverTimers();
    setMegaMenuOpen(false);
  };

  useEffect(() => {
    updateMegaMenuPosition();

    const handleResize = () => {
      updateMegaMenuPosition();

      if (window.innerWidth < 1200) {
        setMegaMenuOpen(false);
      } else {
        setMobileNavOpen(false);
        setMobileProductsOpen(false);
      }
    };

    const handleScroll = () => {
      updateMegaMenuPosition();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      clearHoverTimers();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (megaMenuOpen) {
      updateMegaMenuPosition();
    }
  }, [megaMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        megaWrapperRef.current &&
        !megaWrapperRef.current.contains(event.target)
      ) {
        closeMegaMenuImmediately();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeMegaMenuImmediately();
        setMiniCartOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const buildProductSearchUrl = ({ search = "", slug = "" }) => {
    const params = new URLSearchParams();

    if (slug) params.set("category", slug);
    if (search.trim()) params.set("search", search.trim());

    return `/product${params.toString() ? `?${params.toString()}` : ""}`;
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(buildProductSearchUrl({ search: searchTerm }));
    setSearchFocused(false);
    setMobileNavOpen(false);
  };

  const handleCategoryClick = (item) => {
    navigate(buildProductSearchUrl({ search: searchTerm, slug: item.slug }));
    setMobileNavOpen(false);
    setMobileProductsOpen(false);
    setMegaMenuOpen(false);
  };

  const handleSuggestionClick = (value) => {
    setSearchTerm(value);
    setSearchFocused(false);
    navigate(buildProductSearchUrl({ search: value }));
    setMobileNavOpen(false);
  };

  const toggleCategory = (categoryId) => {
    setOpenMobileCategory((prev) => (prev === categoryId ? null : categoryId));
    setOpenMobileSubCategory(null);
  };

  const toggleSubCategory = (subCategoryId) => {
    setOpenMobileSubCategory((prev) => (prev === subCategoryId ? null : subCategoryId));
  };

  return (
    <>
      <div className="announcement-bar">
        <div className="container announcement-content">
          <span>Free shipping on orders over $100</span>
          <span className="announcement-divider">|</span>
          <span>New season collection is live</span>
          <span className="announcement-divider">|</span>
          <span>Easy returns within 7 days</span>
        </div>
      </div>

      <nav
        ref={navRef}
        className="navbar navbar-expand-xl premium-navbar shadow-sm sticky-top"
      >
        <div className="container premium-navbar-inner">
          <NavLink
            className="navbar-brand premium-brand"
            to="/"
            onClick={() => {
              setMobileNavOpen(false);
              setMegaMenuOpen(false);
            }}
          >
            <span className="brand-badge">STYLE</span>
            <span className="brand-main">E-Commerce</span>
            <span className="brand-sub">Modern Fashion Store</span>
          </NavLink>

          <div className="premium-header-actions d-flex d-xl-none">
            <NavLink
              to="/wishlist"
              className="premium-mobile-icon-btn premium-wishlist-nav-btn"
              aria-label="Wishlist"
              onClick={() => setMobileNavOpen(false)}
            >
              <i className="fa fa-heart-o"></i>
              {wishlistCount > 0 && (
                <span className="premium-wishlist-badge">{wishlistCount}</span>
              )}
            </NavLink>

            <button
              type="button"
              className="premium-mobile-icon-btn"
              aria-label="Cart"
              onClick={() => setMiniCartOpen(true)}
            >
              <i className="fa fa-shopping-bag"></i>
              {cartCount > 0 && <span className="premium-mobile-badge">{cartCount}</span>}
            </button>

            <button
              className="navbar-toggler border-0 shadow-none premium-toggler"
              type="button"
              onClick={() => setMobileNavOpen((prev) => !prev)}
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>

          <div className={`collapse navbar-collapse ${mobileNavOpen ? "show" : ""}`}>
            <ul className="navbar-nav mx-auto align-items-xl-center premium-nav-list">
              <li className="nav-item">
                <NavLink
                  className="nav-link premium-nav-link"
                  to="/"
                  onClick={() => setMobileNavOpen(false)}
                >
                  Home
                </NavLink>
              </li>

              <li className="nav-item d-none d-xl-block premium-products-navitem">
                <div
                  ref={megaWrapperRef}
                  className={`premium-mega-wrapper ${megaMenuOpen ? "mega-open" : ""}`}
                  onMouseEnter={openMegaMenuWithDelay}
                  onMouseLeave={closeMegaMenuWithDelay}
                >
                  <button
                    id="products-menu-trigger"
                    type="button"
                    className={`nav-link premium-nav-link premium-menu-btn ${
                      megaMenuOpen ? "active-menu-trigger" : ""
                    }`}
                    aria-haspopup="menu"
                    aria-expanded={megaMenuOpen}
                    aria-controls="products-mega-menu"
                    onClick={() => {
                      clearHoverTimers();
                      updateMegaMenuPosition();
                      setMegaMenuOpen((prev) => !prev);
                    }}
                  >
                    Products <span className="ms-1">▾</span>
                  </button>

                  <div
                    className="premium-hover-bridge"
                    style={{ top: `${bridgeTop}px` }}
                    aria-hidden="true"
                  ></div>

                  <div
                    id="products-mega-menu"
                    className="premium-mega-menu"
                    style={{ top: `${megaMenuTop}px` }}
                    role="menu"
                    aria-labelledby="products-menu-trigger"
                    onMouseEnter={openMegaMenuWithDelay}
                    onMouseLeave={closeMegaMenuWithDelay}
                  >
                    <div className="premium-mega-grid">
                      {categoriesLoading ? (
                        <div className="premium-mega-loading">Loading categories...</div>
                      ) : (
                        productMenu.map((section) => (
                          <div className="premium-mega-card" key={section.id}>
                            <div className="premium-card-top">
                              <div className="premium-card-icon">{section.icon}</div>
                              <div>
                                <h6 className="premium-card-title">{section.title}</h6>
                                <p className="premium-card-desc">{section.description}</p>
                              </div>
                            </div>

                            <div className="premium-subcategory-list">
                              {section.children.map((sub) => (
                                <div className="premium-subcategory-block" key={sub.id}>
                                  <h6 className="premium-subcategory-title">{sub.title}</h6>
                                  <ul className="premium-leaf-list">
                                    {sub.children.map((leaf) => (
                                      <li key={leaf.id}>
                                        <button
                                          type="button"
                                          className="premium-leaf-link"
                                          role="menuitem"
                                          onClick={() => handleCategoryClick(leaf)}
                                        >
                                          {leaf.title}
                                        </button>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      )}

                      <div className="premium-highlight-card">
                        <span className="premium-badge">Trending</span>
                        <h5>Discover your next collection</h5>
                        <p>
                          Browse real categories from your database with the same
                          premium shopping experience.
                        </p>
                        <button
                          type="button"
                          className="btn btn-light premium-highlight-btn"
                          onClick={() => {
                            navigate("/product");
                            setMegaMenuOpen(false);
                          }}
                        >
                          Explore Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>

              <li className="nav-item d-xl-none w-100">
                <button
                  type="button"
                  className="nav-link premium-nav-link premium-mobile-products-btn w-100 text-start"
                  onClick={() => setMobileProductsOpen((prev) => !prev)}
                >
                  <span>Products</span>
                  <span>{mobileProductsOpen ? "▴" : "▾"}</span>
                </button>

                {mobileProductsOpen && (
                  <div className="premium-mobile-menu">
                    {categoriesLoading ? (
                      <div className="premium-mobile-loading">Loading categories...</div>
                    ) : (
                      productMenu.map((section) => (
                        <div className="premium-mobile-card" key={section.id}>
                          <button
                            type="button"
                            className="premium-mobile-category"
                            onClick={() => toggleCategory(section.id)}
                          >
                            <span>
                              {section.icon} {section.title}
                            </span>
                            <span>{openMobileCategory === section.id ? "−" : "+"}</span>
                          </button>

                          {openMobileCategory === section.id && (
                            <div className="premium-mobile-sub-wrap">
                              <p className="premium-mobile-desc">{section.description}</p>

                              {section.children.map((sub) => (
                                <div className="premium-mobile-sub-block" key={sub.id}>
                                  <button
                                    type="button"
                                    className="premium-mobile-subcategory"
                                    onClick={() => toggleSubCategory(sub.id)}
                                  >
                                    <span>{sub.title}</span>
                                    <span>{openMobileSubCategory === sub.id ? "−" : "+"}</span>
                                  </button>

                                  {openMobileSubCategory === sub.id && (
                                    <ul className="premium-mobile-leaf-list">
                                      {sub.children.map((leaf) => (
                                        <li key={leaf.id}>
                                          <button
                                            type="button"
                                            className="premium-mobile-leaf-link"
                                            onClick={() => handleCategoryClick(leaf)}
                                          >
                                            {leaf.title}
                                          </button>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </li>

              <li className="nav-item">
                <NavLink
                  className="nav-link premium-nav-link"
                  to="/about"
                  onClick={() => setMobileNavOpen(false)}
                >
                  About
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  className="nav-link premium-nav-link"
                  to="/contact"
                  onClick={() => setMobileNavOpen(false)}
                >
                  Contact
                </NavLink>
              </li>
            </ul>

            <div className="premium-actions">
              <div className="premium-search-wrapper">
                <form className="premium-search" onSubmit={handleSearchSubmit}>
                  <span className="premium-search-icon">
                    <i className="fa fa-search"></i>
                  </span>

                  <input
                    type="text"
                    placeholder="Search for products, categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => {
                      setTimeout(() => setSearchFocused(false), 150);
                    }}
                    className="premium-search-input"
                  />

                  {searchTerm && (
                    <button
                      type="button"
                      className="premium-search-clear"
                      onClick={() => {
                        setSearchTerm("");
                        navigate("/product");
                      }}
                      aria-label="Clear search"
                    >
                      <i className="fa fa-times"></i>
                    </button>
                  )}
                </form>

                {searchFocused && (
                  <div className="premium-search-dropdown">
                    <div className="premium-search-dropdown-header">Quick Search</div>
                    <div className="premium-search-suggestions">
                      {filteredSuggestions.length > 0 ? (
                        filteredSuggestions.map((item) => (
                          <button
                            key={item}
                            type="button"
                            className="premium-search-suggestion"
                            onClick={() => handleSuggestionClick(item)}
                          >
                            <i className="fa fa-search"></i>
                            <span>{item}</span>
                          </button>
                        ))
                      ) : (
                        <div className="premium-no-results">No matching suggestions</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <NavLink
                to="/wishlist"
                className="premium-icon-btn premium-wishlist-nav-btn"
                aria-label="Wishlist"
                onClick={() => setMobileNavOpen(false)}
              >
                <i className="fa fa-heart-o"></i>
                {wishlistCount > 0 && (
                  <span className="premium-wishlist-badge">{wishlistCount}</span>
                )}
              </NavLink>

              <button
                type="button"
                className="premium-cart-btn"
                onClick={() => setMiniCartOpen(true)}
              >
                <span className="cart-icon">
                  <i className="fa fa-shopping-bag"></i>
                </span>
                <span className="cart-text">Cart</span>
                <span className="cart-count">{cartCount}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {miniCartOpen && (
        <div className="premium-mini-cart-overlay" onClick={() => setMiniCartOpen(false)}>
          <div className="premium-mini-cart-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="premium-mini-cart-head">
              <div>
                <span className="premium-mini-cart-badge">Mini Cart</span>
                <h4>Your Cart</h4>
              </div>

              <button
                type="button"
                className="premium-mini-cart-close"
                onClick={() => setMiniCartOpen(false)}
              >
                <i className="fa fa-times"></i>
              </button>
            </div>

            <div className="premium-mini-cart-body">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div className="premium-mini-cart-item" key={item.id}>
                    <div className="premium-mini-cart-image-wrap">
                      <img src={item.image} alt={item.title} className="premium-mini-cart-image" />
                    </div>

                    <div className="premium-mini-cart-content">
                      <h6>
                        {item.title?.length > 40
                          ? `${item.title.slice(0, 40)}...`
                          : item.title}
                      </h6>
                      <p>Qty: {item.qty || 1}</p>
                      <strong>
                        ${(Number(item.price || 0) * Number(item.qty || 1)).toFixed(2)}
                      </strong>
                    </div>
                  </div>
                ))
              ) : (
                <div className="premium-mini-cart-empty">
                  <div className="premium-mini-cart-empty-icon">
                    <i className="fa fa-shopping-bag"></i>
                  </div>
                  <h5>Your cart is empty</h5>
                  <p>Add products to see them here.</p>
                </div>
              )}
            </div>

            <div className="premium-mini-cart-footer">
              <div className="premium-mini-cart-total">
                <span>Subtotal</span>
                <strong>${cartSubtotal.toFixed(2)}</strong>
              </div>

              <div className="premium-mini-cart-actions">
                <NavLink
                  to="/cart"
                  className="premium-mini-cart-view-btn"
                  onClick={() => setMiniCartOpen(false)}
                >
                  View Cart
                </NavLink>

                <NavLink
                  to="/checkout"
                  className="premium-mini-cart-checkout-btn"
                  onClick={() => setMiniCartOpen(false)}
                >
                  Checkout
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;