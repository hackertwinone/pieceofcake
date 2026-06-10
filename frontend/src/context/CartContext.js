import React, { createContext, useContext, useReducer } from "react";

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      const existingItem = state.find((item) => item.cartKey === action.payload.cartKey);
      if (existingItem) {
        return state.map((item) =>
          item.cartKey === action.payload.cartKey
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];

    case "REMOVE_FROM_CART":
      return state
        .map((item) =>
          item.cartKey === action.payload && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0);

    case "DELETE_FROM_CART":
      return state.filter((item) => item.cartKey !== action.payload);

    case "CLEAR_CART":
      return [];

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);

  const addToCart = (item) => {
    const cartKey = `${item.id}`;
    dispatch({ type: "ADD_TO_CART", payload: { ...item, cartKey } });
  };

  const removeFromCart = (cartKey) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: cartKey });
  };

  const deleteFromCart = (cartKey) => {
    dispatch({ type: "DELETE_FROM_CART", payload: cartKey });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const getCartTotal = () => {
    return cart.reduce(
      (total, item) => total + parseFloat(item.price) * item.quantity,
      0
    );
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartQuantity = (itemId) => {
    return cart
      .filter((item) => item.id === itemId)
      .reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        deleteFromCart,
        clearCart,
        getCartTotal,
        getCartItemCount,
        getCartQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
