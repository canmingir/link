import APIDialogAction from "../lib/APIDialogAction/APIDialogAction";
import APIParams from "../lib/APIParams/APIParams";
import APIPath from "../lib/APIPath/APIPath";
import APITree from "../lib/APITree/APITree";
import APITypes from "../lib/APITypes/APITypes";
import Context from "../context/Context";
import ContextProvider from "../ContextProvider/ContextProvider";
import CssBaseline from "@mui/material/CssBaseline";
import NewAPIBody from "../lib/NewApiBody/NewAPIBody";
import NucDialog from "../lib/NucDialog/NucDialog";
import { reducer } from "../context/reducer";
import { useContext } from "../ContextProvider/ContextProvider";

import { Box, Divider } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

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

const resolve = (context, param) => {
  try {
    const parts = param.split(".");
    parts[0] = context[parts[0]];
    return parts.reduce((obj, part) => obj[part]);
  } catch (error) {
    return undefined;
  }
};

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
  const [state, dispatch] = useContext();
  const [view, setView] = useState("PARAMS");
  const [dialogKey, setDialogKey] = useState(0);

  const methodRef = useRef("GET");
  const pathRef = useRef("/");
  const paramsRef = useRef([]);
  const addParams = useRef(null);
  const requestSchemaRef = useRef();
  const responseSchemaRef = useRef();
  const typesRef = useRef({});

  const dialog = state.pages.api.dialog;
  const selected = state.pages.api.selected;
  const types = state.specification.types || [];

  const isEdit = dialog.type === "method" && dialog.action === "edit";
  const isAddMethod = dialog.type === "method" && dialog.action === "add";

  const selectedEndpoint = state.specification.api.find(
    (ep) =>
      ep.path === selected?.path &&
      ep.method?.toLowerCase() === selected?.method?.toLowerCase()
  );

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

  const usedMethods = state.specification.api
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

  const handleClose = () => dispatch({ type: "CLOSE_API_DIALOG" });

  const handleSave = () => {
    if (isEdit) {
      dispatch({
        type: "UPDATE_API_SCHEMAS",
        payload: {
          path: selected.path,
          method: selected.method,
          requestSchema: requestSchemaRef.current?.schemaOutput?.() || [],
          responseSchema: responseSchemaRef.current?.schemaOutput?.() || [],
        },
      });
      dispatch({
        type: "SAVE_API_PARAMS",
        payload: {
          path: selected.path,
          method: selected.method,
          params: paramsRef.current,
        },
      });
      dispatch({ type: "CLOSE_API_DIALOG" });
    } else {
      dispatch({
        type: "SAVE_API_DIALOG",
        payload: {
          path: pathRef.current,
          method: methodRef.current,
          request: requestSchemaRef.current?.schemaOutput?.() || {},
          response: responseSchemaRef.current?.schemaOutput?.() || {},
          params: paramsRef.current,
          types,
          summary: `${methodRef.current} ${pathRef.current}`,
          description: `API endpoint for ${pathRef.current}`,
        },
      });
    }
  };

  const handleDelete = () => dispatch({ type: "DELETE_API" });

  return (
    <Box sx={{ display: "flex", height: "100%", gap: 2 }}>
      <Box sx={{ width: 280, flexShrink: 0, height: "100%" }}>
        <APITree />
      </Box>

      <NucDialog
        title={dialogTitle}
        open={dialog.open}
        handleClose={handleClose}
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

const integratedContext = new Context({
  specification: {
    api: sampleApi,
    types: [],
    functions: [],
    declarations: [],
  },
  pages: {
    api: {
      selected: { path: "/", method: "GET" },
      dialog: {
        type: null,
        action: null,
        open: false,
        view: null,
        map: {},
        params: {},
      },
      resourceMenu: { open: false, anchor: null, path: null },
    },
  },
});

export const APITreeWorkspace = {
  render: () => <APIWorkspace />,
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ContextProvider state={integratedContext} reducer={reducer}>
          <div style={{ width: 900, height: 600 }}>
            <Story />
          </div>
        </ContextProvider>
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
