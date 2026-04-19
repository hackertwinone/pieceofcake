import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useCart } from "../../context/CartContext";

const MILK_OPTIONS = ["Whole", "2%", "Oat", "Almond", "Coconut"];
const SIZE_OPTIONS = [
  { label: "16 oz", price: 6.50 },
  { label: "20 oz", price: 7.50 },
];

const MenuCard = ({ item }) => {
  const { addToCart, getCartQuantity } = useCart();
  const [selectedMilk, setSelectedMilk] = useState("Whole");
  const [selectedSize, setSelectedSize] = useState(SIZE_OPTIONS[0]);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      {item.image && (
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <h3 className="text-xl font-bold text-forest mb-2">{item.name}</h3>
        <p className="text-espresso mb-4">{item.description}</p>
        {item.ingredients && (
          <p className="text-sm text-sage mb-4">
            <strong>Ingredients:</strong> {item.ingredients}
          </p>
        )}

        {/* Size Selector */}
        <div className="mb-3">
          <p className="text-sm font-medium text-forest mb-2">Size</p>
          <div className="flex gap-2">
            {SIZE_OPTIONS.map((size) => (
              <button
                key={size.label}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedSize.label === size.label
                    ? "bg-sage text-white"
                    : "bg-sand text-espresso hover:bg-sand-light"
                }`}
              >
                {size.label} — ${size.price.toFixed(2)}
              </button>
            ))}
          </div>
        </div>

        {/* Milk Selector */}
        <div className="mb-4">
          <p className="text-sm font-medium text-forest mb-2">Milk</p>
          <div className="flex flex-wrap gap-2">
            {MILK_OPTIONS.map((milk) => (
              <button
                key={milk}
                onClick={() => setSelectedMilk(milk)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedMilk === milk
                    ? "bg-sage text-white"
                    : "bg-sand text-espresso hover:bg-sand-light"
                }`}
              >
                {milk}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-forest">
            ${selectedSize.price.toFixed(2)}
          </span>
          <div className="flex items-center space-x-2">
            {getCartQuantity(item.id) > 0 && (
              <span className="bg-sand text-forest px-2 py-1 rounded-full text-sm">
                {getCartQuantity(item.id)} in cart
              </span>
            )}
            <button
              onClick={() =>
                addToCart(
                  { ...item, price: selectedSize.price.toFixed(2) },
                  selectedMilk,
                  selectedSize.label
                )
              }
              className="bg-sage text-white px-4 py-2 rounded-lg hover:bg-forest transition-colors flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
