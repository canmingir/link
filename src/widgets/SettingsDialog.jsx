import config from "../config/config";
import { useEvent } from "@nucleoidai/react-event";
import { useState } from "react";
import { useUser } from "../hooks/use-user";

import {
  Avatar,
  Box,
  Grow,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import { Iconify } from "@nucleoidai/platform/minimal/components";
import React, { useEffect } from "react";

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const TabPanel = (props) => {
  const { children, value, index } = props;

  return (
    <>
      {value === index && (
        <Box
          sx={{
            pl: 2,
            pr: 1,
          }}
        >
          {children}
        </Box>
      )}
    </>
  );
};

const SettingsDialogTabs = ({ tabs }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "background.paper",
          display: "flex",
          height: 515,
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          orientation="vertical"
          variant="scrollable"
          sx={{
            borderRight: 1,
            borderColor: "divider",
            width: 120,
            display: "flex",
            flexDirection: "flex-end",
            ml: -2,
            mt: 1,
            "& .MuiTabs-indicator": {
              backgroundColor: "primary.main",
              height: 3,
            },
            "& .MuiTab-root.Mui-selected": {
              color: "custom.grey",
              bgcolor: "rgba(0,0,0,0.1)",
              borderTopLeftRadius: 8,
              borderBottomLeftRadius: 8,
            },
            "& .MuiTab-root": {
              color: "custom.grey",
              width: 1,
            },
          }}
        >
          <Tab
            label={"Permissions"}
            sx={{ "& label": { color: "custom.grey" } }}
            {...a11yProps(0)}
          >
            <Permission />
          </Tab>
          {tabs?.map((tab, index) => (
            <Tab
              key={tab.label}
              iconPosition="start"
              label={tab.label}
              sx={{ "& label": { color: "custom.grey" } }}
              {...a11yProps(index)}
            />
          ))}
        </Tabs>
        <Box sx={{ width: "100%" }}>
          <TabPanel value={value} index={0}>
            <Permission />
          </TabPanel>
          {tabs?.map((tab, index) => (
            <TabPanel key={tab.label} value={value} index={index + 1}>
              <tab.panel />
            </TabPanel>
          ))}
        </Box>
      </Box>
    </>
  );
};

function SettingsDialog({ handleClose, open }) {
  const { settings } = config().template;
  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth={"md"}
      onClose={(event) => (event.key === "Escape" ? handleClose() : null)}
      sx={{ bgcolor: "custom.darkDialogBg", zIndex: 2147483647 }}
      PaperProps={{
        style: {
          color: "white",
          minHeight: 600,
        },
      }}
    >
      <DialogContent>
        <SettingsDialogTabs tabs={settings.tabs} />
      </DialogContent>
      <DialogActions
        sx={{
          borderTop: 1,
          borderColor: "divider",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          sx={{ color: "white" }}
          autoFocus
          onClick={() => console.log("save")}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const Permission = () => {
  const [newUserId, setNewUserId] = useState(null);
  const { getPermittedUsers, users, createPermission, deletePermission } =
    useUser();
  const [event] = useEvent("PERMISSION_CREATED", null);
  const [event2] = useEvent("PERMISSION_DELETED", null);

  useEffect(() => {
    getPermittedUsers();
  }, [event, event2]);

  return (
    <Stack direction="row" spacing={2} p={3}>
      <Stack sx={{ width: 1 }}>
        <Typography variant="h6" my={1}>
          Users
        </Typography>
        <List
          subheader={"Users with access to the project"}
          sx={{
            minHeight: "400px",
            width: 1,
          }}
        >
          {users?.map((user) => (
            <ListItem
              key={user.id}
              sx={{
                backgroundColor: "background.neutral",
                border: "0.2px dashed grey",
                borderRadius: 1,
                m: 1,
                ":hover": { backgroundColor: "background.paper" },
              }}
            >
              <ListItemAvatar>
                <Avatar src={user.avatar_url} />
              </ListItemAvatar>
              <ListItemText>{user.name}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton>
                  <Iconify
                    onClick={async () => {
                      await deletePermission(user.id);
                    }}
                    icon="solar:trash-bin-minimalistic-bold-duotone"
                    color="error.light"
                  />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
          {newUserId !== null && (
            <Grow in={true}>
              <div>
                <TextField
                  label="User ID"
                  value={newUserId}
                  onChange={(e) => setNewUserId(e.target.value)}
                  sx={{ width: 1, m: 1 }}
                />
              </div>
            </Grow>
          )}
          <Button
            variant="contained"
            size="medium"
            sx={{ width: 1, m: 1 }}
            onClick={async () => {
              if (newUserId) {
                console.log("user added" + newUserId);
                await createPermission(newUserId);
                setNewUserId(null);
              } else {
                setNewUserId("");
              }
            }}
          >
            Add User
          </Button>
        </List>
      </Stack>
    </Stack>
  );
};

export default SettingsDialog;
