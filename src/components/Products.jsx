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

  const [categoriesMenu, setCategoriesMenu] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [openCategorySections, setOpenCategorySections] = useState({});

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
  const [minPriceInput, setMinPriceInput] = useState("0");
  const [maxPriceInput, setMaxPriceInput] = useState("1000");

  const sortDropdownRef = useRef(null);
  const priceApplyTimeoutRef = useRef(null);

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

  const effectiveCategorySlugs = useMemo(() => {
    const slugs =
      selectedCategorySlugs.length > 0
        ? selectedCategorySlugs
        : selectedCategorySlug
        ? [selectedCategorySlug]
        : [];

    return Array.from(new Set(slugs)).filter(Boolean);
  }, [selectedCategorySlug, selectedCategorySlugs]);

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
  const appliedMinPrice = minPriceParam !== null ? Number(minPriceParam) : null;
  const appliedMaxPrice = maxPriceParam !== null ? Number(maxPriceParam) : null;

  const selectedSortLabel = useMemo(() => {
    return sortOptions.find((item) => item.value === sortBy)?.label || "Featured";
  }, [sortBy]);

  const availableSizes = useMemo(() => {
    return Array.from(
      new Set(
        (filtersMeta.available_sizes || [])
          .map((size) => String(size || "").trim())
          .filter(Boolean)
      )
    );
  }, [filtersMeta.available_sizes]);

  const priceLimits = useMemo(() => {
    const minLimit = Number(filtersMeta.min_price || 0);
    const maxLimit = Number(filtersMeta.max_price || 0);

    return {
      minLimit,
      maxLimit: maxLimit >= minLimit ? maxLimit : minLimit,
    };
  }, [filtersMeta.min_price, filtersMeta.max_price]);

  const priceRange = useMemo(() => {
    const minCandidate =
      appliedMinPrice !== null && !Number.isNaN(appliedMinPrice)
        ? appliedMinPrice
        : priceLimits.minLimit;

    const maxCandidate =
      appliedMaxPrice !== null && !Number.isNaN(appliedMaxPrice)
        ? appliedMaxPrice
        : priceLimits.maxLimit;

    return [minCandidate, maxCandidate];
  }, [appliedMinPrice, appliedMaxPrice, priceLimits.minLimit, priceLimits.maxLimit]);

  const categorySlugMap = useMemo(() => {
    const map = {};

    (categoriesMenu || []).forEach((section) => {
      (section?.children || []).forEach((group) => {
        (group?.children || []).forEach((category) => {
          if (category?.slug) {
            map[category.slug] = category.title || category.slug;
          }
        });
      });
    });

    return map;
  }, [categoriesMenu]);

  const selectedCategoryNames = useMemo(() => {
    return effectiveCategorySlugs.map((slug) => {
      if (categorySlugMap[slug]) return categorySlugMap[slug];

      return String(slug)
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    });
  }, [effectiveCategorySlugs, categorySlugMap]);

  const filteredCategoriesMenu = useMemo(() => {
    const term = String(categorySearch || "").trim().toLowerCase();

    if (!term) {
      return categoriesMenu;
    }

    return (categoriesMenu || [])
      .map((section) => {
        const nextGroups = (section?.children || [])
          .map((group) => {
            const nextChildren = (group?.children || []).filter((category) =>
              String(category?.title || "")
                .toLowerCase()
                .includes(term)
            );

            return {
              ...group,
              children: nextChildren,
            };
          })
          .filter((group) => (group?.children || []).length > 0);

        return {
          ...section,
          children: nextGroups,
        };
      })
      .filter((section) => (section?.children || []).length > 0);
  }, [categoriesMenu, categorySearch]);

  const selectedCategoriesCount = effectiveCategorySlugs.length;

  const hasMinPriceFilter =
    appliedMinPrice !== null &&
    !Number.isNaN(appliedMinPrice) &&
    appliedMinPrice > priceLimits.minLimit;

  const hasMaxPriceFilter =
    appliedMaxPrice !== null &&
    !Number.isNaN(appliedMaxPrice) &&
    appliedMaxPrice < priceLimits.maxLimit;

  const priceChipLabel = useMemo(() => {
    if (!hasMinPriceFilter && !hasMaxPriceFilter) return "";

    if (hasMinPriceFilter && hasMaxPriceFilter) {
      return `$${priceRange[0]} - $${priceRange[1]}`;
    }

    if (hasMinPriceFilter) {
      return `From $${priceRange[0]}`;
    }

    return `Up to $${priceRange[1]}`;
  }, [hasMinPriceFilter, hasMaxPriceFilter, priceRange]);

  const priceMinPercent = useMemo(() => {
    const range = priceLimits.maxLimit - priceLimits.minLimit || 1;
    const value = Number(localMinPrice || 0);

    return ((value - priceLimits.minLimit) / range) * 100;
  }, [localMinPrice, priceLimits.maxLimit, priceLimits.minLimit]);

  const priceMaxPercent = useMemo(() => {
    const range = priceLimits.maxLimit - priceLimits.minLimit || 1;
    const value = Number(localMaxPrice || 0);

    return ((value - priceLimits.minLimit) / range) * 100;
  }, [localMaxPrice, priceLimits.maxLimit, priceLimits.minLimit]);

  useEffect(() => {
    const { minLimit, maxLimit } = priceLimits;

    let nextMin = Number(priceRange[0] ?? minLimit);
    let nextMax = Number(priceRange[1] ?? maxLimit);

    if (Number.isNaN(nextMin)) nextMin = minLimit;
    if (Number.isNaN(nextMax)) nextMax = maxLimit;

    nextMin = Math.max(minLimit, Math.min(nextMin, maxLimit));
    nextMax = Math.max(minLimit, Math.min(nextMax, maxLimit));

    if (nextMin > nextMax) {
      nextMin = nextMax;
    }

    setLocalMinPrice(nextMin);
    setLocalMaxPrice(nextMax);
    setMinPriceInput(String(nextMin));
    setMaxPriceInput(String(nextMax));
  }, [priceRange, priceLimits]);

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

  useEffect(() => {
    return () => {
      if (priceApplyTimeoutRef.current) {
        clearTimeout(priceApplyTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const getCategoriesMenu = async () => {
      setCategoriesLoading(true);

      try {
        const response = await fetch(API_ENDPOINTS.categoriesMenu);
        const result = await response.json();

        if (!response.ok || result?.status !== 1) {
          throw new Error(result?.message || "Failed to fetch categories");
        }

        const menu = Array.isArray(result?.data) ? result.data : [];

        if (isMounted) {
          setCategoriesMenu(menu);

          setOpenCategorySections((prev) => {
            const next = { ...prev };

            menu.forEach((section) => {
              if (typeof next?.[section?.id] === "undefined") {
                next[section.id] = true;
              }
            });

            return next;
          });
        }
      } catch (error) {
        console.log("Categories fetch error:", error.message);

        if (isMounted) {
          setCategoriesMenu([]);
        }
      } finally {
        if (isMounted) {
          setCategoriesLoading(false);
        }
      }
    };

    getCategoriesMenu();

    return () => {
      isMounted = false;
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

  const applyCategorySelection = (slugs = []) => {
    const cleaned = Array.from(new Set(slugs)).filter(Boolean);

    if (cleaned.length === 1) {
      updateQueryParams({ category: cleaned[0], categories: "" }, true);
      return;
    }

    if (cleaned.length > 1) {
      updateQueryParams({ categories: cleaned, category: "" }, true);
      return;
    }

    updateQueryParams({ category: "", categories: "" }, true);
  };

  const toggleCategoryFilter = (slug) => {
    const exists = effectiveCategorySlugs.includes(slug);

    const nextSlugs = exists
      ? effectiveCategorySlugs.filter((item) => item !== slug)
      : [...effectiveCategorySlugs, slug];

    applyCategorySelection(nextSlugs);
  };

  const getSectionCategorySlugs = (section) => {
    return (section?.children || [])
      .flatMap((group) => group?.children || [])
      .map((category) => category?.slug)
      .filter(Boolean);
  };

  const toggleCategorySection = (sectionId) => {
    setOpenCategorySections((prev) => ({
      ...prev,
      [sectionId]: !prev?.[sectionId],
    }));
  };

  const selectAllInSection = (section) => {
    const sectionSlugs = getSectionCategorySlugs(section);
    applyCategorySelection([...effectiveCategorySlugs, ...sectionSlugs]);
  };

  const clearSectionSelection = (section) => {
    const sectionSlugs = getSectionCategorySlugs(section);

    applyCategorySelection(
      effectiveCategorySlugs.filter((slug) => !sectionSlugs.includes(slug))
    );
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

    if (appliedMinPrice !== null && !Number.isNaN(appliedMinPrice)) {
      params.set("min_price", String(appliedMinPrice));
    }

    if (appliedMaxPrice !== null && !Number.isNaN(appliedMaxPrice)) {
      params.set("max_price", String(appliedMaxPrice));
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
    if (searchTerm && selectedCategoryNames.length > 0) {
      return `Results for "${searchTerm}"`;
    }

    if (searchTerm) {
      return `Search: ${searchTerm}`;
    }

    if (selectedCategoryNames.length === 1) {
      return selectedCategoryNames[0];
    }

    if (selectedCategoryNames.length > 1) {
      return "Curated Collection";
    }

    return "Latest Products";
  }, [searchTerm, selectedCategoryNames]);

  const pageSubtitle = useMemo(() => {
    if (searchTerm && selectedCategoryNames.length > 0) {
      return "Filtered by selected categories and search query";
    }

    if (searchTerm) {
      return "Matching products based on your search";
    }

    if (selectedCategoryNames.length > 1) {
      return `Premium products across ${selectedCategoryNames.length} selected categories`;
    }

    if (selectedCategoryNames.length === 1) {
      return "Premium collection curated from your selected category";
    }

    return "Premium collection curated for your selection";
  }, [searchTerm, selectedCategoryNames]);

  const activeFilterChips = useMemo(() => {
    const chips = [];

    if (searchTerm) {
      chips.push({
        key: "search",
        label: `Search: ${searchTerm}`,
        onRemove: () => updateQueryParams({ search: "" }, true),
      });
    }

    if (effectiveCategorySlugs.length > 0) {
      effectiveCategorySlugs.forEach((slug) => {
        const label = categorySlugMap[slug]
          ? categorySlugMap[slug]
          : String(slug)
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");

        chips.push({
          key: `category-${slug}`,
          label,
          onRemove: () =>
            applyCategorySelection(
              effectiveCategorySlugs.filter((item) => item !== slug)
            ),
        });
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

    if ((hasMinPriceFilter || hasMaxPriceFilter) && priceChipLabel) {
      chips.push({
        key: "price",
        label: priceChipLabel,
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
    effectiveCategorySlugs,
    categorySlugMap,
    selectedSizes,
    stockFilter,
    hasMinPriceFilter,
    hasMaxPriceFilter,
    priceChipLabel,
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
    setCategorySearch("");
    setMobileFiltersOpen(false);
  };

  const parsePriceValue = (value, fallback) => {
    if (value === "") return fallback;

    const parsed = Number(value);

    if (Number.isNaN(parsed)) {
      return fallback;
    }

    return parsed;
  };

  const clampPriceValue = (value) => {
    return Math.max(priceLimits.minLimit, Math.min(value, priceLimits.maxLimit));
  };

  const applyPriceFilter = (minValue = minPriceInput, maxValue = maxPriceInput) => {
    const rawMin = parsePriceValue(minValue, priceLimits.minLimit);
    const rawMax = parsePriceValue(maxValue, priceLimits.maxLimit);

    let nextMin = clampPriceValue(rawMin);
    let nextMax = clampPriceValue(rawMax);

    if (nextMin > nextMax) {
      const swapValue = nextMin;
      nextMin = nextMax;
      nextMax = swapValue;
    }

    setLocalMinPrice(nextMin);
    setLocalMaxPrice(nextMax);
    setMinPriceInput(String(nextMin));
    setMaxPriceInput(String(nextMax));

    updateQueryParams(
      {
        min_price: nextMin > priceLimits.minLimit ? nextMin : "",
        max_price: nextMax < priceLimits.maxLimit ? nextMax : "",
      },
      true
    );
  };

  const schedulePriceApply = (nextMin, nextMax) => {
    if (priceApplyTimeoutRef.current) {
      clearTimeout(priceApplyTimeoutRef.current);
    }

    priceApplyTimeoutRef.current = setTimeout(() => {
      applyPriceFilter(String(nextMin), String(nextMax));
    }, 350);
  };

  const handleMinRangeChange = (event) => {
    const value = Number(event.target.value || 0);
    const nextValue = value > localMaxPrice ? localMaxPrice : value;

    setLocalMinPrice(nextValue);
    setMinPriceInput(String(nextValue));
    schedulePriceApply(nextValue, localMaxPrice);
  };

  const handleMaxRangeChange = (event) => {
    const value = Number(event.target.value || 0);
    const nextValue = value < localMinPrice ? localMinPrice : value;

    setLocalMaxPrice(nextValue);
    setMaxPriceInput(String(nextValue));
    schedulePriceApply(localMinPrice, nextValue);
  };

  const handleMinPriceInputChange = (event) => {
    const value = event.target.value.replace(/[^\d]/g, "");
    setMinPriceInput(value);

    if (value === "") return;

    const numericValue = clampPriceValue(Number(value));
    setLocalMinPrice(numericValue > localMaxPrice ? localMaxPrice : numericValue);
  };

  const handleMaxPriceInputChange = (event) => {
    const value = event.target.value.replace(/[^\d]/g, "");
    setMaxPriceInput(value);

    if (value === "") return;

    const numericValue = clampPriceValue(Number(value));
    setLocalMaxPrice(numericValue < localMinPrice ? localMinPrice : numericValue);
  };

  const handleMinPriceInputBlur = () => {
    applyPriceFilter(minPriceInput, maxPriceInput);
  };

  const handleMaxPriceInputBlur = () => {
    applyPriceFilter(minPriceInput, maxPriceInput);
  };

  const handlePriceInputKeyDown = (event) => {
    if (event.key === "Enter") {
      applyPriceFilter(minPriceInput, maxPriceInput);
      event.currentTarget.blur();
    }
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
            Try another search or refine your filters for a better match.
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

  const renderFiltersUI = () => {
    return (
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
              <i
                className={`fa ${
                  sortDropdownOpen ? "fa-angle-up" : "fa-angle-down"
                }`}
              ></i>
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
            <div className="products-filter-title-row">
              <div className="products-filter-title-stack">
                <h6>Categories</h6>
                {selectedCategoriesCount > 0 && (
                  <span className="products-selected-summary-badge">
                    Selected ({selectedCategoriesCount})
                  </span>
                )}
              </div>

              {effectiveCategorySlugs.length > 0 && (
                <button
                  type="button"
                  className="products-mini-clear"
                  onClick={() => applyCategorySelection([])}
                >
                  Clear
                </button>
              )}
            </div>

            <div className="products-category-search">
              <i className="fa fa-search"></i>
              <input
                type="text"
                className="products-category-search-input"
                placeholder="Search categories..."
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
              />
            </div>

            {categoriesLoading ? (
              <div className="products-filter-muted">Loading categories...</div>
            ) : (filteredCategoriesMenu || []).length === 0 ? (
              <div className="products-filter-muted">No categories found.</div>
            ) : (
              <div className="products-category-sections">
                {filteredCategoriesMenu.map((section) => {
                  const isSearchMode = Boolean(String(categorySearch || "").trim());
                  const isOpen = isSearchMode
                    ? true
                    : Boolean(openCategorySections?.[section?.id]);

                  const sectionCategories = getSectionCategorySlugs(section);
                  const selectedCount = sectionCategories.filter((slug) =>
                    effectiveCategorySlugs.includes(slug)
                  ).length;
                  const allSelected =
                    sectionCategories.length > 0 &&
                    selectedCount === sectionCategories.length;

                  return (
                    <div key={section.id} className="products-category-section">
                      <button
                        type="button"
                        className={`products-category-section-btn ${
                          isOpen ? "open" : ""
                        }`}
                        onClick={() => {
                          if (isSearchMode) return;
                          toggleCategorySection(section.id);
                        }}
                      >
                        <span className="products-category-section-title">
                          <span className="products-category-section-icon">
                            {section.icon}
                          </span>
                          {section.title}
                        </span>

                        <span className="products-category-section-meta">
                          {selectedCount > 0 && (
                            <span className="products-category-selected-count">
                              {selectedCount} selected
                            </span>
                          )}
                          <i
                            className={`fa ${
                              isOpen ? "fa-angle-up" : "fa-angle-down"
                            }`}
                          ></i>
                        </span>
                      </button>

                      {isOpen && (
                        <div className="products-category-section-body">
                          <div className="products-category-actions">
                            <button
                              type="button"
                              className="products-section-action-btn"
                              onClick={() => selectAllInSection(section)}
                              disabled={allSelected}
                            >
                              Select All
                            </button>

                            <button
                              type="button"
                              className="products-section-action-btn secondary"
                              onClick={() => clearSectionSelection(section)}
                              disabled={selectedCount === 0}
                            >
                              Clear Selected
                            </button>
                          </div>

                          {(section?.children || []).map((group) => (
                            <div key={group.id} className="products-category-group">
                              <div className="products-category-group-title">
                                {group.title}
                              </div>

                              <div className="products-check-list">
                                {(group?.children || []).map((category) => (
                                  <label
                                    key={category.slug}
                                    className="products-check-item products-category-check-item"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={effectiveCategorySlugs.includes(
                                        category.slug
                                      )}
                                      onChange={() =>
                                        toggleCategoryFilter(category.slug)
                                      }
                                    />
                                    <span>{category.title}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="products-filter-group">
            <div className="products-filter-title-row">
              <div className="products-filter-title-stack">
                <h6>Price Range</h6>
                <span className="products-filter-muted">
                  Drag the slider or type your exact amount
                </span>
              </div>

              {(hasMinPriceFilter || hasMaxPriceFilter) && (
                <button
                  type="button"
                  className="products-mini-clear"
                  onClick={() =>
                    updateQueryParams(
                      {
                        min_price: "",
                        max_price: "",
                      },
                      true
                    )
                  }
                >
                  Clear
                </button>
              )}
            </div>

            <div className="products-price-display-cards">
              <div className="products-price-display-card">
                <span className="products-price-display-label">Min</span>
                <strong>${localMinPrice}</strong>
              </div>

              <div className="products-price-display-card">
                <span className="products-price-display-label">Max</span>
                <strong>${localMaxPrice}</strong>
              </div>
            </div>

            <div className="products-range-shell">
              <div className="products-range-header">
                <span className="products-range-caption">Selected Range</span>
                <span className="products-range-pill">
                  ${localMinPrice} - ${localMaxPrice}
                </span>
              </div>

              <div className="products-range-wrap premium">
                <div className="products-range-track"></div>
                <div
                  className="products-range-progress"
                  style={{
                    left: `${Math.min(priceMinPercent, priceMaxPercent)}%`,
                    width: `${Math.max(priceMaxPercent - priceMinPercent, 0)}%`,
                  }}
                ></div>

                <input
                  type="range"
                  className="products-range-input range-min"
                  min={priceLimits.minLimit}
                  max={priceLimits.maxLimit}
                  value={localMinPrice}
                  onChange={handleMinRangeChange}
                />

                <input
                  type="range"
                  className="products-range-input range-max"
                  min={priceLimits.minLimit}
                  max={priceLimits.maxLimit}
                  value={localMaxPrice}
                  onChange={handleMaxRangeChange}
                />
              </div>

              <div className="products-range-limits">
                <span>${priceLimits.minLimit}</span>
                <span>${priceLimits.maxLimit}</span>
              </div>
            </div>

            <div className="products-price-inputs">
              <div className="products-price-field">
                <label className="products-price-label">Min</label>
                <div className="products-price-input-wrap">
                  <span className="products-price-prefix">$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={minPriceInput}
                    onChange={handleMinPriceInputChange}
                    onBlur={handleMinPriceInputBlur}
                    onKeyDown={handlePriceInputKeyDown}
                    className="products-price-input"
                    placeholder={`${priceLimits.minLimit}`}
                  />
                </div>
              </div>

              <div className="products-price-field">
                <label className="products-price-label">Max</label>
                <div className="products-price-input-wrap">
                  <span className="products-price-prefix">$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={maxPriceInput}
                    onChange={handleMaxPriceInputChange}
                    onBlur={handleMaxPriceInputBlur}
                    onKeyDown={handlePriceInputKeyDown}
                    className="products-price-input"
                    placeholder={`${priceLimits.maxLimit}`}
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              className="products-apply-price-btn"
              onClick={() => applyPriceFilter(minPriceInput, maxPriceInput)}
            >
              Apply Price
            </button>
          </div>

          {availableSizes.length > 0 && (
            <div className="products-filter-group">
              <div className="products-filter-title-row">
                <div className="products-filter-title-stack">
                  <h6>Sizes</h6>
                  <span className="products-filter-muted">
                    Choose your preferred size
                  </span>
                </div>

                {selectedSizes.length > 0 && (
                  <button
                    type="button"
                    className="products-mini-clear"
                    onClick={() => updateQueryParams({ sizes: [] }, true)}
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="products-size-grid">
                {availableSizes.map((size) => (
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
          )}

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
  };

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
        <div className="col-lg-3 d-none d-lg-block">{renderFiltersUI()}</div>

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

            <div className="products-mobile-filter-body">{renderFiltersUI()}</div>

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