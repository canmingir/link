import { Box } from "@mui/material";
import React from "react";

const FlowChart = ({
  data,
  renderNode,
  lineColor = "#4CAF50",
  lineWidth = "2px",
  lineStyle = "dashed",
  gap = "40px",
}) => {
  const hasChildren = data.children && data.children.length > 0;

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
        {renderNode(data)}

        {hasChildren && (
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              top: "100%",
              width: lineWidth,
              height: "20px",
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

      {/* Children */}
      {hasChildren && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: gap,
            marginTop: "20px",
            position: "relative",
          }}
        >
          {data.children.length > 1 && (
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
                  left: "50%",
                  right: "50%",
                  height: lineWidth,
                  backgroundColor:
                    lineStyle === "solid" ? lineColor : "transparent",
                  borderTop:
                    lineStyle !== "solid"
                      ? `${lineWidth} ${lineStyle} ${lineColor}`
                      : "none",
                  transform: "translateX(-50%)",
                  width: "100%",
                },
              }}
            />
          )}

          {data.children.map((child) => (
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
                  height: "20px",
                  backgroundColor:
                    lineStyle === "solid" ? lineColor : "transparent",
                  borderLeft:
                    lineStyle !== "solid"
                      ? `${lineWidth} ${lineStyle} ${lineColor}`
                      : "none",
                  transform: "translateX(-50%)",
                }}
              />

              <FlowChart
                data={child}
                renderNode={renderNode}
                lineColor={lineColor}
                lineWidth={lineWidth}
                lineStyle={lineStyle}
                gap={gap}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default FlowChart;
