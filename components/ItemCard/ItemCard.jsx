import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Iconify from "../../src/components/iconify";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { fDate } from "../../src/utils/format-time";

import CustomPopover, { usePopover } from "../../src/components/custom-popover";

// ----------------------------------------------------------------------

export default function ItemCard({
  item,
  onView,
  onEdit,
  onDelete,
  onIconClick,
  icon,
}) {
  const popover = usePopover();

  const { name, createdAt, description } = item;
  return (
    <>
      <Card>
        <IconButton
          onClick={popover.onOpen}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>

        <Stack sx={{ p: 3, pb: 2 }}>
          <Avatar
            alt={name}
            src={name}
            variant="rounded"
            sx={{ width: 48, height: 48, mb: 2 }}
          />

          <ListItemText
            sx={{ mb: 1 }}
            primary={
              <Typography variant="h4" color="inherit">
                {name}
              </Typography>
            }
            secondary={`Created date: ${fDate(createdAt)}`}
            primaryTypographyProps={{
              typography: "subtitle1",
            }}
            secondaryTypographyProps={{
              mt: 1,
              component: "span",
              typography: "caption",
              color: "text.disabled",
            }}
          />
        </Stack>

        <Divider sx={{ borderStyle: "dashed" }} />

        <Stack spacing={2} sx={{ p: 2 }}>
          <Stack direction="column" sx={{ typography: "body2" }}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{ paddingY: "0.5rem" }}
            >
              <Iconify icon={"ph:note-pencil-duotone"} width={24} />
              <Typography variant="subtitle1">Description</Typography>
            </Stack>
            <Stack
              sx={{
                flexDirection: "row",
                alignContent: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{ width: "300px", textJustify: "start" }}
                color={"inherit"}
                variant={"body2"}
              >
                {description}
              </Typography>
              <Iconify
                onClick={() => {
                  onIconClick;
                }}
                sx={{
                  marginX: 2,
                  display: "flex",
                  justifySelf: "end",
                  alignSelf: "start",
                }}
                icon={icon}
                width={36}
                height={36}
              />
            </Stack>
          </Stack>
        </Stack>
      </Card>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
            onView();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
            onEdit();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
            onDelete();
          }}
          sx={{ color: "error.main" }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>
    </>
  );
}
