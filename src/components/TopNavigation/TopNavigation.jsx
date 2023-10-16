import "./style.css";
import { Link } from "react-router-dom";
import React from "react";
import { storage } from "@nucleoidjs/webstorage";

export default function TopNavigation({ items = [] }) {
  const handleLogout = () => {
    storage.remove("accessToken");
    storage.remove("refreshToken");
    window.location.href = "/login";
  };

  return (
    <nav className="top-nav">
      <div className="logo">nuc</div>
      <ul className="nav-links">
        {items.map((item, index) => (
          <li key={index}>
            <Link style={{ color: "white" }} href={item.url}>
              {item.name}
            </Link>
          </li>
        ))}
        <li onClick={handleLogout}>Logout</li>
      </ul>
    </nav>
  );
}
