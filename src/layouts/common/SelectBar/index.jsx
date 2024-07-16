import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Iconify from "../../../components/Iconify";
import InputAdornment from "@mui/material/InputAdornment";
import InputBase from "@mui/material/InputBase";
import Label from "../../../components/label";
import List from "@mui/material/List";
import ResultItem from "./result-item";
import Scrollbar from "../../../components/scrollbar";
import SearchNotFound from "../../../components/search-not-found";
import Stack from "@mui/material/Stack";
import SvgColor from "../../../components/svg-color";
import { alpha } from "@mui/material/styles";
import { applyFilter } from "./utils";
import config from "../../../config/config.js";
import match from "autosuggest-highlight/match";
import oauth from "../../../http/oauth.js";
import parse from "autosuggest-highlight/parse";
import { publish } from "@nucleoidai/react-event";
import { useBoolean } from "../../../hooks/use-boolean";
import { useEffect } from "react";
import { useEventListener } from "../../../hooks/use-event-listener";
import { useNavigate } from "react-router-dom";
import useProjects from "../../../hooks/useProjects.js";
import { useResponsive } from "../../../hooks/use-responsive";
import { useTheme } from "@mui/material/styles";

import { Button, DialogActions } from "@mui/material";
import Dialog, { dialogClasses } from "@mui/material/Dialog";
import React, { useCallback, useState } from "react";
import { storage, useStorage } from "@nucleoidjs/webstorage";

function SelectBar() {
  const { path } = config().template.projectBar;
  const { id: appId, name } = config();
  const theme = useTheme();
  const { projects, getProjects } = useProjects();

  useEffect(() => {
    getProjects();
  }, []);

  const id = window.matchMedia("itemId").matches;
  const [selectedItemId] = useStorage("itemId", id);

  const [selectedItem, setSelectedItem] = useState();

  const navigate = useNavigate();

  const search = useBoolean();
  const lgUp = useResponsive("up", "lg");

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setSelectedItem(projects.find((project) => project.id === selectedItemId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects]);

  const AddNewDialogOpen = () => {
    publish("PLATFORM_DIALOG", { open: true });
  };

  const handleSelect = (item) => {
    const refreshToken = storage.get(name, "refreshToken");
    oauth
      .post("/oauth", { appId, refreshToken, projectId: item.id })
      .then(({ data }) => {
        const { refreshToken, accessToken } = data;
        storage.set(name, "accessToken", accessToken);
        storage.set(name, "refreshToken", refreshToken);
      });
    storage.set("itemId", item.id);
    publish("ITEM_SELECTED", { itemId: item.id });
    setSelectedItem(item);
    search.onFalse();
    setSearchQuery("");
  };

  const handleClose = useCallback(() => {
    search.onFalse();
    setSearchQuery("");
  }, [search]);

  const handleKeyDown = (event) => {
    if (event.key === "k" && event.metaKey) {
      search.onToggle();
      setSearchQuery("");
    }
  };

  useEventListener("keydown", handleKeyDown);

  const handleSearch = useCallback((event) => {
    setSearchQuery(event.target.value);
  }, []);

  const dataFiltered = applyFilter({
    inputData: projects,
    query: searchQuery,
  });
  const notFound = searchQuery && !dataFiltered.length;

  const renderItems = () => (
    <List data-cy="item-list" disablePadding>
      {dataFiltered.map((item) => {
        const title = item.name;
        const icon = item?.icon?.slice(1, -1);
        const partsTitle = parse(title, match(title, searchQuery));
        return (
          <ResultItem
            icon={icon || "eva:question-mark-circle"}
            title={partsTitle}
            key={`${title}`}
            groupLabel={searchQuery && title}
            onClickItem={() => {
              handleSelect(item);
              navigate(`${path}`, { replace: true });
            }}
          />
        );
      })}
    </List>
  );
  const renderButton = (
    <Stack direction="row" alignItems="center">
      <IconButton
        data-cy="open-select-bar-button"
        onClick={search.onTrue}
        sx={{
          color: "text.disabled",
          typography: "subtitle2",
          "& .svg-color": {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          },
        }}
      >
        <SvgColor
          src={`https://api.iconify.design/${selectedItem?.icon?.slice(
            1,
            -1
          )}.svg`}
          sx={{ width: 32, height: 32 }}
        />
      </IconButton>

      {lgUp && (
        <Label
          color="primary"
          onClick={search.onTrue}
          sx={{
            px: 0.75,
            fontSize: 14,
          }}
        >
          {selectedItem?.name}
        </Label>
      )}
    </Stack>
  );

  const AddNewButton = (
    <DialogActions disableSpacing>
      <Button
        data-cy="add-new-item-button"
        fullWidth={true}
        onClick={AddNewDialogOpen}
      >
        <Label
          fullWidth={true}
          sx={{
            width: "100%",
            height: "3rem",
            px: 0.75,
            fontSize: 18,
            color: "text.secondary",
            "&:hover": {
              borderRadius: 1,
              borderColor: (theme) => theme.palette.primary.main,
              backgroundColor: (theme) =>
                alpha(
                  theme.palette.primary.main,
                  theme.palette.action.hoverOpacity
                ),
            },
          }}
        >
          Add New Item
        </Label>
      </Button>
    </DialogActions>
  );

  return (
    <>
      {renderButton}

      <Dialog
        data-cy="select-bar-dialog"
        fullWidth={true}
        maxWidth="sm"
        open={search.value}
        onClose={handleClose}
        transitionDuration={{
          enter: theme.transitions.duration.shortest,
          exit: 0,
        }}
        PaperProps={{
          sx: {
            mt: 15,
            overflow: "unset",
          },
        }}
        sx={{
          [`& .${dialogClasses.container}`]: {
            alignItems: "flex-start",
          },
        }}
      >
        <Box sx={{ p: 3, borderBottom: `solid 1px gray` }}>
          <InputBase
            data-cy="item-input"
            fullWidth={true}
            autoFocus
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            startAdornment={
              <InputAdornment position="start">
                <Iconify
                  icon="eva:search-fill"
                  width={24}
                  sx={{ color: "text.disabled" }}
                />
              </InputAdornment>
            }
            endAdornment={
              <Label sx={{ letterSpacing: 1, color: "text.secondary" }}>
                esc
              </Label>
            }
            inputProps={{
              sx: { typography: "h6" },
            }}
          />
        </Box>

        <Scrollbar sx={{ p: 3, pt: 2, height: 400 }}>
          {notFound ? (
            <SearchNotFound query={searchQuery} sx={{ py: 10 }} />
          ) : (
            renderItems()
          )}
        </Scrollbar>
        {AddNewButton}
      </Dialog>
    </>
  );
}

export default SelectBar;
