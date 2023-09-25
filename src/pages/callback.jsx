import Page from "../layouts/Page";
import oauth from "../http/oauth";
import qs from "qs";
import { storage } from "@nucleoidjs/webstorage";
import { useConfig } from "../context/ConfigContext";
import { useContext } from "../ContextProvider/ContextProvider";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Callback() {
  const [, dispatch] = useContext();
  const location = useLocation();
  const navigate = useNavigate();
  const config = useConfig();

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
