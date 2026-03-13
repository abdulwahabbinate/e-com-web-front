import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Footer } from "../components";
import "./Checkout.css";

const Checkout = () => {
  const cartItems = useSelector((state) => state.handleCart) || [];
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    address: "",
    postalCode: "",
    paymentMethod: "card",
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    notes: "",
  });

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

  const total = useMemo(() => subtotal + shipping, [subtotal, shipping]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Checkout Data:", formData);
    navigate("/order-success");
  };

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <div className="premium-checkout-page">
          <div className="container py-5">
            <div className="premium-checkout-empty">
              <div className="premium-checkout-empty-icon">
                <i className="fa fa-credit-card"></i>
              </div>
              <span className="premium-checkout-badge">Checkout</span>
              <h2>No items available for checkout</h2>
              <p>
                Your cart is empty right now. Add products to cart before moving
                to checkout.
              </p>
              <Link to="/product" className="premium-checkout-primary-btn">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="premium-checkout-page">
        <div className="container py-4 py-lg-5">
          <div className="premium-checkout-header">
            <div>
              <span className="premium-checkout-badge">Secure Checkout</span>
              <h2 className="premium-checkout-title">Complete Your Order</h2>
              <p className="premium-checkout-subtitle">
                Fill in your shipping and payment details to place your order.
              </p>
            </div>

            <div className="premium-checkout-header-box">
              <span>{totalItems}</span>
              <small>Items</small>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              <div className="col-xl-8">
                <div className="premium-checkout-form-card">
                  <div className="premium-checkout-section">
                    <div className="premium-checkout-section-head">
                      <h4>Shipping Information</h4>
                      <p>Enter your personal and delivery details</p>
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="premium-field-label">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="premium-field-input"
                          placeholder="Enter first name"
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="premium-field-label">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="premium-field-input"
                          placeholder="Enter last name"
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="premium-field-label">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="premium-field-input"
                          placeholder="Enter email address"
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="premium-field-label">Phone Number</label>
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="premium-field-input"
                          placeholder="Enter phone number"
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="premium-field-label">Country</label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className="premium-field-input"
                          placeholder="Enter country"
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="premium-field-label">City</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="premium-field-input"
                          placeholder="Enter city"
                        />
                      </div>

                      <div className="col-md-8">
                        <label className="premium-field-label">Address</label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="premium-field-input"
                          placeholder="Enter street address"
                        />
                      </div>

                      <div className="col-md-4">
                        <label className="premium-field-label">Postal Code</label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleChange}
                          className="premium-field-input"
                          placeholder="Postal code"
                        />
                      </div>

                      <div className="col-12">
                        <label className="premium-field-label">Order Notes</label>
                        <textarea
                          name="notes"
                          value={formData.notes}
                          onChange={handleChange}
                          className="premium-field-input premium-field-textarea"
                          placeholder="Add delivery notes or special instructions"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="premium-checkout-section">
                    <div className="premium-checkout-section-head">
                      <h4>Payment Method</h4>
                      <p>Select how you want to pay</p>
                    </div>

                    <div className="premium-payment-options">
                      <label className={`premium-payment-option ${formData.paymentMethod === "card" ? "active" : ""}`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={formData.paymentMethod === "card"}
                          onChange={handleChange}
                        />
                        <div>
                          <strong>Credit / Debit Card</strong>
                          <span>Fast and secure payment</span>
                        </div>
                      </label>

                      <label className={`premium-payment-option ${formData.paymentMethod === "cod" ? "active" : ""}`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={formData.paymentMethod === "cod"}
                          onChange={handleChange}
                        />
                        <div>
                          <strong>Cash on Delivery</strong>
                          <span>Pay when your order arrives</span>
                        </div>
                      </label>
                    </div>

                    {formData.paymentMethod === "card" && (
                      <div className="row g-3 mt-1">
                        <div className="col-12">
                          <label className="premium-field-label">Cardholder Name</label>
                          <input
                            type="text"
                            name="cardName"
                            value={formData.cardName}
                            onChange={handleChange}
                            className="premium-field-input"
                            placeholder="Name on card"
                          />
                        </div>

                        <div className="col-12">
                          <label className="premium-field-label">Card Number</label>
                          <input
                            type="text"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleChange}
                            className="premium-field-input"
                            placeholder="1234 5678 9012 3456"
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="premium-field-label">Expiry Date</label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleChange}
                            className="premium-field-input"
                            placeholder="MM/YY"
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="premium-field-label">CVV</label>
                          <input
                            type="password"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleChange}
                            className="premium-field-input"
                            placeholder="***"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-xl-4">
                <div className="premium-checkout-summary-card">
                  <div className="premium-summary-head">
                    <span className="premium-checkout-badge">Order Summary</span>
                    <h4>Review Your Order</h4>
                  </div>

                  <div className="premium-checkout-items">
                    {cartItems.map((item) => (
                      <div className="premium-checkout-item" key={item.id}>
                        <div className="premium-checkout-item-image-wrap">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="premium-checkout-item-image"
                          />
                        </div>

                        <div className="premium-checkout-item-content">
                          <h6>
                            {item.title?.length > 38
                              ? `${item.title.slice(0, 38)}...`
                              : item.title}
                          </h6>
                          <p>Qty: {item.qty || 1}</p>
                        </div>

                        <div className="premium-checkout-item-price">
                          ${(Number(item.price || 0) * Number(item.qty || 1)).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="premium-checkout-summary-rows">
                    <div className="premium-checkout-summary-row">
                      <span>Subtotal</span>
                      <strong>${subtotal.toFixed(2)}</strong>
                    </div>

                    <div className="premium-checkout-summary-row">
                      <span>Shipping</span>
                      <strong>${shipping.toFixed(2)}</strong>
                    </div>

                    <div className="premium-checkout-summary-row">
                      <span>Total Items</span>
                      <strong>{totalItems}</strong>
                    </div>

                    <div className="premium-checkout-divider"></div>

                    <div className="premium-checkout-summary-row total">
                      <span>Total</span>
                      <strong>${total.toFixed(2)}</strong>
                    </div>
                  </div>

                  <div className="premium-checkout-note">
                    <i className="fa fa-lock"></i>
                    <span>Your personal data is protected with secure checkout.</span>
                  </div>

                  <button type="submit" className="premium-checkout-place-btn">
                    <i className="fa fa-check-circle"></i>
                    <span>Place Order</span>
                  </button>

                  <Link to="/cart" className="premium-checkout-back-btn">
                    <i className="fa fa-arrow-left"></i>
                    <span>Back to Cart</span>
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Checkout;