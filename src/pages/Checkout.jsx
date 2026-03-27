import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
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

// const StripeSubmitHandler = ({ onSuccess, disabled }) => {
//   const stripe = useStripe();
//   const elements = useElements();

//   const handleStripePayment = async () => {
//     if (!stripe || !elements) {
//       throw new Error("Stripe is still loading");
//     }

//     const confirmResult = await stripe.confirmPayment({
//       elements,
//       redirect: "if_required",
//     });

//     if (confirmResult.error) {
//       throw new Error(confirmResult.error.message || "Payment failed");
//     }

//     const paymentIntentId = confirmResult.paymentIntent?.id || "";

//     if (!paymentIntentId) {
//       throw new Error("Payment confirmation failed");
//     }

//     await onSuccess(paymentIntentId);
//   };

//   return (
//     <button
//       type="button"
//       className="premium-checkout-place-btn"
//       onClick={handleStripePayment}
//       disabled={disabled || !stripe || !elements}
//     >
//       <i className="fa fa-check-circle"></i>
//       <span>{disabled ? "Placing Order..." : "Place Order"}</span>
//     </button>
//   );
// };

const StripeSubmitHandler = ({ onSuccess, disabled }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleStripePayment = async () => {
    try {
      if (!stripe || !elements) {
        toast.error("Stripe is still loading");
        return;
      }

      const confirmResult = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (confirmResult.error) {
        toast.error(confirmResult.error.message || "Payment failed");
        return;
      }

      const paymentIntentId = confirmResult.paymentIntent?.id || "";

      if (!paymentIntentId) {
        toast.error("Payment confirmation failed");
        return;
      }

      await onSuccess(paymentIntentId);
    } catch (error) {
      toast.error(error?.message || "Something went wrong while processing payment");
    }
  };

  return (
    <button
      type="button"
      className="premium-checkout-place-btn"
      onClick={handleStripePayment}
      disabled={disabled || !stripe || !elements}
    >
      <i className="fa fa-check-circle"></i>
      <span>{disabled ? "Placing Order..." : "Place Order"}</span>
    </button>
  );
};

const CheckoutInner = ({ paymentSettings, clientSecret, hasStripeContext }) => {
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
    if (!paymentSettings.cash_on_delivery_enabled && formData.paymentMethod === "cod") {
      setFormData((prev) => ({
        ...prev,
        paymentMethod: "card",
      }));
    }
  }, [paymentSettings.cash_on_delivery_enabled, formData.paymentMethod]);

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

    if (formData.paymentMethod === "card" && !clientSecret) {
      newErrors.paymentMethod = "Card payment is not ready yet";
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

  const buildOrderPayload = (stripePaymentIntentId = "") => {
    return {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      country: formData.country,
      city: formData.city,
      address: formData.address,
      postal_code: formData.postalCode,
      notes: formData.notes,
      payment_method: formData.paymentMethod,
      stripe_payment_intent_id: stripePaymentIntentId,
      items: cartItems.map((item) => ({
        product_id: item._id || item.id,
        qty: Number(item.qty || 1),
      })),
    };
  };

  const finalizeOrder = async (stripePaymentIntentId = "") => {
    const payload = buildOrderPayload(stripePaymentIntentId);
    const result = await orderService.createOrder(payload);

    dispatch(replaceCart([]));

    navigate("/order-success", {
      state: {
        orderNumber: result?.data?.order_number || "",
        total: result?.data?.total || 0,
        paymentStatus: result?.data?.payment_status || "pending",
      },
    });
  };

  const handleCodOrder = async () => {
    if (!validateForm()) return;

    try {
      setPlacingOrder(true);

      const syncResult = await syncCartWithLatestStock();
      if (!syncResult.valid) return;

      await finalizeOrder("");
    } catch (error) {
      const backendErrors = error?.response?.errors || [];
      const mappedErrors = {};

      if (Array.isArray(backendErrors)) {
        backendErrors.forEach((err) => {
          if (err?.field === "first_name") mappedErrors.firstName = err.message;
          if (err?.field === "last_name") mappedErrors.lastName = err.message;
          if (err?.field === "email") mappedErrors.email = err.message;
          if (err?.field === "phone") mappedErrors.phone = err.message;
          if (err?.field === "country") mappedErrors.country = err.message;
          if (err?.field === "city") mappedErrors.city = err.message;
          if (err?.field === "address") mappedErrors.address = err.message;
          if (err?.field === "postal_code") mappedErrors.postalCode = err.message;
          if (err?.field === "payment_method") mappedErrors.paymentMethod = err.message;
        });
      }

      setErrors(mappedErrors);
      toast.error(error?.message || "Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  const handleStripeOrder = async (stripePaymentIntentId) => {
    if (!validateForm()) return;

    try {
      setPlacingOrder(true);

      const syncResult = await syncCartWithLatestStock();
      if (!syncResult.valid) return;

      await finalizeOrder(stripePaymentIntentId);
    } catch (error) {
      const backendErrors = error?.response?.errors || [];
      const mappedErrors = {};

      if (Array.isArray(backendErrors)) {
        backendErrors.forEach((err) => {
          if (err?.field === "first_name") mappedErrors.firstName = err.message;
          if (err?.field === "last_name") mappedErrors.lastName = err.message;
          if (err?.field === "email") mappedErrors.email = err.message;
          if (err?.field === "phone") mappedErrors.phone = err.message;
          if (err?.field === "country") mappedErrors.country = err.message;
          if (err?.field === "city") mappedErrors.city = err.message;
          if (err?.field === "address") mappedErrors.address = err.message;
          if (err?.field === "postal_code") mappedErrors.postalCode = err.message;
          if (err?.field === "payment_method") mappedErrors.paymentMethod = err.message;
        });
      }

      setErrors(mappedErrors);
      toast.error(error?.message || "Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
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
                        className={`premium-field-input ${errors.firstName ? "is-invalid" : ""}`}
                        placeholder="Enter first name"
                      />
                      {errors.firstName && <small className="text-danger">{errors.firstName}</small>}
                    </div>

                    <div className="col-md-6">
                      <label className="premium-field-label">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`premium-field-input ${errors.lastName ? "is-invalid" : ""}`}
                        placeholder="Enter last name"
                      />
                      {errors.lastName && <small className="text-danger">{errors.lastName}</small>}
                    </div>

                    <div className="col-md-6">
                      <label className="premium-field-label">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`premium-field-input ${errors.email ? "is-invalid" : ""}`}
                        placeholder="Enter email address"
                      />
                      {errors.email && <small className="text-danger">{errors.email}</small>}
                    </div>

                    <div className="col-md-6">
                      <label className="premium-field-label">Phone Number</label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`premium-field-input ${errors.phone ? "is-invalid" : ""}`}
                        placeholder="Enter phone number"
                      />
                      {errors.phone && <small className="text-danger">{errors.phone}</small>}
                    </div>

                    <div className="col-md-6">
                      <label className="premium-field-label">Country</label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className={`premium-field-input ${errors.country ? "is-invalid" : ""}`}
                        placeholder="Enter country"
                      />
                      {errors.country && <small className="text-danger">{errors.country}</small>}
                    </div>

                    <div className="col-md-6">
                      <label className="premium-field-label">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`premium-field-input ${errors.city ? "is-invalid" : ""}`}
                        placeholder="Enter city"
                      />
                      {errors.city && <small className="text-danger">{errors.city}</small>}
                    </div>

                    <div className="col-md-8">
                      <label className="premium-field-label">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={`premium-field-input ${errors.address ? "is-invalid" : ""}`}
                        placeholder="Enter street address"
                      />
                      {errors.address && <small className="text-danger">{errors.address}</small>}
                    </div>

                    <div className="col-md-4">
                      <label className="premium-field-label">Postal Code</label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className={`premium-field-input ${errors.postalCode ? "is-invalid" : ""}`}
                        placeholder="Postal code"
                      />
                      {errors.postalCode && <small className="text-danger">{errors.postalCode}</small>}
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
                            ? `Pay securely with ${paymentSettings.gateway_name}${paymentSettings.sandbox_mode ? " (Sandbox)" : ""}`
                            : "Fast and secure payment"}
                        </span>
                      </div>
                    </label>

                    <label
                      className={`premium-payment-option ${
                        formData.paymentMethod === "cod" ? "active" : ""
                      } ${!paymentSettings.cash_on_delivery_enabled ? "disabled" : ""}`}
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

                  {formData.paymentMethod === "card" && hasStripeContext && clientSecret ? (
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
                  <span>Your personal data is protected with secure checkout.</span>
                </div>

                {formData.paymentMethod === "card" ? (
                  hasStripeContext && clientSecret ? (
                    <StripeSubmitHandler
                      onSuccess={handleStripeOrder}
                      disabled={placingOrder}
                    />
                  ) : (
                    <button
                      type="button"
                      className="premium-checkout-place-btn"
                      disabled
                    >
                      <i className="fa fa-check-circle"></i>
                      <span>Loading Payment...</span>
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setupCheckout = async () => {
      try {
        const settingsResult = await paymentSettingService.getPublicPaymentSettings();
        const settings = settingsResult?.data || {};
        setPaymentSettings(settings);

        if (settings.card_payment_enabled && cartItems.length > 0) {
          const paymentIntentResult = await stripePaymentService.createPaymentIntent({
            items: cartItems.map((item) => ({
              product_id: item._id || item.id,
              qty: Number(item.qty || 1),
            })),
          });

          setClientSecret(paymentIntentResult?.data?.client_secret || "");
        }
      } catch (error) {
        toast.error(error?.message || "Failed to initialize checkout");
      } finally {
        setLoading(false);
      }
    };

    setupCheckout();
  }, [cartItems]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container py-5">Loading checkout...</div>
        <Footer />
      </>
    );
  }

  const stripePromise = paymentSettings?.stripe_publishable_key
    ? loadStripe(paymentSettings.stripe_publishable_key)
    : null;

  if (paymentSettings.card_payment_enabled && clientSecret && stripePromise) {
    return (
      <Elements
        stripe={stripePromise}
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
        />
      </Elements>
    );
  }

  return (
    <CheckoutInner
      paymentSettings={paymentSettings}
      clientSecret={clientSecret}
      hasStripeContext={false}
    />
  );
};

export default Checkout;