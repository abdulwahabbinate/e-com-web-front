import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { addCart, addWishlist, delWishlist } from "../redux/action";
import { API_ENDPOINTS } from "../config/api";
import { normalizeProduct } from "../utils/productMapper";
import ProductCard from "./ProductCard";
import QuickViewModal from "./QuickViewModal";

const HomeProductsSection = ({
  title = "Latest Products",
  subtitle = "Premium collection curated for your selection",
  badge = "Collection",
  featuredOnly = false,
  limit = 8,
}) => {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.handleWishlist) || [];

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();
        params.set("limit", String(limit));
        params.set("sort_by", "featured");

        if (featuredOnly) {
          params.set("is_featured", "true");
        }

        const response = await fetch(`${API_ENDPOINTS.products}?${params.toString()}`);
        const result = await response.json();

        if (!response.ok || result?.status !== 1) {
          throw new Error(result?.message || "Failed to fetch products");
        }

        const normalizedProducts = (result?.data?.items || []).map((item, index) =>
          normalizeProduct(item, index)
        );

        if (isMounted) {
          setProducts(normalizedProducts);
        }
      } catch (error) {
        console.log(`${title} fetch error:`, error.message);
        if (isMounted) {
          setProducts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [featuredOnly, limit, title]);

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

  return (
    <section className="py-4">
      <div className="container">
        <div className="products-section-header text-center mb-4">
          <span className="products-section-badge">{badge}</span>
          <h2 className="products-section-title">{title}</h2>
          <p className="products-section-subtitle mb-0">{subtitle}</p>
        </div>

        <div className="row g-4">
          {loading
            ? [1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <div key={item} className="col-xxl-3 col-xl-3 col-lg-4 col-sm-6 col-12">
                  <Skeleton height={430} style={{ borderRadius: "22px" }} />
                </div>
              ))
            : products.map((product) => (
                <div
                  key={product.id}
                  className="col-xxl-3 col-xl-3 col-lg-4 col-sm-6 col-12"
                >
                  <ProductCard
                    product={product}
                    onAddToCart={addProduct}
                    onToggleWishlist={toggleWishlist}
                    isWishlisted={isInWishlist(product)}
                    onQuickView={setQuickViewProduct}
                  />
                </div>
              ))}
        </div>
      </div>

      <QuickViewModal
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={addProduct}
        onToggleWishlist={toggleWishlist}
        isWishlisted={quickViewProduct ? isInWishlist(quickViewProduct) : false}
      />
    </section>
  );
};

export default HomeProductsSection;