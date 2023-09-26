import { Box } from "@mui/material";
import LoginForm from "../widgets/LoginForm/LoginForm";
import Page from "../layouts/Page";
import React from "react";
import config from "../../config";
import { storage } from "@nucleoidjs/webstorage";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const formColor = "#a8a9ad";
  const navigate = useNavigate();

  function token() {
    if (
      storage.get("dashboard", "refreshToken") &&
      storage.get("dashboard", "accessToken")
    ) {
      return true;
    } else {
      return false;
    }
  }

  useEffect(() => {
    if (token()) {
      navigate("/teams");
    }
  }, [navigate]);

  return (
    <Page title={`Sign in to ${config.name}`}>
      <video
        src={
          "https://cdn.nucleoid.com/media/ab42486e50c5754623ace7dd2002479a.mp4"
        }
        autoPlay
        loop
        muted
        style={{
          transform: "scaleX(-1) scaleY(-1)",
          height: "100%",
          width: "100%",
          objectFit: "cover",
          position: "fixed",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <LoginForm
          icon={config.login.icon}
          name={config.login.name}
          formColor={formColor}
        />
      </Box>
    </Page>
  );
}

export default LoginPage;
