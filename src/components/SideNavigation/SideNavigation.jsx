import "./style.css";
import { Link } from "react-router-dom";
import React from "react";

export default function SideNavigation({ items = [] }) {
  return (
    <>
      <div className="sidebar open">
        <ul>
          {items.map((item) => (
            <li key={item.name}>
              <Link style={{ color: "white" }} to={item.url}>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
