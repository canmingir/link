import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Iconify from "../../../components/iconify";
import InputAdornment from "@mui/material/InputAdornment";
import InputBase from "@mui/material/InputBase";
import Label from "../../../components/label";
import List from "@mui/material/List";
import ResultItem from "./result-item";
import Scrollbar from "../../../components/scrollbar";
import SearchNotFound from "../../../components/search-not-found";
import Stack from "@mui/material/Stack";
import { alpha } from "@mui/material/styles";
import { applyFilter } from "./utils";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import { useBoolean } from "../../../hooks/use-boolean";
import { useConfig } from "../../../context/ConfigContext";
import { useContext } from "../../../ContextProvider/ContextProvider";
import { useEventListener } from "../../../hooks/use-event-listener";
import { useResponsive } from "../../../hooks/use-responsive";
import { useTheme } from "@mui/material/styles";

import Dialog, { dialogClasses } from "@mui/material/Dialog";
import React, { memo, useCallback, useState } from "react";

// ----------------------------------------------------------------------

function Searchbar({ selectedItem, handleItemSelect, setSelectedItem }) {
  const theme = useTheme();
  const { base, itemsData } = useConfig();
  const [state, dispatch] = useContext();
  const search = useBoolean();

  const lgUp = useResponsive("up", "lg");

  const [searchQuery, setSearchQuery] = useState("");

  const handleSelect = (item) => {
    dispatch({ type: "ITEM_SELECT", payload: item.id });
    handleItemSelect(item);
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

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.itemId]);

  useEventListener("keydown", handleKeyDown);

  const handleSearch = useCallback((event) => {
    setSearchQuery(event.target.value);
  }, []);

  const dataFiltered = applyFilter({
    inputData: itemsData,
    query: searchQuery,
  });

  const notFound = searchQuery && !dataFiltered.length;

  const renderItems = () => (
    <List disablePadding>
      {dataFiltered.map((item) => {
        const { title, icon } = item;
        const partsTitle = parse(title, match(title, searchQuery));
        return (
          <ResultItem
            base={base}
            icon={icon}
            title={partsTitle}
            key={`${title}`}
            groupLabel={searchQuery && title}
            onClickItem={() => handleSelect(item)}
          />
        );
      })}
    </List>
  );
  const renderButton = (
    <Stack direction="row" alignItems="center">
      <IconButton onClick={search.onTrue}>
        <Avatar
          src={`${base}/media/ProjectIcons/${selectedItem?.icon?.replace(
            /:/g,
            ""
          )}.png`}
          variant="square"
          sx={{ width: 32, height: 32 }}
        />
      </IconButton>

      {lgUp && (
        <Label
          onClick={search.onTrue}
          sx={{ px: 0.75, fontSize: 14, color: "text.secondary" }}
        >
          {selectedItem?.title}
        </Label>
      )}
    </Stack>
  );

  const AddNewButton = (
    <Stack direction="row" alignItems="center" fullWidth>
      <Label
        fullWidth
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
    </Stack>
  );
  return (
    <>
      {renderButton}

      <Dialog
        fullWidth
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
        <Box sx={{ p: 3, borderBottom: `solid 1px ${theme.palette.divider}` }}>
          <InputBase
            fullWidth
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

export default memo(Searchbar);
