import CognitoLogin from "../widgets/Login/CognitoLogin";
import DemoLogin from "../widgets/Login/DemoLogin";
import LoginForm from "../widgets/LoginForm/LoginForm";
import Page from "../layouts/Page";
import React from "react";
import config from "../config/config";
import { storage } from "@nucleoidjs/webstorage";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
function LoginPage() {
  const { name, template, credentials } = config();
  const formColor = "#a8a9ad";
  const navigate = useNavigate();

  function token() {
    if (
      storage.get("link", "refreshToken") &&
      storage.get("link", "accessToken")
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

  if (credentials?.provider === "COGNITO") {
    return <CognitoLogin />;
  }

  if (credentials?.provider === "DEMO") {
    return (
      <Page title={`Sign in to ${name}`}>
        <DemoLogin />
      </Page>
    );
  }

  return (
    <Page title={`Sign in to ${name}`}>
      <LoginForm icon={template.login.icon} name={name} formColor={formColor} />
    </Page>
  );
}

export default LoginPage;
