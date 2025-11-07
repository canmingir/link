import { FlowChart } from ".";

import { Card, CardContent, Typography } from "@mui/material";

export const SimpleExample = () => {
  const data = {
    id: "1",
    label: "Start",
    children: [
      { id: "2", label: "Step 1", children: [] },
      { id: "3", label: "Step 2", children: [] },
    ],
  };

  return (
    <FlowChart data={data} renderNode={(node) => <div>{node.label}</div>} />
  );
};

export const CardExample = () => {
  const data = {
    id: "1",
    title: "Project",
    description: "Main project",
    children: [
      { id: "2", title: "Task 1", description: "First task", children: [] },
      { id: "3", title: "Task 2", description: "Second task", children: [] },
    ],
  };

  return (
    <FlowChart
      data={data}
      renderNode={(node) => (
        <Card sx={{ width: 150 }}>
          <CardContent>
            <Typography variant="h6">{node.title}</Typography>
            <Typography variant="body2">{node.description}</Typography>
          </CardContent>
        </Card>
      )}
      lineColor="#2196F3"
      lineStyle="solid"
    />
  );
};

export const CustomStyleExample = () => {
  const data = {
    id: "root",
    name: "Root",
    children: [
      {
        id: "branch-1",
        name: "Branch 1",
        children: [{ id: "leaf-1", name: "Leaf 1", children: [] }],
      },
      {
        id: "branch-2",
        name: "Branch 2",
        children: [{ id: "leaf-2", name: "Leaf 2", children: [] }],
      },
    ],
  };

  return (
    <FlowChart
      data={data}
      renderNode={(node) => (
        <div
          style={{
            padding: "10px 20px",
            background: "#FF5722",
            color: "white",
            borderRadius: "5px",
          }}
        >
          {node.name}
        </div>
      )}
      lineColor="#FF5722"
      lineWidth="3px"
      lineStyle="solid"
      gap="60px"
    />
  );
};
