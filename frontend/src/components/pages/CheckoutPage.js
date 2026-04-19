import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, CreditCard, User, MapPin } from "lucide-react";
import { useCart } from "../../context/CartContext";
import CartItem from "../ui/CartItem";
import PayPalButton from "../ui/PayPalButton";
import api from "../../services/api";
import { ROUTES } from "../../utils/constants";

const DELIVERY_FEE = 2.99;

const CheckoutPage = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const fulfillment = location.state?.fulfillment || "pickup";
  const isDelivery = fulfillment === "delivery";

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const [customerInfo, setCustomerInfo] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    delivery_address: "",
    special_instructions: "",
  });

  const validateForm = () => {
    const required = ["customer_name", "customer_email", "customer_phone"];
    if (isDelivery) required.push("delivery_address");
    return required.every((field) => customerInfo[field].trim() !== "");
  };

  const handlePayPalSuccess = async (details) => {
    setLoading(true);
    try {
      const orderPayload = {
        ...customerInfo,
        payment_method: "paypal",
        payment_status: "completed",
        payment_id: details.id,
        items: cart.map((item) => ({
          menu_item: item.id,
          quantity: item.quantity,
          price: item.price,
          size: item.size || '16 oz',
          milk: item.milk || 'Whole',
        })),
      };

      const order = await api.createOrder(orderPayload);
      clearCart();
      navigate("/order-confirmation", {
        state: {
          orderId: order.id,
          paymentDetails: details,
          total: getCartTotal(),
        },
      });
    } catch (error) {
      alert("Failed to process order. Please contact support.");
      console.error("Order creation error:", error);
    }
    setLoading(false);
  };

  const handlePayPalError = (error) => {
    console.error("PayPal payment error:", error);
    alert("Payment failed. Please try again or choose cash on delivery.");
  };

  const handleCashOrder = async () => {
    if (!validateForm()) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        ...customerInfo,
        payment_method: "cash",
        payment_status: "pending",
        items: cart.map((item) => ({
          menu_item: item.id,
          quantity: item.quantity,
          price: item.price,
          size: item.size || '16 oz',
          milk: item.milk || 'Whole',
        })),
      };

      const order = await api.createOrder(orderPayload);
      clearCart();
      navigate("/order-confirmation", {
        state: {
          orderId: order.id,
          paymentMethod: "cash",
          total: getCartTotal(),
        },
      });
    } catch (error) {
      alert("Failed to place order. Please try again.");
    }
    setLoading(false);
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingCart className="h-24 w-24 text-sand mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-forest mb-4">
          Your cart is empty
        </h2>
        <p className="text-espresso">Add some delicious drinks or bites from our menu!</p>
        <button
          onClick={() => navigate(ROUTES.MENU)}
          className="mt-6 bg-sage text-white px-6 py-3 rounded-lg hover:bg-forest transition-colors"
        >
          Browse Menu
        </button>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const deliveryFee = isDelivery ? DELIVERY_FEE : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-forest mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="order-1 lg:order-2">
          <div className="bg-white p-6 rounded-2xl shadow-lg sticky top-6">
            <h2 className="text-xl font-bold text-forest mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center py-2 border-b border-sand"
                >
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <span className="text-espresso ml-2">x{item.quantity}</span>
                  </div>
                  <span className="font-medium">
                    ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-espresso">
                <span>Fulfillment:</span>
                <span className="font-medium text-sage capitalize">{fulfillment}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {isDelivery && (
                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Tax (8%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <div className="order-2 lg:order-1 space-y-6">
          {/* Customer Information */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold text-forest mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Customer Information
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-forest mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerInfo.customer_name}
                  onChange={(e) =>
                    setCustomerInfo({
                      ...customerInfo,
                      customer_name: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-sand rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-forest mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={customerInfo.customer_phone}
                  onChange={(e) =>
                    setCustomerInfo({
                      ...customerInfo,
                      customer_phone: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-sand rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-forest mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={customerInfo.customer_email}
                  onChange={(e) =>
                    setCustomerInfo({
                      ...customerInfo,
                      customer_email: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-sand rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Delivery Address — only shown for delivery */}
          {isDelivery && (<div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold text-forest mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Delivery Address
            </h3>

            <div>
              <label className="block text-sm font-medium text-forest mb-2">
                Full Address *
              </label>
              <textarea
                required
                rows="3"
                value={customerInfo.delivery_address}
                onChange={(e) =>
                  setCustomerInfo({
                    ...customerInfo,
                    delivery_address: e.target.value,
                  })
                }
                placeholder="Street address, apartment/unit number, city, state, zip code"
                className="w-full px-4 py-3 border border-sand rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-forest mb-2">
                Special Instructions
              </label>
              <textarea
                rows="2"
                value={customerInfo.special_instructions}
                onChange={(e) =>
                  setCustomerInfo({
                    ...customerInfo,
                    special_instructions: e.target.value,
                  })
                }
                placeholder="Delivery instructions, dietary restrictions, etc."
                className="w-full px-4 py-3 border border-sand rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent"
              />
            </div>
          </div>)}

          {/* Payment Method */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold text-forest mb-4 flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Payment Method
            </h3>

            <div className="space-y-4">
              <div>
                <label className="flex items-center p-4 border border-sand rounded-lg cursor-pointer hover:bg-sand">
                  <input
                    type="radio"
                    name="payment"
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">PayPal / Credit Card</div>
                    <div className="text-sm text-espresso">
                      Pay securely with PayPal or any major credit card
                    </div>
                  </div>
                </label>
              </div>

              <div>
                <label className="flex items-center p-4 border border-sand rounded-lg cursor-pointer hover:bg-sand">
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">Cash on Delivery</div>
                    <div className="text-sm text-espresso">
                      Pay with cash when your order arrives
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Payment Button */}
            <div className="mt-6">
              {paymentMethod === "paypal" ? (
                <div>
                  {validateForm() ? (
                    <PayPalButton
                      amount={total}
                      onSuccess={handlePayPalSuccess}
                      onError={handlePayPalError}
                    />
                  ) : (
                    <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-yellow-800">
                        Please fill in all required fields to proceed with
                        payment
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleCashOrder}
                  disabled={loading || !validateForm()}
                  className="w-full bg-sage text-white py-4 rounded-lg font-bold text-lg hover:bg-forest transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading
                    ? "Placing Order..."
                    : `Place Order - $${total.toFixed(2)}`}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
