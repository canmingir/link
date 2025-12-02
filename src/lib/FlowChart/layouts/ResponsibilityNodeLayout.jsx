import { Iconify } from "@canmingir/link/platform/components";

import React, { useEffect, useState } from "react";
import { alpha, styled } from "@mui/material/styles";

const ANIMATION_DELAY_MS = 200;

const MainContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  color: "#ffffff",
  borderRadius: "16px",
  padding: "16px 20px",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  backdropFilter: "blur(10px)",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  cursor: "pointer",
  position: "relative",
  overflow: "hidden",
  minWidth: "120px",
  minHeight: "120px",
  maxWidth: "160px",
  maxHeight: "160px",
  background: `linear-gradient(135deg, ${alpha(
    theme.palette.secondary.light,
    0.2
  )}, ${alpha(theme.palette.primary.main, 0.3)})`,
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",

  '&[data-hovered="true"]': {
    background: `linear-gradient(135deg, ${alpha(
      theme.palette.primary.main,
      0.3
    )}, ${alpha(theme.palette.secondary.light, 0.2)})`,
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
  },
}));

const IconContainer = styled("div")({
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  borderRadius: "12px",
  padding: "8px",
  marginBottom: "12px",
  transition: "all 0.4s ease",
  backdropFilter: "blur(5px)",
  border: "1px solid rgba(255, 255, 255, 0.3)",

  '[data-hovered="true"] &': {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
});

const LabelText = styled("div")({
  fontWeight: "600",
  fontSize: "13px",
  letterSpacing: "0.5px",
  textAlign: "center",
  transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
  textShadow: "none",
  lineHeight: "1.4",
  opacity: 0,
  transform: "translateY(10px)",

  '&[data-animated="true"]': {
    opacity: 1,
    transform: "translateY(0)",
  },
});

const getIcon = (node) => {
  if (node.icon) return node.icon;
  if (node.type === "CONDITION" || node.type === "decision")
    return "mdi:help-circle-outline";
  if (node.type === "NORMAL") return "mdi:checkbox-blank-circle-outline";
  return "mdi:cube-outline";
};

const ResponsibilityNodeLayout = ({ node, nodeStyle }) => {
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

  const icon = getIcon(node);

  return (
    <MainContainer
      $style={layoutStyle}
      data-hovered={isHovered}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <IconContainer>
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
            color: "#ffffff",
          }}
        />
      </IconContainer>

      <LabelText data-animated={animated}>{label}</LabelText>
    </MainContainer>
  );
};

export default ResponsibilityNodeLayout;
