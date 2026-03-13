import React, { useEffect, useMemo, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addCart, addWishlist, delWishlist } from "../redux/action";
import { Footer, Navbar, ProductCard } from "../components";
import QuickViewModal from "../components/QuickViewModal";
import { normalizeProduct } from "../utils/productMapper";
import { API_ENDPOINTS } from "../config/api";
import toast from "react-hot-toast";
import "./Product.css";
import "../components/ProductsSection.css";

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.handleWishlist) || [];

  useEffect(() => {
    let isMounted = true;

    const getProduct = async () => {
      setLoading(true);
      setLoading2(true);

      try {
        const response = await fetch(`${API_ENDPOINTS.productById}/${id}`);
        const result = await response.json();

        if (!response.ok || result?.status !== 1) {
          throw new Error(result?.message || "Failed to fetch product");
        }

        const normalizedSingleProduct = normalizeProduct(result.data, 0);

        if (isMounted) {
          setProduct(normalizedSingleProduct);
          setSelectedSize(normalizedSingleProduct.sizes?.[0] || "");
          setActiveImage(0);
          setLoading(false);
        }

        const relatedParams = new URLSearchParams();
        relatedParams.set("category_slug", normalizedSingleProduct.categorySlug);
        relatedParams.set("limit", "4");
        relatedParams.set("exclude_product_id", normalizedSingleProduct.id);
        relatedParams.set("sort_by", "featured");

        const relatedResponse = await fetch(
          `${API_ENDPOINTS.products}?${relatedParams.toString()}`
        );
        const relatedResult = await relatedResponse.json();

        if (!relatedResponse.ok || relatedResult?.status !== 1) {
          throw new Error(relatedResult?.message || "Failed to fetch related products");
        }

        const normalizedSimilarProducts = (relatedResult?.data?.items || []).map(
          (item, index) => normalizeProduct(item, index)
        );

        if (isMounted) {
          setSimilarProducts(normalizedSimilarProducts);
          setLoading2(false);
        }
      } catch (error) {
        console.log("Product fetch error:", error.message);
        if (isMounted) {
          setLoading(false);
          setLoading2(false);
          setProduct(null);
          setSimilarProducts([]);
        }
      }
    };

    getProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const imageGallery = useMemo(() => {
    if (!product) return [];
    return product.images || [];
  }, [product]);

  const isWishlisted = useMemo(() => {
    if (!product) return false;
    return wishlist.some((item) => item.id === product.id);
  }, [wishlist, product]);

  const addProduct = (item) => {
    dispatch(addCart(item));
    toast.success("Added to cart");
  };

  const toggleWishlist = (item) => {
    const exists = wishlist.find((wishlistItem) => wishlistItem.id === item.id);

    if (exists) {
      dispatch(delWishlist(item));
      toast.success("Removed from wishlist");
    } else {
      dispatch(addWishlist(item));
      toast.success("Added to wishlist");
    }
  };

  const isInWishlist = (item) => {
    return wishlist.some((wishlistItem) => wishlistItem.id === item.id);
  };

  const Loading = () => {
    return (
      <div className="container my-5 py-2">
        <div className="row g-4">
          <div className="col-lg-6">
            <Skeleton height={520} style={{ borderRadius: "28px" }} />
          </div>
          <div className="col-lg-6">
            <Skeleton height={40} width={180} />
            <Skeleton height={60} className="mt-3" />
            <Skeleton height={24} width={130} className="mt-3" />
            <Skeleton height={36} width={160} className="mt-3" />
            <Skeleton count={4} className="mt-3" />
            <Skeleton height={56} className="mt-4" />
            <Skeleton height={56} className="mt-3" />
          </div>
        </div>
      </div>
    );
  };

  const ShowProduct = () => {
    if (!product) {
      return (
        <div className="container py-5 text-center">
          <h3 className="fw-bold mb-3">Product not found</h3>
          <p className="text-muted">The requested product could not be loaded.</p>
          <Link to="/product" className="btn btn-dark rounded-pill px-4 mt-2">
            Back to Products
          </Link>
        </div>
      );
    }

    return (
      <div className="premium-product-page py-5">
        <div className="container">
          <div className="premium-product-layout">
            <div className="premium-product-gallery-card">
              <div className="premium-product-main-image-wrap">
                {imageGallery.length > 0 && (
                  <img
                    src={imageGallery[activeImage]}
                    alt={product.title}
                    className="premium-product-main-image"
                  />
                )}

                <div className="premium-product-floating-badges">
                  <span className="premium-page-discount-badge">
                    -{product.discountPercent}%
                  </span>
                  <span
                    className={`premium-page-stock-badge ${
                      product.inStock === false ? "sold-out" : "in-stock"
                    }`}
                  >
                    {product.inStock === false ? "Sold Out" : "In Stock"}
                  </span>
                </div>
              </div>

              {imageGallery.length > 1 && (
                <div className="premium-product-gallery-thumbs">
                  {imageGallery.slice(0, 5).map((img, index) => (
                    <button
                      key={`${product.id}-gallery-${index}`}
                      type="button"
                      className={`premium-product-gallery-thumb ${
                        activeImage === index ? "active" : ""
                      }`}
                      onClick={() => setActiveImage(index)}
                    >
                      <img src={img} alt={`product-${index + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="premium-product-info-card">
              <div className="premium-page-category">{product.category}</div>

              <h1 className="premium-page-title">{product.title}</h1>

              <div className="premium-page-rating">
                <span className="premium-rating-chip">
                  <i className="fa fa-star"></i>
                  {product.rating?.rate || 4.8}
                </span>
                <span className="premium-rating-count">
                  ({product.rating?.count || 120} reviews)
                </span>
              </div>

              <div className="premium-page-price-row">
                <span className="premium-page-sale-price">
                  ${Number(product.price || 0).toFixed(2)}
                </span>
                <span className="premium-page-original-price">
                  ${Number(product.originalPrice || 0).toFixed(2)}
                </span>
              </div>

              <p className="premium-page-description">{product.description}</p>

              <div className="premium-page-size-block">
                <div className="premium-page-label-row">
                  <span className="premium-page-label">Select Size</span>
                  {selectedSize && (
                    <span className="premium-selected-size">
                      Selected: {selectedSize}
                    </span>
                  )}
                </div>

                <div className="premium-page-size-list">
                  {product.sizes?.map((size) => (
                    <button
                      key={size}
                      type="button"
                      className={`premium-page-size-chip ${
                        selectedSize === size ? "active" : ""
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="premium-page-action-grid">
                <button
                  className="premium-page-cart-btn"
                  onClick={() => addProduct(product)}
                  disabled={product.inStock === false}
                >
                  <i className="fa fa-shopping-bag"></i>
                  <span>Add to Cart</span>
                </button>

                <button
                  className={`premium-page-wishlist-btn ${
                    isWishlisted ? "active" : ""
                  }`}
                  onClick={() => toggleWishlist(product)}
                >
                  <i className={`fa ${isWishlisted ? "fa-heart" : "fa-heart-o"}`}></i>
                  <span>
                    {isWishlisted ? "Saved in Wishlist" : "Add to Wishlist"}
                  </span>
                </button>

                <Link
                  to="/cart"
                  className={`premium-page-buy-btn ${
                    product.inStock === false ? "disabled" : ""
                  }`}
                >
                  <i className="fa fa-bolt"></i>
                  <span>Buy Now</span>
                </Link>
              </div>

              <div className="premium-page-extra-info">
                <div className="premium-info-item">
                  <i className="fa fa-truck"></i>
                  <span>Fast shipping available</span>
                </div>
                <div className="premium-info-item">
                  <i className="fa fa-refresh"></i>
                  <span>Easy 7-day returns</span>
                </div>
                <div className="premium-info-item">
                  <i className="fa fa-shield"></i>
                  <span>Secure checkout experience</span>
                </div>
              </div>
            </div>
          </div>

          <div className="premium-similar-section">
            <div className="products-section-header text-center mb-4">
              <span className="products-section-badge">Related Picks</span>
              <h2 className="products-section-title">You may also like</h2>
              <p className="products-section-subtitle mb-0">
                Explore more premium styles from this collection
              </p>
            </div>

            <div className="row g-4">
              {similarProducts.slice(0, 4).map((item) => (
                <div key={item.id} className="col-xl-3 col-lg-4 col-sm-6 col-12">
                  <ProductCard
                    product={item}
                    onAddToCart={addProduct}
                    onToggleWishlist={toggleWishlist}
                    isWishlisted={isInWishlist(item)}
                    onQuickView={setQuickViewProduct}
                  />
                </div>
              ))}
            </div>

            {loading2 && (
              <div className="row g-4 mt-2">
                {[1, 2, 3, 4].map((item) => (
                  <div className="col-xl-3 col-lg-4 col-sm-6 col-12" key={item}>
                    <Skeleton height={430} style={{ borderRadius: "22px" }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      {loading ? <Loading /> : <ShowProduct />}
      <Footer />

      <QuickViewModal
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={addProduct}
        onToggleWishlist={toggleWishlist}
        isWishlisted={quickViewProduct ? isInWishlist(quickViewProduct) : false}
      />
    </>
  );
};

export default Product;