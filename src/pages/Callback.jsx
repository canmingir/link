import { useEffect, useRef } from "react";

import Page from "../layouts/Page";
import React from "react";
import config from "../config/config";
import oauth from "../http/oauth";
import qs from "qs";
import { storage } from "@nucleoidjs/webstorage";
import { useContext } from "../ContextProvider/ContextProvider";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Callback() {
  const { project: appConfig, name, appId } = config();
  const projectBar = config().template?.projectBar;

  const { google, github, linkedin } = appConfig;
  const [, dispatch] = useContext();
  const location = useLocation();
  const navigate = useNavigate();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) {
      return;
    }

    const parsedQuery = qs.parse(location.search, { ignoreQueryPrefix: true });
    const { code, error, error_description, state } = parsedQuery;

    let provider;
    let stateData = {};

    if (state) {
      stateData = JSON.parse(decodeURIComponent(state));
      provider = stateData.provider;
    }

    if (error) {
      console.error("OAuth error:", error, error_description);
      navigate(
        "/login?error=" + encodeURIComponent(error_description || error)
      );
      return;
    }

    if (!code) {
      console.error("No authorization code received");
      navigate(
        "/login?error=" + encodeURIComponent("No authorization code received")
      );
      return;
    }
    hasProcessed.current = true;

    const providerConfigs = {
      github,
      linkedin,
      google,
    };

    const providerConfig = providerConfigs[provider];

    if (!providerConfig) {
      console.error("Could not determine OAuth provider or redirect URI");
      navigate("/login?error=" + encodeURIComponent("Invalid OAuth provider"));
      return;
    }

    const redirectUri = providerConfig.redirectUri;

    let projectId;
    const defaultProjectId = "05708cf7-b9bf-4209-95fe-68d9138d2032";

    if (projectBar) {
      projectId = storage.get("projectId");
    } else {
      projectId = defaultProjectId;
      storage.set("projectId", projectId);
    }

    oauth
      .post("/oauth", {
        ...(projectId && { projectId }),
        appId,
        code,
        redirectUri,
        provider: provider,
        grant_type: "authorization_code",
      })
      .then(({ data }) => {
        const accessToken = data.accessToken;
        const refreshToken = data.refreshToken;
        const userInfo = data.user;

        storage.set(name, "accessToken", accessToken);
        storage.set(name, "refreshToken", refreshToken);
        // TODO - update provider info
        storage.set(name, "provider", provider);

        dispatch({ type: "LOGIN", payload: { user: userInfo } });

        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );

        navigate("/");
      })
      .catch((error) => {
        console.error("OAuth error:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data ||
          error.message ||
          "Authentication failed";

        navigate("/login?error=" + encodeURIComponent(errorMessage));
      });
  }, [location.search, navigate]);

  return <Page title={`${name} - Callback`}></Page>;
}

export default Callback;
