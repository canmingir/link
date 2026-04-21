import ArrowIcon from "./Arrow";
import { Error } from "@mui/icons-material";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";

import { Box, Tooltip } from "@mui/material";
import React, { useMemo } from "react";

function APITree({
  api = [],
  errors = [],
  theme = {},
  expanded = [],
  selected = null,
  onExpand = () => {},
  onSelect = () => {},
  rightClickMethod = null,
}) {
  const map = useMemo(() => ({}), []);

  const treeNodes = useMemo(() => {
    return compile(api, errors, theme, map, rightClickMethod);
  }, [api, errors, theme, map, rightClickMethod]);

  return (
    <SimpleTreeView
      slots={{
        collapseIcon: () => <ArrowIcon down />,
        expandIcon: () => <ArrowIcon right />,
      }}
      expandedItems={expanded}
      onExpandedItemsChange={onExpand}
      selectedItems={selected}
      onSelectedItemsChange={onSelect}
      sx={{ marginTop: "10px" }}
    >
      {treeNodes}
    </SimpleTreeView>
  );
}

export const compile = (
  apiData,
  errors,
  theme,
  map,
  rightClickMethod = null
) => {
  if (!apiData || apiData.length === 0) return null;

  const groupedByPath = apiData.reduce((acc, endpoint) => {
    const parts = endpoint.path.split("/");
    let currentLevel = acc;

    if (!acc["/"]) {
      acc["/"] = { methods: [], children: {} };
    }

    if (endpoint.path === "/") {
      acc["/"].methods.push(endpoint);
      return acc;
    }

    currentLevel = acc["/"].children;

    parts.forEach((part, idx) => {
      if (idx === 0) return;

      const currentPart = "/" + part;

      if (!currentLevel[currentPart]) {
        currentLevel[currentPart] = {
          methods: [],
          children: {},
        };
      }

      if (idx === parts.length - 1) {
        currentLevel[currentPart].methods.push(endpoint);
      } else {
        currentLevel = currentLevel[currentPart].children;
      }
    });

    return acc;
  }, {});

  const renderTree = (data) => {
    return Object.keys(data).map((path) => {
      const { methods, children } = data[path];

      const methodItems = methods.map((method) => {
        const payload = { path: method.path, method: method.method };
        const hash = window.btoa(JSON.stringify(payload));
        map[hash] = payload;

        const error = errors.find((item) => {
          const [errPath, errMethod] =
            item?.file?.fileName?.split(".", 2) || [];
          return errPath === method.path && errMethod === method.method;
        });

        const highlightStyle =
          rightClickMethod === hash
            ? {
                bgcolor: theme?.palette?.custom?.apiTreeRightClick || "#e0e0e0",
              }
            : {};

        return (
          <TreeItem
            key={hash}
            itemId={hash}
            sx={highlightStyle}
            label={
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
                data-cy={`method-${method.path}${method.method}`}
              >
                <Box>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {method.method.toUpperCase()}
                  </span>
                </Box>

                {error && (
                  <Tooltip title={error.messageText} placement="right">
                    <Error sx={{ color: "#8f8f91" }} />
                  </Tooltip>
                )}
              </Box>
            }
          />
        );
      });

      const childItems = children ? renderTree(children) : [];

      return (
        <TreeItem
          key={path}
          itemId={path}
          label={
            <div
              className="path"
              style={{ cursor: "default" }}
              data-cy={`path-${path}`}
            >
              {path}
            </div>
          }
        >
          {[...methodItems, ...childItems]}
        </TreeItem>
      );
    });
  };

  return renderTree(groupedByPath);
};

export default APITree;
