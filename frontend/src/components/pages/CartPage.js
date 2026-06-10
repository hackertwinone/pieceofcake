import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import CartItem from "../ui/CartItem";
import { ROUTES } from "../../utils/constants";

const DELIVERY_FEE = 2.99;
const cardBorder = { border: "1px solid rgba(232, 228, 220, 0.2)" };
const dividerStyle = { borderTop: "1px solid rgba(232, 228, 220, 0.12)" };

const CartPage = () => {
  const { cart, getCartTotal } = useCart();
  const navigate = useNavigate();
  const [fulfillment, setFulfillment] = useState("pickup");

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="rule-ornament justify-center mb-8 mx-auto max-w-xs">
          <span style={{ fontSize: "0.6rem", letterSpacing: "0.6em", opacity: 0.4 }}>✦</span>
        </div>
        <h2
          className="text-3xl font-bold text-ivory mb-4"
          style={{ fontFamily: "'Cinzel Decorative', serif" }}
        >
          Your Selection Awaits
        </h2>
        <p className="text-ivory-dim italic mb-8" style={{ fontFamily: "'EB Garamond', serif" }}>
          The parlour is set, but nothing has been chosen yet.
        </p>
        <button
          onClick={() => navigate(ROUTES.MENU)}
          className="border text-ivory px-8 py-3 uppercase tracking-widest text-sm transition-colors"
          style={{ fontFamily: "'EB Garamond', serif", letterSpacing: "0.2em", borderColor: "rgba(232, 228, 220, 0.35)" }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#F0EBE0"; e.currentTarget.style.color = "#0A0A0A"; e.currentTarget.style.borderColor = "#F0EBE0"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#F0EBE0"; e.currentTarget.style.borderColor = "rgba(232, 228, 220, 0.35)"; }}
        >
          Browse the Offerings
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
      <div className="text-center mb-10">
        <div className="rule-ornament justify-center mb-4 mx-auto max-w-xs">
          <span style={{ fontSize: "0.6rem", letterSpacing: "0.6em", opacity: 0.4 }}>✦</span>
        </div>
        <h1 className="text-3xl font-bold text-ivory" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
          Your Selection
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <CartItem key={item.cartKey} item={item} />
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-lacquer p-6 sticky top-6" style={cardBorder}>
            <h2
              className="text-sm font-bold text-ivory mb-5 pb-3 uppercase tracking-widest"
              style={{ fontFamily: "'Cinzel Decorative', serif", ...dividerStyle }}
            >
              The Tally
            </h2>

            {/* Fulfillment Toggle */}
            <div className="flex mb-5" style={cardBorder}>
              {["pickup", "delivery"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setFulfillment(mode)}
                  className={`flex-1 py-2 text-xs tracking-widest uppercase transition-colors ${
                    fulfillment === mode ? "bg-ivory text-matte" : "text-ivory-dim hover:text-ivory"
                  } ${mode === "delivery" ? "border-l" : ""}`}
                  style={{
                    fontFamily: "'EB Garamond', serif",
                    letterSpacing: "0.15em",
                    ...(mode === "delivery" && { borderLeftColor: "rgba(232,228,220,0.2)" }),
                  }}
                >
                  {mode === "pickup" ? "Collect" : "Deliver"}
                </button>
              ))}
            </div>

            <div className="space-y-2 mb-5" style={{ fontFamily: "'EB Garamond', serif" }}>
              <div className="flex justify-between text-ivory-dim text-sm">
                <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
              </div>
              {fulfillment === "delivery" && (
                <div className="flex justify-between text-ivory-dim text-sm">
                  <span>Courier Fee</span><span>${deliveryFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-ivory-dim text-sm">
                <span>Tax (8%)</span><span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold pt-3 mt-1" style={dividerStyle}>
                <span className="text-ivory">Total</span>
                <span className="text-gold">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/checkout", { state: { fulfillment } })}
              className="w-full bg-ivory text-matte py-3 font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors border border-ivory"
              style={{ fontFamily: "'EB Garamond', serif", letterSpacing: "0.2em" }}
            >
              Proceed to Checkout
            </button>

            <button
              onClick={() => navigate(ROUTES.MENU)}
              className="w-full mt-3 py-3 text-ivory-dim uppercase tracking-widest text-xs hover:text-ivory transition-colors"
              style={{ fontFamily: "'EB Garamond', serif", letterSpacing: "0.15em" }}
            >
              Return to the Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
