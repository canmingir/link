import { FlowChart } from "../lib/FlowChart";
import React from "react";

const treeToLinked = (tree) => {
  if (!tree) return { nodes: {}, roots: [] };

  const nodes = {};
  const roots = [];

  const walk = (node, parentId = null) => {
    if (!node || !node.id) return;

    const { children, ...rest } = node;
    if (!nodes[node.id]) {
      nodes[node.id] = { ...rest, id: node.id };
    }

    const kids = Array.isArray(children) ? children : [];
    const nextIds = kids.map((c) => c.id).filter(Boolean);

    if (nextIds.length === 1) {
      nodes[node.id].next = nextIds[0];
    } else if (nextIds.length > 1) {
      nodes[node.id].next = nextIds;
    }

    if (parentId) {
      nodes[node.id].previous = parentId;
    } else if (!roots.includes(node.id)) {
      roots.push(node.id);
    }

    kids.forEach((child) => walk(child, node.id));
  };

  walk(tree);
  return { nodes, roots };
};

const arrayToLinked = (arr) => {
  const a = Array.isArray(arr) ? [...arr] : [];
  if (!a.length) return { nodes: {}, roots: [] };

  a.sort((x, y) => {
    const dx = x?.createdAt ? new Date(x.createdAt).getTime() : 0;
    const dy = y?.createdAt ? new Date(y.createdAt).getTime() : 0;
    return dx - dy;
  });

  const nodes = {};
  const ids = [];

  for (let i = 0; i < a.length; i++) {
    const id = a[i]?.id ?? `auto-${i}`;
    ids.push(id);
    nodes[id] = { ...(a[i] || {}), id };
  }

  for (let i = 0; i < ids.length; i++) {
    const cur = ids[i];
    const prev = ids[i - 1];
    const nxt = ids[i + 1];
    if (prev) nodes[cur].previous = prev;
    if (nxt) nodes[cur].next = nxt;
  }

  return { nodes, roots: [ids[0]] };
};

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
      description:
        "Linked graph data: { nodes: { [id]: { id, next?, previous?, ... } }, roots?: string[] }",
    },
    style: {
      control: "object",
      description:
        "Styling tokens or a style object; can also be a function (node) => tokens.",
    },
    type: {
      control: "text",
      description: 'Type of the flow chart, e.g. "default" or "task".',
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

const simpleTree = {
  id: "root",
  label: "Start",
  children: [
    { id: "step1", label: "Step 1", children: [] },
    { id: "step2", label: "Step 2", children: [] },
  ],
};

export const SimpleTextNodes = {
  args: {
    type: "default",
    data: treeToLinked(simpleTree),
    variant: "simple",
  },
};

const cardTree = {
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
};

export const CardNodes = {
  args: {
    type: "default",
    data: treeToLinked(cardTree),
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
    const orgTree = {
      id: "add6dfa4-45ba-4da2-bc5c-5a529610b52f",
      name: "Rebellion Coffee Shop Team",
      icon: ":ph:coffee-bean-duotone:",
      description: null,
      type: null,
      organizationId: "dfb990bb-81dd-4584-82ce-050eb8f6a12f",
      coach: "Elijah",
      colleagues: [
        {
          id: "00db1bd4-4829-40f2-8b99-d2e42342157e",
          name: "Ava",
          avatar: ":1:",
          character: "Funny, friendly, and a coffee lover",
          title: "Barista",
          role: "Barista Expert",
          teamId: "add6dfa4-45ba-4da2-bc5c-5a529610b52f",
          aiEngineId: "289a3c9a-f23b-421a-ac6e-f14052a2d57c",
        },
        {
          id: "ef906c5d-cafe-4518-9edc-b80c605df58e",
          name: "Taylor",
          title: "Customer Service Representative",
          avatar: ":2:",
          character: "Friendly, helpful, and a team player",
          role: "Customer Service Representative",
          teamId: "e6d4744d-a11b-4c75-acad-e24a02903729",
          aiEngineId: "289a3c9a-f23b-421a-ac6e-f14052a2d57c",
        },
      ],
    };

    const data = treeToLinked(orgTree);

    return <FlowChart type="teamChart" data={data} variant="simple" />;
  },
};

export const DecisionTree = {
  render: () => {
    const decisionTree = {
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

    const data = treeToLinked(decisionTree);

    return (
      <FlowChart
        data={data}
        variant="decision"
        style={{ connectorType: "curved" }}
      />
    );
  },
};

const deepTree = {
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
          children: [{ id: "leaf1-1-1", label: "Leaf 1.1.1", children: [] }],
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
};

export const DeepHierarchy = {
  args: {
    type: "default",
    data: treeToLinked(deepTree),
    variant: "simple",
  },
};

export const TaskFlow = {
  render: () => {
    const timeline = [
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

    const data = arrayToLinked(timeline);

    return (
      <FlowChart
        type="task"
        data={data}
        variant="pill"
        style={{
          visible: true,
          delay: 0,
          isLoading: false,
          connectorType: "curved",
        }}
      />
    );
  },
};
