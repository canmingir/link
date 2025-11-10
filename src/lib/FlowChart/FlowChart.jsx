import NodeBox from "./NodeBox";
import React from "react";

import { Box, Card, Typography } from "@mui/material";

export const FlowChart = ({
  type = "default",
  data,
  style = {
    lineColor: "#4CAF50",
    lineWidth: "2px",
    lineStyle: "dashed",
    gap: "40px",
  },
}) => {
  const hasChildren = Array.isArray(data.children) && data.children.length > 0;

  const resolveStyle = (node) =>
    typeof style === "function" ? style(node) : style || {};

  const nodeStyle = resolveStyle(data);
  const {
    lineColor = "#4CAF50",
    lineWidth = "2px",
    lineStyle = "dashed",
    gap = "40px",
    visible = true,
    delay = 0,
    isLoading = false,
    nodeSx = {},
  } = nodeStyle;

  const renderNodeContent = (node) => {
    const entries = Object.entries(node).filter(
      ([key]) => key !== "children" && key !== "id"
    );

    if (entries.length === 0) {
      return (
        <Typography variant="body2" sx={{ fontSize: 12, textAlign: "center" }}>
          (empty)
        </Typography>
      );
    }

    const preferredTitleKeys = ["label", "title", "name"];
    const titleEntry =
      entries.find(([key]) => preferredTitleKeys.includes(key)) || entries[0];

    const [titleKey, titleValRaw] = titleEntry;
    const titleVal = String(titleValRaw);

    let remaining = entries.filter(([key]) => key !== titleKey);

    const preferredSubtitleKeys = ["description", "role", "type", "status"];
    const subtitleEntry =
      remaining.find(([key]) => preferredSubtitleKeys.includes(key)) || null;

    let subtitleVal = null;
    if (subtitleEntry) {
      const [subtitleKey, raw] = subtitleEntry;
      subtitleVal = String(raw);
      remaining = remaining.filter(([key]) => key !== subtitleKey);
    }

    const metaEntries = remaining.filter(([, value]) => {
      const t = typeof value;
      return (
        (t === "string" || t === "number" || t === "boolean") &&
        value !== "" &&
        value !== null
      );
    });

    return (
      <Box sx={{ textAlign: "left", width: "100%" }}>
        <Typography
          variant="subtitle2"
          sx={{
            textAlign: "center",
            fontWeight: 600,
            fontSize: 13,
            mb: subtitleVal ? 0.5 : 0,
          }}
        >
          {titleVal}
        </Typography>

        {subtitleVal && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              textAlign: "center",
              fontSize: 11,
              mb: metaEntries.length ? 0.5 : 0,
            }}
          >
            {subtitleVal}
          </Typography>
        )}

        {metaEntries.length > 0 && (
          <Box sx={{ mt: 0.25 }}>
            {metaEntries.map(([key, value]) => (
              <Typography
                key={key}
                variant="caption"
                color="text.secondary"
                sx={{
                  textAlign: "center",
                  display: "block",
                  fontSize: 10,
                }}
              >
                {key}: {String(value)}
              </Typography>
            ))}
          </Box>
        )}
      </Box>
    );
  };

  const renderCard = () => (
    <Card
      sx={{
        p: 2,
        width: 220,
        minHeight: 80,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        borderRadius: nodeStyle.shape || 1,
        bgcolor: nodeStyle.bg || "background.paper",
        border: nodeStyle.border
          ? `2px solid ${nodeStyle.border}`
          : "1px solid transparent",
        boxShadow: 1,
        transition: "background-color 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          bgcolor: nodeStyle.hoverBg || nodeStyle.bg || "grey.100",
          boxShadow: 3,
          cursor: "pointer",
        },
        ...nodeSx,
      }}
    >
      {renderNodeContent(data)}
    </Card>
  );

  const isTask = type === "task";

  return (
    <Box
      sx={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
      }}
    >
      <Box sx={{ position: "relative" }}>
        {isTask ? (
          <NodeBox
            nodeData={data}
            visible={visible}
            delay={delay}
            isLoading={isLoading}
          />
        ) : (
          renderCard()
        )}

        {hasChildren && (
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              top: "100%",
              width: lineWidth,
              height: 20,
              transform: "translateX(-50%)",
              backgroundColor:
                lineStyle === "solid" ? lineColor : "transparent",
              borderLeft:
                lineStyle !== "solid"
                  ? `${lineWidth} ${lineStyle} ${lineColor}`
                  : "none",
            }}
          />
        )}
      </Box>

      {hasChildren && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap,
            marginTop: 2.5,
            position: "relative",
          }}
        >
          {data.children && data.children.length > 1 && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: lineWidth,
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: lineWidth,
                  backgroundColor:
                    lineStyle === "solid" ? lineColor : "transparent",
                  borderTop:
                    lineStyle !== "solid"
                      ? `${lineWidth} ${lineStyle} ${lineColor}`
                      : "none",
                },
              }}
            />
          )}

          {data.children?.map((child) => (
            <Box
              key={child.id}
              sx={{
                display: "inline-flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  left: "50%",
                  bottom: "100%",
                  width: lineWidth,
                  height: 20,
                  backgroundColor:
                    lineStyle === "solid" ? lineColor : "transparent",
                  borderLeft:
                    lineStyle !== "solid"
                      ? `${lineWidth} ${lineStyle} ${lineColor}`
                      : "none",
                  transform: "translateX(-50%)",
                }}
              />

              <FlowChart data={child} style={style} type={type} />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default FlowChart;
