import Page from "../layouts/Page";
import config from "../../config";
import oauth from "../http/oauth";
import qs from "qs";
import { storage } from "@nucleoidjs/webstorage";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Callback() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const parsedQuery = qs.parse(location.search, { ignoreQueryPrefix: true });
    const { code } = parsedQuery;

    oauth
      .post("/oauth", {
        code,
      })
      .then(({ data }) => {
        const accessToken = data.access_token;
        const refreshToken = data.refresh_token;

        storage.set("dashboard", "accessToken", accessToken);
        storage.set("dashboard", "refreshToken", refreshToken);
        navigate("/teams");
      })
      .catch((error) => {
        console.debug(error);
      });
  }, [location.search, navigate]);

  return (
    <Page title={config ? `${config.name} - Callback` : "Callback"}></Page>
  );
}

export default Callback;
