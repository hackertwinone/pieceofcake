import React from "react";
import { CheckCircle, X } from "lucide-react";

const OrderStatus = ({ orderStatus, onDismiss }) => {
  if (!orderStatus) return null;

  return (
    <div
      className={`p-4 m-4 rounded-lg relative ${
        orderStatus.type === "success"
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800"
      }`}
    >
      <div className="flex items-center pr-8">
        <CheckCircle className="h-5 w-5 mr-2" />
        {orderStatus.type === "success"
          ? `Order #${orderStatus.orderId} placed successfully! We'll prepare it with love.`
          : orderStatus.message}
      </div>
      <button
        onClick={onDismiss}
        className="absolute top-2 right-2 text-sm hover:opacity-75"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default OrderStatus;
