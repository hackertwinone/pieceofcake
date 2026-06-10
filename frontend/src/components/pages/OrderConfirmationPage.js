import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Receipt, Clock, MapPin } from "lucide-react";
import { ROUTES } from "../../utils/constants";

const cardBorder = { border: "1px solid rgba(232, 228, 220, 0.2)" };
const dividerStyle = { borderTop: "1px solid rgba(232, 228, 220, 0.12)" };

const OrderConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, paymentDetails, paymentMethod, total } = location.state || {};

  if (!orderId) {
    return (
      <div className="text-center py-20">
        <p className="text-ivory-dim italic mb-6" style={{ fontFamily: "'EB Garamond', serif" }}>
          The record of your order could not be located.
        </p>
        <button
          onClick={() => navigate(ROUTES.HOME)}
          className="border text-ivory px-8 py-3 uppercase tracking-widest text-sm"
          style={{ fontFamily: "'EB Garamond', serif", letterSpacing: "0.2em", borderColor: "rgba(232,228,220,0.35)" }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#F0EBE0"; e.currentTarget.style.color = "#0A0A0A"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#F0EBE0"; }}
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-lacquer p-8 md:p-12 text-center" style={cardBorder}>
        <div className="rule-ornament justify-center mb-6 mx-auto max-w-xs">
          <span style={{ fontSize: "0.6rem", letterSpacing: "0.6em", opacity: 0.35 }}>✦</span>
        </div>

        <CheckCircle className="h-12 w-12 text-ivory mx-auto mb-6" style={{ opacity: 0.6 }} />

        <h1
          className="text-3xl font-bold text-ivory mb-4"
          style={{ fontFamily: "'Cinzel Decorative', serif" }}
        >
          Order Received
        </h1>

        <p
          className="text-ivory-dim text-lg italic mb-8 leading-relaxed"
          style={{ fontFamily: "'EB Garamond', serif" }}
        >
          Your selection has been accepted. The bakers have been summoned
          and shall begin their work with all due haste.
        </p>

        {/* Order detail block */}
        <div className="p-6 mb-8 text-left space-y-3" style={cardBorder}>
          <div
            className="flex items-center justify-center gap-2 mb-4"
            style={{ fontFamily: "'EB Garamond', serif" }}
          >
            <Receipt className="h-4 w-4 text-ivory-dim" />
            <span className="text-ivory uppercase tracking-widest text-xs" style={{ letterSpacing: "0.2em" }}>
              Order #{orderId}
            </span>
          </div>

          {paymentDetails && (
            <p className="text-xs text-ivory-dim italic text-center" style={{ fontFamily: "'EB Garamond', serif" }}>
              Payment Reference: {paymentDetails.id}
            </p>
          )}

          <div className="text-center pt-4" style={{ fontFamily: "'EB Garamond', serif", ...dividerStyle }}>
            <span className="text-ivory-dim italic text-sm">Total Rendered: </span>
            <span className="text-2xl font-bold text-gold ml-2">${total?.toFixed(2)}</span>
          </div>

          <p className="text-center text-xs text-ivory-dim italic" style={{ fontFamily: "'EB Garamond', serif" }}>
            {paymentMethod === "cash" ? "Cash Upon Arrival" : "Paid via PayPal"}
          </p>
        </div>

        {/* Status cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {[
            { icon: <Clock className="h-4 w-4 text-ivory-dim flex-shrink-0" />, label: "Estimated Delivery", value: "30–45 minutes" },
            { icon: <MapPin className="h-4 w-4 text-ivory-dim flex-shrink-0" />, label: "Order Status", value: "Being Prepared" },
          ].map(({ icon, label, value }) => (
            <div key={label} className="p-4 flex items-center justify-center gap-3" style={cardBorder}>
              {icon}
              <div className="text-left" style={{ fontFamily: "'EB Garamond', serif" }}>
                <div className="text-ivory text-sm">{label}</div>
                <div className="text-ivory-dim italic text-sm">{value}</div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-ivory-dim italic mb-8 text-sm" style={{ fontFamily: "'EB Garamond', serif" }}>
          You shall receive word when your order departs our doors. Until then —
          the waiting is part of the experience.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(ROUTES.HOME)}
            className="bg-ivory text-matte px-8 py-3 font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors border border-ivory"
            style={{ fontFamily: "'EB Garamond', serif", letterSpacing: "0.2em" }}
          >
            Return to the Menu
          </button>
          <button
            onClick={() => navigate(ROUTES.CONTACT)}
            className="border text-ivory-dim px-8 py-3 uppercase tracking-widest text-sm hover:text-ivory transition-colors"
            style={{ fontFamily: "'EB Garamond', serif", letterSpacing: "0.2em", borderColor: "rgba(232,228,220,0.25)" }}
          >
            Contact Us
          </button>
        </div>

        <div className="rule-ornament justify-center mt-8 mx-auto max-w-xs">
          <span style={{ fontSize: "0.6rem", letterSpacing: "0.6em", opacity: 0.35 }}>✦</span>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
