import AnimatedNode from "./AnimatedNode";
import Iconify from "../../Iconify";
import LoadingNode from "./LoadingNode";
import type { ReactNode } from "react";

import { Card, Tooltip, Typography } from "@mui/material";

interface ActionNodeProps {
  visible?: boolean;
  delay?: number;
  isLoading?: boolean;
  action?: ReactNode;
  status?: ReactNode;
  tooltip?: ReactNode;
  icon?: string;
}

const ActionNode = ({
  visible,
  delay,
  isLoading,
  action,
  status,
  tooltip,
  icon,
}: ActionNodeProps) => {
  if (isLoading) {
    return <LoadingNode visible={visible} delay={delay} />;
  }

  const card = (
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
          transition: "background-color 0.3s ease",
          "&:hover": {
            bgcolor: "grey.600",
            cursor: "pointer",
          },
        }}
      >
        <Iconify icon={icon ?? ""} width={24} height={24} />
        <Typography
          variant="caption"
          sx={{
            textAlign: "center",
            fontSize: "0.5rem",
            color: "text.secondary",
          }}
        >
          {action}
        </Typography>
        {status && (
          <Typography
            variant="caption"
            sx={{
              textAlign: "center",
              fontSize: "0.5rem",
              color: "text.secondary",
            }}
          >
            {status}
          </Typography>
        )}
      </Card>
    </AnimatedNode>
  );

  if (!tooltip) return card;

  return (
    <Tooltip title={tooltip} placement="right">
      {card}
    </Tooltip>
  );
};

export default ActionNode;
