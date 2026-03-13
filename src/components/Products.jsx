import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { addCart, addWishlist, delWishlist } from "../redux/action";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import toast from "react-hot-toast";
import ProductCard from "./ProductCard";
import QuickViewModal from "./QuickViewModal";
import { normalizeProduct } from "../utils/productMapper";
import { API_ENDPOINTS } from "../config/api";
import "./ProductsSection.css";

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-low-high", label: "Price: Low to High" },
  { value: "price-high-low", label: "Price: High to Low" },
  { value: "name-a-z", label: "Name: A to Z" },
  { value: "name-z-a", label: "Name: Z to A" },
];

const PRODUCTS_PER_PAGE = 6;

const Products = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const [pagination, setPagination] = useState({
    total_items: 0,
    total_pages: 0,
    current_page: 1,
    per_page: PRODUCTS_PER_PAGE,
    has_next_page: false,
    has_prev_page: false,
  });

  const [filtersMeta, setFiltersMeta] = useState({
    available_sizes: [],
    min_price: 0,
    max_price: 1000,
  });

  const [localMinPrice, setLocalMinPrice] = useState(0);
  const [localMaxPrice, setLocalMaxPrice] = useState(1000);

  const sortDropdownRef = useRef(null);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const wishlist = useSelector((state) => state.handleWishlist) || [];

  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const selectedCategorySlug = queryParams.get("category") || "";
  const selectedCategorySlugs = queryParams.get("categories")
    ? queryParams
        .get("categories")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
  const searchTerm = queryParams.get("search") || "";
  const currentPage = Number(queryParams.get("page") || 1);
  const sortBy = queryParams.get("sort") || "featured";
  const selectedSizes = queryParams.get("sizes")
    ? queryParams
        .get("sizes")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
  const stockFilter = queryParams.get("stock") || "";
  const minPriceParam = queryParams.get("min_price");
  const maxPriceParam = queryParams.get("max_price");

  const selectedSortLabel = useMemo(() => {
    return sortOptions.find((item) => item.value === sortBy)?.label || "Featured";
  }, [sortBy]);

  const priceRange = useMemo(() => {
    const min = minPriceParam !== null ? Number(minPriceParam) : 0;
    const max =
      maxPriceParam !== null
        ? Number(maxPriceParam)
        : filtersMeta.max_price || 1000;

    return [min, max];
  }, [minPriceParam, maxPriceParam, filtersMeta.max_price]);

  useEffect(() => {
    setLocalMinPrice(priceRange[0]);
    setLocalMaxPrice(priceRange[1]);
  }, [priceRange]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target)
      ) {
        setSortDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const updateQueryParams = (updates = {}, resetPage = false) => {
    const params = new URLSearchParams(location.search);

    Object.entries(updates).forEach(([key, value]) => {
      const isEmptyArray = Array.isArray(value) && value.length === 0;

      if (
        value === undefined ||
        value === null ||
        value === "" ||
        isEmptyArray
      ) {
        params.delete(key);
      } else if (Array.isArray(value)) {
        params.set(key, value.join(","));
      } else {
        params.set(key, String(value));
      }
    });

    if (resetPage) {
      params.delete("page");
    }

    navigate(`/product${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const buildProductsApiUrl = () => {
    const params = new URLSearchParams();

    params.set("page", String(currentPage));
    params.set("limit", String(PRODUCTS_PER_PAGE));
    params.set("sort_by", sortBy);

    if (searchTerm.trim()) {
      params.set("search", searchTerm.trim());
    }

    if (selectedCategorySlugs.length > 0) {
      params.set("category_slugs", selectedCategorySlugs.join(","));
    } else if (selectedCategorySlug) {
      params.set("category_slug", selectedCategorySlug);
    }

    if (stockFilter) {
      params.set("stock", stockFilter);
    }

    if (priceRange[0] > 0) {
      params.set("min_price", String(priceRange[0]));
    }

    if (priceRange[1] > 0) {
      params.set("max_price", String(priceRange[1]));
    }

    if (selectedSizes.length > 0) {
      params.set("sizes", selectedSizes.join(","));
    }

    return `${API_ENDPOINTS.products}?${params.toString()}`;
  };

  useEffect(() => {
    let isMounted = true;

    const getProducts = async () => {
      setLoading(true);

      try {
        const response = await fetch(buildProductsApiUrl());
        const result = await response.json();

        if (!response.ok || result?.status !== 1) {
          throw new Error(result?.message || "Failed to fetch products");
        }

        const normalizedProducts = (result?.data?.items || []).map((item, index) =>
          normalizeProduct(item, index)
        );

        if (isMounted) {
          setData(normalizedProducts);
          setPagination(
            result?.data?.pagination || {
              total_items: 0,
              total_pages: 0,
              current_page: 1,
              per_page: PRODUCTS_PER_PAGE,
              has_next_page: false,
              has_prev_page: false,
            }
          );

          setFiltersMeta(
            result?.data?.filters_meta || {
              available_sizes: [],
              min_price: 0,
              max_price: 1000,
            }
          );
        }
      } catch (error) {
        console.log("Products fetch error:", error.message);

        if (isMounted) {
          setData([]);
          setPagination({
            total_items: 0,
            total_pages: 0,
            current_page: 1,
            per_page: PRODUCTS_PER_PAGE,
            has_next_page: false,
            has_prev_page: false,
          });
          setFiltersMeta({
            available_sizes: [],
            min_price: 0,
            max_price: 1000,
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getProducts();

    return () => {
      isMounted = false;
    };
  }, [location.search]);

  const pageTitle = useMemo(() => {
    if (searchTerm && (selectedCategorySlug || selectedCategorySlugs.length > 0)) {
      return `Results for "${searchTerm}"`;
    }

    if (searchTerm) {
      return `Search: ${searchTerm}`;
    }

    if (selectedCategorySlugs.length > 0) {
      return "Grouped Collection";
    }

    if (!selectedCategorySlug) return "Latest Products";

    return selectedCategorySlug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }, [selectedCategorySlug, selectedCategorySlugs, searchTerm]);

  const pageSubtitle = useMemo(() => {
    if (searchTerm && (selectedCategorySlug || selectedCategorySlugs.length > 0)) {
      return "Filtered by selected category and search query";
    }

    if (searchTerm) {
      return "Matching products based on your search";
    }

    if (selectedCategorySlugs.length > 0) {
      return "Premium products from the selected category group";
    }

    if (selectedCategorySlug) {
      return "Premium collection curated from your selected menu";
    }

    return "Premium collection curated for your selection";
  }, [selectedCategorySlug, selectedCategorySlugs, searchTerm]);

  const activeFilterChips = useMemo(() => {
    const chips = [];

    if (searchTerm) {
      chips.push({
        key: "search",
        label: `Search: ${searchTerm}`,
        onRemove: () => updateQueryParams({ search: "" }, true),
      });
    }

    if (selectedCategorySlug) {
      chips.push({
        key: "category",
        label: selectedCategorySlug
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        onRemove: () => updateQueryParams({ category: "" }, true),
      });
    }

    if (selectedCategorySlugs.length > 0) {
      chips.push({
        key: "categories",
        label: "Grouped Categories",
        onRemove: () => updateQueryParams({ categories: "" }, true),
      });
    }

    selectedSizes.forEach((size) => {
      chips.push({
        key: `size-${size}`,
        label: `Size: ${size}`,
        onRemove: () =>
          updateQueryParams(
            { sizes: selectedSizes.filter((item) => item !== size) },
            true
          ),
      });
    });

    if (stockFilter) {
      chips.push({
        key: "stock",
        label: stockFilter === "in-stock" ? "In Stock" : "Sold Out",
        onRemove: () => updateQueryParams({ stock: "" }, true),
      });
    }

    if (priceRange[0] > 0 || priceRange[1] < (filtersMeta.max_price || 1000)) {
      chips.push({
        key: "price",
        label: `$${priceRange[0]} - $${priceRange[1]}`,
        onRemove: () =>
          updateQueryParams(
            {
              min_price: "",
              max_price: "",
            },
            true
          ),
      });
    }

    if (sortBy && sortBy !== "featured") {
      chips.push({
        key: "sort",
        label: selectedSortLabel,
        onRemove: () => updateQueryParams({ sort: "" }, true),
      });
    }

    return chips;
  }, [
    searchTerm,
    selectedCategorySlug,
    selectedCategorySlugs,
    selectedSizes,
    stockFilter,
    priceRange,
    filtersMeta.max_price,
    sortBy,
    selectedSortLabel,
  ]);

  const addProduct = (product) => {
    dispatch(addCart(product));
    toast.success("Added to cart");
  };

  const toggleWishlist = (product) => {
    const exists = wishlist.find((item) => item.id === product.id);

    if (exists) {
      dispatch(delWishlist(product));
      toast.success("Removed from wishlist");
    } else {
      dispatch(addWishlist(product));
      toast.success("Added to wishlist");
    }
  };

  const isInWishlist = (product) => {
    return wishlist.some((item) => item.id === product.id);
  };

  const toggleSizeFilter = (size) => {
    const exists = selectedSizes.includes(size);

    const nextSizes = exists
      ? selectedSizes.filter((item) => item !== size)
      : [...selectedSizes, size];

    updateQueryParams({ sizes: nextSizes }, true);
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams(location.search);

    params.delete("sizes");
    params.delete("stock");
    params.delete("min_price");
    params.delete("max_price");
    params.delete("sort");
    params.delete("page");
    params.delete("search");
    params.delete("category");
    params.delete("categories");

    navigate(`/product${params.toString() ? `?${params.toString()}` : ""}`);
    setSortDropdownOpen(false);
  };

  const applyPriceFilter = () => {
    const backendMax = Number(filtersMeta.max_price || 1000);

    let nextMin = Number(localMinPrice || 0);
    let nextMax = Number(localMaxPrice || 0);

    if (nextMin < 0) nextMin = 0;
    if (nextMax < 0) nextMax = 0;
    if (nextMax > backendMax) nextMax = backendMax;

    if (nextMin > nextMax) {
      nextMin = nextMax;
    }

    updateQueryParams(
      {
        min_price: nextMin > 0 ? nextMin : "",
        max_price: nextMax > 0 ? nextMax : "",
      },
      true
    );
  };

  const Loading = () => {
    return (
      <>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div className="col-xxl-4 col-lg-6 col-12 mb-4" key={item}>
            <Skeleton height={430} style={{ borderRadius: "22px" }} />
          </div>
        ))}
      </>
    );
  };

  const EmptyState = () => {
    return (
      <div className="col-12">
        <div className="products-empty-state text-center py-5">
          <div className="products-empty-icon">
            <i className="fa fa-search"></i>
          </div>
          <h4 className="fw-bold mb-3">No products found</h4>
          <p className="text-muted mb-3">
            Try another search or choose a different category from the navbar menu.
          </p>
          <button
            type="button"
            className="products-clear-btn"
            onClick={clearAllFilters}
          >
            Clear Filters
          </button>
        </div>
      </div>
    );
  };

  const FiltersUI = () => (
    <div className="products-filter-card">
      <div className="products-filter-scroll">
        <div className="products-filter-head">
          <div>
            <span className="products-filter-badge">Filters</span>
            <h4>Refine Results</h4>
          </div>

          <button
            type="button"
            className="products-clear-link"
            onClick={clearAllFilters}
          >
            Clear All
          </button>
        </div>

        <div className="products-filter-group sort-group" ref={sortDropdownRef}>
          <h6>Sort By</h6>

          <button
            type="button"
            className={`products-custom-sort-trigger ${
              sortDropdownOpen ? "open" : ""
            }`}
            onClick={() => setSortDropdownOpen((prev) => !prev)}
          >
            <span>{selectedSortLabel}</span>
            <i className={`fa ${sortDropdownOpen ? "fa-angle-up" : "fa-angle-down"}`}></i>
          </button>

          {sortDropdownOpen && (
            <div className="products-custom-sort-menu">
              {sortOptions.map((option) => (
                <button
                  type="button"
                  key={option.value}
                  className={`products-custom-sort-option ${
                    sortBy === option.value ? "active" : ""
                  }`}
                  onClick={() => {
                    updateQueryParams({ sort: option.value }, true);
                    setSortDropdownOpen(false);
                  }}
                >
                  <span>{option.label}</span>
                  {sortBy === option.value && <i className="fa fa-check"></i>}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="products-filter-group">
          <h6>Price Range</h6>

          <div className="products-price-values">
            <span>${localMinPrice}</span>
            <span>${localMaxPrice}</span>
          </div>

          <div className="products-price-inputs">
            <div className="products-price-field">
              <label className="products-price-label">Min</label>
              <input
                type="number"
                min={0}
                max={filtersMeta.max_price || 1000}
                value={localMinPrice}
                onChange={(e) => setLocalMinPrice(Number(e.target.value || 0))}
                className="products-price-input"
              />
            </div>

            <div className="products-price-field">
              <label className="products-price-label">Max</label>
              <input
                type="number"
                min={0}
                max={filtersMeta.max_price || 1000}
                value={localMaxPrice}
                onChange={(e) => setLocalMaxPrice(Number(e.target.value || 0))}
                className="products-price-input"
              />
            </div>
          </div>

          <button
            type="button"
            className="products-apply-price-btn"
            onClick={applyPriceFilter}
          >
            Apply Price
          </button>
        </div>

        <div className="products-filter-group">
          <h6>Sizes</h6>
          <div className="products-size-grid">
            {filtersMeta.available_sizes.map((size) => (
              <button
                type="button"
                key={size}
                className={`products-size-btn ${
                  selectedSizes.includes(size) ? "active" : ""
                }`}
                onClick={() => toggleSizeFilter(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="products-filter-group">
          <h6>Stock Status</h6>
          <div className="products-stock-buttons">
            <button
              type="button"
              className={`products-stock-btn ${
                stockFilter === "in-stock" ? "active" : ""
              }`}
              onClick={() =>
                updateQueryParams(
                  {
                    stock: stockFilter === "in-stock" ? "" : "in-stock",
                  },
                  true
                )
              }
            >
              In Stock
            </button>

            <button
              type="button"
              className={`products-stock-btn ${
                stockFilter === "sold-out" ? "active" : ""
              }`}
              onClick={() =>
                updateQueryParams(
                  {
                    stock: stockFilter === "sold-out" ? "" : "sold-out",
                  },
                  true
                )
              }
            >
              Sold Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const PaginationUI = () => {
    if (!pagination.total_pages || pagination.total_pages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= pagination.total_pages; i += 1) {
      pages.push(i);
    }

    return (
      <div className="products-pagination-wrap">
        <button
          type="button"
          className="products-page-btn"
          disabled={!pagination.has_prev_page}
          onClick={() => updateQueryParams({ page: currentPage - 1 })}
        >
          Prev
        </button>

        {pages.map((page) => (
          <button
            key={page}
            type="button"
            className={`products-page-btn ${page === currentPage ? "active" : ""}`}
            onClick={() => updateQueryParams({ page })}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          className="products-page-btn"
          disabled={!pagination.has_next_page}
          onClick={() => updateQueryParams({ page: currentPage + 1 })}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="container my-3 py-3">
      <div className="products-section-header text-center mb-4">
        <span className="products-section-badge">Collection</span>
        <h2 className="products-section-title">{pageTitle}</h2>
        <p className="products-section-subtitle mb-0">{pageSubtitle}</p>
      </div>

      <div className="products-topbar">
        <div className="products-results-count">
          {pagination.total_items} products found
        </div>

        <button
          type="button"
          className="products-mobile-filter-btn d-lg-none"
          onClick={() => setMobileFiltersOpen(true)}
        >
          <i className="fa fa-sliders"></i>
          <span>Filters & Sort</span>
        </button>
      </div>

      {activeFilterChips.length > 0 && (
        <div className="products-active-filters">
          {activeFilterChips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              className="products-filter-chip"
              onClick={chip.onRemove}
            >
              <span>{chip.label}</span>
              <i className="fa fa-times"></i>
            </button>
          ))}

          <button
            type="button"
            className="products-filter-chip products-filter-chip-clear"
            onClick={clearAllFilters}
          >
            <span>Clear All</span>
          </button>
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-3 d-none d-lg-block">
          <FiltersUI />
        </div>

        <div className="col-lg-9">
          <div className="row">
            {loading ? (
              <Loading />
            ) : data.length > 0 ? (
              data.map((product) => (
                <div
                  key={product.id}
                  className="col-xxl-4 col-lg-6 col-12 mb-4"
                >
                  <ProductCard
                    product={product}
                    onAddToCart={addProduct}
                    onToggleWishlist={toggleWishlist}
                    isWishlisted={isInWishlist(product)}
                    onQuickView={setQuickViewProduct}
                  />
                </div>
              ))
            ) : (
              <EmptyState />
            )}
          </div>

          {!loading && <PaginationUI />}
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="products-mobile-filter-overlay">
          <div className="products-mobile-filter-drawer">
            <div className="products-mobile-filter-head">
              <h5>Filters & Sort</h5>
              <button
                type="button"
                className="products-mobile-close"
                onClick={() => setMobileFiltersOpen(false)}
              >
                <i className="fa fa-times"></i>
              </button>
            </div>

            <div className="products-mobile-filter-body">
              <FiltersUI />
            </div>

            <div className="products-mobile-filter-footer">
              <button
                type="button"
                className="products-clear-btn secondary"
                onClick={clearAllFilters}
              >
                Reset
              </button>
              <button
                type="button"
                className="products-clear-btn"
                onClick={() => setMobileFiltersOpen(false)}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      <QuickViewModal
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={addProduct}
        onToggleWishlist={toggleWishlist}
        isWishlisted={quickViewProduct ? isInWishlist(quickViewProduct) : false}
      />
    </div>
  );
};

export default Products;