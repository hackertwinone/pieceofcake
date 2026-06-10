import React from "react";
import { Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "../../context/CartContext";

const cardBorder = { border: "1px solid rgba(232, 228, 220, 0.2)" };
const dividerStyle = { borderTop: "1px solid rgba(232, 228, 220, 0.12)" };

const iconBtnClass =
  "p-2 bg-transparent text-ivory-dim transition-colors";

const CartItem = ({ item }) => {
  const { addToCart, removeFromCart, deleteFromCart } = useCart();

  return (
    <div className="bg-lacquer p-6" style={cardBorder}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3
            className="text-base font-bold text-ivory leading-tight tracking-wide"
            style={{ fontFamily: "'Cinzel Decorative', serif" }}
          >
            {item.name}
          </h3>
          <p
            className="text-gold mt-1 text-sm"
            style={{ fontFamily: "'EB Garamond', serif" }}
          >
            ${parseFloat(item.price).toFixed(2)} each
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => removeFromCart(item.cartKey)}
            className={iconBtnClass}
            style={{ borderColor: "rgba(232, 228, 220, 0.2)", border: "1px solid rgba(232,228,220,0.2)" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#F0EBE0"; e.currentTarget.style.borderColor = "rgba(232,228,220,0.5)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#C8BFA8"; e.currentTarget.style.borderColor = "rgba(232,228,220,0.2)"; }}
            aria-label="Decrease quantity"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span
            className="text-base font-bold text-ivory w-8 text-center"
            style={{ fontFamily: "'EB Garamond', serif" }}
          >
            {item.quantity}
          </span>
          <button
            onClick={() => addToCart(item)}
            className={iconBtnClass}
            style={{ border: "1px solid rgba(232,228,220,0.2)" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#F0EBE0"; e.currentTarget.style.borderColor = "rgba(232,228,220,0.5)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#C8BFA8"; e.currentTarget.style.borderColor = "rgba(232,228,220,0.2)"; }}
            aria-label="Increase quantity"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => deleteFromCart(item.cartKey)}
            className={`${iconBtnClass} ml-2`}
            style={{ border: "1px solid rgba(232,228,220,0.2)" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#F0EBE0"; e.currentTarget.style.borderColor = "rgba(232,228,220,0.5)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#C8BFA8"; e.currentTarget.style.borderColor = "rgba(232,228,220,0.2)"; }}
            aria-label="Remove item"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-4 pt-4 flex justify-between items-center" style={dividerStyle}>
        <span className="text-ivory-dim italic text-sm" style={{ fontFamily: "'EB Garamond', serif" }}>
          Item total
        </span>
        <span className="font-bold text-gold" style={{ fontFamily: "'EB Garamond', serif" }}>
          ${(parseFloat(item.price) * item.quantity).toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default CartItem;
