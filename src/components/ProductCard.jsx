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
    if (Array.isArray(product.sizes) && product.sizes.length > 0) {
      return product.sizes;
    }
    return ["S", "M", "L"];
  }, [product]);

  const salePrice = Number(product.price || 0);

  const originalPrice = useMemo(() => {
    if (product.originalPrice) return Number(product.originalPrice).toFixed(2);
    return (salePrice * 1.2).toFixed(2);
  }, [product, salePrice]);

  const discountPercent = useMemo(() => {
    if (product.discountPercent) return product.discountPercent;

    const original = Number(originalPrice || 0);
    if (!original || original <= salePrice) return 20;
    return Math.round(((original - salePrice) / original) * 100);
  }, [product, originalPrice, salePrice]);

  const stockLabel = product.inStock === false ? "Sold Out" : "In Stock";
  const stockClass = product.inStock === false ? "sold-out" : "in-stock";

  return (
    <div className="premium-product-card h-100">
      <div className="premium-product-media">
        <div className="premium-product-top-badges">
          <span className="premium-discount-badge">-{discountPercent}%</span>
          <span className={`premium-stock-badge ${stockClass}`}>{stockLabel}</span>
        </div>

        <button
          type="button"
          className={`premium-wishlist-btn ${isWishlisted ? "active" : ""}`}
          onClick={() => onToggleWishlist(product)}
          aria-label="Toggle wishlist"
        >
          <i className={`fa ${isWishlisted ? "fa-heart" : "fa-heart-o"}`}></i>
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
                className="premium-product-image"
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
                key={`${product.id}-thumb-${index}`}
                className={`premium-thumb-btn ${activeImage === index ? "active" : ""}`}
                onClick={() => setActiveImage(index)}
                aria-label={`Show image ${index + 1}`}
              >
                <img src={img} alt={`thumb-${index + 1}`} />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="premium-product-body">
        <div className="premium-product-category">
          {product.category || "Fashion"}
        </div>

        <h5 className="premium-product-title">
          <Link to={`/product/${product.id}`}>{product.title}</Link>
        </h5>

        <p className="premium-product-description">
          {product.description?.length > 72
            ? `${product.description.slice(0, 72)}...`
            : product.description}
        </p>

        <div className="premium-price-row">
          <span className="premium-sale-price">${salePrice.toFixed(2)}</span>
          <span className="premium-original-price">${originalPrice}</span>
        </div>

        <div className="premium-size-wrap">
          <span className="premium-size-label">Size</span>
          <div className="premium-size-list">
            {sizes.slice(0, 4).map((size) => (
              <span key={`${product.id}-${size}`} className="premium-size-chip">
                {size}
              </span>
            ))}
          </div>
        </div>

        <div className="premium-product-actions">
          <button
            type="button"
            className="premium-add-cart-btn"
            onClick={() => onAddToCart(product)}
            disabled={product.inStock === false}
          >
            <i className="fa fa-shopping-bag"></i>
            <span>Add to Cart</span>
          </button>

          <Link
            to={`/product/${product.id}`}
            className={`premium-buy-now-btn ${product.inStock === false ? "disabled" : ""}`}
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