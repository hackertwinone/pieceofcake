import React from "react";
import { useRestaurantInfo } from "../../hooks/useApi";

const cardBorder = { border: "1px solid rgba(232, 228, 220, 0.2)" };
const headingDivider = { borderBottom: "1px solid rgba(232, 228, 220, 0.12)" };
const rowDivider = { borderBottom: "1px solid rgba(50, 50, 50, 0.9)" };

const HOURS = [
  { day: "Monday", time: "Closed" },
  { day: "Tuesday", time: "12:00 PM – 9:00 PM" },
  { day: "Wednesday", time: "12:00 PM – 9:00 PM" },
  { day: "Thursday", time: "12:00 PM – 9:00 PM" },
  { day: "Friday", time: "12:00 PM – 10:00 PM" },
  { day: "Saturday", time: "10:00 AM – 10:00 PM" },
  { day: "Sunday", time: "10:00 AM – 8:00 PM" },
];

const SOCIALS = [
  {
    handle: "@mariospieceofcake",
    label: "Instagram",
    url: "https://instagram.com/mariospieceofcake",
  },
  {
    handle: "Mario's Piece of Cake",
    label: "Facebook",
    url: "https://facebook.com/mariospieceofcake",
  },
  {
    handle: "@mariospieceofcake",
    label: "TikTok",
    url: "https://tiktok.com/@mariospieceofcake",
  },
];

const SocialLink = ({ label, handle, url }) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "'EB Garamond', serif",
        color: "#F0EBE0",
        textDecoration: hovered ? "underline" : "none",
        textDecorationColor: "#B8975A",
        textUnderlineOffset: "3px",
      }}
      className="flex items-baseline gap-3 text-base"
    >
      <span style={{ fontSize: "0.45rem", opacity: 0.5 }}>✦</span>
      <span className="text-ivory-dim w-24" style={{ letterSpacing: "0.08em" }}>
        {label}
      </span>
      <span>{handle}</span>
    </a>
  );
};

const ContactPage = () => {
  const { loading } = useRestaurantInfo();

  if (loading) {
    return (
      <div
        className="text-center py-16 text-ivory-dim italic"
        style={{ fontFamily: "'EB Garamond', serif" }}
      >
        Consulting the archives…
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Hero */}
      <div
        className="text-center py-12 pinstripe"
        style={{ borderBottom: "1px solid rgba(232, 228, 220, 0.15)" }}
      >
        <div className="rule-ornament justify-center mb-6 mx-auto max-w-xs">
          <span
            style={{ fontSize: "0.6rem", letterSpacing: "0.6em", opacity: 0.4 }}
          >
            ✦
          </span>
        </div>
        <h2
          className="text-4xl font-bold text-ivory mb-4"
          style={{ fontFamily: "'Cinzel Decorative', serif" }}
        >
          Seek an Audience
        </h2>
        <p
          className="text-ivory-dim max-w-2xl mx-auto text-lg italic"
          style={{ fontFamily: "'EB Garamond', serif" }}
        >
          For matters of catering, private affairs, or any inquiry — the parlour
          is open.
        </p>
        <div className="rule-ornament justify-center mt-6 mx-auto max-w-xs">
          <span
            style={{ fontSize: "0.6rem", letterSpacing: "0.6em", opacity: 0.4 }}
          >
            ✦
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left — Reach Us + Socials */}
        <div className="bg-lacquer p-8" style={cardBorder}>
          <h3
            className="text-sm font-bold text-ivory mb-6 pb-3 uppercase tracking-widest"
            style={{
              fontFamily: "'Cinzel Decorative', serif",
              ...headingDivider,
            }}
          >
            Reach Us
          </h3>
          <div
            className="space-y-3 mb-8"
            style={{ fontFamily: "'EB Garamond', serif" }}
          >
            <p className="text-ivory text-base flex items-center gap-3">
              <span>📧</span>
              <span>orders@mariospieceofcake.com</span>
            </p>
            <p className="text-ivory text-base flex items-center gap-3">
              <span>📞</span>
              <span>(956) 000-0000</span>
            </p>
          </div>

          <h3
            className="text-sm font-bold text-ivory mb-5 pb-3 uppercase tracking-widest"
            style={{
              fontFamily: "'Cinzel Decorative', serif",
              ...headingDivider,
            }}
          >
            Find Us In The Dark
          </h3>
          <div className="space-y-3">
            {SOCIALS.map((s) => (
              <SocialLink key={s.label} {...s} />
            ))}
          </div>
        </div>

        {/* Right — Hours */}
        <div className="bg-lacquer p-8" style={cardBorder}>
          <h3
            className="text-sm font-bold text-ivory mb-6 pb-3 uppercase tracking-widest"
            style={{
              fontFamily: "'Cinzel Decorative', serif",
              ...headingDivider,
            }}
          >
            Hours
          </h3>
          <div style={{ fontFamily: "'EB Garamond', serif" }}>
            {HOURS.map(({ day, time }) => (
              <div
                key={day}
                className="flex justify-between py-2.5"
                style={rowDivider}
              >
                <span className="text-ivory text-base">{day}</span>
                <span
                  className="text-base"
                  style={{
                    color:
                      time === "Closed" ? "rgba(240,235,224,0.4)" : "#F0EBE0",
                  }}
                >
                  {time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
