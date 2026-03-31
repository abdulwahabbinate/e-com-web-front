import React from "react";
import { PaymentElement } from "@stripe/react-stripe-js";

const StripePaymentForm = () => {
  return (
    <div className="mt-3">
      <PaymentElement
        id="payment-element"
        options={{
          layout: "tabs",
        }}
      />
    </div>
  );
};

export default StripePaymentForm;