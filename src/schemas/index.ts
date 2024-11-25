import type { SchemaTypeDefinition } from "sanity";

const documents = Object.values(
  import.meta.glob("./documents/**/schema.ts", {
    eager: true,
    import: "default",
  })
);

const objects = Object.values(
  import.meta.glob("./objects/**/schema.ts", {
    eager: true,
    import: "default",
  })
);

export const schemaTypes = [...documents, ...objects] as SchemaTypeDefinition[];
