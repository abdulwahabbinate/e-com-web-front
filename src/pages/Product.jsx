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
          const cleanedSizes = Array.isArray(normalizedSingleProduct.sizes)
            ? normalizedSingleProduct.sizes
                .map((size) => String(size || "").trim())
                .filter(Boolean)
            : [];

          setProduct(normalizedSingleProduct);
          setSelectedSize(cleanedSizes[0] || "");
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
    return Array.isArray(product.images) ? product.images.filter(Boolean) : [];
  }, [product]);

  const cleanedSizes = useMemo(() => {
    if (!product?.sizes || !Array.isArray(product.sizes)) return [];
    return product.sizes
      .map((size) => String(size || "").trim())
      .filter(Boolean);
  }, [product]);

  const hasCategory = Boolean(String(product?.category || "").trim());
  const hasDescription = Boolean(String(product?.description || "").trim());
  const hasOriginalPrice =
    Number(product?.originalPrice || 0) > Number(product?.price || 0);
  const hasDiscount = Number(product?.discountPercent || 0) > 0;
  const hasSizes = cleanedSizes.length > 0;

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
      <div className="container py-5">
        <div className="row">
          <div className="col-md-6">
            <Skeleton height={520} />
          </div>
          <div className="col-md-6">
            <Skeleton height={40} width={140} className="mb-3" />
            <Skeleton height={50} className="mb-3" />
            <Skeleton height={30} width={180} className="mb-3" />
            <Skeleton count={5} className="mb-2" />
            <Skeleton height={52} width={220} className="mt-4" />
          </div>
        </div>
      </div>
    );
  };

  const ShowProduct = () => {
    if (!product) {
      return (
        <div className="container py-5 text-center">
          <h3 className="mb-3">Product not found</h3>
          <p className="text-muted mb-4">The requested product could not be loaded.</p>
          <Link to="/product" className="btn btn-dark">
            Back to Products
          </Link>
        </div>
      );
    }

    return (
      <div className="single-product-page">
        <div className="container py-5">
          <div className="row g-5 align-items-start">
            <div className="col-lg-6">
              <div className="single-product-gallery">
                {imageGallery.length > 0 && (
                  <div className="single-product-main-image">
                    <img
                      src={imageGallery[activeImage]}
                      alt={product.title}
                      className="img-fluid"
                    />
                  </div>
                )}

                <div className="single-product-badges">
                  {hasDiscount && (
                    <span className="single-product-discount">
                      -{product.discountPercent}%
                    </span>
                  )}
                  <span
                    className={`single-product-stock ${
                      product.inStock === false ? "sold-out" : "in-stock"
                    }`}
                  >
                    {product.inStock === false ? "Sold Out" : "In Stock"}
                  </span>
                </div>

                {imageGallery.length > 1 && (
                  <div className="single-product-thumbs">
                    {imageGallery.slice(0, 5).map((img, index) => (
                      <button
                        type="button"
                        key={`${img}-${index}`}
                        className={`single-product-thumb ${
                          activeImage === index ? "active" : ""
                        }`}
                        onClick={() => setActiveImage(index)}
                      >
                        <img
                          src={img}
                          alt={`${product.title} ${index + 1}`}
                          className="img-fluid"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="col-lg-6">
              <div className="single-product-content">
                {hasCategory && <span className="single-product-category">{product.category}</span>}

                <h1 className="single-product-title">{product.title}</h1>

                <div className="single-product-rating">
                  <i className="fa fa-star"></i>
                  <span>{product.rating?.rate || 4.8}</span>
                  <small>({product.rating?.count || 120} reviews)</small>
                </div>

                <div className="single-product-price">
                  <span className="single-product-sale-price">
                    ${Number(product.price || 0).toFixed(2)}
                  </span>

                  {hasOriginalPrice && (
                    <span className="single-product-original-price">
                      ${Number(product.originalPrice || 0).toFixed(2)}
                    </span>
                  )}
                </div>

                {hasDescription && (
                  <p className="single-product-description">{product.description}</p>
                )}

                {hasSizes && (
                  <div className="single-product-size-block">
                    <div className="single-product-size-head">
                      <span>Select Size</span>
                      {selectedSize && (
                        <span className="single-product-selected-size">
                          Selected: {selectedSize}
                        </span>
                      )}
                    </div>

                    <div className="single-product-sizes">
                      {cleanedSizes.map((size) => (
                        <button
                          type="button"
                          key={size}
                          className={`single-product-size-btn ${
                            selectedSize === size ? "active" : ""
                          }`}
                          onClick={() => setSelectedSize(size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="single-product-actions">
                  <button
                    type="button"
                    className="single-product-cart-btn"
                    onClick={() => addProduct(product)}
                    disabled={product.inStock === false}
                  >
                    <i className="fa fa-shopping-bag me-2"></i>
                    <span>Add to Cart</span>
                  </button>

                  <button
                    type="button"
                    className="single-product-wishlist-btn"
                    onClick={() => toggleWishlist(product)}
                  >
                    <i
                      className={`${
                        isWishlisted ? "fa fa-heart" : "far fa-heart"
                      } me-2`}
                    ></i>
                    <span>
                      {isWishlisted ? "Saved in Wishlist" : "Add to Wishlist"}
                    </span>
                  </button>

                  <Link to="/checkout" className="single-product-buy-btn">
                    <i className="fa fa-bolt me-2"></i>
                    <span>Buy Now</span>
                  </Link>
                </div>

                <div className="single-product-features">
                  <div>Fast shipping available</div>
                  <div>Easy 7-day returns</div>
                  <div>Secure checkout experience</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="container pb-5">
          <div className="products-section-header text-center mb-4">
            <span className="products-section-badge">Related Picks</span>
            <h2 className="products-section-title">You may also like</h2>
            <p className="products-section-subtitle mb-0">
              Explore more premium styles from this collection
            </p>
          </div>

          <div className="row">
            {similarProducts.slice(0, 4).map((item) => (
              <div key={item.id} className="col-xxl-3 col-lg-4 col-sm-6 col-12 mb-4">
                <ProductCard
                  product={item}
                  onAddToCart={addProduct}
                  onToggleWishlist={toggleWishlist}
                  isWishlisted={isInWishlist(item)}
                  onQuickView={setQuickViewProduct}
                />
              </div>
            ))}

            {loading2 &&
              [1, 2, 3, 4].map((item) => (
                <div key={item} className="col-xxl-3 col-lg-4 col-sm-6 col-12 mb-4">
                  <Skeleton height={430} style={{ borderRadius: "22px" }} />
                </div>
              ))}
          </div>
        </section>
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