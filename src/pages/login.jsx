import LoginForm from "../widgets/LoginForm/LoginForm";
import Page from "../layouts/Page";
import React from "react";
import { storage } from "@nucleoidjs/webstorage";
import { useConfig } from "../context/ConfigContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
function LoginPage() {
  const formColor = "#a8a9ad";
  const navigate = useNavigate();
  const config = useConfig();

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
  }, [navigate]);

  return (
    <Page title={`Sign in to ${config.name}`}>
      <LoginForm
        icon={config.login.icon}
        name={config.login.name}
        formColor={formColor}
      />
    </Page>
  );
}

export default LoginPage;
