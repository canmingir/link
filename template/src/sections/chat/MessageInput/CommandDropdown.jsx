import React, { useState } from "react";

const CommandDropdown = ({ commands, onSelect }) => {
  const [hoveredCommand, setHoveredCommand] = useState(null);

  return (
    <div
      style={{
        position: "absolute",
        bottom: "140%",
        left: 0,
        right: 0,
        backgroundColor: "#2f3136",
        border: "1px solid #202225",
        borderRadius: "5px",
        width: "100%",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      }}
      data-testid="command-dropdown"
    >
      {commands.map((command) => (
        <div
          data-command={command.command}
          key={command.command}
          onClick={() => onSelect(command)}
          onMouseEnter={() => setHoveredCommand(command.command)}
          onMouseLeave={() => setHoveredCommand(null)}
          style={{
            color: "white",
            padding: "10px 16px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            borderBottom: "1px solid #40444B",
            backgroundColor:
              hoveredCommand === command.command ? "#202225" : undefined,
          }}
        >
          <span style={{ marginRight: "8px", fontSize: "24px" }}>
            <command.icon />
          </span>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontWeight: "bold" }}>{command.command}</div>
            <div style={{ fontSize: "14px" }}>{command.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommandDropdown;
