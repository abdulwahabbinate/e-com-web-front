import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { Navbar, Footer } from "../components";
import { replaceCart } from "../redux/action";
import { paymentSettingService } from "../services/paymentSettingService";
import { productService } from "../services/productService";
import { orderService } from "../services/orderService";
import { stripePaymentService } from "../services/stripePaymentService";
import StripePaymentForm from "../components/StripePaymentForm";
import "./Checkout.css";

const FIELD_MAP = {
  first_name: "firstName",
  last_name: "lastName",
  email: "email",
  phone: "phone",
  country: "country",
  city: "city",
  address: "address",
  postal_code: "postalCode",
  payment_method: "paymentMethod",
  stripe_payment_intent_id: "paymentMethod",
};

const mapBackendErrors = (backendErrors = []) => {
  const mappedErrors = {};

  if (!Array.isArray(backendErrors)) return mappedErrors;

  backendErrors.forEach((err) => {
    const fieldName = FIELD_MAP[err?.field];
    if (fieldName) {
      mappedErrors[fieldName] = err.message;
    }
  });

  return mappedErrors;
};

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const buildFailureHtml = (message, data) => {
  const failedRecipients = Array.isArray(data?.failed_recipients)
    ? data.failed_recipients
    : [];

  if (!failedRecipients.length) {
    return `<div style="line-height:1.75;">${escapeHtml(message)}</div>`;
  }

  return `
    <div style="text-align:left;line-height:1.7;">
      <div style="margin-bottom:10px;">${escapeHtml(message)}</div>
      <div style="font-weight:800;margin-bottom:8px;">Failed email recipients:</div>
      <ul style="padding-left:20px;margin:0;">
        ${failedRecipients
          .map(
            (item) => `
              <li style="margin-bottom:8px;">
                <strong>${escapeHtml(item.recipient || "recipient")}</strong>
                ${item.email ? `(${escapeHtml(item.email)})` : ""}:
                ${escapeHtml(item.reason || "Unknown error")}
              </li>
            `
          )
          .join("")}
      </ul>
    </div>
  `;
};

const showCheckoutLoader = (title, text) => {
  Swal.fire({
    title,
    text,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

const closeCheckoutLoader = () => {
  Swal.close();
};

const showCheckoutError = async ({ title, message, data }) => {
  await Swal.fire({
    icon: "error",
    title,
    html: buildFailureHtml(message, data),
    confirmButtonColor: "#0f172a",
    width: 620,
  });
};

const StripeSubmitHandler = ({
  beforeConfirm,
  onSuccess,
  disabled,
  onFailure,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleStripePayment = async () => {
    if (processing || disabled) return;

    try {
      setProcessing(true);

      showCheckoutLoader(
        "Processing your order...",
        "Please wait while we confirm payment, save the order, and deliver confirmation emails."
      );

      const canProceed = await beforeConfirm();
      if (!canProceed) {
        closeCheckoutLoader();
        return;
      }

      if (!stripe || !elements) {
        throw new Error("Stripe is still loading");
      }

      const submitResult = await elements.submit();

      if (submitResult?.error) {
        throw new Error(
          submitResult.error.message || "Please complete payment details"
        );
      }

      const confirmResult = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (confirmResult?.error) {
        throw new Error(confirmResult.error.message || "Payment failed");
      }

      const paymentIntent = confirmResult?.paymentIntent;

      if (!paymentIntent?.id) {
        throw new Error("Payment confirmation failed");
      }

      if (paymentIntent.status !== "succeeded") {
        throw new Error("Payment is not completed yet");
      }

      await onSuccess(paymentIntent.id);
    } catch (error) {
      closeCheckoutLoader();

      if (!error?.__handled) {
        await showCheckoutError({
          title: "Checkout failed",
          message:
            error?.message ||
            "Something went wrong while processing payment.",
          data: error?.response?.data,
        });
      }

      if (typeof onFailure === "function") {
        onFailure(error);
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <button
      type="button"
      className="premium-checkout-place-btn"
      onClick={handleStripePayment}
      disabled={disabled || processing || !stripe || !elements}
    >
      <i className="fa fa-check-circle"></i>
      <span>{disabled || processing ? "Placing Order..." : "Place Order"}</span>
    </button>
  );
};

const CheckoutInner = ({
  paymentSettings,
  clientSecret,
  hasStripeContext,
  cardPaymentReady,
  stripeErrorMessage,
}) => {
  const cartItems = useSelector((state) => state.handleCart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [placingOrder, setPlacingOrder] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    address: "",
    postalCode: "",
    paymentMethod: paymentSettings.cash_on_delivery_enabled ? "cod" : "card",
    notes: "",
  });

  useEffect(() => {
    if (
      !paymentSettings.cash_on_delivery_enabled &&
      formData.paymentMethod === "cod"
    ) {
      setFormData((prev) => ({
        ...prev,
        paymentMethod: "card",
      }));
    }

    if (
      !paymentSettings.card_payment_enabled &&
      formData.paymentMethod === "card"
    ) {
      setFormData((prev) => ({
        ...prev,
        paymentMethod: paymentSettings.cash_on_delivery_enabled ? "cod" : "",
      }));
    }
  }, [
    paymentSettings.cash_on_delivery_enabled,
    paymentSettings.card_payment_enabled,
    formData.paymentMethod,
  ]);

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

  const isValidEmail = (email = "") => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhone = (phone = "") => {
    const sanitizedPhone = String(phone).replace(/[\s\-()+]/g, "");
    return /^[0-9]{10,15}$/.test(sanitizedPhone);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!isValidPhone(formData.phone.trim())) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.country.trim()) newErrors.country = "Country is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.postalCode.trim()) newErrors.postalCode = "Postal code is required";

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = "Payment method is required";
    }

    if (formData.paymentMethod === "cod" && !paymentSettings.cash_on_delivery_enabled) {
      newErrors.paymentMethod = "Cash on delivery is currently unavailable";
    }

    if (formData.paymentMethod === "card" && !paymentSettings.card_payment_enabled) {
      newErrors.paymentMethod = "Card payment is currently unavailable";
    }

    if (formData.paymentMethod === "card" && !cardPaymentReady) {
      newErrors.paymentMethod =
        stripeErrorMessage || "Card payment is not ready yet";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const syncCartWithLatestStock = async () => {
    const ids = cartItems.map((item) => item._id || item.id).filter(Boolean);

    if (!ids.length) return { valid: false };

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
      return { valid: false };
    }

    return { valid: true };
  };

  const beforeConfirmCardPayment = async () => {
    if (placingOrder) return false;

    try {
      const valid = validateForm();
      if (!valid) return false;

      setPlacingOrder(true);

      const syncResult = await syncCartWithLatestStock();
      if (!syncResult.valid) {
        setPlacingOrder(false);
        return false;
      }

      return true;
    } catch (error) {
      setPlacingOrder(false);
      throw error;
    }
  };

  const buildOrderPayload = (stripePaymentIntentId = "") => {
    return {
      first_name: formData.firstName.trim(),
      last_name: formData.lastName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      country: formData.country.trim(),
      city: formData.city.trim(),
      address: formData.address.trim(),
      postal_code: formData.postalCode.trim(),
      notes: formData.notes.trim(),
      payment_method: formData.paymentMethod,
      stripe_payment_intent_id: stripePaymentIntentId,
      items: cartItems.map((item) => ({
        product_id: item._id || item.id,
        qty: Number(item.qty || 1),
      })),
    };
  };

  const finalizeOrder = async (stripePaymentIntentId = "") => {
    try {
      const payload = buildOrderPayload(stripePaymentIntentId);
      const result = await orderService.createOrder(payload);

      closeCheckoutLoader();
      dispatch(replaceCart([]));

      navigate("/order-success", {
        state: {
          orderNumber: result?.data?.order_number || "",
          total: result?.data?.total || 0,
          paymentStatus: result?.data?.payment_status || "pending",
        },
        replace: true,
      });

      return result;
    } catch (error) {
      closeCheckoutLoader();
      setErrors(mapBackendErrors(error?.response?.errors));
      error.__handled = true;

      const alreadyPlaced = error?.response?.data?.order_already_placed;

      await showCheckoutError({
        title: alreadyPlaced
          ? "Order placed, but email delivery is pending"
          : "Failed to place order",
        message:
          error?.message ||
          "Something went wrong while finalizing your order.",
        data: error?.response?.data,
      });

      throw error;
    }
  };

  const handleCodOrder = async () => {
    if (placingOrder) return;

    const valid = validateForm();
    if (!valid) return;

    try {
      setPlacingOrder(true);

      showCheckoutLoader(
        "Placing your order...",
        "Please wait while we save the order and deliver confirmation emails."
      );

      const syncResult = await syncCartWithLatestStock();
      if (!syncResult.valid) {
        closeCheckoutLoader();
        return;
      }

      await finalizeOrder("");
    } catch (error) {
      if (!error?.__handled) {
        closeCheckoutLoader();
        await showCheckoutError({
          title: "Checkout failed",
          message: error?.message || "Failed to place order",
          data: error?.response?.data,
        });
      }
    } finally {
      setPlacingOrder(false);
    }
  };

  const handleStripeOrder = async (stripePaymentIntentId) => {
    try {
      await finalizeOrder(stripePaymentIntentId);
    } catch (error) {
      setPlacingOrder(false);
      throw error;
    }
  };

  const handleStripeFailure = () => {
    setPlacingOrder(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
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
                        className={`premium-field-input ${
                          errors.firstName ? "is-invalid" : ""
                        }`}
                        placeholder="Enter first name"
                      />
                      {errors.firstName && (
                        <small className="text-danger">{errors.firstName}</small>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label className="premium-field-label">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`premium-field-input ${
                          errors.lastName ? "is-invalid" : ""
                        }`}
                        placeholder="Enter last name"
                      />
                      {errors.lastName && (
                        <small className="text-danger">{errors.lastName}</small>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label className="premium-field-label">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`premium-field-input ${
                          errors.email ? "is-invalid" : ""
                        }`}
                        placeholder="Enter email address"
                      />
                      {errors.email && (
                        <small className="text-danger">{errors.email}</small>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label className="premium-field-label">Phone Number</label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`premium-field-input ${
                          errors.phone ? "is-invalid" : ""
                        }`}
                        placeholder="Enter phone number"
                      />
                      {errors.phone && (
                        <small className="text-danger">{errors.phone}</small>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label className="premium-field-label">Country</label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className={`premium-field-input ${
                          errors.country ? "is-invalid" : ""
                        }`}
                        placeholder="Enter country"
                      />
                      {errors.country && (
                        <small className="text-danger">{errors.country}</small>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label className="premium-field-label">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`premium-field-input ${
                          errors.city ? "is-invalid" : ""
                        }`}
                        placeholder="Enter city"
                      />
                      {errors.city && (
                        <small className="text-danger">{errors.city}</small>
                      )}
                    </div>

                    <div className="col-md-8">
                      <label className="premium-field-label">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={`premium-field-input ${
                          errors.address ? "is-invalid" : ""
                        }`}
                        placeholder="Enter street address"
                      />
                      {errors.address && (
                        <small className="text-danger">{errors.address}</small>
                      )}
                    </div>

                    <div className="col-md-4">
                      <label className="premium-field-label">Postal Code</label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className={`premium-field-input ${
                          errors.postalCode ? "is-invalid" : ""
                        }`}
                        placeholder="Postal code"
                      />
                      {errors.postalCode && (
                        <small className="text-danger">{errors.postalCode}</small>
                      )}
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
                    <label
                      className={`premium-payment-option ${
                        formData.paymentMethod === "card" ? "active" : ""
                      } ${!paymentSettings.card_payment_enabled ? "disabled" : ""}`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === "card"}
                        onChange={handleChange}
                        disabled={!paymentSettings.card_payment_enabled}
                      />
                      <div>
                        <strong>Credit / Debit Card</strong>
                        <span>
                          {paymentSettings.gateway_name
                            ? `Pay securely with ${paymentSettings.gateway_name}${
                                paymentSettings.sandbox_mode ? " (Sandbox)" : ""
                              }`
                            : "Fast and secure payment"}
                        </span>
                      </div>
                    </label>

                    <label
                      className={`premium-payment-option ${
                        formData.paymentMethod === "cod" ? "active" : ""
                      } ${
                        !paymentSettings.cash_on_delivery_enabled ? "disabled" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === "cod"}
                        onChange={handleChange}
                        disabled={!paymentSettings.cash_on_delivery_enabled}
                      />
                      <div>
                        <strong>Cash on Delivery</strong>
                        <span>
                          {paymentSettings.cash_on_delivery_enabled
                            ? "Pay when your order arrives"
                            : "Currently unavailable"}
                        </span>
                      </div>
                    </label>

                    {errors.paymentMethod && (
                      <small className="text-danger">{errors.paymentMethod}</small>
                    )}
                  </div>

                  {formData.paymentMethod === "card" && stripeErrorMessage ? (
                    <div className="alert alert-danger mt-3 mb-0">
                      {stripeErrorMessage}
                    </div>
                  ) : null}

                  {formData.paymentMethod === "card" &&
                  hasStripeContext &&
                  clientSecret &&
                  cardPaymentReady ? (
                    <StripePaymentForm />
                  ) : null}
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
                    <div className="premium-checkout-item" key={item.id || item._id}>
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
                  <span>
                    Your personal data is protected with secure checkout and
                    premium order confirmation emails.
                  </span>
                </div>

                {formData.paymentMethod === "card" ? (
                  cardPaymentReady && hasStripeContext ? (
                    <StripeSubmitHandler
                      beforeConfirm={beforeConfirmCardPayment}
                      onSuccess={handleStripeOrder}
                      disabled={placingOrder}
                      onFailure={handleStripeFailure}
                    />
                  ) : (
                    <button
                      type="button"
                      className="premium-checkout-place-btn"
                      disabled
                    >
                      <i className="fa fa-check-circle"></i>
                      <span>
                        {stripeErrorMessage ? "Card Payment Unavailable" : "Loading Payment..."}
                      </span>
                    </button>
                  )
                ) : (
                  <button
                    type="button"
                    className="premium-checkout-place-btn"
                    onClick={handleCodOrder}
                    disabled={placingOrder}
                  >
                    <i className="fa fa-check-circle"></i>
                    <span>{placingOrder ? "Placing Order..." : "Place Order"}</span>
                  </button>
                )}

                <Link to="/cart" className="premium-checkout-back-btn">
                  <i className="fa fa-arrow-left"></i>
                  <span>Back to Cart</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

const Checkout = () => {
  const cartItems = useSelector((state) => state.handleCart);

  const [paymentSettings, setPaymentSettings] = useState({
    cash_on_delivery_enabled: false,
    card_payment_enabled: true,
    gateway_name: "stripe",
    sandbox_mode: true,
    stripe_publishable_key: "",
  });

  const [clientSecret, setClientSecret] = useState("");
  const [stripeInstance, setStripeInstance] = useState(null);
  const [stripeErrorMessage, setStripeErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const resolvedPublishableKey = useMemo(() => {
    return String(
      paymentSettings?.stripe_publishable_key ||
        process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY ||
        ""
    ).trim();
  }, [paymentSettings]);

  useEffect(() => {
    let isMounted = true;

    const setupCheckout = async () => {
      try {
        setLoading(true);
        setClientSecret("");
        setStripeInstance(null);
        setStripeErrorMessage("");

        const settingsResult = await paymentSettingService.getPublicPaymentSettings();
        const settings = settingsResult?.data || {};

        if (!isMounted) return;

        setPaymentSettings(settings);

        if (!settings.card_payment_enabled) {
          return;
        }

        const publishableKey = String(
          settings.stripe_publishable_key ||
            process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY ||
            ""
        ).trim();

        if (!publishableKey || !publishableKey.startsWith("pk_")) {
          throw new Error(
            "Stripe publishable key is missing or invalid. Please update it from admin payment settings or frontend environment."
          );
        }

        const stripe = await loadStripe(publishableKey);

        if (!isMounted) return;

        if (!stripe) {
          throw new Error("Failed to initialize Stripe.");
        }

        setStripeInstance(stripe);

        if (cartItems.length > 0) {
          const paymentIntentResult =
            await stripePaymentService.createPaymentIntent({
              items: cartItems.map((item) => ({
                product_id: item._id || item.id,
                qty: Number(item.qty || 1),
              })),
            });

          if (!isMounted) return;

          const secret = paymentIntentResult?.data?.client_secret || "";

          if (!secret) {
            throw new Error("Failed to create payment intent.");
          }

          setClientSecret(secret);
        }
      } catch (error) {
        if (!isMounted) return;

        setStripeErrorMessage(
          error?.message ||
            "Failed to initialize checkout. Please try again."
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    setupCheckout();

    return () => {
      isMounted = false;
    };
  }, [cartItems]);

  const cardPaymentReady = Boolean(
    paymentSettings.card_payment_enabled &&
      resolvedPublishableKey &&
      stripeInstance &&
      clientSecret &&
      !stripeErrorMessage
  );

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container py-5">Loading checkout...</div>
        <Footer />
      </>
    );
  }

  if (cardPaymentReady) {
    return (
      <Elements
        stripe={stripeInstance}
        options={{
          clientSecret,
          appearance: {
            theme: "stripe",
            variables: {
              colorPrimary: "#0f172a",
              colorBackground: "#ffffff",
              colorText: "#0f172a",
              colorDanger: "#dc3545",
              borderRadius: "12px",
              fontFamily: "inherit",
            },
          },
        }}
      >
        <CheckoutInner
          paymentSettings={paymentSettings}
          clientSecret={clientSecret}
          hasStripeContext={true}
          cardPaymentReady={cardPaymentReady}
          stripeErrorMessage={stripeErrorMessage}
        />
      </Elements>
    );
  }

  return (
    <CheckoutInner
      paymentSettings={paymentSettings}
      clientSecret={clientSecret}
      hasStripeContext={false}
      cardPaymentReady={cardPaymentReady}
      stripeErrorMessage={stripeErrorMessage}
    />
  );
};

export default Checkout;