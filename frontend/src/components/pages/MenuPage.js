import React, { useState } from "react";
import { useMenuData } from "../../hooks/useApi";
import MenuCard from "../ui/MenuCard";

// Dark overhead food photography — replace with actual product shot when ready
const HERO_IMAGE = "/hero_image.jpeg";
const MenuPage = () => {
  const { categories, menuItems, loading } = useMenuData();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredItems =
    selectedCategory === "all"
      ? menuItems
      : menuItems.filter(
          (item) =>
            item.category ===
            categories.find((cat) => cat.name === selectedCategory)?.id,
        );

  if (loading) {
    return (
      <div
        className="text-center py-16 text-ivory-dim italic"
        style={{ fontFamily: "'EB Garamond', serif" }}
      >
        The offerings are being prepared…
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* ── Hero ── full-bleed background photo with overlay + vignette */}
      <div
        className="relative text-center"
        style={{
          backgroundImage: `url('${HERO_IMAGE}')`,
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.85) 100%)",
          }}
        />
        {/* Content */}
        <div className="relative z-10 py-20 px-4">
          <div className="rule-ornament justify-center mb-6 mx-auto max-w-xs">
            <span style={{ fontSize: "0.55rem", letterSpacing: "0.7em" }}>
              ✦
            </span>
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold text-ivory mb-4 tracking-wide"
            style={{ fontFamily: "'Cinzel Decorative', serif" }}
          >
            Indulgence Is Not A Vice
          </h2>
          <p
            className="text-ivory-dim max-w-xl mx-auto text-lg italic"
            style={{ fontFamily: "'EB Garamond', serif" }}
          >
            It is merely good manners.
          </p>
          <div className="rule-ornament justify-center mt-6 mx-auto max-w-xs">
            <span style={{ fontSize: "0.55rem", letterSpacing: "0.7em" }}>
              ✦
            </span>
          </div>
        </div>
      </div>

      {/* ── Category Filter ── */}
      <div className="flex flex-wrap justify-center gap-3">
        {[
          { id: "all", name: "All Offerings" },
          ...categories.map((c) => ({ id: c.name, name: c.name })),
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-6 py-2 text-sm tracking-widest uppercase border transition-colors ${
              selectedCategory === cat.id
                ? "bg-ivory text-matte border-ivory"
                : "bg-transparent text-ivory-dim hover:text-ivory"
            }`}
            style={{
              fontFamily: "'EB Garamond', serif",
              letterSpacing: "0.2em",
              ...(selectedCategory !== cat.id && {
                borderColor: "rgba(232, 228, 220, 0.25)",
              }),
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* ── Menu Grid ── */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-16">
          <p
            className="text-ivory-dim italic"
            style={{ fontFamily: "'EB Garamond', serif" }}
          >
            Nothing stirs in this corner of the parlour.
          </p>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
