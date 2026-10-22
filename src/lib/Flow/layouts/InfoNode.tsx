import Iconify from "../../Iconify";
import type { ReactNode } from "react";

import { alpha, styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import type { FlowNodeData } from "../nodes/FlowNodeView";

const ANIMATION_DELAY_MS = 200;

const MainContainer = styled("div", {
  shouldForwardProp: (prop) => prop !== "$style" && prop !== "$variant",
})<{ $style?: Record<string, unknown>; $variant?: string }>(
  ({ theme, $style = {}, $variant }) => {
    const {
      minWidth = 280,
      minHeight = 220,
      maxWidth = 320,
      maxHeight = "auto",
      borderRadius = 20,
      borderColor = "rgba(255, 255, 255, 0.08)",
      bgFrom,
      bgTo,
    } = $style as {
      minWidth?: number | string;
      minHeight?: number | string;
      maxWidth?: number | string;
      maxHeight?: number | string;
      borderRadius?: number | string;
      borderColor?: string;
      bgFrom?: string;
      bgTo?: string;
      bg?: string;
      hoverBg?: string;
      padding?: number | string;
      color?: string;
      fontWeight?: number | string;
      fontSize?: number | string;
      letterSpacing?: number | string;
    };

    const defaultFrom = alpha(theme.palette.secondary.light, 0.2);
    const defaultTo = alpha(theme.palette.primary.main, 0.3);

    const isSplit = $variant === "split-icon-panel";

    return {
      display: "flex",
      flexDirection: isSplit ? "row" : "column",
      alignItems: isSplit ? "stretch" : "flex-start",
      justifyContent: "flex-start",
      color: "#ffffff",
      borderRadius,
      padding: isSplit ? 0 : "24px",
      border: `1px solid ${borderColor}`,
      backdropFilter: "blur(10px)",
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      cursor: "inherit",
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
      '[data-flow-dragging="true"] &': {
        backdropFilter: "none",
      },
    };
  }
);

const SplitIconPanel = styled("div", {
  shouldForwardProp: (prop) => prop !== "$isReversed",
})<{ $isReversed?: boolean }>(({ $isReversed }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  width: "100px",
  alignSelf: "stretch",
  background: "rgba(255, 255, 255, 0.08)",
  borderRight: $isReversed ? "none" : "1px solid rgba(255, 255, 255, 0.08)",
  borderLeft: $isReversed ? "1px solid rgba(255, 255, 255, 0.08)" : "none",
}));

const SplitContentColumn = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  flex: 1,
  minWidth: 0,
  padding: "20px",
  textAlign: "left",
}));

const SplitLabelDescWrap = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "center",
  gap: "10px",
  flex: 1,
  width: "100%",
  minHeight: 0,
}));

const HeaderRow = styled("div", {
  shouldForwardProp: (prop) => prop !== "$variant",
})<{ $variant?: string }>(() => {
  return {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: "16px",
    marginBottom: "16px",
    minHeight: "44px",
  };
});

const IconContainer = styled("div", {
  shouldForwardProp: (prop) => prop !== "$style" && prop !== "$variant",
})<{ $style?: Record<string, unknown>; $variant?: string }>(
  ({ $style = {}, $variant }) => {
    const {
      bg = "rgba(255, 255, 255, 0.1)",
      hoverBg = "rgba(255, 255, 255, 0.2)",
      borderRadius = 14,
      padding = 10,
      borderColor = "rgba(255, 255, 255, 0.1)",
    } = $style as {
      minWidth?: number | string;
      minHeight?: number | string;
      maxWidth?: number | string;
      maxHeight?: number | string;
      borderRadius?: number | string;
      borderColor?: string;
      bgFrom?: string;
      bgTo?: string;
      bg?: string;
      hoverBg?: string;
      padding?: number | string;
      color?: string;
      fontWeight?: number | string;
      fontSize?: number | string;
      letterSpacing?: number | string;
    };

    const isSplit = $variant === "split-icon-panel";

    return {
      backgroundColor: bg,
      borderRadius,
      padding: padding,
      transition: "all 0.4s ease",
      backdropFilter: "blur(5px)",
      border: isSplit ? "none" : `1px solid ${borderColor}`,
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: isSplit
        ? `
            4px 4px 0 rgba(255, 255, 255, 0.3),
            5px 5px 5px rgba(0, 0, 0, 0.5)
          `
        : `
            4px 4px 0 rgba(255, 255, 255, 0.1),
            5px 5px 5px rgba(0, 0, 0, 0.5)
          `,

      '[data-flow-dragging="true"] &': {
        backdropFilter: "none",
      },

      '[data-hovered="true"] &': {
        backgroundColor: hoverBg,
      },
    };
  }
);

const LabelText = styled("div", {
  shouldForwardProp: (prop) => prop !== "$style" && prop !== "$variant",
})<{ $style?: Record<string, unknown>; $variant?: string }>(
  ({ $style = {}, $variant }) => {
    const {
      color = "#ffffff",
      fontWeight = 700,
      fontSize = 15,
      letterSpacing = 0.3,
    } = $style as {
      minWidth?: number | string;
      minHeight?: number | string;
      maxWidth?: number | string;
      maxHeight?: number | string;
      borderRadius?: number | string;
      borderColor?: string;
      bgFrom?: string;
      bgTo?: string;
      bg?: string;
      hoverBg?: string;
      padding?: number | string;
      color?: string;
      fontWeight?: number | string;
      fontSize?: number | string;
      letterSpacing?: number | string;
    };

    const isSplit = $variant === "split-icon-panel";

    return {
      fontWeight,
      fontSize,
      letterSpacing: `${letterSpacing}px`,
      textAlign: "left",
      transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
      lineHeight: "1.2",
      opacity: 0,
      transform: "translateX(10px)",
      color,
      flex: isSplit ? "unset" : 1,
      width: isSplit ? "100%" : "auto",

      '&[data-animated="true"]': {
        opacity: 1,
        transform: "translateX(0)",
      },
    };
  }
);

const DescriptionText = styled("div", {
  shouldForwardProp: (prop) => prop !== "$variant",
})<{ $variant?: string }>(({ $variant }) => {
  const isSplit = $variant === "split-icon-panel";

  return {
    fontSize: "12px",
    fontWeight: 400,
    color: alpha("#fff", 0.6),
    textAlign: "left",
    lineHeight: "1.5",
    width: "100%",
    flex: isSplit ? "unset" : 1,
    opacity: 0,
    transform: "translateY(10px)",
    transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.1s",
    marginBottom: isSplit ? 0 : "16px",
    display: "-webkit-box",
    WebkitLineClamp: 4,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",

    '&[data-animated="true"]': {
      opacity: 1,
      transform: "translateY(0)",
    },
  };
});

const ActionText = styled("div", {
  shouldForwardProp: (prop) => prop !== "$variant",
})<{ $variant?: string }>(() => {
  return {
    fontSize: "10px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "1px",
    color: alpha("#fff", 0.4),
    marginTop: "auto",
    textAlign: "left",
    width: "100%",
    fontFamily: "monospace",
    opacity: 0,
    transform: "translateY(5px)",
    transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.2s",

    '&[data-animated="true"]': {
      opacity: 1,
      transform: "translateY(0)",
    },
  };
});

const getIcon = (node: FlowNodeData): string => {
  if (typeof node.icon === "string") return node.icon;
  if (node.type === "CONDITION" || node.type === "decision")
    return "mdi:help-circle-outline";
  if (node.type === "NORMAL") return "mdi:checkbox-blank-circle-outline";
  return "mdi:map-marker";
};

const InfoNode = ({
  node,
  nodeStyle = {},
  children,
}: {
  node: FlowNodeData;
  nodeStyle?: Record<string, unknown>;
  children?: ReactNode;
}) => {
  const [animated, setAnimated] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const variant =
    typeof nodeStyle.layoutVariant === "string"
      ? nodeStyle.layoutVariant
      : undefined;
  const isSplit = variant === "split-icon-panel";
  const isReversed =
    isSplit &&
    (node.action === "PLATFORM:complete" ||
      node.type === "NORMAL" ||
      node.type === "END");

  const label =
    (node.label as ReactNode) ||
    (node.title as ReactNode) ||
    (node.name as ReactNode) ||
    node.id ||
    "Get Data";

  const action = (node.action as ReactNode) || "SYSTEM:DEFAULT_ACTION";
  const description =
    (node.description as ReactNode) ||
    "Description of the operation goes here.";

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), ANIMATION_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const layoutStyle = {
    ...nodeStyle,
    minWidth: nodeStyle.cardWidth || nodeStyle.minWidth || 280,
    minHeight: nodeStyle.minHeight || 220,
  };

  const iconContainerStyle = {
    iconBg: nodeStyle.iconBg,
    iconHoverBg: nodeStyle.iconHoverBg,
    iconBorderRadius: nodeStyle.iconRadius,
    iconPadding: nodeStyle.iconPadding,
    iconBorderColor: nodeStyle.iconBorderColor,
  };

  const labelStyle = {
    labelColor: nodeStyle.labelColor,
    labelFontSize: nodeStyle.labelFontSize,
    labelFontWeight: nodeStyle.labelFontWeight,
    labelLetterSpacing: nodeStyle.labelLetterSpacing,
  };

  const icon = getIcon(node);

  const iconEl = (
    <Iconify
      icon={icon}
      width={24}
      height={24}
      sx={{
        filter: "none",
        color: (nodeStyle.iconColor as string) || "#ffffff",
      }}
    />
  );

  const labelEl = (
    <LabelText data-animated={animated} $style={labelStyle} $variant={variant}>
      {label}
    </LabelText>
  );

  const descriptionEl = description && (
    <DescriptionText data-animated={animated} $variant={variant}>
      {description}
    </DescriptionText>
  );

  const actionEl = action && (
    <ActionText data-animated={animated} $variant={variant}>
      {action}
    </ActionText>
  );

  if (isSplit) {
    const iconPanel = (
      <SplitIconPanel $isReversed={isReversed}>
        <IconContainer $style={iconContainerStyle} $variant={variant}>
          {iconEl}
        </IconContainer>
      </SplitIconPanel>
    );

    const contentColumn = (
      <SplitContentColumn>
        <SplitLabelDescWrap>
          {labelEl}
          {descriptionEl}
        </SplitLabelDescWrap>
        {actionEl}
      </SplitContentColumn>
    );

    return (
      <MainContainer
        $style={layoutStyle}
        $variant={variant}
        data-hovered={isHovered}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isReversed ? (
          <>
            {contentColumn}
            {iconPanel}
          </>
        ) : (
          <>
            {iconPanel}
            {contentColumn}
          </>
        )}
        {children}
      </MainContainer>
    );
  }

  return (
    <MainContainer
      $style={layoutStyle}
      $variant={variant}
      data-hovered={isHovered}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <HeaderRow $variant={variant}>
        <IconContainer $style={iconContainerStyle} $variant={variant}>
          {iconEl}
        </IconContainer>
        {labelEl}
      </HeaderRow>

      {descriptionEl}
      {actionEl}

      {children}
    </MainContainer>
  );
};

export default InfoNode;
