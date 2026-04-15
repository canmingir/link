import config from "../../config/config";
import { publish } from "@nucleoidai/react-event";
import { storage } from "@nucleoidjs/webstorage";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

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
  MarkEmailReadOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { confirmSignup, getTokens, login, signup } from "./amplifyAuth";
import { inputSx, primaryButtonSx } from "./styles";

export default function CognitoLogin() {
  const [mode, setMode] = useState("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const { appId, credentials } = config();

  const handleLogin = async () => {
    try {
      await login(email, password);

      const tokens = await getTokens();
      if (!tokens?.accessToken)
        throw new Error("No Cognito access token received");

      const requestUrl = credentials.requestUrl || "/api/oauth";

      const res = await fetch(requestUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appId,
          projectId: "cb16e069-6214-47f1-9922-1f7fe7629525",
          identityProvider: "COGNITO",
          refreshToken: tokens.accessToken,
        }),
      });

      if (!res.ok) throw new Error("Backend OAuth exchange failed");

      const data = await res.json();

      storage.set("link", "accessToken", data.accessToken);
      storage.set("link", "refreshToken", data.refreshToken);
      storage.set("link", "identityProvider", "COGNITO");

      navigate("/");
    } catch (e) {
      console.error("Login error:", e);
      publish("GLOBAL_MESSAGE_POSTED", {
        status: true,
        message: e.message || "Login failed",
        severity: "error",
      });
    }
  };

  const handleSignup = async () => {
    try {
      await signup(email, password);
      publish("GLOBAL_MESSAGE_POSTED", {
        status: true,
        message:
          "Signup successful! Please check your email for the confirmation code.",
        severity: "success",
      });
      setMode("confirm");
    } catch (e) {
      publish("GLOBAL_MESSAGE_POSTED", {
        status: true,
        message: e.message || "Signup failed",
        severity: "error",
      });
    }
  };

  const handleConfirm = async () => {
    try {
      await confirmSignup(email, code);
      publish("GLOBAL_MESSAGE_POSTED", {
        status: true,
        message: "Account confirmed! You can now log in.",
        severity: "success",
      });
      setMode("login");
    } catch (e) {
      publish("GLOBAL_MESSAGE_POSTED", {
        status: true,
        message: e.message || "Confirmation failed",
        severity: "error",
      });
    }
  };

  const titles = {
    login: { heading: "Sign in", sub: "Welcome back! Enter your credentials." },
    signup: {
      heading: "Create account",
      sub: "Sign up to get started for free.",
    },
    confirm: {
      heading: "Verify your email",
      sub: "Enter the confirmation code sent to your inbox.",
    },
  };

  const passwordAdornment = (
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
  );

  return (
    <Stack spacing={3} sx={{ mb: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1.5,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
            color: "primary.main",
          }}
        >
          {mode === "confirm" ? (
            <MarkEmailReadOutlined sx={{ fontSize: 22 }} />
          ) : (
            <LockOutlined sx={{ fontSize: 22 }} />
          )}
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            {titles[mode].heading}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {titles[mode].sub}
          </Typography>
        </Box>
      </Box>
      <Stack spacing={1.5}>
        <TextField
          variant="filled"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          sx={inputSx}
          slotProps={{ input: { disableUnderline: true } }}
        />

        {mode !== "confirm" && (
          <TextField
            variant="filled"
            type={showPassword ? "text" : "password"}
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            sx={inputSx}
            slotProps={{
              input: {
                disableUnderline: true,
                endAdornment: passwordAdornment,
              },
            }}
          />
        )}

        {mode === "signup" && (
          <TextField
            variant="filled"
            type={showConfirmPassword ? "text" : "password"}
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            sx={inputSx}
            slotProps={{
              input: {
                disableUnderline: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                      size="small"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        )}

        {mode === "confirm" && (
          <TextField
            variant="filled"
            label="Confirmation Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            fullWidth
            sx={inputSx}
            slotProps={{ input: { disableUnderline: true } }}
          />
        )}
      </Stack>
      {mode === "login" && (
        <Stack spacing={1.5}>
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
          <Button
            onClick={() => setMode("signup")}
            fullWidth
            sx={{
              textTransform: "none",
              fontWeight: 600,
              color: "text.secondary",
            }}
          >
            No account? Create one
          </Button>
        </Stack>
      )}
      {mode === "signup" && (
        <Stack spacing={1.5}>
          <Button
            variant="contained"
            onClick={handleSignup}
            size="large"
            fullWidth
            disableElevation
            sx={primaryButtonSx}
          >
            Create account &rarr;
          </Button>
          <Button
            onClick={() => setMode("login")}
            fullWidth
            sx={{
              textTransform: "none",
              fontWeight: 600,
              color: "text.secondary",
            }}
          >
            &larr; Back to sign in
          </Button>
        </Stack>
      )}
      {mode === "confirm" && (
        <Button
          variant="contained"
          onClick={handleConfirm}
          size="large"
          fullWidth
          disableElevation
          sx={primaryButtonSx}
        >
          Verify &rarr;
        </Button>
      )}
    </Stack>
  );
}
