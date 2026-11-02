/** A row in the API parameter table. */
export interface Param {
  id: string;
  name?: string;
  type?: string;
  in?: "query" | "path" | "header" | "cookie" | string;
  required?: boolean;
  description?: string;
  [key: string]: unknown;
}

/** A named reusable type shown in the type dropdown. */
export interface NamedType {
  name: string;
  [key: string]: unknown;
}

/** A mutable schema map node the TypeMenu edits in place. */
export interface SchemaMap {
  type?: string;
  properties?: Record<string, unknown>;
  items?: Record<string, unknown>;
  [key: string]: unknown;
}
