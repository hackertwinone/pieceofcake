import React, { useState } from "react";
import { useMenuData } from "../../hooks/useApi";
import MenuCard from "../ui/MenuCard";

const MenuPage = () => {
  const { categories, menuItems, loading } = useMenuData();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredItems =
    selectedCategory === "all"
      ? menuItems
      : menuItems.filter(
          (item) =>
            item.category ===
            categories.find((cat) => cat.name === selectedCategory)?.id
        );

  if (loading) {
    return <div className="text-center py-16 text-espresso">Loading menu...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-forest mb-4">Our Menu</h2>
        <p className="text-espresso max-w-2xl mx-auto">
          Explore our menu of specialty coffees, handcrafted drinks, and
          fresh bites — something for every mood and moment.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-6 py-3 rounded-full font-medium transition-colors ${
            selectedCategory === "all"
              ? "bg-sage text-white"
              : "bg-white text-espresso hover:bg-sand"
          }`}
        >
          All Items
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.name)}
            className={`px-6 py-3 rounded-full font-medium transition-colors ${
              selectedCategory === category.name
                ? "bg-sage text-white"
                : "bg-white text-espresso hover:bg-sand"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Menu Items */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-16">
          <p className="text-espresso">No items found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
