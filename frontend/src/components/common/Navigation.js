import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { ROUTES } from "../../utils/constants";

const Navigation = () => {
  const location = useLocation();
  const { getCartItemCount } = useCart();

  const navItems = [
    { path: ROUTES.MENU, label: "Menu" },
    { path: ROUTES.CART, label: "Cart" },
    { path: ROUTES.CONTACT, label: "Contact" },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex space-x-6">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              location.pathname === item.path
                ? "bg-sage text-white"
                : "text-espresso hover:bg-sand"
            }`}
          >
            {item.label}
            {item.path === ROUTES.CART && getCartItemCount() > 0 && (
              <span className="ml-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                {getCartItemCount()}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-sand-light border-t border-brown shadow-lg z-50">
        <div className="flex">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex-1 py-3 text-center text-sm ${
                location.pathname === item.path
                  ? "bg-sage text-white"
                  : "text-espresso"
              }`}
            >
              {item.label}
              {item.path === ROUTES.CART && getCartItemCount() > 0 && (
                <span className="ml-1 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                  {getCartItemCount()}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navigation;
