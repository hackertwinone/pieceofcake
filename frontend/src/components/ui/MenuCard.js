import React from "react";
import { Plus } from "lucide-react";
import { useCart } from "../../context/CartContext";

const dividerStyle = { borderTop: "1px solid rgba(232, 228, 220, 0.12)" };

const MenuCard = ({ item }) => {
  const { addToCart, getCartQuantity } = useCart();
  // Prefer uploaded file (absolute URL from serializer) over external image_url fallback
  const photo = item.image || item.image_url || null;

  return (
    <div className="menu-card flex flex-col overflow-hidden">

      {/* ── Product photo — flush to all edges, no padding ── */}
      {photo ? (
        <div className="card-image">
          <img src={photo} alt={item.name} />
        </div>
      ) : (
        /* Placeholder when no image: thin-line cake glyph on black */
        <div
          className="flex items-center justify-center bg-matte"
          style={{ height: "180px", borderBottom: "1px solid rgba(232,228,220,0.08)" }}
        >
          <span className="text-ivory-dim" style={{ fontSize: "2.5rem", opacity: 0.15 }}>◈</span>
        </div>
      )}

      {/* ── Content ── */}
      <div className="px-5 pt-4 flex-1 flex flex-col">

        {/* Ornamental divider */}
        <div className="rule-ornament mb-3">
          <span style={{ fontSize: "0.5rem", letterSpacing: "0.6em", opacity: 0.45 }}>✦</span>
        </div>

        {/* Name */}
        <h3
          className="text-sm font-bold text-ivory mb-2 leading-snug uppercase tracking-widest"
          style={{ fontFamily: "'Cinzel Decorative', serif", letterSpacing: "0.08em" }}
        >
          {item.name}
        </h3>

        {/* Description */}
        <p
          className="text-ivory-dim mb-3 text-base italic leading-relaxed flex-1"
          style={{ fontFamily: "'EB Garamond', serif" }}
        >
          {item.description}
        </p>

        {/* Ingredients */}
        {item.ingredients && (
          <p className="text-xs text-ivory-dim mb-1" style={{ fontFamily: "'EB Garamond', serif", opacity: 0.7 }}>
            <span className="not-italic">Ingredients:</span> {item.ingredients}
          </p>
        )}
        {item.allergens && (
          <p className="text-xs text-ivory-dim mb-3" style={{ fontFamily: "'EB Garamond', serif", opacity: 0.7 }}>
            <span className="not-italic">Allergens:</span> {item.allergens}
          </p>
        )}

        {/* Price + Add */}
        <div className="flex items-center justify-between py-4" style={dividerStyle}>
          <span className="text-xl font-bold text-gold" style={{ fontFamily: "'EB Garamond', serif" }}>
            ${parseFloat(item.price).toFixed(2)}
          </span>
          <div className="flex items-center gap-3">
            {getCartQuantity(item.id) > 0 && (
              <span className="text-ivory-dim text-sm italic" style={{ fontFamily: "'EB Garamond', serif" }}>
                {getCartQuantity(item.id)} chosen
              </span>
            )}
            <AddButton onClick={() => addToCart(item)} />
          </div>
        </div>

      </div>
    </div>
  );
};

/* Separate component so hover state stays local */
const AddButton = ({ onClick }) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center gap-1.5 px-4 py-2 text-xs uppercase tracking-widest border transition-colors"
      style={{
        fontFamily: "'EB Garamond', serif",
        letterSpacing: "0.2em",
        backgroundColor: hovered ? "#F0EBE0" : "transparent",
        color: hovered ? "#0A0A0A" : "#F0EBE0",
        borderColor: hovered ? "#F0EBE0" : "rgba(232,228,220,0.35)",
      }}
    >
      <Plus className="h-3 w-3" strokeWidth={2} />
      Add
    </button>
  );
};

export default MenuCard;
