export const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://pieceofcake-production.up.railway.app/api";
export const ROUTES = {
  HOME: "/",
  MENU: "/menu",
  CART: "/cart",
  CHECKOUT: "/checkout",
  ORDER_CONFIRMATION: "/order-confirmation",
  CONTACT: "/contact",
};
