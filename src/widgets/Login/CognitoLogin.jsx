import config from "../../config/config";
import { storage } from "@nucleoidjs/webstorage";
import { useState } from "react";

import { Button, Stack, TextField, Typography } from "@mui/material";
import { confirmSignup, getTokens, login, signup } from "./amplifyAuth";

export default function CognitoLogin() {
  const [mode, setMode] = useState("login");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const { appId } = config();

  const handleLogin = async () => {
    try {
      await login(username, password);

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

      window.location.href = "/";
    } catch (e) {
      console.error("Login error:", e);
      alert(e.message || "Login failed");
    }
  };

  const handleSignup = async () => {
    try {
      await signup(username, password, email);
      setMode("confirm");
    } catch (e) {
      alert(e.message || "Signup failed");
    }
  };

  const handleConfirm = async () => {
    try {
      await confirmSignup(username, code);
      alert("Account confirmed! You can now log in.");
      setMode("login");
    } catch (e) {
      alert(e.message || "Confirmation failed");
    }
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        {mode === "login" && "Login"}
        {mode === "signup" && "Sign Up"}
        {mode === "confirm" && "Confirm Account"}
      </Typography>

      <Stack spacing={2}>
        <TextField
          label="Username or Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {mode === "signup" && (
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        )}

        {mode !== "confirm" && (
          <TextField
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        )}

        {mode === "confirm" && (
          <TextField
            label="Confirmation Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        )}

        {mode === "login" && (
          <>
            <Button variant="contained" onClick={handleLogin}>
              Login
            </Button>
            <Button onClick={() => setMode("signup")}>Create an account</Button>
          </>
        )}

        {mode === "signup" && (
          <>
            <Button variant="contained" onClick={handleSignup}>
              Sign Up
            </Button>
            <Button onClick={() => setMode("login")}>Back to login</Button>
          </>
        )}

        {mode === "confirm" && (
          <Button variant="contained" onClick={handleConfirm}>
            Confirm
          </Button>
        )}
      </Stack>
    </>
  );
}
