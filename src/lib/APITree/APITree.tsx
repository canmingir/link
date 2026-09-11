import ArrowIcon from "./Arrow";
import { Error } from "@mui/icons-material";
import type { ReactNode } from "react";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import type { Theme } from "@mui/material/styles";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { useMemo } from "react";

import { Box, Tooltip } from "@mui/material";

export interface ApiEndpoint {
  path: string;
  method: string;
  [key: string]: unknown;
}

export interface ApiError {
  file?: { fileName?: string };
  messageText?: string;
  [key: string]: unknown;
}

interface EndpointPayload {
  path: string;
  method: string;
}

type PayloadMap = Record<string, EndpointPayload>;

interface APITreeProps {
  api?: ApiEndpoint[];
  errors?: ApiError[];
  theme?: Partial<Theme>;
  expanded?: string[];
  selected?: string | null;
  onExpand?: (event: React.SyntheticEvent | null, itemIds: string[]) => void;
  onSelect?: (
    event: React.SyntheticEvent | null,
    itemIds: string | null
  ) => void;
  rightClickMethod?: string | null;
}

function APITree({
  api = [],
  errors = [],
  theme = {},
  expanded = [],
  selected = null,
  onExpand = () => {},
  onSelect = () => {},
  rightClickMethod = null,
}: APITreeProps) {
  const map = useMemo<PayloadMap>(() => ({}), []);

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

interface TreeGroup {
  methods: ApiEndpoint[];
  children: Record<string, TreeGroup>;
}

export const compile = (
  apiData: ApiEndpoint[],
  errors: ApiError[],
  theme: Partial<Theme> | undefined,
  map: PayloadMap,
  rightClickMethod: string | null = null
): ReactNode => {
  if (!apiData || apiData.length === 0) return null;

  const groupedByPath = apiData.reduce<Record<string, TreeGroup>>(
    (acc, endpoint) => {
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

      parts.forEach((part: string, idx: number) => {
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
    },
    {}
  );

  const renderTree = (data: Record<string, TreeGroup>): ReactNode[] => {
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
        }) as ApiError | undefined;

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
