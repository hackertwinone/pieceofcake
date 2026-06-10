import React from "react";
import Navigation from "./Navigation";

const Header = () => {
  return (
    <header
      className="bg-lacquer border-b border-ivory-border"
      style={{ borderBottomColor: "rgba(232, 228, 220, 0.2)" }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo — white line-art treatment */}
          <div className="flex items-center gap-4">
            {/* Logo mark */}
            <img
              src="/mariospieceofcake.png"
              alt="Mario's Piece of Cake"
              style={{ height: "48px", width: "auto" }}
            />

            <div className="flex flex-col">
              <span
                className="text-ivory tracking-widest leading-tight uppercase text-xs"
                style={{
                  fontFamily: "'EB Garamond', serif",
                  letterSpacing: "0.35em",
                }}
              >
                Mario's
              </span>
              <span
                className="text-ivory font-bold leading-tight"
                style={{
                  fontFamily: "'Cinzel Decorative', serif",
                  fontSize: "1.1rem",
                  letterSpacing: "0.1em",
                }}
              >
                Piece of Cake
              </span>
            </div>
          </div>

          <Navigation />
        </div>
      </div>
    </header>
  );
};

export default Header;
