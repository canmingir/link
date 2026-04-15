import CognitoLogin from "../widgets/Login/CognitoLogin";
import DemoLogin from "../widgets/Login/DemoLogin";
import LoginForm from "../widgets/LoginForm/LoginForm";
import Page from "../layouts/Page";
import React from "react";
import config from "../config/config";
import { storage } from "@nucleoidjs/webstorage";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Stack, Typography, alpha } from "@mui/material";

function LoginPage() {
  const { name, template, credentials } = config();
  const navigate = useNavigate();

  function token() {
    if (
      storage.get("link", "refreshToken") &&
      storage.get("link", "accessToken")
    ) {
      return true;
    } else {
      return false;
    }
  }

  useEffect(() => {
    if (token()) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  return (
    <Page title={`Sign in to ${name}`}>
      <Stack
        spacing={0}
        sx={{
          mb: 4,
          position: "relative",
        }}
      >
        <Typography
          variant="overline"
          sx={{
            color: "primary.main",
            fontWeight: 700,
            letterSpacing: "0.2em",
            fontSize: "0.65rem",
            mb: 1,
          }}
        >
          {name}
        </Typography>

        <Typography
          variant="h3"
          sx={{ fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.02em" }}
        >
          Welcome{" "}
          <Box
            component="span"
            sx={{
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            back.
          </Box>
        </Typography>

        <Typography variant="body2" sx={{ color: "text.secondary", mt: 1.5 }}>
          Enter your credentials to access the platform.
        </Typography>

        <Box
          sx={{
            mt: 2,
            width: 32,
            height: 3,
            borderRadius: 2,
            bgcolor: "primary.main",
          }}
        />
      </Stack>

      {credentials?.provider === "COGNITO" && <CognitoLogin />}
      {credentials?.provider === "DEMO" && <DemoLogin />}

      <LoginForm icon={template.login.icon} name={name} formColor="#a8a9ad" />

      <Box
        sx={{
          mt: 4,
          pt: 3,
          borderTop: (theme) =>
            `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          textAlign: "center",
        }}
      >
        <Typography variant="caption" sx={{ color: "text.disabled" }}>
          Secure · Encrypted · Private
        </Typography>
      </Box>
    </Page>
  );
}

export default LoginPage;
