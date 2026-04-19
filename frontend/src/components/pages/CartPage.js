import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../../context/CartContext";
import CartItem from "../ui/CartItem";
import { ROUTES } from "../../utils/constants";

const DELIVERY_FEE = 2.99;

const CartPage = () => {
  const { cart, getCartTotal } = useCart();
  const navigate = useNavigate();
  const [fulfillment, setFulfillment] = useState("pickup");

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
  const deliveryFee = fulfillment === "delivery" ? DELIVERY_FEE : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-forest mb-8">Your Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cart.map((item) => (
              <CartItem key={item.cartKey} item={item} />
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-lg sticky top-6">
            <h2 className="text-xl font-bold text-forest mb-4">Order Summary</h2>

            {/* Fulfillment Toggle */}
            <div className="flex rounded-lg overflow-hidden border border-sand mb-4">
              <button
                onClick={() => setFulfillment("pickup")}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  fulfillment === "pickup"
                    ? "bg-sage text-white"
                    : "text-espresso hover:bg-sand"
                }`}
              >
                Pickup
              </button>
              <button
                onClick={() => setFulfillment("delivery")}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  fulfillment === "delivery"
                    ? "bg-sage text-white"
                    : "text-espresso hover:bg-sand"
                }`}
              >
                Delivery
              </button>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-espresso">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {fulfillment === "delivery" && (
                <div className="flex justify-between text-espresso">
                  <span>Delivery Fee:</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-espresso">
                <span>Tax (8%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-sand pt-2 mt-2">
                <div className="flex justify-between font-bold text-lg text-forest">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/checkout", { state: { fulfillment } })}
              className="w-full bg-sage text-white py-4 rounded-lg font-bold text-lg hover:bg-forest transition-colors"
            >
              Proceed to Checkout
            </button>

            <button
              onClick={() => navigate(ROUTES.MENU)}
              className="w-full mt-3 border border-sage text-sage py-3 rounded-lg font-medium hover:bg-sand transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
