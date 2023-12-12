import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { storage } from "@nucleoidjs/webstorage";
import { useConfig } from "../../context/ConfigContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ----------------------------------------------------------------------

export default function Auth0LoginView() {
  const config = useConfig();
  const handleOAuthLogin = ({ authUrl, clientId, redirectUri, scope }) => {
    window.location.href = `${authUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
  };
  const navigate = useNavigate();

  function token() {
    if (
      storage.get(config.name, "refreshToken") &&
      storage.get(config.name, "accessToken")
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
    <>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Sign in to {config.name}
      </Typography>
      <Divider />
      <Stack spacing={2}>
        <Button
          fullWidth
          color="primary"
          size="large"
          variant="contained"
          onClick={() => handleOAuthLogin({ ...config.login.github })}
        >
          Login with Github
        </Button>
      </Stack>
    </>
  );
}
