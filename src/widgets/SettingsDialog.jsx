import Iconify from "../components/Iconify";
import config from "../config/config";
import { useEvent } from "@nucleoidai/react-event";
import useSettings from "../hooks/useSettings";
import { useSettingsContext } from "../components/settings/context";
import { useUser } from "../hooks/use-user";

import {
  Avatar,
  Box,
  Chip,
  FormControl,
  Grow,
  IconButton,
  InputLabel,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  NativeSelect,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import React, { useEffect, useState } from "react";

let pkg = {
  name: "",
  version: "",
  description: "",
};

try {
  pkg = require("../../../../../../package.json");
} catch (error) {
  console.error("Failed to load package.json for About tab:", error);
}

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const TabPanel = (props) => {
  const { children, value, index } = props;

  return <>{value === index && <Box sx={{ pl: 2, pr: 1 }}>{children}</Box>}</>;
};

const SettingsDialogTabs = ({ tabs }) => {
  const [value, setValue] = useState(0);

  const hasPkgInfo =
    pkg && (pkg.name || pkg.version || pkg.description) ? true : false;

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
          />
          <Tab
            label={"Settings"}
            sx={{ "& label": { color: "custom.grey" } }}
            {...a11yProps(1)}
          />
          {hasPkgInfo && (
            <Tab
              label={"About"}
              sx={{ "& label": { color: "custom.grey" } }}
              {...a11yProps(2)}
            />
          )}
          {tabs?.map((tab, index) => (
            <Tab
              key={tab.label}
              iconPosition="start"
              label={tab.label}
              sx={{ "& label": { color: "custom.grey" } }}
              {...a11yProps(index + (hasPkgInfo ? 3 : 2))}
            />
          ))}
        </Tabs>
        <Box sx={{ width: "100%" }}>
          <TabPanel value={value} index={0}>
            <Permission />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Settings />
          </TabPanel>
          {hasPkgInfo && (
            <TabPanel value={value} index={2}>
              <About />
            </TabPanel>
          )}
          {tabs?.map((tab, index) => (
            <TabPanel
              key={tab.label}
              value={value}
              index={index + (hasPkgInfo ? 3 : 2)}
            >
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
      onClose={() => handleClose()}
      sx={{ bgcolor: "custom.darkDialogBg", zIndex: 2147483647 }}
      PaperProps={{
        style: {
          color: "white",
          minHeight: 600,
        },
      }}
    >
      <DialogContent>
        <Typography variant="h5" sx={{ my: 2 }}>
          Settings
        </Typography>
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
    <Stack direction="column" spacing={2} p={2}>
      <Typography variant="h6">Users</Typography>
      <Typography variant="subtitle2" color="text.secondary">
        Users with access to the project.
      </Typography>
      <List>
        {users?.map((user) => (
          <ListItem
            key={user.id}
            sx={{
              backgroundColor: "background.paper",
              boxShadow: 1,
              borderRadius: 1,
              m: 1,
              p: 2,
              ":hover": { boxShadow: 3 },
              transition: "all 0.2s ease-in-out",
            }}
          >
            <ListItemAvatar>
              <Avatar src={user.avatar_url} alt={user.name} />
            </ListItemAvatar>
            <ListItemText primary={user.name} />
            <ListItemSecondaryAction>
              <IconButton
                onClick={async () => {
                  await deletePermission(user.id);
                }}
                sx={{ color: "error.main" }}
              >
                <Iconify icon="solar:trash-bin-minimalistic-bold-duotone" />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
        {newUserId !== null && (
          <Grow in={true}>
            <TextField
              label="User ID"
              value={newUserId}
              onChange={(e) => setNewUserId(e.target.value)}
              sx={{ width: "calc(100% - 16px)", m: 1 }}
            />
          </Grow>
        )}
      </List>
      <Button
        variant="contained"
        size="medium"
        fullWidth
        sx={{
          backgroundColor: "primary.main",
          ":hover": { backgroundColor: "primary.dark" },
        }}
        onClick={async () => {
          if (newUserId) {
            await createPermission(newUserId);
            setNewUserId(null);
          } else {
            setNewUserId("");
          }
        }}
      >
        {newUserId ? "Add User" : "Enter User ID"}
      </Button>
    </Stack>
  );
};

const Settings = () => {
  const projectId = localStorage.getItem("projectId");
  const { settings, updateSettings } = useSettings(projectId);
  const { beta, onUpdate } = useSettingsContext();

  const timeZones = [
    "Asia/Kolkata",
    "Asia/Dubai",
    "America/New_York",
    "America/Los_Angeles",
    "Europe/London",
  ];

  const handleChange = (event) => {
    const newTimeZone = event.target.value;
    updateSettings(projectId, newTimeZone);
  };

  return (
    <Stack direction="column" spacing={2} p={2}>
      <Typography variant="h6">Settings</Typography>
      <Typography variant="subtitle2" color="text.secondary">
        Configure your application settings.
      </Typography>
      <List>
        <ListItem
          sx={{
            backgroundColor: "background.paper",
            boxShadow: 1,
            borderRadius: 1,
            m: 1,
            p: 2,
            ":hover": { boxShadow: 3 },
            transition: "all 0.2s ease-in-out",
          }}
        >
          <FormControl fullWidth>
            <InputLabel variant="standard" shrink>
              Time Zone
            </InputLabel>
            <NativeSelect
              defaultValue={settings.timeZone || ""}
              onChange={(event) => handleChange(event)}
            >
              <option value="" disabled>
                {settings.timeZone || "Select Time Zone"}
              </option>
              {timeZones.map((time, index) => (
                <option key={index} value={time}>
                  {time}
                </option>
              ))}
            </NativeSelect>
          </FormControl>
        </ListItem>
        <ListItem
          sx={{
            backgroundColor: "background.paper",
            boxShadow: 1,
            borderRadius: 1,
            m: 1,
            p: 2,
            ":hover": { boxShadow: 3 },
            transition: "all 0.2s ease-in-out",
          }}
        >
          <ListItemText primary="Beta" secondary="Enable beta features" />
          <Switch checked={beta} onChange={() => onUpdate("beta", !beta)} />
        </ListItem>
      </List>
    </Stack>
  );
};

const About = () => {
  const iconSrc = config().template?.login?.icon || "";

  const appName = pkg.name;
  const version = pkg.version;
  const description = pkg.description;

  return (
    <Stack direction="column" spacing={2} p={2}>
      <Box
        sx={{
          p: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.01))",
        }}
      >
        <Stack direction="row" spacing={2.5} alignItems="center">
          <Avatar
            src={iconSrc}
            variant="rounded"
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              bgcolor: "background.paper",
              boxShadow: 1,
            }}
          >
            <Iconify icon="solar:widget-bold-duotone" width={28} />
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h5" fontWeight={600}>
              {appName.toUpperCase()}
            </Typography>

            {description && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5, maxWidth: 520 }}
              >
                {description}
              </Typography>
            )}

            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Chip size="small" label={`v${version}`} />
            </Stack>
          </Box>
        </Stack>

        <Box
          sx={{
            my: 2,
            borderBottom: "1px dashed",
            borderColor: "divider",
          }}
        />

        <Stack spacing={1.2}>
          <InfoRow label="Version" value={version} />
          <InfoRow label="Deployment" value="On-Premise" />
          <InfoRow
            label="Support"
            value="support@greycollar.ai"
            link="mailto:support@greycollar.ai"
          />
          <InfoRow
            label="Documentation"
            value="greycollar.ai/docs"
            link="https://greycollar.ai/docs"
          />
        </Stack>

        <Box
          sx={{
            mt: 3,
            pt: 2,
            borderTop: "1px dashed",
            borderColor: "divider",
            textAlign: "center",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            © 2026 greycollar.ai. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </Stack>
  );
};

const InfoRow = ({ label, value, link }) => {
  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 110 }}>
        {label}
      </Typography>

      {link ? (
        <Link href={link} target="_blank" rel="noreferrer" underline="hover">
          {value}
        </Link>
      ) : (
        <Typography variant="body2">{value}</Typography>
      )}
    </Stack>
  );
};

export default SettingsDialog;
