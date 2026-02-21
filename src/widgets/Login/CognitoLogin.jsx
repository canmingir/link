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
  EmailOutlined,
  LockOutlined,
  MarkEmailReadOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { confirmSignup, getTokens, login, signup } from "./amplifyAuth";

const inputSx = {
  "& .MuiOutlinedInput-root": {
    fontSize: "1rem",
    "& input": { py: 1.5 },
    "&:hover fieldset": { borderColor: "primary.main" },
  },
};

const primaryButtonSx = {
  py: 1.5,
  fontSize: "1rem",
  fontWeight: 600,
  textTransform: "none",
  borderRadius: 1.5,
  "&:active": { transform: "translateY(0px)" },
};

export default function CognitoLogin() {
  const [mode, setMode] = useState("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const { appId } = config();

  const handleLogin = async () => {
    try {
      await login(email, password);

      const tokens = await getTokens();
      if (!tokens?.accessToken)
        throw new Error("No Cognito access token received");

      const res = await fetch("/api/oauth", {
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
    <Stack spacing={3}>
      <Box sx={{ mb: 1, textAlign: "center" }}>
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: 2,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
            color: "primary.main",
          }}
        >
          {mode === "confirm" ? (
            <MarkEmailReadOutlined sx={{ fontSize: 26 }} />
          ) : (
            <LockOutlined sx={{ fontSize: 26 }} />
          )}
        </Box>

        <Typography variant="h4" fontWeight={700} gutterBottom>
          {titles[mode].heading}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {titles[mode].sub}
        </Typography>
      </Box>

      <Stack spacing={2}>
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailOutlined sx={{ color: "text.secondary", fontSize: 22 }} />
              </InputAdornment>
            ),
          }}
          sx={inputSx}
        />

        {mode !== "confirm" && (
          <TextField
            type={showPassword ? "text" : "password"}
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined
                    sx={{ color: "text.secondary", fontSize: 22 }}
                  />
                </InputAdornment>
              ),
              endAdornment: passwordAdornment,
            }}
            sx={inputSx}
          />
        )}

        {mode === "signup" && (
          <TextField
            type={showConfirmPassword ? "text" : "password"}
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined
                    sx={{ color: "text.secondary", fontSize: 22 }}
                  />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                    size="small"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={inputSx}
          />
        )}

        {mode === "confirm" && (
          <TextField
            label="Confirmation Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            fullWidth
            sx={inputSx}
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
            sx={primaryButtonSx}
          >
            Sign in
          </Button>
          <Button
            onClick={() => setMode("signup")}
            fullWidth
            sx={{ textTransform: "none", fontWeight: 500 }}
          >
            Create an account
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
            sx={primaryButtonSx}
          >
            Sign Up
          </Button>
          <Button
            onClick={() => setMode("login")}
            fullWidth
            sx={{ textTransform: "none", fontWeight: 500 }}
          >
            Back to login
          </Button>
        </Stack>
      )}

      {mode === "confirm" && (
        <Button
          variant="contained"
          onClick={handleConfirm}
          size="large"
          fullWidth
          sx={primaryButtonSx}
        >
          Confirm
        </Button>
      )}
    </Stack>
  );
}
