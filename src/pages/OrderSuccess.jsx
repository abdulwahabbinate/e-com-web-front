import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar, Footer } from "../components";
import "./OrderSuccess.css";

const OrderSuccess = () => {
  const location = useLocation();

  const orderNumber = location.state?.orderNumber || "Order Confirmed";
  const paymentStatus = location.state?.paymentStatus || "pending";
  const total = Number(location.state?.total || 0);
  const estimatedDelivery = "3 - 5 Business Days";

  const formattedPaymentStatus =
    paymentStatus === "paid"
      ? "Paid"
      : paymentStatus === "pending"
      ? "Pending"
      : paymentStatus === "failed"
      ? "Failed"
      : paymentStatus;

  return (
    <>
      <Navbar />

      <div className="premium-order-success-page">
        <div className="container py-4 py-lg-5">
          <div className="premium-order-success-card">
            <div className="premium-order-success-icon">
              <i className="fa fa-check"></i>
            </div>

            <span className="premium-order-success-badge">Order Confirmed</span>

            <h1 className="premium-order-success-title">
              Thank you! Your order has been placed successfully
            </h1>

            <p className="premium-order-success-subtitle">
              Your purchase has been confirmed and our team is preparing your
              items for dispatch. A premium shopping experience continues from
              checkout to delivery.
            </p>

            <div className="premium-order-success-info-grid">
              <div className="premium-order-info-card">
                <span>Order Number</span>
                <strong>{orderNumber}</strong>
              </div>

              <div className="premium-order-info-card">
                <span>Estimated Delivery</span>
                <strong>{estimatedDelivery}</strong>
              </div>

              <div className="premium-order-info-card">
                <span>Payment Status</span>
                <strong>{formattedPaymentStatus}</strong>
              </div>

              <div className="premium-order-info-card">
                <span>Total Amount</span>
                <strong>${total.toFixed(2)}</strong>
              </div>
            </div>

            <div className="premium-order-timeline">
              <div className="premium-order-step active">
                <div className="premium-order-step-dot"></div>
                <span>Order Placed</span>
              </div>

              <div className="premium-order-step">
                <div className="premium-order-step-dot"></div>
                <span>Processing</span>
              </div>

              <div className="premium-order-step">
                <div className="premium-order-step-dot"></div>
                <span>Shipped</span>
              </div>

              <div className="premium-order-step">
                <div className="premium-order-step-dot"></div>
                <span>Delivered</span>
              </div>
            </div>

            <div className="premium-order-success-note">
              <i className="fa fa-shield"></i>
              <span>
                Your order is securely confirmed. A confirmation email has been
                sent if email delivery is configured successfully.
              </span>
            </div>

            <div className="premium-order-success-actions">
              <Link to="/product" className="premium-order-primary-btn">
                <i className="fa fa-shopping-bag"></i>
                <span>Continue Shopping</span>
              </Link>

              <Link to="/" className="premium-order-secondary-btn">
                <i className="fa fa-home"></i>
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default OrderSuccess;