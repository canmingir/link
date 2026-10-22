import type * as Monaco from "monaco-editor";

import type { SchemaClass } from "./types";

export const schemaRegistry = new Map<string, SchemaClass[]>();
const schemaProvidersRegistered = new Set<string>();

const CLASS_METHODS: {
  name: string;
  signature: string;
  insertText: string;
  returns: "list" | "instance" | "scalar";
  doc: (cls: SchemaClass) => string;
}[] = [
  {
    name: "filter",
    signature: "filter(row => condition)",
    insertText: "filter(${1:row} => ${2:condition})",
    returns: "list",
    doc: (cls) => `${cls.name} records matching the condition.`,
  },
  {
    name: "find",
    signature: "find(row => condition)",
    insertText: "find(${1:row} => ${2:condition})",
    returns: "instance",
    doc: (cls) => `The first ${cls.name} matching the condition, or null.`,
  },
  {
    name: "length",
    signature: "length",
    insertText: "length",
    returns: "scalar",
    doc: (cls) => `How many ${cls.name} records there are.`,
  },
];

function inferVariableTypes(
  text: string,
  classes: SchemaClass[]
): Map<string, { className: string; isList: boolean }> {
  const byName = new Map(classes.map((cls) => [cls.name, cls]));
  const inferred = new Map<string, { className: string; isList: boolean }>();

  const assignment =
    /(?:^|\n)\s*([A-Za-z_]\w*)\s*=\s*([A-Za-z_]\w*)\s*\.\s*([A-Za-z_]\w*)\s*\(/g;
  let match: RegExpExecArray | null;
  while ((match = assignment.exec(text)) !== null) {
    const [, variable, owner, method] = match;
    if (!byName.has(owner)) continue;
    const known = CLASS_METHODS.find((item) => item.name === method);
    if (!known || known.returns === "scalar") continue;
    inferred.set(variable, {
      className: owner,
      isList: known.returns === "list",
    });
  }

  const creation =
    /(?:^|\n)\s*([A-Za-z_]\w*)\s*=\s*([A-Za-z_]\w*)\s*\(\s*\)\s*(?=$|\n)/g;
  while ((match = creation.exec(text)) !== null) {
    const [, variable, owner] = match;
    if (byName.has(owner)) {
      inferred.set(variable, { className: owner, isList: false });
    }
  }

  const iteration = /\bfor\s+([A-Za-z_]\w*)\s+(?:in|of)\s+([A-Za-z_]\w*)/g;
  const alias = /(?:^|\n)\s*([A-Za-z_]\w*)\s*=\s*([A-Za-z_]\w*)\s*(?:$|\n)/g;
  const arrowParam =
    /\b([A-Za-z_]\w*)\s*\.\s*(?:filter|find)\s*\(\s*([A-Za-z_]\w*)\s*=>/g;

  for (let pass = 0; pass < 3; pass += 1) {
    arrowParam.lastIndex = 0;
    while ((match = arrowParam.exec(text)) !== null) {
      const [, source, param] = match;
      const sourceType = byName.has(source)
        ? { className: source, isList: true }
        : inferred.get(source);
      if (!sourceType || !sourceType.isList) continue;
      inferred.set(param, { className: sourceType.className, isList: false });
    }

    iteration.lastIndex = 0;
    while ((match = iteration.exec(text)) !== null) {
      const [, item, source] = match;
      const sourceType = byName.has(source)
        ? { className: source, isList: true }
        : inferred.get(source);
      if (!sourceType || !sourceType.isList) continue;
      inferred.set(item, { className: sourceType.className, isList: false });
    }

    alias.lastIndex = 0;
    while ((match = alias.exec(text)) !== null) {
      const [, target, source] = match;
      const sourceType = byName.has(source)
        ? { className: source, isList: true }
        : inferred.get(source);
      if (sourceType) inferred.set(target, sourceType);
    }
  }

  return inferred;
}

function propertyDoc(cls: SchemaClass): string {
  if (!cls.properties.length) return "_No columns yet._";
  return cls.properties
    .map((property) => `- \`${property.name}\`: ${property.type}`)
    .join("\n");
}

function classDoc(cls: SchemaClass): string {
  return [
    cls.description ? `${cls.description}\n` : "",
    cls.tableName ? `Generated from table \`${cls.tableName}\`.\n` : "",
    "**Properties**",
    propertyDoc(cls),
  ]
    .filter(Boolean)
    .join("\n");
}

export function ensureSchemaProviders(monaco: typeof Monaco, language: string) {
  if (schemaProvidersRegistered.has(language)) return;
  schemaProvidersRegistered.add(language);

  monaco.languages.registerCompletionItemProvider(language, {
    triggerCharacters: ["."],
    provideCompletionItems(model, position) {
      const classes = schemaRegistry.get(model.uri.toString()) ?? [];
      if (!classes.length) return { suggestions: [] };

      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const linePrefix = model.getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: word.startColumn,
      });
      const member = /([A-Za-z_]\w*)\s*\.\s*$/.exec(linePrefix);

      if (member) {
        const owner = member[1];
        const asClass = classes.find((cls) => cls.name === owner);

        if (asClass) {
          return {
            suggestions: [
              ...CLASS_METHODS.map((method) => ({
                label: method.signature,
                kind: monaco.languages.CompletionItemKind.Method,
                detail: `${asClass.name} · ${
                  method.returns === "list"
                    ? `list[${asClass.name}]`
                    : method.returns === "instance"
                    ? asClass.name
                    : "int"
                }`,
                documentation: { value: method.doc(asClass) },
                insertText: method.insertText,
                insertTextRules:
                  monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                range,
                sortText: `0_${method.name}`,
              })),
              ...asClass.properties.map((property) => ({
                label: property.name,
                kind: monaco.languages.CompletionItemKind.Field,
                detail: `${asClass.name}.${property.name} · ${property.type}`,
                documentation: property.description
                  ? { value: property.description }
                  : undefined,
                insertText: property.name,
                range,
                sortText: `1_${property.name}`,
              })),
            ],
          };
        }

        const variable = inferVariableTypes(model.getValue(), classes).get(
          owner
        );
        const target = variable?.isList
          ? null
          : classes.find((cls) => cls.name === variable?.className);
        if (!target) return { suggestions: [] };

        return {
          suggestions: target.properties.map((property) => ({
            label: property.name,
            kind: monaco.languages.CompletionItemKind.Field,
            detail: `${target.name}.${property.name} · ${property.type}`,
            documentation: property.description
              ? { value: property.description }
              : undefined,
            insertText: property.name,
            range,
            sortText: `0_${property.name}`,
          })),
        };
      }

      return {
        suggestions: classes.map((cls) => ({
          label: cls.name,
          kind: monaco.languages.CompletionItemKind.Class,
          detail: `table · ${cls.tableName ?? cls.name}`,
          documentation: { value: classDoc(cls) },
          insertText: cls.name,
          range,
          sortText: `1_${cls.name}`,
        })),
      };
    },
  });

  monaco.languages.registerHoverProvider(language, {
    provideHover(model, position) {
      const classes = schemaRegistry.get(model.uri.toString()) ?? [];
      if (!classes.length) return null;

      const word = model.getWordAtPosition(position);
      if (!word) return null;

      const range = new monaco.Range(
        position.lineNumber,
        word.startColumn,
        position.lineNumber,
        word.endColumn
      );

      const asClass = classes.find((cls) => cls.name === word.word);
      if (asClass) {
        return {
          range,
          contents: [
            { value: `**${asClass.name}** — database class` },
            { value: classDoc(asClass) },
          ],
        };
      }

      const variables = inferVariableTypes(model.getValue(), classes);
      const variable = variables.get(word.word);
      if (variable) {
        return {
          range,
          contents: [
            {
              value: `**${word.word}**: ${
                variable.isList
                  ? `list[${variable.className}]`
                  : variable.className
              }`,
            },
          ],
        };
      }

      const before = model.getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: word.startColumn,
      });
      const owner = /([A-Za-z_]\w*)\s*\.\s*$/.exec(before)?.[1];
      if (!owner) return null;

      const ownerType = variables.get(owner);
      const target =
        classes.find((cls) => cls.name === owner) ??
        classes.find(
          (cls) =>
            cls.name === (ownerType?.isList ? null : ownerType?.className)
        );
      const property = target?.properties.find(
        (item) => item.name === word.word
      );
      if (!target || !property) return null;

      return {
        range,
        contents: [
          { value: `**${target.name}.${property.name}**: ${property.type}` },
          ...(property.description ? [{ value: property.description }] : []),
        ],
      };
    },
  });
}
