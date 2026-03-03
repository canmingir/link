import config from "../../config/config";
import { storage } from "@nucleoidjs/webstorage";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import {
  LockOutlined,
  PersonOutline,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import React, { useState } from "react";

export default function DemoLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { appId, credentials } = config();

  async function handleLogin() {
    const requestUrl = credentials.requestUrl || "/api/oauth";

    const res = await fetch(requestUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        appId: appId,
        projectId: "cb16e069-6214-47f1-9922-1f7fe7629525",
        username,
        password,
        identityProvider: "DEMO",
      }),
    });

    if (!res.ok) throw new Error("Demo login failed");

    const data = await res.json();

    storage.set("link", "accessToken", data.accessToken);
    storage.set("link", "refreshToken", data.refreshToken);
    storage.set("link", "identityProvider", "DEMO");

    navigate("/");
  }

  return (
    <Stack spacing={2.5}>
      <Stack spacing={2}>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonOutline sx={{ color: "text.secondary", fontSize: 22 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              fontSize: "1rem",
              "& input": {
                py: 1.5,
              },
              "&:hover fieldset": {
                borderColor: "primary.main",
              },
            },
          }}
        />

        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlined sx={{ color: "text.secondary", fontSize: 22 }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  size="small"
                  tabIndex={-1}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              fontSize: "1rem",
              "& input": {
                py: 1.5,
              },
              "&:hover fieldset": {
                borderColor: "primary.main",
              },
            },
          }}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleLogin();
            }
          }}
        />
      </Stack>

      <Button
        variant="contained"
        onClick={handleLogin}
        size="large"
        fullWidth
        sx={{
          mt: 1,
          py: 1.5,
          fontSize: "1rem",
          fontWeight: 600,
          textTransform: "none",
          borderRadius: 1.5,
          boxShadow: (theme) =>
            `0 8px 16px ${alpha(theme.palette.primary.main, 0.24)}`,
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: (theme) =>
              `0 12px 24px ${alpha(theme.palette.primary.main, 0.32)}`,
          },
          "&:active": {
            transform: "translateY(0px)",
          },
        }}
      >
        Sign in
      </Button>

      <Box
        sx={{
          mt: 1,
          textAlign: "center",
          p: 2,
          borderRadius: 1.5,
          bgcolor: (theme) => alpha(theme.palette.info.main, 0.08),
          border: (theme) =>
            `1px dashed ${alpha(theme.palette.info.main, 0.24)}`,
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontSize: "0.8125rem" }}
        >
          Demo credentials:{" "}
          <Box component="strong" sx={{ color: "text.primary" }}>
            admin / admin
          </Box>
        </Typography>
      </Box>
    </Stack>
  );
}
