import React from "react";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

const PayPalButton = ({ amount, onSuccess, onError }) => {
  const [{ isPending }] = usePayPalScriptReducer();

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: amount.toFixed(2),
            currency_code: "USD",
          },
          description: "Mariscos el 6 Seafood Restaurant Order",
        },
      ],
      application_context: {
        shipping_preference: "NO_SHIPPING", // Since this is for food delivery
      },
    });
  };

  const onApprove = async (data, actions) => {
    try {
      const details = await actions.order.capture();
      onSuccess(details);
    } catch (error) {
      onError(error);
    }
  };

  const onErrorHandler = (error) => {
    console.error("PayPal error:", error);
    onError(error);
  };

  if (isPending) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="paypal-button-container">
      <PayPalButtons
        style={{
          layout: "vertical",
          color: "gold",
          shape: "rect",
          label: "paypal",
        }}
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onErrorHandler}
        onCancel={() => {
          console.log("Payment cancelled");
        }}
      />
    </div>
  );
};

export default PayPalButton;
