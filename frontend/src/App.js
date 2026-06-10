import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { CartProvider } from "./context/CartContext";
import Header from "./components/common/Header";
import MenuPage from "./components/pages/MenuPage";
import CartPage from "./components/pages/CartPage";
import CheckoutPage from "./components/pages/CheckoutPage";
import OrderConfirmationPage from "./components/pages/OrderConfirmationPage";
import ContactPage from "./components/pages/ContactPage";
import { ROUTES } from "./utils/constants";

const paypalOptions = {
  "client-id":
    process.env.REACT_APP_PAYPAL_CLIENT_ID || "your-paypal-client-id-here",
  currency: "USD",
  intent: "capture",
  "enable-funding": "venmo,paylater,card",
  "disable-funding": "credit",
};

function App() {
  return (
    <PayPalScriptProvider options={paypalOptions}>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-matte text-ivory font-garamond">
            <Header />
            <main className="container mx-auto px-4 py-8 pb-20 md:pb-8">
              <Routes>
                <Route path={ROUTES.HOME} element={<MenuPage />} />
                <Route path={ROUTES.MENU} element={<MenuPage />} />
                <Route path={ROUTES.CART} element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route
                  path="/order-confirmation"
                  element={<OrderConfirmationPage />}
                />
                <Route path={ROUTES.CONTACT} element={<ContactPage />} />
              </Routes>
            </main>
          </div>
        </Router>
      </CartProvider>
    </PayPalScriptProvider>
  );
}

export default App;
