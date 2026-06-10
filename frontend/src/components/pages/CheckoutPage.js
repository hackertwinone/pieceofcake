import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CreditCard, User, MapPin } from "lucide-react";
import { useCart } from "../../context/CartContext";
import PayPalButton from "../ui/PayPalButton";
import api from "../../services/api";
import { ROUTES } from "../../utils/constants";

const DELIVERY_FEE = 2.99;

const cardBorder = { border: "1px solid rgba(232, 228, 220, 0.2)" };
const dividerStyle = { borderTop: "1px solid rgba(232, 228, 220, 0.12)" };

const inputClass =
  "w-full px-4 py-3 bg-matte text-ivory text-base placeholder-ivory-dim transition-colors focus:outline-none";
const inputStyle = {
  fontFamily: "'EB Garamond', serif",
  border: "1px solid rgba(232, 228, 220, 0.25)",
};

const SectionCard = ({ children }) => (
  <div className="bg-lacquer p-6" style={cardBorder}>
    {children}
  </div>
);

const SectionHeading = ({ icon, text }) => (
  <h3
    className="text-sm font-bold text-ivory mb-5 pb-3 flex items-center gap-2 uppercase tracking-widest"
    style={{ fontFamily: "'Cinzel Decorative', serif", ...dividerStyle }}
  >
    {icon}
    {text}
  </h3>
);

const FieldLabel = ({ children }) => (
  <label
    className="block text-xs uppercase tracking-widest text-ivory-dim mb-2"
    style={{ fontFamily: "'EB Garamond', serif", letterSpacing: "0.2em" }}
  >
    {children}
  </label>
);

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
        })),
      };
      const order = await api.createOrder(orderPayload);
      clearCart();
      navigate("/order-confirmation", {
        state: { orderId: order.id, paymentDetails: details, total: getCartTotal() },
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
        })),
      };
      const order = await api.createOrder(orderPayload);
      clearCart();
      navigate("/order-confirmation", {
        state: { orderId: order.id, paymentMethod: "cash", total: getCartTotal() },
      });
    } catch (error) {
      alert("Failed to place order. Please try again.");
    }
    setLoading(false);
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-bold text-ivory mb-4" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
          Nothing to Render
        </h2>
        <p className="text-ivory-dim italic mb-8" style={{ fontFamily: "'EB Garamond', serif" }}>
          The selection has not yet been made.
        </p>
        <button
          onClick={() => navigate(ROUTES.MENU)}
          className="border text-ivory px-8 py-3 uppercase tracking-widest text-sm"
          style={{ fontFamily: "'EB Garamond', serif", letterSpacing: "0.2em", borderColor: "rgba(232,228,220,0.35)" }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#F0EBE0"; e.currentTarget.style.color = "#0A0A0A"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#F0EBE0"; }}
        >
          Browse the Offerings
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
      <div className="text-center mb-10">
        <div className="rule-ornament justify-center mb-4 mx-auto max-w-xs">
          <span style={{ fontSize: "0.6rem", letterSpacing: "0.6em", opacity: 0.4 }}>✦</span>
        </div>
        <h1 className="text-3xl font-bold text-ivory" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
          Seal the Covenant
        </h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="order-1 lg:order-2">
          <div className="bg-lacquer p-6 sticky top-6" style={cardBorder}>
            <SectionHeading text="The Covenant" />

            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center py-2"
                  style={{ fontFamily: "'EB Garamond', serif", borderBottom: "1px solid rgba(232,228,220,0.1)" }}
                >
                  <div>
                    <span className="text-ivory">{item.name}</span>
                    <span className="text-ivory-dim ml-2 italic">×{item.quantity}</span>
                  </div>
                  <span className="text-gold">${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 space-y-2" style={{ fontFamily: "'EB Garamond', serif", ...dividerStyle }}>
              <div className="flex justify-between text-ivory-dim text-sm">
                <span>Fulfillment</span>
                <span className="text-ivory italic capitalize">{fulfillment}</span>
              </div>
              <div className="flex justify-between text-ivory-dim text-sm">
                <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
              </div>
              {isDelivery && (
                <div className="flex justify-between text-ivory-dim text-sm">
                  <span>Courier Fee</span><span>${deliveryFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-ivory-dim text-sm">
                <span>Tax (8%)</span><span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold pt-3" style={dividerStyle}>
                <span className="text-ivory">Total Due</span>
                <span className="text-gold">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <div className="order-2 lg:order-1 space-y-6">
          <SectionCard>
            <SectionHeading icon={<User className="h-3.5 w-3.5" />} text="Your Identity" />
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <FieldLabel>Full Name *</FieldLabel>
                <input type="text" required value={customerInfo.customer_name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, customer_name: e.target.value })}
                  className={inputClass} style={inputStyle} />
              </div>
              <div>
                <FieldLabel>Phone Number *</FieldLabel>
                <input type="tel" required value={customerInfo.customer_phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, customer_phone: e.target.value })}
                  className={inputClass} style={inputStyle} />
              </div>
              <div className="md:col-span-2">
                <FieldLabel>Email Address *</FieldLabel>
                <input type="email" required value={customerInfo.customer_email}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, customer_email: e.target.value })}
                  className={inputClass} style={inputStyle} />
              </div>
            </div>
          </SectionCard>

          {isDelivery && (
            <SectionCard>
              <SectionHeading icon={<MapPin className="h-3.5 w-3.5" />} text="Delivery Address" />
              <div>
                <FieldLabel>Full Address *</FieldLabel>
                <textarea rows="3" required value={customerInfo.delivery_address}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, delivery_address: e.target.value })}
                  placeholder="Street address, apartment, city, state, zip"
                  className={inputClass} style={inputStyle} />
              </div>
              <div className="mt-4">
                <FieldLabel>Special Instructions</FieldLabel>
                <textarea rows="2" value={customerInfo.special_instructions}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, special_instructions: e.target.value })}
                  placeholder="Dietary requirements, delivery notes…"
                  className={inputClass} style={inputStyle} />
              </div>
            </SectionCard>
          )}

          <SectionCard>
            <SectionHeading icon={<CreditCard className="h-3.5 w-3.5" />} text="Method of Payment" />
            <div className="space-y-3">
              {[
                { value: "paypal", label: "PayPal / Credit Card", sub: "Secure payment through PayPal or any major card" },
                { value: "cash", label: "Cash Upon Arrival", sub: "Present payment when your order is collected" },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center p-4 cursor-pointer transition-colors"
                  style={{
                    border: paymentMethod === opt.value
                      ? "1px solid rgba(232,228,220,0.5)"
                      : "1px solid rgba(232,228,220,0.15)",
                    backgroundColor: paymentMethod === opt.value ? "rgba(240,235,224,0.04)" : "transparent",
                  }}
                >
                  <input type="radio" name="payment" value={opt.value}
                    checked={paymentMethod === opt.value}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3" />
                  <div style={{ fontFamily: "'EB Garamond', serif" }}>
                    <div className="text-ivory">{opt.label}</div>
                    <div className="text-ivory-dim italic text-sm">{opt.sub}</div>
                  </div>
                </label>
              ))}
            </div>

            <div className="mt-6">
              {paymentMethod === "paypal" ? (
                validateForm() ? (
                  <PayPalButton amount={total} onSuccess={handlePayPalSuccess} onError={handlePayPalError} />
                ) : (
                  <p className="text-center text-ivory-dim italic p-4 text-sm" style={{ fontFamily: "'EB Garamond', serif", border: "1px solid rgba(232,228,220,0.15)" }}>
                    Complete all required fields before proceeding.
                  </p>
                )
              ) : (
                <button
                  onClick={handleCashOrder}
                  disabled={loading || !validateForm()}
                  className="w-full bg-ivory text-matte py-4 font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors border border-ivory disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ fontFamily: "'EB Garamond', serif", letterSpacing: "0.2em" }}
                >
                  {loading ? "Sealing the Order…" : `Place Order — $${total.toFixed(2)}`}
                </button>
              )}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
