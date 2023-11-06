import { Box } from "@mui/material";
import LoginForm from "../widgets/LoginForm/LoginForm";
import React from "react";
import { storage } from "@nucleoidjs/webstorage";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
function LoginPage() {
  const navigate = useNavigate();

  function token() {
    if (storage.get("refreshToken") && storage.get("accessToken")) {
      return true;
    } else {
      return false;
    }
  }

  useEffect(() => {
    if (token()) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <>
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
        <LoginForm />
      </Box>
    </>
  );
}

export default LoginPage;
