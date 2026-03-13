import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Navbar, Footer } from "../components";
import { addCart, delCart } from "../redux/action";
import "./Cart.css";

const Cart = () => {
  const cartItems = useSelector((state) => state.handleCart) || [];
  const dispatch = useDispatch();

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

  const handleAdd = (item) => {
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

          <div className="row g-4">
            <div className="col-xl-8">
              <div className="premium-cart-list-card">
                {cartItems.map((item) => (
                  <div className="premium-cart-item" key={item.id}>
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
                          <h5 className="premium-cart-item-title">
                            {item.title}
                          </h5>
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
                          <span className="premium-cart-stock">
                            In Stock
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

                          <span className="premium-cart-qty-value">
                            {item.qty || 1}
                          </span>

                          <button
                            type="button"
                            className="premium-cart-qty-btn"
                            onClick={() => handleAdd(item)}
                          >
                            <i className="fa fa-plus"></i>
                          </button>
                        </div>

                        <div className="premium-cart-line-total">
                          ${(Number(item.price || 0) * Number(item.qty || 1)).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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

                <Link to="/checkout" className="premium-summary-primary-btn">
                  <i className="fa fa-bolt"></i>
                  <span>Proceed to Checkout</span>
                </Link>

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