import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Receipt, Clock, MapPin } from "lucide-react";
import { ROUTES } from "../../utils/constants";

const OrderConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, paymentDetails, paymentMethod, total } =
    location.state || {};

  if (!orderId) {
    return (
      <div className="text-center py-16">
        <p className="text-espresso">Order information not found.</p>
        <button
          onClick={() => navigate(ROUTES.HOME)}
          className="mt-4 bg-sage text-white px-6 py-3 rounded-lg hover:bg-forest transition-colors"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <CheckCircle className="h-20 w-20 text-sage mx-auto mb-6" />

        <h1 className="text-3xl font-bold text-forest mb-4">
          Order Confirmed!
        </h1>

        <p className="text-espresso mb-6">
          Thank you for your order! We've received your request and will start
          brewing your order right away.
        </p>

        <div className="bg-sand p-6 rounded-lg mb-6">
          <div className="flex items-center justify-center mb-4">
            <Receipt className="h-5 w-5 text-brown mr-2" />
            <span className="font-medium text-forest">Order #{orderId}</span>
          </div>

          {paymentDetails && (
            <div className="text-sm text-espresso mb-2">
              Payment ID: {paymentDetails.id}
            </div>
          )}

          <div className="text-lg font-bold text-forest">
            Total: ${total?.toFixed(2)}
          </div>

          <div className="text-sm text-espresso mt-2">
            Payment Method:{" "}
            {paymentMethod === "cash"
              ? "Cash on Delivery"
              : "PayPal/Credit Card"}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="flex items-center justify-center p-4 bg-sand rounded-lg">
            <Clock className="h-5 w-5 text-sage mr-2" />
            <div>
              <div className="font-medium text-forest">
                Estimated Delivery
              </div>
              <div className="text-sm text-espresso">30-45 minutes</div>
            </div>
          </div>

          <div className="flex items-center justify-center p-4 bg-sand rounded-lg">
            <MapPin className="h-5 w-5 text-sage mr-2" />
            <div>
              <div className="font-medium text-forest">Order Status</div>
              <div className="text-sm text-espresso">Being Prepared</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-espresso">
            You'll receive updates about your order status. Our delivery team
            will contact you when they're on the way!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(ROUTES.HOME)}
              className="bg-sage text-white px-6 py-3 rounded-lg hover:bg-forest transition-colors"
            >
              Back to Menu
            </button>

            <button
              onClick={() => navigate(ROUTES.CONTACT)}
              className="border border-brown text-brown px-6 py-3 rounded-lg hover:bg-sand transition-colors"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
