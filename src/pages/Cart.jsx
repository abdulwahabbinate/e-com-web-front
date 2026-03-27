import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Navbar, Footer } from "../components";
import { addCart, delCart, replaceCart } from "../redux/action";
import { productService } from "../services/productService";
import "./Cart.css";

const Cart = () => {
  const cartItems = useSelector((state) => state.handleCart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [syncing, setSyncing] = useState(false);

  const shipping = useMemo(() => {
    return cartItems.length > 0 ? 15 : 0;
  }, [cartItems]);

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + Number(item.price || 0) * Number(item.qty || 1),
      0
    );
  }, [cartItems]);

  const totalItems = useMemo(() => {
    return cartItems.reduce((total, item) => total + Number(item.qty || 1), 0);
  }, [cartItems]);

  const total = useMemo(() => {
    return subtotal + shipping;
  }, [subtotal, shipping]);

  const cartItemIdsKey = useMemo(() => {
    return cartItems
      .map((item) => item._id || item.id)
      .filter(Boolean)
      .join(",");
  }, [cartItems]);

  const getAvailableStock = (item) => {
    const stock = Number(item?.stock ?? 0);
    return Number.isNaN(stock) ? 0 : Math.max(stock, 0);
  };

  useEffect(() => {
    const syncCartWithLatestStock = async () => {
      try {
        if (!cartItems.length) return;

        setSyncing(true);

        const ids = cartItems
          .map((item) => item._id || item.id)
          .filter(Boolean);

        if (!ids.length) return;

        const result = await productService.getCartProducts(ids);
        const latestProducts = Array.isArray(result?.data) ? result.data : [];

        const latestMap = latestProducts.reduce((acc, item) => {
          acc[item._id] = item;
          return acc;
        }, {});

        const updatedCart = [];
        let hasChanges = false;

        cartItems.forEach((cartItem) => {
          const itemId = cartItem._id || cartItem.id;
          const latestProduct = latestMap[itemId];

          if (!latestProduct) {
            hasChanges = true;
            toast.error(
              `${cartItem.title} is no longer available and was removed from cart`
            );
            return;
          }

          const latestStock = Number(latestProduct.stock || 0);

          if (latestStock <= 0) {
            hasChanges = true;
            toast.error(`${latestProduct.title} is out of stock and was removed from cart`);
            return;
          }

          const safeQty = Math.min(Number(cartItem.qty || 1), latestStock);

          if (
            safeQty !== Number(cartItem.qty || 1) ||
            Number(cartItem.price || 0) !== Number(latestProduct.price || 0) ||
            Number(cartItem.stock || 0) !== latestStock
          ) {
            hasChanges = true;
          }

          if (safeQty < Number(cartItem.qty || 1)) {
            toast.error(
              `${latestProduct.title} quantity updated to ${safeQty} due to stock change`
            );
          }

          updatedCart.push({
            ...cartItem,
            _id: latestProduct._id,
            id: latestProduct._id,
            title: latestProduct.title,
            price: latestProduct.price,
            image: latestProduct.images?.[0] || cartItem.image || "",
            description:
              latestProduct.short_description ||
              latestProduct.description ||
              cartItem.description ||
              "",
            category: latestProduct.category_id?.name || cartItem.category || "",
            stock: latestStock,
            qty: safeQty,
          });
        });

        if (hasChanges) {
          dispatch(replaceCart(updatedCart));
        }
      } catch (error) {
        toast.error(error?.message || "Failed to sync cart with latest stock");
      } finally {
        setSyncing(false);
      }
    };

    syncCartWithLatestStock();
  }, [dispatch, cartItemIdsKey]);

  const handleAdd = (item) => {
    const availableStock = getAvailableStock(item);
    const currentQty = Number(item.qty || 1);

    if (availableStock <= 0) {
      toast.error("This product is out of stock");
      return;
    }

    if (currentQty >= availableStock) {
      toast.error(`Only ${availableStock} item(s) available in stock`);
      return;
    }

    dispatch(addCart(item));
  };

  const handleRemoveOne = (item) => {
    dispatch(delCart(item));
  };

  const handleRemoveCompletely = (item) => {
    const qty = Number(item.qty || 1);

    for (let i = 0; i < qty; i += 1) {
      dispatch(delCart(item));
    }

    toast.success("Product removed from cart");
  };

  const handleProceedToCheckout = async () => {
    try {
      if (!cartItems.length) {
        toast.error("Your cart is empty");
        return;
      }

      const ids = cartItems
        .map((item) => item._id || item.id)
        .filter(Boolean);

      const result = await productService.getCartProducts(ids);
      const latestProducts = Array.isArray(result?.data) ? result.data : [];

      const latestMap = latestProducts.reduce((acc, item) => {
        acc[item._id] = item;
        return acc;
      }, {});

      const updatedCart = [];
      let hasIssues = false;

      cartItems.forEach((cartItem) => {
        const itemId = cartItem._id || cartItem.id;
        const latestProduct = latestMap[itemId];

        if (!latestProduct) {
          hasIssues = true;
          toast.error(`${cartItem.title} is no longer available`);
          return;
        }

        const latestStock = Number(latestProduct.stock || 0);

        if (latestStock <= 0) {
          hasIssues = true;
          toast.error(`${latestProduct.title} is out of stock`);
          return;
        }

        const safeQty = Math.min(Number(cartItem.qty || 1), latestStock);

        if (safeQty !== Number(cartItem.qty || 1)) {
          hasIssues = true;
          toast.error(`${latestProduct.title} quantity adjusted due to stock change`);
        }

        updatedCart.push({
          ...cartItem,
          _id: latestProduct._id,
          id: latestProduct._id,
          title: latestProduct.title,
          price: latestProduct.price,
          image: latestProduct.images?.[0] || cartItem.image || "",
          description:
            latestProduct.short_description ||
            latestProduct.description ||
            cartItem.description ||
            "",
          category: latestProduct.category_id?.name || cartItem.category || "",
          stock: latestStock,
          qty: safeQty,
        });
      });

      if (hasIssues) {
        dispatch(replaceCart(updatedCart));
        return;
      }

      navigate("/checkout");
    } catch (error) {
      toast.error(error?.message || "Failed to validate stock before checkout");
    }
  };

  const EmptyCart = () => {
    return (
      <div className="premium-cart-page">
        <div className="container py-5">
          <div className="premium-cart-empty">
            <div className="premium-cart-empty-icon">
              <i className="fa fa-shopping-bag"></i>
            </div>
            <span className="premium-cart-badge">Your Cart</span>
            <h2>Your cart is empty</h2>
            <p>
              Looks like you have not added anything yet. Explore the premium
              collection and add your favorite products.
            </p>
            <Link to="/product" className="premium-cart-shop-btn">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const ShowCart = () => {
    return (
      <div className="premium-cart-page">
        <div className="container py-4 py-lg-5">
          <div className="premium-cart-header">
            <div>
              <span className="premium-cart-badge">Shopping Cart</span>
              <h2 className="premium-cart-title">Your Selected Products</h2>
              <p className="premium-cart-subtitle">
                Review your order, update quantities, and continue to checkout.
              </p>
            </div>

            <div className="premium-cart-header-box">
              <span>{totalItems}</span>
              <small>Items</small>
            </div>
          </div>

          {syncing ? (
            <div className="alert alert-info mb-4">Syncing latest stock...</div>
          ) : null}

          <div className="row g-4">
            <div className="col-xl-8">
              <div className="premium-cart-list-card">
                {cartItems.map((item) => {
                  const availableStock = getAvailableStock(item);
                  const currentQty = Number(item.qty || 1);
                  const isMaxReached = currentQty >= availableStock && availableStock > 0;
                  const isOutOfStock = availableStock <= 0;

                  return (
                    <div className="premium-cart-item" key={item.id || item._id}>
                      <div className="premium-cart-item-image-wrap">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="premium-cart-item-image"
                        />
                      </div>

                      <div className="premium-cart-item-content">
                        <div className="premium-cart-item-top">
                          <div>
                            <p className="premium-cart-item-category">
                              {item.category || "Fashion"}
                            </p>

                            <h5 className="premium-cart-item-title">{item.title}</h5>

                            <p className="premium-cart-item-desc">
                              {item.description?.length > 90
                                ? `${item.description.slice(0, 90)}...`
                                : item.description}
                            </p>
                          </div>

                          <button
                            type="button"
                            className="premium-cart-remove-btn"
                            onClick={() => handleRemoveCompletely(item)}
                            aria-label="Remove item"
                          >
                            <i className="fa fa-trash-o"></i>
                          </button>
                        </div>

                        <div className="premium-cart-item-bottom">
                          <div className="premium-cart-price-group">
                            <span className="premium-cart-price">
                              ${Number(item.price || 0).toFixed(2)}
                            </span>

                            <span
                              className="premium-cart-stock"
                              style={{
                                backgroundColor: isOutOfStock ? "#fee2e2" : "",
                                color: isOutOfStock ? "#b91c1c" : "",
                                borderColor: isOutOfStock ? "#fecaca" : "",
                              }}
                            >
                              {isOutOfStock
                                ? "Out of Stock"
                                : `${availableStock} In Stock`}
                            </span>
                          </div>

                          <div className="premium-cart-qty-wrap">
                            <button
                              type="button"
                              className="premium-cart-qty-btn"
                              onClick={() => handleRemoveOne(item)}
                            >
                              <i className="fa fa-minus"></i>
                            </button>

                            <span className="premium-cart-qty-value">{currentQty}</span>

                            <button
                              type="button"
                              className="premium-cart-qty-btn"
                              onClick={() => handleAdd(item)}
                              disabled={isOutOfStock || isMaxReached}
                              style={{
                                opacity: isOutOfStock || isMaxReached ? 0.5 : 1,
                                cursor:
                                  isOutOfStock || isMaxReached
                                    ? "not-allowed"
                                    : "pointer",
                              }}
                            >
                              <i className="fa fa-plus"></i>
                            </button>
                          </div>

                          <div className="premium-cart-line-total">
                            ${(Number(item.price || 0) * Number(currentQty)).toFixed(2)}
                          </div>
                        </div>

                        {!isOutOfStock && isMaxReached ? (
                          <small className="text-warning d-block mt-2 fw-semibold">
                            Maximum available stock reached
                          </small>
                        ) : null}

                        {isOutOfStock ? (
                          <small className="text-danger d-block mt-2 fw-semibold">
                            This product is currently out of stock
                          </small>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="premium-cart-actions-row">
                <Link to="/product" className="premium-cart-outline-btn">
                  <i className="fa fa-arrow-left me-2"></i>
                  Continue Shopping
                </Link>

                <Link to="/wishlist" className="premium-cart-outline-btn">
                  <i className="fa fa-heart-o me-2"></i>
                  View Wishlist
                </Link>
              </div>
            </div>

            <div className="col-xl-4">
              <div className="premium-cart-summary-card">
                <div className="premium-summary-header">
                  <span className="premium-cart-badge">Order Summary</span>
                  <h4>Checkout Overview</h4>
                </div>

                <div className="premium-summary-rows">
                  <div className="premium-summary-row">
                    <span>Subtotal</span>
                    <strong>${subtotal.toFixed(2)}</strong>
                  </div>

                  <div className="premium-summary-row">
                    <span>Shipping</span>
                    <strong>
                      {shipping > 0 ? `$${shipping.toFixed(2)}` : "Free"}
                    </strong>
                  </div>

                  <div className="premium-summary-row">
                    <span>Total Items</span>
                    <strong>{totalItems}</strong>
                  </div>

                  <div className="premium-summary-divider"></div>

                  <div className="premium-summary-row total">
                    <span>Total</span>
                    <strong>${total.toFixed(2)}</strong>
                  </div>
                </div>

                <div className="premium-summary-note">
                  <i className="fa fa-shield"></i>
                  <span>Secure checkout and easy 7-day return policy.</span>
                </div>

                <button
                  type="button"
                  className="premium-summary-primary-btn border-0"
                  onClick={handleProceedToCheckout}
                >
                  <i className="fa fa-bolt"></i>
                  <span>Proceed to Checkout</span>
                </button>

                <button type="button" className="premium-summary-secondary-btn">
                  <i className="fa fa-tag"></i>
                  <span>Apply Coupon</span>
                </button>

                <div className="premium-summary-payments">
                  <span>Accepted Payments</span>
                  <div className="premium-summary-payment-list">
                    <span>Visa</span>
                    <span>Mastercard</span>
                    <span>PayPal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      {cartItems.length > 0 ? <ShowCart /> : <EmptyCart />}
      <Footer />
    </>
  );
};

export default Cart;