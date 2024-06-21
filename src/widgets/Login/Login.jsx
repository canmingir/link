import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import config from "../../config/config";
import { storage } from "@nucleoidjs/webstorage";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ----------------------------------------------------------------------

export default function Auth0LoginView() {
  const { name, oauth } = config();

  const handleOAuthLogin = ({ authUrl, clientId, redirectUri, scope }) => {
    window.location.href = `${authUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
  };
  const navigate = useNavigate();

  function token() {
    if (storage.get(name, "refreshToken") && storage.get(name, "accessToken")) {
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
        Sign in to {name}
      </Typography>
      <Divider />
      <Stack spacing={2}>
        <Button
          fullWidth={true}
          color="primary"
          size="large"
          variant="contained"
          onClick={() => handleOAuthLogin({ ...oauth.github })}
        >
          Login with Github
        </Button>
      </Stack>
    </>
  );
}
