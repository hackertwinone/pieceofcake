import React from "react";
import Navigation from "./Navigation";

const Header = () => {
  return (
    <header className="bg-sand-light shadow-lg border-b-4 border-brown">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <img
            src="/cafecito_logo.png"
            alt="The Cafecito Club"
            className="h-16 w-auto object-contain"
          />
          <Navigation />
        </div>
      </div>
    </header>
  );
};

export default Header;
