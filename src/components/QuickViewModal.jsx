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
      setActiveImage(0);
      setSelectedSize(product.sizes?.[0] || "");
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
      return product.images;
    }
    return product.image ? [product.image] : [];
  }, [product]);

  if (!isOpen || !product) return null;

  return (
    <div className="premium-quickview-overlay" onClick={onClose}>
      <div
        className="premium-quickview-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="premium-quickview-close"
          onClick={onClose}
          aria-label="Close quick view"
        >
          <i className="fa fa-times"></i>
        </button>

        <div className="premium-quickview-layout">
          <div className="premium-quickview-gallery">
            <div className="premium-quickview-main-image-wrap">
              <img
                src={imageGallery[activeImage]}
                alt={product.title}
                className="premium-quickview-main-image"
              />

              <div className="premium-quickview-badges">
                <span className="premium-quickview-discount">
                  -{product.discountPercent || 20}%
                </span>
                <span
                  className={`premium-quickview-stock ${
                    product.inStock === false ? "sold-out" : "in-stock"
                  }`}
                >
                  {product.inStock === false ? "Sold Out" : "In Stock"}
                </span>
              </div>
            </div>

            {imageGallery.length > 1 && (
              <div className="premium-quickview-thumbs">
                {imageGallery.slice(0, 5).map((img, index) => (
                  <button
                    type="button"
                    key={`${product.id}-quick-thumb-${index}`}
                    className={`premium-quickview-thumb ${
                      activeImage === index ? "active" : ""
                    }`}
                    onClick={() => setActiveImage(index)}
                  >
                    <img src={img} alt={`quick-thumb-${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="premium-quickview-content">
            <div className="premium-quickview-category">
              {product.category || "Fashion"}
            </div>

            <h2 className="premium-quickview-title">{product.title}</h2>

            <div className="premium-quickview-rating">
              <span className="premium-quickview-rating-chip">
                <i className="fa fa-star"></i>
                {product.rating?.rate || 4.8}
              </span>
              <span className="premium-quickview-rating-count">
                ({product.rating?.count || 120} reviews)
              </span>
            </div>

            <div className="premium-quickview-price-row">
              <span className="premium-quickview-sale-price">
                ${Number(product.price || 0).toFixed(2)}
              </span>
              <span className="premium-quickview-original-price">
                ${Number(product.originalPrice || 0).toFixed(2)}
              </span>
            </div>

            <p className="premium-quickview-description">
              {product.description}
            </p>

            <div className="premium-quickview-size-block">
              <div className="premium-quickview-size-head">
                <span>Select Size</span>
                {selectedSize && (
                  <span className="premium-quickview-selected-size">
                    {selectedSize}
                  </span>
                )}
              </div>

              <div className="premium-quickview-size-list">
                {(product.sizes || []).map((size) => (
                  <button
                    type="button"
                    key={`${product.id}-${size}`}
                    className={`premium-quickview-size-btn ${
                      selectedSize === size ? "active" : ""
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="premium-quickview-actions">
              <button
                type="button"
                className="premium-quickview-cart-btn"
                onClick={() => onAddToCart(product)}
                disabled={product.inStock === false}
              >
                <i className="fa fa-shopping-bag"></i>
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                className={`premium-quickview-wishlist-btn ${
                  isWishlisted ? "active" : ""
                }`}
                onClick={() => onToggleWishlist(product)}
              >
                <i className={`fa ${isWishlisted ? "fa-heart" : "fa-heart-o"}`}></i>
                <span>{isWishlisted ? "Saved" : "Wishlist"}</span>
              </button>
            </div>

            <div className="premium-quickview-footer-actions">
              <Link to={`/product/${product.id}`} className="premium-quickview-view-btn">
                View Full Product
              </Link>

              <Link to="/cart" className="premium-quickview-buy-btn">
                <i className="fa fa-bolt"></i>
                <span>Buy Now</span>
              </Link>
            </div>

            <div className="premium-quickview-note">
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