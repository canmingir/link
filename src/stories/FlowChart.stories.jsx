import { FlowChart } from "../lib/FlowChart";
import React from "react";

import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";

export default {
  title: "Components/FlowChart",
  component: FlowChart,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    data: {
      control: "object",
      description: "Tree structure with id and children properties",
    },
    renderNode: {
      control: false,
      description: "Function that renders each node",
    },
    lineColor: {
      control: "color",
      description: "Color of connecting lines",
    },
    lineWidth: {
      control: "text",
      description: "Width of connecting lines",
    },
    lineStyle: {
      control: "select",
      options: ["solid", "dashed", "dotted"],
      description: "Style of connecting lines",
    },
    gap: {
      control: "text",
      description: "Space between nodes",
    },
  },
};

export const SimpleTextNodes = {
  args: {
    data: {
      id: "root",
      label: "Start",
      children: [
        { id: "step1", label: "Step 1", children: [] },
        { id: "step2", label: "Step 2", children: [] },
      ],
    },
    renderNode: (node) => (
      <Box
        sx={{
          padding: "12px 20px",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
          border: "2px solid #e0e0e0",
        }}
      >
        {node.label}
      </Box>
    ),
    lineColor: "#4CAF50",
    lineWidth: "2px",
    lineStyle: "dashed",
    gap: "40px",
  },
};

export const CardNodes = {
  args: {
    data: {
      id: "1",
      title: "Project Alpha",
      description: "Main project",
      status: "active",
      children: [
        {
          id: "2",
          title: "Task 1",
          description: "First task",
          status: "completed",
          children: [],
        },
        {
          id: "3",
          title: "Task 2",
          description: "Second task",
          status: "in-progress",
          children: [],
        },
      ],
    },
    renderNode: (node) => (
      <Card sx={{ width: 200, boxShadow: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {node.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {node.description}
          </Typography>
          <Chip
            label={node.status}
            size="small"
            color={node.status === "completed" ? "success" : "primary"}
          />
        </CardContent>
      </Card>
    ),
    lineColor: "#2196F3",
    lineWidth: "2px",
    lineStyle: "solid",
    gap: "50px",
  },
};

export const OrganizationalChart = {
  render: () => {
    const orgData = {
      id: "ceo",
      name: "John Doe",
      role: "CEO",
      children: [
        {
          id: "cto",
          name: "Jane Smith",
          role: "CTO",
          children: [
            { id: "dev1", name: "Dev Lead", role: "Development", children: [] },
            { id: "qa1", name: "QA Lead", role: "QA", children: [] },
          ],
        },
        {
          id: "cfo",
          name: "Bob Johnson",
          role: "CFO",
          children: [],
        },
      ],
    };

    return (
      <FlowChart
        data={orgData}
        renderNode={(node) => (
          <Card sx={{ width: 180 }}>
            <CardContent sx={{ textAlign: "center" }}>
              <Avatar
                sx={{
                  width: 50,
                  height: 50,
                  margin: "0 auto 8px",
                  bgcolor: "primary.main",
                }}
              >
                {node.name.charAt(0)}
              </Avatar>
              <Typography variant="h6" sx={{ fontSize: 14 }}>
                {node.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {node.role}
              </Typography>
            </CardContent>
          </Card>
        )}
        lineColor="#1976d2"
        lineWidth="3px"
        lineStyle="solid"
        gap="60px"
      />
    );
  },
};

export const DecisionTree = {
  render: () => {
    const decisionData = {
      id: "start",
      label: "Start Process",
      type: "start",
      children: [
        {
          id: "check",
          label: "Valid Input?",
          type: "decision",
          children: [
            {
              id: "process",
              label: "Process Data",
              type: "process",
              children: [
                { id: "success", label: "Success", type: "end", children: [] },
              ],
            },
            {
              id: "error",
              label: "Show Error",
              type: "process",
              children: [
                { id: "end", label: "End", type: "end", children: [] },
              ],
            },
          ],
        },
      ],
    };

    const getNodeStyle = (type) => {
      const styles = {
        start: { bg: "#E8F5E9", border: "#4CAF50", shape: "8px" },
        decision: { bg: "#FFF3E0", border: "#FF9800", shape: "50%" },
        process: { bg: "#E3F2FD", border: "#2196F3", shape: "8px" },
        end: { bg: "#FFEBEE", border: "#F44336", shape: "8px" },
      };
      return styles[type] || styles.process;
    };

    return (
      <FlowChart
        data={decisionData}
        renderNode={(node) => {
          const style = getNodeStyle(node.type);
          return (
            <Box
              sx={{
                padding: "12px 20px",
                backgroundColor: style.bg,
                border: `2px solid ${style.border}`,
                borderRadius: style.shape,
                minWidth: "100px",
                textAlign: "center",
              }}
            >
              {node.label}
            </Box>
          );
        }}
        lineColor="#757575"
        lineWidth="2px"
        lineStyle="dashed"
        gap="60px"
      />
    );
  },
};

export const DeepHierarchy = {
  args: {
    data: {
      id: "root",
      label: "Root",
      children: [
        {
          id: "branch1",
          label: "Branch 1",
          children: [
            {
              id: "leaf1-1",
              label: "Leaf 1.1",
              children: [
                { id: "leaf1-1-1", label: "Leaf 1.1.1", children: [] },
              ],
            },
          ],
        },
        {
          id: "branch2",
          label: "Branch 2",
          children: [
            { id: "leaf2-1", label: "Leaf 2.1", children: [] },
            { id: "leaf2-2", label: "Leaf 2.2", children: [] },
          ],
        },
      ],
    },
    renderNode: (node) => (
      <Box
        sx={{
          padding: "10px 16px",
          backgroundColor: "#fff",
          border: "2px solid #2196F3",
          borderRadius: "6px",
        }}
      >
        {node.label}
      </Box>
    ),
    lineColor: "#2196F3",
    lineWidth: "2px",
    lineStyle: "solid",
    gap: "50px",
  },
};
