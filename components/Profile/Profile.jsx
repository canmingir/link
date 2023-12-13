import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import ListItemText from "@mui/material/ListItemText";
import PropTypes from "prop-types";
import React from "react";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import { bgGradient } from "../../src/theme/css";

import { Card, Tabs, tabsClasses } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useCallback, useState } from "react";

// ----------------------------------------------------------------------

export default function ProfileCover({
  name,
  avatarUrl,
  summary,
  coverUrl,
  TABS,
}) {
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState(TABS[0].value || "");

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);
  return (
    <>
      <Card
        key={4}
        sx={{
          mb: 3,
          height: 290,
        }}
      >
        <Box
          sx={{
            ...bgGradient({
              color: alpha(theme.palette.primary.darker, 0.8),
              imgUrl: coverUrl,
            }),
            height: 1,
            color: "common.white",
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            sx={{
              left: { md: 24 },
              bottom: { md: 24 },
              zIndex: { md: 10 },
              pt: { xs: 6, md: 0 },
              position: { md: "absolute" },
            }}
          >
            <Avatar
              src={avatarUrl}
              alt={name}
              sx={{
                mx: "auto",
                width: { xs: 64, md: 128 },
                height: { xs: 64, md: 128 },
                border: `solid 2px ${theme.palette.common.white}`,
              }}
            />

            <ListItemText
              sx={{
                mt: 3,
                ml: { md: 3 },
                textAlign: { xs: "center", md: "unset" },
              }}
              primary={name}
              secondary={summary}
              primaryTypographyProps={{
                typography: "h4",
              }}
              secondaryTypographyProps={{
                mt: 0.5,
                color: "inherit",
                component: "span",
                typography: "body2",
                sx: { opacity: 0.48 },
              }}
            />
          </Stack>
        </Box>
        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            width: 1,
            bottom: 0,
            zIndex: 9,
            position: "absolute",
            bgcolor: "background.paper",
            [`& .${tabsClasses.flexContainer}`]: {
              pr: { md: 3 },
              justifyContent: {
                sm: "center",
                md: "flex-end",
              },
            },
          }}
        >
          {TABS.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              icon={tab.icon}
              label={tab.label}
            />
          ))}
        </Tabs>
      </Card>
      {TABS.map((tab) => {
        if (tab.value === currentTab) {
          return tab.render;
        }
        return null;
      })}
    </>
  );
}

ProfileCover.propTypes = {
  avatarUrl: PropTypes.string,
  coverUrl: PropTypes.string,
  name: PropTypes.string,
  summary: PropTypes.string,
};
