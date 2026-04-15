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
import React, { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { inputSx, primaryButtonSx } from "./styles";

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
    <Stack spacing={2.5} sx={{ mb: 2 }}>
      <Stack spacing={1.5}>
        <TextField
          variant="filled"
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          sx={inputSx}
          slotProps={{ input: { disableUnderline: true } }}
        />

        <TextField
          variant="filled"
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          sx={inputSx}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleLogin();
            }
          }}
          slotProps={{
            input: {
              disableUnderline: true,
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
            },
          }}
        />
      </Stack>

      <Button
        variant="contained"
        onClick={handleLogin}
        size="large"
        fullWidth
        disableElevation
        sx={primaryButtonSx}
      >
        Sign in &rarr;
      </Button>

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Typography variant="caption" sx={{ color: "text.disabled" }}>
          Demo credentials:&nbsp;
          <Box
            component="span"
            sx={{
              color: "text.secondary",
              fontWeight: 600,
              fontFamily: "monospace",
              px: 0.5,
              py: 0.25,
              borderRadius: 0.5,
              bgcolor: (theme) => alpha(theme.palette.grey[500], 0.1),
            }}
          >
            admin / admin
          </Box>
        </Typography>
      </Box>
    </Stack>
  );
}
