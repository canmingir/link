import IconButton from "@mui/material/IconButton";
import type { MouseEvent as ReactMouseEvent } from "react";
import SchemaPropertyEditor from "./SchemaPropertyEditor";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { v4 as uuidv4 } from "uuid";

import {
  AddCircleOutline,
  ChevronRight,
  ExpandMore,
  RemoveCircleOutline,
} from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import type { CustomType, SchemaChange, SchemaNode, SchemaType } from "./types";
import React, { forwardRef, useEffect, useState } from "react";
import { addProperty, changeProperty, removeProperty } from "./SchemaUtils";

export interface SchemaEditorHandle {
  schemaOutput: () => SchemaNode;
}

interface SchemaEditorProps {
  initialData?: Partial<SchemaNode>;
  customTypes?: CustomType[];
}

const SchemaEditor = forwardRef<SchemaEditorHandle, SchemaEditorProps>(
  ({ initialData = {}, customTypes = [] }, ref) => {
    const [schemaData, setSchemaData] = useState<SchemaNode>({} as SchemaNode);

    useEffect(() => {
      const addIdsToSchema = (schema: SchemaNode): SchemaNode => {
        return {
          ...schema,
          id: uuidv4(),
          properties: schema.properties?.map(addIdsToSchema),
        };
      };

      if (!schemaData || Object.keys(schemaData).length === 0) {
        if (Object.keys(initialData).length === 0) {
          setSchemaData({
            type: "object",
            properties: [],
          });
        } else {
          const dataWithIds = addIdsToSchema(initialData as SchemaNode);
          setSchemaData(dataWithIds);
        }
      }
    }, [initialData, schemaData]);

    const handleAddProperty = (
      _newProperty: Partial<SchemaNode>,
      parentId: string | null = null
    ) => {
      addProperty(parentId, setSchemaData);
    };

    const handleRemoveProperty = (propertyId: string) => {
      removeProperty(propertyId, setSchemaData);
    };

    const handleChangeProperty = (
      propertyId: string,
      changes: SchemaChange
    ) => {
      changeProperty(propertyId, changes, setSchemaData);
    };

    const renderTree = (node: SchemaNode, level = 0): React.ReactNode => (
      <TreeItem
        key={node.id}
        itemId={level === 0 ? "1" : node.id ?? ""}
        label={
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "1px",
                width: "100%",
              }}
            >
              <SchemaPropertyEditor
                node={{ ...node, level }}
                disableNameChange={level === 0}
                onNameChange={(newName: string) => {
                  handleChangeProperty(node.id ?? "", {
                    name: newName,
                    type: node.type,
                  });
                }}
                onTypeChange={(newType: SchemaType) => {
                  handleChangeProperty(level === 0 ? "1" : node.id ?? "", {
                    name: node.name,
                    type: newType,
                  });
                }}
                customTypes={customTypes}
              />
              {true && (
                <IconButton
                  size="small"
                  onClick={(e: ReactMouseEvent) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAddProperty(
                      { type: "string", name: "newProperty" },
                      level === 0 ? null : node.id ?? null
                    );
                  }}
                  disabled={
                    node.type !== "object" ||
                    (node.type === "array" &&
                      (node.properties?.length ?? 0) >= 1)
                  }
                  sx={{
                    color: (theme) => theme.palette.grey[600],
                    marginRight: "-8px ",
                  }}
                  data-cy={`add-property-button-${node.id}`}
                >
                  <AddCircleOutline fontSize="small" />
                </IconButton>
              )}
            </Box>

            {true && (
              <IconButton
                size="small"
                style={{ marginLeft: "auto" }}
                onClick={(e: ReactMouseEvent) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRemoveProperty(node.id ?? "");
                }}
                disabled={level === 0}
                sx={{
                  color: (theme) => theme.palette.grey[600],
                }}
              >
                <RemoveCircleOutline fontSize="small" />
              </IconButton>
            )}
          </Box>
        }
      >
        {Array.isArray(node.properties)
          ? node.properties.map((childNode) => renderTree(childNode, level + 1))
          : isCustomType(node.type)
          ? renderCustomTypeNode(node)
          : null}
      </TreeItem>
    );

    const isCustomType = (type: string) => {
      return customTypes.some((customType) => customType.name === type);
    };

    const renderCustomTypeNode = (node: SchemaNode) => {
      const customTypeSchema = customTypes.find(
        (type) => type.name === node.type
      )?.schema;

      if (!customTypeSchema || !customTypeSchema.properties) {
        return <Box sx={{ paddingLeft: "20px" }}>No properties defined</Box>;
      }

      return (
        <Box sx={{ paddingLeft: "20px" }}>
          {customTypeSchema.properties.map((prop, index) => (
            <Box
              key={index}
              sx={{
                paddingTop: "5px",
                paddingBottom: "5px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: (theme) => theme.palette.grey[600],
                }}
              >
                {prop.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  marginLeft: "8px",
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                {prop.type}
              </Typography>
            </Box>
          ))}
        </Box>
      );
    };

    const schemaOutput = (): SchemaNode => {
      const removeIds = (node: SchemaNode): SchemaNode => {
        // eslint-disable-next-line no-unused-vars
        const { properties, ...rest } = node;
        if ((node.type === "object" || node.type === "array") && properties) {
          return { ...rest, properties: properties.map(removeIds) };
        }
        return rest;
      };

      return removeIds(schemaData);
    };

    React.useImperativeHandle(ref, () => ({
      schemaOutput: schemaOutput,
    }));

    return (
      <SimpleTreeView
        slots={{
          collapseIcon: () => <ExpandMore data-cy="collapse-icon" />,
          expandIcon: () => <ChevronRight data-cy="expand-icon" />,
        }}
        defaultExpandedItems={["1"]}
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          width: "100%",
          ".MuiTreeItem-root": {
            alignItems: "center",
          },
          ".MuiTreeItem-content": {
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            padding: "1px 8px",
            borderRadius: "4px",
            margin: "1px 0",
            transition: "width 0.3s ease-in-out, height 0.3s ease-in-out",
          },
          ".MuiTreeItem-label": {
            width: "100%",
            fontWeight: "bold",
          },
          ".MuiTreeItem-group": {
            marginLeft: "16px !important",
            paddingLeft: "8px",
            borderLeft: `1px solid`,
            borderColor: (theme) => theme.palette.grey[400],
          },
          ".MuiTreeItem-iconContainer": {
            minWidth: "0",
            marginRight: "0px",
            padding: "0px",
          },
        }}
      >
        {renderTree(schemaData, 0)}
      </SimpleTreeView>
    );
  }
);

export default SchemaEditor;
