import AnimatedNode from "./AnimatedNode";

import { Card, CircularProgress, Typography } from "@mui/material";

interface LoadingNodeProps {
  visible?: boolean;
  delay?: number;
}

const LoadingNode = ({ visible, delay }: LoadingNodeProps) => (
  <AnimatedNode visible={visible} delay={delay}>
    <Card
      sx={{
        p: 2,
        width: 180,
        height: 100,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        borderRadius: 1,
        bgcolor: "background.paper",
      }}
    >
      <CircularProgress size={24} />
      <Typography
        variant="caption"
        sx={{
          textAlign: "center",
          fontSize: "0.5rem",
          color: "text.secondary",
        }}
      >
        Loading...
      </Typography>
    </Card>
  </AnimatedNode>
);

export default LoadingNode;
