import { Outlet } from "react-router-dom";
import React from "react";
import SideNavigation from "../components/SideNavigation";
import TopNavigation from "../components/TopNavigation";

export default function AppLayout({ config }) {
  return (
    <div style={{ height: "100%" }}>
      <TopNavigation items={config?.topMenu} />
      <div style={{ display: "flex" }}>
        <SideNavigation items={config?.sideMenu} />
        <div
          style={{
            paddingLeft: "250px",
            width: "100%",
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}
