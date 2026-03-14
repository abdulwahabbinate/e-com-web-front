import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./ProductCard.css";

const ProductCard = ({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onQuickView,
}) => {
  const [activeImage, setActiveImage] = useState(0);

  const imageGallery = useMemo(() => {
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images.filter(Boolean);
    }

    if (product.image) {
      return [product.image];
    }

    return [];
  }, [product]);

  const sizes = useMemo(() => {
    if (!Array.isArray(product.sizes)) return [];

    return product.sizes
      .map((size) => String(size || "").trim())
      .filter(Boolean);
  }, [product]);

  const salePrice = Number(product.price || 0);

  const originalPrice = useMemo(() => {
    if (product.originalPrice && Number(product.originalPrice) > salePrice) {
      return Number(product.originalPrice);
    }

    return null;
  }, [product, salePrice]);

  const discountPercent = useMemo(() => {
    if (product.discountPercent && Number(product.discountPercent) > 0) {
      return Number(product.discountPercent);
    }

    if (originalPrice && originalPrice > salePrice) {
      return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
    }

    return 0;
  }, [product, originalPrice, salePrice]);

  const hasDescription = Boolean(String(product.description || "").trim());
  const hasCategory = Boolean(String(product.category || "").trim());
  const hasSizes = sizes.length > 0;
  const hasDiscount = discountPercent > 0;
  const hasOriginalPrice = Boolean(originalPrice);
  const isOutOfStock = product.inStock === false;

  return (
    <div className="premium-product-card h-100">
      <div className="premium-product-media">
        <div className="premium-product-top-badges">
          {hasDiscount && (
            <span className="premium-discount-badge">-{discountPercent}%</span>
          )}

          <span
            className={`premium-stock-badge ${
              isOutOfStock ? "sold-out" : "in-stock"
            }`}
          >
            {isOutOfStock ? "Sold Out" : "In Stock"}
          </span>
        </div>

        <button
          type="button"
          className={`premium-wishlist-btn ${isWishlisted ? "active" : ""}`}
          onClick={() => onToggleWishlist(product)}
          aria-label="Toggle wishlist"
        >
          <i className={isWishlisted ? "fa fa-heart" : "far fa-heart"}></i>
        </button>

        <button
          type="button"
          className="premium-quickview-trigger"
          onClick={() => onQuickView(product)}
        >
          <i className="fa fa-eye"></i>
          <span>Quick View</span>
        </button>

        <Link to={`/product/${product.id}`} className="premium-product-image-link">
          <div className="premium-product-image-wrap">
            {imageGallery.length > 0 ? (
              <img
                src={imageGallery[activeImage]}
                alt={product.title}
                className="premium-product-image img-fluid"
              />
            ) : (
              <div className="premium-product-image-fallback">No Image</div>
            )}
          </div>
        </Link>

        {imageGallery.length > 1 && (
          <div className="premium-product-thumbs">
            {imageGallery.slice(0, 4).map((img, index) => (
              <button
                type="button"
                key={`${img}-${index}`}
                className={`premium-thumb-btn ${activeImage === index ? "active" : ""}`}
                onClick={() => setActiveImage(index)}
                aria-label={`Show image ${index + 1}`}
              >
                <img src={img} alt={`${product.title} ${index + 1}`} />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="premium-product-body">
        {hasCategory && <div className="premium-product-category">{product.category}</div>}

        <h5 className="premium-product-title">
          <Link to={`/product/${product.id}`}>{product.title}</Link>
        </h5>

        {hasDescription && (
          <p className="premium-product-description">
            {product.description.length > 74
              ? `${product.description.slice(0, 74)}...`
              : product.description}
          </p>
        )}

        <div className="premium-price-row">
          <span className="premium-sale-price">${salePrice.toFixed(2)}</span>

          {hasOriginalPrice && (
            <span className="premium-original-price">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {hasSizes && (
          <div className="premium-size-wrap">
            <span className="premium-size-label">Size</span>

            <div className="premium-size-list">
              {sizes.slice(0, 4).map((size) => (
                <span key={size} className="premium-size-chip">
                  {size}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="premium-product-actions">
          <button
            type="button"
            className="premium-add-cart-btn"
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
          >
            <i className="fa fa-shopping-bag"></i>
            <span>Add to Cart</span>
          </button>

          <Link
            to={`/product/${product.id}`}
            className={`premium-buy-now-btn ${isOutOfStock ? "disabled" : ""}`}
          >
            <i className="fa fa-bolt"></i>
            <span>Buy Now</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;