export type ContextEntry = {
  key: string;
  value: unknown;
  description?: string | null;
};

export type SchemaClass = {
  name: string;
  tableName?: string;
  description?: string | null;
  properties: {
    name: string;
    type: string;
    description?: string | null;
  }[];
};
