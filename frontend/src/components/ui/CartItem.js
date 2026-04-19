import React from "react";
import { Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "../../context/CartContext";

const CartItem = ({ item }) => {
  const { addToCart, removeFromCart, deleteFromCart } = useCart();

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-forest">{item.name}</h3>
          <p className="text-sm text-brown">{item.size} · {item.milk} milk</p>
          <p className="text-espresso">${item.price} each</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => removeFromCart(item.cartKey)}
            className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="text-lg font-bold text-forest w-8 text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => addToCart(item, item.milk, item.size)}
            className="bg-sand text-sage p-2 rounded-lg hover:bg-sand-light"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            onClick={() => deleteFromCart(item.cartKey)}
            className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 ml-2"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-sand">
        <div className="flex justify-between items-center">
          <span className="text-espresso">Subtotal:</span>
          <span className="font-bold text-forest">
            ${(parseFloat(item.price) * item.quantity).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
