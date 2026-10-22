/**
 * Shapes for the JSON-schema-ish tree the SchemaEditor edits.
 *
 * A schema node is `{ type, name?, properties? }`. While being edited every
 * node also carries a generated `id`; `schemaOutput()` strips those back out.
 */
export type SchemaType =
  | "object"
  | "array"
  | "string"
  | "number"
  | "integer"
  | "boolean"
  | (string & {});

export interface SchemaNode {
  id?: string;
  name?: string;
  type: SchemaType;
  properties?: SchemaNode[];
}

/** A named reusable schema shown as an expandable custom type. */
export interface CustomType {
  name: string;
  schema?: SchemaNode;
}

/** Partial change applied to a property by the editor. */
export interface SchemaChange {
  name?: string;
  type?: SchemaType;
}

export type SetSchemaData = (
  updater: (current: SchemaNode) => SchemaNode
) => void;
