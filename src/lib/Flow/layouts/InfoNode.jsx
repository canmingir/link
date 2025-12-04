import { Iconify } from "@canmingir/link/platform/components";

import React, { useEffect, useState } from "react";
import { alpha, styled } from "@mui/material/styles";

const ANIMATION_DELAY_MS = 200;

const MainContainer = styled("div", {
  shouldForwardProp: (prop) => prop !== "$style",
})(({ theme, $style = {} }) => {
  const {
    minWidth = 120,
    minHeight = 120,
    maxWidth = 160,
    maxHeight = 160,
    borderRadius = 16,
    borderColor = "rgba(255, 255, 255, 0.2)",
    bgFrom,
    bgTo,
  } = $style;

  const defaultFrom = alpha(theme.palette.secondary.light, 0.2);
  const defaultTo = alpha(theme.palette.primary.main, 0.3);

  const hoveredFrom = alpha(theme.palette.primary.main, 0.3);
  const hoveredTo = alpha(theme.palette.secondary.light, 0.2);

  return {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "#ffffff",
    borderRadius,
    padding: "16px 20px",
    border: `1px solid ${borderColor}`,
    backdropFilter: "blur(10px)",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    background: `linear-gradient(135deg, ${bgFrom || defaultFrom}, ${
      bgTo || defaultTo
    })`,
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",

    '&[data-hovered="true"]': {
      background: `linear-gradient(135deg, ${bgTo || hoveredFrom}, ${
        bgFrom || hoveredTo
      })`,
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
    },
  };
});

const IconContainer = styled("div", {
  shouldForwardProp: (prop) => prop !== "$style",
})(({ $style = {} }) => {
  const {
    bg = "rgba(255, 255, 255, 0.1)",
    hoverBg = "rgba(255, 255, 255, 0.15)",
    borderRadius = 12,
    padding = 8,
    borderColor = "rgba(255, 255, 255, 0.3)",
    marginBottom = 12,
  } = $style;

  return {
    backgroundColor: bg,
    borderRadius,
    padding,
    marginBottom,
    transition: "all 0.4s ease",
    backdropFilter: "blur(5px)",
    border: `1px solid ${borderColor}`,

    '[data-hovered="true"] &': {
      backgroundColor: hoverBg,
    },
  };
});

const LabelText = styled("div", {
  shouldForwardProp: (prop) => prop !== "$style",
})(({ $style = {} }) => {
  const {
    color = "#ffffff",
    fontWeight = 600,
    fontSize = 13,
    letterSpacing = 0.5,
  } = $style;

  return {
    fontWeight,
    fontSize,
    letterSpacing: `${letterSpacing}px`,
    textAlign: "center",
    transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
    textShadow: "none",
    lineHeight: "1.4",
    opacity: 0,
    transform: "translateY(10px)",
    color,

    '&[data-animated="true"]': {
      opacity: 1,
      transform: "translateY(0)",
    },
  };
});

const getIcon = (node) => {
  if (node.icon) return node.icon;
  if (node.type === "CONDITION" || node.type === "decision")
    return "mdi:help-circle-outline";
  if (node.type === "NORMAL") return "mdi:checkbox-blank-circle-outline";
  return "mdi:cube-outline";
};

const InfoNode = ({ node, nodeStyle = {} }) => {
  const [animated, setAnimated] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const label =
    node.label || node.title || node.name || node.id || "Responsibility";

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), ANIMATION_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const layoutStyle = {
    minWidth: nodeStyle.cardWidth || nodeStyle.minWidth || 120,
    minHeight: nodeStyle.minHeight || 120,
    maxWidth: nodeStyle.maxWidth || 160,
    maxHeight: nodeStyle.maxHeight || 160,
    borderRadius: typeof nodeStyle.shape === "number" ? nodeStyle.shape : 16,
    borderColor: nodeStyle.borderColor || "rgba(255, 255, 255, 0.2)",
    bgFrom: nodeStyle.bgFrom,
    bgTo: nodeStyle.bgTo,
  };

  const iconContainerStyle = {
    bg: nodeStyle.iconBg,
    hoverBg: nodeStyle.iconHoverBg,
    borderRadius: nodeStyle.iconRadius,
    padding: nodeStyle.iconPadding,
    borderColor: nodeStyle.iconBorderColor,
    marginBottom: nodeStyle.iconMarginBottom,
  };

  const labelStyle = {
    color: nodeStyle.labelColor,
    fontSize: nodeStyle.labelFontSize,
    fontWeight: nodeStyle.labelFontWeight,
    letterSpacing: nodeStyle.labelLetterSpacing,
  };

  const icon = getIcon(node);

  return (
    <MainContainer
      $style={layoutStyle}
      data-hovered={isHovered}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <IconContainer $style={iconContainerStyle}>
        <Iconify
          icon={icon}
          width={28}
          height={28}
          sx={{
            transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: animated
              ? isHovered
                ? "rotate(360deg) scale(1.1)"
                : "rotate(0deg) scale(1)"
              : "rotate(-90deg) scale(0.8)",
            filter: "none",
            color: nodeStyle.iconColor || "#ffffff",
          }}
        />
      </IconContainer>

      <LabelText data-animated={animated} $style={labelStyle}>
        {label}
      </LabelText>
    </MainContainer>
  );
};

export default InfoNode;
