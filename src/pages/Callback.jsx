import Page from "../layouts/Page";
import React from "react";
import config from "../config/config";
import oauth from "../http/oauth";
import qs from "qs";
import { storage } from "@nucleoidjs/webstorage";
import { useContext } from "../ContextProvider/ContextProvider";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Callback() {
  const { project: appConfig, name, appId } = config();
  const projectBar = config().template?.projectBar;

  const { google, github } = appConfig;
  const [, dispatch] = useContext();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const parsedQuery = qs.parse(location.search, { ignoreQueryPrefix: true });
    const { code } = parsedQuery;

    let redirectUri;
    if (google) {
      redirectUri = google.redirectUri;
    } else if (github) {
      redirectUri = github.redirectUri;
    }

    const projectId = projectBar
      ? storage.get("projectId")
      : "05708cf7-b9bf-4209-95fe-68d9138d2032";

    if (projectBar) {
      storage.set("projectId", "05708cf7-b9bf-4209-95fe-68d9138d2032");
    }

    oauth
      .post("/oauth", {
        ...(projectId && { projectId }),
        appId,
        code,
        redirectUri,
        grant_type: "authorization_code",
      })
      .then(({ data }) => {
        const accessToken = data.accessToken;
        const refreshToken = data.refreshToken;

        storage.set(name, "accessToken", accessToken);
        storage.set(name, "refreshToken", refreshToken);
        dispatch({ type: "LOGIN" });
        navigate("/");
      })
      .catch((error) => {
        console.debug(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, navigate]);

  return <Page title={`${name} - Callback`}></Page>;
}

export default Callback;
