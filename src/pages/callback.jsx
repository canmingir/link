import Page from "../layouts/Page";
import React from "react";
import config from "../../../../config";
//import config from "../../example/config";
import oauth from "../http/oauth";
import qs from "qs";
import { storage } from "@nucleoidjs/webstorage";
import { useContext } from "../ContextProvider/ContextProvider";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Callback() {
  const [, dispatch] = useContext();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const parsedQuery = qs.parse(location.search, { ignoreQueryPrefix: true });
    const { code } = parsedQuery;

    oauth
      .post("/oauth", {
        code,
        redirectUri:
          config.login?.google.redirectUri || config.login?.github.redirectUri,
        grant_type: "authorization_code",
      })
      .then(({ data }) => {
        const accessToken = data.access_token;
        const refreshToken = data.refresh_token;

        storage.set(config.name, "accessToken", accessToken);
        storage.set(config.name, "refreshToken", refreshToken);
        dispatch({ type: "LOGIN" });
        navigate("/");
      })
      .catch((error) => {
        console.debug(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, navigate]);

  return (
    <Page title={config ? `${config.name} - Callback` : "Callback"}></Page>
  );
}

export default Callback;
