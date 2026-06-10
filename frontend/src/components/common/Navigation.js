import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { ROUTES } from "../../utils/constants";

const Navigation = () => {
  const location = useLocation();
  const { getCartItemCount } = useCart();

  const navItems = [
    { path: ROUTES.MENU, label: "The Menu" },
    { path: ROUTES.CART, label: "Selection" },
    { path: ROUTES.CONTACT, label: "Contact" },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex space-x-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`px-5 py-2 text-sm tracking-widest uppercase transition-colors border ${
              location.pathname === item.path
                ? "bg-ivory text-matte border-ivory"
                : "bg-transparent text-ivory border-transparent hover:border-ivory-border"
            }`}
            style={{ fontFamily: "'EB Garamond', serif", letterSpacing: "0.2em",
              ...(location.pathname !== item.path && { borderColor: "rgba(232, 228, 220, 0.25)" })
            }}
          >
            {item.label}
            {item.path === ROUTES.CART && getCartItemCount() > 0 && (
              <span className={`ml-2 text-xs px-1.5 py-0.5 font-bold ${
                location.pathname === item.path ? "bg-matte text-ivory" : "bg-ivory text-matte"
              }`}>
                {getCartItemCount()}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Mobile Navigation */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 bg-lacquer z-50"
        style={{ borderTop: "1px solid rgba(232, 228, 220, 0.2)" }}
      >
        <div className="flex">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex-1 py-3 text-center text-xs tracking-widest uppercase transition-colors ${
                location.pathname === item.path
                  ? "bg-ivory text-matte"
                  : "text-ivory-dim hover:text-ivory"
              }`}
              style={{ fontFamily: "'EB Garamond', serif", letterSpacing: "0.15em" }}
            >
              {item.label}
              {item.path === ROUTES.CART && getCartItemCount() > 0 && (
                <span className="ml-1 bg-ivory text-matte text-xs px-1.5 py-0.5 font-bold">
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
