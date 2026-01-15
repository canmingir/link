import { loginWithCognito } from "./cognitoAuth";
import { storage } from "@nucleoidjs/webstorage";
import { useState } from "react";

import { Button, Stack, TextField, Typography } from "@mui/material";

export default function CognitoLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const tokens = await loginWithCognito(username, password);
      console.log("Login successful, tokens:", tokens);
      storage.set("link", "accessToken", tokens.AccessToken);
      storage.set("link", "refreshToken", tokens.RefreshToken);
      window.location.href = "/";
    } catch (e) {
      console.error("Login error:", e);
      alert(`Login failed: ${e.message || e}`);
    }
  };

  return (
    <>
      <Typography variant="h4">Login</Typography>
      <Stack spacing={2}>
        <TextField
          label="Username or Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" onClick={handleLogin}>
          Login
        </Button>
      </Stack>
    </>
  );
}
