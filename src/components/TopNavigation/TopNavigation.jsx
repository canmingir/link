import "./style.css";
import { Link } from "react-router-dom";
import React from "react";

export default function TopNavigation({ items = [] }) {
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
      </ul>
    </nav>
  );
}
