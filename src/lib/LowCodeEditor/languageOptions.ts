export const languageOptions: {
  value: string;
  extension: string;
  starterCode: string;
}[] = [
  {
    value: "python",
    extension: "py",
    starterCode: `expensive_items = Item.filter(item => item.price > 500)

for item of expensive_items:
    print(item.name, item.price)`,
  },
  {
    value: "typescript",
    extension: "ts",
    starterCode: `type Agent = { id: string; name: string; status: "active" | "paused" };
const agents: Agent[] = [
  { id: "a-1", name: "SupportAgent", status: "active" },
  { id: "a-2", name: "SalesAgent", status: "paused" }
];
export const activeAgents = (list: Agent[]) => list.filter((a) => a.status === "active");`,
  },
  {
    value: "javascript",
    extension: "js",
    starterCode: `const agents = [
  { id: "a-1", name: "SupportAgent", status: "active" },
  { id: "a-2", name: "SalesAgent", status: "paused" }
];
const activeAgents = (list) => list.filter((a) => a.status === "active");
console.log(activeAgents(agents));`,
  },
  {
    value: "go",
    extension: "go",
    starterCode: `package main

import "fmt"

type Agent struct {
  ID string
  Name string
  Status string
}

func activeAgents(items []Agent) []Agent {
  result := []Agent{}
  for _, a := range items {
    if a.Status == "active" {
      result = append(result, a)
    }
  }
  return result
}

func main() {
  agents := []Agent{
    {ID: "a-1", Name: "SupportAgent", Status: "active"},
    {ID: "a-2", Name: "SalesAgent", Status: "paused"},
  }
  fmt.Println(activeAgents(agents))
}`,
  },
  {
    value: "java",
    extension: "java",
    starterCode: `import java.util.List;
import java.util.stream.Collectors;

record Agent(String id, String name, String status) {}

class Main {
  public static void main(String[] args) {
    List<Agent> agents = List.of(
      new Agent("a-1", "SupportAgent", "active"),
      new Agent("a-2", "SalesAgent", "paused")
    );
    System.out.println(activeAgents(agents));
  }

  static List<Agent> activeAgents(List<Agent> items) {
    return items.stream().filter(a -> "active".equals(a.status())).collect(Collectors.toList());
  }
}`,
  },
  {
    value: "json",
    extension: "json",
    starterCode: `{
  "agents": [
    { "id": "a-1", "name": "SupportAgent", "status": "active" },
    { "id": "a-2", "name": "SalesAgent", "status": "paused" }
  ]
}`,
  },
  {
    value: "markdown",
    extension: "md",
    starterCode: `# Agent Notes

- SupportAgent: active
- SalesAgent: paused`,
  },
];

export const defaultLanguage = languageOptions[0];

export const detectLanguage = (text: string): string => {
  const trimmed = text.trim();
  if (!trimmed) return "python";

  if (
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]"))
  ) {
    return "json";
  }

  const isPythonStatement = /^\s*[A-Za-z_]\w*\s*(?:=\s*[A-Za-z_][\w.]*)?\s*\(/m;
  if (
    /^\s*def\s+\w+\(/m.test(text) ||
    /^\s*import\s+\w+/m.test(text) ||
    /^\s*from\s+\w+\s+import\s+/m.test(text) ||
    /:\s*\n\s+/.test(text) ||
    (isPythonStatement.test(text) && !/[;{}]|=>|\bconst\b|\blet\b/.test(text))
  ) {
    return "python";
  }

  if (
    /^#{1,6}\s/m.test(text) ||
    /```/.test(text) ||
    /^\s*[-*]\s+/m.test(text)
  ) {
    return "markdown";
  }

  if (
    /^\s*package\s+\w+/m.test(text) ||
    /^\s*func\s+\w+\(/m.test(text) ||
    /:=/.test(text)
  ) {
    return "go";
  }

  if (
    /^\s*public\s+class\s+\w+/m.test(text) ||
    /^\s*class\s+\w+\s*\{/m.test(text) ||
    /System\.out\.println/.test(text)
  ) {
    return "java";
  }

  if (
    /(^|\n)\s*(interface|type)\s+\w+/m.test(text) ||
    /:\s*(string|number|boolean|unknown|any)\b/.test(text)
  ) {
    return "typescript";
  }

  return "python";
};

export const getExtension = (language: string): string => {
  return (
    languageOptions.find((item) => item.value === language)?.extension || "txt"
  );
};
