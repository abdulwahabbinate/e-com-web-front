import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./QuickViewModal.css";

const QuickViewModal = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
}) => {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    if (product) {
      const cleanedSizes = Array.isArray(product.sizes)
        ? product.sizes.map((size) => String(size || "").trim()).filter(Boolean)
        : [];

      setActiveImage(0);
      setSelectedSize(cleanedSizes[0] || "");
    }
  }, [product]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  const imageGallery = useMemo(() => {
    if (!product) return [];

    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images.filter(Boolean);
    }

    return product.image ? [product.image] : [];
  }, [product]);

  const sizes = useMemo(() => {
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
  const hasSizes = sizes.length > 0;

  if (!isOpen || !product) return null;

  return (
    <div className="quick-view-overlay" onClick={onClose}>
      <div className="quick-view-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="quick-view-close" onClick={onClose}>
          <i className="fa fa-times"></i>
        </button>

        <div className="quick-view-grid">
          <div className="quick-view-gallery">
            <div className="quick-view-image-wrap">
              <div className="quick-view-top-badges">
                {hasDiscount && (
                  <span className="quick-view-discount">
                    -{product.discountPercent}%
                  </span>
                )}

                <span
                  className={`quick-view-stock ${
                    product.inStock === false ? "sold-out" : "in-stock"
                  }`}
                >
                  {product.inStock === false ? "Sold Out" : "In Stock"}
                </span>
              </div>

              {imageGallery.length > 0 ? (
                <img
                  src={imageGallery[activeImage]}
                  alt={product.title}
                  className="img-fluid quick-view-main-image"
                />
              ) : (
                <div className="quick-view-image-placeholder">No Image</div>
              )}
            </div>

            {imageGallery.length > 1 && (
              <div className="quick-view-thumbnails">
                {imageGallery.slice(0, 5).map((img, index) => (
                  <button
                    type="button"
                    key={`${img}-${index}`}
                    className={`quick-view-thumb ${activeImage === index ? "active" : ""}`}
                    onClick={() => setActiveImage(index)}
                  >
                    <img src={img} alt={`${product.title} ${index + 1}`} className="img-fluid" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="quick-view-content">
            {hasCategory && <span className="quick-view-category">{product.category}</span>}

            <h2 className="quick-view-title">{product.title}</h2>

            <div className="quick-view-rating">
              <i className="fa fa-star"></i>
              <span>{product.rating?.rate || 4.8}</span>
              <small>({product.rating?.count || 120} reviews)</small>
            </div>

            <div className="quick-view-price">
              <span className="quick-view-sale-price">
                ${Number(product.price || 0).toFixed(2)}
              </span>

              {hasOriginalPrice && (
                <span className="quick-view-original-price">
                  ${Number(product.originalPrice || 0).toFixed(2)}
                </span>
              )}
            </div>

            {hasDescription && (
              <p className="quick-view-description">{product.description}</p>
            )}

            {hasSizes && (
              <div className="quick-view-size-block">
                <div className="quick-view-size-head">
                  <span>Select Size</span>
                  {selectedSize && <span className="quick-view-selected-size">{selectedSize}</span>}
                </div>

                <div className="quick-view-sizes">
                  {sizes.map((size) => (
                    <button
                      type="button"
                      key={size}
                      className={`quick-view-size-btn ${
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

            <div className="quick-view-actions">
              <button
                type="button"
                className="quick-view-cart-btn"
                onClick={() => onAddToCart(product)}
                disabled={product.inStock === false}
              >
                <i className="fa fa-shopping-bag"></i>
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                className="quick-view-wishlist-btn"
                onClick={() => onToggleWishlist(product)}
              >
                <i className={isWishlisted ? "fa fa-heart" : "far fa-heart"}></i>
                <span>{isWishlisted ? "Saved" : "Wishlist"}</span>
              </button>
            </div>

            <div className="quick-view-footer-actions">
              <Link to={`/product/${product.id}`} className="quick-view-full-link">
                <i className="fa fa-eye"></i>
                <span>View Full Product</span>
              </Link>

              <Link to={`/product/${product.id}`} className="quick-view-buy-link">
                <i className="fa fa-bolt"></i>
                <span>Buy Now</span>
              </Link>
            </div>

            <div className="quick-view-note">
              <i className="fa fa-shield"></i>
              <span>Secure checkout, premium quality, and easy returns.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;