import type { SchemaNode } from "../SchemaEditor/types";

/** A named API type, either TypeScript-derived or a Nucleoid schema. */
export interface ApiType {
  name: string;
  schema?: SchemaNode;
  isTypeScript?: boolean;
  [key: string]: unknown;
}
