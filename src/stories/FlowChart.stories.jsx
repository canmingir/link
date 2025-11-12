import { FlowChart } from "../lib/FlowChart";
import React from "react";

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
    style: {
      control: "function",
      description: "Styling options for lines and spacing between nodes.",
    },
    type: {
      control: "text",
      description: "Type of the flow chart, affecting default styles.",
    },
    variant: {
      control: {
        type: "select",
        options: ["simple", "card", "pill", "decision"],
      },
      description: "Visual variant of the flow chart nodes.",
    },
  },
};

export const SimpleTextNodes = {
  args: {
    type: "default",
    data: {
      id: "root",
      label: "Start",
      children: [
        { id: "step1", label: "Step 1", children: [] },
        { id: "step2", label: "Step 2", children: [] },
      ],
    },
    variant: "simple",
    style: {
      border: "normal",
    },
  },
};

export const CardNodes = {
  args: {
    type: "default",
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
    variant: "card",
    style: {
      border: "light",
      size: "small",
      shadow: "heavy",
      shape: "square",
    },
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

    return <FlowChart data={orgData} variant="pill" />;
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

    return <FlowChart data={decisionData} variant="decision" />;
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
    variant: "simple",
  },
};

export const TaskFlow = {
  render: () => {
    const steps = [
      {
        id: "773b051a-326a-4140-98c4-d63df8aba39f",
        action: "PLATFORM:scrape_website",
        parameters: {
          url: "https://nucleoid.com/domain-ownership.html",
        },
        result:
          '\n        URL: https://nucleoid.com/domain-ownership.html\n        Title: \n        Content: This domain "nucleoid.com" is owned by Can Mingir for Nucleoid Ltd. Co. Contact: canmingir@nucleoid.com Phone: (914) 525-5929 Address: 2972 Webb Bridge Rd, Alpharetta, GA 30009, United States\n      ',
        comment: "Scrape the website to extract the list of emails",
        status: "COMPLETED",
        taskId: "6ce93ce9-d923-46ba-b8a9-1a4cea50ca07",
        createdAt: "2025-11-10T13:09:53.188Z",
      },
      {
        id: "e6b12140-f922-4fa5-9e9d-e3064909716c",
        action: "PLATFORM:llm",
        parameters: {
          message:
            'Extract the email addresses from the scraped website content:\n\nThis domain "nucleoid.com" is owned by Can Mingir for Nucleoid Ltd. Co. Contact: canmingir@nucleoid.com Phone: (914) 525-5929 Address: 2972 Webb Bridge Rd, Alpharetta, GA 30009, United States',
        },
        result: '["canmingir@nucleoid.com"]',
        comment: "Extract the email addresses from the scraped website content",
        status: "COMPLETED",
        taskId: "6ce93ce9-d923-46ba-b8a9-1a4cea50ca07",
        createdAt: "2025-11-10T13:09:59.261Z",
      },
      {
        id: "05fba361-4071-4db7-88e8-4f1b6fabddba",
        action: "PLATFORM:complete",
        parameters: {},
        result: "Task completed successfully",
        comment:
          "Task completed after extracting email addresses from the website",
        status: "COMPLETED",
        taskId: "6ce93ce9-d923-46ba-b8a9-1a4cea50ca07",
        createdAt: "2025-11-10T13:10:02.653Z",
      },
    ];

    const sortedSteps = [...steps].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    const root = {
      ...sortedSteps[0],
      id: `node-0`,
      children: [],
    };

    let currentNode = root;
    for (let i = 1; i < sortedSteps.length; i++) {
      const newNode = {
        ...sortedSteps[i],
        id: `node-${i}`,
        children: [],
      };
      currentNode.children = [newNode];
      currentNode = newNode;
    }

    return (
      <FlowChart
        type="task"
        data={root}
        variant="pill"
        style={{
          visible: true,
          delay: 0,
          isLoading: false,
        }}
      />
    );
  },
};
