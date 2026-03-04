import APIDialogAction from "../lib/APIDialogAction/APIDialogAction";
import APIParams from "../lib/APIParams/APIParams";
import APIPath from "../lib/APIPath/APIPath";
import APITree from "../lib/APITree/APITree";
import APITypes from "../lib/APITypes/APITypes";
import CssBaseline from "@mui/material/CssBaseline";
import NewAPIBody from "../lib/NewApiBody/NewAPIBody";
import NucDialog from "../lib/NucDialog/NucDialog";

import { Box, Divider } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { publish, useEvent } from "@nucleoidai/react-event";

const theme = createTheme({
  palette: {
    mode: "dark",
    custom: {
      apiTreeRightClick: "rgba(255, 255, 255, 0.08)",
    },
  },
  custom: {
    apiTreeItem: {
      fontSize: 12,
      color: "#666",
      fontWeight: "bold",
      backgroundColor: "#fdfdfd",
      border: "1px solid #c3c5c8",
      width: 44,
      borderRadius: 8,
      mt: 1 / 4,
      mb: 1 / 4,
      boxShadow: "1px 1px #b8b8b8",
    },
  },
});

const sampleApi = [
  {
    path: "/",
    method: "GET",
    summary: "Hello World",
    description: "Hello World",
    params: [],
    action: 'function action(req) {\n  return { message: "Hello World" };\n}',
  },
  {
    path: "/items",
    method: "GET",
    summary: "List items",
    description: "List all items",
    params: [{ in: "query", type: "string", required: true, name: "name" }],
    action:
      "function action(req) {\n  return Item.filter(i => i.name === req.query.name);\n}",
  },
  {
    path: "/items",
    method: "POST",
    summary: "Create item",
    description: "Create a new item",
    params: [],
    action:
      "function action(req) {\n  return new Item(req.body.name, req.body.barcode);\n}",
  },
  {
    path: "/items",
    method: "DELETE",
    summary: "Delete item",
    description: "Delete an item",
    params: [],
    action: "function action(req) {\n  // delete logic\n}",
  },
];

export default {
  title: "Components/APITree",
  component: APITree,
  parameters: {
    docs: {
      description: {
        component:
          "APITree displays API endpoints in a tree structure grouped by path segments. " +
          "It supports context menus for editing/deleting methods and a resource menu for adding new endpoints.",
      },
    },
    layout: "centered",
  },
};

const ALL_METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH"];

const APIWorkspace = () => {
  const [view, setView] = useState("PARAMS");
  const [dialogKey, setDialogKey] = useState(0);

  const methodRef = useRef("GET");
  const pathRef = useRef("/");
  const paramsRef = useRef([]);
  const addParams = useRef(null);
  const requestSchemaRef = useRef();
  const responseSchemaRef = useRef();
  const typesRef = useRef({});

  const [dialog, setDialog] = useState({
    type: null,
    action: null,
    open: false,
  });

  const [api, setApi] = useState(sampleApi);

  const [selected] = useEvent("SELECTED_API_CHANGED", {
    path: "/",
    method: "GET",
  });

  const [types, setTypes] = useState([]);

  const [typeAdd] = useEvent("API_TYPE_ADD", null);
  const [typeDelete] = useEvent("API_TYPE_DELETE", null);
  const [typeRename] = useEvent("API_TYPE_RENAME", null);

  const [methodDelete] = useEvent("API_METHOD_DELETE", null);
  const [resourceDelete] = useEvent("API_RESOURCE_DELETE", null);
  const [apiDialogOpen] = useEvent("API_DIALOG_OPEN", null);

  const isEdit = dialog.type === "method" && dialog.action === "edit";
  const isAddMethod = dialog.type === "method" && dialog.action === "add";

  const selectedEndpoint = api.find(
    (ep) =>
      ep.path === selected?.path &&
      ep.method?.toLowerCase() === selected?.method?.toLowerCase()
  );

  useEffect(() => {
    if (!typeAdd) return;

    setTypes((prev) => {
      const { typeName } = typeAdd;
      if (!typeName) return prev;

      const exists = prev.some((t) => t.name === typeName);
      if (exists) return prev;

      return [
        ...prev,
        {
          name: typeName,
          schema: {
            name: typeName,
            type: "object",
            properties: [
              { type: "string", name: "id" },
              { type: "string", name: "name" },
            ],
          },
        },
      ];
    });
  }, [typeAdd]);

  useEffect(() => {
    if (!typeDelete) return;

    setTypes((prev) => prev.filter((t) => t.name !== typeDelete.typeName));
  }, [typeDelete]);

  useEffect(() => {
    if (!typeRename) return;

    setTypes((prev) =>
      prev.map((t) =>
        t.name === typeRename.oldTypeName
          ? {
              ...t,
              name: typeRename.newTypeName,
              schema: {
                ...t.schema,
                name: typeRename.newTypeName,
              },
            }
          : t
      )
    );
  }, [typeRename]);

  useEffect(() => {
    publish("API_TYPES_CHANGED", { types });
  }, [types]);

  useEffect(() => {
    publish("API_DATA_CHANGED", api);
  }, [api]);

  useEffect(() => {
    if (!apiDialogOpen) return;

    setDialog((prev) => ({
      ...prev,
      type: apiDialogOpen.type,
      action: apiDialogOpen.action,
      open: true,
    }));
  }, [apiDialogOpen]);

  useEffect(() => {
    if (!methodDelete || !selected) return;

    setApi((prev) =>
      prev.filter(
        (route) =>
          !(
            route.path === selected.path &&
            route.method?.toLowerCase() === selected.method?.toLowerCase()
          )
      )
    );
  }, [methodDelete, selected]);

  useEffect(() => {
    if (!resourceDelete || !resourceDelete.path) return;

    const pathToDelete = resourceDelete.path;
    setApi((prev) => prev.filter((ep) => !ep.path.startsWith(pathToDelete)));
  }, [resourceDelete]);

  useEffect(() => {
    if (!dialog.open) return;

    setView("PARAMS");
    setDialogKey((k) => k + 1);

    if (isEdit && selectedEndpoint) {
      methodRef.current = selectedEndpoint.method?.toUpperCase() || "GET";
      pathRef.current = selectedEndpoint.path || "/";
      paramsRef.current = Array.isArray(selectedEndpoint.params)
        ? [...selectedEndpoint.params]
        : [];
    } else {
      methodRef.current = "GET";
      pathRef.current = selected?.path || "/";
      paramsRef.current = [];
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialog.open]);

  const usedMethods = api
    .filter((ep) => ep.path === selected?.path)
    .map((ep) => ep.method?.toUpperCase());

  const allowedMethods = isEdit
    ? [selectedEndpoint?.method?.toUpperCase() || "GET"]
    : isAddMethod
    ? ALL_METHODS.filter((m) => !usedMethods.includes(m))
    : ALL_METHODS;

  const basePath = isEdit
    ? selectedEndpoint?.path || selected?.path || "/"
    : selected?.path || "/";

  const isPathDisabled = isAddMethod || isEdit;
  const isMethodDisabled = isEdit;

  const dialogTitle = isEdit
    ? "Edit API Endpoint"
    : isAddMethod
    ? "Add Method"
    : "Add Resource";

  const handleCloseDialog = () =>
    setDialog((prev) => ({
      ...prev,
      open: false,
    }));

  const handleSave = () => {
    if (isEdit) {
      setApi((prev) => {
        const idx = prev.findIndex(
          (ep) =>
            ep.path === selected.path &&
            ep.method?.toLowerCase() === selected.method?.toLowerCase()
        );
        if (idx === -1) return prev;

        const next = [...prev];
        const current = next[idx];

        next[idx] = {
          ...current,
          request: {
            ...(current.request || {}),
            schema: requestSchemaRef.current?.schemaOutput?.() || [],
          },
          response: {
            ...(current.response || {}),
            schema: responseSchemaRef.current?.schemaOutput?.() || [],
          },
          params: paramsRef.current,
        };

        return next;
      });

      setDialog((prev) => ({ ...prev, open: false }));
    } else {
      const newEndpoint = {
        path: pathRef.current,
        method: methodRef.current,
        request: requestSchemaRef.current?.schemaOutput?.() || {},
        response: responseSchemaRef.current?.schemaOutput?.() || {},
        params: paramsRef.current,
        summary: `${methodRef.current} ${pathRef.current}`,
        description: `API endpoint for ${pathRef.current}`,
      };

      setApi((prev) => [...prev, newEndpoint]);
      setDialog((prev) => ({ ...prev, open: false }));
    }
  };

  const handleDelete = () => {
    if (!selected) return;
    setApi((prev) =>
      prev.filter(
        (ep) =>
          !(
            ep.path === selected.path &&
            ep.method?.toLowerCase() === selected.method?.toLowerCase()
          )
      )
    );
    setDialog((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ display: "flex", height: "100%", gap: 2 }}>
      <Box sx={{ width: 280, flexShrink: 0, height: "100%" }}>
        <APITree />
      </Box>

      <NucDialog
        title={dialogTitle}
        open={dialog.open}
        handleClose={handleCloseDialog}
        maximizedDimensions={{ width: "75rem", height: "60rem" }}
        minimizedDimensions={{ width: "65rem", height: "50rem" }}
        action={
          <APIDialogAction
            view={view}
            setApiDialogView={setView}
            saveApiDialog={handleSave}
            saveDisable={false}
            deleteDisable={!isEdit}
            deleteMethod={handleDelete}
          />
        }
      >
        <Box
          key={dialogKey}
          sx={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <APIPath
            method={allowedMethods[0] || "GET"}
            path={basePath}
            methodRef={methodRef}
            pathRef={pathRef}
            onTypesButtonClick={() => setView("TYPES")}
            allowedMethods={allowedMethods.length ? allowedMethods : ["GET"]}
            isMethodDisabled={isMethodDisabled}
            isPathDisabled={isPathDisabled}
            validatePath={() => {}}
          />
          <Divider sx={{ my: 2 }} />
          {view === "PARAMS" && (
            <APIParams
              types={types}
              paramsRef={paramsRef}
              addParams={addParams}
            />
          )}
          {view === "BODY" && (
            <NewAPIBody
              types={types}
              api={{
                path: basePath,
                method: methodRef.current,
                params: paramsRef.current,
                request: selectedEndpoint?.request || { schema: [] },
                response: selectedEndpoint?.response || { schema: [] },
              }}
              requestSchemaRef={requestSchemaRef}
              responseSchemaRef={responseSchemaRef}
            />
          )}
          {view === "TYPES" && (
            <APITypes tstypes={[]} nuctypes={types} typesRef={typesRef} />
          )}
        </Box>
      </NucDialog>
    </Box>
  );
};

export const APITreeWorkspace = {
  render: () => <APIWorkspace />,
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div style={{ width: 900, height: 600 }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        story:
          "Full workspace: right-click a path node or click the + FAB to open the ResourceMenu, " +
          "then choose Resource, Method, or Delete. Adding a resource or method opens the API dialog " +
          "where you can configure the path, method, params, and body before saving.",
      },
    },
  },
};
