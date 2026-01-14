import { Button, Stack, TextField, Typography } from "@mui/material";

import { loginWithCognito } from "./cognitoAuth";
import { useState } from "react";

export default function CognitoLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const tokens = await loginWithCognito(username, password);
      console.log(tokens);
      // save tokens
      localStorage.setItem("link", "accessToken", tokens.AccessToken);
      localStorage.setItem("link", "refreshToken", tokens.RefreshToken);
      window.location.href = "/";
    } catch (e) {
      alert("Login failed");
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
